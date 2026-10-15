// 动物消消乐 · small helpers shared by everything: DOM, maths, the game clock, saved progress.
'use strict';
const $ = (q, r) => (r || document).querySelector(q);
const $$ = (q, r) => [...(r || document).querySelectorAll(q)];
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const Ease = {
  out: k => 1 - (1 - k) * (1 - k),
  in: k => k * k,
  inOut: k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  back: k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  elastic: k => (k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (2 * Math.PI / 3)) + 1),
};

// The game clock only moves while frames are drawn, so a hidden tab or the pause card freezes every animation and wait.
const Clock = {
  now: 0, paused: false, jobs: [],
  tick(dt) {
    if (this.paused) return;
    this.now += dt;
    const due = this.jobs;
    this.jobs = [];
    for (const j of due) {
      const k = j.dur > 0 ? clamp((this.now - j.t0) / j.dur, 0, 1) : 1;
      if (j.fn) j.fn(j.ease ? j.ease(k) : k, k);
      if (k >= 1) j.res(); else this.jobs.push(j);
    }
  },
  // run fn(easedK, k) every frame for dur ms; resolves when done
  tween(dur, fn, ease) { return new Promise(res => this.jobs.push({ t0: this.now, dur, fn, ease, res })); },
  wait(ms) { return this.tween(ms, null); },
  // drop everything still running without resolving it, so a turn that was playing when the level was left just stops
  clear() { this.jobs = []; },
};

// Saved on this device: progress, the math settings, the record of math pages.
const Store = {
  key: 'logicc.xiaoxiao.v1',
  d: null,
  defaults() {
    return {
      open: 1,               // highest level that can be played
      stars: {}, best: {},   // per level
      owed: false,           // a math page is due before the next game
      played: 0,
      math: { max: 20, ops: 2, mode: 'mix', count: 20 },
      log: [],               // finished math pages: [time, count, right first time, seconds, settings label]
      seen: {},              // tips already shown
      snd: true, voi: true, mus: true,
    };
  },
  load() {
    this.d = this.defaults();
    try {
      // first visit: follow 思维小画本's sound switches
      const home = JSON.parse(localStorage.getItem('logicc.design.v2') || 'null');
      if (home) { if (typeof home.snd === 'boolean') this.d.snd = home.snd; if (typeof home.voi === 'boolean') this.d.voi = home.voi; if (typeof home.mus === 'boolean') this.d.mus = home.mus; }
      const raw = JSON.parse(localStorage.getItem(this.key) || 'null');
      if (raw) { Object.assign(this.d, raw); this.d.math = Object.assign(this.defaults().math, raw.math || {}); }
    } catch (e) { }
    return this.d;
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { } },
};
