"""The 怪趣森林 heads (decli 2026-11-05, 219 pictures in art/heads2/, see HEADS.md there) → the page's pictures.

  python3 xiaoxiao/dev/heads2.py      art/heads2/*.png  →  ../heads.webp ../funs.webp ../pals.webp ../big/*.webp, src/heads.js

Every picture is 1024 x 1024 with the head in the same place and at the same scale, and a character's faces share one
outline exactly, so nothing is trimmed: each goes whole (the middle CROP square) into a CELL x CELL cell, and any face
can take the place of another without the head moving.
  heads.webp  the board faces (<id>.png), one cell per FRIENDS entry in their order; a 隐藏款 has only its fun face
  funs.webp   the fun faces (<id>-fun.png): the album, a piece she picks up, a partner cheering
  pals.webp   the twelve partners' tap and cheer faces, and the chick hatching (chick-hatch.png)
  big/<id>.webp  the fun faces at BIG px, for the blind box's reveal (loaded when a box opens)
src/heads.js records the layout, FILL, how much of a cell a board face's longer side takes (the page scales by it), and
a fingerprint of the pictures, which the page adds to their addresses so a browser never keeps an old sheet."""
import hashlib, json, pathlib, re, subprocess, sys
import numpy as np
from PIL import Image

DEV = pathlib.Path(__file__).resolve().parent
SRC, SITE = DEV / 'art' / 'heads2', DEV.parent
CROP, CELL, COLS, BIG = 928, 224, 10, 640
PALS = ['pig', 'panda', 'hippo', 'giraffe', 'parrot', 'frog', 'owl', 'corgi', 'bee', 'cloud', 'monkey', 'princess']


def ids():
    """FRIENDS' ids in order, from src/lines.js"""
    src = (DEV / 'src' / 'lines.js').read_text(encoding='utf-8')
    block = src[src.index('const FRIENDS'):src.index('].map(', src.index('const FRIENDS'))]
    return re.findall(r"\['(\w+)', '[^']+', -?\d", block)


def load(name, side):
    im = Image.open(SRC / f'{name}.png').convert('RGBA')
    m = (im.width - CROP) // 2
    return im.crop((m, m, m + CROP, m + CROP)).resize((side, side), Image.LANCZOS)


def sheet(names, cols, side, path, q):
    rows = (len(names) + cols - 1) // cols
    out = Image.new('RGBA', (cols * side, rows * side), (0, 0, 0, 0))
    for k, n in enumerate(names):
        if n:
            out.paste(load(n, side), ((k % cols) * side, (k // cols) * side))
    out.save(path, 'WEBP', quality=q, method=6)
    print(f'  {path.name}  {out.width}x{out.height}  {path.stat().st_size // 1024} KB')


def main():
    order = ids()
    have = {p.stem for p in SRC.glob('*.png')}
    board = [i if i in have else f'{i}-fun' for i in order]   # a 隐藏款: its only picture
    missing = [n for n in board + [f'{i}-fun' for i in order] if n not in have]
    if missing:
        sys.exit('missing: ' + ', '.join(missing))
    sheet(board, COLS, CELL, SITE / 'heads.webp', 84)
    sheet([f'{i}-fun' for i in order], COLS, CELL, SITE / 'funs.webp', 84)
    pal = [f'{i}-{f}' for i in PALS for f in ('tap', 'cheer')] + ['chick-hatch']
    sheet(pal, 5, 256, SITE / 'pals.webp', 85)
    big = SITE / 'big'; big.mkdir(exist_ok=True)
    for i in order:
        load(f'{i}-fun', BIG).save(big / f'{i}.webp', 'WEBP', quality=82, method=6)
    print(f'  big/*.webp  {len(order)} x {BIG}px  {sum(p.stat().st_size for p in big.glob("*.webp")) // 1024} KB')
    # how much of a cell a board face fills (its longer side), on average
    longest = []
    for i in order:
        if i in have:
            a = np.asarray(load(i, CELL))[..., 3]
            ys, xs = np.where(a > 24)
            longest.append(max(xs.max() - xs.min(), ys.max() - ys.min()) / CELL)
    fill = round(float(np.median(longest)), 3)
    h = hashlib.sha1(b''.join((SITE / n).read_bytes() for n in ('heads.webp', 'funs.webp', 'pals.webp'))).hexdigest()[:10]
    layout = {'cell': CELL, 'cols': COLS, 'n': len(order), 'fill': fill, 'big': BIG, 'h': h,
              'pals': {i: [2 * k, 2 * k + 1] for k, i in enumerate(PALS)}, 'palCell': 256, 'palCols': 5, 'hatch': len(pal) - 1}
    (DEV / 'src' / 'heads.js').write_text(
        '// 动物消消乐 · made by dev/heads2.py: how the 怪趣森林 heads are laid out in heads.webp (board faces), funs.webp (fun\n'
        '// faces) and pals.webp (the partners\' tap and cheer faces, then the chick hatching); cells in the order of FRIENDS.\n'
        '// fill: how much of a cell a board face\'s longer side takes; h: the pictures\' fingerprint (in their addresses).\n'
        f'const HEADS = {json.dumps(layout, separators=(",", ":"))};\n', encoding='utf-8')
    print(f'src/heads.js: {len(order)} characters, fill {fill}')
    subprocess.run([sys.executable, str(DEV / 'build.py')], check=True)


if __name__ == '__main__':
    main()
