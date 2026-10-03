/* =====================================================================
   造物 · creatures — whatever you draw comes alive.
   Body: N point masses held in your drawn shape by shape matching
   (Müller et al. 2005, position-based dynamics). Squash & stretch,
   a face placed at the roomiest spot of your drawing, a name, a voice.
   ===================================================================== */
const BODY_HUES = [[350, 82, 80], [24, 92, 74], [46, 94, 68], [140, 52, 70], [188, 66, 70], [218, 78, 78], [268, 62, 79], [8, 82, 72], [96, 52, 70], [304, 56, 79], [168, 50, 68], [36, 70, 80]];
let nameBag = [], hueCursor = Math.floor(Math.random() * BODY_HUES.length), voiceCursor = randi(0, 1);
function nextNameIdx() {
  if (!nameBag.length) nameBag = [...NAME_PAIRS.keys()].sort(() => Math.random() - 0.5);
  const used = new Set(world.creatures.map(c => c.nameIdx)); let n;
  do { n = nameBag.pop(); } while (used.has(n) && nameBag.length);
  return n === undefined ? randi(0, NAME_PAIRS.length - 1) : n;
}

/* ---------- geometry helpers ---------- */
function chaikin(pts, iters) {
  for (let k = 0; k < iters; k++) {
    const out = [], n = pts.length;
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; out.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 }, { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 }); }
    pts = out;
  }
  return pts;
}
function perimeter(pts) { let L = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; L += hypot(b.x - a.x, b.y - a.y); } return L; }
function resampleClosed(pts, N) {
  const L = perimeter(pts), step = L / N, out = [];
  let i = 0, acc = 0, a = pts[0], b = pts[1 % pts.length], seg = hypot(b.x - a.x, b.y - a.y), target = 0;
  while (out.length < N) {
    if (acc + seg >= target) { const t = seg ? (target - acc) / seg : 0; out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }); target += step; }
    else { acc += seg; i++; a = pts[i % pts.length]; b = pts[(i + 1) % pts.length]; seg = hypot(b.x - a.x, b.y - a.y); if (i > pts.length * 2) break; }
  }
  return out;
}
function signedArea(xs, ys) { let s = 0; const n = xs.length; for (let i = 0; i < n; i++) { const j = (i + 1) % n; s += xs[i] * ys[j] - xs[j] * ys[i]; } return s / 2; }
function inPoly(x, y, xs, ys) { let c = false; for (let i = 0, j = xs.length - 1; i < xs.length; j = i++) { if (((ys[i] > y) !== (ys[j] > y)) && (x < (xs[j] - xs[i]) * (y - ys[i]) / (ys[j] - ys[i]) + xs[i])) c = !c; } return c; }
function distToPoly(x, y, xs, ys) {
  let m = Infinity; const n = xs.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, ax = xs[i], ay = ys[i], bx = xs[j], by = ys[j], dx = bx - ax, dy = by - ay;
    const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    m = Math.min(m, hypot(x - (ax + dx * t), y - (ay + dy * t)));
  }
  return m;
}

/* ---------- the creature ---------- */
class Creature {
  constructor(pts, opts = {}) {
    // 1. smooth and resample the drawing into N evenly spaced point masses
    let P = pts;
    if (!opts.raw) { P = chaikin(pts, 2); P = resampleClosed(P, clamp(Math.round(perimeter(P) / (U * 0.024)), 18, 40)); }
    const N = P.length;
    let xs = P.map(p => p.x), ys = P.map(p => p.y);
    if (signedArea(xs, ys) < 0) { xs.reverse(); ys.reverse(); }
    // 2. normalise size so it is never a speck nor a giant
    let cx = xs.reduce((a, b) => a + b) / N, cy = ys.reduce((a, b) => a + b) / N;
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys), D = Math.max(bw, bh);
    const minD = Math.max(46, U * 0.085), maxD = U * 0.27;
    const sf = D > maxD ? maxD / D : D < minD ? minD / D : 1;
    for (let i = 0; i < N; i++) { xs[i] = cx + (xs[i] - cx) * sf; ys[i] = cy + (ys[i] - cy) * sf; }
    this.N = N;
    this.qx = new Float32Array(N); this.qy = new Float32Array(N);       // rest shape (centred)
    for (let i = 0; i < N; i++) { this.qx[i] = xs[i] - cx; this.qy[i] = ys[i] - cy; }
    this.px = Float32Array.from(xs); this.py = Float32Array.from(ys);
    this.vx = new Float32Array(N); this.vy = new Float32Array(N);
    this.gx = new Float32Array(N); this.gy = new Float32Array(N);       // goal positions (for x-ray)
    this.area = Math.abs(signedArea(this.qx, this.qy));
    this.R = Math.sqrt(this.area / Math.PI);
    this.size = clamp((this.R - minD * 0.35) / (maxD * 0.5 - minD * 0.35), 0, 1);
    // 3. find the roomiest spot in the upper part of the body → the face
    this.placeFace();
    // identity
    this.setHue(opts.hue || BODY_HUES[hueCursor++ % BODY_HUES.length]);
    let ni = opts.nameIdx !== undefined ? opts.nameIdx : opts.name ? NAME_PAIRS.findIndex(p => p[0] === opts.name || p[1] === opts.name) : -1;
    this.nameIdx = ni >= 0 && ni < NAME_PAIRS.length ? ni : nextNameIdx();
    // a voice of its own: one of two speakers, pitched by size (small = squeaky)
    this.vrole = opts.vrole || (voiceCursor++ % 2 ? 'c1' : 'c0');
    this.vrate = lerp(1.3, 1.04, this.size) + rand(-0.03, 0.03);
    this.meals = opts.meals || 0; this.growth = opts.growth || 1; this.paint = -1; this.full = 0; this.fruit = null; this.wantFood = false;
    this.flipT = 0; this.echo = null; this.echoFlash = 0;
    this.deg = Math.round(lerp(10, 3, this.size));                     // big bodies sing low
    this.motif = pick([[0, 2, 4, 2], [0, 1, 2, 4], [4, 2, 0, 1], [0, 2, 1, 3], [2, 4, 5, 4], [0, 0, 2, 4]]);
    this.motifI = 0;
    this.hopiness = rand(0.16, 0.32);
    // state
    this.theta = 0; this.comx = cx; this.comy = cy;
    this.sq = 1; this.sqv = 0; this.sqT = 1;
    this.birth = opts.instant ? 1 : 0; this.age = 0;
    this.lane = 0; this.setLane();
    this.grounded = false; this.air = 0; this.crouch = 0; this.hopDir = 0;
    this.grab = null; this.dizzy = 0; this.happy = 0; this.sleep = 0; this.sleepT = rand(1, 6);
    this.blink = 0; this.blinkT = rand(1, 4); this.lookX = 0; this.lookY = 0; this.lx = 0; this.ly = 0;
    this.bubble = null; this.chatT = rand(8, 18); this.targetX = cx; this.wanderT = 0;
    this.mouth = 0; this.glow = 0; this.wet = 0;
    if (!opts.instant) {
      Sparks.burst(cx, cy, 34, { speed: U * 0.5, g: 0, life: 1.1, size: U * 0.03 });
      Snd.sparkle(cx, 5, 5, 0.14);
    }
  }

  setLane() {
    const maxLane = Math.max(4, (H - GROUND) * 0.62 - this.R * 0.4);
    let bottom = -Infinity, bx = 0; for (let i = 0; i < this.N; i++) if (this.py[i] > bottom) { bottom = this.py[i]; bx = this.px[i]; }
    const gy = groundY(bx);
    this.lane = bottom > gy ? clamp(bottom - gy, 4, maxLane) : maxLane * rand(0.3, 0.85);
  }
  floor(x) { return groundY(x) + this.lane; }

  placeFace() {
    const xs = this.qx, ys = this.qy, N = this.N;
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    let best = -Infinity, bx = 0, by = 0, br = 1;
    const G = 18;
    for (let i = 1; i < G; i++) for (let j = 1; j < G; j++) {
      const x = lerp(minX, maxX, i / G), y = lerp(minY, maxY, j / G);
      if (!inPoly(x, y, xs, ys)) continue;
      const d = distToPoly(x, y, xs, ys);
      const score = d - Math.max(0, (y - lerp(minY, maxY, 0.42))) * 0.55 - Math.abs(x) * 0.08;
      if (score > best) { best = score; bx = x; by = y; br = d; }
    }
    if (best === -Infinity) { bx = 0; by = 0; br = Math.max(8, Math.min(maxX - minX, maxY - minY) * 0.3); }
    this.eyeR = clamp(br * 0.27, U * 0.011, U * 0.024);   // thin bodies get googly eyes that poke out a little
    let ed = clamp(br * 0.48, this.eyeR * 1.35, this.eyeR * 3);
    // make sure both eyes sit inside the body
    for (let k = 0; k < 8; k++) {
      if (distToPoly(bx - ed, by, xs, ys) > this.eyeR * 1.1 && inPoly(bx - ed, by, xs, ys) && distToPoly(bx + ed, by, xs, ys) > this.eyeR * 1.1 && inPoly(bx + ed, by, xs, ys)) break;
      ed *= 0.85; if (ed < this.eyeR * 1.15) { this.eyeR *= 0.85; ed = this.eyeR * 1.2; }
    }
    this.hx = bx; this.hy = by; this.ed = ed; this.headR = br;
  }

  get name() { return NAME_PAIRS[this.nameIdx][isEn() ? 1 : 0]; }
  setHue(hue) {
    this.hue = hue;
    this.col = hsl2rgb(hue[0], hue[1], hue[2]);
    this.colLight = hsl2rgb(hue[0], Math.min(100, hue[1] + 5), Math.min(96, hue[2] + 11));
    this.colDark = hsl2rgb(hue[0], hue[1] * 0.75, hue[2] - 18);
    this.colLine = hsl2rgb(hue[0], hue[1] * 0.55, Math.max(20, hue[2] - 44));
  }

  contains(x, y) { return inPoly(x, y, this.px, this.py) || hypot(x - this.comx, y - this.comy) < Math.max(this.R * 0.6, 22); }

  // show a speech bubble and say it out loud (neural voice bank → system voice → babble)
  say(text, o = {}) {
    const b = this.bubble = { text, age: 0, life: o.life || clamp(1.2 + [...text].length * (isEn() ? 0.06 : 0.22), 1.6, 3.6), hold: false, talking: false };
    this.mouth = 1;
    let after = o.after, fired = false;
    const go = () => { if (!fired && after) { fired = true; after(); } };
    const ok = Voice.say(text, {
      role: this.vrole, rate: this.vrate, prio: o.prio === undefined ? 1 : o.prio, x: this.comx,
      onstart: d => { if (this.bubble === b) { b.hold = true; b.talking = true; if (d) b.life = Math.max(b.life, d + 0.6); } },
      onend: () => { if (this.bubble === b) { b.hold = false; b.talking = false; b.age = Math.max(b.age, b.life - 0.8); } go(); },
    });
    if (!ok) { Snd.talk(text, this.deg, this.comx, 0.12); if (after) setTimeout(go, 700); }
    else if (after) setTimeout(go, 4500);   // never wait forever for a voice that does not answer
  }
  speak(key, vars, o) { this.say(L(key, Object.assign({ name: this.name }, vars || {})), o); }

  /* ---------- simulation ---------- */
  step(h) {
    const N = this.N, G = U * 2.6, px = this.px, py = this.py, vx = this.vx, vy = this.vy;
    const xs = this._xs || (this._xs = new Float32Array(N)), ys = this._ys || (this._ys = new Float32Array(N));
    const wind = (world.gust * U * 1.1 + world.wind * U * 0.02) / Math.max(1, this.R / (U * 0.06));
    // predict
    for (let i = 0; i < N; i++) {
      vy[i] += G * h; vx[i] += wind * h * (this.grounded ? 0.35 : 1);
      xs[i] = px[i] + vx[i] * h; ys[i] = py[i] + vy[i] * h;
    }
    // shape matching: best rigid rotation of the rest shape onto the current points
    let cx = 0, cy = 0; for (let i = 0; i < N; i++) { cx += xs[i]; cy += ys[i]; } cx /= N; cy /= N;
    let a = 0, b = 0;
    for (let i = 0; i < N; i++) { const rx = xs[i] - cx, ry = ys[i] - cy; a += this.qx[i] * rx + this.qy[i] * ry; b += this.qx[i] * ry - this.qy[i] * rx; }
    let th = Math.atan2(b, a);
    this.theta = th;
    const upright = this.flipT > 0 ? 0 : this.grab ? 0.004 : this.dizzy > 0 ? 0.012 : 0.05;
    th *= 1 - upright;
    const c = Math.cos(th), s = Math.sin(th);
    const sy = this.sq, sx = 1 + (1 - this.sq) * 0.85;
    const alpha = this.grab ? 0.3 : 0.24;
    for (let i = 0; i < N; i++) {
      const qx = this.qx[i] * sx, qy = this.qy[i] * sy - (1 - sy) * this.R * 0.0;
      const gx = cx + c * qx - s * qy, gy = cy + s * qx + c * qy;
      this.gx[i] = gx; this.gy[i] = gy;
      xs[i] += (gx - xs[i]) * alpha; ys[i] += (gy - ys[i]) * alpha;
    }
    // the hand that holds it
    if (this.grab) {
      const g = this.grab, ptr = world.pointer;
      for (let k = -2; k <= 2; k++) {
        const i = (g.i + k + N) % N, w = k === 0 ? 0.6 : 0.3 / Math.abs(k);
        xs[i] += (ptr.x + g.ox[k + 2] - xs[i]) * w; ys[i] += (ptr.y + g.oy[k + 2] - ys[i]) * w;
      }
    }
    // collisions with the ground and the edges of the world
    let touching = 0, impact = 0;
    for (let i = 0; i < N; i++) {
      const f = this.floor(xs[i]);
      if (ys[i] > f) { const v = (ys[i] - py[i]) / h; if (v > impact) impact = v; ys[i] = f; touching++; }
      if (xs[i] < 3) xs[i] = 3; else if (xs[i] > W - 3) xs[i] = W - 3;
    }
    // update velocities (PBD)
    const damp = 0.996, fr = touching ? 0.86 : 1;
    for (let i = 0; i < N; i++) {
      let nvx = (xs[i] - px[i]) / h, nvy = (ys[i] - py[i]) / h;
      if (ys[i] >= this.floor(xs[i]) - 0.5) { nvx *= fr; if (nvy > 0) nvy = 0; }
      vx[i] = nvx * damp; vy[i] = nvy * damp;
      px[i] = xs[i]; py[i] = ys[i];
    }
    return { touching, impact };
  }

  update(dt) {
    this.age += dt;
    if (this.birth < 1) {
      this.birth = Math.min(1, this.birth + dt / 1.1);
      if (this.birth >= 1) {
        this.speak('c_hello', null, { life: 3.2, prio: 3 });
        Story.event('born', this);
        Creatures.react('born', this);
      }
      this.updateCom(); this.updateFace(dt);
      return;
    }
    // squash spring
    this.sqv += ((this.sqT - this.sq) * 240 - this.sqv * 11) * dt;
    this.sq = clamp(this.sq + this.sqv * dt, 0.55, 1.4);
    // sub-stepped physics
    const subs = 3, h = dt / subs;
    let landed = 0;
    let anyTouch = false;
    for (let k = 0; k < subs; k++) { const r = this.step(h); if (r.touching) anyTouch = true; if (r.impact > landed) landed = r.impact; }
    this.updateCom();
    if (anyTouch) {
      if (this.air > 0.18 && landed > U * 0.35) this.land(landed);
      this.air = 0; this.grounded = true;
    } else { this.air += dt; this.grounded = false; }
    // speed limit (a fling should fly, not teleport)
    const vmax = U * 5;
    for (let i = 0; i < this.N; i++) { const v = hypot(this.vx[i], this.vy[i]); if (v > vmax) { this.vx[i] *= vmax / v; this.vy[i] *= vmax / v; } }
    this.brain(dt);
    this.updateFace(dt);
    if (this.bubble) { const b = this.bubble; b.age += dt; if (b.hold) b.age = Math.min(b.age, b.life - 0.4); if (b.age > b.life) this.bubble = null; }
    this.mouth = this.bubble && this.bubble.talking ? 0.35 + 0.65 * Math.abs(Math.sin(this.age * 13)) : Math.max(0, this.mouth - dt * 2.2);
    this.full = Math.max(0, this.full - dt);
    this.echoFlash = Math.max(0, this.echoFlash - dt * 2.2);
    if (this.flipT > 0) { this.flipT -= dt; if (this.flipT <= 0.0001 && this.flipDone) { this.flipDone = false; } }
    this.happy = Math.max(0, this.happy - dt);
    this.dizzy = Math.max(0, this.dizzy - dt);
    this.glow = lerp(this.glow, world.sky.night > 0.6 ? 1 : 0, dt * 0.8);
  }

  updateCom() {
    let x = 0, y = 0, vx = 0; for (let i = 0; i < this.N; i++) { x += this.px[i]; y += this.py[i]; vx += this.vx[i]; }
    this.comx = x / this.N; this.comy = y / this.N; this.cvx = vx / this.N;
  }

  land(v) {
    const imp = v / U;
    this.sqv -= imp * 3.2;
    const x = this.comx, y = this.floor(x);
    for (let i = 0; i < Math.min(14, 4 + imp * 4); i++) world.sparks.push({ kind: 'dust', x: x + rand(-1, 1) * this.R, y, vx: rand(-1, 1) * U * 0.3, vy: -rand(0.05, 0.25) * U, g: U, age: 0, life: rand(0.4, 0.7), s: U * rand(0.014, 0.026) });
    if (this.flipping) {
      this.flipping = false; this.flipT = 0.25; this.happy = 1.2;
      this.speak('c_flipdone', null, { prio: 3 });
      Snd.boop(Snd.degFreq(this.deg + 2), x, 0.14, 0.18, 1.3);
    } else if (imp > 2.3 && !this.sleep) {
      this.dizzy = 2.6; this.speak('c_dizzy', null, { prio: 3 }); Stickers.give('dizzy');
      Snd.boop(Snd.degFreq(this.deg) * 0.8, x, 0.2, 0.5, 0.6);
    } else Snd.boop(Snd.degFreq(this.deg - 2), x, 0.08 + Math.min(0.12, imp * 0.04), 0.14, 1.15);
    if (this.sleep && imp > 0.8) this.wake('c_woken', 1);
  }

  /* ---------- behaviour ---------- */
  brain(dt) {
    const night = world.sky.night;
    // sleeping
    if (this.echo) { this.sqT = this.crouch > 0 ? 0.74 : 1; this.targetX = this.comx; this.sleep = 0; return; }
    if (this.sleep) {
      this.sqT = 1 + Math.sin(this.age * 1.8) * 0.035;
      if (Math.random() < dt * 0.6) Sparks.sign(this.comx + this.R * 0.4, this.comy - this.R * 0.8, pick(['z', 'Z', 'z']), 'rgba(230,236,255,.9)', 0.9);
      if (night < 0.25) this.wake();
      return;
    }
    if (night > 0.72 && this.grounded && !this.grab && !this.fruit) { this.sleepT -= dt; if (this.sleepT < 0) { this.sleep = 1; this.speak('c_sleep', null, { prio: 0 }); return; } }
    this.sqT = this.crouch > 0 ? 0.74 : 1;
    if (this.crouch > 0) { this.crouch -= dt; if (this.crouch <= 0) this.launch(); }
    // wander targets
    this.wanderT -= dt;
    if (this.wanderT < 0) {
      this.wanderT = rand(3, 7);
      const ptr = world.pointer;
      if (ptr.active && Math.random() < 0.45) this.targetX = ptr.x;
      else if (world.creatures.length > 1 && Math.random() < 0.35) { const o = pick(world.creatures.filter(c => c !== this)); this.targetX = o.comx + Math.sign(this.comx - o.comx) * (this.R + o.R) * 1.3; }
      else if (world.trees.length && Math.random() < 0.3) this.targetX = pick(world.trees).x + rand(-1, 1) * U * 0.05;
      else this.targetX = rand(W * 0.06, W * 0.94);
    }
    // food: walk (hop) over to a fallen fruit and eat it
    if (this.fruit && (this.fruit.gone || !world.fruits.includes(this.fruit))) this.fruit = null;
    if (!this.fruit && this.full <= 0 && !this.grab) {
      const f = Fruits.nearest(this.comx, this.wantFood ? W : U * 0.75);
      if (f) { this.fruit = f; f.claimed = this; if (!this.bubble && Math.random() < 0.5) this.speak('c_fruit', null, { prio: 0 }); }
    }
    if (this.fruit) {
      this.targetX = this.fruit.x; this.wanderT = 1.5;
      if (this.grounded && this.fruit.rest && Math.abs(this.fruit.x - this.comx) < Math.max(this.R * 0.75, U * 0.04)) this.eat(this.fruit);
    }
    // chatting with a friend
    this.chatT -= dt;
    if (this.chatT < 0) {
      this.chatT = rand(10, 22);
      const near = world.creatures.filter(c => c !== this && !c.sleep && c.birth >= 1 && Math.abs(c.comx - this.comx) < U * 0.45);
      if (near.length && !this.bubble && !Voice.busy) {
        const o = pick(near), pair = pick(CHATS()), a = pair[0].replace('{name}', this.name), b = pair[1].replace('{name}', o.name);
        this.lookAt = o; o.lookAt = this;
        this.say(a, { prio: 0, after: () => setTimeout(() => { if (world.creatures.includes(o) && !o.sleep) o.say(b, { prio: 1 }); }, 250) });
      }
      else if (!this.bubble && !Voice.busy && world.trees.some(t => t.g >= 1) && this.meals < 2 && Math.random() < 0.25) this.speak('c_hungry', null, { prio: 0 });
    }
  }

  onTick(n) {
    if (this.birth < 1 || this.sleep || this.grab || this.echo || this.flipT > 0 || this.dizzy > 0 || !this.grounded || this.crouch > 0) return;
    let p = this.hopiness * (n % 2 === 0 ? 1 : 0.35);
    if (this.fruit) p = Math.max(p, 0.55);
    if (Math.abs(this.targetX - this.comx) < this.R * 0.6) p *= 0.35;
    if (world.raining) p *= 1.4;
    if (Math.random() < p) { this.crouch = Clock.TICK * 0.45; this.hopDir = Math.sign(this.targetX - this.comx) || (Math.random() < 0.5 ? -1 : 1); }
  }

  launch(power = 1) {
    const big = lerp(1.15, 0.8, this.size);
    let vy = -U * rand(0.95, 1.3) * big * power;
    const dist = this.targetX - this.comx;
    let vx = clamp(dist * 0.9, -U * 0.42, U * 0.42);
    if (Math.abs(dist) < this.R * 0.6) vx = rand(-0.06, 0.06) * U;
    for (let i = 0; i < this.N; i++) { this.vx[i] += vx; this.vy[i] += vy; }
    this.sqv += 4;
    let d = this.deg + this.motif[this.motifI++ % this.motif.length];
    const chorus = this.chorus !== undefined;
    if (chorus) { d = 3 + this.chorus; for (let i = 0; i < this.N; i++) this.vy[i] -= U * 0.25; this.chorus = undefined; }
    Snd.boop(Snd.degFreq(d), this.comx, chorus ? 0.17 : 0.14, 0.2, 1.3);
    if (chorus) Snd.pluck(d + 5, this.comx, 0.09, 0.8);
    if (chorus || world.xray || Math.random() < 0.18) Sparks.sign(this.comx + rand(-1, 1) * this.R * 0.4, this.comy - this.R * 1.1, Snd.NAMES[((d % 5) + 5) % 5] , rgba(this.colLight), 0.8);
    this.mouth = 1;
  }

  wake(key, prio) { this.sleep = 0; this.sleepT = rand(2, 8); this.sqv += 5; this.speak(key || 'c_wake', null, { prio: prio !== undefined ? prio : key ? 3 : 1 }); }

  poke() {
    if (this.sleep) { this.wake('c_wakepoke'); return; }
    this.happy = 1.4;
    this.speak('c_poke', null, { prio: 3 });
    for (let i = 0; i < this.N; i++) this.vy[i] -= U * 0.75;
    this.sqv -= 3;
    for (let i = 0; i < 4; i++) Sparks.sign(this.comx + rand(-1, 1) * this.R, this.comy - this.R * rand(0.6, 1.2), '♥', '#ff7aa0', rand(0.7, 1.1));
    Story.event('poke', this);
  }

  startGrab(x, y) {
    let best = 0, bd = Infinity;
    for (let i = 0; i < this.N; i++) { const d = hypot(this.px[i] - x, this.py[i] - y); if (d < bd) { bd = d; best = i; } }
    const ox = [], oy = [];
    for (let k = -2; k <= 2; k++) { const i = (best + k + this.N) % this.N; ox.push((this.px[i] - x) * 0.4); oy.push((this.py[i] - y) * 0.4); }
    this.grab = { i: best, ox, oy, t: world.t };
    if (this.sleep) this.wake('c_grabwake');
    else if (!this.bubble) this.speak('c_grab', null, { prio: 3 });
  }
  endGrab() {
    if (!this.grab) return;
    const sp = hypot(this.cvx, this.vy.reduce((a, b) => a + b, 0) / this.N);
    this.grab = null; this.air = 0.3;
    if (sp > U * 1.6) { this.speak('c_fling', null, { prio: 3 }); Story.event('fling', this); }
  }

  /* ---------- things a child can ask it to do ---------- */
  eat(f) {
    Fruits.remove(f); this.fruit = null; this.full = 5; this.happy = 1.4; this.meals++;
    Snd.chomp(this.comx); this.sqv -= 4;
    Sparks.burst(f.x, f.y - f.r, 10, { col: '#fff', speed: U * 0.2, g: U * 0.4, life: 0.6, size: U * 0.016 });
    for (let i = 0; i < 3; i++) Sparks.sign(this.comx + rand(-1, 1) * this.R * 0.6, this.comy - this.R * rand(0.7, 1.1), '♥', '#ff7aa0', rand(0.7, 1));
    const grew = this.growth < 1.34;
    if (grew) this.grow(1.06);
    this.speak(this.meals % 3 === 0 && grew ? 'c_grow' : 'c_yummy', null, { prio: this.wantFood ? 3 : 1 });
    this.wantFood = false;
    Stickers.give('feed'); if (this.meals >= 3) Stickers.give('grow');
    Story.event('fed', this);
  }
  grow(k) {
    this.growth *= k;
    for (let i = 0; i < this.N; i++) { this.qx[i] *= k; this.qy[i] *= k; this.px[i] = this.comx + (this.px[i] - this.comx) * k; this.py[i] = this.comy + (this.py[i] - this.comy) * k; }
    this.R *= k; this.area *= k * k; this.hx *= k; this.hy *= k; this.ed *= k; this.eyeR *= k; this.headR *= k;
    this.vrate = Math.max(1, this.vrate - 0.03);
  }
  sing() {
    if (this.sleep) this.wake();
    Stickers.give('sing');
    this.speak('c_sing', null, {
      prio: 3, after: () => {
        if (!world.creatures.includes(this)) return;
        const tick = Clock.TICK * 1000, RH = pick([[1, 1, 2, 1, 1, 2, 4], [2, 1, 1, 2, 2, 4], [1, 1, 1, 1, 2, 2, 4]]);
        let deg = this.deg + pick([0, 2]), t = 0;
        RH.forEach((d, k) => {
          const g = deg;
          setTimeout(() => { this.hum(g, k === RH.length - 1); }, t);
          t += d * tick; deg = clamp(deg + pick([-2, -1, 1, 1, 2]), this.deg - 3, this.deg + 5);
        });
        // friends nearby join in on the last note
        const friends = world.creatures.filter(c => c !== this && !c.sleep && !c.echo && c.birth >= 1 && Math.abs(c.comx - this.comx) < U * 0.7).slice(0, 4);
        friends.forEach((c, i) => setTimeout(() => c.hum(this.deg + [2, 4, 5, 7][i], true), t - RH[RH.length - 1] * tick));
        if (friends.length >= 2) setTimeout(() => Stickers.give('chorus'), t);
      },
    });
  }
  hum(deg, last) {
    for (let i = 0; i < this.N; i++) this.vy[i] -= U * (last ? 0.55 : 0.3);
    this.sqv += 3; this.mouth = 1;
    Snd.boop(Snd.degFreq(deg), this.comx, 0.16, last ? 0.5 : 0.22, 1.2);
    Snd.pluck(deg + 5, this.comx, 0.1, 0.7);
    let top = Infinity; for (let i = 0; i < this.N; i++) top = Math.min(top, this.py[i]);
    Sparks.sign(this.comx + rand(-1, 1) * this.R * 0.4, top - 10, pick(['♪', '♫']), rgba(this.colLight), last ? 1.2 : 0.9);
  }
  feed() {
    if (this.sleep) this.wake();
    this.wantFood = true; this.full = 0;
    const f = Fruits.nearest(this.comx, W);
    if (f) { if (this.fruit && this.fruit !== f) this.fruit.claimed = null; this.fruit = f; f.claimed = this; this.speak('c_fruit', null, { prio: 3 }); return; }
    const trees = world.trees.filter(t => t.g >= 1 && !t.dying).sort((a, b) => Math.abs(a.x - this.comx) - Math.abs(b.x - this.comx));
    if (trees.length) { trees[0].shake(true); this.speak('c_hungry', null, { prio: 3 }); return; }
    Fruits.drop(clamp(this.comx + rand(-1, 1) * this.R * 1.5, 30, W - 30), -30, pick(Object.keys(FRUIT_LOOK)), true);
    this.speak('c_skyfruit', null, { prio: 3 });
  }
  recolor() {
    if (this.sleep) this.wake();
    let i = this.paint; do { i = (i + 1) % PAINTS.length; } while (PAINTS.length > 1 && Math.abs(PAINTS[i].h[0] - this.hue[0]) < 12 && i !== this.paint);
    this.paint = i; this.setHue(PAINTS[i].h);
    Sparks.burst(this.comx, this.comy, 22, { col: rgba(this.colLight), speed: U * 0.35, g: 0, life: 0.9, size: U * 0.03 });
    Snd.sparkle(this.comx, 4, 7, 0.1); this.sqv -= 4; this.happy = 1;
    this.speak('c_color', { c: PAINTS[i][isEn() ? 'en' : 'zh'] }, { prio: 3 });
    Stickers.give('color');
  }
  flip() {
    if (this.sleep) this.wake();
    if (!this.grounded || this.flipT > 0) return;
    this.speak('c_flip', null, { prio: 3 });
    const dir = Math.random() < 0.5 ? -1 : 1, vy = -U * 1.55, air = 2 * 1.55 / 2.6, w = dir * TAU / air;
    this.crouch = 0; this.flipT = air + 0.2; this.flipping = true; this.sqv += 5;
    for (let i = 0; i < this.N; i++) { const rx = this.px[i] - this.comx, ry = this.py[i] - this.comy; this.vx[i] += -w * ry; this.vy[i] += vy + w * rx; }
    Snd.whoosh(this.comx, 0.6);
    Stickers.give('flip');
  }
  talk() { if (this.sleep) this.wake(); this.happy = 0.8; this.speak('c_talk', null, { prio: 3 }); }
  echoSing() {
    this.echoFlash = 1;
    for (let i = 0; i < this.N; i++) this.vy[i] -= U * 0.45;
    this.sqv += 3; this.mouth = 1;
    const d = this.echo.deg;
    Snd.boop(Snd.degFreq(d), this.comx, 0.2, 0.32, 1.2); Snd.pluck(d + 5, this.comx, 0.16, 0.7);
    let top = Infinity; for (let i = 0; i < this.N; i++) top = Math.min(top, this.py[i]);
    Sparks.sign(this.comx, top - 12, '♪', rgba(this.colLight), 1.3);
  }

  updateFace(dt) {
    // where to look
    const ptr = world.pointer;
    let tx = 0, ty = 0;
    const ex = this.comx, ey = this.comy - this.R * 0.3;
    if (ptr.active && hypot(ptr.x - ex, ptr.y - ey) < U * 0.9) { tx = ptr.x - ex; ty = ptr.y - ey; }
    else if (this.lookAt && world.creatures.includes(this.lookAt) && this.bubble) { tx = this.lookAt.comx - ex; ty = this.lookAt.comy - ey; }
    else if (!this.grounded) { tx = this.cvx; ty = -20; }
    else { tx = noise2(this.age * 0.3, this.hue[0]) * 100; ty = noise2(this.age * 0.25, this.hue[0] + 9) * 60; }
    const d = hypot(tx, ty) || 1, m = Math.min(1, d / 60);
    this.lookX = lerp(this.lookX, tx / d * m, dt * 8); this.lookY = lerp(this.lookY, ty / d * m, dt * 8);
    // blinking
    this.blinkT -= dt; if (this.blinkT < 0) { this.blink = 0.16; this.blinkT = rand(1.8, 5); }
    this.blink = Math.max(0, this.blink - dt);
  }

  /* ---------- drawing ---------- */
  local(x, y) { // rest-frame point → world (with squash & rotation)
    const sy = this.sq, sx = 1 + (1 - this.sq) * 0.85, c = Math.cos(this.theta), s = Math.sin(this.theta);
    const qx = x * sx, qy = y * sy;
    return [this.comx + c * qx - s * qy, this.comy + s * qx + c * qy];
  }

  bodyPath(c, scale = 1) {
    const N = this.N, px = this.px, py = this.py, cx = this.comx, cy = this.comy;
    const X = i => cx + (px[i] - cx) * scale, Y = i => cy + (py[i] - cy) * scale;
    c.beginPath();
    c.moveTo((X(N - 1) + X(0)) / 2, (Y(N - 1) + Y(0)) / 2);
    for (let i = 0; i < N; i++) { const j = (i + 1) % N; c.quadraticCurveTo(X(i), Y(i), (X(i) + X(j)) / 2, (Y(i) + Y(j)) / 2); }
    c.closePath();
  }

  draw(c) {
    const b = easeOutCubic(this.birth), R = this.R;
    // shadow
    const fy = this.floor(this.comx), hgt = Math.max(0, fy - (this.comy + R * 0.6));
    const sa = clamp(1 - hgt / (U * 0.5), 0, 1) * 0.28 * b;
    if (sa > 0.01) { c.fillStyle = `rgba(20,40,30,${sa})`; c.beginPath(); c.ellipse(this.comx, fy + 1, R * (0.9 - Math.min(0.4, hgt / U)), R * 0.16, 0, 0, TAU); c.fill(); }
    // in the singing game: a halo that flashes when it sings
    if (this.echo) {
      const a = 0.22 + this.echoFlash * 0.6, r = R * (1.25 + this.echoFlash * 0.25);
      const hg = c.createRadialGradient(this.comx, this.comy, R * 0.6, this.comx, this.comy, r);
      hg.addColorStop(0, rgba(this.colLight, a)); hg.addColorStop(1, rgba(this.colLight, 0));
      c.fillStyle = hg; c.beginPath(); c.arc(this.comx, this.comy, r, 0, TAU); c.fill();
    }
    // body
    if (this.birth < 1) {
      c.save(); c.setLineDash([4, 6]); c.lineDashOffset = -world.t * 40;
      c.strokeStyle = `rgba(255,248,220,${1 - b})`; c.lineWidth = 2.5; this.bodyPath(c); c.stroke(); c.restore();
    }
    const scale = this.birth < 1 ? lerp(0.6, 1, easeOutBack(this.birth)) : 1;
    this.bodyPath(c, scale);
    const [lx, ly] = this.local(this.hx - R * 0.3, this.hy - R * 0.5);
    const g = c.createRadialGradient(lx, ly, R * 0.1, this.comx, this.comy, R * 1.5);
    g.addColorStop(0, rgba(this.colLight, b)); g.addColorStop(0.55, rgba(this.col, b)); g.addColorStop(1, rgba(this.colDark, b));
    c.fillStyle = g; c.fill();
    c.strokeStyle = rgba(this.colLine, 0.85 * b); c.lineWidth = Math.max(1.6, U * 0.0035); c.lineJoin = 'round'; c.stroke();
    // gloss
    c.save(); c.globalAlpha = 0.5 * b;
    const [gx, gy] = this.local(this.hx - this.ed * 1.6, this.hy - this.headR * 0.55);
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(gx, gy, R * 0.13, R * 0.07, this.theta - 0.5, 0, TAU); c.fill(); c.restore();
    this.drawFace(c, b);
  }

  drawFace(c, b) {
    if (b < 0.35) return;
    const open = this.birth < 1 ? smooth(0.55, 0.95, this.birth) : 1;
    const er = this.eyeR, look = 0.42;
    const shift = clamp(this.lookX, -1, 1) * this.ed * 0.18;
    const [mx, my] = this.local(this.hx + shift, this.hy + er * 2.0);
    const ang = this.theta;
    c.save(); c.globalAlpha = smooth(0.35, 0.6, b);
    // cheeks
    c.fillStyle = 'rgba(255,120,140,.33)';
    for (const sd of [-1, 1]) { const [x, y] = this.local(this.hx + sd * (this.ed + er * 0.9) + shift, this.hy + er * 1.35); c.beginPath(); c.ellipse(x, y, er * 0.95, er * 0.55, ang, 0, TAU); c.fill(); }
    // eyes
    const ink = '#2b2333';
    for (const sd of [-1, 1]) {
      const [x, y] = this.local(this.hx + sd * this.ed + shift, this.hy);
      c.save(); c.translate(x, y); c.rotate(ang);
      if (this.sleep || open < 0.05) {
        c.strokeStyle = ink; c.lineWidth = Math.max(1.6, er * 0.32); c.lineCap = 'round';
        c.beginPath(); c.arc(0, -er * 0.2, er * 0.75, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
      } else if (this.dizzy > 0) {
        c.strokeStyle = ink; c.lineWidth = Math.max(1.4, er * 0.22); c.beginPath();
        for (let k = 0; k < 26; k++) { const t = k / 25, a = t * TAU * 2.2 + world.t * 9 * sd, r = er * t; k ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(0, 0); }
        c.stroke();
      } else if (this.happy > 0) {
        c.strokeStyle = ink; c.lineWidth = Math.max(1.6, er * 0.32); c.lineCap = 'round';
        c.beginPath(); c.arc(0, er * 0.35, er * 0.75, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      } else {
        const bl = this.blink > 0 ? Math.abs(Math.cos((this.blink / 0.16) * Math.PI)) : 1;
        const ry = er * Math.max(0.08, bl * open);
        c.fillStyle = '#fff'; c.beginPath(); c.ellipse(0, 0, er, ry, 0, 0, TAU); c.fill();
        c.save(); c.beginPath(); c.ellipse(0, 0, er, ry, 0, 0, TAU); c.clip();
        const pxo = this.lookX * er * look, pyo = this.lookY * er * look;
        c.rotate(-ang);
        c.fillStyle = ink; c.beginPath(); c.arc(pxo, pyo, er * 0.62, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(pxo - er * 0.22, pyo - er * 0.25, er * 0.22, 0, TAU); c.fill();
        c.beginPath(); c.arc(pxo + er * 0.2, pyo + er * 0.2, er * 0.09, 0, TAU); c.fill();
        c.restore();
        c.strokeStyle = rgba(this.colLine, 0.5); c.lineWidth = 1; c.beginPath(); c.ellipse(0, 0, er, ry, 0, 0, TAU); c.stroke();
      }
      c.restore();
    }
    // mouth
    c.save(); c.translate(mx, my); c.rotate(ang);
    c.strokeStyle = ink; c.fillStyle = '#5a2a3a'; c.lineWidth = Math.max(1.4, er * 0.24); c.lineCap = 'round';
    const mw = er * 0.75;
    if (this.bubble && this.bubble.talking) {
      c.beginPath(); c.ellipse(0, er * 0.2, mw * 0.55, er * (0.15 + 0.5 * this.mouth), 0, 0, TAU); c.fill();
      c.fillStyle = '#ff8fa6'; c.beginPath(); c.ellipse(0, er * (0.25 + 0.3 * this.mouth), mw * 0.3, er * 0.12 * (0.5 + this.mouth), 0, 0, TAU); c.fill();
    } else if (this.happy > 0 || (this.bubble && this.mouth > 0.3)) {
      c.beginPath(); c.moveTo(-mw, -er * 0.1); c.quadraticCurveTo(0, er * 1.3, mw, -er * 0.1); c.closePath(); c.fill();
      c.fillStyle = '#ff8fa6'; c.beginPath(); c.ellipse(0, er * 0.42, mw * 0.45, er * 0.22, 0, 0, TAU); c.fill();
    } else if (this.dizzy > 0) {
      c.beginPath(); for (let k = 0; k <= 8; k++) { const x = -mw + (k / 8) * mw * 2, y = Math.sin(k * 1.6 + world.t * 8) * er * 0.18; k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    } else if (this.mouth > 0.2 || !this.grounded) {
      c.beginPath(); c.ellipse(0, er * 0.15, er * 0.32, er * 0.4 * Math.max(0.5, this.mouth), 0, 0, TAU); c.fill();
    } else if (this.sleep) {
      c.beginPath(); c.ellipse(0, er * 0.1, er * 0.22, er * 0.16 + Math.sin(this.age * 1.8) * er * 0.06, 0, 0, TAU); c.fill();
    } else {
      c.beginPath(); c.arc(0, -er * 0.35, mw * 0.7, Math.PI * 0.2, Math.PI * 0.8); c.stroke();
    }
    c.restore();
    // dizzy stars orbiting the head
    if (this.dizzy > 0) {
      const [hx, hy] = this.local(this.hx, this.hy - this.headR - er * 2);
      c.fillStyle = '#ffe066';
      for (let k = 0; k < 3; k++) {
        const a = world.t * 5 + k * TAU / 3, x = hx + Math.cos(a) * this.R * 0.5, y = hy + Math.sin(a) * this.R * 0.14;
        star(c, x, y, er * 0.7, a);
      }
    }
    c.restore();
  }

  drawGlow(c) { // emissive pass, drawn after the night tint
    if (this.glow < 0.02 || this.birth < 1) return;
    const r = this.R * 2.2, g = c.createRadialGradient(this.comx, this.comy, this.R * 0.3, this.comx, this.comy, r);
    g.addColorStop(0, rgba(this.colLight, 0.22 * this.glow)); g.addColorStop(1, rgba(this.colLight, 0));
    c.fillStyle = g; c.fillRect(this.comx - r, this.comy - r, r * 2, r * 2);
    // a faint rim so the creature reads at night
    c.save(); c.globalAlpha = 0.3 * this.glow; c.strokeStyle = rgba(this.colLight); c.lineWidth = 1.5; this.bodyPath(c); c.stroke(); c.restore();
  }

  drawBubble(c) {
    const B = this.bubble; if (!B) return;
    const k = B.age < 0.2 ? easeOutBack(B.age / 0.2) : B.age > B.life - 0.3 ? (B.life - B.age) / 0.3 : 1;
    let top = Infinity; for (let i = 0; i < this.N; i++) top = Math.min(top, this.py[i]);
    const fs = clamp(U * 0.024, 13, 19);
    c.save(); c.font = `600 ${fs}px ${SERIF}`;
    const tw = c.measureText(B.text).width, pw = tw + fs * 1.2, ph = fs * 1.9;
    let x = clamp(this.comx, pw / 2 + 6, W - pw / 2 - 6), y = top - ph * 0.5 - 14;
    if (y - ph / 2 < 8) y = this.comy + this.R + ph;  // flip below if it would leave the screen
    c.translate(x, y); c.scale(k, k);
    c.fillStyle = 'rgba(255,253,246,.96)'; c.strokeStyle = rgba(this.colLine, 0.5); c.lineWidth = 1.2;
    roundRect(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fill(); c.stroke();
    const tx = clamp(this.comx - x, -pw / 2 + ph / 2, pw / 2 - ph / 2);
    c.beginPath(); c.moveTo(tx - 6, ph / 2 - 1); c.lineTo(tx, ph / 2 + 8); c.lineTo(tx + 6, ph / 2 - 1); c.closePath(); c.fill();
    c.fillStyle = '#3a2a33'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(B.text, 0, 1);
    c.restore();
  }

  toJSON() { return { q: [Array.from(this.qx, v => Math.round(v * 10) / 10), Array.from(this.qy, v => Math.round(v * 10) / 10)], x: this.comx / W, hue: this.hue, nameIdx: this.nameIdx, vrole: this.vrole, meals: this.meals, growth: this.growth }; }
}

function star(c, x, y, r, rot) {
  c.beginPath();
  for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  c.closePath(); c.fill();
}
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

const CHATS = () => {
  const s = world.sky, k = isEn() ? 1 : 0, out = [];
  const add = list => list.forEach(p => out.push(p[k]));
  add(CHAT_PAIRS.base);
  if (s.night > 0.5) add(CHAT_PAIRS.night);
  if (world.raining) add(CHAT_PAIRS.rain);
  if (world.rainbow.a > 0.5) add(CHAT_PAIRS.rainbow);
  if (world.trees.length > 2) add(CHAT_PAIRS.trees);
  return out;
};

const Creatures = {
  max: 16,
  spawn(pts) {
    if (world.creatures.length >= this.max) { Story.toast(L('full_toast')); return null; }
    const c = new Creature(pts); world.creatures.push(c);
    if (world.creatures.length >= 5) setTimeout(() => Stickers.give('family'), 2500);
    return c;
  },
  at(x, y) { for (let i = world.creatures.length - 1; i >= 0; i--) { const c = world.creatures[i]; if (c.birth >= 1 && c.contains(x, y)) return c; } return null; },
  update(dt) {
    const C = world.creatures;
    for (const c of C) c.update(dt);
    // soft collisions between bodies
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) {
      const a = C[i], b = C[j]; if (a.birth < 1 || b.birth < 1) continue;
      const dx = b.comx - a.comx, dy = (b.comy - a.comy) * 1.4, d = hypot(dx, dy) || 1, min = (a.R + b.R) * 0.82;
      if (d < min && Math.abs(a.lane - b.lane) < (a.R + b.R) * 0.5) {
        const push = (min - d) / min * U * 4 * dt, nx = dx / d;
        for (let k = 0; k < a.N; k++) a.vx[k] -= nx * push;
        for (let k = 0; k < b.N; k++) b.vx[k] += nx * push;
      }
    }
  },
  tick(n) {
    for (const c of world.creatures) c.onTick(n);
    // every so often, everyone who is awake jumps in a wave, left to right, singing up the scale
    if (n % 64 === 40) {
      const ready = world.creatures.filter(c => c.birth >= 1 && !c.sleep && !c.grab && !c.echo && c.dizzy <= 0 && c.grounded);
      if (ready.length >= 3 && !Echo.active) {
        setTimeout(() => Stickers.give('chorus'), ready.length * Clock.TICK * 500 + 800);
        ready.sort((a, b) => a.comx - b.comx);
        ready.forEach((c, i) => setTimeout(() => { if (c.sleep || c.grab || !world.creatures.includes(c)) return; c.targetX = c.comx; c.chorus = i; c.crouch = Clock.TICK * 0.4; }, i * Clock.TICK * 500));
        Story.event('chorus');
      }
    }
  },
  react(kind, arg) {
    const awake = world.creatures.filter(c => !c.sleep && c.birth >= 1 && !c.bubble && !c.echo);
    if (!awake.length) return;
    const c = pick(awake);
    if (kind === 'rainbow') c.speak('c_rainbow', null, { prio: 1 });
    else if (kind === 'born' && arg !== c) setTimeout(() => { if (!c.bubble && !c.sleep) c.speak('c_welcome', { name: arg.name }, { prio: 1 }); c.lookAt = arg; }, 1800);
    else if (kind === 'tree' && Math.random() < 0.5) c.speak('c_tree', null, { prio: 0 });
    else if (kind === 'wind' && Math.random() < 0.6) c.speak('c_wind', null, { prio: 1 });
    else if (kind === 'star') c.speak('c_star', null, { prio: 1 });
    else if (kind === 'cloud' && Math.random() < 0.4) c.speak('c_cloud', null, { prio: 0 });
  },
};
