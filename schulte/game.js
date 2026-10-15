// 思维小画本 · 找数字。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 1 找数字 ===================== */
function gSchulte(board, lv) {
  const cfg = G.schulte.levels[lv - 1].cfg, n = cfg.n, total = n * n;
  let seq = [];
  if (cfg.order === 'asc') seq = range(1, total).map(v => ({ v, c: '' }));
  else if (cfg.order === 'desc') seq = range(1, total).reverse().map(v => ({ v, c: '' }));
  else { const half = total >> 1; for (let i = 1; i <= half; i++) { seq.push({ v: i, c: 'rd' }); seq.push({ v: i, c: 'bl' }); } if (total % 2) seq.push({ v: half + 1, c: 'rd' }); }
  const pool = cfg.order === 'alt' ? seq.slice() : range(1, total).map(v => ({ v, c: '' }));
  const cells = [], grid = el('div');
  grid.style.display = 'grid';
  shuffle(pool).forEach(o => {
    const c = el('div', 'tile num' + (o.c ? ' ' + o.c : ''), String(o.v));
    c.dataset.v = o.v; c.dataset.c = o.c || '';
    c.addEventListener('click', () => {
      if (c.classList.contains('done')) return;
      const want = seq[idx];
      if (+c.dataset.v === want.v && (c.dataset.c || '') === (want.c || '')) {
        c.classList.add('done', 'pop'); c.classList.remove('pulse'); Audio2.good(); idx++;
        if (idx >= seq.length) { setPrompt('全部找到啦'); return roundWin(grid); }
        if (seq[idx].v > chunkMax) growChunk();
        showTarget(); arm();
      } else { miss(); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
    });
    cells.push(c); grid.appendChild(c);
  });
  let idx = 0;
  function paintTarget(reveal) {
    const w = seq[idx];
    const color = w.c === 'rd' ? 'var(--red)' : w.c === 'bl' ? 'var(--blue)' : 'var(--ink)';
    setPrompt('找 <span class="num" id="targetChip" style="color:' + color + '">' + ((S.hideTarget && !reveal) ? '?' : w.v) + '</span>');
    if (S.hideTarget) {
      const chip = document.getElementById('targetChip');
      if (chip) {
        chip.style.cursor = 'pointer';
        chip.addEventListener('click', function () {
          Audio2.tap(); paintTarget(true);
          later(1500, function () { paintTarget(false); });
        });
      }
    }
  }
  function showTarget() {
    paintTarget(false);
    const w = seq[idx];
    Voice.say((w.c === 'rd' ? '红色的 ' : w.c === 'bl' ? '蓝色的 ' : '') + w.v);
  }
  function arm() {
    hintIn(7000, () => {
      const w = seq[idx];
      const t = cells.find(c => +c.dataset.v === w.v && (c.dataset.c || '') === (w.c || '') && !c.classList.contains('done'));
      if (t) t.classList.add('pulse');
      arm();
    });
  }
  // 慢慢来模式：5×5 一次铺开对她太吓人，拆成「先找 5 个」，找完一段下一段才淡入
  const CHUNK = 5;
  let chunkMax = (S.easeIn && total > 9) ? CHUNK : total;
  function applyVeil() {
    if (chunkMax >= total) { cells.forEach(c => c.classList.remove('veil')); return; }
    cells.forEach(c => {
      const v = +c.dataset.v;
      if (v > chunkMax) c.classList.add('veil');
      else if (c.classList.contains('veil')) { c.classList.add('in'); later(30, () => c.classList.remove('veil')); }
    });
  }
  function growChunk() {
    if (chunkMax >= total) return false;
    chunkMax = Math.min(total, chunkMax + CHUNK);
    applyVeil();
    toast('再来 ' + Math.min(CHUNK, total - (chunkMax - CHUNK)) + ' 个 💪');
    return true;
  }
  board.appendChild(grid);
  applyVeil();
  staggerIn(grid, '.tile');
  const first = seq[0];
  paintTarget(false);
  Voice.say(cfg.order === 'desc' ? '这次倒着找，先找 ' + first.v : cfg.order === 'alt' ? '红一、蓝一、红二，这样交替找' : '按顺序找数字，先找 ' + first.v);
  arm();
  Fit.cb = () => {
    const b = boardBox(), gap = clamp(b.w / 90, 5, 12);
    const c = cellFit(b.w, b.h, n, n, gap, 150);
    grid.style.gap = px(gap);
    grid.style.gridTemplateColumns = 'repeat(' + n + ',' + px(c) + ')';
    grid.style.gridAutoRows = px(c);
    cells.forEach(x => x.style.fontSize = px(c * (n > 4 ? .44 : .5)));
  };
}

GAME_IMPL.schulte = gSchulte;
