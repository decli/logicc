// 魔方世界 · the voices (adapted from 动物消消乐). Every line is pre-recorded (voice.bin|json next to the page, made with
// edge-tts by ../../dev/voice/build.py mofang): Chinese by 晓晓 like the rest of 思维小画本, the English cheers by Ana, a
// child voice. The device's own speech is never used (decli: it sounds stiff and stutters): a line missing from the bank
// stays silent, and ?debug lists it in the console so it can be added to lines.js and recorded.
import { Snd } from './audio.js';
import { params } from './core.js';
export const Voice = { on: true, last: '', busy: false };
(() => {
  let bank = null, state = 'idle', loadP = null, clip = null, gen = 0;
  const bufs = new Map(), debug = params.has('debug');
  const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  Voice.load = function () {
    if (state !== 'idle') return loadP;
    if (!window.fetch || location.protocol === 'file:') { state = 'failed'; return (loadP = Promise.resolve()); }
    state = 'loading';
    loadP = fetch('voice.json').then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(ix => fetch('voice.bin' + (ix.h ? '?h=' + ix.h : '')).then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))).then(bin => { bank = { map: ix.u, bin }; state = 'ready'; }))
      .catch(() => { state = 'failed'; });
    return loadP;
  };
  const entry = (role, t) => {
    const e = bank && bank.map[fnv(role + '|' + t)];
    if (!e && bank && debug) console.warn('voice: not recorded: ' + role + '|' + t);
    return e;
  };
  const decode = e => {
    const got = bufs.get(e[0]);
    if (got) return Promise.resolve(got);
    return new Promise((res, rej) => {
      try { const q = Snd.ctx.decodeAudioData(bank.bin.slice(e[0], e[0] + e[1]), res, rej); if (q && q.catch) q.catch(rej); } catch (err) { rej(err); }
    }).then(b => { bufs.set(e[0], b); if (bufs.size > 40) bufs.delete(bufs.keys().next().value); return b; });
  };
  function stopClip() { const c = clip; clip = null; if (c) { try { c.onended = null; c.stop(); } catch (_) { } } }
  function done(g, onend) { if (g !== gen) return; Voice.busy = false; Snd.duck(false); if (onend) onend(); }
  // nothing to play: stay quiet, but let whoever waits on the line carry on
  const skip = (g, o) => setTimeout(() => done(g, o.onend), 300);
  Voice.stop = function () { gen++; stopClip(); Voice.busy = false; Snd.duck(false); };

  // say a Chinese line; the newest line wins. o.onend runs when it has been said (or skipped).
  // While the bank is still downloading the line waits for it (a newer line replaces it).
  Voice.say = function (t, o = {}) {
    if (!t) return;
    Voice.last = t;
    if (!Voice.on) { if (o.onend) setTimeout(o.onend, 200); return; }
    const g = ++gen;
    const go = () => {
      if (g !== gen) return;
      const e = entry('n', t);
      if (e && Snd.ctx) play(e, g, o); else skip(g, o);
    };
    if (state === 'loading') loadP.then(go); else go();
  };
  // an English cheer: does not interrupt the narrator's bookkeeping, plays over the music with a bit of room
  Voice.cheer = function (word) {
    if (!Voice.on || !word) return;
    const e = entry('p', word);
    if (!e || !Snd.ctx) return;
    decode(e).then(buf => {
      const c = Snd.ctx, src = c.createBufferSource(), gn = c.createGain();
      src.buffer = buf; src.playbackRate.value = 1.04; gn.gain.value = 1.15;
      src.connect(gn); gn.connect(Snd.voice); gn.connect(Snd.verb);
      src.start();
    }).catch(() => { });
  };
  Voice.repeat = () => Voice.say(Voice.last);
  // say it and wait until it has been said (a missing clip still resolves)
  Voice.sayWait = (t, maxSec = 8) => new Promise(res => { let d = false; const f = () => { if (!d) { d = true; res(); } }; Voice.say(t, { onend: f }); setTimeout(f, maxSec * 1000); });

  function play(e, g, o) {
    decode(e).then(buf => {
      if (g !== gen) return;
      stopClip();
      const c = Snd.ctx, src = c.createBufferSource(), gn = c.createGain();
      gn.gain.value = 1.05; src.buffer = buf; src.connect(gn); gn.connect(Snd.voice);
      src.onended = () => { if (clip !== src) return; clip = null; done(g, o.onend); };
      clip = src; src.start(); Voice.busy = true; Snd.duck(true);
    }).catch(() => skip(g, o));
  }
})();
