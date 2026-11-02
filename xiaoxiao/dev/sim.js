// Play every level many times with two robot players, to set moves and star scores (and catch rule bugs).
//   node xiaoxiao/dev/sim.js            all levels, 200 games per robot
//   node xiaoxiao/dev/sim.js 3 500      level 3 only, 500 games
//   node xiaoxiao/dev/sim.js 0 100      all levels, 100 games
// The robots are in bots.js. A level is about right when greedy wins it most of the time and random sometimes.
const { LEVELS, play, pct } = require('./bots.js');

const only = +process.argv[2] ? [+process.argv[2] - 1] : LEVELS.map((_, i) => i);   // 0 or nothing: every level
const N = +(process.argv[3] || 200);
for (const li of only) {
  const row = [`L${li + 1} ${LEVELS[li].name}`.padEnd(14)];
  for (const bot of ['random', 'greedy']) {
    const res = [];
    for (let k = 0; k < (bot === 'greedy' ? Math.ceil(N / 2) : N); k++) res.push(play(LEVELS[li], bot, 1000 * li + k + (bot === 'greedy' ? 7e5 : 0)));
    const wins = res.filter(r => r.won), sc = wins.map(r => r.score);
    const pr = res.reduce((a, r) => a.map((v, i) => v + r.praise[i]), [0, 0, 0, 0, 0, 0]).map(v => (v / res.length).toFixed(1));
    const st = [1, 2, 3].map(s => Math.round(100 * res.filter(r => r.stars >= s).length / res.length));
    row.push(`${bot}: win ${Math.round(100 * wins.length / res.length)}%  score p50 ${pct(sc, 0.5)} p85 ${pct(sc, 0.85)}  stars≥1/2/3 ${st.join('/')}%  praise/game ${pr.slice(1).join(' ')}  shuffles ${(res.reduce((a, r) => a + r.shuffles, 0) / res.length).toFixed(2)}`);
  }
  console.log(row.join('\n   '));
}
