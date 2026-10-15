// 魔方世界 · 👀 小熊看积木: animals stand round a pile of blocks; which picture is what each of them sees?
// After an answer the camera flies to that animal's eyes and narrows its lens until the pile looks flat,
// exactly like the picture on the card.
import * as THREE from 'three';
import { pick, shuffle } from '../core.js';
import { Stage } from '../stage.js';
import { UI } from '../ui.js';
import { Snd } from '../audio.js';
import { Voice } from '../voice.js';
import { L } from '../lines.js';
import { CANDY, makeIsland, makeAnimal, animalDo } from '../blocks.js';
import { genHeights, viewOf, picKey, optionsFor, drawPic, buildPile, popIn, flyToView, maxH } from './common.js';

const ANIMAL = { front: 'bear', right: 'rabbit', back: 'frog', left: 'cat', top: 'chick' };
const SIDES = ['front', 'right', 'back', 'left'];

let S = null;   // this level's scene bits
export const Views = {
  levels: [
    { kind: 'pick', n: 2, b: [3, 4], sides: ['front'], opts: 3, who: ['front'] },
    { kind: 'pick', n: 3, b: [4, 6], sides: ['left', 'right'], opts: 3, who: ['left', 'right', 'front'] },
    { kind: 'pick', n: 3, b: [4, 7], sides: ['top'], opts: 4, who: ['front', 'top'] },
    { kind: 'who', n: 3, b: [5, 7], who: ['front', 'right', 'back', 'left'] },
    { kind: 'pick', n: 3, b: [6, 9], sides: ['front', 'right', 'left', 'back', 'top'], opts: 4, who: ['front', 'right', 'back', 'left', 'top'], think: true },
  ],
  intro: (cfg, li) => L.views.intro[li],

  setup(ctx) {
    const { cfg } = ctx, n = cfg.n;
    const isl = makeIsland({ radius: n / 2 + 2.0, cells: { w: n, d: n } });
    Stage.root.add(isl);
    Stage.lights.size(n / 2 + 4);
    const animals = {};
    for (const side of cfg.who) {
      const a = makeAnimal(ANIMAL[side], side === 'top' ? 0.62 : 0.72);
      const r = n / 2 + 1.35;
      const p = { front: [0, 0, r], right: [r, 0, 0], back: [0, 0, -r], left: [-r, 0, 0], top: [0, 0, 0] }[side];
      a.position.set(...p);
      if (side !== 'top') a.rotation.y = Math.atan2(-p[0], -p[2]);
      a.userData.side = side;
      Stage.root.add(a); animals[side] = a;
    }
    S = { isl, animals, n, pile: null, mh: 1 };
    if (animals.top) {
      const bird = animals.top;
      ctx.scope.tick((dt, t) => { bird.position.y = S.mh + 2.0 + Math.sin(t * 2) * 0.15; bird.rotation.x = 0.75; bird.rotation.y = Math.sin(t * 0.7) * 0.4; bird.userData.arms.forEach((a, i) => (a.rotation.z = (i ? 1 : -1) * (0.6 + Math.sin(t * 16) * 0.5))); });
    }
    const R = n / 2 + 1.75;
    Stage.look({ yaw: 0.62, pitch: 0.52, dist: Stage.fitDist(R), fov: 34, tx: 0, ty: 0.9, tz: 0 }, true);
    Stage.lim.minDist = Stage.goal.dist * 0.6; Stage.lim.maxDist = Stage.goal.dist * 1.6;
    UI.layout({ panel: true });
    UI.onResize = () => { Stage.goal.dist = Stage.fitDist(R); };
    Stage.goal.dist = Stage.fitDist(R);
  },

  async round(R, cfg, r) {
    const n = cfg.n, color = pick(CANDY);
    // a pile whose views make a fair question
    let h, side, pics;
    for (let t = 0; t < 300; t++) {
      h = genHeights(n, cfg.b[0], cfg.b[1], n === 2 ? 2 : 3);
      const rows = Math.max(2, maxH(h));
      pics = {}; for (const s of [...SIDES, 'top']) pics[s] = viewOf(h, s, s === 'top' ? n : rows);
      const keys = SIDES.map(s => picKey(pics[s]));
      if (cfg.kind === 'who') { if (new Set(keys).size === 4) break; continue; }
      side = pick(cfg.sides);
      if (side === 'top') { const tk = picKey(pics.top); if (pics.top.flat().filter(Boolean).length >= 3 && tk !== picKey(pics.top.slice().reverse()) && pics.top.flat().some(v => !v)) break; continue; }
      // the asked view must differ from its mirror image (so "the other side" is a real wrong answer) and not be a plain block
      const k = picKey(pics[side]), mirror = { front: 'back', back: 'front', left: 'right', right: 'left' }[side];
      if (k !== picKey(pics[mirror]) && pics[side].flat().some(v => !v)) break;
    }
    // the pile
    if (S.pile) { Stage.root.remove(S.pile.group); }
    const pile = S.pile = buildPile(h, color);
    Stage.root.add(pile.group);
    S.mh = maxH(h);
    Stage.goal.ty = S.mh / 2;
    await popIn(R.scope, pile.blocks);
    if (R.scope.dead) return;
    const center = new THREE.Vector3(0, S.mh / 2, 0), radius = Math.hypot(n / 2, S.mh / 2) + 0.4;
    const others = Object.values(S.animals);
    const look = async s => {
      const back = await flyToView(s, center, radius, others);
      if (R.scope.dead) return back();
      await R.wait(1.7);
      await back();
    };
    // think levels: no turning until the first answer
    Stage.lim.orbit = !cfg.think;
    if (cfg.think) R.scope.own(() => (Stage.lim.orbit = true));

    if (cfg.kind === 'who') return this.who(R, cfg, pics, color, look);

    const right = pics[side];
    // tempting wrong answers: the other sides; for the bird, the same picture turned or flipped
    const pool = side === 'top'
      ? [right.map(row => row.slice().reverse()), right.slice().reverse(), right[0].map((_, c) => right.map(row => row[c]).reverse())]
      : SIDES.filter(s => s !== side).map(s => pics[s]);
    const opts = optionsFor(right, pool.filter(p => p.length === right.length), cfg.opts, side);
    const who = S.animals[side];
    let wrong = 0, busy = false;
    return new Promise(done => {
      const cards = UI.options(opts, {
        aspect: right[0].length / right.length,
        draw: (m, x, w, hh) => drawPic(x, w, hh, m, color),
        label: (m, i) => '图 ' + (i + 1),
        pick: async (m, i, card) => {
          if (busy) return;
          Stage.lim.orbit = true;
          if (picKey(m) === picKey(right)) {
            busy = true; card.classList.add('right');
            R.good(center.clone().setY(S.mh + 0.5), wrong === 0);
            animalDo(who, 'hop', 2);
            cards.forEach(c => c !== card && c.classList.add('dim'));
            await R.wait(0.6); if (R.scope.dead) return;
            R.say(L.views.see);
            await look(side); if (R.scope.dead) return;
            animalDo(who, 'spin');
            await R.wait(0.5);
            done();
          } else {
            R.miss(); UI.shake(card); wrong++;
            animalDo(who, 'wave');
            if (wrong >= 2) {
              busy = true; R.say(L.views.look);
              await R.wait(0.8); await look(side); busy = false;
              if (!R.scope.dead) R.say(L.views.ask[side]);
            } else R.say(L.views.again[side]);
          }
        },
      });
      R.onHint = async () => { if (busy) return; busy = true; Stage.lim.orbit = true; R.say(L.views.look); await look(side); busy = false; };
      R.idle(14, () => { if (!busy) { animalDo(who, 'wave'); R.say(L.views.ask[side]); } });
      R.ask(L.views.ask[side]);
      if (r === 0 && !cfg.think && R.ctx.li === 0) this.demoTurn(R);
    });
  },

  // reverse question: here is a picture — which animal saw it? (tap the animal)
  who(R, cfg, pics, color, look) {
    const side = pick(SIDES), right = pics[side];
    UI.options([right], { aspect: right[0].length / right.length * 1.2, draw: (m, x, w, hh) => drawPic(x, w, hh, m, color), pick: () => R.say(L.views.who) });
    let busy = false, wrong = 0;
    return new Promise(done => {
      Stage.handlers = {
        tap: async g => {
          if (busy) return;
          const hit = Stage.pick(g.x, g.y, Object.values(S.animals));
          if (!hit) return;
          let a = hit.object; while (a && !a.userData.side) a = a.parent;
          if (!a) return;
          if (a.userData.side === side) {
            busy = true; Stage.handlers = null;
            R.good(a.position.clone().setY(1.6), wrong === 0); animalDo(a, 'hop', 2);
            await R.wait(0.6); if (R.scope.dead) return;
            R.say(L.views.see); await look(side); if (R.scope.dead) return;
            await R.wait(0.3); done();
          } else {
            R.miss(); wrong++; animalDo(a, 'shake'); R.say(L.views.whoWrong);
            if (wrong >= 2) { busy = true; await R.wait(1.2); await look(a.userData.side); busy = false; if (!R.scope.dead) R.say(L.views.who); }
          }
        },
      };
      R.scope.own(() => (Stage.handlers = null));
      R.onHint = async () => { if (busy) return; busy = true; R.say(L.views.look); await look(side); busy = false; };
      R.idle(14, () => { if (!busy) { SIDES.forEach((s, i) => R.scope.after(i * 0.25, () => animalDo(S.animals[s], 'wave'))); R.say(L.views.who); } });
      R.ask(L.views.who);
    });
  },

  // the very first round: a hand shows that dragging turns the pile
  demoTurn(R) {
    // only if the child has not touched anything yet, and after the voice has finished
    const go = () => {
      if (R.touched || R.scope.dead) return;
      if (Voice.busy) { R.scope.after(0.5, go); return; }
      const r = Stage.rect, x = r.x + r.w * 0.35, y = r.y + r.h * 0.55;
      const kill = UI.hand(x, y, { to: { x: x + r.w * 0.3, y }, sec: 3.4 });
      R.scope.own(kill);
      R.say(L.views.turn);
      R.scope.tween(2.4, t => { if (!R.touched && !Stage.flying) Stage.goal.yaw = 0.62 + Math.sin(t * Math.PI) * 0.9; });
    };
    R.scope.after(4.5, go);
  },
};
