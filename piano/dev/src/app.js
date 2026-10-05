// 彩虹钢琴 · the game around the piano: opening it, the four ways to play, the buttons
import * as THREE from 'three';
import { Snd } from './audio.js';
import { Voice } from './voice.js';
import { SONGS, songById } from './songs.js';
import { L, PAINTS, INST_ZH } from './lines.js';
import { buildSheet } from './sheet.js';
import { buildGuide } from './guide.js';
import { K, LOW, HIGH, isBlack, keyX, whiteIndex, colorOf, cssColor, degree, REGISTERS, HEX, MIDDLE_C } from './notes.js';
import { $, $$, el, Bus, Tick, Store, clamp, pick, later, rand } from './core.js';

export function buildApp(ctx) {
  const { stage, piano, rig, fx, player, input, camera } = ctx;
  const sheet = buildSheet(piano);
  const guide = buildGuide(stage.scene, piano);
  Tick.add(dt => guide.update(dt));

  /* ---------- settings (follow 思维小画本's switches for sound and voice) ---------- */
  const S = Object.assign({
    inst: 'piano', paint: 'black', night: false, labels: 'solfege', keys: 'm', accomp: true, sound: true, voice: true, fx: 'full', names: true,
  }, Store.get('prefs', {}));
  try {
    const r = JSON.parse(localStorage.getItem('logicc.design.v2') || 'null');
    if (r && !Store.get('prefs', null)) { if (typeof r.voi === 'boolean') S.voice = r.voi; if (typeof r.snd === 'boolean') S.sound = r.snd; }
  } catch (_) { }
  const save = () => Store.set('prefs', S);
  // how many white keys fit on screen: set by how wide a key should be under a child's finger
  const KEY_PX = { xl: 112, l: 92, m: 74, s: 52 };
  const spanFor = k => k === 'all' ? 53 : clamp(Math.round((window.innerWidth || 1024) / KEY_PX[k || 'm']), 7, 52);
  const SPAN = new Proxy({}, { get: (_, k) => spanFor(k) });
  window.addEventListener('resize', () => { if (rig.mode === 'play' && Mode.name !== 'learn') rig.setSpan(spanFor(S.keys)); });
  const done = Store.get('done', {});      // songId -> times finished

  Snd.on = S.sound; Voice.on = S.voice; Snd.inst = S.inst;
  fx.style = S.inst; fx.names = S.names; fx.quiet = fx.quiet || S.fx === 'less';
  piano.setLabels(S.labels); sheet.setLabels(S.labels === 'none' || S.labels === 'color' ? 'solfege' : S.labels);
  piano.setColor((PAINTS.find(p => p.id === S.paint) || PAINTS[0]).hex, true);
  rig.setSpan(SPAN[S.keys] || 15);

  /* ---------- loading ---------- */
  const ld = { bar: $('#ldBar'), msg: $('#ldMsg') };
  Snd.init();
  const loadP = Snd.load('./', p => { ld.bar.style.width = (8 + p * 92) + '%'; if (p > 0.3) ld.msg.textContent = '正在给琴弦调音…'; }).catch(() => { ld.msg.textContent = '钢琴的声音没下载下来，先用电子琴的声音'; });
  Voice.load();
  const ready = Promise.race([loadP, new Promise(r => setTimeout(r, 6000))]);
  ready.then(() => later(250, () => { $('#loader').classList.add('gone'); intro(); }));

  /* ---------- helpers ---------- */
  const hud = $('#hud');
  let bubbleT = 0;
  Bus.on('subtitle', t => {
    const b = $('#bubble');
    if (!t) return;
    // sit just under whatever bars are showing at the top
    let y = 0;
    ['#top', '#nav', '#lesson', '#score', '#concert', '#echo'].forEach(q => { const n = $(q); if (n && !n.hidden && n.offsetParent !== null) y = Math.max(y, n.getBoundingClientRect().bottom); });
    b.style.top = (y + 10) + 'px';
    b.textContent = t; b.classList.add('on'); clearTimeout(bubbleT);
    bubbleT = setTimeout(() => b.classList.remove('on'), 1600 + t.length * 230);
  });
  function say(t, o) { Voice.say(t, o); }
  function toast(t) { const n = $('#toast'); n.textContent = t; n.classList.add('on'); clearTimeout(n._t); n._t = setTimeout(() => n.classList.remove('on'), 1800); }
  function press(btn) { btn.classList.add('press'); setTimeout(() => btn.classList.remove('press'), 140); }
  function tapSound(i = 0) { Snd.ui('tap', i); }
  const vec = new THREE.Vector3();
  const sceneCenter = new THREE.Vector3(0, 1.25, -0.6);

  function cheer(big, text, stars = 0) {
    const n = el('div', 'cheer');
    n.innerHTML = `<div class="big">${big}</div><div class="t">${text}</div>` + (stars ? `<div class="stars">${'⭐'.repeat(stars).split('').map((s, i) => `<span style="animation-delay:${0.25 + i * 0.18}s">${s}</span>`).join('')}</div>` : '');
    document.body.appendChild(n); setTimeout(() => n.remove(), 3300);
    // fireworks around wherever the camera is looking
    const cam = camera.position, fwd = new THREE.Vector3(); camera.getWorldDirection(fwd);
    const base = cam.clone().addScaledVector(fwd, rig.mode === 'play' ? 0.5 : 2.2);
    const sc = rig.mode === 'play' ? 0.35 : 1;
    for (let k = 0; k < 5; k++) later(k * 260, () => {
      const p = base.clone().add(new THREE.Vector3(rand(-0.6, 0.6) * sc * 2, rand(0.1, 0.5) * sc * 2, rand(-0.3, 0.3) * sc));
      fx.firework(p, colorOf(60 + [0, 4, 7, 12, 16][k]), sc);
    });
    fx.confetti(base, 110, sc * 1.3);
    Snd.chord([60, 64, 67, 72], { inst: 'musicbox', spread: 0.07, vel: 0.6, dur: 1.5 });
    later(420, () => Snd.chord([67, 72, 76, 79], { inst: 'musicbox', spread: 0.06, vel: 0.55, dur: 2 }));
  }

  /* ---------- the miniature keyboard (navigator) ---------- */
  const mini = $('#mini'), miniKeys = $('#miniKeys'), miniWin = $('#miniWin'), miniAnimals = $('#miniAnimals');
  const miniEls = {};
  for (let m = LOW; m <= HIGH; m++) {
    const i = el('i', isBlack(m) ? 'b' : (m === MIDDLE_C ? 'c4' : ''));
    if (isBlack(m)) { const x = (keyX(m) + K.HALF) / (2 * K.HALF); i.style.left = `calc(${x * 100}% - 0.7%)`; i.style.width = '1.4%'; }
    else { const w = whiteIndex(m); i.style.left = (w / K.N_WHITE * 100) + '%'; i.style.width = (100 / K.N_WHITE) + '%'; }
    miniKeys.appendChild(i); miniEls[m] = i;
  }
  REGISTERS.forEach((r, i) => {
    const mid = (keyX(Math.min(r.to, Math.max(r.from, r.from + 6))) + K.HALF) / (2 * K.HALF);
    const s = el('span', null, r.e); s.style.left = (mid * 100) + '%'; s.dataset.i = i; miniAnimals.appendChild(s);
  });
  Bus.on('note', m => { const e = miniEls[m]; if (!e) return; e.style.setProperty('--c', cssColor(m)); e.classList.add('lit'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('lit'), 260); });
  let lastAnimal = -1;
  Tick.add(() => {
    const [a, b] = rig.visibleRange();
    const w = mini.clientWidth - 16;
    miniWin.style.left = (8 + clamp(a, 0, K.N_WHITE) / K.N_WHITE * w) + 'px';
    miniWin.style.width = Math.max(8, (clamp(b, 0, K.N_WHITE) - clamp(a, 0, K.N_WHITE)) / K.N_WHITE * w) + 'px';
    const cm = rig.cx; let ai = 0; REGISTERS.forEach((r, i) => { if (cm >= keyX(r.from) - K.W / 2) ai = i; });
    if (ai !== lastAnimal) { $$('#miniAnimals span').forEach((s, i) => s.classList.toggle('here', i === ai)); lastAnimal = ai; }
  });
  function miniTo(clientX) { const r = miniKeys.getBoundingClientRect(); const u = clamp((clientX - r.left) / r.width, 0, 1); rig.lookAtX(u * 2 * K.HALF - K.HALF); }
  let miniDrag = null;
  mini.addEventListener('pointerdown', e => { miniDrag = { x: e.clientX }; mini.setPointerCapture(e.pointerId); miniTo(e.clientX); if (rig.mode !== 'play') setView('play'); });
  mini.addEventListener('pointermove', e => { if (miniDrag) miniTo(e.clientX); });
  mini.addEventListener('pointerup', e => {
    const d = miniDrag; miniDrag = null;
    if (!d || Math.abs(e.clientX - d.x) > 8) return;
    // a tap: say whose home this part of the keyboard is (an elephant's low down, a bird's up high)
    const r = miniKeys.getBoundingClientRect(), x = clamp((e.clientX - r.left) / r.width, 0, 1) * 2 * K.HALF - K.HALF;
    const m = nearestWhiteAtX(x), i = REGISTERS.findIndex(g => m >= g.from && m <= g.to);
    if (i >= 0) { say(L.register(i, i >= 4)); Snd.noteOn(m, 0.6, { inst: S.inst, dur: 0.5 }); }
  });
  function shiftOctave(dir) {
    if (rig.mode !== 'play') setView('play');
    rig.lookAtX((rig.cx ?? 0) + dir * 7 * K.W);
    const m = nearestWhiteAtX(rig.cx + dir * 7 * K.W);
    Snd.noteOn(m, 0.5, { inst: S.inst, dur: 0.4 });
  }
  $('#navL').addEventListener('click', e => { press(e.currentTarget); shiftOctave(-1); });
  $('#navR').addEventListener('click', e => { press(e.currentTarget); shiftOctave(1); });
  function nearestWhiteAtX(x) { let best = 60, bd = 9; for (let m = LOW; m <= HIGH; m++) if (!isBlack(m) && Math.abs(keyX(m) - x) < bd) { bd = Math.abs(keyX(m) - x); best = m; } return best; }

  /* ---------- views ---------- */
  function setView(v) {
    if (v === 'play') { rig.setMode('play', { dur: 1.6 }); $('#viewBtn .ic').textContent = '👀'; $('#viewBtn .lb').textContent = '看钢琴'; $('#nav').hidden = false; }
    else { rig.setMode(v, { dur: 1.6, theta: 0.62, phi: 1.05, radius: 3.4 }); $('#viewBtn .ic').textContent = '🎹'; $('#viewBtn .lb').textContent = '展开键盘'; $('#nav').hidden = true; }
    Snd.ui('whoosh');
  }
  $('#viewBtn').addEventListener('click', e => {
    press(e.currentTarget);
    if (rig.mode === 'play') { setView('show'); say(L.view); } else { setView('play'); say(L.play); }
  });

  /* ---------- instruments ---------- */
  const instColors = { piano: '#FF7A59', musicbox: '#A55EEA', marimba: '#E8590C', chip: '#1FC8DB' };
  function setInst(k, speak) {
    S.inst = k; Snd.inst = k; fx.style = k; save();
    $$('#rail .inst').forEach(b => { b.classList.toggle('on', b.dataset.inst === k); b.style.setProperty('--c', instColors[b.dataset.inst]); });
    if (speak) { say(L.inst(k)); Snd.chord([60, 64, 67], { inst: k, spread: 0.08, vel: 0.6, dur: 0.6 }); }
  }
  $$('#rail .inst').forEach(b => b.addEventListener('click', () => { press(b); setInst(b.dataset.inst, true); }));
  setInst(S.inst);

  /* ---------- day / night ---------- */
  function setNight(v, speak) {
    S.night = v; stage.setNight(v); document.body.classList.toggle('night', v);
    $('#nightBtn .ic').textContent = v ? '☀️' : '🌙';
    document.querySelector('meta[name=theme-color]').content = v ? '#0B0B24' : '#F7EDE6';
    if (speak) say(v ? L.night : L.day);
  }
  $('#nightBtn').addEventListener('click', e => { press(e.currentTarget); setNight(!S.night, true); save(); Snd.ui(S.night ? 'close' : 'open'); });
  setNight(S.night);

  /* ---------- paint ---------- */
  const paintBox = $('#paint');
  PAINTS.forEach(p => {
    const b = el('button', 'swatch'); b.style.setProperty('--c', p.hex); b.setAttribute('aria-label', p.zh);
    b.addEventListener('click', () => {
      S.paint = p.id; save(); piano.setColor(p.hex);
      $$('.swatch', paintBox).forEach(x => x.classList.toggle('on', x === b));
      say(L.paint(p));
      Snd.chord([72, 76, 79, 84], { inst: 'musicbox', spread: 0.05, vel: 0.5, dur: 0.8 });
      fx.burst(vec.set(0, 1.05, -0.7), 50, { colors: [new THREE.Color(p.hex), new THREE.Color('#fff'), new THREE.Color(pick(HEX))], scale: rig.mode === 'play' ? 0.5 : 1 });
      later(500, () => paintBox.hidden = true);
    });
    if (p.id === S.paint) b.classList.add('on');
    paintBox.appendChild(b);
  });
  $('#paintBtn').addEventListener('click', e => { press(e.currentTarget); closeSheets('paint'); paintBox.hidden = !paintBox.hidden; tapSound(3); });

  /* ---------- pedal ---------- */
  $('#pedalBtn').addEventListener('click', e => {
    const on = !Snd.sustain; Snd.setSustain(on); piano.setSustain(on);
    e.currentTarget.setAttribute('aria-pressed', on); press(e.currentTarget);
    say(on ? L.pedalOn : L.pedalOff);
  });

  /* ---------- settings ---------- */
  const panel = $('#panel'), rows = $('#panelRows');
  function row(k, opts, cur, onPick, desc) {
    const r = el('div', 'row'); r.appendChild(el('div', 'k', k));
    const seg = el('div', 'seg');
    opts.forEach(([v, t]) => { const b = el('button', v === cur ? 'on' : '', t); b.addEventListener('click', () => { $$('button', seg).forEach(x => x.classList.toggle('on', x === b)); onPick(v); tapSound(2); }); seg.appendChild(b); });
    r.appendChild(seg); if (desc) r.appendChild(el('div', 'd', desc)); rows.appendChild(r);
  }
  function buildPanel() {
    rows.innerHTML = '';
    row('琴键上写', [['solfege', 'do re mi'], ['number', '1 2 3'], ['letter', 'C D E'], ['color', '只有颜色'], ['none', '不写']], S.labels, v => { S.labels = v; piano.setLabels(v); sheet.setLabels(v === 'none' || v === 'color' ? 'solfege' : v); save(); }, '琴键上的小圆贴，按七种颜色区分 do re mi');
    row('琴键大小', [['xl', '特大'], ['l', '大'], ['m', '中'], ['s', '小'], ['all', '全部 88 键']], S.keys, v => { S.keys = v; rig.setSpan(SPAN[v]); if (rig.mode !== 'play') setView('play'); save(); }, '坐下弹的时候，一屏放几个键。也可以在琴键上方用两根手指捏合缩放');
    row('飘出唱名', [[true, '开'], [false, '关']], S.names, v => { S.names = v; fx.names = v; save(); });
    row('跟我弹伴奏', [[true, '开'], [false, '关']], S.accomp, v => { S.accomp = v; save(); }, '孩子按对一个音，钢琴就配上和弦，听起来像在弹整首曲子');
    row('特效', [['full', '多'], ['less', '少']], S.fx, v => { S.fx = v; fx.quiet = v === 'less'; save(); });
    row('声音', [[true, '开'], [false, '关']], S.sound, v => { S.sound = v; Snd.setOn(v); save(); });
    row('语音', [[true, '开'], [false, '关']], S.voice, v => { S.voice = v; Voice.on = v; if (!v) Voice.stop(); save(); });
  }
  $('#gearBtn').addEventListener('click', e => { press(e.currentTarget); closeSheets('panel'); buildPanel(); panel.hidden = !panel.hidden; tapSound(1); });
  function closeSheets(except) {
    if (except !== 'paint') paintBox.hidden = true;
    if (except !== 'panel') panel.hidden = true;
    if (except !== 'shelf') $('#shelf').hidden = true;
  }
  $$('[data-close]').forEach(b => b.addEventListener('click', () => { b.closest('.sheet').hidden = true; tapSound(0); if (b.closest('#shelf') && !Mode.active) setMode('free'); }));
  Bus.on('touch', () => { paintBox.hidden = true; });

  /* ===================== modes ===================== */
  const Mode = { name: null, active: null };
  const modeColors = { free: ['#FF7A59', '#FF4F8B'], learn: ['#FFC94A', '#FF8A3D'], listen: ['#7C8CFF', '#A55EEA'], echo: ['#3DD68C', '#12B8A6'] };
  function moveThumb() {
    const tab = $(`#modes [data-mode="${Mode.name}"]`); if (!tab) return;
    const th = $('#modes .thumb');
    th.style.width = tab.offsetWidth + 'px'; th.style.transform = `translateX(${tab.offsetLeft - 5}px)`;
    const [a, b] = modeColors[Mode.name]; th.style.setProperty('--a', a); th.style.setProperty('--b', b);
    $$('#modes [role=tab]').forEach(t => t.setAttribute('aria-selected', t === tab));
  }
  window.addEventListener('resize', () => later(50, moveThumb));
  $$('#modes [role=tab]').forEach((b, i) => b.addEventListener('click', () => { tapSound(i + 1); setMode(b.dataset.mode, true); }));

  function setMode(name, fromTab) {
    if (Mode.active && Mode.active.stop) Mode.active.stop();
    Mode.active = null; Mode.name = name; moveThumb();
    closeSheets();
    ['#lesson', '#concert', '#echo'].forEach(s => $(s).hidden = true);
    $('#rail2').hidden = false; $('#rail').hidden = false;
    guide.clear(); piano.clearHints(); input.filter = null;
    $('#recBtn').hidden = name !== 'free'; $('#playRecBtn').hidden = name !== 'free' || !Store.get('rec', null);
    if (name === 'free') { Mode.active = Free; Free.start(fromTab); }
    else if (name === 'learn') { showShelf('learn'); }
    else if (name === 'listen') { showShelf('listen'); }
    else if (name === 'echo') { Mode.active = Echo; Echo.start(); }
  }

  /* ---------- song shelf ---------- */
  function showShelf(kind) {
    const list = $('#shelfList'); list.innerHTML = '';
    $('#shelfTitle').textContent = kind === 'learn' ? '⭐ 选一首歌，跟着亮灯弹' : '🎧 选一首，钢琴自己弹';
    let songs = SONGS.filter(s => kind === 'listen' || !s.listenOnly);
    if (kind === 'listen') songs = songs.filter(s => s.listenOnly).concat(songs.filter(s => !s.listenOnly));
    const rec = Store.get('rec', null);
    if (kind === 'listen' && rec && rec.ev && rec.ev.length) songs = [{ id: '__rec', title: '我弹的歌', emoji: '🎙️', a: '#FF8FAB', b: '#FF4F8B', stars: 0 }].concat(songs);
    songs.forEach((s, i) => {
      const c = el('button', 'song');
      c.style.setProperty('--a', s.a); c.style.setProperty('--b', s.b); c.style.setProperty('--s', s.b + '55'); c.style.animationDelay = (i * 0.03) + 's';
      c.innerHTML = `<span class="em">${s.emoji}</span><span class="nm">${s.title}</span>` + (s.stars ? `<span class="st">${'★'.repeat(s.stars)}${'☆'.repeat(3 - s.stars)}</span>` : '<span class="st">刚刚录的</span>') +
        (kind === 'learn' && done[s.id] ? `<span class="done">${done[s.id] >= 3 ? '👑' : '🏅'}</span>` : '');
      c.addEventListener('click', () => {
        press(c); Snd.ui('pop');
        $('#shelf').hidden = true;
        if (kind === 'learn') { Mode.active = Learn; Learn.start(s); }
        else if (s.id === '__rec') { Mode.active = Listen; Listen.startRec(rec); }
        else { Mode.active = Listen; Listen.start(s); }
      });
      list.appendChild(c);
    });
    $('#shelf').hidden = false;
    say(kind === 'learn' ? L.learnPick : L.listenPick);
  }

  /* ---------- a scheduler that plays notes on the audio clock and moves the keys in time ---------- */
  function Scheduler(events, o = {}) {
    // events: [{ t (s), m, d (s), v, part }]
    events = events.slice().sort((a, b) => a.t - b.t);
    const lead = 0.12;
    let start = 0, ai = 0, vi = 0, playing = false, pausedAt = 0;
    const ups = [];
    const S2 = {
      get playing() { return playing; },
      get progress() { return playing || pausedAt ? clamp(((playing ? Snd.time() - start : pausedAt)) / (o.length || 1), 0, 1) : 0; },
      play(from = 0) { Snd.init(); start = Snd.time() + 0.25 - from; playing = true; pausedAt = 0; ai = events.findIndex(e => e.t >= from); if (ai < 0) ai = events.length; vi = ai; },
      pause() { if (!playing) return; pausedAt = Snd.time() - start; playing = false; Snd.allOff(); ups.forEach(u => player.up(u.m, { src: u.src })); ups.length = 0; },
      resume() { if (playing) return; S2.play(pausedAt); },
      stop() { playing = false; pausedAt = 0; Snd.allOff(); ups.forEach(u => player.up(u.m, { src: u.src })); ups.length = 0; },
      tick() {
        if (!playing) return;
        const now = Snd.time() - start;
        while (ai < events.length && events[ai].t < now + lead) {
          const e = events[ai++];
          Snd.noteOn(e.m, e.v ?? 0.7, { when: start + e.t, dur: Math.max(0.08, e.d * 0.98) });
        }
        // visuals follow what is actually heard (output latency included)
        const heard = now - (Snd.ctx.outputLatency || Snd.ctx.baseLatency || 0.02);
        while (vi < events.length && events[vi].t <= heard) {
          const e = events[vi++];
          const src = e.part === 'acc' ? 'acc' : 'auto';
          player.down(e.m, { src, sound: false, vel: e.v, name: e.part === 'acc' ? false : undefined });
          ups.push({ m: e.m, src, at: e.t + Math.max(0.06, e.d * 0.92) });
          if (o.onNote) o.onNote(e);
        }
        for (let k = ups.length - 1; k >= 0; k--) if (ups[k].at <= heard) { player.up(ups[k].m, { src: ups[k].src }); ups.splice(k, 1); }
        if (vi >= events.length && !ups.length && now > (o.length || 0)) { playing = false; if (o.onEnd) o.onEnd(); }
      },
    };
    return S2;
  }
  function songEvents(song, o = {}) {
    const spb = song.spb * (o.slow || 1);
    const ev = song.notes.map(n => ({ t: n.t * spb, m: n.m, d: n.d * spb, v: 0.72, part: 'mel', note: n }));
    if (o.acc !== false) song.acc.forEach(a => ev.push({ t: a.t * spb, m: a.m, d: a.d * spb, v: a.v ?? 0.4, part: 'acc' }));
    return { ev, length: song.length * spb + 0.6 };
  }
  // camera framing that fits a range of notes
  function frameNotes(lo, hi, o = {}) {
    const span = Math.max(SPAN[S.keys] || 15, whiteIndex(nearestWhiteAtX(keyX(hi))) - whiteIndex(nearestWhiteAtX(keyX(lo))) + 3);
    rig.setMode('play', { span: o.keepSpan ? undefined : Math.min(span, 30), cx: (keyX(lo) + keyX(hi)) / 2, dur: o.dur || 1.6 });
    $('#nav').hidden = false; $('#viewBtn .ic').textContent = '👀'; $('#viewBtn .lb').textContent = '看钢琴';
  }

  /* ---------- 自己弹 ---------- */
  const Free = {
    start(fromTab) {
      if (rig.mode !== 'play') setView('play');
      sheet.idle();
      if (fromTab) say(L.free);
    },
    stop() { if (player.recording) stopRec(); },
  };
  Bus.on('glissando', (a, b) => {
    const xa = keyX(a), xb = keyX(b), w = Math.abs(xb - xa) + 0.1;
    fx.rainbow(new THREE.Vector3((xa + xb) / 2, K.TOP + 0.02, -0.12), Math.max(0.25, w));
    Snd.chord([72, 76, 79, 84, 88], { inst: 'musicbox', spread: 0.06, vel: 0.35, dur: 1 });
    if (!Store.get('saidRainbow', false) || Math.random() < 0.25) { say(L.rainbow); Store.set('saidRainbow', true); }
  });

  // recorder
  let recT = 0;
  function stopRec() {
    const r = player.record(false);
    $('#recBtn').classList.remove('on'); $('#recBtn .lb').textContent = '录下来';
    if (!r || r.ev.length < 2) { say(L.recEmpty); return; }
    const t0 = r.ev[0][0];
    Store.set('rec', { at: Date.now(), ev: r.ev.map(([t, m, on]) => [Math.round(t - t0), m, on]).slice(0, 1600) });
    $('#playRecBtn').hidden = false;
    say(L.recStop);
  }
  $('#recBtn').addEventListener('click', e => {
    press(e.currentTarget);
    if (player.recording) { stopRec(); return; }
    player.record(true); e.currentTarget.classList.add('on'); $('#recBtn .lb').textContent = '录好了';
    say(L.recStart);
    clearTimeout(recT); recT = setTimeout(() => { if (player.recording) stopRec(); }, 180000);
  });
  $('#playRecBtn').addEventListener('click', e => {
    press(e.currentTarget);
    const rec = Store.get('rec', null); if (!rec) return;
    setMode('listen'); closeSheets(); Mode.active = Listen; Listen.startRec(rec);
  });

  /* ---------- 跟我弹 ---------- */
  const Learn = {
    song: null, at: 0, wrong: 0, demo: null, t0: 0, played: [],
    start(song) {
      this.song = song; this.at = 0; this.wrong = 0; this.played = []; this.t0 = performance.now();
      $('#lesson').hidden = false; $('#lsEmoji').textContent = song.emoji; $('#lsTitle').textContent = song.title;
      frameNotes(song.lo, song.hi); $('#nav').hidden = true; $('#score')._ph = null;
      say(L.learnStart(song));
      this.show();
    },
    stop() { if (this.demo) { this.demo.stop(); this.demo = null; } guide.clear(); piano.clearHints(); $('#lesson').hidden = true; $('#score').hidden = true; $('#score')._ph = null; this.song = null; },
    show() {
      const s = this.song; if (!s) return;
      const up = s.notes.slice(this.at, this.at + 2).map(n => n.m);
      piano.clearHints();
      if (up.length) piano.hint(up[0], true, colorOf(up[0]));
      guide.set(up, Math.max(0.6, Math.min(1.2, rig.span / 16)));
      sheet.song(s, this.at);
      this.score();
      $('#lsProg').style.width = (this.at / s.notes.length * 100) + '%';
      // keep the next key on screen
      if (up.length) { const ph = s.phrases.find(p => p.includes(this.at)) || []; const ms = ph.map(i => s.notes[i].m); rig.ensureVisible(keyX(Math.min(...ms, up[0])), keyX(Math.max(...ms, up[0]))); }
    },
    // the phrase on screen: colour balls with names, words underneath; the next one bounces
    score() {
      const s = this.song, box = $('#score');
      const ph = s.phrases.find(p => p.includes(this.at)) || s.phrases[s.phrases.length - 1];
      if (box._ph !== ph) {
        box._ph = ph; box.innerHTML = '';
        ph.forEach(i => {
          const n = s.notes[i], d = el('div', 'n' + (n.d >= 2 ? ' long' : ''));
          const lab = S.labels === 'number' ? String(degree(n.m) + 1) : S.labels === 'letter' ? 'CDEFGAB'[degree(n.m)] : ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'][degree(n.m)];
          const b = el('div', 'b' + (degree(n.m) === 2 ? ' y' : ''), isBlack(n.m) ? '♯' : lab); b.style.setProperty('--c', cssColor(n.m));
          d.appendChild(b); d.appendChild(el('div', 'l', n.lyric || '')); d.dataset.i = i; box.appendChild(d);
        });
      }
      $$('.n', box).forEach(d => { const i = +d.dataset.i; d.classList.toggle('done', i < this.at); d.classList.toggle('now', i === this.at); });
      box.hidden = false;
    },
    onNote(m, src) {
      const s = this.song; if (!s || src !== 'user' || this.demo) return;
      const want = s.notes[this.at]; if (!want) return;
      if (m !== want.m) {
        this.wrong++; guide.pulse();
        if (this.wrong === 3 || this.wrong % 6 === 0) say(L.learnWrong(degree(want.m) ?? 0));
        return;
      }
      this.wrong = 0; this.played.push({ t: performance.now() - this.t0, m });
      const p = piano.keyTop(m, vec.clone());
      fx.burst(p.setY(p.y + 0.03), 16, { colors: [colorOf(m), new THREE.Color('#fff')], scale: Math.min(0.45, rig.span / 30) });
      // the piano answers with the harmony that belongs under this note
      if (S.accomp) {
        const t = want.t, nextT = (s.notes[this.at + 1] || { t: s.length }).t;
        s.acc.filter(a => a.t >= t - 1e-6 && a.t < nextT - 1e-6 && (a.t - t) < 1.01).forEach(a => {
          const delay = (a.t - t) * s.spb;
          later(delay * 1000, () => player.tap(a.m, Math.min(a.d * s.spb, 1.6), { src: 'acc', vel: (a.v ?? 0.4) * 0.85, name: false }));
        });
      }
      this.at++;
      const ph = s.phrases.find(p => p.includes(this.at - 1));
      if (this.at >= s.notes.length) return this.finish();
      if (ph && ph[ph.length - 1] === this.at - 1) { later(250, () => { say(pick(L.learnPhrase)); }); Snd.ui('pop'); }
      this.show();
    },
    finish() {
      const s = this.song;
      guide.clear(); piano.clearHints(); sheet.song(s, s.notes.length); $('#score').hidden = true;
      $('#lsProg').style.width = '100%';
      done[s.id] = (done[s.id] || 0) + 1; Store.set('done', done);
      const secs = (performance.now() - this.t0) / 1000;
      const stars = secs < s.notes.length * 1.4 ? 3 : secs < s.notes.length * 2.6 ? 2 : 1;
      later(500, () => cheer(s.emoji, '弹完啦！', Math.max(stars, 2)));
      later(900, () => say(L.learnDone(s), {
        onend: () => {
          if (this.song !== s) return;
          // then it plays the whole song properly, so the child hears what they just played
          const { ev, length } = songEvents(s);
          this.demo = Scheduler(ev, { length, onEnd: () => { this.demo = null; if (this.song === s) { say(L.learnAgain); this.at = 0; this.show(); } } });
          this.demo.play();
        },
      }));
    },
    listen() {
      const s = this.song; if (!s || this.demo) return;
      const ph = s.phrases.find(p => p.includes(this.at)) || s.phrases[0];
      const from = s.notes[this.at] ? this.at : ph[0];
      const until = ph[ph.length - 1];
      const t0 = s.notes[from].t, t1 = s.notes[until].t + s.notes[until].d;
      const spb = s.spb * 1.15;
      const ev = s.notes.slice(from, until + 1).map(n => ({ t: (n.t - t0) * spb, m: n.m, d: n.d * spb, v: 0.75, part: 'mel' }));
      if (S.accomp) s.acc.filter(a => a.t >= t0 && a.t < t1).forEach(a => ev.push({ t: (a.t - t0) * spb, m: a.m, d: a.d * spb, v: (a.v ?? 0.4) * 0.8, part: 'acc' }));
      guide.clear(); piano.clearHints();
      say(L.learnListen, {
        onend: () => {
          if (this.song !== s) return;
          this.demo = Scheduler(ev, { length: (t1 - t0) * spb + 0.3, onEnd: () => { this.demo = null; if (this.song === s) { say(L.learnYour); this.show(); } } });
          this.demo.play();
        },
      });
    },
  };
  Tick.add(() => { if (Learn.demo) Learn.demo.tick(); });
  $('#lsListen').addEventListener('click', e => { press(e.currentTarget); Learn.listen(); });
  $('#lsRestart').addEventListener('click', e => { press(e.currentTarget); if (Learn.demo) { Learn.demo.stop(); Learn.demo = null; } Learn.at = 0; Learn.t0 = performance.now(); Learn.show(); tapSound(4); });
  $('#lsPick').addEventListener('click', e => { press(e.currentTarget); Learn.stop(); Mode.active = null; showShelf('learn'); });
  // after finishing, the whole song is played back; the score returns when it is learnt again

  /* ---------- 听我弹 ---------- */
  const Listen = {
    song: null, sch: null, wasNight: false, list: [],
    start(song) {
      this.stopPlayback();
      this.song = song;
      this.wasNight = S.night; if (!S.night) setNight(true);
      $('#concert').hidden = false; $('#ccEmoji').textContent = song.emoji; $('#ccTitle').textContent = song.title; $('#ccPause .ic').textContent = '⏸'; $('#ccPause .lb').textContent = '停一下';
      $('#rail').hidden = true; $('#nav').hidden = true;
      rig.setMode('concert', { dur: 2.4 }); $('#viewBtn .ic').textContent = '🎹'; $('#viewBtn .lb').textContent = '展开键盘';
      sheet.concert(song, 0);
      const { ev, length } = songEvents(song);
      this.sch = Scheduler(ev, { length, onEnd: () => this.end() });
      say(L.listenStart(song), { onend: () => { if (this.song === song && this.sch && !this.sch.playing) this.sch.play(); } });
    },
    startRec(rec) {
      this.stopPlayback();
      const fake = { id: '__rec', title: '我弹的歌', emoji: '🎙️', tip: '刚刚录下来的' };
      this.song = fake;
      this.wasNight = S.night; if (!S.night) setNight(true);
      $('#concert').hidden = false; $('#ccEmoji').textContent = '🎙️'; $('#ccTitle').textContent = '我弹的歌';
      $('#rail').hidden = true; $('#nav').hidden = true;
      rig.setMode('concert', { dur: 2.4 });
      // pair key-downs with key-ups
      const ev = [], open = {};
      rec.ev.forEach(([t, m, on]) => { if (on) open[m] = t; else if (open[m] !== undefined) { ev.push({ t: open[m] / 1000, m, d: Math.max(0.08, (t - open[m]) / 1000), v: 0.72, part: 'mel' }); delete open[m]; } });
      Object.entries(open).forEach(([m, t]) => ev.push({ t: t / 1000, m: +m, d: 0.4, v: 0.72, part: 'mel' }));
      const length = Math.max(...ev.map(e => e.t + e.d)) + 0.6;
      sheet.concert(fake, 0);
      this.sch = Scheduler(ev, { length, onEnd: () => this.end() });
      say(L.recPlay, { onend: () => { if (this.song === fake && this.sch && !this.sch.playing) this.sch.play(); } });
    },
    end() {
      const s = this.song;
      cheer('👏', '弹完啦！'); say(L.listenEnd);
      later(5200, () => { if (this.song === s && Mode.active === Listen) { this.next(); } });
    },
    next() {
      const list = SONGS;
      const i = list.findIndex(x => x.id === (this.song && this.song.id));
      this.start(list[(i + 1) % list.length]);
    },
    stopPlayback() { if (this.sch) { this.sch.stop(); this.sch = null; } },
    stop() {
      this.stopPlayback(); this.song = null;
      $('#concert').hidden = true; $('#rail').hidden = false;
      if (!this.wasNight && S.night) setNight(false);
      setView('play');
    },
  };
  Tick.add(() => {
    if (Listen.sch) { Listen.sch.tick(); if (Listen.song && Math.random() < 0.08) { sheet.concert(Listen.song, Listen.sch.progress); $('#ccProg').style.width = (Listen.sch.progress * 100) + '%'; } }
  });
  $('#ccPause').addEventListener('click', e => {
    press(e.currentTarget); const s = Listen.sch; if (!s) return;
    if (s.playing) { s.pause(); $('#ccPause .ic').textContent = '▶️'; $('#ccPause .lb').textContent = '接着弹'; }
    else { s.resume(); $('#ccPause .ic').textContent = '⏸'; $('#ccPause .lb').textContent = '停一下'; }
  });
  $('#ccNext').addEventListener('click', e => { press(e.currentTarget); Listen.next(); });
  $('#ccPick').addEventListener('click', e => { press(e.currentTarget); Listen.stopPlayback(); showShelf('listen'); });

  /* ---------- 学小鸟 (listen and repeat) ---------- */
  const Echo = {
    level: 0, seq: [], got: 0, phase: 'idle', wins: 0, sch: null,
    LEVELS: [
      { n: 2, pool: [60, 64, 67] },
      { n: 3, pool: [60, 62, 64, 65, 67] },
      { n: 3, pool: [60, 62, 64, 65, 67, 69, 71, 72] },
      { n: 4, pool: [60, 62, 64, 65, 67, 69, 71, 72] },
      { n: 5, pool: [60, 62, 64, 65, 67, 69, 71, 72] },
    ],
    start() {
      this.level = Store.get('echoLevel', 0); this.wins = 0;
      $('#echo').hidden = false;
      frameNotes(60, 72, { dur: 1.4 }); $('#nav').hidden = true;
      this.dots();
      say(L.echoIntro, { onend: () => this.round() });
    },
    stop() { this.phase = 'idle'; if (this.sch) { this.sch.stop(); this.sch = null; } $('#echo').hidden = true; piano.clearHints(); },
    dots() {
      const d = $('#ecDots'); d.innerHTML = '';
      for (let i = 0; i < (this.seq.length || this.LEVELS[this.level].n); i++) { const n = el('i'); if (i < this.got) { n.classList.add('on'); n.style.setProperty('--c', cssColor(this.seq[i])); } d.appendChild(n); }
      $('#ecTitle').textContent = `学小鸟唱歌 · 第 ${this.level + 1} 关`;
    },
    round(again) {
      if (Mode.active !== Echo) return;
      const lv = this.LEVELS[this.level];
      if (!again) {
        this.seq = [];
        for (let i = 0; i < lv.n; i++) { let m; do { m = pick(lv.pool); } while (i && m === this.seq[i - 1] && Math.random() < 0.7); this.seq.push(m); }
      }
      this.got = 0; this.phase = 'listen'; this.dots(); sheet.echo(this.seq, 0, true);
      piano.clearHints(); lv.pool.forEach(m => piano.mark(m, true));
      const gap = 0.62;
      const ev = this.seq.map((m, i) => ({ t: i * gap, m, d: 0.5, v: 0.7, part: 'mel' }));
      this.sch = Scheduler(ev, {
        length: this.seq.length * gap + 0.2,
        onNote: () => { const b = $('#ecBird'); b.classList.remove('sing'); void b.offsetWidth; b.classList.add('sing'); },
        onEnd: () => { this.sch = null; if (Mode.active !== Echo) return; this.phase = 'answer'; sheet.echo(this.seq, 0, false); say(L.echoYour); },
      });
      later(400, () => this.sch && this.sch.play());
    },
    onNote(m, src) {
      if (src !== 'user' || this.phase !== 'answer') return;
      if (m === this.seq[this.got]) {
        this.got++; this.dots(); sheet.echo(this.seq, this.got, false);
        fx.twinkle(piano.keyTop(m, vec.clone()).setY(K.TOP + 0.05), colorOf(m), 1);
        if (this.got >= this.seq.length) {
          this.phase = 'idle'; this.wins++;
          later(300, () => { cheer('🐦', pick(L.echoGood)); });
          if (this.wins >= 2) {
            this.wins = 0;
            if (this.level < this.LEVELS.length - 1) { this.level++; Store.set('echoLevel', this.level); later(1500, () => say(L.echoMore)); }
            else later(1500, () => say(L.echoWin));
          }
          later(3600, () => this.round());
        }
      } else if (this.seq.includes(m) || Math.abs(m - this.seq[this.got]) <= 12) {
        this.phase = 'idle';
        later(500, () => say(L.echoAgain, { onend: () => this.round(true) }));
      }
    },
  };
  Tick.add(() => { if (Echo.sch) Echo.sch.tick(); });
  $('#ecAgain').addEventListener('click', e => { press(e.currentTarget); if (Echo.phase !== 'listen') Echo.round(true); });

  Bus.on('note', (m, src) => { if (Mode.active === Learn) Learn.onNote(m, src); else if (Mode.active === Echo) Echo.onNote(m, src); idleT = 0; });

  /* ---------- the opening: a closed piano; one tap opens it ---------- */
  let opened = false, idleT = 0;
  function intro() {
    rig.setMode('show', { dur: 0.01, theta: 0.75, phi: 1.12, radius: 4.1 });
    piano.open(false);
    later(900, () => { if (!opened) $('#hint').hidden = false; });
    input.onTapPiano = openPiano;
    Bus.on('tapEmpty', () => { if (!opened) openPiano(); });
    if (/[?&]open\b/.test(location.search)) later(300, openPiano);
  }
  function openPiano() {
    if (opened) return; opened = true;
    input.onTapPiano = null;
    Snd.init(); Voice.unlock();
    $('#hint').hidden = true;
    piano.open(true);
    Snd.ui('open');
    later(500, () => fx.burst(new THREE.Vector3(0, 1.0, -0.75), 70, { scale: 1.2 }));
    later(900, () => fx.burst(new THREE.Vector3(0.3, 1.3, -0.9), 50, { scale: 1 }));
    later(250, () => [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => later(i * 70, () => player.tap(m, 0.5, { src: 'auto', vel: 0.55, inst: 'piano', name: false }))));
    later(1300, () => {
      rig.setMode('play', { dur: 2.2 });
      hud.classList.remove('hidden');
      setMode('free');
      later(60, moveThumb);
    });
    const back = Store.get('visited', false); Store.set('visited', true);
    later(1600, () => say(back ? L.welcomeBack : L.welcome));
  }
  // a nudge when nothing happens for a while in free play
  Tick.add(dt => {
    if (!opened || Mode.name !== 'free') return;
    idleT += dt;
    if (idleT > 25) { idleT = -40; say(L.idle); const m = nearestWhiteAtX(rig.cx); guide.set([m], Math.min(1.2, rig.span / 16)); later(2600, () => { if (Mode.name === 'free') guide.clear(); }); }
  });
  Bus.on('touch', () => { idleT = 0; });

  // stop everything gracefully when the page goes to the background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { Voice.stop(); if (Listen.sch && Listen.sch.playing) $('#ccPause').click(); player.allUp(); }
  });
  $('#homeBtn').addEventListener('click', () => { Voice.stop(); Snd.allOff(); });
  window.__app = { setMode, setView, setNight, openPiano, Learn, Listen, Echo, songById, S };
}
