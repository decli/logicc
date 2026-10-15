// 动物消消乐 · sound effects, made on the spot with Web Audio, and the recorded sounds in sound/ (decli's background
// music and English cheers). Notes come from C major pentatonic so a long cascade of pops still sounds like a melody going up.
const Snd = {
  ctx: null, on: true, music: true, master: null, sfx: null, bus: null, mus: null, noiseBuf: null, ducked: false,
  raw: {}, bufs: {},
  // fetch the recorded sounds; they are decoded once sound is allowed (the first touch)
  load(names) {
    if (!window.fetch || location.protocol === 'file:') return;
    names.forEach(n => fetch(`sound/${n}.mp3`).then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
      .then(ab => { this.raw[n] = ab; this.decode(n); }).catch(() => { }));
  },
  decode(n) {
    const ab = this.raw[n];
    if (!this.ctx || !ab) return;
    delete this.raw[n];
    new Promise((res, rej) => { const q = this.ctx.decodeAudioData(ab, res, rej); if (q && q.catch) q.catch(rej); })
      .then(b => { this.bufs[n] = b; Music.sync(); }).catch(() => { });
  },
  clip(n) { return this.bufs[n] || null; },
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
    Object.keys(this.raw).forEach(n => this.decode(n));
  },
  setOn(v) { this.on = v; if (this.sfx) this.sfx.gain.value = v ? 0.8 : 0; },
  duck(v) { this.ducked = v; if (this.mus) this.mus.gain.setTargetAtTime(this.musicLevel(), this.ctx.currentTime, 0.15); },
  musicLevel() { return this.music && Music.playing ? (this.ducked ? 0.36 : 0.6) : 0; },

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
      // the blind box (gift.js): landing, each tap (k = 1-3, higher each time), bursting open, and a rare friend
      case 'gland': this.tone(150, 0.3, { type: 'sine', to: 70, vol: 0.35 }); this.noise(0.14, { f: 320, q: 1, vol: 0.22 }); this.tone(this.pent(4), 0.25, { type: 'triangle', vol: 0.1, at: 0.06, verb: true }); break;
      case 'gtap':
        this.noise(0.12, { f: 1600 + k * 500, q: 1.2, vol: 0.22 }); this.tone(220 + k * 40, 0.1, { type: 'triangle', to: 140, vol: 0.18 });
        this.tone(this.pent(5 + k * 2), 0.22, { type: 'triangle', vol: 0.16, at: 0.04, verb: true }); this.tone(this.pent(8 + k * 2), 0.25, { type: 'sine', vol: 0.08, at: 0.08, verb: true }); break;
      case 'gopen':
        this.noise(0.4, { f: 700, fto: 7000, q: 0.7, vol: 0.3 }); this.tone(110, 0.35, { type: 'sine', to: 55, vol: 0.3 });
        [0, 2, 4, 5, 7, 9, 10, 12].forEach((n, i) => this.tone(this.pent(5 + n), 0.45, { type: 'triangle', vol: 0.13, at: 0.08 + i * 0.05, verb: true }));
        this.tone(this.pent(17), 1.3, { type: 'sine', vol: 0.06, at: 0.5, verb: true }); break;
      case 'grare': [0, 2, 4, 5, 7, 9].forEach((n, i) => this.tone(this.pent(12 + n), 0.9, { type: 'sine', vol: 0.06, at: 0.55 + i * 0.07, verb: true })); break;
      case 'sparkle': for (let i = 0; i < 5; i++) this.tone(this.pent(10 + Math.floor(Math.random() * 6)), 0.15, { type: 'sine', vol: 0.05, at: i * 0.04, verb: true }); break;
    }
  },
};

// The background music: decli's two cheerful tunes, sound/bg1.mp3 and sound/bg2.mp3, one after the other. decli: it
// keeps playing all through the game (map, levels, cards, the blind box) and stops only for the pause card and the
// math page; the narrator turns it down a little while speaking. Each tune crossfades into the next, so there is no
// gap or click at the seam, and starting it while it plays changes nothing.
const Music = {
  want: false, order: ['bg1', 'bg2'], cur: null, timer: 0, X: 0.8,
  get playing() { return this.want; },
  start() {
    this.want = true;
    this.sync();
    if (Snd.mus) Snd.mus.gain.setTargetAtTime(Snd.musicLevel(), Snd.ctx.currentTime, 0.3);
  },
  stop() {
    this.want = false; clearTimeout(this.timer);
    const o = this.cur; this.cur = null;
    if (!o || !Snd.ctx) return;
    const now = Snd.ctx.currentTime;
    o.g.gain.cancelScheduledValues(now); o.g.gain.setValueAtTime(Math.max(0.0001, o.g.gain.value), now); o.g.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    try { o.src.stop(now + 0.55); } catch (_) { }
  },
  refresh() { if (Snd.mus) Snd.mus.gain.setTargetAtTime(Snd.musicLevel(), Snd.ctx.currentTime, 0.2); },
  // start the first tune that has been decoded, if none is playing yet (called again when a tune finishes decoding)
  sync() {
    const c = Snd.ctx, name = this.order.find(n => Snd.clip(n));
    if (!c || !this.want || this.cur || !name) return;
    this.loop(name, c.currentTime + 0.05, 0.6);
  },
  loop(name, at, fadeIn) {
    const c = Snd.ctx, X = this.X, buf = Snd.clip(name), src = c.createBufferSource(), g = c.createGain(), end = at + buf.duration;
    src.buffer = buf; src.connect(g); g.connect(Snd.mus);
    g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(1, at + fadeIn);
    g.gain.setValueAtTime(1, end - X); g.gain.linearRampToValueAtTime(0.0001, end);
    src.start(at); src.stop(end + 0.05);
    const me = this.cur = { name, src, g };
    clearTimeout(this.timer);
    // the other tune next (the same one again if the other has not loaded)
    const other = this.order[(this.order.indexOf(name) + 1) % this.order.length];
    this.timer = setTimeout(() => { if (this.cur === me) this.loop(Snd.clip(other) ? other : name, Math.max(c.currentTime + 0.05, end - X), X); }, Math.max(0, (end - X - c.currentTime - 0.5) * 1000));
  },
};
