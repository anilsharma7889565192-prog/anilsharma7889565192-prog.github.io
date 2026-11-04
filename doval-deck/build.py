"""Bundle the deck into single-file pages.

dist/deck.html  - body-only page (for claude.ai artifact preview; the host adds <html>/<head>)
dist/index.html - full standalone page (open locally or host on Vercel)
Run: python3 build.py
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

FONTS = ("https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900"
         "&family=Big+Shoulders+Stencil+Display:wght@800&family=Instrument+Serif:ital@0;1"
         "&family=JetBrains+Mono:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap")
THREE = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"

css = (SRC / "deck.css").read_text()
body = (SRC / "deck.body.html").read_text()
data = (ROOT / "mapdata.js").read_text()
app = (SRC / "deck.js").read_text()

head = (
    "<title>Operation Quiet Guardian</title>\n"
    '<meta name="description" content="Ajit Doval, the Quiet Guardian of India: a declassified-file presentation over a live 3D night map of India.">\n'
    '<meta name="theme-color" content="#05070B">\n'
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    f'<link rel="stylesheet" href="{FONTS}">\n'
    f"<style>\n{css}</style>\n"
)
scripts = (
    f'<script src="{THREE}"></script>\n'
    f"<script>\n{data}</script>\n"
    f"<script>\n{app}</script>\n"
)

(DIST / "deck.html").write_text(head + body + scripts)
(DIST / "index.html").write_text(
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    + head + "</head>\n<body>\n" + body + scripts + "</body>\n</html>\n"
)
print("built", (DIST / "deck.html").stat().st_size, "bytes")
