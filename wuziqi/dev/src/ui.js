// 五子棋 · the menu (who to play), a game (the board, the side panel, the computer's turn, 提醒, 💡, 悔棋) and its end
const UI = {
  mode: null,       // { opp } against the computer (me: the child's colour), or { pvp: true }
  pos: null, thinking: false, token: 0, warned: new Set(), recorded: false,

  // ---------- the menu ----------
  menu() {
    this.token++; this.thinking = false; Board.enabled = false;
    $('#play').hidden = true; $('#end').hidden = true;
    const m = $('#menu'); m.hidden = false; m.innerHTML = '';
    const top = el('div', 'top');
    top.appendChild(this.homeButton());
    top.appendChild(el('h1', null, '<i class="stone-b"></i>五子棋<i class="stone-w"></i>'));
    top.appendChild(this.soundButton());
    m.appendChild(top);
    const mid = el('div', 'mid'); m.appendChild(mid);
    mid.appendChild(el('p', 'sub', '谁先把五个棋子连成一条线，谁就赢'));
    mid.appendChild(el('h2', null, '和小伙伴下'));
    const opps = el('div', 'opps'), d = Store.d;
    // the next one to take on: the easiest not yet beaten twice
    const next = OPPS.find(o => Store.rec(o.id)[0] < 2);
    OPPS.forEach(o => {
      const r = Store.rec(o.id), b = el('button', 'opp' + (o === next && OPPS.some(q => Store.rec(q.id).some(Boolean)) ? ' next' : ''));
      b.innerHTML = `<img src="img/${o.id}.webp" alt=""><b>${o.name}</b><span class="lv">${'★'.repeat(o.level + 1)}<span style="opacity:.25">${'★'.repeat(3 - o.level)}</span></span><span class="tag">${o.tag}</span>`
        + `<span class="board">${o.size}×${o.size}</span>` + (r[0] ? `<span class="rec">赢 ${r[0]}</span>` : '');
      b.onclick = () => { Snd.init(); Snd.play('tap'); this.start({ opp: o }); };
      opps.appendChild(b);
    });
    mid.appendChild(opps);
    const row = el('div', 'rowx');
    const first = el('div', 'first');
    first.appendChild(el('span', null, '和小伙伴下时，谁先下？'));
    const seg = el('div', 'seg');
    [['me', '我先下 ⚫'], ['it', '它先下，我执白 ⚪']].forEach(([v, t]) => {
      const b = el('button', d.first === v ? 'on' : '', t);
      b.onclick = () => { Snd.init(); Snd.play('tap'); d.first = v; Store.save(); $$('button', seg).forEach(x => x.classList.toggle('on', x === b)); };
      seg.appendChild(b);
    });
    first.appendChild(seg);
    row.appendChild(first);
    const pvp = el('button', 'pvp', `<span class="st"><i class="stone-b"></i><i class="stone-w"></i></span><span><b>两个人下</b><small>和爸爸妈妈、小伙伴轮流下 · 15×15</small></span>`);
    pvp.onclick = () => { Snd.init(); Snd.play('tap'); this.start({ pvp: true }); };
    row.appendChild(pvp);
    mid.appendChild(row);
  },
  homeButton() {
    const b = el('button', 'ibtn', '🏠'); b.title = '回思维小画本'; b.setAttribute('aria-label', '回思维小画本');
    b.onclick = () => { Snd.init(); Snd.play('tap'); Voice.stop(); setTimeout(() => { location.href = '../'; }, 120); };
    return b;
  },
  soundButton() {
    const d = Store.d, b = el('button', 'ibtn' + (d.voi ? '' : ' off'), d.voi ? '🔊' : '🔇');
    b.title = '声音'; b.setAttribute('aria-label', '声音');
    b.onclick = () => {
      Snd.init(); d.voi = d.snd = !d.voi; Store.save();
      Voice.on = d.voi; Snd.setOn(d.snd); if (!d.voi) Voice.stop();
      b.textContent = d.voi ? '🔊' : '🔇'; b.classList.toggle('off', !d.voi);
    };
    return b;
  },

  // ---------- a game ----------
  start(mode) {
    this.token++;
    this.mode = mode; this.thinking = false; this.warned = new Set(); this.recorded = false;
    const size = mode.pvp ? 15 : mode.opp.size;
    if (mode.opp) mode.me = Store.d.first === 'it' ? 2 : 1;
    this.pos = new Gomoku.Pos(size);
    $('#menu').hidden = true; $('#end').hidden = true;
    const play = $('#play'); play.hidden = false;
    this.side();
    this.layout();
    Board.set(this.pos);
    Board.onPlace = i => this.human(i);
    if (mode.pvp) Voice.say(L.pvp);
    else {
      const o = mode.opp;
      Voice.say(L.intro[o.id], { onend: () => { if (this.mode === mode && this.pos.moves.length < 2) Voice.say(mode.me === 1 ? L.meFirst : L.itFirst[o.level]); } });
    }
    this.next();
  },
  layout() {
    const play = $('#play'), wide = innerWidth >= innerHeight * 1.05;
    play.className = wide ? 'wide' : 'tall';
    Board.layout();
  },
  side() {
    const s = $('#side'), mode = this.mode; s.innerHTML = '';
    if (mode.opp) {
      const o = mode.opp, who = el('div', 'card who');
      who.innerHTML = `<img src="img/${o.id}.webp" alt=""><div><b>${o.name}</b><small>${'★'.repeat(o.level + 1)}</small></div><span class="bub"></span>`;
      s.appendChild(who);
    }
    s.appendChild(el('div', 'card turn'));
    s.appendChild(el('div', 'card score'));
    const btns = el('div', 'btns');
    const b = (id, label, cls, fn) => { const x = el('button', 'btn ' + (cls || ''), label); x.id = id; x.onclick = () => { Snd.init(); fn(); }; btns.appendChild(x); return x; };
    b('bUndo', '↩️ 悔棋', '', () => this.undo());
    b('bHint', '💡 支一招', 'go', () => this.hint());
    b('bRemind', '🔔 提醒', Store.d.remind ? 'on' : '', () => {
      Store.d.remind = !Store.d.remind; Store.save(); Snd.play('tap');
      $('#bRemind').classList.toggle('on', Store.d.remind); this.toast(Store.d.remind ? '提醒打开了：快要连成五个时会亮红圈' : '提醒关掉了');
      this.danger(true);
    });
    b('bAgain', '🔄 重来', '', () => { Snd.play('tap'); Voice.stop(); this.start(this.mode); });
    s.appendChild(btns);
    const icons = el('div', 'icons');
    const back = el('button', 'ibtn', '⬅️'); back.title = '换个对手'; back.setAttribute('aria-label', '换个对手');
    back.onclick = () => { Snd.init(); Snd.play('tap'); Voice.stop(); this.menu(); };
    icons.appendChild(back); icons.appendChild(this.soundButton()); icons.appendChild(this.homeButton());
    s.appendChild(icons);
  },
  // the side panel says whose turn it is and the score
  paint() {
    const p = this.pos, m = this.mode, turn = $('#side .turn'), score = $('#side .score');
    if (!turn) return;
    const stone = c => `<i class="${c === 1 ? 'stone-b' : 'stone-w'}"></i>`;
    if (m.opp) {
      const mine = p.turn === m.me;
      turn.className = 'card turn' + (mine && !p.winner ? ' me' : '');
      turn.innerHTML = p.winner ? (p.winner === 3 ? '🤝 平局' : p.winner === m.me ? '🎉 你赢啦' : `${m.opp.name}赢了`) : mine ? `${stone(m.me)}轮到你啦` : `${stone(3 - m.me)}${m.opp.name}在想…`;
      const r = Store.rec(m.opp.id);
      score.innerHTML = `<span>${stone(m.me)}你 ${r[0]}</span><span>:</span><span>${r[1]} ${m.opp.name}</span>`;
    } else {
      turn.className = 'card turn' + (p.winner ? '' : ' me');
      turn.innerHTML = p.winner ? (p.winner === 3 ? '🤝 平局' : `${stone(p.winner)}${STONE[p.winner]}赢啦`) : `${stone(p.turn)}轮到${STONE[p.turn]}`;
      const r = Store.d.pvp;
      score.innerHTML = `<span>${stone(1)}${r[0]}</span><span>:</span><span>${r[1]}${stone(2)}</span>`;
    }
    const busy = this.thinking || !!p.winner;
    $('#bHint').disabled = busy;
    $('#bUndo').disabled = this.thinking || !this.canUndo();
  },
  bubble(emo, ms = 1600) {
    const b = $('#side .bub'); if (!b) return;
    b.textContent = emo; b.classList.toggle('on', !!emo);
    clearTimeout(this._bub); if (emo && ms) this._bub = setTimeout(() => b.classList.remove('on'), ms);
  },
  face(cls) {
    const im = $('#side .who img'); if (!im) return;
    im.classList.remove('think', 'hop'); if (cls) { void im.offsetWidth; im.classList.add(cls); }
  },
  // whose move it is now
  next() {
    const p = this.pos, m = this.mode;
    this.paint();
    if (p.winner) return this.end();
    if (m.opp && p.turn !== m.me) { Board.enabled = false; this.computer(); return; }
    Board.enabled = true;
    this.danger();
  },
  human(i) {
    const p = this.pos, c = p.turn, d = Gomoku.dangers(p);
    if (!p.play(i)) return;
    Snd.stone(c); Board.dropped(i); Board.hintAt = -1; Board.urgent = []; Board.soon = [];
    // blocking what was about to win is worth a word (only the first time for each threat)
    if (!p.winner && (d.urgent.includes(i) || (d.soon.includes(i) && d.soon.length <= 2))) {
      Snd.play('good'); Voice.say(pick(L.blocked));
      if (this.mode.opp) this.bubble('😮');
    }
    this.next();
  },
  async computer() {
    const tok = this.token, p = this.pos, o = this.mode.opp;
    this.thinking = true; this.paint(); this.face('think'); this.bubble('🤔', 0);
    await wait(o.level === 3 ? 250 : 450 + Math.random() * 350);
    if (tok !== this.token) return;
    const i = Gomoku.move(p, o.level, 900);
    await wait(80);
    if (tok !== this.token) return;
    this.thinking = false; this.face(); this.bubble('');
    p.play(i); Snd.stone(3 - p.turn); Board.dropped(i);
    if (!p.winner && p.fives(3 - this.mode.me).length) this.bubble('😏');
    this.next();
  },
  // 提醒: rings on the cells to block (red: it makes five next move; orange: one move from two ways to make five)
  danger(quiet) {
    const p = this.pos;
    if (!Store.d.remind || p.winner) { Board.urgent = []; Board.soon = []; return; }
    const d = Gomoku.dangers(p);
    Board.urgent = d.urgent; Board.soon = d.soon.slice(0, 4);
    if (quiet) return;
    const key = (d.urgent.length ? 'u' : 's') + [...d.urgent, ...d.soon].sort().join(',');
    if ((d.urgent.length || d.soon.length) && !this.warned.has(key)) {
      this.warned.add(key);
      Snd.play('warn');
      const them = 3 - p.turn;
      if (this.mode.pvp) Voice.say(d.urgent.length ? L.pvpUrgent[them - 1] : L.pvpSoon[them - 1]);
      else Voice.say(d.urgent.length ? L.urgent : L.soon);
    }
  },
  hint() {
    const p = this.pos;
    if (this.thinking || p.winner) return;
    const i = Gomoku.hint(p);
    Board.hintAt = i; Board.hintUntil = performance.now() + 4000;
    Snd.play('hint'); Voice.say(L.hint);
  },
  canUndo() {
    const p = this.pos, m = this.mode;
    if (m.pvp) return p.moves.length > 0;
    // the child's own last move must be there to take back (the computer's first move stays)
    return p.moves.length > (m.me === 2 ? 1 : 0);
  },
  undo() {
    const p = this.pos, m = this.mode;
    if (this.thinking || !this.canUndo()) return;
    this.token++;
    p.undo();
    if (m.opp && p.turn !== m.me) p.undo();   // the computer's reply and the child's move
    $('#end').hidden = true;
    Board.dropAt = -1; Board.hintAt = -1; Board.winT = 0;
    Snd.play('undo'); Voice.say(L.undo);
    this.warned = new Set();
    this.next();
  },
  // ---------- the end of a game ----------
  end() {
    const p = this.pos, m = this.mode, w = p.winner;
    Board.enabled = false; Board.urgent = []; Board.soon = []; Board.win();
    let title, line, img = m.opp ? `img/${m.opp.id}.webp` : null, won = false;
    if (m.opp) {
      const r = Store.rec(m.opp.id);
      won = w === m.me;
      if (!this.recorded) { r[w === 3 ? 2 : won ? 0 : 1]++; this.recorded = true; Store.save(); }
      title = w === 3 ? '平局！' : won ? '你赢啦！' : `${m.opp.name}赢了`;
      const nextOpp = OPPS[m.opp.level + 1];
      line = w === 3 ? L.draw : won ? (nextOpp && r[0] >= 2 ? L.winNext[m.opp.level] : L.win) : L.lose[m.opp.level];
      if (won) { this.face('hop'); this.bubble('😵', 2500); } else if (w !== 3) { this.face('hop'); this.bubble('😄', 2500); }
    } else {
      if (!this.recorded) { Store.d.pvp[w === 3 ? 2 : w - 1]++; this.recorded = true; Store.save(); }
      title = w === 3 ? '平局！' : `${STONE[w]}赢啦！`;
      line = w === 3 ? L.draw : L.pvpWin[w - 1];
      won = w !== 3;
    }
    this.paint();
    Snd.play(won ? 'win' : 'lose'); if (won) Fx.confetti();
    Voice.say(line);
    const tok = this.token;
    setTimeout(() => {
      if (tok !== this.token) return;
      const e = $('#end'); e.hidden = false; e.innerHTML = '';
      const box = el('div', 'box');
      if (img) box.appendChild(el('img', null)).src = img;
      else box.appendChild(el('div', null, `<span style="font-size:90px">${w === 3 ? '🤝' : '🏆'}</span>`));
      box.appendChild(el('h2', null, title));
      const r = m.opp ? Store.rec(m.opp.id) : Store.d.pvp;
      box.appendChild(el('p', null, m.opp ? `和${m.opp.name}：赢 ${r[0]} 局，输 ${r[1]} 局${r[2] ? `，平 ${r[2]} 局` : ''}` : `黑棋赢 ${r[0]} 局，白棋赢 ${r[1]} 局${r[2] ? `，平 ${r[2]} 局` : ''}`));
      const row = el('div', 'row');
      const btn = (t, cls, fn) => { const x = el('button', 'btn ' + cls, t); x.onclick = () => { Snd.init(); Snd.play('tap'); fn(); }; row.appendChild(x); };
      btn('🔄 再来一局', 'go', () => this.start(this.mode));
      if (m.opp && !won && w !== 3) btn('↩️ 退回去看看', '', () => this.undo());
      btn('👀 看看棋盘', '', () => { e.hidden = true; });
      btn('⬅️ 换个对手', 'green', () => this.menu());
      box.appendChild(row);
      e.appendChild(box);
    }, 1400);
  },
  toast(t) {
    const n = $('#toast'); n.textContent = t; n.classList.add('on');
    clearTimeout(this._t); this._t = setTimeout(() => n.classList.remove('on'), 2400);
  },
};
