// 思维小画本 · 凑数字。首页 ../index.html 第一次点开这个游戏时才加载这个文件（loadGame）；读题、音效、关卡外壳
// （Voice、Audio2、roundWin、hintIn、Fit……）都是首页里的公共方法，直接用。

/* ===================== 3 凑数字 ===================== */
function gBond(board, lv) {
  const cfg = G.bond.levels[lv - 1].cfg, max = cfg.max;
  const N = 3 + rnd(max - 2);
  const wrap = el('div', 'col2');
  const top = el('div', 'bnode top num');
  const svg = svgEl('svg'); svg.setAttribute('viewBox', '0 0 200 60'); svg.setAttribute('preserveAspectRatio', 'none');
  const leaves = el('div', 'row2');
  let answer, nodes = [];
  const mk = (txt, q) => { const n = el('div', 'bnode num' + (q ? ' q' : ''), txt); nodes.push(n); return n; };

  if (cfg.miss === 'three') {
    const a = 1 + rnd(N - 2), b = 1 + rnd(N - a - 1), c = N - a - b;
    answer = c; top.textContent = N;
    svg.innerHTML = '<line x1="100" y1="4" x2="20" y2="56" stroke="#2A2523" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="100" y1="4" x2="100" y2="56" stroke="#2A2523" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="100" y1="4" x2="180" y2="56" stroke="#2A2523" stroke-width="5" stroke-linecap="round"/>';
    leaves.appendChild(mk(String(a))); leaves.appendChild(mk(String(b))); leaves.appendChild(mk('?', true));
    setPrompt('<span class="num">' + N + '</span> 分成 ' + a + '、' + b + ' 和几？');
    Voice.say(N + ' 分成 ' + a + '、' + b + ' 和几？');
  } else {
    const a = 1 + rnd(N - 1), b = N - a;
    svg.innerHTML = '<line x1="100" y1="4" x2="26" y2="56" stroke="#2A2523" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="100" y1="4" x2="174" y2="56" stroke="#2A2523" stroke-width="5" stroke-linecap="round"/>';
    if (cfg.miss === 'top') {
      answer = N; top.textContent = '?'; top.classList.add('q'); top.classList.remove('top');
      leaves.appendChild(mk(String(a))); leaves.appendChild(mk(String(b)));
      setPrompt('<span class="num">' + a + '</span> 和 <span class="num">' + b + '</span> 合起来是几？');
      Voice.say(a + ' 和 ' + b + ' 合起来是几？');
    } else if (cfg.miss === 'left') {
      answer = a; top.textContent = N;
      leaves.appendChild(mk('?', true)); leaves.appendChild(mk(String(b)));
      setPrompt('<span class="num">' + N + '</span> 分成几和 <span class="num">' + b + '</span>？');
      Voice.say(N + ' 分成几和 ' + b + '？');
    } else {
      answer = b; top.textContent = N;
      leaves.appendChild(mk(String(a))); leaves.appendChild(mk('?', true));
      setPrompt('<span class="num">' + N + '</span> 分成 <span class="num">' + a + '</span> 和几？');
      Voice.say(N + ' 分成 ' + a + ' 和几？');
    }
  }
  const qn = nodes.find(n => n.classList.contains('q')) || top;
  const opts = el('div', 'row2');
  shuffle([answer, ...uniqueNear(answer, Math.max(N, 6), 3)]).forEach(v => {
    const o = el('div', 'tile num', String(v));
    o.addEventListener('click', () => {
      if (v === answer) {
        Audio2.good(); qn.textContent = String(v); qn.classList.remove('q'); qn.classList.add('fill', 'pop');
        later(650, () => roundWin(qn));
      } else { miss(); o.classList.remove('shake'); void o.offsetWidth; o.classList.add('shake'); }
    });
    opts.appendChild(o);
  });
  const help = el('button', 'sw', '💡 把点点摆出来');
  help.addEventListener('click', () => {
    Audio2.tap(); help.disabled = true; help.style.opacity = .5;
    const box = el('div', 'row2'); box.style.flexWrap = 'wrap'; box.style.gap = '5px'; box.style.marginTop = '6px';
    const first = cfg.miss === 'three' ? +nodes[0].textContent : (cfg.miss === 'left' ? 0 : +nodes[0].textContent);
    for (let i = 0; i < N; i++) { const d = el('b'); d.style.cssText = 'width:18px;height:18px;border-radius:50%;display:block;background:' + (i < first ? 'var(--blue)' : 'var(--line)'); box.appendChild(d); }
    wrap.appendChild(box); Fit.run();
  });
  wrap.appendChild(top); wrap.appendChild(svg); wrap.appendChild(leaves); wrap.appendChild(opts); addExtra(help, wrap);
  board.appendChild(wrap);
  hintIn(11000, () => { if (!help.disabled) help.click(); });
  Fit.cb = () => {
    const b = boardBox();
    const leafN = leaves.children.length;
    const node = clamp(Math.min(b.h * .2, b.w / (leafN * 2.1)), 40, 110);
    nodes.concat([top]).forEach(n => { n.style.width = px(node); n.style.height = px(node); n.style.fontSize = px(node * .48); });
    const lw = clamp(b.w * .62, 180, 420);
    leaves.style.gap = px(Math.max(10, lw / leafN - node));
    svg.style.width = px(lw); svg.style.height = px(clamp(b.h * .12, 28, 70));
    const o = clamp(Math.min(b.h * .17, b.w / 5.2), 42, 96);
    opts.style.gap = px(clamp(o * .22, 8, 20)); opts.style.marginTop = px(clamp(b.h * .04, 6, 18));
    opts.querySelectorAll('.tile').forEach(n => { n.style.width = px(o); n.style.height = px(o); n.style.fontSize = px(o * .5); });
    wrap.style.gap = px(clamp(b.h * .012, 2, 10));
  };
}

GAME_IMPL.bond = gBond;
