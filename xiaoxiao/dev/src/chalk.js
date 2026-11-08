// 动物消消乐 · 小黑板 (decli 2026-11-08: big numbers are still hard for her, so every sum gets a little blackboard).
// It writes the sum as 列竖式 — the numbers in columns under 百 十 个, the sign, the line, room underneath — and gives the
// textbook's rule for it, on the board and read out (人教版二年级上册「笔算加法」「笔算减法」):
//   加法：相同数位对齐，从个位加起，个位满十，向十位进 1。
//   减法：相同数位对齐，从个位减起，个位不够减，从十位退 1，在个位上加 10 再减。
// It never shows the answer and never says whether this sum needs a carry (进位) or a borrow (退位): she works it out
// herself, may write on the board with a finger (chalk; 擦一擦 wipes it), and writes the answer with the pad as usual,
// which the board shows at the top as she types. A sum of three or four numbers goes in steps (第 1 步, 第 2 步 …), each
// a 竖式 whose top number is the last step's answer, an empty box for her to fill in her head.
const Chalk = {
  on: false, q: null, step: 0, root: null, opt: null, ink: null,
  // the steps of a sum: [top number or null (the last step's answer), the sign, the number under it]
  steps(q) { return q.signs.map((s, k) => [k ? null : q.nums[0], s, q.nums[k + 1]]); },
  open(q, host, o = {}) {
    if (this.on) this.close(true);
    this.on = true; this.q = q; this.step = 0; this.opt = o;
    const r = this.root = el('div', 'chalk');
    const head = el('div', 'chead');
    head.appendChild(el('span', 'ctitle', '小黑板'));
    const eq = el('span', 'ceq', `${MathGate.html(q)} = <b class="cgot"></b>`); head.appendChild(eq);
    const again = el('button', 'ibtn', '🔊'); again.setAttribute('aria-label', '再听一遍规则');
    again.onclick = () => { Snd.play('tap'); this.say(); };
    const shut = el('button', 'ibtn', '✕'); shut.setAttribute('aria-label', '收起小黑板');
    shut.onclick = () => { Snd.play('tap'); this.close(); };
    head.appendChild(again); head.appendChild(shut);
    r.appendChild(head);
    const body = el('div', 'cbody'); r.appendChild(body);
    host.appendChild(r);
    this.render();
    this.sync(q.got);
    if (!Store.d.seen.chalk) { Store.d.seen.chalk = 1; Store.save(); this.tipLater = true; }
    this.say(true);
  },
  close(quiet) {
    if (!this.on) return;
    this.on = false;
    if (this.root) { const r = this.root; this.root = null; r.classList.add('bye'); setTimeout(() => r.remove(), 220); }
    removeEventListener('resize', this._fit);
    if (!quiet) Voice.stop();
    const o = this.opt; this.opt = null;
    if (o && o.close) o.close();
  },
  // her answer as she types it, at the top of the board
  sync(got) { const b = this.root && this.root.querySelector('.cgot'); if (b) b.textContent = got || '?'; },
  // the rule for this step, read out (a sum in steps says so first; the first board ever also says she may write on it)
  say(first) {
    const q = this.q, [top, sign] = this.steps(q)[this.step], lines = [];
    if (first && q.signs.length > 1) lines.push(L.chalk.steps);
    lines.push(sign === '+' ? L.chalk.add : L.chalk.sub);
    if (sign === '-' && top >= 100) lines.push(L.chalk.sub100);
    if (first && this.tipLater) { this.tipLater = false; lines.push(L.chalk.draw); }
    const next = () => { const t = lines.shift(); if (t && this.on && this.q === q) Voice.say(t, { onend: next }); };
    next();
  },
  render() {
    const q = this.q, body = this.root.querySelector('.cbody'), all = this.steps(q), [top, sign, low] = all[this.step];
    body.innerHTML = '';
    const board = el('div', 'cboard');
    if (all.length > 1) {   // 第 1 步, 第 2 步 …
      const tabs = el('div', 'csteps');
      all.forEach((s, k) => {
        const b = el('button', k === this.step ? 'on' : '', `第 ${k + 1} 步`);
        b.onclick = () => { if (k === this.step) return; Snd.play('tap'); this.step = k; this.render(); this.say(); };
        tabs.appendChild(b);
      });
      board.appendChild(tabs);
    }
    const slate = el('div', 'cslate');
    // the columns: 百 only when a number has three digits; an unknown top number is taken as two
    const nc = Math.max(2, String(low).length, top == null ? 2 : String(top).length), names = ['个', '十', '百'];
    const v = el('div', 'cvert');
    v.style.gridTemplateColumns = `1.1em repeat(${nc}, 1em)`;
    const cell = (t, cls) => { const e = el('span', cls, t == null ? '' : String(t)); v.appendChild(e); return e; };
    const digits = n => { const s = String(n); return Array.from({ length: nc }, (_, k) => { const i = s.length - nc + k; return i >= 0 ? s[i] : ''; }); };
    // the column names
    cell('', 'lab'); for (let k = nc - 1; k >= 0; k--) cell(names[k], 'lab');
    // subtraction: where the 退位点 goes, above the top number's tens (and hundreds)
    if (sign === '-') { cell('退位点', 'mark'); for (let k = nc - 1; k >= 0; k--) cell('', k ? 'dot' : ''); }
    // the top number, or the box for the last step's answer
    cell('', '');
    if (top == null) { const b = cell('', 'prev'); b.style.gridColumn = `2 / span ${nc}`; b.innerHTML = '<i>上一步的得数</i>'; }
    else digits(top).forEach(d => cell(d, 'dg'));
    // the sign and the number under it
    cell(sign === '+' ? '+' : '−', 'op');
    digits(low).forEach(d => cell(d, 'dg'));
    // addition: where the little carried 1 goes, just above the line in the tens (and hundreds)
    if (sign === '+') { cell('进位', 'mark'); for (let k = nc - 1; k >= 0; k--) cell('', k ? 'carry' : ''); }
    const line = cell('', 'line'); line.style.gridColumn = `1 / span ${nc + 1}`;
    // room for her answer: nothing written, never the answer
    cell('', ''); for (let k = 0; k < nc; k++) cell('', 'room');
    slate.appendChild(v);
    // chalk: she can write on the board with a finger
    const cv = el('canvas', 'cink'); slate.appendChild(cv);
    board.appendChild(slate);
    const wipe = el('button', 'cwipe', '🧽 擦一擦'); wipe.onclick = () => { Snd.play('tap'); this.wipe(); };
    board.appendChild(wipe);
    body.appendChild(board);
    // the rule, written out (the narrator reads it)
    const rules = el('ol', 'crules'), max = Store.d.math.max || 100, R = [];
    if (all.length > 1) R.push(['先算第 1 步，得数记在心里（或写在黑板上），再放进下一步的方框里接着算。', 'step']);
    R.push(['相同数位对齐：个位对个位，十位对十位。', '']);
    if (sign === '+') {
      R.push(['从个位加起。', '']);
      R.push(['个位满十，向十位进 1：在十位上写个小小的 1，十位相加时别忘了加上它。', 'hl']);
      if (max >= 100) R.push(['十位满十，就向百位进 1。', '']);
    } else {
      R.push(['从个位减起。', '']);
      R.push(['个位不够减，从十位退 1，在个位上加 10 再减：十位上点一个退位点，十位相减时要先减去这个 1。', 'hl']);
      if (top != null && top >= 100) R.push(['十位上是 0 不够退，就先从百位退 1，变成 10 个十。', 'hl']);
    }
    R.forEach(([t, c]) => rules.appendChild(el('li', c, t)));
    body.appendChild(rules);
    this.ink = cv;
    this._fit = () => this.fit();
    addEventListener('resize', this._fit);
    requestAnimationFrame(() => this.fit());
    this.draws(cv);
  },
  // the 竖式 as big as the slate allows; the chalk canvas over the whole slate
  fit() {
    if (!this.root) return;
    const s = this.root.querySelector('.cslate'), v = this.root.querySelector('.cvert'), cv = this.ink;
    if (!s || !v) return;
    v.style.fontSize = '100px';
    const k = Math.min((s.clientWidth * 0.86) / v.scrollWidth, (s.clientHeight * 0.9) / v.scrollHeight);
    v.style.fontSize = Math.max(26, Math.min(140, 100 * k)) + 'px';
    const dpr = Math.min(devicePixelRatio || 1, 2), w = s.clientWidth, h = s.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + 'px'; cv.style.height = h + 'px';
    }
  },
  // writing with chalk: a soft, slightly broken white line
  draws(cv) {
    let last = null;
    const at = e => { const r = cv.getBoundingClientRect(), d = cv.width / r.width; return [(e.clientX - r.left) * d, (e.clientY - r.top) * d]; };
    cv.addEventListener('pointerdown', e => { e.preventDefault(); cv.setPointerCapture(e.pointerId); last = at(e); this.dab(last, last); });
    cv.addEventListener('pointermove', e => { if (!last) return; const p = at(e); this.dab(last, p); last = p; });
    const up = () => { last = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  },
  dab(a, b) {
    const x = this.ink.getContext('2d'), w = Math.max(3, this.ink.width * 0.011);
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = 'rgba(255,255,250,.88)'; x.lineWidth = w;
    x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
    // a few specks along the stroke, the grain of chalk
    x.fillStyle = 'rgba(255,255,250,.35)';
    for (let k = 0; k < 3; k++) { const t = Math.random(); x.fillRect(a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * w * 1.6, a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * w * 1.6, 1.5, 1.5); }
  },
  wipe() { const x = this.ink.getContext('2d'); x.clearRect(0, 0, this.ink.width, this.ink.height); },
  // a blackboard drawn small, for the button on each sum
  icon: '<svg viewBox="0 0 40 32" aria-hidden="true"><rect x="1" y="1" width="38" height="26" rx="4" fill="#b98a55"/><rect x="4" y="4" width="32" height="20" rx="2" fill="#2f5d46"/>'
    + '<path d="M12 9v8M8 13h8M22 10h8M22 16h8" stroke="#f3f1e6" stroke-width="2.2" stroke-linecap="round"/><path d="M14 27l-3 4M26 27l3 4" stroke="#8a6436" stroke-width="2.5" stroke-linecap="round"/></svg>',
};
