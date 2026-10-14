// 动物消消乐 · the levels. Add a level by adding an entry; the map, the voice lines and the simulator pick it up.
//
//   colors   which animals take part (0 小猪 1 熊猫 2 河马 3 长颈鹿 4 鹦鹉 5 小青蛇); six kinds is much harder than five
//   layout   one string per row: . cell  _ no cell  i/I ice 1/2 layers  b/B gift box 1/2 layers  o bubble
//            q bubble on ice  g penguin  k penguin on ice
//   goals    c: collect n of one animal; ice / box / bub: clear all of them; pg: bring the penguins out at the bottom
//   penguins total that will come, at most max on the board at a time (the g cells count towards total)
//   stars    score for 1, 2, 3 stars (1 star also needs every goal)
//   tip      the new thing this level teaches, shown and said before it starts
// Moves and star scores were set with dev/sim.js (see dev/README.md): a careful player should usually win; three stars
// take some luck or a big combo.
const LEVELS = [
  {
    name: '小猪和熊猫', colors: [0, 1, 2, 3, 4], moves: 18,
    goals: [{ t: 'c', color: 0, n: 18 }, { t: 'c', color: 1, n: 18 }],
    stars: [1, 8000, 11000], tip: 'swap',
  },
  {
    name: '心形冰块', colors: [0, 1, 2, 3, 4], moves: 28,
    layout: [
      '........',
      '.ii..ii.',
      'iiiiiiii',
      'iiiiiiii',
      '.iiiiii.',
      '..iiii..',
      '...ii...',
      '........',
    ],
    goals: [{ t: 'ice' }],
    stars: [1, 14500, 17000], tip: 'ice',
  },
  {
    name: '拆礼物', colors: [0, 1, 2, 3, 4], moves: 18,
    layout: [
      '........',
      '........',
      '........',
      '.bb..bb.',
      '.bb..bb.',
      '........',
      '........',
      '........',
    ],
    goals: [{ t: 'box' }, { t: 'c', color: 2, n: 20 }],
    stars: [1, 8500, 11000], tip: 'box',
  },
  {
    name: '送小企鹅回家', colors: [0, 1, 2, 3, 4], moves: 24,
    layout: [
      '........',
      '........',
      '..g..g..',
      '........',
      '........',
      '........',
      '........',
      '........',
    ],
    penguins: { total: 2, max: 2 },
    goals: [{ t: 'pg' }, { t: 'c', color: 3, n: 12 }],
    stars: [1, 11500, 14500], tip: 'penguin',
  },
  {
    name: '泡泡里的小动物', colors: [0, 1, 2, 3, 4], moves: 24,
    layout: [
      '........',
      '........',
      '.o.oo.o.',
      '..o..o..',
      '..o..o..',
      '.o.oo.o.',
      '........',
      '........',
    ],
    goals: [{ t: 'bub' }, { t: 'c', color: 4, n: 16 }],
    stars: [1, 11000, 13500], tip: 'bub',
  },
  {
    name: '冰雪钻石', colors: [0, 1, 2, 3, 4], moves: 24,
    layout: [
      '__....__',
      '_......_',
      '..iIIi..',
      '.iIIIIi.',
      '.iIIIIi.',
      '..iIIi..',
      '_......_',
      '__....__',
    ],
    goals: [{ t: 'ice' }],
    stars: [1, 11000, 13500], tip: 'ice2',
  },
  {
    name: '礼物城墙', colors: [0, 1, 2, 3, 4], moves: 30,
    layout: [
      '.g....g.',
      '........',
      '........',
      '.BB..BB.',
      '........',
      '........',
      '........',
      '........',
    ],
    penguins: { total: 2, max: 2 },
    goals: [{ t: 'box' }, { t: 'pg' }],
    stars: [1, 15500, 19500], tip: 'box2',
  },
  {
    name: '六种小动物', colors: [0, 1, 2, 3, 4, 5], moves: 26,
    goals: [{ t: 'c', color: 0, n: 18 }, { t: 'c', color: 3, n: 18 }, { t: 'c', color: 5, n: 18 }],
    stars: [1, 6500, 9500], tip: 'six',
  },
  {
    name: '泡泡冰宫', colors: [0, 1, 2, 3, 4], moves: 28,
    layout: [
      '_......_',
      '........',
      '.qiqqiq.',
      '.ib..bi.',
      '.ib..bi.',
      '.qiqqiq.',
      '........',
      '_......_',
    ],
    goals: [{ t: 'ice' }, { t: 'bub' }, { t: 'box' }],
    stars: [1, 13500, 16000],
  },
  {
    name: '爱心大挑战', colors: [0, 1, 2, 3, 4], moves: 34,
    layout: [
      '_..___.._',
      '....g....',
      '.iIIiIIi.',
      '.IIIIIII.',
      '.iIIbIIi.',
      '_.iIIIi._',
      '__.iIi.__',
      '___.i.___',
      '____.____',
    ],
    penguins: { total: 1, max: 1 },
    goals: [{ t: 'ice' }, { t: 'pg' }, { t: 'box' }],
    stars: [1, 17500, 20500], tip: 'final',
  },
];
