# 动物消消乐 · 开发

```bash
python3 xiaoxiao/dev/build.py              # src/* → ../index.html（一个文件，无依赖）
python3 -m http.server 8000                # 在仓库根目录；打开 http://localhost:8000/xiaoxiao/
node xiaoxiao/dev/sim.js                   # 每关让两个机器人各玩 200 局，看胜率、步数、分数
node xiaoxiao/dev/sim.js 3 500             # 只跑第 3 关，500 局
python3 dev/voice/build.py xiaoxiao        # 改了台词或关卡后重录语音包 ../voice.bin|json（只录新句子）
python3 xiaoxiao/dev/heads.py              # 从 art/ 里 decli 画的头像图切出 70 个头像 → ../heads.webp 和 src/heads.js
```

地址后面加 `?go` 跳过开始按钮，加 `?debug` 会在控制台留一个 `XX`（`XX.UI.play(4)` 直接进第 5 关，`XX.Store.d.open = 10` 打开全部关卡，`XX.Store.d.owed = false` 免做下一页数学题，`XX.Teach.open({ nums: [8, 5], signs: ['+'], ans: 13 }, document.querySelector('#math .sheet'))` 在数学题页上直接看小老师讲 8+5，`XX.Store.d.way = 'split'` 先定好用哪种办法），调试用。

| 文件 | 做什么 |
| --- | --- |
| `src/head.html` | 页面骨架和全部样式（糖果按钮、地图、侧栏 / 顶栏、卡片、数学题页、家长设置） |
| `src/core.js` | 小工具、缓动、`Clock`（只在画面刷新时走的游戏时钟，暂停和切到后台时所有动画一起停）、`Store`（存进度和设置） |
| `src/board.js` | 规则本身，不碰画面：交换、找连线、特别的小动物和组合、冰块 / 礼物盒 / 泡泡 / 小企鹅、掉落（含斜着滑）、洗牌、加分。一步要发生的事一次算完，按时间排成「阶段」交给画面去演；`excitement` 算这一步值得喊哪个词 |
| `src/levels.js` | 十关的设定，格式写在文件开头 |
| `src/lines.js` | 旁白说的每一句话、英文欢呼用哪段录音、`FRIENDS`（70 个动物的名字、稀有程度和主色，和头像图同一个顺序）。录音脚本 `voice/collect.js` 也从这里读 |
| `src/cast.js` | 每局（每次打开关前卡片、重玩、下一关）从 `FRIENDS` 里随机抽 6 个动物上棋盘：颜色各不相同，长得像的（同一种主色，或 `Cast.NEAR` 里写的相近颜色）不会同局出现；有小企鹅的关不抽黑白和灰色的 |
| `src/game.js` | 一关在玩的时候：画棋盘、手指拨动、把 board.js 算好的阶段一段段演出来、侧栏的步数 / 目标 / 分数、过关和失败 |
| `src/heads.js` | `heads.py` 生成的：每个头像在 `heads.webp` 里的大小 |
| `src/art.js` `src/fx.js` | 从 `heads.webp` 取小动物头像，各种格子的预渲染；粒子、光束、闪电、冲击波、飞向目标的小动物、Great! … Unbelievable! 大字 |
| `src/gift.js` | 过关拆盲盒（掉下来、点三下、蹦出小伙伴、稀有款 / 隐藏款的光）和地图上 🎁 打开的动物收集册；抽到谁的概率写在 `Gift.ODDS` |
| `src/audio.js` `src/voice.js` | Web Audio 实时合成的音效；decli 的背景音乐和英文欢呼（`../sound/`，暂停和数学题页时音乐停）；语音包播放。下载失败（比如刚发布新版本那一会儿）会自己隔几秒再取，头像图也一样。从不用设备自带的语音：语音包里没有的句子就不出声，`?debug` 时在控制台列出来 |
| `src/wheel.js` | 数学题页之前的转盘：她点一下，转约 3 秒停在 2～10 中的一个（先公平抽好再转，格子一样大），转到的数存在 `Store.d.spin`，这一页做完前不重转 |
| `src/teach.js` | 小老师：答错两次或点 💡 时盖在题目上，她选一种办法（`Teach.W`：`frame` 摆一摆、`line` 跳一跳、`split` 拆一拆，`Teach.plan` 是拆一拆的步骤）；只数加进来 / 拿走的个数，从不显示或说出答案，还错就带着她一个一个数（`Teach.guide`）；键盘留在旁边让她自己写答案，拆一拆的中间步骤也用这个键盘（`Teach.key`） |
| `src/math.js` | 数学题页：出题、数字键盘、记录；答错第一次判断错在哪说一句提示（`MathGate.why`），小老师帮完做对后把下一道换成同类题（`MathGate.twin`） |
| `src/ui.js` | 地图、关前卡片、结果卡片、暂停、家长专区 |
| `src/main.js` | 启动和每帧循环 |
| `sim.js` | 关卡模拟器（见下） |
| `heads.py` `art/` | decli 画的头像图（`heads-sheet-1.png` 前 50 个大一点，`heads-sheet-2.png` 全部 70 个）；每个头像取最清楚的那一份，打包成 `heads.webp`。以后有更大的同样排版的图，加进 `SHEETS` 就行；某一个单独有图时放 `art/heads/<id>.png` |
| `voice/collect.js` | 列出要录的每一句话 → `voice/lines.json` |

## 加一关、调难度

在 `levels.js` 的 `LEVELS` 里照样写一条：`layout` 每行一个字符串（`.` 普通格，`_` 没有格子，`i` / `I` 一层 / 两层冰，`b` / `B` 一层 / 两层礼物盒，`o` 泡泡，`g` 小企鹅），`goals` 写目标，`stars` 写一、二、三星的分数，`tip` 写这一关新教的东西（对应 `lines.js` 里 `L.tip` 的一句话）。地图、旁白的关卡介绍、模拟器都会自动带上它。

然后跑 `node xiaoxiao/dev/sim.js <第几关>` 定步数和星星：

- **random** 每步随便挑一个能消的，像只会找眼前一对的孩子；**greedy** 每步把所有走法都试一遍，挑对目标最有用的，像认真但不往后多想的孩子
- 现在十关的定法：greedy 赢 87%–100%，random 赢 14%–73%；greedy 大约八成拿到两星、四成拿到三星（模拟器每关打印两者的胜率、得分中位数和 85 分位、几星的比例）
- 模拟器每一步都检查：走完棋盘上没有空格、没有留下没消的三连。礼物盒摆法要小心：盒子下面的格子只能靠旁边的小动物斜着滑进来补，三个盒子连成一排、或贴边两个挨着，下面就会留下补不上的空格

改了 `levels.js`、`lines.js` 之后记得重新 `build.py`；关卡介绍是旁白念的，也要重录语音包，不然新句子不出声。
