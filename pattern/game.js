// 思维小画本 · 找规律。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 9 找规律（图形推理） ==============   ================================================================ */
/* ==GL-DATA== 出题和讲解的文字：dev/voice/collect_gl.js 把这一段拿去列出所有要录的句子，这一段里不碰页面 */
const GL_INK = '#2A2523', GL_SOFT = '#C9C2B4';
const GL_HEX = { red: '#E8452C', orange: '#F08A24', yellow: '#F5B921', green: '#3FA34D', blue: '#2E7DD1', purple: '#7B4BC9', pink: '#E4568E', teal: '#12A5A0' };
const GL_LETTER = ['A', 'B', 'C', 'D'];
const GL_NUM = ['零', '一', '两', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const GL_SHAPES = ['circle', 'square', 'tri', 'star', 'heart', 'diamond'];
const GL_SHAPE_NAME = { circle: '圆形', square: '正方形', tri: '三角形', star: '星星', heart: '爱心', diamond: '菱形' };
const GL_DOT_NAME = { circle: '圆点', tri: '三角形', star: '星星', heart: '爱心' };
const GL_COLORS = ['red', 'yellow', 'blue'];
const GL_COLOR_NAME = { red: '红色', yellow: '黄色', blue: '蓝色' };
const GL_RING = [0, 1, 2, 5, 8, 7, 6, 3];   // 3×3 外圈的八个格子，按顺时针排
// 套在一起的三层：每一行用一套东西（两套形状、一套颜色），三角形和菱形不放在一套里（尖的套尖的，最里面会太小）
const GL_NEST_SETS = [['circle', 'square', 'tri'], ['circle', 'square', 'diamond'], GL_COLORS];
const GL_NEST_NAME = { circle: '圆形', square: '正方形', tri: '三角形', diamond: '菱形', red: '红色', yellow: '黄色', blue: '蓝色' };
const GL_T = {
  askSeq: '看看前面几个图的规律，问号里该放哪一个？',
  askGrid: '看看每一行的规律，问号里该放哪一个？',
  stuck: '不会也没关系，点小灯泡，听我讲一讲',
  why: '想知道为什么吗？点小灯泡听一听',
  tapNow: '现在你来点一下答案吧',
  ans: k => '答案是 ' + GL_LETTER[k],
  cw: '顺时针，就是和钟表指针转的方向一样',
  ccw: '逆时针，就是和钟表指针转的方向反过来',
  // 数量
  cntAsk: s => s ? '数一数，每一格里有几个' + GL_DOT_NAME[s] : '数一数，每一格里一共有几个图形，什么形状都算',
  cntN: n => GL_NUM[n] + '个',
  cntStep: d => '每次' + (d > 0 ? '多' : '少') + GL_NUM[Math.abs(d)] + '个',
  cntRes: n => '所以问号里应该有' + GL_NUM[n] + '个',
  // 遍历
  latRow: '看问号在的这一行',
  latHas: ss => '每一行都有' + ss.slice(0, -1).map(s => GL_SHAPE_NAME[s]).join('、') + '和' + GL_SHAPE_NAME[ss[ss.length - 1]],
  latMiss: s => '这一行还缺' + GL_SHAPE_NAME[s],
  latColor: '颜色也一样，每一行都有红、黄、蓝三种颜色',
  latMissC: c => '颜色还缺' + GL_COLOR_NAME[c],
  // 平移
  movLook: '看黑色的格子',
  movRule: (d, k) => '它每次沿着外圈，' + (d > 0 ? '顺时针' : '逆时针') + '走' + GL_NUM[k] + '格',
  movNext: k => '再走' + GL_NUM[k] + '格，就到了这里',
  // 旋转
  rotLook: '看箭头指着哪个点',
  rotRule: (d, k) => '它每次' + (d > 0 ? '顺时针' : '逆时针') + '转' + GL_NUM[k] + '格',
  rotNext: k => '再转' + GL_NUM[k] + '格，就指到这里',
  // 叠加
  uniRow1: '看第一行：把前两个图叠在一起，就是第三个',
  row2: '第二行也是这样',
  uniRow3: '所以第三行，把前两个叠起来，就是问号里的图',
  // 线数
  lnAsk: '数一数，每个图有几条直线',
  lnN: n => GL_NUM[n] + '条',
  lnStep: '每次多一条',
  lnSame: n => '每个图都是' + GL_NUM[n] + '条',
  lnRes: n => '所以问号里应该有' + GL_NUM[n] + '条直线',
  // 去同存异
  xorRow1: '看第一行：把前两个图叠在一起',
  xorRule: '两个都涂黑的格子，消掉；只有一个涂黑的，留下来',
  xorRow3: '所以第三行叠起来，一样的消掉，就是问号里的图',
  // 两条规律
  twoLook: '这道题有两个球在动，我们一个一个看',
  twoRule: (w, d, k) => (w ? '再看白球，它' : '先看黑球，它') + '每次' + (d > 0 ? '顺时针' : '逆时针') + '走' + GL_NUM[k] + '格',
  twoEnd: '两个球都走对了的，只有这一个',
  // 挑战 · 交点数
  crAsk: '数一数，弯弯的线穿过直线几次',
  crN: n => GL_NUM[n] + '次',
  crStep: d => '每次' + (d > 0 ? '多' : '少') + '穿过一次',
  crSame: n => '每个图都穿过' + GL_NUM[n] + '次',
  crRes: n => '所以问号里的线，要穿过直线' + GL_NUM[n] + '次',
  // 挑战 · 三层套在一起（位置遍历）
  nestLook: '看第一行：每个图都是三层，一层套一层',
  nestOuter: '看最外面一层，三个图都不一样',
  nestAll: '中间一层、最里面一层，也是三样各一个',
  nestOut: s => '最外面一层，还缺' + GL_NEST_NAME[s],
  nestMid: s => '中间一层，还缺' + GL_NEST_NAME[s],
  nestIn: s => '最里面一层，还缺' + GL_NEST_NAME[s],
  // 挑战 · 小圆圈绕着方框走，框里框外轮着来
  orbLook: '小圆圈有两样在变：走到哪儿，在框里还是框外。我们一样一样看',
  orbPos: (d, k) => '先看位置：它每次沿着方框，' + (d > 0 ? '顺时针' : '逆时针') + '走' + GL_NUM[k] + '步',
  orbSide: '再看里外：一次在框里，一次在框外，轮着来',
  orbNext: s => '所以问号里的小圆圈，走到这里，还要在框' + (s ? '里' : '外')
};
// 讲解会说的每一句（语音包照这个录；collect_gl.js 还会把每类题出几千道，查有没有漏掉的说法）
function glLines() {
  const out = [], add = t => { if (out.indexOf(t) < 0) out.push(t); };
  [GL_T.askSeq, GL_T.askGrid, GL_T.stuck, GL_T.why, GL_T.tapNow, GL_T.cw, GL_T.ccw].forEach(add);
  [0, 1, 2, 3].forEach(k => add(GL_T.ans(k)));
  [null, 'circle', 'tri', 'star', 'heart'].forEach(s => add(GL_T.cntAsk(s)));
  for (let n = 1; n <= 9; n++) add(GL_T.cntN(n));   // 题里的格子最多 9 个，答案 2 到 10 个
  for (let n = 2; n <= 10; n++) add(GL_T.cntRes(n));
  [1, 2, -1].forEach(d => add(GL_T.cntStep(d)));
  add(GL_T.latRow); add(GL_T.latColor);
  GL_SHAPES.forEach((a, i) => GL_SHAPES.forEach((b, j) => GL_SHAPES.forEach((c, l) => { if (i < j && j < l) add(GL_T.latHas([a, b, c])); })));
  GL_SHAPES.forEach(s => add(GL_T.latMiss(s)));
  GL_COLORS.forEach(c => add(GL_T.latMissC(c)));
  [GL_T.movLook, GL_T.rotLook, GL_T.uniRow1, GL_T.row2, GL_T.uniRow3, GL_T.lnAsk, GL_T.lnStep,
    GL_T.xorRow1, GL_T.xorRule, GL_T.xorRow3, GL_T.twoLook, GL_T.twoEnd].forEach(add);
  [1, -1].forEach(d => [1, 2].forEach(k => { add(GL_T.movRule(d, k)); add(GL_T.rotRule(d, k)); add(GL_T.twoRule(0, d, k)); add(GL_T.twoRule(1, d, k)); }));
  [1, 2].forEach(k => { add(GL_T.movNext(k)); add(GL_T.rotNext(k)); });
  for (let n = 1; n <= 7; n++) add(GL_T.lnN(n));    // 题里的图 1 到 7 条线，答案 3 到 8 条
  for (let n = 3; n <= 8; n++) add(GL_T.lnRes(n));
  for (let n = 3; n <= 6; n++) add(GL_T.lnSame(n));
  [GL_T.crAsk, GL_T.nestLook, GL_T.nestOuter, GL_T.nestAll, GL_T.orbLook, GL_T.orbSide].forEach(add);
  for (let n = 1; n <= 7; n++) add(GL_T.crN(n));    // 题里的线穿过 1 到 7 次，答案 2 到 7 次
  [1, -1].forEach(d => add(GL_T.crStep(d)));
  for (let n = 2; n <= 5; n++) add(GL_T.crSame(n));
  for (let n = 2; n <= 7; n++) add(GL_T.crRes(n));
  GL_NEST_SETS.forEach(set => set.forEach(x => { add(GL_T.nestOut(x)); add(GL_T.nestMid(x)); add(GL_T.nestIn(x)); }));
  [1, -1].forEach(d => [1, 2].forEach(k => add(GL_T.orbPos(d, k))));
  [0, 1].forEach(x => add(GL_T.orbNext(x)));
  return out;
}

const glMod = (v, m) => ((v % m) + m) % m;
// 正确答案 + 干扰项（按给的顺序挑前三个不重样的）→ 打乱成 A B C D
function glPick(right, cands) {
  const seen = [right.sig], wrong = [];
  cands.forEach(f => { if (wrong.length < 3 && seen.indexOf(f.sig) < 0) { seen.push(f.sig); wrong.push(f); } });
  if (wrong.length < 3) return null;
  const opts = shuffle([right].concat(wrong));
  return { opts: opts, ans: opts.indexOf(right) };
}

// —— 1 数量：每格里的东西每次多几个 / 少几个（两种形状混着时数总数） ——
function glScatter(n) {   // 4×4 的格点里随机挑 n 个，再抖一抖，不会叠在一起
  return shuffle(range(0, 15)).slice(0, n).map(i => [14 + 24 * (i % 4) + rnd(5) - 2, 14 + 24 * ((i / 4) | 0) + rnd(5) - 2]);
}
function glCountFig(n, kinds, color) {
  const pos = glScatter(n), ks = shuffle(pos.map((_, i) => kinds[i % kinds.length]));
  return { k: 'count', sig: n, color: color, items: pos.map((p, i) => ({ x: p[0], y: p[1], s: ks[i] })) };
}
function glGenCount() {
  const one = rnd(2) === 0, kinds = one ? [pick(['circle', 'tri', 'star', 'heart'])] : shuffle(['circle', 'tri', 'star', 'heart']).slice(0, 2);
  const color = pick(['red', 'orange', 'blue', 'green', 'purple']);
  const r = rnd(10), d = r < 6 ? 1 : r < 8 ? 2 : -1;
  const s = d === 1 ? 1 + rnd(5) : d === 2 ? 1 + rnd(2) : 6 + rnd(4);
  const ns = range(0, 4).map(i => s + d * i), n = ns[4];
  const o = glPick(glCountFig(n, kinds, color), shuffle([n + 1, n - 1, n + 2, n - 2]).concat([n + 3]).filter(v => v >= 1 && v <= 12).map(v => glCountFig(v, kinds, color)));
  return {
    lay: 'seq', figs: ns.slice(0, 4).map(v => glCountFig(v, kinds, color)).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
    steps: ui => [{ t: GL_T.cntAsk(one ? kinds[0] : null) }]
      .concat(ns.slice(0, 4).map((v, i) => ({ t: GL_T.cntN(v), fx: () => ui.tick(i).then(() => ui.badge(i, String(v))) })))
      .concat([{ t: GL_T.cntStep(d) }, { t: GL_T.cntRes(n), fx: () => ui.badge(4, String(n)) }, { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }])
  };
}

// —— 2 遍历：九宫格每一行、每一列，三种形状各出现一次（第二种：颜色也各出现一次） ——
function glGenLatin() {
  const two = rnd(2) === 0, ss = shuffle(GL_SHAPES).slice(0, 3), cs = shuffle(GL_COLORS);
  const pr = shuffle([0, 1, 2]), pc = shuffle([0, 1, 2]);
  // (r+c) 和 (2r+c) 模 3 是一对正交拉丁方：九格里形状和颜色的搭配各不相同，颜色没法跟着形状猜
  const sh = i => ss[(pr[(i / 3) | 0] + pc[i % 3]) % 3], co = i => two ? cs[(2 * pr[(i / 3) | 0] + pc[i % 3]) % 3] : 'purple';
  const fig = (s, c) => ({ k: 'shape', sig: s + '/' + c, s: s, c: c });
  const blank = rnd(9), row = (blank / 3) | 0, aS = sh(blank), aC = co(blank);
  const oS = shuffle(ss.filter(s => s !== aS)), oC = shuffle(GL_COLORS.filter(c => c !== aC));
  const wrong = two
    ? [fig(aS, oC[0]), fig(oS[0], aC), fig(oS[1], oC[1]), fig(oS[1], oC[0]), fig(aS, oC[1])]
    : shuffle([fig(oS[0], aC), fig(oS[1], aC), fig(pick(GL_SHAPES.filter(s => ss.indexOf(s) < 0)), aC)]);
  const o = glPick(fig(aS, aC), wrong);
  return {
    lay: 'grid', figs: range(0, 8).map(i => (i === blank ? null : fig(sh(i), co(i)))), blank: blank, opts: o.opts, ans: o.ans, ask: GL_T.askGrid,
    steps: ui => [
      { t: GL_T.latRow, fx: () => ui.row(row) },
      { t: GL_T.latHas(GL_SHAPES.filter(s => ss.indexOf(s) >= 0)) },
      { t: GL_T.latMiss(aS), fx: () => ui.ghost(blank, fig(aS, two ? null : aC)) }
    ].concat(two ? [{ t: GL_T.latColor }, { t: GL_T.latMissC(aC), fx: () => ui.ghost(blank, fig(aS, aC)) }] : [])
      .concat([{ t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }])
  };
}

// —— 3 平移：黑格子沿着 3×3 的外圈，每次顺 / 逆时针走一格或两格 ——
function glGenMove() {
  const d = pick([1, -1]), k = rnd(10) < 6 ? 1 : 2, p0 = rnd(8);
  const at = i => glMod(p0 + d * k * i, 8), fig = r => ({ k: 'ring', sig: GL_RING[r], b: GL_RING[r] });
  const ra = at(4), path = r0 => range(0, k).map(j => GL_RING[glMod(r0 + d * j, 8)]);
  const o = glPick(fig(ra), [ra - d, ra + d, ra - d * k, ra + 2 * d, ra - 2 * d].map(r => fig(glMod(r, 8))));
  return {
    lay: 'seq', figs: range(0, 3).map(i => fig(at(i))).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
    steps: ui => [
      { t: GL_T.movLook, fx: () => { for (let i = 0; i < 4; i++) ui.draw(i, g => glRingMark(g, GL_RING[at(i)])); } },
      { t: GL_T.movRule(d, k), fx: () => { for (let i = 1; i < 4; i++) ui.draw(i, g => glRingWalk(g, path(at(i - 1)), false)); } },
      { t: d > 0 ? GL_T.cw : GL_T.ccw, fx: () => ui.chip(d) },
      { t: GL_T.movNext(k), fx: () => { ui.ghost(4, fig(ra)); ui.draw(4, g => glRingWalk(g, path(at(3)), false)); } },
      { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
    ]
  };
}

// —— 4 旋转：箭头在八个点之间，每次顺 / 逆时针转一格或两格 ——
function glGenRotate() {
  const d = pick([1, -1]), k = rnd(10) < 5 ? 1 : 2, a0 = rnd(8);
  const at = i => glMod(a0 + d * k * i, 8), fig = a => ({ k: 'dial', sig: a, a: a }), ra = at(4);
  const o = glPick(fig(ra), [ra - d, ra + d, ra - d * k, ra + 2 * d, ra - 2 * d, ra + 4].map(a => fig(glMod(a, 8))));
  return {
    lay: 'seq', figs: range(0, 3).map(i => fig(at(i))).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
    steps: ui => [
      { t: GL_T.rotLook, fx: () => { for (let i = 0; i < 4; i++) ui.draw(i, g => glDialMark(g, at(i))); } },
      { t: GL_T.rotRule(d, k), fx: () => { for (let i = 1; i < 4; i++) ui.draw(i, g => glDialTurn(g, at(i - 1), d, k)); } },
      { t: d > 0 ? GL_T.cw : GL_T.ccw, fx: () => ui.chip(d) },
      { t: GL_T.rotNext(k), fx: () => { ui.ghost(4, fig(ra)); ui.draw(4, g => glDialTurn(g, at(3), d, k)); } },
      { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
    ]
  };
}

// —— 叠加 / 去同存异共用：3×3 小方格里涂黑几格 ——
const glCells = on => { const s = on.slice().sort((a, b) => a - b); return { k: 'cells', sig: s.join(','), on: s }; };
function glMoveOne(on) { const free = range(0, 8).filter(c => on.indexOf(c) < 0), r = on.slice(); r.splice(rnd(r.length), 1, pick(free)); return r; }
// —— 5 叠加：每一行，前两个图叠在一起就是第三个 ——
function glGenUnion() {
  const rows = range(0, 2).map(() => { const c = shuffle(range(0, 8)), na = 2 + rnd(2), nb = 2 + rnd(2); return [c.slice(0, na), c.slice(na, na + nb)]; });
  const figs = [];
  rows.forEach((ab, r) => { figs.push(glCells(ab[0]), glCells(ab[1]), r < 2 ? glCells(ab[0].concat(ab[1])) : null); });
  const right = rows[2][0].concat(rows[2][1]), free = range(0, 8).filter(c => right.indexOf(c) < 0);
  const o = glPick(glCells(right), shuffle([glMoveOne(right), glMoveOne(right), right.slice(1), right.concat([pick(free)])]).concat([glMoveOne(right), rows[2][0]]).map(glCells));
  return {
    lay: 'grid', figs: figs, blank: 8, opts: o.opts, ans: o.ans, ask: GL_T.askGrid,
    steps: ui => [
      { t: GL_T.uniRow1, fx: () => ui.fly(0, 'or') },
      { t: GL_T.row2, fx: () => ui.fly(1, 'or') },
      { t: GL_T.uniRow3, fx: () => ui.fly(2, 'or') },
      { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
    ]
  };
}

// —— 6 线数：数每个图有几条直线（折线拐一下就是新的一条，多边形几条边就是几条） ——
function glPrim(p) {
  if (p >= 3 && (p === 6 || rnd(2) === 0)) {
    const r0 = rnd(360);
    return { closed: true, pts: range(0, p - 1).map(j => { const a = (r0 + j * 360 / p) * Math.PI / 180; return [Math.sin(a), -Math.cos(a)]; }) };
  }
  let pts = p === 1 ? [[-1, .7], [1, -.7]] : range(0, p).map(j => [-1 + 2 * j / p, j % 2 ? .72 : -.72]);
  if (rnd(2)) pts = pts.map(q => [q[1], q[0]]);   // 竖过来
  return { closed: false, pts: pts };
}
function glLineFig(n) {
  let parts;
  if (n === 1 || (n <= 6 && rnd(3) > 0)) parts = [n];
  else { const a = clamp(1 + rnd(n - 1), Math.max(1, n - 5), Math.min(5, n - 1)); parts = [a, n - a]; }
  const vert = rnd(2) === 0;
  const at = parts.length === 1 ? [[50, 50, 34]] : vert ? [[50, 26, 16], [50, 74, 16]] : [[26, 50, 16], [74, 50, 16]];
  return {
    k: 'lines', sig: n,
    parts: parts.map((p, i) => { const pr = glPrim(p), c = at[i]; return { closed: pr.closed, pts: pr.pts.map(q => [+(c[0] + q[0] * c[2]).toFixed(1), +(c[1] + q[1] * c[2]).toFixed(1)]), cx: c[0], cy: c[1] }; })
  };
}
function glGenLines() {
  const same = rnd(10) < 3, s = same ? 3 + rnd(4) : 1 + rnd(4);
  const ns = range(0, 4).map(i => (same ? s : s + i)), n = ns[4];
  const o = glPick(glLineFig(n), shuffle([n + 1, n - 1, n + 2].filter(v => v >= 1)).concat([n - 2, n + 3]).filter(v => v >= 1 && v <= 9).map(glLineFig));
  return {
    lay: 'seq', figs: ns.slice(0, 4).map(glLineFig).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
    steps: ui => [{ t: GL_T.lnAsk }]
      .concat(ns.slice(0, 4).map((v, i) => ({ t: GL_T.lnN(v), fx: () => ui.tick(i).then(() => ui.badge(i, String(v))) })))
      .concat([{ t: same ? GL_T.lnSame(s) : GL_T.lnStep }, { t: GL_T.lnRes(n), fx: () => ui.badge(4, String(n)) }, { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }])
  };
}

// —— 7 去同存异：每一行前两个叠在一起，两个都黑的消掉，只有一个黑的留下 ——
function glGenXor() {
  const mk = () => {
    for (;;) {
      const a = shuffle(range(0, 8)).slice(0, 3 + rnd(2)), b = shuffle(range(0, 8)).slice(0, 3 + rnd(2));
      const both = a.filter(c => b.indexOf(c) >= 0), x = a.filter(c => b.indexOf(c) < 0).concat(b.filter(c => a.indexOf(c) < 0));
      if (both.length >= 1 && both.length <= 2 && x.length >= 2) return [a, b, x, both];
    }
  };
  const rows = [mk(), mk(), mk()], figs = [];
  rows.forEach((r, i) => { figs.push(glCells(r[0]), glCells(r[1]), i < 2 ? glCells(r[2]) : null); });
  const r3 = rows[2];
  const o = glPick(glCells(r3[2]), [r3[2].concat(r3[3]), glMoveOne(r3[2]), r3[3], r3[2].slice(1), glMoveOne(r3[2])].map(glCells));
  return {
    lay: 'grid', figs: figs, blank: 8, opts: o.opts, ans: o.ans, ask: GL_T.askGrid,
    steps: ui => [
      { t: GL_T.xorRow1, fx: () => ui.fly(0, 'stack') },
      { t: GL_T.xorRule, fx: () => ui.vanish(0) },
      { t: GL_T.row2, fx: () => ui.fly(1, 'xor') },
      { t: GL_T.xorRow3, fx: () => ui.fly(2, 'xor') },
      { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
    ]
  };
}

// —— 8 两条规律：黑球、白球在外圈各走各的 ——
function glGenTwo() {
  for (;;) {
    const db = pick([1, -1]), kb = 1 + rnd(2), dw = pick([1, -1]), kw = 1 + rnd(2);
    if (db === dw && kb === kw) continue;   // 两个球走法不一样，才得两条都盯住
    const b0 = rnd(8), w0 = rnd(8), B = i => glMod(b0 + db * kb * i, 8), W = i => glMod(w0 + dw * kw * i, 8);
    if (range(0, 4).some(i => B(i) === W(i))) continue;
    const fig = (b, w) => ({ k: 'ring', ball: true, sig: glMod(b, 8) + '/' + glMod(w, 8), b: GL_RING[glMod(b, 8)], w: GL_RING[glMod(w, 8)] });
    const rb = B(4), rw = W(4);
    const cand = [[rb, W(3)], [B(3), rw], [rb, rw + dw], [rb - db, rw], [B(3), W(3)], [rb + db, rw - dw], [rb, rw - dw], [rb + db, rw]]
      .filter(p => glMod(p[0], 8) !== glMod(p[1], 8)).map(p => fig(p[0], p[1]));
    const o = glPick(fig(rb, rw), cand);
    if (!o) continue;
    const path = (r0, dd, kk) => range(0, kk).map(j => GL_RING[glMod(r0 + dd * j, 8)]);
    return {
      lay: 'seq', figs: range(0, 3).map(i => fig(B(i), W(i))).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
      steps: ui => [
        { t: GL_T.twoLook },
        { t: GL_T.twoRule(0, db, kb), fx: () => { for (let i = 1; i < 4; i++) ui.draw(i, g => glRingWalk(g, path(B(i - 1), db, kb), true, GL_HEX.blue)); } },
        { t: GL_T.twoRule(1, dw, kw), fx: () => { for (let i = 1; i < 4; i++) ui.draw(i, g => glRingWalk(g, path(W(i - 1), dw, kw), true, GL_HEX.orange)); } },
        { t: GL_T.twoEnd, fx: () => { ui.ghost(4, fig(rb, rw)); ui.draw(4, g => { glRingWalk(g, path(B(3), db, kb), true, GL_HEX.blue); glRingWalk(g, path(W(3), dw, kw), true, GL_HEX.orange); }); } },
        { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
      ]
    };
  }
}
// —— 9 挑战 · 交点数：一条弯弯的线穿过横线几次（有的弯没碰到横线，不算） ——
// 线是一串高高低低的转折点，相邻两点之间用两头水平的三次曲线连：一段里只往一个方向走，
// 所以一高一低的两点之间正好穿过横线一次，同一边的两点之间不穿过
function glCrossFig(n) {
  const side = [], up = rnd(2) === 0;
  for (let j = 0; j <= n; j++) side.push((j % 2 === 0) === up ? -1 : 1);
  const wig = n <= 6 && rnd(10) < 4 ? rnd(2) : -1;   // 在开头或结尾加一个不碰线的小弯
  let ys = side.map(sd => 50 + sd * (17 + rnd(17)));
  if (wig === 0) ys = [50 + side[0] * (19 + rnd(14)), 50 + side[0] * (9 + rnd(4))].concat(ys);
  if (wig === 1) { const sd = side[n]; ys = ys.concat([50 + sd * (9 + rnd(4)), 50 + sd * (19 + rnd(14))]); }
  const m = ys.length, x0 = 10 + rnd(4), x1 = 90 - rnd(4), sp = (x1 - x0) / (m - 1);
  const ext = ys.map((y, j) => [+(x0 + sp * j + (j && j < m - 1 ? (rnd(7) - 3) * sp / 22 : 0)).toFixed(1), y]);
  const xs = [];
  for (let j = 0; j + 1 < m; j++) {
    const a = ext[j], b = ext[j + 1];
    if ((a[1] - 50) * (b[1] - 50) >= 0) continue;
    const f = (50 - a[1]) / (b[1] - a[1]);
    let lo = 0, hi = 1;
    for (let it = 0; it < 30; it++) { const t = (lo + hi) / 2; if (3 * t * t - 2 * t * t * t < f) lo = t; else hi = t; }
    const t = (lo + hi) / 2;
    xs.push(+(a[0] + (b[0] - a[0]) * (1.5 * t - 1.5 * t * t + t * t * t)).toFixed(1));
  }
  return { k: 'cross', sig: n, ext: ext, xs: xs };
}
function glGenCross() {
  const r = rnd(10), d = r < 6 ? 1 : r < 8 ? 0 : -1;
  const s = d === 1 ? 1 + rnd(3) : d === 0 ? 2 + rnd(4) : 6 + rnd(2);
  const ns = range(0, 4).map(i => s + d * i), n = ns[4];
  const o = glPick(glCrossFig(n), shuffle([n + 1, n - 1, n + 2]).concat([n - 2, n + 3]).filter(v => v >= 1 && v <= 9).map(glCrossFig));
  return {
    lay: 'seq', figs: ns.slice(0, 4).map(glCrossFig).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
    steps: ui => [{ t: GL_T.crAsk }]
      .concat(ns.slice(0, 4).map((v, i) => ({ t: GL_T.crN(v), fx: () => ui.tick(i).then(() => ui.badge(i, String(v))) })))
      .concat([{ t: d ? GL_T.crStep(d) : GL_T.crSame(s) }, { t: GL_T.crRes(n), fx: () => ui.badge(4, String(n)) }, { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }])
  };
}

// —— 10 挑战 · 三层套在一起：每一行里，最外面、中间、最里面这三层，三样东西各轮一次 ——
// 三行各用一套不同的东西，所以不能拿整个图去别的行里找，得一层一层看
function glGenNest() {
  const mats = shuffle(GL_NEST_SETS).map(set => shuffle(set));
  const fig = ord => ({ k: 'nest', sig: ord.join('>'), mat: GL_COLORS.indexOf(ord[0]) >= 0 ? 'color' : 'shape', order: ord });
  const at = (r, c) => { const P = mats[r]; return [P[c % 3], P[(c + 1) % 3], P[(c + 2) % 3]]; };   // 每往右一个，最外面那层钻到最里面
  const figs = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) figs.push(r === 2 && c === 2 ? null : fig(at(r, c)));
  const P = mats[2], A = at(2, 2);
  // 干扰项：最外面对了、里面两层换了的；照抄这一行里已经有的；别的摆法
  const o = glPick(fig(A), [[P[2], P[1], P[0]], at(2, rnd(2))].concat(shuffle([[P[0], P[2], P[1]], [P[1], P[0], P[2]], at(2, 0), at(2, 1)])).map(fig));
  const part = n => Object.assign(fig(A), { show: n });
  return {
    lay: 'grid', figs: figs, blank: 8, opts: o.opts, ans: o.ans, ask: GL_T.askGrid,
    steps: ui => {
      const mark = (cs, j) => cs.forEach(c => ui.mark(c, g => { if (j >= 0) glNestMark(g, figs[c], j); }));   // 把第 j 层描成绿色（j < 0 只擦掉）
      return [
        { t: GL_T.nestLook, fx: () => ui.row(0) },
        { t: GL_T.nestOuter, fx: () => mark([0, 1, 2], 0) },
        { t: GL_T.nestAll },
        { t: GL_T.latRow, fx: () => { mark([0, 1, 2], -1); ui.row(2); } },
        { t: GL_T.nestOut(A[0]), fx: () => { mark([6, 7], 0); ui.ghost(8, part(1)); } },
        { t: GL_T.nestMid(A[1]), fx: () => { mark([6, 7], 1); ui.ghost(8, part(2)); } },
        { t: GL_T.nestIn(A[2]), fx: () => { mark([6, 7], 2); ui.ghost(8, part(3)); } },
        { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
      ];
    }
  };
}

// —— 11 挑战 · 两条规律：小圆圈沿着方框一步一步走，同时一次在框里、一次在框外 ——
// 方框上八个位置：四个角、四条边的中间，从左上角起顺时针数
function glGenOrbit() {
  const d = pick([1, -1]), k = rnd(10) < 7 ? 1 : 2, p0 = rnd(8), s0 = rnd(2);
  const P = i => glMod(p0 + d * k * i, 8), Sd = i => (s0 + i) % 2;   // 1 = 框里
  const fig = (p, sd) => ({ k: 'orbit', sig: glMod(p, 8) + '/' + sd, p: glMod(p, 8), s: sd });
  const pa = P(4), sa = Sd(4);
  const o = glPick(fig(pa, sa), shuffle([fig(pa, 1 - sa), fig(pa + d, sa), fig(P(3), sa)]).concat([fig(pa - d, sa), fig(pa + d, 1 - sa), fig(pa - d, 1 - sa)]));
  return {
    lay: 'seq', figs: range(0, 3).map(i => fig(P(i), Sd(i))).concat([null]), blank: 4, opts: o.opts, ans: o.ans, ask: GL_T.askSeq,
    steps: ui => [
      { t: GL_T.orbLook },
      { t: GL_T.orbPos(d, k), fx: () => { for (let i = 1; i < 4; i++) ui.draw(i, g => glOrbWalk(g, P(i - 1), Sd(i - 1), d, k)); } },
      { t: d > 0 ? GL_T.cw : GL_T.ccw, fx: () => ui.chip(d) },
      { t: GL_T.orbSide, fx: () => { for (let i = 0; i < 4; i++) ui.badge(i, Sd(i) ? '里' : '外'); } },
      { t: GL_T.orbNext(sa), fx: () => { ui.ghost(4, fig(pa, sa)); ui.draw(4, g => glOrbWalk(g, P(3), Sd(3), d, k)); ui.badge(4, sa ? '里' : '外'); } },
      { t: GL_T.ans(o.ans), fx: () => ui.point(o.ans) }
    ]
  };
}
const GL_GEN = { count: glGenCount, latin: glGenLatin, move: glGenMove, rotate: glGenRotate, union: glGenUnion, lines: glGenLines, xor: glGenXor, two: glGenTwo, cross: glGenCross, nest: glGenNest, orbit: glGenOrbit };
/* ==/GL-DATA== */

/* —— 画图：每个图是 100×100 的 SVG —— */
const glPts = a => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
function glShape(g, s, x, y, r, a) {
  let n;
  if (s === 'circle') n = sv('circle', { cx: x, cy: y, r: r * .92 }, g);
  else if (s === 'square') n = sv('rect', { x: x - r * .8, y: y - r * .8, width: r * 1.6, height: r * 1.6, rx: r * .1 }, g);
  else if (s === 'diamond') n = sv('polygon', { points: glPts([[x, y - r], [x + r * .78, y], [x, y + r], [x - r * .78, y]]) }, g);
  else if (s === 'tri') n = sv('polygon', { points: glPts([[x, y - r], [x + r * .98, y + r * .75], [x - r * .98, y + r * .75]]) }, g);
  else if (s === 'star') {
    const p = [];
    for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r * 1.05, an = Math.PI / 5 * i; p.push([x + rr * Math.sin(an), y + r * .1 - rr * Math.cos(an)]); }
    n = sv('polygon', { points: glPts(p) }, g);
  } else {
    const P = (u, v) => (x + u * r).toFixed(1) + ' ' + (y + v * r).toFixed(1);
    n = sv('path', { d: 'M' + P(0, .82) + 'C' + P(-.3, .55) + ' ' + P(-1, .15) + ' ' + P(-1, -.3) + 'C' + P(-1, -.8) + ' ' + P(-.42, -1) + ' ' + P(0, -.55) +
      'C' + P(.42, -1) + ' ' + P(1, -.8) + ' ' + P(1, -.3) + 'C' + P(1, .15) + ' ' + P(.3, .55) + ' ' + P(0, .82) + 'Z' }, g);
  }
  for (const k in a) if (a[k] != null) n.setAttribute(k, a[k]);
  return n;
}
const glCellXY = c => [22 + 28 * (c % 3), 22 + 28 * ((c / 3) | 0)];   // 外圈题 3×3 格子的中心
const glDialXY = (a, R) => [50 + R * Math.sin(a * Math.PI / 4), 50 - R * Math.cos(a * Math.PI / 4)];
const GL_CELL = 80 / 3;
function glDraw(g, f) {
  if (f.k === 'count') {
    f.items.forEach(it => glShape(g, it.s, it.x, it.y, 8.6, { fill: GL_HEX[f.color], stroke: GL_INK, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }));
  } else if (f.k === 'shape') {
    glShape(g, f.s, 50, 52, 31, { fill: f.c ? GL_HEX[f.c] : 'none', stroke: GL_INK, 'stroke-width': 3.6, 'stroke-linejoin': 'round', 'stroke-dasharray': f.c ? null : '7 5' });
  } else if (f.k === 'ring') {
    sv('rect', { x: 8, y: 8, width: 84, height: 84, fill: 'none', stroke: GL_INK, 'stroke-width': 2.6 }, g);
    sv('path', { d: 'M36 8V92M64 8V92M8 36H92M8 64H92', stroke: GL_INK, 'stroke-width': 1.6 }, g);
    if (!f.ball) { const p = glCellXY(f.b); sv('rect', { x: p[0] - 11, y: p[1] - 11, width: 22, height: 22, fill: GL_INK }, g); }
    else {
      const b = glCellXY(f.b), w = glCellXY(f.w);
      sv('circle', { cx: b[0], cy: b[1], r: 9.5, fill: GL_INK }, g);
      sv('circle', { cx: w[0], cy: w[1], r: 8.4, fill: '#fff', stroke: GL_INK, 'stroke-width': 3 }, g);
    }
  } else if (f.k === 'dial') {
    sv('circle', { cx: 50, cy: 50, r: 40, fill: 'none', stroke: GL_SOFT, 'stroke-width': 2.4 }, g);
    for (let a = 0; a < 8; a++) { const p = glDialXY(a, 40); sv('circle', { cx: p[0], cy: p[1], r: 3.6, fill: GL_SOFT }, g); }
    glArrow(g, [[50, 50], glDialXY(f.a, 31)], GL_INK, 6);
    sv('circle', { cx: 50, cy: 50, r: 5, fill: GL_INK }, g);
  } else if (f.k === 'cells') {
    f.on.forEach(c => sv('rect', { x: 10 + GL_CELL * (c % 3), y: 10 + GL_CELL * ((c / 3) | 0), width: GL_CELL, height: GL_CELL, fill: GL_INK }, g));
    sv('path', { d: 'M36.7 10V90M63.3 10V90M10 36.7H90M10 63.3H90', stroke: GL_SOFT, 'stroke-width': 1.4 }, g);
    sv('rect', { x: 10, y: 10, width: 80, height: 80, fill: 'none', stroke: GL_INK, 'stroke-width': 2.6 }, g);
  } else if (f.k === 'lines') {
    f.parts.forEach(p => sv(p.closed ? 'polygon' : 'polyline', { points: glPts(p.pts), fill: 'none', stroke: GL_INK, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g));
  } else if (f.k === 'cross') {
    sv('path', { d: 'M5 50H95', stroke: GL_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    let d = 'M' + f.ext[0][0] + ' ' + f.ext[0][1];
    for (let j = 1; j < f.ext.length; j++) {
      const a = f.ext[j - 1], b = f.ext[j], h = (b[0] - a[0]) / 2;
      d += 'C' + (a[0] + h).toFixed(1) + ' ' + a[1] + ' ' + (b[0] - h).toFixed(1) + ' ' + b[1] + ' ' + b[0] + ' ' + b[1];
    }
    sv('path', { d: d, fill: 'none', stroke: GL_INK, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  } else if (f.k === 'nest') {
    glNestLayers(f).forEach((L, j) => { if (j < (f.show || 3)) glNestOne(g, f, L, null); });
  } else if (f.k === 'orbit') {
    sv('rect', { x: 25, y: 25, width: 50, height: 50, fill: 'none', stroke: GL_INK, 'stroke-width': 3 }, g);
    const c = glOrbXY(f.p, f.s);
    sv('circle', { cx: c[0], cy: c[1], r: 8, fill: '#fff', stroke: GL_INK, 'stroke-width': 3 }, g);
  }
}
// 三层套在一起：外面一层先画，里面一层放进上一层的内切圆里（三角形的内切圆偏下，跟着往下挪）
const GL_NEST_FIT = { circle: [.92, .92, 0, 0], square: [1.131, .8, 0, 0], diamond: [1, .615, 0, 0], tri: [1.149, .575, .149, .175] };   // 外接圆半径、内切圆半径、外接圆心和内切圆心往下偏多少（都乘 r）
function glNestLayers(f) {
  if (f.mat === 'color') return f.order.map((s, j) => ({ s: s, x: 50, y: 50, r: [42, 28.5, 15][j] }));
  let cy = 50, room = 43;
  return f.order.map(s => {
    const m = GL_NEST_FIT[s], r = room / m[0], y = cy - m[2] * r;
    cy = y + m[3] * r; room = m[1] * r - 4.8;
    return { s: s, x: 50, y: y, r: r };
  });
}
function glNestOne(g, f, L, mark) {
  if (f.mat === 'color') sv('circle', { cx: 50, cy: 50, r: L.r, fill: mark ? 'none' : GL_HEX[L.s], stroke: mark || GL_INK, 'stroke-width': mark ? 4.6 : 2.4 }, g);
  else glShape(g, L.s, L.x, L.y, L.r, { fill: 'none', stroke: mark || GL_INK, 'stroke-width': mark ? 4.6 : 2.8, 'stroke-linejoin': 'round' });
}
function glNestMark(g, f, j) { glNestOne(g, f, glNestLayers(f)[j], GL_HEX.green); }
// 小圆圈在方框上的八个位置（左上角起顺时针）；框里就贴着边往里放，框外贴着边往外放（角上斜着贴住角）
const GL_ORB = [[25, 25], [50, 25], [75, 25], [75, 50], [75, 75], [50, 75], [25, 75], [25, 50]];
function glOrbXY(p, inside) {
  const a = GL_ORB[p], dx = Math.sign(50 - a[0]), dy = Math.sign(50 - a[1]);
  if (inside) return [a[0] + dx * 9.6, a[1] + dy * 9.6];
  const L = dx && dy ? 9.2 / Math.SQRT2 : 9.6;
  return [a[0] - dx * L, a[1] - dy * L];
}
// 从上一个位置沿着方框走过来：上一个位置画虚的圆圈，再沿着框画箭头
function glOrbWalk(g, p0, s0, d, k) {
  const c = glOrbXY(p0, s0);
  sv('circle', { cx: c[0], cy: c[1], r: 7.5, fill: 'none', stroke: GL_HEX.orange, 'stroke-width': 2.2, 'stroke-dasharray': '3 3' }, g);
  glArrow(g, glTrim(range(0, k).map(j => GL_ORB[glMod(p0 + d * j, 8)]), 2, 9.5), GL_HEX.orange, 3.8);
}
// 一段带箭头的路（讲解时画在图上）
function glArrow(g, pts, color, w) {
  w = w || 4;
  sv('polyline', { points: glPts(pts), fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const a = pts[pts.length - 2], b = pts[pts.length - 1], an = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 4 + w * 1.4;
  sv('polygon', { points: glPts([[b[0] + Math.cos(an) * w * .6, b[1] + Math.sin(an) * w * .6], [b[0] - L * Math.cos(an - .55), b[1] - L * Math.sin(an - .55)], [b[0] - L * Math.cos(an + .55), b[1] - L * Math.sin(an + .55)]]), fill: color }, g);
}
// 把路的两头各收一点，箭头停在格子边上，不盖住格子里的东西
function glTrim(pts, a, b) {
  const out = pts.map(p => p.slice()), cut = (p, q, d) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [p[0] + (q[0] - p[0]) * d / L, p[1] + (q[1] - p[1]) * d / L]; };
  out[0] = cut(out[0], out[1], a); out[out.length - 1] = cut(out[out.length - 1], out[out.length - 2], b);
  return out;
}
function glRingMark(g, c) { const p = glCellXY(c); sv('rect', { x: p[0] - 14, y: p[1] - 14, width: 28, height: 28, rx: 4, fill: 'none', stroke: GL_HEX.orange, 'stroke-width': 4 }, g); }
// 从上一个位置走过来的路：上一个位置画一个虚的影子，再画箭头
function glRingWalk(g, cells, ball, color) {
  color = color || GL_HEX.orange;
  const p0 = glCellXY(cells[0]);
  if (ball) sv('circle', { cx: p0[0], cy: p0[1], r: 8.6, fill: 'none', stroke: color, 'stroke-width': 2.4, 'stroke-dasharray': '3 3' }, g);
  else sv('rect', { x: p0[0] - 10, y: p0[1] - 10, width: 20, height: 20, fill: 'none', stroke: GL_SOFT, 'stroke-width': 2.4, 'stroke-dasharray': '3 3' }, g);
  glArrow(g, glTrim(cells.map(glCellXY), 6, 11), color, 3.6);
}
function glDialMark(g, a) { const p = glDialXY(a, 40); sv('circle', { cx: p[0], cy: p[1], r: 7.5, fill: 'none', stroke: GL_HEX.orange, 'stroke-width': 3.4 }, g); }
function glDialTurn(g, a0, d, k) {
  glArrow(g, [[50, 50], glDialXY(a0, 28)], GL_SOFT, 5);
  const pts = [];
  for (let j = 0; j <= 12; j++) pts.push(glDialXY(a0 + d * k * j / 12, 47));
  glArrow(g, glTrim(pts, 2, 3), GL_HEX.orange, 3.2);
}
// 叠加题讲解：把这几格涂上颜色（蓝的来自每行第一个图，橙的来自第二个）
function glTint(g, on, color, op) {
  on.forEach(c => sv('rect', { x: 10 + GL_CELL * (c % 3), y: 10 + GL_CELL * ((c / 3) | 0), width: GL_CELL, height: GL_CELL, fill: color, opacity: op }, g));
  sv('path', { d: 'M36.7 10V90M63.3 10V90M10 36.7H90M10 63.3H90', stroke: GL_SOFT, 'stroke-width': 1.4 }, g);
}
// 讲解时数数：按从上到下、从左到右的顺序，一个一个标上号
function glTickMarks(f) {
  const row = it => Math.round((it.y - 14) / 24);   // 格点的第几行（位置抖过，不能直接比 y）
  if (f.k === 'count') return f.items.slice().sort((a, b) => (row(a) - row(b)) || (a.x - b.x)).map(it => ({ x: it.x + 7, y: it.y - 7, dot: true }));
  if (f.k === 'cross') return f.xs.map((x, j) => ({ x: x, y: j % 2 ? 63 : 37, at: [x, 50] }));   // 穿过的地方点一个点，号码上下错开

  const out = [];
  f.parts.forEach(p => {
    const n = p.closed ? p.pts.length : p.pts.length - 1;
    for (let j = 0; j < n; j++) {
      const a = p.pts[j], b = p.pts[(j + 1) % p.pts.length], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      if (p.closed ? (nx * (mx - p.cx) + ny * (my - p.cy) < 0) : (j % 2 === 1)) { nx = -nx; ny = -ny; }   // 多边形标在外面，折线左右错开
      out.push({ x: clamp(mx + nx * 8, 7, 93), y: clamp(my + ny * 8, 7, 93), seg: [a, b] });
    }
  });
  return out;
}

function gPattern(board, lv) {
  const cfg = G.pattern.levels[lv - 1].cfg;
  let Q = null;
  for (let t = 0; !Q && t < 20; t++) { try { Q = GL_GEN[cfg.kind](); } catch (e) { console.error(e); } }
  const grid = Q.lay === 'grid', N = grid ? 9 : 5;
  const wrap = el('div', 'glWrap'), qEl = el('div', 'glQ' + (grid ? ' grid' : '')), oEl = el('div', 'glO');
  const layer = el('div', 'glLayer');
  const cells = [], svgs = [], exs = [], tiles = [];
  let solved = false, explained = false, nudged = false, running = false, tok = 0, fly = {}, chipEl = null;
  for (let i = 0; i < N; i++) {
    const c = el('div', 'glc' + (i === Q.blank ? ' q' : '')), s = svgEl('svg');
    s.setAttribute('viewBox', '0 0 100 100');
    if (i === Q.blank) { const t = sv('text', { x: 50, y: 66, 'text-anchor': 'middle', 'font-size': 50, 'font-weight': 700, fill: '#B9A26A', class: 'qm' }, s); t.textContent = '?'; }
    else glDraw(s, Q.figs[i]);
    const ex = sv('g', { class: 'ex' }, s);
    c.appendChild(s); qEl.appendChild(c); cells.push(c); svgs.push(s); exs.push(ex);
  }
  Q.opts.forEach((f, k) => {
    const t = el('div', 'tile glo'), s = svgEl('svg');
    s.setAttribute('viewBox', '0 0 100 100'); glDraw(s, f); t.appendChild(s);
    t.appendChild(el('b', 'gll num', GL_LETTER[k]));
    t.addEventListener('click', () => tap(k, t));
    oEl.appendChild(t); tiles.push(t);
  });
  wrap.appendChild(qEl); wrap.appendChild(oEl); wrap.appendChild(layer); board.appendChild(wrap);
  if (S.easeIn) { staggerIn(qEl, '.glc'); staggerIn(oEl, '.glo'); }

  // 💡 讲一讲：答对之前点，要少一颗星（等于看了答案）；答对以后点，白听
  const xBtn = el('button', 'sw', '💡 讲一讲（少一颗星）');
  xBtn.addEventListener('click', () => { Audio2.tap(); explain(); });
  addExtra(xBtn, wrap);
  setPrompt(Q.ask);
  Voice.say(Q.ask);

  function tap(k, t) {
    if (solved) return;
    if (k === Q.ans) return win(t);
    miss(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake', 'tried');
    if (Session && Session.miss >= 2 && !nudged && !explained && !running) { nudged = true; xBtn.classList.add('pulse'); Voice.short(GL_T.stuck); }
  }
  function win(t) {
    solved = true; tok++; running = false; clearHint();
    const hold = !!Session && Session.miss > 0 && !explained;   // 试错碰对的：停一下，给她听为什么的机会
    tiles.forEach(x => x.classList.remove('pick', 'pulse'));
    t.classList.add('right');
    const c = cells[Q.blank];
    c.classList.remove('q'); c.classList.add('pop');
    const q = svgs[Q.blank].querySelector('.qm'); if (q) q.remove();
    ui.clear();
    const ag = svgEl('g'); svgs[Q.blank].insertBefore(ag, exs[Q.blank]); glDraw(ag, Q.opts[Q.ans]);
    Audio2.good();
    later(600, () => {
      roundWin(c, hold);
      if (!hold) return;
      xBtn.textContent = '💡 为什么是它'; xBtn.classList.add('pulse');
      const nx = el('button', 'sw', '下一题 ▶'); nx.style.background = 'var(--yellow)';
      nx.addEventListener('click', () => { Audio2.tap(); tok++; Voice.stop(); nextRound(); });
      addExtra(nx, wrap);
      const rid = ROUND_ID;
      Voice.whenIdle(() => { if (rid === ROUND_ID && !running) Voice.short(GL_T.why); }, 3000);
    });
  }

  // —— 讲解时画面上的动作（GL_GEN 里每一步说什么、配哪个动作） ——
  const wait = ms => new Promise(r => later(ms, r));
  const rel = n => { const a = wrap.getBoundingClientRect(), b = n.getBoundingClientRect(); return { x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height }; };
  const ui = {
    clear() {
      exs.forEach(g => { while (g.firstChild) g.firstChild.remove(); });
      cells.forEach(c => { c.classList.remove('hl'); c.querySelectorAll('.glb').forEach(b => b.remove()); });
      if (!solved) { const q = svgs[Q.blank].querySelector('.qm'); if (q) q.style.display = ''; }
      tiles.forEach(t => t.classList.remove('pick', 'pulse'));
      layer.innerHTML = ''; fly = {};
      if (chipEl) { chipEl.remove(); chipEl = null; }
    },
    badge(i, txt) { cells[i].appendChild(el('b', 'glb num', txt)); },
    draw(i, fn) { fn(exs[i]); },
    mark(i, fn) { const g = exs[i]; while (g.firstChild) g.firstChild.remove(); fn(g); },   // 先擦掉这一格上讲解画的，再画
    ghost(i, f) {
      if (solved && i === Q.blank) return;   // 已经答对了，答案就摆在那儿
      const g = exs[i];
      while (g.firstChild) g.firstChild.remove();
      const q = svgs[i].querySelector('.qm'); if (q) q.style.display = 'none';
      glDraw(sv('g', { opacity: .45 }, g), f);
    },
    row(r) { cells.forEach((c, i) => c.classList.toggle('hl', ((i / 3) | 0) === r)); },
    point(k) { tiles[k].classList.add('pick', 'pulse'); },
    chip(d) {
      if (chipEl) chipEl.remove();
      chipEl = el('div', 'glChip', (d > 0 ? '🔃 顺时针' : '🔄 逆时针'));
      board.appendChild(chipEl);
    },
    // 一个一个标号：数东西、数线条
    tick(i) {
      const f = Q.figs[i], g = exs[i], ms = glTickMarks(f), gap = clamp(1400 / ms.length, 120, 260);
      ms.forEach((m, j) => later(j * gap, () => {
        if (m.seg) sv('polyline', { points: glPts(m.seg), stroke: GL_HEX.orange, 'stroke-width': 5.5, 'stroke-linecap': 'round', fill: 'none' }, g);
        if (m.at) sv('circle', { cx: m.at[0], cy: m.at[1], r: 4.2, fill: GL_HEX.orange, stroke: '#fff', 'stroke-width': 1.2 }, g);
        const r = m.dot ? 5.6 : 6.4, hollow = m.seg || m.at;
        sv('circle', { cx: m.x, cy: m.y, r: r, fill: hollow ? '#fff' : GL_INK, stroke: hollow ? GL_HEX.orange : '#fff', 'stroke-width': 1.4 }, g);
        const t = sv('text', { x: m.x, y: m.y + r * .52, 'text-anchor': 'middle', 'font-size': r * 1.45, 'font-weight': 700, fill: hollow ? GL_INK : '#fff' }, g);
        t.textContent = String(j + 1);
        Audio2.count(j);
      }));
      return wait(ms.length * gap + 120);
    },
    // 叠加 / 去同存异：一行的前两个图（一个蓝、一个橙）飞到第三格叠起来
    fly(r, mode) {
      const A = Q.figs[r * 3].on, B = Q.figs[r * 3 + 1].on, dst = cells[r * 3 + 2], to = rel(dst);
      const mk = (on, color, src) => {
        const box = el('div', 'glFly'), s = svgEl('svg'), at = rel(src);
        s.setAttribute('viewBox', '0 0 100 100'); box.appendChild(s);
        on.forEach(c => sv('rect', { x: 10 + GL_CELL * (c % 3), y: 10 + GL_CELL * ((c / 3) | 0), width: GL_CELL, height: GL_CELL, fill: color, 'data-c': c }, s));
        box.style.cssText = 'left:' + px(at.x) + ';top:' + px(at.y) + ';width:' + px(at.w) + ';height:' + px(at.h);
        layer.appendChild(box);
        requestAnimationFrame(() => requestAnimationFrame(() => { box.style.transform = 'translate(' + px(to.x - at.x) + ',' + px(to.y - at.y) + ')'; }));
        return box;
      };
      glTint(exs[r * 3], A, GL_HEX.blue, 1); glTint(exs[r * 3 + 1], B, GL_HEX.orange, 1);
      const ka = mk(A, GL_HEX.blue, cells[r * 3]), kb = mk(B, GL_HEX.orange, cells[r * 3 + 1]);
      fly[r] = { ka: ka, kb: kb, A: A, B: B };
      return wait(950).then(() => (mode === 'stack' ? null : mode === 'xor' ? ui.vanish(r) : wait(500).then(() => settle(r, A.concat(B)))));
    },
    vanish(r) {
      const st = fly[r]; if (!st) return Promise.resolve();
      const both = st.A.filter(c => st.B.indexOf(c) >= 0);
      [st.ka, st.kb].forEach(k => k.querySelectorAll('rect').forEach(n => { if (both.indexOf(+n.getAttribute('data-c')) >= 0) n.classList.add('blink'); }));
      Audio2.pop();
      return wait(1000).then(() => settle(r, st.A.concat(st.B).filter(c => both.indexOf(c) < 0)));
    }
  };
  // 飞完了：第三格上留下彩色的结果（蓝的来自第一个，橙的来自第二个），问号格里就是答案的影子
  function settle(r, on) {
    const st = fly[r]; if (!st) return;
    const g = exs[r * 3 + 2], q = svgs[r * 3 + 2].querySelector('.qm');
    if (q) q.style.display = 'none';
    if (r === 2 && !solved) glDraw(sv('g', { opacity: .3 }, g), glCells([]));   // 问号格里先画上空格子
    glTint(g, on.filter(c => st.A.indexOf(c) >= 0), GL_HEX.blue, r === 2 && !solved ? .7 : 1);
    glTint(g, on.filter(c => st.A.indexOf(c) < 0), GL_HEX.orange, r === 2 && !solved ? .7 : 1);
    st.ka.classList.add('gone'); st.kb.classList.add('gone');
    later(400, () => { st.ka.remove(); st.kb.remove(); });
    delete fly[r];
  }

  function explain() {
    if (running) return;
    if (!solved && !explained && Session) { Session.miss++; Session.totalMiss++; }   // 先听讲解再答，少一颗星
    if (!solved) explained = true;
    const my = ++tok; running = true; clearHint();
    xBtn.classList.remove('pulse'); xBtn.classList.add('busy');
    ui.clear();
    const steps = Q.steps(ui);
    let i = 0;
    const live = () => my === tok;
    const done = () => {
      if (!live()) return;
      running = false; xBtn.classList.remove('busy');
      if (!solved) { xBtn.textContent = '💡 再讲一遍'; Voice.short(GL_T.tapNow); }
    };
    const next = () => {
      if (!live()) return;
      if (i >= steps.length) return done();
      const st = steps[i++];
      let fx = null;
      try { fx = st.fx ? st.fx() : null; } catch (e) { console.error(e); }
      Promise.all([Voice.play('n', st.t, st.t), fx, wait(Voice.on ? 0 : 400 + st.t.length * 150)]).then(r => {
        if (!live()) return;
        if (r[0] === false) { running = false; xBtn.classList.remove('busy'); return; }   // 被别的声音打断了（比如点了再读一遍）
        later(200, next);
      });
    };
    next();
  }

  hintIn(20000, () => { if (!solved) tiles[Q.ans].classList.add('pulse'); });
  Fit.cb = () => {
    const b = boardBox(), W = b.w, H = b.h, g = clamp(Math.min(W, H) / 55, 6, 16);
    let s, o, wide = false;
    if (!grid) {
      // 一排 5 格（下面挂得下数字角标）+ 一排 4 个选项
      s = Math.min((W - 4 * g) / 5, 190);
      o = Math.min((W - 6 * g - 12) / 4.25, s * 1.2, 200);   // 选项左上角的字母牌往外探出一点
      const need = s * 1.42 + o * 1.12;
      if (need > H) { s *= H / need; o *= H / need; }
      qEl.style.gridTemplateColumns = 'repeat(5,' + px(s) + ')';
      oEl.style.gridTemplateColumns = 'repeat(4,' + px(o) + ')';
      wrap.style.flexDirection = 'column'; wrap.style.gap = px(s * .36);
    } else {
      // 九宫格：选项放在下面一排，或者（宽屏）右边两行两列，挑格子大的那种
      const sT = Math.min((W - 6 * g) / 4, (H - 2 * g - g * 2) / 4.3, 190);
      const sW = Math.min((H - 2 * g) / 3, (W - 5 * g) / 5.35, 190);
      wide = sW > sT * 1.04; s = o = wide ? sW : sT;
      qEl.style.gridTemplateColumns = 'repeat(3,' + px(s) + ')';
      oEl.style.gridTemplateColumns = 'repeat(' + (wide ? 2 : 4) + ',' + px(o) + ')';
      wrap.style.flexDirection = wide ? 'row' : 'column'; wrap.style.gap = px(wide ? s * .35 : s * .28);
    }
    qEl.style.gap = px(g); oEl.style.gap = px(grid ? g : g * 2); oEl.style.rowGap = px(g * 2);
    cells.forEach(c => { c.style.width = px(s); c.style.height = px(s); });
    tiles.forEach(t => { t.style.width = px(o); t.style.height = px(o); });
    wrap.style.setProperty('--gs', px(s)); wrap.style.setProperty('--go', px(o));
  };
}

GAME_IMPL.pattern = gPattern;
