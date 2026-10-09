// Every clip 古诗花园 (the poem game in ../../index.html) can play, as the page will look it up.
// Read straight out of POEMS / SHI_SAY / SHI_MONKEY in the page, so a new poem or a new line is picked up
// on the next build.
//   node dev/voice/collect_shi.js   ->  dev/voice/lines-shi.json
// roles:  n  narrator (晓晓)              key = the sentence
//         m  the little monkey (云夏)     key = the sentence, or <poem>#<line> / <poem>#<line>x<k> (oops k)
//         r  recitation, 晓晓 (default)   key = <poem>#<line>, <poem>#t (title), <poem>#a (author), <poem>#full,
//         R  recitation, 云希                   <poem>#<line><<n> (the first n characters, said on their own)
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
vm.runInContext([grab('const POEMS = ['), grab('const SHI_SAY = {'), grab('const SHI_MONKEY = {'),
  'this.POEMS = POEMS; this.SHI_SAY = SHI_SAY; this.SHI_MONKEY = SHI_MONKEY;'].join('\n'), sandbox);
const { POEMS, SHI_SAY, SHI_MONKEY } = sandbox;

const PUNCT = /[，。！？、；：？]/;
const hanzi = s => Array.from(s).filter(c => !PUNCT.test(c));
// the line up to (not including) its n-th character, keeping punctuation inside: 鹅，鹅，鹅 <2 -> 鹅，鹅
function head(x, n) { let k = 0, out = ''; for (const c of x) { if (!PUNCT.test(c)) { if (k === n) break; k++; } out += c; } return out.replace(/[，。！？、；：]+$/, ''); }
// for a line spelled for the voice (鹅？鹅？鹅？) keep the question mark the half line ends on: it is what makes 鹅 rise
function headSay(x, n) { const h = head(x, n); return x.slice(h.length, h.length + 1) === '？' ? h + '？' : h; }

const items = [], seen = new Set();
function add(role, key, text) { const k = role + '|' + key; if (seen.has(k)) return; seen.add(k); items.push({ role, key, segs: [text] }); }

for (const v of Object.values(SHI_SAY)) {
  if (v.includes('{t}')) for (const p of POEMS) add('n', v.replace(/\{t\}/g, p.t), v.replace(/\{t\}/g, p.t));
  else add('n', v, v);
}
for (const v of Object.values(SHI_MONKEY)) add('m', v, v);
for (const p of POEMS) {
  add('n', p.intro, p.intro);
  p.L.forEach((l, i) => {
    add('n', l.ex, l.ex);
    const say = l.say || l.x;   // say：屏幕上照旧显示 x，合成时用这个写法（比如 鹅？鹅？鹅？ 才念得出上扬的二声）
    add('m', `${p.id}#${i}`, say);
    for (const role of ['r', 'R']) {
      const n = hanzi(l.x).length;
      add(role, `${p.id}#${i}<${Math.min(2, n - 1)}`, headSay(say, Math.min(2, n - 1)));
      for (const b of p.blank) if (b[0] === i) add(role, `${p.id}#${i}<${b[1]}`, headSay(say, b[1]));
    }
  });
  p.oops.forEach((o, k) => add('m', `${p.id}#${o[0]}x${k}`, o[1] + p.L[o[0]].x.slice(-1)));
  for (const role of ['r', 'R'])
    items.push({ role, kind: 'poem', id: p.id, title: p.t, by: p.by || (p.d + '，' + p.a), lines: p.L.map(l => l.x), say: p.L.map(l => l.say || null) });
}
// a blank at character 0 would have nothing to say before it
for (const p of POEMS) for (const b of p.blank) if (b[1] < 1) { console.log('blank at the first character has no lead-in:', p.id, b); process.exitCode = 1; }

fs.writeFileSync(path.join(__dirname, 'lines-shi.json'), JSON.stringify(items, null, 0));
const n = items.filter(i => !i.kind).length;
console.log(`古诗花园: ${POEMS.length} poems, ${n} lines + ${items.length - n} recitations -> dev/voice/lines-shi.json`);
