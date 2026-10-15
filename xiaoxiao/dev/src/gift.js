// 动物消消乐 · the blind box after each win (decli asked for a gift to open after a level): a box drops in, she taps it
// three times, and an animal friend from decli's picture pops out. More stars give a finer box and better odds of a
// rare friend; a friend she does not have yet always comes before one she has. The album (🎁 on the map) shows every
// friend, the missing ones as shadows to guess. Everything here is pictures and the narrator's voice: she can't read.
const Gift = {
  // chance of 稀有 and 隐藏款 for a box won with 1, 2 or 3 stars
  ODDS: [[0.12, 0], [0.12, 0], [0.25, 0.04], [0.4, 0.1]],
  // the box by stars: light, base, dark, ribbon, ribbon shade
  LOOK: [null, ['#ffd3e8', '#ff8fc4', '#d9478d', '#fff3a6', '#e0a800'], ['#e6dbff', '#a982ff', '#6a3fd6', '#ffd0e6', '#e05a9a'],
    ['#fff3bf', '#ffcf3a', '#d98e00', '#ff6b8a', '#c42c55']],
  on: false,

  owned(i) { return FRIENDS[i].tier < 0 || (Store.d.gifts[FRIENDS[i].id] || 0) > 0; },
  count() { return FRIENDS.filter(f => this.owned(f.i)).length; },
  roll(stars) {
    const [pr, ph] = this.ODDS[stars] || this.ODDS[1], r = Math.random();
    const tier = r < ph ? 2 : r < ph + pr ? 1 : 0;
    const of = t => FRIENDS.filter(f => f.tier === t), fresh = l => l.filter(f => !this.owned(f.i));
    let pool = fresh(of(tier));
    // that tier is complete: most of the time a missing ordinary or rare friend comes instead (never a free 隐藏款)
    if (!pool.length && Math.random() < 0.7) pool = fresh([...of(0), ...of(1)]);
    if (!pool.length) pool = of(tier);
    return pick(pool);
  },

  // ---------- opening a box: resolves when she has taken the friend ----------
  open(stars) {
    return new Promise(resolve => {
      const d = Store.d, f = this.roll(stars), fresh = !this.owned(f.i);
      d.gifts[f.id] = (d.gifts[f.id] || 0) + 1;
      if (fresh) d.giftFresh = [...(d.giftFresh || []), f.id];
      d.seen.boxes = (d.seen.boxes || 0) + 1;
      Store.save();   // saved before the box opens, so leaving half-way neither loses it nor rolls again
      const s = this.s = {
        f, fresh, n: d.gifts[f.id], look: this.LOOK[clamp(stars, 1, 3)], all: fresh && this.count() === FRIENDS.length,
        phase: 'drop', t: 0, taps: 0, tapT: 9e9, idleT: 0, openT: 0, popT: 9e9, leaveT: 0, rot: 0, sparkT: 0, said: false, token: {},
        resolve,
      };
      const ov = this.ov = el('div'); ov.id = 'gift';
      this.cv = el('canvas'); ov.appendChild(this.cv);
      const keep = this.keep = UI.button('收下 👍', 'green keep', () => this.leave());
      ov.appendChild(keep);
      ov.addEventListener('pointerdown', e => { if (e.target !== keep) this.tap(e.clientX, e.clientY); });
      document.body.appendChild(ov);
      Fx.hush();
      this.on = true; this.prize = null; this.W = 0;
      let last = performance.now();
      const step = now => {
        if (!this.on) return;
        const dt = Math.min(50, now - last); last = now;
        this.update(dt); this.draw();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
  geo() {
    const W = innerWidth, H = innerHeight, S = Math.min(W * 0.3, H * 0.4);
    return { W, H, S, bx: W / 2, by: H * 0.8 - S * 0.36, px: W / 2, py: H * 0.43, P: Math.min(H * 0.46, W * 0.36) };
  },
  tap(x, y) {
    const s = this.s, g = this.geo();
    Snd.init();
    if (s.phase === 'show') {   // tap the friend to hear its name again
      if (Math.hypot(x - g.px, y - g.py) < g.P * 0.6) { s.popT = 0; Snd.play('select'); Voice.say(L.gift.got[s.f.i]); }
      return;
    }
    if (s.phase !== 'idle') return;
    s.taps++; s.tapT = 0; s.idleT = 0;
    Snd.play('gtap', s.taps);
    Fx.burst(g.bx, g.by - g.S * 0.2, [s.look[1], s.look[3]], 8 + s.taps * 4, 0.8 + s.taps * 0.3, g.S * 0.4);
    Fx.sparkles(g.bx, g.by - g.S * 0.4, 6 + s.taps * 3, g.S * 0.5, '#fff6b0');
    if (s.taps >= 3) this.burst();
  },
  burst() {
    const s = this.s, g = this.geo(), f = s.f;
    s.phase = 'open'; s.openT = 0;
    Voice.stop();
    Snd.play('gopen'); if (f.tier > 0) Snd.play('grare');
    Fx.flash(0.75, '#fff');
    Fx.confetti(f.tier > 0 ? 140 : 90);
    Fx.burst(g.bx, g.by - g.S * 0.4, ['#ffd23a', '#ffffff'], 30, 2.2, g.S * 0.5);
    // what the narrator says: the kind of friend, its name, and whether it is a new one
    const lines = [f.tier === 2 ? L.gift.hidden : f.tier === 1 ? L.gift.rare : null, L.gift.got[f.i], s.fresh ? null : L.gift.again, s.all ? L.gift.full : null].filter(Boolean);
    const tok = s.token;
    const next = () => { const t = lines.shift(); if (t && this.on && this.s.token === tok) Voice.say(t, { onend: () => setTimeout(next, 150) }); };
    setTimeout(next, 650);
  },
  leave() {
    const s = this.s;
    if (s.phase !== 'show') return;
    s.phase = 'leave'; s.leaveT = 0; s.token = {};
    this.keep.classList.remove('on');
    Snd.play('home');
  },
  close() {
    this.on = false; this.ov.remove(); this.ov = null;
    this.s.resolve();
  },

  update(dt) {
    const s = this.s, g = this.geo();
    s.t += dt; s.tapT += dt; s.popT += dt; s.rot += dt * (s.phase === 'show' || s.phase === 'open' ? 0.00025 : 0.00012);
    if (s.phase === 'drop' && s.t > 650) {
      s.phase = 'idle'; s.tapT = 0;
      Snd.play('gland');
      Fx.sparkles(g.bx, g.by + g.S * 0.3, 10, g.S * 0.6, '#ffffff');
      if (Store.d.seen.boxes <= 3) Voice.say(L.gift.drop);
    }
    if (s.phase === 'idle') s.idleT += dt;
    if (s.phase === 'open') { s.openT += dt; if (s.openT > 1000) { s.phase = 'show'; s.showT = 0; } }
    if (s.phase === 'show') {
      s.showT += dt;
      if (s.showT > 700 && !this.keep.classList.contains('on')) this.keep.classList.add('on');
      if (s.f.tier > 0 && (s.sparkT -= dt) < 0) { s.sparkT = 140; Fx.sparkles(g.px + rnd(-1, 1) * g.P * 0.55, g.py + rnd(-1, 1) * g.P * 0.5, 2, 10, s.f.tier === 2 ? pick(['#ff9fca', '#9fe3ff', '#fff3a6', '#c6a6ff']) : '#ffe680'); }
    }
    if (s.phase === 'leave') { s.leaveT += dt; if (s.leaveT > 480) this.close(); }
  },

  // ---------- drawing ----------
  draw() {
    const s = this.s, g = this.geo(), dpr = Math.min(devicePixelRatio || 1, 2), cv = this.cv;
    if (g.W !== this.W || g.H !== this.H) {
      this.W = g.W; this.H = g.H; cv.width = Math.round(g.W * dpr); cv.height = Math.round(g.H * dpr);
      cv.style.width = g.W + 'px'; cv.style.height = g.H + 'px'; this.prize = null;
    }
    if (!this.prize) this.prize = Art.friend(s.f.i, g.P * dpr, g.P * dpr * 0.92);
    const x = cv.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fade = s.phase === 'leave' ? 1 - s.leaveT / 480 : Math.min(1, s.t / 250);
    x.globalAlpha = fade;
    x.fillStyle = 'rgba(46,20,78,0.72)'; x.fillRect(0, 0, g.W, g.H);
    const opened = s.phase === 'open' || s.phase === 'show' || s.phase === 'leave';
    const ok = opened ? Math.min(1, s.openT / 500) : 0;
    // light rays: soft behind the box, then the friend's colour (gold for 稀有, a rainbow for 隐藏款)
    const rcx = lerp(g.bx, g.px, ok), rcy = lerp(g.by - g.S * 0.1, g.py, ok);
    this.rays(x, rcx, rcy, Math.max(g.W, g.H) * 0.75, 16, s.rot * Math.PI * 2, i => {
      if (!opened) return 'rgba(255,255,255,0.10)';
      if (s.f.tier === 2) return `hsla(${(i * 360 / 16 + s.t * 0.05) % 360},95%,70%,${0.32 * ok})`;
      return s.f.tier === 1 ? `rgba(255,214,60,${0.34 * ok})` : `rgba(255,236,190,${0.2 * ok})`;
    });
    if (!opened || s.openT < 900) this.drawBoxAt(x, g, s);
    if (opened) this.drawPrize(x, g, s, dpr);
    if (s.phase === 'idle' && s.idleT > 2600) {   // a finger showing where to tap
      const ph = (s.idleT % 900) / 900, sz = g.S * 0.32;
      x.font = `${sz}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('👆', g.bx + g.S * 0.42, g.by + g.S * 0.32 + (ph < 0.3 ? (0.3 - ph) * sz * 0.8 : 0));
    }
    x.globalAlpha = 1;
  },
  rays(x, cx, cy, R, n, rot, col) {
    for (let i = 0; i < n; i++) {
      const a0 = rot + i * Math.PI * 2 / n, gr = x.createRadialGradient(cx, cy, 0, cx, cy, R), c = col(i);
      gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R, a0, a0 + Math.PI / n); x.closePath(); x.fill();
    }
  },
  drawBoxAt(x, g, s) {
    const S = g.S;
    let dy = 0, sx = 1, sy = 1, rot = 0, a = 1;
    if (s.phase === 'drop') {   // falling in with a bounce
      const k = Math.min(1, s.t / 650);
      dy = -(g.by + S) * (1 - this.bounce(k));
    } else if (s.phase === 'idle') {
      const k = s.tapT / 420;   // squash and wobble after each tap (and on landing)
      if (k < 1) { const w = Math.sin(k * Math.PI * 3) * (1 - k); sx = 1 + 0.16 * w; sy = 1 - 0.16 * w; rot = 0.12 * w * (s.taps % 2 ? 1 : -1); dy = -S * 0.12 * Math.max(0, Math.sin(k * Math.PI)) * (s.taps ? 1 : 0); }
      else { sy = 1 + 0.025 * Math.sin(s.t / 260); sx = 2 - sy; const p = (s.t % 2400) / 2400; if (p > 0.85) rot = Math.sin((p - 0.85) / 0.15 * Math.PI * 4) * 0.06; }
    } else {   // opened: the lid flies off, the box sinks away
      const k = clamp((s.openT - 200) / 600, 0, 1);
      dy = S * 1.4 * Ease.in(k); a = 1 - k;
      const q = Math.min(1, s.openT / 160); sx = 1 + 0.2 * Math.sin(q * Math.PI); sy = 1 - 0.2 * Math.sin(q * Math.PI);
    }
    // the shadow on the floor
    x.save(); x.globalAlpha *= a * (s.phase === 'drop' ? Math.min(1, s.t / 650) : 1);
    x.fillStyle = 'rgba(20,6,40,0.35)'; x.beginPath(); x.ellipse(g.bx, g.by + S * 0.38, S * 0.6 * sx, S * 0.09, 0, 0, 7); x.fill();
    x.restore();
    x.save();
    x.translate(g.bx, g.by + S * 0.36 + dy); x.rotate(rot); x.scale(sx, sy); x.translate(0, -S * 0.36);
    let lid = { x: 0, y: 0, r: 0 }, glow = s.phase === 'idle' ? s.taps / 3 : 0;
    if (s.phase !== 'drop' && s.phase !== 'idle') {   // the lid flies up and away, spinning, while the box sinks
      const e = Math.min(1, s.openT / 900);
      lid = { x: -S * 1.3 * e, y: -dy - g.H * 0.9 * e + g.H * 1.4 * e * e, r: -2.4 * e };
      glow = 1;
    }
    this.drawBox(x, S, s.look, lid, glow, a);
    x.restore();
  },
  bounce(k) {   // ease out with two little bounces
    const n = 7.5625, d = 2.75;
    if (k < 1 / d) return n * k * k;
    if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
    if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
    return n * (k -= 2.625 / d) * k + 0.984375;
  },
  // the box, its body's centre at (0, 0); lid offset {x, y, r} once it is flying; glow 0-1 = light leaking out;
  // bodyA the body's opacity (it fades as it sinks away; the lid stays whole)
  drawBox(x, S, look, lid, glow, bodyA) {
    const [lt, base, dk, rb, rbd] = look, w = S, h = S * 0.72, r = S * 0.07, lw = S * 0.028, ink = '#4a2b5e', rw = S * 0.17;
    x.lineJoin = 'round';
    const ribbon = (y0, hh) => {
      const rg = x.createLinearGradient(-rw / 2, 0, rw / 2, 0);
      rg.addColorStop(0, rbd); rg.addColorStop(0.25, rb); rg.addColorStop(0.75, rb); rg.addColorStop(1, rbd);
      x.fillStyle = rg; x.fillRect(-rw / 2, y0, rw, hh);
    };
    // body
    x.save(); x.globalAlpha *= bodyA;
    const g = x.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, lt); g.addColorStop(0.3, base); g.addColorStop(1, dk);
    Art.rr(x, -w / 2, -h / 2, w, h, r); x.fillStyle = g; x.fill();
    x.save(); Art.rr(x, -w / 2, -h / 2, w, h, r); x.clip();
    ribbon(-h / 2, h);
    x.fillStyle = 'rgba(255,255,255,0.3)'; Art.rr(x, -w / 2 + S * 0.06, -h / 2 + S * 0.07, S * 0.07, h * 0.62, S * 0.035); x.fill();
    x.fillStyle = 'rgba(60,20,80,0.18)'; x.fillRect(-w / 2, -h / 2, w, S * 0.05);   // the lid's shadow
    x.restore();
    Art.rr(x, -w / 2, -h / 2, w, h, r); x.lineWidth = lw; x.strokeStyle = ink; x.stroke();
    // the question-mark sticker on the ribbon
    x.beginPath(); x.arc(0, h * 0.08, S * 0.155, 0, 7); x.fillStyle = '#fff'; x.fill(); x.lineWidth = lw * 0.8; x.stroke();
    x.font = `900 ${S * 0.23}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = dk; x.fillText('?', 0, h * 0.08 + S * 0.012);
    x.restore();
    // light leaking out under the lid, brighter with each tap
    if (glow > 0) {
      x.save(); x.globalAlpha *= bodyA; x.globalCompositeOperation = 'lighter';
      const gg = x.createRadialGradient(0, -h / 2, 0, 0, -h / 2, S * (0.45 + 0.5 * glow));
      gg.addColorStop(0, `rgba(255,250,200,${0.95 * glow})`); gg.addColorStop(0.4, `rgba(255,220,120,${0.5 * glow})`); gg.addColorStop(1, 'rgba(255,200,80,0)');
      x.fillStyle = gg; x.beginPath(); x.ellipse(0, -h / 2, S * (0.45 + 0.5 * glow), S * (0.12 + 0.25 * glow), 0, 0, 7); x.fill();
      x.restore();
    }
    // lid with the bow
    x.save(); x.translate(lid.x, -h / 2 + lid.y); x.rotate(lid.r);
    const LW = w * 1.1, LH = S * 0.22;
    const lg = x.createLinearGradient(0, -LH, 0, 0); lg.addColorStop(0, lt); lg.addColorStop(0.5, base); lg.addColorStop(1, dk);
    Art.rr(x, -LW / 2, -LH, LW, LH, S * 0.05); x.fillStyle = lg; x.fill();
    x.save(); Art.rr(x, -LW / 2, -LH, LW, LH, S * 0.05); x.clip(); ribbon(-LH, LH);
    x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(-LW / 2, -LH + S * 0.025, LW, S * 0.035); x.restore();
    Art.rr(x, -LW / 2, -LH, LW, LH, S * 0.05); x.lineWidth = lw; x.strokeStyle = ink; x.stroke();
    for (const sd of [-1, 1]) {   // the bow's two loops
      x.save(); x.translate(sd * S * 0.12, -LH - S * 0.07); x.rotate(sd * 0.45);
      x.beginPath(); x.ellipse(0, 0, S * 0.13, S * 0.085, 0, 0, 7);
      const bg = x.createLinearGradient(0, -S * 0.08, 0, S * 0.08); bg.addColorStop(0, rb); bg.addColorStop(1, rbd);
      x.fillStyle = bg; x.fill(); x.lineWidth = lw * 0.9; x.stroke();
      x.beginPath(); x.ellipse(sd * S * 0.02, 0, S * 0.055, S * 0.03, 0, 0, 7); x.fillStyle = 'rgba(80,20,40,0.35)'; x.fill();
      x.restore();
    }
    x.beginPath(); x.arc(0, -LH - S * 0.04, S * 0.06, 0, 7); x.fillStyle = rb; x.fill(); x.lineWidth = lw * 0.9; x.stroke();
    x.beginPath(); x.arc(-S * 0.018, -LH - S * 0.058, S * 0.02, 0, 7); x.fillStyle = 'rgba(255,255,255,0.7)'; x.fill();
    x.restore();
  },
  drawPrize(x, g, s, dpr) {
    const f = s.f, P = g.P;
    let k = clamp((s.openT - 120) / 750, 0, 1), sc = 0.15 + 0.85 * Ease.back(k), cx = g.px, cy = lerp(g.by - g.S * 0.3, g.py, Ease.out(k));
    if (s.phase === 'show') cy += Math.sin(s.showT / 380) * P * 0.02;
    if (s.popT < 400) sc *= 1 + 0.12 * Math.sin(s.popT / 400 * Math.PI);
    let a = 1;
    if (s.phase === 'leave') { const q = Ease.in(Math.min(1, s.leaveT / 480)); sc *= 1 - 0.7 * q; cy -= g.H * 0.35 * q; a = 1 - q; }
    x.save(); x.globalAlpha *= a;
    // a glow behind the friend
    const R = P * 0.62 * sc, gl = x.createRadialGradient(cx, cy, 0, cx, cy, R);
    const c = f.tier === 1 ? '255,214,60' : f.tier === 2 ? '255,170,230' : '255,250,235';
    gl.addColorStop(0, `rgba(255,255,255,0.95)`); gl.addColorStop(0.55, `rgba(${c},0.7)`); gl.addColorStop(1, `rgba(${c},0)`);
    x.fillStyle = gl; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
    const D = P * sc;
    x.drawImage(this.prize, cx - D / 2, cy - D / 2, D, D);
    if (s.phase === 'show' || s.phase === 'leave') this.badges(x, cx, cy, P * sc, s, Math.min(1, (s.showT || 0) / 300));
    x.restore();
  },
  // NEW, ×2, and a ribbon for 稀有 / 隐藏款
  badges(x, cx, cy, P, s, k) {
    const f = s.f, e = Ease.back(k);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    if (s.fresh) {
      x.save(); x.translate(cx + P * 0.38, cy - P * 0.36); x.rotate(-0.25 + Math.sin(s.t / 300) * 0.06); x.scale(e, e);
      x.beginPath();
      for (let i = 0; i < 24; i++) { const ang = i * Math.PI / 12, rr = i % 2 ? P * 0.1 : P * 0.13; x.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); }
      x.closePath(); x.fillStyle = '#ff4f6d'; x.fill(); x.lineWidth = P * 0.018; x.strokeStyle = '#fff'; x.stroke();
      x.font = `900 ${P * 0.075}px "Arial Rounded MT Bold","Trebuchet MS",${FONT}`; x.fillStyle = '#fff'; x.fillText('NEW', 0, P * 0.004);
      x.restore();
    } else {
      x.save(); x.translate(cx + P * 0.38, cy + P * 0.34); x.scale(e, e);
      Art.rr(x, -P * 0.1, -P * 0.06, P * 0.2, P * 0.12, P * 0.06); x.fillStyle = '#7b4dff'; x.fill(); x.lineWidth = P * 0.014; x.strokeStyle = '#fff'; x.stroke();
      x.font = `900 ${P * 0.075}px ${FONT}`; x.fillStyle = '#fff'; x.fillText('×' + s.n, 0, P * 0.004);
      x.restore();
    }
    if (f.tier > 0) {
      const w = P * 0.62, h = P * 0.15;
      x.save(); x.translate(cx, cy + P * 0.56); x.scale(e, e);
      x.beginPath(); x.moveTo(-w / 2 - h * 0.5, -h / 2 + h * 0.15); x.lineTo(-w / 2 - h * 0.15, 0 + h * 0.15); x.lineTo(-w / 2 - h * 0.5, h / 2 + h * 0.15);
      x.lineTo(w / 2 + h * 0.5, h / 2 + h * 0.15); x.lineTo(w / 2 + h * 0.15, h * 0.15); x.lineTo(w / 2 + h * 0.5, -h / 2 + h * 0.15); x.closePath();
      x.fillStyle = f.tier === 2 ? '#c06ad6' : '#d98e00'; x.fill();
      const gr = x.createLinearGradient(-w / 2, 0, w / 2, 0);
      if (f.tier === 2) ['#ff5f8f', '#ffb13a', '#ffe04a', '#5fe07a', '#4ac8ff', '#a77bff'].forEach((c2, i) => gr.addColorStop(i / 5, c2));
      else { gr.addColorStop(0, '#ffe680'); gr.addColorStop(0.5, '#ffcf3a'); gr.addColorStop(1, '#ffe680'); }
      Art.rr(x, -w / 2, -h / 2, w, h, h * 0.3); x.fillStyle = gr; x.fill(); x.lineWidth = P * 0.014; x.strokeStyle = '#fff'; x.stroke();
      x.font = `900 ${h * 0.62}px ${FONT}`; x.lineJoin = 'round'; x.lineWidth = h * 0.16; x.strokeStyle = f.tier === 2 ? '#6a2a8a' : '#8a5200';
      const label = f.tier === 2 ? '隐藏款' : '稀有';
      x.strokeText(label, 0, h * 0.04); x.fillStyle = '#fff'; x.fillText(label, 0, h * 0.04);
      x.restore();
    }
  },

  // ---------- the album: every friend on one page, ten in a row like decli's pictures ----------
  album() {
    const d = Store.d, fresh = new Set(d.giftFresh || []);
    d.giftFresh = []; Store.save();
    UI.closeModal();
    const root = $('#album'); root.hidden = false; root.innerHTML = '';
    const top = el('div', 'top');
    const back = el('button', 'ibtn', '🗺️'); back.onclick = () => { Snd.play('tap'); root.hidden = true; root.innerHTML = ''; UI.map(); };
    top.appendChild(back);
    top.appendChild(el('h1', null, '动物收集册'));
    top.appendChild(el('div', 'pill', `🎁 ${this.count()} / ${FRIENDS.length}`));
    root.appendChild(top);
    const grid = el('div', 'agrid'); root.appendChild(grid);
    const slots = FRIENDS.map(f => {
      const b = el('button', 'aslot t' + Math.max(0, f.tier) + (this.owned(f.i) ? '' : ' no'));
      if (fresh.has(f.id)) b.appendChild(el('i', 'anew', 'NEW'));
      const n = d.gifts[f.id] || 0;
      if (n > 1) b.appendChild(el('b', null, '×' + n));
      b.onclick = () => {
        if (this.owned(f.i)) { Snd.play('select'); Voice.say(L.gift.names[f.i]); b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 380); }
        else { Snd.play('bad'); Voice.say(L.gift.locked); b.animate([{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], 250); }
      };
      grid.appendChild(b);
      return b;
    });
    // the heads are drawn once the slots have their size
    const paint = () => {
      if (root.hidden) return;
      const dpr = Math.min(devicePixelRatio || 1, 2), r = slots[0].getBoundingClientRect(), px = Math.floor(Math.min(r.width, r.height) * 0.94);
      slots.forEach((b, i) => {
        const old = $('canvas', b); if (old) old.remove();
        const c = this.slot(FRIENDS[i], px * dpr); c.style.width = c.style.height = px + 'px';
        b.prepend(c);
      });
    };
    requestAnimationFrame(paint);
    this._albumResize && removeEventListener('resize', this._albumResize);
    this._albumResize = () => requestAnimationFrame(paint);
    addEventListener('resize', this._albumResize);
    if (!d.seen.album) { d.seen.album = 1; Store.save(); Voice.say(L.gift.album); }
  },
  // a friend for the album: its head, or its shadow with a question mark if she has not found it yet
  slot(f, s) {
    const c = Art.friend(f.i, s, s * 0.86);
    if (this.owned(f.i)) return c;
    const x = c.getContext('2d');
    x.globalCompositeOperation = 'source-in'; x.fillStyle = f.tier === 2 ? '#d7b8f0' : '#cbbcdb'; x.fillRect(0, 0, s, s);
    x.globalCompositeOperation = 'source-over';
    x.font = `900 ${s * 0.38}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = s * 0.05; x.strokeStyle = '#a593bd'; x.strokeText('?', s / 2, s * 0.53); x.fillStyle = '#fff'; x.fillText('?', s / 2, s * 0.53);
    return c;
  },
};
