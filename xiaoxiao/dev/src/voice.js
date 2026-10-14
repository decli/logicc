// 动物消消乐 · the voices. Every line is pre-recorded (voice.bin|json next to the page, made with edge-tts by
// ../../dev/voice/build.py xiaoxiao): Chinese by 晓晓 like the rest of 思维小画本, the English cheers by Ana, a child voice.
// A line missing from the bank, or a bank that did not load, falls back to the device's own speech.
const SS = 'speechSynthesis' in window ? window.speechSynthesis : null;
const Voice = { on: true, last: '', busy: false };
(() => {
  let bank = null, state = 'idle', loadP = null, clip = null, gen = 0;
  const bufs = new Map();
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
  const entry = (role, t) => bank && bank.map[fnv(role + '|' + t)];
  const decode = e => {
    const got = bufs.get(e[0]);
    if (got) return Promise.resolve(got);
    return new Promise((res, rej) => {
      try { const q = Snd.ctx.decodeAudioData(bank.bin.slice(e[0], e[0] + e[1]), res, rej); if (q && q.catch) q.catch(rej); } catch (err) { rej(err); }
    }).then(b => { bufs.set(e[0], b); if (bufs.size > 40) bufs.delete(bufs.keys().next().value); return b; });
  };
  function stopClip() { const c = clip; clip = null; if (c) { try { c.onended = null; c.stop(); } catch (_) { } } }
  function done(g, onend) { if (g !== gen) return; Voice.busy = false; Snd.duck(false); if (onend) onend(); }
  Voice.stop = function () { gen++; stopClip(); if (SS) try { SS.cancel(); } catch (_) { } Voice.busy = false; Snd.duck(false); };

  // say a Chinese line; the newest line wins. o.onend runs when it has been said (or skipped).
  Voice.say = function (t, o = {}) {
    if (!t) return;
    Voice.last = t;
    if (!Voice.on) { if (o.onend) setTimeout(o.onend, 200); return; }
    const g = ++gen;
    const go = () => {
      if (g !== gen) return;
      const e = entry('n', t);
      if (e && Snd.ctx) play(e, g, o, false); else sysSay(t, 'zh-CN', g, o);
    };
    if (state === 'loading') { let went = false; const once = () => { if (!went) { went = true; go(); } }; loadP.then(once); setTimeout(once, 2500); }
    else go();
  };
  // an English cheer: does not interrupt the narrator's bookkeeping, plays over the music with a bit of room
  Voice.cheer = function (word) {
    if (!Voice.on || !word) return;
    const e = entry('p', word);
    if (e && Snd.ctx) {
      decode(e).then(buf => {
        const c = Snd.ctx, src = c.createBufferSource(), gn = c.createGain();
        src.buffer = buf; src.playbackRate.value = 1.04; gn.gain.value = 1.15;
        src.connect(gn); gn.connect(Snd.voice); gn.connect(Snd.verb);
        src.start();
      }).catch(() => { });
    } else if (SS) {
      try { const u = new SpeechSynthesisUtterance(word); u.lang = 'en-US'; u.rate = 1; u.pitch = 1.4; SS.speak(u); } catch (_) { }
    }
  };
  Voice.repeat = () => Voice.say(Voice.last);

  function play(e, g, o) {
    decode(e).then(buf => {
      if (g !== gen) return;
      stopClip(); if (SS) try { SS.cancel(); } catch (_) { }
      const c = Snd.ctx, src = c.createBufferSource(), gn = c.createGain();
      gn.gain.value = 1.05; src.buffer = buf; src.connect(gn); gn.connect(Snd.voice);
      src.onended = () => { if (clip !== src) return; clip = null; done(g, o.onend); };
      clip = src; src.start(); Voice.busy = true; Snd.duck(true);
    }).catch(() => sysSay(Voice.last, 'zh-CN', g, o));
  }
  let sysVoice = null;
  function pickVoice() {
    if (sysVoice || !SS) return sysVoice;
    const vs = (SS.getVoices() || []).filter(v => /^(zh|cmn)/i.test(v.lang || ''));
    const score = v => { const n = (v.name || '').toLowerCase(); let s = 0; if (/xiaoxiao|ting-?ting|mei-?jia|yu-?shu|google/.test(n)) s += 6; if (/zh[-_]?cn/i.test(v.lang)) s += 3; if (v.localService) s += 1; return s; };
    vs.sort((a, b) => score(b) - score(a));
    return (sysVoice = vs[0] || null);
  }
  function sysSay(t, lang, g, o) {
    if (!SS) { setTimeout(() => done(g, o.onend), 600); return; }
    stopClip();
    try {
      SS.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = lang; u.rate = 0.95; u.pitch = 1.1;
      const v = pickVoice(); if (v) u.voice = v;
      let fin = false; const end = () => { if (fin) return; fin = true; done(g, o.onend); };
      u.onend = end; u.onerror = end;
      setTimeout(end, 1200 + t.length * 330);
      Voice.busy = true; Snd.duck(true);
      SS.speak(u);
    } catch (_) { done(g, o.onend); }
  }
  Voice.unlock = function () {
    if (!SS || Voice._unlocked) return; Voice._unlocked = true;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; SS.speak(u); } catch (_) { }
  };
})();
