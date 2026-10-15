// 魔方世界 · the six islands, their levels, and how a level runs (three rounds, stars, the done card)
import * as THREE from 'three';
import { Scope, Store, pick, $, params } from './core.js';
import { Stage, setSky } from './stage.js';
import { UI } from './ui.js';
import { FX } from './fx.js';
import { Snd } from './audio.js';
import { Voice } from './voice.js';
import { L, CHEER } from './lines.js';
import { Views } from './modes/views.js';
import { Count } from './modes/count.js';
import { Wall } from './modes/wall.js';
import { Nets } from './modes/nets.js';
import { Cube } from './modes/cube.js';
import { Build } from './modes/build.js';

export const ROUNDS = 3;
// sky colours per island: top, middle, horizon
export const WORLDS = [
  { id: 'views', icon: '👀', mode: Views, color: '#4D96FF', sky: ['#7CC6FF', '#D8F0FF', '#FFF5E1'], levels: Views.levels },
  { id: 'count', icon: '🔢', mode: Count, color: '#FF9F1C', sky: ['#FFB86B', '#FFE9C7', '#FFF8EC'], levels: Count.levels },
  { id: 'wall', icon: '🧱', mode: Wall, color: '#FF5A5F', sky: ['#FF9EAE', '#FFE1E6', '#FFF7EC'], levels: Wall.levels },
  { id: 'nets', icon: '📦', mode: Nets, color: '#A66CFF', sky: ['#B9A2FF', '#EDE5FF', '#FFF6F0'], levels: Nets.levels },
  { id: 'cube', icon: '🎲', mode: Cube, color: '#FFC233', sky: ['#5FD3C9', '#D5F7F1', '#FFF8E6'], levels: Cube.levels, free: true },
  { id: 'build', icon: '🏰', mode: Build, color: '#3DCC6E', sky: ['#8ED6A0', '#E3F9E7', '#FFF6E6'], levels: Build.levels, free: true },
];
export const totalStars = () => WORLDS.reduce((a, w) => a + w.levels.length * 3, 0);

export const isOpen = (w, i) => Store.d.all || i === 0 || Store.stars(w.id, i - 1) > 0;

let token = 0;
export const Game = {
  scope: null,     // the running screen (map or level)
  world: null, li: 0,
  toMap: null,     // set by main.js

  stop() {
    token++;
    if (this.round) { this.round.scope.dispose(); this.round = null; }
    if (this.scope) { this.scope.dispose(); this.scope = null; }
    if (this.mode?.leave) this.mode.leave();
    this.mode = null;
    Voice.stop();
    UI.clearPanel(); UI.clearTools(); UI.closeCard();
    Stage.clear();
    Stage.lim.orbit = true; Stage.lim.zoom = true;
    Stage.lim.yawMin = -Infinity; Stage.lim.yawMax = Infinity;
    Stage.lim.minPitch = -0.15; Stage.lim.maxPitch = 1.45;
    UI.onResize = null;
  },

  // play level li of world w (li === 'free' for the free-play islands)
  async play(w, li) {
    this.stop();
    const my = ++token;
    this.world = w; this.li = li;
    const scope = this.scope = new Scope();
    const mode = this.mode = w.mode;
    $('#mapUI').classList.add('hidden');
    UI.hud(true); UI.buttons({ home: true, hint: true, say: true, gear: false });
    setSky(...w.sky);
    const free = li === 'free';
    const cfg = free ? mode.freeCfg : w.levels[li];
    const ctx = { world: w, cfg, li, scope, free };
    if (free) { UI.clearDots(); await mode.free(ctx); return; }
    UI.dots(ROUNDS, 0);
    await mode.setup?.(ctx);
    if (my !== token) return;
    // the level's own little introduction, the first time it is played
    const key = w.id + '.' + li;
    const intro = mode.intro?.(cfg, li);
    let mistakes = 0;
    for (let r = 0; r < ROUNDS; r++) {
      const R = this.round = new Round(ctx, r);
      if (r === 0 && intro && !Store.d.seen[key]) { R.introLine = intro; Store.d.seen[key] = 1; Store.save(); }
      const res = await mode.round(R, cfg, r);
      if (my !== token) return;
      mistakes += R.mistakes + R.hinted;
      R.scope.dispose();
      this.round = null;
      UI.dot(r);
      if (r < ROUNDS - 1) await scope.wait(0.5);
      if (my !== token) return;
    }
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    Store.setStars(w.id, li, stars);
    Snd.play('win');
    Voice.cheer(stars === 3 ? 'Unbelievable!' : stars === 2 ? 'Excellent!' : 'Good job!');
    FX.rain(new THREE.Vector3(Stage.cur.tx, Stage.cur.ty, Stage.cur.tz));
    Voice.say(L.stars[stars]);
    const next = li + 1 < w.levels.length ? li + 1 : null;
    UI.result(stars, {
      map: () => this.toMap(w),
      replay: () => this.play(w, li),
      next: next !== null ? () => this.play(w, next) : null,
    });
  },

  hint() { if (this.round?.onHint) { Snd.play('ghost'); this.round.onHint(); this.round.hinted++; } else if (this.mode?.onHint) this.mode.onHint(); },
  repeat() { if (this.round?.lastLine) Voice.say(this.round.lastLine); else Voice.repeat(); },
};

// one question (round): owns its timers and listeners, counts mistakes, says things, cheers
export class Round {
  constructor(ctx, index) {
    this.ctx = ctx; this.index = index; this.scope = new Scope();
    this.mistakes = 0; this.hinted = 0; this.onHint = null; this.lastLine = ''; this.introLine = null;
    this._idle = null;
    // any touch on the page counts as "doing something" for the idle hints
    this.touched = false;
    this.scope.on(window, 'pointerdown', () => { this.touched = true; this.poke(); }, true);
  }
  say(line) { if (!line) return; this.lastLine = line; Voice.say(line); }
  sayWait(line, max) { this.lastLine = line; return Voice.sayWait(line, max); }
  // say the level intro first (only the first time this level is played), then the question
  async ask(line) {
    if (this.introLine) { await this.sayWait(this.introLine, 12); if (this.scope.dead) return; }
    this.say(line);
  }
  miss(n = 1) { this.mistakes += n; Snd.play('wrong'); }
  // a right answer: a cheer that grows with how well the level is going
  good(pos, big) {
    Snd.play('right');
    const lvl = this.mistakes ? 1 : Math.min(5, 2 + this.index + (big ? 1 : 0));
    const word = lvl >= 5 ? 'Unbelievable!' : pick(CHEER[Math.min(lvl, 4)]);
    FX.cheer(word, lvl);
    Voice.cheer(word);
    if (pos) { FX.confetti(pos, 50 + lvl * 15, 4.5); FX.sparkle(pos, 16, { spread: 0.6 }); }
  }
  // call fn after sec seconds without any touch; starts over at every touch
  idle(sec, fn) { this._idle = { sec, fn }; this.poke(); }
  poke() {
    if (this._stop) { this._stop(); this._stop = null; }
    if (this._idle && !this.scope.dead) { const { sec, fn } = this._idle; this._stop = this.scope.after(sec, () => { this._stop = null; fn(); this.poke(); }); }
  }
  wait(s) { return this.scope.wait(s); }
  tween(s, f, o) { return this.scope.tween(s, f, o); }
}

export const debug = params.has('debug');
