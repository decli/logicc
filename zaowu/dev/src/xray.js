/* =====================================================================
   造物 · x-ray — 透视. The same world, with its mathematics showing.
   ===================================================================== */
const XRay = (() => {
  const JADE = '159,227,196', PINK = '255,140,180', GOLD = '255,214,120';
  const FACTS = [
    { h: 'x_soft_h', p: 'x_soft_p', tag: 'shape matching · position-based dynamics' },
    { h: 'x_tree_h', p: 'x_tree_p', tag: 'recursion · fractal growth' },
    { h: 'x_bird_h', p: 'x_bird_p', tag: 'boids · Craig Reynolds, 1986' },
    { h: 'x_sound_h', p: 'x_sound_p', tag: 'Karplus–Strong, 1983 · 宫商角徵羽' },
    { h: 'x_voice_h', p: 'x_voice_p', tag: 'Kokoro-82M neural TTS · Web Speech fallback' },
    { h: 'x_sky_h', p: 'x_sky_p', tag: 'aerial perspective · colour interpolation' },
    { h: 'x_wind_h', p: 'x_wind_p', tag: 'vector field · exponential decay' },
    { h: 'x_none_h', p: 'x_none_p', tag: '0 images · 0 libraries' },
  ];
  let fi = 0;
  const card = $('#xcard'), btn = $('#btnX');
  function showFact() { const f = FACTS[fi]; $('#xTitle').textContent = L(f.h); $('#xBody').textContent = L(f.p); $('#xTag').textContent = f.tag; $('#xPrev').textContent = L('ui_prev'); $('#xNext').textContent = L('ui_next'); card.setAttribute('aria-label', L('ui_xray_title')); }
  onLang(() => { if (world.xray) showFact(); });
  $('#xPrev').addEventListener('click', () => { fi = (fi + FACTS.length - 1) % FACTS.length; showFact(); });
  $('#xNext').addEventListener('click', () => { fi = (fi + 1) % FACTS.length; showFact(); });
  function toggle(v) {
    world.xray = v === undefined ? !world.xray : v;
    btn.setAttribute('aria-pressed', world.xray);
    card.classList.toggle('on', world.xray);
    document.body.classList.toggle('xray', world.xray);
    if (world.xray) { fi = world.creatures.length ? 0 : world.trees.length ? 1 : 5; showFact(); Story.event('xray'); Snd.sparkle(W * 0.1, 3, 9, 0.08); }
  }
  btn.addEventListener('click', () => toggle());

  let placed = [];
  function label(c, x, y, text, col = JADE, align = 'left') {
    c.font = `500 ${clamp(U * 0.016, 10, 13)}px ${MONO}`;
    const w = c.measureText(text).width, h = clamp(U * 0.016, 10, 13) + 8;
    let x0 = align === 'center' ? x - w / 2 - 5 : align === 'right' ? x - w - 10 : x;
    x0 = clamp(x0, 4, W - w - 14);
    for (let k = 0; k < 12; k++) {
      const hit = placed.find(r => x0 < r[0] + r[2] && x0 + w + 10 > r[0] && y - h / 2 < r[1] + r[3] && y + h / 2 > r[1]);
      if (!hit) break; y = hit[1] - h / 2 - 2;
    }
    placed.push([x0, y - h / 2, w + 10, h]);
    c.fillStyle = 'rgba(4,14,12,.72)'; c.fillRect(x0, y - h / 2, w + 10, h);
    c.fillStyle = `rgba(${col},1)`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(text, x0 + 5, y + 0.5);
  }
  function arrow(c, x, y, dx, dy, col, w = 1.2) {
    const L = hypot(dx, dy); if (L < 2) return;
    const ux = dx / L, uy = dy / L, hx = x + dx, hy = y + dy, s = Math.min(6, L * 0.4);
    c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.lineTo(hx, hy);
    c.moveTo(hx, hy); c.lineTo(hx - ux * s - uy * s * 0.6, hy - uy * s + ux * s * 0.6);
    c.moveTo(hx, hy); c.lineTo(hx - ux * s + uy * s * 0.6, hy - uy * s - ux * s * 0.6); c.stroke();
  }

  function draw(c) {
    placed = [];
    c.save();
    c.fillStyle = 'rgba(2,10,12,.42)'; c.fillRect(0, 0, W, H);
    // graph paper
    c.strokeStyle = `rgba(${JADE},.06)`; c.lineWidth = 1; c.beginPath();
    const gs = Math.max(32, U * 0.05);
    for (let x = 0; x < W; x += gs) { c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, H); }
    for (let y = 0; y < H; y += gs) { c.moveTo(0, y + 0.5); c.lineTo(W, y + 0.5); }
    c.stroke();
    // horizon & ground function
    c.strokeStyle = `rgba(${JADE},.35)`; c.setLineDash([3, 5]); c.beginPath();
    for (let x = 0; x <= W; x += 8) x ? c.lineTo(x, groundY(x)) : c.moveTo(x, groundY(x));
    c.stroke(); c.setLineDash([]);
    label(c, 12, groundY(12) + 16, L('x_ground'));
    // wind field
    const wy0 = H * 0.16, wy1 = GROUND - U * 0.32, step = Math.max(64, U * 0.11);
    for (let y = wy0; y < wy1; y += step) for (let x = step / 2; x < W; x += step) {
      const n = noise2(x * 0.004 + world.t * 0.15, y * 0.004) * 0.6;
      const wx = world.wind * 18 + world.gust * 70 + Math.cos(n) * 6, wy = Math.sin(n) * 6;
      arrow(c, x, y, wx, wy, `rgba(${JADE},${0.18 + Math.min(0.5, Math.abs(world.gust))})`);
    }
    // sun / time
    const s = world.sky, body = s.sun.up > 0.2 ? s.sun : s.moon;
    const hrs = (world.time * 24 + 24) % 24, hh = Math.floor(hrs), mm = Math.floor((hrs - hh) * 60);
    c.strokeStyle = `rgba(${GOLD},.5)`; c.setLineDash([2, 4]); c.beginPath(); c.arc(body.x, body.y, U * 0.06, 0, TAU); c.stroke(); c.setLineDash([]);
    const alt = Math.round(Math.sin(clamp(body.p, 0, 1) * Math.PI) * 62);
    const lx = body.x > W * 0.6 ? body.x - U * 0.075 : body.x + U * 0.075;
    label(c, lx, body.y, L('x_time', { t: String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'), b: L(s.sun.up > 0.2 ? 'x_sun' : 'x_moon'), a: alt }), GOLD, body.x > W * 0.6 ? 'right' : 'left');
    // trees: skeleton coloured by generation
    for (const t of world.trees) {
      if (t.g <= 0) continue;
      c.save(); c.translate(t.x, t.y); c.transform(1, 0, -t.sw, 1, 0, 0);
      c.lineWidth = 1.2;
      for (let d = 0; d <= (t.P.pine ? 2 : t.P.depth); d++) {
        c.strokeStyle = `hsla(${150 + d * 28},80%,68%,.9)`; c.beginPath();
        for (let i = 0; i < t.n; i++) {
          const b = t.br[i]; if (b.d !== d || t.ef[i] <= 0) continue;
          c.moveTo(b.p < 0 ? 0 : t.ex[b.p], b.p < 0 ? 0 : t.ey[b.p]); c.lineTo(t.ex[i], t.ey[i]);
        }
        c.stroke();
      }
      c.fillStyle = `rgba(${GOLD},.9)`;
      for (const b of t.tips) if (t.ef[b.i] >= 1) c.fillRect(t.ex[b.i] - 1.5, t.ey[b.i] - 1.5, 3, 3);
      c.restore();
      let live = 0; for (let i = 0; i < t.n; i++) if (t.ef[i] > 0) live++;
      label(c, t.x, t.y + 14, L('x_treelab', { n: isEn() ? t.type : t.P.name, d: (t.P.depth || 7) + 1, b: live }), JADE, 'center');
    }
    // birds
    const B = world.birds;
    if (B.length) {
      const b0 = B[0];
      c.strokeStyle = `rgba(${JADE},.25)`; c.beginPath(); c.arc(b0.x, b0.y, U * 0.14, 0, TAU); c.stroke();
      c.strokeStyle = `rgba(${PINK},.4)`; c.beginPath(); c.arc(b0.x, b0.y, U * 0.045, 0, TAU); c.stroke();
      for (const b of B) arrow(c, b.x, b.y, b.vx * 0.12, b.vy * 0.12, `rgba(${JADE},.8)`);
      label(c, b0.x + U * 0.15, b0.y, L('x_birds', { n: B.length }));
    }
    // creatures: point masses, goals, springs
    for (const cr of world.creatures) {
      if (cr.birth < 1) continue;
      c.strokeStyle = `rgba(${PINK},.55)`; c.lineWidth = 1; c.beginPath();
      for (let i = 0; i < cr.N; i++) { c.moveTo(cr.px[i], cr.py[i]); c.lineTo(cr.gx[i], cr.gy[i]); }
      c.stroke();
      c.strokeStyle = `rgba(${JADE},.85)`; c.beginPath();
      for (let i = 0; i <= cr.N; i++) { const k = i % cr.N; i ? c.lineTo(cr.px[k], cr.py[k]) : c.moveTo(cr.px[k], cr.py[k]); }
      c.stroke();
      c.fillStyle = `rgba(${JADE},1)`;
      for (let i = 0; i < cr.N; i++) { c.beginPath(); c.arc(cr.px[i], cr.py[i], 2.2, 0, TAU); c.fill(); }
      c.strokeStyle = `rgba(${PINK},.9)`;
      for (let i = 0; i < cr.N; i += 2) { c.beginPath(); c.arc(cr.gx[i], cr.gy[i], 3, 0, TAU); c.stroke(); }
      // centre of mass + orientation
      const r = cr.R * 0.35;
      c.strokeStyle = `rgba(${GOLD},.95)`; c.beginPath(); c.moveTo(cr.comx - 6, cr.comy); c.lineTo(cr.comx + 6, cr.comy); c.moveTo(cr.comx, cr.comy - 6); c.lineTo(cr.comx, cr.comy + 6); c.stroke();
      c.beginPath(); c.arc(cr.comx, cr.comy, r, -Math.PI / 2, -Math.PI / 2 + cr.theta, cr.theta < 0); c.stroke();
      const vy = cr.vy.reduce((a, v) => a + v, 0) / cr.N;
      arrow(c, cr.comx, cr.comy, cr.cvx * 0.15, vy * 0.15, `rgba(${GOLD},.9)`, 1.6);
      let top = Infinity; for (let i = 0; i < cr.N; i++) top = Math.min(top, cr.py[i]);
      label(c, cr.comx, top - (cr.bubble ? 44 : 14), L('x_creature', { name: cr.name, n: cr.N, a: Math.round(cr.theta * 57.3), s: cr.sq.toFixed(2) }), PINK, 'center');
    }
    // clouds & rain
    for (const cl of world.clouds) if (cl.user && cl.rain > 0) label(c, cl.x, cl.y - cl.w * 0.35, L('x_rain', { n: Math.ceil(cl.rain) }), JADE, 'center');
    // oscilloscope
    drawScope(c);
    // stats
    let pts = 0; for (const cr of world.creatures) pts += cr.N;
    const parts = world.sparks.length + world.petals.length + world.drops.length + world.flies.length;
    const branches = world.trees.reduce((a, t) => a + t.n, 0);
    const yS = H - Math.max(18, (H - GROUND) * 0.1) - 92;
    label(c, W - 14, yS, L('x_stats', { f: Math.round(world.stats.fps), b: branches, p: pts, q: parts }), JADE, 'right');
    c.restore();
  }

  function drawScope(c) {
    const an = Snd.analyser, w = Math.min(280, W * 0.42), h = 54, x = W - w - 14, y = H - h - Math.max(18, (H - GROUND) * 0.1) - 14;
    c.fillStyle = 'rgba(4,14,12,.72)'; c.fillRect(x, y, w, h);
    c.strokeStyle = `rgba(${JADE},.35)`; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    c.strokeStyle = `rgba(${JADE},.95)`; c.lineWidth = 1.4; c.beginPath();
    if (an && Snd.running) {
      const buf = drawScope.buf || (drawScope.buf = new Float32Array(an.fftSize)); an.getFloatTimeDomainData(buf);
      for (let i = 0; i < w; i++) { const v = buf[Math.floor(i / w * buf.length)] || 0, yy = y + h / 2 - v * h * 1.6; i ? c.lineTo(x + i, yy) : c.moveTo(x, yy); }
    } else { c.moveTo(x, y + h / 2); c.lineTo(x + w, y + h / 2); }
    c.stroke();
    const notes = Snd.lastNotes.filter(n => world.t - n.t < 3).map(n => n.n).join(' ');
    label(c, x, y - 12, L('x_scope') + (notes ? ' · ' + notes : ''), JADE);
  }

  return { draw, toggle };
})();
