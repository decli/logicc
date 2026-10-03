/* =====================================================================
   造物 · weather — clouds, rain, rainbows, wind
   ===================================================================== */
const Weather = (() => {
  function makeCloud(x, y, user) {
    const w = (user ? rand(0.26, 0.36) : rand(0.2, 0.42)) * U, n = randi(7, 10), puffs = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1) * 2 - 1, r = w * 0.19 * (1 - Math.abs(t) * 0.5) * rand(0.85, 1.2);
      puffs.push({ dx: t * w * 0.42, dy: -r * rand(0.25, 0.7), r });
    }
    for (let i = 0; i < 3; i++) puffs.push({ dx: rand(-0.2, 0.2) * w, dy: -w * rand(0.14, 0.22), r: w * rand(0.12, 0.17) });
    return { x, y, w, puffs, vx: user ? 0 : rand(3, 9) * (Math.random() < 0.5 ? -1 : 1), born: world.t, rain: user ? 7.5 : 0, rained: 0, user, a: 0, dying: false, dark: 0 };
  }

  function addUserCloud(x, y) {
    y = clamp(y, H * 0.12, GROUND - U * 0.3);
    const userClouds = world.clouds.filter(c => c.user && !c.dying);
    if (userClouds.length >= 5) userClouds[0].dying = true;
    const c = makeCloud(x, y, true); world.clouds.push(c);
    Snd.noiseHit(x, 0.12, 'lowpass', 300, 1400, 0.9, 0.7);
    Sparks.burst(x, y, 10, { col: '#fff', speed: U * 0.15, g: 0, life: 0.8 });
    return c;
  }

  function ensureAmbient() {
    const amb = world.clouds.filter(c => !c.user);
    if (amb.length < 3) {
      const c = makeCloud(Math.random() < 0.5 ? -U * 0.3 : W + U * 0.3, rand(H * 0.08, GROUND - U * 0.48), false);
      c.vx = (c.x < 0 ? 1 : -1) * rand(4, 10); world.clouds.push(c);
    }
  }

  function update(dt) {
    if (world.phase === 'world') ensureAmbient();
    let raining = 0;
    for (let i = world.clouds.length - 1; i >= 0; i--) {
      const c = world.clouds[i];
      c.x += (c.vx + world.gust * U * 0.9 + world.wind * 6) * dt;
      c.a = c.dying ? c.a - dt * 0.6 : Math.min(1, c.a + dt * 1.2);
      if (c.rain > 0) {
        c.rain -= dt; c.rained += dt; raining++;
        c.dark = Math.min(1, c.dark + dt * 1.5);
        const rate = 90 * c.w / U;
        let k = rate * dt; while (k > 0) { if (Math.random() < k) world.drops.push({ x: c.x + rand(-0.38, 0.38) * c.w, y: c.y + rand(-4, 6), vy: U * rand(1.3, 1.7), len: rand(0.012, 0.022) * U }); k -= 1; }
        if (c.rain <= 0 && c.user) {
          c.dying = true;
          if (world.sky.sun.up > 0.4 && world.sky.night < 0.2 && world.rainbow.life <= 0) {
            world.rainbow.life = 16; Snd.sparkle(W / 2, 6, 7, 0.1);
            Story.event('rainbow');
            Creatures.react('rainbow');
          }
        }
      } else c.dark = Math.max(0, c.dark - dt * 0.5);
      if ((c.dying && c.a <= 0) || c.x < -c.w * 1.5 || c.x > W + c.w * 1.5) world.clouds.splice(i, 1);
    }
    Snd.rain(Math.min(1, raining * 0.6));
    world.raining = raining;
    // raindrops
    const D = world.drops, wx = world.gust * U * 1.5 + world.wind * 20;
    for (let i = D.length - 1; i >= 0; i--) {
      const d = D[i]; d.y += d.vy * dt; d.x += wx * dt;
      const gy = groundY(d.x);
      if (d.y > gy + rand(0, U * 0.08)) {
        if (Math.random() < 0.25) world.sparks.push({ kind: 'dust', x: d.x, y: d.y, vx: rand(-20, 20), vy: -rand(20, 50), g: U, age: 0, life: 0.35, s: U * 0.012 });
        if (Math.random() < 0.035 + (Story.wantsFlowers() ? 0.04 : 0)) { Flowers.add(d.x, gy + rand(0, (H - gy) * 0.75)); if (Math.random() < 0.3) Snd.pop(d.x, 0.06); }
        D.splice(i, 1);
      }
    }
    if (D.length > 900) D.splice(0, D.length - 900);
    // rainbow
    const rb = world.rainbow;
    if (rb.life > 0) { rb.life -= dt; rb.a = Math.min(1, rb.a + dt * 0.4); } else rb.a = Math.max(0, rb.a - dt * 0.25);
    // wind
    world.gust *= Math.exp(-dt * 0.9);
    if (Math.abs(world.gust) < 0.001) world.gust = 0;
    for (let i = world.streaks.length - 1; i >= 0; i--) { const s = world.streaks[i]; s.age += dt; s.x += s.vx * dt; if (s.age > s.life) world.streaks.splice(i, 1); }
  }

  function gust(x0, y0, x1, y1, speed) {
    const dir = Math.sign(x1 - x0) || 1, strength = clamp(speed / (U * 3), 0.25, 1);
    world.gust = clamp(world.gust + dir * strength * 0.8, -1.2, 1.2);
    for (let i = 0; i < 9; i++) world.streaks.push({ x: lerp(x0, x1, rand()) - dir * U * 0.1, y: lerp(y0, y1, rand()) + rand(-U * 0.08, U * 0.08), vx: dir * U * rand(0.7, 1.2), len: U * rand(0.08, 0.18), age: 0, life: rand(0.6, 1.1), ph: rand(TAU), dir });
    Snd.whoosh((x0 + x1) / 2, strength);
    // shake petals off every tree
    for (const t of world.trees) for (let k = 0; k < 4 * strength; k++) if (t.P.petal && t.g > 0.95) { const tip = pick(t.tips); const [px, py] = t.worldPos(tip.i); Petals.add(px, py, pick(t.P.petal), 1.2); }
    Creatures.react('wind', dir);
    if (strength > 0.45) Stickers.give('wind');
  }

  function cloudColors(c) {
    const s = world.sky;
    let top = mix([255, 255, 255], s.bot, 0.18), bot = mix([206, 214, 228], s.mid, 0.3);
    top = mix(top, mix(s.tint, [255, 255, 255], 0.25), s.tintA * 0.75);
    bot = mix(bot, s.top, s.tintA * 0.7);
    const dk = c.dark * 0.45;
    top = mix(top, [120, 130, 150], dk); bot = mix(bot, [80, 88, 108], dk);
    return [top, bot];
  }

  function drawClouds(c) {
    for (const cl of world.clouds) {
      const [top, bot] = cloudColors(cl), g = c.createLinearGradient(0, cl.y - cl.w * 0.32, 0, cl.y + cl.w * 0.06);
      g.addColorStop(0, rgba(top, cl.a * 0.97)); g.addColorStop(1, rgba(bot, cl.a * 0.95));
      c.fillStyle = g; c.beginPath();
      const bob = Math.sin(world.t * 0.7 + cl.born) * 2;
      for (const p of cl.puffs) { const r = p.r * (cl.user ? easeOutBack((world.t - cl.born) / 0.7) : 1); if (r <= 0) continue; c.moveTo(cl.x + p.dx + r, cl.y + p.dy + bob); c.arc(cl.x + p.dx, cl.y + p.dy + bob, r, 0, TAU); }
      c.fill();
    }
  }

  function drawRain(c) {
    const D = world.drops; if (!D.length) return;
    const wx = (world.gust * U * 1.5 + world.wind * 20) * 0.02;
    c.strokeStyle = rgba(mix([92, 112, 150], [200, 214, 245], world.sky.night), 0.6); c.lineWidth = Math.max(1.2, U * 0.0022);
    c.beginPath();
    for (const d of D) { c.moveTo(d.x, d.y); c.lineTo(d.x - wx * d.len * 0.08, d.y - d.len); }
    c.stroke();
  }

  function drawStreaks(c) {
    if (!world.streaks.length) return;
    c.lineCap = 'round'; c.lineWidth = Math.max(1.2, U * 0.003);
    for (const s of world.streaks) {
      const k = s.age / s.life, a = Math.sin(k * Math.PI) * 0.55;
      c.strokeStyle = `rgba(255,255,255,${a})`; c.beginPath();
      const x0 = s.x - s.dir * s.len, curl = Math.sin(s.ph + k * 4) * U * 0.012;
      c.moveTo(x0, s.y); c.bezierCurveTo(x0 + s.dir * s.len * 0.4, s.y - curl, x0 + s.dir * s.len * 0.7, s.y + curl, s.x, s.y - curl * 0.5);
      if (k > 0.5) { c.arc(s.x, s.y - curl * 0.5 - U * 0.012, U * 0.012, Math.PI * 0.5, Math.PI * (0.5 + s.dir * 1.4), s.dir < 0); }
      c.stroke();
    }
  }

  return { addUserCloud, update, gust, drawClouds, drawRain, drawStreaks, makeCloud };
})();
