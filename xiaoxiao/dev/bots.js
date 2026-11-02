// The two robot players and what they need, shared by sim.js (checks the levels) and gen.js (makes and tunes them).
// "random" picks any move that works, like a child who just looks for a match; "greedy" tries every move and keeps the
// one that helps the goals most, like a careful player who does not plan ahead. A six-year-old with some practice
// lands in between.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const ctx = vm.createContext({ Math, console });
vm.runInContext(src('board.js') + '\n' + src('levels.js') + '\n' + src('levels2.js') +
  '\n;this.Board = Board; this.LEVELS = LEVELS; this.ISLANDS = ISLANDS; this.mulberry32 = mulberry32; this.excitement = excitement;', ctx);
const { Board, LEVELS, ISLANDS, mulberry32, excitement } = ctx;

function clone(b) {
  const o = Object.create(Board.prototype);
  Object.assign(o, b);
  o.cells = b.cells.map(x => Object.assign({}, x, { p: x.p && Object.assign({}, x.p) }));
  o.goals = b.goals.map(g => Object.assign({}, g));
  o.pg = Object.assign({}, b.pg);
  o.lift = new Set(b.lift);
  o.rng = Math.random;
  return o;
}
// how far from done: each goal 0..1, with part marks for a cracked egg, a penguin or a balloon on its way
function need(b) {
  return b.goals.reduce((n, g) => {
    const N = Math.max(1, g.n);
    if (g.t === 'pg') {
      let far = (b.pg.total - b.pg.made);
      b.cells.forEach((x, i) => { if (x.p && x.p.k === 'g') far += (b.R - 1 - b.rc(i)[0]) / b.R + 0.1; });
      return n + far / N;
    }
    if (g.t === 'egg') { let hp = 0; b.cells.forEach(x => { if (x.p && x.p.k === 'e') hp += x.p.hp / 2; }); return n + hp / N; }
    if (g.t === 'bl') { let far = 0; b.cells.forEach((x, i) => { if (x.p && x.p.k === 'l') far += (b.rc(i)[0] + 1) / b.R; }); return n + far / N; }
    return n + g.left / N;
  }, 0);
}
function check(b) {
  // invariants: nothing floating over a hole, no matches left lying on the board, no piece inside a box
  b.cells.forEach((x, i) => {
    if (x.v && x.p) throw new Error('piece in a void at ' + i);
    if (x.box && x.p) throw new Error('piece inside a box at ' + i);
    if (!x.v && !x.box && !x.p) throw new Error('empty cell after a turn at ' + i);
    if (x.cage >= 0 && (!x.p || x.p.k !== 'a' || x.p.c !== x.cage)) throw new Error('cage without its animal at ' + i);
  });
  if (b.findMatches().length) throw new Error('matches left on the board');
}
// one game of level lv (an entry like those in LEVELS) by bot, the board's randomness from seed
function play(lv, bot, seed) {
  const b = new Board(lv, mulberry32(seed));
  let shuffles = 0; const praise = [0, 0, 0, 0, 0, 0];
  while (b.moves > 0 && !b.won()) {
    const moves = b.allMoves();
    if (!moves.length) { b.shuffle(); shuffles++; if (shuffles > 30) throw new Error('stuck'); continue; }
    let pick;
    if (bot === 'random') pick = moves[Math.floor(Math.random() * moves.length)];
    else {
      let best = -1e9;
      for (const m of moves) {
        const c = clone(b), n0 = need(c), s0 = c.score;
        const r = c.swap(m.a, m.b);
        if (!r.ok) continue;
        const v = (n0 - need(c)) * 1000 + (c.score - s0) * 0.02 + Math.random();
        if (v > best) { best = v; pick = m; }
      }
    }
    const r = b.swap(pick.a, pick.b);
    if (!r.ok) throw new Error('listed move did not work');
    praise[excitement(r.phases)]++;
    check(b);
  }
  const won = b.won(), used = lv.moves - b.moves;
  if (won) b.bonus();
  return { won, score: b.score, left: won ? 0 : need(b), shuffles, praise, stars: b.stars(), used };
}
const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
module.exports = { Board, LEVELS, ISLANDS, mulberry32, excitement, clone, need, check, play, pct };
