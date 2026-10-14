"""Build 动物消消乐 for the logicc site: dev/src/*  →  xiaoxiao/index.html (one page, no dependencies)

  python3 xiaoxiao/dev/build.py"""
import pathlib
dev = pathlib.Path(__file__).resolve().parent
src, site = dev / 'src', dev.parent
ORDER = ['core', 'board', 'levels', 'lines', 'audio', 'voice', 'art', 'fx', 'math', 'game', 'ui', 'main']
js = '\n'.join((src / f'{n}.js').read_text(encoding='utf-8') for n in ORDER).replace("'use strict';\n", '')
head = (src / 'head.html').read_text(encoding='utf-8')
meta = ('<meta name="theme-color" content="#ffd9ef"><meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="mobile-web-app-capable" content="yes">'
        '<link rel="manifest" href="../manifest.webmanifest"><link rel="apple-touch-icon" href="../apple-touch-icon.png"><link rel="icon" href="../icon-192.png">'
        '<meta name="description" content="动物消消乐：三个连成一排就消掉，十关闯关，每局之后做一页数学题。">')
doc = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">'
       + meta + head + '<script>\n(() => {\n\'use strict\';\n' + js + '\n})();\n</script>\n</body></html>\n')
(site / 'index.html').write_text(doc, encoding='utf-8')
print(f'wrote {site / "index.html"}  ({len(doc) // 1024} KB)')
