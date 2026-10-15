// 思维小画本 · 照镜子。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 5 照镜子 =====================
   儿童在这个年龄普遍具有「镜像不变性」：知觉上把左右翻转的图形当成同一个东西
   （也是 b/d、p/q 写反的同源现象），要到六七岁才逐步解除。
   所以这里不从「画出镜像」起步，而按 动作 → 看见 → 识别 → 产出 排：
   先认（哪个是镜子里的）→ 再动手（移动自己，看镜中同步反向移动）
   → 带影子提示地放 → 自己放；上下、对角线、旋转依次靠后。
   每次完成都会播一次「对折合上」的动画，把结论具身化。
   ================================================================== */
function mirrorMap(axis, W, H, y, x) {
  if (axis === 'x') return [y, W - 1 - x];
  if (axis === 'y') return [H - 1 - y, x];
  if (axis === 'diag') return [x, y];
  return [H - 1 - y, W - 1 - x];
}
function randomBlob(W, H, n, limit) {
  const set = new Set();
  let y = rnd(H), x = rnd(W), guard = 0;
  if (limit) { const p = pick(limit); y = p[0]; x = p[1]; }
  set.add(y + ',' + x);
  while (set.size < n && guard++ < 500) {
    const d = pick([[0, 1], [1, 0], [0, -1], [-1, 0]]);
    const ny = clamp(y + d[0], 0, H - 1), nx = clamp(x + d[1], 0, W - 1);
    if (limit && !limit.some(p => p[0] === ny && p[1] === nx)) continue;
    y = ny; x = nx; set.add(y + ',' + x);
  }
  return set;
}
function miniGrid(W, H, cells, size, cls) {
  const g = el('div', 'mgrid');
  g.style.display = 'grid';
  g.style.gridTemplateColumns = 'repeat(' + W + ',' + px(size) + ')';
  g.style.gridAutoRows = px(size); g.style.gap = '3px';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = el('div', 'mc' + (cells.has(y + ',' + x) ? ' ' + (cls || 'on') : ''));
    g.appendChild(c);
  }
  return g;
}
function gMirror(board, lv) {
  const cfg = G.mirror.levels[lv - 1].cfg;

  /* ---------- 第一层：只认，不画 ---------- */
  if (cfg.kind === 'find') {
    const W = 4, H = 4, src = randomBlob(W, H, 5);
    const flip = new Set(), rot = new Set(), same = new Set();
    src.forEach(k => {
      const [y, x] = k.split(',').map(Number);
      flip.add(y + ',' + (W - 1 - x));
      rot.add((H - 1 - y) + ',' + (W - 1 - x));
      same.add(k);
    });
    const holder = el('div', 'col2'); holder.style.gap = '12px';
    const top = el('div', 'row2'); top.style.gap = '10px';
    const opts = el('div', 'row2'); opts.style.gap = '16px';
    const cands = shuffle([{ s: flip, ok: true }, { s: rot, ok: false, why: '这个是转过来的，不是照镜子' }, { s: same, ok: false, why: '这个和原来一模一样，没有翻过来' }]);
    let refBox = null, optBoxes = [];
    holder.appendChild(top); holder.appendChild(opts); board.appendChild(holder);
    const draw = size => {
      top.innerHTML = ''; opts.innerHTML = ''; optBoxes = [];
      refBox = miniGrid(W, H, src, size);
      top.appendChild(refBox);
      const mir = el('div'); mir.style.cssText = 'width:6px;align-self:stretch;border-left:5px dashed var(--orange)';
      top.appendChild(mir);
      const q = el('div', 'tile', '?'); q.style.cssText += 'width:' + px(size * W) + ';height:' + px(size * H) + ';font-size:' + px(size * 1.2) + ';color:var(--line)';
      top.appendChild(q);
      cands.forEach(c => {
        const box = el('div', 'tile'); box.style.padding = '6px';
        box.appendChild(miniGrid(W, H, c.s, size * .82, 'put'));
        box.addEventListener('click', () => {
          if (c.ok) { Audio2.good(); box.classList.add('done'); q.innerHTML = ''; q.appendChild(miniGrid(W, H, c.s, size, 'put')); later(650, () => roundWin(box)); }
          else { miss(); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); Voice.say(c.why); }
        });
        optBoxes.push(box); opts.appendChild(box);
      });
      staggerIn(opts);
    };
    setPrompt('镜子右边应该是哪一个？');
    Voice.say('左边的图案照镜子以后，右边会变成什么样？在下面挑一个');
    hintIn(15000, () => { const b2 = optBoxes[cands.findIndex(c => c.ok)]; if (b2) b2.classList.add('pulse'); });
    Fit.cb = () => { const b = boardBox(); draw(clamp(Math.min(b.h * .11, b.w * .045), 14, 42)); };
    return;
  }

  /* ---------- 第二层：自己动，看着镜子同步反向动 ---------- */
  if (cfg.kind === 'live') {
    const W = cfg.w, H = cfg.h;
    let py = rnd(H), pxx = rnd(W);
    let ty = rnd(H), tx = rnd(W);
    while (tx === W - 1 - pxx && ty === py) { ty = rnd(H); tx = rnd(W); }
    const holder = el('div', 'col2');
    const stack = el('div', 'row2'); stack.style.gap = '18px';
    const gA = el('div', 'mgrid'), gB = el('div', 'mgrid');
    const cA = [], cB = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const a2 = el('div', 'mc'); a2.dataset.y = y; a2.dataset.x = x;
      a2.addEventListener('click', () => move(y, x));
      cA.push(a2); gA.appendChild(a2);
      const b2 = el('div', 'mc'); cB.push(b2); gB.appendChild(b2);
    }
    const axis = el('div'); axis.style.cssText = 'width:6px;align-self:stretch;border-left:5px dashed var(--orange)';
    stack.appendChild(gA); stack.appendChild(axis); stack.appendChild(gB);
    holder.appendChild(stack); board.appendChild(holder);
    const at = (arr, y, x) => arr[y * W + x];
    function paint() {
      cA.forEach(c => { c.textContent = ''; c.classList.remove('on'); });
      cB.forEach(c => { c.textContent = ''; c.classList.remove('put'); });
      at(cA, py, pxx).textContent = '🐰'; at(cA, py, pxx).classList.add('on');
      at(cB, ty, tx).textContent = '🥕';
      const mx = W - 1 - pxx;
      at(cB, py, mx).textContent = '🐰'; at(cB, py, mx).classList.add('put');
    }
    function move(y, x) {
      if (Math.abs(y - py) + Math.abs(x - pxx) !== 1) { Voice.say('一次只能走一格'); return; }
      py = y; pxx = x; Audio2.step(); paint();
      if (py === ty && W - 1 - pxx === tx) {
        setPrompt('镜子里的兔子吃到胡萝卜啦 🥕');
        Voice.say('成功啦，你往左它就往右');
        later(500, () => roundWin(gB));
      }
    }
    paint();
    setPrompt('你走左边，让<b>镜子里</b>的兔子踩到胡萝卜');
    Voice.say('你只能移动左边的兔子。你往左走，镜子里的兔子就往右走。想办法让镜子里的兔子踩到胡萝卜');
    hintIn(18000, () => { at(cA, ty, W - 1 - tx).classList.add('pulse'); later(2200, () => at(cA, ty, W - 1 - tx).classList.remove('pulse')); });
    Fit.cb = () => {
      const b = boardBox(), gap = 4;
      const c = cellFit(b.w - 40, b.h - 20, W * 2 + .6, H, gap, 96);
      [gA, gB].forEach(g => { g.style.gap = px(gap); g.style.gridTemplateColumns = 'repeat(' + W + ',' + px(c) + ')'; g.style.gridAutoRows = px(c); });
      [...cA, ...cB].forEach(x2 => x2.style.fontSize = px(c * .6));
    };
    return;
  }

  /* ---------- 第三层起：自己放 ---------- */
  const W = cfg.w, H = cfg.h, axis = cfg.axis;
  const lower = [];
  if (axis === 'diag') for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (y > x) lower.push([y, x]);
  const src = randomBlob(W, H, cfg.n, axis === 'diag' ? lower : null);
  const holder = el('div', 'col2');
  const stage = el('div'); stage.style.position = 'relative';
  const stack = el('div'); stack.style.display = 'flex'; stack.style.alignItems = 'center'; stack.style.justifyContent = 'center';
  const single = axis === 'diag';
  const gA = el('div', 'mgrid'), gB = single ? gA : el('div', 'mgrid');
  const needMap = {}; const cellsA = [];
  const mk = (y, x) => {
    const need = src.has(mirrorMap(axis, W, H, y, x).join(','));
    const c = el('div', 'mc');
    if (src.has(y + ',' + x)) { c.classList.add('on'); return c; }          // 原图那一半
    if (need) needMap[y + ',' + x] = c;
    if (!single || y < x) c.addEventListener('click', () => onTap(c, need));
    return c;
  };
  if (single) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = mk(y, x);
      if (y === x) { c.style.background = 'var(--line)'; c.style.opacity = '.5'; }
      cellsA.push(c); gA.appendChild(c);
    }
  } else {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) gA.appendChild(el('div', 'mc' + (src.has(y + ',' + x) ? ' on' : '')));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const need = src.has(mirrorMap(axis, W, H, y, x).join(','));
      const c = el('div', 'mc');
      if (need) needMap[y + ',' + x] = c;
      c.addEventListener('click', () => onTap(c, need));
      gB.appendChild(c);
    }
  }
  const want = Object.values(needMap), total = want.length;
  const placed = () => (single ? gA : gB).querySelectorAll('.put').length;
  const ok = () => placed() === total && want.every(n => n.classList.contains('put'));
  let finished = false;
  const tips = { x: '右边点一点，画出和左边一样的', y: '下面点一点，画出和上面一样的', diag: '沿着斜线对折，把另一半补上', rot: '把左边的图案转半圈，画到右边（不是照镜子）' };

  function ghostOn(on) { want.forEach(n => n.classList.toggle('ghost', !!on && !n.classList.contains('put'))); }
  function foldCheck(done) {                       // 对折合上：把结论做成看得见的动作
    if (single) { later(400, done); return; }
    const r1 = gA.getBoundingClientRect(), r2 = gB.getBoundingClientRect();
    gB.classList.add('foldwrap');
    gB.style.setProperty('--foldx', px(-(r2.left - r1.left) - (axis === 'y' ? 0 : 0)));
    gB.style.transformOrigin = axis === 'y' ? 'center top' : 'left center';
    later(120, () => {
      gB.style.transform = axis === 'y'
        ? 'scaleY(-1) translateY(' + (r2.top - r1.top) + 'px)'
        : 'scaleX(-1) translateX(' + (r2.left - r1.left) + 'px)';
      gB.style.opacity = '.55';
      Audio2.pop();
    });
    later(1150, () => { gB.style.transform = ''; gB.style.opacity = ''; done(); });
  }
  function winNow() {
    if (finished) return; finished = true;
    setPrompt('对折起来，正好合上！');
    Voice.say('看，对折起来正好合上');
    foldCheck(() => roundWin(stage));
  }
  function onTap(c, need) {
    if (finished) return;
    if (c.classList.contains('put')) { if (!cfg.instant) { c.classList.remove('put'); Audio2.tap(); ghostOn(cfg.ghost === 'keep'); } return; }
    if (need) { c.classList.add('put'); c.classList.remove('ghost'); Audio2.good(); }
    else if (cfg.instant) { miss(); c.classList.add('bad'); setTimeout(() => c.classList.remove('bad'), 480); return; }
    else { c.classList.add('put'); Audio2.tap(); }
    if (cfg.instant) { if (ok()) winNow(); }
    else if (placed() >= total) check();
  }
  function check() {
    if (finished) return;
    if (ok()) return winNow();
    const bad = [...(single ? gA : gB).querySelectorAll('.put')].filter(n => want.indexOf(n) < 0);
    if (!bad.length) {
      const rest = total - placed();
      setPrompt('都对，还差 <span class="num">' + rest + '</span> 个');
      Voice.say('画的都对，还差 ' + rest + ' 个');
      later(1300, () => { if (!finished) setPrompt(tips[axis]); });
      return;
    }
    miss(); bad.forEach(n => n.classList.add('bad'));
    setPrompt('对了 <span class="num">' + (placed() - bad.length) + '</span> 个，有 <span class="num">' + bad.length + '</span> 个不对');
    Voice.say(axis === 'rot' ? '有几个不对。不是照镜子哦，要把图案转半圈' : '有几个不对，我帮你擦掉了，再看看');
    later(750, () => { bad.forEach(n => n.classList.remove('bad', 'put')); if (ok()) winNow(); else setPrompt(tips[axis]); });
  }
  const divider = el('div');
  if (!single) { stack.appendChild(gA); stack.appendChild(gB); }
  else stack.appendChild(gA);
  if (axis === 'y') stack.style.flexDirection = 'column';
  stage.appendChild(stack); stage.appendChild(divider);
  const bar = el('div', 'row2'); bar.style.gap = '10px'; bar.style.marginTop = '10px';
  const hint = el('button', 'sw', '💡 看一眼（少一颗星）');
  hint.addEventListener('click', () => { if (finished) return; miss(); ghostOn(true); later(1600, () => ghostOn(cfg.ghost === 'keep')); });
  bar.appendChild(hint);
  if (!cfg.instant) {
    const doneBtn = el('button', 'sw', '✅ 画好了'); doneBtn.style.background = 'var(--yellow)';
    doneBtn.addEventListener('click', () => { if (finished) return; if (!placed()) { Voice.say('先在格子上点一点'); return; } check(); });
    bar.appendChild(doneBtn);
  }
  holder.appendChild(stage); holder.appendChild(bar); board.appendChild(holder);
  if (cfg.ghost) { ghostOn(true); if (cfg.ghost === 'fade') later(3200, () => ghostOn(false)); }
  staggerIn(gA, '.mc'); if (!single) staggerIn(gB, '.mc');
  setPrompt(tips[axis]);
  Voice.say(axis === 'rot' ? '把左边的图案转半圈画到右边，注意不是照镜子'
    : axis === 'y' ? '中间是一面横着的镜子，下面画出一样的'
      : axis === 'diag' ? '镜子是斜着放的，沿着这条斜线把另一半补上'
        : '中间是一面镜子，右边画出一样的');
  hintIn(16000, () => { if (!finished) { ghostOn(true); later(1500, () => ghostOn(cfg.ghost === 'keep')); } });
  Fit.cb = () => {
    const b = boardBox(), gap = 4, pad = 18;
    const two = single ? { c: W, r: H } : (axis === 'y' ? { c: W, r: H * 2 } : { c: W * 2, r: H });
    const c = cellFit(b.w - pad, b.h - pad - 52, two.c + .4, two.r + .4, gap, 92);
    [gA, gB].forEach(g => { g.style.gap = px(gap); g.style.gridTemplateColumns = 'repeat(' + W + ',' + px(c) + ')'; g.style.gridAutoRows = px(c); });
    if (!single) stack.style.gap = px(clamp(c * .45, 14, 40));
    if (single) {
      divider.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;' +
        'background:linear-gradient(to top right,transparent calc(50% - 2px),var(--orange) calc(50% - 2px),var(--orange) calc(50% + 2px),transparent calc(50% + 2px))';
    } else if (axis === 'y') divider.style.cssText = 'position:absolute;left:-6px;right:-6px;top:50%;border-top:4px dashed var(--orange)';
    else if (axis === 'rot') {
      divider.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:' + px(clamp(c * .7, 22, 46)) +
        ';color:var(--orange);background:var(--paper);border:3px solid var(--orange);border-radius:50%;width:' + px(clamp(c * 1.05, 34, 64)) +
        ';height:' + px(clamp(c * 1.05, 34, 64)) + ';display:flex;align-items:center;justify-content:center;font-weight:700';
      divider.textContent = '↻';
    } else divider.style.cssText = 'position:absolute;top:-6px;bottom:-6px;left:50%;border-left:4px dashed var(--orange)';
  };
}

GAME_IMPL.mirror = gMirror;
