// 五子棋 · the computer players against each other (node wuziqi/dev/test.js [games]): every move legal, a stronger level
// wins most games against the one below it, and how long the strongest one thinks.
const G = require('./src/engine.js');
const N = +process.argv[2] || 20;
function game(lvBlack, lvWhite, n) {
  const p = new G.Pos(n), times = [];
  while (!p.winner) {
    const lv = p.turn === 1 ? lvBlack : lvWhite, t0 = Date.now();
    const i = G.move(p, lv, 700);
    if (lv === 3) times.push(Date.now() - t0);
    if (!p.play(i)) throw new Error(`illegal move ${i} by level ${lv}`);
  }
  return { winner: p.winner, moves: p.moves.length, times };
}
const pairs = [[1, 0, 11], [2, 1, 11], [3, 2, 15], [2, 0, 11]];
let worst = 0, allT = [];
for (const [hi, lo, n] of pairs) {
  let w = 0, l = 0, d = 0, len = 0;
  for (let k = 0; k < N; k++) {
    const hiBlack = k % 2 === 0, r = hiBlack ? game(hi, lo, n) : game(lo, hi, n);
    const hiColour = hiBlack ? 1 : 2;
    if (r.winner === 3) d++; else if (r.winner === hiColour) w++; else l++;
    len += r.moves; allT.push(...r.times); worst = Math.max(worst, ...r.times, 0);
  }
  console.log(`level ${hi} vs ${lo} on ${n}x${n}: ${w} won, ${l} lost, ${d} drawn (${N} games, ${Math.round(len / N)} moves a game)`);
}
allT.sort((a, b) => a - b);
console.log(`猫头鹰 thinks: median ${allT[allT.length >> 1]} ms, 90% ${allT[Math.floor(allT.length * 0.9)]} ms, longest ${worst} ms`);
// a few positions it must get right
const P = moves => { const p = new G.Pos(15); moves.forEach(([x, y]) => p.play(y * 15 + x)); return p; };
const at = i => [i % 15, (i / 15) | 0];
// black has four in a row on row 7 (3..6), white to move must block at 2 or 7
let p = P([[3, 7], [3, 9], [4, 7], [4, 9], [5, 7], [5, 9], [6, 7]]);
for (const lv of [1, 2, 3]) { const m = at(G.move(p, lv)); console.log(`level ${lv} blocks the four:`, (m[0] === 2 || m[0] === 7) && m[1] === 7 ? 'yes' : 'NO ' + m); }
// white (to move) has four on row 9 and can win at once
p = P([[3, 7], [3, 9], [4, 7], [4, 9], [5, 7], [5, 9], [10, 2], [6, 9], [11, 2]]);
for (const lv of [1, 2, 3]) { const m = at(G.move(p, lv)); console.log(`level ${lv} takes its five:`, (m[0] === 2 || m[0] === 7) && m[1] === 9 ? 'yes' : 'NO ' + m); }
// black has an open three (5..7 on row 7), white to move: the strong ones block an end
p = P([[5, 7], [9, 9], [6, 7], [9, 10], [7, 7]]);
const d = G.dangers(p);
console.log('dangers for white:', d.urgent.map(at).join(' '), '| soon:', d.soon.map(at).join(' '));
for (const lv of [2, 3]) { const m = at(G.move(p, lv)); console.log(`level ${lv} answers the open three at`, m.join(','), d.soon.some(i => at(i).join() === m.join()) ? '(an end)' : ''); }
