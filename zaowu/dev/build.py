"""Build 造物 for the logicc site: dev/src/*  →  zaowu/index.html
Also copies freshly synthesized voice banks (dev/voice/out) next to it, if any."""
import pathlib, json, shutil
dev = pathlib.Path(__file__).resolve().parent
src, site = dev / 'src', dev.parent
ORDER = ['core', 'i18n', 'sky', 'audio', 'voice', 'life', 'weather', 'creature', 'game', 'genesis', 'story', 'input', 'xray', 'main']
js = '\n'.join((src / f'{n}.js').read_text(encoding='utf-8') for n in ORDER)
js = js.replace('__LOC__', str(js.count('\n') + 1))
head = (src / 'head.html').read_text(encoding='utf-8')
build = {'voice': './', 'home': '../', 'logicc': True}
body = head + '\n<script>\nconst BUILD = ' + json.dumps(build) + ';\n(() => {\n' + js + '\n})();\n</script>\n'
extra = ('<meta name="theme-color" content="#070a16"><meta name="apple-mobile-web-app-capable" content="yes">'
         '<link rel="manifest" href="../manifest.webmanifest"><link rel="apple-touch-icon" href="../apple-touch-icon.png">'
         '<meta name="description" content="造物：点开混沌之蛋，种树、召云、画一个圈让它活过来。">')
doc = ('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' + extra + '</head><body>\n' + body + '</body></html>')
(site / 'index.html').write_text(doc, encoding='utf-8')
out = dev / 'voice' / 'out'
for f in ['voice-zh.bin', 'voice-zh.json', 'voice-en.bin', 'voice-en.json']:
    if (out / f).exists(): shutil.copy(out / f, site / f)
print('wrote', site / 'index.html')
