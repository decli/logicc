// 魔方世界 · 📦 折纸盒: six squares of paper fold up into a box — or bump into each other.
// Levels: put the missing square where the box closes → is this a box? → which colour ends up opposite the star.
// Every answer is checked by really folding it: each square swings up about the edge it shares with its parent.
import * as THREE from 'three';
import { pick, shuffle, easeInOut, easeOutBack, easeOut } from '../core.js';
import { Stage, disposeDeep } from '../stage.js';
import { UI } from '../ui.js';
import { Snd } from '../audio.js';
import { FX } from '../fx.js';
import { L } from '../lines.js';
import { makeIsland, COLORS, NAMES as COLOR_NAMES } from '../blocks.js';

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const NF = 3.0;                       // camera framing radius
const k2 = (x, z) => x + ',' + z;
const normCells = cs => { const mx = Math.min(...cs.map(c => c[0])), mz = Math.min(...cs.map(c => c[1])); return cs.map(c => [c[0] - mx, c[1] - mz]); };
const canon = cs => normCells(cs).map(c => k2(c[0], c[1])).sort().join(';');
function symmetries(cs) {
  const out = [];
  let cur = cs;
  for (let r = 0; r < 4; r++) { cur = cur.map(([x, z]) => [-z, x]); out.push(normCells(cur)); out.push(normCells(cur.map(([x, z]) => [-x, z]))); }
  return out;
}
// all free hexominoes (35), each as a list of cells
function hexominoes() {
  let level = new Map([[canon([[0, 0]]), [[0, 0]]]]);
  for (let n = 1; n < 6; n++) {
    const next = new Map();
    for (const cs of level.values()) {
      const has = new Set(cs.map(c => k2(...c)));
      for (const [x, z] of cs) for (const [dx, dz] of DIRS) {
        const nc = [x + dx, z + dz]; if (has.has(k2(...nc))) continue;
        const ns = normCells([...cs, nc]), key = canon(ns);
        if (!next.has(key)) next.set(key, ns);
      }
    }
    level = next;
  }
  const free = new Map();
  for (const cs of level.values()) { const key = symmetries(cs).map(canon).sort()[0]; if (!free.has(key)) free.set(key, cs); }
  return [...free.values()];
}

// the fold as a tree: root square, each other square hinged to the one it was reached from
function foldTree(cells, rootIdx = 0) {
  const idx = new Map(cells.map((c, i) => [k2(...c), i])), par = new Array(cells.length).fill(-1), seen = new Set([rootIdx]), q = [rootIdx];
  while (q.length) {
    const i = q.shift();
    for (const [dx, dz] of DIRS) { const j = idx.get(k2(cells[i][0] + dx, cells[i][1] + dz)); if (j !== undefined && !seen.has(j)) { seen.add(j); par[j] = i; q.push(j); } }
  }
  return par;
}
// where each square ends up when folded: centre and normal, rounded
function foldResult(cells, rootIdx = 0) {
  const par = foldTree(cells, rootIdx), M = cells.map(() => null);
  const get = i => {
    if (M[i]) return M[i];
    if (par[i] < 0) return (M[i] = new THREE.Matrix4());
    const p = get(par[i]), d = [cells[i][0] - cells[par[i]][0], cells[i][1] - cells[par[i]][1]];
    const dv = new THREE.Vector3(d[0], 0, d[1]), axis = new THREE.Vector3().crossVectors(dv, new THREE.Vector3(0, 1, 0)).normalize();
    // in the parent's frame: move to the hinge, turn 90° up, move on to the child's centre
    const m = new THREE.Matrix4().makeTranslation(dv.x * 0.5, 0, dv.z * 0.5)
      .multiply(new THREE.Matrix4().makeRotationAxis(axis, Math.PI / 2))
      .multiply(new THREE.Matrix4().makeTranslation(dv.x * 0.5, 0, dv.z * 0.5));
    return (M[i] = p.clone().multiply(m));
  };
  return cells.map((_, i) => {
    const m = get(i), c = new THREE.Vector3().setFromMatrixPosition(m), n = new THREE.Vector3(0, 1, 0).transformDirection(m);
    return { c: [c.x, c.y, c.z].map(v => Math.round(v * 2) / 2), n: [n.x, n.y, n.z].map(Math.round) };
  });
}
export function isNet(cells) {
  if (cells.length !== 6) return false;
  const r = foldResult(cells);
  return new Set(r.map(x => x.c.join(','))).size === 6;
}
const has2x2 = cs => { const s = new Set(cs.map(c => k2(...c))); return cs.some(([x, z]) => s.has(k2(x + 1, z)) && s.has(k2(x, z + 1)) && s.has(k2(x + 1, z + 1))); };

let HEX = null, NETS = null, NOTNETS = null;
function catalogue() {
  if (HEX) return;
  HEX = hexominoes();
  NETS = HEX.filter(isNet);
  // tempting non-boxes: no 2×2 lump (those are easy to reject) and not too long
  NOTNETS = HEX.filter(cs => !isNet(cs) && !has2x2(cs) && Math.max(...cs.map(c => c[0])) <= 4 && Math.max(...cs.map(c => c[1])) <= 3);
}
// 1-4-1 nets (a row of four with one square above and one below) are the easiest family
const is141 = cs => { const xs = cs.map(c => c[0]), zs = cs.map(c => c[1]); const w = Math.max(...xs) + 1, d = Math.max(...zs) + 1; return (w === 4 && d === 3) || (w === 3 && d === 4); };
const isCross = cs => is141(cs) && symmetries(cs).some(s => canon(s) === canon([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]]));

const PAPER = ['r', 'o', 'y', 'g', 'c', 'p'];
let S = null;
export const Nets = {
  levels: [
    { kind: 'fill', pick: 'cross', cands: 2 },
    { kind: 'fill', pick: '141', cands: 3 },
    { kind: 'fill', pick: 'other', cands: 3 },
    { kind: 'yesno' },
    { kind: 'opposite' },
  ],
  intro: (cfg, li) => L.nets.intro[li],

  setup(ctx) {
    catalogue();
    const isl = makeIsland({ radius: 4.6, flowers: 10, grass: '#B7E887' });
    Stage.root.add(isl);
    const table = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.12, 48), new THREE.MeshStandardMaterial({ color: '#F1E9FF', roughness: 0.8 }));
    table.position.y = 0.0; table.receiveShadow = true; Stage.root.add(table);
    Stage.lights.size(6);
    S = { ctx, net: null };
    UI.layout({ panel: true });
    this.view(true);
    UI.onResize = () => { Stage.goal.dist = Stage.fitDist(NF); };
  },
  // looking down at the flat paper, or from the side at the box
  view(flat, instant) {
    const o = flat ? { yaw: 0.25, pitch: 1.0, ty: 0.2 } : { yaw: 0.65, pitch: 0.5, ty: 0.8 };
    if (instant) Stage.look({ ...o, fov: 34, dist: Stage.fitDist(NF), tx: 0, tz: 0 }, true);
    else return Stage.flyTo({ ...o, dist: Stage.fitDist(NF) }, 0.9);
  },

  // build the paper: one hinge group per square, nested like the fold tree
  makeNet(cells, colors, o = {}) {
    if (S.net) { Stage.root.remove(S.net.holder); disposeDeep(S.net.holder); }
    const rootIdx = o.root ?? 0, par = foldTree(cells, rootIdx);
    const xs = cells.map(c => c[0]), zs = cells.map(c => c[1]);
    const [cx, cz] = o.off || [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
    // the holder sits where the box's middle will be (so it spins round itself); the paper lies on the table
    const root = new THREE.Group(); root.position.set(0, 0.08 - 0.55, 0);
    const holder = new THREE.Group(); holder.position.set(cells[rootIdx][0] - cx, 0.55, cells[rootIdx][1] - cz); holder.add(root); Stage.root.add(holder);
    const faces = cells.map(() => null), hinges = cells.map(() => null);
    // both sides of the paper are coloured: flat on the table we see the top, on the closed box the outside
    const sq = (c, i) => {
      const g = new THREE.Group();
      const col = new THREE.MeshStandardMaterial({ color: COLORS[c] || c, roughness: 0.55, emissive: '#000000', map: paperTex(o.star === i), polygonOffset: true, polygonOffsetFactor: -i, polygonOffsetUnits: -i });
      const edge = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.7 });
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.97, 0.05, 0.97), [edge, edge, col, col, edge, edge]);
      m.castShadow = true; m.receiveShadow = true; m.userData.face = i;
      g.add(m); g.userData.mesh = m;
      return g;
    };
    const build = i => {
      const node = sq(colors[i], i); faces[i] = node;
      if (par[i] < 0) { root.add(node); }
      else {
        const p = par[i], d = [cells[i][0] - cells[p][0], cells[i][1] - cells[p][1]];
        const hinge = new THREE.Group(); hinge.position.set(d[0] * 0.5, 0, d[1] * 0.5);
        hinge.userData.axis = new THREE.Vector3().crossVectors(new THREE.Vector3(d[0], 0, d[1]), new THREE.Vector3(0, 1, 0)).normalize();
        node.position.set(d[0] * 0.5, 0, d[1] * 0.5);
        hinge.add(node); faces[p].add(hinge); hinges[i] = hinge;
      }
      cells.forEach((_, j) => { if (par[j] === i) build(j); });
    };
    build(rootIdx);
    S.net = { cells, colors, root, holder, faces, hinges, par, rootIdx, off: [cx, cz] };
    return S.net;
  },
  setFold(k) { S.net.hinges.forEach(h => { if (h) h.quaternion.setFromAxisAngle(h.userData.axis, k * Math.PI / 2); }); },
  // fold up (k: 0 → 1) and say whether it closed
  async fold(R) {
    Snd.play('fold', 0);
    const ok = isNet(S.net.cells.map(c => c.slice()));
    await R.tween(1.5, t => this.setFold(t), { ease: easeInOut });
    Snd.play(ok ? 'make' : 'bonk');
    return ok;
  },
  async unfold(R) { Snd.play('fold', 3); await R.tween(1.0, t => this.setFold(1 - t), { ease: easeInOut }); },
  // the squares that ended up in the same place
  clashes() {
    const r = foldResult(S.net.cells, S.net.rootIdx), seen = new Map(), out = new Set();
    r.forEach((x, i) => { const k = x.c.join(','); if (seen.has(k)) { out.add(i); out.add(seen.get(k)); } else seen.set(k, i); });
    return [...out];
  },
  async flash(R, idx) {
    const ms = idx.map(i => S.net.faces[i].userData.mesh.material[2]);
    await R.tween(1.2, t => ms.forEach(m => m.emissive.setRGB(0.6 * Math.abs(Math.sin(t * Math.PI * 4)), 0.1, 0.1)));
    ms.forEach(m => m.emissive.setRGB(0, 0, 0));
  },
  // a closed box: a bow on top, a little jump, confetti
  async celebrate(R) {
    const h = S.net.holder, y0 = h.position.y;
    FX.confetti(new THREE.Vector3(0, 1.4, 0), 70, 4.5);
    await R.tween(0.9, t => { h.position.y = y0 + Math.sin(t * Math.PI) * 0.9; h.rotation.y = t * Math.PI * 2; }, { ease: easeInOut });
    h.position.y = y0; h.rotation.y = 0;
  },

  async round(R, cfg, r) {
    S.cands?.forEach(c => Stage.root.remove(c)); S.cands = null; if (S.piece) { Stage.root.remove(S.piece); S.piece = null; }
    await this.view(true);
    if (cfg.kind === 'yesno') return this.yesno(R, cfg, r);
    if (cfg.kind === 'opposite') return this.opposite(R, cfg, r);
    // a net with one square missing, and a few places to put it
    const pool = cfg.pick === 'cross' ? NETS.filter(isCross) : cfg.pick === '141' ? NETS.filter(cs => is141(cs) && !isCross(cs)) : NETS.filter(cs => !is141(cs));
    let net, miss, cands;
    for (let t = 0; t < 200; t++) {
      net = pick(symmetries(pick(pool)));
      const mi = pick(net.map((_, i) => i)), rest = net.filter((_, i) => i !== mi);
      // the rest must still hang together
      if (foldTree(rest, 0).filter(p => p < 0).length !== 1) continue;
      const has = new Set(rest.map(c => k2(...c))), empty = new Map();
      for (const [x, z] of rest) for (const [dx, dz] of DIRS) { const c = [x + dx, z + dz]; if (!has.has(k2(...c))) empty.set(k2(...c), c); }
      const good = [...empty.values()].filter(c => isNet([...rest, c])), bad = [...empty.values()].filter(c => !isNet([...rest, c]));
      if (!good.length || bad.length < cfg.cands - 1) continue;
      miss = { rest, good: pick(good) };
      cands = shuffle([miss.good, ...shuffle(bad).slice(0, cfg.cands - 1)]);
      break;
    }
    const colors = shuffle(PAPER);
    // root: a square in the middle of the rest (so the box closes over it)
    const order = miss.rest;
    this.makeNet(order, colors.slice(0, 5), { root: this.centralIdx(order) });
    const n = S.net;
    // pop the paper in
    n.holder.scale.setScalar(0.01); await R.tween(0.45, t => n.holder.scale.setScalar(easeOutBack(t)));
    // the loose square floats beside the table
    const piece = S.piece = new THREE.Mesh(new THREE.BoxGeometry(0.97, 0.05, 0.97), new THREE.MeshStandardMaterial({ color: COLORS[colors[5]], roughness: 0.55, map: paperTex(false) }));
    piece.castShadow = true; const home = new THREE.Vector3(2.8, 1.4, -1.4); piece.position.copy(home); Stage.root.add(piece);
    R.scope.tick((dt, t) => { if (!piece.userData.moving) { piece.position.y = home.y + Math.sin(t * 2) * 0.12; piece.rotation.y = Math.sin(t) * 0.3; piece.rotation.x = 0.4; } });
    // dashed places to try
    const [cx, cz] = n.off;
    S.cands = cands.map(c => {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: dashTex(), transparent: true, depthWrite: false }));
      g.rotation.x = -Math.PI / 2; g.position.set(c[0] - cx, 0.1, c[1] - cz); g.userData.cell = c; Stage.root.add(g); return g;
    });
    R.scope.tick((dt, t) => S.cands?.forEach((g, i) => { if (!g.userData.used) g.material.opacity = 0.65 + 0.35 * Math.sin(t * 4 + i); }));
    let busy = false, wrong = 0;
    UI.clearPanel();
    return new Promise(done => {
      Stage.handlers = {
        tap: async g => {
          if (busy) return;
          const hit = Stage.pick(g.x, g.y, S.cands.filter(c => !c.userData.used)); if (!hit) return;
          busy = true; const spot = hit.object, cell = spot.userData.cell;
          spot.visible = false; Snd.play('select');
          // the square flies in, joins the paper, and everything folds
          piece.userData.moving = true;
          const p0 = piece.position.clone(), p1 = new THREE.Vector3(cell[0] - cx, 0.08, cell[1] - cz), r0 = piece.rotation.clone();
          await R.tween(0.6, t => { piece.position.lerpVectors(p0, p1, t); piece.position.y += Math.sin(t * Math.PI) * 1.2; piece.rotation.set(r0.x * (1 - t), r0.y * (1 - t), 0); }, { ease: easeInOut });
          if (R.scope.dead) return;
          piece.visible = false;
          const all = [...n.cells, cell];
          this.makeNet(all, [...colors.slice(0, 5), colors[5]], { root: this.centralIdx(all), off: [cx, cz] });
          await R.wait(0.2);
          this.view(false);
          const ok = await this.fold(R); if (R.scope.dead) return;
          if (ok) {
            R.good(new THREE.Vector3(0, 1.4, 0), wrong === 0); R.say(L.nets.folded);
            await this.celebrate(R); await R.wait(0.4); if (!R.scope.dead) done();
            return;
          }
          R.miss(); wrong++; R.say(L.nets.overlap);
          await this.flash(R, this.clashes()); await R.wait(0.4); await this.unfold(R); if (R.scope.dead) return;
          // back to five squares; that spot is used up
          this.makeNet(n.cells, colors.slice(0, 5), { root: this.centralIdx(n.cells), off: [cx, cz] });
          spot.userData.used = true; spot.visible = true; spot.material.opacity = 0.15;
          piece.visible = true; piece.position.copy(p1);
          await R.tween(0.6, t => { piece.position.lerpVectors(p1, home, t); piece.position.y += Math.sin(t * Math.PI) * 1.2; });
          piece.userData.moving = false;
          await this.view(true); busy = false;
        },
      };
      R.scope.own(() => (Stage.handlers = null));
      R.onHint = () => { if (busy) return; const right = S.cands.find(c => c.userData.cell === miss.good); if (!right) return; R.scope.tween(1.5, t => right.scale.setScalar(1 + Math.sin(t * Math.PI * 4) * 0.25)); };
      R.idle(15, () => { if (!busy) R.say(L.nets.fill); });
      R.ask(L.nets.fill);
      if (r === 0 && R.ctx.li === 0) R.scope.after(3.5, () => { if (busy || R.touched) return; const c = S.cands.find(x => x.userData.cell === miss.good) || S.cands[0]; const p = Stage.toScreen(c.position); R.scope.own(UI.hand(p.x, p.y, { sec: 3.5 })); });
    });
  },
  centralIdx(cells) {
    // the square with the most neighbours (ties: nearest the middle)
    const s = new Set(cells.map(c => k2(...c)));
    const xs = cells.map(c => c[0]), zs = cells.map(c => c[1]), mx = (Math.min(...xs) + Math.max(...xs)) / 2, mz = (Math.min(...zs) + Math.max(...zs)) / 2;
    let best = 0, bs = -1;
    cells.forEach(([x, z], i) => { const nb = DIRS.filter(([dx, dz]) => s.has(k2(x + dx, z + dz))).length, sc = nb * 10 - Math.hypot(x - mx, z - mz); if (sc > bs) { bs = sc; best = i; } });
    return best;
  },

  // can it fold into a box? 📦 or ❌ — then fold it to see
  async yesno(R, cfg, r) {
    const want = r === 1 ? pick([true, false]) : r === 0;
    const cells = pick(symmetries(pick(want ? NETS : NOTNETS)));
    const colors = shuffle(PAPER);
    this.makeNet(cells, colors, { root: this.centralIdx(cells) });
    S.net.holder.scale.setScalar(0.01); await R.tween(0.45, t => S.net.holder.scale.setScalar(easeOutBack(t)));
    let busy = false;
    return new Promise(done => {
      const cards = UI.options([true, false], {
        aspect: 1.1, html: v => `<span class="num" style="font-size:calc(var(--b)*1.1)">${v ? '📦' : '❌'}</span>`, label: v => (v ? '能折成盒子' : '折不成'),
        pick: async (v, i, card) => {
          if (busy) return; busy = true;
          const right = v === want;
          if (right) { card.classList.add('right'); R.good(null, true); } else { R.miss(); UI.shake(card); R.say(L.nets.lets); }
          cards.forEach(c => c !== card && c.classList.add('dim'));
          await R.wait(0.8); this.view(false);
          const ok = await this.fold(R); if (R.scope.dead) return;
          if (ok) { R.say(L.nets.can); await this.celebrate(R); }
          else { R.say(L.nets.cannot); await this.flash(R, this.clashes()); }
          await R.wait(0.8); if (R.scope.dead) return;
          if (!ok) await this.unfold(R);
          done();
        },
      });
      R.onHint = () => { if (busy) return; busy = true; this.view(false); R.tween(0.8, t => this.setFold(t * 0.6)).then(() => R.wait(1.2)).then(() => R.tween(0.6, t => this.setFold(0.6 * (1 - t)))).then(() => { busy = false; this.view(true); }); };
      R.idle(15, () => { if (!busy) R.say(L.nets.yesno); });
      R.ask(L.nets.yesno);
    });
  },

  // which colour ends up opposite the star?
  async opposite(R, cfg, r) {
    const cells = pick(symmetries(pick(NETS))), colors = shuffle(PAPER);
    const res = foldResult(cells, 0);
    const star = pick(cells.map((_, i) => i));
    // the opposite square: its centre is the star's mirrored through the middle of the box
    const ctr = [0, 1, 2].map(k => res.reduce((a, y) => a + y.c[k], 0) / 6);
    const oi = res.findIndex((x, i) => i !== star && x.c.every((v, k) => Math.abs(v - (2 * ctr[k] - res[star].c[k])) < 0.01));
    this.makeNet(cells, colors, { root: this.centralIdx(cells), star });
    S.net.holder.scale.setScalar(0.01); await R.tween(0.45, t => S.net.holder.scale.setScalar(easeOutBack(t)));
    const others = shuffle(cells.map((_, i) => i).filter(i => i !== star && i !== oi)).slice(0, 2);
    const opts = shuffle([oi, ...others]);
    let busy = false, wrong = 0;
    return new Promise(done => {
      const show = async () => {
        this.view(false);
        await this.fold(R); if (R.scope.dead) return;
        // glow the two faces and turn the box round so both are seen
        const ms = [star, oi].map(i => S.net.faces[i].userData.mesh.material[2]);
        const h = S.net.holder;
        const y0 = h.position.y;
        await R.tween(2.6, t => { ms.forEach(m => m.emissive.setRGB(0.35 * (0.5 + 0.5 * Math.sin(t * 20)), 0.3 * (0.5 + 0.5 * Math.sin(t * 20)), 0.05)); h.rotation.y = t * Math.PI * 2; h.rotation.x = Math.sin(t * Math.PI * 2) * 0.9; h.position.y = y0 + Math.sin(t * Math.PI) * 1.2; }, { ease: easeInOut });
        ms.forEach(m => m.emissive.setRGB(0, 0, 0)); h.rotation.set(0, 0, 0); h.position.y = y0;
      };
      const cards = UI.options(opts, {
        aspect: 1.1, html: i => `<span class="swatch" style="background:${COLORS[colors[i]]}"></span>`, label: i => COLOR_NAMES[colors[i]] || '颜色',
        pick: async (i, k, card) => {
          if (busy) return; busy = true;
          if (i === oi) {
            card.classList.add('right'); cards.forEach(c => c !== card && c.classList.add('dim'));
            R.good(null, wrong === 0); await R.wait(0.6); R.say(L.nets.oppIs); await show(); if (R.scope.dead) return;
            await R.wait(0.5); done();
          } else {
            R.miss(); wrong++; UI.shake(card); R.say(L.nets.oppWrong);
            await R.wait(0.6); await show(); if (R.scope.dead) return;
            await this.unfold(R); await this.view(true); busy = false;
          }
        },
      });
      R.onHint = async () => { if (busy) return; busy = true; await show(); if (!R.scope.dead) { await this.unfold(R); await this.view(true); } busy = false; };
      R.idle(18, () => { if (!busy) R.say(L.nets.opposite); });
      R.ask(L.nets.opposite);
    });
  },
  leave() { S = null; },
};

// paper texture: a white border, and a star on the special square
const texCache = {};
function paperTex(star) {
  const k = star ? 's' : 'p'; if (texCache[k]) return texCache[k];
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, 128, 128);
  x.strokeStyle = 'rgba(255,255,255,1)'; x.lineWidth = 12; x.strokeRect(6, 6, 116, 116);
  x.strokeStyle = 'rgba(0,0,0,0.12)'; x.lineWidth = 3; x.strokeRect(13, 13, 102, 102);
  if (star) {
    x.fillStyle = '#FFE14D'; x.strokeStyle = '#B07800'; x.lineWidth = 4; x.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 18 : 44; x.lineTo(64 + Math.cos(a) * r, 66 + Math.sin(a) * r); }
    x.closePath(); x.fill(); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.userData.shared = true;
  return (texCache[k] = t);
}
let _dash = null;
function dashTex() {
  if (_dash) return _dash;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = 'rgba(255,255,255,0.55)'; x.fillRect(8, 8, 112, 112);
  x.setLineDash([16, 10]); x.lineWidth = 8; x.strokeStyle = '#7A5CFF'; x.strokeRect(8, 8, 112, 112);
  x.fillStyle = '#7A5CFF'; x.font = '900 64px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', 64, 68);
  _dash = new THREE.CanvasTexture(c); _dash.colorSpace = THREE.SRGBColorSpace; _dash.userData.shared = true;
  return _dash;
}
