// 魔方世界 · effects: confetti and sparkles in 3D, big bouncy cheer words on screen
import * as THREE from 'three';
import { Tick, el, rand, pick, reducedMotion } from './core.js';
import { Stage } from './stage.js';

const CONF = ['#FF5A5F', '#FF9F1C', '#FFD23F', '#3DCC6E', '#2EC4E6', '#4D7CFE', '#A66CFF', '#FF8FC8'];
const MAXC = 700, MAXS = 120;
let conf, cdata, sparks, sdata, layer;
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3(), col = new THREE.Color();

function starTexture() {
  const s = 64, c = document.createElement('canvas'); c.width = c.height = s;
  const x = c.getContext('2d'), g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.8)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, s, s);
  x.fillStyle = '#fff'; x.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 5 : 31; x.lineTo(s / 2 + Math.cos(a) * r, s / 2 + Math.sin(a) * r); }
  x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const FX = {
  init() {
    conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.2, 0.12), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }), MAXC);
    conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage); conf.frustumCulled = false; conf.userData.noPick = true; conf.renderOrder = 20;
    cdata = Array.from({ length: MAXC }, () => ({ life: 0 }));
    for (let i = 0; i < MAXC; i++) { conf.setColorAt(i, col.set('#fff')); tmpM.makeScale(0, 0, 0); conf.setMatrixAt(i, tmpM); }
    Stage.scene.add(conf);
    const tex = starTexture();
    sparks = []; sdata = [];
    for (let i = 0; i < MAXS; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
      sp.visible = false; sp.userData.noPick = true; sp.renderOrder = 30;
      Stage.scene.add(sp); sparks.push(sp); sdata.push({ life: 0 });
    }
    layer = el('div'); layer.id = 'fxLayer'; document.body.appendChild(layer);
    Tick.add(dt => this.update(dt));
  },
  update(dt) {
    let any = false;
    for (let i = 0; i < MAXC; i++) {
      const d = cdata[i]; if (d.life <= 0) continue;
      d.life -= dt; any = true;
      d.v.y -= 6.5 * dt; d.v.multiplyScalar(Math.exp(-1.6 * dt));
      d.p.addScaledVector(d.v, dt);
      d.r.x += d.w.x * dt; d.r.y += d.w.y * dt; d.r.z += d.w.z * dt;
      const s = d.life <= 0 ? 0 : Math.min(1, d.life * 2) * d.s;
      tmpQ.setFromEuler(tmpE.set(d.r.x, d.r.y, d.r.z)); tmpS.setScalar(s);
      tmpM.compose(d.p, tmpQ, tmpS); conf.setMatrixAt(i, tmpM);
    }
    if (any || this._cDirty) { conf.instanceMatrix.needsUpdate = true; this._cDirty = any; }
    for (let i = 0; i < MAXS; i++) {
      const d = sdata[i], sp = sparks[i]; if (d.life <= 0) { if (sp.visible) sp.visible = false; continue; }
      d.life -= dt; d.v.multiplyScalar(Math.exp(-2.5 * dt)); d.v.y += d.g * dt;
      sp.position.addScaledVector(d.v, dt);
      const k = Math.max(0, d.life / d.max);
      sp.scale.setScalar(d.s * (0.4 + 0.6 * Math.sin(k * Math.PI)));
      sp.material.opacity = Math.min(1, k * 2);
      sp.material.rotation += dt * 3;
    }
  },
  // a burst of paper confetti from a point
  confetti(pos, n = 60, power = 5, colors = CONF) {
    if (reducedMotion) n = Math.min(n, 20);
    let k = 0;
    for (let i = 0; i < MAXC && k < n; i++) {
      const d = cdata[i]; if (d.life > 0) continue;
      const a = rand(Math.PI * 2), up = rand(0.4, 1);
      d.p = new THREE.Vector3().copy(pos);
      d.v = new THREE.Vector3(Math.cos(a) * (1 - up * 0.5), up * 1.6, Math.sin(a) * (1 - up * 0.5)).multiplyScalar(power * rand(0.5, 1.1));
      d.r = new THREE.Vector3(rand(6), rand(6), rand(6)); d.w = new THREE.Vector3(rand(-9, 9), rand(-9, 9), rand(-9, 9));
      d.s = rand(0.8, 1.4); d.life = rand(1.6, 2.6);
      conf.setColorAt(i, col.set(pick(colors)));
      k++;
    }
    conf.instanceColor.needsUpdate = true; this._cDirty = true;
  },
  // confetti falling from above the whole view
  rain(center, n = 140) {
    for (let j = 0; j < 4; j++) {
      const p = tmpP.copy(center).add(new THREE.Vector3(rand(-4, 4), rand(3, 5), rand(-4, 4)));
      this.confetti(p, n / 4, 2.2);
    }
  },
  sparkle(pos, n = 14, o = {}) {
    let k = 0;
    for (let i = 0; i < MAXS && k < n; i++) {
      const d = sdata[i]; if (d.life > 0) continue;
      const sp = sparks[i]; sp.visible = true; sp.position.copy(pos);
      if (o.spread) sp.position.add(new THREE.Vector3(rand(-o.spread, o.spread), rand(-o.spread, o.spread), rand(-o.spread, o.spread)));
      const a = rand(Math.PI * 2), b = rand(-0.6, 1);
      d.v = new THREE.Vector3(Math.cos(a) * Math.cos(b), Math.sin(b) + 0.4, Math.sin(a) * Math.cos(b)).multiplyScalar((o.speed || 3) * rand(0.4, 1));
      d.g = o.g ?? -1.5; d.max = d.life = rand(0.6, 1.1) * (o.life || 1); d.s = (o.size || 0.5) * rand(0.6, 1.2);
      sp.material.color.set(o.color || pick(['#FFFFFF', '#FFF3A0', '#FFD23F', '#A0E7FF']));
      k++;
    }
  },
  // a big wobbly word in the middle of the 3D area: Great! Excellent! Amazing! Unbelievable!
  cheer(word, lvl = 1) {
    const R = Stage.rect, w = el('div', 'cheer lv' + lvl, word);
    w.style.left = (R.x + R.w / 2) + 'px'; w.style.top = (R.y + R.h * 0.42) + 'px';
    w.style.fontSize = Math.max(34, Math.min(R.w * 0.13, R.h * 0.16, 96 + lvl * 8)) + 'px';
    layer.appendChild(w);
    setTimeout(() => w.remove(), 1700);
  },
  // a flying star from a screen point to an element (the progress dots)
  flyStar(from, toEl) {
    const s = el('div', 'flyStar', '⭐'); const b = toEl.getBoundingClientRect();
    s.style.left = from.x + 'px'; s.style.top = from.y + 'px';
    layer.appendChild(s);
    requestAnimationFrame(() => { s.style.transform = `translate(${b.left + b.width / 2 - from.x}px, ${b.top + b.height / 2 - from.y}px) scale(0.5)`; s.style.opacity = '0.2'; });
    setTimeout(() => s.remove(), 900);
  },
};
