// 五子棋 · sounds made on the spot with Web Audio: a stone on wood, a little chime for a warning, a fanfare for a win
const Snd = {
  ctx: null, on: true, master: null, sfx: null, voice: null, noise: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.gain.value = this.on ? 0.8 : 0; this.sfx.connect(this.master);
    this.voice = c.createGain(); this.voice.gain.value = 1; this.voice.connect(this.master);
    const nb = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate), d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
    this.noise = nb;
    if (c.state === 'suspended') c.resume();
  },
  setOn(v) { this.on = v; if (this.sfx) this.sfx.gain.value = v ? 0.8 : 0; },
  duck() { },
  tone(f, dur, o = {}) {
    if (!this.ctx || !this.on) return;
    const c = this.ctx, t = c.currentTime + (o.at || 0), osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const v = o.vol == null ? 0.25 : o.vol;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.connect(g); g.connect(this.sfx); osc.start(t); osc.stop(t + dur + 0.05);
  },
  // a stone set down on the board: a short knock of wood, a little higher for white
  stone(c) {
    if (!this.ctx || !this.on) return;
    const x = this.ctx, t = x.currentTime, src = x.createBufferSource(), bp = x.createBiquadFilter(), g = x.createGain();
    src.buffer = this.noise; bp.type = 'bandpass'; bp.frequency.value = c === 2 ? 2600 : 2100; bp.Q.value = 3;
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(bp); bp.connect(g); g.connect(this.sfx); src.start(t);
    this.tone(c === 2 ? 330 : 260, 0.14, { vol: 0.35, to: c === 2 ? 220 : 170 });
  },
  play(name) {
    const T = (f, d, o) => this.tone(f, d, o);
    if (name === 'tap') T(660, 0.08, { vol: 0.15, type: 'triangle' });
    else if (name === 'warn') { T(880, 0.18, { vol: 0.18, type: 'triangle' }); T(660, 0.25, { vol: 0.18, type: 'triangle', at: 0.16 }); }
    else if (name === 'good') [784, 988, 1175].forEach((f, k) => T(f, 0.18, { vol: 0.16, type: 'triangle', at: k * 0.07 }));
    else if (name === 'hint') [1047, 1319, 1568, 2093].forEach((f, k) => T(f, 0.2, { vol: 0.1, at: k * 0.06 }));
    else if (name === 'win') [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, k) => T(f, 0.3, { vol: 0.2, type: 'triangle', at: k * 0.11 }));
    else if (name === 'lose') [523, 466, 392, 330].forEach((f, k) => T(f, 0.32, { vol: 0.16, type: 'triangle', at: k * 0.16 }));
    else if (name === 'undo') T(500, 0.14, { vol: 0.14, to: 330, type: 'triangle' });
  },
};
