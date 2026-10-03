/* =====================================================================
   造物 · life — trees that grow by recursion (一生二，二生三), flowers,
   petals, sparks, birds (boids) and fireflies.
   ===================================================================== */

/* ---------- sprites, painted once ---------- */
const Sprites = (() => {
  const S = 64, cache = {};
  function make(fn) { const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.translate(S / 2, S / 2); fn(x); return c; }
  function blossom(petal, center) {
    return make(x => {
      for (let i = 0; i < 5; i++) {
        x.save(); x.rotate((i / 5) * TAU);
        const g = x.createRadialGradient(0, -11, 1, 0, -11, 13);
        g.addColorStop(0, '#fff'); g.addColorStop(0.35, petal); g.addColorStop(1, petal);
        x.fillStyle = g; x.beginPath(); x.ellipse(0, -12, 9, 13, 0, 0, TAU); x.fill();
        x.restore();
      }
      x.fillStyle = center; x.beginPath(); x.arc(0, 0, 5, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,240,180,.9)'; for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; x.beginPath(); x.arc(Math.cos(a) * 7, Math.sin(a) * 7, 1.4, 0, TAU); x.fill(); }
    });
  }
  function cluster(cols, n = 9, rr = 9) {
    return make(x => {
      const r = mulberry32(cols.length * 97 + n);
      for (let i = 0; i < n; i++) {
        const a = r() * TAU, d = r() * 15, cx = Math.cos(a) * d, cy = Math.sin(a) * d * 0.8;
        const c = cols[Math.floor(r() * cols.length)];
        const g = x.createRadialGradient(cx - 3, cy - 4, 1, cx, cy, rr + 4);
        g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(0.25, c); g.addColorStop(1, c);
        x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rr + r() * 5, 0, TAU); x.fill();
      }
    });
  }
  function ginkgo() {
    return make(x => {
      const r = mulberry32(7);
      for (let i = 0; i < 10; i++) {
        const a = r() * TAU, d = r() * 16; x.save(); x.translate(Math.cos(a) * d, Math.sin(a) * d * 0.8); x.rotate(r() * TAU);
        x.fillStyle = ['#f2c230', '#f7d54a', '#e8a71e', '#fbe27a'][i % 4];
        x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 11, -2.3, -0.84); x.closePath(); x.fill(); x.restore();
      }
    });
  }
  function pinePad() {
    return make(x => {
      x.scale(1, 0.42);
      const g = x.createRadialGradient(-4, -10, 2, 0, 0, 30);
      g.addColorStop(0, '#5f8f5a'); g.addColorStop(0.6, '#2f5c3e'); g.addColorStop(1, '#244a33');
      x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, 30, 26, 0, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(160,210,150,.45)'; x.lineWidth = 2;
      for (let i = -24; i <= 24; i += 5) { x.beginPath(); x.moveTo(i, -14); x.lineTo(i * 1.15, 4); x.stroke(); }
    });
  }
  function flower(petal) {
    return make(x => {
      for (let i = 0; i < 5; i++) { x.save(); x.rotate((i / 5) * TAU + 0.3); x.fillStyle = petal; x.beginPath(); x.ellipse(0, -13, 9, 13, 0, 0, TAU); x.fill(); x.restore(); }
      x.fillStyle = '#ffcf3f'; x.beginPath(); x.arc(0, 0, 6, 0, TAU); x.fill();
    });
  }
  function glow(col) {
    return make(x => {
      const g = x.createRadialGradient(0, 0, 0, 0, 0, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.12, col); g.addColorStop(0.4, col.replace(/[\d.]+\)$/, '0.25)')); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
      x.fillStyle = g; x.fillRect(-32, -32, 64, 64);
    });
  }
  function build() {
    cache.peach = [blossom('#ffb3c8', '#e2557f'), blossom('#ffd6e2', '#e4688c'), blossom('#ff9dbb', '#c93c6a')];
    cache.maple = [cluster(['#d9452b', '#e8642c', '#c2302a', '#f08a3c']), cluster(['#f0913a', '#e0582a', '#f6b04a']), cluster(['#b8262a', '#d9452b', '#e8642c'])];
    cache.willow = [cluster(['#8fcf6a', '#a8dc7a', '#6fb35a'], 7, 6)];
    cache.ginkgo = [ginkgo()];
    cache.pine = [pinePad()];
    cache.flower = ['#ff8fb1', '#ffd166', '#c3a6ff', '#ffffff', '#ff9b71', '#8fd3ff', '#ff6f91'].map(flower);
    cache.fly = glow('rgba(214,255,120,0.9)');
    cache.spark = glow('rgba(255,236,170,0.9)');
    cache.soul = glow('rgba(180,220,255,0.9)');
  }
  build();
  return { get: k => cache[k], S };
})();

/* ---------- trees ---------- */
const TREE_TYPES = {
  peach: { name: '桃', depth: 7, trunk: 0.098, lf: [0.7, 0.84], spread: 0.46, jitter: 0.42, three: 0.3, w: 0.017, bark: '#4b3431', leaf: 'peach', deco: [2, 3], size: 0.022, petal: ['#ffc2d4', '#ffdbe6', '#ff9dbb'] },
  maple: { name: '枫', depth: 7, trunk: 0.096, lf: [0.7, 0.8], spread: 0.5, jitter: 0.3, three: 0.25, w: 0.017, bark: '#47332a', leaf: 'maple', deco: [1, 2], size: 0.034, petal: ['#d9452b', '#f0913a', '#c2302a'] },
  willow: { name: '柳', depth: 6, trunk: 0.088, lf: [0.72, 0.84], spread: 0.5, jitter: 0.24, three: 0.35, w: 0.02, bark: '#4f4a3a', leaf: 'willow', deco: [0, 0], size: 0.016, petal: ['#a8dc7a'] },
  ginkgo: { name: '银杏', depth: 7, trunk: 0.11, lf: [0.68, 0.8], spread: 0.36, jitter: 0.24, three: 0.2, w: 0.018, bark: '#5a4636', leaf: 'ginkgo', deco: [1, 2], size: 0.032, petal: ['#f2c230', '#f7d54a'] },
  pine: { name: '松', pine: true, trunk: 0.36, w: 0.022, bark: '#3d3229', leaf: 'pine', size: 0.052, petal: null },
};
const TREE_ORDER = ['peach', 'pine', 'maple', 'willow', 'ginkgo'];
let treeTypeCursor = 0;

class Tree {
  constructor(x, y, type, seed) {
    this.x = x; this.y = y; this.type = type || TREE_ORDER[treeTypeCursor++ % TREE_ORDER.length];
    this.seed = seed || randi(1, 1e9);
    this.P = TREE_TYPES[this.type];
    const gy = groundY(x);
    this.depthT = clamp((y - gy) / Math.max(40, H - gy), 0, 1);
    this.scale = lerp(0.78, 1.22, this.depthT) * (0.85 + mulberry32(this.seed)() * 0.3);
    this.born = world.t; this.growDur = 4.2; this.g = 0; this.pulse = 0; this.fade = 1; this.dying = false;
    this.build();
    this.tips = this.br.filter(b => b.tip);
  }
  build() {
    const R = mulberry32(this.seed), P = this.P, sc = this.scale;
    this.br = [];
    if (P.pine) return this.buildPine(R);
    const rec = (p, a, abs, len, w, d, t0) => {
      const dur = 0.85 + R() * 0.3, i = this.br.length;
      const b = { p, a, len, w, d, t0, t1: t0 + dur, bend: (R() - 0.5) * 0.35, tip: false };
      this.br.push(b);
      if (d >= P.depth || len < 2.5) {
        b.tip = true;
        const nd = P.deco[0] + Math.floor(R() * (P.deco[1] - P.deco[0] + 1));
        b.deco = [];
        for (let k = 0; k < nd; k++) b.deco.push({ dx: (R() - 0.5) * 1.2, dy: (R() - 0.5) * 1.2, s: 0.7 + R() * 0.6, v: Math.floor(R() * 3), r: R() * TAU });
        if (P.leaf === 'willow') b.strands = [0, 1, 2].slice(0, 2 + (R() < 0.5 ? 1 : 0)).map(() => ({ l: (0.08 + R() * 0.12) * U * sc, ph: R() * TAU, off: (R() - 0.5) * 6 }));
        return;
      }
      const n = 2 + (R() < P.three && d < P.depth - 1 ? 1 : 0);
      const dominant = R() < 0.55;
      for (let k = 0; k < n; k++) {
        let ca, cl = lerp(P.lf[0], P.lf[1], R());
        if (n === 2) {
          const side = k ? 1 : -1;
          if (dominant && k === 0) { ca = side * P.spread * (0.15 + R() * 0.3); cl *= 1.08; }
          else ca = side * P.spread * (0.65 + R() * 0.7);
        } else ca = (k - 1) * P.spread * (0.95 + R() * 0.4);
        ca += (R() - 0.5) * P.jitter;
        let nabs = abs + ca;
        // gentle phototropism: branches lean back toward the sky
        if (P.leaf !== 'willow') { ca -= nabs * 0.18; nabs = abs + ca; }
        if (Math.abs(nabs) > 1.75) { ca -= (nabs - Math.sign(nabs) * 1.75); nabs = abs + ca; }
        rec(i, ca, nabs, len * cl, w * 0.7, d + 1, b.t1 - 0.12);
      }
    };
    const L0 = P.trunk * U * sc;
    rec(-1, (R() - 0.5) * 0.12, 0, L0, P.w * U * sc, 0, 0);
    this.norm();
  }
  buildPine(R) {
    const P = this.P, sc = this.scale, H0 = P.trunk * U * sc, segs = 8;
    let parent = -1, abs = 0, t = 0;
    const segLen = H0 / segs;
    for (let s = 0; s < segs; s++) {
      const a = (R() - 0.5) * 0.16 - abs * 0.3; abs += a;
      const i = this.br.length;
      this.br.push({ p: parent, a, len: segLen * (1 - s * 0.03), w: P.w * U * sc * (1 - s / segs * 0.75), d: 0, t0: t, t1: t + 0.8, bend: 0, tip: s === segs - 1, deco: s === segs - 1 ? [{ dx: 0, dy: 0, s: 0.8, v: 0, r: 0 }] : null });
      if (s >= 2) {
        const sides = s % 2 ? [1] : [-1]; if (R() < 0.35) sides.push(-sides[0]);
        for (const side of sides) {
          const sa = side * (1.15 + R() * 0.35) - abs, sl = H0 * (0.42 - s * 0.035) * (0.8 + R() * 0.4);
          const j = this.br.length;
          this.br.push({ p: i, a: sa, len: sl * 0.6, w: P.w * U * sc * 0.35, d: 1, t0: t + 0.4, t1: t + 1.3, bend: (R() - 0.5) * 0.4, tip: false });
          const k2 = 1 + (R() < 0.6 ? 1 : 0);
          for (let q = 0; q < k2; q++) {
            const ca = (q ? -0.35 : 0.22) * side + (R() - 0.5) * 0.25;
            this.br.push({ p: j, a: ca, len: sl * 0.45, w: P.w * U * sc * 0.2, d: 2, t0: t + 1.2, t1: t + 1.9, bend: 0, tip: true, deco: [{ dx: 0, dy: -0.2, s: 0.85 + R() * 0.4, v: 0, r: 0 }] });
          }
        }
      }
      parent = i; t += 0.55;
    }
    this.P.depth = 2;
    this.norm();
  }
  norm() { const T = Math.max(...this.br.map(b => b.t1)); this.br.forEach((b, i) => { b.t0 /= T; b.t1 /= T; b.i = i; }); this.n = this.br.length; this.ex = new Float32Array(this.n); this.ey = new Float32Array(this.n); this.ea = new Float32Array(this.n); this.ef = new Float32Array(this.n); }

  update(dt) {
    this.g = clamp((world.t - this.born) / this.growDur, 0, 1.2);   // runs a little past 1 so the last blossoms finish popping
    this.pulse = Math.max(0, this.pulse - dt * 1.6);
    if (this.dying) { this.fade -= dt * 0.5; }
    // the whole crown leans with the wind (a skew about the root); a shake wobbles it fast
    this.shakeT = Math.max(0, (this.shakeT || 0) - dt * 1.4);
    this.sw = Math.sin(world.t * 1.3 + this.seed * 0.001) * (0.012 + world.wind * 0.02) + world.gust * 0.07 + Math.sin(world.t * 2.7 + this.seed) * Math.abs(world.gust) * 0.02
      + Math.sin(world.t * 26) * this.shakeT * this.shakeT * 0.09;
    // shed petals
    if (this.P.petal && this.g > 0.95 && Math.random() < dt * (0.25 + Math.abs(world.gust) * 6 + this.pulse * 0.8)) {
      const tip = pick(this.tips);
      if (tip) { const [x, y] = this.worldPos(tip.i); Petals.add(x, y, pick(this.P.petal), this.type === 'maple' || this.type === 'ginkgo' ? 1.5 : 1); }
    }
  }
  // is (x, y) on this tree's crown or trunk?
  hit(x, y) {
    if (this.g < 0.35 || this.dying) return false;
    let x0, y0, w, h;
    if (this.cbox) [x0, y0, w, h] = this.cbox;
    else { x0 = 0; y0 = 0; let x1 = 0; for (let i = 0; i < this.n; i++) { x0 = Math.min(x0, this.ex[i]); x1 = Math.max(x1, this.ex[i]); y0 = Math.min(y0, this.ey[i]); } w = x1 - x0; }
    const ly = y - this.y, lx = x - this.x + (this.sw || 0) * ly;
    const pad = U * 0.015;
    if (ly > -U * 0.02 || ly < y0 - pad) return false;
    // the trunk is narrow; the crown is wide
    const crownTop = y0, crownBottom = y0 + (-y0) * 0.7;
    if (ly < crownBottom) return lx > x0 - pad && lx < x0 + w + pad;
    return Math.abs(lx) < Math.max(U * 0.03, this.P.w * U * this.scale * 1.5);
  }
  shake(forFood) {
    this.shakeT = 1;
    Snd.rustle(this.x);
    const inst = Snd.INSTRUMENT[this.type], base = clamp(Math.round(this.x / W * 6), 0, 6);
    [0, 2, 4, 5].forEach((d, i) => setTimeout(() => Snd.play(inst, base + d, this.x, 0.14), i * 110));
    if (this.P.petal && this.g >= 1) for (let k = 0; k < 10; k++) { const tip = pick(this.tips); const [px, py] = this.worldPos(tip.i); Petals.add(px, py, pick(this.P.petal), 1.2); }
    if (this.g >= 1 && (!world.fruits || world.fruits.length < 12)) {
      const n = forFood ? 1 + (Math.random() < 0.5 ? 1 : 0) : randi(1, 2);
      for (let k = 0; k < n; k++) {
        const tip = pick(this.tips); const [px, py] = this.worldPos(tip.i);
        setTimeout(() => Fruits.drop(clamp(px, 16, W - 16), py, this.type), 120 + k * 220);
      }
    }
    Story.event('shake', this);
  }
  worldPos(i) { const ly = this.ey[i]; return [this.x + this.ex[i] - this.sw * ly, this.y + ly]; }

  layout() { // positions relative to the root, no wind (wind is applied as a skew)
    for (let i = 0; i < this.n; i++) {
      const b = this.br[i];
      const f = clamp((this.g - b.t0) / (b.t1 - b.t0), 0, 1);
      this.ef[i] = f;
      let sx = 0, sy = 0, pa = 0;
      if (b.p >= 0) { sx = this.ex[b.p]; sy = this.ey[b.p]; pa = this.ea[b.p]; }
      const a = pa + b.a, L = b.len * easeOutCubic(f);
      this.ea[i] = a; this.ex[i] = sx + Math.sin(a) * L; this.ey[i] = sy - Math.cos(a) * L;
    }
  }

  paint(c) { // draw in root-relative coordinates
    const P = this.P;
    c.strokeStyle = P.bark; c.lineCap = 'round'; c.lineJoin = 'round';
    const maxD = P.pine ? 2 : P.depth;
    for (let d = 0; d <= maxD; d++) {
      let any = false, wsum = 0, wn = 0; c.beginPath();
      for (let i = 0; i < this.n; i++) {
        const b = this.br[i]; if (b.d !== d || this.ef[i] <= 0) continue;
        const sx = b.p < 0 ? 0 : this.ex[b.p], sy = b.p < 0 ? 0 : this.ey[b.p], ex = this.ex[i], ey = this.ey[i];
        const mx = (sx + ex) / 2 + (ey - sy) * b.bend * 0.5, my = (sy + ey) / 2 - (ex - sx) * b.bend * 0.5;
        c.moveTo(sx, sy); c.quadraticCurveTo(mx, my, ex, ey); any = true; wsum += b.w; wn++;
      }
      if (any) { c.lineWidth = Math.max(0.8, wsum / wn); c.stroke(); }
    }
    if (P.pine) { // taper the pine trunk with a second, thinner pass
      c.lineWidth = Math.max(1, P.w * U * this.scale * 0.55); c.beginPath();
      for (let i = 0; i < this.n; i++) { const b = this.br[i]; if (b.d || this.ef[i] <= 0) continue; const sx = b.p < 0 ? 0 : this.ex[b.p], sy = b.p < 0 ? 0 : this.ey[b.p]; c.moveTo(sx, sy); c.lineTo(this.ex[i], this.ey[i]); }
      c.stroke();
    }
    if (P.leaf === 'willow') {
      c.strokeStyle = '#7fbf5c'; c.lineWidth = Math.max(1, U * 0.0022); c.beginPath();
      for (const b of this.tips) {
        const i = b.i; if (this.ef[i] < 1) continue;
        const grow = clamp((this.g - b.t1) / 0.25, 0, 1);
        for (const st of b.strands) {
          const x0 = this.ex[i] + st.off, y0 = this.ey[i], L = st.l * easeOutCubic(grow), sw = Math.sin(st.ph) * L * 0.1;
          c.moveTo(x0, y0); c.quadraticCurveTo(x0 + sw * 0.2, y0 + L * 0.55, x0 + sw, y0 + L);
        }
      }
      c.stroke();
    }
    const spr = Sprites.get(P.leaf), base = P.size * U * this.scale;
    for (const b of this.tips) {
      const i = b.i; if (this.ef[i] < 1 || !b.deco) continue;
      const pop = easeOutBack((this.g - b.t1) / 0.12 + 0.02); if (pop <= 0) continue;
      for (const d of b.deco) {
        const sz = base * d.s * pop * (P.pine ? 2 - Math.min(0.8, -this.ey[i] / (U * 0.5 * this.scale)) : 1), x = this.ex[i] + d.dx * base, y = this.ey[i] + d.dy * base;
        c.drawImage(spr[d.v % spr.length], x - sz / 2, y - sz / 2, sz, sz);
      }
    }
  }

  renderCache() {
    this.layout();
    const pad = this.P.size * U * this.scale * 2.2 + 4;
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (let i = 0; i < this.n; i++) { x0 = Math.min(x0, this.ex[i]); x1 = Math.max(x1, this.ex[i]); y0 = Math.min(y0, this.ey[i]); y1 = Math.max(y1, this.ey[i]); }
    x0 -= pad; x1 += pad; y0 -= pad; y1 += pad + (this.P.leaf === 'willow' ? U * 0.22 * this.scale : 0);
    const w = Math.ceil(x1 - x0), h = Math.ceil(y1 - y0);
    const cv = this.cache || document.createElement('canvas'); cv.width = Math.ceil(w * DPR); cv.height = Math.ceil(h * DPR);
    const c = cv.getContext('2d'); c.setTransform(DPR, 0, 0, DPR, -x0 * DPR, -y0 * DPR);
    this.paint(c);
    this.cache = cv; this.cbox = [x0, y0, w, h]; this.cacheKey = U + ':' + DPR;
  }

  draw(c) {
    if (this.g <= 0) return;
    c.save(); c.globalAlpha = clamp(this.fade, 0, 1);
    const shw = U * 0.07 * this.scale * Math.min(1, this.g);
    c.fillStyle = 'rgba(30,60,40,.22)'; c.beginPath(); c.ellipse(this.x, this.y + 2, shw, shw * 0.18, 0, 0, TAU); c.fill();
    c.translate(this.x, this.y); c.transform(1, 0, -this.sw, 1, 0, 0);
    if (this.g >= 1.2) {
      if (!this.cache || this.cacheKey !== U + ':' + DPR) this.renderCache();
      const [x0, y0, w, h] = this.cbox;
      c.drawImage(this.cache, x0, y0, w, h);
      if (this.pulse > 0.02) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = this.pulse * 0.22 * clamp(this.fade, 0, 1); c.drawImage(this.cache, x0, y0, w, h); }
    } else { this.layout(); this.paint(c); }
    c.restore();
  }
}

/* ---------- flowers ---------- */
const Flowers = {
  add(x, y) {
    if (world.flowers.length > 160) world.flowers.shift();
    const gy = groundY(x); y = Math.max(y, gy + 1);
    world.flowers.push({ x, y, v: randi(0, 6), born: world.t, h: rand(0.018, 0.04) * U * lerp(0.8, 1.2, clamp((y - gy) / (H - gy), 0, 1)), s: rand(0.022, 0.032) * U, ph: rand(TAU), lean: rand(-0.3, 0.3) });
    world.flowers.sort((a, b) => a.y - b.y);
  },
  draw(c, f) {
    const age = world.t - f.born, g = easeOutBack(age / 0.9);
    if (g <= 0) return;
    const sw = Math.sin(world.t * 1.8 + f.ph) * 2 + world.gust * 10 + world.wind * 2;
    const tx = f.x + f.lean * f.h + sw * 0.6, ty = f.y - f.h * clamp(age / 0.6, 0, 1);
    c.strokeStyle = '#4f8a4a'; c.lineWidth = Math.max(1, U * 0.0022); c.beginPath(); c.moveTo(f.x, f.y); c.quadraticCurveTo(f.x, (f.y + ty) / 2, tx, ty); c.stroke();
    const s = f.s * g, img = Sprites.get('flower')[f.v];
    c.drawImage(img, tx - s / 2, ty - s / 2, s, s);
  },
};

/* ---------- petals ---------- */
const Petals = {
  add(x, y, col, size = 1) {
    if (world.petals.length > 240) world.petals.shift();
    world.petals.push({ x, y, vx: rand(-10, 10), vy: rand(-6, 6), r: rand(TAU), vr: rand(-3, 3), s: rand(2.2, 3.6) * size * U / 700, col, age: 0, ph: rand(TAU), rest: 0 });
  },
  update(dt) {
    const P = world.petals;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.age += dt;
      const gy = groundY(p.x) + 6;
      if (p.y < gy) {
        p.vx += ((world.gust * 260 + world.wind * 30) - p.vx) * dt * 1.2 + Math.sin(world.t * 2 + p.ph) * 12 * dt;
        p.vy += (30 - p.vy) * dt * 1.5;
        p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      } else { p.rest += dt; }
      if (p.rest > 6 || p.x < -40 || p.x > W + 40) P.splice(i, 1);
    }
  },
  draw(c) {
    for (const p of world.petals) {
      c.globalAlpha = clamp(1 - p.rest / 6, 0, 1);
      c.fillStyle = p.col; c.beginPath(); c.ellipse(p.x, p.y, p.s * 1.4, p.s * 0.8 * Math.abs(Math.sin(p.r)) + 0.5, p.r, 0, TAU); c.fill();
    }
    c.globalAlpha = 1;
  },
};

/* ---------- sparks & little floating signs ---------- */
const Sparks = {
  burst(x, y, n = 16, opts = {}) {
    for (let i = 0; i < n; i++) {
      const a = opts.up ? rand(-Math.PI * 0.95, -Math.PI * 0.05) : rand(TAU), sp = rand(0.3, 1) * (opts.speed || U * 0.35);
      world.sparks.push({ kind: opts.kind || 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: opts.g ?? U * 0.25, age: 0, life: rand(0.6, 1.2) * (opts.life || 1), s: rand(0.6, 1.3) * (opts.size || U * 0.022), col: opts.col });
    }
  },
  sign(x, y, text, col = '#fff', size = 1) {
    world.sparks.push({ kind: 'text', x, y, vx: rand(-8, 8), vy: -U * 0.06, g: 0, age: 0, life: 1.8, s: size, text, col });
  },
  update(dt) {
    const S = world.sparks;
    for (let i = S.length - 1; i >= 0; i--) {
      const p = S[i]; p.age += dt;
      p.vy += p.g * dt; p.vx *= 1 - dt * 1.5; p.vy *= 1 - dt * (p.kind === 'text' ? 0.5 : 1.5);
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === 'dust') { const gy = groundY(p.x); if (p.y > gy + 4) { p.y = gy + 4; p.vy *= -0.2; } }
      if (p.age > p.life) S.splice(i, 1);
    }
    if (S.length > 600) S.splice(0, S.length - 600);
  },
  draw(c, mode) {           // mode: 'fg' (dust, tinted) · 'glow' (additive sparks) · 'text'
    for (const p of world.sparks) {
      const k = 1 - p.age / p.life;
      if (p.kind === 'spark' && mode === 'glow') {
        const s = p.s * (0.4 + k), img = Sprites.get('spark');
        c.globalAlpha = k; c.drawImage(img, p.x - s, p.y - s, s * 2, s * 2);
      } else if (p.kind === 'dust' && mode === 'fg') {
        c.globalAlpha = k * 0.5; c.fillStyle = '#e8f0d0'; c.beginPath(); c.arc(p.x, p.y, p.s * 0.4 * (1.5 - k), 0, TAU); c.fill();
      } else if (p.kind === 'text' && mode === 'text') {
        c.globalAlpha = Math.min(1, k * 2);
        c.font = `600 ${Math.round(U * 0.03 * p.s)}px ${SERIF}`;
        c.fillStyle = p.col; c.textAlign = 'center'; c.fillText(p.text, p.x, p.y);
      }
    }
    c.globalAlpha = 1;
  },
};

/* ---------- birds: boids (separation, alignment, cohesion) ---------- */
const Birds = {
  spawn(n) {
    const side = Math.random() < 0.5 ? -1 : 1, y0 = rand(H * 0.12, Math.max(H * 0.14, GROUND - U * 0.45));
    for (let i = 0; i < n; i++) world.birds.push({ x: side < 0 ? -rand(20, 160) : W + rand(20, 160), y: y0 + rand(-60, 60), vx: -side * U * 0.16, vy: rand(-10, 10), ph: rand(TAU), s: rand(0.8, 1.2) });
  },
  update(dt) {
    const B = world.birds, n = B.length; if (!n) return;
    const sep = U * 0.045, nb = U * 0.14, maxS = U * 0.24, minS = U * 0.11, top = H * 0.08, bot = Math.max(H * 0.2, GROUND - U * 0.38);
    const night = world.sky.night, ptr = world.pointer;
    for (let i = 0; i < n; i++) {
      const b = B[i]; let ax = 0, ay = 0, cx = 0, cy = 0, vx = 0, vy = 0, cn = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue; const o = B[j], dx = o.x - b.x, dy = o.y - b.y, d = Math.abs(dx) + Math.abs(dy);
        if (d < nb) { cx += o.x; cy += o.y; vx += o.vx; vy += o.vy; cn++; if (d < sep) { ax -= dx / (d + 1) * U * 0.9; ay -= dy / (d + 1) * U * 0.9; } }
      }
      if (cn) { ax += (cx / cn - b.x) * 0.5 + (vx / cn - b.vx) * 0.9; ay += (cy / cn - b.y) * 0.5 + (vy / cn - b.vy) * 0.9; }
      if (night < 0.65) {
        if (b.x < W * 0.06) ax += U * 0.6; if (b.x > W * 0.94) ax -= U * 0.6;
        if (b.y < top) ay += U * 0.6; if (b.y > bot) ay -= U * 0.8;
      } else { ay -= U * 0.3; ax += Math.sign(b.vx || 1) * U * 0.2; }      // fly home at night
      const wn = noise2(b.x * 0.004, world.t * 0.2 + i * 0.05); ay += wn * U * 0.3;
      ax += world.gust * U * 1.2;
      if (ptr.active) { const dx = b.x - ptr.x, dy = b.y - ptr.y, d = hypot(dx, dy); if (d < U * 0.16) { ax += dx / d * U * 3; ay += dy / d * U * 3; } }
      b.vx += ax * dt; b.vy += ay * dt;
      const sp = hypot(b.vx, b.vy), cl = clamp(sp, minS, maxS); b.vx *= cl / (sp || 1); b.vy *= cl / (sp || 1);
      b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * (9 + sp / U * 10);
    }
    if (night > 0.65) for (let i = B.length - 1; i >= 0; i--) { const b = B[i]; if (b.y < -60 || b.x < -100 || b.x > W + 100) B.splice(i, 1); }
    if (Math.random() < dt * 0.35 && n) { const b = pick(B); if (b.x > 0 && b.x < W) Snd.chirp(b.x); }
  },
  draw(c) {
    const B = world.birds; if (!B.length) return;
    const col = mix(hex('#2a2f3a'), world.sky.tint, world.sky.tintA * 0.5);
    c.strokeStyle = rgba(col, 0.85); c.lineWidth = Math.max(1.2, U * 0.0028); c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath();
    for (const b of B) {
      const s = U * 0.014 * b.s, f = Math.sin(b.ph), dir = Math.sign(b.vx) || 1, tilt = clamp(b.vy / (Math.abs(b.vx) + 1), -0.5, 0.5) * s;
      c.moveTo(b.x - s * 1.1, b.y - f * s * 0.9 - tilt * dir * -1);
      c.quadraticCurveTo(b.x - s * 0.45, b.y - f * s * 0.2 - s * 0.35, b.x, b.y);
      c.quadraticCurveTo(b.x + s * 0.45, b.y - f * s * 0.2 - s * 0.35, b.x + s * 1.1, b.y - f * s * 0.9 + tilt * dir);
    }
    c.stroke();
  },
};

/* ---------- fireflies ---------- */
const Flies = {
  update(dt) {
    const night = world.sky.night, F = world.flies;
    const want = world.phase === 'world' ? Math.round(clamp(6 + world.trees.length * 5 + world.flowers.length * 0.12, 0, 70) * smooth(0.45, 0.9, night)) : 0;
    if (F.length < want && Math.random() < dt * 8) {
      let x, y;
      if (world.trees.length && Math.random() < 0.7) { const t = pick(world.trees); x = t.x + rand(-1, 1) * U * 0.14 * t.scale; y = t.y - rand(0.02, 0.3) * U * t.scale; }
      else { x = rand(W); y = groundY(x) - rand(0.01, 0.12) * U; }
      F.push({ x, y, ph: rand(TAU), sp: rand(0.6, 1.4), age: 0, life: rand(8, 20), seed: rand(100) });
    }
    for (let i = F.length - 1; i >= 0; i--) {
      const f = F[i]; f.age += dt;
      const a = noise2(f.seed, world.t * 0.25 * f.sp) * TAU;
      f.x += Math.cos(a) * U * 0.03 * dt + world.gust * U * 0.4 * dt; f.y += Math.sin(a) * U * 0.02 * dt;
      const gy = groundY(f.x); if (f.y > gy - 4) f.y = gy - 4;
      if (f.age > f.life || (F.length > want + 2 && Math.random() < dt)) { f.age = Math.max(f.age, f.life - 1); }
      if (f.age > f.life + 1) F.splice(i, 1);
    }
  },
  draw(c) {
    const img = Sprites.get('fly');
    for (const f of world.flies) {
      const life = Math.min(1, f.age, f.life + 1 - f.age);
      const pulse = Math.pow(0.5 + 0.5 * Math.sin(world.t * 2.4 * f.sp + f.ph), 2);
      const s = U * 0.022 * (0.6 + pulse * 0.6);
      c.globalAlpha = clamp(life, 0, 1) * (0.25 + pulse * 0.75);
      c.drawImage(img, f.x - s, f.y - s, s * 2, s * 2);
    }
    c.globalAlpha = 1;
  },
};
