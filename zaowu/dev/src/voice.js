/* =====================================================================
   造物 · voice — who says what, and when.
   1st choice: the voice bank, lines pre-recorded with the Kokoro neural
   TTS at build time (narrator + two creature voices per language).
   Fallback: the device's own speech synthesis, picking its most natural
   voice and moving on to the next one if a voice stays silent.
   Priorities: a child's touch (3) > narrator (2) > reactions (1) > chatter (0).
   ===================================================================== */
const Voice = (() => {
  const SS = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  let on = true, cur = null, queue = [], sysUnlocked = false;
  const banks = {}, decoded = new Map(), sysWorking = {};
  const BASE = (typeof BUILD !== 'undefined' && BUILD.voice) || '';

  function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }

  function load(lang) {
    if (!BASE) return Promise.resolve();
    const b = banks[lang] || (banks[lang] = { state: 'idle' });
    if (b.state !== 'idle') return b.p;
    b.state = 'loading';
    b.p = Promise.all([
      fetch(BASE + 'voice-' + lang + '.json').then(r => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(BASE + 'voice-' + lang + '.' + ((typeof BUILD !== 'undefined' && BUILD.ext) || 'bin')).then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))),
    ]).then(([ix, bin]) => { b.map = ix.u; b.buf = bin; b.state = 'ready'; }).catch(() => { b.state = 'failed'; });
    return b.p;
  }
  function has(text, role, lang) { const b = banks[lang || I18N.lang]; return !!(b && b.state === 'ready' && b.map[fnv(role + '|' + text)]); }
  function decode(bytes) {
    const ac = Snd.ctx;
    return new Promise((res, rej) => { try { const p = ac.decodeAudioData(bytes, res, rej); if (p && p.catch) p.catch(rej); } catch (e) { rej(e); } });
  }

  /* ---------- the queue ---------- */
  function say(text, o = {}) {
    if (!text || !on) return false;
    // lang = which bank to look in (the page language); speech = the language of the words themselves
    const item = { text, role: o.role || 'n', lang: o.lang || I18N.lang, speech: /[\u4e00-\u9fff]/.test(text) ? 'zh' : 'en', rate: o.rate || 1, prio: o.prio === undefined ? 2 : o.prio, x: o.x, tag: o.tag, onstart: o.onstart, onend: o.onend };
    if (!cur) { start(item); return true; }
    if (item.prio >= 3) {
      const was = cur; cur = null; halt(was);
      // only the guided story picks up again where it was cut off
      if (was.prio === 2 && was.tag === 'story' && !was.requeued) queue.unshift(Object.assign({}, was, { requeued: true, cancelled: false, ended: false, src: null }));
      if (cur) { const c2 = cur; cur = null; halt(c2); }   // an onend above may have started something already
      start(item); return true;
    }
    if (item.prio === 2) { queue.push(item); sortQ(); return true; }
    return false;   // reactions and chatter only speak when nobody else is talking
  }
  const sortQ = () => { queue = queue.map((q, i) => [q, i]).sort((a, b) => b[0].prio - a[0].prio || a[1] - b[1]).map(p => p[0]); };
  function start(item) {
    cur = item; Snd.duck(true);
    const b = banks[item.lang];
    // the bank is still downloading: wait a few seconds rather than switch voices mid-story
    if (b && b.state === 'loading') {
      let went = false;
      const go = () => { if (went) return; went = true; if (cur === item && !item.cancelled) begin(item); };
      b.p.then(go); setTimeout(go, 6000);
      return;
    }
    begin(item);
  }
  function begin(item) {
    const b = banks[item.lang], e = b && b.state === 'ready' ? b.map[fnv(item.role + '|' + item.text)] : null;
    if (e && Snd.live) playBank(item, e); else playSystem(item, 0);
  }
  function ended(item) { if (item.ended) return; item.ended = true; if (item.onend) item.onend(); }
  function finish(item) {
    if (cur !== item) return;
    cur = null;
    ended(item);
    if (queue.length) start(queue.shift());
    else setTimeout(() => { if (!cur) Snd.duck(false); }, 300);
  }
  function halt(item) {
    if (item.cancelled) return;
    item.cancelled = true;
    if (item.src) { try { item.src.onended = null; item.src.stop(); } catch (_) { } }
    if (item.sys && SS) { try { SS.cancel(); } catch (_) { } }
    ended(item);
  }

  async function playBank(item, e) {
    try {
      const k = item.lang + e[0];
      let buf = decoded.get(k);
      if (!buf) {
        buf = await decode(banks[item.lang].buf.slice(e[0], e[0] + e[1]));
        decoded.set(k, buf); if (decoded.size > 40) decoded.delete(decoded.keys().next().value);
      }
      if (item.cancelled || cur !== item) return;
      const src = Snd.voiceOut(buf, item.rate, item.x);
      if (!src) throw new Error('audio not running');
      item.src = src; src.onended = () => finish(item);
      if (item.onstart) item.onstart(buf.duration / item.rate);
    } catch (err) { if (!item.cancelled && cur === item) playSystem(item, 0); }
  }

  /* ---------- the device's own voices ---------- */
  const NOVELTY = /eddy|flo\b|grandma|grandpa|reed|rocko|sandy|shelley|bells|bubbles|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|bad news|good news|boing|cellos|hysterical|bahh|junior|ralph|fred|kathy/i;
  function list() { try { return SS.getVoices() || []; } catch (_) { return []; } }
  function isLang(v, lang) {
    const l = v.lang || '', n = v.name || '';
    if (lang === 'zh') return (/^(zh|cmn)/i.test(l) && !/hk|yue|mo$/i.test(l)) || (/chinese|mandarin|中文|普通话|国语/i.test(n) && !/cantonese|粤/i.test(n));
    return /^en/i.test(l);
  }
  function score(v, lang, role) {
    const n = (v.name || '').toLowerCase(), l = (v.lang || '').toLowerCase(); let s = 0;
    if (/natural|neural/.test(n)) s += 12;
    if (/premium|enhanced|增强|高级|siri/.test(n)) s += 9;
    if (/google/.test(n)) s += 7;
    if (/online/.test(n)) s += 2;
    if (lang === 'zh') {
      if (/xiaoxiao|xiaoyi|yunxi|yunxia|yunjian|xiaochen|xiaohan|xiaomeng|xiaomo|xiaorui|xiaoshuang|xiaoxuan|xiaoyan|xiaoyou|tingting|ting-ting|lili|yu-?shu|li-?mu|mei-?jia|huihui|kangkang|yaoyao/.test(n)) s += 5;
      if (/zh[-_]?cn|cmn|hans/.test(l)) s += 3; else if (/tw|hant/.test(l)) s -= 1;
    } else {
      if (/aria|jenny|ana\b|ava|emma|andrew|brian|samantha|karen|daniel|moira|serena|allison|susan|evan|nathan|zoe/.test(n)) s += 4;
      if (/en[-_]us/.test(l)) s += 2; else if (/en[-_]gb/.test(l)) s += 1;
    }
    if (role !== 'n' && /yunxia|ana\b|xiaoyi|xiaoyou|child|kid/.test(n)) s += 6;
    if (role === 'n' && /yunxia|ana\b|xiaoyou/.test(n)) s -= 4;
    if (v.default) s += 2; if (v.localService) s += 1;
    if (NOVELTY.test(n)) s -= 20;
    return s;
  }
  function candidates(lang, role) {
    const r = role === 'n' ? 'n' : 'c', vs = list().filter(v => isLang(v, lang)).sort((a, b) => score(b, lang, r) - score(a, lang, r));
    const w = sysWorking[lang + r]; if (w) { const i = vs.indexOf(w); if (i > 0) vs.unshift(vs.splice(i, 1)[0]); }
    return vs;
  }
  function playSystem(item, idx) {
    if (!SS) { if (item.onstart) item.onstart(0); setTimeout(() => finish(item), 50); item.silent = true; return; }
    const chain = candidates(item.speech, item.role).concat([null]);
    if (idx >= chain.length || idx > 4) { item.silent = true; finish(item); return; }
    const v = chain[idx]; let started = false, moved = false;
    const tryNext = () => { if (moved || started || item.cancelled || cur !== item) return; moved = true; playSystem(item, idx + 1); };
    try {
      if (SS.speaking || SS.pending) SS.cancel();
      if (SS.paused) SS.resume();
      const u = new SpeechSynthesisUtterance(item.text);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = item.speech === 'en' ? 'en-US' : 'zh-CN';
      const isN = item.role === 'n';
      u.rate = isN ? 0.92 : clamp(0.95 + (item.rate - 1) * 0.4, 0.9, 1.2);
      u.pitch = isN ? 1.02 : clamp(1.15 + (item.rate - 1) * 1.6, 1.1, 1.9);
      item.sys = true;
      u.onstart = () => { if (item.cancelled || cur !== item) return; started = true; if (v) sysWorking[item.speech + (isN ? 'n' : 'c')] = v; if (item.onstart) item.onstart(0); };
      u.onend = () => { if (started) finish(item); };
      u.onerror = () => { if (!started) tryNext(); else finish(item); };
      SS.speak(u);
      setTimeout(() => { try { if (!started && SS.paused) SS.resume(); } catch (_) { } }, 120);
      setTimeout(tryNext, 1300);
    } catch (e) { tryNext(); }
  }
  function unlock() {
    if (sysUnlocked || !SS) return; sysUnlocked = true;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; SS.speak(u); } catch (_) { }
  }
  if (SS) { try { SS.getVoices(); SS.addEventListener('voiceschanged', () => { }); } catch (_) { } }

  return {
    say, load, has, unlock,
    narrate(text, tag = 'story', o = {}) { return say(text, Object.assign({ role: 'n', prio: 2, tag }, o)); },
    // several lines in a row: the first one cuts in, the rest wait their turn; onend after the last
    seq(lines, tag, onend) {
      queue = queue.filter(q => q.tag !== tag);
      const L = lines.filter(Boolean).map(l => (typeof l === 'string' ? { text: l } : l));
      if (!L.length || !on) { if (onend) setTimeout(onend, L.length ? 700 : 0); return; }
      L.forEach((l, i) => say(l.text, { role: l.role || 'n', prio: i ? 2 : 3, tag, x: l.x, onstart: l.onstart, onend: i === L.length - 1 ? onend : l.onend }));
    },
    playing(tag) { return !!cur && (!tag || cur.tag === tag) || queue.some(q => !tag || q.tag === tag); },
    clear(tag) { queue = queue.filter(q => q.tag !== tag); },
    stopAll() { queue = []; if (cur) { const c = cur; cur = null; halt(c); } Snd.duck(false); },
    get busy() { return !!cur; },
    get on() { return on; }, set on(v) { on = v; if (!v) this.stopAll(); },
    state(lang) { const b = banks[lang || I18N.lang]; return b ? b.state : (BASE ? 'idle' : 'none'); },
    fnv,
  };
})();
