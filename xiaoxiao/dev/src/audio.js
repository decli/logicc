// 动物消消乐 · sound effects and the background tune, all made on the spot with Web Audio (no sound files).
// Notes come from C major pentatonic so a long cascade of pops still sounds like a melody going up.
const Snd = {
  ctx: null, on: true, music: true, master: null, sfx: null, bus: null, mus: null, noiseBuf: null, ducked: false,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 6;
    this.master.connect(comp); comp.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.gain.value = this.on ? 0.8 : 0; this.sfx.connect(this.master);
    this.mus = c.createGain(); this.mus.gain.value = 0; this.mus.connect(this.master);
    this.voice = c.createGain(); this.voice.gain.value = 1; this.voice.connect(this.master);
    // a little room for the cheers
    const len = c.sampleRate * 1.2, ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    this.verb = c.createConvolver(); this.verb.buffer = ir;
    const vg = c.createGain(); vg.gain.value = 0.25; this.verb.connect(vg); vg.connect(this.master);
    const nb = c.createBuffer(1, c.sampleRate, c.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noiseBuf = nb;
    if (c.state === 'suspended') c.resume();
  },
  setOn(v) { this.on = v; if (this.sfx) this.sfx.gain.value = v ? 0.8 : 0; },
  duck(v) { this.ducked = v; if (this.mus) this.mus.gain.setTargetAtTime(this.musicLevel(), this.ctx.currentTime, 0.15); },
  musicLevel() { return this.music && Music.playing ? (this.ducked ? 0.05 : 0.14) : 0; },

  tone(f, dur, o = {}) {
    if (!this.ctx || !this.on) return;
    const c = this.ctx, t = c.currentTime + (o.at || 0);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dur));
    const v = o.vol == null ? 0.3 : o.vol, a = o.att || 0.005;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(o.dest || this.sfx);
    if (o.verb) g.connect(this.verb);
    osc.start(t); osc.stop(t + dur + 0.05);
  },
  noise(dur, o = {}) {
    if (!this.ctx || !this.on) return;
    const c = this.ctx, t = c.currentTime + (o.at || 0);
    const src = c.createBufferSource(); src.buffer = this.noiseBuf; src.loop = true;
    const f = c.createBiquadFilter(); f.type = o.filter || 'bandpass'; f.frequency.setValueAtTime(o.f || 1200, t); f.Q.value = o.q || 1;
    if (o.fto) f.frequency.exponentialRampToValueAtTime(o.fto, t + dur);
    const g = c.createGain(), v = o.vol == null ? 0.2 : o.vol;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.att || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.sfx);
    if (o.verb) g.connect(this.verb);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
  },
  // pentatonic step n (0 = C5) -> Hz
  pent(n) { const steps = [0, 2, 4, 7, 9], o = Math.floor(n / 5), s = ((n % 5) + 5) % 5; return 523.25 * Math.pow(2, (o * 12 + steps[s]) / 12); },

  play(name, k = 0) {
    if (!this.ctx || !this.on) return;
    switch (name) {
      case 'tap': this.tone(880, 0.08, { type: 'triangle', vol: 0.15 }); break;
      case 'select': this.tone(660, 0.1, { type: 'triangle', vol: 0.18, to: 990, glide: 0.08 }); break;
      case 'swap': this.noise(0.16, { f: 600, fto: 2400, q: 0.8, vol: 0.12 }); this.tone(500, 0.12, { type: 'sine', to: 760, vol: 0.08 }); break;
      case 'bad': this.tone(330, 0.14, { type: 'triangle', to: 220, vol: 0.2 }); this.tone(262, 0.18, { type: 'triangle', to: 180, vol: 0.18, at: 0.12 }); break;
      case 'pop': {   // k = cascade step: each one a note higher
        const f = this.pent(k + Math.floor(Math.random() * 2));
        this.tone(f, 0.22, { type: 'sine', vol: 0.22, verb: true });
        this.tone(f * 2, 0.12, { type: 'triangle', vol: 0.06 });
        this.tone(900 + k * 60, 0.07, { type: 'sine', to: 300, vol: 0.12 });
        break;
      }
      case 'pip': this.tone(this.pent(8 + k), 0.06, { type: 'sine', vol: 0.06 }); break;
      case 'land': this.tone(160, 0.06, { type: 'sine', to: 90, vol: 0.05 }); break;
      case 'make': [0, 2, 4, 7].forEach((n, i) => this.tone(this.pent(5 + n), 0.35, { type: 'triangle', vol: 0.12, at: i * 0.05, verb: true })); this.tone(2600, 0.4, { type: 'sine', vol: 0.05, at: 0.2, verb: true }); break;
      case 'stripe':
        this.tone(1800, 0.35, { type: 'sawtooth', to: 140, vol: 0.09 });
        this.noise(0.35, { filter: 'highpass', f: 3000, fto: 600, vol: 0.12 });
        this.tone(2400, 0.25, { type: 'square', to: 600, vol: 0.03, at: 0.03 });
        break;
      case 'bomb':
        this.tone(150, 0.6, { type: 'sine', to: 38, vol: 0.5 });
        this.noise(0.55, { filter: 'lowpass', f: 1800, fto: 120, vol: 0.45, verb: true });
        this.noise(0.12, { filter: 'highpass', f: 2500, vol: 0.15 });
        break;
      case 'zap':
        for (let i = 0; i < 10; i++) this.tone(this.pent(5 + i), 0.18, { type: 'sine', vol: 0.09, at: i * 0.035, verb: true });
        this.noise(0.7, { filter: 'bandpass', f: 4000, fto: 9000, q: 3, vol: 0.08 });
        break;
      case 'nova':
        this.play('bomb');
        for (let i = 0; i < 16; i++) this.tone(this.pent(i), 0.3, { type: 'triangle', vol: 0.08, at: i * 0.04, verb: true });
        break;
      case 'ice': this.noise(0.12, { filter: 'highpass', f: 4000, vol: 0.18 }); this.tone(2200 + Math.random() * 600, 0.18, { type: 'sine', vol: 0.06, verb: true }); break;
      case 'box': this.noise(0.1, { f: 500, q: 2, vol: 0.3 }); this.tone(200, 0.12, { type: 'triangle', to: 120, vol: 0.2 }); this.tone(this.pent(3), 0.2, { type: 'triangle', vol: 0.06, at: 0.06 }); break;
      case 'bub': this.tone(400, 0.09, { type: 'sine', to: 1400, vol: 0.22 }); break;
      case 'home': [0, 2, 4, 5].forEach((n, i) => this.tone(this.pent(5 + n), 0.28, { type: 'triangle', vol: 0.14, at: i * 0.09, verb: true })); break;
      case 'fly': this.tone(this.pent(6 + (k % 6)), 0.08, { type: 'sine', vol: 0.06 }); break;
      case 'goal': this.tone(this.pent(10), 0.25, { type: 'triangle', vol: 0.15, verb: true }); this.tone(this.pent(12), 0.3, { type: 'triangle', vol: 0.12, at: 0.08, verb: true }); break;
      case 'star': this.tone(this.pent(7 + k * 2), 0.6, { type: 'triangle', vol: 0.2, verb: true }); this.tone(this.pent(12 + k * 2), 0.5, { type: 'sine', vol: 0.08, at: 0.03, verb: true }); break;
      case 'win': [0, 2, 4, 5, 7, 10].forEach((n, i) => this.tone(this.pent(n), 0.5, { type: 'triangle', vol: 0.16, at: i * 0.11, verb: true })); this.tone(this.pent(10), 1.1, { type: 'sine', vol: 0.12, at: 0.66, verb: true }); break;
      case 'lose': [4, 3, 2, 0].forEach((n, i) => this.tone(this.pent(n) / 2, 0.4, { type: 'triangle', vol: 0.14, at: i * 0.22, to: this.pent(n) / 2 * 0.97 })); break;
      case 'shuffle': for (let i = 0; i < 8; i++) this.noise(0.08, { f: 1500 + i * 300, q: 3, vol: 0.08, at: i * 0.05 }); break;
      case 'right': this.tone(this.pent(7), 0.15, { type: 'triangle', vol: 0.18 }); this.tone(this.pent(9), 0.3, { type: 'triangle', vol: 0.18, at: 0.1, verb: true }); break;
      case 'wrong': this.tone(220, 0.25, { type: 'triangle', vol: 0.15, to: 190 }); break;
      case 'key': this.tone(700 + k * 30, 0.05, { type: 'sine', vol: 0.1 }); break;
      case 'sparkle': for (let i = 0; i < 5; i++) this.tone(this.pent(10 + Math.floor(Math.random() * 6)), 0.15, { type: 'sine', vol: 0.05, at: i * 0.04, verb: true }); break;
    }
  },
};

// A cheerful little loop: four chords, a walking bass, a marimba melody that changes every bar but repeats every
// eight bars so it is catchy rather than random.
const Music = {
  playing: false, timer: 0, step: 0, next: 0,
  start() {
    if (!Snd.ctx || this.playing) return;
    this.playing = true; this.step = 0; this.next = Snd.ctx.currentTime + 0.1;
    Snd.mus.gain.setTargetAtTime(Snd.musicLevel(), Snd.ctx.currentTime, 0.3);
    const tick = () => { if (!this.playing) return; this.schedule(); this.timer = setTimeout(tick, 60); };
    tick();
  },
  stop() { this.playing = false; clearTimeout(this.timer); if (Snd.mus) Snd.mus.gain.setTargetAtTime(0, Snd.ctx.currentTime, 0.2); },
  refresh() { if (Snd.mus) Snd.mus.gain.setTargetAtTime(Snd.musicLevel(), Snd.ctx.currentTime, 0.2); },
  // C G Am F, sixteenth steps at 112 bpm
  CH: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
  MEL: [[0, 2, 4, -1, 4, -1, 2, 4], [7, -1, 4, 2, 4, -1, -1, -1], [9, -1, 7, 4, 2, -1, 4, -1], [5, 4, 2, -1, 0, -1, -1, -1],
    [4, 4, 7, -1, 9, 7, 4, -1], [7, 9, 11, -1, 7, -1, -1, -1], [9, 7, 9, 12, 11, -1, 9, -1], [7, -1, 5, 4, 2, -1, 0, -1]],
  schedule() {
    const c = Snd.ctx, sp = 60 / 112 / 4;
    while (this.next < c.currentTime + 0.25) {
      const s = this.step, bar = Math.floor(s / 16) % 8, inBar = s % 16, ch = this.CH[bar % 4];
      const t = this.next - c.currentTime;
      const note = (semi, oct) => 261.63 * Math.pow(2, semi / 12 + oct);
      if (inBar % 4 === 0) this.voice(note(ch[0], -1), 0.3, 'sine', 0.22, t);                         // bass
      if (inBar % 4 === 2) this.voice(note(ch[(inBar / 2) % 3], -1) * 2, 0.15, 'triangle', 0.05, t);  // offbeat chord tone
      if (inBar % 2 === 0) { const m = this.MEL[bar][inBar / 2]; if (m >= 0) this.voice(note(m, 0), 0.28, 'triangle', 0.09, t, true); }
      if (inBar % 8 === 4) this.hat(t);
      this.step++; this.next += sp;
    }
  },
  voice(f, dur, type, vol, at, bell) {
    const c = Snd.ctx, t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(Snd.mus);
    if (bell) { const o2 = c.createOscillator(), g2 = c.createGain(); o2.frequency.value = f * 4; g2.gain.setValueAtTime(vol * 0.25, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.08); o2.connect(g2); g2.connect(Snd.mus); o2.start(t); o2.stop(t + 0.1); }
    o.start(t); o.stop(t + dur + 0.02);
  },
  hat(at) {
    const c = Snd.ctx, t = c.currentTime + at, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = Snd.noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(Snd.mus); s.start(t, Math.random() * 0.5); s.stop(t + 0.06);
  },
};
