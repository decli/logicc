// 动物消消乐 · one level being played: drawing the board, the finger, playing back what board.js worked out,
// the side panel (moves, goals, score) and the end of the level.
const Game = {
  b: null, lv: null, li: 0, sprites: new Map(), vis: [], cv: null, ctx: null, dpr: 1,
  G: { cell: 60, ox: 0, oy: 0, w: 0, h: 0 }, base: null, clip: null, active: false, busy: false, over: false,
  sel: -1, down: null, hint: null, lastAct: 0, cheered: 0, lastCheer: -1e9, hudScore: 0, hudGoals: [], extraUsed: false,
  saidLow: false, popSnd: 0, bg: [], hintT: 0, hintAfter: 7000,

  init() {
    this.cv = $('#cv'); this.ctx = this.cv.getContext('2d');
    for (let i = 0; i < 14; i++) this.bg.push({ x: Math.random(), y: Math.random(), r: rnd(20, 70), v: rnd(0.004, 0.012), h: pick(['255,255,255', '255,190,225', '200,230,255', '255,240,180']) });
    const cv = this.cv;
    cv.addEventListener('pointerdown', e => this.pdown(e));
    cv.addEventListener('pointermove', e => this.pmove(e));
    cv.addEventListener('pointerup', e => this.pup(e));
    cv.addEventListener('pointercancel', () => { this.down = null; });
    addEventListener('resize', () => { if (this.active) this.layout(); });
  },

  // ---------- starting a level ----------
  start(li) {
    this.li = li; this.lv = LEVELS[li];
    this.b = new Board(this.lv);
    this.active = true; this.busy = false; this.over = false; this.sel = -1; this.hint = null; this.extraUsed = false; this.saidLow = false;
    this.cheered = 0; this.hudScore = 0;
    this.hintAfter = Store.d.seen.swipe ? 7000 : 1500;   // the very first game: the finger shows how to swipe straight away
    Fx.clear(); Clock.clear();
    this.sprites.clear();
    this.vis = this.b.cells.map(x => ({ ice: x.ice, box: x.box, bub: x.bub, hit: -1e9 }));
    this.b.cells.forEach((x, i) => { if (x.p) this.addSprite(x.p, i); });
    this.hudGoals = this.b.goals.map(g => g.left);
    this.buildHud();
    $('#hud').hidden = false; $('#map').hidden = true;
    this.layout();
    // drop the animals in from the top, row by row
    for (const s of this.sprites.values()) { s.r0 = s.r; s.r -= this.b.R + 1; s.delay = (this.b.R - s.r0) * 35 + s.c * 12; }
    this.busy = true;
    Clock.tween(700 + this.b.R * 35, (k, raw) => {
      const t = raw * (700 + this.b.R * 35);
      for (const s of this.sprites.values()) {
        if (s.r0 == null) continue;
        const kk = clamp((t - s.delay) / 420, 0, 1);
        s.r = s.r0 - (1 - Ease.back(kk)) * (this.b.R + 1);
      }
    }).then(() => { for (const s of this.sprites.values()) { if (s.r0 != null) s.r = s.r0; s.r0 = null; } this.busy = false; this.lastAct = Clock.now; });
    Music.start();
  },
  addSprite(p, i) {
    const [r, c] = this.b.rc(i);
    const s = { id: p.id, p, r, c, sc: 1, sx: 1, sy: 1, flash: 0, land: -1e9, born: Clock.now, wig: 0 };
    this.sprites.set(p.id, s);
    return s;
  },
  stop() { this.active = false; $('#hud').hidden = true; Fx.clear(); Clock.clear(); },

  // ---------- layout ----------
  layout() {
    const W = innerWidth, H = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2), hud = $('#hud');
    this.dpr = dpr;
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    this.cv.style.width = W + 'px'; this.cv.style.height = H + 'px';
    Fx.resize(W, H, dpr);
    if (!this.b) return;
    const wide = W >= H * 1.1;
    hud.className = wide ? 'side' : 'top';
    // a landscape phone is too short for the side panel (and a very narrow phone too narrow for the top one):
    // measure the panels at full size, then shrink the whole column (or row) until it fits
    hud.style.transform = ''; hud.style.height = ''; hud.style.bottom = wide ? 'auto' : '';
    hud.style.width = wide ? clamp(W * 0.25, 200, 290) + 'px' : '';
    const k = Math.min(1, wide ? H / hud.offsetHeight : W / hud.scrollWidth);
    if (wide) hud.style.height = H / k + 'px'; else if (k < 1) hud.style.width = W / k + 'px';
    if (k < 1) hud.style.transform = `scale(${k})`;
    const box = hud.getBoundingClientRect();
    let area;
    if (wide) area = { x: 0, y: 0, w: W - box.width, h: H };
    else area = { x: 0, y: box.height, w: W, h: H - box.height };
    const pad = 26, R = this.b.R, C = this.b.C, extra = this.b.pg.total ? 0.35 : 0;
    const cell = Math.floor(Math.min((area.w - 2 * pad) / C, (area.h - 2 * pad) / (R + extra), 120));
    const G = this.G;
    G.cell = cell; G.w = cell * C; G.h = cell * R;
    G.ox = Math.round(area.x + (area.w - G.w) / 2);
    G.oy = Math.round(area.y + (area.h - G.h - extra * cell) / 2);
    Art.setCell(cell, dpr);
    this.makeBase();
  },
  cellXY(r, c) { const G = this.G; return [G.ox + (c + 0.5) * G.cell, G.oy + (r + 0.5) * G.cell]; },
  makeBase() {
    const G = this.G, b = this.b, d = this.dpr, cell = G.cell, f = cell * 0.13, pad = cell * 0.5;
    const W = (G.w + 2 * pad) * d, H = (G.h + 2 * pad) * d;
    const frame = Art.canvas(W, H), fx = frame.getContext('2d');
    fx.scale(d, d); fx.translate(pad, pad);
    fx.fillStyle = 'rgba(255,255,255,0.92)';
    b.cells.forEach((x, i) => { if (x.v) return; const [r, c] = b.rc(i); Art.rr(fx, c * cell - f, r * cell - f, cell + 2 * f, cell + 2 * f, cell * 0.28); fx.fill(); });
    const base = Art.canvas(W, H), x = base.getContext('2d');
    x.save(); x.shadowColor = 'rgba(74,43,94,0.28)'; x.shadowBlur = 18 * d; x.shadowOffsetY = 6 * d; x.drawImage(frame, 0, 0); x.restore();
    x.scale(d, d); x.translate(pad, pad);
    b.cells.forEach((cl, i) => {
      if (cl.v) return;
      const [r, c] = b.rc(i);
      Art.rr(x, c * cell + 2, r * cell + 2, cell - 4, cell - 4, cell * 0.2);
      x.fillStyle = (r + c) % 2 ? '#f3e9ff' : '#fdf8ff'; x.fill();
    });
    if (b.pg.total) {   // where the penguins go home
      x.fillStyle = '#22c38a'; x.strokeStyle = '#fff'; x.lineWidth = 3; x.lineJoin = 'round';
      b.cells.forEach((cl, i) => {
        if (!b.exit[i]) return;
        const [r, c] = b.rc(i), cx = (c + 0.5) * cell, cy = (r + 1) * cell + cell * 0.16;
        x.beginPath(); x.moveTo(cx - cell * 0.16, cy - cell * 0.02); x.lineTo(cx + cell * 0.16, cy - cell * 0.02); x.lineTo(cx, cy + cell * 0.16); x.closePath(); x.stroke(); x.fill();
      });
    }
    this.base = { c: base, pad };
    const clip = new Path2D();
    b.cells.forEach((cl, i) => { if (cl.v) return; const [r, c] = b.rc(i); clip.rect(G.ox + c * cell - f, G.oy + r * cell - f, cell + 2 * f, cell + 2 * f); });
    this.clip = clip;
  },

  // ---------- drawing ----------
  draw() {
    const ctx = this.ctx, d = this.dpr, W = this.cv.width / d, H = this.cv.height / d;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    // floating bubbles in the background
    for (const o of this.bg) {
      o.y -= o.v * 0.016; if (o.y < -0.15) { o.y = 1.15; o.x = Math.random(); }
      ctx.fillStyle = `rgba(${o.h},0.35)`; ctx.beginPath(); ctx.arc(o.x * W + Math.sin(Clock.now / 2000 + o.r) * 20, o.y * H, o.r, 0, 7); ctx.fill();
    }
    if (!this.active || !this.base) return;
    const G = this.G, b = this.b, cell = G.cell, t = Clock.now;
    const [sx, sy] = Fx.shakeOffset();
    ctx.setTransform(d, 0, 0, d, sx * d, sy * d);
    ctx.drawImage(this.base.c, G.ox - this.base.pad, G.oy - this.base.pad, this.base.c.width / d, this.base.c.height / d);
    this.vis.forEach((v, i) => {
      if (!v.ice) return;
      const [r, c] = b.rc(i);
      ctx.drawImage(Art.cache['ice' + v.ice], G.ox + c * cell, G.oy + r * cell, cell, cell);
    });
    if (this.sel >= 0) {
      const [r, c] = b.rc(this.sel), pul = 0.5 + 0.5 * Math.sin(t / 160);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.6 + 0.4 * pul;
      ctx.drawImage(Fx.dot('#ffd23a'), G.ox + (c - 0.35) * cell, G.oy + (r - 0.35) * cell, cell * 1.7, cell * 1.7); ctx.restore();
    }
    ctx.save(); ctx.clip(this.clip);
    const list = [...this.sprites.values()].sort((a, c) => (a.z || 0) - (c.z || 0));
    for (const s of list) {
      let [x, y] = this.cellXY(s.r, s.c);
      let sc = s.sc, sxx = s.sx, syy = s.sy;
      const since = t - s.land;
      if (since < 260) { const k = since / 260, a = Math.sin(k * Math.PI) * (1 - k) * 0.22; syy *= 1 - a; sxx *= 1 + a; y += a * cell * 0.25; }
      if (this.sel >= 0 && this.b.cells[this.sel].p === s.p && !this.busy) { const k = Math.abs(Math.sin(t / 180)); y -= k * cell * 0.08; syy *= 1 + k * 0.04; }
      if (s.wig) { const k = Math.sin(t / 90) * s.wig; x += k * cell * 0.08 * (s.wdx || 0); y += k * cell * 0.08 * (s.wdy || 0); }
      if (s.p.k === 'g') y += Math.sin(t / 300 + s.c) * cell * 0.03;
      ctx.globalAlpha = s.a == null ? 1 : s.a;
      Art.piece(ctx, s.p, x, y, sc, t, s.flash, sxx, syy);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    this.vis.forEach((v, i) => {
      if (!v.bub && !v.box) return;
      const [r, c] = b.rc(i), [x, y] = this.cellXY(r, c);
      const hk = clamp((t - v.hit) / 260, 0, 1), hit = hk < 1 ? Math.sin(hk * Math.PI) * 0.12 : 0;
      if (v.box) { const s = cell * (1 - hit); ctx.drawImage(Art.cache['box' + v.box], x - s / 2, y - s / 2, s, s); }
      if (v.bub) { const w = 1 + Math.sin(t / 400 + i) * 0.03, s = Art.T / d * w; ctx.drawImage(Art.cache.bub, x - s / 2, y - s / 2, s, s); }
    });
    if (this.hint && !this.busy && $('#modal').hidden) {
      const [r1, c1] = b.rc(this.hint.a), [r2, c2] = b.rc(this.hint.b), [x1, y1] = this.cellXY(r1, c1), [x2, y2] = this.cellXY(r2, c2);
      this.drawFinger(ctx, x1, y1, x2, y2, t - this.hintT, 1);
    }
  },
  frame(dt) {
    if (!this.active) return;
    for (const s of this.sprites.values()) { if (s.flash > 0 && !s.holdFlash) s.flash = Math.max(0, s.flash - dt / 250); }
    // a gentle nudge when she has not moved for a while: the two pieces wiggle and a finger shows the swipe
    if (!this.busy && !this.over && Clock.now - this.lastAct > this.hintAfter && !this.hint && $('#modal').hidden) {
      const h = this.b.hint();
      if (h) {
        this.hint = h;
        const [r1, c1] = this.b.rc(h.a), [r2, c2] = this.b.rc(h.b);
        const A = this.sprites.get(this.b.cells[h.a].p.id), B = this.sprites.get(this.b.cells[h.b].p.id);
        if (A && B) { A.wig = 1; A.wdx = c2 - c1; A.wdy = r2 - r1; B.wig = 1; B.wdx = c1 - c2; B.wdy = r1 - r2; }
        this.hintT = Clock.now;
      }
    }
    const want = this.b.score;
    if (this.hudScore < want) { this.hudScore = Math.min(want, this.hudScore + Math.max(10, (want - this.hudScore) * dt / 180)); this.drawScore(); }
  },
  // the hint's finger, drawn like the one in drawShowOff: press on (x0, y0), slide to (x1, y1), lift; t: ms since it began
  drawFinger(ctx, x0, y0, x1, y1, t, a) {
    const cell = this.G.cell, ph = (t % 1300) / 1300, slide = Ease.inOut(clamp((ph - 0.25) / 0.4, 0, 1));
    const fx = lerp(x0, x1, slide), fy = lerp(y0, y1, slide), sz = cell * 0.95;
    ctx.save();
    ctx.globalAlpha = a * (ph < 0.08 ? ph / 0.08 : ph > 0.85 ? (1 - ph) / 0.15 : 1);
    if (ph > 0.2 && ph < 0.75) { ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(fx, fy, cell * 0.2, 0, 7); ctx.fill(); }
    ctx.font = `${sz}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(74,43,94,0.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
    ctx.fillText('👆', fx + sz * 0.08, fy - sz * 0.06 + (ph < 0.25 ? (0.25 - ph) * cell * 0.6 : 0));
    ctx.restore();
  },
  clearHint() {
    this.lastAct = Clock.now;
    if (!this.hint) return;
    for (const s of this.sprites.values()) s.wig = 0;
    this.hint = null;
  },

  // ---------- the finger ----------
  cellAt(e) {
    const G = this.G, c = Math.floor((e.clientX - G.ox) / G.cell), r = Math.floor((e.clientY - G.oy) / G.cell);
    const i = this.b.idx(r, c);
    return this.b.on(i) ? i : -1;
  },
  pdown(e) {
    Snd.init();
    if (!this.active || this.over) return;
    this.hideShowOff();
    const i = this.cellAt(e);
    if (i < 0) { this.sel = -1; return; }
    this.down = { i, x: e.clientX, y: e.clientY, moved: false };
    try { this.cv.setPointerCapture(e.pointerId); } catch (_) { }
  },
  pmove(e) {
    const d = this.down;
    if (!d || d.moved || this.busy) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y, th = this.G.cell * 0.32;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < th) return;
    d.moved = true;
    const [r, c] = this.b.rc(d.i);
    const j = Math.abs(dx) > Math.abs(dy) ? this.b.idx(r, c + Math.sign(dx)) : this.b.idx(r + Math.sign(dy), c);
    this.sel = -1;
    if (j >= 0 && this.b.on(j)) this.trySwap(d.i, j);
  },
  pup(e) {
    const d = this.down; this.down = null;
    if (!d || d.moved || this.busy || this.over) return;
    const i = d.i;
    if (this.sel >= 0 && this.sel !== i && this.b.adjacent(this.sel, i)) { const a = this.sel; this.sel = -1; this.trySwap(a, i); return; }
    if (this.sel === i) { this.sel = -1; return; }
    const x = this.b.cells[i];
    if (x.bub && x.p) { this.nudge(i); this.tip('bubStuck'); return; }
    if (!this.b.movable(i)) return;
    this.sel = i; Snd.play('select'); this.clearHint();
  },
  nudge(i) {
    const p = this.b.cells[i].p; const s = p && this.sprites.get(p.id);
    Snd.play('bad');
    this.vis[i].hit = Clock.now;
    if (s) Clock.tween(300, k => { s.sx = 1 + Math.sin(k * Math.PI * 3) * 0.08 * (1 - k); });
  },
  async trySwap(a, b) {
    if (this.busy || this.over) return;
    this.clearHint();
    const B = this.b;
    if (!B.movable(a) || !B.movable(b)) { if (B.cells[a].bub || B.cells[b].bub) { this.nudge(B.cells[a].bub ? a : b); this.tip('bubStuck'); } return; }
    this.busy = true;
    const res = B.swap(a, b);
    if (!res.ok) {
      await this.animBounce(a, b);
      this.busy = false; this.lastAct = Clock.now;
      return;
    }
    if (!Store.d.owed) { Store.d.owed = true; Store.d.played++; Store.save(); }
    if (!Store.d.seen.swipe) { Store.d.seen.swipe = 1; Store.save(); this.hintAfter = 7000; }
    this.setMoves(B.moves);
    this.cheered = 0;
    if (res.two) this.sayOnce('combo', L.combo);
    await this.play(res.phases);
    await this.afterTurn();
  },

  // ---------- playing back a turn ----------
  async play(phases) {
    const done = [];
    for (const ph of phases) {
      done.push(ph);
      if (ph.type === 'swap') await this.animSwap(ph);
      else if (ph.type === 'clear') { await this.animClear(ph); this.maybeCheer(done); }
      else if (ph.type === 'fall') await this.animFall(ph);
      else if (ph.type === 'exit') await this.animExit(ph);
    }
  },
  maybeCheer(done) {
    const lvl = excitement(done), word = CHEER[lvl];
    // a word only once per turn: Excellent! for level 3 and again for 4 would just repeat itself
    if (lvl > this.cheered && word !== CHEER[this.cheered] && Clock.now - this.lastCheer > 650) {
      this.cheered = lvl; this.lastCheer = Clock.now;
      const G = this.G;
      Voice.cheer(word);
      Fx.praise(word, G.ox + G.w / 2, G.oy + G.h * 0.42, G.w, lvl);
      if (lvl >= 4) Fx.shake(6, 300);
    }
  },
  animSwap(ph) {
    const { a, b } = ph, A = this.sprites.get(ph.ida), B = this.sprites.get(ph.idb);   // the board is already at the end of the turn
    const [ra, ca] = this.b.rc(a), [rb, cb] = this.b.rc(b);
    Snd.play('swap');
    A.z = 2;
    return Clock.tween(170, k => { A.r = lerp(ra, rb, k); A.c = lerp(ca, cb, k); B.r = lerp(rb, ra, k); B.c = lerp(cb, ca, k); A.sc = 1 + Math.sin(k * Math.PI) * 0.12; }, Ease.inOut)
      .then(() => { A.z = 0; A.sc = 1; });
  },
  async animBounce(a, b) {
    const A = this.sprites.get(this.b.cells[a].p.id), B = this.sprites.get(this.b.cells[b].p.id);
    const [ra, ca] = this.b.rc(a), [rb, cb] = this.b.rc(b);
    Snd.play('swap');
    const f = k => { A.r = lerp(ra, rb, k); A.c = lerp(ca, cb, k); B.r = lerp(rb, ra, k); B.c = lerp(cb, ca, k); };
    await Clock.tween(140, k => f(k * 0.55), Ease.out);
    Snd.play('bad');
    await Clock.tween(200, k => f(0.55 * (1 - k)), Ease.back);
    f(0);
  },
  async animClear(ph) {
    const t0 = Clock.now, G = this.G;
    // one "+points" per group of matched pieces
    const firsts = ph.ev.filter(e => e.k === 'pop' && e.by === 'match' && e.t === 0);
    if (firsts.length) {
      let sx = 0, sy = 0; firsts.forEach(e => { const [r, c] = this.b.rc(e.i); sx += c; sy += r; });
      const [x, y] = this.cellXY(sy / firsts.length, sx / firsts.length);
      Fx.text(x, y, '+' + firsts.reduce((n, e) => n + e.pts, 0), G.cell * 0.42, pick(['#ff4f9a', '#7b4dff', '#ff9d3a']));
    }
    for (const e of ph.ev) {
      const wait = t0 + e.t - Clock.now;
      if (wait > 0) await Clock.wait(wait);
      this.event(e, ph);
    }
    const rest = t0 + ph.dur - Clock.now;
    if (rest > 0) await Clock.wait(rest);
  },
  event(e, ph) {
    const G = this.G, b = this.b, [r, c] = b.rc(e.i), [x, y] = this.cellXY(r, c), cell = G.cell;
    switch (e.k) {
      case 'pop': {
        const s = this.sprites.get(e.p.id);
        if (!s) break;
        const col = e.p.s === 'c' ? ['#ffffff', '#ffd23a'] : ANIMALS[e.p.c].fx;
        if (e.to != null) {   // sliding into the special it is turning into
          const [tr, tc] = b.rc(e.to), r0 = s.r, c0 = s.c;
          s.z = 1;
          Clock.tween(150, k => { s.r = lerp(r0, tr, k); s.c = lerp(c0, tc, k); s.sc = 1 - k * 0.5; s.flash = k; }, Ease.in).then(() => this.sprites.delete(s.id));
        } else {
          s.z = 3; s.holdFlash = true;
          Clock.tween(110, k => { s.sc = 1 + k * 0.35; s.flash = k; }, Ease.out).then(() => {
            this.sprites.delete(s.id);
            Fx.burst(x, y, col, e.by === 'match' ? 10 : 8, e.by === 'match' ? 1 : 1.3, cell);
          });
        }
        if (Clock.now - this.popSnd > 40) { this.popSnd = Clock.now; Snd.play('pop', ph.cascade - 1 + (e.by === 'blast' ? 2 : 0)); }
        if (e.goal) this.flyGoal(this.goalIndex('c', e.p.c), Art.tiles[e.p.c], x, y);
        break;
      }
      case 'make': {
        if (e.old) { const o = this.sprites.get(e.old); if (o) this.sprites.delete(e.old); }
        const appear = () => {
          const s = this.addSprite(e.p, e.i); s.sc = 0; s.flash = 1; s.z = 1;
          Clock.tween(380, k => { s.sc = Ease.elastic(k); }).then(() => { s.z = 0; });
          Fx.ring(x, y, '#fff', cell * 0.2, cell * 1.1, 420, 8);
          Fx.sparkles(x, y, 8, cell * 0.5, '#fff');
          if (!e.quiet) Snd.play('make');
          if (!e.bonus && !e.quiet) { this.showOff(e.p); this.sayOnce('made_' + e.p.s, L.made[e.p.s]); }
        };
        if (e.bonus) {
          const m = $('.moves', $('#hud')).getBoundingClientRect();
          this.setMoves(Math.max(0, +$('.moves b').textContent - 1));
          Fx.fly({ x0: m.left + m.width / 2, y0: m.top + m.height / 2, x1: x, y1: y, s0: 40, s1: cell * 0.6, dur: 280, lift: 40, img: Fx.star('#ffd23a'), trail: '#ffd23a', onArrive: appear });
          Snd.play('fly', e.i);
        } else appear();
        break;
      }
      case 'beam': {
        Fx.beam(x, y, e.dir, ANIMALS[e.c] ? ANIMALS[e.c].fx[0] : '#fff', { x: G.ox, y: G.oy, w: G.w, h: G.h, cell }, e.wide);
        Snd.play('stripe'); Fx.shake(4, 220);
        break;
      }
      case 'bomb': {
        const col = ANIMALS[e.c] ? ANIMALS[e.c].fx[0] : '#ffd23a';
        Fx.ring(x, y, '#ffd23a', cell * 0.3, cell * (e.rad + 0.8), 480, 16);
        Fx.ring(x, y, col, cell * 0.2, cell * (e.rad + 0.3), 380, 10);
        Fx.part({ kind: 'img', img: Fx.dot('#fff6b0'), add: true, x, y, vx: 0, vy: 0, life: 350, size: cell * (e.rad + 1) * 1.6, s1: cell });
        Fx.burst(x, y, ['#ffd23a', col], 18, 1.8, cell);
        Fx.shake(e.rad > 2 ? 16 : 9, 380); Fx.flash(e.rad > 2 ? 0.35 : 0.15, '#fff6d0');
        Snd.play('bomb');
        break;
      }
      case 'zap': {
        const col = ANIMALS[e.c] ? ANIMALS[e.c].fx[0] : '#fff';
        e.to.forEach((j, n) => { const [rr, cc] = b.rc(j), [tx, ty] = this.cellXY(rr, cc); Fx.bolt(x, y, tx, ty, col, n * 28); });
        Fx.ring(x, y, '#fff', cell * 0.3, cell * 1.8, 500, 10);
        Fx.part({ kind: 'img', img: Fx.dot('#ffffff'), add: true, x, y, vx: 0, vy: 0, life: 700, size: cell * 3, s1: cell * 0.5 });
        Fx.flash(0.2, '#fff'); Snd.play('zap');
        break;
      }
      case 'nova': {
        Fx.flash(0.7, '#fff'); Fx.shake(18, 600); Snd.play('nova');
        ['#ff4f6d', '#ffd23a', '#5fe07a', '#3ac8ff', '#a77bff'].forEach((col, n) => Fx.ring(x, y, col, cell * 0.2, cell * (4 + n * 1.5), 700 + n * 120, 14));
        break;
      }
      case 'ice': {
        this.vis[e.i].ice = e.left;
        Fx.burst(x, y, ['#ffffff', '#a8dcff'], 8, 0.9, cell);
        Snd.play('ice');
        if (e.goal) this.flyGoal(this.goalIndex('ice'), Art.cache.ice1, x, y);
        break;
      }
      case 'box': {
        const v = this.vis[e.i]; v.box = e.left; v.hit = Clock.now;
        Fx.burst(x, y, e.left ? ['#c9a6ff', '#ffe680'] : ['#ff9fca', '#ffffff'], 14, 1.2, cell);
        if (!e.left) Fx.sparkles(x, y, 8, cell * 0.5, '#ffd23a');
        Snd.play('box'); Fx.shake(3, 150);
        if (e.goal) this.flyGoal(this.goalIndex('box'), Art.cache.box1, x, y);
        break;
      }
      case 'bub': {
        this.vis[e.i].bub = false;
        Fx.ring(x, y, '#bfe9ff', cell * 0.4, cell * 0.8, 300, 6);
        Fx.burst(x, y, ['#ffffff', '#bfe9ff'], 8, 0.8, cell);
        Snd.play('bub');
        if (e.goal) this.flyGoal(this.goalIndex('bub'), Art.cache.bub, x, y);
        break;
      }
    }
  },
  // pieces fall: logic already moved them; follow each one's path, faster and faster, with a little squash on landing
  animFall(ph) {
    const A = 0.00011, V = 0.019, T1 = V / A, S1 = 0.5 * A * T1 * T1;
    const sAt = t => (t < T1 ? 0.5 * A * t * t : S1 + V * (t - T1));
    const paths = ph.paths.map(pa => {
      let s = this.sprites.get(pa.p.id);
      if (!s) { s = this.addSprite(pa.p, 0); }
      s.r = pa.pts[0].r; s.c = pa.pts[0].c; s.sc = 1;
      return { s, pts: pa.pts, end: pa.pts[pa.pts.length - 1].s, landed: false };
    });
    const total = ph.steps;
    const dur = total <= S1 ? Math.sqrt(2 * total / A) : T1 + (total - S1) / V;
    let landSnd = 0;
    return Clock.tween(dur, (k, raw) => {
      const s = sAt(raw * dur);
      for (const P of paths) {
        const pts = P.pts;
        let pos;
        if (s >= P.end) pos = pts[pts.length - 1];
        else {
          let i = 0; while (i < pts.length - 1 && pts[i + 1].s <= s) i++;
          const a = pts[i], bb = pts[i + 1];
          const start = bb.s - 1, f = clamp(s - start, 0, 1);
          pos = { r: lerp(a.r, bb.r, f), c: lerp(a.c, bb.c, f) };
        }
        P.s.r = pos.r; P.s.c = pos.c;
        if (!P.landed && s >= P.end) { P.landed = true; P.s.land = Clock.now; if (landSnd++ < 3) Snd.play('land'); }
      }
    }).then(() => { for (const P of paths) { const e = P.pts[P.pts.length - 1]; P.s.r = e.r; P.s.c = e.c; if (!P.landed) P.s.land = Clock.now; } });
  },
  async animExit(ph) {
    for (const o of ph.out) {
      const s = this.sprites.get(o.p.id); this.sprites.delete(o.p.id);
      const [r, c] = this.b.rc(o.i), [x, y] = this.cellXY(r, c);
      Snd.play('home');
      Fx.text(x, y, '+' + ph.pts, this.G.cell * 0.45, '#22c38a');
      Fx.sparkles(x, y, 12, this.G.cell * 0.6, '#ffd23a');
      this.flyGoal(this.goalIndex('pg'), Art.tiles[PENGUIN], x, y, true);
      if (s) s.a = 0;
    }
    this.sayOnce('penguinHome', L.penguinHome);
    await Clock.wait(350);
  },
  // sprites and board must agree after a turn (a safety net: an animation that was cut short leaves nothing behind)
  reconcile() {
    const live = new Set();
    this.b.cells.forEach((x, i) => {
      if (!x.p) return;
      live.add(x.p.id);
      const [r, c] = this.b.rc(i);
      let s = this.sprites.get(x.p.id);
      if (!s) s = this.addSprite(x.p, i);
      s.p = x.p; s.r = r; s.c = c; s.sc = 1; s.sx = 1; s.sy = 1; s.flash = 0; s.holdFlash = false; s.z = 0; s.a = 1;
    });
    for (const id of [...this.sprites.keys()]) if (!live.has(id)) this.sprites.delete(id);
    this.b.cells.forEach((x, i) => { const v = this.vis[i]; v.ice = x.ice; v.box = x.box; v.bub = x.bub; });
  },
  async afterTurn() {
    this.reconcile();
    this.syncHud();
    const B = this.b;
    if (B.won()) { this.over = true; await this.win(); return; }
    if (B.moves <= 0) { this.over = true; await this.fail(); return; }
    if (!B.hasMove()) await this.reshuffle();
    if (B.moves === 5 && !this.saidLow) { this.saidLow = true; Voice.say(L.movesLow); }
    this.busy = false; this.lastAct = Clock.now;
  },
  async reshuffle() {
    Voice.say(L.noMoves);
    await Clock.wait(500);
    const ph = this.b.shuffle();
    Snd.play('shuffle');
    const from = new Map(ph.moves.map(m => { const s = this.sprites.get(m.id); return [m.id, [s.r, s.c]]; }));
    await Clock.tween(600, k => {
      for (const m of ph.moves) {
        const s = this.sprites.get(m.id), [r0, c0] = from.get(m.id), [r1, c1] = this.b.rc(m.to);
        const sw = Math.sin(k * Math.PI);
        s.r = lerp(r0, r1, k) - sw * 0.6; s.c = lerp(c0, c1, k); s.sc = 1 - sw * 0.3;
      }
    }, Ease.inOut);
    for (const m of ph.moves) { const s = this.sprites.get(m.id); const [r1, c1] = this.b.rc(m.to); s.r = r1; s.c = c1; s.sc = 1; }
  },

  // ---------- end of the level ----------
  async win() {
    const B = this.b, G = this.G;
    await Clock.wait(300);
    Snd.play('win');
    Voice.say(pick(L.win));
    Fx.confetti(60);
    if (B.moves > 0) {
      await Clock.wait(900);
      Snd.play('sparkle');
      Fx.praise(BONUS, G.ox + G.w / 2, G.oy + G.h * 0.42, G.w, 3);
      await Clock.wait(600);
      await this.play(B.bonus());
    } else {
      const ph = B.bonus();
      if (ph.length) await this.play(ph);
    }
    this.syncHud();
    await Clock.wait(500);
    const stars = B.stars(), li = this.li, d = Store.d;
    d.stars[li] = Math.max(d.stars[li] || 0, stars);
    d.best[li] = Math.max(d.best[li] || 0, B.score);
    d.open = Math.max(d.open, Math.min(LEVELS.length, li + 2));
    Store.save();
    await Gift.open(stars);   // the blind box first, then the stars card
    UI.result({ win: true, stars, score: B.score, li });
  },
  async fail() {
    await Clock.wait(400);
    Snd.play('lose');
    Voice.say(L.fail);
    UI.result({ win: false, li: this.li, goals: this.b.goals, extra: !this.extraUsed });
  },
  // five sums for five more moves, once per game
  async moreMoves() {
    this.extraUsed = true;
    await MathGate.open({ count: 5, extra: true });
    this.b.moves += 5; this.setMoves(this.b.moves);
    this.over = false; this.busy = false; this.saidLow = false; this.lastAct = Clock.now;
    Voice.say(L.extraDone);
    Music.start();
    if (!this.b.hasMove()) { this.busy = true; await this.reshuffle(); this.busy = false; }
  },

  // ---------- new things: shown on the board and said in a few words, never written (she can't read them yet) ----------
  sayOnce(key, line) {
    if (Store.d.seen[key]) return;
    Store.d.seen[key] = 1; Store.save();
    setTimeout(() => Voice.say(line), 700);
  },
  tip(key) {
    if (key === 'bubStuck' && !this._bubTold) { this._bubTold = true; Voice.say(L.bubStuck); }
  },
  // a special piece just made shows off what it will do: a glowing ring and a picture of its blast (arrows along its row
  // or column, the bomb's diamond, a spinning rainbow). The first few times of each kind a finger also shows the swipe.
  // It follows the piece while it falls, ends when the piece is used, and gets out of the way when she touches the board.
  showOff(p) {
    const kind = p.s, hand = (Store.d.seen['hand_' + kind] || 0) < 3;   // counted only when a finger is really shown
    const it = { t: -380, dur: hand ? 3400 : 1500, id: p.id, kind, hand };
    it.draw = (ctx, k, t) => this.drawShowOff(ctx, it, t);
    Fx.items.push(it);
  },
  hideShowOff() { for (const it of Fx.items) if (it.kind && it.t < it.dur - 220) it.t = Math.max(it.t, it.dur - 220); },
  drawShowOff(ctx, it, t) {
    if (t < 0) return;
    const s = this.active && $('#modal').hidden && this.sprites.get(it.id);
    if (!s) { it.t = it.dur; return; }   // the piece was used up, or a card (pause, result) opened over the board
    const G = this.G, cell = G.cell, [x, y] = this.cellXY(s.r, s.c), kind = it.kind;
    const a = Math.min(1, t / 200, (it.dur - t) / 220), pul = 0.5 + 0.5 * Math.sin(t / 130);
    const col = kind === 'c' ? '#ffffff' : ANIMALS[s.p.c].fx[0];
    ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // the glow ring and four twinkles going round it
    ctx.lineWidth = cell * 0.07; ctx.strokeStyle = '#ffd23a';
    ctx.beginPath(); ctx.arc(x, y, cell * (0.56 + 0.05 * pul), 0, 7); ctx.stroke();
    for (let i = 0; i < 4; i++) { const an = t / 500 + i * Math.PI / 2; Fx.drawStar(ctx, x + Math.cos(an) * cell * 0.62, y + Math.sin(an) * cell * 0.62, cell * (0.1 + 0.05 * pul), '#fff6b0'); }
    // what it will do
    if (kind === 'h' || kind === 'v') {
      ctx.save(); ctx.beginPath(); ctx.rect(G.ox, G.oy, G.w, G.h); ctx.clip();
      const along = kind === 'h' ? [1, 0] : [0, 1], room = kind === 'h' ? G.w : G.h;
      for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) {
        const d = cell * 0.85 + ((t / 650 + i / 3) % 1) * room * 0.45, f = 1 - d / (room * 0.6);
        if (f <= 0) continue;
        const cx = x + along[0] * sg * d, cy = y + along[1] * sg * d, w = cell * 0.18;
        ctx.globalAlpha = a * Math.min(1, f * 1.6);
        ctx.beginPath();
        ctx.moveTo(cx - along[0] * sg * w + along[1] * w * 1.3, cy - along[1] * sg * w + along[0] * w * 1.3);
        ctx.lineTo(cx + along[0] * sg * w, cy + along[1] * sg * w);
        ctx.lineTo(cx - along[0] * sg * w - along[1] * w * 1.3, cy - along[1] * sg * w - along[0] * w * 1.3);
        ctx.lineWidth = cell * 0.16; ctx.strokeStyle = '#fff'; ctx.stroke();
        ctx.lineWidth = cell * 0.08; ctx.strokeStyle = col; ctx.stroke();
      }
      ctx.restore();
    } else if (kind === 'b') {
      const R = cell * (2.5 + 0.12 * pul);
      ctx.setLineDash([cell * 0.22, cell * 0.16]); ctx.lineDashOffset = -t / 25;
      ctx.beginPath(); ctx.moveTo(x, y - R); ctx.lineTo(x + R, y); ctx.lineTo(x, y + R); ctx.lineTo(x - R, y); ctx.closePath();
      ctx.lineWidth = cell * 0.12; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.lineWidth = cell * 0.06; ctx.strokeStyle = '#ff9d3a'; ctx.stroke();
      ctx.setLineDash([]);
    } else if (kind === 'c') {
      const hues = ['#ff4f6d', '#ff9d3a', '#ffd23a', '#5fe07a', '#3ac8ff', '#a77bff'];
      ctx.lineWidth = cell * 0.09;
      hues.forEach((h, i) => { const a0 = t / 300 + i * Math.PI / 3; ctx.strokeStyle = h; ctx.beginPath(); ctx.arc(x, y, cell * 0.74, a0, a0 + Math.PI / 3 - 0.12); ctx.stroke(); });
    }
    // the finger: press on the piece, slide it the way that really works, lift; again and again. Once the board has
    // settled it picks the best real move for this piece; if the piece has none right now, there is no finger.
    if (it.hand && !this.busy && it.dir === undefined) {
      const at = this.b.cells.findIndex(x => x.p === s.p);
      const m = at < 0 ? null : this.b.allMoves().filter(m => m.a === at || m.b === at).sort((x, y) => y.v - x.v)[0];
      if (m) { const [r1, c1] = this.b.rc(at), [r2, c2] = this.b.rc(m.a === at ? m.b : m.a); it.dir = [r2 - r1, c2 - c1]; } else it.dir = null;
      if (it.dir) { const d = Store.d.seen; d['hand_' + it.kind] = (d['hand_' + it.kind] || 0) + 1; Store.save(); }
    }
    if (it.hand && !this.busy && it.dir) {
      const dir = it.dir;
      const ph = (t % 1300) / 1300, slide = Ease.inOut(clamp((ph - 0.25) / 0.4, 0, 1));
      const fx = x + dir[1] * slide * cell, fy = y + dir[0] * slide * cell, sz = cell * 0.95;
      ctx.globalAlpha = a * (ph < 0.08 ? ph / 0.08 : ph > 0.85 ? (1 - ph) / 0.15 : 1);
      if (ph > 0.2 && ph < 0.75) { ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(fx, fy, cell * 0.2, 0, 7); ctx.fill(); }
      ctx.font = `${sz}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.shadowColor = 'rgba(74,43,94,0.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      ctx.fillText('👆', fx + sz * 0.08, fy - sz * 0.06 + (ph < 0.25 ? (0.25 - ph) * cell * 0.6 : 0));
    }
    ctx.restore();
  },

  // ---------- side panel ----------
  buildHud() {
    const hud = $('#hud'), b = this.b, lv = this.lv;
    hud.innerHTML = '';
    const name = el('div', 'panel name'); name.appendChild(el('div', 'lvname', `第 ${this.li + 1} 关<small>${lv.name}</small>`));
    const mv = el('div', 'panel'); const moves = el('div', 'moves', `<b>${b.moves}</b><span>步</span>`); mv.appendChild(moves);
    const gp = el('div', 'panel'), goals = el('div', 'goals');
    b.goals.forEach(g => {
      const d = el('div', 'goal');
      d.appendChild(Art.goalIcon(g, 120));
      d.appendChild(el('b', null, g.left));
      goals.appendChild(d);
    });
    gp.appendChild(goals);
    const sp = el('div', 'panel score');
    sp.innerHTML = `<div class="sub">第 ${this.li + 1} 关 · ${lv.name}</div><div class="num">0</div><div class="bar"><i></i><s>⭐</s><s>⭐</s><s>⭐</s></div>`;
    const btns = el('div', 'hbtns');
    const pause = el('button', 'ibtn', '⏸'); pause.onclick = () => { Snd.play('tap'); UI.pause(); };
    btns.appendChild(UI.homeButton()); btns.appendChild(pause);
    [name, mv, gp, sp, btns].forEach(n => hud.appendChild(n));
    const s = lv.stars, max = s[2] * 1.12, marks = $$('.bar s', sp);
    [s[1] * 0.45, s[1], s[2]].forEach((v, i) => { marks[i].style.left = (100 * v / max) + '%'; });
    this.drawScore();
  },
  drawScore() {
    const hud = $('#hud'), s = this.lv.stars, max = s[2] * 1.12, v = Math.round(this.hudScore);
    const num = $('.score .num', hud); if (!num) return;
    num.textContent = v.toLocaleString('en-US');
    $('.bar i', hud).style.width = Math.min(100, 100 * v / max) + '%';
    const marks = $$('.bar s', hud), won = this.b.won();
    marks[0].classList.toggle('on', won); marks[1].classList.toggle('on', won && v >= s[1]); marks[2].classList.toggle('on', won && v >= s[2]);
  },
  setMoves(n) {
    const m = $('#hud .moves'); if (!m) return;
    $('b', m).textContent = n;
    m.classList.toggle('low', n <= 5 && !this.b.won());
    m.style.transform = 'scale(1.15)'; setTimeout(() => { m.style.transform = ''; }, 150);
  },
  goalIndex(t, c) { return this.b.goals.findIndex(g => g.t === t && (t !== 'c' || g.color === c)); },
  flyGoal(gi, img, x, y, big) {
    if (gi < 0) return;
    const node = $$('#hud .goal')[gi]; if (!node) return;
    const r = node.getBoundingClientRect(), cell = this.G.cell;
    Fx.fly({ x0: x, y0: y, x1: r.left + r.width / 2, y1: r.top + r.height / 2, s0: cell * (big ? 1.1 : 0.9), s1: r.width * 0.8, dur: 520 + Math.random() * 160, lift: 60 + Math.random() * 60, img, trail: '#ffffff',
      onArrive: () => {
        this.hudGoals[gi] = Math.max(0, this.hudGoals[gi] - 1);
        this.showGoal(gi);
        Snd.play('fly', gi * 3 + (this.hudGoals[gi] % 5));
        node.classList.add('bump'); setTimeout(() => node.classList.remove('bump'), 120);
      } });
  },
  showGoal(gi) {
    const node = $$('#hud .goal')[gi]; if (!node) return;
    const n = this.hudGoals[gi], b = $('b', node);
    if (n <= 0 && !node.classList.contains('ok')) { node.classList.add('ok'); b.textContent = '✓'; Snd.play('goal'); const r = node.getBoundingClientRect(); Fx.sparkles(r.left + r.width / 2, r.top + r.height / 2, 10, r.width / 2, '#ffd23a'); }
    else if (n > 0) b.textContent = n;
  },
  syncHud() {
    const b = this.b;
    b.goals.forEach((g, i) => { if (this.hudGoals[i] !== g.left) { setTimeout(() => { if (this.b !== b) return; this.hudGoals[i] = g.left; this.showGoal(i); }, 700); } });
    this.setMoves(this.b.moves);
  },
};
