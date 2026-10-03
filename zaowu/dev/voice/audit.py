import json, collections, sys
from zhfront import Lexicon
lx = Lexicon('/home/claude/ttslab/models/sherpa-onnx-zipvoice-distill-int8-zh-en-emilia/tokens.txt')
lines = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'lines.json'))
for l in lines:
    if l['lang'] == 'zh': lx.add_text(l['text'], l['role'])
print('entries', len(lx.entries), 'conflicts', lx.conflicts[:10])
# group audit by (char, reading)
g = collections.defaultdict(list)
for ch, py, fixed, ctx, src in lx.audit:
    g[(ch, py)].append(('*' if fixed else '') + ctx)
SKIP_OK = {('的', 'de5'), ('了', 'le5'), ('着', 'zhe5'), ('个', 'ge4'), ('子', 'zi5'), ('们', 'men5'), ('么', 'me5'), ('呢', 'ne5'), ('吗', 'ma5'), ('吧', 'ba5'), ('呀', 'ya5'), ('啦', 'la5')}
for (ch, py), ctxs in sorted(g.items(), key=lambda kv: kv[0]):
    if (ch, py) in SKIP_OK: continue
    u = sorted(set(ctxs))
    print(f'{ch} {py:7s} {len(ctxs):4d}  ' + ' | '.join(u[:8]) + (' …' if len(u) > 8 else ''))
