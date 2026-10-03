/* =====================================================================
   造物 · input — one finger does everything. The world reads the gesture:
   tap ground → tree · tap sky → cloud · closed loop → creature ·
   open stroke in the sky → wind · stroke on the ground → a row of flowers ·
   grab a creature → carry & fling · drag the sun or moon → time
   ===================================================================== */
const Input = (() => {
  const ptr = world.pointer;
  let mode = null, stroke = [], downX = 0, downY = 0, downT = 0, grabbed = null, lastX = 0, lastY = 0, lastMoveT = 0, chaosDist = 0;
  let draggingSky = false;

  function pos(e) { const r = cvs.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }

  function down(e) {
    if (e.button !== undefined && e.button > 0) return;
    e.preventDefault();
    try { cvs.setPointerCapture(e.pointerId); } catch (_) { }
    const [x, y] = pos(e);
    Object.assign(ptr, { x, y, down: true, active: true, vx: 0, vy: 0 });
    downX = lastX = x; downY = lastY = y; downT = performance.now(); lastMoveT = downT; chaosDist = 0;
    Snd.init(); Voice.unlock();
    if (world.phase === 'chaos') { mode = 'chaos'; return; }
    if (world.phase !== 'world') { mode = null; return; }
    if (Learn.capturing) { mode = 'learn'; return; }
    const cr = Creatures.at(x, y);
    if (cr && Echo.active && cr.echo) { mode = 'echo'; Echo.tap(cr); return; }
    if (Ring.target && Ring.target !== cr) Ring.close();
    if (cr) { mode = 'grab'; grabbed = cr; cr.startGrab(x, y); cvs.classList.add('grabbing'); return; }
    const s = world.sky;
    if ((s.sun.up > 0.2 && hypot(x - s.sun.x, y - s.sun.y) < Math.max(44, U * 0.085)) || (s.moon.up > 0.2 && hypot(x - s.moon.x, y - s.moon.y) < Math.max(44, U * 0.075))) {
      mode = 'sun'; draggingSky = true; Snd.pluck(5, x, 0.15, 0.8); return;
    }
    mode = 'stroke'; stroke = [{ x, y, t: downT }];
  }

  function move(e) {
    const [x, y] = pos(e), now = performance.now(), dtm = Math.max(1, now - lastMoveT) / 1000;
    ptr.vx = lerp(ptr.vx, (x - lastX) / dtm, 0.5); ptr.vy = lerp(ptr.vy, (y - lastY) / dtm, 0.5);
    ptr.x = x; ptr.y = y; ptr.active = true; lastMoveT = now;
    if (mode === 'chaos') chaosDist += hypot(x - lastX, y - lastY);
    else if (mode === 'stroke') { const l = stroke[stroke.length - 1]; if (hypot(x - l.x, y - l.y) > 2.5) stroke.push({ x, y, t: now }); }
    else if (mode === 'sun') {
      world.time = (world.time + (x - lastX) / (W * 0.86) * 0.53 + 1) % 1;
      if (Math.random() < 0.15) Sparks.burst(world.sky.sun.up > 0.2 ? world.sky.sun.x : world.sky.moon.x, world.sky.sun.up > 0.2 ? world.sky.sun.y : world.sky.moon.y, 1, { speed: U * 0.1, g: 0 });
    }
    if (!ptr.down && e.pointerType === 'mouse') updateCursor(x, y);
    lastX = x; lastY = y;
  }

  function updateCursor(x, y) {
    if (world.phase !== 'world') { cvs.className = ''; return; }
    cvs.className = Creatures.at(x, y) ? 'grab' : '';
  }

  function up(e) {
    const [x, y] = pos(e), dur = performance.now() - downT;
    ptr.down = false;
    if (e.pointerType !== 'mouse') ptr.active = false;
    cvs.classList.remove('grabbing');
    const moved = hypot(x - downX, y - downY);
    if (mode === 'chaos') { if (chaosDist > U * 0.12 && Story.touched) Genesis.begin(); else Genesis.tap(); }
    else if (mode === 'grab' && grabbed) {
      if (moved < 10 && dur < 380) { grabbed.grab = null; grabbed.poke(); Ring.open(grabbed); }
      else { grabbed.endGrab(); Ring.close(); }
      grabbed = null;
    } else if (mode === 'sun') { draggingSky = false; }
    else if (mode === 'stroke') classify(stroke, dur);
    else if (mode === 'learn' && moved < Math.max(14, U * 0.03)) Learn.tap(x, y);
    mode = null; stroke = [];
  }

  function cancel() { if (grabbed) { grabbed.endGrab(); grabbed = null; } mode = null; stroke = []; ptr.down = false; ptr.active = false; draggingSky = false; }

  function shoelace(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.x * b.y - b.x * a.y; } return Math.abs(s / 2); }

  function classify(pts, dur) {
    if (!pts.length) return;
    let L = 0; for (let i = 1; i < pts.length; i++) L += hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    const a = pts[0], b = pts[pts.length - 1], gap = hypot(b.x - a.x, b.y - a.y);
    if (L < 14 && dur < 500) return tap(a.x, a.y);
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
    const area = shoelace(pts), boxA = Math.max(1, bw * bh);
    const closed = gap < Math.max(U * 0.1, L * 0.2);
    const blobby = area > boxA * 0.3 && gap < L * 0.35;
    if (L > U * 0.16 && Math.max(bw, bh) > U * 0.06 && Math.min(bw, bh) > U * 0.025 && ((closed && L > U * 0.22) || (closed && area > (U * 0.045) ** 2) || blobby)) {
      const c = Creatures.spawn(pts);
      return c;
    }
    // open strokes
    const midY = ys.reduce((s, v) => s + v, 0) / ys.length, midX = xs.reduce((s, v) => s + v, 0) / xs.length;
    if (midY > groundY(midX) - U * 0.01) {          // on the ground: a row of flowers
      const n = Math.min(24, Math.floor(L / (U * 0.035)));
      for (let i = 0; i <= n; i++) { const p = pts[Math.floor(i / Math.max(1, n) * (pts.length - 1))]; setTimeout(() => { Flowers.add(p.x + rand(-4, 4), Math.max(p.y, groundY(p.x) + 2)); if (i % 3 === 0) Snd.pluck(5 + (i % 7), p.x, 0.12, 0.8); }, i * 45); }
      Story.event('flowers');
      return;
    }
    const speed = L / Math.max(0.05, dur / 1000);
    if (bw > U * 0.08) Weather.gust(a.x, a.y, b.x, b.y, speed);
  }

  function tap(x, y) {
    if (Catch.at(x, y)) return;
    if (Doodles.tap(x, y)) return;
    for (let i = world.trees.length - 1; i >= 0; i--) { const t = world.trees[i]; if (t.hit(x, y)) { t.shake(false); return; } }
    const gy = groundY(x);
    if (y >= gy - U * 0.012) {
      const ty = clamp(Math.max(y, gy + 2), gy + 2, H - 8);
      plantTree(x, ty);
    } else {
      Weather.addUserCloud(x, y);
      Story.event('cloud'); Creatures.react('cloud');
    }
  }

  function plantTree(x, y, type, seed) {
    const live = world.trees.filter(t => !t.dying);
    if (live.length >= 14) live[0].dying = true;
    const t = new Tree(x, y, type, seed);
    world.trees.push(t);
    Sparks.burst(x, y, 18, { up: true, speed: U * 0.3, g: U * 0.6, life: 0.9, size: U * 0.02 });
    for (let i = 0; i < 5; i++) setTimeout(() => Snd.pluck(clamp(Math.round(x / W * 8), 0, 8) + [0, 2, 4, 5, 7][i], x, 0.2 - i * 0.025, 0.65), 380 + i * 520);
    Story.event('tree', t); setTimeout(() => Creatures.react('tree'), 1800);
    return t;
  }

  function drawStroke(c) {
    if (mode !== 'stroke' || stroke.length < 2) return;
    const a = stroke[0], b = stroke[stroke.length - 1];
    let L = 0; for (let i = 1; i < stroke.length; i++) L += hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
    const closing = L > U * 0.16 && hypot(b.x - a.x, b.y - a.y) < Math.max(U * 0.1, L * 0.2);
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); stroke.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
    if (closing) { c.closePath(); c.fillStyle = 'rgba(255,248,225,.16)'; c.fill(); }
    c.strokeStyle = 'rgba(255,236,190,.35)'; c.lineWidth = 10; c.stroke();
    c.strokeStyle = 'rgba(255,252,240,.95)'; c.lineWidth = 3; c.stroke();
    // the start point: come back here to close the shape
    if (L > U * 0.08) {
      const pulse = 1 + Math.sin(world.t * 8) * 0.15, r = (closing ? 14 : 9) * pulse;
      c.strokeStyle = closing ? 'rgba(255,230,150,.95)' : 'rgba(255,255,255,.6)'; c.lineWidth = 2;
      c.beginPath(); c.arc(a.x, a.y, r, 0, TAU); c.stroke();
    }
    c.restore();
  }

  cvs.addEventListener('pointerdown', down);
  cvs.addEventListener('pointermove', move);
  cvs.addEventListener('pointerup', up);
  cvs.addEventListener('pointercancel', cancel);
  cvs.addEventListener('pointerleave', e => { if (!ptr.down) ptr.active = false; });
  cvs.addEventListener('contextmenu', e => e.preventDefault());

  return { drawStroke, plantTree, tap, get draggingSky() { return draggingSky; }, get mode() { return mode; } };
})();
