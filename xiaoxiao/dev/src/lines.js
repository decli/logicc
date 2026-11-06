// 动物消消乐 · everything the narrator says. dev/voice/collect.js reads this file (with levels.js and board.js) to
// list every line for recording, so a line built from a level must be built here and nowhere else.
const KID = '小朋友';   // how the narrator calls the child (decli 2026-11-05: no names, for privacy)
// how many sums a math page has (家长设置). By default the child spins a wheel before each page and does what it lands
// on (decli 2026-10-19, evening: sums feel like a chore, make drawing them a game). decli 2026-11-05: short pages too,
// so nobody dreads it; each page goes from easy to hard (MathGate.page). decli 2026-11-06: 2, 4, 6, 8, 9, 10, 11, 12 by
// default (16 was a lot), and a parent can put any of 0 to MATH_MOST on the wheel (Store.d.math.wheel; landing on 0
// means no sums this time). A parent can also pick the day's ramp (2, 6, 12, then 20 every time after, back to 2 the
// next day) or one fixed size.
const MATH_WHEEL = [2, 4, 6, 8, 9, 10, 11, 12];
const MATH_MOST = 20;
const MATH_RAMP = [2, 6, 12, 20];
const MATH_COUNTS = [5, 10, 15, 20];
const NUM_ZH = n => String(n);   // the voice reads digits naturally ("18只" → 十八只)

// the animals change every game (cast.js), so a line never names them: the intro says how many kinds to collect and
// their names follow as clips of their own (L.gift.names), each with its goal picture bouncing (UI.intro)
function goalSay(g, lv) {
  const count = chs => (lv.layout || []).join('').split('').filter(ch => chs.includes(ch)).length;
  if (g.t === 'ice') return '敲碎所有冰块';
  if (g.t === 'box') return '拆开所有礼物盒';
  if (g.t === 'bub') return '戳破所有泡泡';
  if (g.t === 'pg') return `把${lv.penguins.total}只小企鹅送回家`;
  // season two
  if (g.t === 'egg') return `把${count('e')}个蛋宝宝都孵出来`;
  if (g.t === 'grass') return '把土地都种上小草';
  if (g.t === 'bl') return `把${count('l')}个气球都送上天`;
  if (g.t === 'cage') return `把笼子里的${count('012345')}个小伙伴都救出来`;
  return '';
}
// Every character of decli's 怪趣森林 pictures (decli 2026-11-05; dev/art/heads2/HEADS.md, packed by dev/heads2.py in
// this order): [id, name, tier, colour, island, temper]. The first seventy are the animals of the first pictures (same
// ids, so what was collected stays), then thirty more: vegetables, flowers, weather, sweets and fairy-tale people.
// tier: -1 on the board and in the album from the start, else from the blind box: 0 普通, 1 稀有, 2 隐藏款 (never on the
// board). colour: the face's main colour, so a game's animals all look different (cast.js): p pink, w white,
// k black and white, v purple, y yellow, o orange, r red, g green, l blue, t teal, b brown, a grey. island: ISLANDS'
// number where it lives — its levels draw it first, and so do its blind boxes. temper: its nickname (小猪·乐呵呵).
const FRIENDS = [
  ['panda', '熊猫', -1, 'k', 0, '小机灵'], ['fox', '小狐狸', 0, 'o', 2, '鬼点子'], ['tiger', '小老虎', 1, 'o', 4, '威风'], ['lion', '小狮子', 1, 'o', 4, '臭美'], ['bear', '小棕熊', 0, 'b', 2, '暖心'],
  ['polar', '北极熊', 0, 'w', 3, '冷静'], ['koala', '考拉', 1, 'a', 4, '瞌睡虫'], ['bunny', '小兔子', 0, 'p', 1, '蹦蹦'], ['corgi', '柯基', 0, 'o', 1, '小短腿'], ['cat', '小蓝猫', 0, 'l', 1, '傲娇'],
  ['frog', '小青蛙', -1, 'g', 0, '元气派'], ['owl', '猫头鹰', 0, 'v', 3, '小老师'], ['chick', '小黄鸡', 0, 'y', 1, '刚出壳'], ['penguin', '小企鹅', -1, 'k', 0, '乖乖仔'], ['duck', '小白鸭', 0, 'w', 1, '嘎嘎嘎'],
  ['flamingo', '火烈鸟', 1, 'p', 3, '优雅'], ['peacock', '孔雀', 1, 't', 3, '爱显摆'], ['parrot', '鹦鹉', -1, 'r', 0, '话痨王'], ['budgie', '虎皮鹦鹉', 0, 'l', 3, '复读机'], ['pigeon', '小鸽子', 0, 'a', 3, '咕咕'],
  ['pig', '小猪', -1, 'p', 0, '乐呵呵'], ['sheep', '小绵羊', 0, 'w', 1, '软绵绵'], ['cow', '小奶牛', 0, 'k', 1, '慢悠悠'], ['horse', '小马', 0, 'b', 1, '爱臭美'], ['deer', '小鹿', 0, 'b', 2, '害羞'],
  ['giraffe', '长颈鹿', -1, 'y', 0, '好奇鬼'], ['hippo', '河马', -1, 'v', 0, '慢半拍'], ['elephant', '小象', 1, 'l', 0, '温柔'], ['rhino', '犀牛', 0, 't', 4, '横冲直撞'], ['croc', '鳄鱼', 0, 'g', 4, '笑面虎'],
  ['squirrel', '松鼠', 0, 'o', 2, '囤囤囤'], ['hamster', '仓鼠', 0, 'o', 2, '小吃货'], ['hedgehog', '刺猬', 0, 'b', 2, '小刺头'], ['raccoon', '浣熊', 0, 'a', 4, '小偷偷'], ['skunk', '臭鼬', 0, 'k', 4, '小捣蛋'],
  ['redpanda', '小熊猫', 1, 'o', 4, '不好意思'], ['sloth', '树懒', 1, 'b', 4, '慢慢来'], ['fennec', '耳廓狐', 0, 'y', 4, '大耳朵'], ['monkey', '小猴子', 0, 'b', 4, '调皮'], ['capybara', '水豚', 0, 'b', 2, '佛系'],
  ['turtle', '小海龟', 0, 'g', 0, '慢吞吞'], ['seal', '海豹', 0, 'a', 0, '拍拍手'], ['dolphin', '海豚', 1, 'l', 0, '开心果'], ['shark', '小鲨鱼', 1, 'l', 0, '假装凶'], ['clownfish', '小丑鱼', 0, 'o', 0, '快乐泡泡'],
  ['octopus', '章鱼', 0, 'p', 0, '手忙脚乱'], ['ladybug', '瓢虫', 0, 'r', 2, '小乖乖'], ['bee', '小蜜蜂', 0, 'y', 2, '勤快'], ['dragon', '小龙', 2, 'w', 5, '守宝藏'], ['unicorn', '独角兽', 2, 'w', 3, '梦幻'],
  ['dog', '小狗', 0, 'b', 1, '跟屁虫'], ['dalmatian', '斑点狗', 0, 'k', 1, '跑跑跑'], ['siamese', '暹罗猫', 0, 'w', 1, '高冷'], ['axolotl', '六角恐龙', 1, 'p', 0, '笑嘻嘻'], ['bat', '小蝙蝠', 0, 'v', 3, '夜猫子'],
  ['alpaca', '羊驼', 1, 'w', 1, '无语'], ['bison', '野牛', 0, 'b', 1, '倔牛'], ['zebra', '斑马', 1, 'k', 4, '酷酷的'], ['donkey', '小毛驴', 0, 'a', 1, '倔脾气'], ['kangaroo', '袋鼠', 0, 'o', 4, '蹦蹦跳'],
  ['rooster', '大公鸡', 0, 'r', 1, '早起鸟'], ['goose', '大白鹅', 0, 'w', 1, '凶巴巴'], ['duckling', '小黄鸭', 0, 'y', 1, '呆萌'], ['cardinal', '小红鸟', 0, 'r', 3, '小气包'], ['chameleon', '变色龙', 1, 'g', 4, '眼珠乱转'],
  ['puffer', '河豚', 0, 'l', 0, '气鼓鼓'], ['orca', '虎鲸', 1, 'k', 0, '大嗓门'], ['whale', '小蓝鲸', 0, 'l', 0, '憨憨'], ['otter', '水獭', 0, 'b', 0, '抱抱怪'], ['arcticfox', '北极狐', 0, 'w', 3, '机灵'],
  ['icecream', '冰淇淋', 0, 'p', 0, '甜甜'], ['cottoncandy', '棉花糖', 0, 'l', 0, '甜滋滋'], ['popcorn', '爆米花', 0, 'w', 0, '蹦蹦'], ['donut', '甜甜圈', 0, 'b', 0, '圆滚滚'], ['mermaid', '小美人鱼', 2, 'w', 0, '爱唱歌'],
  ['carrot', '胡萝卜', 0, 'o', 1, '急性子'], ['tomato', '番茄', 0, 'r', 1, '红脸蛋'], ['eggplant', '茄子', 0, 'v', 1, '委屈巴巴'], ['corn', '玉米', 0, 'y', 1, '爆脾气'], ['scarecrow', '稻草人', 0, 'b', 1, '吓唬王'],
  ['goldhen', '金蛋母鸡', 2, 'w', 1, '下金蛋'], ['sunflower', '向日葵', 0, 'y', 2, '笑嘻嘻'], ['tulip', '郁金香', 0, 'p', 2, '小淑女'], ['mushroom', '小蘑菇', 0, 'r', 2, '小迷糊'], ['cactus', '仙人掌', 0, 'g', 2, '刺刺的'],
  ['butterfly', '蝴蝶', 1, 'v', 2, '翩翩'], ['fairy', '花仙子', 2, 'w', 2, '会魔法'], ['sun', '太阳', 1, 'o', 3, '暖洋洋'], ['moon', '月亮', 0, 'y', 3, '睡不醒'], ['cloud', '云朵宝宝', 0, 'w', 3, '懒洋洋'],
  ['raindrop', '雨滴', 0, 'l', 3, '爱哭鬼'], ['toucan', '大嘴鸟', 0, 'k', 4, '嘴大王'], ['banana', '香蕉', 0, 'y', 4, '弯弯'], ['dragonfruit', '火龙果', 0, 'p', 4, '刺头'], ['coconut', '椰子', 0, 'b', 4, '硬汉'],
  ['ninedeer', '九色鹿', 2, 'w', 4, '善良'], ['princess', '小公主', 1, 'p', 5, '爱美'], ['knight', '小骑士', 1, 'a', 5, '勇敢'], ['wizard', '小魔法师', 1, 'v', 5, '神秘'], ['ghost', '小幽灵', 0, 'w', 5, '躲猫猫'],
].map(([id, name, tier, fam, isle, temper], i) => ({ i, id, name, tier, fam, isle, temper }));
// the partners: the twelve decli drew with four faces (also in dev/heads2.py), any of which can keep the child company
const PALS = ['pig', 'panda', 'hippo', 'giraffe', 'parrot', 'frog', 'owl', 'corgi', 'bee', 'cloud', 'monkey', 'princess'];
const L = {
  welcome: '欢迎来到动物消消乐！点一个关卡开始吧。',
  pick: '选一关吧！',
  locked: '这一关还锁着，先把前面的关过了吧。',
  intro(lv, n) {
    const kinds = lv.goals.filter(g => g.t === 'c').length;
    const parts = lv.goals.filter(g => g.t !== 'c').map(g => goalSay(g, lv));
    if (kinds) parts.push(`收集${['', '这种', '这两种', '这三种'][kinds]}小伙伴：`);
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
    // season two: each island's new thing, said before its first level
    egg: '蛋宝宝来啦！在蛋旁边消两次，小鸡就破壳出来了。',
    grass: '在土地上消一消，那里就长出小草。把土地都种绿吧！',
    bl: '在气球旁边消一消，气球就往上飘一格。飘到最上面，它就飞上天啦！',
    cage: '小伙伴被关在笼子里了！在笼子旁边消和它一样的小动物，笼子就打开啦。',
    castle: '彩虹城堡里，蛋宝宝、小草、气球和笼子都在，加油！',
  },
  cageStuck: '笼子里的小动物拨不动。在旁边消和它一样的小动物，笼子才会打开。',
  balloonStuck: '气球拨不动。在它旁边消一消，它就往上飘！',
  balloonAway: '气球飞上天啦！',
  helper: '别灰心！送你一个小帮手。',
  // the islands (ISLANDS in levels.js): arriving on one, winning all of it, trying one that is still locked
  isle: {
    hi: ISLANDS.map(s => `欢迎来到${s.name}！`),
    done: ISLANDS.map(s => `${s.name}全部通关啦！送你一个稀有盲盒！`),
    locked: '这座小岛还锁着，先把前面的关都过了吧！',
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
  allDone: '所有小岛全部通关啦！你是消消乐大师！',
  // the math page speaks to the child (KID), every right answer is praise for them
  math: {
    title: `${KID}，敢不敢先挑战一页数学题？`,
    start: n => `${KID}，敢不敢先挑战一页数学题？${n}道题都做对，就能接着玩啦。`,   // recorded for every size, 1 to MATH_MOST
    freeDay: `${KID}，今天的第一局不用做题，直接玩吧！`,   // a page owed since an earlier day is let go (Store.newDay)
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
    half: `${KID}，已经做完一半啦！`,
    // decli 2026-11-02: nothing is marked while she writes, so her train of thought isn't broken; she hands the page
    // in and the teacher marks it all at once, then she corrects what was marked (订正)
    allIn: '都写好啦！再检查一遍，没问题就点交卷。',
    mark: '交卷啦！小老师来批改。',
    got: n => `做对了${n}道！`,                                  // recorded for 1 to 20
    fix: n => `还有${n}道要再想一想，我们来订正吧！`,              // recorded for 1 to 20
    done: `${KID}，全部做完啦！真厉害，去玩吧！`,
    doneExtra: `${KID}，做完啦！多给你5步！`,
  },
  // the wheel before a math page (wheel.js): every number is good news
  wheel: {
    ask: `${KID}，点一下转盘，看看这次做几道题！`,
    land: n => !n ? `转到0道题！运气真好，这次不用做题，${KID}直接去玩吧！` : n <= 4 ? `转到${n}道题！${KID}，热热身吧！` : n <= 10 ? `转到${n}道题！不多不少，${KID}加油！` : `哇，转到${n}道题！${KID}，接受挑战吧！`,
  },
  // 小老师 (teach.js): when a sum she is correcting is wrong again, or 💡. 列竖式 first (decli 2026-11-02), 🔄 for the
  // others; no line ever says the answer: they count only what is added or taken away, or count along with her
  teach: {
    pick: `${KID}，别着急！小老师有四种办法，你想用哪一种？`,
    pick2: '换一种办法试试吧！你想用哪一种？',
    ways: ['列竖式', '摆一摆', '跳一跳', '拆一拆'],
    // straight in (the parent chose the way), or after she picked it
    hi: { col: `${KID}，别着急，我们来列竖式，一位一位地算！`, frame: `${KID}，别着急，我们请小动物来摆一摆！`, line: `${KID}，别着急，我们请小青蛙来跳一跳！`, split: `${KID}，别着急，我们把数拆开，一步一步算！` },
    wayHi: { col: '好，我们来列竖式，一位一位地算！', frame: '好，我们请小动物来摆一摆！', line: '好，我们请小青蛙来跳一跳！', split: '好，我们把数拆开，一步一步算！' },
    // 列竖式: the school column method, each column with its animals (ones) and bundles of ten (tens) under it
    col: {
      align: '相同数位要对齐：个位对个位，十位对十位。先算个位，再算十位。',
      onesAdd: '先算个位：个位和个位合在一起。',
      onesSub: '先算个位：个位减个位。',
      onesDown: '先算个位：个位上没有要加减的。',
      carry: '满十个啦！捆成一捆，进到十位上，记一个小1。',
      borrow: '个位不够减！从十位借一捆，拆开就是十个，十位上点一个小点。',
      onesAsk: '个位上现在有几个？写在个位上。',
      tensAdd: '再算十位：十位和十位合在一起。',
      tensAddCarry: '再算十位：十位和十位合在一起，还有进上来的一捆！',
      tensCarry: '再算十位：别忘了进上来的一捆！',
      tensSub: '再算十位：十位减十位。',
      tensSubBorrow: '再算十位：十位减十位，别忘了被借走的一捆！',
      tensBorrow: '再算十位：别忘了，十位被借走了一捆！',
      tensDown: '再算十位：十位上没有要加减的。',
      tensAsk: '十位上现在有几捆？写在十位上。',
      tensNone: '十位上一捆也不剩了，十位就不用写啦。',
      zero: '一个也没有，就写0。',
      guideTen: '我们一起数一数有几捆！点一下，数一捆。',
      right: '对啦！',
      part: '这一步算好啦！用它接着算。',
      copy: '竖式算好啦！把得数写到上面的横式里。',
      copyAgain: '照着竖式下面的得数写：先写十位，再写个位。',
    },
    add: '加几个，就请进来几个。点一点！',
    sub: '减几个，就送走几个。点一点！',
    tie: '满十个啦，捆成一捆！',
    untie: '个数不够了，拆开一捆！',
    endAdd: '现在一共有几只？数一数，写在上面吧。',
    endSub: '现在还剩几只？数一数，写在上面吧。',
    hopAdd: '加几，就往前跳几格。点一点！',
    hopSub: '减几，就往回跳几格。点一点！',
    hopEnd: '小青蛙停在几？看看旁边的整十数，再数一数，写在上面吧。',
    // 拆一拆: one line for each kind of step (Teach.plan), none with a number in it
    step: {
      tensAdd: '先把整十的加上，一捆就是十。数一数，是多少？',
      tensSub: '先把整十的减掉，一捆就是十。拿走的不算，还剩多少？',
      count: '数一数，合起来一共是多少？',
      countSub: '拿走的不算，数一数还剩多少？',
      ones: '先算个位上的。数一数，合起来是多少？',
      onesSub: '先算个位上的。拿走的不算，还剩多少？',
      join: '整十和几个合起来，数一数是多少？',
      fill: '先凑成十！还差几个就满十？数一数空格。',
      partAdd: '把它分成两份：一份去凑十，另一份是几？',
      down: '先减到整十！要减掉几个，才正好剩整十？',
      partSub: '把它分成两份：一份先减掉，另一份是几？',
      break: '个位不够减，拆开一捆来减！拿走的不算，还剩几个？',
      rest: '再减去剩下的几个。拿走的不算，还剩多少？',
      next: '对啦！下一步。',
    },
    tap: '点一点这里。',
    early: '先跟着小老师一步一步来，最后再写答案哦。',
    // counting together: one tap, one thing, its number said; then she writes the last number
    guide: '我们一起数一数！点一下，数一个。',
    guideHop: '跟着小青蛙一起数！点一下，跳一下。',
    recount: '没关系，我们再数一遍！',
    counted: '数完啦！最后数到几，就写几。',
    self: `${KID}，你一步一步想出来啦！真棒！`,
    twin: '再来一道差不多的，自己试试！',
    nums: Array.from({ length: 101 }, (_, i) => String(i)),   // counting: what has come or gone, or counting along
  },
  parent: '这里是给爸爸妈妈的设置哦。',
  // 伙伴 (pal.js): picked in the album
  pal: { chosen: Object.fromEntries(PALS.map(id => [id, `好！今天${FRIENDS.find(f => f.id === id).name}陪你一起玩！`])) },
  gift: {
    drop: '过关礼物！是一个神秘盲盒，点它三下，打开看看！',
    rare: '稀有款！运气真好！',
    hidden: '天哪！是隐藏款！超级超级难得！',
    got: FRIENDS.map(f => `哇！是${f.name}！`),
    again: '又抽到它啦！',
    full: '一百个小伙伴都集齐啦！你是收集大王！',
    album: '这是你的小伙伴收集册。每座小岛都有自己的小伙伴，第一次过关就能拆一个盲盒，把它们都集齐吧！点一点挂着伙伴牌子的，它就会陪你一起玩。',
    names: FRIENDS.map(f => f.name),
    who: FRIENDS.map(f => `${f.name}，${f.temper}！`),   // tapped in the album: its name and its nickname
    locked: '还没抽到它呢，过关拆盲盒就有机会哦！',
    more: '拿到三颗星，还能再拆一个盲盒哦！',
    shiny: '又抽到它啦！它变成闪光版啦！',   // a replay: boxes come the first time a level is won, and with its first three stars
  },
};
// English cheers for each step of excitement (excitement() in board.js): decli's own recordings in sound/, not the
// voice bank. Level 0 says nothing.
const CHEER = ['', 'Great!', 'Great!', 'Excellent!', 'Excellent!', 'Unbelievable!'];
const CHEER_CLIP = { 'Great!': 'great', 'Excellent!': 'excellent', 'Unbelievable!': 'unbelievable' };
const BONUS = 'Bonus time!';   // shown over the board when the moves left turn into stripes; there is no recording of it
