// 动物消消乐 · the screens around the game: the level map, the cards (level start, result, pause), the parents'
// corner behind a grown-up question, and the little toast that confirms a setting there.
// The cards a child sees use pictures, numbers and the narrator's voice, not sentences: she can't read yet.
const UI = {
  modal(build, o = {}) {
    const m = $('#modal'); m.hidden = false; m.innerHTML = '';
    Fx.hush(); $('#toast').classList.remove('on');
    const card = el('div', 'card' + (o.cls ? ' ' + o.cls : ''));
    build(card);
    m.appendChild(card);
    m.onclick = e => { if (e.target === m && o.close) { Snd.play('tap'); o.close(); } };
    return card;
  },
  closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; m.onclick = null; },
  button(label, cls, fn) { const b = el('button', 'btn ' + (cls || ''), label); b.onclick = () => { Snd.init(); Snd.play('tap'); fn(); }; return b; },
  // the little house back to 思维小画本, on the map, in the game and on the math page (a math page still owed stays owed)
  homeButton() {
    const b = el('button', 'ibtn home', '🏠'); b.title = '回思维小画本'; b.setAttribute('aria-label', '回思维小画本');
    b.onclick = () => { Snd.play('tap'); Voice.stop(); setTimeout(() => { location.href = '../'; }, 120); };
    return b;
  },

  // ---------- the level map: one island at a time ----------
  // 第二季 (decli 2026-11-02): the levels are islands (ISLANDS in levels.js); ◀ ▶, a swipe or the row of islands at the
  // bottom goes to another one. An island she can't play yet can be looked at, its levels locked. The first time she
  // arrives on a new island it is welcomed by name.
  isleOpen(k) { return Store.d.open > ISLANDS[k].from; },
  isleStars(k) { const s = ISLANDS[k]; let n = 0; for (let i = s.from; i < s.from + s.n; i++) n += Store.d.stars[i] || 0; return n; },
  map(k) {
    Game.stop(); this.closeModal(); $('#album').hidden = true;
    Music.start();
    const d = Store.d, cur = Math.min(d.open, LEVELS.length) - 1;
    if (k == null) k = d.isle >= 0 && d.isle < ISLANDS.length ? d.isle : isleOf(cur);
    if (k !== d.isle) { d.isle = k; Store.save(); }
    const isle = ISLANDS[k], open = this.isleOpen(k);
    const map = $('#map'); map.hidden = false; map.innerHTML = '';
    // the island's own picture when decli's is in, else its colours and things growing round the edges
    const bg = Art2.img['island-' + (k + 1) + '-bg'];
    map.style.background = bg ? `center/cover no-repeat url(${bg.src})` : `radial-gradient(ellipse at 50% 58%,${isle.land} 0 34%,transparent 62%),linear-gradient(170deg,${isle.sky.join(',')})`;
    if (!bg) {
      const deco = el('div', 'deco');
      for (let i = 0; i < 14; i++) {
        const a = i / 14 * Math.PI * 2 + 0.3, e = el('span', null, isle.deco[i % isle.deco.length]);
        Object.assign(e.style, { left: 50 + Math.cos(a) * 47 + '%', top: 54 + Math.sin(a) * 44 + '%', fontSize: 34 + (i * 7) % 22 + 'px', animationDelay: -i * 0.7 + 's' });
        deco.appendChild(e);
      }
      map.appendChild(deco);
    }
    const top = el('div', 'top');
    top.appendChild(this.homeButton());
    const title = el('h1', null, `<span class="ic">${isle.icon} </span>${isle.name}`);
    top.appendChild(title);
    top.appendChild(el('div', 'pill stars', `⭐ ${this.isleStars(k)} / ${isle.n * 3}`));
    const book = el('button', 'pill book' + ((d.giftFresh || []).length ? ' new' : ''), `🎁 ${Gift.count()} / ${FRIENDS.length}`);
    book.onclick = () => { Snd.init(); Snd.play('select'); Gift.album(); };
    top.appendChild(book);
    const gear = el('button', 'ibtn', '⚙️'); gear.onclick = () => { Snd.play('tap'); this.parent({}); };
    top.appendChild(gear);
    map.appendChild(top);
    if (!open) map.appendChild(el('div', 'isle-lock', '🔒'));   // behind the path and the levels
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.id = 'path';
    map.appendChild(svg);
    const idx = Array.from({ length: isle.n }, (_, j) => isle.from + j);
    const nodes = idx.map(i => {
      const lv = LEVELS[i], n = el('button', 'node' + (i === isle.from + isle.n - 1 ? ' boss' : ''));
      const on = i < d.open, st = d.stars[i] || 0;
      if (!on) { n.classList.add('lock'); n.innerHTML = '🔒'; }
      else { n.textContent = i + 1; if (st) n.classList.add('done'); }
      if (on && i === d.open - 1 && !st) n.classList.add('cur');
      n.appendChild(el('span', 'st', on ? '⭐'.repeat(st) + '<span style="opacity:.3">' + '⭐'.repeat(3 - st) + '</span>' : ''));
      if (on) n.appendChild(el('span', 'nm', lv.name));
      n.onclick = () => {
        Snd.init();
        if (!on) { Snd.play('bad'); Voice.say(open ? L.locked : L.isle.locked); n.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 250); return; }
        Snd.play('select'); this.intro(i);
      };
      map.appendChild(n);
      return n;
    });
    const av = el('canvas', 'avatar'); av.width = av.height = 152;
    av.getContext('2d').drawImage(Art.friend(Pal.i(), 152, 132), 0, 0);   // the companion stands for her on the map
    av.hidden = !idx.includes(cur);
    map.appendChild(av);
    // travelling between islands
    const go = j => { if (j < 0 || j >= ISLANDS.length || j === k) return; Snd.init(); Snd.play('swap'); this.map(j); };
    const prev = el('button', 'isle-arrow prev', '◀'), next = el('button', 'isle-arrow next' + (k + 1 < ISLANDS.length && !this.isleOpen(k + 1) ? ' shut' : ''), '▶');
    prev.hidden = k === 0; next.hidden = k === ISLANDS.length - 1;
    prev.onclick = () => go(k - 1); next.onclick = () => go(k + 1);
    map.appendChild(prev); map.appendChild(next);
    const row = el('div', 'isles');
    ISLANDS.forEach((s, j) => {
      const b = el('button', 'isle' + (j === k ? ' on' : '') + (this.isleOpen(j) ? '' : ' shut'));
      const pic = Art2.img['island-' + (j + 1)];
      if (pic) { const im = el('img'); im.src = pic.src; im.alt = ''; b.appendChild(im); } else b.textContent = s.icon;
      if (this.isleStars(j) >= s.n * 3) b.classList.add('full');
      b.onclick = () => go(j);
      row.appendChild(b);
    });
    map.appendChild(row);
    let sx = null;
    map.onpointerdown = e => { sx = e.target === map || e.target === svg || e.target.closest('.deco') ? e.clientX : null; };
    map.onpointerup = e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 70) go(k + (dx < 0 ? 1 : -1)); };
    const place = () => {
      const W = innerWidth, H = innerHeight, wide = W >= H;
      const cols = wide ? 5 : 3, rows = Math.ceil(isle.n / cols);
      const topH = top.getBoundingClientRect().bottom + (H < 500 ? 24 : 40), bottom = row.getBoundingClientRect().height + (H < 500 ? 34 : 50);
      const x0 = W * (wide ? 0.14 : 0.19), x1 = W * (wide ? 0.86 : 0.81);
      const pts = idx.map((_, j) => {
        const r = Math.floor(j / cols), c = j % cols, col = r % 2 ? cols - 1 - c : c;
        const y = topH + (H - bottom - topH) * (r + 0.5) / rows;
        return [x0 + (x1 - x0) * col / (cols - 1), y + Math.sin(j * 1.7) * 10];
      });
      const sz = clamp(Math.min(W / (cols * 2.5), (H - topH - bottom) / (rows * 1.95)), 44, 104);
      map.classList.toggle('tight', sz < 62);   // a short screen: the stars stay, the names go
      nodes.forEach((n, j) => {
        const big = j === isle.n - 1 ? 1.18 : 1;
        n.style.left = pts[j][0] + 'px'; n.style.top = pts[j][1] + 'px';
        n.style.width = n.style.height = sz * big + 'px'; n.style.margin = `${-sz * big / 2}px 0 0 ${-sz * big / 2}px`; n.style.fontSize = sz * 0.4 + 'px';
      });
      let dd = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[Math.max(0, i - 2)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(pts.length - 1, i + 1)];
        dd += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
      }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = `<path d="${dd}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="${sz * 0.42}" stroke-linecap="round"/>` +
        `<path d="${dd}" fill="none" stroke="#e9a35a" stroke-width="${sz * 0.12}" stroke-dasharray="${sz * 0.05} ${sz * 0.28}" stroke-linecap="round"/>`;
      const at = idx.indexOf(cur);
      if (at >= 0) { av.style.left = pts[at][0] + 'px'; av.style.top = pts[at][1] + 'px'; av.style.width = av.style.height = sz * 0.75 + 'px'; av.style.margin = `${-sz * 1.15}px 0 0 ${sz * 0.05}px`; }
    };
    place();
    this._mapResize && removeEventListener('resize', this._mapResize);
    this._mapResize = () => { if (!map.hidden) place(); };
    addEventListener('resize', this._mapResize);
    // a new island, the first time she gets there
    if (open && k > 0 && !d.seen['isle_' + k]) { d.seen['isle_' + k] = 1; Store.save(); Voice.say(L.isle.hi[k]); title.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' }); Fx.confetti(50); }
  },
  // the last level of an island won for the first time: a card for the island and a blind box that is always 稀有 or
  // better
  async isleDone(k) {
    const isle = ISLANDS[k];
    Snd.play('win'); Fx.confetti(120);
    Voice.say(L.isle.done[k]);
    await new Promise(res => {
      this.modal(card => {
        card.appendChild(el('h2', 'green', `${isle.icon} ${isle.name}`));
        const pic = Art2.img['island-' + (k + 1)];
        if (pic) { const im = el('img', 'isle-pic'); im.src = pic.src; im.alt = ''; card.appendChild(im); } else card.appendChild(el('div', 'bigstars', '🏝️'));
        card.appendChild(el('p', null, `<span class="big">${isle.n} / ${isle.n}</span> 关 · ⭐ ${this.isleStars(k)}`));
        const row = el('div', 'row');
        row.appendChild(this.button('🎁 打开', 'sun', () => { this.closeModal(); res(); }));
        card.appendChild(row);
      });
    });
    await Gift.open(3, { rare: true, isle: k });
  },

  // ---------- before a level ----------
  intro(li) {
    const lv = LEVELS[li], goalEls = [];
    Store.newDay();   // the first game of a day needs no math page (decli 2026-11-06), even with the game left open overnight
    Cast.pick(li);   // new animals every game
    this.modal(card => {
      card.appendChild(el('h2', null, `第 ${li + 1} 关`));
      card.appendChild(el('div', 'big', lv.name));
      // the moves and the goals as pictures, the same as the panels she will see while playing (the narrator says the rest)
      const goals = el('div', 'goals');
      goals.appendChild(el('div', 'moves', `<b>${lv.moves}</b><span>步</span>`));
      const probe = new Board(lv, mulberry32(1));
      probe.goals.forEach(g => { const d = el('div', 'goal'); d.appendChild(Art.goalIcon(g, 136)); d.appendChild(el('b', null, g.n)); goals.appendChild(d); goalEls.push(d); });
      card.appendChild(goals);
      if (Store.d.best[li]) card.appendChild(el('p', 'best', `🏆 ${Store.d.best[li].toLocaleString('en-US')}`));
      const row = el('div', 'row');
      row.appendChild(this.button('🗺️', 'ghost', () => this.closeModal()));
      row.appendChild(Store.d.owed ? this.button('✏️ 先做数学题', 'sun', () => this.play(li)) : this.button('开始 ▶', 'green', () => this.play(li)));
      card.appendChild(row);
    }, { close: () => this.closeModal() });
    const line = L.intro(lv, li + 1);
    const tip = lv.tip && !Store.d.seen['tip_' + lv.tip] ? L.tip[lv.tip] : null;
    // the intro, then this game's animals by name, each goal picture bouncing as it is named, then the tip
    const open = () => !$('#modal').hidden && $('#modal .goals') === goalEls[0]?.parentNode;
    const named = lv.goals.map((g, j) => (g.t === 'c' ? j : -1)).filter(j => j >= 0);
    const names = k => {
      if (!open()) return;
      if (k >= named.length) { if (tip) Voice.say(tip); return; }
      const j = named[k];
      goalEls[j].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25) rotate(-6deg)' }, { transform: 'scale(1)' }], 520);
      Voice.say(L.gift.names[ANIMALS[lv.goals[j].color].h], { onend: () => setTimeout(() => names(k + 1), 120) });
    };
    Voice.say(line, { onend: () => names(0) });
    if (tip) { Store.d.seen['tip_' + lv.tip] = 1; Store.save(); }
  },
  // start a level, through the math page when one is owed (never before the first game of the day)
  async play(li) {
    this.closeModal();
    Store.newDay();
    if (Store.d.owed) { Game.stop(); await MathGate.open(); }
    Game.start(li);
  },

  // ---------- after a level ----------
  result(o) {
    const lv = LEVELS[o.li], last = o.li >= LEVELS.length - 1;
    this.modal(card => {
      if (o.win) {
        card.appendChild(el('h2', 'green', '过关啦！'));
        const st = el('div', 'bigstars', '<span>⭐</span><span>⭐</span><span>⭐</span>');
        card.appendChild(st);
        [...st.children].forEach((s, i) => { if (i < o.stars) setTimeout(() => { s.classList.add('on'); Snd.play('star', i); Fx.sparkles(s.getBoundingClientRect().left + 30, s.getBoundingClientRect().top + 30, 8, 30, '#ffd23a'); }, 300 + i * 380); });
        card.appendChild(el('p', null, `<span class="big">${o.score.toLocaleString('en-US')}</span> 分`));
        if (last) card.appendChild(el('p', null, '🏆 所有小岛全部通关啦！'));
        const row = el('div', 'row');
        row.appendChild(this.button('🗺️', 'ghost', () => this.map()));
        row.appendChild(this.button('↻ 再玩一次', 'violet', () => this.play(o.li)));
        if (!last) row.appendChild(this.button('下一关 ▶', 'green', () => this.play(o.li + 1)));
        card.appendChild(row);
        // a replay that opened no box: she hears that three stars still would (if she hasn't had them)
        setTimeout(() => Voice.say(last ? L.allDone : !o.box && o.stars < 3 && (Store.d.stars[o.li] || 0) < 3 ? L.gift.more : L.stars[o.stars]), 1500);
        if (last) setTimeout(() => Fx.confetti(120), 600);
      } else {
        card.appendChild(el('h2', 'violet', '差一点点！'));
        const goals = el('div', 'goals');
        o.goals.forEach(g => { if (g.left <= 0) return; const d = el('div', 'goal'); d.appendChild(Art.goalIcon(g, 136)); d.appendChild(el('b', null, g.left)); goals.appendChild(d); });
        card.appendChild(goals);
        const row = el('div', 'row');
        if (o.extra) row.appendChild(this.button('✏️ +5 步', 'sun', () => { this.closeModal(); Game.moreMoves(); }));
        row.appendChild(this.button('↻ 再试一次', 'violet', () => this.play(o.li)));
        row.appendChild(this.button('🗺️', 'ghost', () => this.map()));
        card.appendChild(row);
        if (o.extra) setTimeout(() => Voice.say(L.extraOffer), 1800);
      }
    });
  },

  pause() {
    Clock.paused = true; Music.stop();
    const resume = () => { this.closeModal(); Clock.paused = false; Music.start(); };
    this.modal(card => {
      card.appendChild(el('h2', 'violet', '休息一下'));
      card.appendChild(this.soundRow());
      const row = el('div', 'row');
      row.appendChild(this.button('🗺️ 地图', 'ghost', () => { Clock.paused = false; this.map(); }));
      row.appendChild(this.button('↻ 重新开始', 'violet', () => { Clock.paused = false; this.play(Game.li); }));
      row.appendChild(this.button('▶ 继续', 'green', resume));
      card.appendChild(row);
    }, { close: resume });
  },
  soundRow() {
    const d = Store.d, row = el('div', 'seg');
    row.style.justifyContent = 'center';
    const mk = (label, key, apply) => {
      const b = el('button', d[key] ? 'on' : '', label);
      b.onclick = () => { d[key] = !d[key]; b.classList.toggle('on', d[key]); apply(d[key]); Store.save(); Snd.play('tap'); };
      row.appendChild(b);
    };
    mk('🔊 音效', 'snd', v => Snd.setOn(v));
    mk('🗣️ 语音', 'voi', v => { Voice.on = v; if (!v) Voice.stop(); });
    mk('🎵 音乐', 'mus', v => { Snd.music = v; Music.refresh(); });
    return row;
  },

  // ---------- parents' corner ----------
  parent(o) {
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    let got = '';
    const m = $('#modal'); const prevZ = m.style.zIndex; m.style.zIndex = 50;
    const close = () => { m.style.zIndex = prevZ; this.closeModal(); };
    const card = this.modal(card => {
      card.classList.add('gate');
      card.appendChild(el('h2', 'violet', '家长专区'));
      card.appendChild(el('p', null, `请爸爸妈妈回答：<br><b style="font-size:30px">${zh[a]}乘以${zh[b]}等于多少？</b>`));
      const disp = el('div', 'big', '&nbsp;'); card.appendChild(disp);
      const keys = el('div', 'keys');
      '1234567890'.split('').forEach(k => {
        const kb = el('button', 'key', k);
        kb.onclick = () => {
          Snd.play('key', +k); got = (got + k).slice(-2); disp.textContent = got;
          if (got.length === 2 || +got === a * b) {
            if (+got === a * b) { Snd.play('right'); close(); this.settings(o); }
            else if (got.length === 2) { Snd.play('wrong'); disp.textContent = '再试试'; got = ''; }
          }
        };
        keys.appendChild(kb);
      });
      card.appendChild(keys);
      const row = el('div', 'row'); row.appendChild(this.button('取消', 'ghost small', close)); card.appendChild(row);
    }, { close });
    if (o.fromMath) m.style.zIndex = 50;
    Voice.say(L.parent);
    return card;
  },
  settings(o) {
    const d = Store.d, cfg = d.math;
    const m = $('#modal'); m.style.zIndex = 50;
    const close = () => { m.style.zIndex = ''; this.closeModal(); if (!$('#map').hidden) this.map(); if (o.done) o.done(); };
    this.modal(card => {
      card.classList.add('set');
      card.appendChild(el('h2', 'violet', '家长设置'));
      const seg = (title, key, opts, obj = cfg) => {
        card.appendChild(el('h3', null, title));
        const s = el('div', 'seg');
        opts.forEach(([v, label]) => {
          const b = el('button', obj[key] === v ? 'on' : '', label);
          b.onclick = () => { obj[key] = v; $$('button', s).forEach(x => x.classList.toggle('on', x === b)); Store.save(); Snd.play('tap'); sample(); };
          s.appendChild(b);
        });
        card.appendChild(s);
      };
      card.appendChild(el('p', null, '<span style="font-size:17px">每天第一局直接玩，不用做题；之后每玩完一局，再玩、进下一关或当天再进来，都要先做一页数学题，全部做对才能接着玩。</span>'));
      seg('📝 每页几道题', 'count', [['wheel', '🎡 转盘抽']].concat([['ramp', '越做越多']], MATH_COUNTS.map(n => [n, n + ' 道'])));
      // the numbers on the wheel (decli 2026-11-06): any of 0 to MATH_MOST, ticked one by one
      card.appendChild(el('h3', null, '🎡 转盘上有哪些数（点一下选上 / 去掉）'));
      const chips = el('div', 'seg chips'), wnote = el('p', 'note');
      const showW = () => {
        const w = MathGate.wheelNums();
        $$('button', chips).forEach(b => b.classList.toggle('on', w.includes(+b.dataset.n)));
        wnote.textContent = `转盘现在有 ${w.length} 格：${w.join('、')} 道` + (w.includes(0) ? '（转到 0 这次就不用做题）' : '') + '。每格一样大，转到哪个数的机会都一样；改了以后，下一次转盘就用新的数。';
      };
      for (let n = 0; n <= MATH_MOST; n++) {
        const b = el('button', null, String(n)); b.dataset.n = n;
        b.onclick = () => {
          const w = MathGate.wheelNums(), has = w.includes(n);
          if (has && w.length === 1) { Snd.play('bad'); this.toast('转盘上至少要留一个数'); return; }
          cfg.wheel = has ? w.filter(x => x !== n) : w.concat(n).sort((a, b) => a - b);
          d.spin = null;   // a page owed is drawn again on the new wheel
          Store.save(); Snd.play('tap'); showW();
        };
        chips.appendChild(b);
      }
      chips.appendChild(this.button('恢复默认', 'ghost small', () => { cfg.wheel = MATH_WHEEL.slice(); d.spin = null; Store.save(); Snd.play('tap'); showW(); }));
      card.appendChild(chips); card.appendChild(wnote); showW();
      card.appendChild(el('p', 'note', `转盘抽：每页之前孩子自己转一下转盘，转到几就做几道（默认 ${MATH_WHEEL.join('、')} 道）。越做越多：当天第 1 页 ${MATH_RAMP[0]} 道、第 2 页 ${MATH_RAMP[1]} 道、第 3 页 ${MATH_RAMP[2]} 道，之后每页 ${MATH_RAMP[3]} 道，第二天重新从 ${MATH_RAMP[0]} 道开始。今天已经做完 ${MathGate.pagesToday()} 页。`));
      card.appendChild(el('p', 'note', '做题时不逐题判对错，免得打断她的思路：✓ 只是跳到下一道，整页都写好了点「交卷」，小老师一次批改完，对的打 ✓，错的圈出来让她订正。订正时先语音提示错在哪（看错符号、差一点、写反了……）并出现 💡；再错或点 💡，小老师来帮忙，答案始终让她自己数、自己写，不直接给答案；看着图还是数错，小老师就带着她一个一个数。'));
      seg('🦉 小老师先用哪种办法', 'way', [['col', '列竖式'], ['pick', '她自己选'], ['random', '随机换'], ['frame', '摆一摆'], ['line', '跳一跳'], ['split', '拆一拆']], d);
      const used = Teach.WAYS.map((w, i) => { const r = (d.ways || {})[w]; return r && r[0] ? `${L.teach.ways[i]} 用了 ${r[0]} 次，其中 ${r[1]} 次看图自己数对` : ''; }).filter(Boolean);
      card.appendChild(el('p', 'note', '列竖式（默认）：学校里的竖式，个位对个位、十位对十位，旁边的数位表里个位是小动物、十位是一捆捆；满十捆一捆进到十位（记小 1），不够减从十位借一捆拆开（点退位点），她一位一位数、一位一位写，最后把得数写回横式。摆一摆：小动物摆进十格框，满十捆一捆、不够拆一捆。跳一跳：小青蛙在数轴上往前、往回跳，整十跳大步，数轴上标着整十。拆一拆：拆成几小步自己填（凑十、平十、破十、先算整十），每步配图数一数。小老师里点 🔄 随时换一种。'
        + (used.length ? '<br>她的记录：' + used.join('；') + (d.wayLast ? `；上次用的是${L.teach.ways[Teach.WAYS.indexOf(d.wayLast)]}。` : '。') : '')));
      seg('📏 数的范围', 'max', [[20, '20 以内'], [50, '50 以内'], [100, '100 以内']]);
      card.appendChild(el('p', 'note', '每一页都由易到难：先是 20 以内不进位不退位的，再是两位数不进位的，然后 20 以内进位退位的，最后两位数进位退位的。选 50 或 100 以内时，20 以内的题和更大的数大约各占一半；选 20 以内就全是 20 以内。'));
      seg('🔢 几个数一起算', 'ops', [[2, '两个数'], [3, '三个数'], [4, '四个数']]);
      seg('➕ 题型', 'mode', [['mix', '加减混合'], ['add', '只有加法'], ['sub', '只有减法']]);
      const smp = el('div', 'sample'); card.appendChild(smp);
      const sample = () => { smp.textContent = '例题：' + MathGate.page(cfg, 4).map(q => q.text + ' = ' + q.ans).join('　　'); };
      sample();
      card.appendChild(el('h3', null, '🔊 声音'));
      card.appendChild(this.soundRow());
      // the record
      card.appendChild(el('h3', null, '📒 做题记录'));
      const today = new Date().toDateString();
      const tl = d.log.filter(r => new Date(r[0]).toDateString() === today);
      const sum = (a, k) => a.reduce((n, r) => n + r[k], 0);
      card.appendChild(el('p', null, `<span style="font-size:17px">今天做了 <b>${tl.length}</b> 页、${sum(tl, 1)} 道题，第一次就做对 ${sum(tl, 1) ? Math.round(100 * sum(tl, 2) / sum(tl, 1)) : 0}%；一共玩了 ${d.played} 局。</span>`));
      if (d.log.length) {
        const tb = el('table');
        d.log.slice(-8).reverse().forEach(r => {
          const t = new Date(r[0]), pad = n => String(n).padStart(2, '0');
          const tr = el('tr', null, `<td>${t.getMonth() + 1}/${t.getDate()} ${pad(t.getHours())}:${pad(t.getMinutes())}</td><td>${r[4]}</td><td>${r[2]}/${r[1]} 一次对</td><td>${Math.floor(r[3] / 60)}分${r[3] % 60}秒</td>`);
          tb.appendChild(tr);
        });
        card.appendChild(tb);
      }
      card.appendChild(el('h3', null, '🛠️ 其他'));
      const row = el('div', 'row'); row.style.justifyContent = 'flex-start'; row.style.marginTop = '4px';
      if (o.fromMath && o.skip) row.appendChild(this.button('跳过这一页', 'sun small', () => { m.style.zIndex = ''; this.closeModal(); o.skip(); }));
      else row.appendChild(this.button(d.owed ? '免做下一页数学题' : '下一局不用做题 ✓', 'sun small', () => { d.owed = false; Store.save(); this.toast('好的，下一局不用先做题'); }));
      row.appendChild(this.button('解锁全部关卡', 'ghost small', () => { d.open = LEVELS.length; Store.save(); this.toast(`${LEVELS.length} 关都打开了`); }));
      row.appendChild(this.button('清空进度', 'ghost small', () => {
        if (!confirm('清空关卡、星星、收集册和做题记录？')) return;
        const keep = { math: d.math, way: d.way, snd: d.snd, voi: d.voi, mus: d.mus };
        Store.d = Object.assign(Store.defaults(), keep); Store.save(); this.toast('已清空');
      }));
      card.appendChild(row);
      card.appendChild(el('p', null, '<span style="font-size:14px;opacity:.6">中文旁白由微软神经网络语音（edge-tts）预先录制。</span>'));
      const done = el('div', 'row done'); done.appendChild(this.button('完成', 'green', close)); card.appendChild(done);
    }, { close });
  },

  toast(text) {
    const t = $('#toast'); t.textContent = text;
    t.classList.add('on'); clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.remove('on'), 2600 + text.length * 120);
  },
};
