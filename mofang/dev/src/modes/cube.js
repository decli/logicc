// 魔方世界 · 🎲 转魔方: a real 2×2 / 3×3 cube. Put a finger on a face and push: that layer turns with the finger.
// Levels are scrambled by 1–3 turns (the child watches it being mixed up) and ask to turn it back; 💡 draws an arrow
// on the layer to turn next. Free play: mix it up, undo, let it solve itself, colour or picture stickers.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { pick, clamp, easeInOut, easeOut, Store, Tick } from '../core.js';
import { Stage, disposeDeep } from '../stage.js';
import { UI } from '../ui.js';
import { Snd } from '../audio.js';
import { FX } from '../fx.js';
import { Voice } from '../voice.js';
import { L } from '../lines.js';
import { makeIsland } from '../blocks.js';

const AX = ['x', 'y', 'z'];
const FACE_DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
// right red, left orange, up white, down yellow, front green, back blue; each face also has a picture
const FACE_COL = ['#FF4B4B', '#FF9A1F', '#FFFFFF', '#FFD60A', '#2FCB5A', '#3D7BFF'];
const FACE_PIC = ['heart', 'smile', 'sun', 'star', 'flower', 'moon'];

let bodyGeo = null, stickerGeo = null;
function geos() {
  if (bodyGeo) return;
  bodyGeo = new RoundedBoxGeometry(0.98, 0.98, 0.98, 3, 0.1); bodyGeo.userData.shared = true;
  stickerGeo = roundedPlane(0.84, 0.16); stickerGeo.userData.shared = true;
}
function roundedPlane(s, r) {
  const sh = new THREE.Shape(), h = s / 2;
  sh.moveTo(-h + r, -h); sh.lineTo(h - r, -h); sh.quadraticCurveTo(h, -h, h, -h + r); sh.lineTo(h, h - r); sh.quadraticCurveTo(h, h, h - r, h);
  sh.lineTo(-h + r, h); sh.quadraticCurveTo(-h, h, -h, h - r); sh.lineTo(-h, -h + r); sh.quadraticCurveTo(-h, -h, -h + r, -h);
  const g = new THREE.ShapeGeometry(sh, 4);
  // uv 0..1 across the square
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / s + 0.5, p.getY(i) / s + 0.5);
  return g;
}

// a face picture drawn on a canvas, n×n stickers each show their part of it
const picCache = new Map();
function facePicture(f, n) {
  const key = f + '/' + n; if (picCache.has(key)) return picCache.get(key);
  const S = 128 * n, c = document.createElement('canvas'); c.width = c.height = S;
  const x = c.getContext('2d');
  x.fillStyle = FACE_COL[f]; x.fillRect(0, 0, S, S);
  const cx = S / 2, cy = S / 2, R = S * 0.36, ink = f === 2 ? '#FFB703' : f === 3 ? '#FF7B00' : '#FFFFFF';
  x.fillStyle = ink; x.strokeStyle = ink; x.lineCap = 'round'; x.lineJoin = 'round';
  const kind = FACE_PIC[f];
  if (kind === 'heart') {
    x.beginPath(); x.moveTo(cx, cy + R * 0.85);
    x.bezierCurveTo(cx - R * 1.4, cy - R * 0.1, cx - R * 0.7, cy - R * 1.15, cx, cy - R * 0.45);
    x.bezierCurveTo(cx + R * 0.7, cy - R * 1.15, cx + R * 1.4, cy - R * 0.1, cx, cy + R * 0.85); x.fill();
  }
  if (kind === 'smile') {
    x.lineWidth = S * 0.045; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(cx - R * 0.38, cy - R * 0.25, R * 0.13, 0, Math.PI * 2); x.arc(cx + R * 0.38, cy - R * 0.25, R * 0.13, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(cx, cy + R * 0.05, R * 0.5, 0.15 * Math.PI, 0.85 * Math.PI); x.stroke();
  }
  if (kind === 'sun') {
    x.beginPath(); x.arc(cx, cy, R * 0.55, 0, Math.PI * 2); x.fill();
    x.lineWidth = S * 0.04;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; x.beginPath(); x.moveTo(cx + Math.cos(a) * R * 0.75, cy + Math.sin(a) * R * 0.75); x.lineTo(cx + Math.cos(a) * R * 1.05, cy + Math.sin(a) * R * 1.05); x.stroke(); }
  }
  if (kind === 'star') {
    x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R * 1.05; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); x.fill();
  }
  if (kind === 'flower') {
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; x.beginPath(); x.arc(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55, R * 0.38, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#FFD60A'; x.beginPath(); x.arc(cx, cy, R * 0.32, 0, Math.PI * 2); x.fill();
  }
  if (kind === 'moon') {
    x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fill();
    x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(cx + R * 0.45, cy - R * 0.3, R * 0.85, 0, Math.PI * 2); x.fill();
    x.globalCompositeOperation = 'source-over'; x.fillStyle = FACE_COL[f]; x.globalCompositeOperation = 'destination-over'; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.shared = true;
  picCache.set(key, t);
  return t;
}

// build an n×n×n cube. skin: 'color' or 'pic'
export function makeRubik(n, skin = 'pic') {
  geos();
  const root = new THREE.Group(), off = (n - 1) / 2, cubies = [];
  const body = new THREE.MeshStandardMaterial({ color: '#23252F', roughness: 0.35, metalness: 0.1 });
  const faceMats = FACE_COL.map((c, f) => skin === 'pic'
    ? new THREE.MeshStandardMaterial({ map: facePicture(f, n), roughness: 0.3, emissive: '#000000' })
    : new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, emissive: '#000000' }));
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
    if (x > 0 && x < n - 1 && y > 0 && y < n - 1 && z > 0 && z < n - 1) continue;
    const g = new THREE.Group(); g.position.set(x - off, y - off, z - off);
    const b = new THREE.Mesh(bodyGeo, body); b.castShadow = true; b.receiveShadow = true; g.add(b);
    const stickers = [];
    FACE_DIRS.forEach((d, f) => {
      const on = (d[0] === 1 && x === n - 1) || (d[0] === -1 && x === 0) || (d[1] === 1 && y === n - 1) || (d[1] === -1 && y === 0) || (d[2] === 1 && z === n - 1) || (d[2] === -1 && z === 0);
      if (!on) return;
      let geo = stickerGeo;
      if (skin === 'pic') {
        // this sticker's square of the face picture, as seen from outside with "up" sensible on every face
        const { u, v } = faceUV(f, x, y, z, n);
        geo = stickerGeo.clone(); const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (u + uv.getX(i)) / n, (v + uv.getY(i)) / n);
      }
      const m = new THREE.Mesh(geo, faceMats[f]);
      const dir = new THREE.Vector3(...d);
      m.position.copy(dir).multiplyScalar(0.495);
      m.lookAt(dir.clone().multiplyScalar(2));
      g.add(m);
      stickers.push({ mesh: m, dir, face: f });
    });
    g.userData.stickers = stickers; g.userData.cubie = true;
    root.add(g); cubies.push(g);
  }
  return { root, cubies, n, off, faceMats, body };
}
// which square of its face picture a sticker shows (u right, v up, looking at the face from outside)
function faceUV(f, x, y, z, n) {
  const m = n - 1;
  switch (f) {
    case 0: return { u: m - z, v: y };     // +x: looking from the right, right hand is -z
    case 1: return { u: z, v: y };         // -x
    case 2: return { u: x, v: m - z };     // +y: from above, front at the bottom
    case 3: return { u: x, v: z };         // -y
    case 4: return { u: x, v: y };         // +z: the front
    default: return { u: m - x, v: y };    // -z
  }
}

const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), tmpM = new THREE.Matrix4();
function snap(c, off) {
  c.position.set(Math.round(c.position.x + off) - off, Math.round(c.position.y + off) - off, Math.round(c.position.z + off) - off);
  tmpM.makeRotationFromQuaternion(c.quaternion);
  const e = tmpM.elements; for (let i = 0; i < 16; i++) e[i] = Math.round(e[i]);
  c.quaternion.setFromRotationMatrix(tmpM);
}
const coord = (c, axis, off) => Math.round(c.position[axis] + off);

// the turning machine around a cube built by makeRubik
export class Rubik {
  constructor(n, skin) {
    Object.assign(this, makeRubik(n, skin));
    this.busy = false; this.history = []; this.drag = null; this.onTurn = null;
  }
  layer(axis, k) { return this.cubies.filter(c => coord(c, axis, this.off) === k); }
  // turn a layer a quarter: dir +1 = counter-clockwise looking down +axis
  turn(axis, k, dir, sec = 0.28, record = true) {
    return new Promise(res => {
      const piv = new THREE.Group(); this.root.add(piv);
      const mem = this.layer(axis, k); mem.forEach(c => piv.attach(c));
      this.busy = true; Snd.play('turn');
      let t = 0;
      const stop = tick(dt => {
        t = Math.min(1, t + dt / sec);
        piv.rotation[axis] = dir * Math.PI / 2 * easeInOut(t);
        if (t >= 1) { stop(); this._finish(piv, mem); if (record) this._did(axis, k, dir); res(); }
      });
    });
  }
  _finish(piv, mem) {
    piv.updateMatrixWorld(true);
    mem.forEach(c => { this.root.attach(c); snap(c, this.off); });
    this.root.remove(piv); this.busy = false;
  }
  // the same turn with no animation (rebuilding a cube in another skin)
  apply(axis, k, dir) {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0), dir * Math.PI / 2);
    for (const c of this.layer(axis, k)) { c.position.applyQuaternion(q); c.quaternion.premultiply(q); snap(c, this.off); }
  }
  _did(axis, k, dir) { this.history.push([axis, k, dir]); if (this.onTurn) this.onTurn([axis, k, dir]); }
  solved() {
    const seen = {};
    for (const c of this.cubies) for (const s of c.userData.stickers) {
      tmpV.copy(s.dir).applyQuaternion(c.quaternion);
      const key = Math.round(tmpV.x) + ',' + Math.round(tmpV.y) + ',' + Math.round(tmpV.z);
      if (seen[key] === undefined) seen[key] = s.face; else if (seen[key] !== s.face) return false;
    }
    return true;
  }
  /* ---------- finger turning ---------- */
  grab(g) {
    if (this.busy) return false;
    const hit = Stage.pick(g.x, g.y, [this.root]);
    if (!hit) return false;
    let c = hit.object; while (c && !c.userData.cubie) c = c.parent;
    if (!c) return false;
    // face normal in the cube's own frame, snapped to an axis
    const nW = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    const inv = new THREE.Quaternion().copy(this.root.getWorldQuaternion(new THREE.Quaternion())).invert();
    const n = nW.applyQuaternion(inv); const a = ['x', 'y', 'z'].reduce((m, k) => (Math.abs(n[k]) > Math.abs(n[m]) ? k : m), 'x');
    const nv = new THREE.Vector3(); nv[a] = Math.sign(n[a]);
    // only outer faces of the whole cube
    if (coord(c, a, this.off) !== (nv[a] > 0 ? this.n - 1 : 0)) return false;
    const pLocal = this.root.worldToLocal(hit.point.clone());
    this.drag = { c, nv, axisN: a, p: pLocal, piv: null, mem: null, axis: null, k: 0, sign: 1, angle: 0, sdir: null, t0: performance.now() };
    return true;
  }
  move(g) {
    const d = this.drag; if (!d) return;
    const dx = g.x - g.x0, dy = g.y - g.y0, len = Math.hypot(dx, dy);
    if (!d.piv) {
      if (len < 10) return;
      // which of the face's two directions does the finger move along on screen?
      let best = null;
      for (const t of ['x', 'y', 'z']) {
        if (t === d.axisN) continue;
        const tv = new THREE.Vector3(); tv[t] = 1;
        const a = Stage.toScreen(this.root.localToWorld(d.p.clone())), b = Stage.toScreen(this.root.localToWorld(d.p.clone().add(tv)));
        const sx = b.x - a.x, sy = b.y - a.y, sl = Math.hypot(sx, sy) || 1;
        const dot = (dx * sx + dy * sy) / (len * sl);
        if (!best || Math.abs(dot) > Math.abs(best.dot)) best = { t, tv, dot, sx: sx / sl, sy: sy / sl, sl };
      }
      // rotation axis = normal × motion direction
      const rot = new THREE.Vector3().crossVectors(d.nv, best.tv);
      const axis = ['x', 'y', 'z'].find(k => Math.abs(rot[k]) > 0.5);
      d.axis = axis; d.sign = Math.sign(rot[axis]); d.sdir = best; d.k = coord(d.c, axis, this.off);
      d.piv = new THREE.Group(); this.root.add(d.piv);
      d.mem = this.layer(axis, d.k); d.mem.forEach(c => d.piv.attach(c));
      this.busy = true;
    }
    const along = dx * d.sdir.sx + dy * d.sdir.sy;   // px moved along the turning direction
    d.angle = clamp(along / (d.sdir.sl * 1.6), -1.3, 1.3) * Math.PI / 2;
    d.piv.rotation[d.axis] = d.sign * d.angle;
  }
  release() {
    const d = this.drag; this.drag = null;
    if (!d || !d.piv) { this.busy = false; return Promise.resolve(null); }
    const fast = performance.now() - d.t0 < 260 && Math.abs(d.angle) > 0.12;
    const q = Math.abs(d.angle) > Math.PI / 7 || fast ? Math.sign(d.angle) : 0;
    const from = d.piv.rotation[d.axis], to = d.sign * q * Math.PI / 2;
    return new Promise(res => {
      let t = 0; const sec = 0.16 + Math.abs(to - from) * 0.08;
      if (q) Snd.play('turn');
      const stop = tick(dt => {
        t = Math.min(1, t + dt / sec);
        d.piv.rotation[d.axis] = from + (to - from) * easeOut(t);
        if (t >= 1) {
          stop(); this._finish(d.piv, d.mem);
          if (q) { this._did(d.axis, d.k, d.sign * q); res([d.axis, d.k, d.sign * q]); } else res(null);
        }
      });
    });
  }
  cancel() { if (this.drag?.piv) { this.drag.piv.rotation[this.drag.axis] = 0; this._finish(this.drag.piv, this.drag.mem); } this.drag = null; this.busy = false; }
  // a few random outer-layer turns, never undoing the one before
  static scramble(n, k) {
    const out = []; let last = null;
    while (out.length < k) {
      const axis = pick(AX), layer = pick([0, n - 1]), dir = pick([1, -1]);
      if (last && last[0] === axis) continue;
      out.push([axis, layer, dir]); last = out[out.length - 1];
    }
    return out;
  }
}


/* ---------- the hint: a curved arrow round the layer to turn, and that layer glowing ---------- */
function makeArrow(n) {
  const g = new THREE.Group(), r = n * 0.72 + 0.3, arc = Math.PI * 0.55;
  const mat = new THREE.MeshStandardMaterial({ color: '#FFE14D', emissive: '#FFB800', emissiveIntensity: 0.6, roughness: 0.4 });
  const tor = new THREE.Mesh(new THREE.TorusGeometry(r, 0.09, 10, 40, arc), mat);
  tor.rotation.z = -arc / 2; g.add(tor);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.5, 16), mat);
  const a = arc / 2; head.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); head.rotation.z = a; g.add(head);
  g.userData.noPick = true; g.traverse(o => (o.userData.noPick = true));
  return g;
}

let S = null;
// a ticker that dies with the level (cube animations must not outlive their cube)
const tick = fn => (S?.ctx?.scope ? S.ctx.scope.tick(fn) : Tick.add(fn));
export const Cube = {
  levels: [
    { n: 2, moves: 1 }, { n: 2, moves: 2 }, { n: 3, moves: 1 }, { n: 3, moves: 2 }, { n: 2, moves: 3 }, { n: 3, moves: 3 },
  ],
  freeCfg: { n: 3 },
  intro: (cfg, li) => L.cube.intro[li],

  stage(ctx, n, skin) {
    if (S?.cube && S.ctx === ctx) { Stage.root.remove(S.cube.root); disposeDeep(S.cube.root); }
    if (!S || S.ctx !== ctx) {
      const isl = makeIsland({ radius: 3.4, flowers: 9 });
      Stage.root.add(isl);
      S = { ctx, isl, cube: null, arrow: null };
    }
    const cube = S.cube = new Rubik(n, skin);
    cube.root.position.y = n / 2 + 0.25;
    Stage.root.add(cube.root);
    Stage.lights.size(5);
    const R = n * 0.95 + 0.9;
    Stage.look({ yaw: 0.6, pitch: 0.48, fov: 34, dist: Stage.fitDist(R), tx: 0, ty: cube.root.position.y, tz: 0 }, true);
    Stage.lim.minDist = Stage.goal.dist * 0.65; Stage.lim.maxDist = Stage.goal.dist * 1.5;
    UI.onResize = () => { Stage.goal.dist = Stage.fitDist(R); };
    // finger on a face turns a layer, anywhere else turns the view
    if (window.MF) window.MF.cube = cube;
    Stage.handlers = {
      down: g => (S.lock ? false : cube.grab(g)),
      move: g => cube.move(g),
      up: async () => { const m = await cube.release(); if (m) S.onMove?.(m); },
      cancel: () => cube.cancel(),
    };
    return cube;
  },
  showArrow(m) {
    this.hideArrow();
    const cube = S.cube, [axis, k, dir] = m;
    const ar = S.arrow = makeArrow(cube.n);
    // the arrow's ring lies in the layer's plane; its middle faces the camera
    const along = new THREE.Vector3(); along[axis] = 1;
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), along);
    ar.quaternion.copy(q);
    ar.position.copy(along).multiplyScalar(k - cube.off);
    // spin within the plane so the arc sits on the side we look at; flip for the turning direction
    const camL = cube.root.worldToLocal(Stage.camera.position.clone()).sub(ar.position);
    const inPlane = camL.clone().sub(along.clone().multiplyScalar(camL.dot(along))).normalize();
    const xAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(q), yAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    const ang = Math.atan2(inPlane.dot(yAxis), inPlane.dot(xAxis));
    ar.rotateZ(ang);
    if (dir < 0) ar.rotateX(Math.PI);    // mirror: the arrow head points the other way round
    cube.root.add(ar);
    const mem = cube.layer(axis, k);
    S.glow = mem;
    const stop = tick((dt, t) => {
      if (S?.arrow !== ar) return stop();
      ar.scale.setScalar(1 + (0.5 + 0.5 * Math.sin(t * 6)) * 0.07);
    });
    mem.forEach(c => c.children.forEach(ch => { if (ch.material && ch.material !== cube.body) { ch.material = ch.material.clone(); ch.material.emissive.set('#FFF2A8'); ch.material.emissiveIntensity = 0.35; ch.userData.glow = true; } }));
  },
  hideArrow() {
    if (S?.arrow) { S.arrow.parent?.remove(S.arrow); S.arrow = null; }
    if (S?.glow) { S.glow.forEach(c => c.children.forEach(ch => { if (ch.userData.glow) { ch.material.emissiveIntensity = 0; ch.userData.glow = false; } })); S.glow = null; }
  },

  async round(R, cfg, r) {
    const cube = this.stage(R.ctx, cfg.n, Store.d.skin);
    UI.layout({ tools: true });
    const solve = [];      // turns that undo everything so far (last one first)
    let celebrated = false;
    S.lock = true;
    await R.wait(0.6);
    // mix it up while she watches
    R.say(r === 0 ? L.cube.watch : L.cube.watch2);
    await R.wait(1.0);
    const sc = Rubik.scramble(cfg.n, cfg.moves);
    for (const m of sc) { await cube.turn(...m, 0.55, false); if (R.scope.dead) return; solve.push([m[0], m[1], -m[2]]); await R.wait(0.25); }
    cube.history = [];
    S.lock = false;
    const tools = UI.tools([{ id: 'undo', icon: '↩️', label: '退回一步', fn: () => undo() }]);
    const undo = async () => {
      if (cube.busy || !cube.history.length || S.lock) return;
      const [a, k, d] = cube.history.pop();
      await cube.turn(a, k, -d, 0.25, false);
      S.onMove?.([a, k, -d], true);
    };
    return new Promise(done => {
      S.onMove = async (m, isUndo) => {
        this.hideArrow();
        const top = solve[solve.length - 1];
        if (top && top[0] === m[0] && top[1] === m[1] && top[2] === m[2]) solve.pop();
        else solve.push([m[0], m[1], -m[2]]);
        if (!isUndo && solve.length > cfg.moves + 3 && solve.length % 3 === 0) R.say(L.cube.lost);
        if (cube.solved() && !celebrated) {
          celebrated = true; S.lock = true;
          R.good(cube.root.position.clone().add(new THREE.Vector3(0, cfg.n * 0.6, 0)), true);
          R.say(L.cube.done);
          await R.tween(1.2, t => { cube.root.rotation.y = easeInOut(t) * Math.PI * 2; cube.root.position.y = cfg.n / 2 + 0.25 + Math.sin(t * Math.PI) * 0.8; });
          if (R.scope.dead) return;
          await R.wait(0.6); done();
        }
      };
      R.onHint = () => { if (solve.length) { this.showArrow(solve[solve.length - 1]); R.say(L.cube.follow); } };
      R.idle(12, () => { if (solve.length && !S.arrow) { this.showArrow(solve[solve.length - 1]); R.say(L.cube.follow); } });
      R.ask(L.cube.ask);
      if (r === 0 && R.ctx.li === 0) this.demo(R, solve);
    });
  },

  // first round of the first level: the arrow and a finger show the very first push
  demo(R, solve) {
    R.scope.after(3.5, () => {
      if (!solve.length || S.cube.history.length) return;
      this.showArrow(solve[solve.length - 1]);
      const cube = S.cube, [axis, k, dir] = solve[solve.length - 1];
      // a sticker on that layer facing us, and where it goes
      const mem = cube.layer(axis, k);
      let best = null;
      for (const c of mem) for (const s of c.userData.stickers) {
        const n = s.dir.clone().applyQuaternion(c.quaternion);
        if (Math.abs(n[axis]) > 0.5) continue;
        const wp = cube.root.localToWorld(c.position.clone().add(n.clone().multiplyScalar(0.5)));
        const facing = Stage.camera.position.clone().sub(wp).normalize().dot(n.clone().transformDirection(cube.root.matrixWorld));
        if (!best || facing > best.facing) best = { c, n, wp, facing };
      }
      if (!best) return;
      const along = new THREE.Vector3(); along[axis] = 1;
      const mv = new THREE.Vector3().crossVectors(along.multiplyScalar(dir), best.n);   // where that sticker moves
      const a = Stage.toScreen(best.wp), b = Stage.toScreen(best.wp.clone().add(mv.transformDirection(cube.root.matrixWorld).multiplyScalar(1.2)));
      R.scope.own(UI.hand(a.x, a.y, { to: b, sec: 6 }));
    });
  },

  /* ---------- free play ---------- */
  async free(ctx) {
    let n = ctx.cfg.n, skin = Store.d.skin;
    UI.layout({ tools: true });
    let cube, auto = false;
    const build = () => { cube = this.stage(ctx, n, skin); S.lock = false; S.onMove = m => { if (cube.solved() && cube.history.length > 2) { Snd.play('win'); Voice.cheer('Amazing!'); FX.confetti(cube.root.position.clone().setY(n + 1), 90, 5); } }; };
    build();
    const tools = UI.tools([
      { id: 'size', html: `<span class="ic">${n}×${n}</span>`, cls: 'round', label: '换大小', fn: b => { if (auto) return; n = n === 3 ? 2 : 3; b.innerHTML = `<span class="ic" style="font-size:calc(var(--b)*.36)">${n}×${n}</span>`; build(); Snd.play('open'); } },
      { id: 'mix', icon: '🎲', label: '打乱', fn: async () => {
        if (auto || cube.busy) return; auto = true; S.lock = true; Voice.say(L.cube.mixing);
        for (const m of Rubik.scramble(n, n === 3 ? 18 : 10)) { await cube.turn(...m, 0.17); if (ctx.scope.dead) return; }
        auto = false; S.lock = false;
      } },
      { id: 'undo', icon: '↩️', label: '退回一步', fn: async () => { if (auto || cube.busy || !cube.history.length) return; const [a, k, d] = cube.history.pop(); await cube.turn(a, k, -d, 0.22, false); } },
      { id: 'solve', icon: '🪄', label: '自己复原', fn: async () => {
        if (auto || cube.busy || !cube.history.length) return; auto = true; S.lock = true; Voice.say(L.cube.magic);
        while (cube.history.length) { const [a, k, d] = cube.history.pop(); await cube.turn(a, k, -d, cube.history.length > 12 ? 0.12 : 0.2, false); if (ctx.scope.dead) return; }
        auto = false; S.lock = false; Snd.play('win'); Voice.cheer('Wow!'); FX.confetti(cube.root.position.clone().setY(n + 1), 90, 5);
      } },
      { id: 'skin', icon: '🖼️', label: '换贴纸', fn: () => { if (auto || cube.busy) return; skin = skin === 'pic' ? 'color' : 'pic'; Store.d.skin = skin; Store.save(); const h = cube.history.slice(); build(); h.forEach(m => cube.apply(...m)); cube.history = h; } },
    ]);
    tools.size.innerHTML = `<span class="ic" style="font-size:calc(var(--b)*.36)">${n}×${n}</span>`;
    Voice.say(L.cube.free);
  },
  leave() { this.hideArrow(); S = null; },
};
