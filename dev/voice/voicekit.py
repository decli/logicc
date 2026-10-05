"""Shared voice toolkit for the whole site: Microsoft neural voices through edge-tts,
polyphone fixes, loudness/silence post-processing, bilingual runs, and the voice-bank format.

A bank is two files: <name>.bin (MP3 clips back to back) and <name>.json {"v":2,"u":{hash: [offset, length]}},
hash = FNV-1a over the UTF-16 code units of "<role>|<text>", the same function the pages use."""
import asyncio, hashlib, json, os, re, subprocess, sys, time
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import zhpoly

# who speaks: (bank-independent) role + language of the words -> voice, pace, pitch.
# Pace is measured, not guessed: narrators ≈ 3.5 Chinese syllables/s and ≈ 150 English words/min,
# which a six-year-old can follow; the two little creatures are a touch livelier.
# English creature B was Maisie (British child voice) at first; speech recognition misheard her twice as often
# as the others (21% of lines vs 10%), so it is Emma with the pitch raised a little.
VOICES = {
    ('n', 'zh'):  ('zh-CN-XiaoxiaoNeural', '-20%', '+0Hz'),
    ('c0', 'zh'): ('zh-CN-XiaoyiNeural', '-10%', '+0Hz'),
    ('c1', 'zh'): ('zh-CN-YunxiaNeural', '-10%', '+0Hz'),
    ('n', 'en'):  ('en-US-AvaMultilingualNeural', '-25%', '+0Hz'),
    ('c0', 'en'): ('en-US-AnaNeural', '-20%', '+0Hz'),
    ('c1', 'en'): ('en-US-EmmaMultilingualNeural', '-20%', '+15Hz'),
}
POLY_VOICE = VOICES[('n', 'zh')][:2]   # all zh-CN voices share one text front end, so one voice is enough to test readings
SR, KBPS = 24000, 40
CACHE = os.path.join(HERE, 'cache')
ZH = re.compile(r'[一-鿿]')

def lang_of(text): return 'zh' if ZH.search(text) else 'en'

def write_atomic(path, data, mode='wb'):
    """a run that is stopped half-way must never leave a truncated file that later runs trust"""
    tmp = f'{path}.{os.getpid()}.tmp'
    with open(tmp, mode) as f: f.write(data)
    os.replace(tmp, path)

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

# ---------- edge-tts with a disk cache ----------
_sem = None
async def tts(text, voice, rate, pitch='+0Hz'):
    """-> (mp3 bytes, [(word, start, end)]); cached on disk, so re-runs only synthesize new text"""
    global _sem
    import edge_tts
    if _sem is None: _sem = asyncio.Semaphore(8)
    os.makedirs(CACHE, exist_ok=True)
    key = hashlib.sha1('|'.join([voice, rate, pitch, text]).encode()).hexdigest()[:24]
    fa, fj = os.path.join(CACHE, key + '.mp3'), os.path.join(CACHE, key + '.json')
    if os.path.exists(fa) and os.path.exists(fj) and os.path.getsize(fa) > 0:
        return open(fa, 'rb').read(), json.load(open(fj))
    async with _sem:
        for attempt in range(6):
            try:
                audio, words = bytearray(), []
                c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary='WordBoundary')
                async for ch in c.stream():
                    if ch['type'] == 'audio': audio += ch['data']
                    elif ch['type'] == 'WordBoundary':
                        words.append((ch['text'], ch['offset'] / 1e7, (ch['offset'] + ch['duration']) / 1e7))
                if not audio: raise RuntimeError('empty')
                break
            except Exception as e:
                if attempt == 5: raise RuntimeError(f'edge-tts failed for {text!r}: {e}')
                await asyncio.sleep(1.5 * (attempt + 1))
    write_atomic(fj, json.dumps(words, ensure_ascii=False), 'w'); write_atomic(fa, bytes(audio))
    return bytes(audio), words

def decode(mp3, sr=SR):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', '-', '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], input=mp3)
    return np.frombuffer(raw, np.float32).copy()

def poly_checker():
    voice, rate = POLY_VOICE
    async def synth16k(text):
        mp3, words = await tts(text, voice, rate)
        return decode(mp3, zhpoly.SR), words
    return zhpoly.PolyChecker(synth16k, os.path.join(HERE, 'poly-cache.json'))

# ---------- audio ----------
def trim(x):
    env = np.abs(x); thr = max(0.006, env.max() * 0.02)
    idx = np.where(env > thr)[0]
    if not len(idx): return x
    return x[max(0, idx[0] - int(SR * 0.02)): idx[-1] + int(SR * 0.08)]

def level(x, rms_target=0.1):
    """same loudness for every voice: scale the voiced part to a target RMS, keep 1 dB of headroom"""
    fr = int(SR * 0.02); n = len(x) // fr
    if n == 0: return x
    e = np.sqrt((x[:n * fr].reshape(n, fr) ** 2).mean(1))
    voiced = e[e > e.max() * 0.15]
    g = rms_target / (np.sqrt((voiced ** 2).mean()) + 1e-9)
    g = min(g, 0.89 / (np.abs(x).max() + 1e-9))
    return x * g

def fade(x, ms=8):
    n = min(len(x) // 2, int(SR * ms / 1000))
    if n: x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x

def gap_before(seg):
    """a short breath between a word and its translation, a longer one before a full sentence"""
    long = len(ZH.findall(seg)) > 4 if lang_of(seg) == 'zh' else len(seg.split()) > 3
    return 0.5 if long else 0.34

def mp3(x):
    import lameenc
    enc = lameenc.Encoder(); enc.set_bit_rate(KBPS); enc.set_in_sample_rate(SR); enc.set_channels(1); enc.set_quality(2)
    return enc.encode((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()) + enc.flush()

def en_clean(t):
    t = t.replace('~', '!').replace('…', '...')
    return t if not t or t[-1] in '.!?' else t + '.'

async def prepare(role, segs, checker):
    """what each part will be: [(voice, rate, pitch, text we send, text it stands for)], plus polyphone notes"""
    parts, notes = [], []
    for seg in segs:
        lang = lang_of(seg)
        voice, rate, pitch = VOICES[(role, lang)]
        if lang == 'zh':
            send, found = await checker.check(zhpoly.zh_clean(seg))
            notes += [dict(f, text=seg) for f in found if f['verdict'] != 'ok']
        else:
            send = en_clean(seg)
        parts.append((voice, rate, pitch, send, seg))
    return parts, notes

async def assemble(parts):
    """one clip: each part levelled, a breath between parts (said in a row by one role)"""
    out = [np.zeros(int(SR * 0.03), np.float32)]
    for k, (voice, rate, pitch, send, seg) in enumerate(parts):
        mp, _ = await tts(send, voice, rate, pitch)
        if k: out.append(np.zeros(int(SR * gap_before(seg)), np.float32))
        out.append(fade(level(trim(decode(mp)))))
    out.append(np.zeros(int(SR * 0.08), np.float32))
    return np.concatenate(out)

async def build_bank(items, out_dir, name, label):
    """items: [{'role': 'n', 'key': looked-up text, 'segs': [text, ...]}] -> <out_dir>/<name>.bin|json"""
    checker = poly_checker()
    blob, index, notes, t0, secs = bytearray(), {}, [], time.time(), 0.0
    clips = os.path.join(CACHE, 'clips'); os.makedirs(clips, exist_ok=True)
    async def one(it):
        parts, nt = await prepare(it['role'], it['segs'], checker)
        ck = hashlib.sha1(json.dumps([[p[:4] for p in parts], [gap_before(p[4]) for p in parts], KBPS, SR], ensure_ascii=False).encode()).hexdigest()[:24]
        f = os.path.join(clips, ck + '.mp3')
        if not os.path.exists(f) or os.path.getsize(f) == 0: write_atomic(f, mp3(await assemble(parts)))
        return open(f, 'rb').read(), nt
    done = 0
    for i in range(0, len(items), 24):
        batch = items[i:i + 24]
        res = await asyncio.gather(*[one(it) for it in batch])
        for it, (b, nt) in zip(batch, res):
            h = fnv(it['role'] + '|' + it['key'])
            if h in index: continue
            index[h] = [len(blob), len(b)]; blob += b; notes += nt
        done += len(batch); checker.save()
        print(f'  {label}: {done}/{len(items)}  {time.time() - t0:.0f}s', flush=True)
    os.makedirs(out_dir, exist_ok=True)
    open(os.path.join(out_dir, name + '.bin'), 'wb').write(blob)
    json.dump({'v': 2, 'u': index}, open(os.path.join(out_dir, name + '.json'), 'w'), separators=(',', ':'))
    print(f'{label}: {len(index)} clips, {len(blob) / 1e6:.2f} MB -> {os.path.relpath(os.path.join(out_dir, name), os.getcwd())}.bin|json')
    return notes

def report_notes(notes, path):
    seen, rows = set(), []
    for n in notes:
        k = (n['text'], n['pos'])
        if k in seen: continue
        seen.add(k); rows.append(n)
    json.dump(rows, open(path, 'w'), ensure_ascii=False, indent=0)
    fixed = [r for r in rows if r['verdict'] == 'wrong']
    print(f'polyphones: {len(fixed)} misread by the voice and fixed with a homophone; '
          f'{sum(r["verdict"] == "unsure" for r in rows)} unsure; {sum(r["verdict"] == "wrong-nofix" for r in rows)} wrong with no fix  -> {os.path.relpath(path, os.getcwd())}')
    for r in fixed: print(f'   fixed  {r["text"]}  [{r["char"]}] → {r["want"]} (sent {r["fix"]})')
    for r in rows:
        if r['verdict'] in ('unsure', 'wrong-nofix'): print(f'   {r["verdict"]:11s} {r["text"]}  [{r["char"]}] want {r["want"]}  s={r["s"]}')
