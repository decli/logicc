"""Pre-record every line and pack one voice bank per UI language:
voice-<bank>.bin (concatenated MP3s) + voice-<bank>.json (hash -> offset,len).

Chinese speech: ZipVoice (k2-fsa, flow matching, zero-shot) through sherpa-onnx,
  with pinyin fixed in advance by zhfront.py (polyphones checked by hand) and
  voice prompts made from Kokoro's synthetic speakers (no real person is cloned).
English speech: Kokoro (sherpa-onnx), already natural in English.
Every Chinese take is read back by an ASR model; a bad take is re-recorded."""
import json, sys, os, hashlib, time, re
import numpy as np, lameenc, soundfile as sf, sherpa_onnx
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from common import kokoro, asr_zh, transcribe, cer, M, edit
from pypinyin import lazy_pinyin, Style
from zhfront import Lexicon, normalize
from worldfx import world_transform

ZD = f'{M}/sherpa-onnx-zipvoice-distill-zh-en-emilia'; ZI = f'{M}/sherpa-onnx-zipvoice-distill-int8-zh-en-emilia'
PROMPTS = {  # Chinese voices: Kokoro speaker -> prompt for ZipVoice
    'n':  dict(sid=30, expand=1.5, speed=0.84, text='小朋友，你好呀。今天，我们一起来讲一个故事吧。'),
    'c0': dict(sid=40, expand=1.0, speed=0.95, text='嘿嘿，我们一起玩吧，好不好呀？我最喜欢你啦！'),
    'c1': dict(sid=11, expand=1.0, speed=0.95, text='嘿嘿，我们一起玩吧，好不好呀？我最喜欢你啦！'),
}
EN = {'n': (3, 0.85), 'c0': (9, 0.92), 'c1': (20, 0.92)}   # Kokoro v1.0 speaker, speed
STEPS = {'n': 6, 'c0': 4, 'c1': 4}   # flow-matching steps: the narrator gets a little more polish
GUIDE, KBPS, SR = 3.0, 32, 24000
ZH_RE = re.compile(r'[一-鿿]')
# very short lines (a word, 你好！) are read inside a carrier sentence and cut out after its pause:
# on their own, a zero-shot model has too little text to time them well
CARRIER, SHORT = '我们一起说，', 3

def py_err(ref, hyp):
    """syllable error rate on toneless pinyin, so homophones (雨/与, 画/话) are not counted as mistakes"""
    r = lazy_pinyin(''.join(ZH_RE.findall(ref))); h = lazy_pinyin(''.join(ZH_RE.findall(hyp)))
    return edit(r, h) / max(1, len(r))

def cut_after_pause(x, sr=24000, hop=240):
    n = len(x) // hop
    if n < 10: return None
    db = 20 * np.log10(np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)); v = db > db.max() - 35
    idx = np.where(v)[0]; a, b = idx[0], idx[-1]; gaps, run = [], 0
    for k in range(a, b + 1):
        if not v[k]: run += 1
        else:
            if run >= 6: gaps.append(k)
            run = 0
    if not gaps: return None
    return x[max(0, gaps[-1] * hop - int(0.03 * sr)):]

def fnv(s):
    h = 0x811c9dc5
    b = s.encode('utf-16-le')
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 0x01000193) & 0xffffffff
    digs = '0123456789abcdefghijklmnopqrstuvwxyz'; out = ''
    while True:
        h, r = divmod(h, 36); out = digs[r] + out
        if h == 0: return out

ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'x x twenty thirty forty fifty sixty seventy eighty ninety'.split()
def words(n):
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ('-' + ONES[n % 10] if n % 10 else '')
    return str(n)
def en_text(t):
    t = re.sub(r'\d+', lambda m: words(int(m.group())), t).replace('~', '!').replace('…', '...')
    if t and t[-1] not in '.!?': t += '.'
    return t

def post(x):
    x = np.asarray(x, dtype=np.float32)
    env = np.abs(x); thr = max(0.008, env.max() * 0.02)
    idx = np.where(env > thr)[0]
    if len(idx): x = x[max(0, idx[0] - int(SR * 0.03)): idx[-1] + int(SR * 0.09)]
    rms = np.sqrt(np.mean(x ** 2) + 1e-9); g = 0.1 / rms
    g = min(g, 0.93 / (np.abs(x).max() + 1e-9))
    x = x * g
    fade = int(SR * 0.008); x[:fade] *= np.linspace(0, 1, fade); x[-fade:] *= np.linspace(1, 0, fade)
    return np.concatenate([np.zeros(int(SR * 0.02), np.float32), x, np.zeros(int(SR * 0.06), np.float32)])

def mp3(x):
    enc = lameenc.Encoder(); enc.set_bit_rate(KBPS); enc.set_in_sample_rate(SR); enc.set_channels(1); enc.set_quality(2)
    return enc.encode((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()) + enc.flush()

class ZhVoices:
    def __init__(self, texts):
        lx = Lexicon(f'{ZI}/tokens.txt')
        for p in PROMPTS.values(): lx.add_text(p['text'])
        self.norm = {t: lx.add_text(t) for t in texts}
        for t, nt in self.norm.items():
            if self.short(nt): lx.add_text(CARRIER + nt)
        if lx.conflicts: print('lexicon conflicts:', lx.conflicts)
        self.lexfile = os.path.join(HERE, 'zh-lexicon.txt'); lx.write(self.lexfile); self.lx = lx
        self.tts = None; self.prompts = {}; self.asr = None
    @staticmethod
    def short(nt): return len(ZH_RE.findall(nt)) <= SHORT
    def tokens(self, text):   # what decides the sound: the pinyin we feed in
        from zhfront import clauses, to_pinyin
        return ' '.join(' '.join(to_pinyin(c)[0]) for c in clauses(self.norm[text])) + '|' + self.norm[text]
    def load(self):
        if self.tts: return
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            zipvoice=sherpa_onnx.OfflineTtsZipvoiceModelConfig(tokens=f'{ZI}/tokens.txt', encoder=f'{ZD}/text_encoder.onnx', decoder=f'{ZD}/fm_decoder.onnx',
                vocoder=f'{ZD}/vocos_24khz.onnx', data_dir=f'{ZI}/espeak-ng-data', lexicon=f'{self.lexfile},{ZI}/lexicon.txt', guidance_scale=GUIDE),
            num_threads=2, provider='cpu'), max_num_sentences=1)
        self.tts = sherpa_onnx.OfflineTts(cfg); self.asr = asr_zh()
        k = kokoro('v1_1'); pd = os.path.join(HERE, 'prompts'); os.makedirs(pd, exist_ok=True)
        for role, p in PROMPTS.items():
            g = k.generate(p['text'], sid=p['sid'], speed=1.0); x = np.array(g.samples, dtype=np.float32)
            if p['expand'] != 1.0: x = world_transform(x, g.sample_rate, expand=p['expand'])
            x = np.concatenate([x, np.zeros(int(0.2 * g.sample_rate), np.float32)])
            sf.write(os.path.join(pd, f'zh-{role}.wav'), x, g.sample_rate); self.prompts[role] = (x.tolist(), g.sample_rate)
    def say(self, text, role):
        self.load(); p = PROMPTS[role]; t = self.norm[text]
        short = self.short(t); sp = p['speed'] * (0.9 if len(ZH_RE.findall(t)) <= 5 and not short else 1.0)
        best = None
        for attempt in range(6):
            if short and attempt >= 4 and best is None: short = False   # no clean pause to cut at: read it on its own
            g = self.tts.generate(CARRIER + t if short else t, p['text'], self.prompts[role][0], self.prompts[role][1], sp * (1, 0.92, 1.06, 0.97, 0.85, 0.8)[attempt], STEPS[role])
            x = np.array(g.samples, dtype=np.float32)
            if short:
                y = cut_after_pause(x)
                if y is None: continue
                x = y
            c = py_err(t, transcribe(self.asr, x, g.sample_rate))
            if best is None or c < best[0]: best = (c, x)
            if c <= 0.1: break
        if best is None: raise RuntimeError('no usable take for ' + text)
        return best[1], best[0]

def key_of(*parts): return hashlib.sha1('|'.join(map(str, parts)).encode()).hexdigest()[:20]

def main(banks):
    lines = json.load(open(os.path.join(HERE, 'lines.json')))
    cache = os.path.join(HERE, 'cache'); os.makedirs(cache, exist_ok=True)
    zh_texts = sorted({l['text'] for l in lines if ZH_RE.search(l['text'])})
    zv = ZhVoices(zh_texts); kk = None; report = []
    todo = [l for l in lines if l['lang'] in banks]
    # synthesize each distinct (speech, role, text) once; banks share the files
    uniq = {}
    for l in todo: uniq.setdefault((l['role'], l['text']), l)
    t0 = time.time(); done = 0; secs = 0.0
    order = sorted(uniq, key=lambda rt: (0 if rt[0] == 'n' else 1, rt[1]))
    for role, text in order:
        if ZH_RE.search(text):
            key = key_of('zv', STEPS[role], GUIDE, json.dumps(PROMPTS[role], sort_keys=True), KBPS, zv.tokens(text), *(['carrier', CARRIER] if zv.short(zv.norm[text]) else []))
        else:
            sid, spd = EN[role]; key = key_of('kokoro-v1_0', sid, spd, KBPS, en_text(text))
        f = os.path.join(cache, key + '.mp3')
        if not os.path.exists(f):
            if ZH_RE.search(text):
                x, c = zv.say(text, role); report.append((role, text, round(c, 3)))
            else:
                if kk is None: kk = kokoro('v1_0')
                g = kk.generate(en_text(text), sid=sid, speed=spd); x = np.array(g.samples, dtype=np.float32)
            x = post(x); open(f, 'wb').write(mp3(x)); secs += len(x) / SR
        uniq[(role, text)]['file'] = f
        done += 1
        if done % 20 == 0: print(f'{done}/{len(order)}  new audio {secs:.0f}s  elapsed {time.time() - t0:.0f}s', flush=True)
    if report: json.dump(report, open(os.path.join(HERE, 'zh-report.json'), 'w'), ensure_ascii=False, indent=0)
    json.dump({f'{r}|{t}': os.path.basename(v['file']) for (r, t), v in uniq.items()}, open(os.path.join(cache, 'index.json'), 'w'), ensure_ascii=False)
    bad = [r for r in report if r[2] > 0.12]
    print(f'zh takes: {len(report)}, still imperfect after retries: {len(bad)}', bad[:30])
    od = os.path.join(HERE, 'out'); os.makedirs(od, exist_ok=True)
    for bank in banks:
        blob, index = bytearray(), {}
        for l in todo:
            if l['lang'] != bank: continue
            h = fnv(l['role'] + '|' + l['text'])
            if h in index: continue
            b = open(uniq[(l['role'], l['text'])]['file'], 'rb').read()
            index[h] = [len(blob), len(b)]; blob += b
        open(os.path.join(od, f'voice-{bank}.bin'), 'wb').write(blob)
        json.dump({'v': 2, 'u': index}, open(os.path.join(od, f'voice-{bank}.json'), 'w'), separators=(',', ':'))
        print(f'{bank}: {len(index)} lines, bank {len(blob) / 1e6:.2f} MB', flush=True)
    print(f'done in {time.time() - t0:.0f}s')

if __name__ == '__main__':
    main(sys.argv[1:] or ['zh', 'en'])
