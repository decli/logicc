// 思维小画本 · 记住亮过的。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 12 记住亮过的（空间工作记忆 / Corsi） =====================
   Corsi 方块范式。学龄前工作记忆容量实测大约 3.2 个条目，
   所以跨度定在 2~4；倒序版需要在脑子里翻转序列，负荷明显更高。
   =============================================================================== */
function gSpan(board, lv) {
  const cfg = G.span.levels[lv - 1].cfg, W = cfg.w, H = cfg.h, L = cfg.len;
  const holder = el('div', 'col2');
  const grid = el('div'); grid.style.display = 'grid';
  const cells = [];
  const all = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) all.push(y * W + x);
  const seq = shuffle(all).slice(0, L);
  let phase = 'show', step = 0;
  for (let k = 0; k < W * H; k++) {
    const c = el('div', 'tile'); c.dataset.k = k;
    c.addEventListener('click', () => tap(k, c));
    cells.push(c); grid.appendChild(c);
  }
  function light(k, on) { cells[k].style.background = on ? 'var(--yellow)' : '#fff'; if (on) cells[k].classList.add('pop'); else cells[k].classList.remove('pop'); }
  function playSeq() {
    setPrompt('看好哪些格子亮了');
    let i = 0;
    every(720, tm => {
      if (i > 0) light(seq[i - 1], false);
      if (i >= L) {
        clearInterval(tm); phase = 'input';
        setPrompt(cfg.rev ? '倒着点一遍（从最后一个开始）' : '照原样点一遍');
        Voice.say(cfg.rev ? '现在倒着点一遍，从最后亮的那个开始' : '现在照刚才的顺序点一遍');
        return;
      }
      light(seq[i], true); Audio2.count(i); i++;
    });
  }
  function want() { return cfg.rev ? seq.slice().reverse() : seq; }
  function tap(k, c) {
    if (phase !== 'input') return;
    const w = want();
    if (k === w[step]) {
      c.style.background = 'var(--green)'; c.classList.add('pop'); Audio2.good(); step++;
      if (step >= L) { setPrompt('全对！'); later(400, () => roundWin(grid)); }
    } else {
      miss(); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
      Voice.say('不是这个，再想想');
    }
  }
  holder.appendChild(grid); board.appendChild(holder);
  setPrompt('看好哪些格子亮了');
  Voice.say(cfg.rev ? '看好格子亮的顺序，等一下要倒着点一遍' : '看好哪些格子亮了，等一下照原样点一遍');
  later(700, playSeq);
  hintIn(20000, () => { if (phase === 'input') { const w = want(); cells[w[step]].classList.add('pulse'); later(1600, () => cells[w[step]] && cells[w[step]].classList.remove('pulse')); } });
  Fit.cb = () => {
    const b = boardBox(), gap = clamp(b.w / 80, 6, 14);
    const c = cellFit(b.w, b.h, W, H, gap, 130);
    grid.style.gap = px(gap);
    grid.style.gridTemplateColumns = 'repeat(' + W + ',' + px(c) + ')';
    grid.style.gridAutoRows = px(c);
  };
}

GAME_IMPL.span = gSpan;
