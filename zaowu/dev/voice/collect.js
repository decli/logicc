// Enumerate every line the page can speak, per language and voice role,
// exactly as the runtime builds the strings (so the hashes match).
const fs = require('fs'), vm = require('vm');
const ctx = { pick: a => a[0], localStorage: { getItem: () => null, setItem() { } }, document: { documentElement: {} }, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../src/i18n.js', 'utf8') + '\n;this.STR=STR;this.NAME_PAIRS=NAME_PAIRS;this.PAINTS=PAINTS;this.CHAT_PAIRS=CHAT_PAIRS;this.STICKERS=STICKERS;this.cnum=cnum;', ctx);
const { STR, NAME_PAIRS, PAINTS, CHAT_PAIRS, STICKERS, cnum } = ctx;
const out = [], seen = new Set();
function add(lang, role, text) { const k = lang + '|' + role + '|' + text; if (!text || seen.has(k)) return; seen.add(k); out.push({ lang, role, text }); }
const raw = (key, li) => { const v = STR[key][li]; return v === undefined ? STR[key][0] : v; };
const items = (key, li) => { const v = raw(key, li); return Array.isArray(v) ? v : [v]; };
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
for (const [li, lang] of [[0, 'zh'], [1, 'en']]) {
  const names = NAME_PAIRS.map(p => p[li]);
  // narrator
  for (const q of ['q_chaos', 'q_gen', 'q_tree', 'q_rain', 'q_nuwa', 'q_night', 'q_one']) { const s = raw(q, li); add(lang, 'n', lang === 'en' ? s : s.split('|').join('，') + '。'); }
  const plain = ['chaos_line', 'chaos_hint', 'tap1_line', 'tap1_hint', 'tap2_line', 'tap2_hint', 'gen_line', 'tree_line', 'tree_hint', 'tree1_line', 'tree1_hint', 'tree2_line', 'cloud_line', 'cloud_hint', 'rain_line', 'rainbow_line', 'creature_line', 'creature_hint', 'born_hint', 'fling_line', 'friends_line', 'friends_hint', 'shake_line', 'shake_hint', 'night_line', 'night_hint', 'nightfall_line', 'nightfall_hint', 'free_line', 'free_hint', 'reveal_line', 'welcome_back', 'chorus_toast', 'full_toast', 'echo_invite', 'echo_start', 'echo_listen', 'echo_your', 'echo_good', 'echo_more', 'echo_again', 'echo_win', 'echo_need', 'echo_bye', 'voice_on'];
  for (const k of plain) for (const s of items(k, li)) add(lang, 'n', s);
  for (const k of ['born_line', 'born2_line', 'poke_line']) for (const n of names) add(lang, 'n', fill(raw(k, li), { name: n }));
  for (let d = 2; d <= 60; d++) add(lang, 'n', fill(raw('day_toast', li), { n: lang === 'en' ? String(d) : cnum(d) }));
  for (const s of STICKERS) {
    add(lang, 'n', fill(raw('sticker_got', li), { name: s.n[li] }));
    add(lang, 'n', fill(raw('st_tap', li), { name: s.n[li] })); add(lang, 'n', s.h[li]);
  }
  // creatures: both voices say everything
  for (const role of ['c0', 'c1']) {
    for (const k of Object.keys(STR).filter(k => k.startsWith('c_'))) {
      for (const s of items(k, li)) {
        if (k === 'c_color') { for (const p of PAINTS) add(lang, role, fill(s, { c: p[lang] })); continue; }
        if (s.includes('{name}')) { for (const n of names) add(lang, role, fill(s, { name: n })); continue; }
        add(lang, role, s);
      }
    }
    for (const group of Object.values(CHAT_PAIRS)) for (const pair of group) for (const s of pair[li]) {
      if (s.includes('{name}')) { for (const n of names) add(lang, role, s.replace('{name}', n)); } else add(lang, role, s);
    }
  }
}
fs.writeFileSync(__dirname + '/lines.json', JSON.stringify(out, null, 0));
const by = {}; for (const o of out) { const k = o.lang + ':' + o.role; by[k] = (by[k] || 0) + 1; }
console.log('total', out.length, by);
const chars = {}; for (const o of out) { const k = o.lang; chars[k] = (chars[k] || 0) + o.text.length; } console.log('chars', chars);
