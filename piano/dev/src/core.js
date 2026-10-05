// 彩虹钢琴 · small shared helpers
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => t * t * (3 - 2 * t);
export const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = t => 1 - Math.pow(1 - t, 3);
export const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
// frame-rate independent exponential approach: k = how many times per second it closes ~63% of the gap
export const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
export const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
export const pick = a => a[(Math.random() * a.length) | 0];
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}
export const later = (ms, fn) => setTimeout(fn, ms);
export const now = () => performance.now() / 1000;

// localStorage that never throws (private mode, blocked storage, previews)
export const Store = {
  get(k, d) { try { const v = localStorage.getItem('piano.' + k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem('piano.' + k, JSON.stringify(v)); } catch (_) { } },
};

// tiny event bus
const subs = {};
export const Bus = {
  on(ev, fn) { (subs[ev] || (subs[ev] = [])).push(fn); return () => { subs[ev] = subs[ev].filter(f => f !== fn); }; },
  emit(ev, ...a) { (subs[ev] || []).slice().forEach(f => f(...a)); },
};

// per-frame updaters
const tickers = new Set();
export const Tick = {
  add(fn) { tickers.add(fn); return () => tickers.delete(fn); },
  run(dt, t) { tickers.forEach(f => f(dt, t)); },
};

export const reducedMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } })();
export const isTouch = (() => { try { return matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window; } catch (_) { return false; } })();
