/* =====================================================================
   造物 · story — the guided first walk through the world, told aloud with
   lines from old books. Every step can also happen out of order.
   Lines are stored as keys, so switching language re-tells them.
   ===================================================================== */
const Story = (() => {
  const el = { inscr: $('#inscr'), quote: $('#quote'), src: $('#quoteSrc'), qen: $('#quoteEn'), line: $('#line'), hint: $('#hint'), hintText: $('#hintText'), skip: $('#skip'), brand: $('#brand'), btnX: $('#btnX'), resume: $('#resume') };
  let step = 'chaos', stepT = 0, lastTreeT = -99, toastTimer = 0, lineTimers = [], touched = false;
  const flags = { born: 0, poked: false, flung: false, clouds: 0, rainbow: false, night: false, xray: false, fed: false, chorus: false };
  let dryT = 0, insTok = 0, hintTok = 0;
  let curQ = null, curLine = null, curHint = null;
  const fill = v => (v && v.c ? Object.assign({}, v, { name: v.c.name }) : v);

  function inscribe(q, src, speak = true) {
    curQ = q ? { q, src } : null;
    const tok = ++insTok;
    el.inscr.classList.remove('on');
    setTimeout(() => { if (tok !== insTok) return; paintQuote(); if (q) el.inscr.classList.add('on'); }, 700);
    if (q && speak) Voice.narrate(quoteSpeech(q), 'story');
  }
  function paintQuote() {
    if (!curQ) return;
    const zh = STR[curQ.q][0].split('|');
    el.quote.innerHTML = zh[0] + (zh[1] ? '<br>' + zh[1] : '');
    el.src.textContent = STR[curQ.src][0];
    el.qen.textContent = isEn() ? STR[curQ.q][1] + ' — ' + STR[curQ.src][1] : '';
    el.qen.hidden = !isEn();
  }
  function line(key, vars, o = {}) {
    curLine = key ? { key, vars } : null;
    const text = key ? L(key, fill(vars)) : '';
    lineTimers.forEach(clearTimeout); lineTimers = [];
    lineTimers.push(setTimeout(() => {
      el.line.classList.remove('on');
      lineTimers.push(setTimeout(() => { el.line.textContent = text; if (text) el.line.classList.add('on'); }, 450));
    }, o.delay || 0));
    if (text && o.speak !== false) Voice.narrate(text, o.tag || 'story');
    return text;
  }
  function hint(key, vars, speak = true) {
    curHint = key ? { key, vars } : null;
    const text = key ? L(key, fill(vars)) : '';
    const tok = ++hintTok;
    el.hint.classList.remove('on');
    setTimeout(() => { if (tok !== hintTok) return; el.hintText.textContent = text; if (text) el.hint.classList.add('on'); }, 350);
    if (text && speak) Voice.narrate(text, 'story');
  }
  function toast(text) {
    const prev = curLine, at = step;
    lineTimers.forEach(clearTimeout); lineTimers = [];
    el.line.classList.remove('on');
    lineTimers.push(setTimeout(() => { el.line.textContent = text; el.line.classList.add('on'); }, 350));
    Voice.narrate(text, 'toast');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { if (el.line.textContent === text) { if (step === at && prev && step !== 'done') line(prev.key, prev.vars, { speak: false }); else line(null); } }, 3600);
  }

  function go(next) {
    step = next; stepT = 0;
    Voice.clear('story');
    const S = STEPS[next]; if (S && S.enter) S.enter();
  }

  const STEPS = {
    tree: {
      enter() { inscribe('q_tree', 'q_tree_src'); line('tree_line'); hint('tree_hint'); },
      check() { const n = world.trees.length; return (n >= 2 && world.t - lastTreeT > 4) || (n >= 1 && stepT > 18); }, next: 'cloud',
    },
    cloud: {
      enter() { inscribe('q_rain', 'q_rain_src'); line('cloud_line'); hint('cloud_hint'); },
      update(dt) { if (flags.clouds > 0 && !world.clouds.some(c => c.user && c.rain > 0)) dryT += dt; else dryT = 0; },
      check() { return flags.clouds > 0 && dryT > (flags.rainbow ? 5 : 2) && world.flowers.length > 2; }, next: 'creature',
    },
    creature: {
      enter() { inscribe('q_nuwa', 'q_nuwa_src'); line('creature_line'); hint('creature_hint'); },
      check() { return flags.born > 0 && ((flags.poked || flags.flung) && stepT > 8 || stepT > 40); }, next: 'friends',
    },
    friends: {
      enter() { line('friends_line'); hint('friends_hint'); },
      check() { return (world.creatures.length >= 3 && stepT > 8) || (world.creatures.length >= 2 && stepT > 16) || stepT > 32; }, next: 'shake',
    },
    shake: {
      enter() { line('shake_line'); hint('shake_hint'); },
      check() { return (flags.fed && stepT > 5) || stepT > 35 || !world.trees.length; }, next: 'night',
    },
    night: {
      enter() { inscribe('q_night', 'q_night_src'); line('night_line'); hint('night_hint'); },
      update(dt) { if (stepT > 20 && world.sky.night < 0.7 && !Input.draggingSky) world.speedBoost = 12; },
      check() { return world.sky.night > 0.8; }, next: 'nightfall',
    },
    nightfall: {
      enter() { world.speedBoost = 1; flags.night = true; line('nightfall_line'); hint('nightfall_hint'); },
      check() { return stepT > 14; }, next: 'free',
    },
    free: {
      enter() {
        inscribe('q_one', 'q_one_src');
        line('free_line'); hint('free_hint');
        el.btnX.classList.add('pulse'); el.skip.classList.remove('on');
        setTimeout(() => { if (step === 'free' || step === 'done') line('reveal_line'); }, 12000);
        setTimeout(() => { if (step === 'free') go('done'); }, 24000);
      },
    },
    done: {
      enter() { line(null); hint('done_hint', null, false); setTimeout(() => { if (step === 'done') hint(null); }, 10000); },
    },
  };

  function update(dt) {
    stepT += dt;
    const S = STEPS[step];
    if (S) { if (S.update) S.update(dt); if (S.check && S.check()) go(S.next); }
    if (world.phase === 'world') {
      if (world.sky.night > 0.8) Stickers.give('night');
      if (world.flowers.length >= 30) Stickers.give('flowers');
    }
  }

  onLang(() => {
    paintQuote();
    if (curLine) { el.line.textContent = L(curLine.key, fill(curLine.vars)); }
    if (curHint) { el.hintText.textContent = L(curHint.key, fill(curHint.vars)); }
    Voice.stopAll();
    if (curLine && touched) Voice.narrate(el.line.textContent, 'story');
    if (curHint && touched && step !== 'done') Voice.narrate(el.hintText.textContent, 'story');
  });

  return {
    get step() { return step; },
    start(saved) {
      inscribe('q_chaos', 'q_chaos_src', false);
      line('chaos_line', null, { delay: 600, speak: false });
      setTimeout(() => { if (step === 'chaos' && !touched) hint('chaos_hint', null, false); }, 2600);
      if (saved && el.resume) { el.resume.hidden = false; setTimeout(() => el.resume.classList.add('on'), 2600); }
    },
    // the very first touch unlocks sound, so that is when the narrator starts reading
    firstTouch() {
      if (touched) return; touched = true;
      Voice.unlock();
      Voice.narrate(quoteSpeech('q_chaos'), 'story');
      Voice.narrate(L('chaos_line'), 'story');
      Voice.narrate(L('chaos_hint'), 'story');
      hint('chaos_hint', null, false);
    },
    get touched() { return touched; },
    chaosTap(n) {
      Voice.clear('story');
      if (n === 1) { line('tap1_line'); hint('tap1_hint'); }
      if (n === 2) { line('tap2_line'); hint('tap2_hint'); }
    },
    genesis() {
      step = 'genesis'; touched = true;
      Voice.stopAll();
      if (el.resume) { el.resume.classList.remove('on'); setTimeout(() => (el.resume.hidden = true), 600); }
      inscribe('q_gen', 'q_chaos_src');
      line('gen_line'); hint(null);
    },
    worldReady() {
      Main.showDay();
      el.brand.classList.add('world');
      el.skip.classList.add('on');
      Snd.startPad();
      setTimeout(() => go('tree'), 900);
    },
    resumed() {
      touched = true;
      el.brand.classList.add('world');
      inscribe('q_one', 'q_one_src', false);
      line('welcome_back'); hint('done_hint', null, false);
      setTimeout(() => { if (step === 'done') { line(null); hint(null); } }, 10000);
      Snd.startPad();
      step = 'done';
    },
    skip() {
      if (world.phase === 'chaos') { touched = true; Genesis.begin(); return; }
      world.speedBoost = 1;
      go('free');
    },
    event(kind, arg) {
      if (kind === 'tree') {
        lastTreeT = world.t;
        Stickers.tree(arg && arg.type);
        if (step === 'tree') {
          const n = world.trees.length;
          if (n === 1) { Voice.clear('story'); line('tree1_line'); hint('tree1_hint'); }
          else if (n === 2) { Voice.clear('story'); line('tree2_line'); hint(null); }
        }
      } else if (kind === 'cloud') {
        flags.clouds++; Stickers.give('rain');
        if (step === 'cloud' && flags.clouds === 1) { Voice.clear('story'); line('rain_line'); hint(null); }
      } else if (kind === 'rainbow') {
        flags.rainbow = true; Stickers.give('rainbow');
        if (step === 'cloud' || step === 'creature') line('rainbow_line');
      } else if (kind === 'born') {
        flags.born++; Stickers.give('born');
        if (flags.born === 1) { line('born_line', { c: arg }, { delay: 300 }); hint('born_hint'); }
        else if (step === 'friends' && flags.born === 2) { line('born2_line', { c: arg }); hint(null); }
      } else if (kind === 'poke') {
        if (!flags.poked && (step === 'creature' || step === 'friends')) { Voice.clear('story'); line('poke_line', { c: arg }); hint(null); }
        flags.poked = true;
      } else if (kind === 'fling') {
        if (!flags.flung && (step === 'creature' || step === 'friends')) line('fling_line');
        flags.flung = true;
      } else if (kind === 'fed') {
        flags.fed = true;
      } else if (kind === 'chorus') {
        if (!flags.chorus) { flags.chorus = true; if (['friends', 'shake', 'done', 'night'].includes(step)) toast(L('chorus_toast')); }
      } else if (kind === 'xray') {
        flags.xray = true; el.btnX.classList.remove('pulse'); Stickers.give('xray');
        if (step === 'free') go('done');
      }
    },
    wantsFlowers() { return step === 'cloud'; },
    toast,
    update,
  };
})();
