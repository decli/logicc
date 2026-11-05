// 动物消消乐 · 小老师: when a sum she is correcting is wrong again (or she taps 💡) the teacher comes over the cards,
// and she writes the answer herself on the number pad, which stays beside it (decli 2026-10-19: when she gets one
// wrong, guide her the way a teacher would, with animation and play).
// decli 2026-10-20: nobody knows which way of explaining suits which child, so there are several, and the answer is
// never shown or said. She counts it herself from the picture; if she still gets it wrong the teacher counts with her,
// one tap for each thing, a number on each, and she writes the last number counted.
// decli 2026-11-02: the ways were not easy enough to follow, and school does it in columns, so 列竖式 comes first;
// 🔄 always brings up the four cards to try another (the parent can also start with another, her choice or random).
//  · 列竖式 (col): the column form with a place-value chart under the same two columns, 个位对个位、十位对十位: the ones
//    are added (满十 a bundle goes up to the tens with a small 1) or taken away (不够减 a bundle comes down and is
//    untied, a dot over the tens), she counts and writes that digit under the line, then the tens; then the answer
//    into the sum at the top.
//  · 摆一摆 (frame): the ones sit in a ten frame (2 × 5); ten of them are tied into a bundle (满十捆一捆, 凑十), and when
//    there are not enough ones to take away a bundle is untied (拆一捆, 破十), as first grade does with sticks (小棒).
//    The first number's animals are one kind and each number added another; taking away sends them to marked spots.
//  · 跳一跳 (line): a frog hops along a number line from the first number, a big hop for each ten and a small one for
//    each one, forward to add and back to take away (counting on and back). The whole tens are numbered (decli
//    2026-11-02: counting every tick from the start was too hard) so she reads where it lands from the nearest ten.
//  · 拆一拆 (split): the sum is broken into small steps she fills in, the ways first grade is taught them: tens first,
//    凑十 to add past ten (8 + 5: 8 + ? = 10, 5 = 2 + ?, 10 + 3 = ?), 平十 / 破十 to take away past ten, each step
//    with a picture to count.
// While a sum is acted out the voice counts only what is being added or taken away (1, 2, 3 …), never the total.
const Teach = {
  on: false, s: null, imgs: {}, W: {},
  WAYS: ['col', 'frame', 'line', 'split'],
  CW: 0.96, CH: 2.3, CG: 0.24, MC: 0.43,   // a bundle (its width, height, the gap after it, one of its cells) in frame cells
  img(i, face) {   // a friend's head as a picture (face as in Art.friendTo), made once
    const key = i + (face || 'b');
    if (!this.imgs[key]) this.imgs[key] = Art.friend(i, 128, 120, face).toDataURL();
    return this.imgs[key];
  },
  // the owl's face (decli's four, 2026-11-05): 'b' listening, 't' talking, 'f' praising, 'c' encouraging; a mood holds
  // its face for a while, then the owl goes back to listening or talking with the voice
  owlFace(face, ms) {
    const s = this.s; if (!s) return;
    if (ms) s.moodT = performance.now() + ms;
    const src = this.img(Art.byId('owl'), face);
    if (s.owl.dataset.face !== face) { s.owl.src = src; s.owl.dataset.face = face; }
  },
  // how often each way was used, and how often the sum was then answered without counting together (家长设置 shows it)
  stat(w) { const d = Store.d; if (!d.ways) d.ways = {}; return d.ways[w] || (d.ways[w] = [0, 0]); },

  // q: the sum ({ nums, signs, ans, got }); host: the element it covers; o.close(): she closed it with ✕
  open(q, host, o = {}) {
    if (this.on) this.close();
    this.on = true;
    const kinds = q.nums.map((_, j) => ANIMALS[j % ANIMALS.length].h);
    const ov = el('div', 'teach'), top = el('div', 'thead'), stage = el('div', 'tstage');
    const owl = el('img', 'owl'); owl.src = this.img(Art.byId('owl')); owl.alt = ''; owl.dataset.face = 'b';
    owl.onclick = () => { Snd.play('tap'); Voice.say(this.s && this.s.line); };   // tap the teacher to hear what to do again
    top.appendChild(owl);
    const eq = el('div', 'teq'), parts = [];
    q.nums.forEach((v, j) => {
      if (j) eq.appendChild(el('b', 'op', q.signs[j - 1] === '+' ? '+' : '−'));
      const b = el('b', 'n', v); b.style.setProperty('--c', Cast.FX[FRIENDS[kinds[j]].fam[0]][1]);
      parts.push(b); eq.appendChild(b);
    });
    eq.appendChild(el('b', 'op', '='));
    const ans = el('span', 'tans', q.got || '?'); eq.appendChild(ans);
    top.appendChild(eq);
    const swap = el('button', 'ibtn', '🔄'); swap.hidden = true;   // back to the three ways, to try another
    swap.onclick = () => { Snd.play('tap'); this.pick(false); };
    top.appendChild(swap);
    const shut = el('button', 'ibtn', '✕'); shut.onclick = () => { Snd.play('tap'); Voice.stop(); this.close(); if (o.close) o.close(); };
    top.appendChild(shut);
    ov.appendChild(top); ov.appendChild(stage); host.appendChild(ov);
    const hand = el('div', 'whand', '👆'); stage.appendChild(hand);
    const s = this.s = {
      q, o, ov, stage, ans, parts, kinds, hand, swap, owl, timers: [], gen: 0, line: '', way: '', w: null, cnt: null, badges: [],
      guided: false, idle: 0, moodT: 0,
    };
    s.later = (fn, ms) => { const id = setTimeout(() => { s.timers = s.timers.filter(x => x !== id); if (this.s === s) fn(); }, ms); s.timers.push(id); };
    s.say = (t, o2) => { s.line = t; Voice.say(t, o2); };
    s.col = j => Cast.FX[FRIENDS[kinds[j]].fam[0]][1];
    // the teacher talks while the voice does, and a hand shows where to tap when she waits
    s.tick = setInterval(() => {
      owl.classList.toggle('talk', Voice.busy);
      if (performance.now() > s.moodT) this.owlFace(Voice.busy ? 't' : 'b');
      const t = this.target();
      if (!t) { hand.classList.remove('on'); s.idle = 0; return; }
      s.idle += 150;
      if (s.idle > 2600 && !hand.classList.contains('on')) {
        hand.style.left = t[0] + 'px'; hand.style.top = t[1] + 'px';
        hand.classList.add('on');
        if (!Voice.busy) Voice.say(L.teach.tap);
      }
    }, 150);
    stage.addEventListener('pointerdown', e => {
      e.preventDefault(); Snd.init(); s.idle = 0; hand.classList.remove('on');
      if (s.cnt && !s.cnt.fin) this.countStep();
      else if (s.w && s.w.tap) s.w.tap();
    });
    const mode = Store.d.way || 'col';
    requestAnimationFrame(() => {
      if (this.s !== s) return;
      if (mode === 'pick') this.pick(true);
      else this.use(mode === 'random' ? pick(this.WAYS.filter(w => w !== Store.d.wayLast)) : this.WAYS.includes(mode) ? mode : 'col', true);
    });
  },

  // what each way gets: its layer, the sum, and helpers that stop working once another way takes over
  ctx(root) {
    const s = this.s, T = this, g = s.gen;
    const alive = () => this.s === s && s.gen === g;
    const c = { s, q: s.q, root, kinds: s.kinds, col: s.col, alive };
    c.later = (fn, ms) => s.later(() => { if (alive()) fn(); }, ms);
    c.say = (t, o) => s.say(t, o && o.onend ? { onend: () => { if (alive()) o.onend(); } } : o);
    c.hi = j => s.parts.forEach((p, i) => p.classList.toggle('now', i === j));
    c.one = (k, p) => { const n = { k, el: el('div', 'tk') }; const im = el('img'); im.src = T.img(k); im.alt = ''; n.el.appendChild(im); (p || root).appendChild(n.el); return n; };
    c.ten = (ks, p) => {
      const n = { ten: true, ks, el: el('div', 'tcard') };
      ks.forEach(k => { const im = el('img'); im.src = T.img(k); im.alt = ''; n.el.appendChild(im); });
      (p || root).appendChild(n.el); return n;
    };
    // drops in with a little bounce (no scale: animals in mini cells are scaled from their corner)
    c.pop = (n, delay) => { n.el.style.opacity = 0; c.later(() => { n.el.style.opacity = ''; n.el.animate([{ opacity: 0, translate: '0 -22px' }, { opacity: 1, translate: '0 4px' }, { translate: '0 0' }], { duration: 340, easing: 'ease-out' }); }, delay); };
    c.fxAt = (n, col) => { const r = n.el.getBoundingClientRect(); Fx.sparkles(r.left + r.width / 2, r.top + r.height / 2, 10, r.width * 0.6, col || '#ffd23a'); };
    // an animal into a cell of size cs (a frame cell is u) at X, Y; a bundle at X, Y; one of a bundle's ten places
    c.put = (n, X, Y, u, cs, quick) => {
      cs = cs || u;
      if (quick) n.el.style.transition = 'none';
      n.el.style.width = n.el.style.height = 0.9 * u + 'px';
      n.el.style.transform = `translate(${X + 0.05 * cs}px,${Y + 0.05 * cs}px) scale(${cs / u})`;
      if (quick) { void n.el.offsetWidth; n.el.style.transition = ''; }
    };
    c.mini = (X, Y, i, u) => [X + 0.03 * u + (i % 2) * T.MC * u, Y + 0.075 * u + Math.floor(i / 2) * T.MC * u];
    c.putTen = (n, X, Y, u, quick) => {
      if (quick) n.el.style.transition = 'none';
      Object.assign(n.el.style, { width: T.CW * u + 'px', height: T.CH * u + 'px', borderRadius: 0.2 * u + 'px', transform: `translate(${X}px,${Y}px)` });
      $$('img', n.el).forEach((im, i) => { const [mx, my] = c.mini(0, 0, i, u); Object.assign(im.style, { width: T.MC * 0.9 * u + 'px', height: T.MC * 0.9 * u + 'px', left: mx + 0.02 * u + 'px', top: my + 0.02 * u + 'px' }); });
      if (quick) { void n.el.offsetWidth; n.el.style.transition = ''; }
    };
    c.sv = (tag, a = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in a) e.setAttribute(k, a[k]); return e; };
    return c;
  },
  // back to an empty stage: the way in use (or the choice) goes, with its timers, and so does any counting
  clear() {
    const s = this.s;
    s.gen++; s.timers.forEach(clearTimeout); s.timers = [];
    if (s.w) s.w.root.remove();
    if (s.pickEl) s.pickEl.remove();
    this.unbadge();
    Object.assign(s, { w: null, way: '', pickEl: null, cnt: null, guided: false });
    s.ans.classList.remove('ask'); s.parts.forEach(p => p.classList.remove('now'));
    s.hand.classList.remove('on');
  },
  // the ways as big cards, read out one by one, each bouncing as it is named (two by two when the stage is narrow)
  pick(first) {
    const s = this.s; this.clear();
    s.swap.hidden = true;
    const box = s.pickEl = el('div', 'tpick');
    box.classList.toggle('two', s.stage.clientWidth < 640);
    const cards = this.WAYS.map((w, i) => {
      const c = el('button', 'tway' + (Store.d.wayLast === w ? ' last' : ''));
      c.appendChild(this.pic(w)); c.appendChild(el('b', null, L.teach.ways[i]));
      c.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); Snd.init(); Snd.play('tap'); this.use(w, false); });
      box.appendChild(c); return c;
    });
    s.stage.appendChild(box);
    cards.forEach((c, i) => c.animate([{ opacity: 0, transform: 'translateY(30px) scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 120, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'backwards' }));
    const g = s.gen;
    const name = i => {
      if (this.s !== s || s.gen !== g || i >= cards.length) return;
      cards[i].classList.remove('hey'); void cards[i].offsetWidth; cards[i].classList.add('hey');
      Voice.say(L.teach.ways[i], { onend: () => s.later(() => name(i + 1), 250) });
    };
    s.say(first ? L.teach.pick : L.teach.pick2, { onend: () => s.later(() => name(0), 200) });
  },
  // a small picture of each way for its card
  pic(w) {
    const s = this.s, p = el('div', 'tpic ' + w);
    if (w === 'col') {   // 27 + 15 in columns, the tens tinted like the bundles' side of the chart, the ones like the animals'
      const T = (x, y, t, fill, size = 30) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" text-anchor="middle" fill="${fill}">${t}</text>`;
      p.innerHTML = `<svg viewBox="0 0 200 140"><rect x="80" y="4" width="42" height="132" rx="10" fill="#f1f0dc"/><rect x="126" y="4" width="42" height="132" rx="10" fill="#fff1d6"/>`
        + T(101, 30, '十', '#a9b48c', 15) + T(147, 30, '个', '#e0a860', 15)
        + T(101, 62, '2', '#2f8f86') + T(147, 62, '7', '#2f8f86') + T(50, 98, '+', '#8f9a74') + T(101, 98, '1', '#ff8a1f') + T(147, 98, '5', '#ff8a1f')
        + `<line x1="32" y1="108" x2="170" y2="108" stroke="#5d6b45" stroke-width="4" stroke-linecap="round"/>` + T(116, 106, '1', '#ff8a1f', 15)
        + `<rect x="89" y="113" width="24" height="20" rx="5" fill="#fff" stroke="#f2b630" stroke-width="3" stroke-dasharray="5 4"/>`
        + `<rect x="135" y="113" width="24" height="20" rx="5" fill="#fff" stroke="#f2b630" stroke-width="3" stroke-dasharray="5 4"/></svg>`;
    } else if (w === 'frame') {
      const g = el('div', 'tframe');
      for (let i = 0; i < 10; i++) {
        const c = el('i');
        if (i < 7) { const im = el('img'); im.src = this.img(s.kinds[i < 5 ? 0 : 1]); im.alt = ''; c.appendChild(im); }
        g.appendChild(c);
      }
      p.appendChild(g);
    } else if (w === 'line') {
      let t = '';
      for (let i = 0; i <= 10; i++) t += `<line x1="${10 + i * 18}" y1="96" x2="${10 + i * 18}" y2="${i % 5 ? 106 : 112}" stroke="#c2c8a6" stroke-width="3" stroke-linecap="round"/>`;
      const arc = (a, b) => `<path d="M${a} 94 Q${(a + b) / 2} 62 ${b} 94" fill="none" stroke="#ff8a1f" stroke-width="4" stroke-linecap="round"/>`;
      p.innerHTML = `<svg viewBox="0 0 200 120"><line x1="4" y1="96" x2="196" y2="96" stroke="#a9b48c" stroke-width="5" stroke-linecap="round"/>${t}`
        + `${arc(46, 64)}${arc(64, 82)}${arc(82, 100)}<image href="${this.img(Art.byId('frog'))}" x="80" y="40" width="44" height="44"/></svg>`;
    } else {
      const col = '#ff8a1f', dots = (cx, cy, n) => Array.from({ length: n }, (_, i) => `<circle cx="${cx + (i - (n - 1) / 2) * 13}" cy="${cy}" r="5.5" fill="${col}"/>`).join('');
      p.innerHTML = `<svg viewBox="0 0 200 140"><path d="M88 52 L58 86 M112 52 L142 86" stroke="#c2c8a6" stroke-width="4" stroke-linecap="round"/>`
        + `<circle cx="100" cy="32" r="30" fill="#fff" stroke="#d8d2b4" stroke-width="4"/>${dots(100, 32, 5)}`
        + `<circle cx="52" cy="106" r="28" fill="#fff" stroke="#d8d2b4" stroke-width="4"/>${dots(52, 106, 2)}`
        + `<circle cx="148" cy="106" r="28" fill="#fff8d6" stroke="#f2b630" stroke-width="4" stroke-dasharray="7 5"/>${dots(148, 106, 3)}</svg>`;
    }
    return p;
  },
  // start a way; first: straight from the wrong answer (the parent chose the way), not from the choice
  use(w, first) {
    const s = this.s; this.clear();
    s.way = w;
    s.swap.hidden = false;   // 🔄: the cards, to try another way
    this.stat(w)[0]++; Store.d.wayLast = w; Store.save();
    const root = el('div', 'troot'); s.stage.appendChild(root);
    s.w = this.W[w](this.ctx(root), first ? L.teach.hi[w] : L.teach.wayHi[w]);
    s.w.root = root;
  },
  // where the hand points when she waits: the next thing to count, or what the way wants tapped (in the stage)
  target() {
    const s = this.s; if (!s) return null;
    let it = null;
    if (s.cnt && !s.cnt.fin) it = s.cnt.items[s.cnt.i];
    else if (s.w && s.w.target) { const e = s.w.target(); it = e && { el: e }; }
    if (!it) return null;
    if (it.at) { const [x, y] = it.at(); return [x - 10, y - 40]; }
    const r = it.el.getBoundingClientRect(), b = s.stage.getBoundingClientRect();
    return [r.left - b.left + r.width * 0.3, r.top - b.top + r.height * 0.55];
  },

  // ---------- counting together (带着数) ----------
  // items: [{ el or at(): where, v: the number said there, go(): moves something there and says how long it takes }];
  // she taps, the next one lights up with its number and the number is said; she then writes the last one herself
  guide(items) {
    const s = this.s;
    if (s.cnt && !s.cnt.fin) { s.say(s.w.guideLine || L.teach.guide); return; }   // still counting: keep going
    const again = !!s.cnt;
    this.owlFace('c', 2000);
    this.unbadge();
    s.cnt = { items, i: 0, fin: false };
    s.guided = true; s.idle = 1500;
    if (s.w.recount) s.w.recount();
    this.askEl().classList.remove('ask');
    s.say(again ? L.teach.recount : s.w.guideLine || L.teach.guide);
  },
  countStep() {
    const s = this.s, k = s.cnt, g = s.gen;
    if (performance.now() < (k.wait || 0)) return;   // the frog is still in the air
    const it = k.items[k.i++], d = it.go ? it.go() : 0;
    k.wait = performance.now() + d - 60;
    s.later(() => {
      if (s.gen !== g) return;
      if (it.el) it.el.classList.add('cnt');
      const b = el('b', 'tbadge', it.v); s.stage.appendChild(b); s.badges.push({ b, it }); this.place(b, it);
      b.animate([{ scale: '0' }, { scale: '1.3' }, { scale: '1' }], { duration: 300, easing: 'ease-out' });
    }, d);
    Snd.play('hop', it.v);
    if (k.i < k.items.length) { Voice.say(String(it.v)); return; }
    k.fin = true;
    let said = false;
    const fin = () => { if (said || s.gen !== g || s.cnt !== k) return; said = true; this.askEl().classList.add('ask'); s.say(L.teach.counted); };
    Voice.say(String(it.v), { onend: () => s.later(fin, 250) });
    s.later(fin, 2500);
  },
  place(b, it) {
    let x, y, fs = 20;
    if (it.at) { [x, y] = it.at(); fs = it.fs || fs; }
    else {
      const r = it.el.getBoundingClientRect(), st = this.s.stage.getBoundingClientRect();
      x = r.left - st.left + r.width * 0.78; y = r.top - st.top + Math.min(r.width, r.height) * 0.22;
      fs = clamp(Math.min(r.width, r.height) * 0.42, 15, 30);
    }
    Object.assign(b.style, { left: x + 'px', top: y + 'px', fontSize: fs + 'px' });
  },
  unbadge() {
    const s = this.s;
    s.badges.forEach(x => { x.b.remove(); if (x.it.el) x.it.el.classList.remove('cnt'); });
    s.badges = [];
  },
  askEl() { const s = this.s; return (s.w && s.w.box && s.w.box()) || s.ans; },

  // ---------- from the number pad (math.js) ----------
  key(k) { const w = this.s && this.s.w; return !!(w && w.key && w.key(k)); },   // true: a step of 拆一拆 took it
  sync(got) {
    const s = this.s; if (!s) return;
    s.ans.textContent = got || '?';
    if (got) s.ans.classList.remove('bad');
    if (s.w && s.w.sync) s.w.sync(got);
  },
  shake() {
    const s = this.s; if (!s) return;
    [s.ans, s.w && s.w.box && s.w.box()].forEach(a => { if (a) { a.classList.remove('bad'); void a.offsetWidth; a.classList.add('bad'); setTimeout(() => a.classList.remove('bad'), 450); } });
  },
  // the answer was wrong: before the picture is finished, finish it first; after, count it together (again)
  wrong() {
    const s = this.s; if (!s) return;
    this.shake(); this.owlFace('c', 2200);
    if (!s.w) s.say(s.line || L.teach.pick);
    else if (!s.w.ready()) s.say(L.teach.early);
    else if (s.w.wrongMain) s.w.wrongMain();   // 列竖式: the answer is under the line already, she copied it wrong
    else this.guide(s.w.items());
  },
  right() {
    const s = this.s; if (!s) return;
    this.owlFace('f', 2000);
    if (s.way && !s.guided) { this.stat(s.way)[1]++; Store.save(); }
    this.close(true);
  },
  relayout() {
    const s = this.s; if (!s) return;
    if (s.pickEl) s.pickEl.classList.toggle('two', s.stage.clientWidth < 640);
    if (!s.w) return;
    s.w.relayout();
    s.badges.forEach(x => this.place(x.b, x.it));
  },
  // right: a burst of sparkles as it goes
  close(right) {
    const s = this.s; if (!s) return;
    this.s = null; this.on = false;
    s.timers.forEach(clearTimeout); clearInterval(s.tick);
    if (right) {
      const r = s.ans.getBoundingClientRect();
      Fx.burst(r.left + r.width / 2, r.top + r.height / 2, ['#5fe0b0', '#ffd23a'], 14, 1, 70);
      s.ov.classList.add('bye'); setTimeout(() => s.ov.remove(), 350);
    } else s.ov.remove();
  },

  // 拆一拆: the steps for one part of a sum (v sg b), each { t: the row with '?' where she writes, ans, say: its line in
  // L.teach.step, h: the picture to count }. h.bond: a number bond, whole split into left and the rest. Otherwise a
  // pile: tA bundles of the first kind and tB of the number's own (the last xT of A's taken away), then a ten frame
  // with cA + cB animals and gap empty places (the last xC animals taken away; ask: A's are the ones to count);
  // n says what is counted: what is left ('all', the default), the empty places ('gap') or A's ones ('ask').
  plan(v, sg, b) {
    const R = [], T = x => Math.floor(x / 10), t = T(b), o = b % 10, M = '−';
    const row = (t1, ans, say, h) => R.push({ t: t1, ans, say, h });
    let w = v;
    if (sg === '+') {
      if (t) { row([w, '+', t * 10, '=', '?'], w + t * 10, 'tensAdd', { tA: T(w), tB: t, cA: w % 10 }); w += t * 10; }
      if (o) {
        const wo = w % 10, wt = w - wo;
        if (wo + o <= 10 && !wt) row([w, '+', o, '=', '?'], w + o, 'count', { cA: wo, cB: o });
        else if (wo + o <= 10 && !wo) row([w, '+', o, '=', '?'], w + o, 'join', { tA: T(w), cB: o });
        else if (wo + o <= 10) {
          row([wo, '+', o, '=', '?'], wo + o, 'ones', { cA: wo, cB: o });
          row([wt, '+', wo + o, '=', '?'], w + o, 'join', wo + o === 10 ? { tA: T(wt), tB: 1 } : { tA: T(wt), cA: wo + o });
        } else {   // 凑十: 8 + 5 → 8 + ? = 10, 5 = 2 + ?, 10 + 3
          const r = 10 - wo;
          row([w, '+', '?', '=', wt + 10], r, 'fill', { tA: T(w), cA: wo, gap: r, n: 'gap' });
          row([o, '=', r, '+', '?'], o - r, 'partAdd', { bond: true, whole: o, left: r });
          row([wt + 10, '+', o - r, '=', '?'], w + o, 'join', { tA: T(wt) + 1, cB: o - r });
        }
      }
    } else {
      if (t) { row([w, M, t * 10, '=', '?'], w - t * 10, 'tensSub', { tA: T(w), xT: t, cA: w % 10 }); w -= t * 10; }
      if (o) {
        const wo = w % 10, wt = w - wo;
        if (w <= 10) row([w, M, o, '=', '?'], w - o, 'countSub', { cA: w, xC: o });
        else if (wo === o) row([w, M, o, '=', '?'], wt, 'countSub', { tA: T(w), cA: wo, xC: o });
        else if (wo > o) {
          row([wo, M, o, '=', '?'], wo - o, 'onesSub', { cA: wo, xC: o });
          row([wt, '+', wo - o, '=', '?'], w - o, 'join', { tA: T(wt), cA: wo - o });
        } else if (!wo) {   // 破十: 40 − 7 → 10 − 7, then 30 + 3
          row([10, M, o, '=', '?'], 10 - o, 'break', { cA: 10, xC: o });
          row([w - 10, '+', 10 - o, '=', '?'], w - o, 'join', { tA: T(w) - 1, cA: 10 - o });
        } else {   // 平十: 13 − 5 → 13 − ? = 10, 5 = 3 + ?, 10 − 2
          row([w, M, '?', '=', wt], wo, 'down', { tA: T(w), cA: wo, ask: true, n: 'ask' });
          row([o, '=', wo, '+', '?'], o - wo, 'partSub', { bond: true, whole: o, left: wo });
          row([wt, M, o - wo, '=', '?'], w - o, 'rest', { tA: T(wt) - 1, cA: 10, xC: o - wo });
        }
      }
    }
    return R;
  },
};

// ---------- 列竖式: the column form, a place-value chart under the same columns ----------
// The column form (竖式) on one side, a chart (数位表) with the same two columns on the other: the tens as bundles, the
// ones as animals in ten frames, the top number's above the second number's, as in the form. A column is acted out —
// the ones come together and ten are tied into a bundle that goes up to the tens, a small 1 written over the line
// (满十进一); or, not enough ones to take away, a bundle comes down and is untied, a dot over the tens (退位), and
// what is taken away comes out of that ten first (破十) — then she counts what is in the column and writes that digit
// under the line herself: the ones first, then the tens. Last she copies the answer into the sum at the top, as school
// asks. A sum of three or four numbers is one column sum after another, each done one folding into a chip at the top.
Teach.W.col = (c, first) => {
  const { q, root, later, kinds } = c, s = c.s, { CW, CH, MC } = Teach, C = L.teach.col;
  const parts = [], ends = [q.nums[0]];
  q.signs.forEach((sg, j) => {
    const a = ends[j], b = q.nums[j + 1], r = sg === '+' ? a + b : a - b;
    const a1 = a % 10, a10 = Math.floor(a / 10), b1 = b % 10, b10 = Math.floor(b / 10);
    const carry = sg === '+' && a1 + b1 >= 10, borrow = sg === '-' && a1 < b1;
    parts.push({
      j, sg, a, b, r, a1, a10, b1, b10, carry, borrow,
      d1: r % 10, t: Math.floor(r / 10),                    // the digits she writes: the ones, then the tens (10 for 100)
      nc: String(Math.max(a, b, r)).length,                 // columns in the form: 个, 十, 百 (only for 100)
    });
    ends.push(r);
  });
  const chips = el('div', 'tchips tcolchips'); root.appendChild(chips);
  // stage: 'intro' 'ones' 'tens' 'done' 'main'; step: the digit asked for now { bx, ans }
  const f = { pi: -1, p: null, stage: 'intro', step: null, busy: true, got: '', main: false, layer: null, V: null,
    tens: [], tensB: [], f1: [], f2: [], boxT: null, boxO: null, fr1: null, fr2: null };
  const G = {};
  const PAD = 0.3, LH = 0.9, GAPC = 0.4, ROW = CH + 0.3, TW = 2 * PAD + 5 * (CW + Teach.CG) - Teach.CG, OW = 2 * PAD + 5.3;
  const once = fn => { let done = false; return () => { if (!done) { done = true; fn(); } }; };
  // say a line, then go on (also when the line is cut short or missing)
  const sayThen = (line, fn, max) => { const go = once(fn); c.say(line, { onend: () => later(go, 250) }); later(go, max || 6000); };
  const seq = (n, gap, fn, done) => { let i = 0; const go = () => { if (i >= n) { later(done, 350); return; } fn(i++); later(go, gap); }; go(); };

  // the column form: a grid of an op column and one column a digit, rows: column names, the numbers, the line, the answer
  function form(p) {
    const v = el('div', 'tvert'), nc = p.nc, cell = (t, cls) => { const e = el('span', cls, t); v.appendChild(e); return e; };
    v.style.gridTemplateColumns = `.8em repeat(${nc},.78em)`;
    const digits = n => { const d = String(n).split(''); return Array(nc - d.length).fill('').concat(d); };
    const row = (op, ds, cls) => { cell(op, 'op'); return ds.map(d => cell(d, cls)); };
    const lab = row('', ['百', '十', '个'].slice(3 - nc), 'lab');
    const A = row('', digits(p.a), 'a'), B = row(p.sg === '+' ? '+' : '−', digits(p.b), 'b');
    A.forEach(e => { e.style.color = c.col(0); }); B.forEach(e => { e.style.color = c.col(p.j + 1); });
    v.appendChild(el('i', 'bar'));
    cell('', 'op');
    const R = [];
    for (let i = 0; i < nc; i++) {
      if (nc === 3 && i === 0 && p.t >= 10) { const e = cell('', 'r'); e.style.gridColumn = 'span 2'; R.push(e, e); i++; }   // 100: "10" across 百 and 十
      else R.push(cell('', 'r'));
    }
    return { el: v, lab, A, B, R, nc };
  }
  // light up a column in the form and the chart: 'one', 'ten' or none
  function hiCol(w) {
    const V = f.V, cols = w === 'one' ? [V.nc - 1] : w === 'ten' ? [V.nc - 2, V.nc - 3] : [];
    [V.lab, V.A, V.B, V.R].forEach(r => r.forEach((e, i) => e.classList.toggle('on', cols.includes(i))));
    f.boxO.classList.toggle('on', w === 'one');
    if (f.boxT) f.boxT.classList.toggle('on', w === 'ten');
  }
  // one part of the sum: its form, its chart and the things in it
  function build(p) {
    const layer = f.layer = el('div', 'thelp'); root.appendChild(layer);
    f.V = form(p); layer.appendChild(f.V.el);
    const hasT = p.nc >= 2;
    f.boxT = hasT ? layer.appendChild(el('div', 'tcell ten', '<b>十位</b>')) : null;
    f.boxO = layer.appendChild(el('div', 'tcell one', '<b>个位</b>'));
    const frame = () => { const fr = layer.appendChild(el('div', 'tframe')); for (let i = 0; i < 10; i++) fr.appendChild(el('i')); return fr; };
    f.fr1 = frame(); f.fr2 = frame();
    f.fr2.hidden = !(p.sg === '+' && p.b1);   // the second number's ones; taking away, the ten that comes down
    const kA = kinds[0], kB = kinds[p.j + 1];
    f.tens = Array.from({ length: p.a10 }, () => c.ten(Array(10).fill(kA), layer));
    f.tensB = p.sg === '+' ? Array.from({ length: p.b10 }, () => c.ten(Array(10).fill(kB), layer)) : [];
    f.f1 = Array.from({ length: p.a1 }, () => c.one(kA, layer));
    f.f2 = p.sg === '+' ? Array.from({ length: p.b1 }, () => c.one(kB, layer)) : [];
    // rows of bundles: the top number's (with room for a ten carried up), then the second number's
    G.ra = Math.ceil((p.a10 + (p.carry ? 1 : 0)) / 5);
    G.rows = Math.max(1, G.ra + Math.ceil((p.sg === '+' ? p.b10 : 0) / 5));
    G.hasT = hasT; G.two = p.sg === '+' ? p.b1 > 0 : p.borrow;
  }
  // sizes in u (a frame cell): the chart's and the form's; the form beside the chart when that is bigger, else above it
  function geo() {
    const W = root.clientWidth, top = chips.childElementCount ? chips.offsetHeight + 6 : 0, H = root.clientHeight - top;
    const V = f.V.el; V.style.fontSize = '100px';
    const vw = V.offsetWidth / 100, vh = V.offsetHeight / 100, K = 1.5;
    const inner = Math.max(G.hasT ? G.rows * ROW - 0.3 : 0, G.two ? 2 * CH + 0.3 : CH);
    const cw = (G.hasT ? TW + GAPC : 0) + OW, ch = LH + 2 * PAD + inner;
    const wideU = Math.min(W / (vw * K + 1.2 + cw), H / Math.max(vh * K, ch));
    const tallU = Math.min(W / Math.max(vw * K, cw), H / (vh * K + 0.8 + ch));
    const u = G.u = clamp(Math.max(wideU, tallU) * 0.95, 12, 64), wide = wideU >= tallU;
    const fs = K * u, VW = vw * fs, VH = vh * fs;
    V.style.fontSize = fs + 'px';
    let vx, vy;
    if (wide) { const x0 = (W - VW - 1.2 * u - cw * u) / 2; vx = x0; vy = top + (H - VH) / 2; G.cx = x0 + VW + 1.2 * u; G.cy = top + (H - ch * u) / 2; }
    else { const y0 = top + (H - VH - 0.8 * u - ch * u) / 2; vx = (W - VW) / 2; vy = y0; G.cx = (W - cw * u) / 2; G.cy = y0 + VH + 0.8 * u; }
    V.style.transform = `translate(${vx}px,${vy}px)`;
    const box = (b, x, w) => Object.assign(b.style, { width: w * u + 'px', height: ch * u + 'px', transform: `translate(${x}px,${G.cy}px)`, fontSize: 0.55 * u + 'px', borderRadius: 0.35 * u + 'px' });
    if (f.boxT) box(f.boxT, G.cx, TW);
    G.ox = G.cx + (G.hasT ? (TW + GAPC) * u : 0);
    box(f.boxO, G.ox, OW);
    G.f1 = [G.ox + PAD * u, G.cy + (LH + PAD) * u]; G.f2 = [G.f1[0], G.f1[1] + ROW * u];
    [[f.fr1, G.f1], [f.fr2, G.f2]].forEach(([fr, [X, Y]]) => Object.assign(fr.style, { width: 5.3 * u + 'px', height: CH * u + 'px', transform: `translate(${X}px,${Y}px)`, borderRadius: 0.25 * u + 'px', padding: 0.15 * u + 'px' }));
  }
  const tenAt = (row0, i) => [G.cx + (PAD + (i % 5) * (CW + Teach.CG)) * G.u, G.cy + (LH + PAD + (row0 + Math.floor(i / 5)) * ROW) * G.u];
  const cellAt = (F, i) => [F[0] + 0.15 * G.u + (i % 5) * G.u, F[1] + 0.15 * G.u + Math.floor(i / 5) * G.u];
  const put = (n, X, Y, cs, quick) => c.put(n, X, Y, G.u, cs, quick);
  const putTen = (n, X, Y, quick) => c.putTen(n, X, Y, G.u, quick);
  function layout(quick) {
    f.tens.forEach((n, i) => putTen(n, ...tenAt(0, i), quick));
    f.tensB.forEach((n, i) => putTen(n, ...tenAt(G.ra, i), quick));
    f.f1.forEach((n, i) => put(n, ...cellAt(G.f1, i), G.u, quick));
    f.f2.forEach((n, i) => { if (n) put(n, ...cellAt(G.f2, i), G.u, quick); });
  }
  const mark = (cell, cls, txt) => { const m = el('i', cls, txt || ''); cell.appendChild(m); m.animate([{ scale: '0' }, { scale: '1.6' }, { scale: '1' }], { duration: 450, easing: 'ease-out' }); };

  function start(pi) {
    const p = f.p = parts[pi]; f.pi = pi; f.stage = 'intro'; f.busy = true;
    build(p); geo(); layout(true);
    [...f.tens, ...f.f1, ...f.tensB, ...f.f2].forEach((n, i) => c.pop(n, 150 + i * 50));
    c.hi(p.j + 1);
    const go = once(ones);
    if (pi) { sayThen(C.part, go, 4500); return; }
    // the first time: how the form lines up, each column lighting as it is named
    c.say(first, {
      onend: () => {
        c.say(C.align, { onend: () => later(go, 300) });
        later(() => { if (f.stage === 'intro') hiCol('one'); }, 1500);
        later(() => { if (f.stage === 'intro') hiCol(G.hasT ? 'ten' : 'one'); }, 2700);
        later(() => { if (f.stage === 'intro') hiCol(null); }, 4200);
      },
    });
    later(go, 15000);
  }
  // ---- the ones ----
  function ones() {
    const p = f.p; f.stage = 'ones'; hiCol('one');
    if (!p.b1) sayThen(C.onesDown, askOnes, 4000);
    else if (p.sg === '+') sayThen(C.onesAdd, mergeOnes, 4500);
    else sayThen(C.onesSub, p.borrow ? borrowTen : () => takeOnes(askOnes), 4500);
  }
  // the second number's ones hop into the top frame one by one; when it is full they are tied up
  function mergeOnes() {
    const i = f.f2.findIndex(n => n);
    if (i < 0) { later(askOnes, 200); return; }
    const n = f.f2[i]; f.f2[i] = null; f.f1.push(n);
    layout(); Snd.play('hop', f.f1.length);
    if (f.f1.length === 10) later(tieUp, 500); else later(mergeOnes, 280);
  }
  // 满十进一: the ten fly into a bundle next to the tens, and a small 1 is written in the tens column
  function tieUp() {
    const at = tenAt(0, f.tens.length), ks = f.f1.map(n => n.k);
    f.f1.forEach((n, i) => { const [X, Y] = c.mini(at[0], at[1], i, G.u); n.el.style.transitionDelay = i * 25 + 'ms'; put(n, X, Y, MC * G.u); });
    Snd.play('tie');
    later(() => {
      const b = c.ten(ks, f.layer); f.f1.forEach(n => n.el.remove()); f.f1 = [];
      f.tens.push(b); layout(true); b.el.classList.add('new'); c.fxAt(b);
      mark(f.V.B[f.V.nc - 2], 'carry', '1');
      sayThen(C.carry, mergeOnes, 6000);
    }, 750);
  }
  // 退位: the top number's last bundle comes down into the second frame and is untied; a dot over the tens
  function borrowTen() {
    const b = f.tens.pop(), X = G.f2[0] + 2.17 * G.u, Y = G.f2[1];
    const both = once(() => takeOnes(askOnes));
    let n = 2; const join = () => { if (--n === 0) both(); };
    f.fr2.hidden = false; f.fr2.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    putTen(b, X, Y); Snd.play('swap');
    mark(f.V.A[f.V.nc - 2], 'dot');
    if (f.p.a >= 100) mark(f.V.A[f.V.nc - 3], 'dot');   // 100: borrowed through the hundreds
    later(() => {
      Snd.play('untie');
      b.el.animate([{ scale: '1' }, { scale: '1.15', rotate: '-5deg' }, { scale: '1' }], { duration: 380 });
      later(() => {
        f.f2 = b.ks.map(k => c.one(k, f.layer));
        f.f2.forEach((m, i) => { const [mx, my] = c.mini(X, Y, i, G.u); put(m, mx, my, MC * G.u, true); });
        b.el.remove();
        requestAnimationFrame(() => {
          f.f2.forEach((m, i) => { m.el.style.transitionDelay = i * 30 + 'ms'; });
          layout();
          later(() => { f.f2.forEach(m => { m.el.style.transitionDelay = ''; }); join(); }, 800);
        });
      }, 400);
    }, 550);
    sayThen(C.borrow, join, 8000);
  }
  // taking away: from the ten that came down if there is one (破十), else from the ones there were
  function takeOnes(done) {
    const pool = f.p.borrow ? f.f2 : f.f1, live = pool.filter(n => n && !n.x), go = live.slice(live.length - f.p.b1).reverse();
    seq(go.length, 320, i => { go[i].x = true; go[i].el.classList.add('x'); Snd.play('bye', i + 1); }, done);
  }
  function askOnes() { ask(f.V.R[f.V.nc - 1], f.p.d1, C.onesAsk, L.teach.guide); }
  // ---- the tens ----
  function tens() {
    const p = f.p; f.stage = 'tens'; hiCol('ten');
    if (p.sg === '+') sayThen(p.b10 ? (p.carry ? C.tensAddCarry : C.tensAdd) : (p.carry ? C.tensCarry : C.tensDown), () => mergeTens(askTens), 5500);
    else sayThen(p.b10 ? (p.borrow ? C.tensSubBorrow : C.tensSub) : (p.borrow ? C.tensBorrow : C.tensDown), () => takeTens(() => (p.t ? askTens() : sayThen(C.tensNone, done, 4500))), 5500);
  }
  function mergeTens(next) { seq(f.tensB.length, 340, () => { f.tens.push(f.tensB.shift()); layout(); Snd.play('hop', f.tens.length); }, next); }
  function takeTens(next) {
    const live = f.tens.filter(n => !n.x), go = live.slice(live.length - f.p.b10).reverse();
    seq(go.length, 380, i => { go[i].x = true; go[i].el.classList.add('x'); Snd.play('bye', i + 1); }, next);
  }
  function askTens() { ask(f.V.R[f.V.nc - 2], f.p.t, C.tensAsk, C.guideTen); }
  // ---- a digit to write under the line ----
  function ask(cell, ans, line, guide) {
    const bx = el('span', 'tbox ask', '?'); cell.appendChild(bx);
    bx.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 300 });
    f.step = { bx, ans }; f.got = ''; f.busy = false; api.guideLine = guide; s.idle = 0;
    c.say(line);
  }
  function check() {
    const st = f.step;
    if (+f.got === st.ans) {
      Snd.play('right'); f.busy = true; f.step = null; Teach.owlFace('f', 1500);
      Teach.unbadge(); s.cnt = null;
      st.bx.classList.remove('ask'); st.bx.classList.add('ok'); st.bx.textContent = st.ans;
      const r = st.bx.getBoundingClientRect();
      Fx.burst(r.left + r.width / 2, r.top + r.height / 2, ['#5fe0b0', '#ffd23a'], 8, 0.7, 50);
      c.say(C.right);
      later(f.stage === 'ones' && f.p.nc >= 2 ? tens : done, 1000);
    } else {
      Snd.play('wrong'); f.got = ''; st.bx.textContent = '?';
      st.bx.classList.remove('bad'); void st.bx.offsetWidth; st.bx.classList.add('bad');
      const items = api.items();
      if (items.length) Teach.guide(items); else c.say(C.zero);
    }
  }
  // this part done: the next one, or the answer into the sum at the top
  function done() {
    f.stage = 'done'; hiCol(null);
    const p = f.p;
    if (f.pi < parts.length - 1) {
      later(() => {
        chips.appendChild(el('span', null, `${p.a} ${p.sg === '+' ? '+' : '−'} ${p.b} = ${p.r}`));
        f.layer.remove();
        start(f.pi + 1);
      }, 700);
      return;
    }
    f.stage = 'main'; f.main = true; f.busy = false;
    f.V.el.classList.add('done');
    s.ans.classList.add('ask');
    c.say(C.copy);
  }

  const api = {
    guideLine: L.teach.guide,
    // the pad writes a digit under the line; the sum's own answer at the end is math.js's
    key(k) {
      if (f.main) return false;
      if (f.busy || !f.step) return true;
      if (k === '✓') { if (f.got) check(); return true; }
      if (k === '⌫') { f.got = f.got.slice(0, -1); Snd.play('key', 2); }
      else if (f.got.length < 2) { f.got = (f.got === '0' ? '' : f.got) + k; Snd.play('key', +k); }
      f.step.bx.textContent = f.got || '?'; f.step.bx.classList.remove('bad');
      return true;
    },
    box: () => (f.step ? f.step.bx : null),
    ready: () => f.main,
    // counted together: the bundles one by one (that is the tens digit), or the animals left in the ones
    items: () => (f.stage === 'tens' ? f.tens : [...f.f1, ...f.f2]).filter(n => n && !n.x).map((n, i) => ({ el: n.el, v: i + 1 })),
    wrongMain() { c.say(C.copyAgain); f.V.R.forEach(e => e.animate([{ background: '#fff2a8' }, { background: '#ffe066' }, { background: '#fff2a8' }], { duration: 900 })); },
    relayout: () => { geo(); layout(true); },
  };
  start(0);
  return api;
};

// ---------- 摆一摆: the animals in a ten frame, bundles of ten beside it ----------
Teach.W.frame = (c, first) => {
  const { q, root, later, kinds } = c, s = c.s, { CW, CH, CG, MC } = Teach;
  const frame = el('div', 'tframe'); root.appendChild(frame);
  for (let i = 0; i < 10; i++) frame.appendChild(el('i'));
  const sign = el('div', 'tsign'); root.appendChild(sign);
  // the biggest number of bundles at any time, and the widest row of things to add or take away, set the size
  // (ones to add or take away sit in rows of five, like the frame)
  let v = q.nums[0], maxT = Math.floor(v / 10), trayW = 0, trayH = 1.1;
  q.signs.forEach((sg, j) => {
    const b = q.nums[j + 1], t = Math.floor(b / 10);
    v = sg === '+' ? v + b : v - b; maxT = Math.max(maxT, Math.floor(v / 10));
    trayW = Math.max(trayW, 1.2 + t * (CW + CG) + Math.min(5, b % 10) * 1.08);
    trayH = Math.max(trayH, t ? CH : 0, b % 10 > 5 ? 2.2 : 0);
  });
  const f = { ones: [], tens: [], tray: [], slots: [], j: 0, n: 0, need: null, phase: 'intro', busy: true, row: null };
  const G = {};
  function geo() {
    const W = root.clientWidth, H = root.clientHeight;
    const mainW = maxT * (CW + CG) + (maxT ? 0.4 : 0) + 5.3, wide = Math.max(mainW, trayW) + 0.4;
    const tall = 0.3 + CH + 0.6 + trayH + 0.3;
    const u = G.u = Math.max(18, Math.min(W / wide, H / tall, 92));
    const y0 = (H - tall * u) / 2;
    G.W = W; G.tx = (W - mainW * u) / 2; G.ty = y0 + 0.3 * u;
    G.fx = G.tx + (maxT * (CW + CG) + (maxT ? 0.4 : 0)) * u; G.fy = G.ty;
    G.ry = G.ty + (CH + 0.6) * u; G.rh = trayH * u;
    Object.assign(frame.style, { width: 5.3 * u + 'px', height: CH * u + 'px', transform: `translate(${G.fx}px,${G.fy}px)`, borderRadius: 0.25 * u + 'px', padding: 0.15 * u + 'px' });
  }
  const cell = i => [G.fx + 0.15 * G.u + (i % 5) * G.u, G.fy + 0.15 * G.u + Math.floor(i / 5) * G.u];
  const tenAt = i => [G.tx + i * (CW + CG) * G.u, G.ty];
  const mini = (X, Y, i) => c.mini(X, Y, i, G.u);
  // the row below: what this number adds (or the spots for what it takes away), after a big + or −
  function rowAt(t, n1) {
    const w = 1.2 + t * (CW + CG) + Math.min(5, n1) * 1.08, x0 = (G.W - w * G.u) / 2, oh = (n1 > 5 ? 2.08 : 1) * G.u;
    return {
      sx: x0, ten: i => [x0 + (1.2 + i * (CW + CG)) * G.u, G.ry + (G.rh - CH * G.u) / 2],
      one: i => [x0 + (1.2 + t * (CW + CG) + (i % 5) * 1.08) * G.u, G.ry + (G.rh - oh) / 2 + Math.floor(i / 5) * 1.08 * G.u],
    };
  }
  const put = (n, X, Y, cs, quick) => c.put(n, X, Y, G.u, cs, quick);
  const putTen = (n, X, Y, quick) => c.putTen(n, X, Y, G.u, quick);
  function layout(quick) {
    f.tens.forEach((n, i) => putTen(n, ...tenAt(i), quick));
    f.ones.forEach((n, i) => put(n, ...cell(i), G.u, quick));
    if (!f.row) return;
    f.tray.forEach(n => n.ten ? putTen(n, ...f.row.ten(n.at), quick) : put(n, ...f.row.one(n.at), G.u, quick));
    f.slots.forEach(sl => {
      const [X, Y] = sl.ten ? f.row.ten(sl.at) : f.row.one(sl.at);
      Object.assign(sl.el.style, sl.ten ? { width: CW * G.u + 'px', height: CH * G.u + 'px', borderRadius: 0.2 * G.u + 'px' } : { width: 0.9 * G.u + 'px', height: 0.9 * G.u + 'px' },
        { transform: `translate(${sl.ten ? X : X + 0.05 * G.u}px,${sl.ten ? Y : Y + 0.05 * G.u}px)` });
      if (sl.got) sl.got.ten ? putTen(sl.got, X, Y, quick) : put(sl.got, X, Y, G.u, quick);
    });
    Object.assign(sign.style, { fontSize: 0.9 * G.u + 'px', transform: `translate(${f.row.sx}px,${G.ry + G.rh / 2 - 0.6 * G.u}px)`, width: G.u + 'px', height: 1.2 * G.u + 'px' });
  }
  const one = k => c.one(k), ten = ks => c.ten(ks);

  // the first number pops in while the teacher speaks, then it is said
  function intro() {
    const v0 = q.nums[0];
    for (let i = 0; i < Math.floor(v0 / 10); i++) f.tens.push(ten(Array(10).fill(kinds[0])));
    for (let i = 0; i < v0 % 10; i++) f.ones.push(one(kinds[0]));
    geo(); layout(true);
    f.tens.forEach((n, i) => c.pop(n, 200 + i * 140));
    f.ones.forEach((n, i) => c.pop(n, 200 + f.tens.length * 140 + i * 90));
    c.hi(0);
    let went = false;
    const go = () => { if (!went) { went = true; next(); } };
    c.say(first, { onend: () => Voice.say(String(v0), { onend: () => later(go, 250) }) });
    later(go, 9000);   // a line cut short still moves on
  }
  function next() {
    c.hi(f.j + 1);
    if (f.j >= q.signs.length) return end();
    const sg = q.signs[f.j], b = q.nums[f.j + 1], t = Math.floor(b / 10), n1 = b % 10, k = kinds[f.j + 1];
    f.row = rowAt(t, n1); f.tray = []; f.slots.forEach(sl => sl.el.remove()); f.slots = [];
    sign.textContent = sg === '+' ? '+' : '−'; sign.className = 'tsign on ' + (sg === '+' ? 'add' : 'sub');
    if (sg === '+') {
      for (let i = 0; i < t; i++) { const n = ten(Array(10).fill(k)); n.at = i; f.tray.push(n); }
      for (let i = 0; i < n1; i++) { const n = one(k); n.at = i; f.tray.push(n); }
    } else {
      f.need = { t, n1 };
      for (let i = 0; i < t; i++) f.slots.push({ ten: true, at: i, el: root.appendChild(el('div', 'tslot ten')) });
      for (let i = 0; i < n1; i++) f.slots.push({ at: i, el: root.appendChild(el('div', 'tslot')) });
    }
    layout(true);
    f.tray.forEach((n, i) => c.pop(n, i * 70));
    f.slots.forEach((sl, i) => sl.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: i * 50, fill: 'backwards' }));
    c.say(sg === '+' ? L.teach.add : L.teach.sub);
    f.phase = sg === '+' ? 'add' : 'sub'; f.busy = false; f.n = 0; s.idle = 0;
    if (sg === '-') untieIfShort();
  }
  // one tap: the next animal (or bundle) hops in, or one leaves, and how many have come (or gone) so far is said
  function step() {
    if (f.busy || (f.phase !== 'add' && f.phase !== 'sub')) return;
    if (f.phase === 'add') {
      const n = f.tray.shift();
      if (n.ten) { f.tens.push(n); f.n += 10; } else { f.ones.push(n); f.n += 1; }
      layout(); Snd.play('hop', f.n); Voice.say(String(f.n));
      later(() => c.fxAt(n, '#fff6a8'), 300);
      if (f.ones.length === 10) { f.busy = true; later(tie, 650); }
      else if (!f.tray.length) done();
    } else {
      const sl = f.slots.find(x => !x.got && (f.need.t ? x.ten : !x.ten));
      const n = sl.ten ? f.tens.pop() : f.ones.pop();
      sl.got = n; n.el.classList.add('gone');
      if (sl.ten) { f.need.t--; f.n += 10; } else { f.need.n1--; f.n += 1; }
      layout(); Snd.play('bye', f.n); Voice.say(String(f.n));
      if (!f.need.t && !f.need.n1) done();
      else untieIfShort();
    }
  }
  // ten in the frame: they hop into a bundle that stands next to the others
  function tie() {
    const at = tenAt(f.tens.length), ks = f.ones.map(n => n.k);
    f.ones.forEach((n, i) => { const [X, Y] = mini(...at, i); n.el.style.transitionDelay = i * 25 + 'ms'; put(n, X, Y, MC * G.u); });
    Snd.play('tie'); c.say(L.teach.tie);
    later(() => {
      const b = ten(ks); f.ones.forEach(n => n.el.remove()); f.ones = [];
      f.tens.push(b); layout(true);
      b.el.classList.add('new'); c.fxAt(b);
      later(() => { if (f.tray.length) f.busy = false; else done(); }, 500);
    }, 700);
  }
  // not enough ones to take away: a bundle is untied into the frame
  function untieIfShort() {
    if (!f.need || f.need.t || !f.need.n1 || f.ones.length) return;
    f.busy = true;
    later(() => {
      const b = f.tens.pop(), [X, Y] = tenAt(f.tens.length);
      b.el.animate([{ transform: b.el.style.transform }, { transform: b.el.style.transform + ' scale(1.12) rotate(-4deg)' }, { transform: b.el.style.transform }], { duration: 380 });
      Snd.play('untie'); c.say(L.teach.untie);
      later(() => {
        f.ones = b.ks.map(k => one(k));
        f.ones.forEach((n, i) => { const [mx, my] = mini(X, Y, i); put(n, mx, my, MC * G.u, true); });
        b.el.remove();
        requestAnimationFrame(() => { f.ones.forEach((n, i) => { n.el.style.transitionDelay = i * 30 + 'ms'; }); layout(); later(() => { f.ones.forEach(n => { n.el.style.transitionDelay = ''; }); f.busy = false; s.idle = 0; }, 700); });
      }, 420);
    }, 450);
  }
  function done() {
    f.busy = true; f.phase = 'wait';
    later(() => { f.ones.forEach(n => { n.el.style.transitionDelay = ''; }); f.j++; next(); }, 900);
  }
  // all acted out: how many are there now? she counts them herself
  function end() {
    f.phase = 'end'; f.busy = true;
    sign.className = 'tsign'; f.slots.forEach(sl => sl.el.classList.add('dim'));
    s.ans.classList.add('ask');
    later(() => c.say(q.signs[q.signs.length - 1] === '+' ? L.teach.endAdd : L.teach.endSub), 400);
  }
  intro();
  return {
    tap: step,
    target: () => {
      if (f.busy || (f.phase !== 'add' && f.phase !== 'sub')) return null;
      const n = f.phase === 'add' ? f.tray[0] : (f.need.t ? f.tens[f.tens.length - 1] : f.ones[f.ones.length - 1]);
      return n && n.el;
    },
    ready: () => f.phase === 'end',
    // counted together: the bundles by tens, then the ones
    items: () => { let n = 0; return f.tens.map(x => ({ el: x.el, v: n += 10 })).concat(f.ones.map(x => ({ el: x.el, v: ++n }))); },
    relayout: () => { geo(); layout(true); },
  };
};

// ---------- 跳一跳: a frog on a number line ----------
Teach.W.line = (c, first) => {
  const { q, root, later } = c, s = c.s;
  const hops = [];   // { j: which number, from, to, n: 10 or 1 }, the tens first
  let v = q.nums[0];
  q.signs.forEach((sg, j) => {
    const b = q.nums[j + 1], d = sg === '+' ? 1 : -1;
    for (let i = 0; i < Math.floor(b / 10); i++) { hops.push({ j: j + 1, from: v, to: v + 10 * d, n: 10 }); v += 10 * d; }
    for (let i = 0; i < b % 10; i++) { hops.push({ j: j + 1, from: v, to: v + d, n: 1 }); v += d; }
  });
  // the line runs between whole tens around every stop, 20 long at least; the start and the whole tens have numbers
  const all = [q.nums[0]].concat(hops.map(h => h.to));
  let lo = Math.floor(Math.min(...all) / 10) * 10, hi = Math.ceil(Math.max(...all) / 10) * 10;
  if (hi - lo < 20) { if (lo + 20 <= 100) hi = lo + 20; else lo = hi - 20; }
  const svg = c.sv('svg', { class: 'tline' }), ticks = c.sv('g'), arcs = c.sv('g');
  svg.appendChild(ticks); svg.appendChild(arcs); root.appendChild(svg);
  const start = el('div', 'tstart', q.nums[0]); start.style.color = c.col(0); root.appendChild(start);
  const frog = el('div', 'tfrog'), fi = el('img'); fi.src = Teach.img(Art.byId('frog')); fi.alt = '';
  frog.appendChild(fi); root.appendChild(frog);
  const f = { at: q.nums[0], i: 0, j: 0, n: 0, phase: 'intro', busy: true, drawn: [], wait: 0 };
  const G = {};
  const X = x => G.m + (x - lo) * G.sp;
  const arcH = h => h.n === 10 ? Math.min(G.H * 0.3, G.sp * 10 * 0.42) : clamp(G.sp * 0.75, 12, 40);
  const HOP = ['#ff8a1f', '#73a848', '#5fb8ff'];   // the arcs of each number added or taken away
  function geo() {
    const W = root.clientWidth, H = root.clientHeight;
    Object.assign(G, { W, H, m: Math.max(34, W * 0.06), Y: H * 0.6 });
    G.sp = (W - 2 * G.m) / (hi - lo); G.fs = clamp(Math.min(H * 0.14, G.sp * 2.6), 40, 86);
    G.rows = G.sp < 24 ? [0.2, 0.28, 0.12] : [0.2, 0.12];   // rows for the numbers counted along, so close ones don't overlap
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ticks.innerHTML = '';
    ticks.appendChild(c.sv('line', { x1: X(lo) - 16, y1: G.Y, x2: X(hi) + 16, y2: G.Y, class: 'axis' }));
    const lab = clamp(H * 0.045, 13, 22), sfs = clamp(H * 0.06, 20, 36);
    for (let x = lo; x <= hi; x++) {
      const len = H * (x % 10 === 0 ? 0.07 : x % 5 === 0 ? 0.05 : 0.032);
      ticks.appendChild(c.sv('line', { x1: X(x), y1: G.Y, x2: X(x), y2: G.Y + len, class: x % 10 === 0 ? 'tick ten' : 'tick' }));
      // a whole ten's number under its tick, unless the start's own label is right there
      if (x % 10 === 0 && Math.abs(X(x) - X(q.nums[0])) > sfs * 1.5) {
        const t = c.sv('text', { x: X(x), y: G.Y + H * 0.07 + lab * 1.05, class: 'tlab', 'font-size': lab });
        t.textContent = x; ticks.appendChild(t);
      }
    }
    ticks.appendChild(c.sv('circle', { cx: X(q.nums[0]), cy: G.Y, r: 7, fill: c.col(0) }));
    Object.assign(start.style, { left: X(q.nums[0]) + 'px', top: G.Y + H * 0.12 + 'px', fontSize: sfs + 'px' });
    frog.style.width = frog.style.height = G.fs + 'px';
    arcs.innerHTML = ''; f.drawn.forEach(h => arc(h));
    seat(f.at);
  }
  const seat = x => { f.at = x; frog.style.transform = `translate(${X(x) - G.fs / 2}px,${G.Y - G.fs * 0.92}px)`; };
  function arc(h, dur) {
    const x0 = X(h.from), x1 = X(h.to), a = arcH(h);
    const p = c.sv('path', { d: `M${x0} ${G.Y - 3} Q${(x0 + x1) / 2} ${G.Y - 3 - 2 * a} ${x1} ${G.Y - 3}`, class: 'hop', stroke: HOP[(h.j - 1) % HOP.length] });
    arcs.appendChild(p);
    if (dur) { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: dur }); }
  }
  // the frog jumps along the arc; returns how long that takes
  function hop(h) {
    const x0 = X(h.from), x1 = X(h.to), up = arcH(h) + G.fs * 0.2, dur = h.n === 10 ? 560 : 340, kf = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, x = x0 + (x1 - x0) * t - G.fs / 2, y = G.Y - G.fs * 0.92 - 4 * up * t * (1 - t);
      kf.push({ transform: `translate(${x}px,${y}px)` });
    }
    frog.animate(kf, { duration: dur });
    seat(h.to);
    return dur;
  }
  function intro() {
    geo();
    frog.animate([{ opacity: 0, scale: '0.3' }, { opacity: 1, scale: '1' }], { duration: 350, easing: 'ease-out' });
    c.hi(0);
    let went = false;
    const go = () => { if (!went) { went = true; next(); } };
    c.say(first, { onend: () => Voice.say(String(q.nums[0]), { onend: () => later(go, 250) }) });
    later(go, 9000);
  }
  function next() {
    c.hi(f.j + 1);
    if (f.j >= q.signs.length) return end();
    f.n = 0; f.phase = 'hop'; f.busy = false; s.idle = 0;
    c.say(q.signs[f.j] === '+' ? L.teach.hopAdd : L.teach.hopSub);
  }
  // one tap, one hop; how far it has hopped so far is said
  function step() {
    if (f.busy || f.phase !== 'hop' || performance.now() < f.wait) return;   // one hop at a time
    const h = hops[f.i++]; f.n += h.n;
    const d = hop(h); arc(h, d); f.drawn.push(h); f.wait = performance.now() + d - 60;
    Snd.play(q.signs[f.j] === '+' ? 'hop' : 'bye', f.n); Voice.say(String(f.n));
    if (!hops[f.i] || hops[f.i].j !== f.j + 1) { f.busy = true; later(() => { f.j++; next(); }, d + 800); }
  }
  function end() {
    f.phase = 'end'; f.busy = true;
    s.ans.classList.add('ask');
    later(() => c.say(L.teach.hopEnd), 400);
  }
  intro();
  return {
    tap: step,
    target: () => (f.phase === 'hop' && !f.busy ? frog : null),
    ready: () => f.phase === 'end',
    guideLine: L.teach.guideHop,
    // counted together: the frog goes back to the start and hops again, each stop getting its number
    recount: () => { seat(q.nums[0]); frog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); },
    items: () => hops.map((h, i) => ({ v: h.to, at: () => [X(h.to), G.Y + G.H * G.rows[i % G.rows.length]], fs: clamp(G.sp * 0.95, 14, 22), go: () => hop(h) })),
    relayout: geo,
  };
};

// ---------- 拆一拆: small steps to fill in, each with a picture ----------
Teach.W.split = (c, first) => {
  const { q, root, later, kinds } = c, s = c.s, { CW, CH, CG } = Teach;
  const plan = [], ends = [q.nums[0]];
  q.signs.forEach((sg, j) => {
    const b = q.nums[j + 1], rows = Teach.plan(ends[j], sg, b);
    rows.forEach(r => { r.j = j; });
    plan.push(rows); ends.push(sg === '+' ? ends[j] + b : ends[j] - b);
  });
  const last = plan[plan.length - 1]; last[last.length - 1].main = true;   // the last step is the sum's own answer
  const top = el('div', 'tsplit'), chips = el('div', 'tchips'), rowsEl = el('div', 'trows');
  top.appendChild(chips); top.appendChild(rowsEl); root.appendChild(top);
  const f = { oi: 0, ri: -1, r: null, row: null, box: null, got: '', hp: null, busy: true };

  // the picture for a step: bundles and a ten frame, or a number bond; layout(box) puts it in the space below the rows
  function pile(h) {
    const layer = el('div', 'thelp'); root.appendChild(layer);
    const kA = kinds[0], kB = kinds[h.j + 1], tens = [], cells = [];
    for (let i = 0; i < (h.tA || 0); i++) { const n = c.ten(Array(10).fill(kA), layer); n.x = i >= h.tA - (h.xT || 0); tens.push(n); }
    for (let i = 0; i < (h.tB || 0); i++) tens.push(c.ten(Array(10).fill(kB), layer));
    const fr = (h.cA || h.cB || h.gap) ? layer.appendChild(el('div', 'tframe')) : null;
    if (fr) for (let i = 0; i < 10; i++) fr.appendChild(el('i'));
    for (let i = 0; i < (h.cA || 0); i++) { const n = c.one(kA, layer); n.x = i >= h.cA - (h.xC || 0); n.ask = !!h.ask; cells.push(n); }
    for (let i = 0; i < (h.cB || 0); i++) cells.push(c.one(kB, layer));
    for (let i = 0; i < (h.gap || 0); i++) cells.push({ gap: true, el: layer.appendChild(el('div', 'tgap')) });
    [...tens, ...cells].forEach((n, i) => {
      if (n.x) n.el.classList.add('x');
      if (n.ask) n.el.classList.add('ask');
      if (!n.gap) c.pop(n, 150 + i * 60);
    });
    return {
      layer,
      layout(b, quick) {
        const nT = tens.length, wu = nT * (CW + CG) + (fr ? (nT ? 0.3 : 0) + 5.3 : -CG);
        const u = Math.max(14, Math.min(b.w / (wu + 0.6), b.h / (CH + 0.8), 76));
        const x0 = b.x + (b.w - wu * u) / 2, y0 = b.y + (b.h - CH * u) / 2;
        tens.forEach((n, i) => c.putTen(n, x0 + i * (CW + CG) * u, y0, u, quick));
        if (!fr) return;
        const fx = x0 + (nT ? nT * (CW + CG) + 0.3 : 0) * u;
        Object.assign(fr.style, { width: 5.3 * u + 'px', height: CH * u + 'px', transform: `translate(${fx}px,${y0}px)`, borderRadius: 0.25 * u + 'px', padding: 0.15 * u + 'px' });
        cells.forEach((n, i) => {
          const X = fx + 0.15 * u + (i % 5) * u, Y = y0 + 0.15 * u + Math.floor(i / 5) * u;
          if (n.gap) Object.assign(n.el.style, { width: 0.9 * u + 'px', height: 0.9 * u + 'px', transform: `translate(${X + 0.05 * u}px,${Y + 0.05 * u}px)` });
          else c.put(n, X, Y, u, u, quick);
        });
      },
      items() {
        if (h.n === 'gap' || h.n === 'ask') return cells.filter(n => n[h.n]).map((n, i) => ({ el: n.el, v: i + 1 }));
        let v = 0;
        return tens.filter(n => !n.x).map(n => ({ el: n.el, v: v += 10 })).concat(cells.filter(n => !n.x && !n.gap).map(n => ({ el: n.el, v: ++v })));
      },
    };
  }
  function bond(h) {
    const layer = el('div', 'thelp'); root.appendChild(layer);
    const lines = c.sv('svg', { class: 'tbondl' }), l1 = c.sv('line'), l2 = c.sv('line');
    lines.appendChild(l1); lines.appendChild(l2); layer.appendChild(lines);
    const rings = [el('div', 'tring'), el('div', 'tring'), el('div', 'tring q')];
    rings.forEach(r => layer.appendChild(r));
    const heads = Array.from({ length: h.whole }, () => c.one(kinds[h.j + 1], layer));
    heads.forEach((n, i) => c.pop(n, 150 + i * 60));
    let split = false, B = null;
    // the animals start in the whole, then part of them go left and the rest right; the whole keeps its number
    later(() => { split = true; rings[0].textContent = h.whole; if (B) place(false); }, 700 + h.whole * 60);
    function grid(list, cx, cy, hs, u, quick) {
      list.forEach((n, i) => {
        const row = Math.floor(i / 3), inRow = Math.min(3, list.length - row * 3), rows = Math.ceil(list.length / 3);
        c.put(n, cx - inRow * hs / 2 + (i % 3) * hs, cy - rows * hs / 2 + row * hs, u, hs, quick);
      });
    }
    function place(quick) {
      const b = B, u = Math.max(14, Math.min(b.w / 9, b.h / 8.4, 62)), R = 1.8 * u, hs = 0.8 * u;
      const cx = b.x + b.w / 2, y0 = b.y + (b.h - 8.4 * u) / 2;
      const P = [[cx, y0 + 0.1 * u + R], [cx - 2.5 * u, y0 + 8.3 * u - R], [cx + 2.5 * u, y0 + 8.3 * u - R]];
      rings.forEach((r, i) => Object.assign(r.style, { width: 2 * R + 'px', height: 2 * R + 'px', fontSize: 1.5 * u + 'px', transform: `translate(${P[i][0] - R}px,${P[i][1] - R}px)` }));
      [l1, l2].forEach((l, i) => { l.setAttribute('x1', P[0][0]); l.setAttribute('y1', P[0][1] + R * 0.9); l.setAttribute('x2', P[i + 1][0]); l.setAttribute('y2', P[i + 1][1] - R * 0.9); });
      if (!split) grid(heads, ...P[0], hs, u, quick);
      else { grid(heads.slice(0, h.left), ...P[1], hs, u, quick); grid(heads.slice(h.left), ...P[2], hs, u, quick); }
    }
    return {
      layer,
      layout(b, quick) { B = b; place(quick); },
      items: () => heads.slice(h.left).map((n, i) => ({ el: n.el, v: i + 1 })),
    };
  }

  function geo(quick) {
    const W = root.clientWidth, H = root.clientHeight;
    top.style.fontSize = clamp(Math.min(W / 13, H / 9), 22, 46) + 'px';
    const y = top.offsetHeight + 10;
    if (f.hp) f.hp.layout({ x: 8, y, w: W - 16, h: Math.max(60, H - y - 8) }, quick);
  }
  // the next step: its row slides in under the ones done, its picture replaces the last, its line is said
  function show() {
    f.ri++;
    if (f.ri >= plan[f.oi].length) {   // this part of the sum is done: its rows fold into a little chip
      chips.appendChild(el('span', null, `${ends[f.oi]} ${q.signs[f.oi] === '+' ? '+' : '−'} ${q.nums[f.oi + 1]} = ${ends[f.oi + 1]}`));
      rowsEl.innerHTML = ''; f.oi++; f.ri = 0;
    }
    const r = f.r = plan[f.oi][f.ri];
    c.hi(f.oi + 1);
    if (f.row) f.row.classList.remove('cur');
    const row = f.row = el('div', 'trow cur');
    r.t.forEach(p => {
      if (p === '?') { f.box = el('span', 'tbox ask', r.main ? q.got || '?' : '?'); row.appendChild(f.box); }
      else if (p === '+' || p === '−' || p === '=') row.appendChild(el('i', 'op', p));
      else row.appendChild(el('b', null, p));
    });
    rowsEl.appendChild(row);
    row.animate([{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
    if (f.hp) f.hp.layer.remove();
    f.hp = (r.h.bond ? bond : pile)(Object.assign({ j: r.j }, r.h));
    f.got = ''; f.busy = false;
    geo(true);
    c.say(L.teach.step[r.say]);
  }
  function check() {
    if (+f.got === f.r.ans) {
      Snd.play('right'); f.busy = true; Teach.owlFace('f', 1500);
      Teach.unbadge(); s.cnt = null;
      f.box.classList.remove('ask'); f.row.classList.add('ok');
      const b = f.box.getBoundingClientRect();
      Fx.burst(b.left + b.width / 2, b.top + b.height / 2, ['#5fe0b0', '#ffd23a'], 8, 0.7, 50);
      c.say(L.teach.step.next);
      later(show, 1300);
    } else {
      Snd.play('wrong'); f.got = ''; f.box.textContent = '?';
      f.box.classList.remove('bad'); void f.box.offsetWidth; f.box.classList.add('bad');
      Teach.guide(f.hp.items());
    }
  }
  c.hi(1);
  let went = false;
  const go = () => { if (!went) { went = true; show(); } };
  c.say(first, { onend: () => later(go, 200) });
  later(go, 6000);
  return {
    // the pad writes into a step's box; the last step's box is the sum's own answer, which math.js checks
    key(k) {
      if (!f.r || f.r.main) return false;
      if (f.busy) return true;
      if (k === '✓') { if (f.got) check(); return true; }
      if (k === '⌫') { f.got = f.got.slice(0, -1); Snd.play('key', 2); }
      else if (f.got.length < 3) { f.got = (f.got === '0' ? '' : f.got) + k; Snd.play('key', +k); }
      f.box.textContent = f.got || '?'; f.box.classList.remove('bad');
      return true;
    },
    sync(got) { if (f.r && f.r.main) { f.box.textContent = got || '?'; if (got) f.box.classList.remove('bad'); } },
    box: () => f.box,
    ready: () => !!(f.r && f.r.main && !f.busy),
    items: () => f.hp.items(),
    relayout: () => geo(true),
  };
};
