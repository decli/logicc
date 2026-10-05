// 彩虹钢琴 · one place where a key goes down: sound, the key moving, light, recording, and whoever listens
import * as THREE from 'three';
import { Snd } from './audio.js';
import { colorOf, LOW, HIGH, K } from './notes.js';
import { Bus } from './core.js';

export function buildPlayer(ctx) {
  const { piano, fx, stage, rig } = ctx;
  const down = new Map();        // midi -> { srcs: Set, voice }
  const pos = new THREE.Vector3();
  let recording = null;

  // light that follows the camera: in the close-up view a key is big on screen, so the effects shrink a little
  const fxScale = () => (rig.mode === 'play' ? Math.max(0.55, Math.min(1.25, rig.span / 16)) : 1.25);

  const P = {
    isDown: m => down.has(m),
    // src: 'user' | 'auto' | 'acc' (accompaniment) | 'echo'
    down(m, o = {}) {
      if (m < LOW || m > HIGH) return;
      const src = o.src || 'user';
      let d = down.get(m);
      if (!d) { d = { srcs: new Set(), voice: null }; down.set(m, d); }
      d.srcs.add(src);
      const vel = o.vel ?? 0.78;
      if (o.sound !== false) d.voice = Snd.noteOn(m, vel, { inst: o.inst, gain: o.gain });
      const col = colorOf(m);
      piano.press(m, true, col);
      const sc = fxScale();
      fx.noteOn(m, piano.keyTop(m, pos), { vel, scale: o.fxScale ?? sc, name: o.name, sparks: src === 'acc' ? 0.3 : 1 });
      stage.tint(col, src === 'acc' ? 0.3 : 1);
      if (recording && src === 'user') recording.ev.push([performance.now() - recording.t0, m, 1]);
      Bus.emit('note', m, src, vel);
    },
    up(m, o = {}) {
      const d = down.get(m); if (!d) return;
      const src = o.src || 'user';
      d.srcs.delete(src);
      if (d.srcs.size) return;
      down.delete(m);
      if (d.voice) Snd.noteOff(d.voice);
      piano.press(m, false);
      fx.noteOff(m);
      if (recording && src === 'user') recording.ev.push([performance.now() - recording.t0, m, 0]);
      Bus.emit('noteup', m, src);
    },
    // a whole note with a length, for songs played by the piano itself
    tap(m, dur, o = {}) {
      P.down(m, o);
      setTimeout(() => P.up(m, { src: o.src }), Math.max(60, dur * 1000));
    },
    allUp(src) { for (const [m, d] of Array.from(down)) { if (!src || d.srcs.has(src)) { d.srcs.clear(); down.set(m, d); P.up(m, { src: 'x' }); } } },
    // recording what the child plays, to hear it back on the self-playing piano
    record(on) {
      if (on) { recording = { t0: performance.now(), ev: [] }; return null; }
      const r = recording; recording = null; return r;
    },
    get recording() { return !!recording; },
  };
  return P;
}
