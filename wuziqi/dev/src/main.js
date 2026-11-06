// 五子棋 · start
Store.load();
Voice.on = Store.d.voi; Snd.on = Store.d.snd;
Voice.load();
Board.init($('#cv'));
Fx.init($('#fx'));
addEventListener('pointerdown', () => Snd.init(), { capture: true, once: true });
addEventListener('resize', () => { if (!$('#play').hidden) UI.layout(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) Voice.stop(); });
UI.menu();
// the first touch wakes up sound, and the welcome is said then (browsers keep sound off until a touch)
addEventListener('pointerdown', () => { if (!$('#menu').hidden && !Voice.last) Voice.say(L.welcome); }, { once: true });
if (/[?&]debug\b/.test(location.search)) window.WZ = { Gomoku, UI, Board, Store, Voice, L, OPPS };
