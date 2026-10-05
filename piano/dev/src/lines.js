// 彩虹钢琴 · everything the narrator says (also read by dev/voice/collect.mjs to record the voice bank,
// so every string here must come out exactly as the page builds it)
export const COLOR_ZH = ['红', '橙', '黄', '绿', '青', '蓝', '紫'];
export const INST_ZH = { piano: '钢琴', musicbox: '八音盒', marimba: '木琴', chip: '游戏机' };
export const PAINTS = [
  { id: 'black', zh: '经典黑', hex: '#16161C' },
  { id: 'white', zh: '象牙白', hex: '#F3EEE4' },
  { id: 'pink', zh: '樱花粉', hex: '#F6B3C6' },
  { id: 'sky', zh: '天空蓝', hex: '#8CC4FF' },
  { id: 'mint', zh: '薄荷绿', hex: '#8FDDBD' },
  { id: 'lemon', zh: '柠檬黄', hex: '#FFE184' },
  { id: 'lilac', zh: '薰衣草紫', hex: '#C4B0F4' },
  { id: 'cherry', zh: '樱桃红', hex: '#E0484F' },
  { id: 'night', zh: '星空蓝', hex: '#203080' },
];
export const REGISTER_ZH = ['鲸鱼', '大象', '小熊', '小狗', '小猫', '小兔', '小鸟', '小蜜蜂'];

export const L = {
  welcome: '你好呀！我是彩虹钢琴。七个音，有七种颜色。摸摸我的琴键吧！',
  welcomeBack: '欢迎回来！摸摸琴键吧。',
  idle: '用手指点一点琴键，或者在琴键上滑一滑。',
  free: '自己弹：想弹哪里就弹哪里。手指在琴键上滑一下，会有彩虹哦！',
  rainbow: '哇，彩虹！',
  inst: k => `这是${INST_ZH[k]}！`,
  night: '天黑啦，琴键会发光哦。',
  day: '天亮啦。',
  paint: p => `钢琴变成${p.zh}啦！`,
  register: (i, high) => `这里是${REGISTER_ZH[i]}的家，声音${high ? '高高的' : '低低的'}。`,
  view: '用手指转一转钢琴，看看它里面。',
  play: '坐回钢琴前面啦。',
  pedalOn: '踩下踏板，声音会变得长长的。',
  pedalOff: '松开踏板。',
  recStart: '开始录音啦，弹吧！弹完再点一下。',
  recStop: '录好啦！点“听我的”，钢琴会自己弹给你听。',
  recEmpty: '还没有弹呢，先弹几个音吧。',
  recPlay: '这是你弹的哦！',

  learnPick: '选一首歌，我们一起弹。',
  learnStart: s => `我们来弹《${s.title}》。按亮起来的那个键。`,
  learnPhrase: ['真棒！', '弹得真好！', '好听！', '对啦，接着弹！', '太厉害了！'],
  learnWrong: c => `找一找${COLOR_ZH[c]}色的那个键。`,
  learnListen: '先听我弹一遍。',
  learnYour: '该你啦。',
  learnDone: s => `你弹完了《${s.title}》！听一听，你弹的就是这首歌。`,
  learnAgain: '再弹一次吗？还是换一首？',

  listenPick: '选一首，钢琴自己弹给你听。',
  listenStart: s => `嘘，音乐会开始啦。《${s.title}》。`,
  listenEnd: '弹完啦！给钢琴拍拍手吧。',

  echoIntro: '小鸟唱几个音，你来学一学。先听哦。',
  echoYour: '该你啦！',
  echoGood: ['学得真像！', '对啦！', '你的耳朵真灵！', '一模一样！'],
  echoAgain: '小鸟再唱一遍，仔细听。',
  echoMore: '小鸟要唱更多的音啦！',
  echoWin: '你把小鸟的歌全学会啦！',
};
