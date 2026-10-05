// 彩虹钢琴 · the grand piano, built from code (no model files)
// Units are metres. The keyboard runs along x, the front edge of the white keys is z = 0,
// the case goes back towards −z, the floor is y = 0. A baby grand: 1.47 m wide, 1.6 m deep.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { K, LOW, HIGH, isBlack, keyX, colorOf, degree, SOLFEGE, MIDDLE_C, HEX } from './notes.js';
import { clamp, damp, easeInOut } from './core.js';

const HW = 0.735;            // half width of the case
const DF = 0.165;            // where the case body starts behind the keys (depth, +back)
const RIM_Y0 = 0.60, RIM_Y1 = 0.975, RIM_T = 0.034;
const LID_OPEN = 0.64;       // radians
const PIVOT_BACK = 0.45;     // keys pivot this far behind their front edge

/* ---------- the outline seen from above, as (x, depth) with depth growing towards the tail ---------- */
function outline() {
  const curve = [
    [HW, 0.40], [HW, 0.50], [HW - 0.008, 0.61], [HW - 0.035, 0.71], [0.645, 0.80], [0.555, 0.89], [0.45, 0.985],
    [0.335, 1.09], [0.215, 1.20], [0.095, 1.31], [-0.03, 1.41], [-0.17, 1.49], [-0.32, 1.545], [-0.47, 1.565],
    [-0.59, 1.545], [-0.675, 1.49], [-0.722, 1.41], [-HW, 1.30], [-HW, 1.20],
  ].map(([x, d]) => new THREE.Vector3(x, 0, d));
  const cr = new THREE.CatmullRomCurve3(curve, false, 'centripetal');
  const pts = [[HW, DF], [HW, 0.30]];
  cr.getSpacedPoints(150).forEach(p => pts.push([p.x, p.z]));
  pts.push([-HW, 0.30], [-HW, DF]);
  return pts.map(([x, d]) => new THREE.Vector2(x, d));
}
// move every point of an open polyline inwards (the polyline runs front-right → tail → front-left)
function inset(pts, t) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const tx = b.x - a.x, ty = b.y - a.y, l = Math.hypot(tx, ty) || 1;
    return new THREE.Vector2(p.x - (ty / l) * t, p.y + (tx / l) * t);
  });
}
const OUT = outline();
const shapeFrom = (pts, closeFront = true) => {
  const s = new THREE.Shape();
  s.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i].x, pts[i].y);
  if (closeFront) s.lineTo(pts[0].x, pts[0].y);
  return s;
};
// flat shape in (x, depth) → lying in the floor plane, extruded upwards from y0
function slab(shape, y0, h, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: h, curveSegments: 4, steps: 1,
    bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3,
  });
  g.rotateX(-Math.PI / 2);         // (x, depth, up) → (x, up, −depth)
  g.translate(0, y0, 0);
  return g;
}
// depth of the back of the inside at a given x (where the strings end)
function backDepthAt(pts, x) {
  let best = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if ((a.x - x) * (b.x - x) <= 0 && a.x !== b.x) {
      const t = (x - a.x) / (b.x - a.x), d = a.y + (b.y - a.y) * t;
      if (d > best) best = d;
    }
  }
  return best;
}

/* ---------- small textures drawn on canvases ---------- */
function woodTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#E6C58E'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * 512, w = 0.6 + Math.random() * 2.2;
    g.strokeStyle = `rgba(${150 + Math.random() * 40},${100 + Math.random() * 30},${50},${0.08 + Math.random() * 0.16})`;
    g.lineWidth = w; g.beginPath(); g.moveTo(x, 0);
    for (let y = 0; y <= 512; y += 32) g.lineTo(x + Math.sin(y * 0.02 + i) * 2, y);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function logoTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
  const g = c.getContext('2d');
  const gold = g.createLinearGradient(0, 40, 0, 200);
  gold.addColorStop(0, '#F8E3A1'); gold.addColorStop(0.45, '#D9A93F'); gold.addColorStop(0.55, '#B9862A'); gold.addColorStop(1, '#F2D27E');
  g.fillStyle = gold;
  g.font = 'italic 600 112px "Snell Roundhand","Apple Chancery","Georgia",serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('Rainbow', 512, 108);
  g.font = '600 30px "PingFang SC","Hiragino Sans GB",sans-serif';
  g.fillText('彩  虹  钢  琴', 512, 196);
  HEX.forEach((h, i) => { g.fillStyle = h; g.beginPath(); g.arc(512 - 3 * 34 + i * 34, 236, 7, 0, Math.PI * 2); g.fill(); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
// one sticker per scale degree, redrawn whenever the label style changes
function labelAtlas() {
  const c = document.createElement('canvas'); c.width = 7 * 128; c.height = 128;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const draw = (mode) => {
    const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < 7; i++) {
      const cx = i * 128 + 64, cy = 64;
      if (mode === 'none') continue;
      g.fillStyle = HEX[i];
      g.beginPath(); g.arc(cx, cy, mode === 'color' ? 30 : 56, 0, Math.PI * 2); g.fill();
      if (mode === 'color') continue;
      const txt = mode === 'number' ? String(i + 1) : mode === 'letter' ? 'CDEFGAB'[i] : SOLFEGE[i];
      g.fillStyle = i === 2 ? '#5B4300' : '#fff';
      g.font = `700 ${txt.length > 2 ? 40 : txt.length > 1 ? 50 : 66}px "Arial Rounded MT Bold","Avenir Next","Nunito",sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(txt, cx, cy + 3);
    }
    t.needsUpdate = true;
  };
  return { tex: t, draw };
}

/* ======================================================================= */
export function buildPiano() {
  const root = new THREE.Group(); root.name = 'piano';
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x15151b, roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.1 });
  const lacquerInner = lacquer.clone();
  const gold = new THREE.MeshStandardMaterial({ color: 0xD8B26A, metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xC9A35A, metalness: 0.85, roughness: 0.42, envMapIntensity: 1.1 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xE8E8EE, metalness: 1, roughness: 0.22 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xC07A45, metalness: 1, roughness: 0.3 });
  const felt = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, roughness: 1 });
  const redFelt = new THREE.MeshStandardMaterial({ color: 0x6E1622, roughness: 1 });
  const wood = new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.7 });
  const ivory = new THREE.MeshPhysicalMaterial({ color: 0xFBF8F0, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.18, envMapIntensity: 0.8 });
  const ebony = new THREE.MeshPhysicalMaterial({ color: 0x101012, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.12, envMapIntensity: 1 });
  const add = (geo, mat, parent = root, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
  const occluders = [];

  /* ---- case ---- */
  const inner = inset(OUT, RIM_T);
  const rimPts = OUT.concat(inner.slice().reverse());
  const rim = add(slab(shapeFrom(rimPts), RIM_Y0, RIM_Y1 - RIM_Y0 - 0.008, 0.004), lacquer); occluders.push(rim);
  add(slab(shapeFrom(OUT), RIM_Y0 - 0.01, 0.05), lacquerInner);                   // bottom
  const sbPts = inner.slice(); sbPts.unshift(new THREE.Vector2(inner[0].x, DF + 0.01)); sbPts.push(new THREE.Vector2(inner[inner.length - 1].x, DF + 0.01));
  add(slab(shapeFrom(sbPts), 0.70, 0.008), wood, root, false);                   // soundboard
  // cast iron plate with its round holes
  const platePts = inset(inner, 0.035).map(p => new THREE.Vector2(p.x, Math.max(p.y, 0.205)));
  const plateShape = shapeFrom(platePts);
  [[-0.50, 0.66, 0.075], [-0.30, 0.95, 0.10], [-0.06, 0.72, 0.085], [0.18, 0.62, 0.07], [-0.52, 1.18, 0.07], [0.02, 1.08, 0.06]].forEach(([x, d, r]) => {
    const h = new THREE.Path(); h.absarc(x, d, r, 0, Math.PI * 2, true); plateShape.holes.push(h);
  });
  add(slab(plateShape, 0.785, 0.012, 0.003), plateMat, root, false);
  // strings: one per key, bass strings wound in copper
  const sGeo = new THREE.CylinderGeometry(1, 1, 1, 5, 1, true); sGeo.rotateX(Math.PI / 2);
  const strings = { steel: new THREE.InstancedMesh(sGeo, steel, 88), copper: new THREE.InstancedMesh(sGeo, copper, 88) };
  const pinGeo = new THREE.CylinderGeometry(0.0032, 0.0032, 0.018, 6);
  const pins = new THREE.InstancedMesh(pinGeo, steel, 176);
  const stringInfo = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  let ns = 0, nc = 0;
  for (let m = LOW; m <= HIGH; m++) {
    const i = m - LOW, x = THREE.MathUtils.lerp(-0.655, 0.66, i / 87);
    const d0 = 0.30, d1 = backDepthAt(inner, x) - 0.07;
    const len = d1 - d0, r = m < 48 ? 0.0017 - (m - 21) * 0.00002 : 0.0008;
    m4.compose(v.set(x, 0.832, -(d0 + len / 2)), q.identity(), sc.set(r, r, len));
    if (m < 48) strings.copper.setMatrixAt(nc++, m4); else strings.steel.setMatrixAt(ns++, m4);
    stringInfo[m] = { x, y: 0.832, z0: -d0, z1: -d1 };
    for (let k = 0; k < 2; k++) { m4.makeTranslation(x + (k ? 0.003 : -0.003), 0.80, -(0.235 + k * 0.03 + (i % 2) * 0.012)); pins.setMatrixAt(i * 2 + k, m4); }
  }
  strings.steel.count = ns; strings.copper.count = nc;
  [strings.steel, strings.copper, pins].forEach(x => { x.castShadow = false; root.add(x); });
  // dampers sit on the strings and lift when their key goes down (none above E6, as on a real piano)
  const dGeo = new RoundedBoxGeometry(0.0115, 0.026, 0.034, 1, 0.002);
  const dampers = new THREE.InstancedMesh(dGeo, felt, 68);
  const damperTop = new THREE.InstancedMesh(new THREE.BoxGeometry(0.0118, 0.006, 0.036), wood, 68);
  const damperLift = new Float32Array(89);
  const setDamper = (m, lift) => {
    const i = m - LOW; if (m > 88) return;
    const s = stringInfo[m];
    m4.makeTranslation(s.x, s.y + 0.015 + lift, -0.40); dampers.setMatrixAt(i, m4);
    m4.makeTranslation(s.x, s.y + 0.031 + lift, -0.40); damperTop.setMatrixAt(i, m4);
  };
  for (let m = LOW; m <= 88; m++) setDamper(m, 0);
  root.add(dampers); root.add(damperTop);

  /* ---- lid (hinged on the bass side) with its prop stick ---- */
  const lidPivot = new THREE.Group(); lidPivot.position.set(-HW, RIM_Y1, 0); root.add(lidPivot);
  const lidGeo = slab(shapeFrom(OUT), 0, 0.02, 0.004); lidGeo.translate(HW, 0, 0);
  const lid = add(lidGeo, lacquer, lidPivot); occluders.push(lid);
  const stickBase = new THREE.Vector3(0.56, RIM_Y1, -0.83), stickLen = 0.78, stickOnLid = 1.24;
  const stick = add(new THREE.CylinderGeometry(0.009, 0.011, 1, 10), lacquer); stick.visible = false;

  /* ---- keyboard ---- */
  const keyGroup = new THREE.Group(); root.add(keyGroup);
  add(new THREE.BoxGeometry(2 * HW, 0.07, 0.30), lacquerInner, keyGroup, false).position.set(0, 0.62 + 0.035 - 0.01, -0.15);   // key bed
  add(new RoundedBoxGeometry(2 * K.HALF + 0.004, 0.044, 0.021, 2, 0.004), lacquer, keyGroup).position.set(0, K.TOP - 0.014 - 0.022, 0.0125); // key slip
  for (const s of [-1, 1]) {
    const cheek = add(new RoundedBoxGeometry(0.124, 0.19, 0.24, 3, 0.022), lacquer, keyGroup);
    cheek.position.set(s * (K.HALF + 0.062), 0.62 + 0.095, 0.024 - 0.12);
    occluders.push(cheek);
  }
  add(new THREE.BoxGeometry(2 * K.HALF, 0.003, 0.005), redFelt, keyGroup, false).position.set(0, K.TOP - 0.0005, -K.WL - 0.003);   // key rail felt
  // the fallboard: lies over the keys when closed, stands up behind them when open
  const fallPivot = new THREE.Group(); fallPivot.position.set(0, K.TOP + K.BH + 0.004, -K.WL - 0.024); keyGroup.add(fallPivot);
  const fall = add(new RoundedBoxGeometry(2 * K.HALF + 0.002, 0.162, 0.016, 2, 0.004), lacquer, fallPivot);
  fall.position.set(0, 0.081, -0.008);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.055), new THREE.MeshStandardMaterial({ map: logoTexture(), transparent: true, metalness: 0.6, roughness: 0.35 }));
  logo.position.set(0, 0.018, 0.0086); fall.add(logo);
  // the name board behind the fallboard closes the front of the case up to the lid; the music desk rests on a rail behind it
  add(new RoundedBoxGeometry(2 * HW - 0.02, 0.245, 0.02, 2, 0.004), lacquer, keyGroup, false).position.set(0, K.TOP + 0.0125 + 0.1225, -0.216);
  add(new RoundedBoxGeometry(2 * HW - 0.01, 0.02, 0.05, 2, 0.006), lacquer, root, false).position.set(0, RIM_Y1 - 0.02, -0.335);

  const keys = [], whiteKeys = [];
  const wGeo = new RoundedBoxGeometry(K.W - K.GAP, K.WH, K.WL + 0.06, 2, 0.0018);
  const bGeo = (() => {
    const g = new RoundedBoxGeometry(K.BW, K.BH + 0.006, K.BL + 0.03, 2, 0.0022);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i), z = p.getZ(i);
      if (y > 0) { p.setX(i, p.getX(i) * 0.78); if (z > 0) p.setZ(i, z - 0.004); }
    }
    g.computeVertexNormals();
    return g;
  })();
  const labels = labelAtlas();
  const labelMat = new THREE.MeshBasicMaterial({ map: labels.tex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const labelGeos = [];
  for (let i = 0; i < 7; i++) {
    const g = new THREE.PlaneGeometry(0.0182, 0.0182); g.rotateX(-Math.PI / 2);
    const uv = g.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / 7);
    labelGeos.push(g);
  }
  const starTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#E8B33C'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 13 : 30; g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } g.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();

  for (let m = LOW; m <= HIGH; m++) {
    const black = isBlack(m);
    const pivot = new THREE.Group();
    pivot.position.set(keyX(m), K.TOP - K.WH, -PIVOT_BACK);
    const mat = (black ? ebony : ivory).clone();
    mat.emissive = colorOf(m).clone(); mat.emissiveIntensity = 0;
    const mesh = new THREE.Mesh(black ? bGeo : wGeo, mat);
    mesh.castShadow = false; mesh.receiveShadow = true;
    if (black) mesh.position.set(0, K.WH + (K.BH + 0.006) / 2 - 0.004, PIVOT_BACK - (K.WL - K.BL) - (K.BL + 0.03) / 2);
    else mesh.position.set(0, K.WH / 2, PIVOT_BACK - (K.WL + 0.06) / 2);
    pivot.add(mesh); keyGroup.add(pivot);
    const key = { m, black, pivot, mesh, mat, x: keyX(m), down: 0, target: 0, glow: 0, glowTarget: 0, hint: 0, hintColor: colorOf(m) };
    if (!black) {
      const lab = new THREE.Mesh(labelGeos[degree(m)], labelMat);
      lab.position.set(0, K.WH + 0.0004, PIVOT_BACK - 0.024); lab.renderOrder = 2; pivot.add(lab);
      key.label = lab;
      if (m === MIDDLE_C) {
        const st = new THREE.Mesh(new THREE.PlaneGeometry(0.013, 0.013).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: starTex, transparent: true, depthWrite: false, toneMapped: false }));
        st.position.set(0, K.WH + 0.0004, PIVOT_BACK - 0.046); st.renderOrder = 2; pivot.add(st);
      }
    }
    keys[m] = key;
    if (!black) whiteKeys.push(m);
  }

  /* ---- music desk with a sheet on it ---- */
  const desk = new THREE.Group(); desk.position.set(0, RIM_Y1 - 0.01, -0.34); root.add(desk);
  add(new RoundedBoxGeometry(0.70, 0.29, 0.014, 2, 0.004), lacquer, desk).position.set(0, 0.145, 0);
  add(new RoundedBoxGeometry(0.72, 0.016, 0.045, 2, 0.004), lacquer, desk).position.set(0, 0.008, 0.024);
  const sheetCanvas = document.createElement('canvas'); sheetCanvas.width = 2048; sheetCanvas.height = 800;
  const sheetTex = new THREE.CanvasTexture(sheetCanvas); sheetTex.colorSpace = THREE.SRGBColorSpace; sheetTex.anisotropy = 8;
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.242), new THREE.MeshStandardMaterial({ map: sheetTex, roughness: 0.85, envMapIntensity: 0.4, emissive: 0xffffff, emissiveMap: sheetTex, emissiveIntensity: 0.25 }));
  sheet.position.set(0, 0.152, 0.0075); desk.add(sheet);

  /* ---- legs, pedals ---- */
  const legProfile = [[0, 0.055], [0.024, 0.055], [0.029, 0.08], [0.033, 0.16], [0.039, 0.30], [0.045, 0.43], [0.05, 0.49], [0.06, 0.51], [0.06, 0.53], [0.052, 0.54], [0.058, 0.57], [0.058, 0.605], [0, 0.605]].map(([r, y]) => new THREE.Vector2(r, y));
  const legGeo = new THREE.LatheGeometry(legProfile, 28);
  const ferrule = new THREE.LatheGeometry([[0, 0.016], [0.026, 0.016], [0.03, 0.03], [0.027, 0.058], [0, 0.058]].map(([r, y]) => new THREE.Vector2(r, y)), 28);
  const wheel = new THREE.CylinderGeometry(0.016, 0.016, 0.014, 18); wheel.rotateZ(Math.PI / 2);
  for (const [x, z] of [[-0.645, -0.075], [0.645, -0.075], [-0.43, -1.33]]) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    add(legGeo, lacquer, g); add(ferrule, gold, g);
    add(wheel, gold, g).position.set(0, 0.016, 0);
  }
  const lyre = new THREE.Group(); lyre.position.set(0, 0, -0.30); root.add(lyre);
  for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.014, 0.017, 0.47, 14), lacquer, lyre).position.set(s * 0.075, 0.37, 0);
  add(new THREE.TorusGeometry(0.06, 0.006, 8, 32, Math.PI), lacquer, lyre).position.set(0, 0.18, 0);
  add(new RoundedBoxGeometry(0.27, 0.075, 0.12, 2, 0.012), lacquer, lyre).position.set(0, 0.105, 0);
  const pedals = [-0.066, 0, 0.066].map((x) => {
    const p = new THREE.Group(); p.position.set(x, 0.088, 0.055); lyre.add(p);
    add(new RoundedBoxGeometry(0.03, 0.011, 0.085, 2, 0.004), gold, p).position.set(0, 0, 0.042);
    return p;
  });

  /* ---- shadow catcher under the piano is in the stage; everything here casts ---- */

  /* ================= behaviour ================= */
  const S = { lid: 0, lidTarget: 0, fall: 0, fallTarget: 0, sustain: 0, colorFrom: new THREE.Color(), colorTo: null, colorT: 1, bounce: 0, labelMode: 'solfege', dirtyShadow: true };
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();

  function layoutLid() {
    lidPivot.rotation.z = S.lid * LID_OPEN;
    const a = S.lid * LID_OPEN;
    if (a < 0.02) { stick.visible = false; return; }
    stick.visible = true;
    // the stick turns up from its base; its top runs along the underside of the lid
    tmpB.set(-HW + stickOnLid * Math.cos(a), RIM_Y1 + stickOnLid * Math.sin(a) - 0.006, stickBase.z);
    tmpA.copy(tmpB).sub(stickBase);
    const len = Math.min(stickLen, tmpA.length());
    stick.position.copy(stickBase).addScaledVector(tmpA.normalize(), len / 2);
    stick.scale.set(1, len, 1);
    stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tmpA);
  }
  function layoutDesk() {
    // folded flat inside the case while the lid is shut, standing up once it opens
    const u = easeInOut(clamp((S.lid - 0.25) / 0.6, 0, 1));
    desk.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2 + 0.02, -0.2, u);
    desk.position.y = THREE.MathUtils.lerp(RIM_Y1 - 0.06, RIM_Y1 - 0.01, u);
  }
  function layoutFall() {
    // open: standing, leaning back a touch; closed: lying flat over the keys
    fallPivot.rotation.x = THREE.MathUtils.lerp(Math.PI / 2 - 0.02, -0.07, easeInOut(S.fall));
  }
  layoutLid(); layoutFall(); layoutDesk();

  const piano = {
    root, keys, occluders, desk, sheet, sheetCanvas, sheetTex, stringInfo, lacquer,
    get lidOpen() { return S.lid; }, get fallOpen() { return S.fall; },
    open(v = true) { S.lidTarget = v ? 1 : 0; S.fallTarget = v ? 1 : 0; },
    press(m, on, color) {
      const k = keys[m]; if (!k) return;
      k.target = on ? 1 : 0;
      if (on) { k.glowTarget = 1; k.glow = Math.max(k.glow, 0.85); if (color) k.mat.emissive.copy(color); else k.mat.emissive.copy(colorOf(m)); }
      else k.glowTarget = 0;
    },
    hint(m, on, color) { const k = keys[m]; if (!k) return; k.hint = on ? 1 : 0; if (color) k.hintColor = color; },
    clearHints() { keys.forEach(k => k && (k.hint = 0, k.mark = 0)); },
    // a steady soft glow: "these are the keys we are using"
    mark(m, on) { const k = keys[m]; if (k) { k.mark = on ? 1 : 0; k.hintColor = colorOf(m); } },
    setSustain(on) { S.sustain = on ? 1 : 0; },
    setColor(hex, instant) {
      const c = new THREE.Color(hex);
      if (instant) { lacquer.color.copy(c); lacquerInner.color.copy(c).multiplyScalar(0.9); S.colorT = 1; return; }
      S.colorFrom.copy(lacquer.color); S.colorTo = c; S.colorT = 0; S.bounce = 1;
    },
    setLabels(mode) { S.labelMode = mode; labels.draw(mode); keys.forEach(k => k && k.label && (k.label.visible = mode !== 'none')); },
    // where a beam of light should rise from: the back of the visible part of the key
    keyTop(m, out = new THREE.Vector3()) {
      const k = keys[m]; if (!k) return out.set(0, K.TOP, 0);
      return out.set(k.x, K.TOP + (k.black ? K.BH : 0) + 0.002, k.black ? -K.WL + 0.02 : -K.WL + 0.012);
    },
    keyFront(m, out = new THREE.Vector3()) {
      const k = keys[m];
      return out.set(k.x, K.TOP + (k.black ? K.BH : 0), k.black ? -(K.WL - K.BL) - 0.02 : -0.03);
    },
    // which key a ray lands on: tested analytically against the key tops (fast, exact, no meshes)
    keyAt(ray) {
      const o = ray.origin, d = ray.direction;
      if (Math.abs(d.y) < 1e-4) return null;
      // black keys first: they sit on top
      let t = (K.TOP + K.BH - o.y) / d.y;
      if (t > 0) {
        const x = o.x + d.x * t, z = o.z + d.z * t;
        if (z < -(K.WL - K.BL) + 0.004 && z > -K.WL - 0.01) {
          for (let m = LOW; m <= HIGH; m++) {
            const k = keys[m];
            if (k.black && Math.abs(x - k.x) < K.BW / 2 + 0.0016) return m;
          }
        }
      }
      t = (K.TOP - o.y) / d.y;
      if (t <= 0) return null;
      const x = o.x + d.x * t, z = o.z + d.z * t;
      if (z > 0.028 || z < -K.WL - 0.006 || x < -K.HALF || x > K.HALF) return null;
      return whiteKeys[clamp(Math.floor((x + K.HALF) / K.W), 0, K.N_WHITE - 1)];
    },
    update(dt, t) {
      // lid and fallboard
      const lidPrev = S.lid;
      S.lid = moveTo(S.lid, S.lidTarget, dt / 1.6);
      S.fall = moveTo(S.fall, S.fallTarget, dt / 0.9);
      if (S.lid !== lidPrev) { layoutLid(); layoutDesk(); S.dirtyShadow = true; }
      layoutFall();
      // keys
      for (let m = LOW; m <= HIGH; m++) {
        const k = keys[m];
        const goal = k.target;
        k.down = goal > k.down ? Math.min(goal, k.down + dt * 55) : damp(k.down, goal, 26, dt);
        k.pivot.rotation.x = k.down * (k.black ? 0.0215 : 0.0205);
        const hintPulse = k.hint ? 0.35 + 0.35 * Math.sin(t * 6.5) : k.mark ? 0.22 : 0;
        k.glow = k.glowTarget ? damp(k.glow, 0.65, 4, dt) : damp(k.glow, 0, 3.2, dt);
        const e = Math.max(k.glow * (k.black ? 1.6 : 1.05), hintPulse);
        if (k.glow < 0.05 && (k.hint || k.mark)) k.mat.emissive.copy(k.hintColor);
        k.mat.emissiveIntensity = e;
        // dampers follow their keys (or all lift with the pedal)
        if (m <= 88) {
          const want = Math.max(k.target, S.sustain) * 0.013;
          const cur = damperLift[m - LOW];
          if (Math.abs(cur - want) > 1e-5) { damperLift[m - LOW] = damp(cur, want, 30, dt); setDamper(m, damperLift[m - LOW]); dampers.instanceMatrix.needsUpdate = true; damperTop.instanceMatrix.needsUpdate = true; }
        }
      }
      pedals[2].rotation.x = damp(pedals[2].rotation.x, S.sustain * 0.13, 16, dt);
      // paint
      if (S.colorTo && S.colorT < 1) {
        S.colorT = Math.min(1, S.colorT + dt / 0.7);
        lacquer.color.copy(S.colorFrom).lerp(S.colorTo, easeInOut(S.colorT));
        lacquerInner.color.copy(lacquer.color).multiplyScalar(0.9);
      }
      if (S.bounce > 0) {
        S.bounce = Math.max(0, S.bounce - dt * 1.6);
        const b = Math.sin((1 - S.bounce) * Math.PI * 3) * S.bounce * 0.025;
        root.scale.set(1 - b * 0.5, 1 + b, 1 - b * 0.5);
      }
    },
    consumeShadowDirty() { const d = S.dirtyShadow; S.dirtyShadow = false; return d; },
  };
  piano.setLabels('solfege');
  return piano;
}
function moveTo(v, target, step) {
  // eased travel between 0 and 1
  if (v === target) return v;
  const lin = v < target ? Math.min(target, v + step) : Math.max(target, v - step);
  return lin;
}
export const PIANO_DIMS = { HW, DF, RIM_Y1, LID_OPEN };
