// 彩虹钢琴 · start-up and the frame loop
import * as THREE from 'three';
import { buildStage } from './scene.js';
import { buildPiano } from './piano.js';
import { buildRig } from './camera.js';
import { buildFx } from './fx.js';
import { buildPlayer } from './player.js';
import { buildInput } from './input.js';
import { Snd } from './audio.js';
import { Tick, Bus, $ } from './core.js';
import { buildApp } from './app.js';

const canvas = $('#gl');
let stage;
try { stage = buildStage(canvas); }
catch (e) {
  $('#ldMsg').textContent = '这台设备打不开 3D 画面（需要 WebGL 2）';
  throw e;
}
const piano = buildPiano();
stage.scene.add(piano.root);
const rig = buildRig(stage.camera);
const fx = buildFx(stage.scene);
const ctx = { stage, piano, rig, fx, camera: stage.camera, scene: stage.scene };
ctx.player = buildPlayer(ctx);
ctx.input = buildInput(canvas, ctx);
window.__piano = ctx;    // handy from the console
window.__sndRef = Snd;

function resize() { stage.resize(); }
window.addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);
try { new ResizeObserver(resize).observe(canvas); } catch (_) { }
resize();

const clock = new THREE.Timer();
let t = 0, frames = 0, slow = 0;
function frame() {
  clock.update(); const dt = Math.min(clock.getDelta(), 1 / 20);
  t += dt;
  rig.update(dt);
  piano.update(dt, t);
  if (piano.consumeShadowDirty()) stage.shadowDirty();
  stage.update(dt, t);
  fx.update(dt, t, stage.night);
  fx.lookAt(stage.camera);
  Tick.run(dt, t);
  stage.render();
  // a slow device gets fewer pixels rather than a stutter
  frames++;
  if (dt > 1 / 40) slow++;
  if (frames === 150) {
    if (slow > 60 && stage.renderer.getPixelRatio() > 1.25) { stage.renderer.setPixelRatio(1.25); resize(); }
    frames = 0; slow = 0;
  }
  requestAnimationFrame(frame);
}
buildApp(ctx);
requestAnimationFrame(frame);
