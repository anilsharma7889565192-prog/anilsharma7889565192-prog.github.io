"""Resize downloaded photos into doval-deck/photos/<key>.jpg for embedding.

Usage: python3 prep_photos.py <raw_dir>
Only valid JPEG/PNG files are used; anything else (for example an error page saved
by a failed download) is skipped.
"""
import sys
from pathlib import Path
from PIL import Image

raw = Path(sys.argv[1])
out = Path(__file__).parent / "photos"
out.mkdir(exist_ok=True)
for f in sorted(raw.glob("*.jpg")):
    try:
        im = Image.open(f)
        im.load()
    except Exception:
        print("skip", f.name)
        continue
    im = im.convert("RGB")
    long_side = 900 if f.stem != "portrait" else 1000
    k = min(1, long_side / max(im.size))
    if k < 1:
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    im.save(out / f.name, quality=80, optimize=True, progressive=True)
    print("ok", f.name, im.size, (out / f.name).stat().st_size)
