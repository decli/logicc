// Every line 五子棋 can say (dev/src/lines.js), for recording.
//   node wuziqi/dev/voice/collect.js  ->  wuziqi/dev/voice/lines.json  (read by dev/voice/build.py wuziqi)
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'lines.js'), 'utf8') + '\n;this.L = L;', ctx);
const out = [], seen = new Set();
const add = t => { if (!t || seen.has(t)) return; seen.add(t); out.push({ role: 'n', key: t, segs: [t] }); };
const walk = v => { if (typeof v === 'string') add(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
walk(ctx.L);
fs.writeFileSync(path.join(__dirname, 'lines.json'), JSON.stringify(out, null, 0));
console.log(`五子棋: ${out.length} lines, ${out.reduce((a, o) => a + o.key.length, 0)} chars -> wuziqi/dev/voice/lines.json`);
