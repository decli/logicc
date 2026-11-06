// Every line 动物消消乐 can say, built exactly as the page builds it (so the hashes match).
//   node xiaoxiao/dev/voice/collect.js  ->  xiaoxiao/dev/voice/lines.json  (read by dev/voice/build.py xiaoxiao)
// Role n is the Chinese narrator. The English cheers are decli's recordings in ../../sound/, not recorded here.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = f => fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
const ctx = vm.createContext({ Math, console });
vm.runInContext(src('board.js') + '\n' + src('levels.js') + '\n' + src('levels2.js') + '\n' + src('lines.js') +
  '\n;this.LEVELS = LEVELS; this.L = L; this.MATH_COUNTS = MATH_COUNTS; this.MATH_RAMP = MATH_RAMP; this.MATH_WHEEL = MATH_WHEEL; this.MATH_MOST = MATH_MOST;', ctx);
const { LEVELS, L, MATH_MOST } = ctx;

const out = [], seen = new Set();
const add = (t, role = 'n') => { if (!t || seen.has(role + '|' + t)) return; seen.add(role + '|' + t); out.push({ role, key: t, segs: [t] }); };
const walk = v => {
  if (typeof v === 'string') add(v);
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
walk(L);
LEVELS.forEach((lv, i) => add(L.intro(lv, i + 1)));
// a parent can put any of 0 to MATH_MOST on the wheel (家长设置), so every page size is recorded: the page's first line
// says how many sums, the wheel says what it landed on, and marking says how many were right and how many to correct
for (let n = 0; n <= MATH_MOST; n++) add(L.wheel.land(n));
for (let n = 1; n <= MATH_MOST; n++) { add(L.math.start(n)); add(L.math.got(n)); add(L.math.fix(n)); }
fs.writeFileSync(path.join(__dirname, 'lines.json'), JSON.stringify(out, null, 0));
console.log(`动物消消乐: ${out.length} lines, ${out.reduce((a, o) => a + o.key.length, 0)} chars -> xiaoxiao/dev/voice/lines.json`);
