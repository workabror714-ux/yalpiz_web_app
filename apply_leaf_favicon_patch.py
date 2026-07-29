#!/usr/bin/env python3
from pathlib import Path
import shutil
import sys

ROOT = Path.cwd()
SCRIPT_DIR = Path(__file__).resolve().parent
SOURCE_PUBLIC = SCRIPT_DIR / "public"
TARGET_PUBLIC = ROOT / "public"
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

if not INDEX_PATH.exists() or not TARGET_PUBLIC.exists():
    fail("Skriptni yalpiz_web_app loyihasining root papkasida ishga tushiring.")

for filename in EXPECTED:
    source = SOURCE_PUBLIC / filename
    if not source.exists():
        fail(f"Patch ichida {filename} topilmadi.")

# Faqat favicon fayllari almashtiriladi. Sayt ichidagi logo_green.png ga tegilmaydi.
for filename in EXPECTED:
    source = SOURCE_PUBLIC / filename
    target = TARGET_PUBLIC / filename

    backup = target.with_suffix(target.suffix + ".before_leaf_favicon.bak")
    if target.exists() and not backup.exists():
        shutil.copy2(target, backup)

    shutil.copy2(source, target)
    print(f"OK: public/{filename}")

index = INDEX_PATH.read_text(encoding="utf-8")
backup_index = INDEX_PATH.with_suffix(".html.before_leaf_favicon.bak")
if not backup_index.exists():
    shutil.copy2(INDEX_PATH, backup_index)

# Cache buzilishi uchun faqat favicon URL versiyasini yangilaymiz.
updated = index.replace("?v=3", "?v=4")
if updated == index and "?v=4" not in index:
    fail("index.html ichida favicon ?v=3 linklari topilmadi.")

INDEX_PATH.write_text(updated, encoding="utf-8")
print("OK: index.html favicon cache versiyasi v4 qilindi.")

# Himoya: saytning asosiy logosi tasodifan o'zgarmaganini ko'rsatamiz.
if (SOURCE_PUBLIC / "logo_green.png").exists():
    fail("Patch ichida logo_green.png bo'lmasligi kerak.")

print("\nFAVICON PATCH TAYYOR ✅")
print("Sayt ichidagi logo va Telegram bot logosi o'zgartirilmadi.")
print("Keyingi buyruq: npm run build")
