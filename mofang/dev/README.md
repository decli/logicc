# 魔方世界 · 开发

```bash
cd mofang/dev && npm install        # esbuild + three（只在开发时需要）
node build.mjs                      # src/* → ../app.js（压缩打包）+ ../index.html
python3 -m http.server 8000 --directory ../..   # 打开 http://localhost:8000/mofang/
```

调试用的地址参数：`?go` 跳过「点一下开始」，`?w=<小岛>&l=<关>` 直接进某一关（`l` 从 0 数起，`free` 是自由玩），
`?debug` 把内部对象挂到 `window.MF`，并且在软件渲染（几帧每秒）时也让动画按真实时间走。
小岛的 id：`views` 小熊看积木、`count` 数积木、`wall` 钻墙洞、`nets` 折纸盒、`cube` 转魔方、`build` 搭城堡。
例如 `http://localhost:8000/mofang/?go&w=cube&l=free`。

| 文件 | 做什么 |
| --- | --- |
| `src/main.js` | 启动、每帧循环、慢设备自动降分辨率、开始按钮 |
| `src/core.js` | 小工具；`Store` 存进度（localStorage `logicc.mofang.v1`）；`Scope` 管一屏 / 一题里的计时器、动画、监听，退出时一起清掉 |
| `src/stage.js` | 渲染器、天空、灯光；环绕镜头（转、捏合缩放、飞到某个机位，`setViewOffset` 让内容居中在没被按钮挡住的区域）；触控分发；小窗口（同一块画布上剪一块渲染另一个场景） |
| `src/blocks.js` | 圆角积木、半透明的「影子积木」、漂浮小岛、六种小动物（全是球拼的）、数字徽章 |
| `src/fx.js` | 彩带、星光、Good! → Unbelievable! 的大字 |
| `src/ui.js` | 顶栏、右边 / 下边的选项面板（横屏在右，竖屏在下）、工具按钮、示范的小手、过关卡片、家长设置 |
| `src/game.js` | 六个小岛和每关的流程：开场白 → 三题 → 星星；`Round` 是一题（说话、答对答错、提示、长时间没动作） |
| `src/map.js` | 小岛圈：拨一下转一个岛，关卡泡泡（🔒 / 星星 / 发光的下一关） |
| `src/lines.js` | 所有旁白（录音脚本 `voice/collect.mjs` 从这里读） |
| `src/modes/views.js` | 小熊看积木：生成积木堆，保证几个方向看到的图互不相同，飞到小动物眼睛的位置（窄视角 = 近似正投影） |
| `src/modes/count.js` | 数积木：算出从斜上方看不见的块数，用它控制难度；飞散开一块块报数 |
| `src/modes/wall.js` | 钻墙洞：24 种朝向用整数矩阵表示，判断积木沿 z 方向的投影能不能放进洞里 |
| `src/modes/nets.js` | 折纸盒：枚举 35 种六连方，找出 11 种正方体展开图；按折叠树一层层绕铰链转 90° 来折 |
| `src/modes/cube.js` | 魔方：手指拨动转层（按屏幕上的方向判断转哪层、往哪转）、打乱、记下复原步骤给提示箭头、自动复原 |
| `src/modes/build.js` | 搭城堡：点哪个面就在哪边放积木；模型库（小台阶、小桥、小鸭子、火箭、城堡…）；比对时允许整体转 90° |

## 加 / 改关卡

每个小岛的 `levels` 数组就是关卡表，改数字就行（积木数、高度、展开图种类、魔方阶数和打乱步数、要搭的模型）。
加一关要在 `src/lines.js` 里给它的开场白加一句（`intro` 数组按关卡顺序），首页卡片上的星星总数（`index.html` 里 `mofang` 那一条的 `/93`）也跟着改。

## 语音

旁白用 edge-tts 预录：中文是晓晓，喊好的英文是 Ana（童声）。改了 `src/lines.js` 以后在仓库根目录运行

```bash
python3 dev/voice/build.py mofang    # → mofang/voice.bin + voice.json，只录新句子
```

`voice/collect.mjs` 会把 `lines.js` 里的每一句列出来（数字按「一二三」录）。没录到的句子不出声（不用设备自带的语音），带 `?debug` 时控制台会提示哪句没录。
