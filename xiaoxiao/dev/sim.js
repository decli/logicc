// Play every level many times with two robot players, to set moves and star scores (and catch rule bugs).
//   node xiaoxiao/dev/sim.js            all levels, 200 games per robot
//   node xiaoxiao/dev/sim.js 3 500      level 3 only, 500 games
//   node xiaoxiao/dev/sim.js 0 100      all levels, 100 games
// "random" picks any move that works, like a child who just looks for a match; "greedy" tries every move and keeps the
// one that helps the goals most, like a careful player who does not plan ahead. A six-year-old with some practice
// lands in between, so a level is about right when greedy wins it most of the time and random sometimes.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const ctx = vm.createContext({ Math, console });
vm.runInContext(src('board.js') + '\n' + src('levels.js') + '\n;this.Board = Board; this.LEVELS = LEVELS; this.mulberry32 = mulberry32; this.excitement = excitement;', ctx);
const { Board, LEVELS, mulberry32, excitement } = ctx;

function clone(b) {
  const o = Object.create(Board.prototype);
  Object.assign(o, b);
  o.cells = b.cells.map(x => Object.assign({}, x, { p: x.p && Object.assign({}, x.p) }));
  o.goals = b.goals.map(g => Object.assign({}, g));
  o.pg = Object.assign({}, b.pg);
  o.rng = Math.random;
  return o;
}
function need(b) {
  // how far from done: each goal 0..1; a penguin counts by how far it still has to walk down
  return b.goals.reduce((n, g) => {
    if (g.t !== 'pg') return n + g.left / Math.max(1, g.n);
    let far = (b.pg.total - b.pg.made);
    b.cells.forEach((x, i) => { if (x.p && x.p.k === 'g') far += (b.R - 1 - b.rc(i)[0]) / b.R + 0.1; });
    return n + far / Math.max(1, g.n);
  }, 0);
}
function check(b) {
  // invariants: nothing floating over a hole, no matches left lying on the board, no piece inside a box
  b.cells.forEach((x, i) => {
    if (x.v && x.p) throw new Error('piece in a void at ' + i);
    if (x.box && x.p) throw new Error('piece inside a box at ' + i);
    if (!x.v && !x.box && !x.p) throw new Error('empty cell after a turn at ' + i);
  });
  if (b.findMatches().length) throw new Error('matches left on the board');
}

function play(li, bot, seed) {
  const b = new Board(LEVELS[li], mulberry32(seed));
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
  const won = b.won();
  if (won) b.bonus();
  return { won, score: b.score, left: won ? 0 : need(b), shuffles, praise, stars: b.stars() };
}

const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
const only = +process.argv[2] ? [+process.argv[2] - 1] : LEVELS.map((_, i) => i);   // 0 or nothing: every level
const N = +(process.argv[3] || 200);
for (const li of only) {
  const row = [`L${li + 1} ${LEVELS[li].name}`.padEnd(14)];
  for (const bot of ['random', 'greedy']) {
    const res = [];
    for (let k = 0; k < (bot === 'greedy' ? Math.ceil(N / 2) : N); k++) res.push(play(li, bot, 1000 * li + k + (bot === 'greedy' ? 7e5 : 0)));
    const wins = res.filter(r => r.won), sc = wins.map(r => r.score);
    const pr = res.reduce((a, r) => a.map((v, i) => v + r.praise[i]), [0, 0, 0, 0, 0, 0]).map(v => (v / res.length).toFixed(1));
    const st = [1, 2, 3].map(s => Math.round(100 * res.filter(r => r.stars >= s).length / res.length));
    row.push(`${bot}: win ${Math.round(100 * wins.length / res.length)}%  score p50 ${pct(sc, 0.5)} p85 ${pct(sc, 0.85)}  stars≥1/2/3 ${st.join('/')}%  praise/game ${pr.slice(1).join(' ')}  shuffles ${(res.reduce((a, r) => a + r.shuffles, 0) / res.length).toFixed(2)}`);
  }
  console.log(row.join('\n   '));
}
