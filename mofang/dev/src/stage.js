// 魔方世界 · the stage: renderer, sky, lights, the orbiting camera, picking and touch input
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clamp, damp, lerp, easeInOut, Tick } from './core.js';

const V = new THREE.Vector3(), V2 = new THREE.Vector3();
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

export const Stage = {
  renderer: null, scene: null, camera: null, root: null, env: null,
  W: 1, H: 1,
  rect: { x: 0, y: 0, w: 1, h: 1 },     // the part of the screen the 3D content should sit in (CSS px)
  // camera rig: what it shows now (cur) and where it is heading (goal)
  cur: { yaw: 0.6, pitch: 0.5, dist: 12, fov: 34, tx: 0, ty: 0, tz: 0 },
  goal: { yaw: 0.6, pitch: 0.5, dist: 12, fov: 34, tx: 0, ty: 0, tz: 0 },
  lim: { minPitch: -0.15, maxPitch: 1.45, minDist: 4, maxDist: 40, orbit: true, zoom: true, yawMin: -Infinity, yawMax: Infinity },
  vel: { yaw: 0, pitch: 0 },
  flying: null,
  handlers: null,      // the current screen's input handlers {down, move, up, tap}
  insets: [],
  moved: 0,            // seconds since the camera last moved (insets only re-render when needed)

  init(canvas) {
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;

    const scene = this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
    const pm = new THREE.PMREMGenerator(r);
    this.env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    scene.environment = this.env;
    scene.environmentIntensity = 0.55;

    this.sky = makeSky();
    scene.add(this.sky);
    this.lights = makeLights(scene);
    this.deco = makeDeco();
    scene.add(this.deco);
    this.root = new THREE.Group();
    scene.add(this.root);
    this.bindInput(canvas);
    Tick.add((dt, t) => this.update(dt, t));
  },

  // the screen area (CSS px) the content should be centred in; the rest is under the HUD
  setRect(x, y, w, h) { this.rect = { x, y, w: Math.max(1, w), h: Math.max(1, h) }; this.applyProjection(); },
  resize() {
    const c = this.renderer.domElement, w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight;
    this.W = w; this.H = h;
    this.renderer.setSize(w, h, false);
    this.applyProjection();
  },
  // centre the projection on rect, with cur.fov meaning the vertical field of view across rect's height
  applyProjection() {
    const { W, H, rect: R } = this, cam = this.camera;
    const cx = R.x + R.w / 2, cy = R.y + R.h / 2;
    const fw = 2 * Math.max(cx, W - cx, 1), fh = 2 * Math.max(cy, H - cy, 1);
    const tanR = Math.tan(THREE.MathUtils.degToRad(this.cur.fov) / 2);
    cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tanR * fh / R.h));
    cam.aspect = fw / fh;
    cam.setViewOffset(fw, fh, fw / 2 - cx, fh / 2 - cy, W, H);
    cam.updateProjectionMatrix();
  },
  // camera distance at which a sphere of radius r fills the rect (with a margin)
  fitDist(r, fov = this.goal.fov, margin = 1.08) {
    const R = this.rect, v = THREE.MathUtils.degToRad(fov) / 2;
    const h = Math.atan(Math.tan(v) * R.w / R.h);
    return (r * margin) / Math.sin(Math.min(v, h));
  },
  // aim the camera; instant=true jumps there
  look(o, instant) {
    Object.assign(this.goal, o);
    if (instant) { Object.assign(this.cur, this.goal); this.vel.yaw = this.vel.pitch = 0; this.applyProjection(); }
  },
  // smooth flight to a pose; resolves when there
  flyTo(o, sec = 1.2, ease = easeInOut) {
    const from = { ...this.cur }, to = { ...this.cur, ...o };
    // go the short way round
    let dy = to.yaw - from.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); to.yaw = from.yaw + dy;
    if (this.flying) this.flying.res();
    return new Promise(res => {
      this.flying = { from, to, t: 0, sec, ease, res };
      this.vel.yaw = this.vel.pitch = 0;
    });
  },
  update(dt, t) {
    const c = this.cur, g = this.goal;
    const before = c.yaw + c.pitch * 7 + c.dist * 13 + c.fov * 17 + c.tx + c.ty * 3 + c.tz * 5;
    if (this.flying) {
      const f = this.flying; f.t = Math.min(1, f.t + dt / f.sec);
      const k = f.ease(f.t);
      for (const key in f.to) c[key] = lerp(f.from[key], f.to[key], k);
      if (f.t >= 1) { Object.assign(g, f.to); this.flying = null; f.res(); }
    } else {
      if (!this.dragging) {
        g.yaw += this.vel.yaw * dt; g.pitch += this.vel.pitch * dt;
        const fr = Math.exp(-4.5 * dt); this.vel.yaw *= fr; this.vel.pitch *= fr;
      }
      g.pitch = clamp(g.pitch, this.lim.minPitch, this.lim.maxPitch);
      g.yaw = clamp(g.yaw, this.lim.yawMin, this.lim.yawMax);
      g.dist = clamp(g.dist, this.lim.minDist, this.lim.maxDist);
      for (const key in g) c[key] = damp(c[key], g[key], 10, dt);
    }
    const after = c.yaw + c.pitch * 7 + c.dist * 13 + c.fov * 17 + c.tx + c.ty * 3 + c.tz * 5;
    this.moved = Math.abs(after - before) > 1e-5 ? 0 : this.moved + dt;
    const cam = this.camera, cp = Math.cos(c.pitch);
    cam.position.set(c.tx + c.dist * cp * Math.sin(c.yaw), c.ty + c.dist * Math.sin(c.pitch), c.tz + c.dist * cp * Math.cos(c.yaw));
    // looking almost straight down: keep "front" at the bottom of the screen
    cam.up.set(0, 1, 0);
    if (c.pitch > 1.5) cam.up.set(-Math.sin(c.yaw), 0, -Math.cos(c.yaw));
    cam.lookAt(c.tx, c.ty, c.tz);
    this.applyProjection();
    this.sky.position.copy(cam.position);
    this.deco.userData.update(dt, t);
    this.lights.follow(c);
  },

  render() {
    const r = this.renderer;
    r.setScissorTest(false);
    r.setViewport(0, 0, this.W, this.H);
    r.autoClear = true;
    r.render(this.scene, this.camera);
    if (!this.insets.length) return;
    r.autoClear = false;
    for (const it of this.insets) {
      const b = it.el.getBoundingClientRect(), cb = r.domElement.getBoundingClientRect();
      if (b.width < 4 || b.height < 4) continue;
      const x = b.left - cb.left, y = this.H - (b.bottom - cb.top);
      r.setViewport(x, y, b.width, b.height); r.setScissor(x, y, b.width, b.height); r.setScissorTest(true);
      it.camera.aspect = b.width / b.height; it.camera.updateProjectionMatrix();
      if (it.before) it.before(b.width, b.height);
      r.setClearColor(it.bg || 0xffffff, 1); r.clear(true, true);
      r.render(it.scene, it.camera);
    }
    r.setScissorTest(false); r.setViewport(0, 0, this.W, this.H); r.setClearColor(0x000000, 1); r.autoClear = true;
  },
  addInset(it) { this.insets.push(it); return () => { this.insets = this.insets.filter(x => x !== it); }; },

  // world -> CSS px on screen
  toScreen(v) {
    V.copy(v).project(this.camera);
    return { x: (V.x + 1) / 2 * this.W, y: (1 - V.y) / 2 * this.H, behind: V.z > 1 };
  },
  pick(x, y, objs, recursive = true, any = false) {
    ndc.set(x / this.W * 2 - 1, -(y / this.H) * 2 + 1);
    ray.setFromCamera(ndc, this.camera);
    const hits = ray.intersectObjects(objs, recursive);
    return hits.find(h => h.object.visible !== false && (any || !h.object.userData.noPick)) || null;
  },
  rayFrom(x, y) { ndc.set(x / this.W * 2 - 1, -(y / this.H) * 2 + 1); ray.setFromCamera(ndc, this.camera); return ray.ray; },

  clear() {
    for (const c of [...this.root.children]) { this.root.remove(c); disposeDeep(c); }
    this.insets = [];
    this.handlers = null;
  },

  /* ---------- touch: one finger orbits (or goes to the screen's handlers), two fingers zoom ---------- */
  bindInput(canvas) {
    const pts = new Map();
    let gest = null, pinch0 = 0, dist0 = 0;
    const local = e => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    canvas.addEventListener('pointerdown', e => {
      canvas.setPointerCapture?.(e.pointerId);
      const p = local(e); pts.set(e.pointerId, p);
      if (pts.size === 2) {
        if (gest && gest.claimed && this.handlers?.cancel) this.handlers.cancel();
        const [a, b] = [...pts.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = this.goal.dist; gest = { pinch: true };
        this.dragging = false; return;
      }
      if (pts.size > 2) return;
      gest = { x0: p.x, y0: p.y, x: p.x, y: p.y, t0: performance.now(), moved: 0, claimed: false, id: e.pointerId };
      const h = this.handlers;
      if (h?.down && h.down(gest, e)) gest.claimed = true;
      this.vel.yaw = this.vel.pitch = 0;
    });
    canvas.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      const p = local(e); pts.set(e.pointerId, p);
      if (!gest) return;
      if (gest.pinch) {
        if (pts.size < 2 || !this.lim.zoom) return;
        const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch0 > 10) this.goal.dist = clamp(dist0 * pinch0 / d, this.lim.minDist, this.lim.maxDist);
        return;
      }
      if (e.pointerId !== gest.id) return;
      const dx = p.x - gest.x, dy = p.y - gest.y;
      gest.x = p.x; gest.y = p.y; gest.dx = dx; gest.dy = dy;
      gest.moved = Math.max(gest.moved, Math.hypot(p.x - gest.x0, p.y - gest.y0));
      if (gest.claimed) { this.handlers?.move?.(gest, e); return; }
      if (gest.moved > 6 && this.lim.orbit && !this.flying) {
        this.dragging = true;
        const k = 5.2 / Math.max(320, Math.min(this.W, this.H) * 1.6);
        this.goal.yaw -= dx * k; this.goal.pitch += dy * k;
        const dt = 1 / 60;
        this.vel.yaw = -dx * k / dt * 0.5; this.vel.pitch = dy * k / dt * 0.5;
        this.handlers?.orbit?.();
      }
    });
    const end = e => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (!gest) return;
      if (gest.pinch) { if (pts.size === 0) gest = null; return; }
      if (e.pointerId !== gest.id) return;
      const g = gest; gest = null; this.dragging = false;
      if (g.claimed) { this.handlers?.up?.(g, e); return; }
      if (g.moved < 12 && performance.now() - g.t0 < 700 && e.type === 'pointerup') this.handlers?.tap?.(g, e);
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('wheel', e => { e.preventDefault(); if (this.lim.zoom) this.goal.dist = clamp(this.goal.dist * Math.exp(e.deltaY * 0.0012), this.lim.minDist, this.lim.maxDist); }, { passive: false });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  },
};

export function disposeDeep(o) {
  o.traverse(n => {
    if (typeof n.userData.tick === 'function') n.userData.tick();
    if (n.geometry && !n.geometry.userData.shared) n.geometry.dispose();
    const m = n.material;
    if (m) (Array.isArray(m) ? m : [m]).forEach(x => { if (!x.userData.shared) { if (x.map && !x.map.userData?.shared) x.map.dispose(); x.dispose(); } });
  });
}

/* ---------- sky: a soft vertical gradient with a few big blurry bubbles of colour ---------- */
const SKY_U = { uTop: { value: new THREE.Color('#8FD3FF') }, uMid: { value: new THREE.Color('#DDF3FF') }, uLow: { value: new THREE.Color('#FFF4E0') }, uTime: { value: 0 } };
function makeSky() {
  const m = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false, uniforms: SKY_U,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uTop, uMid, uLow; uniform float uTime; varying vec3 vD;
      void main(){
        float y = vD.y;
        vec3 c = mix(uMid, uTop, smoothstep(0.0, 0.8, y));
        c = mix(c, uLow, smoothstep(0.05, -0.5, y));
        // a few soft round clouds of light
        for (int i = 0; i < 7; i++) {
          float fi = float(i);
          vec3 d = normalize(vec3(sin(fi * 2.39 + uTime * 0.01), 0.05 + 0.4 * fract(fi * 0.618), cos(fi * 2.39 + uTime * 0.01)));
          float a = acos(clamp(dot(vD, d), -1.0, 1.0));
          c = mix(c, vec3(1.0), smoothstep(0.16 + 0.05 * fract(fi * 0.37), 0.02, a) * 0.28);
        }
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  }));
  m.renderOrder = -100; m.frustumCulled = false; m.userData.noPick = true;
  return m;
}
export function setSky(top, mid, low) {
  SKY_U.uTop.value.set(top); SKY_U.uMid.value.set(mid); SKY_U.uLow.value.set(low);
}
Tick.add((dt, t) => { SKY_U.uTime.value = t; });

/* ---------- lights: hemisphere fill, one soft sun with shadows that follows the camera's side ---------- */
export function makeLights(scene, withShadow = true) {
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#C9B8A6', 1.55);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFF6E8', 2.1);
  sun.position.set(6, 14, 8);
  if (withShadow) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
    const sc = sun.shadow.camera; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8; sc.near = 1; sc.far = 50;
  }
  scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight('#DDEBFF', 0.6);
  fill.position.set(-8, 4, -6);
  scene.add(fill);
  return {
    hemi, sun, fill,
    size(s) { const sc = sun.shadow.camera; sc.left = -s; sc.right = s; sc.top = s; sc.bottom = -s; sc.updateProjectionMatrix(); },
    // keep the sun over the viewer's shoulder so the side we look at is always lit
    follow(c) {
      const a = c.yaw + 0.55;
      sun.position.set(c.tx + Math.sin(a) * 9, c.ty + 15, c.tz + Math.cos(a) * 9);
      sun.target.position.set(c.tx, c.ty, c.tz);
    },
  };
}

/* ---------- far-off floating little cubes, for the "world of cubes" feeling ---------- */
function makeDeco() {
  const g = new THREE.Group(), cols = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF9F45', '#C77DFF', '#FF8FB1'];
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const items = [];
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.5, transparent: true, opacity: 0.85 }));
    const a = i * 2.39996, r = 38 + (i * 13 % 23), y = -10 + (i * 7 % 30);
    m.position.set(Math.sin(a) * r, y, Math.cos(a) * r);
    const s = 1.2 + (i % 5) * 0.5; m.scale.setScalar(s);
    m.rotation.set(i, i * 2, 0);
    m.userData = { y, sp: 0.2 + (i % 4) * 0.08, ph: i, noPick: true };
    items.push(m); g.add(m);
  }
  g.userData.update = (dt, t) => { for (const m of items) { m.rotation.x += dt * m.userData.sp * 0.5; m.rotation.y += dt * m.userData.sp; m.position.y = m.userData.y + Math.sin(t * 0.4 + m.userData.ph) * 1.2; } };
  return g;
}
