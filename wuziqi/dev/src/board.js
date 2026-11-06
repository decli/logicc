// 五子棋 · the board on a canvas: wood, lines and star points (drawn once per size), stones (drawn once per size and
// stamped), the last move, a ghost stone under the finger, rings for 提醒 and 💡, and the winning line.
const Board = {
  cv: null, x: null, dpr: 1, n: 15, pos: null, S: 0, cell: 0, ox: 0, oy: 0, base: null, stones: [],
  ghost: -1, ghostC: 1, urgent: [], soon: [], hintAt: -1, hintUntil: 0, dropAt: -1, dropT: 0, winT: 0, onPlace: null, enabled: false,
  init(cv) {
    this.cv = cv; this.x = cv.getContext('2d');
    // the finger shows a ghost stone where it would go, and the stone goes where it is lifted (it can slide to adjust)
    let down = false;
    const at = e => { const r = cv.getBoundingClientRect(); return this.hit(e.clientX - r.left, e.clientY - r.top); };
    cv.addEventListener('pointerdown', e => { if (!this.enabled) return; down = true; cv.setPointerCapture(e.pointerId); this.ghost = at(e); });
    cv.addEventListener('pointermove', e => { if (down) this.ghost = at(e); });
    const up = e => {
      if (!down) return;
      down = false;
      const i = at(e); this.ghost = -1;
      if (i >= 0 && this.enabled && !this.pos.b[i] && this.onPlace) this.onPlace(i);
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', () => { down = false; this.ghost = -1; });
    const loop = t => { this.draw(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  },
  set(pos) { this.pos = pos; this.n = pos.n; this.urgent = []; this.soon = []; this.hintAt = -1; this.dropAt = -1; this.winT = 0; this.base = null; this.layout(); },
  layout() {
    const st = this.cv.parentNode, w = st.clientWidth, h = st.clientHeight;
    if (!w || !h || !this.pos) return;
    const dpr = this.dpr = Math.min(devicePixelRatio || 1, 2), pad = Math.max(10, Math.min(w, h) * 0.035);
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
    this.cv.style.width = w + 'px'; this.cv.style.height = h + 'px';
    const S = this.S = Math.floor(Math.min(w, h) - pad * 2);
    this.cell = S / this.n; this.ox = (w - S) / 2; this.oy = (h - S) / 2;
    this.makeBase(); this.makeStones();
  },
  xy(i) { const n = this.n; return [this.ox + ((i % n) + 0.5) * this.cell, this.oy + (((i / n) | 0) + 0.5) * this.cell]; },
  hit(px, py) {
    const n = this.n, cx = Math.floor((px - this.ox) / this.cell), cy = Math.floor((py - this.oy) / this.cell);
    return cx >= 0 && cx < n && cy >= 0 && cy < n ? cy * n + cx : -1;
  },
  // the wood, the lines and the star points
  makeBase() {
    const d = this.dpr, S = this.S, n = this.n, c = this.cell, m = 18;
    const cv = document.createElement('canvas'); cv.width = Math.round((S + m * 2) * d); cv.height = cv.width;
    const x = cv.getContext('2d'); x.scale(d, d); x.translate(m, m);
    const r = c * 0.35;
    const rr = () => { x.beginPath(); x.moveTo(r, 0); x.arcTo(S, 0, S, S, r); x.arcTo(S, S, 0, S, r); x.arcTo(0, S, 0, 0, r); x.arcTo(0, 0, S, 0, r); x.closePath(); };
    x.save(); x.shadowColor = 'rgba(60,40,15,.35)'; x.shadowBlur = 18; x.shadowOffsetY = 8;
    const g = x.createLinearGradient(0, 0, S, S); g.addColorStop(0, '#f0cf98'); g.addColorStop(0.5, '#e5bb7c'); g.addColorStop(1, '#d6a463');
    rr(); x.fillStyle = g; x.fill(); x.restore();
    // grain: long soft waves across the wood
    x.save(); rr(); x.clip();
    for (let k = 0; k < 26; k++) {
      const y0 = (k + 0.5) / 26 * S, a = 3 + (k * 7) % 9, ph = k * 1.7;
      x.beginPath();
      for (let X = -10; X <= S + 10; X += 8) x.lineTo(X, y0 + Math.sin(X / S * 6 + ph) * a + Math.sin(X / S * 17 + ph * 2) * a * 0.3);
      x.strokeStyle = `rgba(150,95,40,${0.05 + (k % 3) * 0.025})`; x.lineWidth = 1 + (k % 4); x.stroke();
    }
    const sh = x.createRadialGradient(S * 0.3, S * 0.25, S * 0.1, S * 0.5, S * 0.5, S * 0.8); sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(1, 'rgba(120,70,20,.08)');
    x.fillStyle = sh; x.fillRect(0, 0, S, S);
    x.restore();
    // lines
    x.strokeStyle = 'rgba(85,55,25,.78)'; x.lineWidth = Math.max(1, c * 0.032); x.lineCap = 'round';
    for (let k = 0; k < n; k++) {
      const p = (k + 0.5) * c;
      x.beginPath(); x.moveTo(c / 2, p); x.lineTo(S - c / 2, p); x.stroke();
      x.beginPath(); x.moveTo(p, c / 2); x.lineTo(p, S - c / 2); x.stroke();
    }
    x.lineWidth = Math.max(1.5, c * 0.05); x.strokeRect(c / 2, c / 2, S - c, S - c);
    const s = n === 15 ? [3, 7, 11] : n === 11 ? [2, 5, 8] : [Math.floor(n / 2)];
    x.fillStyle = 'rgba(85,55,25,.9)';
    s.forEach(a => s.forEach(b => { if ((a === s[1]) !== (b === s[1]) && n >= 11) return; x.beginPath(); x.arc((a + 0.5) * c, (b + 0.5) * c, Math.max(2.5, c * 0.09), 0, 7); x.fill(); }));
    this.base = { cv, m };
  },
  // a black and a white stone, shaded, with their shadow
  makeStones() {
    const d = this.dpr, R = this.cell * 0.46, s = Math.ceil(R * 2.6);
    this.stones = [null, 1, 2].map(c => {
      if (!c) return null;
      const cv = document.createElement('canvas'); cv.width = cv.height = Math.round(s * d);
      const x = cv.getContext('2d'); x.scale(d, d);
      const m = s / 2;
      x.fillStyle = 'rgba(40,25,10,.32)'; x.beginPath(); x.ellipse(m + R * 0.1, m + R * 0.16, R * 1.0, R * 0.98, 0, 0, 7); x.fill();
      const g = x.createRadialGradient(m - R * 0.38, m - R * 0.42, R * 0.05, m, m, R);
      if (c === 1) { g.addColorStop(0, '#7d7d7d'); g.addColorStop(0.35, '#2b2b2b'); g.addColorStop(1, '#060606'); }
      else { g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f2eee5'); g.addColorStop(1, '#c6bfb1'); }
      x.fillStyle = g; x.beginPath(); x.arc(m, m, R, 0, 7); x.fill();
      x.fillStyle = c === 1 ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.9)';
      x.beginPath(); x.ellipse(m - R * 0.36, m - R * 0.42, R * 0.26, R * 0.16, -0.6, 0, 7); x.fill();
      return { cv, s };
    });
  },
  stone(x, c, i, k = 1, a = 1) {
    const [cx, cy] = this.xy(i), st = this.stones[c], s = st.s * k;
    x.globalAlpha = a; x.drawImage(st.cv, cx - s / 2, cy - s / 2, s, s); x.globalAlpha = 1;
  },
  ring(x, i, col, t, solid) {
    const [cx, cy] = this.xy(i), R = this.cell * (0.36 + 0.05 * Math.sin(t / 180));
    x.save(); x.strokeStyle = col; x.lineWidth = Math.max(3, this.cell * 0.09);
    if (!solid) x.setLineDash([this.cell * 0.12, this.cell * 0.08]);
    x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.globalAlpha = 0.18; x.fillStyle = col; x.fill(); x.restore();
  },
  // a stone was just put down: it lands with a little bounce
  dropped(i) { this.dropAt = i; this.dropT = performance.now(); },
  win() { this.winT = performance.now(); },
  draw(t) {
    const x = this.x, p = this.pos, d = this.dpr;
    if (!x || !p || !this.base) return;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.cv.width, this.cv.height); x.setTransform(d, 0, 0, d, 0, 0);
    const b = this.base, S = this.S;
    x.drawImage(b.cv, this.ox - b.m, this.oy - b.m, S + b.m * 2, S + b.m * 2);
    // rings first, so the stones sit on top
    if (!p.winner) {
      this.soon.forEach(i => { if (!p.b[i]) this.ring(x, i, '#ee8a3c', t, false); });
      this.urgent.forEach(i => { if (!p.b[i]) this.ring(x, i, '#e2483d', t * 1.6, true); });
    }
    const last = p.moves[p.moves.length - 1];
    for (let i = 0; i < p.b.length; i++) {
      const c = p.b[i]; if (!c) continue;
      let k = 1;
      if (i === this.dropAt) { const q = Math.min(1, (t - this.dropT) / 220); k = 1 + 0.22 * (1 - q) * Math.cos(q * Math.PI * 1.5); }
      this.stone(x, c, i, k);
    }
    if (last != null && !p.winner) {   // the last move: a small red mark
      const [cx, cy] = this.xy(last);
      x.fillStyle = '#e2483d'; x.beginPath(); x.arc(cx, cy, this.cell * 0.1, 0, 7); x.fill();
    }
    if (this.hintAt >= 0 && t < this.hintUntil && !p.b[this.hintAt]) {
      const [cx, cy] = this.xy(this.hintAt), R = this.cell * (0.5 + 0.08 * Math.sin(t / 150));
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(255,240,120,.9)'); g.addColorStop(1, 'rgba(255,220,60,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
      this.stone(x, p.turn, this.hintAt, 1, 0.55 + 0.2 * Math.sin(t / 150));
    }
    if (this.ghost >= 0 && !p.b[this.ghost] && this.enabled) this.stone(x, p.turn, this.ghost, 1, 0.5);
    // the five in a row: a golden line drawn across them
    if (p.winner && p.winner < 3 && p.line) {
      const q = Math.min(1, (t - this.winT) / 600), a = this.xy(p.line[0]), z = this.xy(p.line[p.line.length - 1]);
      const ex = a[0] + (z[0] - a[0]) * q, ey = a[1] + (z[1] - a[1]) * q;
      x.save(); x.lineCap = 'round';
      x.strokeStyle = 'rgba(255,214,70,.45)'; x.lineWidth = this.cell * 0.42; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(ex, ey); x.stroke();
      x.strokeStyle = '#ffd23a'; x.lineWidth = this.cell * 0.14; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(ex, ey); x.stroke();
      x.restore();
      p.line.forEach((i, k) => { if (k / (p.line.length - 1) <= q) { const [cx, cy] = this.xy(i); x.strokeStyle = '#fff3a6'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, this.cell * 0.47, 0, 7); x.stroke(); } });
    }
  },
};

// a little confetti for a win
const Fx = {
  cv: null, x: null, bits: [],
  init(cv) { this.cv = cv; this.x = cv.getContext('2d'); const loop = () => { this.draw(); requestAnimationFrame(loop); }; requestAnimationFrame(loop); },
  confetti(n = 90) {
    const W = innerWidth;
    for (let k = 0; k < n; k++) this.bits.push({ x: Math.random() * W, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: pick(['#ee8a3c', '#f2c443', '#79b956', '#5c9ddc', '#ef8fa8', '#a385d8']), life: 0 });
  },
  draw() {
    const cv = this.cv, x = this.x, d = Math.min(devicePixelRatio || 1, 2);
    if (cv.width !== Math.round(innerWidth * d)) { cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d); cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
    if (!this.bits.length) { if (this.dirty) { x.clearRect(0, 0, cv.width, cv.height); this.dirty = false; } return; }
    this.dirty = true;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.setTransform(d, 0, 0, d, 0, 0);
    this.bits = this.bits.filter(b => b.y < innerHeight + 30);
    for (const b of this.bits) {
      b.x += b.vx; b.y += b.vy; b.vy += 0.03; b.r += b.vr;
      x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c; x.fillRect(-5, -3, 10, 6); x.restore();
    }
  },
};
