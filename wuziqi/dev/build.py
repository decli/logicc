"""Build 五子棋 for the logicc site: dev/src/*  →  wuziqi/index.html (one page, no dependencies)

  python3 wuziqi/dev/build.py"""
import pathlib
dev = pathlib.Path(__file__).resolve().parent
src, site = dev / 'src', dev.parent
ORDER = ['core', 'engine', 'lines', 'audio', 'voice', 'board', 'ui', 'main']
js = '\n'.join((src / f'{n}.js').read_text(encoding='utf-8') for n in ORDER)
js = js.replace("if (typeof module !== 'undefined') module.exports = Gomoku;\n", '')
head = (src / 'head.html').read_text(encoding='utf-8')
meta = ('<meta name="theme-color" content="#f7f0e1"><meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="mobile-web-app-capable" content="yes">'
        '<link rel="manifest" href="../manifest.webmanifest"><link rel="apple-touch-icon" href="../apple-touch-icon.png"><link rel="icon" href="../icon-192.png">'
        '<meta name="description" content="五子棋：和小黄鸡、小兔子、小狐狸、猫头鹰四个由易到难的电脑对手下，或者两个人轮流下。">')
doc = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">'
       + meta + head + '<script>\n(() => {\n\'use strict\';\n' + js + '\n})();\n</script>\n</body></html>\n')
(site / 'index.html').write_text(doc, encoding='utf-8')
print(f'wrote {site / "index.html"}  ({len(doc) // 1024} KB)')
