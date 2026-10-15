// 思维小画本 · 方块拼拼。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 10 方块拼拼（空间构建 / 心理旋转） =====================
   证据取舍：单纯玩会掉落的俄罗斯方块，对心理旋转的迁移在高效力重复实验里做不出来
   （Mayer 综述、Timm 等人 2024）；但结构化积木拼搭在 fMRI 研究里确实改善了心理旋转
   成绩与脑激活。差别在于必须「先在脑子里转好再动手」，而不是狂按旋转键试错。
   所以这里不做掉落与计时，前两关甚至不给旋转按钮——只能先想清楚再选。
   国内 5-6 岁课纲（摩比「图形与空间」、火花 L3）的四巧板／图形割补也是同一路子。
   ========================================================================== */
const POLY = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [0, 2], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [1, 1], [1, 2]]
];
function pNorm(cs) {
  const mr = Math.min.apply(null, cs.map(c => c[0])), mc = Math.min.apply(null, cs.map(c => c[1]));
  return cs.map(c => [c[0] - mr, c[1] - mc]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
function pRot(cs) { const mr = Math.max.apply(null, cs.map(c => c[0])); return pNorm(cs.map(c => [c[1], mr - c[0]])); }
function pKey(cs) { return pNorm(cs).map(c => c.join(',')).join(';'); }
function pDims(cs) { return [Math.max.apply(null, cs.map(c => c[0])) + 1, Math.max.apply(null, cs.map(c => c[1])) + 1]; }
function pAllRot(cs) { const out = [], seen = {}; let c2 = pNorm(cs); for (let i = 0; i < 4; i++) { const k = pKey(c2); if (!seen[k]) { seen[k] = 1; out.push(c2); } c2 = pRot(c2); } return out; }
const FIT_COLORS = ['#2E7DD1', '#E8452C', '#3FA34D', '#F5B921', '#7B4BC9', '#12A5A0'];
function pieceEl(cs, cell, color, gap) {
  const d = pDims(cs), g = el('div');
  g.style.display = 'grid';
  g.style.gridTemplateColumns = 'repeat(' + d[1] + ',' + px(cell) + ')';
  g.style.gridAutoRows = px(cell); g.style.gap = px(gap == null ? 2 : gap);
  const set = {}; cs.forEach(c => set[c[0] + ',' + c[1]] = 1);
  for (let r = 0; r < d[0]; r++) for (let c = 0; c < d[1]; c++) {
    const b = el('div');
    if (set[r + ',' + c]) b.style.cssText = 'background:' + color + ';border:2px solid var(--ink);border-radius:5px';
    g.appendChild(b);
  }
  return g;
}
function gFit(board, lv) {
  const cfg = G.fit.levels[lv - 1].cfg;
  const holder = el('div', 'col2'); holder.style.gap = '14px';
  const boardWrap = el('div'); boardWrap.style.display = 'grid'; boardWrap.className = 'fit-board';
  const tray = el('div', 'row2 fit-tray'); tray.style.gap = '16px';
  let cellPx = 34;

  /* ---------- 补洞：选出正好补上的那一块 ---------- */
  if (cfg.kind === 'hole') {
    const BW = 5, BH = 4;
    const piece = pNorm(pick(POLY.filter(p => p.length >= 3 && p.length <= 4)));
    const d = pDims(piece);
    const oy = rnd(BH - d[0] + 1), ox = rnd(BW - d[1] + 1);
    const hole = {}; piece.forEach(c => hole[(c[0] + oy) + ',' + (c[1] + ox)] = 1);
    const cells = [];
    for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
      const c = el('div');
      c.style.cssText = hole[y + ',' + x]
        ? 'background:repeating-linear-gradient(45deg,#EFE7D4 0 7px,transparent 7px 14px);border:3px dashed var(--orange);border-radius:6px'
        : 'background:#C9BFA8;border:2px solid var(--ink);border-radius:6px';
      c.dataset.k = y + ',' + x;
      cells.push(c); boardWrap.appendChild(c);
    }
    const rots = pAllRot(piece);
    const shown = cfg.rot && rots.length > 1 ? pick(rots.filter(r => pKey(r) !== pKey(piece))) : piece;
    const wrongPool = POLY.filter(p => pKey(pNorm(p)) !== pKey(piece) && p.length === piece.length);
    const cands = shuffle([{ cs: shown, ok: true }].concat(
      shuffle(wrongPool).slice(0, 2).map(p => ({ cs: pNorm(p), ok: false }))));
    cands.forEach((cd, i) => {
      const t = el('div', 'tile'); t.style.padding = '8px';
      t.appendChild(pieceEl(cd.cs, cellPx * .8, FIT_COLORS[i % FIT_COLORS.length]));
      t.addEventListener('click', () => {
        if (cd.ok) {
          Audio2.good(); t.classList.add('done');
          piece.forEach(c => {
            const cell = cells[(c[0] + oy) * BW + (c[1] + ox)];
            cell.style.background = FIT_COLORS[cands.indexOf(cd) % FIT_COLORS.length];
            cell.style.border = '2px solid var(--ink)'; cell.classList.add('pop');
          });
          setPrompt('正好补上了！');
          Voice.say('正好补上');
          later(700, () => roundWin(boardWrap));
        } else { miss(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); Voice.say('这块放不进去，再看看形状'); }
      });
      tray.appendChild(t);
    });
    setPrompt(cfg.rot ? '哪一块<b>转一下</b>正好补上缺口？' : '哪一块正好补上缺口？');
    Voice.say(cfg.rot ? '下面哪一块，转一下以后正好补上这个缺口？先在脑子里转转看' : '下面哪一块正好补上这个缺口？');
    hintIn(15000, () => { const t = tray.children[cands.findIndex(c => c.ok)]; if (t) t.classList.add('pulse'); });
    holder.appendChild(boardWrap); holder.appendChild(tray); board.appendChild(holder);
    Fit.cb = () => {
      const b = boardBox();
      if (!b.h || !b.w) return;                 // 还没量到真实尺寸，等下一帧
      cellPx = cellFit(b.w * .9, b.h * .5, BW, BH, 3, 92);
      boardWrap.style.gap = '3px';
      boardWrap.style.gridTemplateColumns = 'repeat(' + BW + ',' + px(cellPx) + ')';
      boardWrap.style.gridAutoRows = px(cellPx);
      [...tray.children].forEach((t, i) => { t.innerHTML = ''; t.appendChild(pieceEl(cands[i].cs, cellPx * .72, FIT_COLORS[i % FIT_COLORS.length])); });
    };
    return;
  }

  /* ---------- 落体模式：会掉下来的方块 ---------- */
  if (cfg.kind === 'drop') {
    const BW = cfg.w;
    // 行数不能拍脑袋估：之前用「视口高度减 160」猜，格子却用实测的棋盘区高度算。
    // 两者不一致时，行数被压到下限 10、格子反而顶到上限 52px——正是「怎么还是 10 行」的原因。
    // 现在改成同一个实测值决定：棋盘区量出来能放几行就放几行，每格不低于 MIN_CELL
    const MIN_CELL = 26;
    let BH = 0, built = false;
    // 速度按倍率给：1.0 = 原来「快」那一档（每 950ms 落一格）。棋盘拉高以后，原来的中速落一块要等太久，
    // 所以默认就从这一档开始；0.7~1.3 七档，点伙伴栏的「速度」弹出来选
    const BASE_MS = 950, SPEED_OPTS = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
    const spdIcon = v => v <= .8 ? '🐢' : v >= 1.2 ? '🚀' : '🐇';
    const TETRO = [
      { cs: [[0, 0], [0, 1], [0, 2], [0, 3]], c: '#12A5A0' },
      { cs: [[0, 0], [0, 1], [1, 0], [1, 1]], c: '#F5B921' },
      { cs: [[0, 0], [0, 1], [0, 2], [1, 1]], c: '#7B4BC9' },
      { cs: [[0, 1], [0, 2], [1, 0], [1, 1]], c: '#3FA34D' },
      { cs: [[0, 0], [0, 1], [1, 1], [1, 2]], c: '#E8452C' },
      { cs: [[0, 0], [1, 0], [1, 1], [1, 2]], c: '#2E7DD1' },
      { cs: [[0, 2], [1, 0], [1, 1], [1, 2]], c: '#F08A24' }
    ];
    let occ = {}, cur = null, nextP = null, cleared = 0, over = false, busy = false;
    let tick = null, cellPx2 = 24, lockAt = 0, bag = [];
    let speed = SPEED_OPTS.indexOf(S.dropSpeed) >= 0 ? S.dropSpeed : 1;
    const history = [];
    /* 难度递进：原来三关只差在棋盘大小，消 2~4 行就过，大孩子一会儿就玩腻了。现在每关加一条新的难度轴，
       每关里的三局再逐局加码——
       ─ 第 5 关：只学消行，三局要消 3 / 4 / 5 行
       ─ 第 6 关：底下先垫几行带缺口的石块（2 / 3 / 4 行），得先补缺口、往下挖，棋盘也矮了一截
       ─ 第 7 关：石块之外，每消 3 行自动快一档（不改孩子自己选的速度，下一局从头算） */
    const RND = clamp(((Session && Session.round) || 1) - 1, 0, 2);
    const pickR = a => Array.isArray(a) ? a[Math.min(RND, a.length - 1)] : (a || 0);
    const goal = pickR(cfg.goals || cfg.goal), JUNK = pickR(cfg.junk), ACCEL = cfg.accel || 0;
    const JUNK_C = '#B9B1A5';
    let boostFrom = 0, pristine = true;
    // 自动加速：从孩子最近一次自己调速时消掉的行数算起，每 ACCEL 行 +0.1，最多到 1.6
    const eff = () => Math.min(1.6, Math.round((speed + (ACCEL ? Math.floor(Math.max(0, cleared - boostFrom) / ACCEL) * .1 : 0)) * 10) / 10);
    // 垫底石块：每行留一个缺口；往上一行大多跟下一行同一列（挖得通），偶尔错开一列（得先清上面那行）
    function makeJunk() {
      const o = {};
      let hole = (Math.random() * BW) | 0;
      for (let i = 0; i < JUNK; i++) {
        if (i && Math.random() < .45) hole = (hole + 1 + ((Math.random() * (BW - 1)) | 0)) % BW;
        for (let x = 0; x < BW; x++) if (x !== hole) o[(BH - 1 - i) + ',' + x] = JUNK_C;
      }
      return o;
    }
    function startPlay() {
      occ = makeJunk(); pristine = true; boostFrom = 0; paintSpd();
      nextP = takeBag(); spawn(); restartTick();
      toast('这一局消 ' + goal + ' 行' + (JUNK ? ' · 底下垫了 ' + JUNK + ' 行石块 ⛏️' : '') + (ACCEL ? ' · 每消 ' + ACCEL + ' 行快一档 🚀' : ''));
    }
    /* 得分：让每一块都有回报，消行越多、连着消、速度越快，分越高。
       每关记一个最高分，打破了当场告诉孩子；退回一步会把那一步的分也退回去 */
    const LINE_PTS = [0, 100, 300, 600, 1000];
    const bestKey = 'fit.' + lv, best0 = (S.dropBest && S.dropBest[bestKey]) || 0;
    let score = 0, combo = 0, beat = false;
    const takeBag = () => { if (!bag.length) bag = shuffle(TETRO.map((_, i) => i)); return TETRO[bag.pop()]; };

    /* 控件布局（第二版，按孩子的实际反馈重排）：
       上一版七个键排成一整行，左右两端顶到行宽两侧，设想是双手横握平板时拇指正好够到。
       可孩子多半把平板放在桌上、一只手点，反馈是「按钮太分散」：挪一下、转一下要横跨大半个屏幕。
       现在按用途分两区：
       ─ 玩的四个键收成一个倒 T 形手柄，贴在棋盘右侧下半截：◀ ▼ ▶ 的位置就是方块要去的方向，
         上面那格是 🔄 转一下（跟键盘的 ↑ 一致）。一只手不挪窝就够得着，眼睛也不用离开棋盘太远
       ─ 退回 / 调速 / 暂停不常按、按错了代价高，挪进右侧伙伴栏，跟「再读一遍 / 回家」排在一起，
         和手柄隔开一整段，不会误触；拼满关的「退回一步」也在同一个位置
       ─ 4~6 岁的点击精度明显低于成人、落点偏目标左下，所以按钮取 ~20mm，每个键外扩一圈不可见热区，
         键与键之间留出 ~20px 的空隙
       ─ 底下不再压一整排按钮，省下的高度全还给棋盘；窄屏（竖着拿）时手柄挪到棋盘正下方居中
       ─ 移动与下落支持按住连发，免得孩子反复戳 */
    const colWrap = el('div', 'col2'); colWrap.style.cssText = 'width:100%;height:100%;justify-content:center;align-items:center;gap:0';
    const boardRow = el('div', 'boardrow');
    const grid = el('div'); grid.className = 'fit-board';
    grid.style.cssText = 'display:grid;background:#FFFDF7;border:4px solid var(--ink);border-radius:10px;padding:4px;position:relative';
    const nextBox = el('div', 'nextbox');
    const nextLab = el('div', 'nextlab', '下一个');
    const nextIn = el('div');
    nextBox.appendChild(nextLab); nextBox.appendChild(nextIn);
    const scoreBox = el('div', 'nextbox scorebox');
    const scoreLab = el('div', 'nextlab', '得分'), scoreNum = el('div', 'scorenum', '0'), scoreBest = el('div', 'nextlab');
    scoreBox.appendChild(scoreLab); scoreBox.appendChild(scoreNum); scoreBox.appendChild(scoreBest);
    const infoCol = el('div', 'infocol'); infoCol.appendChild(nextBox); infoCol.appendChild(scoreBox);
    const sideCol = el('div', 'dropside');                         // 棋盘右侧一列：上面「下一个」和得分，下面手柄
    const pad = el('div', 'dpad2');
    const pauseMask = el('div', 'pausemask', '⏸ 暂停中'); pauseMask.style.display = 'none';
    grid.appendChild(pauseMask);

    let btnPx = 66, holdTimer = null, paused = false, pauseAt = 0, sideMode = null;
    function mkBtn(face, kind, fn, repeat) {
      const wrapEl = el('div', 'btnwrap');
      const b2 = el('div', 'dbtn2' + (kind ? ' ' + kind : ''), face);
      wrapEl.appendChild(b2);
      const stop = () => { if (holdTimer) { clearInterval(holdTimer); holdTimer = null; } b2.classList.remove('act'); };
      wrapEl.addEventListener('pointerdown', ev => {
        ev.preventDefault(); Audio2.init();
        b2.classList.add('act'); fn();
        if (repeat) { clearInterval(holdTimer); holdTimer = setInterval(fn, 150); }
        try { wrapEl.setPointerCapture(ev.pointerId); } catch (e) { }
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => wrapEl.addEventListener(t, stop));
      wrapEl._face = b2;
      return wrapEl;
    }
    const softDrop = () => { if (paused || busy || Date.now() - lockAt < 260) return; if (!move(1, 0)) lock(); };
    function togglePause(quiet) {
      if (over) return;
      paused = !paused;
      xPause.textContent = paused ? '▶️ 继续' : '⏸ 暂停';
      pauseMask.style.display = paused ? 'flex' : 'none';
      grid.classList.toggle('grid-paused', paused);
      if (paused) { pauseAt = Date.now(); if (!quiet) Voice.say('暂停了'); }
      else if (pauseAt) { T.t0 += Date.now() - pauseAt; pauseAt = 0; }   // 暂停不计进本关用时
    }
    // 手柄：倒 T 形，上面一格是转一下，下面一排是方块要去的方向
    const bRot = mkBtn('🔄', 'prim', () => rotate());
    const bL = mkBtn('◀', '', () => move(0, -1), true);
    const bD = mkBtn('▼', '', softDrop, true);
    const bR = mkBtn('▶', '', () => move(0, 1), true);
    [el('div'), bRot, el('div'), bL, bD, bR].forEach(x => pad.appendChild(x));
    // 不常按的三个键放进右侧伙伴栏（跟「再读一遍 / 回家」一列），带字，离手柄远
    const sideBtn = (txt, fn) => { const b2 = el('button', 'sw', txt); b2.addEventListener('click', () => { Audio2.init(); fn(); }); return b2; };
    const xUndo = sideBtn('↩︎ 退回一步', () => undo());
    const xSpd = sideBtn('', () => openSpeedPicker());
    const xPause = sideBtn('⏸ 暂停', () => togglePause());
    const paintSpd = () => { const e = eff(); xSpd.textContent = spdIcon(e) + ' 速度 ' + e.toFixed(1) + (e > speed ? ' ⬆' : ''); };
    const paintUndo = () => { xUndo.style.opacity = history.length ? '' : '.5'; };
    function paintScore(bump) {
      scoreNum.textContent = score.toLocaleString('en-US');
      scoreBest.textContent = beat ? '🏆 新纪录！' : best0 ? '最高 ' + best0.toLocaleString('en-US') : '第一次玩';
      scoreBox.classList.toggle('rec', beat);
      if (bump) { scoreNum.classList.remove('pop'); void scoreNum.offsetWidth; scoreNum.classList.add('pop'); }
    }
    paintSpd(); paintUndo(); paintScore();
    [xUndo, xSpd, xPause].forEach(x => addExtra(x, holder));

    holder.style.cssText = 'width:100%;height:100%';
    colWrap.appendChild(boardRow);
    holder.appendChild(colWrap); board.appendChild(holder);
    // 横排：棋盘 |「下一个」+ 得分 + 手柄（手柄落在下半截）；竖排：棋盘 +「下一个」+ 得分在上，手柄在下居中
    function arrange(side) {
      if (sideMode === side) return;
      sideMode = side;
      boardRow.innerHTML = ''; sideCol.innerHTML = '';
      if (pad.parentNode) pad.parentNode.removeChild(pad);
      boardRow.appendChild(grid);
      if (side) {
        sideCol.appendChild(infoCol); sideCol.appendChild(pad);
        boardRow.appendChild(sideCol);
        boardRow.style.alignItems = 'stretch';
      } else {
        boardRow.appendChild(infoCol);
        boardRow.style.alignItems = 'flex-start';
        colWrap.appendChild(pad);
      }
    }

    const cellsD = [];
    function buildCells() {
      cellsD.length = 0;
      grid.innerHTML = ''; grid.appendChild(pauseMask);
      for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) { const c = el('div'); cellsD.push(c); grid.appendChild(c); }
    }

    function paint() {
      const live = {};
      if (cur) cur.cs.forEach(c => live[(c[0] + cur.y) + ',' + (c[1] + cur.x)] = cur.c);
      cellsD.forEach((c, i) => {
        if (c.classList.contains('lineboom')) return;
        const y = (i / BW) | 0, x = i % BW, k = y + ',' + x;
        const col = live[k] || occ[k];
        c.style.cssText = col
          ? 'background:' + col + ';border:2px solid rgba(42,37,35,.55);border-radius:5px'
          : 'background:#F3EEDF;border:1px solid #E4DCC9;border-radius:5px';
        c.style.width = px(cellPx2); c.style.height = px(cellPx2);
      });
      nextIn.innerHTML = '';
      if (nextP) nextIn.appendChild(pieceEl(nextP.cs, Math.max(9, cellPx2 * .6), nextP.c));
    }
    const fits = (cs, y, x) => cs.every(c => {
      const yy = c[0] + y, xx = c[1] + x;
      return yy >= 0 && yy < BH && xx >= 0 && xx < BW && !occ[yy + ',' + xx];
    });
    function move(dy, dx) {
      if (!cur || over || busy || paused) return false;
      if (fits(cur.cs, cur.y + dy, cur.x + dx)) { cur.y += dy; cur.x += dx; if (dx) Audio2.tap(); paint(); return true; }
      return false;
    }
    function rotate() {
      if (!cur || over || busy || paused) return;
      const r = pRot(cur.cs);
      for (const kick of [0, -1, 1, -2, 2]) if (fits(r, cur.y, cur.x + kick)) { cur.cs = r; cur.x += kick; Audio2.step(); paint(); return; }
      Audio2.soft();
    }
    function restartTick() {
      if (tick) clearInterval(tick);
      tick = every(Math.round(BASE_MS / eff()), () => { if (over || busy || paused) return; if (!move(1, 0)) lock(); });
    }
    function setSpeed(v) {
      speed = v; S.dropSpeed = v; save();
      boostFrom = cleared;                                        // 自己调了速度，自动加速从这里重新算
      paintSpd();
      toast('速度 ' + v.toFixed(1) + ' ' + spdIcon(v));
      restartTick();
    }
    // 速度面板：七个大按钮一排，当前那档标黄；打开时先停住，免得方块趁机落下去
    function openSpeedPicker() {
      if (over || $('#spdpick')) return;
      const wasPaused = paused;
      if (!paused) togglePause(true);
      const m = el('div'); m.id = 'spdpick';
      const card = el('div', 'spdcard');
      card.appendChild(el('div', 'spdtitle', '选一个速度'));
      card.appendChild(el('div', 'spdsub', '数字越大，方块落得越快'));
      const row = el('div', 'spdrow');
      const close = () => { m.remove(); if (!wasPaused && paused) togglePause(true); };
      SPEED_OPTS.forEach(v => {
        const b2 = el('button', 'spdopt' + (v === speed ? ' on' : ''));
        b2.appendChild(el('span', 'i', spdIcon(v))); b2.appendChild(el('span', 'n', v.toFixed(1)));
        b2.addEventListener('click', ev => { ev.stopPropagation(); Audio2.tap(); close(); if (v !== speed) setSpeed(v); });
        row.appendChild(b2);
      });
      card.appendChild(row);
      m.appendChild(card);
      m.addEventListener('click', ev => { if (ev.target === m) { Audio2.tap(); close(); } });
      $('#screen').appendChild(m);
    }
    // 分数飘字：在消掉的那几行中间冒出来，往上飘走
    function floatPts(txt, x, y) {
      const f = el('div', 'floatpts', txt);
      f.style.left = px(x); f.style.top = px(y);
      document.body.appendChild(f); setTimeout(() => f.remove(), 1200);
    }
    function addScore(pts, at) {
      const got = Math.round(pts * eff() / 10) * 10;          // 速度越快（含自动加速），分越高
      score += got;
      if (at) floatPts('+' + got, at[0], at[1]);
      if (!beat && best0 && score > best0) { beat = true; toast('破纪录啦 🏆'); Audio2.fanfare(); }
      paintScore(true);
    }
    function undo() {
      if (over || busy || paused) return;
      if (!history.length) { Voice.say('还没有可以退回的一步'); toast('还没有可以退回的'); return; }
      const h = history.pop();
      const e0 = eff();
      occ = h.occ; cleared = h.cleared; score = h.score; combo = h.combo; beat = h.beat; paintScore();
      if (eff() !== e0) { paintSpd(); restartTick(); }
      cur = { cs: h.piece.cs.slice(), c: h.piece.c, y: 0, x: h.piece.x };
      if (!fits(cur.cs, cur.y, cur.x)) cur.y = 0, cur.x = 0;
      Audio2.step(); toast('退回一步 ↩︎');
      setPrompt('已经消掉 <span class="num">' + cleared + '</span> / ' + goal + ' 行');
      paint(); paintUndo();
    }
    function spawn() {
      const p = nextP || takeBag(); nextP = takeBag();
      const d = pDims(p.cs);
      cur = { cs: p.cs.slice(), c: p.c, y: 0, x: Math.max(0, ((BW - d[1]) / 2) | 0) };
      if (!fits(cur.cs, cur.y, cur.x)) { cur = null; return gameOver(); }
      paint();
    }
    function lock() {
      if (!cur || over || busy) return;
      pristine = false;
      history.push({ occ: Object.assign({}, occ), cleared: cleared, score: score, combo: combo, beat: beat, piece: { cs: cur.cs.slice(), c: cur.c, x: cur.x } });
      if (history.length > 15) history.shift();
      paintUndo();
      cur.cs.forEach(c => occ[(c[0] + cur.y) + ',' + (c[1] + cur.x)] = cur.c);
      cur = null; lockAt = Date.now(); Audio2.pop(); paint();
      const full = [];
      for (let y = 0; y < BH; y++) { let f = true; for (let x = 0; x < BW; x++) if (!occ[y + ',' + x]) f = false; if (f) full.push(y); }
      if (!full.length) { combo = 0; addScore(10); return spawn(); }        // 落一块 10 分
      busy = true;
      combo++;
      {                                                                  // 消行：1/2/3/4 行 100/300/600/1000，连着消再加
        const a = cellsD[full[0] * BW].getBoundingClientRect(), z = cellsD[full[full.length - 1] * BW + BW - 1].getBoundingClientRect();
        addScore(10 + LINE_PTS[Math.min(full.length, 4)] + (combo > 1 ? 50 * (combo - 1) : 0), [(a.left + z.right) / 2, (a.top + z.bottom) / 2]);
      }
      Audio2.star(); Audio2.fanfare();
      // 把没被消的格子压暗，让「消掉的是哪一行」一目了然——
      // 否则上面那行整体下移填补，看起来像是它也被删了
      cellsD.forEach((c, i) => { if (full.indexOf((i / BW) | 0) < 0) c.classList.add('bdim'); });
      full.forEach(y => {
        for (let x = 0; x < BW; x++) {
          const c = cellsD[y * BW + x];
          c.classList.add('lineboom');
          c.style.animationDelay = (x * 28) + 'ms';
        }
        const mid = cellsD[y * BW + ((BW / 2) | 0)].getBoundingClientRect();
        later(120, () => sparkle(mid.left + mid.width / 2, mid.top + mid.height / 2, ['✨', '⭐', '💥', '🌟']));
      });
      toast((full.length > 1 ? ('一次消掉 ' + full.length + ' 行！太厉害了 🎆') : '消掉一行！✨') + (combo > 1 ? ' 连消 ×' + combo + ' 🔥' : ''));
      Voice.short(full.length > 1 ? '一次消掉 ' + full.length + ' 行，太厉害了' : '消掉一行');
      later(Math.min(940, 500 + BW * 30), () => {
        cellsD.forEach(c => c.classList.remove('bdim'));
        full.forEach(y => { for (let x = 0; x < BW; x++) { const c = cellsD[y * BW + x]; c.classList.remove('lineboom'); c.style.animationDelay = ''; } });
        const keep = [], n2 = {};
        for (let y = BH - 1; y >= 0; y--) if (full.indexOf(y) < 0) keep.push(y);
        let ny = BH - 1;
        keep.forEach(y => { for (let x = 0; x < BW; x++) if (occ[y + ',' + x]) n2[ny + ',' + x] = occ[y + ',' + x]; ny--; });
        const e0 = eff();
        occ = n2; cleared += full.length; busy = false;
        setPrompt('已经消掉 <span class="num">' + cleared + '</span> / ' + goal + ' 行');
        paint();
        if (cleared >= goal) {
          // 过关：棋盘上盖一层半透明的「过关」，剩下的方块留在底下看得见，再进下一局——
          // 不然看起来像是「消了三行，整个棋盘都被清空了」。
          // 也不再紧接着念「消够啦」：先让「一次消掉 N 行」念完，过关的表扬接在后面
          over = true; if (tick) clearInterval(tick);
          const rec = score > best0;
          if (rec) { S.dropBest[bestKey] = score; save(); }
          setPrompt('消够啦 🎉');
          const w = el('div', 'winmask');
          w.appendChild(el('div', 'w1', '🎉 过关！'));
          w.appendChild(el('div', 'w2', '这一局 ' + score.toLocaleString('en-US') + ' 分'));
          if (rec && best0) w.appendChild(el('div', 'w3', '🏆 新纪录'));
          w.style.fontSize = px(clamp(cellPx2 * .8, 18, 40));
          grid.appendChild(w);
          return Voice.whenIdle(() => roundWin(grid), 3500);
        }
        if (eff() !== e0) { paintSpd(); restartTick(); later(700, () => toast('加速啦 🚀 速度 ' + eff().toFixed(1))); }
        spawn();
      });
    }
    function gameOver() {
      over = true; if (tick) clearInterval(tick);
      Audio2.soft();
      const g = el('div'); g.id = 'gameover';
      g.appendChild(el('div', 'gtitle', '堆满啦！'));
      const rec = score > best0;
      if (rec) { S.dropBest[bestKey] = score; save(); }
      g.appendChild(el('div', 'gsub', '这一局消掉了 ' + cleared + ' 行，得了 ' + score.toLocaleString('en-US') + ' 分' + (rec && best0 ? ' 🏆 新纪录' : '')));
      const row = el('div', 'btnrow');
      const again = el('button', 'bigbtn', '🔁 再来一局');
      again.addEventListener('click', () => { Audio2.tap(); g.remove(); reset(); });
      const slower = el('button', 'bigbtn ghost', '🐢 调慢一点再来');
      slower.addEventListener('click', () => { Audio2.tap(); setSpeed(Math.max(.7, Math.round((speed - .2) * 10) / 10)); g.remove(); reset(); });
      const back = el('button', 'bigbtn ghost', '🏠 回家');
      back.addEventListener('click', () => { Audio2.tap(); home(); });
      row.appendChild(again); row.appendChild(slower); row.appendChild(back);
      g.appendChild(row);
      $('#screen').appendChild(g);
      Voice.say('方块堆满啦，要再来一局吗');
    }
    function reset() {
      cur = null; nextP = null; cleared = 0; over = false; busy = false;
      score = 0; combo = 0; beat = false; paintScore();
      history.length = 0; bag = []; paintUndo();
      cellsD.forEach(c => c.classList.remove('lineboom'));
      setPrompt('已经消掉 <span class="num">0</span> / ' + goal + ' 行');
      startPlay();
    }
    const rid = ROUND_ID;
    const onKey = ev => {
      if (rid !== ROUND_ID) { removeEventListener('keydown', onKey); return; }
      const k = ev.key;
      if (k === 'ArrowLeft') { move(0, -1); ev.preventDefault(); }
      else if (k === 'ArrowRight') { move(0, 1); ev.preventDefault(); }
      else if (k === 'ArrowDown') { softDrop(); ev.preventDefault(); }
      else if (k === 'ArrowUp' || k === ' ') { rotate(); ev.preventDefault(); }
      else if (k === 'z' || k === 'Backspace') { undo(); ev.preventDefault(); }
      else if (k === 'p' || k === 'Escape') { togglePause(); ev.preventDefault(); }
    };
    addEventListener('keydown', onKey);
    setPrompt('已经消掉 <span class="num">0</span> / ' + goal + ' 行');
    Voice.say('方块会往下掉。左右挪位置，转一下换方向，向下让它快点落。放错了可以按退回。填满一整行就消掉');
    // 兜底：万一量不到棋盘尺寸（某些环境首帧拿到 0），退回按视口估算，别让棋盘一直空着
    later(450, () => {
      if (built) return;
      const vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight) || 800;
      BH = clamp(Math.floor((vh * .78) / (MIN_CELL + 2)), 10, cfg.h);
      buildCells(); built = true;
      startPlay(); Fit.run();
    });
    Fit.cb = () => {
      const b = boardBox();
      if (!b.h || !b.w) return;                 // 还没量到真实尺寸，等下一帧
      const M = 12, GAP = 2, CHROME = 4 * 2 + 4 * 2;
      // 手柄的键取 ~20mm 见方；窄屏时按宽度收，保证一排三个放得下
      btnPx = Math.round(clamp(Math.min(b.h * .12, b.w * .13, (b.w - M * 2 - 20) / 3.4), 44, 100));
      const slop = Math.round(clamp(btnPx * .1, 5, 10));          // 每个键外扩的不可见热区
      const padGap = Math.round(clamp(btnPx * .08, 4, 8));         // 键与键可见的空隙 = 2×热区 + 这个，20px 以上
      [bRot, bL, bD, bR].forEach(x => {
        x.style.padding = px(slop);
        x._face.style.width = px(btnPx); x._face.style.height = px(btnPx);
        x._face.style.fontSize = px(btnPx * .46);
      });
      const plate = Math.round(clamp(btnPx * .12, 6, 12));         // 手柄底下那块浅色托盘：一眼看出四个键是一组
      pad.style.gap = px(padGap); pad.style.padding = px(plate); pad.style.borderRadius = px(btnPx * .34);
      const unit = btnPx + slop * 2;
      const padW = unit * 3 + padGap * 2 + plate * 2, padH = unit * 2 + padGap + plate * 2;
      nextLab.style.fontSize = px(clamp(btnPx * .22, 11, 16));
      const nextW = Math.round(clamp(btnPx * 1.8, 90, 170));      // 「下一个」预览框
      nextBox.style.width = px(nextW); scoreBox.style.width = px(nextW);
      scoreNum.style.fontSize = px(clamp(btnPx * .4, 20, 40));
      infoCol.style.gap = px(clamp(btnPx * .18, 10, 18));
      const nextH = Math.round(nextW * .9 + nextW * .62 + 14);     // 「下一个」+ 得分框
      const sideGap = Math.round(clamp(btnPx * .45, 20, 48));      // 棋盘和右边那一列之间：贴近但不挨着
      // 两种排法各算一遍格子能有多大，哪种棋盘大用哪种；差不多时用横排（手柄贴棋盘右侧，棋盘吃满高度）。
      // 横屏几乎总是横排；竖着拿的平板宽度紧，手柄放到棋盘下面，格子反而更大
      const colW = Math.max(padW, nextW);
      const sW = b.w - M * 2 - sideGap - colW - CHROME - GAP * (BW - 1), sH = b.h - M * 2 - CHROME;
      const tW = b.w - M * 2 - sideGap - nextW - CHROME - GAP * (BW - 1), tH = b.h - M * 2 - padH - sideGap - CHROME;
      const rowsFor = h => built ? BH : clamp(Math.floor((h + GAP) / (MIN_CELL + GAP)), 10, cfg.h);
      const cellFor = (w, h) => Math.min(w / BW, (h - GAP * (rowsFor(h) - 1)) / rowsFor(h));
      const side = sW / BW >= MIN_CELL && sH >= padH + nextH + sideGap && cellFor(sW, sH) >= cellFor(tW, tH) * .95;
      arrange(side);
      boardRow.style.gap = px(sideGap);
      sideCol.style.width = px(colW);
      pad.style.marginTop = side ? '' : px(sideGap);
      pad.style.marginRight = side ? '' : px(nextW + sideGap);      // 竖排时手柄对准棋盘正下方，而不是棋盘加预览框的中间
      const boxH = side ? sH : tH, availW = side ? sW : tW;    // 棋盘真正能用的高、宽
      // 首帧的测量往往还没稳定（ResizeObserver 会在布局落定前先响一次），
      // 拿那个偏小的高度定行数，就会掉到下限 10。所以：棋盘还空着的时候，
      // 只要测量值变了就按新值重建——一旦落下第一块就锁死，不再改动
      const wantBH = clamp(Math.floor((boxH + GAP) / (MIN_CELL + GAP)), 10, cfg.h);
      if (!built) {
        if (b.h < 240) return;                            // 明显不合理的测量，等下一帧
        BH = wantBH; buildCells(); built = true;
        startPlay();
      } else if (wantBH !== BH && pristine) {
        BH = wantBH; buildCells();
        occ = makeJunk();                                 // 垫底石块跟着新行数贴到底
        if (cur) cur.y = Math.min(cur.y, BH - pDims(cur.cs)[0]);
        paint();
      }
      const availH = boxH - GAP * (BH - 1);
      cellPx2 = clamp(Math.floor(Math.min(availW / BW, availH / BH)), 12, 60);
      grid.style.gap = '2px';
      grid.style.gridTemplateColumns = 'repeat(' + BW + ',' + px(cellPx2) + ')';
      grid.style.gridAutoRows = px(cellPx2);
      pauseMask.style.fontSize = px(clamp(cellPx2 * .9, 20, 48));
      paint();
    };
    return;
  }

  /* ---------- 拼满 / 消消：选块 + 落位 ---------- */
  const isClear = cfg.kind === 'clear';
  const BW = isClear ? cfg.w : 4, BH = isClear ? cfg.h : 4;
  const occ = {};                      // 已占格
  const region = {};                   // 拼满模式下的目标区域
  let pieces = [];                     // 待放置的块
  let sel = -1, cleared = 0, ending = false;
  const cells = [];
  // 走错一步不用整关重来：每次落子前存一份，「退回一步」放在右侧伙伴栏（跟落体关同一个位置）
  const history = [];
  const undoBtn = el('button', 'sw', '↩︎ 退回一步');
  undoBtn.addEventListener('click', () => { Audio2.init(); undo(); });
  const paintUndo = () => { undoBtn.style.opacity = history.length ? '' : '.5'; };

  function buildRegion() {             // 用 n 块随机拼出一块连通区域，保证有解
    for (let attempt = 0; attempt < 60; attempt++) {
      const used = {}, out = [];
      let okAll = true;
      for (let i = 0; i < cfg.pieces; i++) {
        let placed = false;
        const order = shuffle(POLY.filter(p => p.length >= 2 && p.length <= 4));
        for (const p of order) {
          for (const r of shuffle(pAllRot(p))) {
            const d = pDims(r);
            const spots = [];
            for (let y = 0; y + d[0] <= BH; y++) for (let x = 0; x + d[1] <= BW; x++) {
              if (r.every(c => !used[(c[0] + y) + ',' + (c[1] + x)])) {
                if (i === 0 || r.some(c => {
                  const yy = c[0] + y, xx = c[1] + x;
                  return used[(yy - 1) + ',' + xx] || used[(yy + 1) + ',' + xx] || used[yy + ',' + (xx - 1)] || used[yy + ',' + (xx + 1)];
                })) spots.push([y, x]);
              }
            }
            if (spots.length) { const [y, x] = pick(spots); r.forEach(c => used[(c[0] + y) + ',' + (c[1] + x)] = 1); out.push(pNorm(r)); placed = true; break; }
          }
          if (placed) break;
        }
        if (!placed) { okAll = false; break; }
      }
      if (okAll) return { used: used, pieces: out };
    }
    return null;
  }
  if (!isClear) {
    const g2 = buildRegion();
    if (g2) { Object.keys(g2.used).forEach(k => region[k] = 1); pieces = shuffle(g2.pieces); }
  } else {
    pieces = [0, 1, 2].map(() => pNorm(pick(pAllRot(pick(POLY.filter(p => p.length >= 2 && p.length <= 4))))));
  }
  for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
    const c = el('div'); c.dataset.y = y; c.dataset.x = x;
    c.addEventListener('click', () => drop(y, x));
    cells.push(c); boardWrap.appendChild(c);
  }
  function paintBoard() {
    cells.forEach(c => {
      const k = c.dataset.y + ',' + c.dataset.x;
      if (occ[k]) c.style.cssText = 'background:' + occ[k] + ';border:2px solid var(--ink);border-radius:6px';
      else if (!isClear && region[k]) c.style.cssText = 'background:repeating-linear-gradient(45deg,#EFE7D4 0 7px,transparent 7px 14px);border:3px dashed var(--orange);border-radius:6px';
      else c.style.cssText = isClear ? 'background:#fff;border:2px solid var(--line);border-radius:6px' : 'background:transparent;border:2px solid transparent';
      c.style.width = px(cellPx); c.style.height = px(cellPx);
    });
  }
  function paintTray() {
    tray.innerHTML = '';
    pieces.forEach((p, i) => {
      if (!p) { const gap = el('div'); gap.style.width = px(cellPx * 2); tray.appendChild(gap); return; }
      const t = el('div', 'tile' + (i === sel ? ' pick' : '')); t.style.padding = '7px';
      t.appendChild(pieceEl(p, cellPx * .68, FIT_COLORS[i % FIT_COLORS.length]));
      t.addEventListener('click', () => { sel = i; Audio2.tap(); paintTray(); });
      tray.appendChild(t);
    });
    if (cfg.rot || isClear) {
      const rb = el('button', 'sw', '🔄 转一下');
      rb.addEventListener('click', () => {
        if (sel < 0 || !pieces[sel]) { Voice.say('先选一块'); return; }
        pieces[sel] = pRot(pieces[sel]); Audio2.tap(); paintTray();
      });
      tray.appendChild(rb);
    }
  }
  function canPlace(p, y, x) {
    return p.every(c => {
      const yy = c[0] + y, xx = c[1] + x, k = yy + ',' + xx;
      if (yy < 0 || xx < 0 || yy >= BH || xx >= BW || occ[k]) return false;
      if (!isClear && !region[k]) return false;
      return true;
    });
  }
  function drop(y, x) {
    if (sel < 0 || !pieces[sel]) { Voice.say('先选一块方块'); return; }
    const p = pieces[sel];
    // 宽容落位：只要有一种摆法能盖住你点的格子就算
    let best = null;
    for (const c of p) { const oy = y - c[0], ox = x - c[1]; if (canPlace(p, oy, ox)) { best = [oy, ox]; break; } }
    if (!best) { miss(); const cell = cells[y * BW + x]; cell.classList.remove('shake'); void cell.offsetWidth; cell.classList.add('shake'); Voice.say('这里放不下，换个地方试试'); return; }
    history.push({ occ: Object.assign({}, occ), pieces: pieces.slice(), cleared: cleared });
    if (history.length > 15) history.shift();
    undoBtn.classList.remove('pulse');
    const color = FIT_COLORS[sel % FIT_COLORS.length];
    p.forEach(c => occ[(c[0] + best[0]) + ',' + (c[1] + best[1])] = color);
    pieces[sel] = null; sel = -1; Audio2.pop(); paintBoard(); paintTray(); paintUndo();
    if (isClear) checkLines(); else checkFull();
  }
  function undo() {
    if (ending) return;
    if (!history.length) { Voice.say('还没有可以退回的一步'); toast('还没有可以退回的'); return; }
    const h = history.pop();
    Object.keys(occ).forEach(k => delete occ[k]); Object.assign(occ, h.occ);
    pieces = h.pieces.slice(); cleared = h.cleared; sel = -1;
    undoBtn.classList.remove('pulse');
    Audio2.step(); toast('退回一步 ↩︎');
    paintBoard(); paintTray(); paintUndo();
    if (isClear) setPrompt('已经消掉 <span class="num">' + cleared + '</span> / ' + cfg.goal + ' 行');
    else setPrompt('还剩 <span class="num">' + (Object.keys(region).length - Object.keys(occ).length) + '</span> 格');
  }
  // 剩下的块（能转的话转哪个方向都算）一块都放不进去了：这一步已经走死，提示退回
  function deadEnd() {
    const left = pieces.filter(p => p);
    return left.length > 0 && left.every(p => (cfg.rot ? pAllRot(p) : [p]).every(r => {
      for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) if (canPlace(r, y, x)) return false;
      return true;
    }));
  }
  function checkFull() {
    const need = Object.keys(region).length, have = Object.keys(occ).length;
    setPrompt('还剩 <span class="num">' + (need - have) + '</span> 格');
    if (have >= need) { ending = true; setPrompt('拼满啦！'); Voice.say('拼满啦'); later(500, () => roundWin(boardWrap)); }
    else if (pieces.every(p => !p)) { ending = true; Voice.say('方块用完了，再来一次'); later(900, () => nextRound()); }
    else if (deadEnd()) {
      setPrompt('放不进去了<br>点 <b>↩︎ 退回一步</b>');
      Voice.say('剩下的方块放不进去了，点退回一步，再试试');
      undoBtn.classList.add('pulse');
    }
  }
  function checkLines() {
    let got = 0;
    for (let y = 0; y < BH; y++) { let full = true; for (let x = 0; x < BW; x++) if (!occ[y + ',' + x]) full = false; if (full) { for (let x = 0; x < BW; x++) delete occ[y + ',' + x]; got++; } }
    for (let x = 0; x < BW; x++) { let full = true; for (let y = 0; y < BH; y++) if (!occ[y + ',' + x]) full = false; if (full) { for (let y = 0; y < BH; y++) delete occ[y + ',' + x]; got++; } }
    if (got) { cleared += got; Audio2.star(); toast('消掉 ' + got + ' 行！'); paintBoard(); }
    setPrompt('已经消掉 <span class="num">' + cleared + '</span> / ' + cfg.goal + ' 行');
    if (cleared >= cfg.goal) { ending = true; setPrompt('消够啦 🎉'); Voice.say('消够啦'); return later(500, () => roundWin(boardWrap)); }
    if (pieces.every(p => !p)) pieces = [0, 1, 2].map(() => pNorm(pick(pAllRot(pick(POLY.filter(p => p.length >= 2 && p.length <= 4))))));
    // 一块都放不下就换一批，不让孩子卡死
    const stuck = pieces.every(p => { if (!p) return true; for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) if (canPlace(p, y, x)) return false; return true; });
    if (stuck) { pieces = [0, 1, 2].map(() => pNorm(pick(pAllRot(pick(POLY.filter(p => p.length >= 2 && p.length <= 3)))))); toast('换一批方块 🔄'); }
    paintTray();
  }
  holder.appendChild(boardWrap); holder.appendChild(tray); board.appendChild(holder);
  addExtra(undoBtn, holder); paintUndo();
  const rid = ROUND_ID;
  const onKey = ev => {
    if (rid !== ROUND_ID) { removeEventListener('keydown', onKey); return; }
    if (ev.key === 'z' || ev.key === 'Backspace') { undo(); ev.preventDefault(); }
  };
  addEventListener('keydown', onKey);
  setPrompt(isClear ? '填满一整行或一整列就会消掉' : '用下面的方块把虚线区域拼满');
  Voice.say(isClear ? '把方块放到棋盘上，填满一整行或者一整列就会消掉。不会掉下来，可以慢慢想'
    : '先点一块方块，再点要放的位置，把虚线的地方拼满');
  Fit.cb = () => {
    const b = boardBox();
    cellPx = cellFit(b.w * .92, b.h * .56, BW, BH, 3, 80);
    boardWrap.style.gap = '3px';
    boardWrap.style.gridTemplateColumns = 'repeat(' + BW + ',' + px(cellPx) + ')';
    boardWrap.style.gridAutoRows = px(cellPx);
    paintBoard(); paintTray();
  };
}

GAME_IMPL.fit = gFit;
