/* =====================================================================
   造物 · words — every line in Chinese and English. L('key') picks the
   current language; pools hold several ways to say the same thing.
   ===================================================================== */
const I18N = { lang: 'zh', listeners: [] };
try { const l = localStorage.getItem('zaowu-lang'); if (l === 'en' || l === 'zh') I18N.lang = l; } catch (_) { }

const STR = {
  // ---- interface ----
  ui_xray: ['透视', 'X-ray'],
  ui_sound: ['声音', 'Sound'],
  ui_mute: ['静音', 'Muted'],
  ui_voice: ['语音', 'Voice'],
  ui_voice_off: ['不说话', 'Quiet'],
  ui_lang: ['EN', '中文'],
  ui_lang_aria: ['切换到英文', 'Switch to Chinese'],
  ui_book: ['发现册', 'Stickers'],
  ui_home: ['回首页', 'Home'],
  ui_skip: ['跳过引导', 'Skip intro'],
  ui_resume: ['回到我上次的世界', 'Back to my world'],
  ui_close: ['关上', 'Close'],
  ui_prev: ['上一条', 'Back'],
  ui_next: ['下一条', 'Next'],
  ui_day: ['第{n}天', 'Day {n}'],
  ui_xray_title: ['透视说明', 'X-ray notes'],
  canvas_aria: ['一个可以互动的小世界：点草地种树，点天空召云，画一个圈创造会动的小生灵，拖动太阳改变昼夜。键盘：空格敲开混沌，T 种树，C 召云，B 造一个小生灵，N 推进时间，X 透视，L 切换语言，左右方向键起风',
    'A little world to play with: tap the grass to plant a tree, tap the sky for a cloud, draw a loop to make a creature, drag the sun to change day and night. Keys: Space cracks the egg, T tree, C cloud, B creature, N time, X x-ray, L language, arrow keys wind'],
  book_title: ['发现册', 'Sticker Book'],
  book_sub: ['收集了 {n} / {m} 张，灰色的还没找到——点一点，听听怎么玩出来', '{n} of {m} collected. Tap a grey one to hear how to find it'],
  sticker_got: ['你拿到一张贴纸：{name}！', 'You got a sticker: {name}!'],
  st_tap: ['这张是{name}。', 'This one is {name}.'],
  voice_on: ['好呀，我来读给你听。', 'Okay, I will read aloud for you.'],

  // ---- the story ----
  q_chaos: ['天地混沌如鸡子|盘古生其中', 'Heaven and earth were one, like an egg, and Pangu slept inside.'],
  q_chaos_src: ['徐整《三五历纪》', 'Xu Zheng, Sanwu Liji'],
  q_gen: ['阳清为天|阴浊为地', 'The light and clear became the sky; the heavy and dim became the earth.'],
  q_tree: ['一生二|二生三 三生万物', 'One gives two, two gives three, three gives all things.'],
  q_tree_src: ['老子《道德经》', 'Laozi, Dao De Jing'],
  q_rain: ['好雨知时节|当春乃发生', 'Good rain knows its season; it arrives with the spring.'],
  q_rain_src: ['杜甫《春夜喜雨》', 'Du Fu, Spring Night, Happy Rain'],
  q_nuwa: ['女娲抟黄土|作人', 'Nüwa shaped people out of yellow earth.'],
  q_nuwa_src: ['应劭《风俗通义》', 'Ying Shao, Fengsu Tongyi'],
  q_night: ['明月松间照|清泉石上流', 'The bright moon shines through the pines; a clear spring runs over the stones.'],
  q_night_src: ['王维《山居秋暝》', 'Wang Wei, Autumn Evening in the Mountains'],
  q_one: ['天地与我并生|而万物与我为一', 'Heaven and earth were born with me, and all things are one with me.'],
  q_one_src: ['庄子《齐物论》', 'Zhuangzi, On Seeing Things as Equal'],

  chaos_line: ['很久很久以前，天和地还没有分开，一切都混在一起，像一颗蛋。', 'Long, long ago, the sky and the earth were not yet apart. Everything was mixed together, like an egg.'],
  chaos_hint: ['点一点它', 'Tap the egg'],
  tap1_line: ['它动了一下……', 'It moved a little…'],
  tap1_hint: ['再点一下', 'Tap again'],
  tap2_line: ['里面有光！', 'There is light inside!'],
  tap2_hint: ['最后一下', 'One more time'],
  gen_line: ['轻而清的升上去，成了天；重而浊的沉下来，成了地。', 'The light things floated up and became the sky. The heavy things sank down and became the earth.'],
  tree_line: ['天地分开了，可大地还空荡荡的。', 'The sky and the earth are apart, but the land is still empty.'],
  tree_hint: ['点一下草地，种下一颗种子', 'Tap the grass to plant a seed'],
  tree1_line: ['一根枝分成两根，两根分成四根……没有两棵树是一样的。', 'One branch splits into two, two into four… No two trees are the same.'],
  tree1_hint: ['再种一棵试试', 'Plant one more'],
  tree2_line: ['你看，这一棵和刚才那棵完全不同。', 'Look, this one is nothing like the first one.'],
  cloud_line: ['树想喝水了。', 'The trees are thirsty.'],
  cloud_hint: ['点一下天空，召来一朵云', 'Tap the sky to call a cloud'],
  rain_line: ['下雨了。雨落到的地方，会开出花来。', 'It is raining. Flowers grow where the drops land.'],
  rainbow_line: ['雨停了，天上挂起一道彩虹。', 'The rain stopped, and a rainbow came out!'],
  creature_line: ['现在是最神奇的一步：用手指画一个圈，什么形状都可以。', 'Now the most magical part: draw a loop with your finger. Any shape you like!'],
  creature_hint: ['画一个首尾相连的形状，它会活过来', 'Draw a closed shape and it will come alive'],
  born_line: ['它活了！它叫「{name}」。', 'It is alive! Its name is {name}.'],
  born_hint: ['点点它，看看它想和你玩什么', 'Tap it to see what it wants to play'],
  born2_line: ['「{name}」也来了。它们跳起来的时候，会唱出不同的音。', '{name} is here too. When they jump, each one sings its own note.'],
  poke_line: ['「{name}」很开心。点圆圈里的按钮，让它唱歌、吃果子、翻跟头。', '{name} is happy! Tap a button in the circle to make it sing, eat or do a flip.'],
  fling_line: ['它的身体是软的，会被压扁，再弹回来。', 'Its body is soft. It squishes, then bounces back.'],
  friends_line: ['它喜欢你。再画几个，给它找些朋友，它们会一起唱歌。', 'It likes you! Draw a few friends for it, and they will sing together.'],
  friends_hint: ['多画几个小生灵，形状越怪越好玩', 'Draw more creatures. The sillier the shape, the better'],
  shake_line: ['小生灵饿了。点一下树，树上会掉下果子。', 'The creatures are hungry. Tap a tree and fruit will fall.'],
  shake_hint: ['点一下树，摇下果子', 'Tap a tree to shake down fruit'],
  night_line: ['天色不早了。', 'It is getting late.'],
  night_hint: ['按住太阳，把它往右边拖', 'Hold the sun and drag it to the right'],
  nightfall_line: ['夜晚来了。小家伙们睡着了，萤火虫亮了起来。', 'Night has come. The little ones are asleep, and the fireflies are glowing.'],
  nightfall_hint: ['点一点萤火虫，把它们收进发现册', 'Tap the fireflies to catch them'],
  free_line: ['这个世界，现在交给你了。', 'Now this world is yours.'],
  free_hint: ['打开左上角的「透视」，看看它是怎么运转的', 'Open X-ray at the top left to see how it all works'],
  reveal_line: ['这里没有一张图片、一段录音。每一座山、每一片花瓣、每一声歌唱，都是此刻用数学算出来的。', 'There is not a single picture or recording here. Every mountain, petal and song is being made by math, right now.'],
  done_hint: ['点草地种树 · 点天空召云 · 画圈造生灵 · 点树摇果子 · 拖太阳换昼夜', 'Tap grass: tree · Tap sky: cloud · Draw a loop: creature · Tap a tree: fruit · Drag the sun: night'],
  welcome_back: ['欢迎回来。它们都还在。', 'Welcome back. They are all still here.'],
  chorus_toast: ['它们在一起唱歌呢！', 'Listen, they are singing together!'],
  day_toast: ['第{n}天，太阳又升起来了。', 'Day {n}. The sun is up again.'],
  full_toast: ['这个世界已经很热闹啦，先和它们玩一会儿吧', 'The world is full! Play with them for a while'],
  echo_invite: ['小生灵们想和你玩「跟我唱」，点右下角的音符。', 'The creatures want to play Sing With Me. Tap the music note at the bottom right.'],
  feed_needtree: ['先种一棵树吧，树上会结果子。', 'Plant a tree first. Trees grow fruit.'],

  // ---- sing with me ----
  echo_btn: ['跟我唱', 'Sing With Me'],
  echo_title: ['跟我唱', 'Sing With Me'],
  echo_start: ['听好啦。它们唱完，你就按同样的顺序点它们。', 'Listen carefully. When they finish, tap them in the same order.'],
  echo_listen: ['仔细听哦。', 'Listen carefully.'],
  echo_your: ['轮到你啦。', 'Your turn!'],
  echo_good: [['真棒，全都对了！', '对啦，你的耳朵真灵！', '一个都没错！', '太好了，就是这样！'], ['Great, all correct!', 'You got it!', 'What good ears you have!', 'Perfect, not a single mistake!']],
  echo_more: ['这次多一个音。', 'One more note this time.'],
  echo_again: ['我们再听一遍吧。', 'Let us listen one more time.'],
  echo_win: ['太厉害了，五个音都记住了！', 'Amazing! You remembered all five notes!'],
  echo_need: ['要有三个醒着的小生灵才能玩哦。', 'You need three awake creatures to play.'],
  echo_bye: ['下次再一起唱！', 'Let us sing again soon!'],
  echo_exit: ['结束', 'Done'],

  // ---- play dock & learning games ----
  dock_words: ['认一认', 'Words'],
  dock_spy: ['找一找', 'I Spy'],
  dock_say: ['说一说', 'Say It'],
  dock_draw: ['画一画', 'Draw'],
  dock_invite: ['看下面，有好多新游戏：认一认、找一找、说一说、画一画。', 'Look down here, there are new games: Words, I Spy, Say It and Draw.'],
  words_on: ['点一点任何东西，我告诉你它叫什么。', 'Tap anything, and I will tell you its name.'],
  words_hint: ['点一点任何东西', 'Tap anything'],
  words_count: ['认识了 {n} 个词', '{n} words learned'],
  words_bye: ['今天又认识了好多词！', 'You learned lots of words today!'],
  book_tab_st: ['贴纸', 'Stickers'],
  book_tab_words: ['词语', 'Words'],
  words_sub: ['认识了 {n} / {m} 个词，点一下再听一遍', '{n} of {m} words learned. Tap one to hear it again'],
  words_locked: ['还没找到这个词，去画面里点一点吧。', 'You have not found this word yet. Go and tap around!'],

  spy_start: ['我说一样东西，你在画面里找到它，点一下。', 'I will name something. Find it in the picture and tap it.'],
  spy_ok: [['找到啦！', '对啦，就是它！', '你真棒！', '好眼力！'], ['You found it!', 'Yes, that is it!', 'Great job!', 'Good eyes!']],
  spy_no: [['不是这个哦，再找一找。', '嗯，再看看别的地方？'], ['Not that one. Look again!', 'Hmm, try somewhere else?']],
  spy_help: ['看，它在闪光的地方。', 'Look where it is sparkling.'],
  spy_win: ['五个都找到了，你的眼睛真亮！', 'You found all five. What sharp eyes!'],
  spy_none: ['东西还太少啦，先种几棵树、画几个小伙伴吧。', 'There is not much to find yet. Plant some trees and draw some friends first.'],

  say_start: ['选一句话，听一听，再跟着说一说。', 'Pick a sentence, listen, then say it too.'],
  say_your: ['轮到你说啦！', 'Your turn to say it!'],
  say_mic: ['按这里，说给它听', 'Tap here and say it'],
  say_listening: ['我在听……', 'Listening…'],
  say_done_btn: ['我说好了', 'I said it'],
  say_again_btn: ['再听一遍', 'Hear it again'],
  say_good: [['说得真好！', '你说得真清楚！', '太棒啦！', '说得真响亮！'], ['Well said!', 'You said it so clearly!', 'Wonderful!', 'Nice and loud!']],
  say_parrot: ['听，它在学你说话呢！', 'Listen, it is copying you!'],
  say_need: ['先画一个小伙伴，它会听你说话。', 'Draw a friend first. It will listen to you.'],
  say_f_give: ['请你吃', 'Have a…'],
  say_f_do: ['请你做', 'Please…'],
  say_f_like: ['我喜欢', 'I like'],
  say_f_want: ['我想要', 'I want'],
  say_f_hi: ['打招呼', 'Hello!'],

  draw_pick: ['你想画什么？选一个吧。', 'What do you want to draw? Pick one.'],
  draw_done: ['画好了', 'Done'],
  draw_undo: ['擦掉一笔', 'Undo'],
  draw_clear: ['重画', 'Clear'],
  draw_back: ['换一个', 'Change'],
  draw_empty: ['先画几笔吧。', 'Draw something first.'],
  draw_nofriend: ['先画一个小伙伴，再给它画帽子吧。', 'Draw a friend first, then make it a hat.'],

  // ---- creature actions ----
  act_sing: ['唱歌', 'Sing'],
  act_feed: ['吃果子', 'Eat'],
  act_color: ['变色', 'Color'],
  act_flip: ['翻跟头', 'Flip'],
  act_talk: ['说话', 'Talk'],
  act_aria: ['{name}可以做的事', 'Things {name} can do'],

  // ---- creature voice ----
  c_hello: ['你好呀，我叫{name}！', 'Hello! My name is {name}!'],
  c_poke: [['嘿嘿，好开心！', '好痒呀，哈哈！', '再来一次嘛！', '啾啾，你好呀！', '你好呀，朋友！', '嘻嘻，好好玩！', '我是{name}！', '最喜欢你了！'], ['Hehe, that is fun!', 'That tickles!', 'Again, again!', 'Boop! Hello!', 'Hello, friend!', 'Hee hee, so fun!', 'I am {name}!', 'I like you so much!']],
  c_wakepoke: [['咦，天亮了吗？', '我被你戳醒啦！', '我还想再睡一会儿……'], ['Huh? Is it morning?', 'You woke me up!', 'Five more minutes…']],
  c_grab: [['哇，好高呀！', '快放我下来～', '我飞起来啦！', '我们要去哪儿？'], ['Whoa, so high!', 'Put me down!', 'I am flying!', 'Where are we going?']],
  c_grabwake: ['咦，怎么了？', 'Huh? What is going on?'],
  c_fling: [['呜哇，我飞起来啦！', '飞呀，飞呀！', '啊呀呀，好快呀！', '好快好快！'], ['Wheee, I am flying!', 'Up, up we go!', 'Aaah, so fast!', 'Faster, faster!']],
  c_dizzy: [['我好晕呀……', '眼冒金星啦！', '一直在转圈圈……', '天在转，地也在转'], ['I am so dizzy…', 'I see stars!', 'Everything is spinning…', 'The sky is going round and round']],
  c_sleep: [['晚安，好梦。', '我困了……', '呼……要睡着啦。', '做个好梦吧。'], ['Good night.', 'I am so sleepy…', 'Yawn… time for bed.', 'Sweet dreams.']],
  c_wake: [['早上好呀！', '天亮啦，快起床！', '我睡得真香！', '新的一天开始啦！'], ['Good morning!', 'It is morning, wake up!', 'What a nice sleep!', 'A brand new day!']],
  c_woken: ['是谁把我吵醒啦？', 'Who woke me up?'],
  c_welcome: [['欢迎你来玩！', '你好呀，{name}！', '我们有新朋友啦！'], ['Welcome!', 'Hi, {name}!', 'We have a new friend!']],
  c_rainbow: [['快看，彩虹！', '哇，好漂亮的彩虹！', '快看天上！'], ['Look, a rainbow!', 'Wow, a rainbow!', 'Look up in the sky!']],
  c_tree: [['长出一棵树啦！', '这棵树好高呀！', '我喜欢这棵树！'], ['A new tree!', 'It is so tall!', 'I love this tree!']],
  c_wind: [['好大的风呀！', '呼呼，风来啦！', '我站不稳啦！'], ['So windy!', 'Whoosh, here comes the wind!', 'I can not stand still!']],
  c_star: [['快看，有流星！', '快许个愿吧！'], ['Look, a shooting star!', 'Make a wish!']],
  c_cloud: [['要下雨了吗？', '来了一朵云！'], ['Is it going to rain?', 'Here comes a cloud!']],
  c_fruit: [['那里有果子！', '好香呀！', '我要去吃果子！'], ['Look, fruit!', 'Mmm, smells yummy!', 'I want that fruit!']],
  c_yummy: [['好吃好吃！', '啊呜，真好吃！', '真甜呀！', '我吃饱啦！'], ['Yummy, yummy!', 'Nom nom nom!', 'So sweet!', 'I am full!']],
  c_grow: [['我长大啦！', '我变大了一点', '看我是不是长高了'], ['I grew bigger!', 'I am a little bigger now', 'Did I get taller?']],
  c_hungry: [['我饿了……', '想吃果子', '肚子咕咕叫'], ['I am hungry…', 'I want some fruit', 'My tummy is rumbling']],
  c_skyfruit: ['天上掉下来一个果子！', 'A fruit fell from the sky!'],
  c_color: ['我变成{c}啦！', 'I turned {c}!'],
  c_flip: [['看我的！', '我要翻跟头啦！', '嘿哈，翻过去！'], ['Watch this!', 'Here comes a flip!', 'Hi-yah, over I go!']],
  c_flipdone: [['成功啦！', '我帅不帅？', '要不要再来一个？'], ['Ta-da!', 'Cool, right?', 'Want to see another one?']],
  c_sing: [['我来唱一首歌！', '啦啦啦，听我唱～', '你听我唱哦！'], ['Let me sing a song!', 'La la la, listen to me!', 'Listen, I will sing!']],
  c_sing_t: ['我来唱{song}！', 'I will sing {song}!'],
  c_sang: [['唱完啦，好听吗？', '你也跟我一起唱吧！'], ['All done! Did you like it?', 'Sing it with me next time!']],
  c_mycolor: ['我是{c}的！', 'I am {c}!'],
  c_thanks: [['谢谢你！', '谢谢，我最喜欢了！', '哇，谢谢你！'], ['Thank you!', 'Thanks, I love it!', 'Wow, thank you!']],
  c_okay: [['好呀！', '没问题！', '看我的！'], ['Okay!', 'No problem!', 'Watch me!']],
  c_r_hi: [['你好呀！', '你好你好！'], ['Hi there!', 'Hello, hello!']],
  c_r_thanks: [['不客气！', '不用谢！'], ['You are welcome!', 'Any time!']],
  c_r_night: ['晚安，做个好梦！', 'Good night, sweet dreams!'],
  c_r_morning: ['早上好！今天天气真好！', 'Good morning! What a nice day!'],
  c_r_love: [['我也爱你！', '我也最爱你了！'], ['I love you too!', 'I love you so much!']],
  c_r_bye: ['再见，明天见！', 'Bye! See you tomorrow!'],
  c_hat: [['我有新帽子啦！', '谢谢你的帽子！', '我戴上帽子好看吗？'], ['I have a new hat!', 'Thank you for the hat!', 'Do I look good in my hat?']],
  c_dance: [['我会跳舞！', '一二三，跳起来！'], ['I can dance!', 'One, two, three, dance!']],
  c_spin: ['转呀转，转圈圈！', 'Round and round I go!'],
  c_jump: ['看我跳得多高！', 'Look how high I can jump!'],
  c_echo_oops:[['咦，不是我哦！', '好像不是我呀。', '再想一想吧！'], ['Oops, not me!', 'Hmm, I do not think it was me.', 'Think again!']],
  c_talk: [[
    '你知道吗？蜜蜂会跳舞，告诉朋友花在哪里。', '我最喜欢下雨天，可以踩水坑！', '你今天开心吗？', '你画画真好看。',
    '树会把水从根一直吸到树梢上。', '月亮自己不会发光，是太阳照亮了它。', '萤火虫的尾巴会发光！', '彩虹有七种颜色：红橙黄绿青蓝紫。',
    '我们来比赛，看谁跳得高！', '你猜我几岁？我才出生一会儿！', '风是看不见的，可是树叶知道它来了。', '种子很小，却能长成大树。',
    '抱抱我吧！', '你叫什么名字呀？', '我会唱五个音：宫、商、角、徵、羽。', '松树到了冬天也是绿的。', '银杏叶像一把小扇子。', '今天你想种什么树？',
  ], [
    'Did you know? Bees dance to tell their friends where the flowers are.', 'I love rainy days. I can jump in puddles!', 'Are you happy today?', 'You draw so well!',
    'Trees drink water from their roots all the way to the top.', 'The moon does not glow by itself. The sun lights it up.', 'Fireflies have glowing tails!', 'A rainbow has seven colors: red, orange, yellow, green, blue, indigo and violet.',
    'Let us see who can jump higher!', 'Guess how old I am? I was just born!', 'You can not see the wind, but the leaves know when it comes.', 'A seed is tiny, but it can grow into a big tree.',
    'Give me a hug!', 'What is your name?', 'I can sing five notes: gong, shang, jue, zhi and yu.', 'Pine trees stay green all winter.', 'Ginkgo leaves look like little fans.', 'What tree do you want to plant today?',
  ]],

  // ---- x-ray ----
  x_soft_h: ['小生灵为什么会动', 'Why the creatures wobble'],
  x_soft_p: ['你画的线被重新取成一圈小点。每一帧，程序都算出“和你画的形状最像”的位置，再把每个点轻轻拉回去。所以它会被压扁、会抖、又会弹回原样。粉色的小圈就是它“想回去”的地方。',
    'Your drawing becomes a ring of little points. Every frame the program works out where the points would sit if the body kept your shape, then gently pulls each one back. That is why it squishes, wobbles and springs back. The pink circles are where each point wants to go.'],
  x_tree_h: ['一生二，二生三', 'One gives two, two gives three'],
  x_tree_p: ['每根树枝长到头，就分成两三根更细的枝，角度和长短各带一点随机。同一条规则重复七次，就长成一棵树，所以没有两棵树一样。不同颜色代表不同的“代”。',
    'When a branch finishes growing it splits into two or three thinner ones, each with a little randomness in angle and length. Repeat the same rule seven times and you get a tree, so no two are alike. Each color is one generation.'],
  x_bird_h: ['没有领头的鸟', 'Birds with no leader'],
  x_bird_p: ['每只鸟只看身边几只：别撞上、朝同一个方向飞、别掉队。三条简单规则合在一起，就成了整群鸟的舞蹈，谁也没在指挥。',
    'Each bird only watches its neighbours: do not bump, fly the same way, do not fall behind. Three simple rules together make the whole flock dance, and nobody is in charge.'],
  x_sound_h: ['一根看不见的弦', 'An invisible string'],
  x_sound_p: ['每个音都是现算的：一小段随机噪声在一个很短的环里来回传，每传一圈就平均一次，噪声就变成了拨弦声。每种树有自己的乐器，所有音都取自宫商角徵羽五声音阶，所以怎么叠都和谐。',
    'Every note is computed on the spot: a burst of noise runs round a very short loop and gets averaged each time, and the noise turns into a plucked string. Each kind of tree has its own instrument, and every note comes from the five-note Chinese scale, so they always sound good together.'],
  x_sky_h: ['远山为什么是蓝的', 'Why far mountains look blue'],
  x_sky_p: ['越远的山，颜色越接近天色，古人说“远山无皴”，物理学叫大气散射。天空的颜色则由一天里十个时刻的配色平滑过渡而来。',
    'The further a mountain is, the closer its color gets to the sky. Old painters said far mountains have no texture; physicists call it atmospheric scattering. The sky blends between ten palettes through the day.'],
  x_wind_h: ['风从哪里来', 'Where the wind comes from'],
  x_wind_p: ['天上的箭头是风。平时是一阵若有若无的微风，你在天上划一下，就加进一股阵风，它会慢慢衰减。树枝、花瓣、云和小生灵都在同一阵风里。',
    'The arrows in the sky are the wind. Normally there is a faint breeze; a swipe adds a gust that slowly fades. Branches, petals, clouds and creatures all feel the same wind.'],
  x_voice_h: ['它们怎么说话', 'How they talk'],
  x_voice_p: ['每一句话都是提前用微软的神经网络语音录好的：中文是晓晓、晓伊和云夏，英文是 Ava、Ana 和 Emma，语速放慢到小朋友听得清。多音字逐个核对：把这个字换成各个读音的同音字再录几遍，听原句和哪一遍最像，读错了就改用同音字重录。一个词、它的翻译和例句录成一整段，中英文之间的停顿像真人说话一样自然。万一语音包没加载，就改用你设备自带的语音。',
    'Every line was recorded in advance with Microsoft neural voices: Xiaoxiao, Xiaoyi and Yunxia in Chinese, Ava, Ana and Emma in English, slowed down so young children can follow. Each Chinese character with more than one reading is checked: the line is recorded again with the character swapped for words that sound like each reading, and if the original matches the wrong one it is re-recorded with a sound-alike. A word, its translation and its sentence are recorded as one clip, so the switch between languages pauses naturally, like a person talking. If the voice pack cannot load, your device\'s own voice takes over.'],
  x_none_h: ['没有一张图片', 'Not a single picture'],
  x_none_p: ['这一页里没有图片、没有录音，也没有引用任何外部代码库。山、云、花、生灵和歌声，全由 __LOC__ 行代码在你眼前实时算出来。',
    'This page has no pictures, no recordings and no outside code libraries. The mountains, clouds, flowers, creatures and songs all come from __LOC__ lines of code running in front of you.'],
  x_scope: ['拨弦合成 Karplus–Strong', 'Karplus–Strong synthesis'],
  x_ground: ['ground(x) = simplex(x) · 地面', 'ground(x) = simplex(x)'],
  x_time: ['{t} · {b}高度 {a}°', '{t} · {b} altitude {a}°'],
  x_sun: ['太阳', 'sun'],
  x_moon: ['月亮', 'moon'],
  x_treelab: ['{n} · 递归 {d} 代 · {b} 根枝', '{n} · {d} generations · {b} branches'],
  x_birds: ['boids ×{n} · 分离 对齐 聚合', 'boids ×{n} · separate · align · cohere'],
  x_creature: ['{name} · {n} 个质点 · θ {a}° · 压缩 {s}', '{name} · {n} points · θ {a}° · squash {s}'],
  x_rain: ['降雨中 · {n} 秒', 'raining · {n}s'],
  x_stats: ['{f} fps · 树枝 {b} · 质点 {p} · 粒子 {q}', '{f} fps · branches {b} · points {p} · particles {q}'],
};

/* creature names, matched by index across languages */
const NAME_PAIRS = [['团团', 'Roly'], ['啾啾', 'Chirpy'], ['米粒', 'Rice'], ['豆包', 'Bean'], ['糯米', 'Mochi'], ['小满', 'Sunny'], ['泡芙', 'Puff'], ['圆圆', 'Ollie'], ['布丁', 'Pudding'], ['麻薯', 'Squishy'],
  ['阿福', 'Lucky'], ['果冻', 'Jelly'], ['汤圆', 'Dumpling'], ['咕噜', 'Gurgle'], ['棉花', 'Cotton'], ['芝麻', 'Sesame'], ['小橘', 'Tangerine'], ['嘟嘟', 'Toot'], ['毛毛', 'Fuzzy'], ['星星', 'Twinkle'],
  ['云朵', 'Cloudy'], ['蘑菇', 'Mushroom'], ['包子', 'Bao'], ['花卷', 'Swirl'], ['栗子', 'Chestnut'], ['桃桃', 'Peachy'], ['乐乐', 'Happy'], ['皮皮', 'Pip'], ['球球', 'Bubble'], ['叮当', 'Jingle'],
  ['奶糖', 'Toffee'], ['小雨', 'Drizzle'], ['豌豆', 'Pea'], ['年糕', 'Ricecake'], ['馒头', 'Muffin'], ['阿宝', 'Bobo']];

/* tunes the creatures sing on "la" (all traditional / public domain).
   notes: [semitones above the singer's own note, beats] */
const SONGS = [
  { id: 'star', zh: '小星星', en: 'Twinkle Twinkle Little Star', n: [[0, 1], [0, 1], [7, 1], [7, 1], [9, 1], [9, 1], [7, 2], [5, 1], [5, 1], [4, 1], [4, 1], [2, 1], [2, 1], [0, 2]] },
  { id: 'tigers', zh: '两只老虎', en: 'Frère Jacques', n: [[0, 1], [2, 1], [4, 1], [0, 1], [0, 1], [2, 1], [4, 1], [0, 1], [4, 1], [5, 1], [7, 2], [4, 1], [5, 1], [7, 2]] },
  { id: 'joy', zh: '欢乐颂', en: 'Ode to Joy', n: [[4, 1], [4, 1], [5, 1], [7, 1], [7, 1], [5, 1], [4, 1], [2, 1], [0, 1], [0, 1], [2, 1], [4, 1], [4, 1.5], [2, 0.5], [2, 2]] },
  { id: 'lamb', zh: '玛丽有只小羊羔', en: 'Mary Had a Little Lamb', n: [[4, 1.5], [2, 0.5], [0, 1], [2, 1], [4, 1], [4, 1], [4, 2], [2, 1], [2, 1], [2, 2], [4, 1], [7, 1], [7, 2]] },
];

/* colours a creature can turn into, with words a child can learn */
const PAINTS = [
  { h: [2, 78, 66], zh: '红色', en: 'red' }, { h: [28, 92, 64], zh: '橙色', en: 'orange' }, { h: [48, 95, 62], zh: '黄色', en: 'yellow' },
  { h: [125, 48, 60], zh: '绿色', en: 'green' }, { h: [208, 80, 66], zh: '蓝色', en: 'blue' }, { h: [272, 60, 72], zh: '紫色', en: 'purple' },
  { h: [335, 82, 78], zh: '粉色', en: 'pink' },
];

const CHAT_PAIRS = {
  base: [[['我们一起玩吧！', '好呀好呀！'], ['Want to play?', 'Yes, let us play!']], [['你看那朵云', '像棉花糖一样'], ['Look at that cloud', 'It looks like cotton candy']], [['嘿，你好！', '嘿嘿，你也好！'], ['Hey, hello!', 'Hello to you too!']],
    [['我会唱歌哦', '我也会唱哦！'], ['I can sing', 'Me too!']], [['你叫什么名字？', '我叫{name}！'], ['What is your name?', 'I am {name}!']], [['我的肚子咕噜咕噜', '你是不是饿啦？'], ['My tummy says gurgle', 'Are you hungry?']],
    [['我跳得比你高', '才不是呢！'], ['I jump higher than you', 'No way!']], [['今天真开心', '我也很开心！'], ['Today is so fun', 'I am happy too!']]],
  night: [[['星星好多', '一颗、两颗……'], ['So many stars', 'One, two…']], [['天有点黑', '别怕，我陪着你'], ['It is a bit dark', 'Do not worry, I am here']]],
  rain: [[['下雨啦！', '雨点凉凉的～'], ['It is raining!', 'The rain feels cool~']]],
  rainbow: [[['有彩虹！', '真的好漂亮！'], ['A rainbow!', 'It is so pretty!']]],
  trees: [[['这棵树好高', '我们去树下吧'], ['This tree is tall', 'Let us go under it']], [['树上有果子吗？', '点一下树就知道'], ['Is there fruit up there?', 'Tap the tree and see']]],
};

function L(key, vars) {
  const e = STR[key]; if (!e) return key;
  let s = e[I18N.lang === 'en' ? 1 : 0]; if (s === undefined) s = e[0];
  if (Array.isArray(s)) s = pick(s);
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
  return s;
}
function isEn() { return I18N.lang === 'en'; }
function setLang(l) {
  I18N.lang = l === 'en' ? 'en' : 'zh';
  try { localStorage.setItem('zaowu-lang', I18N.lang); } catch (_) { }
  document.documentElement.lang = I18N.lang === 'en' ? 'en' : 'zh-CN';
  for (const f of I18N.listeners) f(I18N.lang);
}
function onLang(fn) { I18N.listeners.push(fn); }

/* stickers for the discovery book: emoji, name and how to find it */
const STICKERS = [
  { id: 'tree', e: '🌱', n: ['第一棵树', 'First Tree'], h: ['点一下草地，种一棵树。', 'Tap the grass to plant a tree.'] },
  { id: 'forest', e: '🌳', n: ['五种树', 'Five Trees'], h: ['种出桃树、松树、枫树、柳树和银杏。', 'Grow a peach, a pine, a maple, a willow and a ginkgo.'] },
  { id: 'rain', e: '🌧️', n: ['下雨啦', 'Rain'], h: ['点一下天空，召来一朵云。', 'Tap the sky to call a rain cloud.'] },
  { id: 'rainbow', e: '🌈', n: ['彩虹', 'Rainbow'], h: ['白天下一场雨，等雨停。', 'Make it rain in the daytime and wait for it to stop.'] },
  { id: 'born', e: '🐣', n: ['小生灵', 'New Friend'], h: ['用手指画一个圈。', 'Draw a loop with your finger.'] },
  { id: 'family', e: '🏡', n: ['一大家子', 'Big Family'], h: ['画出五个小生灵。', 'Make five creatures.'] },
  { id: 'dizzy', e: '💫', n: ['转晕了', 'So Dizzy'], h: ['抓住一个小生灵，用力甩出去。', 'Grab a creature and fling it hard.'] },
  { id: 'feed', e: '🍑', n: ['吃果子', 'Snack Time'], h: ['点一下树，让果子掉下来。', 'Tap a tree to drop some fruit.'] },
  { id: 'grow', e: '🎈', n: ['长大了', 'Growing Up'], h: ['给同一个小生灵吃三个果子。', 'Feed one creature three times.'] },
  { id: 'sing', e: '🎵', n: ['小歌手', 'Little Singer'], h: ['点一个小生灵，再点唱歌。', 'Tap a creature, then tap Sing.'] },
  { id: 'chorus', e: '🎶', n: ['大合唱', 'Choir'], h: ['画三个以上的小生灵，听它们一起唱。', 'Make three or more creatures and hear them sing together.'] },
  { id: 'flip', e: '🤸', n: ['翻跟头', 'Flip'], h: ['点一个小生灵，再点翻跟头。', 'Tap a creature, then tap Flip.'] },
  { id: 'color', e: '🎨', n: ['变变变', 'New Color'], h: ['点一个小生灵，再点变色。', 'Tap a creature, then tap Color.'] },
  { id: 'night', e: '🌙', n: ['晚安', 'Good Night'], h: ['把太阳往右边拖，让天黑下来。', 'Drag the sun to the right until it gets dark.'] },
  { id: 'star', e: '🌠', n: ['流星', 'Shooting Star'], h: ['晚上耐心看着天空。', 'Watch the night sky for a while.'] },
  { id: 'firefly', e: '✨', n: ['萤火虫', 'Fireflies'], h: ['晚上抓到五只萤火虫。', 'Catch five fireflies at night.'] },
  { id: 'wind', e: '🍃', n: ['起风啦', 'Windy'], h: ['在天上快快地划一下。', 'Swipe fast across the sky.'] },
  { id: 'flowers', e: '🌸', n: ['花海', 'Flower Field'], h: ['让地上开出三十朵花。', 'Grow thirty flowers.'] },
  { id: 'xray', e: '🔍', n: ['透视眼', 'X-ray Eyes'], h: ['点左上角的透视。', 'Tap X-ray at the top left.'] },
  { id: 'echo', e: '🎼', n: ['好耳朵', 'Good Ears'], h: ['玩「跟我唱」，记住五个音。', 'Play Sing With Me and remember five notes.'] },
  { id: 'words', e: '📖', n: ['小小词典', 'Word Explorer'], h: ['玩「认一认」，认识十个词。', 'Play Words and learn ten words.'] },
  { id: 'spy', e: '👀', n: ['火眼金睛', 'Sharp Eyes'], h: ['玩「找一找」，一次找到五样东西。', 'Play I Spy and find five things in a row.'] },
  { id: 'say', e: '💬', n: ['小小演说家', 'Chatterbox'], h: ['玩「说一说」，说三句话。', 'Play Say It and say three sentences.'] },
  { id: 'draw', e: '🖍️', n: ['小画家', 'Little Artist'], h: ['玩「画一画」，让你的画活过来。', 'Play Draw and bring a picture to life.'] },
  { id: 'hat', e: '🎩', n: ['戴帽子', 'Hat Day'], h: ['给小伙伴画一顶帽子。', 'Draw a hat for a friend.'] },
];
STICKERS.forEach(s => { STR['st_' + s.id + '_n'] = s.n; STR['st_' + s.id + '_h'] = s.h; });

/* Chinese numerals for day counts: 1 → 一, 21 → 二十一 */
const CN_DIG = '零一二三四五六七八九';
function cnum(n) { return n < 10 ? CN_DIG[n] : n < 20 ? '十' + (n % 10 ? CN_DIG[n % 10] : '') : n < 100 ? CN_DIG[Math.floor(n / 10)] + '十' + (n % 10 ? CN_DIG[n % 10] : '') : String(n); }
function dayNum(n) { return isEn() ? String(n) : cnum(n); }
/* what the narrator says for a quote: the two halves joined into one sentence */
function quoteSpeech(key) { const s = L(key); return isEn() ? s : s.split('|').join('，') + '。'; }

/* ---------- words a child can find in the world ----------
   zh + pinyin + en, a short sentence, and the I-Spy question */
const WORDS = [
  { id: 'sky', e: '🌤️', zh: '天空', py: 'tiān kōng', en: 'sky', s: ['天空蓝蓝的，好大好大。', 'The sky is blue and very big.'], q: ['天空在哪里？', 'Where is the sky?'] },
  { id: 'sun', e: '☀️', zh: '太阳', py: 'tài yáng', en: 'sun', s: ['太阳出来了，暖洋洋的。', 'The sun is out. It feels warm.'], q: ['太阳在哪里？', 'Where is the sun?'] },
  { id: 'moon', e: '🌙', zh: '月亮', py: 'yuè liang', en: 'moon', s: ['月亮弯弯的，像一条小船。', 'The moon is curved, like a little boat.'], q: ['月亮在哪里？', 'Where is the moon?'] },
  { id: 'star', e: '⭐', zh: '星星', py: 'xīng xing', en: 'star', s: ['星星一闪一闪亮晶晶。', 'Twinkle, twinkle, little star.'], q: ['星星在哪里？', 'Where are the stars?'] },
  { id: 'cloud', e: '☁️', zh: '云', py: 'yún', en: 'cloud', s: ['白白的云，在天上飘。', 'White clouds float in the sky.'], q: ['云在哪里？', 'Where is a cloud?'] },
  { id: 'rain', e: '🌧️', zh: '雨', py: 'yǔ', en: 'rain', s: ['下雨了，滴答滴答。', 'It is raining. Drip, drop.'], q: ['雨在哪里？', 'Where is the rain?'] },
  { id: 'rainbow', e: '🌈', zh: '彩虹', py: 'cǎi hóng', en: 'rainbow', s: ['彩虹有七种颜色。', 'A rainbow has seven colors.'], q: ['彩虹在哪里？', 'Where is the rainbow?'] },
  { id: 'mountain', e: '⛰️', zh: '山', py: 'shān', en: 'mountain', s: ['远处的山，一座连着一座。', 'The mountains go on and on, far away.'], q: ['山在哪里？', 'Where are the mountains?'] },
  { id: 'grass', e: '🌿', zh: '草地', py: 'cǎo dì', en: 'grass', s: ['绿绿的草地，软软的。', 'The green grass is soft.'], q: ['草地在哪里？', 'Where is the grass?'] },
  { id: 'flower', e: '🌸', zh: '花', py: 'huā', en: 'flower', s: ['花开了，香香的。', 'The flowers are open. They smell sweet.'], q: ['花在哪里？', 'Where is a flower?'] },
  { id: 'tree', e: '🌳', zh: '树', py: 'shù', en: 'tree', s: ['大树长得高高的。', 'The tree grows tall.'], q: ['树在哪里？', 'Where is a tree?'] },
  { id: 'peach', e: '🌸', zh: '桃树', py: 'táo shù', en: 'peach tree', s: ['桃树开粉色的花，结甜甜的桃子。', 'Peach trees have pink flowers and sweet peaches.'], q: ['桃树在哪里？', 'Where is the peach tree?'] },
  { id: 'pine', e: '🌲', zh: '松树', py: 'sōng shù', en: 'pine tree', s: ['松树一年四季都是绿的。', 'Pine trees stay green all year.'], q: ['松树在哪里？', 'Where is the pine tree?'] },
  { id: 'maple', e: '🍁', zh: '枫树', py: 'fēng shù', en: 'maple tree', s: ['秋天到了，枫叶变红了。', 'In autumn, maple leaves turn red.'], q: ['枫树在哪里？', 'Where is the maple tree?'] },
  { id: 'willow', e: '🌿', zh: '柳树', py: 'liǔ shù', en: 'willow tree', s: ['柳树的枝条长长的，随风飘。', 'Willow branches are long. They sway in the wind.'], q: ['柳树在哪里？', 'Where is the willow tree?'] },
  { id: 'ginkgo', e: '🍂', zh: '银杏树', py: 'yín xìng shù', en: 'ginkgo tree', s: ['银杏叶像一把小扇子。', 'Ginkgo leaves look like little fans.'], q: ['银杏树在哪里？', 'Where is the ginkgo tree?'] },
  { id: 'f_peach', e: '🍑', zh: '桃子', py: 'táo zi', en: 'peach', s: ['桃子甜甜的，水水的。', 'Peaches are sweet and juicy.'], q: ['桃子在哪里？', 'Where is the peach?'] },
  { id: 'f_pine', e: '🌰', zh: '松果', py: 'sōng guǒ', en: 'pine cone', s: ['小松鼠最爱松果。', 'Squirrels love pine cones.'], q: ['松果在哪里？', 'Where is the pine cone?'] },
  { id: 'f_maple', e: '🍒', zh: '樱桃', py: 'yīng táo', en: 'cherries', s: ['樱桃红红的，圆圆的。', 'Cherries are red and round.'], q: ['樱桃在哪里？', 'Where are the cherries?'] },
  { id: 'f_willow', e: '🍏', zh: '苹果', py: 'píng guǒ', en: 'apple', s: ['苹果脆脆的，甜甜的。', 'Apples are crunchy and sweet.'], q: ['苹果在哪里？', 'Where is the apple?'] },
  { id: 'f_ginkgo', e: '🟡', zh: '杏子', py: 'xìng zi', en: 'apricot', s: ['杏子黄黄的，酸酸甜甜。', 'Apricots are yellow, sweet and a little sour.'], q: ['杏子在哪里？', 'Where is the apricot?'] },
  { id: 'f_grape', e: '🍇', zh: '葡萄', py: 'pú tao', en: 'grapes', s: ['葡萄一串一串的。', 'Grapes grow in bunches.'], q: ['葡萄在哪里？', 'Where are the grapes?'] },
  { id: 'f_orange', e: '🍊', zh: '橘子', py: 'jú zi', en: 'orange', s: ['橘子剥开，一瓣一瓣的。', 'Peel an orange and it comes apart in pieces.'], q: ['橘子在哪里？', 'Where is the orange?'] },
  { id: 'bird', e: '🐦', zh: '小鸟', py: 'xiǎo niǎo', en: 'bird', s: ['小鸟在天上飞。', 'Birds fly in the sky.'], q: ['小鸟在哪里？', 'Where is a bird?'] },
  { id: 'firefly', e: '✨', zh: '萤火虫', py: 'yíng huǒ chóng', en: 'firefly', s: ['萤火虫在夜里发光。', 'Fireflies glow at night.'], q: ['萤火虫在哪里？', 'Where is a firefly?'] },
  { id: 'friend', e: '🐣', zh: '小伙伴', py: 'xiǎo huǒ bàn', en: 'friend', s: ['它是我的好朋友。', 'It is my good friend.'], q: ['小伙伴在哪里？', 'Where is a friend?'] },
  { id: 'house', e: '🏠', zh: '房子', py: 'fáng zi', en: 'house', s: ['小房子是我们的家。', 'A little house is a home.'], q: ['房子在哪里？', 'Where is the house?'] },
  { id: 'hat', e: '🎩', zh: '帽子', py: 'mào zi', en: 'hat', s: ['戴上帽子，真神气。', 'A hat looks so cool.'], q: ['帽子在哪里？', 'Where is the hat?'] },
  { id: 'picture', e: '🎨', zh: '画', py: 'huà', en: 'picture', s: ['这是你画的画。', 'This is a picture you drew.'], q: ['你的画在哪里？', 'Where is your picture?'] },
];
const WORD = {}; WORDS.forEach(w => { WORD[w.id] = w; });
STR.spy_friend = ['{c}的小伙伴在哪里？', 'Where is the {c} friend?'];

/* 说一说 · sentences to say, in five everyday patterns */
const SAYS = [
  { id: 'give', k: 'say_f_give', items: [
    { id: 'peach', e: '🍑', w: ['桃子', 'peach'], s: ['请你吃桃子！', 'Here is a peach for you!'], fruit: 'peach' },
    { id: 'apple', e: '🍏', w: ['苹果', 'apple'], s: ['请你吃苹果！', 'Here is an apple for you!'], fruit: 'willow' },
    { id: 'cherry', e: '🍒', w: ['樱桃', 'cherries'], s: ['请你吃樱桃！', 'Here are some cherries for you!'], fruit: 'maple' },
    { id: 'grape', e: '🍇', w: ['葡萄', 'grapes'], s: ['请你吃葡萄！', 'Here are some grapes for you!'], fruit: 'grape' },
    { id: 'orange', e: '🍊', w: ['橘子', 'orange'], s: ['请你吃橘子！', 'Here is an orange for you!'], fruit: 'orange' },
    { id: 'cone', e: '🌰', w: ['松果', 'pine cone'], s: ['请你吃松果！', 'Here is a pine cone for you!'], fruit: 'pine' },
  ] },
  { id: 'do', k: 'say_f_do', items: [
    { id: 'sing', e: '🎵', w: ['唱歌', 'sing'], s: ['请你唱首歌！', 'Please sing a song!'] },
    { id: 'dance', e: '💃', w: ['跳舞', 'dance'], s: ['请你跳个舞！', 'Please dance for me!'] },
    { id: 'flip', e: '🤸', w: ['翻跟头', 'flip'], s: ['请你翻个跟头！', 'Please do a flip!'] },
    { id: 'jump', e: '🦘', w: ['跳高', 'jump'], s: ['请你跳得高高的！', 'Please jump up high!'] },
    { id: 'spin', e: '🌀', w: ['转圈', 'spin'], s: ['请你转个圈！', 'Please spin around!'] },
    { id: 'nap', e: '😴', w: ['睡觉', 'sleep'], s: ['请你睡一会儿吧！', 'Please take a nap!'] },
  ] },
  { id: 'like', k: 'say_f_like', items: PAINTS.map((p, i) => ({ id: 'c' + i, paint: i, w: [p.zh, p.en], s: ['我喜欢' + p.zh + '。', 'I like ' + p.en + '.'] })) },
  { id: 'want', k: 'say_f_want', items: [
    { id: 'rain', e: '🌧️', w: ['下雨', 'rain'], s: ['我想要下雨。', 'I want some rain.'] },
    { id: 'rainbow', e: '🌈', w: ['彩虹', 'rainbow'], s: ['我想看彩虹。', 'I want to see a rainbow.'] },
    { id: 'wind', e: '🍃', w: ['刮风', 'wind'], s: ['我想要一阵风。', 'I want some wind.'] },
    { id: 'stars', e: '🌙', w: ['星星', 'stars'], s: ['我想看星星。', 'I want to see the stars.'] },
    { id: 'sun', e: '☀️', w: ['太阳', 'sun'], s: ['我想看太阳。', 'I want to see the sun.'] },
    { id: 'flowers', e: '🌸', w: ['好多花', 'flowers'], s: ['我想要好多花。', 'I want lots of flowers.'] },
  ] },
  { id: 'hi', k: 'say_f_hi', items: [
    { id: 'hello', e: '👋', w: ['你好', 'hello'], s: ['你好！', 'Hello!'], reply: 'c_r_hi' },
    { id: 'thanks', e: '🙏', w: ['谢谢', 'thank you'], s: ['谢谢你！', 'Thank you!'], reply: 'c_r_thanks' },
    { id: 'love', e: '❤️', w: ['我爱你', 'I love you'], s: ['我爱你！', 'I love you!'], reply: 'c_r_love' },
    { id: 'morning', e: '🌅', w: ['早上好', 'good morning'], s: ['早上好！', 'Good morning!'], reply: 'c_r_morning' },
    { id: 'night', e: '🌙', w: ['晚安', 'good night'], s: ['晚安！', 'Good night!'], reply: 'c_r_night' },
    { id: 'bye', e: '👋', w: ['再见', 'goodbye'], s: ['再见！', 'Goodbye!'], reply: 'c_r_bye' },
  ] },
];

/* 画一画 · what to draw, and what happens to it */
const DRAW_THEMES = [
  { id: 'sun', e: '☀️', w: 'sun', p: ['我们来画一个太阳吧！', 'Let us draw a sun!'], done: ['太阳升到天上去啦！', 'Up goes the sun into the sky!'] },
  { id: 'cloud', e: '☁️', w: 'cloud', p: ['我们来画一朵云吧！', 'Let us draw a cloud!'], done: ['小云朵飘起来啦，点一点它会下雨哦。', 'The little cloud floats up. Tap it to make rain!'] },
  { id: 'flower', e: '🌸', w: 'flower', p: ['我们来画一朵花吧！', 'Let us draw a flower!'], done: ['花种在草地上啦。', 'The flower is planted in the grass.'] },
  { id: 'house', e: '🏠', w: 'house', p: ['我们来画一座房子吧！', 'Let us draw a house!'], done: ['小房子盖好啦！', 'The little house is ready!'] },
  { id: 'hat', e: '🎩', w: 'hat', p: ['给小伙伴画一顶帽子吧！', 'Let us draw a hat for a friend!'], done: ['帽子戴上啦，真神气！', 'The hat is on. Looking great!'] },
  { id: 'bird', e: '🐦', w: 'bird', p: ['我们来画一只小鸟吧！', 'Let us draw a bird!'], done: ['小鸟飞起来啦！', 'The bird flies away!'] },
  { id: 'star', e: '⭐', w: 'star', p: ['我们来画一颗星星吧！', 'Let us draw a star!'], done: ['星星挂到天上啦，一闪一闪。', 'The star is up in the sky, twinkling.'] },
  { id: 'friend', e: '🐣', w: 'friend', p: ['画一个小伙伴吧，画一个圈就行！', 'Draw a new friend. A loop is enough!'], done: ['你画的小伙伴活过来啦！', 'Your friend has come alive!'] },
  { id: 'free', e: '🎨', w: 'picture', p: ['想画什么就画什么吧！', 'Draw anything you like!'], done: ['你的画变成气球，飞上天啦！', 'Your picture turns into a balloon and flies up!'] },
];
/* words for how a drawing looks: one is picked from the shape */
const ADJ = [
  { id: 'round', zh: '圆圆的', en: 'round' }, { id: 'pointy', zh: '尖尖的', en: 'pointy' }, { id: 'long', zh: '长长的', en: 'long' },
  { id: 'tall', zh: '高高的', en: 'tall' }, { id: 'curly', zh: '弯弯的', en: 'curly' }, { id: 'big', zh: '大大的', en: 'big' },
  { id: 'small', zh: '小小的', en: 'little' }, { id: 'cute', zh: '可爱的', en: 'lovely' },
];
function adjLine(adj, theme, li) { const a = ADJ.find(q => q.id === adj), w = WORD[DRAW_THEMES.find(t => t.id === theme).w]; return li ? 'Wow, a ' + a.en + ' ' + w.en + '!' : '哇，' + a.zh + w.zh + '！'; }
/* crayons */
const CRAYONS = [
  { id: 'red', hex: '#e9473c', zh: '红色', en: 'red' }, { id: 'orange', hex: '#f7931e', zh: '橙色', en: 'orange' }, { id: 'yellow', hex: '#ffd23f', zh: '黄色', en: 'yellow' },
  { id: 'green', hex: '#45b058', zh: '绿色', en: 'green' }, { id: 'blue', hex: '#2f80ed', zh: '蓝色', en: 'blue' }, { id: 'purple', hex: '#8e5bd8', zh: '紫色', en: 'purple' },
  { id: 'pink', hex: '#ff7eb6', zh: '粉色', en: 'pink' }, { id: 'brown', hex: '#8d5a3b', zh: '棕色', en: 'brown' }, { id: 'black', hex: '#2b2b33', zh: '黑色', en: 'black' },
  { id: 'white', hex: '#ffffff', zh: '白色', en: 'white' },
];
function colorLine(id, li) { if (id === 'many') return li ? 'So many colors, so pretty!' : '五颜六色的，真漂亮！'; const c = CRAYONS.find(q => q.id === id); return li ? 'I love the ' + c.en + '!' : c.zh + '的，真好看！'; }
