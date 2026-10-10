// Every clip 古诗太鼓 (the poem drum game in ../../index.html) can play, as the page will look it up.
// Read straight out of POEMS / SHI_SAY in the page, so a new poem or a new line is picked up on the next build.
//   node dev/voice/collect_shi.js   ->  dev/voice/lines-shi.json
// roles:  n  narrator (晓晓)              key = the sentence
//         r  recitation (晓晓)            key = <poem>#full (title, author, every line, with syllable times)
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '../..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function skipString(s, i) { const q = s[i]; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; } return i + 1; }
function balanced(s, open) {
  const pairs = { '(': ')', '[': ']', '{': '}' }, stack = [];
  for (let i = open; i < s.length;) {
    const c = s[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(s, i); continue; }
    if (pairs[c]) stack.push(pairs[c]);
    else if (c === ')' || c === ']' || c === '}') { stack.pop(); if (!stack.length) return i + 1; }
    i++;
  }
  throw new Error('unbalanced');
}
function grab(decl) {
  const at = src.indexOf(decl); if (at < 0) throw new Error('not found: ' + decl);
  const open = src.slice(at).search(/[\[{]/) + at;
  return src.slice(at, balanced(src, open));
}
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext([grab('const POEMS = ['), grab('const SHI_SAY = {'), 'this.POEMS = POEMS; this.SHI_SAY = SHI_SAY;'].join('\n'), sandbox);
const { POEMS, SHI_SAY } = sandbox;

// one bank (voice-shi) for the page; part: what poems.py records in one go (0 the game's own lines, 1–4 the grades)
const items = [], seen = new Set();
function add(part, role, key, text) { const k = role + '|' + key; if (seen.has(k)) return; seen.add(k); items.push({ part, role, key, segs: [text] }); }

for (const v of Object.values(SHI_SAY)) add(0, 'n', v, v);
for (const p of POEMS) {
  const part = '一二三四'.indexOf(p.g[0]) + 1;
  add(part, 'n', p.intro, p.intro);
  // say：屏幕上照旧显示 x，合成时用这个写法（比如 鹅？鹅？鹅？ 才念得出上扬的二声）
  items.push({ part, role: 'r', kind: 'poem', id: p.id, title: p.t, by: p.by || (p.d + '，' + p.a), lines: p.L.map(l => l.x), py: p.L.map(l => l.py), say: p.L.map(l => l.say || null) });
}

fs.writeFileSync(path.join(__dirname, 'lines-shi.json'), JSON.stringify(items, null, 0));
const n = items.filter(i => !i.kind).length;
console.log(`古诗太鼓: ${POEMS.length} poems, ${n} lines + ${items.length - n} recitations -> dev/voice/lines-shi.json`);
