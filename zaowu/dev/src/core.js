'use strict';
/* =====================================================================
   造物 · core — math helpers, noise, canvas, shared world state
   ===================================================================== */
const $ = s => document.querySelector(s);
const TAU = Math.PI * 2;
const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeOutCubic = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const easeInCubic = t => { t = clamp(t, 0, 1); return t * t * t; };
const easeInOut = t => { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const easeOutBack = t => { t = clamp(t, 0, 1); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const hypot = Math.hypot;
const SERIF = '"Noto Serif SC","Songti SC","STSong",serif';
const BRUSH = '"Ma Shan Zheng","STKaiti","KaiTi",serif';
const MONO = 'ui-monospace,"SF Mono",Menlo,Consolas,monospace';
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }

/* ---------- simplex noise (Gustavson) ---------- */
const noise2 = (() => {
  const g = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
  const r = mulberry32(20261002), perm = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const p = new Uint8Array(512); for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  return function (xin, yin) {
    const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s);
    const t = (i + j) * G2, x0 = xin - (i - t), y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n = 0, tt;
    tt = 0.5 - x0 * x0 - y0 * y0; if (tt > 0) { const q = g[p[ii + p[jj]] & 7]; tt *= tt; n += tt * tt * (q[0] * x0 + q[1] * y0); }
    tt = 0.5 - x1 * x1 - y1 * y1; if (tt > 0) { const q = g[p[ii + i1 + p[jj + j1]] & 7]; tt *= tt; n += tt * tt * (q[0] * x1 + q[1] * y1); }
    tt = 0.5 - x2 * x2 - y2 * y2; if (tt > 0) { const q = g[p[ii + 1 + p[jj + 1]] & 7]; tt *= tt; n += tt * tt * (q[0] * x2 + q[1] * y2); }
    return 70 * n;
  };
})();

/* ---------- colour helpers: colours are [r,g,b] 0..255 ---------- */
const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
function hsl2rgb(h, s, l) {
  s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/* fonts load without blocking the first frame (and the page still works if the font host is unreachable) */
(() => { try { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600&display=swap'; document.head.appendChild(l); } catch (_) { } })();

/* ---------- canvas ---------- */
const cvs = $('#world');
const ctx = cvs.getContext('2d');
const fg = document.createElement('canvas');          // foreground layer: ground + life, tinted by daylight
const fctx = fg.getContext('2d');
let W = 0, H = 0, DPR = 1, U = 1;                       // U: the world's length unit (≈ short side)
let GROUND = 0;                                         // mean ground height in px
let maxDPR = Math.min(window.devicePixelRatio || 1, 2);

function groundY(x) { return GROUND + U * 0.022 * noise2(x * 0.0028 / Math.max(U / 700, 0.6), 3.7) + U * 0.008 * noise2(x * 0.011, 9.1); }

/* ---------- world state ---------- */
const world = {
  t: 0,              // seconds since load
  dt: 1 / 60,
  time: 0.25,        // time of day 0..1 (0 = midnight, .5 = noon)
  daySpeed: 1 / 210, // a full day lasts 3.5 minutes unless you drag the sun
  phase: 'chaos',    // chaos -> genesis -> world
  reveal: 0,         // 0..1 how much of the world exists (genesis)
  wind: 0.25,        // ambient breeze
  gust: 0,           // user gust, signed
  xray: false,
  pointer: { x: -9999, y: -9999, down: false, active: false, vx: 0, vy: 0, t: 0 },
  trees: [], creatures: [], flowers: [], clouds: [], drops: [], sparks: [], petals: [],
  birds: [], flies: [], bubbles: [], streaks: [], shooting: [],
  rainbow: { a: 0, life: 0 },
  stats: { fps: 60, frames: 0, acc: 0 },
  // sky state (written by Sky.update)
  sky: { top: [0, 0, 0], mid: [0, 0, 0], bot: [0, 0, 0], tint: [0, 0, 0], tintA: 0, stars: 1, night: 1, sun: { x: 0, y: 0, up: 0 }, moon: { x: 0, y: 0, up: 0 } },
};

const listeners = { resize: [] };
function onResize(fn) { listeners.resize.push(fn); }

function resize() {
  const oldW = W, oldH = H;
  W = window.innerWidth; H = window.innerHeight;
  DPR = maxDPR;
  if (W * H * DPR * DPR > 4.6e6) DPR = Math.max(1, Math.sqrt(4.6e6 / (W * H)));
  for (const c of [cvs, fg]) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  U = Math.min(H, W * 0.9, 1100);
  const portrait = H > W * 1.15;
  GROUND = H * (portrait ? 0.735 : 0.765);
  for (const fn of listeners.resize) fn(oldW, oldH);
}
