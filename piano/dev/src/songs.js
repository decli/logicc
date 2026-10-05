// 彩虹钢琴 · songs
// Every melody here is in the public domain. They are written the way Chinese children's books write
// music — 简谱 (numbered notation) — so a parent can read and add one:
//   1 2 3 4 5 6 7 = do re mi fa sol la si, 0 = rest
//   ' after a note = one octave up, ,  = one octave down, # / b before it = sharp / flat
//   - after a note = one more beat, _ = half as long, . = half as long again
//   / = end of a phrase (the child learns one phrase at a time), | = bar line (only for reading)
// Lyrics: one character per note; ~ means the same syllable carries on to the next note.
// Chords (for the accompaniment the piano plays along): "C:2" = C major for 2 beats, "_" = nothing.

const DEG = [0, 0, 2, 4, 5, 7, 9, 11];
export function parseLine(src, key = 60) {
  const out = []; let t = 0, phrase = 0;
  for (const tok of src.trim().split(/\s+/)) {
    if (tok === '|') continue;
    if (tok === '/') { phrase++; continue; }
    const m = /^([#b]?)([0-7])([',]*)([-_.]*)$/.exec(tok);
    if (!m) throw new Error('bad note ' + tok);
    const [, acc, dg, oct, dur] = m;
    let d = 1, plus = 0, dot = false;
    for (const ch of dur) { if (ch === '_') d /= 2; else if (ch === '-') plus++; else if (ch === '.') dot = true; }
    d = d * (dot ? 1.5 : 1) + plus;
    if (dg !== '0') {
      let midi = key + DEG[+dg] + (acc === '#' ? 1 : acc === 'b' ? -1 : 0);
      for (const o of oct) midi += o === "'" ? 12 : -12;
      out.push({ m: midi, t, d, phrase });
    }
    t += d;
  }
  return { notes: out, length: t };
}
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const QUAL = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], dim: [0, 3, 6], sus4: [0, 5, 7] };
function chordTones(sym) {
  const m = /^([A-G])([#b]?)(.*)$/.exec(sym); if (!m) return null;
  const r = (ROOT[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  const q = QUAL[m[3]] || QUAL[''];
  return { root: r, pcs: q.map(i => (r + i) % 12) };
}
const near = (pc, lo) => { let m = lo + (((pc - lo) % 12) + 12) % 12; return m; };
// left-hand part from chord symbols, in a style
function accompany(chords, beats, style, offset = 0) {
  const ev = []; let t = offset;
  for (const tok of chords.trim().split(/\s+/)) {
    if (tok === '|' || tok === '/') continue;
    const [sym, len] = tok.split(':'); const L = len ? +len : beats;
    const c = sym === '_' ? null : chordTones(sym);
    if (c) {
      // the left hand stays below middle C, so it never lands on the key the child is looking for
      const bass = near(c.root, 38);                       // D2 … C#3
      const tones = c.pcs.slice(0, 3).map(pc => near(pc, 48)).sort((a, b) => a - b);  // C3 … B3
      for (let b = 0; b < L; b += (style === 'arp' ? 0.5 : 1)) {
        const tt = t + b, onBar = Math.abs(b % beats) < 1e-6;
        if (style === 'block') { if (b === 0) { ev.push({ m: bass, t: tt, d: L, v: 0.42 }); tones.forEach(m => ev.push({ m, t: tt, d: L, v: 0.3 })); } }
        else if (style === 'arp') {
          const seq = [bass, tones[1] ?? bass + 7, tones[2] ?? bass + 12, tones[1] ?? bass + 7];
          ev.push({ m: seq[Math.round(b * 2) % 4], t: tt, d: 0.9, v: b === 0 ? 0.42 : 0.3 });
        } else {      // oom-pah / waltz
          if (b === 0 || onBar) ev.push({ m: bass, t: tt, d: 0.95, v: 0.44 });
          else tones.forEach(m => ev.push({ m, t: tt, d: 0.7, v: 0.26 }));
        }
      }
    }
    t += L;
  }
  return ev;
}
function lyricTokens(s) {
  if (!s) return [];
  return Array.from(s.replace(/[\s，。、！？,.!?/|]/g, ''));
}

/* ---------------- the library ---------------- */
const RAW = [
  {
    id: 'scale', title: '彩虹音阶', emoji: '🌈', stars: 1, bpm: 84, beats: 4, key: 60, a: '#FF7A7A', b: '#A55EEA',
    tip: '从 do 走到高音 do，再走回来，像爬一座彩虹楼梯',
    mel: '1 2 3 4 | 5 6 7 1\'- / 1\' 7 6 5 | 4 3 2 1-',
    lyr: '哆来咪发唆拉西哆 哆西拉唆发咪来哆',
    chords: 'C:4 G:3 C:2 / C:2 G:2 C:2 G:1 C:2', style: 'block',
  },
  {
    id: 'twinkle', title: '小星星', emoji: '⭐', stars: 1, bpm: 92, beats: 4, key: 60, a: '#FFC94A', b: '#FF8A3D',
    mel: '1 1 5 5 | 6 6 5- / 4 4 3 3 | 2 2 1- / 5 5 4 4 | 3 3 2- / 5 5 4 4 | 3 3 2- / 1 1 5 5 | 6 6 5- / 4 4 3 3 | 2 2 1-',
    lyr: '一闪一闪亮晶晶 满天都是小星星 挂在天上放光明 好像许多小眼睛 一闪一闪亮晶晶 满天都是小星星',
    chords: 'C:2 C:2 F:2 C:2 / F:2 C:2 G:2 C:2 / C:2 F:2 C:2 G:2 / C:2 F:2 C:2 G:2 / C:2 C:2 F:2 C:2 / F:2 C:2 G:2 C:2', style: 'arp',
  },
  {
    id: 'bee', title: '小蜜蜂', emoji: '🐝', stars: 1, bpm: 100, beats: 4, key: 60, a: '#FFD43B', b: '#F59F00',
    mel: '5 3 3- | 4 2 2- | 1 2 3 4 | 5 5 5- / 5 3 3- | 4 2 2- | 1 3 5 5 | 3--- / 2 2 2 2 | 2 3 4- | 3 3 3 3 | 3 4 5- / 5 3 3- | 4 2 2- | 1 3 5 5 | 1---',
    lyr: '嗡嗡嗡嗡嗡嗡大家一起勤做工 来匆匆去匆匆做工兴味浓 天暖花好不做工将来哪里好过冬 嗡嗡嗡嗡嗡嗡别做懒惰虫',
    chords: 'C G7 C C / C G7 C C / G G7 C C / C G7 C C', style: 'oom',
  },
  {
    id: 'lamb', title: '玛丽有只小羊羔', emoji: '🐑', stars: 1, bpm: 100, beats: 4, key: 60, a: '#9AD7FF', b: '#4D7CFE',
    mel: '3 2 1 2 | 3 3 3- | 2 2 2- | 3 5 5- / 3 2 1 2 | 3 3 3 3 | 2 2 3 2 | 1---',
    lyr: '玛丽有只小羊羔小羊羔小羊羔 玛丽有只小羊羔羊毛雪一样白',
    chords: 'C C G C / C C G C', style: 'oom',
  },
  {
    id: 'tigers', title: '两只老虎', emoji: '🐯', stars: 2, bpm: 112, beats: 4, key: 60, a: '#FFA94D', b: '#E8590C',
    mel: '1 2 3 1 | 1 2 3 1 / 3 4 5- | 3 4 5- / 5_ 6_ 5_ 4_ 3 1 | 5_ 6_ 5_ 4_ 3 1 / 1 5, 1- | 1 5, 1-',
    lyr: '两只老虎两只老虎 跑得快跑得快 一只没有耳朵一只没有尾巴 真奇怪真奇怪',
    chords: 'C C / C C / C C / C:1 G:1 C:2 C:1 G:1 C:2', style: 'oom',
  },
  {
    id: 'joy', title: '欢乐颂', emoji: '🎉', stars: 2, bpm: 104, beats: 4, key: 60, a: '#63E6BE', b: '#12B886',
    tip: '贝多芬写的，全世界的人都会唱',
    mel: '3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3. 2_ 2- / 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2. 1_ 1- / 2 2 3 1 | 2 3_ 4_ 3 1 | 2 3_ 4_ 3 2 | 1 2 5,- / 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2. 1_ 1-',
    chords: 'C G C C:2 G:2 / C G C G:2 C:2 / G:2 C:2 G:2 C:2 G:2 C:1 G:1 C:1 G:3 / C G C G:2 C:2', style: 'arp',
  },
  {
    id: 'newyear', title: '新年好', emoji: '🧨', stars: 2, bpm: 132, beats: 3, key: 60, a: '#FF6B6B', b: '#C92A2A',
    mel: '1_ 1_ 1 5, | 3_ 3_ 3 1 / 1_ 3_ 5 5 | 4_ 3_ 2- / 2_ 3_ 4 4 | 3_ 2_ 3 1 / 1_ 3_ 2 5, | 7,_ 2_ 1-',
    lyr: '新年好呀新年好呀 祝贺大家新年好 我们唱歌我们跳舞 祝贺大家新年好',
    chords: 'C C / C G / G7 C / C:1 G:2 G:1 C:2', style: 'oom',
  },
  {
    id: 'london', title: '伦敦桥', emoji: '🌉', stars: 2, bpm: 104, beats: 4, key: 60, a: '#91A7FF', b: '#5C7CFA',
    mel: '5. 6_ 5 4 | 3 4 5- | 2 3 4- | 3 4 5- / 5. 6_ 5 4 | 3 4 5- | 2- 5- | 3 1--',
    lyr: '伦敦大桥垮下来垮下来垮下来 伦敦大桥垮下来快来修好',
    chords: 'C C G C / C C G C', style: 'oom',
  },
  {
    id: 'painter', title: '粉刷匠', emoji: '🖌️', stars: 2, bpm: 108, beats: 2, key: 60, a: '#F783AC', b: '#D6336C',
    mel: '5_ 3_ 5_ 3_ | 5_ 3_ 1 | 2_ 4_ 3_ 2_ | 5- / 5_ 3_ 5_ 3_ | 5_ 3_ 1 | 2_ 4_ 3_ 2_ | 1- / 2_ 2_ 4_ 4_ | 3_ 1_ 5 | 2_ 4_ 3_ 2_ | 5- / 5_ 3_ 5_ 3_ | 5_ 3_ 1 | 2_ 4_ 3_ 2_ | 1-',
    lyr: '我是一个粉刷匠粉刷本领强 我要把那新房子刷得很漂亮 刷了房顶又刷墙刷子飞舞忙 哎呀我的小鼻子变呀变了样',
    chords: 'C C G G / C C G C / G7 C G G / C C G C', style: 'oom',
  },
  {
    id: 'jingle', title: '铃儿响叮当', emoji: '🔔', stars: 3, bpm: 126, beats: 4, key: 60, a: '#74C0FC', b: '#1C7ED6',
    mel: '3 3 3- | 3 3 3- | 3 5 1. 2_ | 3--- / 4 4 4. 4_ | 4 3 3 3_ 3_ | 3 2 2 1 | 2- 5- / 3 3 3- | 3 3 3- | 3 5 1. 2_ | 3--- / 4 4 4 4 | 4 3 3 3_ 3_ | 5 5 4 2 | 1---',
    lyr: '叮叮当叮叮当铃儿响叮当 我们滑雪多快乐我们坐在雪橇上嘿 叮叮当叮叮当铃儿响叮当 我们滑雪多快乐我们坐在雪橇上',
    chords: 'C C C C / F C D7 G7 / C C C C / F C G7 C', style: 'oom',
  },
  {
    id: 'birthday', title: '生日快乐', emoji: '🎂', stars: 3, bpm: 100, beats: 3, key: 60, a: '#FFB4D2', b: '#E64980',
    mel: '5,. 5,_ | 6, 5, 1 | 7,- / 5,. 5,_ | 6, 5, 2 | 1- / 5,. 5,_ | 5 3 1 | 7, 6, / 4. 4_ | 3 1 2 | 1--',
    lyr: '祝你生日快乐 祝你生日快乐 祝你生日快乐~ 祝你生日快乐',
    chords: '_:1 C:3 G:2 / G:4 C:2 / C:4 F:2 / F:1 C:2 G:1 C:3', style: 'oom',
  },
  {
    id: 'xmas', title: '圣诞快乐', emoji: '🎄', stars: 3, bpm: 132, beats: 3, key: 60, a: '#69DB7C', b: '#2B8A3E',
    mel: '5, | 1 1_ 2_ 1_ 7,_ | 6, 6, / 6, | 2 2_ 3_ 2_ 1_ | 7, 5, / 5, | 3 3_ 4_ 3_ 2_ | 1 6, / 5,_ 5,_ | 6, 2 7, | 1--',
    lyr: '我们祝你圣诞快乐 我们祝你圣诞快乐 我们祝你圣诞快乐 祝你新年快乐',
    chords: '_:1 C:3 F:2 / F:1 D7:3 G:2 / G:1 C:3 Am:2 / Am:1 F:1 G:2 C:3', style: 'oom',
  },
  {
    id: 'farewell', title: '送别', emoji: '🌅', stars: 3, bpm: 76, beats: 4, key: 60, a: '#FFC078', b: '#E8590C',
    tip: '长亭外，古道边——一百多年前的老歌',
    mel: '5 3_ 5_ 1\'- | 6 1\'_ 6_ 5- | 5 1_ 2_ 3 2_ 1_ | 2--- / 5 3_ 5_ 1\'. 7_ | 6 1\' 5- | 5 2_ 3_ 4. 7,_ | 1--- / 6 1\' 1\'- | 7 6_ 7_ 1\'- | 6_ 7_ 1\'_ 6_ 6_ 5_ 3_ 1_ | 2--- / 5 3_ 5_ 1\'. 7_ | 6 1\' 5- | 5 2_ 3_ 4. 7,_ | 1---',
    lyr: '长亭~外古道~边芳草~碧连~天 晚风~拂柳笛声残夕阳~山外山 天之涯地之~角知~交~半~零~落 一壶~浊酒尽余欢今宵~别梦寒',
    chords: 'C F:2 C:2 C G / C F:2 C:2 G C / F G:2 C:2 F:2 C:2 G / C F:2 C:2 G C', style: 'arp',
  },
  /* ---- for listening: the piano plays both hands ---- */
  {
    id: 'elise', title: '致爱丽丝', emoji: '🌹', stars: 3, bpm: 176, beats: 3, key: 60, a: '#E599F7', b: '#9C36B5', listenOnly: true,
    tip: '贝多芬写给一位朋友的小曲',
    mel: '3\'_ #2\'_ | 3\'_ #2\'_ 3\'_ 7_ 2\'_ 1\'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ #5_ 7_ | 1\' 0_ 3_ 3\'_ #2\'_ | 3\'_ #2\'_ 3\'_ 7_ 2\'_ 1\'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ 1\'_ 7_ | 6 0 3\'_ #2\'_ ' +
      '| 3\'_ #2\'_ 3\'_ 7_ 2\'_ 1\'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ #5_ 7_ | 1\' 0_ 3_ 3\'_ #2\'_ | 3\'_ #2\'_ 3\'_ 7_ 2\'_ 1\'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ 1\'_ 7_ | 6 0_ 7_ 1\'_ 2\'_ ' +
      '| 3\'. 5_ 4\'_ 3\'_ | 2\'. 4_ 3\'_ 2\'_ | 1\'. 3_ 2\'_ 1\'_ | 7 0_ 3_ 3\'_ #2\'_ | 3\'_ #2\'_ 3\'_ #2\'_ 3\'_ #2\'_ ' +
      '| 3\'_ #2\'_ 3\'_ 7_ 2\'_ 1\'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ #5_ 7_ | 1\' 0_ 3_ 3\'_ #2\'_ | 3\'_ #2\'_ 3\'_ 7_ 2\'_ 1\'_ | 6 0_ 1_ 3_ 6_ | 7 0_ 3_ 1\'_ 7_ | 6--',
    lh: '0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 ' +
      '| 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 ' +
      '| 1,_ 5,_ 1_ 0_ 0 | 5,,_ 5,_ 7,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ 3_ 0_ 0 | 0-- ' +
      '| 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,_ 0_ 0 | 0-- | 6,,_ 3,_ 6,_ 0_ 0 | 3,,_ 3,_ #5,_ 0_ 0 | 6,,_ 3,_ 6,-',
  },
  {
    id: 'minuet', title: '小步舞曲', emoji: '💃', stars: 3, bpm: 132, beats: 3, key: 67, a: '#A5D8FF', b: '#4263EB', listenOnly: true,
    tip: '三百年前的舞曲，一二三，一二三',
    mel: '5 1_ 2_ 3_ 4_ | 5 1 1 | 6 4_ 5_ 6_ 7_ | 1\' 1 1 | 4 5_ 4_ 3_ 2_ | 3 4_ 3_ 2_ 1_ | 7, 1_ 2_ 3_ 1_ | 2-- / 5 1_ 2_ 3_ 4_ | 5 1 1 | 6 4_ 5_ 6_ 7_ | 1\' 1 1 | 4 5_ 4_ 3_ 2_ | 3 4_ 3_ 2_ 1_ | 2 3_ 2_ 1_ 7,_ | 1--',
    lh: '1,- 2, | 3,-- | 4,-- | 3,-- | 2,-- | 1,-- | 5, 3, 1, | 5, 5,, 4, / 1,- 2, | 3,-- | 4,-- | 3,-- | 2,-- | 1,-- | 5,- 5,, | 1,- 1,,',
  },
  {
    id: 'canon', title: '卡农', emoji: '🕊️', stars: 3, bpm: 72, beats: 4, key: 62, a: '#FFD8A8', b: '#F08C00', listenOnly: true,
    tip: '帕赫贝尔的卡农：低音一直在转圈，上面的旋律一层一层叠上去',
    mel: '0--- | 0--- | 0--- | 0--- / 3\'- 2\'- | 1\'- 7- | 6- 5- | 6- 7- | 3\'- 2\'- | 1\'- 7- | 6- 5- | 6- 7- / 1\' 3\' 5\' 4\' | 3\' 1\' 3\' 2\' | 1\' 6 1\' 5\' | 4\' 6\' 5\' 4\' | 1\' 3\' 5\' 4\' | 3\' 1\' 3\' 2\' | 1\' 6 1\' 5\' | 4\' 6\' 5\' 4\' / 3\'--- | 3\'---',
    chords: 'D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 / D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 / D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 D:2 A:2 Bm:2 F#m:2 G:2 D:2 G:2 A:2 / D:8', style: 'arp',
  },
];

export const SONGS = RAW.map(r => {
  const { notes, length } = parseLine(r.mel, r.key);
  const lyr = lyricTokens(r.lyr);
  let li = 0;
  notes.forEach((n, i) => {
    if (!lyr.length) return;
    const ch = lyr[li++];
    n.lyric = ch === '~' ? '' : (ch || '');
  });
  const phrases = [];
  notes.forEach((n, i) => { (phrases[n.phrase] || (phrases[n.phrase] = [])).push(i); });
  let acc = [];
  if (r.lh) acc = parseLine(r.lh, r.key).notes.map(n => ({ m: n.m, t: n.t, d: n.d, v: 0.45 }));
  else if (r.chords) acc = accompany(r.chords, r.beats, r.style);
  const ms = notes.map(n => n.m);
  return Object.assign({}, r, {
    notes, length, acc, phrases: phrases.filter(Boolean),
    lo: Math.min(...ms), hi: Math.max(...ms),
    spb: 60 / r.bpm,
  });
});
export const songById = id => SONGS.find(s => s.id === id);
