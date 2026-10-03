/* =====================================================================
   造物 · draw — 画一画. Pick something to draw, draw it with crayons,
   and it comes to life in the world: a sun climbs into the sky, a cloud
   drifts (and rains when tapped), a flower takes root, a hat lands on a
   friend's head. The shape is read back to the child in words:
   圆圆的 round · 尖尖的 pointy · 长长的 long · 弯弯的 curly …
   ===================================================================== */

/* ---------- a drawing turned into a picture ---------- */
const Sketch = {
  // strokes: [{ c: crayon index, w: width (0..1 of the board), p: [x0,y0,x1,y1,…] in 0..1 board units }]
  pack(strokes) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, wmax = 0;
    for (const s of strokes) { wmax = Math.max(wmax, s.w); for (let i = 0; i < s.p.length; i += 2) { x0 = Math.min(x0, s.p[i]); x1 = Math.max(x1, s.p[i]); y0 = Math.min(y0, s.p[i + 1]); y1 = Math.max(y1, s.p[i + 1]); } }
    const pad = wmax * 0.6; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    const bw = Math.max(1e-3, x1 - x0), bh = Math.max(1e-3, y1 - y0), m = Math.max(bw, bh);
    return {
      a: Math.round(bw / bh * 1000) / 1000,
      box: [x0, y0, bw, bh],
      s: strokes.map(s => [s.c, Math.round(s.w / m * 1000), s.p.map((v, i) => Math.round((i % 2 ? (v - y0) / bh : (v - x0) / bw) * 1000))]),
    };
  },
  render(data, size = 220) {
    const a = data.a || 1, w = a >= 1 ? size : Math.max(8, Math.round(size * a)), h = a >= 1 ? Math.max(8, Math.round(size / a)) : size, m = Math.max(w, h);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const c = cv.getContext('2d'); c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [ci, wi, p] of data.s) {
      const col = (CRAYONS[ci] || CRAYONS[0]).hex;
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = Math.max(1.5, wi / 1000 * m);
      const X = i => p[i] / 1000 * w, Y = i => p[i + 1] / 1000 * h;
      if (p.length <= 2) { c.beginPath(); c.arc(X(0), Y(0), c.lineWidth / 2, 0, TAU); c.fill(); continue; }
      c.beginPath(); c.moveTo(X(0), Y(0));
      for (let i = 2; i < p.length - 2; i += 2) c.quadraticCurveTo(X(i), Y(i), (X(i) + X(i + 2)) / 2, (Y(i) + Y(i + 2)) / 2);
      c.lineTo(X(p.length - 2), Y(p.length - 2)); c.stroke();
    }
    // a soft white rim so dark crayons read on a dark sky
    const out = document.createElement('canvas'); out.width = w + 8; out.height = h + 8;
    const o = out.getContext('2d'); o.shadowColor = 'rgba(255,255,255,.55)'; o.shadowBlur = 5; o.drawImage(cv, 4, 4);
    return out;
  },
  // how does it look? → one adjective, and its main colour
  read(strokes) {
    let L = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, turn = 0, corners = 0, best = null, bestL = 0;
    const byCol = {};
    for (const s of strokes) {
      let sl = 0; const p = s.p;
      for (let i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); }
      for (let i = 2; i < p.length; i += 2) sl += hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1]);
      // direction changes, measured over a few points so jitter does not count
      for (let i = 6; i < p.length - 6; i += 2) {
        const a1 = Math.atan2(p[i + 1] - p[i - 5], p[i] - p[i - 6]), a2 = Math.atan2(p[i + 7] - p[i + 1], p[i + 6] - p[i]);
        let d = Math.abs(a2 - a1); if (d > Math.PI) d = TAU - d; turn += d / 3;
        if (d > 1.45) { corners++; i += 6; }
      }
      L += sl; byCol[s.c] = (byCol[s.c] || 0) + sl;
      if (sl > bestL) { bestL = sl; best = s; }
    }
    const bw = x1 - x0, bh = y1 - y0, big = Math.max(bw, bh);
    // roundness of the longest stroke, if it closes on itself
    let round = 0;
    if (best && best.p.length > 10) {
      const p = best.p, gap = hypot(p[0] - p[p.length - 2], p[1] - p[p.length - 1]);
      if (gap < bestL * 0.18) { let A = 0; for (let i = 0; i < p.length; i += 2) { const j = (i + 2) % p.length; A += p[i] * p[j + 1] - p[j] * p[i + 1]; } round = 4 * Math.PI * Math.abs(A / 2) / (bestL * bestL); }
    }
    let adj = 'cute';
    if (round > 0.72 && corners < 3) adj = 'round';
    else if (corners >= 4) adj = 'pointy';
    else if (bh > bw * 2.1) adj = 'tall';
    else if (bw > bh * 2.1) adj = 'long';
    else if (turn / Math.max(1, strokes.length) > 9) adj = 'curly';
    else if (big > 0.72) adj = 'big';
    else if (big < 0.3) adj = 'small';
    const cols = Object.entries(byCol).sort((a, b) => b[1] - a[1]);
    const color = cols.length >= 3 && cols[2][1] > L * 0.14 ? 'many' : CRAYONS[+cols[0][0]].id;
    return { adj, color, L };
  },
};

/* ---------- drawings living in the world ---------- */
const Doodles = (() => {
  const SKY = ['sun', 'cloud', 'bird', 'star', 'free'], WORDOF = { sun: 'sun', cloud: 'cloud', flower: 'flower', house: 'house', bird: 'bird', star: 'star', free: 'picture' };
  const SIZE = { sun: 0.17, cloud: 0.27, flower: 0.13, house: 0.21, bird: 0.13, star: 0.1, free: 0.16 };
  const list = () => world.doodles || (world.doodles = []);
  function dims(d) { const m = U * SIZE[d.t] * (d.k || 1), a = d.data.a; return a >= 1 ? [m, m / a] : [m * a, m]; }
  function place(d) {
    const s = SKY.includes(d.t);
    if (d.t === 'sun') { d.tx = rand(W * 0.15, W * 0.85); d.ty = H * rand(0.1, 0.16); }
    else if (d.t === 'star') { d.tx = rand(W * 0.08, W * 0.92); d.ty = H * rand(0.07, 0.26); }
    else if (d.t === 'cloud') { d.tx = rand(W * 0.15, W * 0.85); d.ty = Math.min(H * rand(0.16, 0.3), GROUND - U * 0.35); }
    else if (d.t === 'bird') { d.tx = rand(W * 0.2, W * 0.8); d.ty = Math.min(H * rand(0.14, 0.34), GROUND - U * 0.3); d.vx = (Math.random() < 0.5 ? -1 : 1) * U * 0.11; }
    else if (d.t === 'free') { d.tx = rand(W * 0.12, W * 0.88); d.ty = Math.min(H * rand(0.14, 0.32), GROUND - U * 0.3); }
    else { // on the ground: away from the trees if possible
      let x = rand(W * 0.08, W * 0.92);
      for (let k = 0; k < 12; k++) { if (!world.trees.some(t => Math.abs(t.x - x) < U * 0.08) && !list().some(o => o !== d && !SKY.includes(o.t) && Math.abs(o.x - x) < U * 0.1)) break; x = rand(W * 0.08, W * 0.92); }
      const gy = groundY(x); d.tx = x; d.dep = d.t === 'house' ? rand(0.04, 0.22) : rand(0.1, 0.7); d.ty = gy + d.dep * (H - gy);
    }
    if (!s) d.ground = true;
  }
  function add(theme, data, from) {
    const L = list();
    const same = L.filter(o => o.t === theme); if (same.length >= 3) L.splice(L.indexOf(same[0]), 1);
    if (L.length >= 14) L.shift();
    const d = { t: theme, data, img: Sketch.render(data), k: 1, born: world.t, ph: rand(TAU), rot: 0, bump: 0, rain: 0 };
    place(d);
    d.x = d.tx; d.y = d.ty;
    if (from) { d.fly = { sx: from.x, sy: from.y, sw: from.w, t: 0 }; }
    L.push(d);
    return d;
  }
  function update(dt) {
    for (const d of list()) {
      d.bump = Math.max(0, d.bump - dt * 2.5);
      if (d.fly) { d.fly.t += dt / 1.3; if (d.fly.t >= 1) { d.fly = null; if (d.onLand) { const f = d.onLand; d.onLand = null; f(); } } }
      if (d.t === 'cloud') { d.x += (world.gust * U * 0.25 + world.wind * 6 + 5) * dt; if (d.x > W + U * 0.2) d.x = -U * 0.2; if (d.x < -U * 0.2) d.x = W + U * 0.2; d.ty = d.y; }
      else if (d.t === 'bird') { d.x += d.vx * dt; if (d.x > W + U * 0.15) d.x = -U * 0.15; if (d.x < -U * 0.15) d.x = W + U * 0.15; }
      else if (d.t === 'free') { d.x += (world.gust * U * 0.12 + Math.sin(world.t * 0.3 + d.ph) * 6) * dt; d.x = clamp(d.x, U * 0.05, W - U * 0.05); }
      else if (d.ground) d.y = groundY(d.x) + d.dep * (H - groundY(d.x));
      if (d.rain > 0) {
        d.rain -= dt; const [w] = dims(d);
        let k = 40 * dt; while (k > 0) { if (Math.random() < k) world.drops.push({ x: d.x + rand(-0.4, 0.4) * w, y: d.y + rand(-2, 8), vy: U * rand(1.3, 1.7), len: rand(0.012, 0.022) * U }); k -= 1; }
      }
    }
  }
  function pos(d) {
    if (!d.fly) return [d.x, d.y, 1];
    const k = easeInOut(Math.min(1, d.fly.t)), [w] = dims(d), arc = Math.sin(k * Math.PI) * U * 0.12;
    return [lerp(d.fly.sx, d.x, k), lerp(d.fly.sy, d.y, k) - arc, lerp(d.fly.sw / w, 1, k)];
  }
  function drawOne(c, d) {
    const [w, h] = dims(d), [x, y, sc] = pos(d), t = world.t, grow = d.fly ? 1 : easeOutBack(clamp((t - d.born) / 0.5, 0, 1));
    c.save(); c.translate(x, y);
    let sx = sc * grow, sy = sc * grow, rot = 0;
    if (d.t === 'sun') {
      rot = t * 0.15 + d.ph; c.globalAlpha = 1 - world.sky.night * 0.4;
      const g = c.createRadialGradient(0, 0, w * 0.2, 0, 0, w * 0.9); g.addColorStop(0, 'rgba(255,230,140,.45)'); g.addColorStop(1, 'rgba(255,230,140,0)');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, w * 0.9 * sc, 0, TAU); c.fill();
    } else if (d.t === 'star') {
      const tw = 1 + Math.sin(t * 3 + d.ph) * 0.08; sx *= tw; sy *= tw;
      const n = world.sky.night, g = c.createRadialGradient(0, 0, 0, 0, 0, w * 0.9); g.addColorStop(0, `rgba(255,248,200,${0.15 + n * 0.45})`); g.addColorStop(1, 'rgba(255,248,200,0)');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, w * 0.9 * sc, 0, TAU); c.fill();
    } else if (d.t === 'bird') { sy *= 1 + Math.sin(t * 9 + d.ph) * 0.16; c.translate(0, Math.sin(t * 2 + d.ph) * U * 0.01); if (d.vx < 0) sx = -sx; }
    else if (d.t === 'cloud') c.translate(0, Math.sin(t * 0.7 + d.ph) * U * 0.006);
    else if (d.t === 'free') {
      const bob = Math.sin(t * 1.4 + d.ph) * U * 0.012; c.translate(0, bob); rot = Math.sin(t * 0.9 + d.ph) * 0.06;
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, h * 0.5 * sc); c.quadraticCurveTo(U * 0.02 * Math.sin(t + d.ph), h * 0.5 * sc + U * 0.07, 0, h * 0.5 * sc + U * 0.13); c.stroke();
    }
    if (d.bump) { const b = Math.sin(d.bump * 9) * d.bump * 0.12; sx *= 1 + b; sy *= 1 - b; }
    if (d.ground) {   // grows from its foot, sways with the wind
      const sway = d.t === 'flower' ? Math.sin(t * 1.3 + d.ph) * 0.06 + world.gust * 0.25 : 0;
      c.rotate(sway); c.scale(sx, sy); c.drawImage(d.img, -w / 2, -h, w, h);
    } else { c.rotate(rot); c.scale(sx, sy); c.drawImage(d.img, -w / 2, -h / 2, w, h); }
    c.restore();
  }
  function hit(d, x, y) {
    const [w, h] = dims(d), [px, py] = pos(d);
    if (d.ground) return Math.abs(x - px) < w * 0.55 && y < py + 6 && y > py - h * 1.05;
    return Math.abs(x - px) < w * 0.6 && Math.abs(y - py) < h * 0.6;
  }
  function at(x, y) { const L = list(); for (let i = L.length - 1; i >= 0; i--) if (!L[i].fly && hit(L[i], x, y)) return L[i]; return null; }
  function tap(x, y) {
    const d = at(x, y); if (!d) return false;
    d.bump = 1;
    if (d.t === 'cloud') { d.rain = 4.5; Story.event('cloud'); Creatures.react('cloud'); }
    else if (d.t === 'sun' || d.t === 'star') { Snd.sparkle(d.x, 5, 6, 0.1); Sparks.burst(d.x, d.y, 16, { speed: U * 0.3, g: 0, life: 0.8, size: U * 0.025 }); }
    else if (d.t === 'bird') { Snd.chirp ? Snd.chirp(d.x) : Snd.pop(d.x, 0.1); d.vx = -d.vx; }
    else if (d.t === 'flower') { Snd.pluck(7, d.x, 0.14, 0.8); for (let k = 0; k < 5; k++) Petals.add(d.x + rand(-8, 8), d.y - dims(d)[1] * 0.8, pick(['#ff9fc0', '#ffd36e', '#fff']), 1); }
    else { Snd.pop(d.x, 0.12); for (let k = 0; k < 3; k++) Sparks.sign(d.x + rand(-1, 1) * U * 0.04, d.y - U * 0.08, '♥', '#ff7aa0', 0.9); }
    return true;
  }
  return {
    add, update, at, tap,
    word: d => WORDOF[d.t],
    find(id) { return list().find(d => WORDOF[d.t] === id && !d.fly) || null; },
    drawSky(c) { for (const d of list()) if (!d.ground && !d.fly) drawOne(c, d); },
    drawGround: drawOne,
    drawFlying(c) { for (const d of list()) if (d.fly) drawOne(c, d); },
    get ground() { return list().filter(d => d.ground && !d.fly); },
    hatFrom(data) { try { return { data, img: Sketch.render(data, 160) }; } catch (_) { return null; } },
    toJSON() { return list().filter(d => !d.fly).map(d => ({ t: d.t, x: Math.round(d.x / W * 1000) / 1000, y: Math.round((d.ground ? d.dep : d.y / H) * 1000) / 1000, d: d.data })); },
    restore(arr) {
      for (const o of arr) {
        try {
          const d = add(o.t, o.d); d.born = world.t - 5; d.x = d.tx = clamp(o.x * W, 10, W - 10);
          if (d.ground) { d.dep = o.y; d.y = d.ty = groundY(d.x) + d.dep * (H - groundY(d.x)); } else d.y = d.ty = Math.min(o.y * H, GROUND - U * 0.25);
        } catch (_) { }
      }
    },
    onResize(sx) { for (const d of list()) { d.x *= sx; if (d.ground) d.y = groundY(d.x) + d.dep * (H - groundY(d.x)); else d.y = Math.min(d.y, GROUND - U * 0.25); } },
  };
})();

/* ---------- the drawing pad ---------- */
const Draw = (() => {
  const pad = $('#pad'), themesEl = $('#padThemes'), board = $('#board'), cv = $('#padCvs'), bar = $('#padBar'), crayEl = $('#crayons');
  const c = cv.getContext('2d');
  let open_ = false, theme = null, strokes = [], cur = null, crayon = 0, B = 300, dpr = 1, drawn = 0;
  const WIDTH = 0.022;

  function paintTexts() {
    $('#padExit').textContent = L('echo_exit'); $('#padBack').textContent = L('draw_back');
    $('#padUndo').textContent = L('draw_undo'); $('#padClear').textContent = L('draw_clear'); $('#padDone').textContent = L('draw_done');
    if (theme) { const t = DRAW_THEMES.find(q => q.id === theme), w = WORD[t.w]; $('#padPrompt').textContent = t.e + ' ' + (isEn() ? t.p[1] : t.p[0]) + '  ' + (isEn() ? w.zh : w.en); }
    else $('#padPrompt').textContent = '🖍️ ' + L('draw_pick');
    paintThemes(); paintCrayons();
  }
  function paintThemes() {
    themesEl.innerHTML = '';
    const en = isEn(), noFriend = !world.creatures.some(c => c.birth >= 1);
    for (const t of DRAW_THEMES) {
      const w = WORD[t.w], b = document.createElement('button'); b.type = 'button'; b.className = 'theme';
      b.innerHTML = `<span class="te">${t.e}</span><span class="tz">${en ? w.en : w.zh}</span><span class="tn">${en ? w.zh : w.en}</span>`;
      if (t.id === 'hat' && noFriend) b.setAttribute('aria-disabled', 'true'), b.style.opacity = 0.45;
      b.addEventListener('click', () => {
        if (t.id === 'hat' && !world.creatures.some(c => c.birth >= 1)) { Voice.seq([L('draw_nofriend')], 'learn'); return; }
        pickTheme(t.id);
      });
      themesEl.appendChild(b);
    }
  }
  function paintCrayons() {
    crayEl.innerHTML = '';
    CRAYONS.forEach((k, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'crayon'; b.style.background = k.hex;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', i === crayon ? 'true' : 'false'); b.setAttribute('aria-label', isEn() ? k.en : k.zh);
      b.addEventListener('click', () => { crayon = i; paintCrayons(); Snd.pluck(3 + i, W / 2, 0.1, 0.8); Voice.seq(isEn() ? [k.en, k.zh] : [k.zh, k.en], 'learn'); });
      crayEl.appendChild(b);
    });
  }
  function open(t) {
    if (Echo.active) Echo.stop(true);
    Learn.stop(true); Ring.close(); Story.hush(); Snd.init(); Voice.unlock();
    open_ = true; theme = null; strokes = []; drawn = 0; document.body.classList.add('gaming');
    document.querySelectorAll('.dk').forEach(b => b.classList.toggle('cur', b.dataset.m === 'draw'));
    pad.hidden = false; requestAnimationFrame(() => pad.classList.add('on'));
    if (t) pickTheme(t); else { showThemes(); Voice.seq([L('draw_pick')], 'learn'); }
  }
  function showThemes() { theme = null; themesEl.hidden = false; board.hidden = true; bar.hidden = true; $('#padBack').hidden = true; paintTexts(); }
  function pickTheme(id) {
    theme = id; strokes = []; themesEl.hidden = true; board.hidden = false; bar.hidden = false; $('#padBack').hidden = false;
    paintTexts(); sizeBoard(); redraw();
    const t = DRAW_THEMES.find(q => q.id === id), w = WORD[t.w], en = isEn();
    Snd.pop(W / 2, 0.1);
    Voice.seq([t.p[en ? 1 : 0], en ? w.zh : w.en], 'learn');
  }
  function close(quiet) {
    if (!open_) return;
    open_ = false; pad.classList.remove('on'); setTimeout(() => { if (!open_) pad.hidden = true; }, 300);
    if (!Learn.mode) document.body.classList.remove('gaming');
    document.querySelectorAll('.dk').forEach(b => b.classList.remove('cur'));
    if (!quiet) Voice.clear('learn');
  }
  function sizeBoard() {
    if (board.hidden) return;
    const r = board.getBoundingClientRect();
    B = Math.max(160, Math.floor(Math.min(r.width, r.height) - 6)); dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.style.width = B + 'px'; cv.style.height = B + 'px'; cv.width = Math.round(B * dpr); cv.height = Math.round(B * dpr);
    redraw();
  }
  function strokePath(s) {
    const p = s.p, X = i => p[i] * B, Y = i => p[i + 1] * B;
    c.strokeStyle = CRAYONS[s.c].hex; c.fillStyle = CRAYONS[s.c].hex; c.lineWidth = s.w * B;
    if (p.length <= 2) { c.beginPath(); c.arc(X(0), Y(0), s.w * B / 2, 0, TAU); c.fill(); return; }
    c.beginPath(); c.moveTo(X(0), Y(0));
    for (let i = 2; i < p.length - 2; i += 2) c.quadraticCurveTo(X(i), Y(i), (X(i) + X(i + 2)) / 2, (Y(i) + Y(i + 2)) / 2);
    c.lineTo(X(p.length - 2), Y(p.length - 2)); c.stroke();
  }
  function redraw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, B, B);
    // a faint hint of what to draw, like tracing paper
    if (theme && !strokes.length && !cur) {
      const t = DRAW_THEMES.find(q => q.id === theme);
      c.save(); c.globalAlpha = 0.09; c.font = `${B * 0.5}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t.e, B / 2, B * 0.53); c.restore();
    }
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of strokes) strokePath(s);
    if (cur) strokePath(cur);
  }
  function pt(e) { const r = cv.getBoundingClientRect(); return [clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1)]; }
  cv.addEventListener('pointerdown', e => {
    e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) { }
    const [x, y] = pt(e); cur = { c: crayon, w: WIDTH, p: [x, y] }; redraw();
  });
  cv.addEventListener('pointermove', e => {
    if (!cur) return; const [x, y] = pt(e), p = cur.p;
    if (hypot(x - p[p.length - 2], y - p[p.length - 1]) > 0.006) { p.push(x, y); redraw(); if (Math.random() < 0.08) Snd.pluck(4 + crayon % 5, W / 2, 0.025, 0.9); }
  });
  const end = () => { if (!cur) return; strokes.push(cur); cur = null; redraw(); };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  $('#padUndo').addEventListener('click', () => { strokes.pop(); redraw(); Snd.pop(W / 2, 0.06); });
  $('#padClear').addEventListener('click', () => { strokes = []; redraw(); Snd.whoosh(W / 2, 0.3); });
  $('#padBack').addEventListener('click', () => { showThemes(); Snd.pop(W / 2, 0.08); });
  $('#padExit').addEventListener('click', () => close(false));
  pad.addEventListener('keydown', e => { if (e.key === 'Escape') close(false); });

  function done() {
    const read = Sketch.read(strokes);
    if (!strokes.length || read.L < 0.12) { Voice.seq([L('draw_empty')], 'learn'); return; }
    const t = DRAW_THEMES.find(q => q.id === theme), li = isEn() ? 1 : 0;
    const r = cv.getBoundingClientRect(), data = Sketch.pack(strokes), [bx, by, bw, bh] = data.box;
    const from = { x: r.left + (bx + bw / 2) * r.width, y: r.top + (by + bh / 2) * r.height, w: Math.max(bw, bh) * r.width };
    const words = [adjLine(read.adj, theme, li), colorLine(read.color, li)];
    drawn++; Stickers.give('draw');
    const th = theme, lines = strokes.slice();
    close(true);
    const after = () => Voice.seq([t.done[li]], 'learn');
    if (th === 'friend') bringFriend(lines, read, from, () => Voice.seq(words.concat([t.done[li]]), 'learn'));
    else if (th === 'hat') putHat(data, from, words);
    else {
      const d = Doodles.add(th, data, from);
      d.onLand = () => { Snd.sparkle(d.x, 5, 6, 0.12); Sparks.burst(d.x, d.y, 18, { speed: U * 0.3, g: 0, life: 0.8, size: U * 0.024 }); Words.meet(Doodles.word(d)); };
      Voice.seq(words, 'learn', after);
    }
  }
  $('#padDone').addEventListener('click', done);

  // the outline becomes a new creature, in the main crayon colour
  function bringFriend(lines, read, from, speak) {
    let best = lines[0], bl = 0;
    for (const s of lines) { let l = 0; for (let i = 2; i < s.p.length; i += 2) l += hypot(s.p[i] - s.p[i - 2], s.p[i + 1] - s.p[i - 1]); if (l > bl) { bl = l; best = s; } }
    let pts = []; for (let i = 0; i < best.p.length; i += 2) pts.push({ x: best.p[i], y: best.p[i + 1] });
    const area = Math.abs(pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p.x * q.y - q.x * p.y; }, 0) / 2);
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y), box = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    if (pts.length < 6 || area < box * 0.18) { const all = []; for (const s of lines) for (let i = 0; i < s.p.length; i += 2) all.push({ x: s.p[i], y: s.p[i + 1] }); pts = hull(all); }
    const scale = from.w / Math.max(1e-3, Math.max(...pts.map(p => p.x)) - Math.min(...pts.map(p => p.x)), Math.max(...pts.map(p => p.y)) - Math.min(...pts.map(p => p.y)));
    const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length, cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
    const world_ = pts.map(p => ({ x: clamp(from.x + (p.x - cx) * scale, 20, W - 20), y: Math.min(from.y + (p.y - cy) * scale, GROUND - U * 0.05) }));
    const col = read.color === 'many' ? null : CRAYON_HUE[read.color];
    const cr = Creatures.spawn(world_, col ? { hue: col } : {});
    Words.meet('friend'); speak();
    return cr;
  }
  // a hat flies over to the nearest friend and lands on its head
  function putHat(data, from, words) {
    const list = world.creatures.filter(c => c.birth >= 1);
    if (!list.length) { Voice.seq(words, 'learn'); return; }
    const c = (Ring.target && list.includes(Ring.target)) ? Ring.target : list.slice().sort((a, b) => (a.hat ? 1 : 0) - (b.hat ? 1 : 0) || Math.abs(a.comx - from.x) - Math.abs(b.comx - from.x))[0];
    const hat = Doodles.hatFrom(data); if (!hat) return;
    Flying.push({ img: hat.img, from, to: c, t: 0, land: () => { if (world.creatures.includes(c)) { c.wear(hat); Words.meet('hat'); Sparks.burst(c.comx, c.comy - c.R, 18, { speed: U * 0.3, g: 0, life: 0.8, size: U * 0.024 }); } } });
    Voice.seq(words, 'learn');
  }
  const Flying = [];
  function hull(P) {
    const p = P.slice().sort((a, b) => a.x - b.x || a.y - b.y); if (p.length < 3) return p;
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x), lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  window.addEventListener('resize', () => { if (open_ && theme) sizeBoard(); });
  onLang(() => { if (open_) paintTexts(); });

  return {
    open, close,
    get active() { return open_; },
    update(dt) {
      for (let i = Flying.length - 1; i >= 0; i--) { const f = Flying[i]; f.t += dt / 1.2; if (f.t >= 1) { Flying.splice(i, 1); f.land(); } }
    },
    drawFlying(c) {
      for (const f of Flying) {
        const k = easeInOut(Math.min(1, f.t)), to = f.to, tx = to.comx, ty = to.comy - to.R, w = lerp(f.from.w, clamp(to.R * 1.25, U * 0.05, U * 0.16), k), h = w * f.img.height / f.img.width;
        const x = lerp(f.from.x, tx, k), y = lerp(f.from.y, ty, k) - Math.sin(k * Math.PI) * U * 0.15;
        c.drawImage(f.img, x - w / 2, y - h / 2, w, h);
      }
    },
  };
})();
/* crayon → a body colour for a drawn friend */
const CRAYON_HUE = { red: [2, 78, 66], orange: [28, 92, 64], yellow: [48, 95, 62], green: [125, 48, 60], blue: [208, 80, 66], purple: [272, 60, 72], pink: [335, 82, 78], brown: [24, 42, 52], black: [250, 12, 40], white: [40, 30, 90] };
