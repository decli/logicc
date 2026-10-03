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
   pip install sherpa-onnx numpy lameenc soundfile
   ```

2. 下载模型到 `dev/voice/models/`（约 700MB，只在合成时用，不进仓库）：

   ```bash
   cd zaowu/dev/voice && mkdir -p models && cd models
   base=https://github.com/k2-fsa/sherpa-onnx/releases/download
   for m in kokoro-multi-lang-v1_1 kokoro-multi-lang-v1_0; do curl -LO $base/tts-models/$m.tar.bz2 && tar xjf $m.tar.bz2; done
   # 可选，check.py 用来反向听写：
   curl -LO $base/asr-models/sherpa-onnx-paraformer-zh-small-2024-03-09.tar.bz2 && tar xjf sherpa-onnx-paraformer-zh-small-2024-03-09.tar.bz2
   curl -LO $base/asr-models/sherpa-onnx-whisper-tiny.en.tar.bz2 && tar xjf sherpa-onnx-whisper-tiny.en.tar.bz2
   ```

3. 合成并打包（已合成过的句子有缓存，只会合成新句子）：

   ```bash
   cd zaowu/dev/voice
   node collect.js          # → lines.json
   python3 synth.py zh en   # → out/voice-zh.bin|json, out/voice-en.bin|json
   python3 check.py zh      # 可选：列出听写对不上的句子
   cd ../ && python3 build.py
   ```

读音不对的句子，在 `voice/overrides.json` 里给它一个“合成用的写法”（比如把「成了地」写成「成了大地」），
页面上显示的文字不变。

## 音色

| 语言 | 旁白 | 小生灵 A | 小生灵 B |
| --- | --- | --- | --- |
| 中文（Kokoro v1.1-zh） | 12 号女声 | 44 号女孩声 | 59 号男孩声 |
| 英文（Kokoro v1.0） | af_heart | af_bella | am_puck |

在 `voice/synth.py` 的 `VOICES` 里改。音色是用语音识别准确率和基频挑出来的：旁白要清楚、语速偏慢，小生灵要音高更高。
播放时小生灵按体型再调高音调（越小越尖），见 `src/creature.js` 的 `vrate`。

模型：[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)（Apache-2.0），v1.1-zh 的中文数据由 LongMaoData 提供；推理用 [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx)。
