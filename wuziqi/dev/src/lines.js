// 五子棋 · the computer's players and everything the narrator says. dev/voice/collect.js reads this file to list every
// line for recording, so a line built from an opponent must be built here.
// The opponents are 怪趣森林 friends from 动物消消乐 (decli's pictures, img/<id>.webp), from a beginner to a teacher;
// the first two play on a smaller board, so a child's first games are short and the stones big.
const OPPS = [
  { id: 'chick', name: '小黄鸡', level: 0, size: 11, tag: '刚学会下棋' },
  { id: 'bunny', name: '小兔子', level: 1, size: 11, tag: '会堵你，偶尔看漏' },
  { id: 'fox', name: '小狐狸', level: 2, size: 15, tag: '机灵，攻守都会' },
  { id: 'owl', name: '猫头鹰', level: 3, size: 15, tag: '下棋老师，会算好几步' },
];
const STONE = ['', '黑棋', '白棋'];
const L = {
  welcome: '五子棋！谁先把五个棋子连成一条线，谁就赢。你想和谁下？',
  intro: {
    chick: '小黄鸡刚学会下棋，和它玩玩吧！',
    bunny: '小兔子会堵你，可有时候也会看漏哦。',
    fox: '小狐狸可机灵了，一不留神就被它连上啦。',
    owl: '猫头鹰是下棋老师，能赢它就是高手！',
  },
  meFirst: '你先下，你是黑棋。',
  itFirst: OPPS.map(o => `${o.name}先下，你是白棋。`),
  pvp: '两个人下：黑棋先下，轮流放棋子，谁先连成五个谁就赢。',
  // 提醒: the other side can make five next move, or is one move from two ways to make five
  urgent: '小心！它马上就要连成五个了，快堵住！',
  soon: '注意！它连成三个了，两头都空着，快堵住一头！',
  pvpUrgent: [1, 2].map(c => `小心！${STONE[c]}马上就要连成五个了！`),
  pvpSoon: [1, 2].map(c => `注意！${STONE[c]}连成三个了，两头都空着！`),
  blocked: ['堵得好！', '好眼力，堵住啦！', '漂亮，挡住了！'],
  hint: '下在发光的地方试试？',
  win: '你赢啦！连成了五个，太厉害了！',
  winNext: OPPS.slice(1).map(o => `你赢啦！下次去挑战${o.name}吧！`),
  lose: OPPS.map(o => `哎呀，这次${o.name}赢了。看看它是怎么连成五个的，再来一局！`),
  draw: '棋盘下满啦，平局！',
  pvpWin: [1, 2].map(c => `${STONE[c]}赢啦！连成了五个！`),
  undo: '退回一步，再想想。',
};
