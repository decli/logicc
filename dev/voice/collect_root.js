// Every line the logic games on the home page (../../index.html) can say, as the page will look it up.
// Fixed lines are read straight out of the page; lines with numbers or names in them are expanded
// over every value they can take. A Voice.say() this script does not know about is reported, so a new
// line never silently falls back to the device voice.
//   node dev/voice/collect_root.js   ->  dev/voice/lines-root.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '../..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// ---- read pieces of the page source ----
function skipString(s, i) { const q = s[i]; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; } return i + 1; }
function balanced(s, open) {   // s[open] is ( [ or { ; returns index just past its match, skipping strings
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
function grab(decl) {   // "const NAME = [...]" or "function name(...) {...}" -> source text
  const at = src.indexOf(decl); if (at < 0) throw new Error('not found: ' + decl);
  const open = src.slice(at).search(/[\[{]/) + at;
  const body = decl.startsWith('function') ? src.indexOf('{', src.indexOf(')', at)) : open;
  return src.slice(at, balanced(src, body));
}
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext([grab('const GAMES = ['), grab('const PRAISE = ['), grab('const CN_DIG = ['), grab('function cnNum('), grab('function cnText('),
  'this.GAMES = GAMES; this.PRAISE = PRAISE; this.cnText = cnText;'].join('\n'), sandbox);
const { GAMES, PRAISE, cnText } = sandbox;
const SHAPES = [...grab('const SHAPE_LIB = [').matchAll(/\bn: '([^']+)'/g)].map(m => m[1]);
const WHY = [...src.matchAll(/why: '([^']+)'/g)].map(m => m[1]);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const lines = new Map();   // looked-up text -> what we send to the voice
// we usually send the digits (the voice reads 2 根 as 两根); cn: send Chinese numerals instead (2 分成 must stay 二分成, not 两分成)
function add(t, cn) { if (!t) return; const key = cnText(t); if (!lines.has(key)) lines.set(key, cn ? key : t); }

// ---- 1. every Voice.say / Voice.short call in the page ----
const KNOWN = [   // calls built at run time, expanded below; matched on a piece of their argument
  "g.name + '，' + L.t", "'红色的 '", "'这次倒着找，先找 '", "'一共要 '", "' 分成 ' + a + '、'", "' 和 ' + b + ' 合起来是几？'",
  "' 分成几和 '", "' 分成 ' + a + ' 和几？'", 'c.why', "'画的都对，还差 '", "'画好啦，是一个'", "'这一笔画完了，跳到 '",
  "'这次倒着数，从 '", "'还差 ' + left", "'先把 ' + need", "'一次消掉 '",
];
const calls = [...src.matchAll(/Voice\.(say|short)\(/g)];
const unknown = [];
for (const m of calls) {
  const open = m.index + m[0].length - 1, arg = src.slice(open + 1, balanced(src, open) - 1);
  // a string literal that is not glued to anything with + is a whole line (often one branch of a ?: chain)
  for (const x of arg.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'/g)) {
    const before = arg.slice(0, x.index).trimEnd(), after = arg.slice(x.index + x[0].length).trimStart();
    if (/[\u4e00-\u9fff]/.test(x[1]) && !before.endsWith('+') && !after.startsWith('+') && !/^[\s，。、！？]|\s$/.test(x[1])) add(x[1]);
  }
  if (KNOWN.some(k => arg.includes(k))) continue;
  const code = arg.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, "''");
  if (/\+/.test(code) || (!/'/.test(arg) && !/^\s*$/.test(code))) unknown.push(src.slice(0, m.index).split('\n').length + ': ' + arg.slice(0, 90));
}

// ---- 2. lines with values in them ----
for (const g of GAMES) for (const L of (g.levels || [])) add(g.name + '，' + L.t);                     // picking a level
for (const v of range(1, 25)) { add(String(v)); add('这次倒着找，先找 ' + v); add('按顺序找数字，先找 ' + v); }  // 找数字
for (const v of range(1, 13)) { add('红色的 ' + v); add('蓝色的 ' + v); }
for (const T of range(1, 10)) add('一共要 ' + T + ' 个点，还差几个？');                                     // 数点点
for (const N of range(2, 10)) {                                                                       // 凑数字
  for (const a of range(1, N - 1)) { add(N + ' 分成 ' + a + ' 和几？', true); add(N + ' 分成几和 ' + a + '？', true); add(a + ' 和 ' + (N - a) + ' 合起来是几？', true); }
  for (const a of range(1, N - 2)) for (const b of range(1, N - a - 1)) add(N + ' 分成 ' + a + '、' + b + ' 和几？', true);
}
for (const w of WHY) add(w);                                                                          // 照镜子
for (const r of range(1, 12)) add('画的都对，还差 ' + r + ' 个');
for (const n of SHAPES) add('画好啦，是一个' + n);                                                       // 连点成画
for (const k of range(1, 60)) { add('这一笔画完了，跳到 ' + k); add('下一个是 ' + k); add('这次倒着数，从 ' + k + ' 开始往回连'); }
add('按双数连，2、4、6 这样往下'); add('从 1 开始，按数字顺序连起来'); add('从 1 开始，按数字顺序连起来，中间要抬笔跳一次');
for (const k of range(1, 5)) { add('还差 ' + k + ' 根'); add('先把 ' + k + ' 根胡萝卜都捡到，再回家'); }       // 走迷宫
for (const k of range(2, 6)) add('一次消掉 ' + k + ' 行，太厉害了');                                        // 方块拼拼
for (const p of PRAISE) add(p);

const out = [...lines].map(([key, send]) => ({ role: 'n', key, segs: [send] }));
fs.writeFileSync(path.join(__dirname, 'lines-root.json'), JSON.stringify(out, null, 0));
console.log(`home page: ${calls.length} speech calls, ${out.length} lines, ${out.reduce((a, o) => a + o.key.length, 0)} chars -> dev/voice/lines-root.json`);
if (unknown.length) { console.log('NOT COVERED (add them to KNOWN + section 2):'); unknown.forEach(u => console.log('  ' + u)); process.exitCode = 1; }
