// 魔方世界 · the toy box: candy blocks, floating islands, little animals, number badges
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Tick } from './core.js';

export const COLORS = {
  r: '#FF5A5F', o: '#FF9F1C', y: '#FFD23F', g: '#3DCC6E', c: '#2EC4E6', b: '#4D7CFE', p: '#A66CFF', k: '#FF8FC8',
  w: '#F7F4EE', n: '#A8754C', d: '#4A4E69', l: '#9BE15D', s: '#B8C4D6',
};
export const CANDY = ['r', 'o', 'y', 'g', 'c', 'b', 'p', 'k'];
export const NAMES = { r: '红色', o: '橙色', y: '黄色', g: '绿色', c: '青色', b: '蓝色', p: '紫色', k: '粉色', w: '白色', n: '棕色' };

const shared = o => { o.userData.shared = true; return o; };

// a soft bevelled tile printed on every face: each block reads as its own block even when two of the same colour touch
function faceTexture() {
  const s = 128, c = document.createElement('canvas'); c.width = c.height = s;
  const x = c.getContext('2d');
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, s, s);
  const g = x.createLinearGradient(0, 0, s, s); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.10)');
  x.fillStyle = g; x.fillRect(0, 0, s, s);
  x.strokeStyle = 'rgba(0,0,0,0.13)'; x.lineWidth = 10; x.strokeRect(5, 5, s - 10, s - 10);
  x.fillStyle = 'rgba(255,255,255,0.35)';
  if (x.roundRect) { x.beginPath(); x.roundRect(22, 22, s - 44, s - 44, 18); x.fill(); } else x.fillRect(22, 22, s - 44, s - 44);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.userData.shared = true;
  return t;
}
let FACE = null;
export const GEO = {};
export function initToys() {
  FACE = faceTexture();
  GEO.block = shared(new RoundedBoxGeometry(0.96, 0.96, 0.96, 3, 0.12));
  GEO.box = shared(new THREE.BoxGeometry(1, 1, 1));
  GEO.ghost = shared(new THREE.BoxGeometry(0.94, 0.94, 0.94));
  GEO.edges = shared(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.96, 0.96, 0.96)));
  GEO.sphere = shared(new THREE.SphereGeometry(1, 24, 16));
  GEO.smallSphere = shared(new THREE.SphereGeometry(1, 12, 8));
}

const mats = new Map();
export function blockMat(color, o = {}) {
  const key = color + (o.emissive || '') + (o.opacity || '');
  if (!o.fresh && mats.has(key)) return mats.get(key);
  const hex = COLORS[color] || color;
  const m = new THREE.MeshStandardMaterial({ color: hex, map: FACE, roughness: 0.42, metalness: 0.0 });
  if (o.opacity) { m.transparent = true; m.opacity = o.opacity; m.depthWrite = false; }
  if (!o.fresh) { m.userData.shared = true; mats.set(key, m); }
  return m;
}
export function makeBlock(color, o = {}) {
  const m = new THREE.Mesh(GEO.block, o.fresh ? blockMat(color, { fresh: true }) : blockMat(color));
  m.castShadow = true; m.receiveShadow = true;
  m.userData.color = color;
  return m;
}
// a see-through outline of a block (where one should go)
export function makeGhost(color = '#ffffff', opacity = 0.28, edge) {
  const g = new THREE.Group();
  const box = new THREE.Mesh(GEO.ghost, new THREE.MeshBasicMaterial({ color: COLORS[color] || color, transparent: true, opacity, depthWrite: false }));
  const lines = new THREE.LineSegments(GEO.edges, new THREE.LineBasicMaterial({ color: edge || (color === '#ffffff' ? '#7C83A6' : COLORS[color] || color), transparent: true, opacity: 0.9 }));
  box.userData.noPick = true; lines.userData.noPick = true;
  g.add(box); g.add(lines);
  g.userData.ghost = true;
  return g;
}

/* ---------- a floating island: grass on top, a rocky cone underneath; cells marked on top ---------- */
export function makeIsland(o = {}) {
  const r = o.radius || 4, g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.97, 0.5, 48), new THREE.MeshStandardMaterial({ color: o.grass || '#8EDB6A', roughness: 0.85 }));
  top.position.y = -0.29; top.receiveShadow = true;
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.9, 0.5, 48), new THREE.MeshStandardMaterial({ color: '#C08A5B', roughness: 0.9 }));
  soil.position.y = -0.79; soil.receiveShadow = true;
  const rock = new THREE.Mesh(new THREE.ConeGeometry(r * 0.9, r * 1.3, 9, 2), new THREE.MeshStandardMaterial({ color: '#9C7B63', roughness: 0.95, flatShading: true }));
  rock.rotation.x = Math.PI; rock.position.y = -1.04 - r * 0.65;
  g.add(top, soil, rock);
  [top, soil, rock].forEach(m => (m.userData.island = true));
  if (o.cells) {
    // a pale board with the grid printed on it
    const { w, d } = o.cells, pad = 0.35;
    const board = new THREE.Mesh(new THREE.BoxGeometry(w + pad * 2, 0.12, d + pad * 2), new THREE.MeshStandardMaterial({ color: o.board || '#FFF6E6', roughness: 0.7, map: gridTexture(w, d, pad) }));
    board.position.y = -0.06; board.receiveShadow = true; board.userData.board = true;
    g.add(board);
    g.userData.board = board;
  }
  // a few flowers round the edge
  const fl = ['#FF8FC8', '#FFD23F', '#FFFFFF', '#A66CFF'];
  for (let i = 0; i < (o.flowers ?? 7); i++) {
    const a = i / 7 * Math.PI * 2 + 0.4, rr = r * (0.82 + (i % 2) * 0.08);
    const f = new THREE.Mesh(GEO.smallSphere, new THREE.MeshStandardMaterial({ color: fl[i % fl.length], roughness: 0.6 }));
    f.scale.setScalar(0.13); f.position.set(Math.sin(a) * rr, 0.12, Math.cos(a) * rr);
    const st = new THREE.Mesh(GEO.smallSphere, new THREE.MeshStandardMaterial({ color: '#3DAA55' }));
    st.scale.set(0.05, 0.12, 0.05); st.position.set(f.position.x, 0.02, f.position.z);
    g.add(f, st);
  }
  return g;
}
function gridTexture(w, d, pad) {
  const k = 64, c = document.createElement('canvas'); c.width = (w + pad * 2) * k; c.height = (d + pad * 2) * k;
  const x = c.getContext('2d');
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
  x.strokeStyle = 'rgba(120,100,80,0.28)'; x.lineWidth = 3;
  for (let i = 0; i <= w; i++) { x.beginPath(); x.moveTo((pad + i) * k, pad * k); x.lineTo((pad + i) * k, (pad + d) * k); x.stroke(); }
  for (let j = 0; j <= d; j++) { x.beginPath(); x.moveTo(pad * k, (pad + j) * k); x.lineTo((pad + w) * k, (pad + j) * k); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- little animals made of balls: bear, rabbit, cat, frog, chick, pig ---------- */
const ANIMALS = {
  bear: { body: '#B07A4F', belly: '#F2D3B0', ear: 'round', snout: '#F2D3B0', name: '小熊' },
  rabbit: { body: '#F5F1EC', belly: '#FFD1E3', ear: 'long', snout: '#FFFFFF', name: '小兔' },
  cat: { body: '#FFA94D', belly: '#FFF0DC', ear: 'point', snout: '#FFF0DC', name: '小猫' },
  frog: { body: '#5BD16E', belly: '#DFF7C8', ear: 'eyes', snout: null, name: '小青蛙' },
  chick: { body: '#FFD43B', belly: '#FFF3BF', ear: 'tuft', snout: '#FF922B', beak: true, name: '小鸟' },
  pig: { body: '#FFA8C5', belly: '#FFD6E5', ear: 'point', snout: '#FF85AD', pig: true, name: '小猪' },
};
const M = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55 });
export function makeAnimal(kind, scale = 1) {
  const A = ANIMALS[kind], g = new THREE.Group(), body = new THREE.Group();
  g.add(body);
  const S = (mat, sx, sy, sz, x, y, z, parent = body) => { const m = new THREE.Mesh(GEO.sphere, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const mb = M(A.body), mw = M(A.belly), black = M('#2B2B2B'), white = M('#FFFFFF'), blush = new THREE.MeshStandardMaterial({ color: '#FF8FA3', transparent: true, opacity: 0.7, roughness: 1 });
  // body + belly
  S(mb, 0.42, 0.46, 0.38, 0, 0.45, 0);
  S(mw, 0.3, 0.32, 0.12, 0, 0.42, 0.29);
  // feet
  S(mb, 0.13, 0.08, 0.17, -0.18, 0.06, 0.08); S(mb, 0.13, 0.08, 0.17, 0.18, 0.06, 0.08);
  // head
  const head = new THREE.Group(); head.position.set(0, 1.12, 0); body.add(head);
  S(mb, 0.46, 0.42, 0.42, 0, 0, 0, head);
  if (A.ear === 'round') { S(mb, 0.15, 0.15, 0.1, -0.32, 0.32, -0.02, head); S(mb, 0.15, 0.15, 0.1, 0.32, 0.32, -0.02, head); S(mw, 0.08, 0.08, 0.04, -0.32, 0.32, 0.06, head); S(mw, 0.08, 0.08, 0.04, 0.32, 0.32, 0.06, head); }
  if (A.ear === 'long') { const l = S(mb, 0.1, 0.34, 0.08, -0.16, 0.55, -0.02, head), r = S(mb, 0.1, 0.34, 0.08, 0.16, 0.55, -0.02, head); l.rotation.z = 0.15; r.rotation.z = -0.15; S(mw, 0.05, 0.26, 0.03, -0.16, 0.55, 0.05, head).rotation.z = 0.15; S(mw, 0.05, 0.26, 0.03, 0.16, 0.55, 0.05, head).rotation.z = -0.15; }
  if (A.ear === 'point') {
    const cg = new THREE.ConeGeometry(0.15, 0.3, 4);
    for (const s of [-1, 1]) { const e = new THREE.Mesh(cg, mb); e.position.set(s * 0.26, 0.38, 0); e.rotation.z = -s * 0.35; e.castShadow = true; head.add(e); }
  }
  if (A.ear === 'tuft') { S(mb, 0.06, 0.16, 0.06, 0, 0.45, 0, head).rotation.z = 0.3; S(mb, 0.06, 0.13, 0.06, 0.07, 0.42, 0, head).rotation.z = -0.4; }
  // eyes (frogs wear theirs on top)
  const ey = A.ear === 'eyes' ? 0.3 : 0.06, ez = A.ear === 'eyes' ? 0.2 : 0.36;
  if (A.ear === 'eyes') { S(mb, 0.16, 0.16, 0.16, -0.2, 0.3, 0.12, head); S(mb, 0.16, 0.16, 0.16, 0.2, 0.3, 0.12, head); }
  for (const s of [-1, 1]) {
    S(white, 0.1, 0.11, 0.06, s * 0.17, ey, ez, head);
    S(black, 0.065, 0.075, 0.05, s * 0.17, ey - 0.01, ez + 0.035, head);
    S(white, 0.022, 0.022, 0.02, s * 0.17 + 0.02, ey + 0.02, ez + 0.07, head);
    S(blush, 0.07, 0.04, 0.02, s * 0.29, -0.1, 0.33, head);
  }
  if (A.snout) {
    if (A.beak) { const b = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 8), M(A.snout)); b.rotation.x = Math.PI / 2; b.position.set(0, -0.06, 0.45); head.add(b); }
    else {
      S(M(A.snout), A.pig ? 0.13 : 0.15, A.pig ? 0.1 : 0.11, 0.08, 0, -0.1, 0.38, head);
      if (A.pig) { S(black, 0.025, 0.035, 0.02, -0.04, -0.1, 0.46, head); S(black, 0.025, 0.035, 0.02, 0.04, -0.1, 0.46, head); }
      else S(black, 0.05, 0.035, 0.03, 0, -0.06, 0.45, head);
    }
  } else {
    // a frog's wide smile
    const sm = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.018, 6, 16, Math.PI), black); sm.rotation.z = Math.PI; sm.position.set(0, -0.08, 0.4); head.add(sm);
  }
  // arms
  const arms = [-1, 1].map(s => { const a = S(mb, 0.1, 0.22, 0.1, s * 0.42, 0.55, 0.05); a.rotation.z = s * 0.5; return a; });
  if (kind === 'chick') { arms.forEach(a => a.scale.set(0.06, 0.24, 0.16)); }
  g.scale.setScalar(scale);
  g.userData = { kind, name: A.name, body, head, arms, t: Math.random() * 10, act: null, actT: 0 };
  g.userData.tick = Tick.add(dt => animalTick(g, dt));
  return g;
}
function animalTick(g, dt) {
  const u = g.userData; u.t += dt;
  if (!g.parent) return;
  let y = 0, sq = 1, rz = 0, ry = 0, arm = 0;
  // idle: breathe and blink-bob
  sq = 1 + Math.sin(u.t * 2.2) * 0.02;
  if (u.act) {
    u.actT += dt; const k = u.actT;
    if (u.act === 'hop') { const p = Math.min(1, k / 0.55); y = Math.sin(p * Math.PI) * 0.5; sq = 1 + Math.sin(p * Math.PI * 2) * 0.06; arm = Math.sin(p * Math.PI) * 1.2; if (p >= 1) { u.reps--; u.actT = 0; if (u.reps <= 0) u.act = null; } }
    if (u.act === 'wave') { arm = 0.9 + Math.sin(k * 14) * 0.5; rz = Math.sin(k * 7) * 0.08; if (k > 1.4) u.act = null; }
    if (u.act === 'spin') { const p = Math.min(1, k / 0.8); ry = p * Math.PI * 2; y = Math.sin(p * Math.PI) * 0.35; if (p >= 1) u.act = null; }
    if (u.act === 'shake') { rz = Math.sin(k * 30) * 0.12 * Math.max(0, 1 - k / 0.6); if (k > 0.6) u.act = null; }
  }
  u.body.position.y = y; u.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
  u.body.rotation.set(0, ry, rz);
  u.arms[0].rotation.z = -0.5 - arm; u.arms[1].rotation.z = 0.5 + arm;
}
export function animalDo(a, act, reps = 1) { const u = a.userData; u.act = act; u.actT = 0; u.reps = reps; }
export function animalName(kind) { return ANIMALS[kind].name; }
export function freeAnimal(a) { a.userData.tick?.(); }

/* ---------- a round badge with a number (or a short text) that always faces the camera ---------- */
export function makeBadge(text, o = {}) {
  const s = 128, c = document.createElement('canvas'); c.width = c.height = s;
  const x = c.getContext('2d');
  x.fillStyle = o.bg || '#FFFFFF'; x.strokeStyle = o.ring || '#FF7A00'; x.lineWidth = 10;
  x.beginPath(); x.arc(s / 2, s / 2, s / 2 - 8, 0, Math.PI * 2); x.fill(); x.stroke();
  x.fillStyle = o.fg || '#333'; x.font = `900 ${String(text).length > 1 ? 64 : 76}px system-ui, -apple-system, "PingFang SC", sans-serif`;
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, s / 2, s / 2 + 4);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  sp.renderOrder = 50; sp.scale.setScalar(o.size || 0.7); sp.userData.noPick = true;
  return sp;
}
