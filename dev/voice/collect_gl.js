// Every line 找规律 (the figure-reasoning game in ../../index.html) can say, for its own voice bank voice-gl.
// The question makers and every sentence of the explanations sit between /* ==GL-DATA== */ and /* ==/GL-DATA== */
// in the page, which never touches the page there; glLines() lists the sentences. This script also makes a few
// thousand questions of every kind and checks that no explanation says something glLines() forgot, and that every
// question has four different options with the answer among them.
//   node dev/voice/collect_gl.js   ->  dev/voice/lines-gl.json
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
const a = src.indexOf('/* ==GL-DATA=='), b = src.indexOf('/* ==/GL-DATA== */');
if (a < 0 || b < a) throw new Error('GL-DATA markers not found in index.html');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext([
  // the page's own little helpers, same definitions
  'const rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];',
  'const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };',
  'const range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };',
  'const clamp = (v, a, b) => Math.max(a, Math.min(b, v));',
  src.slice(a, b), grab('const GAMES = ['),
  'this.out = { lines: glLines(), GEN: GL_GEN, GAMES: GAMES, T: GL_T };'].join('\n'), sandbox);
const { lines, GEN, GAMES } = sandbox.out;

// ---- make lots of questions: every sentence they say must be in glLines() ----
const known = new Set(lines), missing = new Map(), used = new Set();
const ui = new Proxy({}, { get: () => () => Promise.resolve() });   // the steps' screen actions are not run here
const kinds = GAMES.find(g => g.id === 'pattern').levels.map(L => L.cfg.kind);
let made = 0;
for (const kind of kinds) {
  if (!GEN[kind]) throw new Error('no question maker for ' + kind);
  for (let i = 0; i < 3000; i++) {
    const q = GEN[kind]();
    const sigs = new Set(q.opts.map(o => o.sig));
    if (q.opts.length !== 4 || sigs.size !== 4 || !(q.ans >= 0 && q.ans < 4)) throw new Error(kind + ': bad options ' + JSON.stringify(q.opts.map(o => o.sig)));
    if (q.figs[q.blank] !== null) throw new Error(kind + ': the blank is not empty');
    for (const t of [q.ask].concat(q.steps(ui).map(s => s.t))) { used.add(t); if (!known.has(t)) missing.set(t, kind); }
    made++;
  }
}

const pg = GAMES.find(g => g.id === 'pattern');
const all = lines.concat(pg.levels.map(L => pg.name + '，' + L.t));   // picking a level says its name
const digits = all.filter(t => /\d/.test(t));
if (digits.length) throw new Error('write numbers as Chinese in GL_T, the page looks lines up after cnText(): ' + digits.join(' / '));
const out = all.map(t => ({ role: 'n', key: t, segs: [t] }));
fs.writeFileSync(path.join(__dirname, 'lines-gl.json'), JSON.stringify(out, null, 0));
console.log(`找规律: ${made} questions made, ${used.size} different sentences said; ${out.length} lines, ${all.reduce((n, t) => n + t.length, 0)} chars -> dev/voice/lines-gl.json`);
const never = lines.filter(t => !used.has(t) && [sandbox.out.T.stuck, sandbox.out.T.why, sandbox.out.T.tapNow].indexOf(t) < 0);   // those three are said outside the steps
if (never.length) console.log(`  listed but not said in ${made} questions (fine if rare): ` + never.join(' / '));
if (missing.size) { console.log('NOT COVERED (add them to glLines() in index.html):'); missing.forEach((k, t) => console.log('  ' + k + ': ' + t)); process.exitCode = 1; }
