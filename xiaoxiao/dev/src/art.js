// 动物消消乐 · drawing the pieces, the cell layers (ice, gift boxes, bubbles) and the little sprites the effects use.
// Everything that does not move is drawn once into a canvas the size it will appear on screen (re-made on resize).
const Art = {
  img: null, dpr: 1, cell: 0, T: 0, tiles: [], white: [], cache: {},
  // decli's animal heads, one sprite sheet (made by dev/heads.py; HEADS in heads.js gives each head's size)
  load() {
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { this.img = im; res(); };
      im.onerror = () => res();
      im.src = 'heads.webp';
    });
  },
  canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; },
  rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  },
  // FRIENDS[i]'s head drawn into x centred on (cx, cy), scaled so its longer side is fit pixels
  friendTo(x, i, cx, cy, fit) {
    const [w, h] = HEADS.size[i], C = HEADS.cell, f = fit / Math.max(w, h);
    if (!this.img) {   // the picture did not load: a coloured ball
      const b = ANIMALS.find(a => a.id === FRIENDS[i].id), col = b ? b.fx : ['#41618c', '#15243f'];
      x.fillStyle = col[0]; x.strokeStyle = col[1]; x.lineWidth = fit * 0.05;
      x.beginPath(); x.arc(cx, cy, fit * 0.42, 0, 7); x.fill(); x.stroke();
      return;
    }
    const sx = (i % HEADS.cols) * C + (C - w) / 2, sy = Math.floor(i / HEADS.cols) * C + (C - h) / 2;
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(this.img, sx, sy, w, h, cx - w * f / 2, cy - h * f / 2, w * f, h * f);
  },
  friend(i, s, fit) { const c = this.canvas(s, s); this.friendTo(c.getContext('2d'), i, s / 2, s / 2, fit); return c; },
  // the board's kinds (ANIMALS, then the penguin) as FRIENDS numbers
  kindHead(k) { const id = k < ANIMALS.length ? ANIMALS[k].id : 'penguin'; return FRIENDS.findIndex(f => f.id === id); },
  // an animal head (k 0-5, 6 = penguin) into a square canvas of side s, for a cell cellPx wide
  head(k, s, cellPx) { return this.friend(this.kindHead(k), s, cellPx * 0.9); },
  setCell(cell, dpr) {
    if (cell === this.cell && dpr === this.dpr && this.tiles.length) return;
    this.cell = cell; this.dpr = dpr;
    const D = cell * dpr, T = this.T = Math.ceil(D * 1.3);
    this.tiles = []; this.white = [];
    for (let k = 0; k < 7; k++) {
      const t = this.head(k, T, D);
      this.tiles.push(t);
      const w = this.canvas(T, T), x = w.getContext('2d');
      x.drawImage(t, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#fff'; x.fillRect(0, 0, T, T);
      this.white.push(w);
    }
    this.cache = {};
    this.cache.stripeH = this.stripes(T, D, 'h');
    this.cache.stripeV = this.stripes(T, D, 'v');
    this.cache.ring = this.ringTile(T, D);
    this.cache.orb = this.orbTile(T, D);
    this.cache.ice1 = this.iceTile(D, 1); this.cache.ice2 = this.iceTile(D, 2);
    this.cache.box1 = this.boxTile(D, 1); this.cache.box2 = this.boxTile(D, 2);
    this.cache.bub = this.bubbleTile(T, D);
  },
  stripes(T, D, dir) {
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2, r = D * 0.42;
    x.save(); x.beginPath(); x.arc(m, m, r, 0, 7); x.clip();
    x.fillStyle = 'rgba(255,255,255,0.62)';
    for (const o of [-0.26, 0, 0.26]) {
      if (dir === 'h') x.fillRect(m - r, m + o * D - D * 0.05, 2 * r, D * 0.1);
      else x.fillRect(m + o * D - D * 0.05, m - r, D * 0.1, 2 * r);
    }
    x.restore();
    // arrows on both ends
    x.fillStyle = '#fff'; x.strokeStyle = 'rgba(74,43,94,.85)'; x.lineWidth = D * 0.035; x.lineJoin = 'round';
    const tri = (cx, cy, ang) => {
      x.save(); x.translate(cx, cy); x.rotate(ang); x.beginPath(); x.moveTo(D * 0.11, 0); x.lineTo(-D * 0.06, -D * 0.1); x.lineTo(-D * 0.06, D * 0.1); x.closePath(); x.stroke(); x.fill(); x.restore();
    };
    if (dir === 'h') { tri(m + D * 0.5, m, 0); tri(m - D * 0.5, m, Math.PI); }
    else { tri(m, m + D * 0.5, Math.PI / 2); tri(m, m - D * 0.5, -Math.PI / 2); }
    return c;
  },
  ringTile(T, D) {
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2;
    // a golden eight-point star behind the head
    x.save(); x.translate(m, m);
    const g = x.createRadialGradient(0, 0, D * 0.2, 0, 0, D * 0.62);
    g.addColorStop(0, '#fff6b0'); g.addColorStop(0.6, '#ffc61a'); g.addColorStop(1, '#ff9d00');
    x.fillStyle = g; x.strokeStyle = '#c27c00'; x.lineWidth = D * 0.03; x.lineJoin = 'round';
    x.beginPath();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? D * 0.44 : D * 0.6; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    x.closePath(); x.fill(); x.stroke();
    x.restore();
    return c;
  },
  orbTile(T, D) {
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2, r = D * 0.42;
    const hues = ['#ff4f6d', '#ff9d3a', '#ffd23a', '#5fe07a', '#3ac8ff', '#7b6bff', '#e05fff'];
    for (let i = 0; i < 14; i++) {
      x.beginPath(); x.moveTo(m, m); x.arc(m, m, r, i * Math.PI / 7, (i + 1) * Math.PI / 7 + 0.01); x.closePath();
      x.fillStyle = hues[i % 7]; x.fill();
    }
    const g = x.createRadialGradient(m - r * 0.3, m - r * 0.35, r * 0.05, m, m, r);
    g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.35, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.arc(m, m, r, 0, 7); x.fill();
    x.lineWidth = D * 0.045; x.strokeStyle = '#fff'; x.beginPath(); x.arc(m, m, r, 0, 7); x.stroke();
    x.lineWidth = D * 0.02; x.strokeStyle = 'rgba(74,43,94,.6)'; x.beginPath(); x.arc(m, m, r + D * 0.03, 0, 7); x.stroke();
    return c;
  },
  iceTile(D, n) {
    const c = this.canvas(D, D), x = c.getContext('2d'), p = D * 0.04;
    const g = x.createLinearGradient(0, 0, D, D);
    if (n === 1) { g.addColorStop(0, 'rgba(225,246,255,0.95)'); g.addColorStop(1, 'rgba(150,215,255,0.9)'); }
    else { g.addColorStop(0, 'rgba(160,215,255,0.98)'); g.addColorStop(1, 'rgba(70,150,235,0.95)'); }
    this.rr(x, p, p, D - 2 * p, D - 2 * p, D * 0.16); x.fillStyle = g; x.fill();
    x.lineWidth = D * 0.04; x.strokeStyle = n === 1 ? 'rgba(255,255,255,0.95)' : 'rgba(230,245,255,0.95)'; x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.8)'; x.lineWidth = D * 0.035; x.lineCap = 'round';
    x.beginPath(); x.moveTo(D * 0.16, D * 0.36); x.lineTo(D * 0.36, D * 0.16); x.moveTo(D * 0.16, D * 0.56); x.lineTo(D * 0.56, D * 0.16); x.stroke();
    if (n === 2) {   // a snowflake in the corner says "two layers"
      x.save(); x.translate(D * 0.8, D * 0.8); x.strokeStyle = '#fff'; x.lineWidth = D * 0.03;
      for (let i = 0; i < 3; i++) { x.rotate(Math.PI / 3); x.beginPath(); x.moveTo(-D * 0.1, 0); x.lineTo(D * 0.1, 0); x.stroke(); }
      x.restore();
    }
    return c;
  },
  boxTile(D, n) {
    const c = this.canvas(D, D), x = c.getContext('2d'), p = D * 0.07, w = D - 2 * p;
    const body = n === 1 ? ['#ffb3d6', '#ff6fae', '#c42c70'] : ['#c9a6ff', '#8b5cff', '#5328c9'];
    const rib = n === 1 ? ['#ffffff', '#f3d9ea'] : ['#ffe680', '#ffb000'];
    const g = x.createLinearGradient(0, p, 0, D - p); g.addColorStop(0, body[0]); g.addColorStop(1, body[1]);
    this.rr(x, p, p + D * 0.08, w, w - D * 0.08, D * 0.12); x.fillStyle = g; x.fill();
    x.lineWidth = D * 0.04; x.strokeStyle = body[2]; x.stroke();
    // lid
    this.rr(x, p - D * 0.02, p + D * 0.06, w + D * 0.04, D * 0.2, D * 0.08); x.fillStyle = body[0]; x.fill(); x.stroke();
    // ribbon
    x.fillStyle = rib[0]; x.strokeStyle = rib[1]; x.lineWidth = D * 0.02;
    x.fillRect(D / 2 - D * 0.07, p + D * 0.06, D * 0.14, w - D * 0.06); x.strokeRect(D / 2 - D * 0.07, p + D * 0.06, D * 0.14, w - D * 0.06);
    if (n === 2) { x.fillRect(p, D * 0.58, w, D * 0.12); }
    // bow
    x.fillStyle = rib[0]; x.strokeStyle = n === 1 ? '#e7a7c8' : '#c27c00'; x.lineWidth = D * 0.03;
    for (const s of [-1, 1]) { x.beginPath(); x.ellipse(D / 2 + s * D * 0.12, p + D * 0.04, D * 0.13, D * 0.08, s * 0.5, 0, 7); x.fill(); x.stroke(); }
    x.beginPath(); x.arc(D / 2, p + D * 0.06, D * 0.06, 0, 7); x.fill(); x.stroke();
    return c;
  },
  bubbleTile(T, D) {
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2, r = D * 0.49;
    const g = x.createRadialGradient(m, m, r * 0.55, m, m, r);
    g.addColorStop(0, 'rgba(180,235,255,0.05)'); g.addColorStop(0.8, 'rgba(160,220,255,0.35)'); g.addColorStop(1, 'rgba(120,200,255,0.65)');
    x.fillStyle = g; x.beginPath(); x.arc(m, m, r, 0, 7); x.fill();
    x.lineWidth = D * 0.035; x.strokeStyle = 'rgba(255,255,255,0.9)'; x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.85)';
    x.beginPath(); x.ellipse(m - r * 0.45, m - r * 0.5, r * 0.22, r * 0.12, -0.7, 0, 7); x.fill();
    x.beginPath(); x.arc(m + r * 0.5, m + r * 0.45, r * 0.06, 0, 7); x.fill();
    return c;
  },

  // ---------- drawing on the board (ctx in CSS pixels) ----------
  // p: piece, (x, y) centre, sc scale, t clock ms, flash 0..1 white
  piece(ctx, p, x, y, sc, t, flash, sx, sy) {
    const s = this.T / this.dpr * sc, cell = this.cell;
    const w = s * (sx || 1), h = s * (sy || 1);
    if (p.k === 'g') { ctx.drawImage(this.tiles[PENGUIN], x - w / 2, y - h / 2, w, h); return; }
    if (p.s === 'c') {
      const pul = 1 + Math.sin(t / 180) * 0.04;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = Fx.dot('#ffffff');
      ctx.globalAlpha = 0.55 + Math.sin(t / 150) * 0.2; ctx.drawImage(gl, x - cell * 0.75, y - cell * 0.75, cell * 1.5, cell * 1.5); ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.rotate(t / 700); ctx.scale(pul, pul);
      ctx.drawImage(this.cache.orb, -w / 2, -h / 2, w, h); ctx.restore();
      // sparkles orbiting
      for (let i = 0; i < 3; i++) {
        const a = t / 400 + i * 2.1, rr = cell * 0.44;
        Fx.drawStar(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr, cell * (0.08 + 0.03 * Math.sin(t / 120 + i)), '#fff');
      }
      if (flash > 0) { ctx.globalAlpha = flash; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, cell * 0.42 * sc, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      return;
    }
    if (p.s === 'b') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(t / 900); const pul = 1 + Math.sin(t / 160) * 0.06; ctx.scale(pul * sc, pul * sc);
      ctx.drawImage(this.cache.ring, -this.T / this.dpr / 2, -this.T / this.dpr / 2, this.T / this.dpr, this.T / this.dpr); ctx.restore();
    }
    if (p.s === 'h' || p.s === 'v') {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5 + 0.25 * Math.sin(t / 140);
      const gl = Fx.dot(ANIMALS[p.c].fx[0]); ctx.drawImage(gl, x - cell * 0.7, y - cell * 0.7, cell * 1.4, cell * 1.4); ctx.restore();
    }
    ctx.drawImage(this.tiles[p.c], x - w / 2, y - h / 2, w, h);
    if (p.s === 'h' || p.s === 'v') {
      const wob = 1 + Math.sin(t / 120) * 0.05;
      ctx.drawImage(p.s === 'h' ? this.cache.stripeH : this.cache.stripeV, x - w * wob / 2, y - h * wob / 2, w * wob, h * wob);
    }
    if (flash > 0) { ctx.globalAlpha = Math.min(1, flash); ctx.drawImage(this.white[p.c], x - w / 2, y - h / 2, w, h); ctx.globalAlpha = 1; }
  },
  // a small picture of a goal, for the side panel and the cards
  goalIcon(g, px) {
    const c = this.canvas(px, px), x = c.getContext('2d');
    if (g.t === 'c' || g.t === 'pg') {
      const k = g.t === 'pg' ? PENGUIN : g.color, h = this.head(k, px * 1.15, px * 0.92);
      x.drawImage(h, -px * 0.075, -px * 0.075);
    } else if (g.t === 'ice') x.drawImage(this.iceTile(px, 1), 0, 0);
    else if (g.t === 'box') x.drawImage(this.boxTile(px, 1), 0, 0);
    else if (g.t === 'bub') { x.drawImage(this.head(1, px, px * 0.8), 0, 0); x.drawImage(this.bubbleTile(px, px * 0.86), 0, 0); }
    return c;
  },
};
