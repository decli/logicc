// 彩虹钢琴 · fingers, mouse and the computer keyboard
// A finger that lands on a key plays it, and sliding along the keyboard plays every key it crosses
// (a glissando). A finger that lands anywhere else turns the piano (or, at the keyboard, slides along it);
// two fingers zoom. Ten fingers on ten keys are ten notes.
import * as THREE from 'three';
import { Snd } from './audio.js';
import { K, whiteIndex, isBlack } from './notes.js';
import { Bus } from './core.js';

export function buildInput(canvas, ctx) {
  const { camera, piano, player, rig } = ctx;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const P = new Map();              // pointerId -> state
  let gesture = null;               // two-finger pinch state
  const I = { enabled: true, keysEnabled: true, filter: null, onTapPiano: null, gloss: [] };

  function rayAt(x, y) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray;
  }
  function keyAt(x, y) {
    if (!I.keysEnabled || piano.fallOpen < 0.6) return null;
    const r = rayAt(x, y);
    const m = piano.keyAt(r.ray);
    if (m === null || m === undefined) return null;
    // from behind or the side, the case is in the way
    if (rig.mode !== 'play') {
      const hit = r.intersectObjects(piano.occluders, false)[0];
      if (hit) {
        const t = (K.TOP - r.ray.origin.y) / r.ray.direction.y;
        if (hit.distance < t * 0.995) return null;
      }
    }
    return m;
  }
  function hitsPiano(x, y) { return rayAt(x, y).intersectObject(piano.root, true).length > 0; }

  function press(st, m) {
    if (st.key === m) return;
    if (st.key !== null) player.up(st.key, { src: 'user' });
    st.key = m;
    if (m !== null) {
      if (I.filter && !I.filter(m)) { st.key = null; return; }
      player.down(m, { src: 'user', vel: st.vel });
      // glissando: remember the keys crossed in a row
      if (st.moved) { st.run.push({ m, t: performance.now() }); checkGliss(st); }
      else st.run = [{ m, t: performance.now() }];
    }
  }
  function checkGliss(st) {
    const now = performance.now();
    st.run = st.run.filter(e => now - e.t < 1100);
    const whites = st.run.filter(e => !isBlack(e.m));
    if (whites.length >= 7 && !st.rainbowed) {
      const span = Math.abs(whiteIndex(whites[whites.length - 1].m) - whiteIndex(whites[0].m));
      if (span >= 6) { st.rainbowed = true; Bus.emit('glissando', whites[0].m, whites[whites.length - 1].m); }
    }
  }

  function down(e) {
    if (!I.enabled) return;
    Snd.init();
    canvas.setPointerCapture?.(e.pointerId);
    const vel = e.pointerType === 'pen' && e.pressure ? 0.35 + e.pressure * 0.65 : 0.72 + Math.random() * 0.1;
    const st = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, key: null, kind: 'gesture', vel, moved: false, run: [], t0: performance.now() };
    P.set(e.pointerId, st);
    if (I.onTapPiano && hitsPiano(e.clientX, e.clientY)) { st.kind = 'tapPiano'; return; }
    const m = keyAt(e.clientX, e.clientY);
    if (m !== null && e.button !== 2) { st.kind = 'key'; press(st, m); }
    else {
      const g = Array.from(P.values()).filter(s => s.kind === 'gesture');
      if (g.length === 2) gesture = { d0: dist(g[0], g[1]), a: g[0].id, b: g[1].id };
    }
    Bus.emit('touch');
  }
  function move(e) {
    const st = P.get(e.pointerId); if (!st) return;
    const dx = e.clientX - st.x, dy = e.clientY - st.y;
    st.x = e.clientX; st.y = e.clientY;
    if (Math.hypot(st.x - st.x0, st.y - st.y0) > 6) st.moved = true;
    if (st.kind === 'key') { press(st, keyAt(st.x, st.y)); return; }
    if (st.kind !== 'gesture') return;
    const g = Array.from(P.values()).filter(s => s.kind === 'gesture');
    if (g.length >= 2 && gesture) {
      const a = P.get(gesture.a), b = P.get(gesture.b);
      if (a && b) { const d = dist(a, b); if (gesture.d0 > 0) rig.zoom(d / gesture.d0); gesture.d0 = d; }
      return;
    }
    if (rig.mode === 'play') rig.pan(dx, canvas.clientWidth);
    else rig.orbit(dx, dy);
  }
  function up(e) {
    const st = P.get(e.pointerId); if (!st) return;
    P.delete(e.pointerId);
    if (st.kind === 'key' && st.key !== null) player.up(st.key, { src: 'user' });
    if (st.kind === 'tapPiano' && !st.moved && I.onTapPiano) I.onTapPiano();
    if (gesture && (gesture.a === e.pointerId || gesture.b === e.pointerId)) gesture = null;
    if (st.kind === 'gesture' && !st.moved && performance.now() - st.t0 < 350) Bus.emit('tapEmpty', st.x, st.y);
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('lostpointercapture', up);
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('wheel', e => { e.preventDefault(); rig.zoom(Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
  // stop iOS from turning a long press into a text selection or a magnifier
  canvas.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturestart', e => e.preventDefault());

  /* ---- computer keyboard: two rows like a little piano, from middle C ---- */
  const MAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ';': 16, "'": 17 };
  const held = new Map();
  I.kbBase = 60;
  window.addEventListener('keydown', e => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || !I.enabled) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === 'z') { I.kbBase = Math.max(24, I.kbBase - 12); return; }
    if (k === 'x') { I.kbBase = Math.min(96, I.kbBase + 12); return; }
    if (!(k in MAP)) return;
    Snd.init();
    const m = I.kbBase + MAP[k];
    if (I.filter && !I.filter(m)) return;
    held.set(k, m); player.down(m, { src: 'user' }); Bus.emit('touch');
  });
  window.addEventListener('keyup', e => { const k = e.key.toLowerCase(); const m = held.get(k); if (m !== undefined) { held.delete(k); player.up(m, { src: 'user' }); } });
  window.addEventListener('blur', () => { for (const st of P.values()) if (st.key !== null) player.up(st.key, { src: 'user' }); P.clear(); held.forEach(m => player.up(m, { src: 'user' })); held.clear(); });

  I.releaseAll = () => { for (const st of P.values()) if (st.key !== null) { player.up(st.key, { src: 'user' }); st.key = null; } };
  return I;
}
