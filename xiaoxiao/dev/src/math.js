// 动物消消乐 · the math page that stands between one game and the next (anti-addiction + learning by play).
// First she spins the wheel for how many sums (wheel.js, 10 to 20), then a page of them with a number pad.
// decli 2026-11-02: nothing is marked while she writes, so her train of thought is never broken: ✓ just moves on to
// the next sum (one she can't do yet can wait), and when every sum has an answer she hands the page in (交卷). The
// teacher marks it all at once, a tick or a ring card by card, says how many were right, and she corrects the ringed
// ones (订正) one at a time with help in steps, the way a teacher would give it: arriving at one she hears one short
// hint about what went wrong (a sign read the wrong way, one off, digits swapped, the ones right but not the tens) and
// 💡 appears; wrong again brings in 小老师 (teach.js), who starts with 列竖式, and she writes the answer herself. The
// answer is never shown (decli 2026-10-20: she would only copy it): if she still gets it wrong the teacher counts with
// her. Every sum has to be right before the page is done. Parents choose the range (within 20 / 50 / 100), how many
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
  // how hard a sum is (decli 2026-11-05: a page should start easy and work up, and mix small and big numbers):
  // 0 within 20 with no carrying or borrowing, 1 within 20 with one, 2 beyond 20 with none, 3 beyond 20 with one
  band(q) {
    let v = q.nums[0], big = v > 20, cross = false;
    q.signs.forEach((sg, j) => {
      const b = q.nums[j + 1];
      if (sg === '+' ? v % 10 + b % 10 >= 10 : v % 10 < b % 10) cross = true;
      v = sg === '+' ? v + b : v - b;
      if (b > 20 || v > 20) big = true;
    });
    return (big ? 2 : 0) + (cross ? 1 : 0);
  },
  // how many sums of each band a page of n has: within 20 and beyond about half and half (all within 20 when that is
  // the range), more of the easier kind of each
  share(n, max) {
    const w = max > 20 ? [3, 2, 3, 2] : [3, 2, 0, 0], sum = w.reduce((a, b) => a + b, 0);
    const raw = w.map(x => x * n / sum), got = raw.map(Math.floor);
    raw.map((x, i) => [x - got[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, n - got.reduce((a, b) => a + b, 0)).forEach(([, i]) => got[i]++);
    return got;
  },
  // a page, easiest first: within 20 without carrying, beyond 20 without, then within 20 with carrying or borrowing,
  // then beyond 20 with it; adding and taking away by turns in each band
  page(cfg, count) {
    const out = [], seen = new Set(), want = this.share(count, cfg.max);
    for (const b of [0, 2, 1, 3]) {
      for (let k = 0, made = 0; made < want[b] && k < 600; k++) {
        const sign = cfg.mode === 'mix' ? (made % 2 ? '-' : '+') : null;
        const q = this.problem(b < 2 ? Math.min(20, cfg.max) : cfg.max, cfg.ops, cfg.mode, sign);
        if (seen.has(q.text) || (this.band(q) !== b && k < 500)) continue;   // after 500 tries any sum of the range will do
        seen.add(q.text); out.push(q); made++;
      }
    }
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
  // a sum like q for practice straight after 小老师 (9 + 4, then 9 + 6), added at the end of the page: the same first
  // number and signs, the last number a little different, needing a bundle tied or untied if q did, every step still
  // between 0 and max
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
    return n === 'wheel' ? this.spun() ?? this.wheelNums()[0] : n === 'ramp' ? MATH_RAMP[Math.min(this.pagesToday(), MATH_RAMP.length - 1)] : n || 10;
  },
  // the wheel's number for the page owed now (a game played since makes it old), or null before it has been spun
  spun() { const s = Store.d.spin; return s && s.p === Store.d.played ? s.n : null; },
  // the numbers on the wheel (家长设置, 0 to MATH_MOST, decli 2026-11-06), smallest first; MATH_WHEEL if none are set
  wheelNums() {
    const w = [...new Set((Store.d.math.wheel || []).filter(n => Number.isInteger(n) && n >= 0 && n <= MATH_MOST))].sort((a, b) => a - b);
    return w.length ? w : MATH_WHEEL.slice();
  },
  pagesToday() { const t = Store.d.today; return t && t.day === new Date().toDateString() ? t.pages : 0; },


  // o.count, o.extra (the five-sums-for-five-moves page); resolves when every sum is right
  open(o = {}) {
    // the wheel first, unless it has already landed for this page (she left half-way and came back)
    if (!o.count && Store.d.math.count === 'wheel' && this.spun() == null) {
      return Wheel.spin().then(r => {
        // a parent skipped the page, or the wheel landed on 0: no sums this time
        if (r === 'skip' || r === 0) { Store.d.owed = false; Store.d.spin = null; Store.save(); return; }
        if (r !== 'again') this.fresh = true;
        return MathGate.open(o);
      });
    }
    const fresh = this.fresh; this.fresh = false;
    return new Promise(resolve => {
      const cfg = Store.d.math, total = o.count || MathGate.pageSize();
      // was: the answer last marked wrong (ringed on the card until she writes another); ringed: wrong when handed in
      const qs = this.page(cfg, total).map(q => Object.assign(q, { got: '', tries: 0, ok: false, was: null }));
      const root = $('#math'); root.hidden = false; root.innerHTML = ''; root.className = '';
      $('#fx').style.zIndex = 46;   // sparkles and confetti over the page
      const t0 = Date.now();
      // phase: 'write' (she writes every answer, nothing is judged), 'mark' (handed in, the teacher is marking),
      // 'fix' (correcting the ringed ones, one at a time, with help)
      let phase = 'write', cur = 0, first = 0, finished = false, praised = '', helpT = 0, markT = 0, twins = 0, halfSaid = false;
      const hinted = new Set();   // sums whose hint has been said
      Music.stop();   // quiet for the sums (decli); the game starts it again
      const sheet = el('div', 'sheet'), head = el('div', 'head');
      const home = UI.homeButton(); home.style.width = home.style.height = '46px'; home.style.fontSize = '22px';
      head.appendChild(home);
      head.appendChild(el('h3', null, o.extra ? '✏️ 做对 5 道题，多 5 步' : '✏️ ' + L.math.title));
      const prog = el('div', 'prog', `✏️ 0 / ${total}`);
      head.appendChild(prog);
      const lock = el('button', 'ibtn', '🔒'); lock.style.width = lock.style.height = '46px'; lock.style.fontSize = '22px';
      // a parent can skip the page, or change the settings, which starts a new page with the new kind of sums
      const before = JSON.stringify(cfg);
      lock.onclick = () => UI.parent({ fromMath: true, skip: () => finish(true), done: () => { if (JSON.stringify(Store.d.math) !== before && !finished) { cleanup(); resolve(MathGate.open(o)); } } });
      head.appendChild(lock);
      sheet.appendChild(head);
      const grid = el('div', 'grid'); sheet.appendChild(grid);
      root.appendChild(sheet);
      function card(q) {
        const c = el('button', 'q');
        c.innerHTML = `<span>${MathGate.html(q)} =</span><span class="ans"></span>`;
        c.onclick = () => choose(qs.indexOf(q));
        grid.appendChild(c);
        return c;
      }
      const cards = qs.map(card);
      const pad = el('div', 'pad');
      const disp = el('div', 'disp', ''), turnIn = el('button', 'btn green handin', '交卷 ✓'), bulb = el('button', 'bulb', '💡');
      bulb.hidden = true; turnIn.hidden = true;
      disp.appendChild(turnIn); disp.appendChild(bulb);
      bulb.onclick = () => { Snd.init(); Snd.play('tap'); teach(); };
      turnIn.onclick = () => { Snd.init(); handIn(); };
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
        const wide = innerWidth >= innerHeight * 1.05, count = qs.length;
        root.className = wide ? 'wide' : 'tall';
        // a full page fills the screen four across; when four across would make the sums small (a phone, or four
        // numbers in a sum) it takes the column count that gives the biggest sums, so none is cut off at the edges
        // (a clipped "14 + 11" reads as "4 + 11"). The five-sum page is one tidy column.
        const small = count <= 5;
        Object.assign(grid.style, small ? { alignContent: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' } : { alignContent: '', width: '', maxWidth: '', margin: '' });
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
          const was = !q.ok && q.was != null && !q.got;   // her marked answer stays ringed until she writes another
          c.classList.toggle('cur', i === cur && !finished && phase !== 'mark');
          c.classList.toggle('ok', q.ok);
          c.classList.toggle('fix', !q.ok && !!q.ringed);
          c.classList.toggle('has', phase === 'write' && !!q.got);
          a.classList.toggle('was', was);
          a.textContent = q.ok ? q.ans : q.got || (was ? q.was : i === cur && phase !== 'mark' ? '?' : '');
        });
        const n = qs.length, q = qs[cur], filled = qs.filter(x => x.got).length;
        prog.textContent = phase === 'write' ? `✏️ ${filled} / ${n}` : `✓ ${qs.filter(x => x.ok).length} / ${n}`;
        turnIn.hidden = !(phase === 'write' && filled === n);
        // 💡 on a sum being corrected, wiggling the first time it shows
        const help = phase === 'fix' && !finished && !Teach.on && !q.ok && q.tries >= 1;
        if (help && bulb.hidden !== false) { bulb.hidden = false; bulb.classList.remove('new'); void bulb.offsetWidth; bulb.classList.add('new'); Snd.play('idea'); }
        bulb.hidden = !help;
        if (Teach.on) Teach.sync(q.got);
      }
      // she taps a sum: any while writing, one still to correct while correcting
      function choose(i) {
        const q = qs[i];
        if (finished || phase === 'mark' || !q || q.ok || i === cur || Teach.on) return;
        cur = i; Snd.play('tap');
        clearTimeout(helpT);
        draw();
        if (phase === 'fix') hint();
      }
      // 小老师 over the cards; the pad stays to write the answer
      function teach() {
        clearTimeout(helpT);
        if (finished || phase !== 'fix' || qs[cur].ok) return;
        Teach.open(qs[cur], sheet, { close: draw });
        draw();
      }
      function press(k) {
        if (finished || phase === 'mark') return;
        Snd.init();
        if (Teach.on && Teach.key(k)) return;   // a step of 拆一拆 or 列竖式 takes the pad
        const q = qs[cur];
        if (q.ok) return;
        if (k === '⌫') { q.got = q.got.slice(0, -1); Snd.play('key', 2); }
        else if (k === '✓') { if (phase === 'write') onward(); else if (q.got) check(); return; }
        else if (q.got.length < 3) { q.got = (q.got === '0' ? '' : q.got) + k; Snd.play('key', +k); }
        draw();
      }
      // ✓ while writing: on to the next sum still blank, nothing said about this one (a blank one can wait); with
      // every sum written, 交卷 bounces
      function onward() {
        const n = qs.length;
        let next = -1;
        for (let d = 1; d < n && next < 0; d++) if (!qs[(cur + d) % n].got) next = (cur + d) % n;
        if (next >= 0) {
          cur = next; Snd.play('select'); draw();
          if (!halfSaid && n >= 10 && qs.filter(x => x.got).length >= Math.ceil(n / 2)) { halfSaid = true; Voice.say(L.math.half); }
          return;
        }
        if (!qs[cur].got) return;   // the only blank one is this
        draw();
        turnIn.classList.remove('hey'); void turnIn.offsetWidth; turnIn.classList.add('hey');
        Snd.play('idea');
        Voice.say(L.math.allIn);
      }
      // 交卷: the teacher marks the whole page at once, a tick or a ring one sum after another
      function handIn() {
        if (phase !== 'write' || qs.some(x => !x.got)) return;
        phase = 'mark'; Snd.play('tap'); Voice.say(L.math.mark);
        draw();
        const n = qs.length, gap = clamp(4200 / n, 180, 380);
        let i = 0;
        const step = () => {
          if (finished) return;
          if (i >= n) { markT = setTimeout(marked, 600); return; }
          const q = qs[i], c = cards[i];
          if (+q.got === q.ans) {
            q.ok = true; first++;
            Snd.play('mark', first);
            const r = c.getBoundingClientRect();
            Fx.burst(r.left + r.width * 0.8, r.top + r.height / 2, ['#5fe0b0', '#ffd23a'], 6, 0.6, 40);
          } else { q.was = +q.got; q.got = ''; q.tries = 1; q.ringed = true; Snd.play('ring'); }
          c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 260 });
          i++; draw();
          markT = setTimeout(step, gap);
        };
        markT = setTimeout(step, 700);
      }
      // marked: every sum right ends the page; else how many were right and how many to correct, then the first one
      function marked() {
        if (finished) return;
        const left = qs.filter(x => !x.ok);
        if (!left.length) { draw(); finish(false); return; }
        phase = 'fix'; cur = qs.indexOf(left[0]);
        draw();
        const go = () => { if (!finished && phase === 'fix') hint(); };
        const fixLine = () => Voice.say(L.math.fix(left.length), { onend: go });
        if (first) Voice.say(L.math.got(first), { onend: fixLine }); else fixLine();
      }
      // at a sum to correct: one short hint about what went wrong (MathGate.why), the sign it is about jumping
      function hint() {
        const q = qs[cur], c = cards[cur];
        if (finished || q.ok || q.was == null || hinted.has(q) || Teach.on) return;
        hinted.add(q);
        const w = MathGate.why(q, q.was);
        Voice.say(L.math.why[w.k]);
        if (w.op != null) setTimeout(() => { const o1 = $$('.op', c)[w.op]; if (o1) { o1.classList.remove('hey'); void o1.offsetWidth; o1.classList.add('hey'); } }, 350);
      }
      const nextToFix = () => { const i = qs.findIndex((x, j) => j > cur && !x.ok); return i >= 0 ? i : qs.findIndex(x => !x.ok); };
      // correcting: each answer is checked as she gives it
      function check() {
        const q = qs[cur], c = cards[cur];
        clearTimeout(helpT);
        if (+q.got === q.ans) {
          q.ok = true;
          Snd.play('right'); c.classList.remove('bad');
          const taught = Teach.on;
          if (taught) Teach.right();
          const r = c.getBoundingClientRect();
          Fx.burst(r.left + r.width * 0.8, r.top + r.height / 2, ['#5fe0b0', '#ffd23a'], 10, 0.8, 60);
          // worked out with 小老师: praise the working out, and a sum just like it joins the end of the page, to do on
          // her own straight away (twice a page at most)
          const t = taught && twins < 2 && MathGate.twin(q, cfg.max, qs.map(x => x.text));
          if (t) {
            twins++;
            const nq = Object.assign(t, { got: '', tries: 0, ok: false, was: null, twin: true });
            qs.push(nq); const tc = card(nq); cards.push(tc);
            cur = qs.length - 1;
            fit(); draw();
            tc.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.12) rotate(-2deg)', opacity: 1 }, { transform: 'scale(1)' }], { duration: 500, delay: 300, fill: 'backwards' });
            Voice.say(L.teach.self, { onend: () => { if (!finished && qs[cur] === nq) Voice.say(L.teach.twin); } });
            return;
          }
          const next = nextToFix();
          if (next < 0) { draw(); finish(false); return; }
          cur = next; draw();
          const then = () => { if (!finished && cur === next) hint(); };
          if (taught) Voice.say(L.teach.self, { onend: then });
          else { praised = pick(L.math.right.filter(x => x !== praised)); Voice.say(praised, { onend: then }); }
        } else {
          const got = +q.got;
          q.tries++; q.got = ''; q.was = got;
          Snd.play('wrong');
          if (Teach.on) Teach.wrong();   // the teacher finishes the picture, or counts it with her
          else {
            c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad');
            // the hint first if she hasn't had it (a new sum like one 小老师 helped with); after it, 小老师
            if (!hinted.has(q)) hint();
            else helpT = setTimeout(() => { if (qs[cur] === q) teach(); }, 700);
          }
          draw();
        }
      }
      function cleanup() {
        finished = true;
        clearTimeout(helpT); clearTimeout(markT); if (Teach.on) Teach.close();
        window.removeEventListener('keydown', onKey);
        removeEventListener('resize', refit);
      }
      function close() { root.hidden = true; $('#fx').style.zIndex = ''; resolve(); }
      function finish(skipped) {
        cleanup();
        const secs = Math.round((Date.now() - t0) / 1000);
        if (!skipped) {
          Store.d.log.push([Date.now(), total, first, secs, MathGate.label(cfg)]);
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
        const box = el('div', 'card');
        box.appendChild(el('h2', 'green', o.extra ? '多 5 步！' : '全部做对啦！'));
        box.appendChild(el('div', 'bigstars', '🎉'));
        const mins = Math.floor(secs / 60), s = secs % 60;
        box.appendChild(el('p', null, `${total} 道题，第一次就做对 <b>${first}</b> 道<br>用了 ${mins ? mins + ' 分 ' : ''}${s} 秒`));
        const row = el('div', 'row');
        const go = el('button', 'btn green', o.extra ? '接着玩 ▶' : '开始玩 ▶');
        go.onclick = () => { Snd.play('tap'); m.hidden = true; m.style.zIndex = ''; close(); };
        row.appendChild(go); box.appendChild(row); m.appendChild(box);
      }
      const refit = () => { fit(); Teach.relayout(); };
      addEventListener('resize', refit);
      requestAnimationFrame(() => { fit(); draw(); });
      // straight from the wheel, which has just said the number: no need to say it again
      if (!fresh) Voice.say(o.extra ? L.math.extra : L.math.start(total));
    });
  },
};
