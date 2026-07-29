#!/usr/bin/env python3
from pathlib import Path
import re
import shutil
import sys

ROOT = Path.cwd()
SCRIPT_DIR = Path(__file__).resolve().parent
ASSETS_DIR = SCRIPT_DIR / "favicon_assets"
PUBLIC_DIR = ROOT / "public"
INDEX_PATH = ROOT / "index.html"

FILES = [
    "favicon.ico",
    "favicon.svg",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon-48x48.png",
    "favicon-96x96.png",
    "favicon-144x144.png",
    "mstile-150x150.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "site.webmanifest",
    "browserconfig.xml",
]

def fail(message: str) -> None:
    print(f"\nXATO: {message}")
    sys.exit(1)

if not PUBLIC_DIR.exists() or not INDEX_PATH.exists():
    fail("Skriptni yalpiz_web_app frontend root papkasida ishga tushiring.")

for name in FILES:
    if not (ASSETS_DIR / name).exists():
        fail(f"Kerakli fayl topilmadi: favicon_assets/{name}")

for name in FILES:
    src = ASSETS_DIR / name
    dst = PUBLIC_DIR / name
    bak = dst.with_suffix(dst.suffix + '.before_favicon_v5_circle_mask.bak')
    if dst.exists() and not bak.exists():
        shutil.copyfile(dst, bak)
    shutil.copyfile(src, dst)
    print(f"OK: public/{name}")

html = INDEX_PATH.read_text(encoding='utf-8')
index_backup = INDEX_PATH.with_suffix('.html.before_favicon_v5_circle_mask.bak')
if not index_backup.exists():
    shutil.copyfile(INDEX_PATH, index_backup)

pattern = re.compile(r"(?:\s*<link[^>]+rel=[\"'](?:icon|shortcut icon|apple-touch-icon|manifest)[\"'][^>]*>\s*)+", re.IGNORECASE)
new_block = """
    <link rel=\"icon\" href=\"/favicon.ico?v=7\" sizes=\"any\" />
    <link rel=\"shortcut icon\" href=\"/favicon.ico?v=7\" />
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg?v=7\" />
    <link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicon-16x16.png?v=7\" />
    <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon-32x32.png?v=7\" />
    <link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"/favicon-48x48.png?v=7\" />
    <link rel=\"icon\" type=\"image/png\" sizes=\"96x96\" href=\"/favicon-96x96.png?v=7\" />
    <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon.png?v=7\" />
    <link rel=\"manifest\" href=\"/site.webmanifest?v=7\" />
"""
match = pattern.search(html)
if match:
    html = html[:match.start()] + "\n" + new_block + html[match.end():]
else:
    pos = html.lower().find('</head>')
    if pos == -1:
        fail('index.html ichida </head> topilmadi.')
    html = html[:pos] + "\n" + new_block + html[pos:]

if 'name="msapplication-TileColor"' not in html:
    marker = '<meta name="theme-color" content="#143a22" />'
    inject = marker + '\n    <meta name="msapplication-TileColor" content="#ffffff" />\n    <meta name="msapplication-config" content="/browserconfig.xml" />'
    if marker in html:
        html = html.replace(marker, inject, 1)

INDEX_PATH.write_text(html, encoding='utf-8')
print('OK: index.html favicon linklari yangilandi (v=7).')
print('OK: faviconlar doira shaklida, tashqi qismi shaffof.')
print('OK: sayt ichidagi logo va bot logosi o\'zgarmadi.')
print('\nKeyingi buyruq: npm run build')
