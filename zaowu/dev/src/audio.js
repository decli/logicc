/* =====================================================================
   造物 · sound — everything you hear is synthesised live:
   plucked strings (Karplus–Strong), bells, marimba, flute, music box,
   little voices, birds, wind and rain, and a pad drone underneath.
   Pentatonic scale (宫商角徵羽) so every note agrees with every other.
   Speech has its own channel; music ducks while someone is talking.
   ===================================================================== */
const Snd = (() => {
  let ac = null, master, bus, rev, revIn, dry, analyser, noiseBuf = null, musicBus, sfxBus, voiceGain;
  let on = true, started = false, ducked = false;
  let rainGain, padNodes = [], padGain, padFilt;
  const SCALE = [0, 2, 4, 7, 9];          // 宫 商 角 徵 羽
  const ROOT = 50;                        // D3
  const NAMES = ['宫', '商', '角', '徵', '羽'];
  const ksCache = new Map();
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const degMidi = d => ROOT + Math.floor(d / 5) * 12 + SCALE[((d % 5) + 5) % 5];
  const degFreq = d => mtof(degMidi(d));
  let lastNotes = [];                      // for the x-ray readout

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) { }   // iPhone: play even when the ring switch is on silent
    try { ac = new AC(); } catch (e) { return; }
    master = ac.createGain(); master.gain.value = on ? 1.25 : 0;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = 0.006; comp.release.value = 0.25;
    analyser = ac.createAnalyser(); analyser.fftSize = 1024;
    bus = ac.createGain(); bus.gain.value = 1;
    musicBus = ac.createGain(); musicBus.gain.value = 1; musicBus.connect(bus);
    sfxBus = ac.createGain(); sfxBus.gain.value = 1; sfxBus.connect(bus);
    dry = ac.createGain(); dry.gain.value = 0.85;
    revIn = ac.createGain(); revIn.gain.value = 0.55;
    rev = ac.createConvolver(); rev.buffer = impulse(3.2, 2.6);
    bus.connect(dry); bus.connect(revIn); revIn.connect(rev);
    dry.connect(comp); rev.connect(comp); comp.connect(master); master.connect(analyser); analyser.connect(ac.destination);
    // speech: its own channel, not muted by the sound switch, not ducked
    voiceGain = ac.createGain(); voiceGain.gain.value = 1.15;
    const vComp = ac.createDynamicsCompressor(); vComp.threshold.value = -20; vComp.ratio.value = 3;
    voiceGain.connect(vComp); vComp.connect(analyser);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const rs = ac.createBufferSource(); rs.buffer = noiseBuf; rs.loop = true;
    const rainFilt = ac.createBiquadFilter(); rainFilt.type = 'bandpass'; rainFilt.frequency.value = 2400; rainFilt.Q.value = 0.6;
    rainGain = ac.createGain(); rainGain.gain.value = 0;
    rs.connect(rainFilt); rainFilt.connect(rainGain); rainGain.connect(sfxBus); rs.start();
    started = true;
    document.addEventListener('visibilitychange', () => { if (!ac) return; document.hidden ? ac.suspend() : ac.resume(); });
  }

  function impulse(sec, decay) {
    const sr = ac.sampleRate, n = Math.floor(sr * sec), b = ac.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0;
      for (let i = 0; i < n; i++) { const t = i / n; lp += (Math.random() * 2 - 1 - lp) * (0.9 - 0.6 * t); d[i] = lp * Math.pow(1 - t, decay); }
    }
    return b;
  }

  // Karplus–Strong: a burst of noise circulating in a delay line, averaged each pass.
  function ks(deg, bright = 0.5) {
    const key = deg + ':' + bright;
    if (ksCache.has(key)) return ksCache.get(key);
    const sr = ac.sampleRate, f = degFreq(deg), dur = clamp(2.6 - deg * 0.08, 1.1, 2.6), N = Math.floor(sr * dur);
    const buf = ac.createBuffer(1, N, sr), d = buf.getChannelData(0);
    const P = Math.max(2, Math.round(sr / f)), line = new Float32Array(P);
    let pv = 0; for (let i = 0; i < P; i++) { pv += (Math.random() * 2 - 1 - pv) * (0.3 + bright * 0.6); line[i] = pv; }
    let idx = 0, peak = 0;
    const damp = 0.9985 - deg * 0.00012;
    for (let i = 0; i < N; i++) {
      const a = line[idx], b = line[(idx + 1) % P];
      line[idx] = (a + b) * 0.5 * damp; d[i] = a; idx = (idx + 1) % P;
      if (Math.abs(a) > peak) peak = Math.abs(a);
    }
    const fade = Math.floor(sr * 0.08);
    for (let i = 0; i < N; i++) { d[i] /= peak || 1; if (i > N - fade) d[i] *= (N - i) / fade; }
    ksCache.set(key, buf);
    return buf;
  }

  const live = () => ac && started && ac.state === 'running';
  const ok = () => live() && on;
  function panner(x) { const p = ac.createStereoPanner ? ac.createStereoPanner() : null; if (p) p.pan.value = clamp((x / W) * 2 - 1, -0.9, 0.9) * 0.8; return p; }
  function route(node, x, vol, kind) {
    const g = ac.createGain(); g.gain.value = vol;
    node.connect(g);
    const dest = kind === 'music' ? musicBus : sfxBus;
    const p = x !== undefined ? panner(x) : null;
    if (p) { g.connect(p); p.connect(dest); } else g.connect(dest);
    return g;
  }
  function note(deg) { lastNotes.push({ n: NAMES[((deg % 5) + 5) % 5], t: world.t }); if (lastNotes.length > 8) lastNotes.shift(); }
  const T = when => Math.max(ac.currentTime, when || 0);

  /* ---------- instruments ---------- */
  // 古筝-like pluck (peach trees, genesis)
  function pluck(deg, x, vol = 0.32, bright = 0.5, kind = 'sfx', when) {
    if (!ok()) return;
    const s = ac.createBufferSource(); s.buffer = ks(clamp(deg, -3, 16), bright);
    const t = T(when);
    if (s.detune) { s.detune.setValueAtTime(0, t); s.detune.linearRampToValueAtTime(-28, t + 0.05); s.detune.linearRampToValueAtTime(0, t + 0.22); }
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200 + bright * 3000;
    s.connect(lp); route(lp, x, vol, kind); s.start(t);
    note(deg);
  }
  // temple bell: FM with an inharmonic ratio (pine trees)
  function bell(deg, x, vol = 0.12, when) {
    if (!ok()) return;
    const t = T(when), f = degFreq(deg), car = ac.createOscillator(), mod = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
    car.frequency.value = f; mod.frequency.value = f * 3.5;
    mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 2.2);
    mod.connect(mg); mg.connect(car.frequency);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    car.connect(g); route(g, x, vol, 'music');
    car.start(t); mod.start(t); car.stop(t + 3.3); mod.stop(t + 3.3);
    note(deg);
  }
  // marimba: a woody fundamental plus a quick 4x overtone (maple trees)
  function marimba(deg, x, vol = 0.22, when) {
    if (!ok()) return;
    const t = T(when), f = degFreq(deg);
    [[1, 1, 0.9], [4, 0.35, 0.12], [10, 0.08, 0.04]].forEach(([m, a, d]) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); route(g, x, vol, 'music'); o.start(t); o.stop(t + d + 0.05);
    });
    note(deg);
  }
  // 竹笛-like flute: soft tone, breath noise, gentle vibrato (willow trees, daytime tunes)
  function flute(deg, x, vol = 0.1, dur = 0.5, when) {
    if (!ok()) return;
    const t = T(when), f = degFreq(deg), o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
    o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = f; o2.frequency.value = f * 2;
    lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.012, t + Math.min(0.3, dur * 0.6));
    lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
    const g2 = ac.createGain(); g2.gain.value = 0.12; o2.connect(g2); g2.connect(g); o.connect(g);
    const a = Math.min(0.08, dur * 0.3);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + a); g.gain.setValueAtTime(1, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
    route(g, x, vol, 'music');
    // breath
    const n = ac.createBufferSource(); n.buffer = noiseBuf; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 2;
    const ng = ac.createGain(); ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(0.25, t + a); ng.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(bp); bp.connect(ng); route(ng, x, vol * 0.5, 'music');
    [o, o2, lfo].forEach(s => { s.start(t); s.stop(t + dur + 0.3); }); n.start(t, rand(0, 1)); n.stop(t + dur + 0.1);
    note(deg);
  }
  // music box: bright tine with a metallic partial (ginkgo trees, lullabies)
  function musicbox(deg, x, vol = 0.12, when) {
    if (!ok()) return;
    const t = T(when), f = degFreq(deg);
    [[1, 1, 1.6], [2.76, 0.25, 0.4], [5.4, 0.08, 0.15]].forEach(([m, a, d]) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); route(g, x, vol, 'music'); o.start(t); o.stop(t + d + 0.05);
    });
    note(deg);
  }
  const INSTRUMENT = { peach: 'pluck', pine: 'bell', maple: 'marimba', willow: 'flute', ginkgo: 'musicbox' };
  function play(inst, deg, x, vol, when) {
    if (inst === 'bell') bell(deg - 2, x, (vol || 0.13) * 0.9, when);
    else if (inst === 'marimba') marimba(deg, x, (vol || 0.13) * 1.5, when);
    else if (inst === 'flute') flute(deg + 2, x, (vol || 0.13) * 0.8, 0.55, when);
    else if (inst === 'musicbox') musicbox(deg + 5, x, (vol || 0.13) * 0.9, when);
    else pluck(deg, x, vol || 0.13, 0.55, 'music', when);
  }

  // a round little "boop" — the creatures' voice
  function boop(freq, x, vol = 0.16, len = 0.18, slide = 1.25) {
    if (!ok()) return;
    const t = ac.currentTime, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o2.type = 'triangle';
    o.frequency.setValueAtTime(freq * 0.78, t); o.frequency.exponentialRampToValueAtTime(freq * slide, t + 0.05); o.frequency.exponentialRampToValueAtTime(freq, t + len);
    o2.frequency.setValueAtTime(freq * 1.56, t); o2.frequency.exponentialRampToValueAtTime(freq * 2 * slide, t + 0.05);
    const g2 = ac.createGain(); g2.gain.value = 0.18;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); o2.connect(g2); g2.connect(g); route(g, x, vol);
    o.start(t); o2.start(t); o.stop(t + len + 0.05); o2.stop(t + len + 0.05);
  }

  // babble: one blip per character, with a formant filter (used when speech is off or busy)
  function talk(text, baseDeg, x, vol = 0.12) {
    if (!ok()) return;
    const n = Math.min([...text].length, 8), t0 = ac.currentTime;
    const formants = [520, 780, 1150, 1600, 2300];
    for (let i = 0; i < n; i++) {
      const t = t0 + i * 0.085, f = degFreq(baseDeg + pick([0, 1, 2, -1, 3])) * 2;
      const o = ac.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * rand(0.85, 1.15), t + 0.07);
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = pick(formants); bp.Q.value = 4;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
      o.connect(bp); bp.connect(g); route(g, x, vol * 1.6);
      o.start(t); o.stop(t + 0.09);
    }
  }

  function chirp(x, vol = 0.05) {
    if (!ok()) return;
    const t0 = ac.currentTime, reps = randi(1, 3), base = rand(2600, 3600);
    for (let i = 0; i < reps; i++) {
      const t = t0 + i * 0.11, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(base, t); o.frequency.exponentialRampToValueAtTime(base * 1.45, t + 0.035); o.frequency.exponentialRampToValueAtTime(base * 0.9, t + 0.08);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);
      o.connect(g); route(g, x, vol); o.start(t); o.stop(t + 0.1);
    }
  }
  // 布谷: the cuckoo's two falling notes, morning only
  function cuckoo(x, vol = 0.07) {
    if (!ok()) return;
    const t0 = ac.currentTime, reps = randi(2, 3);
    for (let r = 0; r < reps; r++) [[740, 0], [590, 0.32]].forEach(([f, dt]) => {
      const t = t0 + r * 0.9 + dt, o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(f * 1.03, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.03); g.gain.setValueAtTime(1, t + 0.16); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
      o.connect(g); g.connect(lp); route(lp, x, vol, 'music'); o.start(t); o.stop(t + 0.32);
    });
  }
  // an owl: two soft, breathy hoots
  function owl(x, vol = 0.07) {
    if (!ok()) return;
    const t0 = ac.currentTime;
    [[0, 0.35, 392], [0.55, 0.7, 370]].forEach(([dt, len, f]) => {
      const t = t0 + dt, o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f * 0.94, t); o.frequency.linearRampToValueAtTime(f, t + 0.08); o.frequency.linearRampToValueAtTime(f * 0.92, t + len);
      lfo.frequency.value = 7; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.06); g.gain.setValueAtTime(0.9, t + len * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); route(g, x, vol, 'music'); [o, lfo].forEach(s => { s.start(t); s.stop(t + len + 0.05); });
    });
    noiseHit(x, vol * 0.4, 'bandpass', 700, 500, 0.9, 3);
  }

  function noiseHit(x, vol, type, f0, f1, len, q = 0.8) {
    if (!ok()) return;
    const t = ac.currentTime, s = ac.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = rand(0.8, 1.2);
    const fl = ac.createBiquadFilter(); fl.type = type; fl.Q.value = q;
    fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + len);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + Math.min(0.08, len * 0.3)); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(fl); fl.connect(g); route(g, x, vol); s.start(t, rand(0, 1)); s.stop(t + len + 0.05);
  }

  function thump(freq, vol, len) {
    if (!ok()) return;
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq * 2.2, t); o.frequency.exponentialRampToValueAtTime(freq, t + 0.08); o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + len);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); route(g, undefined, vol); o.start(t); o.stop(t + len + 0.05);
  }

  function crack(n) { noiseHit(W / 2, 0.22 + n * 0.08, 'highpass', 2600, 5200, 0.09, 0.7); thump(52 + n * 8, 0.5, 0.5); }

  function genesis() {
    if (!ok()) return;
    thump(38, 0.9, 3.2);
    noiseHit(W / 2, 0.35, 'lowpass', 1800, 90, 2.6, 0.5);
    noiseHit(W / 2, 0.12, 'bandpass', 600, 5200, 3.4, 1.2);
    const t0 = ac.currentTime;
    [0, 3, 5, 7, 9, 12].forEach((d, i) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = i % 2 ? 'triangle' : 'sine';
      o.frequency.value = degFreq(d + 3);
      const t = t0 + 0.4 + i * 0.28;
      g.gain.setValueAtTime(0.0001, t0); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 1.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);
      o.connect(g); route(g, W * (0.2 + i * 0.12), 0.07, 'music'); o.start(t0); o.stop(t + 6);
    });
    setTimeout(() => [5, 7, 9, 10, 12].forEach((d, i) => setTimeout(() => pluck(d, W * (0.2 + i * 0.15), 0.22, 0.7), i * 140)), 1600);
  }

  function cricket(x, vol = 0.018) {
    if (!ok()) return;
    const t0 = ac.currentTime, f = rand(4200, 5200), n = randi(3, 5);
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0);
    for (let i = 0; i < n; i++) { const t = t0 + i * 0.045; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.006); g.gain.linearRampToValueAtTime(0, t + 0.03); }
    o.connect(g); route(g, x, vol); o.start(t0); o.stop(t0 + n * 0.045 + 0.05);
  }
  function chime(vol = 0.1) { if (!ok()) return; const d = randi(10, 14); pluck(d, rand(W), vol, 0.9); setTimeout(() => pluck(d + 2, rand(W), vol * 0.7, 0.9), 120); }
  function sparkle(x, n = 4, base = 8, vol = 0.12) { for (let i = 0; i < n; i++) setTimeout(() => pluck(base + i * 1 + randi(0, 1), x, vol, 0.85), i * 70); }
  function whoosh(x, strength) { noiseHit(x, 0.12 + strength * 0.2, 'bandpass', 400, 2200, 0.7 + strength * 0.5, 1.2); }
  function pop(x, vol = 0.12) { boop(rand(900, 1300), x, vol, 0.08, 1.6); }
  function rustle(x) { noiseHit(x, 0.16, 'bandpass', 3000, 1600, 0.5, 0.9); setTimeout(() => noiseHit(x, 0.1, 'bandpass', 2600, 1400, 0.4, 0.9), 160); }
  function chomp(x) { noiseHit(x, 0.14, 'lowpass', 1400, 400, 0.09, 1); setTimeout(() => noiseHit(x, 0.12, 'lowpass', 1200, 300, 0.09, 1), 150); setTimeout(() => boop(330, x, 0.1, 0.16, 1.1), 300); }
  function jingle() { if (!ok()) return; const t0 = ac.currentTime + 0.02;[5, 7, 8, 10, 12].forEach((d, i) => musicbox(d + 3, W / 2, 0.14, t0 + i * 0.09)); bell(10, W / 2, 0.06, t0 + 0.5); }
  function catchFly(n) { if (!ok()) return; musicbox(8 + (n % 6), W * 0.1, 0.13); }
  function rain(level) { if (!ac || !rainGain) return; rainGain.gain.setTargetAtTime(on ? level * 0.12 : 0, ac.currentTime, 0.4); }

  // pad: a soft drone that walks between open, pentatonic chords
  const CHORDS = [[0, 3, 7], [-1, 2, 5], [1, 4, 8], [0, 3, 7], [-2, 3, 6], [3, 6, 9]];
  let chordIdx = 0;
  function startPad() {
    if (!ac || padGain) return;
    padGain = ac.createGain(); padGain.gain.value = 0;
    padFilt = ac.createBiquadFilter(); padFilt.type = 'lowpass'; padFilt.frequency.value = 700; padFilt.Q.value = 0.4;
    padGain.connect(padFilt); padFilt.connect(musicBus);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const o = ac.createOscillator(); o.type = 'sawtooth'; o.detune.value = j ? 7 : -7;
      o.frequency.value = degFreq(CHORDS[0][i] - 5);
      const g = ac.createGain(); g.gain.value = 0.03;
      o.connect(g); g.connect(padGain); o.start();
      padNodes.push({ o, i });
    }
    padGain.gain.setTargetAtTime(1, ac.currentTime, 3);
  }
  function stepPad(night) {
    if (!padGain) return;
    chordIdx = (chordIdx + 1) % CHORDS.length;
    const ch = CHORDS[chordIdx], t = ac.currentTime;
    for (const p of padNodes) p.o.frequency.setTargetAtTime(degFreq(ch[p.i] - 5), t, 1.2);
    padFilt.frequency.setTargetAtTime(lerp(900, 420, night), t, 2);
    padGain.gain.setTargetAtTime(lerp(0.9, 0.5, night), t, 2);
  }

  /* ---------- tunes ---------- */
  // a short flute phrase that wanders over the scale, timed to the world's clock
  function flutePhrase(x) {
    if (!ok()) return 0;
    const RH = [[1, 1, 2], [2, 1, 1], [1, 1, 1, 1, 4], [3, 1, 2, 2], [2, 2, 4], [1, 1, 2, 1, 1, 2]];
    let deg = randi(5, 9), t = ac.currentTime + 0.05, beats = 0;
    const n = randi(2, 3), tick = Clock.TICK;
    for (let k = 0; k < n; k++) for (const d of pick(RH)) {
      flute(deg, x, 0.085, d * tick * 0.95, t);
      t += d * tick; beats += d;
      deg = clamp(deg + pick([-2, -1, -1, 1, 1, 2, 0]), 3, 11);
    }
    flute(pick([5, 7, 8]), x, 0.085, 4 * tick, t);
    return (t - ac.currentTime + 4 * tick) * 1000;
  }
  // an original lullaby for the music box, in the same five notes (jianpu, 1 = D)
  const LULLABY = '3 5 6 5|3 2 1 -|2 3 5 3|2 - - -|3 5 6 1\'|6 5 3 -|2 3 2 1|6. - 1 -|3 5 6 5|3 2 1 -|2 3 2 6.|1 - - -';
  function lullaby() {
    if (!ok()) return;
    const map = { '1': 0, '2': 1, '3': 2, '5': 3, '6': 4, "1'": 5, '6.': -1, '5.': -2 };
    const notes = []; LULLABY.split('|').forEach(bar => bar.trim().split(/\s+/).forEach(tok => { if (tok === '-') { if (notes.length) notes[notes.length - 1].d++; } else notes.push({ g: map[tok], d: 1 }); }));
    let t = ac.currentTime + 0.1; const beat = 0.62;
    for (const n of notes) { musicbox(n.g + 10, W * 0.5, 0.075, t); if (n.d > 1) musicbox(n.g + 5, W * 0.5, 0.035, t); t += n.d * beat; }
  }

  // talking pushes the music down so words stay clear
  function duck(v) {
    if (!musicBus || ducked === v) return; ducked = v;
    const t = ac.currentTime;
    musicBus.gain.setTargetAtTime(v ? 0.32 : 1, t, v ? 0.08 : 0.5);
    sfxBus.gain.setTargetAtTime(v ? 0.7 : 1, t, v ? 0.08 : 0.5);
  }
  // a voice clip from the speech bank
  function voiceOut(buffer, rate, x) {
    if (!live()) return null;
    const s = ac.createBufferSource(); s.buffer = buffer; s.playbackRate.value = rate || 1;
    const p = x !== undefined ? panner(x) : null;
    if (p) { p.pan.value *= 0.5; s.connect(p); p.connect(voiceGain); } else s.connect(voiceGain);
    s.start();
    return s;
  }

  function setOn(v) {
    on = v;
    if (master) master.gain.setTargetAtTime(v ? 1.25 : 0, ac.currentTime, 0.08);
    if (v && ac) init();
  }

  return {
    init, setOn, get on() { return on; }, get running() { return ok(); }, get live() { return live(); }, get ctx() { return ac; },
    pluck, bell, marimba, flute, musicbox, play, INSTRUMENT, boop, talk, chirp, cuckoo, owl, crack, cricket, genesis, chime, sparkle, whoosh, pop, rustle, chomp, jingle, catchFly, rain, thump, noiseHit,
    startPad, stepPad, flutePhrase, lullaby, duck, voiceOut, degFreq, NAMES,
    get analyser() { return analyser; }, get lastNotes() { return lastNotes; },
  };
})();

/* the world's clock: eighth notes at 76 bpm. Creatures hop and trees sing on these ticks. */
const Clock = (() => {
  const BPM = 76, TICK = 60 / BPM / 2;
  let acc = 0, n = 0; const subs = [];
  return {
    TICK, get n() { return n; },
    on(fn) { subs.push(fn); },
    update(dt) { acc += dt; while (acc >= TICK) { acc -= TICK; n++; for (const f of subs) f(n); } },
  };
})();
