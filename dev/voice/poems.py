"""古诗太鼓's voice bank (voice-shi.bin|json at the site root).

A poem is recited in ONE take, so the voice carries the melody across lines the way a person reading it aloud
does (a comma line stays up, a full stop comes down). The take is then cut at the pauses between lines, and
the lines are put back together with pauses set by hand: a breath after a comma, a longer one after a full stop,
so the rhythm is the same every time and never rushed. Each line is also kept as its own clip, cut from that
same take.

For every line, and for the title and the author, the page also gets the moment each character starts: those
moments are the drum game's beats, and light the characters as they are read. The service only reports where whole phrases start, so inside a phrase the
syllables are found from the loudness: Mandarin syllables are separated by small dips.

The narrator's lines go through voicekit like every other line on the site.
Index format: {"v": 2, "u": {hash: [offset, length]}, "m": {hash: meta}}; meta of <poem>#full is
{"L": line starts, "T": [[syllable starts] per line], "H": [[title syllables], [author syllables]]} in seconds."""
import asyncio, hashlib, json, os, time
import numpy as np
import voicekit as vk
import zhpoly

GAP_TITLE, GAP_BY = 0.5, 0.9                       # seconds after the title and after the author
GAP = {'，': 0.55, '、': 0.4, '。': 0.9, '？': 0.9, '！': 0.9, '；': 0.7}
PUNCT = set('，。！？、；：')
POEM_ROLES = ('r',)
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

def onsets_parts(x, parts):
    """like onsets(), for a clip made of comma-separated parts (唐，骆宾王): when the parts stand apart as islands
    of sound, find the syllables inside each island; otherwise treat it as one run"""
    e = env_of(x); isl = islands(e, e.max() * 0.06)
    if len(isl) == len(parts) and len(parts) > 1:
        out = []
        for (a, b), n in zip(isl, parts):
            lo, hi = max(0, a - 2), min(len(x) // int(vk.SR * HOP), b + 2)
            out += [round(lo * HOP + o, 3) for o in onsets(x[int(lo * HOP * vk.SR):int(hi * HOP * vk.SR)], n)]
        return out
    return onsets(x, sum(parts))

# ---------- tones of line-final syllables ----------
# The voice sometimes says the last syllable of a line too low and flat: 「鱼戏莲叶间。」 comes out with 间 well
# below every other first tone in the poem, and it sounds like a neutral tone. A wrong tone is checked from the
# pitch, against the rest of the same take: a first tone must sit above the take's middle pitch, a second tone
# must rise, a fourth tone must fall from high up.
TONE_MARKS = {c: t for t, cs in enumerate(['', 'āēīōūǖ', 'áéíóúǘ', 'ǎěǐǒǔǚ', 'àèìòùǜ']) for c in cs}
def tone_of(py): return next((TONE_MARKS[c] for c in py if c in TONE_MARKS), 5)

def pitch_st(x):
    """pitch every 10 ms in semitones above 100 Hz (nan where unvoiced)"""
    import librosa
    f0 = librosa.pyin(x, fmin=60, fmax=500, sr=vk.SR, frame_length=1024, hop_length=int(vk.SR * HOP))[0]
    return 12 * np.log2(f0 / 100)

def syllables(x, on, f=None):
    """[(start, end, mean) pitch of each syllable or None]: the voiced frames from a fifth into the syllable
    to where the sound stops (the last one runs to the end of the sound)"""
    if f is None: f = pitch_st(x)
    e = env_of(x); thr = e.max() * 0.06; out = []
    for k, a in enumerate(on):
        fa = int(a / HOP)
        if k + 1 < len(on): fb = int(on[k + 1] / HOP)
        else:   # on until the sound stops, across a stop's closure (东 starts with a short silence)
            last = fa
            for j in range(fa, min(len(e), fa + 120)):
                if e[j] > thr: last = j
                elif j - last > 15: break
            fb = last + 1
        fa += (fb - fa) // 5
        ff = f[fa:fb]; ff = ff[~np.isnan(ff)]
        if len(ff) < 4: out.append(None); continue
        q = max(2, len(ff) // 4)
        out.append((float(ff[:q].mean()), float(ff[-q:].mean()), float(ff.mean())))
    return out

def tone_score(v, t, mid):
    """how well one syllable's pitch fits tone t, given the middle pitch around it; >= 0 passes.
    No pitch at all on a syllable that should carry one (a creak, a whisper) counts as a small miss"""
    if t in (3, 5): return 0.0
    if v is None: return -0.8
    s0, s1, mean = v
    if t == 1: return min(mean - (mid + 1.0), s1 - s0 + 3)
    if t == 2: return s1 - s0 - 2.0
    return min(s0 - s1 - 3.0, s0 - mid)          # 4

def quietest(x, t0, t1):
    """the quietest moment between t0 and t1 (s): where to cut between two lines"""
    e = env_of(x); a, b = int(t0 / HOP), max(int(t0 / HOP) + 1, int(t1 / HOP))
    seg = e[a:b]
    return (a + int(np.argmin(seg))) * HOP if len(seg) else (t0 + t1) / 2

def silence(s): return np.zeros(int(vk.SR * s), np.float32)

def regap(x, gap=0.4):
    """syllables said one by one (鹅？鹅？鹅？) come back with long question pauses between them:
    keep each sound as it is and close the silences up to `gap` seconds. The cuts fall in silence"""
    e = env_of(x); isl = islands(e, e.max() * 0.05, gap=12)
    if len(isl) < 2: return x
    pad = int(vk.SR * 0.04); parts = []
    for k, (a, b) in enumerate(isl):
        seg = x[max(0, int(a * HOP * vk.SR) - pad): min(len(x), int(b * HOP * vk.SR) + pad)].copy()
        if k: parts.append(silence(gap))
        parts.append(vk.fade(seg, 6))
    return np.concatenate(parts)

async def fixed(text, checker, unsure=True):
    """text to send with polyphones fixed. With unsure=True a reading the checker is unsure about is swapped for
    a stand-in too. That is not always safe: 鱼戏莲叶间 sent as 鱼戏莲叶坚 is nonsense to the voice, and it let
    the last syllable sink. So recite() makes takes both ways and keeps, line by line, whichever has the tones"""
    clean = zhpoly.zh_clean(text)
    send, found = await checker.check(clean)
    send = list(send)
    _, stand = zhpoly.tables()
    for f in found:
        if f['verdict'] not in ('wrong', 'unsure') or not f['fix'] or (f['verdict'] == 'unsure' and not unsure): continue
        # the checker picks whichever stand-in sounded closest, which can be a rare character (傗 for chù);
        # the most common one with that reading is the safer thing to hand the voice
        f['fix'] = next((c for c in stand.get(f['want'], []) if c != clean[f['pos']]), f['fix'])
        send[f['pos']] = f['fix']
        if f['verdict'] == 'unsure': f['verdict'] = 'unsure-fixed'
    return ''.join(send), [dict(f, text=text) for f in found if f['verdict'] != 'ok']

async def say(role, text, checker, unsure=True):
    """one take of `text` by `role` with polyphones fixed -> (pcm, word bounds, text sent, notes)"""
    voice, rate, pitch = vk.VOICES[(role, 'zh')]
    send, notes = await fixed(text, checker, unsure)
    mp3, words = await vk.tts(send, voice, rate, pitch)
    return vk.decode(mp3), words, send, notes

def brk(line):
    """诵读停顿: a five-character line is read 2|3, a seven-character line 4|3 (鱼戏，莲叶间。). Said with that
    little break, the last syllable keeps its tone; said straight through, the voice often lets it sink
    (间 comes out like a neutral tone, 流 and 柔 fall instead of rising)"""
    body, end = (line[:-1], line[-1]) if line[-1] in PUNCT else (line, '')
    k = {5: 2, 7: 4}.get(len(body))
    if not k or any(c in PUNCT for c in body): return line
    return body[:k] + '，' + body[k:] + end

def close_gaps(x, keep=0.22):
    """pauses inside a line (the break above) shortened to `keep` seconds: a breath, not a stop"""
    e = env_of(x); quiet = e < e.max() * 0.04; out, i, last = [], 0, 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if i > 0 and j < len(quiet) and (j - i) * HOP > keep:   # inside the sound, not at its ends
                a, b = int((i * HOP + keep / 2) * vk.SR), int((j * HOP - keep / 2) * vk.SR)
                out.append(x[last:a]); last = b
            i = j
        else: i += 1
    out.append(x[last:])
    return vk.fade(np.concatenate(out), 4) if len(out) > 1 else x

def parts_of(line):
    """characters in each comma-separated part of a line: 鱼戏，莲叶间。 -> [2, 3]"""
    out, n = [], 0
    for c in line:
        if c in PUNCT:
            if n: out.append(n)
            n = 0
        else: n += 1
    return out + ([n] if n else [])

def line_onsets(seg, line):
    p = parts_of(line)
    return onsets_parts(seg, p) if len(p) > 1 else onsets(seg, p[0])

async def take(role, lines, checker, unsure=True):
    """the lines said in a row in one take -> ([each line's sound], notes, unsure polyphones as (line, syllable,
    reading, char)). The voice carries the melody across lines the way a person reading aloud does; the take is
    cut at the quietest moment between lines"""
    x, words, send, notes = await say(role, ''.join(lines), checker, unsure)
    polys, starts = [], np.cumsum([0] + [len(l) for l in lines])
    for f in notes:
        if f['verdict'] in ('unsure', 'unsure-fixed'):
            i = int(np.searchsorted(starts, f['pos'], side='right')) - 1
            k = sum(1 for c in lines[i][:f['pos'] - starts[i]] if c not in PUNCT)
            polys.append((i, k, f['want'], f['char']))
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
    if any(s[0] is None for s in span): raise RuntimeError(f'{role}: no word bounds for some line: {span}')
    cuts = [0.0] + [quietest(x, span[i][1], span[i + 1][0]) for i in range(len(lines) - 1)] + [len(x) / vk.SR]
    x = vk.level(x)
    return [vk.fade(vk.trim(x[int(cuts[i] * vk.SR):int(cuts[i + 1] * vk.SR)].copy())) for i in range(len(lines))], notes, polys

def final_score(seg, line, pys):
    """tone score of the line's last syllable (see tone_score), against the middle pitch of the rest of the line"""
    v = syllables(seg, line_onsets(seg, line))
    rest = [a[2] for a in v[:-1] if a]
    if not rest: return 0.0
    return tone_score(v[-1], tone_of(pys[-1]), float(np.median(rest)))

def standins(ch, py):
    """common characters with exactly this reading, for a last syllable the voice keeps getting wrong
    (only the 3755 most common ones, GB2312 level 1: the voice handles everyday characters best)"""
    from pypinyin.contrib.tone_convert import to_tone3
    _, stand = zhpoly.tables()
    def common(c):
        try: b = c.encode('gb2312'); return 0xB0 <= b[0] <= 0xD7
        except UnicodeEncodeError: return False
    return [c for c in stand.get(to_tone3(py), []) if c != ch and common(c)][:3]

def last_span(x, on):
    """(start, end) in seconds of the voiced part of the last syllable"""
    e = env_of(x); thr = e.max() * 0.06; fa = int(on[-1] / HOP); last = fa
    for j in range(fa, min(len(e), fa + 120)):
        if e[j] > thr: last = j
        elif j - last > 15: break
    return on[-1], (last + 1) * HOP

def reshape(x, line, pys):
    """last resort for a last syllable whose tone no take gets right (画鸡「走将来」: 来 falls from 将's height):
    redraw its pitch, and only its pitch, as the tone should go, relative to the rest of the line, with Praat's
    overlap-add resynthesis. Timing and voice are untouched"""
    import parselmouth
    from parselmouth.praat import call
    on = line_onsets(x, line); v = syllables(x, on)
    rest = [a[2] for a in v[:-1] if a]
    t = tone_of(pys[-1])
    if not rest or t not in (1, 2, 4): return None
    M = float(np.median(rest)); a, b = last_span(x, on)
    f = pitch_st(x); fa, fb = int(a / HOP), int(b / HOP)
    seg = f[fa:fb]; seg = seg[~np.isnan(seg)]
    if len(seg) < 4: return None
    s0 = float(seg[:3].mean()); mean = float(seg.mean())
    # targets against the line's middle pitch M, taken from the line endings this voice gets right (measured over
    # the first-grade poems): a first tone sits about 3.3 semitones above M; a second tone starts about 5 below
    # and climbs to just above it; a fourth tone falls from about 3 above to 3 below
    if t == 1: S = max(M + 3.0, mean); E, glide = S - 0.3, 0.15
    elif t == 2: S = min(s0, M - 4.5); E, glide = max(M + 1.0, S + 5.5), 0.25
    else: S = max(M + 3.3, s0); E, glide = min(M - 3.0, S - 6.0), 0.08
    snd = parselmouth.Sound(x.astype(np.float64), sampling_frequency=vk.SR)
    man = call(snd, 'To Manipulation', 0.01, 60, 500)
    tier = call(man, 'Extract pitch tier')
    v0 = f[fa:fa + 6]; v0 = v0[~np.isnan(v0)]; start = float(v0[0]) if len(v0) else S
    a0, a1 = a + (b - a) * 0.08, b
    call(tier, 'Remove points between', a0, a1 + 0.05)
    hz = lambda st: 100 * 2 ** (st / 12)
    n = max(6, int((a1 - a0) / 0.01))
    for k in range(n + 1):
        u = k / n
        if t == 2: g = S + (E - S) * (max(0, u - 0.3) / 0.7) ** 1.3     # holds low, then climbs
        else: g = S + (E - S) * u
        g = start + (g - start) * min(1, u / glide)                    # from where the voice was, quickly
        call(tier, 'Add point', a0 + (a1 - a0) * u, hz(g))
    call([tier, man], 'Replace pitch tier')
    y = call(man, 'Get resynthesis (overlap-add)').values[0].astype(np.float32)
    return vk.fade(y[:len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y))))

async def recite(it, checker):
    """-> ({key: (pcm, meta)}, notes, report) for one poem in one voice"""
    role, pid, lines, pys = it['role'], it['id'], it['lines'], it['py']
    # up to four takes: with the 诵读 break in every line (closed up to a short breath) or straight through, each
    # with the unsure polyphones left as they are or swapped for stand-ins. Every line keeps the take where its
    # last syllable and its unsure polyphones best carry their tones; on a tie the break and the real characters win
    practical, _ = zhpoly.tables()
    sent, takes, notes = [brk(l) for l in lines], {}, []
    for uf in (False, True):
        for bk in (True, False):
            ls = sent if bk else lines
            if bk and ls == lines: continue
            if uf and (False, bk) in takes and not takes[(False, bk)][3]: continue   # nothing unsure: same take
            segs, nt, polys = await take(role, ls, checker, uf); notes += nt
            if bk: segs = [close_gaps(x) if b != l else x for x, b, l in zip(segs, ls, lines)]
            takes[(uf, bk)] = (segs, ls, nt, polys)
    segs, said, report = [], [], []
    alts = it.get('say') or [None] * len(lines)
    for i, l in enumerate(lines):
        py = pys[i].split(); opts = []
        if alts[i]:   # said with its own spelling below
            segs.append(None); said.append(l); report.append((l, alts[i], 0.0, [])); continue
        for (uf, bk), (ss, ls, _, polys) in takes.items():
            x, w = ss[i], ls[i]
            v = syllables(x, line_onsets(x, w)); fs = final_score(x, w, py)
            score = min(fs, 1.0) + (0.3 if bk else 0) + (0 if uf else 0.1)
            for (pi, k, want, ch) in polys:
                if pi != i: continue
                if len({r[-1] for r in practical.get(ch, set()) | {want}}) > 1:   # its readings differ in tone
                    rest = [a[2] for j, a in enumerate(v) if a and j != k]
                    if rest and k < len(v): score += min(tone_score(v[k], int(want[-1]), float(np.median(rest))), 1.0)
                elif uf: score += 0.2   # same tone either way (露 lù / lòu): only the stand-in is sure
            opts.append((score, fs, x, w, uf))
        opts.sort(key=lambda o: -o[0])
        best = opts[0]; tried = [round(o[1], 1) for o in opts]
        if best[1] < 0:
            # last syllable still off: the line on its own, ending in other ways; then with the last character
            # swapped for a common one with the same reading (the screen still shows the real one)
            body, t, uf = brk(l)[:-1], tone_of(py[-1]), best[4]
            ws = [body + e for e in ('！', '。', '，')]
            ws += [body[:-1] + c + '！' for c in standins(body[-1], py[-1])]
            for w in dict.fromkeys(ws):
                y, _, _, n1 = await say(role, w, checker, uf); notes += n1
                y = vk.fade(vk.level(vk.trim(y))); y = close_gaps(y) if '，' in w[:-1] else y
                sc = final_score(y, w, py); tried.append(round(sc, 1))
                if sc > best[1]: best = (sc, sc, y, w, uf)
                if sc >= 0.5: break
        if best[1] < -0.5:   # no take has it: redraw the pitch of that one syllable on the best take
            y = reshape(best[2], best[3], py)
            if y is not None:
                v = syllables(y, line_onsets(y, best[3]))[-1]
                sc = final_score(y, best[3], py); tried.append(round(sc, 1))
                if v is not None and sc > best[1]: best = (sc, sc, y, best[3], best[4], ' (pitch redrawn)')
        report.append((l, best[3] + (' (stand-ins)' if best[4] else '') + (best[5] if len(best) > 5 else ''), round(best[1], 1), tried))
        segs.append(best[2]); said.append(best[3])
    # a line with its own spelling for the voice (鹅？鹅？鹅？) is said on its own and put in place of the cut
    for i, alt in enumerate(it.get('say') or []):
        if alt:
            y, _, _, n0 = await say(role, alt, checker); notes += n0
            segs[i] = vk.fade(vk.level(vk.trim(regap(y)))); said[i] = alt
    ttl = it['title'].replace('·', '，')   # 清平乐·村居: two parts
    title, _, _, n1 = await say(role, ttl + '。', checker)
    by, _, _, n2 = await say(role, it['by'] + '。', checker)
    notes += n1 + n2
    title, by = vk.fade(vk.level(vk.trim(title))), vk.fade(vk.level(vk.trim(by)))
    out, head, tail = {}, 0.03, 0.12
    full, T, L = [silence(head), title, silence(GAP_TITLE), by, silence(GAP_BY)], [], []
    t = head + (len(title) + len(by)) / vk.SR + GAP_TITLE + GAP_BY
    for i, (l, s) in enumerate(zip(lines, segs)):
        alt = (it.get('say') or [None] * len(lines))[i]
        on = onsets(s, sum(parts_of(l))) if alt else line_onsets(s, said[i])
        L.append(round(t, 3)); T.append([round(t + o, 3) for o in on])
        full.append(s); t += len(s) / vk.SR
        if i < len(lines) - 1:
            g = GAP.get(l[-1], 0.6); full.append(silence(g)); t += g
    full.append(silence(tail))
    # the title and the author get their syllable times too: in the drum game they are notes like the lines
    tb = head + len(title) / vk.SR + GAP_TITLE
    H = [[round(head + o, 3) for o in onsets_parts(title, parts_of(ttl))], [round(tb + o, 3) for o in onsets_parts(by, parts_of(it['by']))]]
    out[f'{pid}#full'] = (np.concatenate(full), {'L': L, 'T': T, 'H': H})
    bad = [r for r in report if r[2] < 0]
    print(f'  {pid}/{role}: {t + tail:.1f}s; {sum(r[1] != r[0] for r in report)}/{len(lines)} lines read with the break'
          + (f'; last tone still off in: ' + ' '.join(f'{r[0]}({r[2]})' for r in bad) if bad else ''), flush=True)
    return out, notes, report

async def build_shi(items, out_dir, name):
    checker = vk.poly_checker()
    blob, index, meta, notes, t0, reports = bytearray(), {}, {}, [], time.time(), []
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
        spaced = it['role'] in POEM_ROLES and '？' in it['segs'][0].rstrip('？')   # 鹅？鹅？鹅？: close up the pauses
        f = os.path.join(clips, ck + ('g' if spaced else '') + '.mp3')
        if not os.path.exists(f) or os.path.getsize(f) == 0:
            pcm = await vk.assemble(parts)
            vk.write_atomic(f, vk.mp3(regap(pcm) if spaced else pcm))
        return open(f, 'rb').read(), nt

    plain = [it for it in items if not it.get('kind')]
    for i in range(0, len(plain), 24):
        batch = plain[i:i + 24]
        for it, (b, nt) in zip(batch, await asyncio.gather(*[one(it) for it in batch])):
            put(it['role'], it['key'], b); notes += nt
        checker.save()
        print(f'  {name}: {min(i + 24, len(plain))}/{len(plain)} lines  {time.time() - t0:.0f}s', flush=True)
    for it in [it for it in items if it.get('kind') == 'poem']:
        clipset, nt, rep = await recite(it, checker)
        notes += nt; checker.save(); reports.append((it['role'], it['id'], rep))
        for key, (pcm, m) in clipset.items(): put(it['role'], key, vk.mp3(pcm), m)
    open(os.path.join(out_dir, name + '.bin'), 'wb').write(blob)
    json.dump({'v': 2, 'u': index, 'm': meta}, open(os.path.join(out_dir, name + '.json'), 'w'), separators=(',', ':'))
    json.dump([{'role': r, 'id': i, 'lines': [{'text': a, 'sent': b, 'score': c, 'tried': d} for a, b, c, d in rep]} for r, i, rep in reports],
              open(os.path.join(vk.HERE, 'tones-' + name + '.json'), 'w'), ensure_ascii=False, indent=0)
    print(f'{name}: {len(index)} clips, {len(blob) / 1e6:.2f} MB -> {os.path.relpath(os.path.join(out_dir, name), os.getcwd())}.bin|json')
    return notes
