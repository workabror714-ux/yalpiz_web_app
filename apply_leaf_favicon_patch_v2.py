#!/usr/bin/env python3
from pathlib import Path
import re
import shutil
import sys

ROOT = Path.cwd()
PUBLIC_DIR = ROOT / "public"
INDEX_PATH = ROOT / "index.html"

EXPECTED = [
    "favicon.ico",
    "favicon.svg",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon-48x48.png",
    "favicon-96x96.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
]

def fail(message: str) -> None:
    print(f"\nXATO: {message}")
    sys.exit(1)

if not INDEX_PATH.exists() or not PUBLIC_DIR.exists():
    fail("Skriptni yalpiz_web_app loyihasining root papkasida ishga tushiring.")

missing = [name for name in EXPECTED if not (PUBLIC_DIR / name).exists()]
if missing:
    fail("Quyidagi favicon fayllari public ichida topilmadi:\n- " + "\n- ".join(missing))

print("OK: barcha yangi favicon fayllari public/ ichida mavjud.")

# Faqat index.html ichidagi favicon cache-versiyasini yangilaymiz.
# public fayllari allaqachon loyiha ichiga ko'chirilgani sabab ularni o'ziga
# qayta copy qilish shart emas.
index = INDEX_PATH.read_text(encoding="utf-8")

backup = INDEX_PATH.with_suffix(".html.before_leaf_favicon_v2.bak")
if not backup.exists():
    shutil.copyfile(INDEX_PATH, backup)

updated = re.sub(
    r'(?P<prefix>href="/(?:favicon(?:-[^"]+)?\.(?:ico|svg|png)|apple-touch-icon\.png|site\.webmanifest))\?v=\d+',
    r'\g<prefix>?v=4',
    index,
)

if updated == index and "?v=4" not in index:
    fail("index.html ichida favicon linklari topilmadi.")

INDEX_PATH.write_text(updated, encoding="utf-8")

print("OK: index.html favicon linklari ?v=4 qilindi.")
print("OK: sayt ichidagi logo_green.png va bot logolariga tegilmadi.")
print("\nKeyingi buyruq:")
print("  npm run build")
