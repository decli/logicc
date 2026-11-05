// 动物消消乐 · drawing the pieces, the cell layers (ice, gift boxes, bubbles) and the little sprites the effects use.
// Everything that does not move is drawn once into a canvas the size it will appear on screen (re-made on resize).
const Art = {
  img: null, funs: null, pals: null, big: {}, dpr: 1, cell: 0, T: 0, tiles: [], funTiles: [], white: [], cache: {},
  // decli's 怪趣森林 heads (made by dev/heads2.py, laid out as HEADS in heads.js): the board faces, which the start
  // screen waits for, and the fun faces and the partners' faces, which come in behind them (the board face stands in
  // until they do). A failed download is tried again: the start screen waits for the first three tries, later ones go
  // on in the background and the pictures replace the coloured balls from the next game on.
  load() {
    const sheet = (name, done, onFirst) => {
      let k = 0;
      const get = () => {
        const im = new Image();
        im.onload = () => { done(im); if (onFirst) onFirst(); };
        im.onerror = () => { k++; if (k === 3 && onFirst) onFirst(); if (k < 6) setTimeout(get, [1000, 2500, 5000, 10000, 20000][k - 1]); };
        im.src = name + '?h=' + HEADS.h + (k ? '&try=' + k : '');   // a new set of pictures has a new address
      };
      get();
    };
    return new Promise(res => {
      sheet('heads.webp', im => { this.img = im; this.cell = 0; }, () => {
        res();
        sheet('funs.webp', im => { this.funs = im; this.cell = 0; });
        sheet('pals.webp', im => { this.pals = im; });
      });
    });
  },
  // the big fun face of FRIENDS[i] for the blind box (big/<id>.webp, fetched when a box opens): the picture, or null
  // while it is on its way
  bigFace(i) {
    const id = FRIENDS[i].id;
    if (!this.big[id]) { const im = new Image(); this.big[id] = { im, ok: false }; im.onload = () => { this.big[id].ok = true; }; im.src = 'big/' + id + '.webp?h=' + HEADS.h; }
    return this.big[id].ok ? this.big[id].im : null;
  },
  canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; },
  rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  },
  // FRIENDS[i]'s head drawn into x centred on (cx, cy), its longer side about fit pixels. face: 'b' the board face
  // (default), 'f' its fun face, 't' / 'c' a partner's tap / cheer face, 'h' the chick hatching. Every cell holds the
  // whole picture, so all of a character's faces sit exactly on top of each other.
  friendTo(x, i, cx, cy, fit, face) {
    if (!this.img) {   // the picture did not load: a coloured ball
      const col = Cast.FX[FRIENDS[i].fam[0]];
      x.fillStyle = col[0]; x.strokeStyle = col[1]; x.lineWidth = fit * 0.05;
      x.beginPath(); x.arc(cx, cy, fit * 0.42, 0, 7); x.fill(); x.stroke();
      return;
    }
    let im = this.img, C = HEADS.cell, k = i, cols = HEADS.cols;
    if (face === 'f' && this.funs) im = this.funs;
    const pal = (face === 't' || face === 'c') && HEADS.pals[FRIENDS[i].id];
    if ((pal || face === 'h') && this.pals) { im = this.pals; C = HEADS.palCell; cols = HEADS.palCols; k = face === 'h' ? HEADS.hatch : pal[face === 't' ? 0 : 1]; }
    else if (face === 'h' || face === 't' || face === 'c') im = this.funs || this.img;
    const D = fit / HEADS.fill;
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(im, (k % cols) * C, Math.floor(k / cols) * C, C, C, cx - D / 2, cy - D / 2, D, D);
  },
  friend(i, s, fit, face) { const c = this.canvas(s, s); this.friendTo(c.getContext('2d'), i, s / 2, s / 2, fit, face); return c; },
  byId(id) { return FRIENDS.findIndex(f => f.id === id); },
  // the board's kinds (this game's six ANIMALS, then the penguin) as FRIENDS numbers
  kindHead(k) { return k < ANIMALS.length ? ANIMALS[k].h : this.byId('penguin'); },
  // an animal head (k 0-5, 6 = penguin) into a square canvas of side s, for a cell cellPx wide
  head(k, s, cellPx, face) { return this.friend(this.kindHead(k), s, cellPx * 0.92, face); },
  setCell(cell, dpr) {
    const cast = ANIMALS.map(a => a.h).join() + (this.img ? '' : '?');   // the pieces change with the game's animals too
    if (cell === this.cell && dpr === this.dpr && cast === this.cast && this.tiles.length) return;
    this.cell = cell; this.dpr = dpr; this.cast = cast;
    const D = cell * dpr, T = this.T = Math.ceil(D * 1.3);
    this.tiles = []; this.white = []; this.funTiles = [];
    for (let k = 0; k < 7; k++) {
      const t = this.head(k, T, D);
      this.tiles.push(t);
      this.funTiles.push(this.funs ? this.head(k, T, D, 'f') : t);   // a piece she has picked up, or that the hint points at
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
    // season two: an egg whole and cracked, a balloon, a cage, bare soil and grass (decli's pictures when they are in)
    this.cache.egg2 = this.eggTile(T, D, 2); this.cache.egg1 = this.eggTile(T, D, 1);
    this.cache.balloon = this.balloonTile(T, D);
    this.cache.cage = this.cageTile(T, D);
    this.cache.dirt = this.dirtTile(D); this.cache.grass = this.grassTile(D);
  },
  // a picture of decli's (Art2, art2.js) drawn to fill a T x T tile, if it has loaded
  pic(name, T, fit) {
    const im = Art2.img[name];
    if (!im) return null;
    const c = this.canvas(T, T), x = c.getContext('2d'), f = fit * T / Math.max(im.width, im.height);
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(im, (T - im.width * f) / 2, (T - im.height * f) / 2, im.width * f, im.height * f);
    return c;
  },
  // 蛋宝宝: cream with pastel spots; cracked: a zigzag and a bit of yellow fluff
  eggTile(T, D, hp) {
    const own = this.pic(hp === 2 ? 'egg' : 'egg-crack', T, D * 0.92 / T * 1.0);
    if (own) return own;
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2, w = D * 0.36, h = D * 0.44;
    const shape = () => { x.beginPath(); x.moveTo(m, m - h); x.bezierCurveTo(m + w * 1.05, m - h, m + w * 1.1, m + h * 0.75, m, m + h * 0.92); x.bezierCurveTo(m - w * 1.1, m + h * 0.75, m - w * 1.05, m - h, m, m - h); x.closePath(); };
    const g = x.createRadialGradient(m - w * 0.35, m - h * 0.35, D * 0.04, m, m, h * 1.2);
    g.addColorStop(0, '#fffdf6'); g.addColorStop(0.65, '#fbefd8'); g.addColorStop(1, '#e9cfa6');
    shape(); x.fillStyle = g; x.fill();
    x.save(); shape(); x.clip();
    [['#ffb3cf', -0.45, -0.1, 0.11], ['#a9e8c8', 0.4, 0.15, 0.1], ['#ffb3cf', 0.15, 0.55, 0.09], ['#a9e8c8', -0.3, 0.55, 0.07], ['#ffd27a', 0.1, -0.5, 0.08]]
      .forEach(([col, dx, dy, r]) => { x.fillStyle = col; x.beginPath(); x.arc(m + dx * w * 1.6, m + dy * h, D * r, 0, 7); x.fill(); });
    if (hp === 1) {
      const zig = [[-1.05, 0.02], [-0.6, -0.14], [-0.25, 0.1], [0.12, -0.16], [0.5, 0.08], [1.05, -0.08]];
      x.fillStyle = '#ffd23a'; x.beginPath(); zig.forEach(([zx, zy], k) => x[k ? 'lineTo' : 'moveTo'](m + zx * w, m + zy * h + h * 0.06)); zig.slice().reverse().forEach(([zx, zy]) => x.lineTo(m + zx * w, m + zy * h - h * 0.05)); x.closePath(); x.fill();
      x.strokeStyle = '#8a6a48'; x.lineWidth = D * 0.035; x.lineJoin = 'round'; x.beginPath(); zig.forEach(([zx, zy], k) => x[k ? 'lineTo' : 'moveTo'](m + zx * w, m + zy * h)); x.stroke();
    }
    x.restore();
    x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.ellipse(m - w * 0.42, m - h * 0.45, w * 0.16, h * 0.12, -0.5, 0, 7); x.fill();
    shape(); x.lineWidth = D * 0.03; x.strokeStyle = 'rgba(160,120,80,0.55)'; x.stroke();
    return c;
  },
  // 气球: glossy pink, a knot and a curly string
  balloonTile(T, D) {
    const own = this.pic('balloon', T, D * 0.98 / T);
    if (own) return own;
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2, r = D * 0.33, cy = m - D * 0.1;
    x.strokeStyle = '#ffffff'; x.lineWidth = D * 0.03; x.lineCap = 'round';
    x.beginPath(); x.moveTo(m, cy + r * 1.15); x.bezierCurveTo(m - D * 0.08, cy + r * 1.5, m + D * 0.08, cy + r * 1.75, m - D * 0.02, m + D * 0.47); x.stroke();
    const g = x.createRadialGradient(m - r * 0.35, cy - r * 0.4, r * 0.1, m, cy, r * 1.2);
    g.addColorStop(0, '#ffd0e4'); g.addColorStop(0.5, '#ff7fb3'); g.addColorStop(1, '#e8457f');
    x.fillStyle = g; x.beginPath(); x.ellipse(m, cy, r, r * 1.12, 0, 0, 7); x.fill();
    x.fillStyle = '#e8457f'; x.beginPath(); x.moveTo(m - D * 0.05, cy + r * 1.2); x.lineTo(m + D * 0.05, cy + r * 1.2); x.lineTo(m, cy + r * 1.06); x.closePath(); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.ellipse(m - r * 0.4, cy - r * 0.5, r * 0.2, r * 0.32, -0.5, 0, 7); x.fill();
    return c;
  },
  // 彩色笼子: a rounded frame and bars; the badge at the bottom gets the caged animal's head when drawn (cageAt)
  cageTile(T, D) {
    const own = this.pic('cage', T, D * 1.04 / T);
    if (own) return own;
    const c = this.canvas(T, T), x = c.getContext('2d'), m = T / 2, w = D * 0.98, top = m - w / 2;
    x.lineCap = 'round';
    const bar = (x0, y0, x1, y1, wd) => { x.lineWidth = wd * 1.6; x.strokeStyle = 'rgba(122,82,30,0.55)'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); x.lineWidth = wd; x.strokeStyle = '#fff3cf'; x.stroke(); };
    for (const k of [-0.3, -0.1, 0.1, 0.3]) bar(m + k * w, top + w * 0.08, m + k * w, top + w * 0.92, D * 0.05);
    this.rr(x, top + w * 0.04, top + w * 0.04, w * 0.92, w * 0.92, w * 0.18);
    x.lineWidth = D * 0.1; x.strokeStyle = 'rgba(122,82,30,0.5)'; x.stroke(); x.lineWidth = D * 0.065; x.strokeStyle = '#ffd56b'; x.stroke();
    return c;
  },
  dirtTile(D) {
    const own = Art2.img.dirt && this.pic('dirt', D, 1);
    if (own) return own;
    const c = this.canvas(D, D), x = c.getContext('2d'), p = D * 0.05;
    const g = x.createLinearGradient(0, 0, 0, D); g.addColorStop(0, '#e9c79c'); g.addColorStop(1, '#d6a874');
    this.rr(x, p, p, D - 2 * p, D - 2 * p, D * 0.2); x.fillStyle = g; x.fill();
    x.fillStyle = 'rgba(140,90,45,0.35)';
    [[0.25, 0.3, 0.05], [0.7, 0.22, 0.04], [0.55, 0.7, 0.06], [0.2, 0.75, 0.035], [0.82, 0.62, 0.04]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a * D, b * D, r * D, 0, 7); x.fill(); });
    return c;
  },
  grassTile(D) {
    const c = this.canvas(D, D), x = c.getContext('2d'), p = D * 0.05;
    const own = Art2.img.grass;
    this.rr(x, p, p, D - 2 * p, D - 2 * p, D * 0.2);
    if (own) { x.save(); x.clip(); x.drawImage(own, 0, 0, D, D); x.restore(); return c; }
    const g = x.createLinearGradient(0, 0, 0, D); g.addColorStop(0, '#b8ee8f'); g.addColorStop(1, '#8edb6b');
    x.fillStyle = g; x.fill();
    x.save(); x.clip(); x.strokeStyle = 'rgba(70,160,60,0.45)'; x.lineWidth = D * 0.03; x.lineCap = 'round';
    for (let k = 0; k < 14; k++) { const a = ((k * 37) % 100) / 100, b = ((k * 61) % 100) / 100; x.beginPath(); x.moveTo(a * D, b * D + D * 0.08); x.lineTo(a * D + D * 0.03, b * D); x.stroke(); }
    [[0.22, 0.25, '#ffffff'], [0.74, 0.7, '#fff27a']].forEach(([a, b, col]) => { x.fillStyle = col; for (let k = 0; k < 5; k++) { x.beginPath(); x.arc(a * D + Math.cos(k * 1.26) * D * 0.035, b * D + Math.sin(k * 1.26) * D * 0.035, D * 0.025, 0, 7); x.fill(); } x.fillStyle = '#ffb000'; x.beginPath(); x.arc(a * D, b * D, D * 0.02, 0, 7); x.fill(); });
    x.restore();
    return c;
  },
  // a cage over the animal in it, with that animal's little head on its badge (decli's blank badge when her picture
  // is in, a drawn one before that)
  cageAt(ctx, k, x, y, size) {
    ctx.drawImage(this.cache.cage, x - size / 2, y - size / 2, size, size);
    const im = Art2.img.cage, B = Art2.badge;
    let bx = x, by = y + size * 0.36, br = size * 0.15;
    if (im && B) {   // where cageTile put her picture: its longer side 1.04 cells, in a tile 1.3 cells wide
      const f = 1.04 / 1.3 * size / Math.max(im.width, im.height), w = im.width * f, h = im.height * f;
      bx = x - w / 2 + B[0] * w; by = y - h / 2 + B[1] * h; br = B[2] * h * 0.86;
    } else {
      ctx.fillStyle = '#ffd56b'; ctx.strokeStyle = 'rgba(122,82,30,0.6)'; ctx.lineWidth = size * 0.025;
      ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fill(); ctx.stroke();
    }
    ctx.drawImage(this.tiles[k], bx - br * 1.05, by - br * 1.05, br * 2.1, br * 2.1);
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
  piece(ctx, p, x, y, sc, t, flash, sx, sy, hp, fun) {
    const s = this.T / this.dpr * sc, cell = this.cell;
    const w = s * (sx || 1), h = s * (sy || 1);
    if (p.k === 'g') { ctx.drawImage((fun ? this.funTiles : this.tiles)[PENGUIN], x - w / 2, y - h / 2, w, h); return; }
    if (p.k === 'e') { ctx.drawImage(this.cache[(hp != null ? hp : p.hp) === 2 ? 'egg2' : 'egg1'], x - w / 2, y - h / 2, w, h); if (flash > 0) { ctx.globalAlpha = Math.min(1, flash) * 0.7; ctx.drawImage(Fx.dot('#ffffff'), x - w / 2, y - h / 2, w, h); ctx.globalAlpha = 1; } return; }
    if (p.k === 'l') { ctx.save(); ctx.translate(x, y + cell * 0.04); ctx.rotate(Math.sin(t / 520 + p.id) * 0.08); ctx.drawImage(this.cache.balloon, -w / 2, -h / 2, w, h); ctx.restore(); return; }
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
    ctx.drawImage((fun ? this.funTiles : this.tiles)[p.c], x - w / 2, y - h / 2, w, h);
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
    else if (g.t === 'egg') x.drawImage(this.eggTile(px, px * 1.05, 2), 0, 0);
    else if (g.t === 'bl') x.drawImage(this.balloonTile(px, px * 0.95), 0, 0);
    else if (g.t === 'grass') { x.drawImage(this.grassTile(px), 0, 0); x.font = `${px * 0.5}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('🌱', px / 2, px * 0.52); }
    else if (g.t === 'cage') { x.drawImage(this.head(g.k != null ? g.k : 0, px, px * 0.8), 0, 0); x.drawImage(this.cageTile(px, px * 0.95), 0, 0); }
    return c;
  },
};
