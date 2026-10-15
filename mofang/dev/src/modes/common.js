// 魔方世界 · shared by the block islands: random block piles, what they look like from each side, drawing those views
import * as THREE from 'three';
import { pick, randInt, shuffle, easeOutBack } from '../core.js';
import { makeBlock, COLORS } from '../blocks.js';
import { Stage } from '../stage.js';
import { Snd } from '../audio.js';

// h[x][z]: how many blocks stand on cell (x, z). z = 0 is the back row, z = n - 1 the front row (towards +z).
export function genHeights(n, minB, maxB, maxH = 3, o = {}) {
  for (let tries = 0; tries < 400; tries++) {
    const target = randInt(minB, maxB), h = Array.from({ length: n }, () => new Array(n).fill(0));
    let x = randInt(0, n - 1), z = randInt(0, n - 1), cnt = 1; h[x][z] = 1;
    const cells = () => { const a = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (h[i][j]) a.push([i, j]); return a; };
    while (cnt < target) {
      const cs = cells();
      if (Math.random() < (o.stackBias ?? 0.45)) {
        const [i, j] = pick(cs); if (h[i][j] < maxH) { h[i][j]++; cnt++; }
      } else {
        const [i, j] = pick(cs), d = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), a = i + d[0], b = j + d[1];
        if (a >= 0 && b >= 0 && a < n && b < n && !h[a][b]) { h[a][b] = 1; cnt++; }
      }
    }
    if (o.ok && !o.ok(h)) continue;
    return h;
  }
  return null;
}
export const total = h => h.flat().reduce((a, b) => a + b, 0);
export const maxH = h => Math.max(...h.flat());

// the five views as boolean pictures (rows from top to bottom). Side views are as tall as `rows`.
export function viewOf(h, side, rows) {
  const n = h.length, col = [];
  if (side === 'top') {
    const m = []; for (let z = 0; z < n; z++) { const r = []; for (let x = 0; x < n; x++) r.push(h[x][z] > 0); m.push(r); }
    return m;
  }
  for (let k = 0; k < n; k++) {
    let v = 0;
    for (let j = 0; j < n; j++) {
      // front: columns x = 0..n-1 (left to right as the front animal sees them), depth over z
      if (side === 'front') v = Math.max(v, h[k][j]);
      if (side === 'back') v = Math.max(v, h[n - 1 - k][j]);
      if (side === 'right') v = Math.max(v, h[j][n - 1 - k]);   // standing at +x looking back: left is the front row
      if (side === 'left') v = Math.max(v, h[j][k]);
    }
    col.push(v);
  }
  return colsToPic(col, rows);
}
export function colsToPic(col, rows) {
  const m = [];
  for (let r = 0; r < rows; r++) m.push(col.map(v => rows - r <= v));
  return m;
}
export const picKey = m => m.map(r => r.map(v => (v ? 1 : 0)).join('')).join('/');
// a near miss: one column a block taller or shorter (side views) or one cell switched (top view)
export function nudge(m, side) {
  const rows = m.length, cols = m[0].length;
  for (let t = 0; t < 50; t++) {
    const c = m.map(r => r.slice());
    if (side === 'top') { const r = randInt(0, rows - 1), k = randInt(0, cols - 1); c[r][k] = !c[r][k]; }
    else {
      const k = randInt(0, cols - 1); let hgt = 0; for (let r = 0; r < rows; r++) if (c[r][k]) hgt++;
      const nh = Math.max(0, Math.min(rows, hgt + pick([-1, 1])));
      for (let r = 0; r < rows; r++) c[r][k] = rows - r <= nh;
    }
    if (c.flat().some(Boolean)) return c;
  }
  return m;
}
// the right picture plus n - 1 different wrong ones (the other sides first, they are the tempting mistakes)
export function optionsFor(right, others, n, side) {
  const out = [right], keys = new Set([picKey(right)]);
  for (const o of shuffle(others)) { if (out.length >= n) break; if (o[0].length !== right[0].length) continue; const k = picKey(o); if (!keys.has(k)) { keys.add(k); out.push(o); } }
  for (let t = 0; out.length < n && t < 200; t++) { const o = nudge(pick(out), side), k = picKey(o); if (!keys.has(k)) { keys.add(k); out.push(o); } }
  return shuffle(out);
}

// paint a picture of squares: filled ones in the block colour, empty ones faint
export function drawPic(x, w, h, m, color) {
  const rows = m.length, cols = m[0].length, gap = 0.1;
  const s = Math.min(w / cols, h / rows) * 0.94, ox = (w - s * cols) / 2, oy = (h - s * rows) / 2;
  const hex = COLORS[color] || color;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const px = ox + c * s + s * gap / 2, py = oy + r * s + s * gap / 2, q = s * (1 - gap);
    x.beginPath();
    if (x.roundRect) x.roundRect(px, py, q, q, q * 0.16); else x.rect(px, py, q, q);
    if (m[r][c]) { x.fillStyle = hex; x.fill(); x.lineWidth = Math.max(2, q * 0.06); x.strokeStyle = 'rgba(0,0,0,0.28)'; x.stroke(); x.fillStyle = 'rgba(255,255,255,0.3)'; x.fillRect(px + q * 0.18, py + q * 0.18, q * 0.64, q * 0.64); }
    else { x.fillStyle = 'rgba(43,45,66,0.07)'; x.fill(); }
  }
}

// blocks for a height map, centred on the board. Returns { group, blocks: [{mesh, x, y, z}] }
export function buildPile(h, color, o = {}) {
  const n = h.length, g = new THREE.Group(), blocks = [], off = (n - 1) / 2;
  for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) for (let y = 0; y < h[x][z]; y++) {
    const m = makeBlock(typeof color === 'function' ? color(x, y, z) : color);
    m.position.set(x - off, y + 0.5, z - off);
    m.userData.cell = { x, y, z };
    g.add(m); blocks.push({ mesh: m, x, y, z });
  }
  if (o.hidden) blocks.forEach(b => (b.mesh.visible = false));
  return { group: g, blocks };
}
// drop the blocks in one after another, bottom first, with a little pop each
export async function popIn(scope, blocks, gap = 0.07) {
  const order = blocks.slice().sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
  order.forEach(b => { b.mesh.visible = false; });
  await Promise.all(order.map((b, i) => scope.wait(i * gap).then(() => {
    b.mesh.visible = true; Snd.play('place', Math.min(9, b.y * 2 + (i % 3)));
    const y0 = b.mesh.position.y;
    return scope.tween(0.32, t => { b.mesh.scale.setScalar(Math.max(0.01, easeOutBack(t))); b.mesh.position.y = y0 + (1 - t) * 0.8; });
  })));
}

// where the camera stands to see what an animal on `side` sees (yaw/pitch for the stage rig)
export const SIDE_POSE = {
  front: { yaw: 0, pitch: 0.0 }, right: { yaw: Math.PI / 2, pitch: 0.0 }, back: { yaw: Math.PI, pitch: 0.0 }, left: { yaw: -Math.PI / 2, pitch: 0.0 },
  top: { yaw: 0, pitch: Math.PI / 2 - 0.0005 },
};
// fly to an animal's eyes: narrow the lens while backing off, so the pile flattens into the same picture as the cards
export async function flyToView(side, center, radius, hide = []) {
  const pose = SIDE_POSE[side], fov = 4.5;
  const saved = { ...Stage.cur }, lim = Stage.lim.maxPitch, minP = Stage.lim.minPitch;
  Stage.lim.maxPitch = Math.PI / 2; Stage.lim.minPitch = -0.2;
  const dist = Stage.fitDist(radius, fov, 1.25);
  hide.forEach(o => (o.visible = false)); Stage.deco.visible = false;
  Snd.play('whoosh');
  await Stage.flyTo({ yaw: pose.yaw, pitch: pose.pitch, fov, dist, tx: center.x, ty: center.y, tz: center.z }, 1.3);
  return async () => {
    Snd.play('whoosh');
    await Stage.flyTo({ yaw: saved.yaw, pitch: saved.pitch, fov: saved.fov, dist: saved.dist, tx: saved.tx, ty: saved.ty, tz: saved.tz }, 1.1);
    Stage.lim.maxPitch = lim; Stage.lim.minPitch = minP;
    hide.forEach(o => (o.visible = true)); Stage.deco.visible = true;
  };
}
