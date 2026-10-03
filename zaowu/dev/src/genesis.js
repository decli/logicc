/* =====================================================================
   造物 · genesis — 天地混沌如鸡子. An egg of swirling particles;
   tap to crack it, and the light rises into sky while the heavy sinks into earth.
   ===================================================================== */
const Genesis = (() => {
  let P = [], cracks = 0, crackPaths = [], shake = 0, gT = 0, ex = 0, ey = 0, rx = 1, ry = 1, flash = 0;
  const LIGHT = [[255, 226, 170], [255, 240, 205], [255, 200, 140], [250, 250, 235]];
  const HEAVY = [[70, 150, 170], [60, 110, 160], [100, 90, 170], [40, 140, 130]];

  function geom() {
    if (H > W * 1.15) { ex = W / 2; ey = H * 0.56; rx = Math.min(W * 0.3, H * 0.17); ry = rx * 1.3; }
    else { ex = W / 2; ey = H * 0.42; rx = U * 0.19; ry = U * 0.25; }
  }
  function build() {
    geom(); P = [];
    const n = clamp(Math.round((W * H) / 620), 1400, 3600);
    for (let i = 0; i < n; i++) {
      const a = rand(TAU), r = Math.sqrt(Math.random());
      const light = Math.random() < 0.5, ci = randi(0, 3);
      P.push({ x: ex + Math.cos(a) * r * rx, y: ey + Math.sin(a) * r * ry, vx: 0, vy: 0, light, ci: (light ? 0 : 4) + ci, c: (light ? LIGHT : HEAVY)[ci], s: rand(1, 2.2), a: rand(0.5, 1), tx: 0, ty: 0 });
    }
    P.sort((p, q) => p.ci - q.ci);
    trailsReady = false;
  }
  onResize(() => { if (world.phase === 'chaos') build(); else geom(); });

  function curl(x, y, t) {
    const e = 0.5, k = 0.0065;
    const n1 = noise2(x * k, (y + e) * k + t), n2 = noise2(x * k, (y - e) * k + t);
    const n3 = noise2((x + e) * k, y * k + t), n4 = noise2((x - e) * k, y * k + t);
    return [(n1 - n2) / (2 * e), -(n3 - n4) / (2 * e)];
  }

  function updateChaos(dt) {
    const t = world.t, breath = 1 + Math.sin(t * 1.6) * 0.025 + Math.pow(Math.max(0, Math.sin(t * 1.6 * 2)), 12) * 0.03;
    const RX = rx * breath, RY = ry * breath, ptr = world.pointer;
    shake = Math.max(0, shake - dt * 2.5);
    const relax = Math.min(1, dt * 2.6);
    for (const p of P) {
      const [cx, cy] = curl(p.x, p.y, t * 0.12);
      const dx = p.x - ex, dy = p.y - ey;
      // taiji: the light and the heavy swirl against each other
      const sw = p.light ? 1 : -1;
      let tvx = cx * U * 9 - (dy / RY) * sw * U * 0.13, tvy = cy * U * 9 + (dx / RX) * sw * U * 0.13;
      const e = (dx * dx) / (RX * RX) + (dy * dy) / (RY * RY);
      if (e > 0.62) { const d = Math.sqrt(dx * dx + dy * dy) + 1, k = (e - 0.62) * U * 1.1; tvx -= dx / d * k; tvy -= dy / d * k; }
      p.vx += (tvx - p.vx) * relax; p.vy += (tvy - p.vy) * relax;
      if (ptr.active) {
        const qx = p.x - ptr.x, qy = p.y - ptr.y, d2 = qx * qx + qy * qy, R = U * 0.12;
        if (d2 < R * R) { const d = Math.sqrt(d2) + 1, f = (1 - d / R) * U * 6 * dt; p.vx += (qx / d - qy / d * 0.8) * f; p.vy += (qy / d + qx / d * 0.8) * f; }
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }

  let trailsReady = false;
  function drawChaos(c) {
    // a translucent wash instead of a clear: particles leave silky trails, like ink in water
    c.fillStyle = trailsReady ? 'rgba(7,10,22,0.16)' : '#070a16'; c.fillRect(0, 0, W, H); trailsReady = true;
    const t = world.t, sx = shake ? rand(-1, 1) * shake * 6 : 0, sy = shake ? rand(-1, 1) * shake * 6 : 0;
    c.save(); c.translate(sx, sy);
    // inner glow of the egg
    const glow = c.createRadialGradient(ex, ey, 0, ex, ey, ry * 1.5);
    const gl = 0.035 + cracks * 0.025 + Math.sin(t * 1.6) * 0.01;
    glow.addColorStop(0, `rgba(255,214,160,${gl})`); glow.addColorStop(0.55, `rgba(120,140,220,${gl * 0.35})`); glow.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = glow; c.fillRect(ex - ry * 1.5, ey - ry * 1.5, ry * 3, ry * 3);
    c.globalCompositeOperation = 'lighter';
    const br = 1 + Math.sin(t * 1.6) * 0.025;
    c.strokeStyle = 'rgba(200,215,255,0.007)'; c.lineWidth = 6;
    c.beginPath(); c.ellipse(ex, ey, rx * 1.02 * br, ry * 1.02 * br, 0, 0, TAU); c.stroke();
    let ci = -1;
    for (const p of P) { if (p.ci !== ci) { ci = p.ci; c.fillStyle = rgba(p.c, p.light ? 0.42 : 0.5); } c.fillRect(p.x, p.y, p.s, p.s); }
    // cracks with light pouring through
    if (crackPaths.length) {
      c.lineCap = 'round'; c.lineJoin = 'round';
      for (const [w, a] of [[9, 0.12], [4, 0.35], [1.6, 1]]) {
        c.strokeStyle = `rgba(255,236,190,${a})`; c.lineWidth = w;
        for (const path of crackPaths) { c.beginPath(); path.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); }
      }
    }
    c.restore();
  }

  function addCrack() {
    const path = [];
    const a = rand(-0.5, 0.5) + (cracks % 2 ? Math.PI : 0), len = rx * rand(0.7, 1.1);
    let x = ex + rand(-0.15, 0.15) * rx, y = ey + rand(-0.2, 0.2) * ry; path.push([x, y]);
    for (let i = 0; i < 7; i++) { x += Math.cos(a + rand(-0.7, 0.7)) * len / 7; y += Math.sin(a + rand(-0.7, 0.7)) * len / 7 * 1.2; path.push([x, y]); }
    crackPaths.push(path);
  }

  function tap() {
    if (world.phase !== 'chaos') return;
    Snd.init();
    if (!Story.touched) { Story.firstTouch(); shake = 0.5; Snd.thump(70, 0.35, 0.5); return; }
    cracks++; shake = 1; addCrack(); Snd.crack(cracks);
    for (const p of P) { const dx = p.x - ex, dy = p.y - ey, d = hypot(dx, dy) + 1; p.vx += dx / d * U * 0.22; p.vy += dy / d * U * 0.22; }
    if (cracks >= 3) begin();
    else Story.chaosTap(cracks);
  }

  function begin() {
    if (world.phase !== 'chaos') return;
    Snd.init();
    world.phase = 'genesis'; gT = 0; flash = 1;
    world.time = 0.2;
    Snd.genesis();
    Story.genesis();
    for (const p of P) {
      if (p.light) { p.vx = rand(-0.4, 0.4) * U + (p.x - ex) * 1.2; p.vy = -rand(0.5, 1.5) * U; }
      else { p.vx = (p.x - ex) * rand(1.5, 4); p.vy = rand(0.1, 0.5) * U; p.tx = rand(W); }
    }
  }

  function updateGenesis(dt) {
    gT += dt; flash = Math.max(0, flash - dt * 1.4);
    world.reveal = clamp(gT / 4.6, 0, 1);
    world.time = lerp(0.2, 0.3, easeInOut(clamp((gT - 0.6) / 6.5, 0, 1)));
    for (const p of P) {
      if (p.light) { p.vy -= U * 0.6 * dt; p.vx *= 1 - dt * 0.6; }
      else { p.vy += U * 1.4 * dt; p.vx *= 1 - dt * 1.2; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.a = Math.max(0, p.a - dt * 0.38);
      if (!p.light && p.y > groundY(p.x)) { p.y = groundY(p.x); p.vy *= -0.1; p.a = Math.max(0, p.a - dt * 2); }
    }
    if (gT > 6.8) { world.phase = 'world'; P = []; crackPaths = []; Story.worldReady(); }
  }

  function drawGenesisOverlay(c) {
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const p of P) { if (p.a <= 0.01) continue; c.fillStyle = rgba(p.c, p.a * 0.9); c.fillRect(p.x, p.y, p.s * 1.2, p.s * 1.2); }
    if (flash > 0) {
      const r = U * (0.3 + (1 - flash) * 2.2), g = c.createRadialGradient(ex, ey, 0, ex, ey, r);
      g.addColorStop(0, `rgba(255,250,235,${flash})`); g.addColorStop(1, 'rgba(255,250,235,0)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
    }
    c.restore();
  }

  // how far below its home each mountain layer still is
  function rise(i) { return (1 - easeOutCubic(clamp(world.reveal * 1.5 - i * 0.12, 0, 1))) * H * 0.75; }
  function groundLift() { return (1 - easeOutCubic(clamp(world.reveal * 1.35 - 0.2, 0, 1))) * H * 0.5; }

  return { build, tap, begin, updateChaos, drawChaos, updateGenesis, drawGenesisOverlay, rise, groundLift, get cracks() { return cracks; }, get egg() { return { x: ex, y: ey, rx, ry }; } };
})();
