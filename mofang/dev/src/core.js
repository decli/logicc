// 魔方世界 · small shared helpers: maths, easing, DOM, storage, per-frame tickers and cancellable "scopes"
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => t * t * (3 - 2 * t);
export const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = t => 1 - Math.pow(1 - t, 3);
export const easeIn = t => t * t * t;
export const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const easeOutElastic = t => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1);
export const bounce = t => Math.sin(Math.PI * t) * (1 - t * 0.3);
// frame-rate independent exponential approach: k = how many times per second it closes ~63% of the gap
export const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
export const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
export const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = a => a[(Math.random() * a.length) | 0];
export function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}
export const reducedMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } })();
export const params = new URLSearchParams(location.search);

// Progress and settings in this browser (never throws: private mode, blocked storage, previews)
const KEY = 'logicc.mofang.v1';
export const Store = {
  d: { stars: {}, sound: true, music: true, voice: true, all: false, seen: {}, build: null, skin: 'pic' },
  load() { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (v && typeof v === 'object') Object.assign(this.d, v); } catch (_) { } },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch (_) { } },
  stars(w, i) { return this.d.stars[w + '.' + i] || 0; },
  setStars(w, i, n) { const k = w + '.' + i; if (n > (this.d.stars[k] || 0)) { this.d.stars[k] = n; this.save(); return true; } return false; },
};

// per-frame updaters
const tickers = new Set();
export const Tick = {
  add(fn) { tickers.add(fn); return () => tickers.delete(fn); },
  run(dt, t) { tickers.forEach(f => f(dt, t)); },
};

// A Scope owns everything one screen or one round starts: timers, tweens, tickers and listeners.
// scope.dispose() stops all of it at once, so leaving a round never leaves a stray callback behind.
export class Scope {
  constructor() { this.items = new Set(); this.dead = false; }
  own(stop) { if (this.dead) { stop(); return () => { }; } this.items.add(stop); return () => { if (this.items.delete(stop)) stop(); }; }
  after(sec, fn) { if (this.dead) return () => { }; let id = 0; const stop = this.own(() => clearTimeout(id)); id = setTimeout(() => { stop(); if (!this.dead) fn(); }, sec * 1000); return stop; }
  wait(sec) { return new Promise(res => this.after(sec, res)); }
  tick(fn) { return this.own(Tick.add(fn)); }
  // tween(sec, t => ..., {ease}) -> Promise; resolves at the end (or never, if the scope dies first)
  tween(sec, fn, o = {}) {
    return new Promise(res => {
      if (this.dead) return;
      let t = 0; const ease = o.ease || (x => x);
      if (sec <= 0) { fn(1); res(); return; }
      const stop = this.tick(dt => { t = Math.min(1, t + dt / sec); fn(ease(t)); if (t >= 1) { stop(); res(); } });
    });
  }
  on(target, ev, fn, opt) { target.addEventListener(ev, fn, opt); return this.own(() => target.removeEventListener(ev, fn, opt)); }
  dispose() { this.dead = true; const it = [...this.items]; this.items.clear(); it.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
}
