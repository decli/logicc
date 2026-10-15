// 魔方世界 · every line the narrator says (Chinese, 晓晓) and the English cheers (Ana).
// The voice bank is recorded from this file: node mofang/dev/voice/collect.mjs lists every string in L and CHEER.
// Keep it plain data (strings, arrays, objects of strings) so the recording script can walk it.
export const CHEER = [
  [], ['Good!', 'Nice!'], ['Great!', 'Super!', 'Yay!'], ['Excellent!', 'Wonderful!', 'Wow!'], ['Amazing!', 'Perfect!', 'Fantastic!'],
];
export const CHEER_ALL = ['Unbelievable!', 'Good job!', 'Excellent!', 'Amazing!', 'Wow!'];

const BUILD_NAMES = { stairs: '小台阶', bridge: '小桥', duck: '小鸭子', snowman: '雪人', robot: '机器人', rocket: '小火箭', slide: '滑滑梯', chair: '小椅子', tree: '小树', gate: '城门', pyramid: '金字塔', house: '小房子', car: '小汽车' };
const each = (obj, f) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, f(v, k)]));

export const L = {
  welcome: '欢迎来到魔方世界！点箭头换一个小岛，点小岛就能进去玩',
  locked: '先把前面一关玩过，这一关就打开啦',
  stars: ['', '过关啦！得到一颗星', '真棒！两颗星', '太厉害了！三颗星'],
  isle: { views: '小熊看积木', count: '数积木', wall: '钻墙洞', nets: '折纸盒', cube: '转魔方', build: '搭城堡' },
  isleIntro: {
    views: '小动物们站在积木的四周，猜猜它们看到的是什么样子',
    count: '数一数一共有几块积木，藏起来的也要数哦',
    wall: '把积木转一转，让它从墙洞里钻过去',
    nets: '把一张纸折起来，变成一个盒子',
    cube: '用手指拨一拨，把魔方转回去',
    build: '照着样子，用积木搭出小房子和城堡',
  },

  views: {
    intro: [
      '小熊站在积木的前面。它看到的积木是什么样子呢？',
      '这次小兔站在右边，小猫站在左边。',
      '小鸟飞到了积木的上面，从上往下看。',
      '反过来：这张图是谁看到的？点一点那个小动物。',
      '这次不能先转着看了，先在脑子里想一想，选好了再飞过去看。',
    ],
    ask: {
      front: '小熊站在前面，它看到的是哪一个？',
      right: '小兔站在右边，它看到的是哪一个？',
      left: '小猫站在左边，它看到的是哪一个？',
      back: '小青蛙站在后面，它看到的是哪一个？',
      top: '小鸟在上面，往下看，看到的是哪一个？',
    },
    again: {
      front: '再看看，小熊是从前面看的哦',
      right: '再看看，小兔是从右边看的哦',
      left: '再看看，小猫是从左边看的哦',
      back: '再看看，小青蛙是从后面看的哦',
      top: '再看看，小鸟是从上面往下看的哦',
    },
    who: '这是谁看到的？点一点那个小动物',
    whoWrong: '不是它哦，再找找',
    look: '我们飞到它的眼睛那里，看一看',
    see: '看，它看到的就是这个样子',
    turn: '用手指拖一拖，就能转着看积木',
  },

  count: {
    intro: [
      '数一数，一共有几块积木？',
      '积木变多了，一块一块数清楚。',
      '有的积木藏起来了！被上面和前面的积木挡住了，也要数进去。',
      '虚线框是一个大方块。还要几块积木，才能把它填满？',
      '大挑战：先别转，想一想藏起来的积木，选好了再数一数。',
    ],
    ask: '一共有几块积木？',
    askFill: '还要几块，才能拼成一个大方块？',
    hidden: '有的积木藏在后面和下面，转过去看看',
    wrong: '不对哦，再数一数',
    together: '我们一起数一数',
    total: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [i + 1, `一共${i + 1}块`])),
    need: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, `还要${i + 1}块`])),
    num: Array.from({ length: 30 }, (_, i) => String(i + 1)),
  },

  wall: {
    intro: [
      '墙上有个洞，积木要钻过去！点转圈按钮，把积木转一转，和洞一样了就点出发。',
      '积木躺下了，要让它站起来。试试前后翻的按钮。',
      '三个按钮都能用了：转圈、左右转、前后翻。',
      '积木变成立体的了！看看墙上的影子，影子和洞一样，就能钻过去。',
      '大挑战：影子不见了，先在脑子里转一转。',
    ],
    ask: '把积木转一转，和洞一样了就点出发',
    bonk: '哎呀，撞到墙了！再转一转试试',
    shadow: '看墙上的影子，影子和洞一样，就能钻过去',
    through: '钻过去啦！',
  },

  nets: {
    intro: [
      '这张纸少了一块，补上它，就能折成一个盒子。',
      '纸片换了样子，再找找少的那一块放在哪里。',
      '这些纸片更难了，想一想折起来是什么样子。',
      '这张纸能不能折成一个盒子？能就点盒子，不能就点叉叉。',
      '大挑战：折好以后，哪个颜色在星星的对面？',
    ],
    fill: '少了一块，放在哪里能折成盒子？点一点',
    yesno: '这张纸能折成一个盒子吗？',
    opposite: '折好以后，哪个颜色在星星的对面？',
    folded: '折成盒子啦！',
    overlap: '叠在一起了，还空着一个口，换个地方试试',
    lets: '我们折折看',
    can: '能折成盒子！',
    cannot: '折不成盒子，叠在一起了',
    oppWrong: '不是它哦，我们折起来看看',
    oppIs: '看，这个颜色在星星的对面',
  },

  cube: {
    intro: [
      '这是一个二阶魔方。它被转了一下，你能把它转回去吗？手指按住一层，往旁边推。',
      '这次转了两下，要转两下才能回去。',
      '三阶魔方来啦！它被转了一下。',
      '三阶魔方，转了两下。',
      '二阶魔方，转了三下。想不出来就点小灯泡。',
      '大挑战：三阶魔方，转了三下！',
    ],
    watch: '看好了，魔方要被转乱啦',
    watch2: '看好了，又要转乱啦',
    ask: '把魔方转回去，让每一面都是一个颜色',
    follow: '跟着箭头转',
    lost: '转乱了也没关系，点小灯泡，跟着箭头转',
    done: '复原啦！每一面都是一个颜色',
    free: '自由玩魔方：点骰子打乱，点魔法棒，它会自己转回去',
    mixing: '打乱啦',
    magic: '变变变，魔方自己转回去',
  },

  build: {
    intro: [
      '点一点亮亮的格子，把积木放上去。点积木的旁边和上面，也能放积木。',
      '照着小窗口里的样子搭一个。手指拖一拖，小窗口也会跟着转。',
      '这次的样子大一点，颜色也要一样哦。',
      '小窗口里的东西转了个方向！看小旗子：它的小旗子在哪边，你的小旗子就在哪边。',
      '大挑战：只看两张图来搭。小熊看到的是这样，小鸟从上面看到的是这样。',
    ],
    ghost: '点一点亮亮的格子，把积木放上去',
    notHere: '不是这里哦，放在亮亮的格子上',
    ask: each(BUILD_NAMES, n => `照着小窗口里的样子，搭一个${n}`),
    turnAsk: each(BUILD_NAMES, n => `小窗口里的${n}转了个方向，看小旗子，搭得和它一样`),
    made: each(BUILD_NAMES, n => `${n}搭好啦！`),
    done: '搭好啦！',
    almost: '差一点点，和小窗口里的比一比',
    tooMany: '积木多了，用橡皮拿走几块',
    hint: '看，亮亮的地方还差积木',
    viewsAsk: '看这两张图，搭出一样的积木',
    views2: '小熊和小鸟看到的都一样，搭对啦！',
    bearSees: '这是小熊从前面看到的样子',
    birdSees: '这是小鸟从上面看到的样子',
    free: '自由搭：选一个颜色，点一点就能放积木。点城堡，送你一座城堡',
  },
};
