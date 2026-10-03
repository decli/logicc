# 造物 · 开发说明

`zaowu/index.html` 是构建出来的文件，不要直接改。源码在这里：

```
dev/
  src/        页面源码（head.html + 若干 .js，按 build.py 里的顺序拼成一个页面）
  build.py    构建：src → ../index.html，并把新合成的语音包拷到 ../
  voice/      语音包工具：collect.js（列出所有台词）、synth.py（合成）、check.py（反向听写检查）
```

## 只改代码或画面

```bash
python3 zaowu/dev/build.py
cd ~/logicc && python3 -m http.server 8000   # 打开 http://localhost:8000/zaowu/
```

## 改了台词（src/i18n.js）

新台词如果不在语音包里，页面会自动用设备自带的语音读，不会报错。想让它们也用神经网络语音：

1. 准备环境（Python 3.10+、Node 18+）：

   ```bash
   pip install sherpa-onnx numpy lameenc soundfile pypinyin jieba pyworld
   ```

2. 下载模型到 `dev/voice/models/`（约 1.4GB，只在合成时用，不进仓库）：

   ```bash
   cd zaowu/dev/voice && mkdir -p models && cd models
   base=https://github.com/k2-fsa/sherpa-onnx/releases/download
   # 中文：ZipVoice（fp32 模型 + 带拼音词典的 int8 包里的 lexicon.txt / tokens.txt）
   for m in sherpa-onnx-zipvoice-distill-zh-en-emilia sherpa-onnx-zipvoice-distill-int8-zh-en-emilia; do curl -LO $base/tts-models/$m.tar.bz2 && tar xjf $m.tar.bz2; done
   # 英文 + 中文音色提示：Kokoro
   for m in kokoro-multi-lang-v1_1 kokoro-multi-lang-v1_0; do curl -LO $base/tts-models/$m.tar.bz2 && tar xjf $m.tar.bz2; done
   # 反向听写（合成时自动检查读音）
   curl -LO $base/asr-models/sherpa-onnx-paraformer-zh-small-2024-03-09.tar.bz2 && tar xjf sherpa-onnx-paraformer-zh-small-2024-03-09.tar.bz2
   curl -LO $base/asr-models/sherpa-onnx-whisper-tiny.en.tar.bz2 && tar xjf sherpa-onnx-whisper-tiny.en.tar.bz2
   ```

3. 合成并打包（已合成过的句子有缓存，只会合成新句子；两核 CPU 上全部重做约 3 小时）：

   ```bash
   cd zaowu/dev/voice
   node collect.js          # → lines.json（页面会说的每一句）
   python3 audit.py         # 可选：列出所有多音字和选定的读音，逐条过目
   python3 synth.py zh en   # → out/voice-zh.bin|json, out/voice-en.bin|json
   python3 check.py en      # 可选：英文反向听写
   cd ../ && python3 build.py
   ```

## 中文读音（多音字）

中文不让模型自己猜拼音：`voice/zhfront.py` 先用和 ZipVoice 训练时相同的方法（jieba 分词 + pypinyin，含变调）算出每个字的拼音，
再用手工核对过的 `POLY` 表覆盖多音字（例如「天和地」→ tian1 he2 di4，「长大」→ zhang3 da4，「转个圈」→ zhuan4），
结果写成一份自定义词典交给模型。读音不对时，在 `POLY` 里加一条「词语: 拼音」，重新跑 `synth.py` 即可（只会重录受影响的句子）。

合成时每一句都会用语音识别模型反向听写、按拼音（不计声调）比对；对不上就换语速重录，最多四次，结果写在 `voice/zh-report.json`。
很短的句子（三个字以内，比如「云」「你好！」）放在「我们一起说，……」里合成，再从停顿处剪下来，这样不会被拉长或吞字。

## 音色

| 语言 | 旁白 | 小生灵 A | 小生灵 B |
| --- | --- | --- | --- |
| 中文（ZipVoice，零样本） | Kokoro 30 号音色作提示，语调幅度放大 1.5 倍 | Kokoro 40 号音色作提示 | Kokoro 11 号音色作提示 |
| 英文（Kokoro v1.0） | af_heart，0.85 倍速 | af_sarah | bf_alice |

ZipVoice 只模仿提示音的音色和说话方式，提示音全部来自合成音色，不克隆任何真人。
在 `voice/synth.py` 的 `PROMPTS`（中文）和 `EN`（英文）里改。小生灵的声音按原速播放，不再靠加速变尖。
