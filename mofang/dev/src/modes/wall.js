// 魔方世界 · 🧱 钻墙洞: a block creature has to get through the hole in a brick wall.
// Turn it with the buttons (or swipe it), then press go. Its shadow on the wall shows how it looks from behind;
// when the shadow and the hole match, the hole lights up. Through: the wall bursts. Not through: bonk, try again.
import * as THREE from 'three';
import { pick, shuffle, clamp, easeInOut, easeIn, easeOut, rand } from '../core.js';
import { Stage } from '../stage.js';
import { UI } from '../ui.js';
import { Snd } from '../audio.js';
import { FX } from '../fx.js';
import { L } from '../lines.js';
import { CANDY, makeBlock, makeIsland, COLORS, GEO } from '../blocks.js';

// quarter turns as integer matrices (rows)
const RX = [[1, 0, 0], [0, 0, -1], [0, 1, 0]], RY = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], RZ = [[0, -1, 0], [1, 0, 0], [0, 0, 1]];
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const GAP = 4.2;                                               // how far in front of the wall the shape waits
const mul = (A, B) => A.map((r, i) => B[0].map((_, j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
const inv = A => A[0].map((_, i) => A.map(r => r[i]));        // rotations: inverse = transpose
const app = (M, c) => M.map(r => r[0] * c[0] + r[1] * c[1] + r[2] * c[2]);
const mkey = M => M.flat().join(',');
const ROT = { x: RX, y: RY, z: RZ };
const toQuat = M => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().set(M[0][0], M[0][1], M[0][2], 0, M[1][0], M[1][1], M[1][2], 0, M[2][0], M[2][1], M[2][2], 0, 0, 0, 0, 1));
function group(axes) {
  const seen = new Map([[mkey(I3), I3]]), q = [I3];
  while (q.length) { const M = q.shift(); for (const a of axes) { const N = mul(ROT[a], M), k = mkey(N); if (!seen.has(k)) { seen.set(k, N); q.push(N); } } }
  return [...seen.values()];
}
// shadow of the cells along z: set of "x,y" (not shifted)
const proj = (cells, M) => cells.map(c => app(M, c));
function flat2(pts) { const s = new Set(pts.map(p => p[0] + ',' + p[1])); return [...s].map(k => k.split(',').map(Number)); }
function normalize(p2) { const mx = Math.min(...p2.map(p => p[0])), my = Math.min(...p2.map(p => p[1])); return p2.map(p => [p[0] - mx, p[1] - my]); }
const key2 = p2 => normalize(p2).map(p => p.join(',')).sort().join(';');

const FLAT = {
  L4: [[0, 0], [0, 1], [0, 2], [1, 0]], T4: [[0, 0], [1, 0], [2, 0], [1, 1]], S4: [[0, 0], [1, 0], [1, 1], [2, 1]], L3: [[0, 0], [1, 0], [0, 1]],
  J4: [[1, 0], [1, 1], [1, 2], [0, 0]], P5: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], U5: [[0, 0], [0, 1], [1, 0], [2, 0], [2, 1]], L5: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0]],
};
const SOLID = {
  tripod: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]], screw: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]], twist: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1]],
  tower: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 0, 1]], stair: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 1, 1]], hook: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0], [2, 1, 1]],
  chair: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1]],
};

// round button icons: turn in the wall's plane, turn left-right, tip forward
const ICON = {
  z: '<svg viewBox="0 0 48 48" width="70%" height="70%"><path d="M38 24a14 14 0 1 1-6-11.5" fill="none" stroke="#2B2D42" stroke-width="5" stroke-linecap="round"/><path d="M28 6l8 7-9 4z" fill="#2B2D42"/></svg>',
  y: '<svg viewBox="0 0 48 48" width="74%" height="74%"><ellipse cx="24" cy="26" rx="18" ry="8" fill="none" stroke="#2B2D42" stroke-width="5" stroke-dasharray="40 9"/><path d="M36 13l9 10-12 3z" fill="#2B2D42"/><rect x="17" y="10" width="14" height="14" rx="3" fill="#4D7CFE"/></svg>',
  x: '<svg viewBox="0 0 48 48" width="74%" height="74%"><ellipse cx="22" cy="24" rx="8" ry="18" fill="none" stroke="#2B2D42" stroke-width="5" stroke-dasharray="40 9"/><path d="M35 12l-9 9-3-12z" fill="#2B2D42"/><rect x="27" y="17" width="14" height="14" rx="3" fill="#FF5A5F"/></svg>',
};

let S = null;
export const Wall = {
  levels: [
    { kind: 'flat', shapes: ['L4', 'T4', 'S4', 'J4'], axes: ['z'], shadow: true },
    { kind: 'lie', shapes: ['L4', 'T4', 'L3', 'S4'], axes: ['x', 'z'], shadow: true },
    { kind: 'any', shapes: ['L4', 'T4', 'P5', 'U5', 'L5'], axes: ['x', 'y', 'z'], shadow: true },
    { kind: 'any', solid: ['tripod', 'screw', 'twist'], axes: ['x', 'y', 'z'], shadow: true },
    { kind: 'any', solid: ['tower', 'stair', 'hook', 'chair'], axes: ['x', 'y', 'z'], shadow: false },
  ],
  intro: (cfg, li) => L.wall.intro[li],

  setup(ctx) {
    const isl = makeIsland({ radius: 6.2, flowers: 12 });
    isl.position.set(0, 0, 1.5); Stage.root.add(isl);
    // a little runway to the wall
    const run = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 7.4), new THREE.MeshStandardMaterial({ color: '#FFF1D6', roughness: 0.8 }));
    run.position.set(0, 0.0, 3.4); run.receiveShadow = true; Stage.root.add(run);
    Stage.lights.size(8);
    S = { ctx, wall: null, shape: null };
    UI.layout({ tools: 'tall' });
    const fit = () => Stage.fitDist(5.6);
    Stage.look({ yaw: 0.45, pitch: 0.48, fov: 34, dist: fit(), tx: 0, ty: 1.4, tz: 2.2 }, true);
    Stage.lim.yawMin = -0.6; Stage.lim.yawMax = 1.3; Stage.lim.minPitch = 0.05; Stage.lim.maxPitch = 1.0;
    Stage.lim.minDist = Stage.goal.dist * 0.7; Stage.lim.maxDist = Stage.goal.dist * 1.4;
    UI.onResize = () => { Stage.goal.dist = fit(); };
  },

  makePuzzle(cfg) {
    const flat = !!cfg.shapes, name = pick(flat ? cfg.shapes : cfg.solid);
    let cells = flat ? FLAT[name].map(([x, y]) => [x, y, 0]) : SOLID[name].map(c => c.slice());
    if (cfg.kind === 'lie') cells = cells.map(([x, y]) => [x, 0, y]);      // lying flat on the runway
    const G = group(cfg.axes);
    const all = group(['x', 'y', 'z']);
    // target: an orientation that shows the most of the shape (a clear hole)
    const size = M => flat2(proj(cells, M)).length;
    let pool = cfg.kind === 'flat' ? G : cfg.kind === 'lie' ? G.filter(M => size(M) === cells.length) : all;
    const best = Math.max(...pool.map(size));
    pool = pool.filter(M => size(M) === best);
    for (let t = 0; t < 100; t++) {
      const T = pick(pool), hole = normalize(flat2(proj(cells, T)));
      // start: reachable with the allowed buttons, and not already through
      const starts = (cfg.kind === 'any' ? all : G.map(M => mul(M, I3))).filter(M => !this.fits(proj(cells, M), hole).ok);
      if (!starts.length) continue;
      return { cells, hole, M: pick(starts), color: pick(CANDY), name };
    }
    return null;
  },
  // can these rotated cells pass through the hole? (their shadow fits inside it somewhere)
  fits(pts, hole) {
    const p2 = normalize(flat2(pts)), hs = new Set(hole.map(p => p.join(',')));
    const pw = Math.max(...p2.map(p => p[0])), ph = Math.max(...p2.map(p => p[1]));
    const hw = Math.max(...hole.map(p => p[0])), hh = Math.max(...hole.map(p => p[1]));
    for (let dx = 0; dx <= hw - pw; dx++) for (let dy = 0; dy <= hh - ph; dy++) if (p2.every(p => hs.has((p[0] + dx) + ',' + (p[1] + dy)))) return { ok: true, dx, dy, exact: p2.length === hole.length };
    return { ok: false, dx: Math.round((hw - pw) / 2), dy: Math.round((hh - ph) / 2) };
  },

  buildWall(hole) {
    if (S.wall) { Stage.root.remove(S.wall.g); }
    const g = new THREE.Group(); Stage.root.add(g);
    const hw = Math.max(...hole.map(p => p[0])) + 1, hh = Math.max(...hole.map(p => p[1])) + 1;
    const hx = -Math.floor(hw / 2), hy = 1;                    // hole cells start here (grid units)
    const hs = new Set(hole.map(p => (p[0] + hx) + ',' + (p[1] + hy)));
    const x0 = hx - 2, x1 = hx + hw + 1, y1 = hy + hh;      // inclusive ranges
    const bricks = [];
    for (let x = x0; x <= x1; x++) for (let y = 0; y <= y1; y++) {
      if (hs.has(x + ',' + y)) continue;
      const b = makeBlock(((x + y) & 1) ? 'r' : 'o'); b.position.set(x + 0.5, y + 0.5, -0.3); b.scale.z = 0.6; g.add(b); bricks.push(b);
    }
    // the hole's glowing rim (lit when the shadow matches)
    const rim = new THREE.Group();
    for (const p of hole) {
      const q = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.3, depthWrite: false }));
      q.position.set(p[0] + hx + 0.5, p[1] + hy + 0.5, -0.3); rim.add(q);
    }
    g.add(rim);
    const shadow = new THREE.Group(); g.add(shadow);
    S.wall = { g, bricks, hx, hy, hw, hh, rim, shadow, center: new THREE.Vector3(hx + hw / 2, hy + hh / 2, 0) };
    return S.wall;
  },

  makeShape(P) {
    if (S.shape) Stage.root.remove(S.shape.g);
    const g = new THREE.Group(), cen = [0, 1, 2].map(i => P.cells.reduce((a, c) => a + c[i], 0) / P.cells.length);
    P.cells.forEach((c, i) => {
      const b = makeBlock(P.color); b.position.set(c[0] - cen[0], c[1] - cen[1], c[2] - cen[2]); g.add(b);
      if (i === 0) {   // a face, so it is a little creature
        const eyeM = new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.3 }), wM = new THREE.MeshStandardMaterial({ color: '#fff' });
        for (const s of [-1, 1]) {
          const w = new THREE.Mesh(GEO.sphere, wM); w.scale.set(0.14, 0.17, 0.05); w.position.set(s * 0.2, 0.12, 0.49); b.add(w);
          const e = new THREE.Mesh(GEO.sphere, eyeM); e.scale.set(0.08, 0.1, 0.04); e.position.set(s * 0.2, 0.1, 0.53); b.add(e);
        }
        const m = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 6, 12, Math.PI), eyeM); m.rotation.z = Math.PI; m.position.set(0, -0.14, 0.5); b.add(m);
      }
    });
    Stage.root.add(g);
    S.shape = { g, cen, P, M: P.M, t: [0, 0, 0], busy: false };
    return S.shape;
  },
  // where the shape stands for orientation M: its shadow lined up with the hole (or centred on it), in front of the wall
  placeFor(M) {
    const sh = S.shape, W = S.wall, pts = proj(sh.P.cells, M), f = this.fits(pts, sh.P.hole);
    const minX = Math.min(...pts.map(p => p[0])), minY = Math.min(...pts.map(p => p[1])), minZ = Math.min(...pts.map(p => p[2]));
    const t = [W.hx + f.dx - minX, W.hy + f.dy - minY, GAP - minZ];
    return { t, f, pts };
  },
  posFor(M, t) { const c = app(M, S.shape.cen); return new THREE.Vector3(c[0] + t[0] + 0.5, c[1] + t[1] + 0.5, c[2] + t[2] + 0.5); },
  drawShadow(M, show) {
    const W = S.wall, sh = S.shape; W.shadow.clear();
    const { t, f, pts } = this.placeFor(M);
    W.rim.children.forEach(q => { q.material.color.set(f.ok ? '#7CFFB2' : '#FFFFFF'); q.material.opacity = f.ok ? 0.6 : 0.3; });
    if (!show) return f;
    const mat = new THREE.MeshBasicMaterial({ color: '#2B2D42', transparent: true, opacity: 0.32, depthWrite: false });
    for (const p of flat2(pts)) { const q = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.92), mat); q.position.set(p[0] + t[0] + 0.5, p[1] + t[1] + 0.5, 0.02); q.renderOrder = 5; W.shadow.add(q); }
    return f;
  },

  async turn(R, axis, dir = 1) {
    const sh = S.shape; if (!sh || sh.busy) return;
    sh.busy = true; Snd.play('turn');
    const Rm = dir > 0 ? ROT[axis] : inv(ROT[axis]);
    const M0 = sh.M, M1 = mul(Rm, M0), q0 = toQuat(M0), q1 = toQuat(M1);
    const p0 = sh.g.position.clone(), p1 = this.posFor(M1, this.placeFor(M1).t);
    await R.tween(0.32, t => { sh.g.quaternion.slerpQuaternions(q0, q1, t); sh.g.position.lerpVectors(p0, p1, t); sh.g.position.y += Math.sin(t * Math.PI) * 0.4; }, { ease: easeInOut });
    sh.M = M1; sh.busy = false;
    const f = this.drawShadow(M1, S.shadowOn);
    if (f.ok) { Snd.play('ghost'); FX.sparkle(S.wall.center.clone().setZ(0.2), 8, { spread: 0.8, speed: 1.2 }); }
  },

  async go(R) {
    const sh = S.shape; if (!sh || sh.busy) return false;
    sh.busy = true;
    const { t, f, pts } = this.placeFor(sh.M);
    const depth = Math.max(...pts.map(p => p[2])) - Math.min(...pts.map(p => p[2]));
    const p0 = sh.g.position.clone();
    Snd.play('whoosh');
    if (f.ok) {
      const p1 = p0.clone().setZ(p0.z - (GAP + depth + 2.4));
      await R.tween(1.0, k => sh.g.position.lerpVectors(p0, p1, k), { ease: easeIn });
      Snd.play('smash');
      // the wall bursts into flying bricks
      const W = S.wall;
      W.rim.visible = false; W.shadow.visible = false;
      const vel = W.bricks.map(b => new THREE.Vector3(rand(-2, 2) + (b.position.x - W.center.x) * 0.8, rand(2, 6), rand(-4, -1)));
      const spin = W.bricks.map(() => new THREE.Vector3(rand(-6, 6), rand(-6, 6), rand(-6, 6)));
      FX.confetti(W.center.clone().setZ(-0.5), 90, 5.5);
      const stop = R.scope.tick(dt => W.bricks.forEach((b, i) => { vel[i].y -= 12 * dt; b.position.addScaledVector(vel[i], dt); b.rotation.x += spin[i].x * dt; b.rotation.y += spin[i].y * dt; b.scale.multiplyScalar(Math.exp(-0.9 * dt)); }));
      await R.wait(1.4); stop();
      return true;
    }
    // bonk!
    const p1 = p0.clone().setZ(p0.z - GAP + 0.08);
    await R.tween(0.55, k => sh.g.position.lerpVectors(p0, p1, k), { ease: easeIn });
    Snd.play('bonk');
    const W = S.wall, w0 = W.g.position.clone();
    await R.tween(0.4, k => { W.g.position.x = w0.x + Math.sin(k * Math.PI * 8) * 0.08 * (1 - k); sh.g.scale.set(1 + Math.sin(k * Math.PI) * 0.15, 1 - Math.sin(k * Math.PI) * 0.1, 1 - Math.sin(k * Math.PI) * 0.2); });
    await R.tween(0.6, k => sh.g.position.lerpVectors(p1, p0, k), { ease: easeOut });
    sh.g.scale.setScalar(1); sh.busy = false;
    return false;
  },

  async round(R, cfg, r) {
    const P = this.makePuzzle(cfg);
    S.shadowOn = cfg.shadow;
    const W = this.buildWall(P.hole), sh = this.makeShape(P);
    Stage.goal.tx = W.center.x * 0.5; Stage.goal.ty = Math.max(1.4, (W.hy + W.hh) / 2 + 0.3);
    // slide in
    const { t } = this.placeFor(P.M), at = this.posFor(P.M, t);
    sh.g.quaternion.copy(toQuat(P.M));
    const from = at.clone().setZ(at.z + 6);
    await R.tween(0.7, k => sh.g.position.lerpVectors(from, at, k), { ease: easeOut });
    if (R.scope.dead) return;
    this.drawShadow(P.M, S.shadowOn);
    // gentle bobbing while waiting
    R.scope.tick((dt, tt) => { if (!sh.busy) sh.g.position.y = this.posFor(sh.M, this.placeFor(sh.M).t).y + Math.sin(tt * 2.4) * 0.06; });
    let wrong = 0;
    return new Promise(done => {
      const btns = [];
      for (const a of ['z', 'y', 'x']) if (cfg.axes.includes(a)) btns.push({ id: a, html: ICON[a], label: { z: '转圈', y: '左右转', x: '前后翻' }[a], fn: () => this.turn(R, a, a === 'x' ? -1 : 1) });
      btns.push('|', { id: 'go', cls: 'big', html: '<span class="ic">🚀</span>', label: '出发', fn: async b => {
        if (sh.busy) return;
        const ok = await this.go(R);
        if (R.scope.dead) return;
        if (ok) { R.good(W.center.clone().setZ(-1), wrong === 0); R.say(L.wall.through); await R.wait(0.8); done(); }
        else { R.miss(); wrong++; R.say(wrong >= 2 && !S.shadowOn ? L.wall.shadow : L.wall.bonk); if (wrong >= 2 && !S.shadowOn) { S.shadowOn = true; this.drawShadow(sh.M, true); } }
      } });
      UI.tools(btns);
      // swipes on the 3D view turn it too; a tap on it spins it in the wall's plane
      Stage.handlers = {
        down: g => !!Stage.pick(g.x, g.y, [sh.g]),
        move: () => { },
        up: g => {
          const dx = g.x - g.x0, dy = g.y - g.y0;
          if (Math.hypot(dx, dy) < 18) { if (cfg.axes.includes('z')) this.turn(R, 'z', 1); return; }
          if (Math.abs(dx) > Math.abs(dy)) { if (cfg.axes.includes('y')) this.turn(R, 'y', dx > 0 ? 1 : -1); }
          else if (cfg.axes.includes('x')) this.turn(R, 'x', dy < 0 ? -1 : 1);
        },
      };
      R.scope.own(() => (Stage.handlers = null));
      R.onHint = () => {
        // show the shadow, and turn once towards the answer
        S.shadowOn = true; this.drawShadow(sh.M, true); R.say(L.wall.shadow);
        const G = group(cfg.axes), target = P.hole;
        for (const a of ['z', 'y', 'x']) { if (!cfg.axes.includes(a)) continue; for (const d of [1, -1]) { const M1 = mul(d > 0 ? ROT[a] : inv(ROT[a]), sh.M); if (this.fits(proj(P.cells, M1), target).ok) { const b = document.querySelector(`#tools .btn:nth-child(${['z', 'y', 'x'].filter(x => cfg.axes.includes(x)).indexOf(a) + 1})`); b?.classList.add('glow'); R.scope.after(3, () => b?.classList.remove('glow')); return; } } }
      };
      R.idle(15, () => { if (!sh.busy) R.say(L.wall.ask); });
      R.ask(L.wall.ask);
      if (r === 0 && R.ctx.li === 0) R.scope.after(3, () => { const b = document.querySelector('#tools .btn'); if (b && !R.touched) { const rr = b.getBoundingClientRect(); R.scope.own(UI.hand(rr.left + rr.width / 2, rr.top + rr.height / 2, { sec: 4 })); } });
    });
  },
  leave() { S = null; },
};
