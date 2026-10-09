"""古诗花园's voice bank (voice-shi.bin|json at the site root).

A poem is recited in ONE take, so the voice carries the melody across lines the way a person reading it aloud
does (a comma line stays up, a full stop comes down). The take is then cut at the pauses between lines, and
the lines are put back together with pauses set by hand: a breath after a comma, a longer one after a full stop,
so the rhythm is the same every time and never rushed. Each line is also kept as its own clip, cut from that
same take, which is what the games play one by one.

For every line the page also gets the moment each character starts (for lighting the characters as they are
read, and for the drum game). The service only reports where whole phrases start, so inside a phrase the
syllables are found from the loudness: Mandarin syllables are separated by small dips.

The other clips (narrator, the monkey, the half lines said before a blank) go through voicekit like every
other line on the site. Index format: {"v": 2, "u": {hash: [offset, length]}, "m": {hash: meta}}"""
import asyncio, hashlib, json, os, time
import numpy as np
import voicekit as vk
import zhpoly

GAP_TITLE, GAP_BY = 0.5, 0.9                       # seconds after the title and after the author
GAP = {'，': 0.55, '、': 0.4, '。': 0.9, '？': 0.9, '！': 0.9, '；': 0.7}
PUNCT = set('，。！？、；：')
POEM_ROLES = ('r', 'R', 'm')
HOP = 0.01

def env_of(x):
    """loudness every 10 ms (30 ms window), lightly smoothed"""
    hop, win = int(vk.SR * HOP), int(vk.SR * 0.03)
    n = max(1, len(x) // hop)
    p = np.pad(x, (win // 2, win))
    e = np.array([np.sqrt(np.mean(p[i * hop:i * hop + win] ** 2)) for i in range(n)])
    return np.convolve(e, np.ones(3) / 3, mode='same')

def islands(e, thr, gap=8):
    """runs of frames above thr, merging runs closer than `gap` frames"""
    on = e > thr; out = []; i = 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and on[j]: j += 1
            if out and i - out[-1][1] < gap: out[-1][1] = j
            else: out.append([i, j])
            i = j
        else: i += 1
    return out

def onsets(x, n):
    """start time (s) of each of the n syllables in a clip of one line"""
    e = env_of(x); thr = e.max() * 0.06
    isl = islands(e, thr)
    if not isl: return [round(k * len(x) / vk.SR / n, 3) for k in range(n)]
    a, b = isl[0][0], isl[-1][1]
    if len(isl) == n: return [round(s * HOP, 3) for s, _ in isl]          # 鹅，鹅，鹅 — each one stands alone
    step = (b - a) / n; out = [a]
    for k in range(1, n):
        c = a + step * k
        lo = max(int(c - step * 0.42), out[-1] + max(3, int(step * 0.35)))
        hi = max(lo + 1, int(c + step * 0.42))
        seg = e[lo:hi]
        out.append(lo + int(np.argmin(seg)) if len(seg) else int(c))
    return [round(f * HOP, 3) for f in out]

def quietest(x, t0, t1):
    """the quietest moment between t0 and t1 (s): where to cut between two lines"""
    e = env_of(x); a, b = int(t0 / HOP), max(int(t0 / HOP) + 1, int(t1 / HOP))
    seg = e[a:b]
    return (a + int(np.argmin(seg))) * HOP if len(seg) else (t0 + t1) / 2

def silence(s): return np.zeros(int(vk.SR * s), np.float32)

async def fixed(text, checker):
    """text to send with polyphones fixed. Unlike the rest of the site, a reading the checker is unsure about is
    fixed too: the stand-in has only the reading we want, so sending it can never make things worse, and a poem
    is the one place a wrong tone must not slip through"""
    clean = zhpoly.zh_clean(text)
    send, found = await checker.check(clean)
    send = list(send)
    _, stand = zhpoly.tables()
    for f in found:
        if f['verdict'] not in ('wrong', 'unsure') or not f['fix']: continue
        # the checker picks whichever stand-in sounded closest, which can be a rare character (傗 for chù);
        # the most common one with that reading is the safer thing to hand the voice
        f['fix'] = next((c for c in stand.get(f['want'], []) if c != clean[f['pos']]), f['fix'])
        send[f['pos']] = f['fix']
        if f['verdict'] == 'unsure': f['verdict'] = 'unsure-fixed'
    return ''.join(send), [dict(f, text=text) for f in found if f['verdict'] != 'ok']

async def say(role, text, checker):
    """one take of `text` by `role` with polyphones fixed -> (pcm, word bounds, text sent, notes)"""
    voice, rate, pitch = vk.VOICES[(role, 'zh')]
    send, notes = await fixed(text, checker)
    mp3, words = await vk.tts(send, voice, rate, pitch)
    return vk.decode(mp3), words, send, notes

async def recite(it, checker):
    """-> {key: (pcm, meta)} for one poem in one voice, plus polyphone notes"""
    role, pid, lines = it['role'], it['id'], it['lines']
    body = ''.join(lines)
    x, words, send, notes = await say(role, body, checker)
    # where each line starts and ends in the take, from the phrase bounds the service reports
    owner = []
    for i, l in enumerate(lines): owner += [i] * len(l)
    span = [[None, None] for _ in lines]; at = 0
    for w, t0, t1 in words:
        j = send.find(w, at)
        if j < 0: continue
        at = j + len(w)
        for i in {owner[k] for k in range(j, j + len(w))}:
            if span[i][0] is None or t0 < span[i][0]: span[i][0] = t0
            if span[i][1] is None or t1 > span[i][1]: span[i][1] = t1
    if any(s[0] is None for s in span): raise RuntimeError(f'{pid}/{role}: no word bounds for some line: {span}')
    cuts = [0.0] + [quietest(x, span[i][1], span[i + 1][0]) for i in range(len(lines) - 1)] + [len(x) / vk.SR]
    x = vk.level(x)
    segs = [vk.fade(vk.trim(x[int(cuts[i] * vk.SR):int(cuts[i + 1] * vk.SR)].copy())) for i in range(len(lines))]
    title, _, _, n1 = await say(role, it['title'] + '。', checker)
    by, _, _, n2 = await say(role, it['by'] + '。', checker)
    notes += n1 + n2
    title, by = vk.fade(vk.level(vk.trim(title))), vk.fade(vk.level(vk.trim(by)))
    out, head, tail = {}, 0.03, 0.12
    full, T, L, t = [silence(head), title, silence(GAP_TITLE), by, silence(GAP_BY)], [], [], 0.0
    t = head + (len(title) + len(by)) / vk.SR + GAP_TITLE + GAP_BY
    for i, (l, s) in enumerate(zip(lines, segs)):
        n = sum(1 for c in l if c not in PUNCT)
        on = onsets(s, n)
        out[f'{pid}#{i}'] = (np.concatenate([silence(head), s, silence(tail)]), {'t': [round(head + o, 3) for o in on]})
        L.append(round(t, 3)); T.append([round(t + o, 3) for o in on])
        full.append(s); t += len(s) / vk.SR
        if i < len(lines) - 1:
            g = GAP.get(l[-1], 0.6); full.append(silence(g)); t += g
    full.append(silence(tail))
    out[f'{pid}#full'] = (np.concatenate(full), {'L': L, 'T': T})
    out[f'{pid}#t'] = (np.concatenate([silence(head), title, silence(tail)]), None)
    out[f'{pid}#a'] = (np.concatenate([silence(head), by, silence(tail)]), None)
    dur = [round(len(s) / vk.SR, 2) for s in segs]
    print(f'  {pid}/{role}: lines {dur}s, whole poem {t + tail:.1f}s', flush=True)
    return out, notes

async def build_shi(items, out_dir, name):
    checker = vk.poly_checker()
    blob, index, meta, notes, t0 = bytearray(), {}, {}, [], time.time()
    clips = os.path.join(vk.CACHE, 'clips'); os.makedirs(clips, exist_ok=True)

    def put(role, key, data, m=None):
        h = vk.fnv(role + '|' + key)
        if h in index: return
        index[h] = [len(blob), len(data)]; blob.extend(data)
        if m: meta[h] = m

    async def one(it):
        if it['role'] in POEM_ROLES:   # poem voices: unsure readings get fixed as well (see fixed())
            voice, rate, pitch = vk.VOICES[(it['role'], 'zh')]
            parts, nt = [], []
            for seg in it['segs']:
                send, n = await fixed(seg, checker); parts.append((voice, rate, pitch, send, seg)); nt += n
        else:
            parts, nt = await vk.prepare(it['role'], it['segs'], checker)
        ck = hashlib.sha1(json.dumps([[p[:4] for p in parts], [vk.gap_before(p[4]) for p in parts], vk.KBPS, vk.SR], ensure_ascii=False).encode()).hexdigest()[:24]
        f = os.path.join(clips, ck + '.mp3')
        if not os.path.exists(f) or os.path.getsize(f) == 0: vk.write_atomic(f, vk.mp3(await vk.assemble(parts)))
        return open(f, 'rb').read(), nt

    plain = [it for it in items if not it.get('kind')]
    for i in range(0, len(plain), 24):
        batch = plain[i:i + 24]
        for it, (b, nt) in zip(batch, await asyncio.gather(*[one(it) for it in batch])):
            put(it['role'], it['key'], b); notes += nt
        checker.save()
        print(f'  {name}: {min(i + 24, len(plain))}/{len(plain)} lines  {time.time() - t0:.0f}s', flush=True)
    for it in [it for it in items if it.get('kind') == 'poem']:
        clipset, nt = await recite(it, checker)
        notes += nt; checker.save()
        for key, (pcm, m) in clipset.items(): put(it['role'], key, vk.mp3(pcm), m)
    open(os.path.join(out_dir, name + '.bin'), 'wb').write(blob)
    json.dump({'v': 2, 'u': index, 'm': meta}, open(os.path.join(out_dir, name + '.json'), 'w'), separators=(',', ':'))
    print(f'{name}: {len(index)} clips, {len(blob) / 1e6:.2f} MB -> {os.path.relpath(os.path.join(out_dir, name), os.getcwd())}.bin|json')
    return notes
