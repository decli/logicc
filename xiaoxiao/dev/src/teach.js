// 动物消消乐 · 小老师: when a sum is answered wrong twice (or she taps 💡), the animals act it out over the cards, one tap
// at a time, and she writes the answer herself on the number pad, which stays beside them (decli 2026-10-19: when she
// gets one wrong, guide her the way a teacher would, with animation and play).
// The model is the one Chinese first grade uses with sticks (小棒): ones sit in a ten frame (2 × 5); when it is full
// they are tied into a bundle of ten (满十捆一捆, 凑十), and when there are not enough ones to take away a bundle is
// untied (拆一捆, 破十). A bundle is a small ten frame standing up, so ten always looks like a full frame. The first
// number's animals are one kind and each number added is another (this game's animals), so 8 + 5 shows the 8 and the
// 2 that make ten, then the 3 left over. Taking away sends animals into marked spots below, so how many go is seen
// too. Every tap says the new total, and the big number above shows it with the tens and the ones in the colours of
// the bundles and the frame.
const Teach = {
  on: false, s: null, imgs: {},
  img(i) {   // a friend's head as a picture, made once
    if (!this.imgs[i]) this.imgs[i] = Art.friend(i, 128, 120).toDataURL();
    return this.imgs[i];
  },
  // q: the sum ({ nums, signs, ans, got }); host: the element it covers; o.close(): she closed it with ✕
  open(q, host, o = {}) {
    if (this.on) this.close();
    this.on = true;
    const CW = 0.96, CH = 2.3, CG = 0.24, MC = 0.43;   // a bundle (its width, height, the gap after it, one of its cells) in frame cells
    const kinds = q.nums.map((_, j) => ANIMALS[j % ANIMALS.length].h);
    const ov = el('div', 'teach'), top = el('div', 'thead'), stage = el('div', 'tstage');
    const owl = el('img', 'owl'); owl.src = this.img(FRIENDS.findIndex(f => f.id === 'owl')); owl.alt = '';
    owl.onclick = () => { Snd.play('tap'); Voice.say(this.s && this.s.line); };   // tap the teacher to hear what to do again
    top.appendChild(owl);
    const eq = el('div', 'teq'), parts = [];
    q.nums.forEach((v, j) => {
      if (j) eq.appendChild(el('b', 'op', q.signs[j - 1] === '+' ? '+' : '−'));
      const b = el('b', 'n', v); b.style.setProperty('--c', Cast.FX[FRIENDS[kinds[j]].fam[0]][1]);
      parts.push(b); eq.appendChild(b);
    });
    eq.appendChild(el('b', 'op', '='));
    const ans = el('span', 'tans', '?'); eq.appendChild(ans);
    top.appendChild(eq);
    const shut = el('button', 'ibtn', '✕'); shut.onclick = () => { Snd.play('tap'); Voice.stop(); this.close(); if (o.close) o.close(); };
    top.appendChild(shut);
    ov.appendChild(top); ov.appendChild(stage); host.appendChild(ov);
    const frame = el('div', 'tframe'); stage.appendChild(frame);
    for (let i = 0; i < 10; i++) frame.appendChild(el('i'));
    const total = el('div', 'ttotal'); stage.appendChild(total);
    const sign = el('div', 'tsign'); stage.appendChild(sign);
    const hand = el('div', 'whand', '👆'); stage.appendChild(hand);

    // the biggest number of bundles at any time, and the widest row of things to add or take away, set the size
    // (ones to add or take away sit in rows of five, like the frame)
    let v = q.nums[0], maxT = Math.floor(v / 10), trayW = 0, trayH = 1.1;
    q.signs.forEach((sg, j) => {
      const b = q.nums[j + 1], t = Math.floor(b / 10);
      v = sg === '+' ? v + b : v - b; maxT = Math.max(maxT, Math.floor(v / 10));
      trayW = Math.max(trayW, 1.2 + t * (CW + CG) + Math.min(5, b % 10) * 1.08);
      trayH = Math.max(trayH, t ? CH : 0, b % 10 > 5 ? 2.2 : 0);
    });
    const s = this.s = {
      q, ov, stage, ans, hand, o, ones: [], tens: [], tray: [], away: [], slots: [], j: 0, total: q.nums[0], need: null,
      phase: 'intro', busy: true, idle: 0, timers: [], u: 0, line: L.teach.open,
    };
    const later = (fn, ms) => { const id = setTimeout(() => { s.timers = s.timers.filter(x => x !== id); if (this.s === s) fn(); }, ms); s.timers.push(id); };
    s.later = later;

    // ---------- where everything goes ----------
    const G = {};
    function geo() {
      const W = stage.clientWidth, H = stage.clientHeight;
      const mainW = maxT * (CW + CG) + (maxT ? 0.4 : 0) + 5.3, wide = Math.max(mainW, trayW) + 0.4;
      const tall = 1.25 + 0.2 + CH + 0.6 + trayH + 0.2;
      const u = s.u = Math.max(18, Math.min(W / wide, H / tall, 92));
      const y0 = (H - tall * u) / 2;
      G.u = u; G.W = W;
      G.tx = (W - mainW * u) / 2; G.ty = y0 + 1.45 * u;
      G.fx = G.tx + (maxT * (CW + CG) + (maxT ? 0.4 : 0)) * u; G.fy = G.ty;
      G.ry = G.ty + (CH + 0.6) * u; G.rh = trayH * u;
      G.cy = y0;
      Object.assign(frame.style, { width: 5.3 * u + 'px', height: CH * u + 'px', transform: `translate(${G.fx}px,${G.fy}px)`, borderRadius: 0.25 * u + 'px', padding: 0.15 * u + 'px' });
      Object.assign(total.style, { fontSize: 1.05 * u + 'px', top: G.cy + 'px' });
    }
    const cell = i => [G.fx + 0.15 * G.u + (i % 5) * G.u, G.fy + 0.15 * G.u + Math.floor(i / 5) * G.u];
    const tenAt = i => [G.tx + i * (CW + CG) * G.u, G.ty];
    const mini = (X, Y, i) => [X + 0.03 * G.u + (i % 2) * MC * G.u, Y + 0.075 * G.u + Math.floor(i / 2) * MC * G.u];
    // the row below: what this number adds (or the spots for what it takes away), after a big + or −
    function rowAt(t, n1) {
      const w = 1.2 + t * (CW + CG) + Math.min(5, n1) * 1.08, x0 = (G.W - w * G.u) / 2, oh = (n1 > 5 ? 2.08 : 1) * G.u;
      return {
        sx: x0, ten: i => [x0 + (1.2 + i * (CW + CG)) * G.u, G.ry + (G.rh - CH * G.u) / 2],
        one: i => [x0 + (1.2 + t * (CW + CG) + (i % 5) * 1.08) * G.u, G.ry + (G.rh - oh) / 2 + Math.floor(i / 5) * 1.08 * G.u],
      };
    }
    const put = (n, X, Y, c, quick) => {   // an animal into a cell of size c (a frame cell is G.u)
      if (quick) n.el.style.transition = 'none';
      n.el.style.width = n.el.style.height = 0.9 * G.u + 'px';
      n.el.style.transform = `translate(${X + 0.05 * c}px,${Y + 0.05 * c}px) scale(${c / G.u})`;
      if (quick) { void n.el.offsetWidth; n.el.style.transition = ''; }
    };
    const putTen = (n, X, Y, quick) => {
      if (quick) n.el.style.transition = 'none';
      Object.assign(n.el.style, { width: CW * G.u + 'px', height: CH * G.u + 'px', borderRadius: 0.2 * G.u + 'px', transform: `translate(${X}px,${Y}px)` });
      $$('img', n.el).forEach((im, i) => { const [mx, my] = mini(0, 0, i); Object.assign(im.style, { width: MC * 0.9 * G.u + 'px', height: MC * 0.9 * G.u + 'px', left: mx + 0.02 * G.u + 'px', top: my + 0.02 * G.u + 'px' }); });
      if (quick) { void n.el.offsetWidth; n.el.style.transition = ''; }
    };
    function layout(quick) {
      s.tens.forEach((n, i) => putTen(n, ...tenAt(i), quick));
      s.ones.forEach((n, i) => put(n, ...cell(i), G.u, quick));
      if (s.row) {
        s.tray.forEach(n => n.ten ? putTen(n, ...s.row.ten(n.at), quick) : put(n, ...s.row.one(n.at), G.u, quick));
        s.slots.forEach(sl => {
          const [X, Y] = sl.ten ? s.row.ten(sl.at) : s.row.one(sl.at);
          Object.assign(sl.el.style, sl.ten ? { width: CW * G.u + 'px', height: CH * G.u + 'px', borderRadius: 0.2 * G.u + 'px' } : { width: 0.9 * G.u + 'px', height: 0.9 * G.u + 'px' },
            { transform: `translate(${sl.ten ? X : X + 0.05 * G.u}px,${sl.ten ? Y : Y + 0.05 * G.u}px)` });
          if (sl.got) sl.got.ten ? putTen(sl.got, X, Y, quick) : put(sl.got, X, Y, G.u, quick);
        });
        Object.assign(sign.style, { fontSize: 0.9 * G.u + 'px', transform: `translate(${s.row.sx}px,${G.ry + G.rh / 2 - 0.6 * G.u}px)`, width: G.u + 'px', height: 1.2 * G.u + 'px' });
      }
    }
    // ---------- the animals ----------
    const one = k => { const n = { k, el: el('div', 'tk') }; const im = el('img'); im.src = Teach.img(k); im.alt = ''; n.el.appendChild(im); stage.appendChild(n.el); return n; };
    const ten = ks => {
      const n = { ten: true, ks, el: el('div', 'tcard') };
      ks.forEach(k => { const im = el('img'); im.src = Teach.img(k); im.alt = ''; n.el.appendChild(im); });
      stage.appendChild(n.el); return n;
    };
    const pop = (n, delay) => { n.el.style.opacity = 0; later(() => { n.el.style.opacity = 1; n.el.animate([{ scale: '0.2' }, { scale: '1.15' }, { scale: '1' }], { duration: 320, easing: 'ease-out' }); }, delay); };
    const count = () => {
      const t = Math.floor(s.total / 10), o1 = s.total % 10;
      total.innerHTML = (t ? `<span class="t">${t}</span>` : '') + `<span class="o">${o1}</span>`;
      total.animate([{ transform: 'translateX(-50%) scale(1.25)' }, { transform: 'translateX(-50%) scale(1)' }], { duration: 260, easing: 'ease-out' });
    };
    const fxAt = (n, col) => { const r = n.el.getBoundingClientRect(); Fx.sparkles(r.left + r.width / 2, r.top + r.height / 2, 10, r.width * 0.6, col || '#ffd23a'); };

    // ---------- the steps ----------
    // the first number: its bundles and ones pop in while the teacher speaks, then its total is said
    function intro() {
      const v0 = q.nums[0];
      for (let i = 0; i < Math.floor(v0 / 10); i++) s.tens.push(ten(Array(10).fill(kinds[0])));
      for (let i = 0; i < v0 % 10; i++) s.ones.push(one(kinds[0]));
      geo(); layout(true);
      s.tens.forEach((n, i) => pop(n, 200 + i * 140));
      s.ones.forEach((n, i) => pop(n, 200 + s.tens.length * 140 + i * 90));
      count();
      parts[0].classList.add('now');
      // then the first number is said, then the next number's animals come (or after a while anyway, if a line is cut)
      let went = false;
      const go = () => { if (!went && this.s === s) { went = true; next(); } };
      Voice.say(L.teach.open, { onend: () => { if (this.s === s) Voice.say(String(v0), { onend: () => later(go, 250) }); } });
      later(go, 9000);
    }
    const next = () => {
      parts.forEach((p, i) => p.classList.toggle('now', i === s.j + 1));
      if (s.j >= q.signs.length) return end();
      const sg = q.signs[s.j], b = q.nums[s.j + 1], t = Math.floor(b / 10), n1 = b % 10, k = kinds[s.j + 1];
      s.row = rowAt(t, n1); s.tray = []; s.slots.forEach(sl => sl.el.remove()); s.slots = [];
      sign.textContent = sg === '+' ? '+' : '−'; sign.className = 'tsign on ' + (sg === '+' ? 'add' : 'sub');
      if (sg === '+') {
        for (let i = 0; i < t; i++) { const n = ten(Array(10).fill(k)); n.at = i; s.tray.push(n); }
        for (let i = 0; i < n1; i++) { const n = one(k); n.at = i; s.tray.push(n); }
      } else {
        s.need = { t, n1 };
        for (let i = 0; i < t; i++) s.slots.push({ ten: true, at: i, el: stage.appendChild(el('div', 'tslot ten')) });
        for (let i = 0; i < n1; i++) s.slots.push({ at: i, el: stage.appendChild(el('div', 'tslot')) });
      }
      layout(true);
      s.tray.forEach((n, i) => pop(n, i * 70));
      s.slots.forEach((sl, i) => sl.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: i * 50, fill: 'backwards' }));
      Voice.say(s.line = sg === '+' ? L.teach.add : L.teach.sub);
      s.phase = sg === '+' ? 'add' : 'sub'; s.busy = false; s.idle = 0;
      if (sg === '-') untieIfShort();
    };
    // one tap: the next animal (or bundle) hops in, or one leaves
    function step() {
      if (s.busy || (s.phase !== 'add' && s.phase !== 'sub')) return;
      Snd.init(); s.idle = 0; hand.classList.remove('on');
      if (s.phase === 'add') {
        const n = s.tray.shift();
        if (n.ten) { s.tens.push(n); s.total += 10; } else { s.ones.push(n); s.total += 1; }
        layout(); count(); Snd.play('hop', s.total); Voice.say(String(s.total));
        later(() => fxAt(n, '#fff6a8'), 300);
        if (s.ones.length === 10) { s.busy = true; later(tie, 650); }
        else if (!s.tray.length) done();
      } else {
        const sl = s.slots.find(x => !x.got && (s.need.t ? x.ten : !x.ten));
        const n = sl.ten ? s.tens.pop() : s.ones.pop();
        sl.got = n; n.el.classList.add('gone');
        if (sl.ten) { s.need.t--; s.total -= 10; } else { s.need.n1--; s.total -= 1; }
        layout(); count(); Snd.play('bye', s.total); Voice.say(String(s.total));
        if (!s.need.t && !s.need.n1) done();
        else untieIfShort();
      }
    }
    // ten in the frame: they hop into a bundle that stands next to the others
    function tie() {
      const at = tenAt(s.tens.length), ks = s.ones.map(n => n.k);
      s.ones.forEach((n, i) => { const [X, Y] = mini(...at, i); n.el.style.transitionDelay = i * 25 + 'ms'; put(n, X, Y, MC * G.u); });
      Snd.play('tie'); Voice.say(L.teach.tie);
      later(() => {
        const b = ten(ks); s.ones.forEach(n => n.el.remove()); s.ones = [];
        s.tens.push(b); layout(true);
        b.el.classList.add('new'); fxAt(b);
        later(() => { if (s.tray.length) s.busy = false; else done(); }, 500);
      }, 700);
    }
    // not enough ones to take away: a bundle is untied into the frame
    function untieIfShort() {
      if (!s.need || s.need.t || !s.need.n1 || s.ones.length) return;
      s.busy = true;
      later(() => {
        const b = s.tens.pop(), [X, Y] = tenAt(s.tens.length);
        b.el.animate([{ transform: b.el.style.transform }, { transform: b.el.style.transform + ' scale(1.12) rotate(-4deg)' }, { transform: b.el.style.transform }], { duration: 380 });
        Snd.play('untie'); Voice.say(L.teach.untie);
        later(() => {
          s.ones = b.ks.map(k => one(k));
          s.ones.forEach((n, i) => { const [mx, my] = mini(X, Y, i); put(n, mx, my, MC * G.u, true); });
          b.el.remove();
          requestAnimationFrame(() => { s.ones.forEach((n, i) => { n.el.style.transitionDelay = i * 30 + 'ms'; }); layout(); later(() => { s.ones.forEach(n => { n.el.style.transitionDelay = ''; }); s.busy = false; s.idle = 0; }, 700); });
        }, 420);
      }, 450);
    }
    function done() {
      s.busy = true; s.phase = 'wait';
      later(() => { s.ones.forEach(n => { n.el.style.transitionDelay = ''; }); s.j++; next(); }, 900);
    }
    function end() {
      s.phase = 'end'; s.busy = true;
      sign.className = 'tsign'; s.slots.forEach(sl => sl.el.classList.add('dim'));
      total.classList.add('glow');
      ans.classList.add('ask');
      later(() => Voice.say(s.line = L.teach.end), 400);
    }
    // the hand shows where to tap when she waits
    s.tick = setInterval(() => {
      owl.classList.toggle('talk', Voice.busy);
      if (s.busy || (s.phase !== 'add' && s.phase !== 'sub')) return;
      s.idle += 150;
      if (s.idle > 2600 && !hand.classList.contains('on')) {
        const n = s.phase === 'add' ? s.tray[0] : (s.need.t ? s.tens[s.tens.length - 1] : s.ones[s.ones.length - 1]);
        if (!n) return;
        const r = n.el.getBoundingClientRect(), b = stage.getBoundingClientRect();
        hand.style.left = r.left - b.left + r.width * 0.3 + 'px'; hand.style.top = r.top - b.top + r.height * 0.55 + 'px';
        hand.classList.add('on');
        if (s.idle < 2800) Voice.say(L.teach.tap);
      }
    }, 150);
    stage.addEventListener('pointerdown', e => { e.preventDefault(); step(); });
    s.relayout = () => { geo(); layout(true); };
    requestAnimationFrame(() => intro.call(this));
  },
  sync(got) { if (this.s) this.s.ans.textContent = got || '?'; },
  shake() {
    const a = this.s && this.s.ans; if (!a) return;
    a.classList.remove('bad'); void a.offsetWidth; a.classList.add('bad');
  },
  relayout() { if (this.s) this.s.relayout(); },
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
};
