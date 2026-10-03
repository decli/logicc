/* =====================================================================
   造物 · learn — little games for a six-year-old, built on the same world:
   认一认 (tap anything, hear its name in Chinese and English),
   找一找 (I Spy: listen, then find it), 说一说 (pick a sentence, hear it,
   say it to a friend, watch the friend do it). 画一画 lives in draw.js.
   Nothing can be failed; every tap gets an answer.
   ===================================================================== */

/* ---------- what is under the finger? ---------- */
const Look = (() => {
  const TREE_WORD = { peach: 'peach', pine: 'pine', maple: 'maple', willow: 'willow', ginkgo: 'ginkgo' };
  function rainbowHit(x, y) {
    const rb = world.rainbow; if (!rb || rb.a < 0.35 || world.sky.night > 0.6) return false;
    const cx = clamp(W - world.sky.sun.x, W * 0.2, W * 0.8), cy = GROUND + U * 0.08, R0 = U * 0.62, d = hypot(x - cx, y - cy);
    return y < cy && d < R0 + U * 0.03 && d > R0 - U * 0.16;
  }
  function cloudAt(x, y) {
    for (let i = world.clouds.length - 1; i >= 0; i--) {
      const c = world.clouds[i]; if (c.a < 0.3) continue;
      if (Math.abs(x - c.x) < c.w * 0.55 && y > c.y - c.w * 0.38 && y < c.y + c.w * 0.1) return c;
    }
    return null;
  }
  function rainAt(x, y) {
    for (const c of world.clouds) if (c.rain > 0 && Math.abs(x - c.x) < c.w * 0.5 && y > c.y && y < groundY(x)) return c;
    return null;
  }
  // returns { id, obj, x, y } — id is a key of WORD (or 'friend' with obj = creature)
  function at(x, y) {
    const s = world.sky, night = s.night;
    const cr = Creatures.at(x, y); if (cr) return { id: 'friend', obj: cr, x: cr.comx, y: cr.comy };
    const dd = Doodles.at(x, y); if (dd) return { id: Doodles.word(dd), obj: dd, x: dd.x, y: dd.y };
    if (night > 0.45) for (const f of world.flies) if (hypot(f.x - x, f.y - y) < Math.max(30, U * 0.05)) return { id: 'firefly', obj: f, x: f.x, y: f.y };
    for (const b of world.birds) if (hypot(b.x - x, b.y - y) < Math.max(26, U * 0.045)) return { id: 'bird', obj: b, x: b.x, y: b.y };
    for (const f of world.fruits || []) if (hypot(f.x - x, f.y - y) < Math.max(24, f.r * 2.2)) return { id: 'f_' + f.type, obj: f, x: f.x, y: f.y };
    for (let i = world.trees.length - 1; i >= 0; i--) { const t = world.trees[i]; if (!t.dying && t.hit(x, y)) return { id: TREE_WORD[t.type] || 'tree', obj: t, x: t.x, y: t.y - U * 0.15 }; }
    for (let i = world.flowers.length - 1; i >= 0; i--) { const f = world.flowers[i]; if (hypot(f.x - x, f.y - f.h - y) < Math.max(18, f.s * 1.3)) return { id: 'flower', obj: f, x: f.x, y: f.y - f.h }; }
    if (s.sun.up > 0.25 && hypot(x - s.sun.x, y - s.sun.y) < Math.max(44, U * 0.085)) return { id: 'sun', x: s.sun.x, y: s.sun.y };
    if (s.moon.up > 0.25 && hypot(x - s.moon.x, y - s.moon.y) < Math.max(44, U * 0.075)) return { id: 'moon', x: s.moon.x, y: s.moon.y };
    const gy = groundY(x);
    if (y < gy) {
      const rn = rainAt(x, y); if (rn && !cloudAt(x, y)) return { id: 'rain', obj: rn, x, y };
      const cl = cloudAt(x, y); if (cl) return { id: 'cloud', obj: cl, x: cl.x, y: cl.y - cl.w * 0.15 };
      if (rainbowHit(x, y)) return { id: 'rainbow', x, y };
      let ridge = Infinity; for (let i = 0; i < Sky.layers.length; i++) ridge = Math.min(ridge, Sky.ridgeY(i, x));
      if (y > ridge + U * 0.01 && y < gy - U * 0.01) return { id: 'mountain', x, y };
      if (night > 0.55) return { id: 'star', x, y };
      return { id: 'sky', x, y };
    }
    return { id: 'grass', x, y };
  }
  // is there one of these on screen right now? (for I Spy) → a spot to point at, or null
  function where(id) {
    const s = world.sky, night = s.night, live = world.trees.filter(t => !t.dying && t.g >= 0.6);
    const onScreen = o => o.x > 20 && o.x < W - 20 && o.y > 20 && o.y < H - 20;
    switch (id) {
      case 'sun': return s.sun.up > 0.5 && night < 0.4 ? { x: s.sun.x, y: s.sun.y } : null;
      case 'moon': return s.moon.up > 0.5 && night > 0.45 ? { x: s.moon.x, y: s.moon.y } : null;
      case 'star': return night > 0.7 ? { x: W * 0.5, y: H * 0.15 } : null;
      case 'cloud': { const c = world.clouds.find(c => c.a > 0.6 && c.x > c.w * 0.4 && c.x < W - c.w * 0.4); return c ? { x: c.x, y: c.y - c.w * 0.15 } : null; }
      case 'rain': { const c = world.clouds.find(c => c.rain > 2.5 && c.x > 40 && c.x < W - 40); return c ? { x: c.x, y: (c.y + groundY(c.x)) / 2 } : null; }
      case 'rainbow': return world.rainbow.a > 0.6 && night < 0.3 && world.rainbow.life > 6 ? { x: clamp(W - s.sun.x, W * 0.2, W * 0.8), y: GROUND + U * 0.08 - U * 0.55 } : null;
      case 'mountain': return { x: W * 0.5, y: (Sky.ridgeY(2, W * 0.5) + groundY(W * 0.5)) / 2 };
      case 'grass': return { x: W * 0.5, y: (groundY(W * 0.5) + H) / 2 };
      case 'sky': return night < 0.5 ? { x: W * 0.5, y: H * 0.12 } : null;
      case 'flower': { const f = world.flowers.find(f => f.x > 30 && f.x < W - 30); return f ? { x: f.x, y: f.y - f.h } : null; }
      case 'tree': return live.length ? { x: live[0].x, y: live[0].y - U * 0.15 } : null;
      case 'bird': { const b = world.birds.find(onScreen); return b ? { x: b.x, y: b.y } : null; }
      case 'firefly': { const f = night > 0.5 && world.flies.find(onScreen); return f ? { x: f.x, y: f.y } : null; }
    }
    if (TREE_WORD[id]) { const t = live.find(t => t.type === id); return t ? { x: t.x, y: t.y - U * 0.15 } : null; }
    if (id.startsWith('f_')) { const f = (world.fruits || []).find(f => 'f_' + f.type === id && f.rest); return f ? { x: f.x, y: f.y } : null; }
    if (id.startsWith('friend:')) { const k = +id.slice(7), c = world.creatures.find(c => c.birth >= 1 && c.paintIdx === k); return c ? { x: c.comx, y: c.comy } : null; }
    const d = Doodles.find(id); return d ? { x: d.x, y: d.y } : null;
  }
  // does what was tapped answer the question?
  function matches(target, hit) {
    if (target === hit.id) return true;
    if (target === 'tree' && TREE_WORD[hit.id]) return true;
    if (target === 'star' && hit.id === 'sky' && world.sky.night > 0.5) return true;
    if (target === 'rain' && hit.id === 'cloud' && hit.obj && hit.obj.rain > 0) return true;
    if (target.startsWith('friend:') && hit.id === 'friend') return hit.obj.paintIdx === +target.slice(7);
    return false;
  }
  return { at, where, matches };
})();

/* ---------- the word card ---------- */
const WordCard = (() => {
  const el = $('#wcard');
  let cur = null, hideT = 0;
  function ruby(w) {
    const chars = [...w.zh], py = w.py.split(' ');
    return chars.map((c, i) => `<ruby>${c}<rt>${py[i] || ''}</rt></ruby>`).join('');
  }
  function paint() {
    if (!cur) return;
    const w = cur.w, en = isEn();
    $('#wcE').textContent = w.e;
    $('#wcZh').innerHTML = ruby(w);
    $('#wcEn').textContent = w.en;
    $('#wcS').innerHTML = cur.sentence ? (en ? `${w.s[1]}<b>${w.s[0]}</b>` : `${w.s[0]}<b>${w.s[1]}</b>`) : '';
    el.setAttribute('aria-label', w.zh + ' ' + w.en);
  }
  // say the word in both languages (page language first), then the sentence
  function speak(o = {}) {
    if (!cur) return;
    const w = cur.w, en = isEn(), lines = en ? [w.en, w.zh] : [w.zh, w.en];
    if (o.sentence !== false && cur.sentence) lines.push(w.s[en ? 1 : 0]);
    if (o.lead) lines.unshift(o.lead);
    Voice.seq(lines, 'learn', o.onend);
  }
  function show(id, o = {}) {
    const w = WORD[id]; if (!w) return;
    cur = { w, sentence: o.sentence !== false };
    paint();
    el.hidden = false; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    clearTimeout(hideT); if (o.stay === false || o.hideAfter) hideT = setTimeout(hide, o.hideAfter || 3500);
    if (o.speak !== false) speak(o);
  }
  function hide() { clearTimeout(hideT); if (!cur) return; el.classList.remove('on'); setTimeout(() => { if (!el.classList.contains('on')) el.hidden = true; }, 300); cur = null; }
  el.addEventListener('pointerdown', e => e.stopPropagation());
  el.addEventListener('click', () => { Snd.pop(W / 2, 0.08); speak(); });
  onLang(paint);
  return { show, hide, speak, get id() { return cur && cur.w.id; } };
})();

/* ---------- words the child has met (saved in this browser) ---------- */
const Words = (() => {
  const KEY = 'zaowu-words-v1';
  let got = [];
  try { got = JSON.parse(localStorage.getItem(KEY) || '[]').filter(id => WORD[id]); } catch (_) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(got)); } catch (_) { } };
  return {
    meet(id) { if (!WORD[id] || got.includes(id)) return false; got.push(id); save(); if (got.length >= 10) Stickers.give('words'); return true; },
    has: id => got.includes(id),
    get count() { return got.length; },
    get list() { return got.slice(); },
  };
})();

/* ---------- a little ring that says "here it is" ---------- */
const Marks = {
  list: [],
  add(x, y, col, life = 1.4) { this.list.push({ x, y, t: 0, life, col: col || '#ffe7a8' }); },
  update(dt) { for (let i = this.list.length - 1; i >= 0; i--) { const m = this.list[i]; m.t += dt; if (m.t > m.life) this.list.splice(i, 1); } },
  draw(c) {
    for (const m of this.list) {
      const k = m.t / m.life, r = U * (0.03 + 0.07 * easeOutCubic(Math.min(1, k * 1.6)));
      c.save(); c.globalAlpha = (1 - k) * 0.95; c.strokeStyle = m.col; c.lineWidth = Math.max(2, U * 0.006);
      c.beginPath(); c.arc(m.x, m.y, r, 0, TAU); c.stroke();
      c.globalAlpha = (1 - k) * 0.5; c.beginPath(); c.arc(m.x, m.y, r * 0.62, 0, TAU); c.stroke(); c.restore();
    }
  },
};

/* ---------- a microphone that only listens when asked ----------
   The recording stays in this page and is thrown away after the
   friend has said it back. */
const Mic = (() => {
  let stream = null, src = null, proc = null, sink = null, chunks = [], state = 'idle', t0 = 0, spoke = 0, quiet = 0, floor = 0.004, cb = null;
  const ok = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (window.AudioContext || window.webkitAudioContext));
  async function start(o) {
    if (state !== 'idle') return false;
    cb = o; state = 'opening';
    try {
      Snd.init(); const ac = Snd.ctx; if (!ac) throw new Error('no audio');
      if (ac.state === 'suspended') await ac.resume();
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (state !== 'opening') { stop(true); return false; }
      src = ac.createMediaStreamSource(stream); proc = ac.createScriptProcessor(2048, 1, 1); sink = ac.createGain(); sink.gain.value = 0;
      src.connect(proc); proc.connect(sink); sink.connect(ac.destination);
      chunks = []; t0 = ac.currentTime; spoke = 0; quiet = 0; floor = 0.004; state = 'rec';
      Snd.duck(true);
      proc.onaudioprocess = e => {
        if (state !== 'rec') return;
        const d = e.inputBuffer.getChannelData(0); chunks.push(new Float32Array(d));
        let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i];
        const rms = Math.sqrt(s / d.length), t = ac.currentTime - t0, dur = d.length / ac.sampleRate;
        if (t < 0.35) floor = Math.max(floor, rms * 1.2);
        const loud = rms > Math.max(0.018, floor * 2.5);
        if (cb && cb.level) cb.level(clamp(rms * 9, 0, 1));
        if (loud) { spoke += dur; quiet = 0; } else if (spoke > 0.25) quiet += dur;
        if ((spoke > 0.3 && quiet > 0.95) || t > 7 || (spoke === 0 && t > 5.5)) finish();
      };
      return true;
    } catch (err) { state = 'idle'; release(); if (cb && cb.fail) cb.fail(err); return false; }
  }
  function release() {
    try { if (proc) { proc.onaudioprocess = null; proc.disconnect(); } if (src) src.disconnect(); if (sink) sink.disconnect(); } catch (_) { }
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = src = proc = sink = null;
    Snd.duck(false);
  }
  function finish() {
    if (state !== 'rec') return;
    state = 'idle';
    const heard = spoke > 0.3, ac = Snd.ctx;
    let buf = null;
    if (heard && ac) {
      const n = chunks.reduce((a, c) => a + c.length, 0), all = new Float32Array(n); let o = 0; for (const c of chunks) { all.set(c, o); o += c.length; }
      // trim the quiet ends, keep a breath around the words
      const thr = Math.max(0.012, floor * 2), win = 512; let a = 0, b = n;
      const r = i => { let s = 0; for (let k = i; k < Math.min(n, i + win); k++) s += all[k] * all[k]; return Math.sqrt(s / win); };
      while (a < n - win && r(a) < thr) a += win; while (b > a + win && r(b - win) < thr) b -= win;
      a = Math.max(0, a - win * 4); b = Math.min(n, b + win * 6);
      let peak = 0; for (let i = a; i < b; i++) peak = Math.max(peak, Math.abs(all[i]));
      const g = peak > 0 ? Math.min(6, 0.8 / peak) : 1;
      buf = ac.createBuffer(1, b - a, ac.sampleRate); const ch = buf.getChannelData(0);
      for (let i = a; i < b; i++) ch[i - a] = all[i] * g;
    }
    chunks = []; release();
    const c = cb; cb = null; if (c && c.done) c.done(buf);
  }
  function stop(silent) { if (state === 'rec') { if (silent) cb = null; finish(); } else if (state === 'opening') { state = 'idle'; release(); } }
  return { start, stop, ok, get on() { return state !== 'idle'; } };
})();

/* ---------- the three listening & speaking games ---------- */
const Learn = (() => {
  const bar = $('#modeBar'), info = $('#modeInfo'), dock = $('#dock');
  let mode = null, timers = [], invited = false;
  try { invited = localStorage.getItem('zaowu-dock-invited') === '1'; } catch (_) { }
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearT = () => { timers.forEach(clearTimeout); timers = []; };
  const awake = () => world.creatures.filter(c => c.birth >= 1 && !c.grab);

  function openBar(titleKey) {
    $('#modeTitle').textContent = L(titleKey); $('#modeExit').textContent = L('echo_exit');
    bar.hidden = false; requestAnimationFrame(() => bar.classList.add('on'));
  }
  function closeBar() { bar.classList.remove('on'); setTimeout(() => { if (!mode) bar.hidden = true; }, 300); }
  function markDock() { dock.querySelectorAll('.dk').forEach(b => b.classList.toggle('cur', !!mode && b.dataset.m === mode)); }

  function start(m) {
    if (mode === m) { stop(); return; }
    Snd.init(); Voice.unlock();
    stop(true); if (Echo.active) Echo.stop(true); Draw.close(true); Ring.close();
    Story.hush(); document.body.classList.add('gaming');
    mode = m; markDock();
    if (m === 'words') startWords(); else if (m === 'spy') startSpy(); else if (m === 'say') startSay();
  }
  function stop(quiet) {
    if (!mode) return;
    const was = mode; mode = null; clearT(); markDock();
    if (!Draw.active) document.body.classList.remove('gaming');
    Mic.stop(true); Voice.clear('learn'); WordCard.hide(); closeBar();
    if (was === 'say') closeSay();
    if (was === 'spy') spy = null;
    if (!quiet && was === 'words' && wordsMet > 0) Voice.say(L('words_bye'), { role: 'n', prio: 3, tag: 'learn' });
  }

  /* ----- 认一认 · Words ----- */
  let wordsMet = 0;
  function paintWordsInfo() { info.textContent = L('words_count', { n: Words.count }); }
  function startWords() {
    wordsMet = 0; openBar('dock_words'); paintWordsInfo();
    Voice.seq([L('words_on')], 'learn');
  }
  function tapWords(x, y) {
    const hit = Look.at(x, y);
    Marks.add(hit.x, hit.y);
    Snd.pop(x, 0.1);
    if (Words.meet(hit.id)) { wordsMet++; Sparks.burst(hit.x, hit.y, 12, { speed: U * 0.2, g: 0, life: 0.7, size: U * 0.02 }); }
    paintWordsInfo();
    if (hit.id === 'friend') {
      const c = hit.obj; c.happy = 1.2; for (let i = 0; i < c.N; i++) c.vy[i] -= U * 0.4;
      WordCard.show('friend', { onend: () => { if (mode === 'words' && world.creatures.includes(c)) c.speak('c_mycolor', { c: PAINTS[c.paintIdx][isEn() ? 'en' : 'zh'] }, { prio: 2 }); } });
    } else WordCard.show(hit.id);
  }

  /* ----- 找一找 · I Spy ----- */
  let spy = null;
  const SPY_POOL = ['sun', 'moon', 'star', 'cloud', 'rain', 'rainbow', 'mountain', 'grass', 'sky', 'flower', 'tree', 'peach', 'pine', 'maple', 'willow', 'ginkgo', 'bird', 'firefly',
    'f_peach', 'f_pine', 'f_maple', 'f_willow', 'f_ginkgo', 'f_grape', 'f_orange', 'house', 'hat', 'picture'];
  function spyTargets() {
    const out = [];
    for (const id of SPY_POOL) if (Look.where(id)) out.push(id);
    const seen = new Set();
    for (const c of world.creatures) if (c.birth >= 1) { const k = c.paintIdx; if (!seen.has(k)) { seen.add(k); out.push('friend:' + k); } }
    // easy ones last, so the round starts with something interesting
    const easy = ['sky', 'grass', 'mountain'];
    return out.sort((a, b) => (easy.includes(a) ? 1 : 0) - (easy.includes(b) ? 1 : 0) || Math.random() - 0.5);
  }
  function paintSpyDots() {
    info.innerHTML = '';
    for (let k = 0; k < spy.total; k++) { const d = document.createElement('i'); if (k < spy.found) d.className = 'done'; else if (k === spy.found) d.className = 'now'; info.appendChild(d); }
  }
  function startSpy() {
    const list = spyTargets();
    // prefer a mix: no two trees or two fruits in a row
    const pickList = [];
    for (const id of list) { if (pickList.length >= 5) break; const fam = id.startsWith('f_') ? 'f' : id.startsWith('friend') ? 'c' : WORD[id] && ['peach', 'pine', 'maple', 'willow', 'ginkgo', 'tree'].includes(id) ? 't' : id; if (pickList.length && pickList[pickList.length - 1].fam === fam) continue; pickList.push({ id, fam }); }
    for (const id of list) { if (pickList.length >= 5) break; if (!pickList.some(p => p.id === id)) pickList.push({ id }); }
    spy = { list: pickList.map(p => p.id), total: Math.min(5, pickList.length), found: 0, miss: 0, busy: true };
    openBar('dock_spy'); paintSpyDots();
    Voice.seq([L('spy_start')], 'learn', () => later(ask, 250));
    later(() => { if (spy && spy.busy && spy.found === 0 && !spy.asked) ask(); }, 6000);
  }
  function question(id) {
    const en = isEn();
    if (id.startsWith('friend:')) { const p = PAINTS[+id.slice(7)]; return { q: L('spy_friend', { c: p[en ? 'en' : 'zh'] }), other: en ? WORD.friend.zh : WORD.friend.en, word: 'friend' }; }
    const w = WORD[id]; return { q: w.q[en ? 1 : 0], other: en ? w.zh : w.en, word: id };
  }
  function ask() {
    if (!spy || mode !== 'spy') return;
    spy.asked = true; spy.busy = false; spy.miss = 0;
    const id = spy.list[spy.found]; if (!id) return;
    const q = question(id);
    $('#modeTitle').textContent = L('dock_spy') + ' · ' + q.q;
    Voice.seq([q.q, q.other], 'learn');
  }
  function tapSpy(x, y) {
    if (!spy) return;
    const hit = Look.at(x, y);
    Marks.add(hit.x, hit.y, '#fff');
    if (spy.busy) return;
    const id = spy.list[spy.found];
    if (Look.matches(id, hit)) {
      spy.busy = true; spy.found++; paintSpyDots();
      Snd.sparkle(hit.x, 5, 6, 0.12);
      Sparks.burst(hit.x, hit.y, 24, { speed: U * 0.35, g: 0, life: 0.9, size: U * 0.026 });
      if (hit.id === 'friend') { const c = hit.obj; c.happy = 1.5; for (let i = 0; i < c.N; i++) c.vy[i] -= U * 0.6; }
      Words.meet(hit.id === 'friend' ? 'friend' : id.startsWith('friend') ? 'friend' : id);
      const wid = id.startsWith('friend') ? 'friend' : id;
      WordCard.show(wid, { lead: L('spy_ok'), sentence: false, onend: () => later(next, 500) });
      later(() => { if (spy && spy.busy && !Voice.playing('learn')) next(); }, 7000);
    } else {
      spy.miss++;
      Snd.thump(160, 0.06, 0.1);
      if (WORD[hit.id]) WordCard.show(hit.id, { speak: false, sentence: false, stay: false, hideAfter: 2200 });
      const w = Look.where(id);
      if (spy.miss >= 2 && w) { Voice.seq([L('spy_help')], 'learn'); for (let k = 0; k < 4; k++) later(() => Marks.add(w.x, w.y, '#ffe7a8', 1.2), k * 350); }
      else Voice.seq([L('spy_no')], 'learn');
    }
  }
  function next() {
    if (!spy || mode !== 'spy' || !spy.busy) return;
    if (spy.found >= spy.total) {
      spy.busy = true; $('#modeTitle').textContent = L('dock_spy');
      if (spy.total >= 5) Stickers.give('spy');
      Voice.seq([L('spy_win')], 'learn', () => later(() => stop(true), 1200));
      Sparks.burst(W / 2, H * 0.35, 40, { speed: U * 0.5, g: 0, life: 1.2, size: U * 0.03 });
      return;
    }
    // the world may have changed (night fell, a cloud left): skip what is gone
    while (spy.found < spy.total && !Look.where(spy.list[spy.found])) { const alt = spyTargets().find(t => !spy.list.includes(t)); if (alt) spy.list[spy.found] = alt; else { spy.total = spy.found; break; } }
    if (spy.found >= spy.total) { next(); return; }
    WordCard.hide(); ask();
  }

  /* ----- 说一说 · Say It ----- */
  const sheet = $('#sayPanel'), tabs = $('#sayTabs'), tiles = $('#sayTiles'), sent = $('#saySent'), micBtn = $('#sayMic');
  let frame = SAYS[0], item = null, actor = null, said = 0, micFailed = false;
  function chooseActor() {
    const list = awake(); if (!list.length) return null;
    if (Ring.target && list.includes(Ring.target)) return Ring.target;
    if (actor && list.includes(actor)) return actor;
    return list.slice().sort((a, b) => Math.abs(a.comx - W / 2) - Math.abs(b.comx - W / 2))[0];
  }
  function startSay() {
    actor = chooseActor();
    if (!actor) {
      mode = null; markDock();
      Voice.seq([L('say_need')], 'learn', () => Draw.open('friend'));
      return;
    }
    openBar('dock_say'); info.textContent = '';
    paintTabs(); paintTiles(); sent.hidden = true; item = null;
    sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add('on'));
    Voice.seq([L('say_start')], 'learn');
  }
  function closeSay() { clearTimeout(miniT); sheet.classList.remove('on', 'mini'); setTimeout(() => { if (mode !== 'say') sheet.hidden = true; }, 300); }
  function paintTabs() {
    tabs.innerHTML = '';
    for (const f of SAYS) {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = L(f.k);
      b.setAttribute('aria-selected', f === frame ? 'true' : 'false');
      b.addEventListener('click', () => { frame = f; item = null; sent.hidden = true; paintTabs(); paintTiles(); Snd.pop(W / 2, 0.08); });
      tabs.appendChild(b);
    }
  }
  function paintTiles() {
    tiles.innerHTML = '';
    const en = isEn();
    for (const it of frame.items) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tile' + (it === item ? ' pick' : '');
      const pic = it.paint !== undefined ? `<span class="sw" style="background:hsl(${PAINTS[it.paint].h[0]},${PAINTS[it.paint].h[1]}%,${PAINTS[it.paint].h[2] - 8}%)"></span>` : `<span class="te">${it.e}</span>`;
      b.innerHTML = `${pic}<span class="tz">${en ? it.w[1] : it.w[0]}</span><span class="tn">${en ? it.w[0] : it.w[1]}</span>`;
      b.setAttribute('aria-label', it.s[en ? 1 : 0]);
      b.addEventListener('click', () => pickItem(it, b));
      tiles.appendChild(b);
    }
  }
  function mark(s, w) { const i = s.indexOf(w); return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<em>' + esc(w) + '</em>' + esc(s.slice(i + w.length)); }
  function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function paintSentence() {
    if (!item) return;
    const en = isEn(), a = en ? 1 : 0, b = 1 - a;
    $('#sayS1').innerHTML = mark(item.s[a], item.w[a]); $('#sayS2').innerHTML = mark(item.s[b], item.w[b]);
    $('#sayMicL').textContent = L('say_mic'); $('#sayDone').textContent = L('say_done_btn'); $('#sayAgain').textContent = L('say_again_btn');
  }
  function modelLines() { const en = isEn(); return [item.s[en ? 1 : 0], item.s[en ? 0 : 1]]; }
  function pickItem(it, btn) {
    item = it; actor = chooseActor(); sheet.classList.remove('mini');
    tiles.querySelectorAll('.tile').forEach(t => t.classList.toggle('pick', t === btn));
    paintSentence(); sent.hidden = false; micBtn.disabled = false; micBtn.classList.remove('rec');
    $('#sayMic').hidden = micFailed || !Mic.ok();
    Snd.pop(W / 2, 0.1);
    if (actor) { actor.lookAt = null; actor.happy = 0.8; for (let i = 0; i < actor.N; i++) actor.vy[i] -= U * 0.3; Marks.add(actor.comx, actor.comy - actor.R * 0.2, '#ffe7a8'); }
    Voice.seq([...modelLines(), L('say_your')], 'learn');
    sent.scrollIntoView && sent.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function listen() {
    if (!item || Mic.on) { if (Mic.on) Mic.stop(); return; }
    Voice.stopAll();
    micBtn.classList.add('rec'); $('#sayMicL').textContent = L('say_listening');
    Mic.start({
      level: v => { $('#sayLvl').style.width = (v * 100).toFixed(0) + '%'; },
      done: buf => { micBtn.classList.remove('rec'); $('#sayLvl').style.width = '0'; $('#sayMicL').textContent = L('say_mic'); if (buf) parrot(buf); else Voice.seq([L('say_your')], 'learn'); },
      fail: () => { micFailed = true; micBtn.classList.remove('rec'); micBtn.hidden = true; },
    });
  }
  // the friend says it back in a squeaky little voice, then does it
  function parrot(buf) {
    const c = actor && world.creatures.includes(actor) ? actor : chooseActor();
    if (!c) { perform(); return; }
    mini();
    c.bubble = { text: '♪ ♪ ♪', age: 0, life: buf.duration / 1.32 + 0.8, hold: true, talking: true };
    const src = Snd.voiceOut(buf, 1.32, c.comx);
    const end = () => { if (c.bubble) { c.bubble.hold = false; c.bubble.talking = false; } perform(); };
    if (src) src.onended = end; else end();
  }
  // fold the sheet away for a moment so the friend can be seen doing it
  let miniT = 0;
  function mini() { sheet.classList.add('mini'); clearTimeout(miniT); miniT = setTimeout(() => sheet.classList.remove('mini'), 6500); }
  function perform() {
    if (!item || mode !== 'say') return;
    mini();
    said++; if (said >= 3) Stickers.give('say');
    const c = actor && world.creatures.includes(actor) ? actor : chooseActor(), it = item;
    Voice.seq([L('say_good')], 'learn', () => later(() => act(c, it), 150));
  }
  function goTime(target) {
    const from = world.time; let d = target - from; if (d < 0) d += 1;
    const t0 = performance.now(), dur = 2600;
    const step = () => { const k = Math.min(1, (performance.now() - t0) / dur); world.time = (from + d * easeInOut(k)) % 1; if (k < 1 && !Input.draggingSky) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function act(c, it) {
    if (!c) return;
    const f = frame.id === 'like' ? 'like' : SAYS.find(s => s.items.includes(it)).id;
    if (f === 'give') {
      c.wantFood = true; c.full = 0;
      const fr = Fruits.drop(clamp(c.comx + rand(-1, 1) * c.R, 30, W - 30), -30, it.fruit, true);
      if (c.fruit && c.fruit !== fr) c.fruit.claimed = null; c.fruit = fr; fr.claimed = c;
      if (c.sleep) c.wake(null, 0);
      c.speak('c_thanks', null, { prio: 3 });
    } else if (f === 'do') {
      if (it.id === 'sing') c.sing(); else if (it.id === 'dance') c.dance(); else if (it.id === 'flip') c.flip(); else if (it.id === 'jump') c.jumpHigh(); else if (it.id === 'spin') c.spin(); else c.nap('c_sleep');
    } else if (f === 'like') {
      c.setPaint(it.paint);
    } else if (f === 'want') {
      c.speak('c_okay', null, { prio: 3 });
      if (it.id === 'rain') { Weather.addUserCloud(clamp(c.comx, W * 0.15, W * 0.85), clamp(GROUND - U * 0.45, H * 0.12, H)); Story.event('cloud'); }
      else if (it.id === 'rainbow') { if (world.sky.night > 0.2) goTime(0.36); later(() => { world.rainbow.life = 16; Snd.sparkle(W / 2, 6, 7, 0.1); Creatures.react('rainbow'); Story.event('rainbow'); }, world.sky.night > 0.2 ? 2700 : 200); }
      else if (it.id === 'wind') { const d = Math.random() < 0.5 ? -1 : 1; Weather.gust(W / 2 - d * U * 0.4, H * 0.3, W / 2 + d * U * 0.4, H * 0.3, U * 4); }
      else if (it.id === 'stars') goTime(0.9);
      else if (it.id === 'sun') goTime(0.34);
      else if (it.id === 'flowers') { for (let i = 0; i < 24; i++) later(() => { const x = rand(W * 0.04, W * 0.96), gy = groundY(x); Flowers.add(x, gy + rand(0.02, 0.85) * (H - gy)); if (i % 3 === 0) Snd.pluck(5 + (i % 7), x, 0.1, 0.8); }, i * 60); }
    } else if (f === 'hi') {
      if (it.id === 'night') { c.nap('c_r_night'); return; }
      if (it.id === 'morning') { goTime(0.3); world.creatures.forEach(o => { if (o.sleep) { o.napT = 0; o.sleep = 0; o.sleepT = rand(2, 8); } }); }
      if (c.sleep) c.wake(null, 0);
      c.speak(it.reply, null, { prio: 3 }); c.happy = 2;
      for (let i = 0; i < c.N; i++) c.vy[i] -= U * 0.55;
      if (it.id === 'love') for (let k = 0; k < 8; k++) Sparks.sign(c.comx + rand(-1, 1) * c.R, c.comy - c.R * rand(0.6, 1.3), '♥', '#ff7aa0', rand(0.8, 1.3));
      if (it.id === 'bye') c.targetX = c.comx < W / 2 ? c.comx + U * 0.4 : c.comx - U * 0.4;
    }
  }
  micBtn.addEventListener('click', listen);
  $('#sayDone').addEventListener('click', () => { if (!item) return; Mic.stop(true); perform(); });
  $('#sayAgain').addEventListener('click', () => { if (!item) return; Mic.stop(true); Voice.seq(modelLines(), 'learn'); });
  sheet.addEventListener('pointerdown', e => e.stopPropagation());
  sheet.addEventListener('click', e => { if (sheet.classList.contains('mini') && !e.target.closest('button')) { clearTimeout(miniT); sheet.classList.remove('mini'); } });

  /* ----- the dock ----- */
  dock.querySelectorAll('.dk[data-m]').forEach(b => b.addEventListener('click', () => { const m = b.dataset.m; if (m === 'draw') { stop(true); if (Echo.active) Echo.stop(true); Draw.open(); } else start(m); }));
  $('#modeExit').addEventListener('click', () => stop(false));
  function paintDock() {
    $('#dlWords').textContent = L('dock_words'); $('#dlSpy').textContent = L('dock_spy'); $('#dlSay').textContent = L('dock_say'); $('#dlDraw').textContent = L('dock_draw');
    dock.setAttribute('aria-label', L('dock_words') + ' · ' + L('dock_spy') + ' · ' + L('dock_say') + ' · ' + L('dock_draw'));
    if (mode) $('#modeTitle').textContent = L(mode === 'words' ? 'dock_words' : mode === 'spy' ? 'dock_spy' : 'dock_say');
    $('#modeExit').textContent = L('echo_exit');
    if (mode === 'words') paintWordsInfo();
    if (mode === 'say') { paintTabs(); paintTiles(); paintSentence(); }
    if (mode === 'spy' && spy && !spy.busy) ask();
  }
  onLang(paintDock);
  paintDock();

  return {
    start, stop,
    get mode() { return mode; },
    get capturing() { return mode === 'words' || mode === 'spy'; },
    tap(x, y) { if (mode === 'words') tapWords(x, y); else if (mode === 'spy') tapSpy(x, y); },
    update(dt) {
      Marks.update(dt);
      const show = world.phase === 'world' && ['friends', 'shake', 'night', 'nightfall', 'free', 'done'].includes(Story.step);
      if (show && dock.hidden) { dock.hidden = false; document.body.classList.add('docked'); requestAnimationFrame(() => dock.classList.add('on')); }
      if (show && !invited && ['done', 'free'].includes(Story.step) && !Voice.busy && !mode && !Draw.active) { invited = true; try { localStorage.setItem('zaowu-dock-invited', '1'); } catch (_) { } later(() => { if (!mode && !Draw.active) { Voice.narrate(L('dock_invite'), 'invite'); dock.classList.add('hello'); setTimeout(() => dock.classList.remove('hello'), 4000); } }, 1500); }
      if (mode === 'say' && actor && !world.creatures.includes(actor)) actor = chooseActor();
    },
  };
})();
