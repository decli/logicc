"""Pre-record every line with Kokoro (sherpa-onnx) and pack them into one
voice bank per language: voice-<lang>.bin (concatenated MP3s) + voice-<lang>.json."""
import json, sys, os, hashlib, time, io, re
import numpy as np, lameenc
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
VOICES = {  # lang -> role -> (model, speaker id, speed)
    'zh': {'n': ('v1_1', 12, 1.0), 'c0': ('v1_1', 44, 1.0), 'c1': ('v1_1', 59, 1.02)},
    'en': {'n': ('v1_0', 3, 0.9), 'c0': ('v1_0', 2, 0.98), 'c1': ('v1_0', 18, 0.98)},
}
OVERRIDES = json.load(open(os.path.join(HERE, 'overrides.json'))) if os.path.exists(os.path.join(HERE, 'overrides.json')) else {}
KBPS, SR = 32, 24000

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

def tts_text(text, lang):
    """What the model actually reads. The page shows `text`; this only fixes how it sounds."""
    t = OVERRIDES.get(text, text)
    if lang == 'zh':
        for a, b in (('「', ''), ('」', ''), ('嗯', '恩')): t = t.replace(a, b)
        if t and t[-1] not in '。！？…～!?.~': t += '。'
    else:
        t = re.sub(r'\d+', lambda m: words(int(m.group())), t)
        if t and t[-1] not in '.!?…~': t += '.'
    return t

ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'x x twenty thirty forty fifty sixty seventy eighty ninety'.split()
def words(n):
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ('-' + ONES[n % 10] if n % 10 else '')
    return str(n)

def post(x):
    x = np.asarray(x, dtype=np.float32)
    env = np.abs(x); thr = max(0.008, env.max() * 0.02)
    idx = np.where(env > thr)[0]
    if len(idx): x = x[max(0, idx[0] - int(SR * 0.03)): idx[-1] + int(SR * 0.09)]
    rms = np.sqrt(np.mean(x ** 2) + 1e-9); g = 0.1 / rms           # ≈ -20 dBFS
    g = min(g, 0.93 / (np.abs(x).max() + 1e-9))
    x = x * g
    fade = int(SR * 0.008); x[:fade] *= np.linspace(0, 1, fade); x[-fade:] *= np.linspace(1, 0, fade)
    return np.concatenate([np.zeros(int(SR * 0.02), np.float32), x, np.zeros(int(SR * 0.06), np.float32)])

def mp3(x):
    enc = lameenc.Encoder(); enc.set_bit_rate(KBPS); enc.set_in_sample_rate(SR); enc.set_channels(1); enc.set_quality(2)
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()
    return enc.encode(pcm) + enc.flush()

def main(langs):
    lines = json.load(open(os.path.join(HERE, 'lines.json')))
    cache = os.path.join(HERE, 'cache'); os.makedirs(cache, exist_ok=True)
    models = {}
    for lang in langs:
        todo = [l for l in lines if l['lang'] == lang]
        t0 = time.time(); done = 0; secs = 0.0
        for l in todo:
            ver, sid, speed = VOICES[lang][l['role']]
            tts = tts_text(l['text'], lang)
            key = hashlib.sha1(f'{ver}|{sid}|{speed}|{KBPS}|{tts}'.encode()).hexdigest()[:20]
            f = os.path.join(cache, key + '.mp3')
            if not os.path.exists(f):
                if ver not in models: models[ver] = kokoro(ver)
                g = models[ver].generate(tts, sid=sid, speed=speed)
                x = post(g.samples)
                open(f, 'wb').write(mp3(x))
                np.save(os.path.join(cache, key + '.npy'), (x * 32767).astype(np.int16))
                secs += len(x) / SR
            l['file'] = f
            done += 1
            if done % 25 == 0: print(f'{lang} {done}/{len(todo)}  new audio {secs:.0f}s  elapsed {time.time() - t0:.0f}s', flush=True)
        # pack
        blob, index = bytearray(), {}
        for l in todo:
            b = open(l['file'], 'rb').read()
            index[fnv(l['role'] + '|' + l['text'])] = [len(blob), len(b)]
            blob += b
        od = os.path.join(HERE, 'out'); os.makedirs(od, exist_ok=True)
        open(os.path.join(od, f'voice-{lang}.bin'), 'wb').write(blob)
        json.dump({'v': 1, 'u': index}, open(os.path.join(od, f'voice-{lang}.json'), 'w'), separators=(',', ':'))
        print(f'{lang}: {len(todo)} lines, bank {len(blob) / 1e6:.2f} MB, {time.time() - t0:.0f}s', flush=True)

if __name__ == '__main__':
    main(sys.argv[1:] or ['zh', 'en'])
