// 魔方世界 · 🔢 数积木: how many blocks are there? Some hide behind and under others.
// Checking always shows it: the pile flies apart so every block can be seen, and each one gets its number.
// One level asks how many more blocks would fill the dotted big cube.
import * as THREE from 'three';
import { pick, shuffle, randInt, easeInOut, easeOutBack } from '../core.js';
import { Stage } from '../stage.js';
import { UI } from '../ui.js';
import { Snd } from '../audio.js';
import { Voice } from '../voice.js';
import { L } from '../lines.js';
import { CANDY, makeIsland, makeBlock, makeBadge, makeGhost } from '../blocks.js';
import { genHeights, total, maxH } from './common.js';

let S = null;
// blocks the viewer (front-right, above) cannot see at all: something on their right, in front and on top
function hiddenCount(h) {
  const n = h.length, at = (x, y, z) => x < n && z < n && h[x][z] > y;
  let k = 0;
  for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) for (let y = 0; y < h[x][z]; y++) if (at(x + 1, y, z) && at(x, y, z + 1) && at(x, y + 1, z)) k++;
  return k;
}

export const Count = {
  levels: [
    { n: 2, b: [3, 5], h: 2, hidden: [0, 0] },
    { n: 3, b: [5, 8], h: 2, hidden: [0, 0] },
    { n: 3, b: [6, 10], h: 3, hidden: [1, 2] },
    { kind: 'fill', boxes: [[2, 2, 2], [3, 2, 2], [2, 3, 2], [3, 2, 2]] },
    { n: 3, b: [9, 14], h: 3, hidden: [2, 4], think: true },
  ],
  intro: (cfg, li) => L.count.intro[li],

  setup(ctx) {
    const isl = makeIsland({ radius: 3.6, cells: { w: 3, d: 3 } });
    Stage.root.add(isl);
    Stage.lights.size(5);
    S = { ctx, isl, pile: [], extra: [] };
    UI.layout({ panel: true });
    const R = 3.1;
    Stage.look({ yaw: 0.62, pitch: 0.55, fov: 34, dist: Stage.fitDist(R), tx: 0, ty: 1, tz: 0 }, true);
    Stage.lim.minDist = Stage.goal.dist * 0.6; Stage.lim.maxDist = Stage.goal.dist * 1.6;
    UI.onResize = () => { Stage.goal.dist = Stage.fitDist(R); };
  },
  clearPile() { [...S.pile, ...S.extra].forEach(b => { b.parent?.remove(b); }); S.pile = []; S.extra = []; },

  // the pile flies apart, every block gets its number, then it flies back together
  async countUp(R, blocks, o = {}) {
    const ctr = new THREE.Vector3(0, 0, 0), home = blocks.map(b => b.position.clone());
    const apart = home.map(p => new THREE.Vector3(p.x * 1.9, p.y * 1.75 + 0.2, p.z * 1.9));
    const d0 = Stage.goal.dist; Stage.goal.dist = d0 * 1.2;
    Snd.play('whoosh');
    await R.tween(0.6, t => blocks.forEach((b, i) => b.position.lerpVectors(home[i], apart[i], t)), { ease: easeInOut });
    const order = blocks.map((b, i) => i).sort((a, b) => home[a].y - home[b].y || home[a].z - home[b].z || home[a].x - home[b].x);
    const badges = [];
    for (let k = 0; k < order.length; k++) {
      if (R.scope.dead) return;
      const b = blocks[order[k]];
      const bd = makeBadge(String(k + 1), { size: 0.62, ring: '#FF9F1C' }); bd.position.copy(b.position).add(new THREE.Vector3(0, 0.75, 0));
      Stage.root.add(bd); badges.push(bd);
      Snd.play('count', k % 10); Voice.say(String(k + 1));
      R.tween(0.3, t => { b.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.22); bd.scale.setScalar(0.62 * easeOutBack(t)); });
      await R.wait(o.fast ? 0.42 : 0.62);
    }
    await R.wait(0.3);
    if (o.end) await R.sayWait(o.end, 4);
    await R.wait(0.4);
    badges.forEach(b => Stage.root.remove(b));
    Stage.goal.dist = d0;
    await R.tween(0.5, t => blocks.forEach((b, i) => b.position.lerpVectors(apart[i], home[i], t)), { ease: easeInOut });
  },

  async round(R, cfg, r) {
    this.clearPile();
    Stage.lim.orbit = !cfg.think;
    if (cfg.think) R.scope.own(() => (Stage.lim.orbit = true));
    Stage.flyTo({ yaw: 0.62, pitch: 0.55 }, 0.6);
    if (cfg.kind === 'fill') return this.fill(R, cfg, r);
    let h;
    for (let t = 0; t < 500; t++) {
      h = genHeights(cfg.n, cfg.b[0], cfg.b[1], cfg.h, { stackBias: 0.5 });
      const hc = hiddenCount(h);
      if (hc >= cfg.hidden[0] && hc <= cfg.hidden[1]) break;
    }
    const n = cfg.n, off = (n - 1) / 2, cols = shuffle(CANDY);
    const blocks = [];
    for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) for (let y = 0; y < h[x][z]; y++) {
      const b = makeBlock(cols[(x * 3 + z * 5 + y * 7) % cols.length]);
      b.position.set(x - off, y + 0.5, z - off); Stage.root.add(b); blocks.push(b);
    }
    S.pile = blocks;
    Stage.goal.ty = maxH(h) / 2;
    // drop them in
    for (const [i, b] of blocks.slice().sort((a, b2) => a.position.y - b2.position.y).entries()) {
      b.visible = false;
      R.scope.after(i * 0.06, () => { b.visible = true; Snd.play('place', Math.round(b.position.y * 2)); const y0 = b.position.y; R.tween(0.3, t => { b.scale.setScalar(Math.max(0.01, easeOutBack(t))); b.position.y = y0 + (1 - t) * 0.7; }); });
    }
    await R.wait(blocks.length * 0.06 + 0.4);
    const N = total(h), hid = hiddenCount(h);
    return this.ask(R, N, hid, L.count.ask, L.count.total[N], blocks);
  },

  // four numbers to pick from; the tempting wrong one is "only what I can see"
  ask(R, N, hid, q, endLine, blocks, onRight) {
    const set = new Set([N]);
    if (hid) set.add(N - hid);
    for (const d of shuffle([1, -1, 2, -2, 3])) { if (set.size >= 4) break; if (N + d > 0) set.add(N + d); }
    const nums = shuffle([...set]);
    let wrong = 0, busy = false;
    return new Promise(done => {
      const cards = UI.options(nums, {
        aspect: 1.2, html: v => `<span class="num">${v}</span>`, label: v => String(v),
        pick: async (v, i, card) => {
          if (busy) return;
          Stage.lim.orbit = true;
          if (v === N) {
            busy = true; card.classList.add('right'); cards.forEach(c => c !== card && c.classList.add('dim'));
            R.good(new THREE.Vector3(0, 2.2, 0), wrong === 0);
            await R.wait(0.7); if (R.scope.dead) return;
            if (onRight) await onRight(); else await this.countUp(R, blocks, { end: endLine, fast: N > 9 });
            if (!R.scope.dead) { await R.wait(0.2); done(); }
          } else {
            R.miss(); UI.shake(card); wrong++;
            if (wrong === 1) {
              R.say(hid ? L.count.hidden : L.count.wrong);
              if (hid) { busy = true; const y0 = Stage.goal.yaw; await Stage.flyTo({ yaw: y0 + Math.PI * 0.85 }, 1.4); await R.wait(0.6); await Stage.flyTo({ yaw: y0 }, 1.2); busy = false; }
            } else if (!onRight) {
              busy = true; R.say(L.count.together); await R.wait(1.2);
              await this.countUp(R, blocks, { fast: N > 9 }); busy = false;
              cards[nums.indexOf(N)].classList.add('glow');
            } else { R.say(L.count.wrong); }
          }
        },
      });
      R.onHint = async () => { if (busy) return; busy = true; R.say(L.count.together); await R.wait(1.2); if (onRight) await onRight(true); else await this.countUp(R, blocks, { fast: N > 9 }); busy = false; };
      R.idle(16, () => { if (!busy) R.say(q); });
      R.ask(q);
    });
  },

  // how many more to fill the dotted box?
  async fill(R, cfg, r) {
    const [W, D, H] = cfg.boxes[r % cfg.boxes.length];
    // a pile inside the box: each column 0..H high, some full, some missing
    let h;
    for (let t = 0; t < 200; t++) {
      h = Array.from({ length: W }, () => Array.from({ length: D }, () => randInt(0, H)));
      const miss = W * D * H - total(h);
      if (miss >= 2 && miss <= Math.min(7, W * D * H - 3) && h.flat().some(v => v === H)) break;
    }
    const ox = (W - 1) / 2, oz = (D - 1) / 2, color = pick(CANDY), blocks = [], ghosts = [];
    for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) for (let y = 0; y < H; y++) {
      const p = new THREE.Vector3(x - ox, y + 0.5, z - oz);
      if (y < h[x][z]) { const b = makeBlock(color); b.position.copy(p); Stage.root.add(b); blocks.push(b); }
      else { const g = makeGhost('#ffffff', 0.18); g.position.copy(p); Stage.root.add(g); ghosts.push(g); }
    }
    // the big box outline
    const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), new THREE.LineDashedMaterial({ color: '#FF7A00', dashSize: 0.18, gapSize: 0.12 }));
    box.computeLineDistances(); box.position.set(0, H / 2, 0); Stage.root.add(box);
    S.pile = blocks; S.extra = [...ghosts, box];
    Stage.goal.ty = H / 2;
    const need = ghosts.length;
    // checking: the missing blocks drop in one by one, counted
    const fillIn = async (keep) => {
      ghosts.sort((a, b) => a.position.y - b.position.y || a.position.z - b.position.z);
      const put = [];
      for (let k = 0; k < ghosts.length; k++) {
        if (R.scope.dead) return;
        const g = ghosts[k], b = makeBlock(pick(CANDY)); b.position.copy(g.position); Stage.root.add(b); put.push(b); g.visible = false;
        const bd = makeBadge(String(k + 1), { size: 0.6 }); bd.position.copy(g.position).add(new THREE.Vector3(0, 0.7, 0)); Stage.root.add(bd); put.push(bd);
        const y0 = b.position.y; R.tween(0.3, t => { b.scale.setScalar(Math.max(0.01, easeOutBack(t))); b.position.y = y0 + (1 - t) * 0.8; });
        Snd.play('count', k); Voice.say(String(k + 1));
        await R.wait(0.65);
      }
      await R.sayWait(L.count.need[need], 4);
      await R.wait(0.4);
      if (!keep) { put.forEach(o => Stage.root.remove(o)); ghosts.forEach(g => (g.visible = true)); }
      else put.filter(o => o.isSprite).forEach(o => Stage.root.remove(o));
      S.extra.push(...put);
    };
    return this.ask(R, need, 0, L.count.askFill, null, blocks, async hintOnly => { await fillIn(!hintOnly); });
  },
  leave() { S = null; },
};
