"""decli's 梦想群岛 pictures for the home page (dev/home-designs/art/, see art/README.md) → the page's pictures in home/.

  python3 dev/home-designs/art.py      art/*.png, art/b/*.png  →  ../../home/*.webp

Sixteen of the pictures are on pure magenta (#FF00FF) instead of a transparent background: the magenta is keyed out with
a soft edge, and the edge pixels are un-mixed from it (so felt fuzz doesn't keep a pink fringe). The others are already
transparent; the sea is a tile and stays whole. Every picture keeps its canvas (they are drawn to one framing: the
islands all sit the same way in their 1600 x 1000, which is where the page puts the games on them), only made smaller.
Prints where each island's meadow is (as fractions of its picture), which index.html uses to place the games."""
import pathlib, sys
import numpy as np
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ART, OUT = HERE / 'art', HERE.parent.parent / 'home'
GAMES = ['schulte', 'dots', 'bond', 'pattern', 'span', 'mirror', 'fit', 'mofang', 'shi', 'piano', 'xiaoxiao', 'wuziqi']
ISLES = ['num', 'look', 'turn', 'art', 'play']
KEY = np.array([255, 0, 255], np.float32)


def cutout(im):
    """RGBA with the background see-through: kept if it already is, else the magenta keyed out"""
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    if (a[..., 3] < 250).mean() > 0.02:
        return im.convert('RGBA')
    d = np.sqrt(((a[..., :3] - KEY) ** 2).sum(-1))
    alpha = np.clip((d - 40) / 70, 0, 1)   # within 40 of magenta: gone; beyond 110: kept; a soft edge between
    k = alpha[..., None]
    rgb = np.where(k > 0.02, (a[..., :3] - KEY * (1 - k)) / np.maximum(k, 0.02), 0)
    out = np.dstack([np.clip(rgb, 0, 255), alpha * 255])
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def save(im, name, side=None, q=84, size=None):
    OUT.mkdir(exist_ok=True)
    if size:
        im = im.resize(size, Image.LANCZOS)
    elif side:
        f = side / max(im.size)
        im = im.resize((round(im.width * f), round(im.height * f)), Image.LANCZOS)
    path = OUT / f'{name}.webp'
    im.save(path, 'WEBP', quality=q, method=6)
    print(f'  {name}.webp  {im.width}x{im.height}  {path.stat().st_size // 1024} KB')
    return im


def meadow(im):
    """the island's grass: its centre and size, as fractions of the picture (where the games go)"""
    a = np.asarray(im.convert('RGBA')).astype(np.int16)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    grass = (al > 200) & (g > r + 25) & (g > b + 40)
    ys, xs = np.where(grass)
    h, w = grass.shape
    # the middle 90% of the grass, so a tree at the edge doesn't pull it
    x0, x1 = np.percentile(xs, [5, 95]); y0, y1 = np.percentile(ys, [5, 95])
    return [round(float(v), 3) for v in ((x0 + x1) / 2 / w, (y0 + y1) / 2 / h, (x1 - x0) / w, (y1 - y0) / h)]


def main():
    if not ART.exists():
        sys.exit(f'no pictures: {ART}')
    for g in GAMES:
        save(cutout(Image.open(ART / f'{g}.png')), f'ic-{g}', side=256, q=86)
    save(cutout(Image.open(ART / 'pal-wave.png')), 'pal-wave', side=320, q=86)
    spots = {}
    for i in ISLES:
        im = cutout(Image.open(ART / 'b' / f'isle-{i}.png'))
        spots[i] = meadow(im)
        save(im, f'isle-{i}', size=(960, 600), q=82)
    for n, side in (('sailboat', 200), ('buoy', 120), ('compass', 220), ('cloud', 360)):
        save(cutout(Image.open(ART / 'b' / f'{n}.png')), n, side=side, q=84)
    save(Image.open(ART / 'b' / 'sea.png').convert('RGB'), 'sea', side=768, q=78)
    print('meadows (centre x, centre y, width, height of the picture):')
    for i, m in spots.items():
        print(f'  {i}: {m}')


if __name__ == '__main__':
    main()
