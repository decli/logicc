// 动物消消乐 · decli's pictures for season two (the egg, the balloon, the cage, grass, the islands and their maps),
// made from dev/art/season2/*.png by dev/art2.py into ../s2/*.webp, which also writes the list below. Until a picture
// is in, the code draws its own (art.js, ui.js), so the game never waits for them; when they load, the board's tiles
// are made again with them.
const Art2 = {
  names: ['egg', 'egg-crack', 'balloon', 'cage', 'grass', 'island-1', 'island-1-bg', 'island-2', 'island-2-bg', 'island-3', 'island-3-bg', 'island-4', 'island-4-bg', 'island-5', 'island-5-bg', 'island-6', 'island-6-bg'],   // filled in by dev/art2.py
  badge: [0.4979, 0.8594, 0.1172],   // the cage picture's badge: centre x (of its width), y and radius (of its height); art2.py measures it
  img: {},
  load() {
    for (const n of this.names) {
      const im = new Image();
      im.onload = () => { this.img[n] = im; Art.cell = 0; if (Game.active) Game.layout(); if (!$('#map').hidden && n.startsWith('island')) UI.map(); };
      im.src = 's2/' + n + '.webp';
    }
  },
};
