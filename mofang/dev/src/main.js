// 魔方世界 · start-up and the frame loop
import * as THREE from 'three';
import { $, Store, Tick, params } from './core.js';
import { Stage } from './stage.js';
import { initToys } from './blocks.js';
import { FX } from './fx.js';
import { UI } from './ui.js';
import { Snd, Music } from './audio.js';
import { Voice } from './voice.js';
import { Game, WORLDS } from './game.js';
import { Map } from './map.js';

Store.load();
const canvas = $('#gl');
try { Stage.init(canvas); }
catch (e) { $('#ldMsg').textContent = '这台设备打不开 3D 画面（需要 WebGL）'; throw e; }
initToys();
FX.init();
Snd.on = Store.d.sound; Snd.music = Store.d.music; Voice.on = Store.d.voice;
Game.toMap = w => Map.open(w);

const resize = () => { Stage.resize(); UI.layout(); };
addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);
resize();

$('#homeBtn').addEventListener('click', () => {
  Snd.play('tap');
  if ($('#mapUI').classList.contains('hidden')) Map.open(Game.world);
  else { Voice.stop(); location.href = '../'; }
});
$('#hintBtn').addEventListener('click', () => Game.hint());
$('#sayBtn').addEventListener('click', () => { Snd.play('tap'); Game.repeat(); });
$('#gearBtn').addEventListener('click', () => { Snd.play('tap'); UI.gear(() => Map.refresh()); });

// the frame loop; a slow device gets fewer pixels rather than a stutter
const clock = new THREE.Timer();
let t = 0, frames = 0, slow = 0;
function frame() {
  clock.update(); const dt = Math.min(clock.getDelta(), MAXDT);
  t += dt;
  Tick.run(dt, t);
  Stage.render();
  frames++; if (dt > 1 / 40) slow++;
  if (frames === 120) {
    const pr = Stage.renderer.getPixelRatio();
    if (slow > 50 && pr > 1.25) { Stage.renderer.setPixelRatio(Math.max(1, pr - 0.5)); resize(); }
    frames = 0; slow = 0;
  }
  requestAnimationFrame(frame);
}
// ?debug (slow software rendering in tests): let time run at full speed even at a few frames a second
const MAXDT = params.has('debug') ? 0.4 : 1 / 20;
requestAnimationFrame(frame);

// start: the first tap also unlocks sound on tablets
const start = () => {
  Snd.init(); Voice.unlock(); Voice.load();
  if (Snd.music) Music.start();
  $('#loader').classList.add('out'); setTimeout(() => $('#loader').remove(), 600);
  const w = WORLDS.find(x => x.id === params.get('w'));
  if (w && params.has('l')) Game.play(w, params.get('l') === 'free' ? 'free' : +params.get('l'));
  else Map.open(w);
};
Voice.load();
const sb = $('#startBtn'); sb.disabled = false; $('#ldMsg').textContent = '点一下开始';
sb.addEventListener('click', start, { once: true });
if (params.has('go')) start();
if (params.has('debug')) window.MF = { Stage, Game, Store, UI, Map, THREE };
