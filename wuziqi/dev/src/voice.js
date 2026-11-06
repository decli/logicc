// 五子棋 · the narrator. Every line is pre-recorded (voice.bin|json next to the page, made with edge-tts by
// ../../dev/voice/build.py wuziqi) by 晓晓 like the rest of 思维小画本; the device's own speech is never used. A line
// missing from the bank stays silent, and ?debug lists it in the console.
const Voice = { on: true, last: '', busy: false };
(() => {
  let bank = null, state = 'idle', loadP = null, clip = null, gen = 0, tries = 0;
  const bufs = new Map(), debug = /[?&]debug\b/.test(location.search);
  const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  Voice.load = function () {
    if (state !== 'idle') return loadP;
    if (!window.fetch || location.protocol === 'file:') { state = 'failed'; return (loadP = Promise.resolve()); }
    state = 'loading';
    loadP = fetch('voice.json').then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(ix => fetch('voice.bin' + (ix.h ? '?h=' + ix.h : '')).then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))).then(bin => { bank = { map: ix.u, bin }; state = 'ready'; }))
      .catch(() => { state = 'failed'; if (++tries < 5) setTimeout(() => { state = 'idle'; Voice.load(); }, [2000, 5000, 10000, 20000][tries - 1]); });
    return loadP;
  };
  const entry = t => {
    const e = bank && bank.map[fnv('n|' + t)];
    if (!e && bank && debug) console.warn('voice: not recorded: ' + t);
    return e;
  };
  const decode = e => {
    const got = bufs.get(e[0]);
    if (got) return Promise.resolve(got);
    return new Promise((res, rej) => {
      try { const q = Snd.ctx.decodeAudioData(bank.bin.slice(e[0], e[0] + e[1]), res, rej); if (q && q.catch) q.catch(rej); } catch (err) { rej(err); }
    }).then(b => { bufs.set(e[0], b); if (bufs.size > 30) bufs.delete(bufs.keys().next().value); return b; });
  };
  function stopClip() { const c = clip; clip = null; if (c) { try { c.onended = null; c.stop(); } catch (_) { } } }
  function done(g, onend) { if (g !== gen) return; Voice.busy = false; if (onend) onend(); }
  Voice.stop = function () { gen++; stopClip(); Voice.busy = false; };
  // say a line; the newest line wins. o.onend runs when it has been said (or skipped)
  Voice.say = function (t, o = {}) {
    if (!t) return;
    Voice.last = t;
    if (!Voice.on) { if (o.onend) setTimeout(o.onend, 200); return; }
    const g = ++gen;
    const go = () => {
      if (g !== gen) return;
      const e = entry(t);
      if (e && Snd.ctx) play(e, g, o); else setTimeout(() => done(g, o.onend), 300);
    };
    if (state === 'loading') { let went = false; const once = () => { if (!went) { went = true; go(); } }; loadP.then(once); setTimeout(once, 2500); }
    else go();
  };
  Voice.repeat = () => Voice.say(Voice.last);
  function play(e, g, o) {
    decode(e).then(buf => {
      if (g !== gen) return;
      stopClip();
      const c = Snd.ctx, src = c.createBufferSource(), gn = c.createGain();
      gn.gain.value = 1.05; src.buffer = buf; src.connect(gn); gn.connect(Snd.voice);
      src.onended = () => { if (clip !== src) return; clip = null; done(g, o.onend); };
      clip = src; src.start(); Voice.busy = true;
    }).catch(() => done(g, o.onend));
  }
})();
