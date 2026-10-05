// 彩虹钢琴 · the narrator
// First choice: the voice bank (voice-zh.bin|json next to the page), every line pre-recorded with the same
// Microsoft neural voice as the rest of 思维小画本 (晓晓, slowed down for children; see ../../dev/voice).
// A line that is not in the bank, or a bank that did not load, falls back to the device's own speech.
import { Snd } from './audio.js';
import { Bus } from './core.js';

const SS = 'speechSynthesis' in window ? window.speechSynthesis : null;
export const Voice = { on: true, last: '', busy: false };
let bank = null, bankState = 'idle', bankP = null, clip = null, gen = 0;
const bufs = new Map();

function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }
Voice.load = function () {
  if (bankState !== 'idle') return bankP;
  if (!window.fetch || location.protocol === 'file:') { bankState = 'failed'; return (bankP = Promise.resolve()); }
  bankState = 'loading';
  bankP = Promise.all([
    fetch('voice-zh.json').then(r => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch('voice-zh.bin').then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))),
  ]).then(([ix, bin]) => { bank = { map: ix.u, bin }; bankState = 'ready'; }).catch(() => { bankState = 'failed'; });
  return bankP;
};
Voice.has = t => !!(bank && bank.map[fnv('n|' + t)]);

function stopClip() { const c = clip; clip = null; if (c) { try { c.onended = null; c.stop(); } catch (_) { } } }
function done(g, onend) { if (g !== gen) return; Voice.busy = false; Snd.duck(false); Bus.emit('voice', null); if (onend) onend(); }
Voice.stop = function () { gen++; stopClip(); if (SS) try { SS.cancel(); } catch (_) { } Voice.busy = false; Snd.duck(false); Bus.emit('voice', null); };

// say a line; the newest line always wins. o.onend runs when it has been said (or skipped).
Voice.say = function (t, o = {}) {
  if (!t) return;
  if (o.keep !== false) Voice.last = t;
  Bus.emit('subtitle', o.show === false ? null : (o.text || t));
  if (!Voice.on) { if (o.onend) setTimeout(o.onend, 300); return; }
  const g = ++gen;
  Promise.resolve().then(() => {
    if (g !== gen) return;
    if (bankState === 'loading') { let went = false; const go = () => { if (!went) { went = true; route(t, g, o); } }; bankP.then(go); setTimeout(go, 3500); return; }
    route(t, g, o);
  });
};
Voice.repeat = () => Voice.say(Voice.last);

function route(t, g, o) {
  if (g !== gen) return;
  const e = bank && bank.map[fnv('n|' + t)];
  if (e && Snd.ctx) playClip(t, e, g, o); else sysSay(t, g, o);
}
function playClip(t, e, g, o) {
  const ac = Snd.ctx;
  const got = bufs.get(e[0]);
  const p = got ? Promise.resolve(got) : new Promise((res, rej) => { try { const q = ac.decodeAudioData(bank.bin.slice(e[0], e[0] + e[1]), res, rej); if (q && q.catch) q.catch(rej); } catch (err) { rej(err); } });
  p.then(buf => {
    if (!got) { bufs.set(e[0], buf); if (bufs.size > 30) bufs.delete(bufs.keys().next().value); }
    if (g !== gen) return;
    stopClip(); if (SS) try { SS.cancel(); } catch (_) { }
    const src = ac.createBufferSource(), gn = ac.createGain();
    gn.gain.value = 1.05; src.buffer = buf; src.connect(gn); gn.connect(ac.destination);
    src.onended = () => { if (clip !== src) return; clip = null; done(g, o.onend); };
    clip = src; src.start(); Voice.busy = true; Snd.duck(true); Bus.emit('voice', t);
  }).catch(() => sysSay(t, g, o));
}
let sysVoice = null;
function pickVoice() {
  if (sysVoice || !SS) return sysVoice;
  const vs = (SS.getVoices() || []).filter(v => /^(zh|cmn)/i.test(v.lang || ''));
  const score = v => { const n = (v.name || '').toLowerCase(); let s = 0; if (/xiaoxiao|ting-?ting|mei-?jia|yu-?shu|google/.test(n)) s += 6; if (/zh[-_]?cn/i.test(v.lang)) s += 3; if (v.localService) s += 1; return s; };
  vs.sort((a, b) => score(b) - score(a));
  return (sysVoice = vs[0] || null);
}
function sysSay(t, g, o) {
  if (!SS) { setTimeout(() => done(g, o.onend), 600); return; }
  stopClip();
  try {
    SS.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/do re mi/g, '哆来咪'));
    u.lang = 'zh-CN'; u.rate = 0.9; u.pitch = 1.1;
    const v = pickVoice(); if (v) u.voice = v;
    let fin = false; const end = () => { if (fin) return; fin = true; done(g, o.onend); };
    u.onend = end; u.onerror = end;
    setTimeout(end, 1200 + t.length * 330);
    Voice.busy = true; Snd.duck(true); Bus.emit('voice', t);
    SS.speak(u);
  } catch (_) { done(g, o.onend); }
}
Voice.unlock = function () {
  if (!SS || Voice._unlocked) return; Voice._unlocked = true;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; SS.speak(u); } catch (_) { }
};
