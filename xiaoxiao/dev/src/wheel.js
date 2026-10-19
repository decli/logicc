// 动物消消乐 · the wheel before a math page (decli 2026-10-19: draw how many sums like a lucky draw, 2 to 10, so the
// page starts with a bit of fun instead of a chore). She taps it; it winds back a little and spins, slows down with a
// tick and a flick of the pointer at every peg, and lands with lights, confetti and her number popping up. Every slice
// is the same size and the number is drawn fairly before the spin (never steered to a near miss); every number is good
// news, a few a warm-up and many a challenge (L.wheel.land). What it lands on is kept until the page is done, so
// leaving and coming back can't spin again.
const Wheel = {
  COLS: ['#ff7fb0', '#ffa95e', '#ffd23a', '#8fdc5e', '#45d0b5', '#5fb8ff', '#8f83ff', '#c47cff', '#ff8fd0'],
  // on the math layer; resolves with the number, 'skip' (a parent skipped the page) or 'again' (a parent changed the
  // settings, so the page starts over the new way)
  spin() {
    return new Promise(resolve => {
      const root = $('#math'); root.hidden = false; root.innerHTML = ''; root.className = 'spin';
      $('#fx').style.zIndex = 46;
      Music.stop();   // quiet for the sums, as on the page itself
      const N = MATH_WHEEL.length, A = Math.PI * 2 / N, TAU = Math.PI * 2;
      const head = el('div', 'head');
      const home = UI.homeButton(); home.style.width = home.style.height = '46px'; home.style.fontSize = '22px';
      head.appendChild(home);
      head.appendChild(el('h3', null, '✏️ ' + L.math.title));
      const lock = el('button', 'ibtn', '🔒'); lock.style.width = lock.style.height = '46px'; lock.style.fontSize = '22px';
      lock.onclick = () => UI.parent({ fromMath: true, skip: () => end('skip'), done: () => { if (Store.d.math.count !== 'wheel' && state !== 'gone') end('again'); } });
      head.appendChild(lock);
      root.appendChild(head);
      const stage = el('div', 'wstage'), cv = el('canvas'), big = el('div', 'wbig'), hand = el('div', 'whand', '👆');
      stage.appendChild(cv); stage.appendChild(big); stage.appendChild(hand);
      root.appendChild(stage);
      const x = cv.getContext('2d'), panda = Art.friend(FRIENDS.findIndex(f => f.id === 'panda'), 256, 230);
      let S = 0, dpr = 1, rot = Math.random() * TAU, state = 'idle', t = 0, from = 0, to = 0, flap = 0, peg = 0, tickAt = 0, won = -1, n = 0;
      let last = performance.now(), raf = 0, idle = 0, asked = 1;
      const DUR = 3000;   // short: the wheel is a moment of fun before the sums, not a show to sit through

      function size() {
        const r = stage.getBoundingClientRect();
        S = Math.max(200, Math.min(r.width, r.height) * 0.98); dpr = Math.min(devicePixelRatio || 1, 2);
        cv.width = Math.round(S * dpr); cv.height = Math.round(S * dpr); cv.style.width = cv.style.height = S + 'px';
        big.style.fontSize = Math.round(S * 0.2) + 'px';
      }
      const circle = (cx, cy, r) => { x.beginPath(); x.arc(cx, cy, r, 0, TAU); };
      function draw(now) {
        x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, S, S);
        const cx = S / 2, cy = S * 0.52, R = S * 0.39;
        // shadow, golden rim and its light bulbs: a slow chase while waiting, a fast one while spinning, all blinking together when it lands
        x.fillStyle = 'rgba(110,50,130,.16)'; circle(cx, cy + R * 0.06, R * 1.14); x.fill();
        const rim = x.createLinearGradient(0, cy - R, 0, cy + R);
        rim.addColorStop(0, '#ffe680'); rim.addColorStop(0.5, '#ffb52e'); rim.addColorStop(1, '#e58a00');
        x.fillStyle = rim; circle(cx, cy, R * 1.12); x.fill();
        x.lineWidth = R * 0.02; x.strokeStyle = '#fff6cf'; circle(cx, cy, R * 1.1); x.stroke();
        const B = 18, step = state === 'spin' ? Math.floor(now / 70) : Math.floor(now / 380);
        for (let i = 0; i < B; i++) {
          const a = -Math.PI / 2 + i * TAU / B, bx = cx + Math.cos(a) * R * 1.055, by = cy + Math.sin(a) * R * 1.055;
          const on = state === 'won' ? Math.floor(now / 160) % 2 === 0 : (i + step) % 3 === 0;
          if (on) { x.fillStyle = 'rgba(255,255,255,.55)'; circle(bx, by, R * 0.06); x.fill(); }
          x.fillStyle = on ? (i % 2 ? '#fff8c4' : '#ffe1f0') : '#c97a00'; circle(bx, by, R * 0.032); x.fill();
        }
        // the slices (their numbers are drawn upright afterwards, so a 6 never turns into a 9)
        x.save(); x.translate(cx, cy); x.rotate(rot);
        for (let i = 0; i < N; i++) {
          const a0 = -Math.PI / 2 + i * A, g = x.createRadialGradient(0, 0, R * 0.2, 0, 0, R);
          g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, Wheel.COLS[i]); g.addColorStop(1, Wheel.COLS[i]);
          x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, a0, a0 + A); x.closePath(); x.fill();
          if (won >= 0) {   // the winner glows, the rest step back
            x.fillStyle = i === won ? `rgba(255,255,255,${0.15 + 0.25 * Math.sin(now / 90) ** 2})` : 'rgba(255,255,255,.5)'; x.fill();
          }
        }
        x.strokeStyle = '#fff'; x.lineWidth = R * 0.018;
        for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i * A; x.beginPath(); x.moveTo(Math.cos(a) * R * 0.24, Math.sin(a) * R * 0.24); x.lineTo(Math.cos(a) * R, Math.sin(a) * R); x.stroke(); }
        for (let i = 0; i < N; i++) {   // the pegs that flick the pointer
          const a = -Math.PI / 2 + i * A;
          x.fillStyle = '#fff'; circle(Math.cos(a) * R * 0.95, Math.sin(a) * R * 0.95, R * 0.035); x.fill();
          x.fillStyle = '#e58a00'; circle(Math.cos(a) * R * 0.95, Math.sin(a) * R * 0.95, R * 0.015); x.fill();
        }
        x.restore();
        x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
        for (let i = 0; i < N; i++) {
          const m = -Math.PI / 2 + (i + 0.5) * A + rot, tx = cx + Math.cos(m) * R * 0.68, ty = cy + Math.sin(m) * R * 0.68;
          x.font = `900 ${Math.round(R * (i === won ? 0.27 : 0.22))}px ${FONT}`;
          x.lineWidth = R * 0.05; x.strokeStyle = 'rgba(80,30,90,.55)'; x.strokeText(MATH_WHEEL[i], tx, ty + R * 0.01);
          x.fillStyle = '#fff'; x.fillText(MATH_WHEEL[i], tx, ty + R * 0.01);
        }
        // the hub with the panda, breathing while it waits to be tapped
        const pulse = state === 'idle' ? 1 + 0.05 * Math.sin(now / 220) : 1, hr = R * 0.25 * pulse;
        if (state === 'idle') { x.fillStyle = `rgba(255,255,255,${0.3 + 0.2 * Math.sin(now / 220)})`; circle(cx, cy, hr * 1.25); x.fill(); }
        x.fillStyle = '#fff'; circle(cx, cy, hr); x.fill();
        x.lineWidth = R * 0.03; x.strokeStyle = '#ffb52e'; x.stroke();
        if (won < 0) x.drawImage(panda, cx - hr * 0.92, cy - hr * 0.92, hr * 1.84, hr * 1.84);   // her number takes its place
        // the pointer at the top, flicked by each peg and springing back
        x.save(); x.translate(cx, cy - R * 1.2); x.rotate(flap);
        x.beginPath(); x.moveTo(-R * 0.11, 0); x.quadraticCurveTo(-R * 0.1, R * 0.16, 0, R * 0.32); x.quadraticCurveTo(R * 0.1, R * 0.16, R * 0.11, 0);
        x.arc(0, 0, R * 0.11, 0, Math.PI, true); x.closePath();
        x.fillStyle = '#ff4f8a'; x.fill(); x.lineWidth = R * 0.025; x.strokeStyle = '#fff'; x.stroke();
        x.fillStyle = '#ffd23a'; circle(0, 0, R * 0.05); x.fill();
        x.restore();
      }
      function frame(now) {
        const dt = Math.min(50, now - last); last = now;
        if (state === 'wind') {   // a little wind-up backwards before the push (anticipation)
          t += dt; const k = Math.min(1, t / 220); rot = from - 0.22 * Math.sin(k * Math.PI / 2);
          if (k >= 1) { state = 'spin'; t = 0; from = rot; Snd.play('whirl'); }
        } else if (state === 'spin') {
          t += dt; const k = Math.min(1, t / DUR); rot = from + (to - from) * (1 - Math.pow(1 - k, 4));
          const p = Math.floor(rot / A);
          if (p !== peg) { peg = p; flap = Math.min(flap, -0.42); if (now - tickAt > 45) { tickAt = now; Snd.play('tick'); } }
          if (k >= 1) land();
        } else if (state === 'idle') {
          idle += dt;
          hand.classList.toggle('on', idle > 2500);
          if (idle > 15000 && asked < 2) { asked++; Voice.say(L.wheel.ask); }
        }
        flap *= Math.pow(0.86, dt / 16);
        draw(now);
        if (state !== 'gone') raf = requestAnimationFrame(frame);
      }
      // the number is drawn first and the wheel is sent to a spot well inside its slice, five turns on
      function go() {
        if (state !== 'idle') return;
        Snd.init(); Snd.play('tap'); Voice.stop();
        hand.classList.remove('on');
        n = pick(MATH_WHEEL);
        const i = MATH_WHEEL.indexOf(n), phi = (i + 0.2 + 0.6 * Math.random()) * A;
        from = rot; t = 0; state = 'wind';
        const turn = 5 * TAU, d = (((-phi - (rot - 0.22)) % TAU) + TAU) % TAU;
        to = rot - 0.22 + turn + d;
        peg = Math.floor((rot - 0.22) / A);
      }
      function land() {
        state = 'won'; won = MATH_WHEEL.indexOf(n);
        Wheel.last = { n, at: MATH_WHEEL[Math.floor((((-rot) % TAU) + TAU) % TAU / A)] };   // what the pointer shows (checked by the tests)
        Store.d.spin = { n, p: Store.d.played }; Store.save();
        Snd.play('win'); Fx.confetti(60);
        const r = cv.getBoundingClientRect();
        Fx.sparkles(r.left + r.width / 2, r.top + r.height * 0.52, 16, r.width * 0.2, '#ffd23a');
        big.textContent = n; big.classList.add('on');
        Voice.say(L.wheel.land(n), { onend: () => setTimeout(() => end(n), 500) });
      }
      function end(r) {
        if (state === 'gone') return;
        state = 'gone'; cancelAnimationFrame(raf);
        removeEventListener('resize', size);
        if (r === 'skip') { root.hidden = true; $('#fx').style.zIndex = ''; }
        resolve(r);
      }
      stage.addEventListener('pointerdown', e => { e.preventDefault(); go(); });
      addEventListener('resize', size);
      requestAnimationFrame(now => { size(); last = now; frame(now); });
      Voice.say(L.wheel.ask);
    });
  },
};
