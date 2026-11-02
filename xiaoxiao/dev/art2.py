"""decli's pictures for season two → the page's pictures.

  python3 xiaoxiao/dev/art2.py      dev/art/season2/*.webp|png  →  xiaoxiao/s2/*.webp, the list in src/art2.js, then build.py

What to draw is in dev/art/PROMPTS.md. decli drew all sixteen (2026-11-02); they are kept here as WebP at quality 95
(the PNGs were 29 MB), and a new PNG with the same name is used instead when it is there. Any of the files may be
missing: the game draws its own until it is there.
  eggs.png             two eggs side by side: the left half becomes egg.webp, the right half egg-crack.webp
  balloon.png cage.png the balloon and the cage (the cage's middle stays see-through; where its badge hangs is
                       measured and written to src/art2.js, for the caged animal's head)
  grass.png            the grass texture, any size, made 256 x 256
  island-N.png         the island pictures (N = 1-6, ISLANDS' order), at most 512 on the longer side
  island-N-bg.png      the island maps, made 1600 x 1067 (3:2)
A picture without a transparent background is cut out from its background colour (the colour of its corners), which
the prompts ask to be one the picture doesn't use; the maps and the grass are kept whole."""
import json, pathlib, re, subprocess, sys
import numpy as np
from PIL import Image

DEV = pathlib.Path(__file__).resolve().parent
SRC, OUT, LIST = DEV / 'art' / 'season2', DEV.parent / 's2', DEV / 'src' / 'art2.js'


def cutout(im):
    """RGBA with the background see-through: kept if it already is, else keyed out by the corners' colour"""
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    if (a[..., 3] < 250).mean() > 0.02:
        return im.convert('RGBA')
    h, w = a.shape[:2]
    corners = np.concatenate([a[:8, :8, :3].reshape(-1, 3), a[:8, -8:, :3].reshape(-1, 3), a[-8:, :8, :3].reshape(-1, 3), a[-8:, -8:, :3].reshape(-1, 3)])
    key = np.median(corners, axis=0)
    d = np.sqrt(((a[..., :3] - key) ** 2).sum(-1))
    alpha = np.clip((d - 40) / 60, 0, 1)   # within 40 of the key: gone; beyond 100: kept; a soft edge between
    a[..., 3] = alpha * 255
    # take the key's tint off the soft edge
    k = alpha[..., None]
    a[..., :3] = np.where(k > 0.01, (a[..., :3] - key * (1 - k)) / np.maximum(k, 0.01), 0)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')


def trim(im, pad=0.03):
    box = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    if not box:
        return im
    x0, y0, x1, y1 = box
    p = int(max(x1 - x0, y1 - y0) * pad)
    return im.crop((max(0, x0 - p), max(0, y0 - p), min(im.width, x1 + p), min(im.height, y1 + p)))


def fit(im, side):
    f = side / max(im.size)
    return im.resize((max(1, round(im.width * f)), max(1, round(im.height * f))), Image.LANCZOS) if f < 1 else im


def save(im, name, q=88):
    OUT.mkdir(exist_ok=True)
    im.save(OUT / f'{name}.webp', 'WEBP', quality=q, method=6)
    print(f'  {name}.webp  {im.size[0]}x{im.size[1]}')
    return name


def badge(im):
    """the cage's badge, the round tag below its bars: its centre and radius as fractions of the picture's height
    (the widest of the rows in its bottom third that are one unbroken run narrower than 40% of the picture: the
    rows through the bars are broken up, the frame's bottom is wider)"""
    a = np.asarray(im.getchannel('A')) > 40
    h, w = a.shape
    best, bw = None, 0
    for y in range(int(h * 0.66), h):
        xs = np.where(a[y])[0]
        if not len(xs):
            continue
        run = xs.max() - xs.min() + 1
        if run - len(xs) <= 2 and run < w * 0.4 and run > bw:
            best, bw = y, run
    if best is None:
        return None
    xs = np.where(a[best])[0]
    return [round(float(xs.min() + xs.max()) / 2 / w, 4), round(best / h, 4), round(bw / 2 / h, 4)]


def pic(name):
    for ext in ('.png', '.webp'):
        f = SRC / (name + ext)
        if f.exists():
            return Image.open(f)
    return None


def main():
    if not SRC.exists():
        sys.exit(f'no pictures yet: put them in {SRC}')
    made, cage = [], None
    im = pic('eggs')
    if im:
        im = cutout(im)
        w = im.width // 2
        made.append(save(fit(trim(im.crop((0, 0, w, im.height))), 256), 'egg'))
        made.append(save(fit(trim(im.crop((w, 0, im.width, im.height))), 256), 'egg-crack'))
    for name in ('balloon', 'cage'):
        im = pic(name)
        if im:
            im = fit(trim(cutout(im), 0.01 if name == 'cage' else 0.03), 256)
            if name == 'cage':
                cage = badge(im)
            made.append(save(im, name))
    im = pic('grass')
    if im:
        made.append(save(im.convert('RGB').resize((256, 256), Image.LANCZOS), 'grass', 85))
    for n in range(1, 7):
        im = pic(f'island-{n}')
        if im:
            made.append(save(fit(trim(cutout(im)), 512), f'island-{n}'))
        im = pic(f'island-{n}-bg')
        if im:
            im = im.convert('RGB')
            w, h = im.size
            if w / h > 1.5:   # wider than 3:2: the middle
                cw = round(h * 1.5); im = im.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h))
            elif w / h < 1.5:
                ch = round(w / 1.5); im = im.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch))
            made.append(save(im.resize((1600, 1067), Image.LANCZOS), f'island-{n}-bg', 80))
    src = LIST.read_text(encoding='utf-8')
    src = re.sub(r"names: \[[^\]]*\],", 'names: [' + ', '.join(f"'{m}'" for m in made) + '],', src, count=1)
    src = re.sub(r"badge: (null|\[[^\]]*\]),", f"badge: {json.dumps(cage)},", src, count=1)
    LIST.write_text(src, encoding='utf-8')
    print(f'{len(made)} pictures; src/art2.js lists them' + (f'; the cage badge at {cage}' if cage else ''))
    subprocess.run([sys.executable, str(DEV / 'build.py')], check=True)


if __name__ == '__main__':
    main()
