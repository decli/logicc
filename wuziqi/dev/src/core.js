// 五子棋 · small helpers and what is kept on this device
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = a => a[(Math.random() * a.length) | 0];
const wait = ms => new Promise(r => setTimeout(r, ms));

const Store = {
  key: 'logicc.wuziqi.v1',
  d: null,
  defaults() {
    return {
      rec: {},              // opponent id -> [won, lost, drawn] (games against the computer)
      pvp: [0, 0, 0],       // two players: black won, white won, drawn
      first: 'me',          // against the computer: 'me' (the child is black and starts) or 'it'
      remind: true,         // 提醒: rings where the other side is about to make five, or an open four
      snd: true, voi: true,
    };
  },
  load() {
    this.d = this.defaults();
    try {
      // the first visit follows 思维小画本's sound switches
      const home = JSON.parse(localStorage.getItem('logicc.design.v2') || 'null');
      if (home) { if (typeof home.snd === 'boolean') this.d.snd = home.snd; if (typeof home.voi === 'boolean') this.d.voi = home.voi; }
      Object.assign(this.d, JSON.parse(localStorage.getItem(this.key) || 'null') || {});
    } catch (e) { }
    return this.d;
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { } },
  rec(id) { return this.d.rec[id] || (this.d.rec[id] = [0, 0, 0]); },
};
