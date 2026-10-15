// Every line 魔方世界 can say, exactly as the page looks it up (so the hashes match).
//   node mofang/dev/voice/collect.mjs  ->  mofang/dev/voice/lines.json  (read by dev/voice/build.py mofang)
// Role n is the Chinese narrator (晓晓), role p the English cheers (Ana).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { L, CHEER, CHEER_ALL } from '../src/lines.js';

const here = dirname(fileURLToPath(import.meta.url));
const out = [], seen = new Set();
const add = (key, role = 'n', say = key) => { if (!key || seen.has(role + '|' + key)) return; seen.add(role + '|' + key); out.push({ role, key, segs: [say] }); };
// counting: the page says "1", "2", …; recorded as Chinese numerals so they are read 一、二 (not "one", not 两)
const CN = '零一二三四五六七八九';
const cn = n => (n < 10 ? CN[n] : n < 20 ? '十' + (n % 10 ? CN[n % 10] : '') : CN[Math.floor(n / 10)] + '十' + (n % 10 ? CN[n % 10] : ''));
const walk = v => {
  if (typeof v === 'string') { if (/^\d+$/.test(v)) add(v, 'n', cn(+v)); else add(v); }
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
walk(L);
// the map says an island's name and its introduction in one go
for (const k of Object.keys(L.isle)) add(L.isle[k] + '。' + L.isleIntro[k]);
[...CHEER.flat(), ...CHEER_ALL].forEach(w => add(w, 'p'));
writeFileSync(join(here, 'lines.json'), JSON.stringify(out, null, 0));
console.log(`魔方世界: ${out.length} lines, ${out.reduce((a, o) => a + o.key.length, 0)} chars -> mofang/dev/voice/lines.json`);
