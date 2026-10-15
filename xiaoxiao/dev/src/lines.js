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
// Every animal in decli's pictures (heads.webp, cut by dev/heads.py), in their order. The six on the board and the penguin
// (tier -1) are in the album from the start; the others come out of the blind box after a win (gift.js):
// tier 0 普通, 1 稀有, 2 隐藏款.
const FRIENDS = [
  ['panda', '熊猫', -1], ['fox', '小狐狸', 0], ['tiger', '小老虎', 1], ['lion', '小狮子', 1], ['bear', '小棕熊', 0],
  ['polar', '北极熊', 0], ['koala', '考拉', 1], ['bunny', '小兔子', 0], ['corgi', '柯基', 0], ['cat', '小蓝猫', 0],
  ['frog', '小青蛙', -1], ['owl', '猫头鹰', 0], ['chick', '小黄鸡', 0], ['penguin', '小企鹅', -1], ['duck', '小白鸭', 0],
  ['flamingo', '火烈鸟', 1], ['peacock', '孔雀', 1], ['parrot', '鹦鹉', -1], ['budgie', '虎皮鹦鹉', 0], ['pigeon', '小鸽子', 0],
  ['pig', '小猪', -1], ['sheep', '小绵羊', 0], ['cow', '小奶牛', 0], ['horse', '小马', 0], ['deer', '小鹿', 0],
  ['giraffe', '长颈鹿', -1], ['hippo', '河马', -1], ['elephant', '小象', 1], ['rhino', '犀牛', 0], ['croc', '鳄鱼', 0],
  ['squirrel', '松鼠', 0], ['hamster', '仓鼠', 0], ['hedgehog', '刺猬', 0], ['raccoon', '浣熊', 0], ['skunk', '臭鼬', 0],
  ['redpanda', '小熊猫', 1], ['sloth', '树懒', 1], ['fennec', '耳廓狐', 0], ['monkey', '小猴子', 0], ['capybara', '水豚', 0],
  ['turtle', '小海龟', 0], ['seal', '海豹', 0], ['dolphin', '海豚', 1], ['shark', '小鲨鱼', 1], ['clownfish', '小丑鱼', 0],
  ['octopus', '章鱼', 0], ['ladybug', '瓢虫', 0], ['bee', '小蜜蜂', 0], ['dragon', '小龙', 2], ['unicorn', '独角兽', 2],
  ['dog', '小狗', 0], ['dalmatian', '斑点狗', 0], ['siamese', '暹罗猫', 0], ['axolotl', '六角恐龙', 1], ['bat', '小蝙蝠', 0],
  ['alpaca', '羊驼', 1], ['bison', '野牛', 0], ['zebra', '斑马', 1], ['donkey', '小毛驴', 0], ['kangaroo', '袋鼠', 0],
  ['rooster', '大公鸡', 0], ['goose', '大白鹅', 0], ['duckling', '小黄鸭', 0], ['cardinal', '小红鸟', 0], ['chameleon', '变色龙', 1],
  ['puffer', '河豚', 0], ['orca', '虎鲸', 1], ['whale', '小蓝鲸', 0], ['otter', '水獭', 0], ['arcticfox', '北极狐', 0],
].map(([id, name, tier], i) => ({ i, id, name, tier }));
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
