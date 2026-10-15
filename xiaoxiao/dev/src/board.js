// 动物消消乐 · the rules, with no drawing in it (dev/sim.js runs it in node to test the levels).
//
// A turn is worked out all at once: the swap, every match, every special that goes off, every piece that falls and
// every new one that drops in. What happened is returned as a list of phases, each with time-stamped events, and the
// page plays them back (game.js). The board itself is already in its final state when the animation starts.
//
// Cells: v (void, not part of the board), ice (0-2 layers under the piece), box (0-2 layers, a gift box that takes the
// whole cell), bub (a bubble around the piece: it cannot be moved or fall, a match or a blast pops the bubble and the
// piece stays), p (the piece).
// Pieces: k 'a' animal of colour c, k 'g' penguin (cannot be matched or blown up; walks out at the bottom).
// Specials: s 'h' clears its row, 'v' its column, 'b' bomb (diamond of radius 2), 'c' rainbow ball (no colour).

const ANIMALS = [
  { id: 'pig', name: '小猪', fx: ['#ffa3c8', '#e2668f', '#ffe0ec'] },
  { id: 'panda', name: '熊猫', fx: ['#ffffff', '#2f3040', '#e4e6ee'] },
  { id: 'hippo', name: '河马', fx: ['#b48cff', '#7b52e0', '#e6dbff'] },
  { id: 'giraffe', name: '长颈鹿', fx: ['#ffc83a', '#e08e10', '#fff0b8'] },
  { id: 'parrot', name: '鹦鹉', fx: ['#ff4a3a', '#c8231a', '#ffc0b2'] },
  { id: 'frog', name: '小青蛙', fx: ['#6fd65a', '#2f9e3a', '#d2f8b4'] },
];
const PENGUIN = 6;   // the kind after the six animals (its head is FRIENDS' penguin)

const PTS = { piece: 20, blast: 30, make: { h: 100, v: 100, b: 150, c: 250 }, ice: 80, box: 60, bub: 50, home: 1000, bonus: 200 };

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// a small binary heap of timed events, so blasts are applied in the order they reach each cell
function Heap() { this.a = []; this.n = 0; }
Heap.prototype.push = function (e) {
  e.q = this.n++; const a = this.a; a.push(e); let i = a.length - 1;
  while (i > 0) { const p = (i - 1) >> 1; if (Heap.lt(a[i], a[p])) { [a[i], a[p]] = [a[p], a[i]]; i = p; } else break; }
};
Heap.prototype.pop = function () {
  const a = this.a, top = a[0], last = a.pop();
  if (a.length) {
    a[0] = last; let i = 0;
    for (;;) {
      const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && Heap.lt(a[l], a[m])) m = l;
      if (r < a.length && Heap.lt(a[r], a[m])) m = r;
      if (m === i) break;[a[i], a[m]] = [a[m], a[i]]; i = m;
    }
  }
  return top;
};
Heap.lt = (x, y) => x.t < y.t || (x.t === y.t && x.q < y.q);

// layout characters: . cell  _ void  i/I ice 1/2  b/B gift box 1/2  o bubble  q bubble on ice  g penguin  k ice under a penguin
function Board(lv, rng) {
  this.lv = lv;
  this.rng = rng || Math.random;
  const lay = lv.layout || Array(8).fill('........');
  this.R = lay.length; this.C = Math.max(...lay.map(s => s.length));
  this.cells = [];
  this.nextId = 1;
  this.colors = lv.colors;
  this.moves = lv.moves; this.score = 0;
  this.pg = { total: lv.penguins ? lv.penguins.total : 0, max: lv.penguins ? lv.penguins.max : 0, made: 0, home: 0, gap: 0 };
  const preset = [];
  for (let r = 0; r < this.R; r++) for (let c = 0; c < this.C; c++) {
    const ch = lay[r][c] || '_';
    const cell = { v: ch === '_' || ch === ' ', ice: 0, box: 0, bub: false, p: null };
    if (ch === 'i' || ch === 'q' || ch === 'k') cell.ice = 1;
    if (ch === 'I') cell.ice = 2;
    if (ch === 'b') cell.box = 1;
    if (ch === 'B') cell.box = 2;
    if (ch === 'o' || ch === 'q') cell.bub = true;
    if (ch === 'g' || ch === 'k') preset.push(this.cells.length);
    this.cells.push(cell);
  }
  // new pieces drop in at the top cell of each column; penguins leave from the bottom cell
  this.spawn = this.cells.map((cell, i) => !cell.v && (this.rc(i)[0] === 0 || this.cells[i - this.C].v));
  this.exit = this.cells.map((cell, i) => !cell.v && (this.rc(i)[0] === this.R - 1 || this.cells[i + this.C].v));
  this.goals = lv.goals.map(g => {
    const n = g.n != null ? g.n
      : g.t === 'ice' ? this.cells.filter(x => x.ice > 0).length
      : g.t === 'box' ? this.cells.filter(x => x.box > 0).length
      : g.t === 'bub' ? this.cells.filter(x => x.bub).length
      : g.t === 'pg' ? this.pg.total : 0;
    return Object.assign({}, g, { n, left: n });
  });
  this.fillInitial(preset);
}

Board.prototype.rc = function (i) { return [Math.floor(i / this.C), i % this.C]; };
Board.prototype.idx = function (r, c) { return r < 0 || c < 0 || r >= this.R || c >= this.C ? -1 : r * this.C + c; };
Board.prototype.on = function (i) { return i >= 0 && !this.cells[i].v; };
Board.prototype.newPiece = function (c, s) { return { id: this.nextId++, k: 'a', c, s: s || null }; };
Board.prototype.randColor = function () { return this.colors[Math.floor(this.rng() * this.colors.length)]; };
Board.prototype.movable = function (i) { const x = this.cells[i]; return i >= 0 && !x.v && !x.box && !x.bub && !!x.p; };
Board.prototype.colorAt = function (i) {
  if (i < 0) return -1;
  const x = this.cells[i];
  if (x.v || x.box || !x.p || x.p.k !== 'a' || x.p.s === 'c') return -1;
  return x.p.c;
};
Board.prototype.neighbors = function (i) {
  const [r, c] = this.rc(i), out = [];
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const j = this.idx(r + dr, c + dc); if (this.on(j)) out.push(j); }
  return out;
};

Board.prototype.fillInitial = function (preset) {
  for (let tries = 0; tries < 200; tries++) {
    this.cells.forEach(x => { x.p = null; });
    preset.forEach(i => { this.cells[i].p = { id: this.nextId++, k: 'g' }; });
    this.pg.made = preset.length;
    for (let i = 0; i < this.cells.length; i++) {
      const x = this.cells[i];
      if (x.v || x.box || x.p) continue;
      const [r, c] = this.rc(i);
      let col, guard = 0;
      do {
        col = this.randColor();
        guard++;
      } while (guard < 50 && ((this.colorAt(this.idx(r, c - 1)) === col && this.colorAt(this.idx(r, c - 2)) === col) ||
        (this.colorAt(this.idx(r - 1, c)) === col && this.colorAt(this.idx(r - 2, c)) === col)));
      x.p = this.newPiece(col);
    }
    if (!this.findMatches().length && this.hasMove()) return;
  }
};

// ---------- matching ----------
Board.prototype.findMatches = function () {
  const runs = [];
  const scan = (outer, inner, at, dir) => {
    for (let a = 0; a < outer; a++) {
      let b = 0;
      while (b < inner) {
        const col = this.colorAt(at(a, b));
        if (col < 0) { b++; continue; }
        let e = b + 1;
        while (e < inner && this.colorAt(at(a, e)) === col) e++;
        if (e - b >= 3) { const cells = []; for (let k = b; k < e; k++) cells.push(at(a, k)); runs.push({ dir, cells, color: col }); }
        b = e;
      }
    }
  };
  scan(this.R, this.C, (r, c) => this.idx(r, c), 'h');
  scan(this.C, this.R, (c, r) => this.idx(r, c), 'v');
  // runs that share a cell are one group (an L, a T or a cross)
  const owner = new Map(), groups = [];
  for (const run of runs) {
    const hit = new Set(run.cells.map(i => owner.get(i)).filter(g => g));
    let g;
    if (!hit.size) { g = { color: run.color, cells: new Set(), runs: [] }; groups.push(g); }
    else {
      const [first, ...rest] = [...hit]; g = first;
      for (const o of rest) { o.cells.forEach(i => g.cells.add(i)); g.runs.push(...o.runs); groups.splice(groups.indexOf(o), 1); }
    }
    g.runs.push(run); run.cells.forEach(i => g.cells.add(i));
    g.cells.forEach(i => owner.set(i, g));
  }
  return groups;
};
Board.prototype.specialFor = function (g) {
  const max = Math.max(...g.runs.map(r => r.cells.length));
  if (max >= 5) return 'c';
  if (g.runs.some(r => r.dir === 'h') && g.runs.some(r => r.dir === 'v')) return 'b';
  if (max === 4) return g.runs.find(r => r.cells.length === 4).dir;
  return null;
};
Board.prototype.pickSpawn = function (g, type, prefer) {
  const ok = i => !this.cells[i].bub && this.cells[i].p && !this.cells[i].p.s;
  for (const i of prefer) if (g.cells.has(i) && ok(i)) return i;
  if (type === 'b') {
    const h = new Set(), both = [];
    g.runs.filter(r => r.dir === 'h').forEach(r => r.cells.forEach(i => h.add(i)));
    g.runs.filter(r => r.dir === 'v').forEach(r => r.cells.forEach(i => { if (h.has(i)) both.push(i); }));
    for (const i of both) if (ok(i)) return i;
  }
  const run = g.runs.slice().sort((a, b) => b.cells.length - a.cells.length)[0];
  const mid = run.cells.slice().sort((a, b) => Math.abs(run.cells.indexOf(a) - (run.cells.length - 1) / 2) - Math.abs(run.cells.indexOf(b) - (run.cells.length - 1) / 2));
  for (const i of mid) if (ok(i)) return i;
  for (const i of g.cells) if (ok(i)) return i;
  return -1;
};

// ---------- clearing ----------
// ctx: one clearing phase. ev = what the page will animate, t in ms from the start of the phase.
Board.prototype.newCtx = function (cascade) {
  return { cascade, heap: new Heap(), ev: [], done: new Set(), boxHit: new Set(), protect: new Set(), acts: 0, cleared: 0, big: 0 };
};
Board.prototype.goal = function (t, c, amount) {
  for (const g of this.goals) if (g.t === t && (t !== 'c' || g.color === c) && g.left > 0) { g.left = Math.max(0, g.left - (amount || 1)); return g; }
  return null;
};
Board.prototype.hitBox = function (i, t, ctx) {
  const x = this.cells[i];
  if (!x.box || ctx.boxHit.has(i)) return;
  ctx.boxHit.add(i); x.box--;
  this.score += PTS.box;
  const g = x.box === 0 ? this.goal('box') : null;
  ctx.ev.push({ t, k: 'box', i, left: x.box, goal: !!g, pts: PTS.box });
};
Board.prototype.clearCell = function (i, t, by, ctx, to) {
  const x = this.cells[i];
  if (x.v || ctx.done.has(i) || ctx.protect.has(i)) return;
  if (x.box) { if (by !== 'match') this.hitBox(i, t, ctx); return; }
  const p = x.p;
  if (!p) return;
  if (x.bub) {
    x.bub = false; ctx.done.add(i);
    this.score += PTS.bub;
    const g = this.goal('bub');
    ctx.ev.push({ t, k: 'bub', i, goal: !!g, pts: PTS.bub });
    return;
  }
  if (p.k === 'g') return;
  ctx.done.add(i); x.p = null; ctx.cleared++;
  const pts = by === 'match' ? PTS.piece * Math.min(ctx.cascade, 6) : PTS.blast;
  this.score += pts;
  const g = p.s !== 'c' ? this.goal('c', p.c) : null;
  ctx.ev.push({ t, k: 'pop', i, p, by, to, goal: !!g, pts });
  if (x.ice > 0) {
    x.ice--; this.score += PTS.ice;
    const gi = x.ice === 0 ? this.goal('ice') : null;
    ctx.ev.push({ t, k: 'ice', i, left: x.ice, goal: !!gi, pts: PTS.ice });
  }
  if (p.s) ctx.heap.push({ t: t + (by === 'match' ? 90 : 60), k: 'act', i, p });
};
Board.prototype.diamond = function (i, rad) {
  const [r, c] = this.rc(i), out = [];
  for (let dr = -rad; dr <= rad; dr++) for (let dc = -rad; dc <= rad; dc++) {
    if (Math.abs(dr) + Math.abs(dc) > rad) continue;
    const j = this.idx(r + dr, c + dc); if (this.on(j)) out.push([j, Math.abs(dr) + Math.abs(dc)]);
  }
  return out;
};
Board.prototype.line = function (i, dir) {
  const [r, c] = this.rc(i), out = [];
  if (dir === 'h') for (let k = 0; k < this.C; k++) { const j = this.idx(r, k); if (this.on(j)) out.push([j, Math.abs(k - c)]); }
  else for (let k = 0; k < this.R; k++) { const j = this.idx(k, c); if (this.on(j)) out.push([j, Math.abs(k - r)]); }
  return out;
};
Board.prototype.piecesOf = function (col, ctx) {
  const out = [];
  this.cells.forEach((x, j) => { if (!x.v && !x.box && x.p && x.p.k === 'a' && x.p.s !== 'c' && x.p.c === col && !ctx.done.has(j)) out.push(j); });
  return out;
};
Board.prototype.commonColor = function (ctx) {
  const n = {};
  this.cells.forEach((x, j) => { if (!x.v && !x.box && x.p && x.p.k === 'a' && x.p.s !== 'c' && !ctx.done.has(j)) n[x.p.c] = (n[x.p.c] || 0) + 1; });
  let best = -1, bn = 0;
  for (const k in n) if (n[k] > bn) { bn = n[k]; best = +k; }
  return best;
};
Board.prototype.activate = function (e, ctx) {
  const { i, p, t } = e;
  ctx.acts++;
  if (p.s === 'h' || p.s === 'v') {
    ctx.ev.push({ t, k: 'beam', i, dir: p.s, c: p.c });
    for (const [j, d] of this.line(i, p.s)) if (j !== i) ctx.heap.push({ t: t + d * 26, k: 'clear', i: j, by: 'blast' });
  } else if (p.s === 'b') {
    ctx.ev.push({ t, k: 'bomb', i, rad: 2, c: p.c });
    for (const [j, d] of this.diamond(i, 2)) if (j !== i) ctx.heap.push({ t: t + d * 45, k: 'clear', i: j, by: 'blast' });
  } else if (p.s === 'c') {
    const col = this.commonColor(ctx);
    const targets = col >= 0 ? this.piecesOf(col, ctx) : [];
    ctx.ev.push({ t, k: 'zap', i, to: targets, c: col });
    targets.forEach((j, n) => ctx.heap.push({ t: t + 160 + n * 28, k: 'clear', i: j, by: 'blast' }));
  }
};
Board.prototype.run = function (ctx) {
  while (ctx.heap.a.length) {
    const e = ctx.heap.pop();
    if (e.k === 'clear') this.clearCell(e.i, e.t, e.by, ctx, e.to);
    else if (e.k === 'act') this.activate(e, ctx);
    else if (e.k === 'box') this.hitBox(e.i, e.t, ctx);
    else if (e.k === 'fn') e.fn(e.t);
  }
  const end = ctx.ev.reduce((m, e) => Math.max(m, e.t), 0);
  ctx.ev.sort((a, b) => a.t - b.t);
  return { type: 'clear', cascade: ctx.cascade, ev: ctx.ev, dur: end + 260, acts: ctx.acts, cleared: ctx.cleared, big: ctx.big };
};

// one round of matches: clear them, make the specials they earn
Board.prototype.matchPhase = function (groups, cascade, prefer) {
  const ctx = this.newCtx(cascade), makes = [];
  for (const g of groups) {
    const s = this.specialFor(g);
    const at = s ? this.pickSpawn(g, s, prefer) : -1;
    if (at >= 0) { ctx.protect.add(at); makes.push({ i: at, s, c: g.color }); }
    for (const i of g.cells) if (i !== at) ctx.heap.push({ t: 0, k: 'clear', i, by: 'match', to: at >= 0 ? at : undefined });
    const near = new Set();
    for (const i of g.cells) for (const j of this.neighbors(i)) if (this.cells[j].box) near.add(j);
    near.forEach(j => ctx.heap.push({ t: 40, k: 'box', i: j }));
  }
  const ph = this.run(ctx);
  for (const m of makes) {
    const x = this.cells[m.i], old = x.p;
    x.p = this.newPiece(m.c, m.s);
    this.score += PTS.make[m.s];
    ph.ev.push({ t: 150, k: 'make', i: m.i, p: x.p, old: old ? old.id : 0, pts: PTS.make[m.s] });
  }
  ph.makes = makes;
  ph.ev.sort((a, b) => a.t - b.t);
  ph.dur = Math.max(ph.dur, makes.length ? 420 : 0);
  return ph;
};

// ---------- falling ----------
// Pieces fall one cell per step; new ones drop in at the top cells. When nothing can fall straight down any more,
// a piece may slide diagonally into a hole under a gift box, a bubble or the edge of the board.
Board.prototype.settle = function () {
  const paths = new Map(), landed = new Set(), news = [];
  const empty = i => this.on(i) && !this.cells[i].box && !this.cells[i].p;
  const canFall = i => this.on(i) && !this.cells[i].box && !this.cells[i].bub && !!this.cells[i].p;
  const rec = (p, from, to, s) => {
    if (!paths.has(p.id)) paths.set(p.id, { p, pts: [{ s: s - 1, r: from[0], c: from[1] }] });
    paths.get(p.id).pts.push({ s, r: to[0], c: to[1] });
  };
  let step = 0;
  for (; step < 400; step++) {
    let any = false;
    const s = step + 1, moved = new Set();
    for (let r = this.R - 1; r >= 0; r--) for (let c = 0; c < this.C; c++) {
      const i = this.idx(r, c);
      if (!empty(i)) continue;
      const j = this.idx(r - 1, c);
      if (j >= 0 && canFall(j) && !moved.has(this.cells[j].p.id)) {
        const p = this.cells[j].p; this.cells[j].p = null; this.cells[i].p = p; moved.add(p.id);
        rec(p, [r - 1, c], [r, c], s); any = true;
      } else if (this.spawn[i]) {
        const p = this.spawnPiece(c);
        this.cells[i].p = p; moved.add(p.id); news.push(p.id);
        rec(p, [r - 1, c], [r, c], s); any = true;
      }
    }
    if (!any) {
      for (let r = this.R - 1; r >= 0 && !any; r--) for (let c = 0; c < this.C; c++) {
        const i = this.idx(r, c);
        if (!empty(i)) continue;
        for (const dc of this.rng() < 0.5 ? [-1, 1] : [1, -1]) {
          const j = this.idx(r - 1, c + dc);
          if (j < 0 || !canFall(j)) continue;
          const below = this.idx(r, c + dc);
          if (below >= 0 && empty(below)) continue;   // it would rather fall straight down
          const p = this.cells[j].p; this.cells[j].p = null; this.cells[i].p = p;
          rec(p, [r - 1, c + dc], [r, c], s); any = true; break;
        }
      }
    }
    if (!any) break;
  }
  paths.forEach(v => { const e = v.pts[v.pts.length - 1]; landed.add(this.idx(e.r, e.c)); });
  return { type: 'fall', paths: [...paths.values()], steps: step, news, landed: [...landed] };
};
Board.prototype.spawnPiece = function () {
  const pg = this.pg;
  if (pg.made < pg.total && pg.gap <= 0) {
    let on = 0; this.cells.forEach(x => { if (x.p && x.p.k === 'g') on++; });
    if (on < pg.max && this.rng() < 0.25) { pg.made++; pg.gap = 3; return { id: this.nextId++, k: 'g' }; }
  }
  return this.newPiece(this.randColor());
};
Board.prototype.exits = function () {
  const out = [];
  this.cells.forEach((x, i) => {
    if (this.exit[i] && x.p && x.p.k === 'g') { out.push({ i, p: x.p }); x.p = null; this.pg.home++; this.score += PTS.home; this.goal('pg'); }
  });
  return out.length ? { type: 'exit', out, pts: PTS.home } : null;
};

// after the first clearing phase: fall, penguins out, match again, until the board is still
Board.prototype.cascade = function (phases, first, prefer) {
  let cascade = first;
  for (let guard = 0; guard < 60; guard++) {
    const fall = this.settle();
    if (fall.paths.length) phases.push(fall);
    const ex = this.exits();
    if (ex) { phases.push(ex); const f2 = this.settle(); if (f2.paths.length) phases.push(f2); fall.landed.push(...f2.landed); }
    const groups = this.findMatches();
    if (!groups.length) break;
    cascade++;
    phases.push(this.matchPhase(groups, cascade, fall.landed));
  }
  return cascade;
};

// ---------- the player's move ----------
Board.prototype.adjacent = function (a, b) {
  const [r1, c1] = this.rc(a), [r2, c2] = this.rc(b);
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
};
Board.prototype.isCombo = function (pa, pb) {
  if (pa.k !== 'a' || pb.k !== 'a') return false;
  return pa.s === 'c' || pb.s === 'c' || (!!pa.s && !!pb.s);
};
// a = where the finger started, b = where it moved to
Board.prototype.swap = function (a, b) {
  if (!this.adjacent(a, b) || !this.movable(a) || !this.movable(b) || this.moves <= 0) return { ok: false };
  const A = this.cells[a], B = this.cells[b], pa = A.p, pb = B.p;
  A.p = pb; B.p = pa;
  const phases = [{ type: 'swap', a, b, ida: pa.id, idb: pb.id }];
  let cascade = 1;
  this.pg.gap--;
  const combo = this.isCombo(pa, pb);
  if (combo) {
    this.moves--;
    phases.push(this.comboPhase(b, pa, a, pb));
  } else {
    const groups = this.findMatches();
    if (!groups.length) { A.p = pa; B.p = pb; this.pg.gap++; return { ok: false, bounce: true }; }
    this.moves--;
    phases.push(this.matchPhase(groups, 1, [b, a]));
  }
  cascade = this.cascade(phases, cascade, []);
  return { ok: true, phases, two: combo && !!pa.s && !!pb.s };   // two: two special pieces swapped together
};
// two specials, or a rainbow ball with anything: pa now sits at b, pb at a
Board.prototype.comboPhase = function (b, pa, a, pb) {
  const ctx = this.newCtx(1);
  const S = new Set([pa.s, pb.s]);
  const consume = (i, t) => {   // the two swapped pieces are used up by the combo instead of going off on their own
    const x = this.cells[i], p = x.p; ctx.done.add(i); x.p = null;
    const g = p.s !== 'c' ? this.goal('c', p.c) : null;
    ctx.ev.push({ t, k: 'pop', i, p, by: 'combo', goal: !!g, pts: 0 });
    if (x.ice > 0) { x.ice--; const gi = x.ice === 0 ? this.goal('ice') : null; ctx.ev.push({ t, k: 'ice', i, left: x.ice, goal: !!gi, pts: PTS.ice }); }
  };
  ctx.big = 1;
  if (S.has('c')) {
    const ball = pa.s === 'c' ? b : a, other = pa.s === 'c' ? pb : pa, oi = pa.s === 'c' ? a : b;
    if (other.s === 'c') {
      // two rainbow balls: everything goes, in a wave from the middle
      ctx.big = 3;
      consume(ball, 0); consume(oi, 0);
      ctx.ev.push({ t: 0, k: 'nova', i: b });
      const [r0, c0] = this.rc(b);
      this.cells.forEach((x, j) => { if (!x.v) { const [r, c] = this.rc(j); ctx.heap.push({ t: 250 + Math.hypot(r - r0, c - c0) * 70, k: 'clear', i: j, by: 'blast' }); } });
    } else {
      const col = other.c;
      consume(ball, 0);
      const targets = this.piecesOf(col, ctx);
      if (!other.s) {
        ctx.big = 1;
        ctx.ev.push({ t: 0, k: 'zap', i: ball, to: targets, c: col });
        targets.forEach((j, n) => ctx.heap.push({ t: 200 + n * 30, k: 'clear', i: j, by: 'blast' }));
      } else {
        // every piece of that colour turns into a stripe (or a bomb), then they all go off
        ctx.big = 2;
        ctx.ev.push({ t: 0, k: 'zap', i: ball, to: targets, c: col });
        targets.forEach((j, n) => {
          const x = this.cells[j];
          const s = other.s === 'b' ? 'b' : (this.rng() < 0.5 ? 'h' : 'v');
          if (j !== oi && !x.bub) { const old = x.p.id; x.p = this.newPiece(col, s); ctx.ev.push({ t: 200 + n * 30, k: 'make', i: j, p: x.p, old, quiet: true }); }
          ctx.heap.push({ t: 700 + n * 110, k: 'clear', i: j, by: 'blast' });
        });
      }
    }
  } else if (S.has('b') && S.size === 1) {
    consume(a, 0); consume(b, 0);
    ctx.big = 2;
    ctx.ev.push({ t: 0, k: 'bomb', i: b, rad: 4, c: pa.c });
    for (const [j, d] of this.diamond(b, 4)) ctx.heap.push({ t: 60 + d * 45, k: 'clear', i: j, by: 'blast' });
  } else if (S.has('b')) {
    // stripe + bomb: three rows and three columns
    consume(a, 0); consume(b, 0);
    ctx.big = 2;
    const [r, c] = this.rc(b);
    for (let k = -1; k <= 1; k++) {
      for (const [dir, j0] of [['h', this.idx(r + k, c)], ['v', this.idx(r, c + k)]]) {
        if (j0 < 0) continue;
        ctx.ev.push({ t: 40, k: 'beam', i: j0, dir, c: pa.c, wide: true });
        for (const [j, d] of this.line(j0, dir)) ctx.heap.push({ t: 40 + d * 26, k: 'clear', i: j, by: 'blast' });
      }
    }
  } else {
    // two stripes: a cross
    consume(a, 0); consume(b, 0);
    ctx.big = 1;
    for (const dir of ['h', 'v']) {
      ctx.ev.push({ t: 0, k: 'beam', i: b, dir, c: pa.c });
      for (const [j, d] of this.line(b, dir)) ctx.heap.push({ t: d * 26, k: 'clear', i: j, by: 'blast' });
    }
  }
  return this.run(ctx);
};

// ---------- end of the level: every move left turns a piece into a stripe ----------
Board.prototype.bonus = function () {
  const phases = [];
  let guard = 0;
  while (guard++ < 40) {
    const ctx = this.newCtx(1);
    let t = 0;
    const left = this.moves;
    if (left > 0) {
      const pool = [];
      this.cells.forEach((x, i) => { if (!x.v && !x.box && !x.bub && x.p && x.p.k === 'a' && !x.p.s) pool.push(i); });
      for (let n = 0; n < left && pool.length; n++) {
        const i = pool.splice(Math.floor(this.rng() * pool.length), 1)[0];
        const x = this.cells[i], old = x.p.id;
        x.p = this.newPiece(x.p.c, this.rng() < 0.5 ? 'h' : 'v');
        this.score += PTS.bonus;
        ctx.ev.push({ t, k: 'make', i, p: x.p, old, bonus: true, pts: PTS.bonus });
        t += 140;
      }
      this.moves = 0;
    }
    const specials = [];
    this.cells.forEach((x, i) => { if (!x.v && !x.box && x.p && x.p.k === 'a' && x.p.s) specials.push(i); });
    if (!specials.length) break;
    specials.forEach((i, n) => ctx.heap.push({ t: t + 300 + n * 160, k: 'clear', i, by: 'blast' }));
    phases.push(this.run(ctx));
    this.cascade(phases, 1, []);
  }
  return phases;
};

// ---------- moves left? hints, shuffling ----------
Board.prototype.lineLen = function (i, col, dr, dc) {
  const [r, c] = this.rc(i); let n = 0;
  for (let k = 1; ; k++) { if (this.colorAt(this.idx(r + dr * k, c + dc * k)) !== col) break; n++; }
  return n;
};
Board.prototype.matchAt = function (i) {
  const col = this.colorAt(i);
  if (col < 0) return 0;
  const h = 1 + this.lineLen(i, col, 0, -1) + this.lineLen(i, col, 0, 1);
  const v = 1 + this.lineLen(i, col, -1, 0) + this.lineLen(i, col, 1, 0);
  return (h >= 3 ? h : 0) + (v >= 3 ? v : 0);
};
Board.prototype.allMoves = function () {
  const out = [];
  for (let i = 0; i < this.cells.length; i++) {
    if (!this.movable(i)) continue;
    const [r, c] = this.rc(i);
    for (const j of [this.idx(r, c + 1), this.idx(r + 1, c)]) {
      if (j < 0 || !this.movable(j)) continue;
      const A = this.cells[i], B = this.cells[j];
      if (this.isCombo(A.p, B.p)) {
        const v = (A.p.s === 'c' || B.p.s === 'c' ? 12 : 8) + (A.p.s === 'c' && B.p.s === 'c' ? 30 : 0);
        out.push({ a: i, b: j, v }); continue;
      }
      const pa = A.p, pb = B.p; A.p = pb; B.p = pa;
      const v = this.matchAt(i) + this.matchAt(j);
      A.p = pa; B.p = pb;
      if (v) out.push({ a: i, b: j, v });
    }
  }
  return out;
};
Board.prototype.hasMove = function () { return this.allMoves().length > 0; };
Board.prototype.hint = function () {
  const m = this.allMoves();
  if (!m.length) return null;
  m.sort((x, y) => y.v - x.v);
  const top = m.filter(x => x.v === m[0].v);
  return top[Math.floor(this.rng() * top.length)];
};
// shuffle the plain animals among their cells until there is a move and no ready-made match
Board.prototype.shuffle = function () {
  const cells = [];
  this.cells.forEach((x, i) => { if (!x.v && !x.box && !x.bub && x.p && x.p.k === 'a' && !x.p.s) cells.push(i); });
  const before = new Map(cells.map(i => [this.cells[i].p.id, i]));
  const pieces = cells.map(i => this.cells[i].p);
  for (let tries = 0; tries < 300; tries++) {
    for (let k = pieces.length - 1; k > 0; k--) { const j = Math.floor(this.rng() * (k + 1)); [pieces[k], pieces[j]] = [pieces[j], pieces[k]]; }
    if (tries > 150) pieces.forEach(p => { p.c = this.randColor(); });
    cells.forEach((i, k) => { this.cells[i].p = pieces[k]; });
    if (!this.findMatches().length && this.hasMove()) break;
  }
  return { type: 'shuffle', moves: cells.map(i => ({ id: this.cells[i].p.id, from: before.get(this.cells[i].p.id), to: i, c: this.cells[i].p.c })) };
};

Board.prototype.won = function () { return this.goals.every(g => g.left <= 0); };
Board.prototype.stars = function () {
  if (!this.won()) return 0;
  const s = this.lv.stars;
  return this.score >= s[2] ? 3 : this.score >= s[1] ? 2 : 1;
};

// how excited to sound after (part of) a turn: 0 nothing, 1 Good … 5 Unbelievable
function excitement(phases) {
  let cascades = 0, cleared = 0, acts = 0, big = 0;
  for (const ph of phases) if (ph.type === 'clear') { cascades = Math.max(cascades, ph.cascade); cleared += ph.cleared; acts += ph.acts; big = Math.max(big, ph.big || 0); }
  const made = phases.reduce((n, ph) => n + (ph.makes ? ph.makes.filter(m => m.s === 'c').length * 2 + ph.makes.length : 0), 0);
  const x = Math.max(cascades - 1, 0) * 1.0 + cleared / 9 + acts * 0.6 + made * 0.5 + big * 1.5;
  let lvl = x >= 7 ? 5 : x >= 5.2 ? 4 : x >= 3.8 ? 3 : x >= 2.6 ? 2 : x >= 1.7 ? 1 : 0;
  // making a special piece always gets a cheer: "Great!" for a striped one, "Excellent!" for a bomb, "Unbelievable!" for a rainbow ball
  for (const ph of phases) for (const m of ph.makes || []) lvl = Math.max(lvl, m.s === 'c' ? 5 : m.s === 'b' ? 3 : 2);
  return lvl;
}
