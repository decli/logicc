/* =====================================================================
   造物 · play — things to do with the world:
   fruit to shake down and feed, a ring of actions around each creature,
   「跟我唱」 (a listen-and-repeat singing game), catching fireflies, and a
   sticker book that remembers what you found. Nothing here can be failed.
   ===================================================================== */

/* ---------- fruit ---------- */
const FRUIT_LOOK = {
  peach: { a: '#ffd2a6', b: '#ff7f8c', leaf: '#5aa85a', r: 1 },
  pine: { a: '#b07a4a', b: '#6b4426', cone: true, r: 1.05 },
  maple: { a: '#ff7070', b: '#c81e3a', cherry: true, r: 0.8 },
  willow: { a: '#d8f08a', b: '#79b84a', leaf: '#4f8f3e', r: 0.95 },
  ginkgo: { a: '#ffe58a', b: '#e0a42a', r: 0.72 },
  grape: { a: '#c9a6ff', b: '#6b3fb5', grape: true, r: 1 },
  orange: { a: '#ffc266', b: '#f07f12', leaf: '#4f9a4a', r: 1 },
};
const Fruits = {
  drop(x, y, type, fromSky) {
    if (!world.fruits) world.fruits = [];
    if (world.fruits.length >= 14) world.fruits.shift().gone = true;
    const gy = groundY(x), r = U * 0.017 * (FRUIT_LOOK[type] || FRUIT_LOOK.peach).r;
    const f = { x, y, vx: rand(-25, 25), vy: fromSky ? U * 0.2 : rand(-60, 0), type: FRUIT_LOOK[type] ? type : 'peach', r, rot: rand(-0.4, 0.4), vr: rand(-3, 3), floor: gy + (H - gy) * rand(0.08, 0.5), rest: false, age: 0, claimed: null, sky: fromSky };
    world.fruits.push(f);
    if (fromSky) Sparks.burst(x, 40, 12, { col: '#fff', speed: U * 0.2, g: 0, life: 0.7 });
    return f;
  },
  remove(f) { f.gone = true; const i = world.fruits.indexOf(f); if (i >= 0) world.fruits.splice(i, 1); },
  nearest(x, maxD) {
    let best = null, bd = maxD;
    for (const f of world.fruits || []) { if (f.claimed && world.creatures.includes(f.claimed)) continue; const d = Math.abs(f.x - x); if (d < bd) { bd = d; best = f; } }
    return best;
  },
  update(dt) {
    const F = world.fruits || (world.fruits = []);
    for (let i = F.length - 1; i >= 0; i--) {
      const f = F[i]; f.age += dt;
      if (f.claimed && !world.creatures.includes(f.claimed)) f.claimed = null;
      if (!f.rest) {
        f.vy += U * 1.9 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt;
        if (f.x < 12 || f.x > W - 12) { f.vx *= -0.6; f.x = clamp(f.x, 12, W - 12); }
        if (f.y >= f.floor) {
          f.y = f.floor;
          if (f.vy > U * 0.25) { f.vy *= -0.32; f.vx *= 0.6; Snd.thump(180 + rand(40), 0.05, 0.12); }
          else { f.vy = 0; f.vx = 0; f.rest = true; }
        }
      }
      if (f.age > 80) { f.fade = (f.fade || 1) - dt * 0.5; if (f.fade <= 0) { f.gone = true; F.splice(i, 1); } }
    }
  },
  draw(c, f) {
    const L = FRUIT_LOOK[f.type], r = f.r;
    c.save(); c.globalAlpha = f.fade === undefined ? 1 : clamp(f.fade, 0, 1);
    c.fillStyle = 'rgba(30,60,40,.2)'; c.beginPath(); c.ellipse(f.x, f.floor + r * 0.9, r * 0.9, r * 0.25, 0, 0, TAU); c.fill();
    c.translate(f.x, f.y); c.rotate(f.rot);
    if (L.grape) {
      c.strokeStyle = '#5a7a3a'; c.lineWidth = Math.max(1, r * 0.12); c.beginPath(); c.moveTo(0, -r * 0.9); c.lineTo(r * 0.15, -r * 1.35); c.stroke();
      const g = c.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.05, 0, 0, r * 1.2); g.addColorStop(0, L.a); g.addColorStop(1, L.b); c.fillStyle = g;
      for (const [dx, dy] of [[-0.42, -0.55], [0.0, -0.6], [0.42, -0.55], [-0.24, -0.12], [0.24, -0.12], [0, 0.32]]) { c.beginPath(); c.arc(dx * r, dy * r, r * 0.3, 0, TAU); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.arc(-r * 0.5, -r * 0.65, r * 0.09, 0, TAU); c.fill();
    } else if (L.cherry) {
      c.strokeStyle = '#5a7a3a'; c.lineWidth = Math.max(1, r * 0.12); c.beginPath(); c.moveTo(-r * 0.45, 0); c.quadraticCurveTo(-r * 0.2, -r * 1.3, r * 0.2, -r * 1.5); c.moveTo(r * 0.5, r * 0.1); c.quadraticCurveTo(r * 0.4, -r * 1.1, r * 0.2, -r * 1.5); c.stroke();
      for (const dx of [-0.45, 0.5]) { const g = c.createRadialGradient(dx * r - r * 0.2, -r * 0.2, r * 0.1, dx * r, 0, r * 0.75); g.addColorStop(0, L.a); g.addColorStop(1, L.b); c.fillStyle = g; c.beginPath(); c.arc(dx * r, dx > 0 ? r * 0.1 : 0, r * 0.62, 0, TAU); c.fill(); }
    } else if (L.cone) {
      const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, L.a); g.addColorStop(1, L.b);
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, r * 0.72, r * 1.05, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(60,35,15,.6)'; c.lineWidth = Math.max(1, r * 0.08);
      for (let k = -2; k <= 2; k++) { c.beginPath(); c.arc(0, k * r * 0.38, r * 0.6, 0.25, Math.PI - 0.25); c.stroke(); }
    } else {
      const g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1); g.addColorStop(0, L.a); g.addColorStop(1, L.b);
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
      if (f.type === 'peach') { c.strokeStyle = 'rgba(200,70,90,.45)'; c.lineWidth = Math.max(1, r * 0.08); c.beginPath(); c.moveTo(0, -r * 0.9); c.quadraticCurveTo(r * 0.3, 0, 0, r * 0.85); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-r * 0.35, -r * 0.42, r * 0.25, r * 0.15, -0.5, 0, TAU); c.fill();
      if (L.leaf) { c.fillStyle = L.leaf; c.beginPath(); c.ellipse(r * 0.35, -r * 0.95, r * 0.45, r * 0.2, -0.5, 0, TAU); c.fill(); }
    }
    c.restore();
  },
};

/* ---------- sticker book ---------- */
const Stickers = (() => {
  const KEY = 'zaowu-stickers-v1';
  let got = new Set(), count = { fly: 0, types: [] }, queue = [], showing = false;
  try { const d = JSON.parse(localStorage.getItem(KEY) || '{}'); got = new Set(d.got || []); Object.assign(count, d.count || {}); } catch (_) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ got: [...got], count })); } catch (_) { } };
  const btn = $('#bookBtn'), badge = $('#bookN'), book = $('#book'), grid = $('#bookGrid'), tip = $('#bookTip');
  function paintBadge() { badge.textContent = got.size + '/' + STICKERS.length; }
  function give(id) {
    if (got.has(id) || world.phase !== 'world') return;
    const s = STICKERS.find(q => q.id === id); if (!s) return;
    got.add(id); save(); paintBadge();
    queue.push(s); if (!showing) next();
  }
  function next() {
    const s = queue.shift(); if (!s) { showing = false; return; }
    showing = true;
    const el = document.createElement('div'); el.className = 'stickerPop'; el.textContent = s.e;
    const cap = document.createElement('div'); cap.className = 'stickerCap'; cap.textContent = L('st_' + s.id + '_n'); el.appendChild(cap);
    document.body.appendChild(el);
    Snd.jingle();
    Voice.narrate(L('sticker_got', { name: L('st_' + s.id + '_n') }), 'sticker');
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => {
      const r = btn.getBoundingClientRect(), e = el.getBoundingClientRect();
      el.style.transform = `translate(${r.left + r.width / 2 - (e.left + e.width / 2)}px, ${r.top + r.height / 2 - (e.top + e.height / 2)}px) scale(.2)`;
      el.classList.add('out');
      setTimeout(() => { el.remove(); btn.classList.add('bump'); setTimeout(() => btn.classList.remove('bump'), 500); next(); }, 650);
    }, 1700);
  }
  let tab = 'st';
  function paintTabs() { document.querySelectorAll('#bookTabs button').forEach(b => { b.setAttribute('aria-selected', b.dataset.t === tab ? 'true' : 'false'); b.textContent = L(b.dataset.t === 'st' ? 'book_tab_st' : 'book_tab_words'); }); }
  function openWords() {
    grid.innerHTML = ''; tip.textContent = '';
    $('#bookSub').textContent = L('words_sub', { n: Words.count, m: WORDS.length });
    const en = isEn();
    for (const w of WORDS) {
      const has = Words.has(w.id), b = document.createElement('button');
      b.type = 'button'; b.className = 'sticker' + (has ? '' : ' locked');
      b.innerHTML = `<span class="se">${w.e}</span><span class="sn">${has ? (en ? w.en + '<br>' + w.zh : w.zh + '<br>' + w.en) : '？'}</span>`;
      b.setAttribute('aria-label', has ? w.zh + ' ' + w.en : L('words_locked'));
      b.addEventListener('click', () => {
        if (has) { tip.textContent = en ? w.s[1] : w.s[0]; Voice.seq(en ? [w.en, w.zh, w.s[1]] : [w.zh, w.en, w.s[0]], 'learn'); }
        else { tip.textContent = L('words_locked'); Voice.say(L('words_locked'), { role: 'n', prio: 3 }); }
        b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle'); Snd.pop(W / 2, 0.1);
      });
      grid.appendChild(b);
    }
  }
  document.querySelectorAll('#bookTabs button').forEach(b => b.addEventListener('click', () => { tab = b.dataset.t; paintTabs(); fill(); Snd.pop(W / 2, 0.08); }));
  function fill() { if (tab === 'words') openWords(); else openStickers(); }
  function open(which) {
    if (which) tab = which;
    $('#bookTitle').textContent = L('book_title'); paintTabs(); fill();
    book.hidden = false; requestAnimationFrame(() => book.classList.add('on'));
    Snd.pop(W / 2, 0.12);
    $('#bookClose').focus();
  }
  function openStickers() {
    grid.innerHTML = '';
    $('#bookSub').textContent = L('book_sub', { n: got.size, m: STICKERS.length });
    tip.textContent = '';
    for (const s of STICKERS) {
      const has = got.has(s.id), b = document.createElement('button');
      b.type = 'button'; b.className = 'sticker' + (has ? '' : ' locked');
      b.innerHTML = `<span class="se">${s.e}</span><span class="sn">${has ? L('st_' + s.id + '_n') : '？'}</span>`;
      b.setAttribute('aria-label', has ? L('st_' + s.id + '_n') : L('st_' + s.id + '_h'));
      b.addEventListener('click', () => {
        const text = has ? L('st_tap', { name: L('st_' + s.id + '_n') }) : L('st_' + s.id + '_h');
        tip.textContent = text; Voice.say(text, { role: 'n', prio: 3 });
        b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle'); Snd.pop(W / 2, 0.1);
      });
      grid.appendChild(b);
    }
  }
  function close() { book.classList.remove('on'); setTimeout(() => { book.hidden = true; }, 300); btn.focus(); }
  btn.addEventListener('click', () => { Snd.init(); open(); });
  onLang(() => { if (!book.hidden) { $('#bookTitle').textContent = L('book_title'); paintTabs(); fill(); } });
  $('#bookClose').addEventListener('click', close);
  book.addEventListener('click', e => { if (e.target === book) close(); });
  book.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  paintBadge();
  return {
    give, has: id => got.has(id), open, close,
    tree(type) { if (!count.types.includes(type)) { count.types.push(type); save(); } give('tree'); if (count.types.length >= 5) give('forest'); },
    fly() { count.fly++; save(); if (count.fly >= 5) give('firefly'); return count.fly; },
    get total() { return got.size; },
  };
})();

/* ---------- the action ring around a creature ---------- */
const Ring = (() => {
  const el = $('#ring'), ACTS = [['sing', '🎵', 'act_sing'], ['feed', '🍑', 'act_feed'], ['color', '🎨', 'act_color'], ['flip', '🤸', 'act_flip'], ['talk', '💬', 'act_talk']];
  let target = null, life = 0;
  const btns = ACTS.map(([id, e, k]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'act'; b.dataset.id = id;
    b.innerHTML = `<span class="ae">${e}</span><span class="al"></span>`;
    b.addEventListener('pointerdown', ev => ev.stopPropagation());
    b.addEventListener('click', ev => { ev.stopPropagation(); act(id); });
    el.appendChild(b); return b;
  });
  function labels() { btns.forEach((b, i) => { b.querySelector('.al').textContent = L(ACTS[i][2]); b.setAttribute('aria-label', L(ACTS[i][2])); }); if (target) el.setAttribute('aria-label', L('act_aria', { name: target.name })); }
  function open(c) {
    if (Echo.active) return;
    const was = target; target = c; life = 7; labels();
    el.hidden = false; position();
    if (was !== c) { el.classList.remove('on'); void el.offsetWidth; }
    el.classList.add('on');
  }
  function close() { if (!target) return; target = null; el.classList.remove('on'); setTimeout(() => { if (!target) el.hidden = true; }, 250); }
  function act(id) {
    const c = target; if (!c) return; life = 7; Snd.init();
    if (id === 'sing') c.sing(); else if (id === 'feed') c.feed(); else if (id === 'color') c.recolor(); else if (id === 'flip') c.flip(); else c.talk();
  }
  function position() {
    const c = target; if (!c) return;
    let top = Infinity; for (let i = 0; i < c.N; i++) top = Math.min(top, c.py[i]);
    const bw = Math.min(64, (W - 24) / 5), rowW = bw * 5;
    let x = clamp(c.comx - rowW / 2, 12, W - rowW - 12), y = top - bw - 34;
    if (y < 70) y = c.comy + c.R + 20;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.setProperty('--bw', bw + 'px');
  }
  onLang(labels);
  return {
    open, close, get target() { return target; },
    update(dt) {
      if (!target) return;
      life -= dt;
      if (life < 0 || !world.creatures.includes(target) || target.grab || Echo.active || (target.sleep && life < 6)) close(); else position();
    },
  };
})();

/* ---------- 跟我唱 · Sing With Me ---------- */
const Echo = (() => {
  const bar = $('#echoBar'), dots = $('#echoDots'), btn = $('#echoBtn');
  const NOTES = [3, 5, 7, 9];        // A3 D4 F#4 B4 — far enough apart to tell by ear
  let active = false, players = [], seq = [], len = 2, idx = 0, phase = 'idle', timers = [], invited = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearT = () => { timers.forEach(clearTimeout); timers = []; };
  const awake = () => world.creatures.filter(c => c.birth >= 1 && !c.sleep && !c.grab && c.flipT <= 0);
  function paintDots() { dots.innerHTML = ''; for (let k = 2; k <= 5; k++) { const d = document.createElement('i'); if (k < len || (k === len && phase === 'won')) d.className = 'done'; else if (k === len) d.className = 'now'; dots.appendChild(d); } }
  function start() {
    Snd.init();
    if (active) { stop(false); return; }
    Learn.stop(true); Draw.close(true); Story.hush();
    const ready = awake();
    if (ready.length < 3) { Voice.narrate(L('echo_need'), 'echo', { prio: 3 }); return; }
    Ring.close();
    players = ready.sort((a, b) => Math.abs(a.comx - W / 2) - Math.abs(b.comx - W / 2)).slice(0, 4).sort((a, b) => a.comx - b.comx);
    players.forEach((c, i) => { c.echo = { deg: NOTES[i] }; c.fruit = null; c.wantFood = false; });
    active = true; len = 2; phase = 'intro'; paintDots();
    $('#echoTitle').textContent = L('echo_title');
    bar.hidden = false; requestAnimationFrame(() => bar.classList.add('on'));
    btn.classList.add('cur');
    Voice.stopAll();
    Voice.say(L('echo_start'), { role: 'n', prio: 3, tag: 'echo', onend: () => later(newRound, 300) });
    later(() => { if (phase === 'intro') newRound(); }, 7000);
  }
  function newRound() {
    if (!active || phase === 'demo') return;
    seq = []; for (let k = 0; k < len; k++) { let i; do { i = randi(0, players.length - 1); } while (k && i === seq[k - 1]); seq.push(i); }
    demo();
  }
  function demo() {
    if (!active) return;
    phase = 'demo'; idx = 0; paintDots();
    Voice.say(L('echo_listen'), { role: 'n', prio: 3, tag: 'echo' });
    const gap = 760;
    seq.forEach((i, k) => later(() => { const c = players[i]; if (c && world.creatures.includes(c)) c.echoSing(); }, 1000 + k * gap));
    later(() => { if (!active) return; phase = 'input'; Voice.say(L('echo_your'), { role: 'n', prio: 3, tag: 'echo' }); }, 1000 + seq.length * gap + 200);
  }
  function tap(c) {
    if (!active || !c.echo) return false;
    if (phase !== 'input') { c.echoSing(); return true; }
    c.echoSing();
    if (c === players[seq[idx]]) {
      idx++;
      if (idx >= seq.length) success();
    } else {
      phase = 'wait';
      later(() => { c.speak('c_echo_oops', null, { prio: 3 }); }, 350);
      later(() => Voice.say(L('echo_again'), { role: 'n', prio: 2, tag: 'echo' }), 1300);
      later(demo, 3300);
    }
    return true;
  }
  function success() {
    phase = 'wait';
    later(() => {
      players.forEach((c, i) => setTimeout(() => { if (world.creatures.includes(c)) { c.happy = 1.2; for (let k = 0; k < c.N; k++) c.vy[k] -= U * 0.6; Snd.boop(Snd.degFreq(NOTES[i] + 2), c.comx, 0.12, 0.3, 1.3); } }, i * 90));
      Sparks.burst(W / 2, H * 0.35, 30, { speed: U * 0.5, g: 0, life: 1, size: U * 0.03 });
    }, 300);
    if (len >= 5) { phase = 'won'; paintDots(); later(win, 900); return; }
    later(() => Voice.say(L('echo_good'), { role: 'n', prio: 3, tag: 'echo' }), 700);
    later(() => { len++; paintDots(); Voice.say(L('echo_more'), { role: 'n', prio: 2, tag: 'echo', onend: () => later(newRound, 250) }); later(() => { if (phase === 'wait') newRound(); }, 5000); }, 2300);
  }
  function win() {
    Stickers.give('echo');
    Voice.say(L('echo_win'), { role: 'n', prio: 3, tag: 'echo' });
    players.forEach((c, i) => setTimeout(() => world.creatures.includes(c) && c.hum(NOTES[i] + 2, true), 800 + i * 220));
    later(() => stop(true), 5200);
  }
  function stop(quiet) {
    clearT(); active = false; phase = 'idle'; btn.classList.remove('cur');
    players.forEach(c => { c.echo = null; }); players = [];
    bar.classList.remove('on'); setTimeout(() => { if (!active) bar.hidden = true; }, 300);
    if (!quiet) Voice.say(L('echo_bye'), { role: 'n', prio: 3, tag: 'echo' });
  }
  btn.addEventListener('click', start);
  $('#echoExit').addEventListener('click', () => stop(false));
  onLang(() => { $('#echoTitle').textContent = L('echo_title'); $('#echoLabel').textContent = L('echo_btn'); $('#echoExit').textContent = L('echo_exit'); });
  return {
    get active() { return active; }, tap, start, stop,
    update() {
      if (active) {
        if (players.some(c => !world.creatures.includes(c))) stop(true);
        return;
      }
      const can = world.phase === 'world' && awake().length >= 3 && world.sky.night < 0.7;
      btn.classList.toggle('on', can);
    },
  };
})();

/* ---------- catching fireflies ---------- */
const Catch = {
  flying: [],
  at(x, y) {
    if (world.sky.night < 0.45) return false;
    const R = Math.max(36, U * 0.055); let best = null, bd = R;
    for (const f of world.flies) { const d = hypot(f.x - x, f.y - y); if (d < bd) { bd = d; best = f; } }
    if (!best) return false;
    world.flies.splice(world.flies.indexOf(best), 1);
    const r = $('#bookBtn').getBoundingClientRect();
    this.flying.push({ x: best.x, y: best.y, sx: best.x, sy: best.y, tx: r.left + r.width / 2, ty: r.top + r.height / 2, t: 0 });
    const n = Stickers.fly(); Snd.catchFly(n);
    Sparks.burst(best.x, best.y, 10, { speed: U * 0.15, g: 0, life: 0.6, size: U * 0.02 });
    return true;
  },
  update(dt) {
    for (let i = this.flying.length - 1; i >= 0; i--) {
      const f = this.flying[i]; f.t += dt / 0.9;
      const k = easeInOut(f.t), arc = Math.sin(Math.min(1, f.t) * Math.PI) * U * 0.12;
      f.x = lerp(f.sx, f.tx, k); f.y = lerp(f.sy, f.ty, k) - arc;
      if (f.t >= 1) { this.flying.splice(i, 1); $('#bookBtn').classList.add('bump'); setTimeout(() => $('#bookBtn').classList.remove('bump'), 400); }
    }
  },
  draw(c) {
    const img = Sprites.get('fly');
    for (const f of this.flying) { const s = U * 0.03 * (1 - f.t * 0.5); c.globalAlpha = 1; c.drawImage(img, f.x - s, f.y - s, s * 2, s * 2); }
  },
};
