// 动物消消乐 · which six animals play in a game (decli: the same ones every time got boring). Every game draws six from
// decli's animals (FRIENDS in lines.js), each a different colour so they are easy to tell apart on the board: animals
// that look alike (the blue dolphin, shark and whale; the orange fox, corgi and kangaroo ...) share a colour and so
// never play together. A level with penguins leaves out the black-and-white ones, and the 隐藏款 stay a surprise of the
// blind box.
const Cast = {
  // effect colours by main colour (FRIENDS' last field): base, dark, light
  FX: {
    p: ['#ffa3c8', '#e2668f', '#ffe0ec'], w: ['#ffffff', '#9aa3b8', '#eef1f7'], k: ['#ffffff', '#2f3040', '#e4e6ee'],
    v: ['#b48cff', '#7b52e0', '#e6dbff'], y: ['#ffd23a', '#e0a000', '#fff0b8'], o: ['#ff9a3a', '#d9661a', '#ffd9b0'],
    r: ['#ff4a3a', '#c8231a', '#ffc0b2'], g: ['#6fd65a', '#2f9e3a', '#d2f8b4'], l: ['#5aa6ff', '#2d6fd8', '#c4e2ff'],
    t: ['#3ad6c4', '#1a9e90', '#c4f5ee'], b: ['#c08a5e', '#7a4f30', '#ecd2bd'], a: ['#a9adbd', '#6b7082', '#e4e6ee'],
  },
  // colours too close to share a board (besides the same colour twice)
  NEAR: ['lt', 'gt', 'lv', 'ob', 'or', 'ka', 'wk', 'wa'],
  pending: -1,
  // two animals' colours (one or two letters each) clash
  near(a, b) { return [...a].some(x => [...b].some(y => x === y || this.NEAR.includes(x + y) || this.NEAR.includes(y + x))); },
  // six new animals for level li: they show at once everywhere (intro card, pieces, goals, effects) and are kept for
  // Game.start(li)
  pick(li) {
    const lv = LEVELS[li], penguins = lv.goals.some(g => g.t === 'pg');
    const pool = FRIENDS.filter(f => f.tier <= 1 && f.id !== 'penguin' && !(penguins && this.near(f.fam, 'k')));
    let got = [];
    for (let tries = 0; got.length < 6 && tries < 50; tries++) {   // an unlucky early pick can leave fewer than six colours: draw again
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      got = [];
      for (const f of pool) if (got.length < 6 && got.every(g => !this.near(g.fam, f.fam))) got.push(f);
    }
    if (got.length < 6) got = this.FIRST();
    this.set(got);
    this.pending = li;
  },
  // when a level starts: the six its intro card showed, or new ones (a replay, the next level from the result card)
  take(li) { if (this.pending !== li) this.pick(li); this.pending = -1; },
  set(fs) { ANIMALS.length = 0; fs.forEach(f => ANIMALS.push({ id: f.id, name: f.name, fx: this.FX[f.fam[0]], h: f.i })); },
  // the first six (the start screen, before any game)
  FIRST: () => ['pig', 'panda', 'hippo', 'giraffe', 'parrot', 'frog'].map(id => FRIENDS.find(f => f.id === id)),
};
Cast.set(Cast.FIRST());
