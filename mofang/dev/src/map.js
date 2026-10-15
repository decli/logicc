// 魔方世界 · the map: six floating islands on a slowly turning ring; the one in front is the one you can play
import * as THREE from 'three';
import { $, el, Scope, Store, clamp, easeInOut, easeOutBack } from './core.js';
import { Stage, setSky } from './stage.js';
import { UI } from './ui.js';
import { Snd } from './audio.js';
import { Voice } from './voice.js';
import { L } from './lines.js';
import { WORLDS, Game, isOpen } from './game.js';
import { makeIsland, makeBlock, makeAnimal, makeBadge, makeGhost, COLORS } from './blocks.js';
import { makeRubik } from './modes/cube.js';
import { buildModel, MODELS } from './modes/build.js';

const RING = 9.5;
let focus = 0;

// a little scene on each island that says what is played there
function prop(id) {
  const g = new THREE.Group();
  const B = (c, x, y, z, s = 1) => { const b = makeBlock(c); b.position.set(x, y + 0.5 * s, z); b.scale.setScalar(s); g.add(b); return b; };
  if (id === 'views') {
    B('b', -0.5, 0, 0); B('b', 0.5, 0, 0); B('b', 0.5, 1, 0); B('b', 0.5, 0, -1);
    const a = makeAnimal('bear', 0.7); a.position.set(-0.4, 0, 1.6); g.add(a);
    const r = makeAnimal('rabbit', 0.6); r.position.set(1.7, 0, 0.6); r.rotation.y = -1.2; g.add(r);
  }
  if (id === 'count') {
    B('o', -0.5, 0, 0); B('y', 0.5, 0, 0); B('r', 0.5, 1, 0); B('o', -0.5, 0, -1); B('y', 0.5, 0, -1); B('o', 0.5, 1, -1); B('r', 0.5, 2, -1);
    const q = makeBadge('?', { size: 1.1 }); q.position.set(0, 3.6, 0); g.add(q);
    g.userData.spin = q;
  }
  if (id === 'wall') {
    const hole = new Set(['0,0', '0,1', '1,0']);
    for (let x = -2; x <= 2; x++) for (let y = 0; y < 3; y++) if (!hole.has(`${x},${y}`)) B(((x + y) & 1) ? 'r' : 'o', x * 0.62, y * 0.62, -0.9, 0.6);
    const s = new THREE.Group(); [[0, 0], [0, 1], [1, 0]].forEach(([x, y]) => { const b = makeBlock('b'); b.scale.setScalar(0.58); b.position.set(x * 0.62, y * 0.62 + 0.31, 0); s.add(b); });
    s.position.set(0, 0, 1.0); g.add(s); g.userData.bob = s;
  }
  if (id === 'nets') {
    const mat = c => new THREE.MeshStandardMaterial({ color: COLORS[c], roughness: 0.6 });
    const f = (c, x, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.95), mat(c)); m.position.set(x, 0.05, z); m.castShadow = true; g.add(m); return m; };
    f('p', 0, 0); f('k', 1, 0); f('c', -1, 0); f('y', 0, 1); f('g', 0, -1);
    const lid = f('o', 0, -2); lid.position.set(0, 0.55, -1.5); lid.rotation.x = -1.1;
    const a = makeAnimal('cat', 0.5); a.position.set(0, 0.08, 0); g.add(a);
  }
  if (id === 'cube') {
    const c = makeRubik(3, 'color'); c.root.scale.setScalar(0.62); c.root.position.y = 1.3; c.root.rotation.set(0.4, 0.7, 0); g.add(c.root); g.userData.spin = c.root;
  }
  if (id === 'build') {
    const m = buildModel(MODELS.castle.v); m.scale.setScalar(0.42); m.position.y = 0; g.add(m);
  }
  return g;
}

export const Map = {
  scope: null,
  open(world) {
    Game.stop();
    const scope = this.scope = Game.scope = new Scope();
    if (world) focus = WORLDS.indexOf(world);
    UI.hud(true); UI.buttons({ home: true, hint: false, say: true, gear: true }); UI.clearDots();
    $('#mapUI').classList.remove('hidden');
    const ring = new THREE.Group(); Stage.root.add(ring);
    const isles = WORLDS.map((w, i) => {
      const g = new THREE.Group(), a = i / WORLDS.length * Math.PI * 2;
      g.position.set(Math.sin(a) * RING, 0, Math.cos(a) * RING);
      g.rotation.y = a;
      const isl = makeIsland({ radius: 2.7, grass: ['#9BE15D', '#FFD27A', '#FFAFB8', '#C9B6FF', '#7DE3D0', '#8EDB6A'][i] });
      g.add(isl); const p = prop(w.id); g.add(p);
      g.userData = { w, i, p, base: 0 };
      isl.traverse(n => (n.userData.isle = i)); p.traverse(n => (n.userData.isle = i));
      ring.add(g);
      return g;
    });
    let rot = -focus / WORLDS.length * Math.PI * 2, goal = rot;
    Stage.lights.size(14);
    Stage.lim.orbit = false; Stage.lim.zoom = false;
    const fit = () => {
      const bottom = $('#isle').getBoundingClientRect().height + UI.g * 2;
      Stage.setRect(0, UI.b + UI.g * 2, Stage.W, Stage.H - UI.b - UI.g * 2 - bottom);
      Stage.look({ yaw: 0, pitch: 0.3, fov: 34, dist: Stage.fitDist(3.6), tx: 0, ty: 1.2, tz: RING }, true);
    };
    UI.layout({}); UI.onResize = fit;
    scope.tick((dt, t) => {
      rot += (goal - rot) * (1 - Math.exp(-6 * dt));
      ring.rotation.y = rot;
      isles.forEach((g, i) => {
        g.position.y = Math.sin(t * 0.8 + i * 1.3) * 0.25;
        const s = g.userData.p.userData;
        if (s.spin) s.spin.rotation.y += dt * 0.6;
        if (s.bob) s.bob.position.z = 1.0 + Math.sin(t * 1.5) * 0.4;
        // the island in front is a bit bigger
        const a = i / WORLDS.length * Math.PI * 2 + rot, front = Math.cos(a);
        g.scale.setScalar(0.75 + 0.25 * Math.max(0, front) ** 3);
      });
    });
    const show = (speak) => {
      const w = WORLDS[focus];
      setSky(...w.sky);
      $('#isleName').innerHTML = `<span class="ic">${w.icon}</span>${L.isle[w.id]}`;
      const lv = $('#levels'); lv.innerHTML = '';
      let nextDone = false;
      w.levels.forEach((_, i) => {
        const st = Store.stars(w.id, i), open = isOpen(w, i);
        const b = el('button', 'btn lvl', String(i + 1));
        b.setAttribute('aria-label', `第 ${i + 1} 关`);
        if (st) { b.classList.add('done'); b.appendChild(el('span', 'st', '⭐'.repeat(st))); }
        else if (open && !nextDone) { b.classList.add('next'); nextDone = true; }
        if (!open) { b.classList.add('lock'); b.innerHTML = '🔒'; }
        b.addEventListener('click', () => { if (!open) { Snd.play('bad'); UI.shake(b); Voice.say(L.locked); return; } Snd.play('open'); Game.play(w, i); });
        lv.appendChild(b);
      });
      if (w.free) {
        const b = el('button', 'btn lvl free', w.id === 'cube' ? '🎲' : '🏰');
        b.setAttribute('aria-label', '自由玩'); b.style.fontSize = 'calc(var(--b) * .55)';
        b.addEventListener('click', () => { Snd.play('open'); Game.play(w, 'free'); });
        lv.appendChild(b);
      }
      fit();
      if (speak) Voice.say(Store.d.seen['isle.' + w.id] ? L.isle[w.id] : L.isle[w.id] + '。' + L.isleIntro[w.id]), Store.d.seen['isle.' + w.id] = 1, Store.save();
    };
    const go = d => { focus = (focus + d + WORLDS.length) % WORLDS.length; goal -= d / WORLDS.length * Math.PI * 2; Snd.play('whoosh'); show(true); };
    scope.on($('#prevBtn'), 'click', () => go(-1));
    scope.on($('#nextBtn'), 'click', () => go(1));
    // swipe the ring, tap an island
    Stage.handlers = {
      down: () => true,
      move: () => { },
      up: g => {
        const dx = g.x - g.x0;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(g.y - g.y0)) { go(dx < 0 ? 1 : -1); return; }
        if (g.moved < 12) {
          const hit = Stage.pick(g.x, g.y, [ring]);
          if (!hit) return;
          const i = hit.object.userData.isle; if (i === undefined) return;
          if (i === focus) { const w = WORLDS[i], lvl = w.levels.findIndex((_, k) => isOpen(w, k) && !Store.stars(w.id, k)); Snd.play('open'); Game.play(w, lvl < 0 ? 0 : lvl); }
          else { let d = i - focus; if (d > 3) d -= 6; if (d < -3) d += 6; go(d); }
        }
      },
    };
    show(false);
    if (!Store.d.seen.welcome) { Store.d.seen.welcome = 1; Store.save(); Voice.say(L.welcome); }
    else Voice.say(L.isle[WORLDS[focus].id]);
  },
  refresh() { if (!$('#mapUI').classList.contains('hidden')) this.open(WORLDS[focus]); },
};
