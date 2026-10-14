// 动物消消乐 · everything the narrator says. dev/voice/collect.js reads this file (with levels.js and board.js) to
// list every line for recording, so a line built from a level must be built here and nowhere else.
const NUM_ZH = n => String(n);   // the voice reads digits naturally ("18只" → 十八只)

function goalSay(g, lv) {
  if (g.t === 'c') return `${g.n}只${ANIMALS[g.color].name}`;
  if (g.t === 'ice') return '敲碎所有冰块';
  if (g.t === 'box') return '拆开所有礼物盒';
  if (g.t === 'bub') return '戳破所有泡泡';
  if (g.t === 'pg') return `把${lv.penguins.total}只小企鹅送回家`;
  return '';
}
const L = {
  welcome: '欢迎来到动物消消乐！点一个关卡开始吧。',
  pick: '选一关吧！',
  locked: '这一关还锁着，先把前面的关过了吧。',
  intro(lv, n) {
    const collect = lv.goals.filter(g => g.t === 'c').map(g => goalSay(g, lv));
    const other = lv.goals.filter(g => g.t !== 'c').map(g => goalSay(g, lv));
    const parts = [...other];
    if (collect.length) parts.push('收集' + collect.join('、'));
    return `第${NUM_ZH(n)}关，${lv.name}。要${parts.join('，还要')}，一共${NUM_ZH(lv.moves)}步。`;
  },
  tip: {
    swap: '手指按住一只小动物，往旁边一拨，三只一样的连成一排就能消掉。四只连成一排，会变出条纹小动物！',
    ice: '冰块上面的小动物被消掉，冰块就碎了。把冰块全部敲碎吧！',
    box: '在礼物盒旁边消一消，礼物盒就打开了。',
    penguin: '小企鹅不能消。把它下面的小动物消掉，它就往下走，走到最下面就回家啦。',
    bub: '泡泡里的小动物挪不动。让它和旁边的连成一排，泡泡就破了。',
    ice2: '厚厚的冰块有两层，要敲两次才会碎。',
    box2: '紫色的大礼物盒有两层，要拆两次。小企鹅被挡住了，先把礼物盒拆开！',
    six: '这一关有六种小动物，不容易连上，多想一想再动手。',
    final: '最后一关啦！冰块、礼物盒和小企鹅都在，加油！',
  },
  made: {
    h: '哇，条纹小动物！把它和旁边换一换，就能消掉一整行！',
    v: '哇，条纹小动物！把它和旁边换一换，就能消掉一整列！',
    b: '变出了炸弹小动物！摆成L形或者T形就能变出它，它会把周围炸开！',
    c: '哇，彩虹球！五只连成一排才有！把它和任意一只小动物换一换，一样的全都消掉！',
  },
  combo: '两个特别的小动物换在一起，威力更大！',
  movesLow: '只剩5步啦！',
  noMoves: '没有能消的了，洗一洗再来！',
  penguinHome: '小企鹅回家啦！',
  win: ['过关啦！太棒了！', '成功啦！你真厉害！', '过关啦！小动物们都在为你鼓掌！'],
  stars: ['', '得到了一颗星！', '得到了两颗星！', '三颗星！太厉害了！'],
  fail: '步数用完啦，就差一点点！',
  extraOffer: '做5道数学题，就能再多5步！',
  extraDone: '多了5步，加油！',
  allDone: '十关全部通过啦！你是消消乐大师！',
  math: {
    start: '玩之前，先做一页数学题吧！20道题都做对，就能接着玩啦。',
    extra: '做对5道题，就多给你5步！',
    right: ['对啦！', '真棒！', '答对了！', '没错！', '好厉害！'],
    wrong: '再想一想。',
    show: '看看正确答案，照着写一遍。',
    half: '已经做完一半啦！',
    done: '全部做完啦！真厉害，去玩吧！',
    doneExtra: '做完啦！多给你5步！',
  },
  parent: '这里是给爸爸妈妈的设置哦。',
};
// English cheers, said by a lively child voice (role p in the voice bank)
const CHEER = ['', 'Good!', 'Great!', 'Excellent!', 'Amazing!', 'Unbelievable!'];
const BONUS = 'Bonus time!';
