// 彩虹钢琴 · sound
// Piano: Salamander Grand Piano samples (piano.bin), one every minor third, re-pitched to the
// nearest key, panned by where the key sits as if you were sitting at the instrument, through a
// small hall reverb and a gentle limiter (children press ten keys at once).
// Music box, marimba and the 8-bit "game console" are synthesized live.
import { freq } from './notes.js';
import { clamp } from './core.js';

const AC = window.AudioContext || window.webkitAudioContext;
export const Snd = {
  ctx: null, on: true, ready: false, loaded: 0, total: 30,
  inst: 'piano', sustain: false,
  voices: [],            // active voices, oldest first
};
let master, comp, inBus, dry, wet, revIn, uiBus, duckGain;
const samples = new Map();   // midi -> { buf, off }
let sampleKeys = [];

function makeIR(ctx, secs = 2.6, decay = 3.2) {
  const sr = ctx.sampleRate, n = Math.floor(sr * secs), ir = ctx.createBuffer(2, n, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      // a soft room: early reflections are denser, the tail darker
      const k = 0.18 + 0.6 * t;
      lp = lp + k * ((Math.random() * 2 - 1) - lp);
      d[i] = lp * Math.pow(1 - t, decay) * (i < sr * 0.012 ? i / (sr * 0.012) : 1);
    }
  }
  return ir;
}

Snd.init = function () {
  if (Snd.ctx) { if (Snd.ctx.state !== 'running') Snd.ctx.resume().catch(() => { }); return Snd.ctx; }
  if (!AC) return null;
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) { }   // iPhone ring switch
  const ctx = Snd.ctx = new AC({ latencyHint: 'interactive' });
  comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 14; comp.ratio.value = 5; comp.attack.value = 0.002; comp.release.value = 0.25;
  master = ctx.createGain(); master.gain.value = Snd.on ? 0.95 : 0;
  comp.connect(master); master.connect(ctx.destination); Snd._master = master;
  duckGain = ctx.createGain(); duckGain.connect(comp);
  inBus = ctx.createGain(); inBus.gain.value = 1;
  dry = ctx.createGain(); dry.gain.value = 0.92;
  wet = ctx.createGain(); wet.gain.value = 0.30;
  revIn = ctx.createConvolver(); revIn.buffer = makeIR(ctx);
  inBus.connect(dry); dry.connect(duckGain);
  inBus.connect(revIn); revIn.connect(wet); wet.connect(duckGain);
  uiBus = ctx.createGain(); uiBus.gain.value = 0.5; uiBus.connect(comp);
  if (ctx.state !== 'running') ctx.resume().catch(() => { });
  return ctx;
};
Snd.time = () => (Snd.ctx ? Snd.ctx.currentTime : 0);
// iPad Safari only lets sound start inside a touch: resume and play one silent sample on the first ones
let unlocked = false;
function unlock() {
  const ctx = Snd.ctx; if (!ctx) return;
  if (ctx.state !== 'running') ctx.resume().catch(() => { });
  if (unlocked) return;
  try { const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0); unlocked = true; } catch (_) { }
}
['pointerdown', 'touchend', 'click', 'keydown'].forEach(ev => window.addEventListener(ev, unlock, { capture: true, passive: true }));
Snd.setOn = function (v) { Snd.on = v; if (master) master.gain.setTargetAtTime(v ? 0.95 : 0, Snd.ctx.currentTime, 0.05); };
// voice-over: let the instruments step back a little
Snd.duck = function (v) { if (duckGain) duckGain.gain.setTargetAtTime(v ? 0.55 : 1, Snd.ctx.currentTime, v ? 0.08 : 0.4); };

/* ---------- loading the piano ---------- */
function decode(bytes) {
  return new Promise((res, rej) => { try { const p = Snd.ctx.decodeAudioData(bytes, res, rej); if (p && p.catch) p.catch(rej); } catch (e) { rej(e); } });
}
// MP3 starts with a few milliseconds of encoder padding: find where the note really begins
function onset(buf) {
  const d = buf.getChannelData(0); let peak = 0;
  for (let i = 0; i < Math.min(d.length, 8000); i++) peak = Math.max(peak, Math.abs(d[i]));
  const th = peak * 0.02;
  for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > th) return Math.max(0, i - 24) / buf.sampleRate;
  return 0;
}
Snd.load = async function (base = './', onProgress) {
  if (!Snd.ctx) return;
  const [ix, bin] = await Promise.all([
    fetch(base + 'piano.json').then(r => r.json()),
    fetch(base + 'piano.bin').then(r => r.arrayBuffer()),
  ]);
  Snd.total = ix.n.length;
  // the middle of the keyboard first: that is where children start
  const order = ix.n.slice().sort((a, b) => Math.abs(a[0] - 64) - Math.abs(b[0] - 64));
  for (const [midi, off, len] of order) {
    try {
      const buf = await decode(bin.slice(off, off + len));
      samples.set(midi, { buf, off: onset(buf) });
      sampleKeys = Array.from(samples.keys()).sort((a, b) => a - b);
    } catch (_) { }
    Snd.loaded++;
    if (onProgress) onProgress(Snd.loaded / Snd.total);
  }
  Snd.ready = true;
};

function nearestSample(m) {
  let best = null, bd = 1e9;
  for (const k of sampleKeys) { const d = Math.abs(k - m); if (d < bd) { bd = d; best = k; } }
  return best;
}

/* ---------- voices ---------- */
const MAX_VOICES = 44;
function pan(m) { return clamp((m - 64) / 40, -1, 1) * 0.55; }
function out(m) {
  const ctx = Snd.ctx;
  const g = ctx.createGain();
  if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan(m); g.connect(p); p.connect(inBus); }
  else g.connect(inBus);
  return g;
}
function steal() {
  while (Snd.voices.length >= MAX_VOICES) kill(Snd.voices.shift(), 0.03);
}
function kill(v, t = 0.06) {
  if (v.dead) return; v.dead = true;
  const ctx = Snd.ctx, n = ctx.currentTime;
  try {
    v.g.gain.cancelScheduledValues(n);
    v.g.gain.setValueAtTime(Math.max(0.0001, v.g.gain.value), n);
    v.g.gain.exponentialRampToValueAtTime(0.0001, n + t);
    v.srcs.forEach(s => { try { s.stop(n + t + 0.02); } catch (_) { } });
  } catch (_) { }
  setTimeout(() => { try { v.g.disconnect(); } catch (_) { } }, (t + 0.1) * 1000);
}

const INST = {
  piano(m, vel, when) {
    const ctx = Snd.ctx, root = nearestSample(m);
    if (root === null) return INST.soft(m, vel, when);
    const s = samples.get(root);
    const src = ctx.createBufferSource(); src.buffer = s.buf;
    src.playbackRate.value = Math.pow(2, (m - root) / 12);
    const g = out(m);
    const amp = (0.22 + 0.78 * Math.pow(vel, 1.6)) * 1.4;
    g.gain.setValueAtTime(amp, when);
    src.connect(g); src.start(when, s.off);
    // the strings above E6 have no dampers on a real piano: they ring on
    return { g, srcs: [src], release: m >= 89 ? 2.2 : 0.42, amp };
  },
  // gentle sine pad used for the few hundred ms before the samples arrive
  soft(m, vel, when) {
    const ctx = Snd.ctx, f = freq(m), g = out(m), amp = 0.25 * vel;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o1.type = 'triangle'; o1.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2; g2.gain.value = 0.25;
    o1.connect(g); o2.connect(g2); g2.connect(g);
    g.gain.setValueAtTime(0.0001, when); g.gain.exponentialRampToValueAtTime(amp, when + 0.008); g.gain.exponentialRampToValueAtTime(amp * 0.3, when + 1.2); g.gain.exponentialRampToValueAtTime(0.0001, when + 3.5);
    o1.start(when); o2.start(when); o1.stop(when + 3.6); o2.stop(when + 3.6);
    return { g, srcs: [o1, o2], release: 0.4, amp };
  },
  // a comb tine: the fundamental plus a bright, quickly fading inharmonic "ting"
  musicbox(m, vel, when) {
    const ctx = Snd.ctx, f = freq(m), g = out(m), amp = 0.27 * (0.5 + 0.5 * vel);
    const len = clamp(3.4 - (m - 60) * 0.035, 1.2, 4.5);
    const parts = [[1, 1, len], [2.0, 0.12, len * 0.35], [6.27, 0.32, 0.09], [17.55, 0.08, 0.03]];
    const srcs = [];
    for (const [r, a, d] of parts) {
      if (f * r > 16000) continue;
      const o = ctx.createOscillator(), gg = ctx.createGain();
      o.frequency.value = f * r;
      gg.gain.setValueAtTime(0.0001, when); gg.gain.exponentialRampToValueAtTime(a, when + 0.002); gg.gain.exponentialRampToValueAtTime(0.0001, when + d);
      o.connect(gg); gg.connect(g); o.start(when); o.stop(when + d + 0.05); srcs.push(o);
    }
    g.gain.setValueAtTime(amp, when);
    return { g, srcs, release: len, amp, free: true };
  },
  // a wooden bar: fundamental + 4th partial and a tiny mallet click
  marimba(m, vel, when) {
    const ctx = Snd.ctx, f = freq(m), g = out(m), amp = 0.42 * (0.45 + 0.55 * vel);
    const len = clamp(1.6 - (m - 48) * 0.02, 0.35, 2.2);
    const srcs = [];
    for (const [r, a, d] of [[1, 1, len], [3.93, 0.18, len * 0.12], [9.2, 0.05, 0.03]]) {
      if (f * r > 15000) continue;
      const o = ctx.createOscillator(), gg = ctx.createGain();
      o.frequency.value = f * r;
      gg.gain.setValueAtTime(0.0001, when); gg.gain.exponentialRampToValueAtTime(a, when + 0.003); gg.gain.exponentialRampToValueAtTime(0.0001, when + d);
      o.connect(gg); gg.connect(g); o.start(when); o.stop(when + d + 0.05); srcs.push(o);
    }
    g.gain.setValueAtTime(amp, when);
    return { g, srcs, release: len, amp, free: true };
  },
  // 8-bit: a pulse wave that keeps going while the key is held, with a little vibrato
  chip(m, vel, when) {
    const ctx = Snd.ctx, f = freq(m), g = out(m), amp = 0.11 * (0.6 + 0.4 * vel);
    const o = ctx.createOscillator();
    o.setPeriodicWave(pulse(ctx));
    o.frequency.value = f;
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 5.5; lg.gain.setValueAtTime(0, when); lg.gain.linearRampToValueAtTime(f * 0.012, when + 0.35);
    lfo.connect(lg); lg.connect(o.frequency);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = clamp(f * 9, 1500, 9000);
    o.connect(lp); lp.connect(g);
    g.gain.setValueAtTime(0.0001, when); g.gain.exponentialRampToValueAtTime(amp, when + 0.006); g.gain.exponentialRampToValueAtTime(amp * 0.7, when + 0.12);
    o.start(when); lfo.start(when);
    return { g, srcs: [o, lfo], release: 0.12, amp, hold: true };
  },
};
let pulseWave = null;
function pulse(ctx) {
  if (pulseWave) return pulseWave;
  const n = 40, re = new Float32Array(n), im = new Float32Array(n), duty = 0.25;
  for (let k = 1; k < n; k++) { const a = (2 / (k * Math.PI)) * Math.sin(Math.PI * k * duty); re[k] = a * Math.cos(Math.PI * k * duty); im[k] = a * Math.sin(Math.PI * k * duty); }
  return (pulseWave = ctx.createPeriodicWave(re, im));
}

// start a note; returns an id to stop it later
Snd.noteOn = function (m, vel = 0.75, o = {}) {
  const ctx = Snd.ctx; if (!ctx || !Snd.on) return null;
  const when = Math.max(ctx.currentTime, o.when || 0);
  const inst = o.inst || Snd.inst;
  // re-striking a string: the old sound gives way
  for (const v of Snd.voices) if (v.m === m && !v.dead && v.inst === inst && !v.free) kill(v, 0.09);
  Snd.voices = Snd.voices.filter(v => !v.dead);
  steal();
  const fn = INST[inst] || INST.piano;
  const v = fn(m, clamp(vel, 0.05, 1), when);
  if (o.gain !== undefined) v.g.gain.setValueAtTime(v.amp * o.gain, when);
  Object.assign(v, { m, inst, t0: when, held: true });
  Snd.voices.push(v);
  if (o.dur) Snd.noteOff(v, when + o.dur);
  return v;
};
Snd.noteOff = function (v, when) {
  if (!v || v.dead || !Snd.ctx) return;
  const ctx = Snd.ctx, t = Math.max(ctx.currentTime, when || 0);
  v.held = false;
  if (v.free) return;                         // plucked/struck instruments simply ring out
  if (Snd.sustain && !v.hold) { v.sustained = true; return; }
  release(v, t);
};
function release(v, t) {
  if (v.dead || v.releasing) return; v.releasing = true;
  const rel = v.release;
  try {
    v.g.gain.cancelScheduledValues(t);
    v.g.gain.setTargetAtTime(0.0001, t, rel / 4.5);
    v.srcs.forEach(s => { try { s.stop(t + rel + 0.3); } catch (_) { } });
  } catch (_) { }
  setTimeout(() => { v.dead = true; try { v.g.disconnect(); } catch (_) { } }, ((t - Snd.ctx.currentTime) + rel + 0.5) * 1000);
}
Snd.setSustain = function (on) {
  Snd.sustain = on;
  if (!on && Snd.ctx) { const t = Snd.ctx.currentTime; Snd.voices.forEach(v => { if (v.sustained && !v.held) { v.sustained = false; release(v, t); } }); }
};
Snd.allOff = function () { if (!Snd.ctx) return; Snd.voices.forEach(v => kill(v, 0.15)); Snd.voices = []; };

/* ---------- little interface sounds, all in C major pentatonic so they sit with whatever is played ---------- */
const PENTA = [72, 74, 76, 79, 81, 84, 86, 88];
Snd.ui = function (kind = 'tap', i = 0) {
  const ctx = Snd.ctx; if (!ctx || !Snd.on) return;
  const t = ctx.currentTime;
  const blip = (m, at, a = 0.25, d = 0.18, type = 'sine') => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq(m);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(a, at + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, at + d);
    o.connect(g); g.connect(uiBus); o.start(at); o.stop(at + d + 0.05);
  };
  if (kind === 'tap') blip(PENTA[i % PENTA.length], t, 0.22, 0.14);
  else if (kind === 'open') [0, 1, 2, 3, 4, 5].forEach((k, j) => blip(PENTA[k] - 12, t + j * 0.05, 0.18, 0.5));
  else if (kind === 'close') [5, 3, 1].forEach((k, j) => blip(PENTA[k] - 12, t + j * 0.06, 0.16, 0.3));
  else if (kind === 'pop') { blip(84, t, 0.18, 0.08, 'triangle'); blip(91, t + 0.04, 0.12, 0.1); }
  else if (kind === 'whoosh') {
    const n = ctx.createBufferSource(), b = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate), d = b.getChannelData(0);
    for (let k = 0; k < d.length; k++) d[k] = (Math.random() * 2 - 1) * Math.sin(Math.PI * k / d.length);
    n.buffer = b;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.5);
    const g = ctx.createGain(); g.gain.value = 0.09;
    n.connect(f); f.connect(g); g.connect(uiBus); n.start(t);
  }
};
Snd.chord = function (ms, o = {}) {
  const t = Snd.time() + (o.delay || 0);
  ms.forEach((m, i) => Snd.noteOn(m, o.vel || 0.6, { when: t + i * (o.spread || 0), dur: o.dur || 1.2, inst: o.inst }));
};
