"""Pack the animal heads into one sprite sheet: xiaoxiao/animals.png

The heads are Kenney's "Animal Pack" (round, outlined), public domain (CC0, https://kenney.nl/assets/animal-pack).
Every head is the same 284 px circle plus ears / horns / tongue, so they are all scaled by one factor and placed with
the circle centred at the same point of a 320 x 320 cell; the page draws a cell centred on a board square.

  python3 xiaoxiao/dev/atlas.py            downloads the pack into xiaoxiao/dev/cache/ the first time"""
import io, os, sys, urllib.request, zipfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
URL = 'https://kenney.nl/media/pages/assets/animal-pack/480cf9f223-1677669996/kenney_animal-pack.zip'
ORDER = ['pig', 'panda', 'hippo', 'giraffe', 'parrot', 'snake', 'penguin']   # same order as ANIMALS in src/board.js
CELL, CX, CY, SCALE = 320, 160, 166, 0.75

def main():
    zpath = os.path.join(HERE, 'cache', 'kenney_animal-pack.zip')
    if not os.path.exists(zpath):
        os.makedirs(os.path.dirname(zpath), exist_ok=True)
        urllib.request.urlretrieve(URL, zpath)
    z = zipfile.ZipFile(zpath)
    sheet = Image.new('RGBA', (CELL * len(ORDER), CELL), (0, 0, 0, 0))
    for k, name in enumerate(ORDER):
        im = Image.open(io.BytesIO(z.read(f'PNG/Round (outline)/{name}.png'))).convert('RGBA')
        w, h = im.size
        cy = 142 if name in ('snake', 'parrot', 'penguin', 'pig', 'panda') else h - 142.5   # circle centre in the source
        im = im.resize((round(w * SCALE), round(h * SCALE)), Image.LANCZOS)
        sheet.alpha_composite(im, (round(k * CELL + CX - w * SCALE / 2), round(CY - cy * SCALE)))
    out = os.path.join(SITE, 'animals.png')
    sheet.save(out, optimize=True)
    print('wrote', out, os.path.getsize(out) // 1024, 'KB')

if __name__ == '__main__':
    main()
