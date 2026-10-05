# 彩虹钢琴 · 开发

```bash
cd piano/dev && npm install         # esbuild + three（只在开发时需要）
node build.mjs                      # src/* → ../app.js（压缩打包）+ ../index.html
node build.mjs --watch              # 改了就重建
python3 -m http.server 8000 --directory ../..   # 打开 http://localhost:8000/piano/
```

地址后面加 `?open` 会跳过「点一下打开钢琴」，调试用。

| 文件 | 做什么 |
| --- | --- |
| `src/main.js` | 启动、每帧循环、慢设备自动降分辨率 |
| `src/scene.js` | 渲染器、天空（渐变 + 光斑 + 夜里的星星）、彩虹舞台、灯光、白天 / 夜晚过渡 |
| `src/piano.js` | 三角钢琴：琴身轮廓、琴盖和撑杆、铁板琴弦制音器、88 个琴键（按键用解析几何判定，不做网格射线检测）、谱架、琴腿踏板 |
| `src/camera.js` | 三种镜头：看钢琴（环绕、捏合缩放、无人操作时慢慢转）、展开键盘（按一屏要放几个键算出机位）、音乐会（六个机位轮换） |
| `src/fx.js` | 特效：实例化的发光精灵、按住多久就有多长的光柱、唱名、烟花、彩纸、彩虹 |
| `src/audio.js` | 采样钢琴、八音盒 / 木琴 / 游戏机合成、混响、限幅、界面音效（全在 C 大调五声音阶里） |
| `src/input.js` | 多指触控、滑奏、手势、电脑键盘（A–L 一排是白键，Z / X 换八度） |
| `src/player.js` | 一个键按下去要发生的所有事：声音、琴键、光、录音、通知各个玩法 |
| `src/app.js` | 开场、四种玩法、按钮和面板 |
| `src/songs.js` | 曲库，用简谱写（见文件开头的说明），伴奏由和弦记号自动生成 |
| `src/lines.js` | 旁白台词（录音脚本 `voice/collect.mjs` 也从这里读） |
| `src/sheet.js` `src/guide.js` | 谱架上的彩色乐谱、跟弹时悬在键上的糖果球 |
| `samples.py` | 下载 Salamander 采样，裁剪、转单声道、打包成 `../piano.bin` |

加一首歌：在 `songs.js` 的 `RAW` 里照样写一条，`mel` 是旋律（简谱），`lyr` 是歌词（一个字对一个音，`~` 表示拖音），`chords` 是和弦（`C:2` 表示 C 和弦两拍）。只想让钢琴演奏、不用来教的，加 `listenOnly: true`，可以用 `lh` 直接写左手。然后重录语音包（歌名会出现在旁白里）。
