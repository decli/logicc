/* =====================================================================
   造物 · main — the loop that turns the world every frame
   ===================================================================== */
world.speedBoost = 1;

/* keep everything in place when the window changes size */
onResize((oW, oH) => {
  if (!oW || world.phase === 'chaos') return;
  const sx = W / oW;
  world.trees = world.trees.map(t => { const nx = t.x * sx, gy = groundY(nx); const nt = new Tree(nx, gy + t.depthT * (H - gy), t.type, t.seed); nt.born = t.born; nt.dying = t.dying; nt.fade = t.fade; return nt; });
  for (const f of world.flowers) { const d = (f.y - groundY(f.x)) / Math.max(1, oH - groundY(f.x)); f.x *= sx; const gy = groundY(f.x); f.y = gy + clamp(d, 0, 1) * (H - gy); }
  for (const c of world.creatures) {
    const dx = c.comx * sx - c.comx; for (let i = 0; i < c.N; i++) c.px[i] += dx;
    c.lane = Math.min(c.lane, Math.max(4, (H - GROUND) * 0.62 - c.R * 0.4));
    const f = c.floor(c.comx), bottom = Math.max(...c.py); if (bottom > f) for (let i = 0; i < c.N; i++) c.py[i] -= bottom - f;
    c.updateCom();
  }
  for (const cl of world.clouds) { cl.x *= sx; cl.y = Math.min(cl.y, GROUND - U * 0.3); }
  for (const f of world.fruits || []) { f.x *= sx; const gy = groundY(f.x); f.floor = Math.min(Math.max(f.floor, gy + 4), H - 6); if (f.rest) f.y = f.floor; }
  world.birds.forEach(b => { b.x *= sx; });
});

/* ---------- save & restore (this browser only) ---------- */
const Save = (() => {
  const KEY = 'zaowu-world-v1';
  function write() {
    if (world.phase !== 'world') return;
    try {
      const data = {
        time: world.time, day: dayCount,
        trees: world.trees.filter(t => !t.dying).map(t => ({ x: t.x / W, d: t.depthT, type: t.type, seed: t.seed })),
        creatures: world.creatures.filter(c => c.birth >= 1).map(c => c.toJSON()),
        flowers: world.flowers.slice(-80).map(f => ({ x: f.x / W, d: clamp((f.y - groundY(f.x)) / Math.max(1, H - groundY(f.x)), 0, 1), v: f.v })),
      };
      if (data.trees.length || data.creatures.length) localStorage.setItem(KEY, JSON.stringify(data));
    } catch (_) { }
  }
  function read() { try { const s = localStorage.getItem(KEY); if (!s) return null; const d = JSON.parse(s); return d && ((d.trees && d.trees.length) || (d.creatures && d.creatures.length)) ? d : null; } catch (_) { return null; } }
  function restore(d) {
    world.phase = 'world'; world.reveal = 1; world.time = typeof d.time === 'number' ? d.time : 0.33;
    if (world.time > 0.8 || world.time < 0.22) world.time = 0.3;
    dayCount = (d.day | 0) + 1; lastTOD = world.time; Main.showDay();
    for (const t of d.trees || []) { const x = t.x * W, gy = groundY(x); const tr = new Tree(x, gy + (t.d || 0) * (H - gy), t.type, t.seed); tr.born = world.t - 10; world.trees.push(tr); }
    for (const f of d.flowers || []) { const x = f.x * W, gy = groundY(x); Flowers.add(x, gy + f.d * (H - gy)); world.flowers[world.flowers.length - 1].born = world.t - 5; world.flowers[world.flowers.length - 1].v = f.v; }
    world.flowers.sort((a, b) => a.y - b.y);
    for (const c of d.creatures || []) {
      if (!c.q || !c.q[0]) continue;
      const cx = clamp(c.x * W, U * 0.1, W - U * 0.1), cy = GROUND - U * rand(0.15, 0.4);
      const pts = c.q[0].map((qx, i) => ({ x: cx + qx, y: cy + c.q[1][i] }));
      const cr = new Creature(pts, { instant: true, hue: c.hue, name: c.name, nameIdx: c.nameIdx, vrole: c.vrole, meals: c.meals, growth: c.growth, raw: true });
      world.creatures.push(cr);
    }
    if (world.trees.length >= 2) Birds.spawn(randi(9, 14));
    $('#resume').hidden = true;
    Story.resumed();
  }
  return { write, read, restore };
})();

/* ---------- days ---------- */
let dayCount = 1, lastTOD = world.time;
const Main = { showDay() { if (world.phase !== 'chaos') $('#day').textContent = L('ui_day', { n: dayNum(dayCount) }); } };
function checkDawn() {
  const now = world.time;
  if (world.phase === 'world' && lastTOD < 0.25 && now >= 0.25 && now - lastTOD < 0.3) {
    dayCount++; Main.showDay();
    if (Story.step === 'done') Story.toast(L('day_toast', { n: dayNum(dayCount) }));
  }
  lastTOD = now;
}

/* ---------- background music & animals, by the hour ---------- */
const Music = (() => {
  let fluteT = 25, owlT = 20, cuckooT = 8, lullabyNight = false, wasNight = false;
  return {
    update(dt) {
      if (world.phase !== 'world' || !Snd.running) return;
      const s = world.sky, n = s.night;
      // daytime: a little flute tune now and then; mornings: the cuckoo
      fluteT -= dt;
      if (fluteT < 0 && n < 0.3) { const ms = Snd.flutePhrase(rand(W * 0.2, W * 0.8)); fluteT = rand(32, 55) + ms / 1000; }
      cuckooT -= dt;
      if (cuckooT < 0) { if (world.time > 0.26 && world.time < 0.4 && world.trees.length) Snd.cuckoo(rand(W)); cuckooT = rand(14, 26); }
      // night: a music-box lullaby when it gets dark, then an owl from time to time
      if (n > 0.75 && !wasNight) { wasNight = true; if (!lullabyNight) { lullabyNight = true; setTimeout(() => Snd.lullaby(), 2500); } }
      if (n < 0.3 && wasNight) { wasNight = false; lullabyNight = false; }
      owlT -= dt;
      if (owlT < 0) { if (n > 0.7 && world.trees.length) Snd.owl(rand(W)); owlT = rand(18, 34); }
      if (n > 0.6 && Math.random() < dt * 1.6 * n) Snd.cricket(rand(W));
    },
  };
})();

/* ---------- the frame ---------- */
let lastT = performance.now(), saveT = 0, birdT = 0, fpsAcc = 0, fpsN = 0, slowFrames = 0;
const drawList = [];

function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - lastT) / 1000; lastT = now;
  if (dt <= 0) return;
  dt = Math.min(dt, 1 / 24);
  world.t += dt; world.dt = dt;
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 0.5) { world.stats.fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; adaptQuality(); }

  if (world.phase === 'chaos') { Genesis.updateChaos(dt); Genesis.drawChaos(ctx); Story.update(dt); Echo.update(); return; }
  if (world.phase === 'genesis') Genesis.updateGenesis(dt);
  else if (!Input.draggingSky) world.time = (world.time + dt * world.daySpeed * world.speedBoost) % 1;

  checkDawn();
  Sky.update(dt); Sky.updateAmbient(dt);
  Clock.update(dt);
  Weather.update(dt);
  for (let i = world.trees.length - 1; i >= 0; i--) { const t = world.trees[i]; t.update(dt); if (t.dying && t.fade <= 0) world.trees.splice(i, 1); }
  Petals.update(dt); Sparks.update(dt); Birds.update(dt); Flies.update(dt);
  Creatures.update(dt);
  Fruits.update(dt); Catch.update(dt); Ring.update(dt); Echo.update();
  Story.update(dt);
  Music.update(dt);

  // birds come once there are trees to come for
  birdT -= dt;
  if (world.phase === 'world' && birdT < 0 && world.trees.length >= 2 && world.birds.length < 6 && world.sky.night < 0.4) { Birds.spawn(randi(8, 15)); birdT = rand(25, 50); }
  saveT += dt; if (saveT > 6) { saveT = 0; Save.write(); }

  render();
}

function render() {
  const inGen = world.phase === 'genesis';
  const skyA = inGen ? smooth(0.05, 0.55, world.reveal) : 1;
  const rise = inGen ? Genesis.rise : null;
  const glift = inGen ? Genesis.groundLift() : 0;
  if (skyA < 1) { ctx.fillStyle = '#070a16'; ctx.fillRect(0, 0, W, H); }
  Sky.drawSky(ctx, skyA);
  Sky.drawStars(ctx, skyA);
  Sky.drawSunMoon(ctx, skyA);
  Sky.drawLandscape(ctx, rise);
  Weather.drawClouds(ctx);
  Birds.draw(ctx);

  // foreground: ground and everything living on it, then tinted by the hour
  fctx.clearRect(0, 0, W, H);
  Sky.drawGround(fctx, glift);
  drawList.length = 0;
  for (const t of world.trees) drawList.push({ y: t.y, o: t, k: 0 });
  for (const f of world.flowers) drawList.push({ y: f.y, o: f, k: 1 });
  for (const c of world.creatures) drawList.push({ y: c.floor(c.comx) + 0.5, o: c, k: 2 });
  for (const f of world.fruits || []) drawList.push({ y: f.rest ? f.floor : Math.min(f.y, f.floor), o: f, k: 3 });
  drawList.sort((a, b) => a.y - b.y);
  for (const d of drawList) { if (d.k === 1) Flowers.draw(fctx, d.o); else if (d.k === 3) Fruits.draw(fctx, d.o); else d.o.draw(fctx); }
  Petals.draw(fctx);
  Sparks.draw(fctx, 'fg');
  const s = world.sky;
  if (s.tintA > 0.01) {
    fctx.globalCompositeOperation = 'source-atop';
    fctx.fillStyle = rgba(s.tint, s.tintA * 0.82); fctx.fillRect(0, 0, W, H);
    fctx.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(fg, 0, 0, W, H);

  Weather.drawRain(ctx);
  Weather.drawStreaks(ctx);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const c of world.creatures) c.drawGlow(ctx);
  Flies.draw(ctx);
  Catch.draw(ctx);
  Sparks.draw(ctx, 'glow');
  ctx.restore();
  Sparks.draw(ctx, 'text');
  for (const c of world.creatures) c.drawBubble(ctx);
  Input.drawStroke(ctx);
  if (inGen) Genesis.drawGenesisOverlay(ctx);
  if (world.xray) XRay.draw(ctx);
}

function adaptQuality() {
  if (world.stats.fps < 38 && DPR > 1) { slowFrames++; if (slowFrames > 3) { maxDPR = Math.max(1, DPR - 0.5); slowFrames = 0; resize(); } }
  else slowFrames = 0;
}

/* ---------- controls ---------- */
const Prefs = (() => {
  let p = { snd: true, voi: true };
  try { Object.assign(p, JSON.parse(localStorage.getItem('zaowu-prefs') || '{}')); } catch (_) { }
  // inside 思维小画本 (logicc), follow the parent's settings for sound and reading aloud
  if (typeof BUILD !== 'undefined' && BUILD.logicc) {
    try { const r = JSON.parse(localStorage.getItem('logicc.design.v2') || 'null'); if (r) { if (typeof r.voi === 'boolean') p.voi = r.voi; if (typeof r.snd === 'boolean' && typeof r.mus === 'boolean') p.snd = r.snd || r.mus; } } catch (_) { }
  }
  return { get: k => p[k], set(k, v) { p[k] = v; try { localStorage.setItem('zaowu-prefs', JSON.stringify(p)); } catch (_) { } } };
})();
function paintControls() {
  const sOn = Snd.on, vOn = Voice.on;
  $('#btnS').setAttribute('aria-pressed', sOn); $('#sLabel').textContent = L(sOn ? 'ui_sound' : 'ui_mute'); $('#sWave').style.opacity = sOn ? 1 : 0.15;
  $('#btnV').setAttribute('aria-pressed', vOn); $('#vLabel').textContent = L(vOn ? 'ui_voice' : 'ui_voice_off'); $('#vDots').style.opacity = vOn ? 1 : 0.15;
  $('#btnL').textContent = L('ui_lang'); $('#btnL').setAttribute('aria-label', L('ui_lang_aria'));
  $('#xLabel').textContent = L('ui_xray'); $('#bookLabel').textContent = L('ui_book'); $('#homeLabel').textContent = L('ui_home');
  $('#skip').textContent = L('ui_skip'); $('#resume').textContent = L('ui_resume'); $('#bookClose').textContent = L('ui_close');
  $('#echoLabel').textContent = L('echo_btn'); $('#echoExit').textContent = L('echo_exit');
  cvs.setAttribute('aria-label', L('canvas_aria'));
  ['btnS', 'btnV', 'btnX', 'bookBtn', 'homeBtn'].forEach(id => { const b = $('#' + id); const l = b.querySelector('.lbl'); if (l) b.setAttribute('aria-label', l.textContent); });
}
$('#btnS').addEventListener('click', () => { const v = !Snd.on; Snd.setOn(v); Prefs.set('snd', v); paintControls(); });
$('#btnV').addEventListener('click', () => { const v = !Voice.on; Voice.on = v; Prefs.set('voi', v); paintControls(); Snd.init(); if (v) Voice.say(L('voice_on'), { role: 'n', prio: 3 }); });
$('#btnL').addEventListener('click', () => { Snd.init(); Voice.unlock(); setLang(isEn() ? 'zh' : 'en'); });
onLang(lang => { paintControls(); Main.showDay(); Voice.load(lang); });
$('#skip').addEventListener('click', () => { Snd.init(); Voice.unlock(); Story.skip(); });
$('#resume').addEventListener('click', e => { e.stopPropagation(); Snd.init(); Voice.unlock(); const d = Save.read(); if (d) { world.phase = 'world'; Save.restore(d); } });
if (typeof BUILD !== 'undefined' && BUILD.home) { const h = $('#homeBtn'); h.href = BUILD.home; h.hidden = false; h.addEventListener('click', () => { try { Save.write(); } catch (_) { } }); }
Snd.setOn(Prefs.get('snd') !== false); Voice.on = Prefs.get('voi') !== false;
// some browsers (iPad Safari) only let sound start from a finished tap, so try again on every tap end
['touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, () => Snd.init(), { passive: true }));
document.documentElement.lang = isEn() ? 'en' : 'zh-CN';
paintControls();

// keyboard: a way in without a pointer
window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (e.target.closest && e.target.closest('button') && (k === ' ' || k === 'enter')) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (world.phase === 'chaos') { if (k === ' ' || k === 'enter') { Snd.init(); Genesis.tap(); } return; }
  if (world.phase !== 'world') return;
  if (k === 't') { const x = rand(W * 0.08, W * 0.92), gy = groundY(x); Input.plantTree(x, gy + rand(0.05, 0.6) * (H - gy)); }
  else if (k === 'c') { Snd.init(); Weather.addUserCloud(rand(W * 0.15, W * 0.85), rand(H * 0.15, GROUND - U * 0.35)); Story.event('cloud'); }
  else if (k === 'b') { Snd.init(); const cx = rand(W * 0.2, W * 0.8), cy = H * 0.3, r = U * rand(0.05, 0.09), pts = []; const sd = rand(100); for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, rr = r * (1 + 0.35 * noise2(Math.cos(a) * 0.9 + sd, Math.sin(a) * 0.9)); pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 1.1 }); } Creatures.spawn(pts); }
  else if (k === 'n') world.time = (world.time + 0.08) % 1;
  else if (k === 'x') XRay.toggle();
  else if (k === 'l') setLang(isEn() ? 'zh' : 'en');
  else if (k === 'arrowleft' || k === 'arrowright') { const d = k === 'arrowleft' ? -1 : 1; Weather.gust(W / 2 - d * U * 0.3, H * 0.3, W / 2 + d * U * 0.3, H * 0.3, U * 3); }
});

/* ---------- go ---------- */
window.addEventListener('resize', () => resize());
resize();
Genesis.build();
Clock.on(n => {
  Creatures.tick(n);
  // trees take turns singing, more often when there are more of them
  const grown = world.trees.filter(t => t.g >= 1 && !t.dying);
  if (grown.length && n % 2 === 0 && Math.random() < Math.min(0.55, 0.12 + grown.length * 0.06) * (1 - world.sky.night * 0.5)) {
    const t = pick(grown), deg = clamp(Math.round(t.x / W * 9), 0, 9) + pick([0, 0, 2, 3, 5]);
    Snd.play(Snd.INSTRUMENT[t.type], deg, t.x, 0.13); t.pulse = 1;
  }
  if (n % 32 === 0) Snd.stepPad(world.sky.night);
});
Story.start(!!Save.read());
Voice.load(I18N.lang);
requestAnimationFrame(t => { lastT = t; frame(t); });

// for the curious: open the console and play with window.zaowu
window.zaowu = { world, Creatures, Input, Weather, XRay, Story, Snd, Sky, Voice, Stickers, Echo, Ring, Fruits, setLang, render };
