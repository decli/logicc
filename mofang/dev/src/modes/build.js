// 魔方世界 · 🏰 搭城堡: tap the board or a block to put a block there (on top or on its side).
// Levels: fill the see-through outlines → copy the model in the little window → copy a model that has been
// turned round (watch its flag) → build from two pictures (what the bear sees, what the bird sees).
// Free play: a big board, all the colours, roofs, windows, doors, trees and flags; it is kept for next time.
import * as THREE from 'three';
import { pick, shuffle, Store, clamp, easeOutBack, easeInOut } from '../core.js';
import { Stage, makeLights, disposeDeep } from '../stage.js';
import { UI } from '../ui.js';
import { Snd } from '../audio.js';
import { FX } from '../fx.js';
import { Voice } from '../voice.js';
import { L } from '../lines.js';
import { makeIsland, makeBlock, makeGhost, makeAnimal, animalDo, COLORS, GEO, CANDY } from '../blocks.js';
import { genHeights, viewOf, drawPic, picKey } from './common.js';

// models: layers from the bottom up, each layer's rows from back to front; letters are colours, '.' is empty
export const MODELS = {
  l3: { v: [['yy', 'y.']] }, tower: { v: [['b'], ['b'], ['b']] }, step3: { v: [['rr'], ['r.']] }, tee: { v: [['ggg', '.g.']] }, hook: { v: [['oo', 'o.'], ['o.', '..']] },
  stairs: { v: [['ooo'], ['.oo'], ['..o']], turn: true },
  bridge: { v: [['c.c'], ['yyy']] },
  duck: { v: [['.yyy'], ['oy..']], turn: true },
  snowman: { v: [['w', '.'], ['w', '.'], ['w', 'o'], ['d', '.']], turn: true },
  robot: { v: [['c.c'], ['ccc'], ['.y.']] },
  rocket: { v: [['rwr'], ['.w.'], ['.w.'], ['.r.']], fly: true },
  slide: { v: [['kkk.'], ['k...'], ['k...']], turn: true },
  chair: { v: [['n.', 'n.'], ['nn', 'nn'], ['n.', '..']], turn: true },
  tree: { v: [['...', '.n.', '...'], ['...', '.n.', '...'], ['.g.', 'ggg', '.g.'], ['...', '.g.', '...']] },
  gate: { v: [['b.b'], ['b.b'], ['bbb'], ['y.y']] },
  pyramid: { v: [['yyy', 'yyy', 'yyy'], ['...', '.o.', '...']] },
  house: { v: [['rr', 'rr'], ['rr', 'rr'], ['oo', '..']], turn: true },
  car: { v: [['d.d', 'rrr', 'd.d'], ['...', '.c.', '...']], turn: true },
  castle: { v: [
    ['r...r', '.....', '..y..', '.....', 'r...r'].map(s => s.replace(/\./g, 'w')),
    ['r...r', 'w...w', 'w...w', 'w...w', 'r...r'],
    ['r...r', '.....', '.....', '.....', 'r...r'],
    ['k...k', '.....', '.....', '.....', 'k...k'],
  ] },
};
export const NAMES = { stairs: '小台阶', bridge: '小桥', duck: '小鸭子', snowman: '雪人', robot: '机器人', rocket: '小火箭', slide: '滑滑梯', chair: '小椅子', tree: '小树', gate: '城门', pyramid: '金字塔', house: '小房子', car: '小汽车' };

// the cells of a model: [{x, y, z, c}]
export function cellsOf(v) {
  const out = [];
  v.forEach((layer, y) => layer.forEach((row, z) => [...row].forEach((c, x) => { if (c !== '.') out.push({ x, y, z, c }); })));
  return out;
}
export function buildModel(v, o = {}) {
  const g = new THREE.Group(), cells = cellsOf(v);
  const w = Math.max(...cells.map(c => c.x)) + 1, d = Math.max(...cells.map(c => c.z)) + 1;
  for (const c of cells) { const b = makeBlock(c.c); b.position.set(c.x - (w - 1) / 2, c.y + 0.5, c.z - (d - 1) / 2); g.add(b); }
  return g;
}
const keyOf = (x, y, z) => x + ',' + y + ',' + z;
// normalise a set of cells: smallest x and z become 0; turned by q quarter turns about y first
function norm(cells, q = 0) {
  let cs = cells.map(c => ({ ...c }));
  for (let i = 0; i < q; i++) cs = cs.map(c => ({ ...c, x: -c.z, z: c.x }));
  const mx = Math.min(...cs.map(c => c.x)), mz = Math.min(...cs.map(c => c.z));
  return cs.map(c => ({ ...c, x: c.x - mx, z: c.z - mz }));
}
const sig = (cells, color) => cells.map(c => keyOf(c.x, c.y, c.z) + (color ? c.c : '')).sort().join(';');

// special pieces for free play
const SPECIAL = {
  roof: () => { const m = new THREE.Mesh(roofGeo(), new THREE.MeshStandardMaterial({ color: '#E8505B', roughness: 0.5 })); return m; },
  window: () => decal('#7EC8FF', 'window'),
  door: () => decal('#A8754C', 'door'),
  tree: () => { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.4, 8), new THREE.MeshStandardMaterial({ color: '#8B5A2B' })); t.position.y = -0.3; const c = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.8, 10), new THREE.MeshStandardMaterial({ color: '#2FB869', roughness: 0.6 })); c.position.y = 0.15; g.add(t, c); return g; },
  flag: () => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 6), new THREE.MeshStandardMaterial({ color: '#DDD' })); const f = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.03), new THREE.MeshStandardMaterial({ color: '#FF4B4B' })); f.position.set(0.23, 0.33, 0); g.add(p, f); return g; },
};
let _roof = null;
function roofGeo() {
  if (_roof) return _roof;
  const s = new THREE.Shape(); s.moveTo(-0.48, -0.48); s.lineTo(0.48, -0.48); s.lineTo(0, 0.42); s.closePath();
  _roof = new THREE.ExtrudeGeometry(s, { depth: 0.96, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 }); _roof.translate(0, 0, -0.48); _roof.userData.shared = true;
  return _roof;
}
function decal(bg, kind) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#F7F4EE'; x.fillRect(0, 0, 128, 128);
  if (kind === 'window') { x.fillStyle = bg; x.fillRect(24, 24, 80, 80); x.fillStyle = '#F7F4EE'; x.fillRect(60, 24, 8, 80); x.fillRect(24, 60, 80, 8); }
  else { x.fillStyle = bg; x.beginPath(); x.moveTo(30, 128); x.lineTo(30, 50); x.arc(64, 50, 34, Math.PI, 0); x.lineTo(98, 128); x.fill(); x.fillStyle = '#FFD23F'; x.beginPath(); x.arc(84, 92, 6, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(GEO.block, new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 }));
}

let S = null;
export const Build = {
  levels: [
    { kind: 'ghost', models: ['l3', 'tower', 'step3', 'tee', 'hook'], N: 5 },
    { kind: 'copy', models: ['bridge', 'duck', 'snowman', 'robot', 'rocket', 'stairs'], N: 5 },
    { kind: 'copy', models: ['tree', 'gate', 'pyramid', 'house', 'car', 'chair'], N: 5 },
    { kind: 'turn', models: ['duck', 'stairs', 'snowman', 'slide', 'chair', 'house'], N: 5 },
    { kind: 'views', N: 3, b: [4, 6] },
  ],
  freeCfg: { N: 8, H: 9 },
  intro: (cfg, li) => L.build.intro[li],

  board(ctx, N, H = 6) {
    const isl = makeIsland({ radius: N / 2 + 1.7, cells: { w: N, d: N }, flowers: 10 });
    Stage.root.add(isl);
    // a little flag marks the front of the board
    const flag = SPECIAL.flag(); flag.position.set(0, 0.5, N / 2 + 0.75); flag.scale.setScalar(0.9); Stage.root.add(flag);
    const blocks = new THREE.Group(); Stage.root.add(blocks);
    S = { ctx, N, H, isl, board: isl.userData.board, blocks, map: new Map(), tool: 'put', color: 'r', undo: [], ghosts: new THREE.Group(), onChange: null };
    Stage.root.add(S.ghosts);
    Stage.lights.size(N / 2 + 3);
    const R = N * 0.62 + 0.5;
    Stage.look({ yaw: 0.5, pitch: 0.62, fov: 34, dist: Stage.fitDist(R), tx: 0, ty: 0.8, tz: 0 }, true);
    Stage.lim.minDist = Stage.goal.dist * 0.5; Stage.lim.maxDist = Stage.goal.dist * 1.5; Stage.lim.maxPitch = 1.4;
    UI.onResize = () => { Stage.goal.dist = Stage.fitDist(R); };
    Stage.handlers = { tap: g => this.tap(g) };
  },
  cellPos(x, y, z) { const o = (S.N - 1) / 2; return new THREE.Vector3(x - o, y + 0.5, z - o); },
  // tap: put a block where the finger points, or take one away
  tap(g) {
    if (S.lock) return;
    const hit = Stage.pick(g.x, g.y, [S.blocks, S.board]);
    // a tap on a glowing ghost block puts the block right there (when something holds it up)
    if (S.tool === 'put' && S.ghosts.children.length) {
      const boxes = S.ghosts.children.map(gh => gh.children[0]).filter(Boolean);
      const gh = Stage.pick(g.x, g.y, boxes, false, true);
      if (gh && (!hit || gh.distance < hit.distance + 0.6)) {
        const o = (S.N - 1) / 2, p = gh.object.parent.position;
        const x = Math.round(p.x + o), y = Math.round(p.y - 0.5), z = Math.round(p.z + o);
        if (!S.map.has(keyOf(x, y, z)) && (y === 0 || S.map.has(keyOf(x, y - 1, z)))) { this.put(x, y, z, S.color, true); return; }
      }
    }
    if (!hit) return;
    let o = hit.object; while (o && !o.userData.at && o !== S.board) o = o.parent;
    if (S.tool === 'erase') { if (o?.userData.at) this.remove(o.userData.at, true); return; }
    let x, y, z;
    if (o === S.board) {
      const p = S.board.worldToLocal(hit.point.clone()), off = S.N / 2;
      x = Math.floor(p.x + off); z = Math.floor(p.z + off); y = 0;
    } else if (o?.userData.at) {
      const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
      const a = ['x', 'y', 'z'].reduce((m, k) => (Math.abs(n[k]) > Math.abs(n[m]) ? k : m), 'x');
      const at = o.userData.at; x = at.x; y = at.y; z = at.z;
      if (a === 'x') x += Math.sign(n.x); else if (a === 'y') y += Math.sign(n.y); else z += Math.sign(n.z);
    } else return;
    if (x < 0 || z < 0 || x >= S.N || z >= S.N || y < 0 || y >= S.H) { Snd.play('bad'); return; }
    if (S.map.has(keyOf(x, y, z))) return;
    this.put(x, y, z, S.color, true);
  },
  put(x, y, z, c, user) {
    const m = SPECIAL[c] ? SPECIAL[c]() : makeBlock(c);
    m.traverse(n => { n.castShadow = true; n.receiveShadow = true; });
    m.position.copy(this.cellPos(x, y, z));
    m.userData.at = { x, y, z, c };
    S.blocks.add(m); S.map.set(keyOf(x, y, z), m);
    if (user) {
      S.undo.push(['put', x, y, z, c]);
      Snd.play('place', Math.min(9, y * 2));
      const y0 = m.position.y; const sc = S.ctx.scope;
      sc.tween(0.28, t => { m.scale.setScalar(Math.max(0.01, easeOutBack(t))); m.position.y = y0 + (1 - t) * 0.5; });
      FX.sparkle(m.position, 4, { speed: 1.5, size: 0.3 });
      S.onChange?.({ put: [x, y, z, c], mesh: m });
    }
    return m;
  },
  remove(at, user) {
    const k = keyOf(at.x, at.y, at.z), m = S.map.get(k); if (!m) return;
    S.map.delete(k);
    if (user) { S.undo.push(['del', at.x, at.y, at.z, at.c]); Snd.play('remove'); }
    const sc = S.ctx.scope;
    sc.tween(0.18, t => m.scale.setScalar(1 - t)).then(() => { S.blocks.remove(m); disposeDeep(m); });
    if (user) S.onChange?.({ del: at });
  },
  undo() {
    const u = S.undo.pop(); if (!u) return;
    const [kind, x, y, z, c] = u;
    if (kind === 'put') this.remove({ x, y, z, c }, false); else this.put(x, y, z, c, false);
    Snd.play('remove'); S.onChange?.({ undo: true });
  },
  clearBlocks() { for (const m of [...S.map.values()]) { S.blocks.remove(m); disposeDeep(m); } S.map.clear(); S.undo = []; },
  built() { return [...S.map.values()].map(m => ({ ...m.userData.at })); },

  // the little window that shows the model, turning together with the main view
  sample(v, turnQ = 0) {
    const scene = new THREE.Scene();
    scene.environment = Stage.env; scene.environmentIntensity = 0.5;
    makeLights(scene, false);
    const cells = cellsOf(v), w = Math.max(...cells.map(c => c.x)) + 1, d = Math.max(...cells.map(c => c.z)) + 1, h = v.length;
    const holder = new THREE.Group(); scene.add(holder);
    const model = buildModel(v); holder.add(model);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(w, d) * 0.75 + 0.6, Math.max(w, d) * 0.75 + 0.7, 0.3, 40), new THREE.MeshStandardMaterial({ color: '#FFF6E6', roughness: 0.8 }));
    ped.position.y = -0.15; holder.add(ped);
    const flag = SPECIAL.flag(); flag.position.set(0, 0.5, Math.max(w, d) * 0.75 + 0.25); flag.scale.setScalar(0.9); holder.add(flag);
    holder.rotation.y = turnQ * Math.PI / 2;
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const r = Math.hypot(Math.max(w, d) * 0.75 + 0.7, h) * 0.75 + 0.6;
    const p = UI.panel(); p.innerHTML = ''; p.className = 'clear';
    const box = document.createElement('div'); box.className = 'inset'; box.innerHTML = '<span class="tag">👀</span>'; p.appendChild(box);
    if (S.insetStop) S.insetStop();
    const stop = S.insetStop = Stage.addInset({
      el: box, scene, camera: cam, bg: 0xEAF7FF,
      before: (bw, bh) => {
        const c = Stage.cur, dist = r / Math.sin(THREE.MathUtils.degToRad(Math.min(30, 30 * bw / bh)) / 2);
        cam.position.set(Math.sin(c.yaw) * Math.cos(c.pitch) * dist, h / 2 + Math.sin(c.pitch) * dist, Math.cos(c.yaw) * Math.cos(c.pitch) * dist);
        cam.lookAt(0, h / 2 - 0.2, 0);
      },
    });
    S.ctx.scope.own(stop);
    return { scene, holder };
  },
  // colour chips for the colours this model needs (plus the eraser and undo)
  palette(colors, o = {}) {
    const items = colors.map(c => ({ id: 'c' + c, cls: 'chip', html: '', color: COLORS[c], label: c, fn: b => { S.tool = 'put'; S.color = c; mark(b); Snd.play('select'); } }));
    items.push('|', { id: 'erase', icon: '🧽', label: '拿走积木', fn: b => { S.tool = S.tool === 'erase' ? 'put' : 'erase'; mark(S.tool === 'erase' ? b : out['c' + S.color]); Snd.play('select'); } },
      { id: 'undo', icon: '↩️', label: '退回一步', fn: () => this.undo() });
    if (o.extra) items.push(...o.extra);
    const out = UI.tools(items);
    const mark = b => { Object.values(out).forEach(x => x.classList.remove('on')); b?.classList.add('on'); };
    S.color = colors[0]; mark(out['c' + colors[0]]);
    return out;
  },

  async round(R, cfg, r) {
    if (r === 0 || !S) { Stage.clear(); this.board(R.ctx, cfg.N); }
    else { this.clearBlocks(); S.ghosts.clear(); }
    S.lock = false;
    if (cfg.kind === 'views') return this.viewsRound(R, cfg, r);
    // which model this round (no repeats within a level)
    S.used = r === 0 ? [] : S.used;
    const name = pick(cfg.models.filter(m => !S.used.includes(m))); S.used.push(name);
    const M = MODELS[name], target = cellsOf(M.v);
    const turnQ = cfg.kind === 'turn' ? pick([1, 2, 3]) : 0;
    const colors = cfg.kind === 'ghost' ? [pick(CANDY)] : [...new Set(target.map(c => c.c))];
    UI.layout({ panel: cfg.kind !== 'ghost', tools: true });
    this.palette(cfg.kind === 'ghost' ? colors : shuffle(colors.concat(pick(CANDY.filter(c => !colors.includes(c))))));
    // where it should go on the board: centred
    const w = Math.max(...target.map(c => c.x)) + 1, d = Math.max(...target.map(c => c.z)) + 1;
    const ox = Math.floor((cfg.N - w) / 2), oz = Math.floor((cfg.N - d) / 2);
    if (cfg.kind === 'ghost') {
      for (const c of target) { const gh = makeGhost(colors[0], 0.4); gh.position.copy(this.cellPos(c.x + ox, c.y, c.z + oz)); gh.userData.cell = keyOf(c.x + ox, c.y, c.z + oz); S.ghosts.add(gh); }
      R.scope.tick((dt, t) => S.ghosts.children.forEach((g, i) => g.scale.setScalar(1 + Math.sin(t * 4 + i) * 0.04)));
    } else this.sample(M.v, turnQ);
    UI.layout();
    const tgt = cfg.kind === 'ghost' ? null : norm(target);
    const showGhosts = () => {
      // see-through blocks for what is missing, lined up with what is already built
      S.ghosts.clear();
      const b = this.built(); let best = { k: -1, dx: ox, dz: oz };
      for (let dx = -2; dx < cfg.N; dx++) for (let dz = -2; dz < cfg.N; dz++) {
        if (target.some(c => c.x + dx < 0 || c.z + dz < 0 || c.x + dx >= cfg.N || c.z + dz >= cfg.N)) continue;
        const k = target.filter(c => S.map.has(keyOf(c.x + dx, c.y, c.z + dz)) && S.map.get(keyOf(c.x + dx, c.y, c.z + dz)).userData.at.c === c.c).length;
        if (k > best.k) best = { k, dx, dz };
      }
      for (const c of target) {
        const at = S.map.get(keyOf(c.x + best.dx, c.y, c.z + best.dz));
        if (at && at.userData.at.c === c.c) continue;
        const gh = makeGhost(c.c, 0.45); gh.position.copy(this.cellPos(c.x + best.dx, c.y, c.z + best.dz)); S.ghosts.add(gh);
      }
      for (const m of S.map.values()) { const a = m.userData.at; const ok = target.some(c => c.x + best.dx === a.x && c.y === a.y && c.z + best.dz === a.z && c.c === a.c); if (!ok) wobble(m); }
    };
    const wobble = m => R.scope.tween(0.5, t => { m.rotation.z = Math.sin(t * Math.PI * 6) * 0.25 * (1 - t); });
    return new Promise(done => {
      let full = false;
      S.onChange = async ev => {
        if (cfg.kind === 'ghost') {
          if (ev.put) {
            const k = keyOf(ev.put[0], ev.put[1], ev.put[2]), gh = S.ghosts.children.find(g => g.userData.cell === k);
            if (gh) S.ghosts.remove(gh);
            else { R.miss(); wobble(ev.mesh); R.scope.after(0.5, () => this.remove(ev.mesh.userData.at, false)); R.say(L.build.notHere); return; }
          }
          if (!S.ghosts.children.length) win();
          return;
        }
        const b = this.built();
        if (b.length < target.length) { full = false; return; }
        const bs = norm(b);
        const qs = cfg.kind === 'turn' ? [0] : [0, 1, 2, 3];
        if (qs.some(q => sig(norm(bs, q), true) === sig(tgt, true))) return win();
        if (!full || b.length > target.length) { full = true; R.miss(); R.say(b.length > target.length ? L.build.tooMany : L.build.almost); showGhosts(); R.scope.after(3.5, () => S.ghosts.clear()); }
      };
      const win = async () => {
        S.lock = true; S.onChange = null; S.ghosts.clear();
        const ctr = new THREE.Vector3(); for (const m of S.map.values()) ctr.add(m.position); ctr.divideScalar(Math.max(1, S.map.size));
        R.good(ctr.clone().setY(ctr.y + 1), true);
        R.say(cfg.kind === 'ghost' ? L.build.done : L.build.made[name] || L.build.done);
        await this.celebrate(R, M);
        if (!R.scope.dead) done();
      };
      R.onHint = () => { if (cfg.kind === 'ghost') return; showGhosts(); R.say(L.build.hint); R.scope.after(4, () => S.ghosts.clear()); };
      R.idle(20, () => { if (S.lock) return; if (cfg.kind === 'ghost') R.say(L.build.ghost); else R.say(cfg.kind === 'turn' ? L.build.turnAsk[name] : L.build.ask[name]); });
      R.ask(cfg.kind === 'ghost' ? L.build.ghost : cfg.kind === 'turn' ? L.build.turnAsk[name] : L.build.ask[name]);
      if (cfg.kind === 'ghost' && r === 0 && R.ctx.li === 0) R.scope.after(3, () => {
        const gh = S.ghosts.children[0]; if (!gh || S.map.size) return;
        const p = Stage.toScreen(gh.position); R.scope.own(UI.hand(p.x, p.y, { sec: 4 }));
      });
    });
  },
  async celebrate(R, M) {
    const ms = [...S.map.values()], y0 = ms.map(m => m.position.y);
    if (M?.fly) {
      Snd.play('whoosh');
      FX.sparkle(ms[0].position.clone(), 30, { speed: 4, color: '#FFB347' });
      await R.tween(1.2, t => ms.forEach((m, i) => (m.position.y = y0[i] + Math.sin(t * Math.PI) * 4)), { ease: easeInOut });
    } else {
      await R.tween(1.0, t => ms.forEach((m, i) => { m.position.y = y0[i] + Math.sin(t * Math.PI) * 0.8; m.rotation.y = t * Math.PI * 2; }), { ease: easeInOut });
    }
    ms.forEach((m, i) => { m.position.y = y0[i]; m.rotation.y = 0; });
    await R.wait(0.5);
  },

  // build from two pictures: the bear's (front) and the bird's (top). Any build that looks the same from both is right.
  async viewsRound(R, cfg, r) {
    const color = pick(CANDY), N = cfg.N;
    let h, front, top;
    for (let t = 0; t < 200; t++) {
      h = genHeights(N, cfg.b[0], cfg.b[1], 3);
      front = viewOf(h, 'front', 3); top = viewOf(h, 'top', N);
      if (top.flat().filter(Boolean).length >= 3 && front.flat().some(v => !v)) break;
    }
    if (r === 0) {
      const bear = makeAnimal('bear', 0.6); bear.position.set(0, 0, N / 2 + 1.4); Stage.root.add(bear);
      const bird = makeAnimal('chick', 0.5); bird.position.set(N / 2 + 0.6, 3.6, -N / 2); bird.rotation.x = 0.7; Stage.root.add(bird);
      S.bear = bear; S.bird = bird;
      R.ctx.scope.tick((dt, t) => { bird.position.y = 3.6 + Math.sin(t * 2) * 0.15; bird.userData.arms.forEach((a, i) => (a.rotation.z = (i ? 1 : -1) * (0.6 + Math.sin(t * 16) * 0.5))); });
    }
    UI.layout({ panel: 'wide', tools: true });
    this.palette([color]);
    const cards = UI.options([{ k: 'front', m: front }, { k: 'top', m: top }], {
      aspect: 1.15, html: it => `<span class="lbl" style="font-size:calc(var(--b)*.5)">${it.k === 'front' ? '🐻' : '🐦'}</span>`,
      draw: (it, x, w, hh) => drawPic(x, w * 0.92, hh, it.m.map(r2 => r2.slice()), color),
      pick: it => { animalDo(it.k === 'front' ? S.bear : S.bird, 'wave'); R.say(it.k === 'front' ? L.build.bearSees : L.build.birdSees); },
    });
    // pictures of a set of blocks, shifted to the corner so a build matches wherever on the board it stands
    const picsOf = cells => {
      if (!cells.length) return null;
      const n = norm(cells), w = Math.max(...n.map(c => c.x)) + 1, d = Math.max(...n.map(c => c.z)) + 1, hh = Math.max(...n.map(c => c.y)) + 1;
      if (w > N || d > N || hh > 3) return null;
      const fr = [], tp = [];
      for (let y = 2; y >= 0; y--) { const row = []; for (let x = 0; x < N; x++) row.push(n.some(c => c.x === x && c.y === y)); fr.push(row); }
      for (let z = 0; z < N; z++) { const row = []; for (let x = 0; x < N; x++) row.push(n.some(c => c.x === x && c.z === z)); tp.push(row); }
      return picKey(fr) + '|' + picKey(tp);
    };
    const tcells = []; h.forEach((col, x) => col.forEach((hgt, z) => { for (let y = 0; y < hgt; y++) tcells.push({ x, y, z, c: color }); }));
    const want = picsOf(tcells);
    return new Promise(done => {
      S.onChange = async () => {
        if (picsOf(this.built()) === want) {
          S.lock = true; S.onChange = null;
          cards.forEach(c => c.classList.add('right'));
          const ctr = new THREE.Vector3(); for (const m of S.map.values()) ctr.add(m.position); ctr.divideScalar(S.map.size);
          R.good(ctr.clone().setY(ctr.y + 1), true); animalDo(S.bear, 'hop', 2); animalDo(S.bird, 'spin');
          R.say(L.build.views2);
          await this.celebrate(R, null);
          if (!R.scope.dead) done();
        }
      };
      R.onHint = () => {
        S.ghosts.clear();
        h.forEach((col, x) => col.forEach((hgt, z) => { for (let y = 0; y < hgt; y++) { if (S.map.has(keyOf(x, y, z))) continue; const g = makeGhost(color, 0.45); g.position.copy(this.cellPos(x, y, z)); S.ghosts.add(g); } }));
        R.say(L.build.hint); R.scope.after(4, () => S.ghosts.clear());
      };
      R.idle(25, () => { if (!S.lock) R.say(L.build.viewsAsk); });
      R.ask(L.build.viewsAsk);
    });
  },

  /* ---------- free play ---------- */
  free(ctx) {
    Stage.clear();
    this.board(ctx, ctx.cfg.N, ctx.cfg.H);
    UI.layout({ panel: true, tools: true });
    // colours and special pieces in the panel
    const p = UI.panel(); p.innerHTML = ''; p.className = '';
    const grid = document.createElement('div'); grid.className = 'grid'; p.appendChild(grid);
    const kinds = ['r', 'o', 'y', 'g', 'c', 'b', 'p', 'k', 'w', 'n', 'd', 'roof', 'window', 'door', 'tree', 'flag'];
    const icon = { roof: '🔺', window: '🪟', door: '🚪', tree: '🌲', flag: '🚩' };
    const chips = kinds.map(k => {
      const b = document.createElement('button'); b.className = 'opt'; b.setAttribute('aria-label', k);
      b.innerHTML = icon[k] ? `<span style="font-size:calc(var(--b)*.55)">${icon[k]}</span>` : `<span class="swatch" style="background:${COLORS[k]}"></span>`;
      b.addEventListener('click', () => { S.tool = 'put'; S.color = k; chips.forEach(c => c.classList.remove('right')); b.classList.add('right'); tools.erase.classList.remove('on'); Snd.play('select'); });
      grid.appendChild(b); return b;
    });
    const fitGrid = () => {
      const r = grid.getBoundingClientRect(), n = kinds.length;
      let best = { s: 0, c: 4 };
      for (let c = 2; c <= n; c++) { const rows = Math.ceil(n / c), s = Math.min((r.width - UI.g * (c - 1)) / c, (r.height - UI.g * (rows - 1)) / rows); if (s > best.s) best = { s, c }; }
      grid.style.gridTemplateColumns = `repeat(${best.c}, 1fr)`; grid.style.gridTemplateRows = `repeat(${Math.ceil(n / best.c)}, 1fr)`;
    };
    S.color = 'r'; chips[0].classList.add('right');
    const tools = UI.tools([
      { id: 'erase', icon: '🧽', label: '拿走积木', fn: b => { S.tool = S.tool === 'erase' ? 'put' : 'erase'; b.classList.toggle('on', S.tool === 'erase'); Snd.play('select'); } },
      { id: 'undo', icon: '↩️', label: '退回一步', fn: () => { this.undo(); save(); } },
      '|',
      { id: 'castle', icon: '🏰', label: '放一座城堡', fn: () => { load(MODELS.castle.v); save(); Snd.play('open'); } },
      { id: 'clear', icon: '🗑️', label: '全部拿走', fn: b => { if (!b.dataset.armed) { b.dataset.armed = 1; b.classList.add('glow'); setTimeout(() => { delete b.dataset.armed; b.classList.remove('glow'); }, 2500); return; } this.clearBlocks(); save(); Snd.play('shuffle'); } },
    ]);
    const prevResize = UI.onResize; UI.onResize = () => { prevResize?.(); fitGrid(); };
    UI.layout();
    const save = () => { Store.d.build = this.built(); Store.save(); };
    const load = v => {
      this.clearBlocks();
      const cs = cellsOf(v), w = Math.max(...cs.map(c => c.x)) + 1, d = Math.max(...cs.map(c => c.z)) + 1;
      const ox = Math.floor((S.N - w) / 2), oz = Math.floor((S.N - d) / 2);
      cs.forEach((c, i) => ctx.scope.after(i * 0.03, () => { this.put(c.x + ox, c.y, c.z + oz, c.c, false); Snd.play('place', c.y); if (i === cs.length - 1) save(); }));
    };
    S.onChange = () => save();
    if (Array.isArray(Store.d.build)) Store.d.build.forEach(a => { if (a.x < S.N && a.z < S.N && a.y < S.H) this.put(a.x, a.y, a.z, a.c, false); });
    Voice.say(L.build.free);
  },
  leave() { S = null; },
};
