// Every line the 彩虹钢琴 narrator can say, built exactly as the page builds it (so the hashes match).
//   node piano/dev/voice/collect.mjs  ->  piano/dev/voice/lines.json  (read by dev/voice/build.py piano)
import { writeFileSync } from 'node:fs';
import { L, INST_ZH, PAINTS, REGISTER_ZH } from '../src/lines.js';
import { SONGS } from '../src/songs.js';

const out = [], seen = new Set();
const add = t => { if (!t || seen.has(t)) return; seen.add(t); out.push({ role: 'n', key: t, segs: [t] }); };
for (const v of Object.values(L)) {
  if (typeof v === 'string') add(v);
  else if (Array.isArray(v)) v.forEach(add);
}
Object.keys(INST_ZH).forEach(k => add(L.inst(k)));
PAINTS.forEach(p => add(L.paint(p)));
REGISTER_ZH.forEach((_, i) => add(L.register(i, i >= 4)));
for (let c = 0; c < 7; c++) add(L.learnWrong(c));
for (const s of SONGS) {
  if (!s.listenOnly) { add(L.learnStart(s)); add(L.learnDone(s)); }
  add(L.listenStart(s));
}
add(L.listenStart({ title: '我弹的歌' }));
writeFileSync(new URL('./lines.json', import.meta.url), JSON.stringify(out, null, 0));
console.log(`彩虹钢琴: ${out.length} lines, ${out.reduce((a, o) => a + o.key.length, 0)} chars -> piano/dev/voice/lines.json`);
