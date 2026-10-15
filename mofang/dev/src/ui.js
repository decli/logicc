// 魔方世界 · the HUD around the 3D view: layout, answer cards, tool buttons, the level-done card, grown-ups' sheet
import { $, el, clamp, Store } from './core.js';
import { Stage } from './stage.js';
import { Snd, Music } from './audio.js';
import { Voice } from './voice.js';

const hud = () => $('#hud');
export const UI = {
  b: 60, g: 12, land: true, panelOn: false, toolsOn: false, toolsH: 0,
  onResize: null,

  // measure the screen; place the answer panel (right side in landscape, bottom in portrait) and the tool row,
  // and tell the stage which rectangle is left for the 3D picture
  layout(o = this._last || {}) {
    this._last = o;
    const W = innerWidth, H = innerHeight;
    const b = this.b = Math.round(clamp(Math.min(W, H) / 8.6, 44, 74));
    const g = this.g = Math.round(clamp(b * 0.2, 8, 14));
    const root = document.documentElement.style;
    root.setProperty('--b', b + 'px'); root.setProperty('--g', g + 'px');
    this.land = W > H * 1.08;
    const topH = b + g * 2;
    let rect = { x: 0, y: topH, w: W, h: H - topH };
    const h = hud();
    h.classList.toggle('side', this.land); h.classList.toggle('bottom', !this.land);
    this.panelOn = !!o.panel;
    if (o.panel) {
      if (this.land) {
        const pw = Math.round(clamp(W * (o.panel === 'wide' ? 0.42 : 0.34), 210, 470));
        root.setProperty('--pw', pw + 'px');
        rect.w = W - pw - g * 2;
      } else {
        const ph = Math.round(clamp(H * (o.panel === 'wide' ? 0.36 : 0.29), 130, 360));
        root.setProperty('--ph', ph + 'px');
        rect.h = H - topH - ph - g * 2;
      }
    }
    const tools = $('#tools');
    this.toolsOn = !!o.tools;
    if (o.tools) {
      const th = Math.round(b * (o.tools === 'tall' ? 1.5 : 1.35));
      this.toolsH = th;
      tools.style.left = rect.x + g + 'px'; tools.style.width = rect.w - g * 2 + 'px';
      tools.style.top = rect.y + rect.h - th - g * 0.5 + 'px'; tools.style.height = th + 'px';
      rect.h -= th + g;
    }
    Stage.setRect(rect.x, rect.y, rect.w, rect.h);
    if (this.onResize) this.onResize();
    if (this._opts) this._fitOptions();
  },
  hud(on) { hud().classList.toggle('hidden', !on); },
  buttons(o) {
    for (const [id, show] of Object.entries(o)) { const n = $('#' + id + 'Btn'); if (n) n.classList.toggle('hidden', !show); }
  },
  dots(n, done = 0) {
    const d = $('#dots'); d.innerHTML = '';
    for (let i = 0; i < n; i++) { const x = el('i'); if (i < done) x.className = 'on'; else if (i === done) x.className = 'now'; d.appendChild(x); }
  },
  dot(i) { const ds = $('#dots').children; for (let k = 0; k < ds.length; k++) ds[k].className = k <= i ? 'on' : k === i + 1 ? 'now' : ''; },
  clearDots() { $('#dots').innerHTML = ''; },

  /* ---------- the answer panel ---------- */
  panel() { return $('#panel'); },
  clearPanel() { const p = $('#panel'); p.innerHTML = ''; p.className = ''; this._opts = null; },
  // big answer cards; draw(item, canvas, w, h) paints each one. Returns the card elements.
  options(items, o) {
    const p = $('#panel'); p.innerHTML = ''; p.className = o.clear ? 'clear' : '';
    const grid = el('div', 'grid'); p.appendChild(grid);
    const cards = items.map((it, i) => {
      const c = el('button', 'opt');
      c.setAttribute('aria-label', o.label ? o.label(it, i) : '选项 ' + (i + 1));
      if (o.letters) c.appendChild(el('span', 'lbl', 'ABCD'[i]));
      if (o.html) c.insertAdjacentHTML('beforeend', o.html(it, i));
      if (o.draw) { const cv = el('canvas'); c.appendChild(cv); }
      c.addEventListener('click', () => o.pick(it, i, c));
      grid.appendChild(c); return c;
    });
    this._opts = { grid, cards, items, o };
    this._fitOptions();
    return cards;
  },
  _fitOptions() {
    const { grid, cards, items, o } = this._opts, n = cards.length;
    const r = grid.getBoundingClientRect();
    if (!r.width) return;
    let best = null;
    const ar = o.aspect || 1;     // wanted width / height of a card
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      const cw = (r.width - this.g * (cols - 1)) / cols, ch = (r.height - this.g * (rows - 1)) / rows;
      const s = Math.min(cw / ar, ch);
      if (!best || s > best.s + 0.5) best = { cols, rows, s };
    }
    grid.style.gridTemplateColumns = `repeat(${best.cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${best.rows}, 1fr)`;
    if (o.draw) requestAnimationFrame(() => cards.forEach((c, i) => {
      const cv = c.querySelector('canvas'), b = c.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      const w = Math.max(10, b.width * 0.9), h = Math.max(10, b.height * 0.86);
      cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
      const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
      o.draw(items[i], x, w, h);
    }));
  },
  shake(n) { n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); },

  /* ---------- tool row (buttons under the 3D view) ---------- */
  tools(list) {
    const t = $('#tools'); t.innerHTML = '';
    const out = {};
    for (const it of list) {
      if (it === '|') { t.appendChild(el('i', 'sep')); continue; }
      const bt = el('button', 'btn ' + (it.cls || 'round'), it.html != null ? it.html : `<span class="ic">${it.icon}</span>`);
      if (it.color) bt.style.background = it.color;
      bt.setAttribute('aria-label', it.label || '');
      bt.addEventListener('click', e => { e.stopPropagation(); it.fn(bt); });
      t.appendChild(bt); out[it.id || it.icon] = bt;
    }
    return out;
  },
  clearTools() { $('#tools').innerHTML = ''; },

  /* ---------- a pointing hand for "do it like this" ---------- */
  hand(x, y, o = {}) {
    const h = el('div', 'hand', '👆'); document.body.appendChild(h);
    h.style.left = x + 'px'; h.style.top = y + 'px';
    let alive = true, t0 = performance.now();
    const step = () => {
      if (!alive) return;
      const t = (performance.now() - t0) / 1000;
      if (o.to) { const k = (t % 1.6) / 1.2, e = Math.min(1, k); h.style.left = x + (o.to.x - x) * e + 'px'; h.style.top = y + (o.to.y - y) * e + 'px'; h.style.opacity = k > 1 ? 0 : 1; }
      else h.style.transform = `translate(-30%, ${-10 + Math.abs(Math.sin(t * 5)) * -14}%)`;
      requestAnimationFrame(step);
    };
    step();
    const kill = () => { alive = false; h.remove(); };
    if (o.sec) setTimeout(kill, o.sec * 1000);
    return kill;
  },

  /* ---------- the card after a level ---------- */
  result(stars, o) {
    const c = $('#card'); c.innerHTML = ''; c.classList.remove('hidden');
    const box = el('div', 'box'); c.appendChild(box);
    const st = el('div', 'stars'); for (let i = 0; i < 3; i++) st.appendChild(el('span', '', '⭐')); box.appendChild(st);
    if (o.pic) box.appendChild(el('div', 'pic', o.pic));
    const row = el('div', 'row'); box.appendChild(row);
    const mk = (ic, label, fn, cls = '') => { const b = el('button', 'btn round ' + cls, `<span class="ic">${ic}</span>`); b.setAttribute('aria-label', label); b.addEventListener('click', () => { Snd.play('tap'); this.closeCard(); fn(); }); row.appendChild(b); return b; };
    mk('🗺️', '回地图', o.map);
    mk('🔁', '再玩一次', o.replay);
    if (o.next) mk('▶', '下一关', o.next, 'glow').style.background = 'linear-gradient(#FFE066,#FFC233)';
    st.childNodes.forEach((s, i) => setTimeout(() => { if (i < stars) { s.classList.add('on'); Snd.play('star', i); } }, 350 + i * 380));
  },
  closeCard() { $('#card').classList.add('hidden'); $('#card').innerHTML = ''; },

  /* ---------- grown-ups: a question first, then sound switches and progress ---------- */
  gear(onChange) {
    const s = $('#sheet'); s.innerHTML = ''; s.classList.remove('hidden');
    const box = el('div', 'box'); s.appendChild(box);
    const CN = '零一二三四五六七八九';
    const a = 3 + ((Math.random() * 6) | 0), b2 = 4 + ((Math.random() * 5) | 0);
    box.appendChild(el('h2', '', '家长专区'));
    box.appendChild(el('div', 'q', `${CN[a]}乘以${CN[b2]}等于多少？`));
    const ans = el('div', 'ans', ''); box.appendChild(ans);
    const pad = el('div', 'pad'); box.appendChild(pad);
    let typed = '';
    for (const k of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '⌫', '✕']) {
      const bt = el('button', 'btn', String(k));
      bt.addEventListener('click', () => {
        if (k === '✕') return this.closeSheet();
        if (k === '⌫') typed = typed.slice(0, -1); else if (typed.length < 3) typed += k;
        ans.textContent = typed;
        if (+typed === a * b2) this._settings(box, onChange);
        else if (typed.length >= String(a * b2).length) { this.shake(ans); setTimeout(() => { typed = ''; ans.textContent = ''; }, 500); }
      });
      pad.appendChild(bt);
    }
    const pad2 = pad.children; pad2[pad2.length - 1].style.gridColumn = 'span 2';
  },
  _settings(box, onChange) {
    box.innerHTML = '';
    box.appendChild(el('h2', '', '家长专区'));
    const d = Store.d;
    const tg = (label, key, apply) => {
      const r = el('div', 'tg'); r.appendChild(el('span', '', label));
      const bt = el('button', 'btn', ''); const show = () => { bt.textContent = d[key] ? '开' : '关'; bt.classList.toggle('on', !!d[key]); };
      bt.addEventListener('click', () => { d[key] = !d[key]; Store.save(); show(); apply(d[key]); });
      show(); r.appendChild(bt); box.appendChild(r);
    };
    tg('音效', 'sound', v => Snd.setOn(v));
    tg('背景音乐', 'music', v => { Snd.music = v; if (v) Music.start(); else Music.stop(); Music.refresh(); });
    tg('语音', 'voice', v => { Voice.on = v; if (!v) Voice.stop(); });
    tg('打开全部关卡', 'all', () => onChange && onChange());
    const r = el('div', 'tg'); r.appendChild(el('span', '', '清空星星和进度'));
    const clr = el('button', 'btn', '清空'); let armed = false;
    clr.addEventListener('click', () => {
      if (!armed) { armed = true; clr.textContent = '再点一次'; return; }
      d.stars = {}; d.seen = {}; d.build = null; Store.save(); clr.textContent = '已清空'; onChange && onChange();
    });
    r.appendChild(clr); box.appendChild(r);
    box.appendChild(el('p', 'note', '每个小岛的关卡按顺序打开；每关三道题，一次做对得三颗星。进度存在这台设备的浏览器里。'));
    const close = el('button', 'btn', '好了'); close.addEventListener('click', () => this.closeSheet()); box.appendChild(close);
  },
  closeSheet() { $('#sheet').classList.add('hidden'); $('#sheet').innerHTML = ''; },
};
