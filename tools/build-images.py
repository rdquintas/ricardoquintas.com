"""Convert the site's images to AVIF (with a WebP fallback).

For every .jpg/.jpeg/.png/.gif in the folders below, writes <name>.avif and
<name>.webp next to the original (same dimensions). The originals stay in the
repo as sources only; the pages reference the .avif/.webp files.

Usage (from the repo root):
    pip install -r tools/requirements.txt
    python tools/build-images.py           # only new / changed images
    python tools/build-images.py --force   # rebuild everything

Commit the generated files: there is no build step on Netlify or GitHub Pages.
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, features

ROOT = Path(__file__).resolve().parent.parent

# Folders scanned (not recursive)
FOLDERS = ["images", "portfolio/img", "videos"]

# Kept as-is: social crawlers (Open Graph / JSON-LD) don't reliably read AVIF/WebP
SKIP = {"images/og-image.jpg"}

SOURCE_EXT = {".jpg", ".jpeg", ".png", ".gif"}

AVIF_OPTS = {"quality": 60, "speed": 4}
WEBP_OPTS = {"quality": 80, "method": 6}


def is_stale(src, out):
    return not out.exists() or out.stat().st_mtime < src.stat().st_mtime


def save(img, out, fmt, opts):
    animated = getattr(img, "is_animated", False)
    if animated:
        img.save(out, fmt, save_all=True, **opts)
    else:
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "transparency" in img.info or img.mode in ("LA", "PA") else "RGB")
        img.save(out, fmt, **opts)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--force", action="store_true", help="rebuild even if outputs are up to date")
    args = parser.parse_args()

    if not (features.check("avif") and features.check("webp")):
        sys.exit("Pillow without AVIF/WebP support: pip install -r tools/requirements.txt")

    built = skipped = 0
    for folder in FOLDERS:
        for src in sorted((ROOT / folder).iterdir()):
            rel = src.relative_to(ROOT).as_posix()
            if src.suffix.lower() not in SOURCE_EXT or rel in SKIP:
                continue
            targets = [(src.with_suffix(".avif"), "AVIF", AVIF_OPTS), (src.with_suffix(".webp"), "WEBP", WEBP_OPTS)]
            todo = [t for t in targets if args.force or is_stale(src, t[0])]
            if not todo:
                skipped += 1
                continue
            with Image.open(src) as img:
                for out, fmt, opts in todo:
                    save(img, out, fmt, opts)
            sizes = "  ".join(f"{t[0].suffix[1:]} {t[0].stat().st_size // 1024}K" for t in targets)
            print(f"{rel:40} {src.stat().st_size // 1024:>5}K -> {sizes}")
            built += 1

    print(f"\n{built} converted, {skipped} up to date")


if __name__ == "__main__":
    main()
