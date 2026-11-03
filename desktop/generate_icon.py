#!/usr/bin/env python3
"""Generate the DevTools Hub app icon set.

Artwork: brand-purple tile (globals.css --primary #6750A4) with a white
wrench glyph (matches the Wrench logo used in components/layout/nav.tsx),
drawn with PIL primitives so it is fully deterministic.

Outputs:
  desktop/AppIcon.icns          macOS app icon (all 10 standard sizes)
  public/icons/icon-192.png     PWA manifest icon (dir was empty -> 404)
  public/icons/icon-512.png     PWA manifest icon

Usage: python3 desktop/generate_icon.py
"""
from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SS = 4  # supersampling factor

# Brand palette (from app/globals.css --primary #6750A4)
TOP = (124, 101, 197)  # lighter brand purple, top of tile
BOTTOM = (81, 56, 159)  # deeper brand purple, bottom of tile
GLYPH = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def render(size: int, box: float, corner: float) -> Image.Image:
    """Render the icon at `size` px. `box` = tile width as a fraction of the
    canvas (macOS template ~0.805 to leave icon margin); `corner` = corner
    radius as a fraction of the tile."""
    w = size * SS
    img = Image.new("RGBA", (w, w), (0, 0, 0, 0))

    # Tile: vertical brand gradient behind a rounded-rect alpha mask.
    grad = Image.new("RGB", (1, w))
    for y in range(w):
        grad.putpixel((0, y), lerp(TOP, BOTTOM, y / (w - 1)))
    grad = grad.resize((w, w))

    tile = int(w * box)
    x0 = (w - tile) // 2
    radius = int(tile * corner)
    mask = Image.new("L", (w, w), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [x0, x0, x0 + tile - 1, x0 + tile - 1], radius=radius, fill=255
    )
    img.paste(grad, (0, 0), mask)

    d = ImageDraw.Draw(img)

    # Wrench glyph, in unit coords of the tile: a thick open arc (the head,
    # jaw gap pointing up-left) plus a rounded handle down-right.
    def u(f):  # unit fraction of tile -> canvas px
        return x0 + int(f * tile)

    cx = cy = u(0.43)
    r_mid = u(0.155) - x0  # arc mid-radius in px
    thick = max(2, u(0.082) - x0)  # ring/handle stroke width

    gap_dir = 225  # jaw opening faces up-left
    gap = 76  # degrees (wide enough to stay open at 16px)
    start = (gap_dir + gap / 2) % 360
    end = (gap_dir - gap / 2) % 360
    d.arc(
        [cx - r_mid, cy - r_mid, cx + r_mid, cy + r_mid],
        start=start,
        end=end,
        fill=GLYPH,
        width=thick,
    )

    # Handle: from inside the head down to the bottom-right, rounded cap.
    hx1 = hy1 = u(0.465)
    hx2 = hy2 = u(0.695)
    d.line([hx1, hy1, hx2, hy2], fill=GLYPH, width=thick)
    cap = thick // 2
    d.ellipse([hx2 - cap, hy2 - cap, hx2 + cap, hy2 + cap], fill=GLYPH)

    return img.resize((size, size), Image.Resampling.LANCZOS)


ICNS_SIZES = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024),
]


def build_icns(masters: dict[int, Image.Image]) -> Path:
    with tempfile.TemporaryDirectory() as td:
        iconset = Path(td) / "iconset.iconset"
        iconset.mkdir()
        for name, size in ICNS_SIZES:
            masters[size].save(iconset / name)
        out = ROOT / "desktop" / "AppIcon.icns"
        subprocess.run(
            ["iconutil", "--convert", "icns", "--output", str(out), str(iconset)],
            check=True,
        )
    return out


def main() -> None:
    # macOS icon: Apple grid leaves ~10% margin; tile = 80.5% of canvas,
    # corner radius ~22.4% of the tile (macOS squircle look).
    masters: dict[int, Image.Image] = {}
    for _, size in ICNS_SIZES:
        if size not in masters:
            masters[size] = render(size, box=0.805, corner=0.224)
    out = build_icns(masters)
    print(f"wrote {out} ({out.stat().st_size} bytes)")

    # PWA icons: full-bleed rounded tile (manifest display: standalone).
    icons = ROOT / "public" / "icons"
    icons.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        img = render(size, box=1.0, corner=0.225)
        p = icons / f"icon-{size}.png"
        img.save(p)
        print(f"wrote {p} ({p.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
