// 动物消消乐 · 第二季的关卡: made and tuned here, written to src/levels2.js (decli 2026-11-02: she won all ten levels;
// make it go on, the way the big match-3 games keep going for hundreds of levels).
//
//   node xiaoxiao/dev/gen.js          every island of season two, four at a time in parallel, then src/levels2.js
//   node xiaoxiao/dev/gen.js 2        island 2 only (ISLANDS[2], 花花草原) → dev/gen/isle-2.json, then src/levels2.js
//   node xiaoxiao/dev/gen.js write    src/levels2.js again from what is in dev/gen/
//
// How a level is made: a recipe from where it sits (its island's new thing, a few older ones, how hard it should be
// on the island's up-and-down curve), a board shape from SHAPES, everything placed with left-right symmetry, then the
// two robots of bots.js play it: the moves are the fewest with which the careful robot wins often enough for that
// level's tier, a few more if the random robot almost never wins; the stars come from the careful robot's scores.
// A layout the robots can't finish, or that leaves a hole nothing can fall into, is thrown away and another one made.
// Every island is made from its own seed, so running this again gives the same levels.
const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
module.exports = {};
const { Board, ISLANDS, mulberry32, play, pct } = require('./bots.js');

const OUT = path.join(__dirname, 'gen'), DEST = path.join(__dirname, 'src', 'levels2.js');
// the curve through an island's fifteen levels: 0 easy, 1 medium, 2 hard, 3 the island's big challenge
const SAW = [0, 0, 1, 1, 2, 0, 1, 1, 2, 1, 0, 1, 2, 2, 3];
// what the robots should do on each tier: the careful one (g) and the random one (r), win rates [low, high]
const TIER = [
  { g: [0.97, 1], r: [0.4, 1] },
  { g: [0.92, 1], r: [0.2, 0.75] },
  { g: [0.87, 0.97], r: [0.08, 0.45] },
  { g: [0.82, 0.94], r: [0.03, 0.3] },
];
const NAMES = {
  farm: ['蛋宝宝来啦', '小鸡破壳', '暖暖的鸡窝', '篱笆小院', '红色谷仓', '晒太阳', '向日葵田', '玉米地', '草垛迷宫', '小水车', '早起的公鸡', '拖拉机', '菜园子', '农场的晚上', '蛋蛋农场大挑战'],
  meadow: ['种下小草', '绿油油', '蒲公英', '小风车', '蝴蝶飞呀', '野餐垫', '编花环', '彩虹花田', '小溪边', '蜜蜂嗡嗡', '三叶草', '放风筝', '花的海洋', '星星草地', '花花草原大挑战'],
  sky: ['飞起来啦', '棉花糖云', '热气球', '彩虹桥', '风车云', '小鸟的家', '雨后天晴', '云朵滑梯', '星星灯', '月亮船', '气球派对', '天空花园', '流星雨', '晚霞', '云朵气球岛大挑战'],
  jungle: ['救救小伙伴', '大蘑菇', '小瀑布', '藤蔓桥', '树屋', '萤火虫', '香蕉林', '青苔石头', '竹林', '小木屋', '鹦鹉山谷', '森林小路', '魔法树', '月光森林', '森林营救大挑战'],
  castle: ['城堡大门', '彩虹长廊', '冰雪塔', '礼物房', '公主花园', '旋转楼梯', '宝石屋', '城堡厨房', '音乐厅', '镜子长廊', '高高的塔', '放烟花', '金色王冠', '星光舞会', '彩虹城堡大挑战'],
};
// older things that can join an island's new one, by island (the islands before it, and season one's)
const OLD = ['ice', 'box', 'bub', 'pg'];
const POOL = { egg: OLD, grass: [...OLD, 'egg'], bl: [...OLD, 'egg', 'grass'], cage: [...OLD, 'egg', 'grass', 'bl'], all: [...OLD, 'egg', 'grass', 'bl', 'cage'] };

// ---------- board shapes: which cells are void ('_'), as functions of row, column and the board's size ----------
const HEART = {
  8: ['_..__.._', '........', '........', '........', '........', '_......_', '__....__', '___..___'],
  9: ['__.._..__', '_......._', '.........', '.........', '.........', '_......._', '__.....__', '___...___', '____.____'],
};
const SHAPES = {
  full: () => false,
  corners: (r, c, R, C) => (r === 0 || r === R - 1) && (c === 0 || c === C - 1),
  bevel: (r, c, R, C) => Math.min(r, R - 1 - r) + Math.min(c, C - 1 - c) < 2,
  diamond: (r, c, R, C) => Math.abs(r - (R - 1) / 2) + Math.abs(c - (C - 1) / 2) > (R - 1) / 2 + 1.4,
  plus: (r, c, R, C) => (r < 2 || r > R - 3) && (c < 2 || c > C - 3),
  hourglass: (r, c, R, C) => (r >= 3 && r <= R - 4) && (c === 0 || c === C - 1),
  heart: (r, c, R) => HEART[R][r][c] === '_',
  castle: (r, c, R, C) => r === 0 && c % 2 === 1 && c !== (C - 1) / 2,
  arch: (r, c, R, C) => r >= R - 2 && Math.abs(c - (C - 1) / 2) < 1.1,
  mushroom: (r, c, R, C) => r >= R - 3 && (c < 2 || c > C - 3),
  wings: (r, c, R, C) => (r < 2 || r > R - 3) && Math.abs(c - (C - 1) / 2) < 0.6,
};
const SHAPE_KEYS = Object.keys(SHAPES);

// ---------- one level from a recipe ----------
function build(rec, rng) {
  const R = rec.size, C = rec.size, g = [], soil = [];
  const rnd = n => Math.floor(rng() * n);
  for (let r = 0; r < R; r++) { g.push([]); soil.push([]); for (let c = 0; c < C; c++) { g[r].push(SHAPES[rec.shape](r, c, R, C) ? '_' : '.'); soil[r].push('_'); } }
  const on = (r, c) => r >= 0 && c >= 0 && r < R && c < C && g[r][c] !== '_';
  const mirror = c => C - 1 - c;
  const left = () => { const out = []; for (let r = 0; r < R; r++) for (let c = 0; c <= (C - 1) / 2; c++) if (on(r, c)) out.push([r, c]); return out; };
  const set = (r, c, ch, grid = g) => { grid[r][c] = ch; grid[r][mirror(c)] = ch; };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cr = (R - 1) / 2, cc = (C - 1) / 2;
  // a region of cells (for ice and dirt): one of a few patterns, about n cells
  const REGION = {
    centre: (r, c, k) => Math.abs(r - cr) <= k && Math.abs(c - cc) <= k + 0.6,
    ring: (r, c, k) => Math.min(r, R - 1 - r, c, C - 1 - c) < k - 1,
    bottom: (r, c, k) => r >= R - k - 1,
    middle: (r, c, k) => Math.abs(r - cr) <= k * 0.75,
    diamond: (r, c, k) => Math.abs(r - cr) + Math.abs(c - cc) <= k + 1,
    checker: (r, c, k) => (r + c) % 2 === 0 && Math.abs(r - cr) <= k,
    cross: (r, c, k) => Math.abs(r - cr) <= 1 || Math.abs(c - cc) <= 1 - (C % 2 ? 0.5 : 0),
    stripes: (r, c, k) => r % 2 === 1 && r >= R - k * 2 - 1,
  };
  function region(n) {
    const keys = Object.keys(REGION), key = keys[rnd(keys.length)];
    let best = null;
    for (let k = 1; k <= R; k++) {
      const cells = left().filter(([r, c]) => REGION[key](r, c, k));
      const size = cells.reduce((s, [r, c]) => s + (c === mirror(c) ? 1 : 2), 0);
      if (!best || Math.abs(size - n) < Math.abs(best.size - n)) best = { cells, size };
      if (size >= n) break;
    }
    return best.cells;
  }
  // pairs of single cells, mirrored, in rows lo..hi, where ok(r, c) allows it; about n cells, each given ch(what was
  // there) straight away so the next pick sees it
  function points(n, lo, hi, ok, ch) {
    const cand = shuffle(left().filter(([r, c]) => r >= lo && r <= hi && ok(r, c)));
    const out = [];
    let size = 0;
    for (const [r, c] of cand) {
      if (size >= n) break;
      if (!ok(r, c)) continue;   // an earlier pick may have ruled it out
      out.push([r, c]); size += c === mirror(c) ? 1 : 2;
      g[r][c] = ch(g[r][c], r, c); g[r][mirror(c)] = ch(g[r][mirror(c)], r, mirror(c));
    }
    return out;
  }
  const free = (r, c) => on(r, c) && g[r][c] === '.';
  const near = (r, c, chs) => [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dr, dc]) => on(r + dr, c + dc) && chs.includes(g[r + dr][c + dc]));
  const overBalloon = (r, c) => { for (let k = r + 1; k < R; k++) if (on(k, c) && (g[k][c] === 'l' || g[k][mirror(c)] === 'l')) return true; return false; };
  const goals = [];
  const T = rec.tier, has = k => rec.parts.includes(k);
  if (has('grass')) {
    const n = [22, 30, 38, 46][T] + rnd(8);
    (n >= R * C - 6 ? left() : region(n)).forEach(([r, c]) => set(r, c, 'd', soil));
    goals.push({ t: 'grass' });
  }
  if (has('ice')) {
    const n = [12, 16, 22, 28][T] + rnd(6), cells = region(n), two = T >= 1 && rng() < 0.55;
    cells.forEach(([r, c]) => set(r, c, two && Math.abs(r - cr) + Math.abs(c - cc) < 2.6 ? 'I' : 'i'));
    goals.push({ t: 'ice' });
  }
  if (has('box')) {
    // 2x2 blocks or single boxes in the middle rows, never side by side along a row (the hole under two boxes in a row
    // can't be filled), two layers on harder levels
    const two = T >= 2 && rng() < 0.5, n = [4, 4, 6, 8][T];
    const ok = (r, c) => free(r, c) && !near(r, c, 'bB') && c !== mirror(c) - 1 && c !== mirror(c);
    points(n, 2, R - 3, ok, () => (two ? 'B' : 'b'));
    goals.push({ t: 'box' });
  }
  if (has('egg')) {
    const n = [4, 5, 6, 8][T] + (rec.main === 'egg' ? 1 : 0);
    const ok = (r, c) => (free(r, c) || g[r][c] === 'i') && !near(r, c, 'e');
    points(n, 0, R - 3, ok, () => 'e');
    goals.push({ t: 'egg' });
  }
  if (has('bl')) {
    // a balloon needs a clear way up: nothing above it that holds it down
    const n = [2, 3, 4, 5][T] + (rec.main === 'bl' ? 1 : 0);
    const up = (r, c) => { for (let k = r - 1; k >= 0; k--) if (!on(k, c) || !'.iId'.includes(g[k][c])) return false; return true; };
    const ok = (r, c) => free(r, c) && up(r, c) && !near(r, c, 'l');
    points(n, Math.floor(R / 2) - 1 + (T >= 2 ? 1 : 0), R - 1, ok, () => 'l');
    goals.push({ t: 'bl' });
  }
  if (has('cage')) {
    // each cage a kind of the level's animals, never two of a kind next to each other
    const n = [2, 4, 4, 6][T] + (rec.main === 'cage' ? 1 : 0);
    const ok = (r, c) => free(r, c) && !near(r, c, '012345') && !overBalloon(r, c);
    points(n, 1, R - 2, ok, () => '0').forEach(([r, c]) => {
      const kind = rec.colors[rnd(rec.colors.length)];
      g[r][c] = String(kind);
      // the mirrored one another kind if the pair touches (either side of the middle)
      const m = mirror(c); if (m !== c) g[r][m] = String(m === c + 1 ? rec.colors[(rec.colors.indexOf(kind) + 1) % rec.colors.length] : kind);
    });
    goals.push({ t: 'cage' });
  }
  if (has('bub')) {
    const n = [4, 6, 8, 10][T];
    const ok = (r, c) => (free(r, c) || g[r][c] === 'i') && !near(r, c, 'l') && !overBalloon(r, c);
    points(n, 1, R - 2, ok, was => (was === 'i' ? 'q' : 'o'));
    goals.push({ t: 'bub' });
  }
  let penguins = null;
  if (has('pg')) {
    // one pair (or one in the middle column) already on the board, the rest come down later
    const total = [1, 2, 2, 3][T], ok = (r, c) => free(r, c) || g[r][c] === 'i';
    const at = points(1, 0, 1, ok, was => (was === 'i' ? 'k' : 'g'));
    const placed = at.reduce((n, [r, c]) => n + (mirror(c) === c ? 1 : 2), 0);
    penguins = { total: Math.max(total, placed), max: 2 };
    goals.push({ t: 'pg' });
  }
  if (rec.collect) {
    const k = rec.colors[rnd(rec.colors.length)];
    goals.push({ t: 'c', color: k, n: [14, 16, 18, 20][T] + 2 * rnd(3) });
  }
  // the main goal first
  const order = ['egg', 'grass', 'bl', 'cage', 'ice', 'box', 'bub', 'pg', 'c'];
  goals.sort((a, b) => (a.t === rec.mainGoal ? -1 : b.t === rec.mainGoal ? 1 : order.indexOf(a.t) - order.indexOf(b.t)));
  const lv = { colors: rec.colors, moves: 40, layout: g.map(row => row.join('')), goals, stars: [1, 1e9, 1e9] };
  if (soil.some(row => row.includes('d'))) lv.soil = soil.map(row => row.join(''));
  if (penguins) lv.penguins = penguins;
  return lv;
}

// ---------- the robots decide the moves and the stars ----------
let seedN = 1;
function rate(lv, bot, n) {
  const res = [];
  for (let k = 0; k < n; k++) res.push(play(lv, bot, 9e5 + seedN++));
  return { win: res.filter(r => r.won).length / n, res };
}
function tune(lv, tier) {
  const tg = TIER[tier];
  // fewest moves with which the careful robot wins often enough (a rough search, then checked with more games)
  // between 15 moves (fewer feels rushed) and 36 (more is a slog for a six-year-old): a layout that needs more is
  // thrown away
  let lo = 14, hi = 36;
  if (rate(Object.assign({}, lv, { moves: hi }), 'greedy', 16).win < tg.g[0] - 0.1) return null;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rate(Object.assign({}, lv, { moves: mid }), 'greedy', 24).win >= tg.g[0]) hi = mid; else lo = mid;
  }
  let moves = Math.max(15, hi), G, Rr;
  for (let k = 0; k < 6; k++) {
    const t = Object.assign({}, lv, { moves });
    G = rate(t, 'greedy', 60); Rr = rate(t, 'random', 120);
    if (moves >= 38) break;
    if (G.win < tg.g[0] - 0.02) { moves++; continue; }
    if (Rr.win < tg.r[0] && G.win < 0.995) { moves++; continue; }   // too hard for a child who doesn't plan: a little more room
    break;
  }
  const scores = G.res.filter(r => r.won).map(r => r.score);
  const round = v => Math.max(500, Math.round(v / 500) * 500);
  const s2 = round(pct(scores, 0.25)), s3 = Math.max(s2 + 1000, round(pct(scores, 0.65)));
  const off = Math.max(0, tg.g[0] - G.win) * 4 + Math.max(0, G.win - tg.g[1]) * 2 + Math.max(0, tg.r[0] - Rr.win) * 2 + Math.max(0, Rr.win - tg.r[1]);
  return { lv: Object.assign({}, lv, { moves, stars: [1, s2, s3] }), greedy: G.win, random: Rr.win, off };
}

// ---------- an island ----------
function island(k) {
  const isle = ISLANDS[k], rng = mulberry32(4242 + k * 977), rnd = n => Math.floor(rng() * n);
  const out = [];
  let lastShape = '';
  for (let j = 0; j < isle.n; j++) {
    const tier = SAW[j], boss = tier === 3;
    let best = null;
    // a recipe that keeps coming out too hard gets gentler every three tries (fewer older things, fewer of each); the
    // difficulty it is tuned to stays the same
    for (let attempt = 0; attempt < 12 && !(best && best.off < 0.08); attempt++) {
      const ease = Math.floor(attempt / 3);
      // what is in it: the island's new thing (on the last island, two of everything), and older ones as it goes on
      const main = isle.mech === 'all' ? ['egg', 'grass', 'bl', 'cage'][j % 4] : isle.mech;
      const pool = POOL[isle.mech].filter(p => p !== main);
      const nOld = Math.max(0, (j < 2 ? 0 : [rnd(2), 1, 1 + rnd(2), 2][tier] + (isle.mech === 'all' && j >= 2 ? 1 : 0)) - ease);
      const parts = [main];
      while (parts.length < 1 + nOld) { const p = pool[rnd(pool.length)]; if (!parts.includes(p) && !(p === 'pg' && parts.includes('bl'))) parts.push(p); }
      const six = tier >= 2 && k >= 3 && rng() < 0.25;
      let shape = j < 2 ? 'full' : SHAPE_KEYS[rnd(SHAPE_KEYS.length)];
      if (shape === lastShape) shape = 'full';
      const rec = {
        size: boss || (tier === 2 && rng() < 0.3) ? 9 : 8, shape, tier: Math.max(0, tier - ease), main, mainGoal: main, parts,
        colors: six ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4], collect: j >= 1 && rng() < (tier ? 0.35 : 0.5),
      };
      let lv;
      try { lv = build(rec, rng); new Board(lv, mulberry32(1)); } catch (e) { continue; }
      if (lv.goals.some(g => g.t !== 'c' && g.t !== 'pg' && !new Board(lv, mulberry32(1)).goals.find(x => x.t === g.t).n)) continue;   // a part that found no room
      let t;
      try { t = tune(lv, tier); } catch (e) { process.stderr.write(`  isle ${k} level ${j + 1}: ${e.message}\n`); continue; }
      if (!t) continue;
      t.shape = shape;
      if (!best || t.off < best.off) best = t;
    }
    if (!best) throw new Error(`island ${k} level ${j + 1}: no level came out`);
    lastShape = best.shape;
    const lv = Object.assign({ name: NAMES[isle.id][j] }, best.lv);
    if (j === 0) lv.tip = isle.mech === 'all' ? 'castle' : isle.mech;
    lv.sim = { greedy: Math.round(best.greedy * 100), random: Math.round(best.random * 100), tier };
    out.push(lv);
    process.stdout.write(`  ${isle.name} ${j + 1}/${isle.n}  ${lv.name}  moves ${lv.moves}  greedy ${lv.sim.greedy}%  random ${lv.sim.random}%  tier ${tier}  ${best.shape}\n`);
  }
  return out;
}

// ---------- src/levels2.js ----------
function write() {
  const parts = ['// 动物消消乐 · 第二季的关卡 (ISLANDS in levels.js). Made by dev/gen.js — change gen.js and run it again rather than',
    '// editing this file. sim: how often the careful and the random robot won it, and its place on the curve (tier 0-3).', 'LEVELS.push('];
  ISLANDS.forEach((isle, k) => {
    if (!isle.mech) return;
    const f = path.join(OUT, `isle-${k}.json`);
    if (!fs.existsSync(f)) throw new Error('missing ' + f);
    parts.push(`  // ---- ${isle.name}: levels ${isle.from + 1}-${isle.from + isle.n} ----`);
    for (const lv of JSON.parse(fs.readFileSync(f, 'utf8'))) {
      const { layout, soil, ...rest } = lv;
      let s = '  ' + JSON.stringify(rest).replace(/"(\w+)":/g, '$1: ').replace(/,(?=[a-z])/g, ', ');
      s = s.slice(0, -1) + `, layout: [${layout.map(r => `'${r}'`).join(', ')}]` + (soil ? `, soil: [${soil.map(r => `'${r}'`).join(', ')}]` : '') + ' },';
      parts.push(s);
    }
  });
  parts.push(');', '');
  fs.writeFileSync(DEST, parts.join('\n'));
  console.log('wrote ' + DEST);
}

const arg = process.argv[2];
if (arg === 'write') write();
else if (arg) {
  const k = +arg;
  fs.mkdirSync(OUT, { recursive: true });
  const levels = island(k);
  fs.writeFileSync(path.join(OUT, `isle-${k}.json`), JSON.stringify(levels));
} else {
  // one process per island, four at a time
  const todo = ISLANDS.map((s, k) => k).filter(k => ISLANDS[k].mech);
  let running = 0, failed = false;
  const next = () => {
    if (!todo.length) { if (!running) { if (failed) process.exit(1); write(); } return; }
    const k = todo.shift(); running++;
    const p = execFile(process.execPath, [__filename, String(k)], { maxBuffer: 1 << 24 }, err => { running--; if (err) { failed = true; console.error(err.message); } next(); });
    p.stdout.pipe(process.stdout); p.stderr.pipe(process.stderr);
  };
  for (let i = 0; i < 4; i++) next();
}
