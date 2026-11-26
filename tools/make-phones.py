"""Builds the sharp phone images for the home page.

The locked mockup's phones are 520 px wide: a silver frame with a low-res screen.
This keeps the mockup's frame (scaled up) and puts the real app screen (1320 px)
inside it, without stretching. Run from the site folder:

  python3 tools/make-phones.py <mockup-frames-dir> <raw-screens-dir> src/assets/phones

<mockup-frames-dir> holds frame.png (a mockup phone, 520 x 1023, transparent outside).
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

SCALE = 1.5
# Screen hole inside the 520 x 1023 frame (measured from the mockup).
HOLE = (22, 16, 500, 1008)
RADIUS = 58
ISLAND = (197, 34, 276, 56)  # x0, y0, x1, y1 of the Dynamic Island, frame coords

# name -> raw screen (app-store-screenshots/raw/<name>.png)
SHOTS = {
    'today-dark': 'today_dark',
    'rest': 'today_break',
    'lock': 'lock_live',
    'widgets': 'widgets',
}
# The recap with the "Last 6 weeks" card exists only inside the final App Store
# screenshot; its screen area (island included) is cut from there.
FINAL_RECAP = ('final/02-recaps.png', (254, 671, 1025, 2273))


def s(v):
    return round(v * SCALE)


def screen_fill(raw, w, h):
    """Fit the raw screen to the hole height (no stretch); extend its edge columns to fill the width."""
    sh = h
    sw = round(raw.width * sh / raw.height)
    scr = raw.resize((sw, sh), Image.LANCZOS)
    out = Image.new('RGB', (w, h))
    x = (w - sw) // 2
    out.paste(scr, (x, 0))
    left = scr.crop((0, 0, 1, sh)).resize((x, sh))
    right = scr.crop((sw - 1, 0, sw, sh)).resize((w - sw - x, sh))
    out.paste(left, (0, 0))
    out.paste(right, (x + sw, 0))
    return out


def main(frames, raws, out):
    frame = Image.open(f'{frames}/frame.png').convert('RGBA')
    big = frame.resize((s(frame.width), s(frame.height)), Image.LANCZOS)
    x0, y0, x1, y1 = (s(v) for v in HOLE)
    w, h = x1 - x0, y1 - y0
    mask = Image.new('L', big.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((x0, y0, x1, y1), s(RADIUS), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.8))
    for name, raw_name in SHOTS.items():
        raw = Image.open(f'{raws}/{raw_name}.png').convert('RGB')
        layer = Image.new('RGBA', big.size, (0, 0, 0, 0))
        layer.paste(screen_fill(raw, w, h), (x0, y0))
        d = ImageDraw.Draw(layer)
        ix0, iy0, ix1, iy1 = (s(v) for v in ISLAND)
        d.rounded_rectangle((ix0, iy0, ix1, iy1), (iy1 - iy0) // 2, fill=(0, 0, 0, 255))
        img = big.copy()
        img.paste(layer, (0, 0), mask)
        img.save(f'{out}/{name}.png', optimize=True)
        print(name, img.size)
    path, box = FINAL_RECAP
    shot = Image.open(f'{raws}/../{path}').convert('RGB').crop(box).resize((w, h), Image.LANCZOS)
    layer = Image.new('RGBA', big.size, (0, 0, 0, 0))
    layer.paste(shot, (x0, y0))
    img = big.copy()
    img.paste(layer, (0, 0), mask)
    img.save(f'{out}/recaps.png', optimize=True)
    print('recaps', img.size)


if __name__ == '__main__':
    main(*sys.argv[1:4])
