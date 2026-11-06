// 五子棋 · the rules and the computer players. Nothing here touches the page: dev/test.js runs it in node to play the
// levels against each other. Free-style rules for children: five or more in a row wins, black moves first, no
// forbidden moves (禁手).
//
// The players all look at the board the same way, through its "windows": every line of five cells. A window that
// holds only one colour is worth something to that colour (more stones, more worth), a window with both colours is
// dead. Counting stones per window is kept up to date as stones go on and come off, so judging a move or a position is
// cheap. Four players, from a beginner to a strong one (LEVELS):
//   0 小黄鸡 picks among good-looking moves at random, often misses a four
//   1 小兔子 picks among the best few, usually blocks a four
//   2 小狐狸 always the best-looking move (attack and defence together), always blocks
//   3 猫头鹰 also looks ahead: wins by a run of fours when it can (VCF), searches a few moves deep (alpha-beta), and
//            defends against the other side's run of fours
const Gomoku = (() => {
  const DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];
  // a move's worth: windows through the cell, by how many of my stones (OWN) or the other side's (OPP) are in them
  // already; an empty window 7 (the classic five-tuple table)
  const OWN = [7, 35, 800, 15000, 800000], OPP = [7, 15, 400, 1800, 100000];
  // a position's worth for the search: windows holding only one colour, by how many stones
  const V = [0, 2, 25, 300, 4000, 0];
  const WIN = 1e9;

  const geo = {};
  function geometry(n) {
    if (geo[n]) return geo[n];
    const wins = [], cellWins = Array.from({ length: n * n }, () => []);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) for (const [dx, dy] of DIRS) {
      const ex = x + dx * 4, ey = y + dy * 4;
      if (ex < 0 || ex >= n || ey < 0 || ey >= n) continue;
      const w = [];
      for (let k = 0; k < 5; k++) w.push((y + dy * k) * n + x + dx * k);
      const id = wins.length; wins.push(w); w.forEach(i => cellWins[i].push(id));
    }
    const near = [];
    for (let i = 0; i < n * n; i++) {
      const x = i % n, y = (i / n) | 0, out = [];
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const X = x + dx, Y = y + dy;
        if ((dx || dy) && X >= 0 && X < n && Y >= 0 && Y < n) out.push(Y * n + X);
      }
      near.push(out);
    }
    return (geo[n] = { wins, cellWins, near });
  }

  // a board: stones, whose turn, the moves so far, and the window counts
  class Pos {
    constructor(n) {
      const g = this.g = geometry(n);
      this.n = n; this.b = new Int8Array(n * n); this.moves = []; this.turn = 1; this.winner = 0; this.line = null;
      this.cnt = [null, new Int8Array(g.wins.length), new Int8Array(g.wins.length)];
      this.nearCnt = new Int16Array(n * n); this.tot = [0, 0, 0];
    }
    clone() {
      const p = new Pos(this.n);
      this.moves.forEach(i => p.play(i));
      return p;
    }
    // a stone of colour c on cell i (no checks), keeping the counts
    put(i, c) {
      const o = 3 - c, A = this.cnt[c], B = this.cnt[o], tot = this.tot;
      this.b[i] = c;
      for (const w of this.g.cellWins[i]) {
        if (B[w] === 0) tot[c] -= V[A[w]];
        else if (A[w] === 0) tot[o] -= V[B[w]];
        A[w]++;
        if (B[w] === 0) tot[c] += V[A[w]];
      }
      for (const j of this.g.near[i]) this.nearCnt[j]++;
    }
    take(i, c) {
      const o = 3 - c, A = this.cnt[c], B = this.cnt[o], tot = this.tot;
      this.b[i] = 0;
      for (const w of this.g.cellWins[i]) {
        if (B[w] === 0) tot[c] -= V[A[w]];
        A[w]--;
        if (B[w] === 0) tot[c] += V[A[w]];
        else if (A[w] === 0) tot[o] += V[B[w]];
      }
      for (const j of this.g.near[i]) this.nearCnt[j]--;
    }
    // ---------- the game itself ----------
    play(i) {
      if (this.winner || i < 0 || i >= this.b.length || this.b[i]) return false;
      const c = this.turn;
      this.put(i, c); this.moves.push(i);
      const line = this.fiveThrough(i, c);
      if (line) { this.winner = c; this.line = line; }
      else if (this.moves.length === this.b.length) this.winner = 3;   // the board is full: a draw
      this.turn = 3 - c;
      return true;
    }
    undo() {
      const i = this.moves.pop();
      if (i == null) return false;
      const c = this.b[i];
      this.take(i, c); this.turn = c; this.winner = 0; this.line = null;
      return true;
    }
    // the whole row through i if colour c has five or more there (for drawing the winning line), else null
    fiveThrough(i, c) {
      const n = this.n, x0 = i % n, y0 = (i / n) | 0;
      for (const [dx, dy] of DIRS) {
        const run = [i];
        for (const s of [1, -1]) {
          let x = x0 + dx * s, y = y0 + dy * s;
          while (x >= 0 && x < n && y >= 0 && y < n && this.b[y * n + x] === c) { run.push(y * n + x); x += dx * s; y += dy * s; }
        }
        if (run.length >= 5) return run.sort((a, b) => a - b);
      }
      return null;
    }
    // ---------- what the players look at ----------
    // cells where colour c would make five at once
    fives(c) {
      const A = this.cnt[c], B = this.cnt[3 - c], wins = this.g.wins, out = [];
      for (let w = 0; w < wins.length; w++) {
        if (A[w] !== 4 || B[w] !== 0) continue;
        for (const i of wins[w]) if (!this.b[i] && !out.includes(i)) out.push(i);
      }
      return out;
    }
    // empty cells worth a look: near a stone (the middle on an empty board)
    cands() {
      const out = [];
      if (!this.moves.length) return [((this.n * this.n) / 2) | 0];
      for (let i = 0; i < this.b.length; i++) if (!this.b[i] && this.nearCnt[i] > 0) out.push(i);
      return out;
    }
    // how good a move on empty cell i is for colour c: attack and defence in one number
    score(i, c) {
      const A = this.cnt[c], B = this.cnt[3 - c];
      let s = 0;
      for (const w of this.g.cellWins[i]) {
        const a = A[w], b = B[w];
        if (a && b) continue;
        s += a ? OWN[a] : b ? OPP[b] : OWN[0];
      }
      return s;
    }
    ranked(c) { return this.cands().map(i => [i, this.score(i, c)]).sort((p, q) => q[1] - p[1]); }
    // the position for colour c to move: its windows against the other side's (having the move is worth a bit)
    value(c) { return this.tot[c] * 1.2 - this.tot[3 - c]; }
    // would colour c playing i make a four (a cell where it then makes five)?
    makesFour(i, c) {
      const A = this.cnt[c], B = this.cnt[3 - c];
      for (const w of this.g.cellWins[i]) if (A[w] === 3 && B[w] === 0) return true;
      return false;
    }
    // cells where colour c would get two ways to make five at once (an open four, or two fours): what must be
    // blocked before it happens. These are the ends of an open three and the like.
    doubles(c) {
      const out = [];
      for (const i of this.cands()) {
        if (!this.makesFour(i, c)) continue;
        this.put(i, c);
        if (this.fives(c).length >= 2) out.push(i);
        this.take(i, c);
      }
      return out;
    }
  }

  // ---------- looking ahead ----------
  // a run of fours (VCF) for colour c: each move makes a four, the other side must block it, until two fives are
  // threatened at once. The first move, or -1. budget: positions it may look at.
  function vcf(p, c, depth, budget) {
    const o = 3 - c;
    const mine = p.fives(c);
    if (mine.length) return mine[0];
    if (depth <= 0 || budget.n <= 0 || p.fives(o).length) return -1;
    const tries = p.cands().filter(i => p.makesFour(i, c)).map(i => [i, p.score(i, c)]).sort((a, b) => b[1] - a[1]);
    for (const [i] of tries) {
      if (--budget.n <= 0) return -1;
      p.put(i, c);
      const threats = p.fives(c);
      let won = false;
      if (threats.length >= 2) won = true;
      else if (threats.length === 1) {
        const t = threats[0];
        p.put(t, o);
        // the block itself must not make five for the other side
        if (!p.g.cellWins[t].some(w => p.cnt[o][w] === 5)) won = vcf(p, c, depth - 1, budget) >= 0;
        p.take(t, o);
      }
      p.take(i, c);
      if (won) return i;
    }
    return -1;
  }

  // alpha-beta: the value of the position for colour c to move
  function search(p, c, depth, alpha, beta, ply, clock) {
    const o = 3 - c;
    if (p.fives(c).length) return WIN - ply;
    const theirs = p.fives(o);
    let cands, forced = false;
    if (theirs.length > 1) return -WIN + ply + 1;
    if (theirs.length === 1) { cands = theirs; forced = true; }
    else {
      if (depth <= 0 || ply >= 14) return p.value(c);
      cands = p.ranked(c).slice(0, ply < 2 ? 12 : 8).map(x => x[0]);
    }
    let best = -Infinity;
    for (const i of cands) {
      if (clock.out()) break;
      p.put(i, c);
      const v = -search(p, o, forced ? depth : depth - 1, -beta, -alpha, ply + 1, clock);
      p.take(i, c);
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (alpha >= beta) break;
    }
    return best === -Infinity ? p.value(c) : best;
  }

  function weighted(list, weights) {
    const w = weights.slice(0, list.length), sum = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let k = 0; k < list.length; k++) { r -= w[k]; if (r < 0) return list[k]; }
    return list[0];
  }

  // the computer's move for the side to move, by level (0-3); ms: how long the strongest may think
  function move(pos, level, ms = 900) {
    const p = pos.clone(), c = p.turn, o = 3 - c;
    if (!p.moves.length) return p.cands()[0];
    const mine = p.fives(c), theirs = p.fives(o), r = Math.random();
    if (level === 0) {
      if (mine.length && r < 0.7) return mine[0];
      if (theirs.length && Math.random() < 0.45) return theirs[0];
      const top = p.ranked(c).slice(0, 8).map(x => x[0]);
      return Math.random() < 0.15 ? top[top.length - 1] : weighted(top, [5, 4, 4, 3, 3, 2, 2, 1]);
    }
    if (mine.length) return mine[0];
    if (theirs.length && (level > 1 || r < 0.9)) return theirs[0];
    const ranked = p.ranked(c);
    if (level === 1) return weighted(ranked.slice(0, 3).map(x => x[0]), [6, 3, 1]);
    if (level === 2) {
      const best = ranked[0][1], close = ranked.filter(x => x[1] >= best * 0.97).map(x => x[0]);
      return close[(Math.random() * close.length) | 0];
    }
    // 猫头鹰
    if (theirs.length) return theirs[0];
    const win = vcf(p, c, 12, { n: 6000 });
    if (win >= 0) return win;
    const t0 = Date.now(), clock = { out: () => Date.now() - t0 > ms };
    let order = ranked.slice(0, 12).map(x => x[0]), vals = new Map();
    for (let depth = 2; depth <= 6; depth += 2) {
      const got = new Map();
      for (const i of order) {
        if (clock.out()) break;
        p.put(i, c);
        got.set(i, -search(p, o, depth - 1, -Infinity, Infinity, 1, clock));
        p.take(i, c);
      }
      if (got.size === order.length) vals = got;   // a depth only counts when it was searched through
      else { got.forEach((v, i) => { if (!vals.has(i)) vals.set(i, v); }); break; }
      order = order.slice().sort((a, b) => vals.get(b) - vals.get(a));
      if (vals.get(order[0]) >= WIN - 20) break;
    }
    order.sort((a, b) => (vals.get(b) ?? -Infinity) - (vals.get(a) ?? -Infinity));
    // the best move after which the other side has no run of fours
    for (const i of order.slice(0, 6)) {
      p.put(i, c);
      const theirRun = vcf(p, o, 10, { n: 2500 });
      p.take(i, c);
      if (theirRun < 0) return i;
    }
    return order[0];
  }

  // a good move to suggest to a child (💡): the fox's choice, or a run of fours when there is one
  function hint(pos) {
    const p = pos.clone(), c = p.turn, o = 3 - c;
    const mine = p.fives(c); if (mine.length) return mine[0];
    const theirs = p.fives(o); if (theirs.length) return theirs[0];
    const win = vcf(p, c, 8, { n: 2000 }); if (win >= 0) return win;
    return p.ranked(c)[0][0];
  }

  // what the side to move should watch out for: cells where the other side makes five next move (urgent), and cells
  // where it would make an open four or two fours (block one of these now)
  function dangers(pos) {
    const p = pos.clone(), o = 3 - p.turn;
    const urgent = p.fives(o);
    return { urgent, soon: urgent.length ? [] : p.doubles(o) };
  }

  return { Pos, move, hint, dangers, vcf, geometry, WIN };
})();
if (typeof module !== 'undefined') module.exports = Gomoku;
