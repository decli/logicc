// 彩虹钢琴 · the sheet of music on the piano's desk, drawn on a canvas
// Children who cannot read notes yet read colours: every note is a coloured ball with its name,
// and the words of the song sit underneath.
import { degree, isBlack, SOLFEGE, HEX, cssColor } from './notes.js';

export function buildSheet(piano) {
  const c = piano.sheetCanvas, g = c.getContext('2d'), W = c.width, H = c.height;
  const S = { labels: 'solfege' };
  function paper() {
    g.clearRect(0, 0, W, H);
    const grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#FFFDF8'); grd.addColorStop(1, '#F6EFE3');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    // faint staff lines, like a real music book
    g.strokeStyle = 'rgba(120,100,80,.10)'; g.lineWidth = 3;
    for (let k = 0; k < 5; k++) { const y = 470 + k * 34; g.beginPath(); g.moveTo(80, y); g.lineTo(W - 80, y); g.stroke(); }
    g.strokeStyle = 'rgba(120,100,80,.18)'; g.lineWidth = 6; g.strokeRect(18, 18, W - 36, H - 36);
  }
  function label(m) {
    if (isBlack(m)) return '♯';
    const d = degree(m);
    return S.labels === 'number' ? String(d + 1) : S.labels === 'letter' ? 'CDEFGAB'[d] : SOLFEGE[d];
  }
  function title(t, sub) {
    g.fillStyle = '#3B2F4A'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '800 92px "PingFang SC","Hiragino Sans GB",sans-serif';
    g.fillText(t, W / 2, 110);
    if (sub) { g.font = '600 46px "PingFang SC",sans-serif'; g.fillStyle = 'rgba(59,47,74,.55)'; g.fillText(sub, W / 2, 182); }
  }
  function ball(x, y, r, m, state) {
    const col = cssColor(m);
    g.save();
    if (state === 'done') g.globalAlpha = 0.35;
    if (state === 'now') { g.shadowColor = col; g.shadowBlur = 60; }
    g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.shadowBlur = 0;
    // a glossy highlight makes it read as a candy, not a dot
    const hl = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x - r * 0.3, y - r * 0.35, r * 0.75);
    hl.addColorStop(0, 'rgba(255,255,255,.75)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    if (state === 'now') { g.lineWidth = 12; g.strokeStyle = '#fff'; g.beginPath(); g.arc(x, y, r + 14, 0, Math.PI * 2); g.stroke(); g.lineWidth = 6; g.strokeStyle = col; g.beginPath(); g.arc(x, y, r + 24, 0, Math.PI * 2); g.stroke(); }
    const t = label(m);
    g.fillStyle = degree(m) === 2 ? '#5B4300' : '#fff';
    g.font = `800 ${Math.round(r * (t.length > 2 ? 0.62 : 0.8))}px "Arial Rounded MT Bold","Avenir Next",sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, x, y + r * 0.05);
    g.restore();
  }
  const sheet = {
    setLabels(mode) { S.labels = mode; },
    idle() {
      paper();
      title('彩虹钢琴', '七个音，七种颜色');
      const ms = [60, 62, 64, 65, 67, 69, 71];
      ms.forEach((m, i) => ball(W / 2 + (i - 3) * 210, 520 - i * 18, 70, m, ''));
      piano.sheetTex.needsUpdate = true;
    },
    // the phrase being learnt; `at` = index of the note to play next (within the whole song)
    song(song, at, opts = {}) {
      paper();
      const ph = song.phrases.find(p => p.includes(at)) || song.phrases[song.phrases.length - 1];
      const pi = song.phrases.indexOf(ph);
      title(`${song.emoji} ${song.title}`, song.phrases.length > 1 ? `第 ${pi + 1} 句，共 ${song.phrases.length} 句` : '');
      const n = ph.length, gap = Math.min(190, (W - 220) / Math.max(1, n - 1)), r = Math.min(70, gap * 0.42);
      const x0 = W / 2 - (gap * (n - 1)) / 2;
      const lo = Math.min(...ph.map(i => song.notes[i].m)), hi = Math.max(...ph.map(i => song.notes[i].m));
      ph.forEach((idx, k) => {
        const nt = song.notes[idx];
        // higher notes sit higher on the page: the shape of the tune is visible
        const y = 560 - (hi > lo ? (nt.m - lo) / (hi - lo) : 0.5) * 170;
        const state = idx < at ? 'done' : idx === at ? 'now' : '';
        ball(x0 + k * gap, y, state === 'now' ? r * 1.12 : r, nt.m, state);
        if (nt.lyric) {
          g.fillStyle = state === 'done' ? 'rgba(59,47,74,.35)' : '#3B2F4A';
          g.font = `700 ${Math.round(Math.min(64, gap * 0.48))}px "PingFang SC",sans-serif`;
          g.textAlign = 'center'; g.fillText(nt.lyric, x0 + k * gap, 718);
        }
      });
      piano.sheetTex.needsUpdate = true;
    },
    concert(song, prog) {
      paper();
      g.font = '160px "Apple Color Emoji","Segoe UI Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(song.emoji, W / 2, 300);
      title(song.title, song.tip || '');
      g.fillStyle = 'rgba(59,47,74,.1)'; g.fillRect(260, 640, W - 520, 22);
      const grd = g.createLinearGradient(260, 0, W - 260, 0); HEX.forEach((h, i) => grd.addColorStop(i / 6, h));
      g.fillStyle = grd; g.fillRect(260, 640, (W - 520) * prog, 22);
      piano.sheetTex.needsUpdate = true;
    },
    echo(seq, got, listening) {
      paper();
      title('🐦 学小鸟', listening ? '小鸟在唱…' : '该你啦！');
      const n = seq.length, gap = 230, x0 = W / 2 - gap * (n - 1) / 2;
      seq.forEach((m, k) => {
        if (listening || k < got) ball(x0 + k * gap, 520, 80, m, k < got ? '' : '');
        else { g.strokeStyle = 'rgba(59,47,74,.25)'; g.lineWidth = 10; g.setLineDash([22, 18]); g.beginPath(); g.arc(x0 + k * gap, 520, 80, 0, Math.PI * 2); g.stroke(); g.setLineDash([]); g.fillStyle = 'rgba(59,47,74,.3)'; g.font = '800 90px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', x0 + k * gap, 525); }
      });
      piano.sheetTex.needsUpdate = true;
    },
  };
  sheet.idle();
  return sheet;
}
