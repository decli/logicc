// 动物消消乐 · start-up and the frame loop.
(function boot() {
  Store.load();
  if (/[?&]debug\b/.test(location.search)) window.XX = { Game, Board, Store, UI, Fx, Clock, MathGate, LEVELS, Snd, Voice };
  Snd.on = Store.d.snd; Snd.music = Store.d.mus; Voice.on = Store.d.voi;
  Fx.init($('#fx'));
  Game.init();
  Game.layout();
  const bar = $('#ldBar');
  bar.style.width = '30%';
  Voice.load();
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
  const wake = () => { Snd.init(); Voice.unlock(); if (Snd.ctx) { Snd.setOn(Store.d.snd); } };
  addEventListener('pointerdown', wake, true);
  Art.load().then(() => {
    bar.style.width = '100%';
    Art.setCell(64, Math.min(devicePixelRatio || 1, 2));
    const ld = $('#loader');
    ld.innerHTML = '';
    const pic = el('canvas'); pic.width = pic.height = 300; pic.style.width = pic.style.height = '150px';
    const px = pic.getContext('2d');
    [[0, 30, 120], [1, 150, 100], [2, 80, 190], [3, 200, 200]].forEach(([k, x, y]) => px.drawImage(Art.head(k, 130, 110), x - 65, y - 65));
    ld.appendChild(pic);
    ld.appendChild(el('div', null, '<span style="font-size:40px;font-weight:900;color:#fff;-webkit-text-stroke:2px #4a2b5e;paint-order:stroke fill;text-shadow:0 4px 0 #4a2b5e">动物消消乐</span>'));
    const go = el('button', 'btn green', '开始玩 ▶');
    go.onclick = () => {
      wake(); Snd.play('tap');
      ld.classList.add('gone'); setTimeout(() => ld.remove(), 450);
      UI.map();
      Voice.say(Store.d.played ? L.pick : L.welcome);
    };
    ld.appendChild(go);
    if (/[?&]go\b/.test(location.search)) go.onclick();   // ?go skips the start button (for testing)
  });
  document.addEventListener('visibilitychange', () => {
    if (!Snd.ctx) return;
    if (document.hidden) { Snd.ctx.suspend(); Voice.stop(); } else Snd.ctx.resume();
  });
})();
