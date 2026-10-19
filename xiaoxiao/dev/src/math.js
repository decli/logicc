// 动物消消乐 · the math page that stands between one game and the next (anti-addiction + learning by play).
// First she spins the wheel for how many sums (wheel.js, 2 to 10), then a page of them with a number pad; every sum has
// to be answered right before the page is done. Help comes in steps, the way a teacher would give it: the first wrong
// answer gets one short hint about what went wrong (a sign read the wrong way, one off, digits swapped, the ones right
// but not the tens), the second brings in 小老师 (teach.js), where the animals act the sum out a tap at a time and she
// writes the answer herself, and 💡 brings it in any time after a wrong answer; only after that does the right
// answer show in grey to be copied, so she is never stuck. Parents choose the range (within 20 / 50 / 100), how many
// numbers (2 / 3 / 4), add / subtract / both, and the wheel, the day's ramp or a fixed page size.
const MathGate = {
  // one sum: every number ≥ 1, every partial result between 0 and max
  problem(max, ops, mode, want) {
    for (let tries = 0; tries < 400; tries++) {
      const nums = [], signs = [];
      let v = mode === 'sub' ? 1 + Math.floor(Math.random() * max) : 1 + Math.floor(Math.random() * (max - 1));
      if (mode === 'sub' && v < Math.min(max, ops * 2)) continue;
      nums.push(v);
      let ok = true;
      for (let i = 1; i < ops; i++) {
        let s = mode === 'add' ? '+' : mode === 'sub' ? '-' : (i === 1 && want ? want : (Math.random() < 0.5 ? '+' : '-'));
        if (s === '+' && v >= max) s = mode === 'mix' ? '-' : null;
        if (s === '-' && v <= 0) s = mode === 'mix' ? '+' : null;
        if (!s) { ok = false; break; }
        const b = s === '+' ? 1 + Math.floor(Math.random() * (max - v)) : 1 + Math.floor(Math.random() * v);
        v = s === '+' ? v + b : v - b;
        nums.push(b); signs.push(s);
      }
      if (!ok) continue;
      if (v === 0 && Math.random() < 0.8) continue;                    // "x − x" now and then, not often
      if (nums.includes(1) && Math.random() < 0.6) continue;           // and "+ 1" / "− 1" not too often either
      if (max >= 50 && nums.some(n => n < 3) && Math.random() < 0.7) continue;   // keep the bigger ranges from being trivial
      let text = String(nums[0]);
      signs.forEach((s, i) => { text += ` ${s === '+' ? '+' : '−'} ${nums[i + 1]}`; });
      return { text, ans: v, nums, signs };
    }
    return { text: '1 + 1', ans: 2, nums: [1, 1], signs: ['+'] };
  },
  page(cfg, count) {
    const out = [], seen = new Set();
    for (let k = 0; out.length < count && k < count * 30; k++) {
      // with both signs, the first sign alternates so a page is half adding, half taking away
      const q = this.problem(cfg.max, cfg.ops, cfg.mode, cfg.mode === 'mix' ? (out.length % 2 ? '-' : '+') : null);
      if (seen.has(q.text)) continue;
      seen.add(q.text); out.push(q);
    }
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  },
  // a sum on its card, the signs in their own tags so a hint can point at them
  html(q) { return q.nums.map((n, i) => (i ? ` <i class="op">${q.signs[i - 1] === '+' ? '+' : '−'}</i> ` : '') + n).join(''); },
  // what the first wrong answer most likely was: { k: the hint in L.math.why, op: which sign to point at }
  why(q, got) {
    for (let i = 0; i < q.signs.length; i++) {   // one sign read the wrong way round
      let v = q.nums[0];
      q.signs.forEach((sg, j) => { const t = j === i ? (sg === '+' ? '-' : '+') : sg; v = t === '+' ? v + q.nums[j + 1] : v - q.nums[j + 1]; });
      if (v === got) return { k: q.signs.length > 1 ? 'sign' : q.signs[0] === '-' ? 'sub' : 'add', op: i };
    }
    // a two-digit take-away done digit by digit, the smaller ones digit from the bigger (13 − 5 = 12, 43 − 17 = 34)
    if (q.signs.length === 1 && q.signs[0] === '-') {
      const [a, b] = q.nums;
      if (a >= 10 && a % 10 < b % 10 && got === (Math.floor(a / 10) - Math.floor(b / 10)) * 10 + (b % 10 - a % 10)) return { k: 'big' };
    }
    if (Math.abs(got - q.ans) === 1) return { k: 'near' };
    const a = String(q.ans);
    if (a.length === 2 && a[0] !== a[1] && String(got) === a[1] + a[0]) return { k: 'swap' };
    if ((q.ans >= 10 || got >= 10) && got % 10 === q.ans % 10) return { k: 'ones' };
    return { k: 'other' };
  },
  // a sum like q for practice straight after 小老师 (9 + 4, then 9 + 6): the same first number and signs, the last
  // number a little different, needing a bundle tied or untied if q did, every step still between 0 and max
  twin(q, max, taken) {
    const steps = n => { const out = [n[0]]; q.signs.forEach((sg, j) => out.push(sg === '+' ? out[j] + n[j + 1] : out[j] - n[j + 1])); return out; };
    const tens = n => { const p = steps(n)[n.length - 2], b = n[n.length - 1]; return q.signs[q.signs.length - 1] === '+' ? p % 10 + b % 10 >= 10 : p % 10 < b % 10; };
    const crosses = tens(q.nums), last = q.nums.length - 1;
    for (const d of [1, -1, 2, -2, 3, -3, 4, -4].sort(() => Math.random() - 0.5)) {
      const n = q.nums.slice(); n[last] += d;
      const p = steps(n);
      if (n[last] < 1 || p.some(v => v < 0 || v > max) || tens(n) !== crosses) continue;
      const t = { nums: n, signs: q.signs, ans: p[p.length - 1] };
      t.text = String(n[0]); q.signs.forEach((sg, i) => { t.text += ` ${sg === '+' ? '+' : '−'} ${n[i + 1]}`; });
      if (!taken.includes(t.text)) return t;
    }
    return null;
  },
  label(cfg) {
    return `${cfg.max} 以内 · ${['', '', '两个数', '三个数', '四个数'][cfg.ops]} · ${{ mix: '加减混合', add: '只有加法', sub: '只有减法' }[cfg.mode]}`;
  },

  // sums on the next page: what the wheel landed on, the day's ramp (today's 1st page 2, then 6, 12, 20, 20, …) or
  // the parent's fixed size
  pageSize() {
    const n = Store.d.math.count;
    return n === 'wheel' ? this.spun() || 6 : n === 'ramp' ? MATH_RAMP[Math.min(this.pagesToday(), MATH_RAMP.length - 1)] : n || 10;
  },
  // the wheel's number for the page owed now (a game played since makes it old)
  spun() { const s = Store.d.spin; return s && s.p === Store.d.played ? s.n : 0; },
  pagesToday() { const t = Store.d.today; return t && t.day === new Date().toDateString() ? t.pages : 0; },

  // o.count, o.extra (the five-sums-for-five-moves page); resolves when every sum is right
  open(o = {}) {
    // the wheel first, unless it has already landed for this page (she left half-way and came back)
    if (!o.count && Store.d.math.count === 'wheel' && !this.spun()) {
      return Wheel.spin().then(r => {
        if (r === 'skip') { Store.d.owed = false; Store.d.spin = null; Store.save(); return; }
        if (r !== 'again') this.fresh = true;
        return MathGate.open(o);
      });
    }
    const fresh = this.fresh; this.fresh = false;
    return new Promise(resolve => {
      const cfg = Store.d.math, count = o.count || MathGate.pageSize();
      const qs = this.page(cfg, count).map(q => Object.assign(q, { got: '', tries: 0, ok: false }));
      const root = $('#math'); root.hidden = false; root.innerHTML = ''; root.className = '';
      $('#fx').style.zIndex = 46;   // sparkles and confetti over the page
      const t0 = Date.now();
      let cur = 0, first = 0, finished = false, praised = '', helpT = 0;
      Music.stop();   // quiet for the sums (decli); the game starts it again
      const sheet = el('div', 'sheet'), head = el('div', 'head');
      const home = UI.homeButton(); home.style.width = home.style.height = '46px'; home.style.fontSize = '22px';
      head.appendChild(home);
      head.appendChild(el('h3', null, o.extra ? '✏️ 做对 5 道题，多 5 步' : '✏️ ' + L.math.title));
      const prog = el('div', 'prog', `0 / ${count}`);
      head.appendChild(prog);
      const lock = el('button', 'ibtn', '🔒'); lock.style.width = lock.style.height = '46px'; lock.style.fontSize = '22px';
      // a parent can skip the page, or change the settings, which starts a new page with the new kind of sums
      const before = JSON.stringify(cfg);
      lock.onclick = () => UI.parent({ fromMath: true, skip: () => finish(true), done: () => { if (JSON.stringify(Store.d.math) !== before && !finished) { cleanup(); resolve(MathGate.open(o)); } } });
      head.appendChild(lock);
      sheet.appendChild(head);
      const grid = el('div', 'grid'); sheet.appendChild(grid);
      root.appendChild(sheet);
      const cards = qs.map((q, i) => {
        const c = el('button', 'q');
        c.innerHTML = `<span>${MathGate.html(q)} =</span><span class="ans"></span>`;
        c.onclick = () => { if (!q.ok && !finished) { cur = i; Snd.play('tap'); draw(); } };
        grid.appendChild(c);
        return c;
      });
      const pad = el('div', 'pad');
      const disp = el('div', 'disp', ''), say = el('span'), bulb = el('button', 'bulb', '💡');
      bulb.hidden = true;
      disp.appendChild(say); disp.appendChild(bulb);
      bulb.onclick = () => { Snd.init(); Snd.play('tap'); teach(); };
      pad.appendChild(disp);
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];
      for (const k of keys) {
        const b = el('button', 'key' + (k === '✓' ? ' ok' : k === '⌫' ? ' del' : ''), k);
        b.addEventListener('pointerdown', e => { e.preventDefault(); press(k); });
        pad.appendChild(b);
      }
      root.appendChild(pad);
      const onKey = e => {
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === 'Backspace') press('⌫');
        else if (e.key === 'Enter') press('✓');
      };
      window.addEventListener('keydown', onKey);

      function fit() {
        const wide = innerWidth >= innerHeight * 1.05;
        root.className = wide ? 'wide' : 'tall';
        // a full page fills the screen four across; when four across would make the sums small (a phone, or four
        // numbers in a sum) it takes the column count that gives the biggest sums, so none is cut off at the edges
        // (a clipped "14 + 11" reads as "4 + 11"). The five-sum page is one tidy column.
        const small = count <= 5;
        Object.assign(grid.style, small ? { alignContent: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' } : {});
        const r = grid.getBoundingClientRect();
        cards.forEach(c => { c.style.fontSize = '100px'; });   // the widest sum in em: its two halves, the gap between them and a little air
        const em = Math.max(...cards.map(c => [...c.children].reduce((w, s) => w + s.offsetWidth, 0))) / 100 + 0.25 + 0.2;
        const size = cols => {
          const rows = Math.ceil(count / cols), cw = (r.width - (cols - 1) * 10) / cols - 8;
          const ch = small ? Math.min(110, (r.height - (rows - 1) * 10) / rows) : (r.height - (rows - 1) * 10) / rows;
          return Math.min(ch * 0.42, cw / em, 46);
        };
        // four across, or three when that fills every row (6 or 15 sums: no half-empty last row)
        let cols = small ? 1 : count % 4 && count % 3 === 0 ? 3 : 4;
        if (!small && size(cols) < 20) cols = [3, 2].reduce((a, c) => size(c) > size(a) + 0.5 ? c : a, cols);
        const rows = Math.ceil(count / cols);
        grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
        grid.style.gridTemplateRows = small ? `repeat(${rows},minmax(0,110px))` : `repeat(${rows},1fr)`;
        const fs = Math.max(9, size(cols));
        cards.forEach(c => { c.style.fontSize = fs + 'px'; });
      }
      function draw() {
        cards.forEach((c, i) => {
          const q = qs[i], a = c.querySelector('.ans');
          c.classList.toggle('cur', i === cur && !finished);
          c.classList.toggle('ok', q.ok);
          if (q.ok) a.textContent = q.ans;
          else if (i === cur) { a.textContent = q.got || (q.tries >= 3 ? q.ans : '?'); a.classList.toggle('hint', !q.got && q.tries >= 3); }
          else { a.textContent = q.got || ''; a.classList.remove('hint'); }
        });
        const n = qs.filter(q => q.ok).length, q = qs[cur];
        prog.textContent = `${n} / ${count}`;
        say.textContent = finished || Teach.on ? '' : q.tries >= 3 ? '照着灰色的答案写一遍' : q.tries ? '再想一想' : '';
        // 💡 once a sum has gone wrong, wiggling the first time it shows
        const help = !finished && !Teach.on && !q.ok && q.tries >= 1 && q.tries < 3;
        if (help && bulb.hidden !== false) { bulb.hidden = false; bulb.classList.remove('new'); void bulb.offsetWidth; bulb.classList.add('new'); Snd.play('idea'); }
        bulb.hidden = !help;
        if (Teach.on) Teach.sync(q.got);
      }
      // the animals act the sum out over the cards; the pad stays to write the answer
      function teach() {
        clearTimeout(helpT);
        if (finished || qs[cur].ok) return;
        Teach.open(qs[cur], sheet, { close: draw });
        draw();
      }
      function press(k) {
        if (finished) return;
        Snd.init();
        const q = qs[cur];
        if (k === '⌫') { q.got = q.got.slice(0, -1); Snd.play('key', 2); }
        else if (k === '✓') { if (q.got) check(); return; }
        else if (q.got.length < 3) { q.got = (q.got === '0' ? '' : q.got) + k; Snd.play('key', +k); }
        draw();
      }
      function check() {
        const q = qs[cur], c = cards[cur];
        clearTimeout(helpT);
        if (+q.got === q.ans) {
          q.ok = true; if (!q.tries) first++;
          Snd.play('right'); c.classList.remove('bad');
          const taught = Teach.on;
          if (taught) Teach.close(true);
          const r = c.getBoundingClientRect();
          Fx.burst(r.left + r.width * 0.8, r.top + r.height / 2, ['#5fe0b0', '#ffd23a'], 10, 0.8, 60);
          const n = qs.filter(x => x.ok).length;
          if (n === count) { draw(); return finish(false); }
          let next = qs.findIndex((x, i) => i > cur && !x.ok);
          if (next < 0) next = qs.findIndex(x => !x.ok);
          // worked out with the animals: praise the working out, and the next sum not yet tried becomes one just like
          // it, to do on her own straight away; else never the same praise twice in a row
          const slot = taught ? qs.findIndex(x => !x.ok && !x.tries && !x.twin) : -1;
          const t = slot >= 0 && MathGate.twin(q, cfg.max, qs.map(x => x.text));
          if (t) {
            Object.assign(qs[slot], t, { got: '', twin: true });
            const tc = cards[slot];
            tc.querySelector('span').innerHTML = MathGate.html(qs[slot]) + ' =';
            fit();
            tc.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12) rotate(-2deg)' }, { transform: 'scale(1)' }], { duration: 500, delay: 300 });
            next = slot;
            Voice.say(L.teach.self, { onend: () => { if (!finished && cur === slot) Voice.say(L.teach.twin); } });
          } else if (taught) Voice.say(L.teach.self);
          else if (n === Math.floor(count / 2) && count >= 10) Voice.say(L.math.half);
          else { praised = pick(L.math.right.filter(t => t !== praised)); Voice.say(praised); }
          cur = next;
        } else {
          const got = +q.got;
          q.tries++; q.got = '';
          Snd.play('wrong');
          if (Teach.on) {   // still wrong with the animals: count again, and the third time the answer shows
            if (q.tries >= 3) { Teach.close(); Voice.say(L.math.show); }
            else { Teach.shake(); Voice.say(L.teach.again); }
          } else {
            c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad');
            if (q.tries === 1) {
              const w = MathGate.why(q, got);
              Voice.say(L.math.why[w.k]);
              if (w.op != null) setTimeout(() => { const o1 = $$('.op', c)[w.op]; if (o1) { o1.classList.remove('hey'); void o1.offsetWidth; o1.classList.add('hey'); } }, 350);
            } else if (q.tries === 2) helpT = setTimeout(() => { if (qs[cur] === q) teach(); }, 700);
            else Voice.say(L.math.show);
          }
        }
        draw();
      }
      function cleanup() {
        finished = true;
        clearTimeout(helpT); if (Teach.on) Teach.close();
        window.removeEventListener('keydown', onKey);
        removeEventListener('resize', refit);
      }
      function close() { root.hidden = true; $('#fx').style.zIndex = ''; resolve(); }
      function finish(skipped) {
        cleanup();
        const secs = Math.round((Date.now() - t0) / 1000);
        if (!skipped) {
          Store.d.log.push([Date.now(), count, first, secs, MathGate.label(cfg)]);
          if (Store.d.log.length > 80) Store.d.log.splice(0, Store.d.log.length - 80);
          if (!o.extra) Store.d.today = { day: new Date().toDateString(), pages: MathGate.pagesToday() + 1 };
        }
        if (!o.extra) { Store.d.owed = false; Store.d.spin = null; }
        Store.save();
        draw();
        if (skipped) { close(); return; }
        Snd.play('win'); Fx.confetti(70);
        Voice.say(o.extra ? L.math.doneExtra : L.math.done);
        const m = $('#modal'); m.hidden = false; m.style.zIndex = 45; m.innerHTML = '';
        const card = el('div', 'card');
        card.appendChild(el('h2', 'green', o.extra ? '多 5 步！' : '全部做对啦！'));
        card.appendChild(el('div', 'bigstars', '🎉'));
        const mins = Math.floor(secs / 60), s = secs % 60;
        card.appendChild(el('p', null, `${count} 道题，第一次就做对 <b>${first}</b> 道<br>用了 ${mins ? mins + ' 分 ' : ''}${s} 秒`));
        const row = el('div', 'row');
        const go = el('button', 'btn green', o.extra ? '接着玩 ▶' : '开始玩 ▶');
        go.onclick = () => { Snd.play('tap'); m.hidden = true; m.style.zIndex = ''; close(); };
        row.appendChild(go); card.appendChild(row); m.appendChild(card);
      }
      const refit = () => { fit(); Teach.relayout(); };
      addEventListener('resize', refit);
      requestAnimationFrame(() => { fit(); draw(); });
      // straight from the wheel, which has just said the number: no need to say it again
      if (!fresh) Voice.say(o.extra ? L.math.extra : L.math.start(count));
    });
  },
};
