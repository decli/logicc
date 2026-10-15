"""Cut decli's animal heads out of their sheets and pack them into the page's sprite sheet.

  python3 xiaoxiao/dev/heads.py   art/heads-sheet-*.png  ->  xiaoxiao/heads.webp  +  src/heads.js (each head's size)

decli drew the heads (2026-10-15) as sheets of 10 per row on a transparent background, the same animals in the same
order: sheet 1 has the first 50 a bit larger, sheet 2 all 70. Each head is found as one blob of opaque pixels, cut
out with its soft edge, and the largest copy of it across the sheets goes, at its own size, in the middle of a
CELL x CELL square of the sprite sheet, in the sheets' order (row by row). src/heads.js records each head's width and
height so the page can scale every head to the same size. A bigger sheet with the same layout can simply be added to
SHEETS. If a head has a separate picture in art/heads/<id>.png (any size, transparent background), that one is used
instead, scaled to fit the cell."""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
# the ids in sheet order; the names and the rest are in src/lines.js (FRIENDS), in the same order
IDS = ('panda fox tiger lion bear polar koala bunny corgi cat '
       'frog owl chick penguin duck flamingo peacock parrot budgie pigeon '
       'pig sheep cow horse deer giraffe hippo elephant rhino croc '
       'squirrel hamster hedgehog raccoon skunk redpanda sloth fennec monkey capybara '
       'turtle seal dolphin shark clownfish octopus ladybug bee dragon unicorn '
       'dog dalmatian siamese axolotl bat alpaca bison zebra donkey kangaroo '
       'rooster goose duckling cardinal chameleon puffer orca whale otter arcticfox').split()
SHEETS = [('heads-sheet-1.png', 5), ('heads-sheet-2.png', 7)]   # file, rows (of COLS)
COLS = 10
ATLAS_ROWS = (len(IDS) + COLS - 1) // COLS
CELL = 216


def blobs(alpha, rows):
    """The heads as (mask, where its soft edge may reach or None), in sheet order. Two heads that touch are split at the thinnest column."""
    lab, n = ndimage.label(alpha > 100)
    sizes = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if sizes[i] < 3000:
            continue
        m = lab == i + 1
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if x1 - x0 > 260:   # two heads touching (the elephant's ear and the rhino): shrink the blob until it falls
            core = m            # in two, then give every pixel to the nearer of the two cores
            for _ in range(40):
                core = ndimage.binary_erosion(core, iterations=2)
                cl, cn = ndimage.label(core)
                if cn >= 2:
                    break
            big2 = np.argsort(ndimage.sum(np.ones_like(cl), cl, range(1, cn + 1)))[-2:] + 1
            seeds = np.where(np.isin(cl, big2), cl, 0)
            _, (iy, ix) = ndimage.distance_transform_edt(seeds == 0, return_indices=True)
            near = seeds[iy, ix]
            out += [(m & (near == b), near == b) for b in big2]
        else:
            out.append((m, None))
    by_y = sorted(out, key=lambda t: np.argwhere(t[0]).mean(0)[0])
    assert len(by_y) == COLS * rows, len(by_y)
    ordered = []
    for r in range(rows):
        ordered += sorted(by_y[r * COLS:(r + 1) * COLS], key=lambda t: np.argwhere(t[0]).mean(0)[1])
    return ordered


def cut(a, m, mine):
    """One head from sheet pixels a: the blob plus a few pixels round it for the soft edge, nothing of the neighbours."""
    keep = ndimage.binary_dilation(m, iterations=4)
    if mine is not None:
        keep &= mine
    ys, xs = np.nonzero(keep)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    px = a[y0:y1, x0:x1].copy()
    al = px[:, :, 3].astype(np.int32)
    al[~keep[y0:y1, x0:x1]] = 0
    al[al < 12] = 0
    px[:, :, 3] = al
    im = Image.fromarray(px, 'RGBA')
    return im.crop(im.getbbox())


def main():
    best = {}   # head number -> the largest copy found
    for name, rows in SHEETS:
        a = np.array(Image.open(os.path.join(HERE, 'art', name)).convert('RGBA'))
        for k, (m, mine) in enumerate(blobs(a[:, :, 3], rows)):
            im = cut(a, m, mine)
            if k not in best or max(im.size) > max(best[k].size):
                best[k] = im
    assert sorted(best) == list(range(len(IDS))), len(best)
    atlas = Image.new('RGBA', (CELL * COLS, CELL * ATLAS_ROWS), (0, 0, 0, 0))
    sizes = []
    for k in range(len(IDS)):
        own = os.path.join(HERE, 'art', 'heads', IDS[k] + '.png')
        im = Image.open(own).convert('RGBA') if os.path.exists(own) else best[k]
        im = im.crop(im.getbbox())
        if max(im.size) > CELL - 8 or os.path.exists(own):
            f = (CELL - 8) / max(im.size)
            im = im.resize((round(im.width * f), round(im.height * f)), Image.LANCZOS)
        cx, cy = (k % COLS) * CELL + CELL // 2, (k // COLS) * CELL + CELL // 2
        atlas.alpha_composite(im, (cx - im.width // 2, cy - im.height // 2))
        sizes.append([im.width, im.height])
    out = os.path.join(SITE, 'heads.webp')
    atlas.save(out, 'WEBP', quality=90, alpha_quality=100, method=6)
    js = ('// 动物消消乐 · made by dev/heads.py: the sprite sheet heads.webp, and each head\'s width and height in it (its cell is\n'
          f'// {CELL} px square, the head in the middle), in the order of FRIENDS (lines.js).\n'
          f'const HEADS = {{ cell: {CELL}, cols: {COLS}, size: {json.dumps(sizes, separators=(",", ":"))} }};\n')
    with open(os.path.join(HERE, 'src', 'heads.js'), 'w', encoding='utf-8') as f:
        f.write(js)
    print('wrote', out, os.path.getsize(out) // 1024, 'KB;', len(sizes), 'heads')


if __name__ == '__main__':
    main()
