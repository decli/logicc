"""Listen back to every pre-recorded line with speech recognition and list the
ones that do not read back as written (likely mispronunciations)."""
import json, os, sys, hashlib, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import asr_zh, asr_en, transcribe, cer, norm_zh
from synth import VOICES, KBPS, tts_text
HERE = os.path.dirname(os.path.abspath(__file__))
lang = sys.argv[1]; roles = sys.argv[2].split(',') if len(sys.argv) > 2 else ['n', 'c0', 'c1']
rec = asr_zh() if lang == 'zh' else asr_en()
lines = [l for l in json.load(open(os.path.join(HERE, 'lines.json'))) if l['lang'] == lang and l['role'] in roles]
bad = []
for l in lines:
    ver, sid, speed = VOICES[lang][l['role']]
    tts = tts_text(l['text'], lang)
    key = hashlib.sha1(f'{ver}|{sid}|{speed}|{KBPS}|{tts}'.encode()).hexdigest()[:20]
    f = os.path.join(HERE, 'cache', key + '.npy')
    if not os.path.exists(f): continue
    x = np.load(f).astype(np.float32) / 32767
    h = transcribe(rec, x, 24000)
    c = cer(tts, h, lang)
    if c > (0.12 if lang == 'zh' else 0.25): bad.append((round(c, 2), l['role'], l['text'], h))
bad.sort(reverse=True)
json.dump(bad, open(os.path.join(HERE, f'check-{lang}.json'), 'w'), ensure_ascii=False, indent=0)
print(f'{lang}: {len(lines)} checked, {len(bad)} flagged')
for b in bad[:80]: print(b)
