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

  // ---------- the level map ----------
  map() {
    Game.stop(); this.closeModal();
    const map = $('#map'); map.hidden = false; map.innerHTML = '';
    const d = Store.d;
    const top = el('div', 'top');
    const home = el('button', 'ibtn', '🏠'); home.title = '回思维小画本';
    home.onclick = () => { Snd.play('tap'); setTimeout(() => { location.href = '../'; }, 120); };
    top.appendChild(home);
    top.appendChild(el('h1', null, '动物消消乐'));
    const total = LEVELS.reduce((n, _, i) => n + (d.stars[i] || 0), 0);
    top.appendChild(el('div', 'pill', `⭐ ${total} / ${LEVELS.length * 3}`));
    const gear = el('button', 'ibtn', '⚙️'); gear.onclick = () => { Snd.play('tap'); this.parent({}); };
    top.appendChild(gear);
    map.appendChild(top);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.id = 'path';
    map.appendChild(svg);
    const nodes = LEVELS.map((lv, i) => {
      const n = el('button', 'node');
      const open = i < d.open, st = d.stars[i] || 0;
      if (!open) { n.classList.add('lock'); n.innerHTML = '🔒'; }
      else { n.textContent = i + 1; if (st) n.classList.add('done'); }
      if (open && i === d.open - 1 && !st) n.classList.add('cur');
      n.appendChild(el('span', 'st', open ? '⭐'.repeat(st) + '<span style="opacity:.3">' + '⭐'.repeat(3 - st) + '</span>' : ''));
      if (open) n.appendChild(el('span', 'nm', lv.name));
      n.onclick = () => {
        Snd.init(); Voice.unlock();
        if (!open) { Snd.play('bad'); Voice.say(L.locked); n.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 250); return; }
        Snd.play('select'); this.intro(i);
      };
      map.appendChild(n);
      return n;
    });
    const av = el('canvas', 'avatar'); av.width = av.height = 152;
    const head = Art.head(1, 152, 132); av.getContext('2d').drawImage(head, 0, 0);
    map.appendChild(av);
    const place = () => {
      const W = innerWidth, H = innerHeight, wide = W >= H;
      const cols = wide ? 5 : 3, rows = Math.ceil(LEVELS.length / cols);
      const topH = top.getBoundingClientRect().bottom + 40, bottom = 40;
      const x0 = W * (wide ? 0.12 : 0.17), x1 = W * (wide ? 0.88 : 0.83);
      const pts = LEVELS.map((_, i) => {
        const row = Math.floor(i / cols), k = i % cols, col = row % 2 ? cols - 1 - k : k;
        const y = topH + (H - bottom - topH) * (row + 0.5) / rows;
        return [x0 + (x1 - x0) * col / (cols - 1), y + Math.sin(i * 1.7) * 10];
      });
      const sz = clamp(Math.min(W / (cols * 2.4), (H - topH - bottom) / (rows * 1.9)), 64, 110);
      nodes.forEach((n, i) => {
        n.style.left = pts[i][0] + 'px'; n.style.top = pts[i][1] + 'px';
        n.style.width = n.style.height = sz + 'px'; n.style.margin = `${-sz / 2}px 0 0 ${-sz / 2}px`; n.style.fontSize = sz * 0.42 + 'px';
      });
      let dd = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[Math.max(0, i - 2)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(pts.length - 1, i + 1)];
        dd += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
      }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = `<path d="${dd}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="${sz * 0.42}" stroke-linecap="round"/>` +
        `<path d="${dd}" fill="none" stroke="#ffb3d6" stroke-width="${sz * 0.12}" stroke-dasharray="${sz * 0.05} ${sz * 0.28}" stroke-linecap="round"/>`;
      const cur = Math.min(d.open, LEVELS.length) - 1;
      av.style.left = pts[cur][0] + 'px'; av.style.top = pts[cur][1] + 'px';
      av.style.width = av.style.height = sz * 0.75 + 'px'; av.style.margin = `${-sz * 1.15}px 0 0 ${sz * 0.05}px`;
    };
    place();
    this._mapResize && removeEventListener('resize', this._mapResize);
    this._mapResize = () => { if (!map.hidden) place(); };
    addEventListener('resize', this._mapResize);
  },

  // ---------- before a level ----------
  intro(li) {
    const lv = LEVELS[li];
    this.modal(card => {
      card.appendChild(el('h2', null, `第 ${li + 1} 关`));
      card.appendChild(el('div', 'big', lv.name));
      // the moves and the goals as pictures, the same as the panels she will see while playing (the narrator says the rest)
      const goals = el('div', 'goals');
      goals.appendChild(el('div', 'moves', `<b>${lv.moves}</b><span>步</span>`));
      const probe = new Board(lv, mulberry32(1));
      probe.goals.forEach(g => { const d = el('div', 'goal'); d.appendChild(Art.goalIcon(g, 136)); d.appendChild(el('b', null, g.n)); goals.appendChild(d); });
      card.appendChild(goals);
      if (Store.d.best[li]) card.appendChild(el('p', 'best', `🏆 ${Store.d.best[li].toLocaleString('en-US')}`));
      const row = el('div', 'row');
      row.appendChild(this.button('🗺️', 'ghost', () => this.closeModal()));
      row.appendChild(Store.d.owed ? this.button('✏️ 先做数学题', 'sun', () => this.play(li)) : this.button('开始 ▶', 'green', () => this.play(li)));
      card.appendChild(row);
    }, { close: () => this.closeModal() });
    const line = L.intro(lv, li + 1);
    const tip = lv.tip && !Store.d.seen['tip_' + lv.tip] ? L.tip[lv.tip] : null;
    Voice.say(line, { onend: tip ? () => { if (!$('#modal').hidden) Voice.say(tip); } : null });
    if (tip) { Store.d.seen['tip_' + lv.tip] = 1; Store.save(); }
  },
  // start a level, through the math page when one is owed
  async play(li) {
    this.closeModal();
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
        if (last) card.appendChild(el('p', null, '🏆 十关全部通过啦！'));
        const row = el('div', 'row');
        row.appendChild(this.button('🗺️', 'ghost', () => this.map()));
        row.appendChild(this.button('↻ 再玩一次', 'violet', () => this.play(o.li)));
        if (!last) row.appendChild(this.button('下一关 ▶', 'green', () => this.play(o.li + 1)));
        card.appendChild(row);
        setTimeout(() => Voice.say(last ? L.allDone : L.stars[o.stars]), 1500);
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
      const seg = (title, key, opts) => {
        card.appendChild(el('h3', null, title));
        const s = el('div', 'seg');
        opts.forEach(([v, label]) => {
          const b = el('button', cfg[key] === v ? 'on' : '', label);
          b.onclick = () => { cfg[key] = v; $$('button', s).forEach(x => x.classList.toggle('on', x === b)); Store.save(); Snd.play('tap'); sample(); };
          s.appendChild(b);
        });
        card.appendChild(s);
      };
      card.appendChild(el('p', null, '<span style="font-size:17px">每玩完一局，再玩或进下一关之前，要先做一页数学题（20 道），全部做对才能接着玩。</span>'));
      seg('📏 数的范围', 'max', [[20, '20 以内'], [50, '50 以内'], [100, '100 以内']]);
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
      row.appendChild(this.button('解锁全部关卡', 'ghost small', () => { d.open = LEVELS.length; Store.save(); this.toast('10 关都打开了'); }));
      row.appendChild(this.button('清空进度', 'ghost small', () => {
        if (!confirm('清空关卡、星星和做题记录？')) return;
        const keep = { math: d.math, snd: d.snd, voi: d.voi, mus: d.mus };
        Store.d = Object.assign(Store.defaults(), keep); Store.save(); this.toast('已清空');
      }));
      card.appendChild(row);
      card.appendChild(el('p', null, '<span style="font-size:14px;opacity:.6">小动物头像来自 Kenney 的 Animal Pack（CC0 公共领域）；语音由微软神经网络语音（edge-tts）预先录制。</span>'));
      const done = el('div', 'row done'); done.appendChild(this.button('完成', 'green', close)); card.appendChild(done);
    }, { close });
  },

  toast(text) {
    const t = $('#toast'); t.textContent = text;
    t.classList.add('on'); clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.remove('on'), 2600 + text.length * 120);
  },
};
