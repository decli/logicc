// 思维小画本 · 数点点。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 点子图案 ===================== */
const DIE = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function faceEl(n) {
  const f = el('div', 'face');
  if (n <= 6) { const on = DIE[n] || []; for (let i = 0; i < 9; i++) { const b = el('b'); if (!on.includes(i)) b.className = 'off'; f.appendChild(b); } }
  else { f.classList.add('wide'); for (let i = 0; i < 10; i++) { const b = el('b'); if (i >= n) b.className = 'off'; f.appendChild(b); } }
  return f;
}
/* ===================== 2 数点点 ===================== */
function gDots(board, lv) {
  const cfg = G.dots.levels[lv - 1].cfg;
  const wrap = el('div', 'row2'); wrap.style.flexWrap = 'wrap';
  const opts = el('div', 'row2');
  let sizer = null;

  if (cfg.kind === 'cmp') {
    const a = 2 + rnd(7); let b2 = 2 + rnd(7); while (b2 === a) b2 = 2 + rnd(7);
    const cards = [a, b2].map(v => {
      const t = el('div', 'tile'); t.appendChild(faceEl(v)); t.dataset.v = v;
      t.addEventListener('click', () => {
        if (v === Math.max(a, b2)) { Audio2.good(); t.classList.add('done'); later(350, () => roundWin(t)); }
        else { miss(); t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); }
      });
      return t;
    });
    cards.forEach(c => opts.appendChild(c));
    wrap.appendChild(opts); board.appendChild(wrap);
    setPrompt('哪一张点更多？');
    Voice.say('哪一张的点更多？');
    sizer = () => { const b = boardBox(), s = cellFit(b.w, b.h, 2, 1, 24, 240); cards.forEach(c => { c.style.width = px(s); c.style.height = px(s); }); opts.style.gap = px(24); };
    hintIn(10000, () => cards[a > b2 ? 0 : 1].classList.add('pulse'));

  } else if (cfg.kind === 'flash') {
    const N = 3 + rnd(6);
    const card = el('div', 'tile'); const face = faceEl(N); card.appendChild(face);
    wrap.appendChild(card); board.appendChild(wrap); board.appendChild(opts);
    board.style.flexDirection = 'column'; board.style.gap = '14px';
    setPrompt('看好了，一会儿要藏起来');
    Voice.say('看好了，数一数有几个点');
    const choices = shuffle([N, ...uniqueNear(N, 10, 2)]);
    later(1400, () => {
      card.innerHTML = ''; const q = el('div', 'qm num', '?'); q.style.fontSize = px(card.getBoundingClientRect().height * .4); card.appendChild(q);
      setPrompt('刚才有几个点？');
      Voice.say('刚才有几个点？');
      choices.forEach(v => {
        const o = el('div', 'tile num', String(v));
        o.addEventListener('click', () => {
          if (v === N) { Audio2.good(); o.classList.add('done'); card.innerHTML = ''; card.appendChild(faceEl(N)); fitFaces(); later(500, () => roundWin(card)); }
          else { miss(); o.classList.remove('shake'); void o.offsetWidth; o.classList.add('shake'); }
        });
        opts.appendChild(o);
      });
      Fit.run();
    });
    sizer = () => {
      const b = boardBox(), s = cellFit(b.w, b.h * .62, 1, 1, 0, 220);
      card.style.width = px(s); card.style.height = px(s);
      const o = clamp(s * .45, 44, 110);
      opts.style.gap = px(14);
      opts.querySelectorAll('.tile').forEach(n => { n.style.width = px(o); n.style.height = px(o); n.style.fontSize = px(o * .5); });
    };

  } else {
    const max = cfg.max, T = 3 + rnd(max - 2);
    const parts = cfg.kind === 'make3' ? 2 : 1;
    let given = [], rest = T;
    for (let i = 0; i < parts; i++) { const v = 1 + rnd(Math.max(1, rest - (parts - i))); given.push(v); rest -= v; }
    const need = rest;
    const dom = el('div', 'domino');
    given.forEach(v => { const h = el('div', 'half'); h.appendChild(faceEl(v)); dom.appendChild(h); });
    const qh = el('div', 'half'); const qm = el('div', 'qm num', '?'); qh.appendChild(qm); dom.appendChild(qh);
    const choices = shuffle([need, ...uniqueNear(need, T, 2)]);
    choices.forEach(v => {
      const o = el('div', 'tile'); o.appendChild(faceEl(v));
      o.addEventListener('click', () => {
        if (v === need) {
          Audio2.good(); qh.innerHTML = ''; qh.appendChild(faceEl(v)); fitFaces(); o.classList.add('done');
          const dots = dom.querySelectorAll('b:not(.off)'); let i = 0;
          every(170, tm => {
            if (i >= dots.length) { clearInterval(tm); later(250, () => roundWin(dom)); return; }
            dots[i].classList.add('lit'); Audio2.count(i); i++;
          });
        } else { miss(); o.classList.remove('shake'); void o.offsetWidth; o.classList.add('shake'); }
      });
      opts.appendChild(o);
    });
    wrap.appendChild(dom); wrap.appendChild(opts); board.appendChild(wrap);
    setPrompt('一共要 <span class="num">' + T + '</span> 个点，还差几个？');
    Voice.say('一共要 ' + T + ' 个点，还差几个？');
    hintIn(10000, () => opts.querySelectorAll('.tile').forEach((o, i) => { if (choices[i] === need) o.classList.add('pulse'); }));
    sizer = () => {
      const b = boardBox();
      const rows = given.length + 1;
      const gap = clamp(b.w / 60, 10, 26);
      let dh = Math.min(b.h * .92, (b.w - gap) * .62);
      let dw = dh / rows * .92;
      if (dw > b.w * .34) { dw = b.w * .34; dh = dw * rows / .92; }
      dom.style.width = px(dw); dom.style.height = px(dh);
      qm.style.fontSize = px(dh / rows * .45);
      const ow = clamp(Math.min((b.w - dw - gap * 2) / 3.4, dh / rows), 46, 150);
      wrap.style.gap = px(gap); opts.style.gap = px(gap * .7);
      opts.style.flexDirection = b.w < dw + ow * 3.6 ? 'column' : 'row';
      opts.querySelectorAll('.tile').forEach(n => { n.style.width = px(ow * 1.3); n.style.height = px(ow); });
    };
  }
  Fit.cb = sizer;
}

GAME_IMPL.dots = gDots;
