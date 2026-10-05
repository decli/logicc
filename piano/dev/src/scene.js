// 彩虹钢琴 · the stage: renderer, sky, floor, light, day and night
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { damp, lerp } from './core.js';

const DAY = {
  top: new THREE.Color('#E7E4F7'), mid: new THREE.Color('#F7EDE6'), floor: new THREE.Color('#F2E7DA'),
  hemiSky: new THREE.Color('#FFF6EC'), hemiGround: new THREE.Color('#D8C6B4'), hemi: 1.15, key: 2.4, keyColor: new THREE.Color('#FFF1DF'),
  env: 0.95, spot: 0, exposure: 1.0, stars: 0,
};
const NIGHT = {
  top: new THREE.Color('#02030C'), mid: new THREE.Color('#0F1036'), floor: new THREE.Color('#0B0B26'),
  hemiSky: new THREE.Color('#5B63B8'), hemiGround: new THREE.Color('#1A1836'), hemi: 0.55, key: 0.55, keyColor: new THREE.Color('#9FB4FF'),
  env: 0.5, spot: 16, exposure: 1.05, stars: 1,
};

const DAY_POD = new THREE.Color('#F1E8DD'), NIGHT_POD = new THREE.Color('#1D1B45'), NIGHT_TOP = new THREE.Color('#2A2860');
export function buildStage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.02, 80);
  camera.position.set(3, 2, 3);

  // reflections for the lacquer: a soft studio
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  /* ---- sky dome: a vertical gradient that also blooms faintly in the colour of the last notes ---- */
  const skyU = {
    uTop: { value: DAY.top.clone() }, uMid: { value: DAY.mid.clone() }, uFloor: { value: DAY.floor.clone() },
    uTint: { value: new THREE.Color('#ffffff') }, uTintAmt: { value: 0 }, uTime: { value: 0 }, uStars: { value: 0 },
    uBokeh: { value: Array.from({ length: 10 }, (_, i) => { const a = -2.3 + i * 0.52 + Math.sin(i * 7.1) * 0.2, y = 0.1 + ((i * 0.37) % 1) * 0.42; return new THREE.Vector4(Math.cos(a) * Math.cos(y), Math.sin(y), Math.sin(a) * Math.cos(y), 0.05 + ((i * 0.61) % 1) * 0.07); }) },
    uBokehC: { value: ['#FF4F5E', '#FF9A3C', '#FFD43B', '#3DD68C', '#1FC8DB', '#4D7CFE', '#A55EEA', '#FF8FAB', '#5EEAD4', '#FFC94A'].map(h => new THREE.Color(h)) },
  };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(40, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 uTop, uMid, uFloor, uTint; uniform float uTintAmt, uTime, uStars; varying vec3 vDir;
      uniform vec4 uBokeh[10]; uniform vec3 uBokehC[10];
      float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
      void main(){
        float y = vDir.y;
        vec3 c = mix(uMid, uTop, smoothstep(0.02, 0.75, y));
        c = mix(c, uFloor, smoothstep(0.03, -0.12, y));
        // a soft glow low on the horizon in the colour of the music
        float glow = exp(-pow(y - 0.12, 2.0) * 18.0);
        c += uTint * uTintAmt * glow;
        // big soft circles of colour, like out-of-focus stage lights
        for (int i = 0; i < 10; i++) {
          vec3 bd = normalize(uBokeh[i].xyz + vec3(sin(uTime * 0.05 + float(i)) * 0.04, sin(uTime * 0.07 + float(i) * 2.0) * 0.03, 0.0));
          float d = acos(clamp(dot(normalize(vDir), bd), -1.0, 1.0));
          float r = uBokeh[i].w;
          float disc = smoothstep(r, r * 0.82, d);
          c = mix(c, c + uBokehC[i] * mix(0.12, 0.22, uStars), disc * smoothstep(-0.02, 0.1, y) * mix(0.8, 1.0, uStars));
        }
        // stars at night
        if (uStars > 0.01 && y > 0.05) {
          vec3 p = floor(vDir * 220.0);
          float s = h(p);
          float tw = 0.6 + 0.4 * sin(uTime * (1.0 + 3.0 * h(p + 3.1)) + s * 40.0);
          float star = step(0.994, s) * tw * smoothstep(0.04, 0.3, y) * (0.5 + 0.5 * h(p + 7.7));
          c += mix(vec3(0.8, 0.85, 1.0), vec3(1.0, 0.9, 0.7), h(p + 1.3)) * star * uStars * 1.7;
        }
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  }));
  sky.renderOrder = -10;
  scene.add(sky);

  /* ---- floor: lit, takes the shadow, melts into the sky at the horizon ---- */
  scene.fog = new THREE.Fog(DAY.mid.clone(), 7, 24);
  const floorMat = new THREE.MeshStandardMaterial({ color: DAY.floor.clone(), roughness: 0.95, metalness: 0, envMapIntensity: 0.3 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 64), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.position.y = -0.045;
  scene.add(floor);
  // a round stage with a rainbow running round its edge (it glows at night)
  const stageTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
    const r0 = 512;
    const bg = g.createRadialGradient(r0, r0, 0, r0, r0, r0);
    bg.addColorStop(0, '#FFFFFF'); bg.addColorStop(0.8, '#F7F1EA'); bg.addColorStop(1, '#EFE6DB');
    g.fillStyle = bg; g.fillRect(0, 0, 1024, 1024);
    const cols = ['#A55EEA', '#4D7CFE', '#1FC8DB', '#3DD68C', '#FFD43B', '#FF9A3C', '#FF4F5E'];
    cols.forEach((h, i) => { g.strokeStyle = h; g.lineWidth = 9; g.beginPath(); g.arc(r0, r0, 452 + i * 9, 0, Math.PI * 2); g.stroke(); });
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 6; g.beginPath(); g.arc(r0, r0, 512 - 26, 0, Math.PI * 2); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  const stageGlow = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
    const cols = ['#A55EEA', '#4D7CFE', '#1FC8DB', '#3DD68C', '#FFD43B', '#FF9A3C', '#FF4F5E'];
    g.fillStyle = '#000'; g.fillRect(0, 0, 1024, 1024);
    cols.forEach((h, i) => { g.strokeStyle = h; g.lineWidth = 9; g.beginPath(); g.arc(512, 512, 452 + i * 9, 0, Math.PI * 2); g.stroke(); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const podTop = new THREE.MeshStandardMaterial({ map: stageTex, emissive: 0xffffff, emissiveMap: stageGlow, emissiveIntensity: 0, roughness: 0.55, envMapIntensity: 0.5 });
  const podSide = new THREE.MeshStandardMaterial({ color: '#F1E8DD', roughness: 0.5 });
  const podium = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.99, 0.045, 128, 1), [podSide, podTop, podSide]);
  podium.position.set(0.02, -0.0225, -0.66); podium.receiveShadow = true; scene.add(podium);
  // a soft contact shadow under the piano so it sits on the floor even without the shadow map
  const blobTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    r.addColorStop(0, 'rgba(0,0,0,0.42)'); r.addColorStop(0.55, 'rgba(0,0,0,0.16)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.5), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.8 }));
  blob.rotation.x = -Math.PI / 2; blob.position.set(-0.02, 0.001, -0.72); scene.add(blob);

  const poolTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, 'rgba(255,214,150,0.55)'); r.addColorStop(0.5, 'rgba(255,190,120,0.18)'); r.addColorStop(1, 'rgba(255,180,110,0)');
    g.fillStyle = r; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
  })();
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, fog: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(0.1, 0.003, -0.5); pool.renderOrder = -1; scene.add(pool);

  /* ---- lights ---- */
  const hemi = new THREE.HemisphereLight(DAY.hemiSky, DAY.hemiGround, DAY.hemi); scene.add(hemi);
  const key = new THREE.DirectionalLight(DAY.keyColor, DAY.key);
  key.position.set(2.2, 4.8, 2.6); key.target.position.set(0, 0.6, -0.7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera; sc.left = -1.9; sc.right = 1.9; sc.top = 1.9; sc.bottom = -1.9; sc.near = 1; sc.far = 10;
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
  scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#FFE1F0', 0.5); fill.position.set(-3, 2.2, 1.5); scene.add(fill);
  const spot = new THREE.SpotLight('#FFE7C2', 0, 9, 0.52, 0.65, 1.4);
  spot.position.set(0.3, 5.2, 0.6); spot.target.position.set(0, 0.7, -0.6); scene.add(spot); scene.add(spot.target);
  // the visible cone of the spotlight at night
  const coneMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide, fog: false,
    uniforms: { uAmt: { value: 0 }, uColor: { value: new THREE.Color('#FFE2B0') } },
    vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform float uAmt; uniform vec3 uColor; varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){ float rim = pow(1.0 - abs(dot(vN, vV)), 1.2); float a = (1.0 - rim) * pow(vY, 1.6) * uAmt * 0.16; gl_FragColor = vec4(uColor * a, a); }`,
  });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 2.3, 5.2, 48, 1, true), coneMat);
  cone.position.set(0.15, 2.6, -0.1); cone.rotation.z = 0.06; scene.add(cone);

  /* ---- drifting dust in the light, fireflies at night ---- */
  const N = 160, dpos = new Float32Array(N * 3), dseed = new Float32Array(N);
  for (let i = 0; i < N; i++) { dpos[i * 3] = (Math.random() - 0.5) * 5; dpos[i * 3 + 1] = Math.random() * 2.6; dpos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.6; dseed[i] = Math.random(); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3)); dg.setAttribute('seed', new THREE.BufferAttribute(dseed, 1));
  const dustU = { uTime: { value: 0 }, uNight: { value: 0 }, uScale: { value: 300 } };
  const dust = new THREE.Points(dg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: dustU,
    vertexShader: `attribute float seed; uniform float uTime, uScale, uNight; varying float vA; varying float vS;
      void main(){ vec3 p = position; float t = uTime * (0.05 + seed * 0.08);
        p.x += sin(t * 3.0 + seed * 20.0) * 0.25; p.y = mod(p.y + t * 0.6, 2.6); p.z += cos(t * 2.0 + seed * 9.0) * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = uScale * (0.006 + 0.01 * seed) * (1.0 + uNight) / -mv.z;
        vA = (0.25 + 0.75 * uNight) * smoothstep(0.0, 0.4, p.y) * (1.0 - smoothstep(2.0, 2.6, p.y)) * (0.5 + 0.5 * sin(uTime * (1.0 + seed * 2.0) + seed * 30.0)); vS = seed; }`,
    fragmentShader: `uniform float uNight; varying float vA; varying float vS; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); float a = smoothstep(0.5, 0.0, r); a *= a;
      vec3 c = mix(vec3(1.0, 0.92, 0.75), mix(vec3(1.0, 0.85, 0.4), vec3(0.6, 1.0, 0.7), vS), uNight); gl_FragColor = vec4(c * a * vA, a * vA); }`,
  }));
  dust.frustumCulled = false;
  scene.add(dust);

  /* ---- theme blending ---- */
  const T = { night: 0, target: 0, tint: new THREE.Color(), tintAmt: 0 };
  const cTop = new THREE.Color(), cMid = new THREE.Color(), cFloor = new THREE.Color();
  function applyTheme() {
    const n = T.night;
    cTop.copy(DAY.top).lerp(NIGHT.top, n); cMid.copy(DAY.mid).lerp(NIGHT.mid, n); cFloor.copy(DAY.floor).lerp(NIGHT.floor, n);
    skyU.uTop.value.copy(cTop); skyU.uMid.value.copy(cMid); skyU.uFloor.value.copy(cFloor);
    scene.fog.color.copy(cMid);
    floorMat.color.copy(cFloor);
    hemi.color.copy(DAY.hemiSky).lerp(NIGHT.hemiSky, n); hemi.groundColor.copy(DAY.hemiGround).lerp(NIGHT.hemiGround, n);
    hemi.intensity = lerp(DAY.hemi, NIGHT.hemi, n);
    key.intensity = lerp(DAY.key, NIGHT.key, n); key.color.copy(DAY.keyColor).lerp(NIGHT.keyColor, n);
    fill.intensity = lerp(0.5, 0.15, n);
    spot.intensity = lerp(DAY.spot, NIGHT.spot, n);
    scene.environmentIntensity = lerp(DAY.env, NIGHT.env, n);
    renderer.toneMappingExposure = lerp(DAY.exposure, NIGHT.exposure, n);
    skyU.uStars.value = n; dustU.uNight.value = n; coneMat.uniforms.uAmt.value = n;
    blob.material.opacity = lerp(0.8, 0.95, n); pool.material.opacity = n * 0.9;
    podTop.emissiveIntensity = n * 1.4; podSide.color.set(DAY_POD).lerp(NIGHT_POD, n); podTop.color.set('#ffffff').lerp(NIGHT_TOP, n);
  }
  applyTheme();

  const stage = {
    renderer, scene, camera, sky, floor,
    get night() { return T.night; },
    setNight(v) { T.target = v ? 1 : 0; },
    // the sky warms to the colour of what was just played
    tint(color, amt = 1) { T.tint.lerp(color, 0.5); T.tintAmt = Math.min(1, T.tintAmt + 0.22 * amt); },
    resize() {
      const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      dustU.uScale.value = h * renderer.getPixelRatio() * 0.5;
    },
    shadowDirty() { renderer.shadowMap.needsUpdate = true; },
    update(dt, t) {
      if (T.night !== T.target) { T.night = damp(T.night, T.target, 2.2, dt); if (Math.abs(T.night - T.target) < 0.002) T.night = T.target; applyTheme(); }
      T.tintAmt = damp(T.tintAmt, 0, 0.9, dt);
      skyU.uTint.value.copy(T.tint); skyU.uTintAmt.value = T.tintAmt * lerp(0.18, 0.55, T.night);
      skyU.uTime.value = t; dustU.uTime.value = t;
    },
    render() { renderer.render(scene, camera); },
  };
  renderer.shadowMap.needsUpdate = true;
  return stage;
}
