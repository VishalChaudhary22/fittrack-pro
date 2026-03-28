#!/usr/bin/env python3
"""Verify a female anatomy PNG meets the rendering pipeline requirements."""
import sys
try:
    from PIL import Image
except ImportError:
    print("Pillow not installed. Please install it with: pip3 install Pillow")
    sys.exit(1)

def verify(path, is_base=False):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    px = img.load()
    red_count = 0
    bad_bg = 0
    total = w * h

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 130 and r > g + 20 and r > b + 20 and a > 0:
                red_count += 1
            if a > 0 and r > 200 and g > 200 and b > 200 and abs(r-g) < 20 and abs(g-b) < 20:
                bad_bg += 1

    print(f"File: {path}")
    print(f"Dimensions: {w}x{h} (expected 640x1280)")
    print(f"Red-dominant pixels: {red_count} ({red_count/total*100:.2f}%)")
    print(f"Grey/white BG pixels: {bad_bg} ({bad_bg/total*100:.2f}%)")

    ok = True
    if w != 640 or h != 1280:
        print("FAIL: WRONG DIMENSIONS"); ok = False
    if bad_bg > 100:
        print("FAIL: BACKGROUND NOT CLEAN BLACK"); ok = False
    if is_base and red_count > 50:
        print("FAIL: BASE IMAGE HAS RED PIXELS"); ok = False
    if not is_base and red_count < 500:
        print("FAIL: HIGHLIGHT HAS TOO FEW RED PIXELS"); ok = False
    if ok:
        print("PASSED")
    return ok

if __name__ == '__main__':
    is_base = '--base' in sys.argv
    paths = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not paths:
        print("Usage: verify-anatomy-png.py [--base] <path>")
        sys.exit(1)
    verify(paths[0], is_base)
