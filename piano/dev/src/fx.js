// 彩虹钢琴 · what a sound looks like
// Every note sends up a little glowing spirit in its colour (big and slow for low notes, small and quick
// for high ones — you can see pitch), a beam of light that stays as long as the key is held (you can see
// how long a note is), a spray of sparks, and its name. A slide across many keys draws a rainbow.
import * as THREE from 'three';
import { colorOf, degree, isBlack, SOLFEGE, HEX } from './notes.js';
import { clamp, rand, pick, lerp, reducedMotion } from './core.js';

/* ---------- a sheet of little white shapes; colour is applied per particle ---------- */
const F = { GLOW: 0, DOT: 1, STAR: 2, SPARK: 3, NOTE: 4, NOTES: 5, HEART: 6, RING: 7, SQUARE: 8, DISC: 9, FLOWER: 10, CONF: 11 };
function atlas() {
  const S = 128, c = document.createElement('canvas'); c.width = c.height = S * 4;
  const g = c.getContext('2d');
  const cell = (i, fn) => { g.save(); g.translate((i % 4) * S + S / 2, Math.floor(i / 4) * S + S / 2); fn(); g.restore(); };
  g.fillStyle = '#fff'; g.strokeStyle = '#fff';
  cell(F.GLOW, () => { const r = g.createRadialGradient(0, 0, 0, 0, 0, 62); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,255,255,0.75)'); r.addColorStop(0.45, 'rgba(255,255,255,0.22)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(-64, -64, 128, 128); });
  cell(F.DOT, () => { const r = g.createRadialGradient(0, 0, 20, 0, 0, 40); r.addColorStop(0, '#fff'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.beginPath(); g.arc(0, 0, 40, 0, 7); g.fill(); });
  const star = (r1, r2, n = 5) => { g.beginPath(); for (let k = 0; k < n * 2; k++) { const a = -Math.PI / 2 + k * Math.PI / n, r = k % 2 ? r2 : r1; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); };
  cell(F.STAR, () => { g.lineJoin = 'round'; g.lineWidth = 10; star(52, 24); g.fill(); g.stroke(); });
  cell(F.SPARK, () => { g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, r = k % 2 ? 9 : 58; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); });
  cell(F.NOTE, () => { g.font = '700 104px "Apple Symbols","Segoe UI Symbol","Noto Music",serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('♪', 0, 6); });
  cell(F.NOTES, () => { g.font = '700 100px "Apple Symbols","Segoe UI Symbol","Noto Music",serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('♫', 0, 6); });
  cell(F.HEART, () => { g.beginPath(); g.moveTo(0, 46); g.bezierCurveTo(-70, -6, -34, -62, 0, -26); g.bezierCurveTo(34, -62, 70, -6, 0, 46); g.fill(); });
  cell(F.RING, () => { g.lineWidth = 9; g.beginPath(); g.arc(0, 0, 50, 0, 7); g.stroke(); });
  cell(F.SQUARE, () => { g.fillRect(-40, -40, 80, 80); });
  cell(F.DISC, () => { g.beginPath(); g.arc(0, 0, 50, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, 0, 18, 0, 7); g.fill(); });
  cell(F.FLOWER, () => { for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5; g.beginPath(); g.arc(Math.cos(a) * 26, Math.sin(a) * 26, 24, 0, 7); g.fill(); } });
  cell(F.CONF, () => { g.fillRect(-18, -46, 36, 92); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

/* ---------- instanced camera-facing sprites ---------- */
function spritePool(max, tex) {
  const quad = new THREE.PlaneGeometry(1, 1);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = quad.index; geo.attributes.position = quad.attributes.position; geo.attributes.uv = quad.attributes.uv;
  const aPos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const aCol = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);   // rgb + alpha
  const aMisc = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);  // size, rot, frame, white-core
  geo.setAttribute('iPos', aPos); geo.setAttribute('iCol', aCol); geo.setAttribute('iMisc', aMisc);
  geo.instanceCount = 0;
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: true,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: { uTex: { value: tex }, uAdd: { value: 0 } },
    vertexShader: `
      attribute vec3 iPos; attribute vec4 iCol; attribute vec4 iMisc;
      varying vec2 vUv; varying vec4 vCol; varying float vCore;
      void main(){
        float s = iMisc.x, r = iMisc.y, fr = iMisc.z;
        vec2 q = position.xy; float c = cos(r), sn = sin(r); q = vec2(c*q.x - sn*q.y, sn*q.x + c*q.y);
        vec4 mv = modelViewMatrix * vec4(iPos, 1.0); mv.xy += q * s;
        gl_Position = projectionMatrix * mv;
        vec2 cellUV = vec2(mod(fr, 4.0), 3.0 - floor(fr / 4.0));
        vUv = (cellUV + uv) / 4.0; vCol = iCol; vCore = iMisc.w;
      }`,
    fragmentShader: `
      uniform sampler2D uTex; uniform float uAdd; varying vec2 vUv; varying vec4 vCol; varying float vCore;
      void main(){
        vec4 t = texture2D(uTex, vUv);
        float a = t.a * vCol.a;
        vec3 col = mix(vCol.rgb, vec3(1.0), vCore * t.a * t.a);
        gl_FragColor = vec4(col * a, a * (1.0 - uAdd));
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 5;
  const P = [];
  return {
    mesh, mat, P,
    spawn(o) {
      if (P.length >= max) P.shift();
      const p = Object.assign({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, drag: 0, size: 0.02, size1: null, grow: 0, rot: 0, vrot: 0, frame: F.GLOW, r: 1, g: 1, b: 1, a: 1, life: 1, age: 0, core: 0, wob: 0, wobF: 2, fadeIn: 0.06, pop: 0 }, o);
      if (o.color) { p.r = o.color.r; p.g = o.color.g; p.b = o.color.b; }
      p.seed = Math.random() * 10;
      P.push(p); return p;
    },
    update(dt, t) {
      let n = 0;
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.age += dt; if (p.age >= p.life) P.splice(i, 1); }
      for (const p of P) {
        const dragK = Math.exp(-p.drag * dt);
        p.vx = (p.vx + p.ax * dt) * dragK; p.vy = (p.vy + p.ay * dt) * dragK; p.vz = (p.vz + p.az * dt) * dragK;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.rot += p.vrot * dt;
        const u = p.age / p.life;
        const wob = p.wob ? Math.sin(t * p.wobF + p.seed) * p.wob : 0;
        let s = p.size1 !== null ? lerp(p.size, p.size1, u) : p.size * (1 + p.grow * u);
        if (p.pop) s *= p.age < 0.25 ? 0.4 + 0.6 * Math.sin((p.age / 0.25) * Math.PI * 0.62) / Math.sin(Math.PI * 0.62) : 1;
        const fade = Math.min(1, p.age / p.fadeIn) * (u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4);
        aPos.array[n * 3] = p.x + wob; aPos.array[n * 3 + 1] = p.y; aPos.array[n * 3 + 2] = p.z;
        aCol.array[n * 4] = p.r; aCol.array[n * 4 + 1] = p.g; aCol.array[n * 4 + 2] = p.b; aCol.array[n * 4 + 3] = p.a * fade;
        aMisc.array[n * 4] = s; aMisc.array[n * 4 + 1] = p.rot; aMisc.array[n * 4 + 2] = p.frame; aMisc.array[n * 4 + 3] = p.core;
        n++;
      }
      geo.instanceCount = n;
      aPos.needsUpdate = aCol.needsUpdate = aMisc.needsUpdate = true;
      aPos.clearUpdateRanges?.(); aCol.clearUpdateRanges?.(); aMisc.clearUpdateRanges?.();
    },
  };
}

/* ---------- light beams that grow while a key is held ---------- */
function beamPool(max) {
  const quad = new THREE.PlaneGeometry(1, 1); quad.translate(0, 0.5, 0);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = quad.index; geo.attributes.position = quad.attributes.position; geo.attributes.uv = quad.attributes.uv;
  const aA = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);   // x, y0, z, height
  const aB = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);   // rgb, alpha
  const aW = new THREE.InstancedBufferAttribute(new Float32Array(max), 1).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('iA', aA); geo.setAttribute('iB', aB); geo.setAttribute('iW', aW);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: { uAdd: { value: 0 } },
    vertexShader: `
      attribute vec4 iA; attribute vec4 iB; attribute float iW; varying vec2 vUv; varying vec4 vB; varying float vH;
      void main(){
        vec3 camRight = normalize(vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]));
        vec3 right = normalize(vec3(camRight.x, 0.0, camRight.z) + 1e-5);
        vec3 p = vec3(iA.x, iA.y, iA.z) + right * position.x * iW + vec3(0.0, position.y * iA.w, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        vUv = uv; vB = iB; vH = iA.w;
      }`,
    fragmentShader: `
      uniform float uAdd; varying vec2 vUv; varying vec4 vB; varying float vH;
      void main(){
        float x = (vUv.x - 0.5) * 2.0;
        float core = exp(-x * x * 26.0), halo = exp(-x * x * 3.2);
        float y = vUv.y * vH;                                  // metres from the bottom
        float topFade = smoothstep(0.0, 0.10, (1.0 - vUv.y) * vH);
        float botFade = smoothstep(0.0, 0.012, y);
        float a = (core * 0.95 + halo * 0.45) * topFade * botFade * vB.a;
        vec3 c = mix(vB.rgb, vec3(1.0), core * 0.55);
        gl_FragColor = vec4(c * a, a * 0.85 * (1.0 - uAdd));
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 4;
  const B = [];
  return {
    mesh, mat, B,
    start(x, y, z, color, width) {
      if (B.length >= max) B.shift();
      const b = { x, y0: y, z, top: y, color, width, held: true, speed: 0.55, a: 1, age: 0 };
      B.push(b); return b;
    },
    update(dt) {
      for (let i = B.length - 1; i >= 0; i--) {
        const b = B[i]; b.age += dt;
        b.top += b.speed * dt;
        if (!b.held) { b.y0 += b.speed * dt; b.a -= dt * 0.55; }
        if (b.a <= 0 || b.y0 > 4) B.splice(i, 1);
      }
      let n = 0;
      for (const b of B) {
        aA.array[n * 4] = b.x; aA.array[n * 4 + 1] = b.y0; aA.array[n * 4 + 2] = b.z; aA.array[n * 4 + 3] = Math.max(0.001, b.top - b.y0);
        aB.array[n * 4] = b.color.r; aB.array[n * 4 + 1] = b.color.g; aB.array[n * 4 + 2] = b.color.b; aB.array[n * 4 + 3] = clamp(b.a, 0, 1) * Math.min(1, b.age * 12);
        aW.array[n] = b.width; n++;
      }
      geo.instanceCount = n;
      aA.needsUpdate = aB.needsUpdate = aW.needsUpdate = true;
    },
  };
}

/* ---------- the note names popping out of the keys ---------- */
function namePool(scene) {
  const tex = {};
  const make = (txt, col) => {
    const k = txt + col; if (tex[k]) return tex[k];
    const c = document.createElement('canvas'); c.width = 256; c.height = 160;
    const g = c.getContext('2d');
    g.font = `800 ${txt.length > 2 ? 92 : 108}px "Arial Rounded MT Bold","Avenir Next","Nunito",sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 18; g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,255,255,0.95)'; g.strokeText(txt, 128, 84);
    g.fillStyle = col; g.fillText(txt, 128, 84);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return (tex[k] = t);
  };
  const pool = [];
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false, toneMapped: false }));
    s.visible = false; s.renderOrder = 8; scene.add(s); pool.push({ s, age: 1, life: 1, y0: 0, lift: 0 });
  }
  let next = 0;
  return {
    show(txt, col, pos, size) {
      // a name that would land on one still showing next to it rises a step higher
      let lift = 0;
      for (const o of pool) if (o.s.visible && o.age < 0.45 && Math.abs(o.s.position.x - pos.x) < size * 1.7 && Math.abs(o.y0 + o.lift - pos.y - lift) < size * 0.8) lift += size * 0.9;
      const it = pool[next++ % pool.length];
      it.lift = Math.min(lift, size * 2.7);
      it.s.material.map = make(txt, col); it.s.material.needsUpdate = true;
      it.s.position.copy(pos); it.age = 0; it.life = 1.0; it.size = size; it.y0 = pos.y; it.s.visible = true;
    },
    update(dt) {
      for (const it of pool) {
        if (!it.s.visible) continue;
        it.age += dt; const u = it.age / it.life;
        if (u >= 1) { it.s.visible = false; continue; }
        const pop = u < 0.18 ? Math.sin((u / 0.18) * Math.PI * 0.6) / Math.sin(Math.PI * 0.6) * 1.0 : 1;
        it.s.scale.set(it.size * 1.6 * pop, it.size * pop, 1);
        it.s.position.y = it.y0 + (it.lift || 0) + it.size * 0.9 * Math.sqrt(u);
        it.s.material.opacity = u < 0.65 ? 1 : 1 - (u - 0.65) / 0.35;
      }
    },
  };
}

/* ---------- a rainbow over the piano ---------- */
function rainbowArc(scene) {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: { uT: { value: 0 }, uA: { value: 0 }, uAdd: { value: 0 }, uCols: { value: HEX.slice().reverse().map(h => new THREE.Color(h)) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uT, uA, uAdd; uniform vec3 uCols[7]; varying vec2 vUv;
      void main(){
        // uv.x runs along the arc, uv.y across the bands
        float band = vUv.y * 7.0; int i = int(clamp(floor(band), 0.0, 6.0));
        vec3 c = uCols[0];
        for (int k = 0; k < 7; k++) if (k == i) c = uCols[k];
        float edge = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
        float grow = smoothstep(uT - 0.06, uT, 1.0 - vUv.x);
        float a = edge * (1.0 - grow) * uA * 0.85;
        gl_FragColor = vec4(c * a, a * (1.0 - uAdd));
      }`,
  });
  // a flat ring segment, standing upright over the keyboard
  const geo = new THREE.RingGeometry(0.62, 0.86, 96, 1, 0, Math.PI);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), r = Math.hypot(x, y), a = Math.atan2(y, x);
    uv.setXY(i, a / Math.PI, (r - 0.62) / 0.24);
  }
  const m = new THREE.Mesh(geo, mat); m.visible = false; m.renderOrder = 3; m.frustumCulled = false;
  scene.add(m);
  return { m, mat, t: 0, active: false };
}

/* ======================================================================= */
export function buildFx(scene) {
  const tex = atlas();
  const sprites = spritePool(2400, tex);
  const beams = beamPool(96);
  const names = namePool(scene);
  const rb = rainbowArc(scene);
  scene.add(beams.mesh); scene.add(sprites.mesh);
  const held = new Map();     // midi -> beam
  const FX = { style: 'piano', names: true, quiet: reducedMotion, night: 0 };
  const STYLE = {
    piano: { spirit: [F.NOTE, F.NOTES], spark: F.SPARK },
    musicbox: { spirit: [F.STAR, F.SPARK], spark: F.STAR },
    marimba: { spirit: [F.DISC, F.FLOWER], spark: F.DOT },
    chip: { spirit: [F.SQUARE], spark: F.SQUARE },
    voice: { spirit: [F.HEART, F.NOTE], spark: F.HEART },
  };
  const tmp = new THREE.Vector3();

  FX.noteOn = function (m, pos, o = {}) {
    const col = o.color || colorOf(m), vel = o.vel ?? 0.8;
    const low = clamp((m - 21) / 87, 0, 1);              // 0 = lowest, 1 = highest
    const st = STYLE[FX.style] || STYLE.piano;
    const scale = o.scale || 1;
    // beam
    const prev = held.get(m); if (prev) prev.held = false;
    const b = beams.start(pos.x, pos.y, pos.z, col, (isBlack(m) ? 0.026 : 0.034) * scale * (o.camScale || 1));
    b.speed = lerp(0.42, 0.72, low) * Math.min(1, scale * 0.85);
    held.set(m, b);
    if (FX.quiet) return;
    // the spirit: low notes are big and lazy, high notes small and lively
    const sz = lerp(0.085, 0.034, low) * (0.8 + vel * 0.4) * scale;
    const vy = lerp(0.20, 0.42, low);
    const life = lerp(3.2, 2.2, low);
    const spirit = { x: pos.x, y: pos.y + 0.01, z: pos.z, vx: rand(-0.03, 0.03), vy, vz: rand(-0.02, 0.02) - 0.04, drag: 0.15, life, color: col, wob: lerp(0.018, 0.03, low) * scale, wobF: lerp(1.6, 3.6, low), pop: 1 };
    sprites.spawn(Object.assign({}, spirit, { frame: F.GLOW, size: sz * 2.6, a: 0.75, core: 0.6 }));
    sprites.spawn(Object.assign({}, spirit, { frame: pick(st.spirit), size: sz, a: 1, core: 0.25, rot: rand(-0.4, 0.4), vrot: rand(-0.6, 0.6) }));
    // sparks
    const n = Math.round(lerp(10, 16, vel) * (o.sparks ?? 1));
    for (let i = 0; i < n; i++) {
      const a = rand(Math.PI * 2), sp = rand(0.12, 0.45) * scale;
      sprites.spawn({ x: pos.x, y: pos.y + 0.004, z: pos.z, vx: Math.cos(a) * sp * 0.6, vy: rand(0.15, 0.6) * scale, vz: Math.sin(a) * sp * 0.4, ay: -0.5 * scale, drag: 2.2, life: rand(0.5, 1.0), frame: i % 3 ? F.DOT : st.spark, size: rand(0.006, 0.013) * scale, color: col, core: 0.7, vrot: rand(-6, 6) });
    }
    // a soft flash on the key itself
    sprites.spawn({ x: pos.x, y: pos.y + 0.003, z: pos.z + 0.03, frame: F.GLOW, size: 0.11 * scale, size1: 0.16 * scale, life: 0.45, color: col, a: 0.55, core: 0.3, fadeIn: 0.01 });
    if (FX.names && o.name !== false) {
      const label = o.label || (isBlack(m) ? null : SOLFEGE[degree(m)]);
      if (label) names.show(label, '#' + col.getHexString(), tmp.set(pos.x, pos.y + 0.03 * scale, pos.z + 0.01), 0.026 * scale * (o.camScale || 1));
    }
  };
  FX.noteOff = function (m) { const b = held.get(m); if (b) { b.held = false; held.delete(m); } };

  FX.burst = function (pos, n = 40, o = {}) {
    if (FX.quiet) n = Math.round(n / 3);
    const cols = o.colors || HEX.map(h => new THREE.Color(h));
    const sc = o.scale || 1;
    for (let i = 0; i < n; i++) {
      const a = rand(Math.PI * 2), e = rand(-0.2, 1.2), sp = rand(0.4, 1.2) * sc;
      sprites.spawn({ x: pos.x, y: pos.y, z: pos.z, vx: Math.cos(a) * Math.cos(e) * sp, vy: Math.sin(e) * sp + 0.3 * sc, vz: Math.sin(a) * Math.cos(e) * sp, ay: -0.9 * sc, drag: 1.2, life: rand(0.9, 1.8), frame: pick([F.STAR, F.SPARK, F.DOT, F.HEART, F.NOTE]), size: rand(0.014, 0.034) * sc, color: pick(cols), core: 0.5, vrot: rand(-5, 5) });
    }
  };
  FX.firework = function (pos, col, sc = 1) {
    const n = FX.quiet ? 30 : 90;
    for (let i = 0; i < n; i++) {
      const u = rand(-1, 1), a = rand(Math.PI * 2), r = Math.sqrt(1 - u * u), sp = rand(0.7, 1.0) * sc;
      sprites.spawn({ x: pos.x, y: pos.y, z: pos.z, vx: r * Math.cos(a) * sp, vy: u * sp, vz: r * Math.sin(a) * sp, ay: -0.35 * sc, drag: 1.4, life: rand(1.2, 1.9), frame: i % 4 ? F.DOT : F.SPARK, size: rand(0.012, 0.022) * sc, color: col, core: 0.8 });
    }
    sprites.spawn({ x: pos.x, y: pos.y, z: pos.z, frame: F.GLOW, size: 0.35 * sc, size1: 0.9 * sc, life: 0.6, color: col, a: 0.8, core: 0.7, fadeIn: 0.01 });
  };
  FX.confetti = function (center, n = 120, sc = 1) {
    if (FX.quiet) n = 30;
    for (let i = 0; i < n; i++) {
      sprites.spawn({ x: center.x + rand(-1.2, 1.2) * sc, y: center.y + rand(0.6, 1.6) * sc, z: center.z + rand(-0.8, 0.6) * sc, vx: rand(-0.1, 0.1), vy: rand(-0.3, -0.1), vz: rand(-0.1, 0.1), ay: -0.12, drag: 0.6, life: rand(3, 5), frame: pick([F.CONF, F.CONF, F.STAR, F.HEART]), size: rand(0.02, 0.035) * sc, color: new THREE.Color(pick(HEX)), core: 0.15, rot: rand(6), vrot: rand(-4, 4), wob: 0.05 * sc, wobF: rand(2, 4), fadeIn: 0.2 });
    }
  };
  // a sparkle that drifts from a to b, used to point at things
  FX.twinkle = function (pos, col, sc = 1) {
    sprites.spawn({ x: pos.x, y: pos.y, z: pos.z, frame: F.SPARK, size: 0.03 * sc, size1: 0.0, life: 0.7, color: col, core: 0.8, vrot: 3 });
  };
  FX.rainbow = function (center, width) {
    rb.m.position.copy(center); rb.m.scale.setScalar(width / 1.72); rb.t = 0; rb.active = true; rb.m.visible = true;
    // sparkles along the arc
    for (let i = 0; i < 40; i++) {
      const a = rand(Math.PI), r = rand(0.62, 0.86) * width / 1.72;
      sprites.spawn({ x: center.x + Math.cos(a) * r, y: center.y + Math.sin(a) * r, z: center.z + 0.01, vy: rand(-0.02, 0.05), frame: F.SPARK, size: rand(0.01, 0.025) * width, life: rand(1, 2.2), color: new THREE.Color(HEX[Math.floor(rand(7))]), core: 0.8, vrot: 2, fadeIn: 0.3 });
    }
  };
  FX.lookAt = function (camera) { if (rb.m.visible) rb.m.quaternion.copy(camera.quaternion); };

  FX.update = function (dt, t, night) {
    FX.night = night;
    // glow adds up in the dark; in daylight the shapes are drawn like stickers
    const add = night;
    sprites.mat.uniforms.uAdd.value = add; beams.mat.uniforms.uAdd.value = add * 0.9; rb.mat.uniforms.uAdd.value = add * 0.6;
    sprites.update(dt, t); beams.update(dt); names.update(dt);
    if (rb.active) {
      rb.t += dt;
      rb.mat.uniforms.uT.value = Math.min(1.06, rb.t / 0.9);
      rb.mat.uniforms.uA.value = rb.t < 2.6 ? 1 : Math.max(0, 1 - (rb.t - 2.6) / 1.2);
      if (rb.t > 3.8) { rb.active = false; rb.m.visible = false; }
    }
  };
  FX.clear = function () { sprites.P.length = 0; beams.B.length = 0; held.clear(); };
  return FX;
}
