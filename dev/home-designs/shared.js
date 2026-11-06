// 思维小画本 · the home page redesign proposals (decli 2026-11-06): what all three show — the twelve games in five
// groups, a sample day's progress, and one set of drawn icons (placeholders for decli's pictures, see PROMPTS.md).
// The figures are a sample of one child's progress, close to decli's screenshot of the live page.
const PAL = { ink: '#2B2A33', cream: '#FFF9EE', red: '#EF5B47', orange: '#F59A3B', yellow: '#F7C948', green: '#56B26A', teal: '#2FB5A7', blue: '#3F86E0', purple: '#8C6BE0', pink: '#EE7FA6', brown: '#B07A4F', wood: '#E9C38A' };

// five groups, by what they train (the order the home page lists them)
const GROUPS = [
  { id: 'num', name: '数一数', en: 'Numbers', color: '#3F86E0', soft: '#DCEAFB' },
  { id: 'eye', name: '看一看', en: 'Attention', color: '#2FB5A7', soft: '#D5F1EC' },
  { id: 'space', name: '转一转', en: 'Space', color: '#F59A3B', soft: '#FDE6CC' },
  { id: 'art', name: '念一念 · 弹一弹', en: 'Words & Music', color: '#8C6BE0', soft: '#E8E0FA' },
  { id: 'play', name: '玩一玩', en: 'Play', color: '#EF5B47', soft: '#FBDCD6' },
];
// kind: 'lv' levels passed of all, 'star' stars of all, 'free' no levels, 'win' games won
const GAMES = [
  { id: 'dots', name: '数点点', g: 'num', color: '#EF5B47', tip: '看点点，凑出要的数', p: { kind: 'lv', v: 2, of: 5 } },
  { id: 'bond', name: '凑数字', g: 'num', color: '#56B26A', tip: '把一个数分成两份', p: { kind: 'lv', v: 1, of: 5 } },
  { id: 'schulte', name: '找数字', g: 'eye', color: '#3F86E0', tip: '按顺序把数字找出来', p: { kind: 'lv', v: 3, of: 5 } },
  { id: 'pattern', name: '找规律', g: 'eye', color: '#8C6BE0', tip: '问号里该放哪一个', p: { kind: 'lv', v: 1, of: 11 } },
  { id: 'span', name: '记住亮过的', g: 'eye', color: '#2FB5A7', tip: '照原样点一遍', p: { kind: 'lv', v: 4, of: 5, best: '0:24' } },
  { id: 'mirror', name: '照镜子', g: 'space', color: '#EE7FA6', tip: '认识对称，看懂翻过来', p: { kind: 'lv', v: 1, of: 8 } },
  { id: 'fit', name: '方块拼拼', g: 'space', color: '#3F86E0', tip: '先看形状，再玩掉下来的', p: { kind: 'lv', v: 1, of: 7 } },
  { id: 'mofang', name: '魔方世界', g: 'space', color: '#F59A3B', tip: '转积木、玩魔方、搭城堡', p: { kind: 'star', v: 0, of: 93 } },
  { id: 'shi', name: '古诗小剧场', g: 'art', color: '#8C6BE0', tip: '听故事，一首一首背下来', p: { kind: 'star', v: 0, of: 192 } },
  { id: 'piano', name: '彩虹钢琴', g: 'art', color: '#F7C948', tip: '七个音，弹出一道彩虹', p: { kind: 'free', label: '弹一弹' } },
  { id: 'xiaoxiao', name: '动物消消乐', g: 'play', color: '#2FB5A7', tip: '三个连成一排就消掉', p: { kind: 'star', v: 4, of: 30 } },
  { id: 'wuziqi', name: '五子棋', g: 'play', color: '#EF5B47', tip: '五个连成一线就赢', p: { kind: 'win', v: 4 } },
];
const TODAY = { done: 2, goal: 6, stars: 9, stickers: 5, stickersOf: 16, last: 'xiaoxiao' };
const byId = id => GAMES.find(g => g.id === id);
const groupOf = g => GROUPS.find(x => x.id === g.g);
// one line of progress, short enough for a child's card
function progText(g) {
  const p = g.p;
  if (p.kind === 'lv') return `${p.v}/${p.of} 关`;
  if (p.kind === 'star') return `${p.v}/${p.of} 星`;
  if (p.kind === 'win') return `赢 ${p.v} 局`;
  return p.label;
}
function progFrac(g) { const p = g.p; return p.kind === 'lv' || p.kind === 'star' ? p.v / p.of : p.kind === 'win' ? Math.min(1, p.v / 10) : 0; }

// ---------- the icons: flat cut shapes, one look for all twelve (viewBox 120) ----------
const I = {
  rr: (x, y, w, h, r, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${extra}/>`,
  c: (x, y, r, f, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${extra}/>`,
  t: (x, y, s, f, txt, w = 900) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${f}" text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2','Arial Rounded MT Bold',system-ui,sans-serif">${txt}</text>`,
};
function cube() {
  const faces = [[[60, 14], [36, 21], [-36, 21], 'yyyyyryyw'], [[24, 35], [36, 21], [0, 42], 'gggyggggg'], [[60, 56], [36, -21], [0, 42], 'bbbbbbgbb']];
  const C = { y: '#F7C948', g: '#56B26A', b: '#3F86E0', r: '#EF5B47', w: '#FFFFFF' };
  let out = '';
  faces.forEach(f => {
    for (let k = 0; k < 9; k++) {
      const i = k % 3, j = Math.floor(k / 3);
      const pts = [[i + .12, j + .12], [i + .88, j + .12], [i + .88, j + .88], [i + .12, j + .88]].map(q => (f[0][0] + (q[0] * f[1][0] + q[1] * f[2][0]) / 3).toFixed(1) + ',' + (f[0][1] + (q[0] * f[1][1] + q[1] * f[2][1]) / 3).toFixed(1));
      out += `<polygon points="${pts.join(' ')}" fill="${C[f[3][k]]}" stroke="${C[f[3][k]]}" stroke-width="2" stroke-linejoin="round"/>`;
    }
  });
  return `<polygon points="60,8 101,32 101,80 60,104 19,80 19,32" fill="#2B2A33" stroke="#2B2A33" stroke-width="8" stroke-linejoin="round"/>` + out;
}
function panda(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">${I.c(-9, -10, 5.5, PAL.ink)}${I.c(9, -10, 5.5, PAL.ink)}${I.c(0, 0, 13, '#fff')}`
    + `<ellipse cx="-5" cy="-1" rx="4" ry="5" fill="${PAL.ink}" transform="rotate(-20 -5 -1)"/><ellipse cx="5" cy="-1" rx="4" ry="5" fill="${PAL.ink}" transform="rotate(20 5 -1)"/>`
    + `${I.c(-4.5, -1.5, 1.4, '#fff')}${I.c(4.5, -1.5, 1.4, '#fff')}<ellipse cx="0" cy="5" rx="2.6" ry="1.8" fill="${PAL.ink}"/></g>`;
}
function sparkle(x, y, s, f) { return `<path transform="translate(${x} ${y}) scale(${s})" d="M0,-10 C1.5,-2 2,-1.5 10,0 C2,1.5 1.5,2 0,10 C-1.5,2 -2,1.5 -10,0 C-2,-1.5 -1.5,-2 0,-10Z" fill="${f}"/>`; }
const ICONS = {
  schulte: () => I.rr(14, 14, 92, 92, 22, PAL.blue) + I.rr(14, 14, 92, 46, 22, '#fff', 'opacity=".12"')
    + [[24, 24, '1', PAL.yellow], [62, 24, '2', '#fff'], [24, 62, '3', '#fff'], [62, 62, '4', '#fff']].map(([x, y, n, f]) => I.rr(x, y, 34, 34, 9, f) + I.t(x + 17, y + 18, 22, PAL.ink, n)).join('')
    + `<circle cx="84" cy="84" r="15" fill="rgba(255,255,255,.35)" stroke="${PAL.ink}" stroke-width="6"/><path d="M95 95 L107 107" stroke="${PAL.ink}" stroke-width="9" stroke-linecap="round"/>`,
  dots: () => `<g transform="rotate(14 80 46)">${I.rr(54, 20, 52, 52, 13, PAL.red)}${I.c(68, 34, 5, '#fff')}${I.c(92, 58, 5, '#fff')}</g>`
    + `<g transform="rotate(-8 46 76)">${I.rr(14, 44, 64, 64, 15, '#fff')}${I.rr(14, 96, 64, 12, 6, '#000', 'opacity=".08"')}`
    + [[30, 60], [62, 60], [46, 76], [30, 92], [62, 92]].map(([x, y]) => I.c(x, y, 6.5, PAL.red)).join('') + '</g>',
  bond: () => `<path d="M60 40 L32 84 M60 40 L88 84" stroke="#3B8F4E" stroke-width="7" stroke-linecap="round"/>`
    + `<ellipse cx="71" cy="15" rx="9" ry="5" fill="#2E8B57" transform="rotate(-30 71 15)"/>` + I.c(60, 38, 23, PAL.green) + I.t(60, 39, 24, '#fff', '10')
    + I.c(32, 86, 19, '#fff', `stroke="${PAL.green}" stroke-width="6"`) + I.t(32, 87, 21, PAL.ink, '6') + I.c(88, 86, 19, '#fff', `stroke="${PAL.green}" stroke-width="6"`) + I.t(88, 87, 21, PAL.ink, '4'),
  shi: () => I.rr(12, 14, 96, 92, 16, PAL.purple) + I.rr(22, 28, 76, 62, 8, '#2E2350')
    + `<polygon points="22,90 46,62 62,78 76,66 98,90" fill="#4B3F86"/>` + I.c(72, 46, 11, PAL.yellow) + I.c(77, 42, 10, '#2E2350')
    + sparkle(42, 42, 0.45, '#fff') + sparkle(56, 34, 0.3, '#fff')
    + `<path d="M22 28 H44 C40 50 32 70 22 90 Z" fill="${PAL.red}"/><path d="M98 28 H76 C80 50 88 70 98 90 Z" fill="${PAL.red}"/>`
    + I.rr(16, 18, 88, 14, 7, '#D9443A') + [26, 40, 54, 68, 82, 96].map(x => I.c(x, 32, 6, '#D9443A')).join('') + I.rr(12, 92, 96, 14, 7, PAL.brown),
  mirror: () => `<path d="M60 12 V108" stroke="${PAL.ink}" stroke-opacity=".3" stroke-width="3" stroke-dasharray="6 5"/>`
    + `<path d="M57 56 C40 18 10 24 16 52 C20 66 42 66 57 60 Z" fill="${PAL.pink}"/><path d="M57 63 C40 65 22 78 30 94 C38 104 54 90 57 68 Z" fill="#F4A7C2"/>`
    + `<g transform="translate(120 0) scale(-1 1)" fill="none" stroke="${PAL.pink}" stroke-width="4" stroke-dasharray="6 5" stroke-linejoin="round"><path d="M57 56 C40 18 10 24 16 52 C20 66 42 66 57 60 Z"/><path d="M57 63 C40 65 22 78 30 94 C38 104 54 90 57 68 Z"/></g>`
    + I.rr(56, 46, 8, 44, 4, PAL.ink) + `<path d="M58 47 C54 36 50 32 46 30 M62 47 C66 36 70 32 74 30" stroke="${PAL.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  mofang: () => cube(),
  xiaoxiao: () => `<rect x="10" y="44" width="100" height="40" rx="20" fill="${PAL.yellow}" opacity=".55"/>`
    + [[14, PAL.teal], [44, PAL.teal], [74, PAL.teal]].map(([x, f]) => I.rr(x, 46, 32, 36, 10, f)).join('')
    + panda(30, 66, 0.95) + panda(60, 66, 0.95) + panda(90, 66, 0.95) + sparkle(98, 28, 1, PAL.yellow) + sparkle(20, 30, 0.6, PAL.orange),
  piano: () => I.rr(12, 32, 96, 64, 12, PAL.ink)
    + ['#EF5B47', '#F59A3B', '#F7C948', '#56B26A', '#2FB5A7', '#3F86E0', '#8C6BE0'].map((f, k) => I.rr(19 + k * 12.3, 40, 11, 50, 3, '#fff') + I.rr(19 + k * 12.3, 78, 11, 12, 3, f)).join('')
    + [0, 1, 3, 4, 5].map(k => I.rr(26.5 + k * 12.3, 40, 7, 26, 2, PAL.ink)).join('')
    + `<path d="M92 10 V30" stroke="${PAL.yellow}" stroke-width="5" stroke-linecap="round"/><path d="M92 10 C98 12 104 14 104 22" stroke="${PAL.yellow}" stroke-width="5" fill="none" stroke-linecap="round"/>` + I.c(87, 31, 7, PAL.yellow),
  pattern: () => I.rr(12, 16, 96, 88, 18, PAL.purple)
    + I.c(34, 42, 11, '#fff') + `<polygon points="60,30 72,52 48,52" fill="${PAL.yellow}"/>` + I.c(86, 42, 11, '#fff')
    + `<polygon points="34,66 46,88 22,88" fill="${PAL.yellow}"/>` + I.c(60, 78, 11, '#fff')
    + I.rr(73, 65, 26, 26, 7, 'none', 'stroke="#fff" stroke-width="3.5" stroke-dasharray="5 4"') + I.t(86, 79, 19, '#fff', '?'),
  fit: () => {
    const cell = (x, y, f) => I.rr(14 + x * 23, 14 + y * 23, 21, 21, 5, f) + I.rr(14 + x * 23, 14 + y * 23, 21, 7, 4, '#fff', 'opacity=".28"');
    return [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => cell(x, y, PAL.yellow)).join('')
      + [[3, 0], [3, 1], [3, 2], [2, 2]].map(([x, y]) => cell(x, y, PAL.orange)).join('')
      + [[0, 3], [1, 3], [2, 3], [1, 2]].map(([x, y]) => cell(x, y, PAL.blue)).join('')
      + I.rr(60, 14, 21, 44, 6, 'none', `stroke="${PAL.green}" stroke-width="3.5" stroke-dasharray="5 4"`) + I.c(83, 83, 0, 'none');
  },
  wuziqi: () => I.rr(10, 10, 100, 100, 18, PAL.wood) + I.rr(10, 10, 100, 50, 18, '#fff', 'opacity=".14"')
    + `<g stroke="#8A5A2B" stroke-width="3" stroke-linecap="round" opacity=".75"><path d="M22 32 H98 M22 60 H98 M22 88 H98 M32 22 V98 M60 22 V98 M88 22 V98"/></g>`
    + [[32, 32], [60, 60], [88, 88]].map(([x, y]) => I.c(x, y + 2, 13, '#000', 'opacity=".18"') + I.c(x, y, 13, '#26252B') + I.c(x - 4, y - 5, 4, '#fff', 'opacity=".28"')).join('')
    + [[88, 32], [32, 88]].map(([x, y]) => I.c(x, y + 2, 13, '#000', 'opacity=".14"') + I.c(x, y, 13, '#fff') + I.c(x - 4, y - 5, 4, '#F2EEE6')).join(''),
  span: () => {
    let s = '';
    for (let k = 0; k < 9; k++) {
      const x = 17 + (k % 3) * 30, y = 17 + Math.floor(k / 3) * 30, lit = k === 1 ? '1' : k === 5 ? '2' : '';
      if (lit) s += I.c(x + 13, y + 13, 19, PAL.yellow, 'opacity=".35"');
      s += I.rr(x, y, 26, 26, 7, lit ? PAL.yellow : '#BFE9E3');
      if (lit) s += I.t(x + 13, y + 14, 16, PAL.ink, lit);
    }
    return s + sparkle(100, 16, 0.7, PAL.yellow);
  },
};
function icon(id, cls = '') { return `<svg class="ic ${cls}" viewBox="0 0 120 120" aria-hidden="true">${ICONS[id]()}</svg>`; }

// small line icons for the bar (album, sound, settings, play)
const GLYPH = {
  book: '<path d="M4 6.5C4 5.1 5.1 4 6.5 4H11v15H6.5A2.5 2.5 0 0 0 4 21.5Z M20 6.5C20 5.1 18.9 4 17.5 4H13v15h4.5a2.5 2.5 0 0 1 2.5 2.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  sound: '<path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4Z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  gear: '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="6.6" fill="none" stroke="currentColor" stroke-width="2"/>',
  play: '<path d="M8 5.5v13l10.5-6.5Z" fill="currentColor"/>',
  star: '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8Z" fill="currentColor"/>',
};
function glyph(n, s = 24) { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${GLYPH[n]}</svg>`; }
function greeting() { const h = new Date().getHours(); return h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好'; }
