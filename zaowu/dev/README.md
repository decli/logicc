# 造物 · 开发说明

`zaowu/index.html` 是构建出来的文件，不要直接改。源码在这里：

```
dev/
  src/        页面源码（head.html + 若干 .js，按 build.py 里的顺序拼成一个页面）
  build.py    构建：src → ../index.html，并把新合成的语音包拷到 ../
  voice/      collect.js：列出页面会说的每一句（合成和打包用仓库根目录的 dev/voice）
```

## 只改代码或画面

```bash
python3 zaowu/dev/build.py
cd ~/logicc && python3 -m http.server 8000   # 打开 http://localhost:8000/zaowu/
```

## 改了台词（src/i18n.js）

新台词如果不在语音包里，页面会自动用设备自带的语音读，不会报错。想让它们也用录好的语音，在仓库根目录跑：

```bash
python3 dev/voice/build.py zaowu    # 列出台词 → 只录新句子 → 打包 → 重建 ../index.html
```

语音、语速、多音字怎么处理，见 [`dev/voice/README.md`](../../dev/voice/README.md)。
