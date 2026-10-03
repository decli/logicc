"""Listen back to the recorded lines with speech recognition and list the ones
that do not read back as written (likely a wrong reading or a swallowed word).
Usage: python3 check.py zh|en [n,c0,c1]      (run synth.py first)"""
import json, os, sys, re, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from common import asr_zh, asr_en, transcribe, cer
from synth import py_err
lang = sys.argv[1]; roles = sys.argv[2].split(',') if len(sys.argv) > 2 else ['n', 'c0', 'c1']
ZH = re.compile(r'[一-鿿]')
index = json.load(open(os.path.join(HERE, 'cache', 'index.json')))
rec = asr_zh() if lang == 'zh' else asr_en()
bad, n = [], 0
for k, f in index.items():
    role, text = k.split('|', 1)
    if role not in roles or bool(ZH.search(text)) != (lang == 'zh'): continue
    x, sr = sf.read(os.path.join(HERE, 'cache', f), dtype='float32'); n += 1
    h = transcribe(rec, x, sr); c = py_err(text, h) if lang == 'zh' else cer(text, h, lang)
    if c > (0.1 if lang == 'zh' else 0.25): bad.append((round(c, 2), role, text, h))
bad.sort(reverse=True)
json.dump(bad, open(os.path.join(HERE, f'check-{lang}.json'), 'w'), ensure_ascii=False, indent=0)
print(f'{lang}: {n} checked, {len(bad)} flagged')
for b in bad[:80]: print(b)
