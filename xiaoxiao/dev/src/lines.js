// 动物消消乐 · everything the narrator says. dev/voice/collect.js reads this file (with levels.js and board.js) to
// list every line for recording, so a line built from a level must be built here and nowhere else.
const KID = '可可';   // decli's daughter, who plays this
// how many sums a math page has (家长设置). By default she spins a wheel before each page and does what it lands on,
// 2 to 10 (decli 2026-10-19, evening: sums feel like a chore, make drawing them a game). A parent can pick the day's
// ramp instead (2, 6, 12, then 20 every time after, back to 2 the next day) or one fixed size.
const MATH_WHEEL = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const MATH_RAMP = [2, 6, 12, 20];
const MATH_COUNTS = [5, 10, 15, 20];
const NUM_ZH = n => String(n);   // the voice reads digits naturally ("18只" → 十八只)

// the animals change every game (cast.js), so a line never names them: the intro says how many kinds to collect and
// their names follow as clips of their own (L.gift.names), each with its goal picture bouncing (UI.intro)
function goalSay(g, lv) {
  if (g.t === 'ice') return '敲碎所有冰块';
  if (g.t === 'box') return '拆开所有礼物盒';
  if (g.t === 'bub') return '戳破所有泡泡';
  if (g.t === 'pg') return `把${lv.penguins.total}只小企鹅送回家`;
  return '';
}
// Every animal in decli's pictures (heads.webp, cut by dev/heads.py), in their order: [id, name, tier, colour].
// tier: -1 in the album from the start (the first six on the board and the penguin), else from the blind box after a
// win (gift.js): 0 普通, 1 稀有, 2 隐藏款. colour: the head's main colour, so a game's six animals all look different
// (cast.js): p pink, w white, k black and white, v purple, y yellow, o orange, r red, g green, l blue, t teal,
// b brown, a grey. A second letter: it also looks like that colour (the pigeon is grey-purple), so it never plays next
// to those either (decli: some animals look very much alike).
const FRIENDS = [
  ['panda', '熊猫', -1, 'k'], ['fox', '小狐狸', 0, 'o'], ['tiger', '小老虎', 1, 'o'], ['lion', '小狮子', 1, 'o'], ['bear', '小棕熊', 0, 'b'],
  ['polar', '北极熊', 0, 'w'], ['koala', '考拉', 1, 'a'], ['bunny', '小兔子', 0, 'p'], ['corgi', '柯基', 0, 'o'], ['cat', '小蓝猫', 0, 'l'],
  ['frog', '小青蛙', -1, 'g'], ['owl', '猫头鹰', 0, 'v'], ['chick', '小黄鸡', 0, 'y'], ['penguin', '小企鹅', -1, 'k'], ['duck', '小白鸭', 0, 'w'],
  ['flamingo', '火烈鸟', 1, 'p'], ['peacock', '孔雀', 1, 't'], ['parrot', '鹦鹉', -1, 'r'], ['budgie', '虎皮鹦鹉', 0, 'l'], ['pigeon', '小鸽子', 0, 'av'],
  ['pig', '小猪', -1, 'p'], ['sheep', '小绵羊', 0, 'w'], ['cow', '小奶牛', 0, 'k'], ['horse', '小马', 0, 'b'], ['deer', '小鹿', 0, 'b'],
  ['giraffe', '长颈鹿', -1, 'y'], ['hippo', '河马', -1, 'v'], ['elephant', '小象', 1, 'l'], ['rhino', '犀牛', 0, 't'], ['croc', '鳄鱼', 0, 'g'],
  ['squirrel', '松鼠', 0, 'o'], ['hamster', '仓鼠', 0, 'o'], ['hedgehog', '刺猬', 0, 'b'], ['raccoon', '浣熊', 0, 'a'], ['skunk', '臭鼬', 0, 'k'],
  ['redpanda', '小熊猫', 1, 'o'], ['sloth', '树懒', 1, 'b'], ['fennec', '耳廓狐', 0, 'o'], ['monkey', '小猴子', 0, 'b'], ['capybara', '水豚', 0, 'b'],
  ['turtle', '小海龟', 0, 'g'], ['seal', '海豹', 0, 'a'], ['dolphin', '海豚', 1, 'l'], ['shark', '小鲨鱼', 1, 'l'], ['clownfish', '小丑鱼', 0, 'o'],
  ['octopus', '章鱼', 0, 'p'], ['ladybug', '瓢虫', 0, 'r'], ['bee', '小蜜蜂', 0, 'y'], ['dragon', '小龙', 2, 't'], ['unicorn', '独角兽', 2, 'w'],
  ['dog', '小狗', 0, 'o'], ['dalmatian', '斑点狗', 0, 'k'], ['siamese', '暹罗猫', 0, 'w'], ['axolotl', '六角恐龙', 1, 'p'], ['bat', '小蝙蝠', 0, 'v'],
  ['alpaca', '羊驼', 1, 'w'], ['bison', '野牛', 0, 'b'], ['zebra', '斑马', 1, 'k'], ['donkey', '小毛驴', 0, 'a'], ['kangaroo', '袋鼠', 0, 'o'],
  ['rooster', '大公鸡', 0, 'r'], ['goose', '大白鹅', 0, 'w'], ['duckling', '小黄鸭', 0, 'y'], ['cardinal', '小红鸟', 0, 'r'], ['chameleon', '变色龙', 1, 'g'],
  ['puffer', '河豚', 0, 'o'], ['orca', '虎鲸', 1, 'k'], ['whale', '小蓝鲸', 0, 'l'], ['otter', '水獭', 0, 'b'], ['arcticfox', '北极狐', 0, 'w'],
].map(([id, name, tier, fam], i) => ({ i, id, name, tier, fam }));
const L = {
  welcome: '欢迎来到动物消消乐！点一个关卡开始吧。',
  pick: '选一关吧！',
  locked: '这一关还锁着，先把前面的关过了吧。',
  intro(lv, n) {
    const kinds = lv.goals.filter(g => g.t === 'c').length;
    const parts = lv.goals.filter(g => g.t !== 'c').map(g => goalSay(g, lv));
    if (kinds) parts.push(`收集${['', '这种', '这两种', '这三种'][kinds]}小动物：`);
    return `第${NUM_ZH(n)}关，${lv.name}，一共${NUM_ZH(lv.moves)}步。要${parts.join('，还要')}` + (kinds ? '' : '。');
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
  // said once, the first time she makes each special piece; the piece itself shows what it does (Game.showOff)
  made: {
    h: '条纹小动物！能消掉一整行！',
    v: '条纹小动物！能消掉一整列！',
    b: '炸弹小动物！能炸开一大片！',
    c: '彩虹球！一样的全都消掉！',
  },
  combo: '两个特别的合体，威力更大！',
  bubStuck: '泡泡里的挪不动哦！',
  movesLow: '只剩5步啦！',
  noMoves: '没有能消的了，洗一洗再来！',
  penguinHome: '小企鹅回家啦！',
  win: ['过关啦！太棒了！', '成功啦！你真厉害！', '过关啦！小动物们都在为你鼓掌！'],
  stars: ['', '得到了一颗星！', '得到了两颗星！', '三颗星！太厉害了！'],
  fail: '步数用完啦，就差一点点！',
  extraOffer: '做5道数学题，就能再多5步！',
  extraDone: '多了5步，加油！',
  allDone: '十关全部通过啦！你是消消乐大师！',
  // decli: call her by name on the math page, every right answer is praise for 可可
  math: {
    title: `${KID}，敢不敢先挑战一页数学题？`,
    start: n => `${KID}，敢不敢先挑战一页数学题？${n}道题都做对，就能接着玩啦。`,   // recorded for every size above
    extra: '做对5道题，就多给你5步！',
    right: [`${KID}，你答对啦！`, `${KID}真棒！`, `${KID}，完全正确！`, `${KID}，你好厉害！`, `${KID}，没错，就是这样！`],
    // the first wrong answer: one short hint about what went wrong (MathGate.why), not the answer
    why: {
      sub: '看清楚，这道是减法，要拿走哦。',
      add: '看清楚，这道是加法，要加上哦。',
      sign: '看清楚每个符号，是加还是减？',
      near: '就差一点点！再仔细数一数。',
      swap: '两个数字写反啦，再看看。',
      ones: '个位对啦！十位再想一想。',
      big: '个位不够减，要拆开一捆十哦。',
      other: '没关系，再想一想。',
    },
    show: '看看正确答案，照着写一遍。',
    half: `${KID}，已经做完一半啦！`,
    done: `${KID}，全部做完啦！真厉害，去玩吧！`,
    doneExtra: `${KID}，做完啦！多给你5步！`,
  },
  // the wheel before a math page (wheel.js): every number is good news
  wheel: {
    ask: `${KID}，点一下转盘，看看这次做几道题！`,
    land: n => n <= 4 ? `转到${n}道题！${KID}，热热身吧！` : n <= 7 ? `转到${n}道题！不多不少，${KID}加油！` : `哇，转到${n}道题！${KID}，接受挑战吧！`,
  },
  // 小老师 (teach.js): after the second wrong answer, or 💡, the animals act the sum out one tap at a time
  teach: {
    open: `${KID}，别着急，我们请小动物来帮忙！`,
    add: '加几个，就请进来几个。点一点！',
    sub: '减几个，就送走几个。点一点！',
    tie: '满十个啦，捆成一捆！',
    untie: '个数不够了，拆开一捆！',
    tap: '点一点这里。',
    end: '小动物都摆好啦！把答案写在上面吧。',
    again: '没关系，看着小动物，再数一数。',
    self: `${KID}，你一步一步想出来啦！真棒！`,
    twin: '再来一道差不多的，自己试试！',
    nums: Array.from({ length: 101 }, (_, i) => String(i)),   // every step says the new total
  },
  parent: '这里是给爸爸妈妈的设置哦。',
  gift: {
    drop: '过关礼物！是一个神秘盲盒，点它三下，打开看看！',
    rare: '稀有款！运气真好！',
    hidden: '天哪！是隐藏款！超级超级难得！',
    got: FRIENDS.map(f => `哇！是${f.name}！`),
    again: '又抽到它啦！',
    full: '所有的动物小伙伴都集齐啦！你是收集大王！',
    album: '这是你的动物收集册。每过一关就能拆一个盲盒，把小伙伴都集齐吧！',
    names: FRIENDS.map(f => f.name),
    locked: '还没抽到它呢，过关拆盲盒就有机会哦！',
  },
};
// English cheers for each step of excitement (excitement() in board.js): decli's own recordings in sound/, not the
// voice bank. Level 0 says nothing.
const CHEER = ['', 'Great!', 'Great!', 'Excellent!', 'Excellent!', 'Unbelievable!'];
const CHEER_CLIP = { 'Great!': 'great', 'Excellent!': 'excellent', 'Unbelievable!': 'unbelievable' };
const BONUS = 'Bonus time!';   // shown over the board when the moves left turn into stripes; there is no recording of it
