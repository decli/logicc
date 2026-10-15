// Every line 动物消消乐 can say, built exactly as the page builds it (so the hashes match).
//   node xiaoxiao/dev/voice/collect.js  ->  xiaoxiao/dev/voice/lines.json  (read by dev/voice/build.py xiaoxiao)
// Role n is the Chinese narrator. The English cheers are decli's recordings in ../../sound/, not recorded here.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = f => fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
const ctx = vm.createContext({ Math, console });
vm.runInContext(src('board.js') + '\n' + src('levels.js') + '\n' + src('lines.js') +
  '\n;this.LEVELS = LEVELS; this.L = L;', ctx);
const { LEVELS, L } = ctx;

const out = [], seen = new Set();
const add = (t, role = 'n') => { if (!t || seen.has(role + '|' + t)) return; seen.add(role + '|' + t); out.push({ role, key: t, segs: [t] }); };
const walk = v => {
  if (typeof v === 'string') add(v);
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
walk(L);
LEVELS.forEach((lv, i) => add(L.intro(lv, i + 1)));
fs.writeFileSync(path.join(__dirname, 'lines.json'), JSON.stringify(out, null, 0));
console.log(`动物消消乐: ${out.length} lines, ${out.reduce((a, o) => a + o.key.length, 0)} chars -> xiaoxiao/dev/voice/lines.json`);
