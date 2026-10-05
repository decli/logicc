// 彩虹钢琴 · notes, colours and where every key sits
// Seven notes, seven colours of the rainbow: 赤橙黄绿青蓝紫 = do re mi fa sol la si.
// Black keys borrow the colour half-way between their two white neighbours.
import * as THREE from 'three';

export const LOW = 21, HIGH = 108;            // A0 … C8, all 88 keys
export const MIDDLE_C = 60;
export const isBlack = m => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
export const PC_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const SOLFEGE = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
export const SOLFEGE_ZH = ['哆', '来', '咪', '发', '唆', '拉', '西'];
export const RAINBOW_ZH = ['红', '橙', '黄', '绿', '青', '蓝', '紫'];
const DEG = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
// scale degree 0..6 of a white key (C = 0)
export const degree = m => DEG[((m % 12) + 12) % 12];
export const octave = m => Math.floor(m / 12) - 1;
export const nameOf = m => PC_NAMES[m % 12] + octave(m);

export const HEX = ['#FF4F5E', '#FF9A3C', '#FFD43B', '#3DD68C', '#1FC8DB', '#4D7CFE', '#A55EEA'];
const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];
const cache = new Map();
export function colorOf(m) {
  if (cache.has(m)) return cache.get(m);
  const pc = ((m % 12) + 12) % 12;
  let c;
  if (!isBlack(m)) c = new THREE.Color(HEX[DEG[pc]]);
  else {
    const lo = new THREE.Color(HEX[DEG[pc - 1]]), hi = new THREE.Color(HEX[DEG[(pc + 1) % 12]]);
    c = lo.lerp(hi, 0.5);
  }
  cache.set(m, c);
  return c;
}
export const cssColor = m => '#' + colorOf(m).getHexString();

/* ---------- keyboard geometry (metres) ---------- */
export const K = {
  W: 0.0235,          // white key pitch
  GAP: 0.0011,        // gap between white keys
  WL: 0.150,          // visible length of a white key
  WH: 0.022,          // white key thickness
  BW: 0.0128,         // black key width
  BL: 0.094,          // black key length
  BH: 0.0125,         // black key height above the white key tops
  TOP: 0.720,         // height of the white key tops from the floor
  N_WHITE: 52,
};
K.HALF = (K.N_WHITE * K.W) / 2;   // 0.611

const whiteIdx = new Map();
{ let i = 0; for (let m = LOW; m <= HIGH; m++) if (!isBlack(m)) whiteIdx.set(m, i++); }
export const whiteIndex = m => whiteIdx.get(m);
// black keys sit a little off-centre, like on a real keyboard
const BLACK_SHIFT = { 1: -0.13, 3: 0.13, 6: -0.16, 8: 0, 10: 0.16 };
export function keyX(m) {
  if (!isBlack(m)) return (whiteIdx.get(m) + 0.5) * K.W - K.HALF;
  const lo = whiteIdx.get(m - 1);
  return (lo + 1) * K.W - K.HALF + BLACK_SHIFT[m % 12] * K.W;
}
export const whiteAt = i => { for (const [m, j] of whiteIdx) if (j === i) return m; return null; };

/* ---------- where each part of the keyboard lives, as animals from big to small ---------- */
export const REGISTERS = [
  { from: 21, to: 23, e: '🐋', zh: '鲸鱼' },
  { from: 24, to: 35, e: '🐘', zh: '大象' },
  { from: 36, to: 47, e: '🐻', zh: '小熊' },
  { from: 48, to: 59, e: '🐶', zh: '小狗' },
  { from: 60, to: 71, e: '🐱', zh: '小猫' },
  { from: 72, to: 83, e: '🐰', zh: '小兔' },
  { from: 84, to: 95, e: '🐦', zh: '小鸟' },
  { from: 96, to: 108, e: '🐝', zh: '小蜜蜂' },
];
export const registerOf = m => REGISTERS.find(r => m >= r.from && m <= r.to) || REGISTERS[4];

export const freq = m => 440 * Math.pow(2, (m - 69) / 12);
