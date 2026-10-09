"""Voice banks for the whole site.

  python3 dev/voice/build.py root          home-page logic games  -> voice-zh.bin|json at the site root
  python3 dev/voice/build.py zaowu         造物 (both languages)  -> zaowu/voice-zh|en.bin|json (+ rebuilds zaowu/index.html)
  python3 dev/voice/build.py piano         彩虹钢琴               -> piano/voice-zh.bin|json
  python3 dev/voice/build.py shi           古诗花园               -> voice-shi.bin|json at the site root (see poems.py)
  python3 dev/voice/build.py check root    listen back with speech recognition and list lines that do not read as written
  python3 dev/voice/build.py check zaowu

Synthesized audio is cached in dev/voice/cache, so after editing a few lines only those are re-recorded."""
import asyncio, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import voicekit as vk
import zhpoly

def collect(which):
    if which == 'shi':
        subprocess.run(['node', os.path.join(HERE, 'collect_shi.js')], check=True)
        return {'voice-shi': json.load(open(os.path.join(HERE, 'lines-shi.json')))}
    if which == 'root':
        subprocess.run(['node', os.path.join(HERE, 'collect_root.js')], check=True)
        return {'voice-zh': json.load(open(os.path.join(HERE, 'lines-root.json')))}
    if which == 'piano':
        pd = os.path.join(ROOT, 'piano', 'dev', 'voice')
        subprocess.run(['node', os.path.join(pd, 'collect.mjs')], check=True)
        return {'voice-zh': json.load(open(os.path.join(pd, 'lines.json')))}
    zd = os.path.join(ROOT, 'zaowu', 'dev', 'voice')
    subprocess.run(['node', os.path.join(zd, 'collect.js')], check=True)
    lines = json.load(open(os.path.join(zd, 'lines.json')))
    return {f'voice-{b}': [l for l in lines if l['bank'] == b] for b in ('zh', 'en')}

def out_dir(which):
    if which == 'piano': return os.path.join(ROOT, 'piano')
    return ROOT if which in ('root', 'shi') else os.path.join(ROOT, 'zaowu', 'dev', 'voice', 'out')

async def build(which):
    banks, notes = collect(which), []
    for name, items in banks.items():
        if which == 'shi':
            import poems
            notes += await poems.build_shi(items, out_dir(which), name)
        else:
            notes += await vk.build_bank(items, out_dir(which), name, f'{which}/{name}')
    vk.report_notes(notes, os.path.join(HERE, f'poly-report-{which}.json'))
    if which == 'zaowu':
        subprocess.run([sys.executable, os.path.join(ROOT, 'zaowu', 'dev', 'build.py')], check=True)

# ---------- listening check ----------
CN = '零一二三四五六七八九'
def cn_num(m):
    n = int(m.group())
    if n < 10: return CN[n]
    if n < 20: return '十' + (CN[n % 10] if n % 10 else '')
    if n < 100: return CN[n // 10] + '十' + (CN[n % 10] if n % 10 else '')
    return m.group()
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'x x twenty thirty forty fifty sixty seventy eighty ninety'.split()
def en_num(m):
    n = int(m.group())
    return ONES[n] if n < 20 else TENS[n // 10] + ('' if n % 10 == 0 else ' ' + ONES[n % 10]) if n < 100 else m.group()

def zh_err(ref, hyp):
    """syllable error rate that only counts sounds: a heard character is right if any of its readings matches"""
    from pypinyin import pinyin, Style
    ref, hyp = re.sub(r'\d+', cn_num, ref), re.sub(r'\d+', cn_num, hyp)
    r = [p.rstrip('12345') for _, _, p in zhpoly.intended(ref)]
    h = [set(x.rstrip('12345') for x in pinyin(c, style=Style.TONE3, heteronym=True)[0]) for c in hyp if '一' <= c <= '鿿']
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] not in h[j - 1]))
    return d[len(h)] / max(1, len(r))

def en_err(ref, hyp):
    norm = lambda t: re.sub(r"[^a-z' ]", ' ', re.sub(r'\d+', en_num, t.lower()).replace('-', ' ')).split()
    r, h = norm(ref), norm(hyp)
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
    return d[len(h)] / max(1, len(r))

def check(which):
    from faster_whisper import WhisperModel
    model = WhisperModel('small', device='cpu', compute_type='int8')
    bad, n = [], 0
    for name, items in collect(which).items():
        ix = json.load(open(os.path.join(out_dir(which), name + '.json')))['u']
        blob = open(os.path.join(out_dir(which), name + '.bin'), 'rb').read()
        for it in items:
            if it.get('kind') or len(it['segs']) != 1: continue   # runs are made of the same takes as the single lines
            off, ln = ix[vk.fnv(it['role'] + '|' + it['key'])]
            x = vk.decode(blob[off:off + ln], 16000)
            text = it['segs'][0]; lang = vk.lang_of(text)
            segs, _ = model.transcribe(x, language=lang, beam_size=5, initial_prompt='以下是普通话。' if lang == 'zh' else None)
            hyp = ''.join(s.text for s in segs).strip()
            e = zh_err(text, hyp) if lang == 'zh' else en_err(text, hyp)
            n += 1
            if e > (0.12 if lang == 'zh' else 0.25): bad.append((round(e, 2), name, it['role'], text, hyp))
            if n % 100 == 0: print(f'  checked {n}', flush=True)
    bad.sort(reverse=True)
    path = os.path.join(HERE, f'check-{which}.json')
    json.dump(bad, open(path, 'w'), ensure_ascii=False, indent=0)
    print(f'{which}: {n} lines checked, {len(bad)} do not read back cleanly -> {os.path.relpath(path, os.getcwd())}')
    for b in bad[:60]: print('  ', b)

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args or args[-1] not in ('root', 'zaowu', 'piano', 'shi'): sys.exit(__doc__)
    if args[0] == 'check': check(args[-1])
    else: asyncio.run(build(args[-1]))
