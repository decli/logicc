// 动物消消乐 · the flashy part: bursts of shards and stars, light beams, lightning, shock rings, the big English cheer,
// pieces flying to the goal panel, confetti, screen shake. Drawn on its own canvas above everything (#fx).
const Fx = {
  cv: null, ctx: null, dpr: 1, W: 0, H: 0, parts: [], items: [], dots: {}, stars: {},
  shakeA: 0, shakeT: 0, shakeD: 1, flashA: 0, flashC: '#fff',
  init(cv) { this.cv = cv; this.ctx = cv.getContext('2d'); },
  resize(W, H, dpr) {
    this.W = W; this.H = H; this.dpr = dpr;
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    this.cv.style.width = W + 'px'; this.cv.style.height = H + 'px';
  },
  dot(color) {
    if (this.dots[color]) return this.dots[color];
    const c = Art.canvas(64, 64), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.25, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return (this.dots[color] = c);
  },
  star(color) {
    if (this.stars[color]) return this.stars[color];
    const c = Art.canvas(48, 48), x = c.getContext('2d');
    x.translate(24, 24); x.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 9 : 21; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    x.closePath(); x.fillStyle = color; x.fill(); x.lineWidth = 3; x.strokeStyle = '#fff'; x.stroke();
    return (this.stars[color] = c);
  },
  drawStar(ctx, x, y, r, color) {   // a four-point twinkle
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  },

  part(o) { if (this.parts.length < 900) this.parts.push(Object.assign({ t: 0, g: 0, rot: 0, vr: 0, s1: 0, a: 1, drag: 0.985 }, o)); },
  // a piece bursting: shards of its colour, glowing dots and a few stars
  burst(x, y, cols, n, power, cell) {
    const P = power || 1, c = cell || 60;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.12 + Math.random() * 0.32) * P * c / 60;
      this.part({ kind: 'shard', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.12, g: 0.0009, life: 500 + Math.random() * 400, size: c * (0.07 + Math.random() * 0.08), color: cols[i % 2], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.03 });
    }
    for (let i = 0; i < Math.ceil(n / 2); i++) {
      const a = Math.random() * Math.PI * 2, v = (0.05 + Math.random() * 0.2) * P * c / 60;
      this.part({ kind: 'img', img: this.dot(cols[0]), add: true, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 380 + Math.random() * 300, size: c * (0.35 + Math.random() * 0.3), s1: c * 0.05 });
    }
    for (let i = 0; i < 2 + Math.floor(P); i++) {
      const a = Math.random() * Math.PI * 2, v = (0.1 + Math.random() * 0.2) * c / 60;
      this.part({ kind: 'img', img: this.star(pick(['#ffd23a', '#ffffff', cols[0]])), x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.1, g: 0.0006, life: 700 + Math.random() * 300, size: c * (0.22 + Math.random() * 0.15), s1: c * 0.05, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.02 });
    }
  },
  sparkles(x, y, n, spread, color) {
    for (let i = 0; i < n; i++) this.part({ kind: 'twinkle', x: x + rnd(-spread, spread), y: y + rnd(-spread, spread), vx: 0, vy: -0.02, life: 400 + Math.random() * 500, size: rnd(5, 12), color: color || '#fff', delay: Math.random() * 300 });
  },
  ring(x, y, color, r0, r1, dur, lw) {
    this.items.push({ t: 0, dur, draw(ctx, k) {
      const e = Ease.out(k);
      ctx.globalAlpha = 1 - k; ctx.lineWidth = (lw || 10) * (1 - k * 0.7); ctx.strokeStyle = color;
      ctx.beginPath(); ctx.arc(x, y, lerp(r0, r1, e), 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
    } });
  },
  // a beam of light along a row or column, out from (x, y) to the board's edges
  beam(x, y, dir, color, rect, wide) {
    const w0 = wide ? 0.62 : 0.5;
    this.items.push({ t: 0, dur: 520, add: true, draw(ctx, k) {
      const grow = Ease.out(Math.min(1, k / 0.45)), fade = k < 0.45 ? 1 : 1 - (k - 0.45) / 0.55;
      const cell = rect.cell, th = cell * w0 * (0.6 + 0.4 * fade);
      ctx.globalAlpha = fade;
      if (dir === 'h') {
        const L = Math.max(x - rect.x, rect.x + rect.w - x) * grow + cell;
        let g = ctx.createLinearGradient(0, y - th, 0, y + th);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, color); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(x - L, y - th, 2 * L, 2 * th);
        ctx.fillStyle = '#fff'; ctx.fillRect(x - L, y - th * 0.18, 2 * L, th * 0.36);
      } else {
        const L = Math.max(y - rect.y, rect.y + rect.h - y) * grow + cell;
        let g = ctx.createLinearGradient(x - th, 0, x + th, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, color); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(x - th, y - L, 2 * th, 2 * L);
        ctx.fillStyle = '#fff'; ctx.fillRect(x - th * 0.18, y - L, th * 0.36, 2 * L);
      }
      ctx.globalAlpha = 1;
    } });
    // sparks running out along the beam
    for (let i = 0; i < 18; i++) {
      const v = rnd(0.4, 1.0) * rect.cell / 60, s = i % 2 ? 1 : -1;
      this.part({ kind: 'img', img: this.dot(color), add: true, x, y, vx: dir === 'h' ? s * v : rnd(-0.05, 0.05), vy: dir === 'v' ? s * v : rnd(-0.05, 0.05), life: 450, size: rect.cell * 0.5, s1: 0, drag: 0.99 });
    }
  },
  // jagged lightning from the rainbow ball to a target; redrawn every few frames so it crackles
  bolt(x1, y1, x2, y2, color, delay) {
    let pts = null, last = -1;
    this.items.push({ t: -(delay || 0), dur: 420, add: true, draw(ctx, k, t) {
      if (t < 0) return;
      const f = Math.floor(t / 50);
      if (f !== last || !pts) {
        last = f; pts = [[x1, y1]];
        const n = 7, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
        for (let i = 1; i < n; i++) { const o = rnd(-1, 1) * len * 0.08; pts.push([x1 + dx * i / n + nx * o, y1 + dy * i / n + ny * o]); }
        pts.push([x2, y2]);
      }
      const reach = Math.min(1, t / 120), m = Math.max(1, Math.round(reach * (pts.length - 1)));
      ctx.globalAlpha = 1 - k * k; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const [w, c] of [[9, color], [3, '#fff']]) {
        ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i <= m; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } });
  },
  // "+60" floating up from where points were made
  text(x, y, str, size, color) {
    this.items.push({ t: 0, dur: 900, word: true, draw(ctx, k) {
      const s = size * (k < 0.15 ? Ease.back(k / 0.15) : 1);
      ctx.globalAlpha = k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1;
      ctx.font = `900 ${s}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = s * 0.22; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round';
      ctx.strokeText(str, x, y - k * size * 1.6); ctx.fillStyle = color || '#ff4f9a'; ctx.fillText(str, x, y - k * size * 1.6);
      ctx.globalAlpha = 1;
    } });
  },
  // the big cheer across the board; an earlier cheer still showing gets out of the way
  praise(word, x, y, width, level) {
    this.hush();
    const size = Math.min(width / (word.length * 0.52), width * 0.17);
    const hues = level >= 5 ? ['#ff4f6d', '#ff9d3a', '#ffd23a', '#5fe07a', '#3ac8ff', '#a77bff'] : level >= 3 ? ['#ffd23a', '#ff9d3a', '#ff4f9a'] : ['#a77bff', '#ff7eb6'];
    this.items.push({ t: 0, dur: 1500, word: true, draw(ctx, k, t) {
      const inK = Math.min(1, t / 420), sc = Ease.elastic(inK) * (k > 0.75 ? 1 + (k - 0.75) * 1.2 : 1);
      ctx.save(); ctx.translate(x, y - (k > 0.75 ? (k - 0.75) * size * 1.5 : 0)); ctx.rotate(-0.06); ctx.scale(sc, sc);
      ctx.globalAlpha = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
      ctx.font = `900 ${size}px "Arial Rounded MT Bold","Trebuchet MS",${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const w = ctx.measureText(word).width, g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      hues.forEach((h, i) => g.addColorStop(i / Math.max(1, hues.length - 1), h));
      ctx.lineJoin = 'round';
      ctx.lineWidth = size * 0.3; ctx.strokeStyle = '#4a2b5e'; ctx.strokeText(word, 0, size * 0.06);
      ctx.lineWidth = size * 0.16; ctx.strokeStyle = '#fff'; ctx.strokeText(word, 0, 0);
      ctx.fillStyle = g; ctx.fillText(word, 0, 0);
      ctx.restore(); ctx.globalAlpha = 1;
    } });
    const n = 8 + level * 5;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = rnd(0.25, 0.6) * width / 600;
      this.part({ kind: 'img', img: this.star(pick(hues)), x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, g: 0.0004, life: 900 + Math.random() * 500, size: rnd(18, 34) * width / 600, s1: 4, rot: Math.random() * 6, vr: rnd(-0.01, 0.01), drag: 0.975 });
    }
    if (level >= 4) this.flash(0.35, '#fff');
  },
  // something flying along an arc (a cleared animal going to its goal, a star going to a piece)
  fly(o) {
    return new Promise(res => {
      const mx = (o.x0 + o.x1) / 2 + (o.bend || 0), my = Math.min(o.y0, o.y1) - (o.lift == null ? 80 : o.lift);
      this.items.push({ t: -(o.delay || 0), dur: o.dur || 600, draw(ctx, k, t) {
        if (t < 0) return;
        const e = Ease.inOut(k), u = 1 - e;
        const x = u * u * o.x0 + 2 * u * e * mx + e * e * o.x1, y = u * u * o.y0 + 2 * u * e * my + e * e * o.y1;
        const s = lerp(o.s0, o.s1, e);
        if (o.trail && Math.random() < 0.6) Fx.part({ kind: 'img', img: Fx.dot(o.trail), add: true, x, y, vx: 0, vy: 0, life: 300, size: s * 0.8, s1: 0 });
        if (o.img) ctx.drawImage(o.img, x - s / 2, y - s / 2, s, s);
        else if (o.draw) o.draw(ctx, x, y, s);
      }, end: () => { if (o.onArrive) o.onArrive(); res(); } });
    });
  },
  confetti(n) {
    const cols = ['#ff4f9a', '#ffd23a', '#5fe0b0', '#7cc8ff', '#a77bff', '#ff9d3a'];
    for (let i = 0; i < n; i++) this.part({ kind: 'conf', x: Math.random() * this.W, y: -20 - Math.random() * this.H * 0.4, vx: rnd(-0.05, 0.05), vy: rnd(0.12, 0.3), g: 0.00012, life: 3200, size: rnd(8, 15), color: pick(cols), rot: Math.random() * 6, vr: rnd(-0.012, 0.012), drag: 0.998, wob: Math.random() * 6 });
  },
  shake(a, dur) { if (a >= this.shakeA * (1 - this.shakeT / this.shakeD)) { this.shakeA = a; this.shakeT = 0; this.shakeD = dur || 300; } },
  shakeOffset() {
    if (this.shakeT >= this.shakeD) return [0, 0];
    const k = 1 - this.shakeT / this.shakeD, a = this.shakeA * k * k;
    return [Math.sin(this.shakeT * 0.09) * a, Math.cos(this.shakeT * 0.13) * a * 0.7];
  },
  flash(a, c) { this.flashA = Math.max(this.flashA, a); this.flashC = c || '#fff'; },
  // fade out the words (cheers, +points) quickly, e.g. when a card opens over the board
  hush() { for (const it of this.items) if (it.word) it.t = Math.max(it.t, it.dur * 0.9); },
  clear() { this.parts = []; this.items.forEach(it => it.end && it.end()); this.items = []; },
  busy() { return this.items.length > 0; },

  update(dt) {
    this.shakeT += dt;
    this.flashA = Math.max(0, this.flashA - dt / 350);
    const ps = this.parts;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.t += dt;
      if (p.t >= p.life) { ps[i] = ps[ps.length - 1]; ps.pop(); continue; }
      p.vy += p.g * dt; p.vx *= Math.pow(p.drag, dt / 16); p.vy *= Math.pow(p.drag, dt / 16);
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i]; it.t += dt;
      if (it.t >= it.dur) { this.items.splice(i, 1); if (it.end) it.end(); }
    }
  },
  draw() {
    const ctx = this.ctx, d = this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    const [sx, sy] = this.shakeOffset();
    ctx.setTransform(d, 0, 0, d, sx * d, sy * d);
    for (const it of this.items) {
      if (it.t < 0) { it.draw(ctx, 0, it.t); continue; }
      if (it.add) ctx.globalCompositeOperation = 'lighter';
      it.draw(ctx, Math.min(1, it.t / it.dur), it.t);
      ctx.globalCompositeOperation = 'source-over';
    }
    for (const p of this.parts) {
      if (p.delay > 0) continue;
      const k = p.t / p.life;
      if (p.kind === 'shard') {
        ctx.globalAlpha = 1 - k * k; ctx.fillStyle = p.color;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66); ctx.restore();
      } else if (p.kind === 'conf') {
        ctx.globalAlpha = k > 0.85 ? (1 - k) / 0.15 : 1; ctx.fillStyle = p.color;
        ctx.save(); ctx.translate(p.x + Math.sin(p.t / 300 + p.wob) * 12, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.t / 140 + p.wob)); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore();
      } else if (p.kind === 'twinkle') {
        const a = Math.sin(k * Math.PI); ctx.globalAlpha = a; this.drawStar(ctx, p.x, p.y, p.size * a, p.color);
      } else {
        const s = lerp(p.size, p.s1, k);
        ctx.globalAlpha = 1 - k * 0.8;
        if (p.add) ctx.globalCompositeOperation = 'lighter';
        if (p.rot) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.drawImage(p.img, -s / 2, -s / 2, s, s); ctx.restore(); }
        else ctx.drawImage(p.img, p.x - s / 2, p.y - s / 2, s, s);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
    if (this.flashA > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = this.flashA; ctx.fillStyle = this.flashC; ctx.fillRect(0, 0, this.cv.width, this.cv.height); ctx.globalAlpha = 1; }
  },
};
const FONT = '"Hiragino Maru Gothic ProN","Yuanti SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif';
