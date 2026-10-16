"""Encode the hero background videos (videos/video01.mov, video02.mp4, ...).

For every videos/videoNN.<mov|mp4|m4v|mkv|avi> (the git-ignored master) writes, next to it:
    videoNN.webm            AV1, 1280x720, no audio, first 20 s at most (main source)
    videoNN-720.mp4         H.264, 1280x720, no audio (fallback: Safari / older devices)
    videoNN-cover-720.jpg   poster = frame at 5 s (only if missing, so a hand-made cover is kept)
Then sets data-videos="<count>" on #myVideo in index.html; the page picks one at random.

Usage (from the repo root, needs ffmpeg with libsvtav1 + libx264):
    python tools/build-videos.py                 # only new / changed videos
    python tools/build-videos.py --force         # re-encode everything
    python tools/build-videos.py --ffmpeg PATH   # or set FFMPEG, default: ffmpeg on PATH
Afterwards run tools/build-images.py for the cover .avif/.webp, and commit the generated files.
"""

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "videos"
INDEX = ROOT / "index.html"

# Masters: videoNN.<ext>. Outputs never match (videoNN.webm, videoNN-720.mp4, videoNN-cover-720.*)
NAME = re.compile(r"^video(\d{2,})\.(mov|mp4|m4v|mkv|avi)$", re.I)

MAX_SECONDS = "20"  # longer masters are cut: it's a background loop, keep the download small

# Cover the 16:9 frame (crop if the master's aspect differs), keep the source frame rate
SCALE = "scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,setsar=1,format=yuv420p"
COLOR = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"]

# webm codecs string in index.html (av01.0.05M.08 = Main, level 3.1, 8-bit) must stay valid for these
WEBM = ["-c:v", "libsvtav1", "-preset", "5", "-crf", "40", "-g", "125", *COLOR, "-an"]
MP4 = ["-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high", "-level", "4.0",
       *COLOR, "-movflags", "+faststart", "-an"]
COVER = ["-frames:v", "1", "-q:v", "2"]
COVER_AT = "5"  # seconds in: many clips open on a black / blank intro frame


def is_stale(src, out):
    return not out.exists() or out.stat().st_mtime < src.stat().st_mtime


def encode(ffmpeg, src, out, opts, seek="0"):
    cmd = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-ss", seek, "-i", str(src), "-t", MAX_SECONDS, "-vf", SCALE, *opts, str(out)]
    try:
        subprocess.run(cmd, check=True)
    except FileNotFoundError:
        sys.exit(f"ffmpeg not found ({ffmpeg}): install it, or pass --ffmpeg PATH / set FFMPEG")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--force", action="store_true", help="re-encode even if outputs are up to date")
    parser.add_argument("--ffmpeg", default=os.environ.get("FFMPEG", "ffmpeg"), help="ffmpeg executable")
    args = parser.parse_args()

    masters = sorted((m for m in VIDEOS.iterdir() if NAME.match(m.name)), key=lambda m: int(NAME.match(m.name)[1]))
    if not masters:
        sys.exit("no masters found in videos/ (expected video01.mov, video02.mp4, ...)")
    built = 0
    for src in masters:
        stem = src.stem
        jobs = [(VIDEOS / f"{stem}.webm", WEBM, "0"), (VIDEOS / f"{stem}-720.mp4", MP4, "0")]
        jobs = [job for job in jobs if args.force or is_stale(src, job[0])]
        cover = VIDEOS / f"{stem}-cover-720.jpg"
        if not cover.exists():
            jobs.append((cover, COVER, COVER_AT))
        for out, opts, seek in jobs:
            encode(args.ffmpeg, src, out, opts, seek)
            print(f"videos/{out.name:28} {out.stat().st_size // 1024:>6}K")
            built += 1

    # The page only knows the count: the videos must be numbered 01..N with no gaps
    numbers = [int(NAME.match(m.name)[1]) for m in masters]
    count = len(numbers)
    if len(set(numbers)) != count:
        sys.exit("two masters with the same number (e.g. video04.mov and video04.mp4): keep one")
    if numbers != list(range(1, count + 1)):
        sys.exit(f"videos must be numbered video01..video{count:02d} with no gaps, found {numbers}")
    for n in numbers:
        for out in (f"video{n:02d}.webm", f"video{n:02d}-720.mp4", f"video{n:02d}-cover-720.jpg"):
            if not (VIDEOS / out).exists():
                sys.exit(f"missing videos/{out}")

    html = INDEX.read_bytes().decode("utf-8")  # bytes, so line endings are kept
    new, subs = re.subn(r'(id="myVideo"[^>]*?data-videos=")\d+(")', rf"\g<1>{count}\g<2>", html, flags=re.S)
    if not subs:
        sys.exit('index.html: data-videos="..." not found on #myVideo')
    if new != html:
        INDEX.write_bytes(new.encode("utf-8"))
    print(f"\n{built} files written, {count} videos (index.html data-videos={count})")


if __name__ == "__main__":
    main()
