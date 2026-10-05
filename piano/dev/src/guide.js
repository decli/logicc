// 彩虹钢琴 · the glowing candies that show which key comes next.
// The next note hovers right over its key and bobs; the ones after it wait above, further up,
// and drop down one place every time the child plays the right key.
import * as THREE from 'three';
import { colorOf } from './notes.js';
import { damp } from './core.js';

const texCache = new Map();
function candy(hex) {
  if (texCache.has(hex)) return texCache.get(hex);
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const glow = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  glow.addColorStop(0, hex + 'cc'); glow.addColorStop(0.5, hex + '44'); glow.addColorStop(1, hex + '00');
  g.fillStyle = glow; g.fillRect(0, 0, 256, 256);
  g.fillStyle = hex; g.beginPath(); g.arc(128, 128, 62, 0, Math.PI * 2); g.fill();
  const hl = g.createRadialGradient(104, 100, 4, 110, 108, 58);
  hl.addColorStop(0, 'rgba(255,255,255,.95)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hl; g.beginPath(); g.arc(128, 128, 62, 0, Math.PI * 2); g.fill();
  g.lineWidth = 8; g.strokeStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(128, 128, 62, 0, Math.PI * 2); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(hex, t); return t;
}

export function buildGuide(scene, piano) {
  const N = 2, slots = [];
  for (let i = 0; i < N; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false, toneMapped: false }));
    s.visible = false; s.renderOrder = 9; scene.add(s);
    slots.push({ s, m: null, pos: new THREE.Vector3(), goal: new THREE.Vector3(), a: 0, aGoal: 0, size: 0 });
  }
  // a downward arrow over the next key
  const arrowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.strokeStyle = 'rgba(43,33,64,.35)'; g.lineWidth = 6; g.beginPath(); g.moveTo(64, 112); g.lineTo(20, 52); g.lineTo(46, 52); g.lineTo(46, 12); g.lineTo(82, 12); g.lineTo(82, 52); g.lineTo(108, 52); g.closePath(); g.fill(); g.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const arrow = new THREE.Sprite(new THREE.SpriteMaterial({ map: arrowTex, transparent: true, depthWrite: false, depthTest: false, toneMapped: false }));
  arrow.visible = false; arrow.renderOrder = 10; scene.add(arrow);
  const tmp = new THREE.Vector3();
  let scale = 1, on = false, t = 0;

  function slotGoal(i, m, out) {
    piano.keyFront(m, out);
    out.z -= 0.03;
    out.y += 0.024 * scale + i * 0.06 * scale;
    out.z -= i * 0.035 * scale;
    return out;
  }
  return {
    // upcoming: midi numbers, the first is the one to press now
    set(upcoming, sc = 1) {
      scale = sc; on = upcoming.length > 0;
      const prev = slots.map(s => s.m);
      // when the first one was just played, everything moves down one place: reuse sprites so they glide
      if (prev[1] !== null && prev[1] === upcoming[0] && prev[0] !== null) {
        const first = slots.shift(); first.a = 0; first.s.visible = false; slots.push(first); first.m = null;
      }
      slots.forEach((sl, i) => {
        const m = upcoming[i];
        if (m === undefined) { sl.aGoal = 0; return; }
        if (sl.m !== m) { sl.m = m; sl.s.material.map = candy('#' + colorOf(m).getHexString()); sl.s.material.needsUpdate = true; slotGoal(i + 2, m, sl.pos); sl.a = 0; }
        slotGoal(i, m, sl.goal);
        sl.aGoal = i === 0 ? 1 : 0.7;
        sl.size = (i === 0 ? 0.05 : 0.032) * scale;
        sl.s.visible = true;
      });
    },
    // the next key, if any
    get current() { return on ? slots[0].m : null; },
    pulse() { slots[0].bump = 1; },
    clear() { on = false; slots.forEach(s => { s.aGoal = 0; s.m = null; }); },
    update(dt) {
      t += dt;
      slots.forEach((sl, i) => {
        sl.pos.set(damp(sl.pos.x, sl.goal.x, 9, dt), damp(sl.pos.y, sl.goal.y, 9, dt), damp(sl.pos.z, sl.goal.z, 9, dt));
        sl.a = damp(sl.a, sl.aGoal, 7, dt);
        if (sl.a < 0.01 && sl.aGoal === 0) { sl.s.visible = false; return; }
        sl.bump = Math.max(0, (sl.bump || 0) - dt * 3);
        const bob = i === 0 ? Math.abs(Math.sin(t * 4.2)) * 0.007 * scale : Math.sin(t * 2 + i) * 0.003 * scale;
        sl.s.position.copy(sl.pos); sl.s.position.y += bob;
        const k = sl.size * (1 + (sl.bump || 0) * 0.5);
        sl.s.scale.set(k, k, 1);
        sl.s.material.opacity = sl.a;
      });
      const s0 = slots[0];
      if (on && s0.m !== null && s0.a > 0.3) {
        arrow.visible = true;
        arrow.position.copy(s0.s.position); arrow.position.y += 0.034 * scale + Math.abs(Math.sin(t * 4.2)) * 0.006 * scale;
        arrow.scale.set(0.022 * scale, 0.022 * scale, 1); arrow.material.opacity = s0.a;
      } else arrow.visible = false;
    },
  };
}
