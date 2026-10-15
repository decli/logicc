// 动物消消乐 · the math page that stands between one game and the next (anti-addiction + learning by play).
// A page of 20 sums with a number pad; every sum has to be answered right before the page is done. A wrong answer
// shakes and clears; after three tries the right answer shows in grey to be copied, so she is never stuck.
// Parents choose the range (within 20 / 50 / 100), how many numbers (2 / 3 / 4) and add / subtract / both.
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
      return { text, ans: v };
    }
    return { text: '1 + 1', ans: 2 };
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
  label(cfg) {
    return `${cfg.max} 以内 · ${['', '', '两个数', '三个数', '四个数'][cfg.ops]} · ${{ mix: '加减混合', add: '只有加法', sub: '只有减法' }[cfg.mode]}`;
  },

  // o.count, o.extra (the five-sums-for-five-moves page); resolves when every sum is right
  open(o = {}) {
    return new Promise(resolve => {
      const cfg = Store.d.math, count = o.count || cfg.count || 20;
      const qs = this.page(cfg, count).map(q => Object.assign(q, { got: '', tries: 0, ok: false }));
      const root = $('#math'); root.hidden = false; root.innerHTML = '';
      $('#fx').style.zIndex = 46;   // sparkles and confetti over the page
      const t0 = Date.now();
      let cur = 0, first = 0, finished = false;
      Music.stop();   // quiet for the sums (decli); the game starts it again
      const sheet = el('div', 'sheet'), head = el('div', 'head');
      const home = UI.homeButton(); home.style.width = home.style.height = '46px'; home.style.fontSize = '22px';
      head.appendChild(home);
      head.appendChild(el('h3', null, o.extra ? '✏️ 做对 5 道题，多 5 步' : '✏️ 先做一页数学题'));
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
        c.innerHTML = `<span>${q.text} =</span><span class="ans"></span>`;
        c.onclick = () => { if (!q.ok && !finished) { cur = i; Snd.play('tap'); draw(); } };
        grid.appendChild(c);
        return c;
      });
      const pad = el('div', 'pad');
      const disp = el('div', 'disp', '');
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
        let cols = small ? 1 : 4;
        if (!small && size(4) < 20) cols = [3, 2].reduce((a, c) => size(c) > size(a) + 0.5 ? c : a, 4);
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
        const n = qs.filter(q => q.ok).length;
        prog.textContent = `${n} / ${count}`;
        disp.textContent = finished ? '' : qs[cur].tries >= 3 ? '照着灰色的答案写一遍' : qs[cur].tries ? '再想一想' : '';
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
        if (+q.got === q.ans) {
          q.ok = true; if (!q.tries) first++;
          Snd.play('right');
          const r = c.getBoundingClientRect();
          Fx.burst(r.left + r.width * 0.8, r.top + r.height / 2, ['#5fe0b0', '#ffd23a'], 10, 0.8, 60);
          const n = qs.filter(x => x.ok).length;
          if (n === count) { draw(); return finish(false); }
          Voice.say(n === Math.floor(count / 2) && count >= 10 ? L.math.half : pick(L.math.right));
          let next = qs.findIndex((x, i) => i > cur && !x.ok);
          if (next < 0) next = qs.findIndex(x => !x.ok);
          cur = next;
        } else {
          q.tries++; q.got = '';
          Snd.play('wrong');
          c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad');
          Voice.say(q.tries === 3 ? L.math.show : L.math.wrong);
        }
        draw();
      }
      function cleanup() {
        finished = true;
        window.removeEventListener('keydown', onKey);
        removeEventListener('resize', fit);
      }
      function close() { root.hidden = true; $('#fx').style.zIndex = ''; resolve(); }
      function finish(skipped) {
        cleanup();
        const secs = Math.round((Date.now() - t0) / 1000);
        if (!skipped) {
          Store.d.log.push([Date.now(), count, first, secs, MathGate.label(cfg)]);
          if (Store.d.log.length > 80) Store.d.log.splice(0, Store.d.log.length - 80);
        }
        if (!o.extra) Store.d.owed = false;
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
      addEventListener('resize', fit);
      requestAnimationFrame(() => { fit(); draw(); });
      Voice.say(o.extra ? L.math.extra : L.math.start);
    });
  },
};
