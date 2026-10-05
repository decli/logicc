// 彩虹钢琴 · camera: walk around the piano ("show"), sit at the keyboard ("play"),
// or let it film a concert by itself ("concert"). Moving between them is always a glide, never a cut.
import * as THREE from 'three';
import { K } from './notes.js';
import { clamp, damp, easeInOut, lerp } from './core.js';

const CENTER = new THREE.Vector3(0, 0.78, -0.62);

export function buildRig(camera) {
  const R = {
    mode: 'show',
    // show
    theta: 0.62, phi: 1.08, radius: 3.6, vTheta: 0, vPhi: 0, idle: 0,
    // play
    cx: -0.06, span: 15, vcx: 0, cxGoal: null,
    // concert
    shot: 0, shotT: 0,
    // a glide in progress
    glide: null,
    fovGoal: 34,
    userAt: 0,
  };
  const pos = new THREE.Vector3(), tgt = new THREE.Vector3(), tmpP = new THREE.Vector3(), tmpT = new THREE.Vector3();
  camera.position.set(4, 2.2, 4); tgt.copy(CENTER);

  const maxSpan = () => K.N_WHITE + 1;
  const clampCx = () => { const half = Math.min(R.span, K.N_WHITE) * K.W / 2; R.cx = clamp(R.cx, -K.HALF + half - 0.004, K.HALF - half + 0.004); if (R.span >= K.N_WHITE) R.cx = 0; };

  function showPose(outP, outT) {
    outT.copy(CENTER);
    const r = R.radius;
    outP.set(CENTER.x + r * Math.sin(R.phi) * Math.sin(R.theta), CENTER.y + r * Math.cos(R.phi), CENTER.z + r * Math.sin(R.phi) * Math.cos(R.theta));
  }
  // sit in front of the keys: the keyboard fills the lower half of the screen, `span` white keys across
  function playPose(outP, outT, cx = R.cx, span = R.span) {
    const vfov = THREE.MathUtils.degToRad(camera.fov), aspect = camera.aspect;
    const tanV = Math.tan(vfov / 2), tanH = tanV * aspect;
    // portrait screens look down more steeply: the strings and dampers fill the space above the keys
    const tall = clamp((1.3 - aspect) / 0.6, 0, 1);
    const pitchToFront = THREE.MathUtils.degToRad(lerp(58, 46, clamp((span - 8) / 40, 0, 1)) + tall * 16);
    const lift = Math.atan(0.82 * tanV);          // put the front edge of the keys near the bottom of the screen
    const width = span * K.W * 1.02;
    const dist = width / (2 * tanH * Math.cos(lift));
    const F = tmpT.set(cx, K.TOP, 0.012);
    outP.set(F.x, F.y + dist * Math.sin(pitchToFront), F.z + dist * Math.cos(pitchToFront));
    const viewPitch = pitchToFront - lift;
    outT.set(F.x, outP.y - Math.sin(viewPitch) * 2, outP.z - Math.cos(viewPitch) * 2);
  }
  const SHOTS = [
    { p: [1.75, 1.45, 1.55], t: [-0.05, 0.82, -0.45], p2: [1.25, 1.35, 1.85] },
    { p: [0.85, 0.98, 0.42], t: [-0.05, 0.73, -0.06], p2: [0.25, 1.02, 0.55] },
    { p: [1.5, 1.62, -1.1], t: [-0.15, 0.8, -0.72], p2: [1.4, 1.5, -0.45] },
    { p: [-1.95, 1.5, 0.25], t: [0.05, 0.85, -0.5], p2: [-1.75, 1.25, 1.05] },
    { p: [-0.6, 1.25, 1.25], t: [0.1, 0.78, -0.2], p2: [0.6, 1.25, 1.3] },
    { p: [1.7, 2.1, -2.5], t: [-0.1, 0.85, -0.6], p2: [2.5, 1.85, -1.4] },
  ];
  function concertPose(outP, outT, i, u) {
    const s = SHOTS[i % SHOTS.length];
    outP.set(lerp(s.p[0], s.p2[0], u), lerp(s.p[1], s.p2[1], u), lerp(s.p[2], s.p2[2], u));
    outT.set(s.t[0], s.t[1], s.t[2]);
  }
  function poseFor(mode, outP, outT) {
    if (mode === 'play') playPose(outP, outT);
    else if (mode === 'concert') concertPose(outP, outT, R.shot, R.shotT);
    else showPose(outP, outT);
  }

  const rig = {
    get mode() { return R.mode; },
    get span() { return R.span; },
    get cx() { return R.cx; },
    get gliding() { return !!R.glide; },
    // white-key index range currently on screen (for the navigator)
    visibleRange() { const half = Math.min(R.span, K.N_WHITE) / 2; const c = (R.cx + K.HALF) / K.W; return [c - half, c + half]; },
    setMode(mode, o = {}) {
      if (o.span) R.span = clamp(o.span, 7, maxSpan());
      if (o.cx !== undefined) R.cx = o.cx;
      if (mode === 'play') clampCx();
      if (mode === 'concert') { R.shot = (R.shot + 1) % SHOTS.length; R.shotT = 0; }
      if (mode === 'show' && o.theta !== undefined) { R.theta = o.theta; R.phi = o.phi ?? R.phi; R.radius = o.radius ?? R.radius; }
      const fromP = camera.position.clone(), fromT = tgt.clone();
      R.mode = mode;
      R.glide = { fromP, fromT, t: 0, dur: o.dur || 1.5 };
      R.fovGoal = mode === 'play' ? 22 : 34;
    },
    // gestures
    orbit(dx, dy) {
      if (R.mode === 'play') return;
      if (R.mode === 'concert') { R.mode = 'show'; syncShowFromCamera(); }
      R.vTheta = -dx * 0.006; R.vPhi = -dy * 0.005; R.theta += R.vTheta; R.phi = clamp(R.phi + R.vPhi, 0.32, 1.48); R.idle = 0; R.userAt = performance.now();
    },
    release() { /* inertia continues in update */ },
    zoom(f) {
      R.userAt = performance.now();
      if (R.mode === 'play') { R.span = clamp(R.span / f, 7, maxSpan()); clampCx(); return; }
      if (R.mode === 'concert') { R.mode = 'show'; syncShowFromCamera(); }
      R.radius = clamp(R.radius / f, 1.25, 6.5); R.idle = 0;
    },
    pan(dxPixels, viewportW) {
      if (R.mode !== 'play') return;
      const metresPerPx = (R.span * K.W) / viewportW;
      R.cx -= dxPixels * metresPerPx; R.vcx = -dxPixels * metresPerPx; R.cxGoal = null; clampCx();
      R.userAt = performance.now();
    },
    // glide the keyboard so this x is in the middle
    lookAtX(x, o = {}) { R.cxGoal = x; if (o.instant) { R.cx = x; clampCx(); R.cxGoal = null; } },
    // make sure the keys from xa to xb are on screen, moving as little as possible
    ensureVisible(xa, xb) {
      const half = Math.min(R.span, K.N_WHITE) * K.W / 2 - K.W * 0.8;
      const c = R.cxGoal ?? R.cx;
      if (xb - xa > 2 * half) { R.cxGoal = (xa + xb) / 2; return; }
      if (xa < c - half) R.cxGoal = xa + half; else if (xb > c + half) R.cxGoal = xb - half;
    },
    setSpan(s) { R.span = clamp(s, 7, maxSpan()); clampCx(); },
    shotAt(i) { R.mode = 'concert'; R.shot = i; R.shotT = 0.5; R.glide = null; R.fovGoal = 34; camera.fov = 34; camera.updateProjectionMatrix(); },
    nextShot() { R.shot = (R.shot + 1) % SHOTS.length; R.shotT = 0; const fromP = camera.position.clone(), fromT = tgt.clone(); R.glide = { fromP, fromT, t: 0, dur: 3.2 }; },
    update(dt) {
      // per-mode motion
      if (R.mode === 'show') {
        if (performance.now() - R.userAt > 120) { R.theta += R.vTheta; R.phi = clamp(R.phi + R.vPhi, 0.32, 1.48); R.vTheta *= Math.pow(0.04, dt); R.vPhi *= Math.pow(0.04, dt); }
        R.idle += dt;
        if (R.idle > 7) R.theta += dt * 0.06 * Math.min(1, (R.idle - 7) / 3);   // a slow turntable when nobody touches
      } else if (R.mode === 'play') {
        if (R.cxGoal !== null) { R.cx = damp(R.cx, R.cxGoal, 5, dt); if (Math.abs(R.cx - R.cxGoal) < 0.0005) R.cxGoal = null; clampCx(); }
        else if (performance.now() - R.userAt > 60 && Math.abs(R.vcx) > 1e-5) { R.cx += R.vcx; R.vcx *= Math.pow(0.02, dt); clampCx(); }
      } else if (R.mode === 'concert') {
        R.shotT += dt / 11;
        if (R.shotT >= 1) rig.nextShot();
      }
      const fov = damp(camera.fov, R.fovGoal, 3, dt);
      if (Math.abs(fov - camera.fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
      poseFor(R.mode, pos, tmpP.copy(tgt));
      const goalT = tmpP;
      if (R.glide) {
        const g = R.glide; g.t = Math.min(1, g.t + dt / g.dur);
        const e = easeInOut(g.t);
        // swing out a little on the way, so the move reads as a camera crane, not a zoom
        camera.position.lerpVectors(g.fromP, pos, e);
        const arc = Math.sin(e * Math.PI) * 0.18 * g.fromP.distanceTo(pos);
        camera.position.y += arc * 0.6;
        tgt.lerpVectors(g.fromT, goalT, e);
        if (g.t >= 1) R.glide = null;
      } else {
        const k = R.mode === 'concert' ? 1.2 : 14;
        camera.position.set(damp(camera.position.x, pos.x, k, dt), damp(camera.position.y, pos.y, k, dt), damp(camera.position.z, pos.z, k, dt));
        tgt.set(damp(tgt.x, goalT.x, k, dt), damp(tgt.y, goalT.y, k, dt), damp(tgt.z, goalT.z, k, dt));
      }
      camera.lookAt(tgt);
    },
  };
  function syncShowFromCamera() {
    const d = camera.position.clone().sub(CENTER);
    R.radius = clamp(d.length(), 1.25, 6.5);
    R.phi = clamp(Math.acos(clamp(d.y / R.radius, -1, 1)), 0.32, 1.48);
    R.theta = Math.atan2(d.x, d.z);
    R.glide = null;
  }
  return rig;
}
