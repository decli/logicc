# 全站语音包

首页的闯关游戏和「造物」说的每一句话，都提前用微软的神经网络语音（通过 [edge-tts](https://github.com/rany2/edge-tts)）录好，
打成语音包随页面发布。页面先查语音包，查不到的句子（比如刚加的新台词）或者语音包没加载出来，才退回设备自带的语音合成。

| 语音包 | 谁在用 | 内容 |
| --- | --- | --- |
| `voice-zh.bin` / `.json`（站点根目录） | 首页的闯关游戏 | 每道题的读题、提示、表扬，带数字的句子按所有可能的数字展开 |
| `zaowu/voice-zh.*`、`zaowu/voice-en.*` | 造物 | 旁白和两只小生灵，中英文各一套；外加「词 + 翻译 + 例句」连读的整段 |

## 声音

| 角色 | 中文 | 英文 |
| --- | --- | --- |
| 旁白（首页读题也是她） | 晓晓 `zh-CN-XiaoxiaoNeural`，-20% | Ava `en-US-AvaMultilingualNeural`，-25% |
| 小生灵 A | 晓伊 `zh-CN-XiaoyiNeural`，-10% | Ana `en-US-AnaNeural`，-20% |
| 小生灵 B | 云夏 `zh-CN-YunxiaNeural`，-10% | Emma `en-US-EmmaMultilingualNeural`，-20%，音调 +15Hz |

语速是量出来的：旁白约每秒 3.5 个音节、英文约每分钟 150 词，六岁的孩子跟得上；小生灵稍快一点，更活泼。
英文小生灵 B 原本是 Maisie（英式童声），用语音识别回听时她被听错的比例是 Ana 的两倍（21% 对 10%），
所以换成了更清楚的 Emma，音调稍微调高一点显得年轻。在 `voicekit.py` 的 `VOICES` 里改。

中英文混在一起的地方（认一认、找一找、说一说、画一画），每种语言都由母语音色来说（中文晓晓、英文 Ava），
但「苹果 → apple → 苹果脆脆的，甜甜的」这样连着说的几句录成**一整段**：音量对齐、中间按真人说话的节奏留出停顿，
不再是三段音频各自起停。页面的 `Voice.seq` 会自动找最长的整段来播（`zaowu/dev/src/voice.js` 的 `mergeRuns`）。

## 多音字

edge-tts 只收纯文本，不能直接告诉它拼音，`<phoneme>` 之类的 SSML 标签会被服务端拒绝。所以分三步（`zhpoly.py`）：

1. **该读什么**：jieba 分词 + pypinyin 定出每个字的读音，再用手工核对过的 `POLY` 表覆盖（「长大」zhǎng、「一整行」háng、「宫商角徵羽」jué zhǐ……）。
2. **它实际读了什么**：把这个字分别换成各个读音的同音字（长 → 掌 / 常），每种读音换三个字各录一遍，
   只截取这个字所在的那个音节，比较频谱（MFCC）和音高曲线（DTW 对齐），看原句离哪种读音更近。
   得分 s = (到错误读音的距离 − 到正确读音的距离) / 两种读音之间的距离；s ≥ 0.25 判为读对，≤ −0.25 判为读错。
3. **读错就换字**：送给语音服务的文本里，用正确读音的同音字替换这个字（屏幕上显示的还是原文）。

为什么不用语音识别来查：识别模型输出的是汉字，「长大」读成 cháng dà 也会被识别成「长大」，多音字读错它根本看不出来。

每次构建会列出被纠正的字和拿不准的字（`poly-report-*.json`）。拿不准的，看一眼上下文，必要时往 `POLY` 里加一条。

## 怎么用

需要 Python 3.10+、Node 18+、ffmpeg，以及：

```bash
pip install edge-tts numpy librosa lameenc jieba pypinyin faster-whisper
```

```bash
python3 dev/voice/build.py root     # 首页游戏 → voice-zh.bin|json
python3 dev/voice/build.py zaowu    # 造物 → zaowu/voice-zh|en.*，并重建 zaowu/index.html
python3 dev/voice/build.py check root    # 可选：用 Whisper 回听，列出读得不对的句子
```

录过的音频缓存在 `dev/voice/cache/`，改了几句台词再跑，只会重录改动的部分。

- 首页的台词由 `collect_root.js` 从 `index.html` 里读出来：固定的句子直接提取，带数字、关卡名、图形名的句子按所有取值展开。
  新加了一处 `Voice.say(...)` 而它不认识，会报 `NOT COVERED`，按提示在脚本里补上。
- 造物的台词由 `zaowu/dev/voice/collect.js` 从 `i18n.js` 列出。
