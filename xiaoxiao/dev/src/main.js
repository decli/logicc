// 动物消消乐 · start-up and the frame loop.
(function boot() {
  Store.load();
  if (/[?&]debug\b/.test(location.search)) window.XX = { Game, Board, Store, UI, Fx, Clock, MathGate, Wheel, Teach, L, LEVELS, ISLANDS, Snd, Voice, Music, Gift, Cast, ANIMALS, FRIENDS, Art, Art2, Pal };
  Snd.on = Store.d.snd; Snd.music = Store.d.mus; Voice.on = Store.d.voi;
  Fx.init($('#fx'));
  Game.init();
  Game.layout();
  const bar = $('#ldBar');
  bar.style.width = '30%';
  Title.early();   // the island she is on, behind the name, before any picture has come
  $('#loader .tHome').onclick = () => { Voice.stop(); location.href = '../'; };
  Voice.load();
  Art2.load();
  Snd.load(['bg1', 'bg2', 'great', 'excellent', 'unbelievable']);
  let last = performance.now();
  const loop = now => {
    const dt = Math.min(50, now - last); last = now;
    Clock.tick(dt);
    Fx.update(dt);
    Game.frame(dt);
    Game.draw();
    Fx.draw();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  // the first touch anywhere wakes up sound (browsers keep it off until then)
  const wake = () => { Snd.init(); if (Snd.ctx) { Snd.setOn(Store.d.snd); } };
  addEventListener('pointerdown', wake, true);
  Art.load().then(() => {
    bar.style.width = '100%';
    Art.setCell(64, Math.min(devicePixelRatio || 1, 2));
    const ld = $('#loader');
    // the start screen's button: sound wakes up, the island flies at her and the map opens behind it
    const go = () => {
      wake(); Snd.play('tap');
      setTimeout(() => ld.classList.add('gone'), 150); setTimeout(() => ld.remove(), 650);
      const freed = Store.newDay();   // the first game of the day: a page owed from before is let go, and she is told
      UI.map();
      Voice.say(freed ? L.math.freeDay : Store.d.played ? L.pick : L.welcome);
    };
    if (/[?&]go\b/.test(location.search)) { ld.remove(); go(); return; }   // ?go skips the start screen (for testing)
    Title.ready(go);
  });
  document.addEventListener('visibilitychange', () => {
    if (!Snd.ctx) return;
    if (document.hidden) { Snd.ctx.suspend(); Voice.stop(); } else Snd.ctx.resume();
  });
})();
