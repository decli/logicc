/* =====================================================================
   造物 · sky — day/night palette, stars, sun & moon, mountains, mist, ground
   ===================================================================== */
const Sky = (() => {
  // [time, top, mid, bottom, tint colour, tint amount, star alpha]
  const KEYS = [
    [0.000, '#040716', '#0a1330', '#18224a', '#0a1236', 0.62, 1.00],
    [0.190, '#0a0f2e', '#1f1c46', '#43305c', '#14123a', 0.55, 0.85],
    [0.240, '#28366f', '#a8657f', '#f0a07c', '#ff8f6e', 0.24, 0.20],
    [0.285, '#4b86cc', '#a5c6e3', '#f6d8b2', '#ffcf9e', 0.08, 0.00],
    [0.360, '#3a86d4', '#8ec2ea', '#d8edf7', '#ffffff', 0.00, 0.00],
    [0.640, '#3b82d0', '#93c3e8', '#e3eef0', '#fff4e0', 0.02, 0.00],
    [0.705, '#4b6db2', '#cf9a8c', '#f6c38c', '#ffb070', 0.12, 0.00],
    [0.750, '#2a2d6a', '#b0566c', '#ee8858', '#ff7a4a', 0.24, 0.12],
    [0.800, '#131536', '#3a2b5a', '#743f62', '#2a1d55', 0.45, 0.60],
    [0.860, '#060a20', '#0f183a', '#20274c', '#0a1236', 0.60, 1.00],
    [1.000, '#040716', '#0a1330', '#18224a', '#0a1236', 0.62, 1.00],
  ].map(k => [k[0], hex(k[1]), hex(k[2]), hex(k[3]), hex(k[4]), k[5], k[6]]);

  const MLAYERS = [
    { off: 0.28, amp: 0.17, col: hex('#93a9c4'), fog: 0.66, f: 2.1, seed: 13 },
    { off: 0.225, amp: 0.2, col: hex('#7193b1'), fog: 0.5, f: 2.3, seed: 23 },
    { off: 0.18, amp: 0.21, col: hex('#4f7e94'), fog: 0.34, f: 2.6, seed: 37 },
    { off: 0.11, amp: 0.15, col: hex('#3a6c72'), fog: 0.18, f: 3.5, seed: 51 },
    { off: 0.045, amp: 0.085, col: hex('#2f5f57'), fog: 0.06, f: 5.2, seed: 67 },
  ];
  let ridges = [];     // per layer Float32Array of y values
  let RSTEP = 4;
  let stars = [], milky = [], mists = [], blades = [];

  let MU = 1;  // vertical unit for mountains: taller on portrait screens
  function build() {
    MU = H > W ? Math.max(U, H * 0.5) : U;
    RSTEP = Math.max(3, Math.round(W / 420));
    ridges = MLAYERS.map(L => {
      const n = Math.ceil(W / RSTEP) + 3, arr = new Float32Array(n);
      const yb = GROUND - MU * L.off;
      for (let i = 0; i < n; i++) {
        const x = (i - 1) * RSTEP, nx = (x / U) * L.f;
        const env = 0.6 + 0.4 * noise2(nx * 0.33, L.seed);
        let a = 1, fr = 1, s = 0, nm = 0;
        for (let o = 0; o < 4; o++) { const r = 1 - Math.abs(noise2(nx * fr, L.seed + o * 7.31)); s += r * r * a; nm += a; a *= 0.5; fr *= 2.13; }
        arr[i] = yb - (s / nm) * env * L.amp * MU;
      }
      return arr;
    });
    // stars
    stars = [];
    const ns = clamp(Math.round((W * H) / 4200), 120, 460);
    for (let i = 0; i < ns; i++) stars.push({ x: rand(W), y: rand(GROUND * 0.86), r: Math.pow(Math.random(), 2.6) * 1.5 + 0.35, ph: rand(TAU), sp: rand(0.6, 2.4) });
    milky = [];
    const nm = clamp(Math.round(W * 0.7), 300, 900);
    const ax = -W * 0.1, ay = GROUND * 0.05, bx = W * 1.1, by = GROUND * 0.62, len = hypot(bx - ax, by - ay);
    const nxp = -(by - ay) / len, nyp = (bx - ax) / len;
    for (let i = 0; i < nm; i++) {
      const t = Math.random(), off = gauss() * U * 0.06 * (0.6 + 0.4 * Math.sin(t * 9));
      milky.push({ x: ax + (bx - ax) * t + nxp * off, y: ay + (by - ay) * t + nyp * off, r: rand(0.3, 0.9), ph: rand(TAU) });
    }
    milkyBand = { ax, ay, bx, by };
    mists = [];
    for (let i = 0; i < 7; i++) mists.push({ x: rand(W), layer: i % 4, w: rand(0.45, 0.9) * U, sp: rand(4, 11) * (Math.random() < 0.5 ? -1 : 1), a: rand(0.18, 0.34) });
    blades = [];
    const step = Math.max(3, U / 170);
    for (let x = -4; x < W + 4; x += step * rand(0.6, 1.4)) blades.push({ x, h: rand(0.006, 0.017) * U, lean: rand(-0.5, 0.5), c: Math.random() < 0.55 ? 0 : 1, ph: x * 0.021 });
  }
  let milkyBand = { ax: 0, ay: 0, bx: 0, by: 0 };
  onResize(build);

  function ridgeY(layer, x) {
    const r = ridges[layer]; if (!r) return GROUND;
    const f = x / RSTEP + 1, i = clamp(Math.floor(f), 0, r.length - 2), t = f - i;
    return r[i] * (1 - t) + r[i + 1] * t;
  }

  function sunArc(p) {
    const hor = GROUND - U * 0.1, top = Math.max(H * 0.11, 58);
    return { x: W * (0.07 + 0.86 * p), y: hor - Math.sin(p * Math.PI) * (hor - top) };
  }
  const sunP = t => (t - 0.235) / 0.53;
  const moonP = t => (((t + 0.5) % 1) - 0.235) / 0.53;

  function update(dt) {
    const s = world.sky, t = world.time;
    let k = 0; while (k < KEYS.length - 2 && KEYS[k + 1][0] <= t) k++;
    const a = KEYS[k], b = KEYS[k + 1], f = smooth(0, 1, (t - a[0]) / (b[0] - a[0]));
    s.top = mix(a[1], b[1], f); s.mid = mix(a[2], b[2], f); s.bot = mix(a[3], b[3], f);
    s.tint = mix(a[4], b[4], f); s.tintA = lerp(a[5], b[5], f); s.stars = lerp(a[6], b[6], f);
    s.night = clamp((s.stars - 0.1) / 0.8, 0, 1);
    const sp = sunP(t), mp = moonP(t);
    const sa = sunArc(sp), ma = sunArc(mp);
    s.sun.x = sa.x; s.sun.y = sa.y; s.sun.p = sp; s.sun.up = smooth(-0.06, 0.05, sp) * smooth(1.06, 0.95, sp);
    s.moon.x = ma.x; s.moon.y = ma.y; s.moon.p = mp; s.moon.up = smooth(-0.06, 0.05, mp) * smooth(1.06, 0.95, mp);
    s.sunHeight = Math.sin(clamp(sp, 0, 1) * Math.PI); // 0 at horizon, 1 at noon
  }

  /* ---------- drawing ---------- */
  function drawSky(c, alpha) {
    const s = world.sky;
    const g = c.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, rgba(s.top)); g.addColorStop(0.58, rgba(s.mid)); g.addColorStop(1, rgba(s.bot));
    c.globalAlpha = alpha; c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
  }

  function drawStars(c, alpha) {
    const s = world.sky, A = s.stars * alpha;
    if (A < 0.01) return;
    // milky way glow
    const mb = milkyBand;
    c.save();
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, x = lerp(mb.ax, mb.bx, t), y = lerp(mb.ay, mb.by, t), r = U * (0.16 + 0.06 * Math.sin(i * 1.7));
      const gg = c.createRadialGradient(x, y, 0, x, y, r);
      gg.addColorStop(0, `rgba(150,140,220,${0.06 * A})`); gg.addColorStop(1, 'rgba(150,140,220,0)');
      c.fillStyle = gg; c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    c.fillStyle = '#e8ecff';
    const tt = world.t;
    for (const m of milky) { c.globalAlpha = A * (0.35 + 0.25 * Math.sin(tt * 1.3 + m.ph)); c.fillRect(m.x, m.y, m.r, m.r); }
    for (const st of stars) {
      const tw = 0.55 + 0.45 * Math.sin(tt * st.sp + st.ph);
      c.globalAlpha = A * tw;
      if (st.r > 1.2) { c.beginPath(); c.arc(st.x, st.y, st.r, 0, TAU); c.fill(); c.globalAlpha = A * tw * 0.25; c.fillRect(st.x - st.r * 3, st.y - 0.4, st.r * 6, 0.8); c.fillRect(st.x - 0.4, st.y - st.r * 3, 0.8, st.r * 6); }
      else c.fillRect(st.x - st.r / 2, st.y - st.r / 2, st.r, st.r);
    }
    // shooting stars
    c.globalAlpha = 1;
    for (const sh of world.shooting) {
      const p = sh.age / sh.life, x = sh.x + sh.vx * sh.age, y = sh.y + sh.vy * sh.age;
      const tail = 0.18, tx = x - sh.vx * tail, ty = y - sh.vy * tail;
      const gr = c.createLinearGradient(x, y, tx, ty);
      const al = A * Math.sin(p * Math.PI);
      gr.addColorStop(0, `rgba(255,250,235,${al})`); gr.addColorStop(1, 'rgba(255,250,235,0)');
      c.strokeStyle = gr; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(tx, ty); c.stroke();
    }
    c.restore();
  }

  function drawSunMoon(c, alpha) {
    const s = world.sky, su = s.sun, mo = s.moon;
    c.save();
    if (su.up > 0.001) {
      const low = 1 - s.sunHeight;
      const core = mix(hex('#fffaf0'), hex('#ffd3a0'), low), edge = mix(hex('#ffe9b8'), hex('#ff8a50'), low);
      const R = U * (0.042 + 0.012 * low);
      c.globalCompositeOperation = 'lighter';
      const gr = U * (0.55 + 0.35 * low);
      const g = c.createRadialGradient(su.x, su.y, R * 0.5, su.x, su.y, gr);
      g.addColorStop(0, rgba(edge, 0.42 * su.up * alpha)); g.addColorStop(0.25, rgba(edge, 0.14 * su.up * alpha)); g.addColorStop(1, rgba(edge, 0));
      c.fillStyle = g; c.fillRect(su.x - gr, su.y - gr, gr * 2, gr * 2);
      c.globalCompositeOperation = 'source-over';
      const d = c.createRadialGradient(su.x - R * 0.2, su.y - R * 0.2, 0, su.x, su.y, R);
      d.addColorStop(0, rgba(core, alpha)); d.addColorStop(1, rgba(edge, alpha));
      c.fillStyle = d; c.beginPath(); c.arc(su.x, su.y, R, 0, TAU); c.fill();
    }
    if (mo.up > 0.001) {
      const R = U * 0.034;
      c.globalCompositeOperation = 'lighter';
      const gr = U * 0.32;
      const g = c.createRadialGradient(mo.x, mo.y, R, mo.x, mo.y, gr);
      g.addColorStop(0, `rgba(200,215,255,${0.22 * mo.up * alpha})`); g.addColorStop(1, 'rgba(200,215,255,0)');
      c.fillStyle = g; c.fillRect(mo.x - gr, mo.y - gr, gr * 2, gr * 2);
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = `rgba(246,242,222,${alpha})`; c.beginPath(); c.arc(mo.x, mo.y, R, 0, TAU); c.fill();
      c.fillStyle = `rgba(190,186,170,${0.35 * alpha})`;
      for (const [dx, dy, r] of [[-0.3, -0.2, 0.22], [0.25, 0.15, 0.16], [-0.05, 0.4, 0.12], [0.35, -0.35, 0.1]]) { c.beginPath(); c.arc(mo.x + dx * R, mo.y + dy * R, r * R, 0, TAU); c.fill(); }
    }
    c.restore();
  }

  function layerColor(i) {
    const L = MLAYERS[i], s = world.sky;
    let col = mix(L.col, s.bot, L.fog * 0.9);
    col = mix(col, mix(s.tint, s.mid, 0.4), s.tintA * (0.9 - i * 0.05));
    return col;
  }

  function drawMountains(c, from, to, rise) {
    const s = world.sky;
    for (let i = from; i <= to; i++) {
      const L = MLAYERS[i], r = ridges[i]; if (!r) continue;
      const lift = rise ? rise(i) : 0;
      const yb = GROUND - MU * L.off + lift, ytop = yb - L.amp * MU;
      const col = layerColor(i);
      const g = c.createLinearGradient(0, ytop, 0, yb + U * 0.06);
      g.addColorStop(0, rgba(mix(col, [255, 255, 255], 0.06 * (1 - s.tintA))));
      g.addColorStop(0.55, rgba(col));
      g.addColorStop(1, rgba(mix(col, s.bot, 0.55)));
      c.fillStyle = g;
      c.beginPath(); c.moveTo(-RSTEP, H);
      for (let k = 0; k < r.length; k++) c.lineTo((k - 1) * RSTEP, r[k] + lift);
      c.lineTo(W + RSTEP, H); c.closePath(); c.fill();
      // mist band at the foot of each layer
      const mb = c.createLinearGradient(0, yb - U * 0.08, 0, yb + U * 0.06);
      const haze = mix(s.bot, s.mid, 0.25);
      const ma = (0.55 - i * 0.07) * (1 - s.night * 0.45);
      mb.addColorStop(0, rgba(haze, 0)); mb.addColorStop(0.55, rgba(haze, ma)); mb.addColorStop(1, rgba(haze, 0));
      c.fillStyle = mb; c.fillRect(0, yb - U * 0.08, W, U * 0.14);
      // drifting mist wisps
      for (const m of mists) {
        if (m.layer !== i) continue;
        const y = yb - U * 0.03;
        const gg = c.createRadialGradient(m.x, y, 0, m.x, y, m.w);
        gg.addColorStop(0, rgba(haze, m.a * (1 - s.night * 0.5))); gg.addColorStop(1, rgba(haze, 0));
        c.save(); c.translate(m.x, y); c.scale(1, 0.18); c.translate(-m.x, -y);
        c.fillStyle = gg; c.fillRect(m.x - m.w, y - m.w, m.w * 2, m.w * 2); c.restore();
      }
    }
  }

  function drawRainbow(c) {
    const rb = world.rainbow; if (rb.a < 0.01) return;
    const s = world.sky;
    const cx = clamp(W - s.sun.x, W * 0.2, W * 0.8), cy = GROUND + U * 0.08, R0 = U * 0.62;
    const cols = ['#ff5a5a', '#ff9a3c', '#ffe066', '#7ddc6a', '#5ab4ff', '#6a6cff', '#b06aff'];
    c.save(); c.globalCompositeOperation = 'screen';
    const bw = U * 0.016;
    for (let i = 0; i < cols.length; i++) {
      c.strokeStyle = cols[i]; c.globalAlpha = rb.a * 0.34 * (1 - s.night); c.lineWidth = bw + 1;
      c.beginPath(); c.arc(cx, cy, R0 - i * bw, Math.PI * 1.04, Math.PI * 1.96); c.stroke();
    }
    c.restore();
  }

  function drawGround(c, lift) {
    const gy0 = GROUND + lift;
    const g = c.createLinearGradient(0, gy0 - U * 0.03, 0, H);
    g.addColorStop(0, '#a6cc8e'); g.addColorStop(0.18, '#7fb072'); g.addColorStop(0.6, '#5a8f60'); g.addColorStop(1, '#3c6a4b');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(-10, H + 10);
    const step = Math.max(4, W / 300);
    for (let x = -10; x <= W + 10; x += step) c.lineTo(x, groundY(x) + lift);
    c.lineTo(W + 10, H + 10); c.closePath(); c.fill();
    // soft rim light along the ridge
    c.strokeStyle = 'rgba(214,236,170,.55)'; c.lineWidth = 1.5;
    c.beginPath();
    for (let x = -10; x <= W + 10; x += step) { const y = groundY(x) + lift + 1; x <= -10 ? c.moveTo(x, y) : c.lineTo(x, y); }
    c.stroke();
    // grass blades
    const sway = world.wind * 2.2 + world.gust * 7, tt = world.t;
    const cols = ['#5e9a5a', '#8cbf6e'];
    c.lineWidth = Math.max(1, U / 600); c.lineCap = 'round';
    for (let k = 0; k < 2; k++) {
      c.strokeStyle = cols[k]; c.beginPath();
      for (const b of blades) {
        if (b.c !== k) continue;
        const y = groundY(b.x) + lift + 1.5, sw = sway * (0.6 + 0.4 * Math.sin(tt * 2.1 + b.ph)) + Math.sin(tt * 1.3 + b.ph) * 1.2;
        c.moveTo(b.x, y); c.quadraticCurveTo(b.x + b.lean * b.h * 0.3 + sw * 0.4, y - b.h * 0.6, b.x + b.lean * b.h * 0.6 + sw, y - b.h);
      }
      c.stroke();
    }
  }

  function updateAmbient(dt) {
    for (const m of mists) { m.x += m.sp * dt * (1 + world.gust * 2 * Math.sign(m.sp)); if (m.x > W + m.w) m.x = -m.w; if (m.x < -m.w) m.x = W + m.w; }
    // shooting stars
    if (world.sky.stars > 0.6 && world.phase === 'world' && Math.random() < dt / 7) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      world.shooting.push({ x: rand(W * 0.15, W * 0.85), y: rand(H * 0.04, GROUND * 0.35), vx: dir * rand(0.5, 0.8) * U, vy: rand(0.18, 0.3) * U, age: 0, life: rand(0.7, 1.1) });
      Snd.chime(0.05); if (Math.random() < 0.5) setTimeout(() => Creatures.react('star'), 400); setTimeout(() => Stickers.give('star'), 900);
    }
    for (let i = world.shooting.length - 1; i >= 0; i--) { const s = world.shooting[i]; s.age += dt; if (s.age > s.life) world.shooting.splice(i, 1); }
  }

  // mountains + rainbow change slowly: paint them to a layer ~12 times a second, blit every frame
  let mCache = null, mCtx = null, mT = -9, mTime = -1, mKey = '';
  function drawLandscape(c, rise) {
    if (rise) { drawMountains(c, 0, 1, rise); drawRainbow(c); drawMountains(c, 2, 4, rise); return; }
    const key = W + 'x' + H + '@' + DPR;
    if (!mCache) { mCache = document.createElement('canvas'); mCtx = mCache.getContext('2d'); }
    if (mKey !== key) { mCache.width = Math.round(W * DPR); mCache.height = Math.round(H * DPR); mKey = key; mT = -9; }
    if (world.t - mT > 0.08 || Math.abs(world.time - mTime) > 0.002) {
      mCtx.setTransform(DPR, 0, 0, DPR, 0, 0); mCtx.clearRect(0, 0, W, H);
      drawMountains(mCtx, 0, 1, null); drawRainbow(mCtx); drawMountains(mCtx, 2, 4, null);
      mT = world.t; mTime = world.time;
    }
    c.drawImage(mCache, 0, 0, W, H);
  }

  return { build, update, updateAmbient, drawLandscape, drawSky, drawStars, drawSunMoon, drawMountains, drawRainbow, drawGround, ridgeY, sunArc, sunP, moonP, layers: MLAYERS };
})();
