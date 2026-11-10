// 动物消消乐 · the start screen (decli 2026-11-09: the old one was a few heads and a button on beige). It is the island the
// child is on: its map all round (s2/island-N-bg.webp), its floating picture in the middle bobbing, the companion
// (pal.js) standing on it, friends she has found floating about; the name in felt letters, the season's ribbon; under
// it where she is (the island and the level), her stars and her friends, and one big button to go on. While the
// pictures load the button's place shows a bar. The button is also what wakes up sound (browsers want a touch).
const Title = {
  // where she is: the island and the level she is up to
  where() {
    const d = Store.d, li = Math.min(d.open, LEVELS.length) - 1;
    const k = d.isle >= 0 && d.isle < ISLANDS.length ? d.isle : Math.max(0, isleOf(li));
    return { k, li };
  },
  // at once, before the pictures: the island's map and colours behind the name
  early() {
    const { k } = this.where(), isle = ISLANDS[k], bg = $('#loader .tBg');
    bg.style.background = `center/cover no-repeat url(s2/island-${k + 1}-bg.webp), linear-gradient(170deg,${isle.sky.join(',')})`;
  },
  // the pictures are in: the island, the companion, the friends, the chips and the button. go: what the button does
  ready(go) {
    const d = Store.d, { k, li } = this.where(), isle = ISLANDS[k], fresh = !d.played && d.open <= 1;
    const ld = $('#loader'), stage = $('.tStage', ld), foot = $('.tFoot', ld);
    // the island, floating
    const isl = el('div', 'tIsle');
    const pic = el('img'); pic.src = `s2/island-${k + 1}.webp`; pic.alt = ''; pic.onerror = () => pic.remove();
    isl.appendChild(pic);
    // the companion standing on it (its big fun face; the board face from the sheet until that has come)
    const pal = el('div', 'tPal'), pi = Pal.i(), ph = Art.friend(pi, 256, 236);
    ph.className = 'tPalFace'; pal.appendChild(ph);
    const big = el('img', 'tPalFace'); big.alt = ''; big.onload = () => { ph.replaceWith(big); }; big.src = `big/${FRIENDS[pi].id}.webp`;
    pal.appendChild(el('span', 'tBub', fresh ? '我们一起去冒险吧！' : '欢迎回来！'));
    isl.appendChild(pal);
    stage.appendChild(isl);
    // friends floating round it: ones she has found lately, else the first island's
    const found = FRIENDS.filter(f => f.tier >= 0 && Gift.owned(f.i) && f.i !== pi), start = FRIENDS.filter(f => f.tier < 0 && f.i !== pi);
    // (the companion stands on the island's lower left, so they keep to the top and the right)
    const crowd = found.slice(-5).concat(start).slice(0, 5);
    const spots = [[-0.6, -0.24, 0.9], [0.6, -0.22, 0.9], [0.84, 0.24, 0.75], [0.5, 0.58, 0.7], [-0.08, 0.7, 0.62]];
    crowd.forEach((f, n) => {
      const [x, y, s] = spots[n], c = el('div', 'tFriend');
      c.style.setProperty('--x', x); c.style.setProperty('--y', y); c.style.setProperty('--s', s); c.style.animationDelay = (-n * 0.7) + 's';
      const cv = Art.friend(f.i, 200, 184, Art.funs ? 'f' : 'b'); c.appendChild(cv);
      stage.appendChild(c);
    });
    // the chips: where she is, her stars, her friends
    let stars = 0; for (const i in d.stars) stars += d.stars[i] || 0;
    foot.innerHTML = '';
    const chips = el('div', 'tChips');
    chips.appendChild(el('div', 'tChip', `<img src="s2/island-${k + 1}.webp" alt=""><span><small>${isle.name}</small>第 ${li + 1} 关</span>`));
    if (!fresh) {
      chips.appendChild(el('div', 'tChip', `<i>⭐</i><span><small>星星</small>${stars}</span>`));
      chips.appendChild(el('div', 'tChip', `<i>🎁</i><span><small>小伙伴</small>${Gift.count()}/${FRIENDS.length}</span>`));
    }
    foot.appendChild(chips);
    const btn = el('button', 'tGo', fresh ? '开始冒险 ▶' : '继续冒险 ▶');
    btn.onclick = () => { ld.classList.add('leaving'); go(); };
    foot.appendChild(btn);
    ld.classList.add('ready');
    btn.focus({ preventScroll: true });
  },
};
