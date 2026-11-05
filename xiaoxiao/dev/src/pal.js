// 动物消消乐 · 伙伴 (decli 2026-11-05, from her 怪趣森林 style sketch): one of the twelve partners — the characters
// decli drew with four faces (PALS in lines.js, HEADS.pals) — keeps the child company. It sits at the top of the side
// panel while they play and reacts with its faces: listening (the board face), leaning in when a piece is picked up
// (tap), cheering big moves and wins (fun), and encouraging when the moves run low, the 小帮手 comes or a game is lost
// (cheer). It also stands for the child on the map and in the middle of the wheel. The child picks it in the album,
// from the partners they have; the panda keeps them company until then.
const Pal = {
  root: null, cv: null, bub: null, face: 'b', timer: 0,
  id() { const id = Store.d.pal; return id && PALS.includes(id) && Gift.owned(Art.byId(id)) ? id : 'panda'; },
  i() { return Art.byId(this.id()); },
  // the companion's panel, first in the HUD
  mount(parent) {
    const p = el('div', 'panel pal'), cv = this.cv = el('canvas'), bub = this.bub = el('span', 'bub');
    p.appendChild(cv); p.appendChild(bub); parent.appendChild(p);
    p.onclick = () => { Snd.play('tap'); this.react('tap'); Voice.say(L.gift.who[this.i()]); };
    clearTimeout(this.timer);
    this.root = p; this.face = 'b';
    requestAnimationFrame(() => this.draw());
    return p;
  },
  draw() {
    if (!this.cv || !this.root.isConnected) return;
    const r = this.cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2), s = Math.max(48, Math.round(Math.max(r.width, r.height) * dpr * 1.5));
    if (this.cv.width !== s) this.cv.width = this.cv.height = s;
    const x = this.cv.getContext('2d'); x.clearRect(0, 0, s, s);
    Art.friendTo(x, this.i(), s / 2, s / 2, s * 0.92, this.face);
  },
  // a face for a while (ms, or its own time), with a little bubble, then back to listening
  react(kind, ms) {
    if (!this.root || !this.root.isConnected) return;
    const [face, t, emo] = { tap: ['t', 1300, '👀'], joy: ['f', 2200, '🎉'], cheer: ['c', 2800, '💪'] }[kind];
    if (kind === 'tap' && this.face !== 'b' && this.face !== 't') return;   // a cheer is not cut short by a tap
    this.face = face; this.draw();
    if (kind !== 'tap') {
      this.root.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-8px) scale(1.06)' }, { transform: 'translateY(0) scale(1)' }], { duration: 420, easing: 'ease-out' });
      this.bub.textContent = emo; this.bub.classList.remove('on'); void this.bub.offsetWidth; this.bub.classList.add('on');
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.face = 'b'; this.draw(); this.bub.classList.remove('on'); }, Math.min(ms || t, 2e9));
  },
  // from the album: the new companion
  choose(id) {
    Store.d.pal = id; Store.save();
    Voice.say(L.pal.chosen[id]);
  },
};
