#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""خروجی‌های نهایی لوگوی جدید برای همه‌ی جای سایت."""
from PIL import Image, ImageDraw
import numpy as np, struct, os

ROOT = "/home/user/Parsa-apps.github.io"
PREVIEW = f"{ROOT}/debug-shots/logo-preview"
master = Image.open(f"{PREVIEW}/master-full.png").convert("RGBA")
alpha = np.asarray(master)[:, :, 3]

# ---------- برش «نشان» (بدون واژه‌نگار): از دره‌ی خالی زیر نشان ----------
rows = (alpha > 40).sum(axis=1)
h = len(rows)
# اولین دره‌ی پیوسته‌ی کم‌پیکسل بعد از نشان (بین نشان و واژه‌نگار)
thr = max(2, int(master.width * 0.01))
cut = None
run = 0
for i in range(int(h * 0.45), int(h * 0.9)):
    if rows[i] < thr:
        run += 1
        if run >= 8:
            cut = i - run // 2
            break
    else:
        run = 0
if cut is None:
    cut = int(h * 0.63)
print("emblem cut row:", cut, "/", h)

# نشان را روی مربع با حاشیه بنشین
emblem_img = master.crop((0, 0, master.width, cut))
ea = np.asarray(emblem_img)[:, :, 3]
ys, xs = np.where(ea > 40)
ex0, ex1, ey0, ey1 = xs.min(), xs.max(), ys.min(), ys.max()
emblem = emblem_img.crop((ex0, ey0, ex1 + 1, ey1 + 1))
s = max(emblem.size)
sq = Image.new("RGBA", (s, s), (0, 0, 0, 0))
sq.paste(emblem, ((s - emblem.width) // 2, (s - emblem.height) // 2), emblem)
emblem = sq
emblem.save(f"{PREVIEW}/emblem.png")
print("emblem:", emblem.size)

# ---------- کمکی‌های ترکیب ----------
DARK = (5, 8, 22)  # #050816 — زمینه‌ی برند

def on_dark(size, inner_frac, bg=DARK, rounded=None):
    """لوگو/نشان روی کاشی تیره؛ rounded=شعاع نسبی برای فاوآیکون"""
    tile = Image.new("RGBA", (size, size), bg + (255,))
    if rounded is not None:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * rounded), fill=255)
        rgba = tile.load()
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(tile, (0, 0), mask)
        tile = out
    inner = emblem.resize((int(size * inner_frac), int(size * inner_frac)), Image.LANCZOS)
    tile.alpha_composite(inner, ((size - inner.width) // 2, (size - inner.height) // 2))
    return tile

def png_opt(img, path, try_quantize=True):
    img.save(path, optimize=True)
    sz = os.path.getsize(path)
    if try_quantize and sz > 300 * 1024:
        q = img.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
        q.save(path, optimize=True)
        sz2 = os.path.getsize(path)
        print(f"  quantized {sz//1024}KB -> {sz2//1024}KB")
        sz = sz2
    print(f"  {path.replace(ROOT + '/', '')}: {sz//1024}KB")

def jpg_dark(img, size, path, quality=86):
    """JPG روی زمینه‌ی تیره‌ی ملایم (مطابق کارت‌های تیره‌ی سایت)"""
    bg = Image.new("RGB", (size, size), (3, 4, 9))
    d = ImageDraw.Draw(bg)
    d.ellipse([size * 0.1, size * 0.1, size * 0.9, size * 0.9], fill=(8, 12, 26))
    k = img.resize((int(size * 0.92), int(size * 0.92)), Image.LANCZOS)
    bg.paste(k, ((size - k.width) // 2, (size - k.height) // 2), k)
    bg.save(path, quality=quality, optimize=True, progressive=True)
    print(f"  {path.replace(ROOT + '/', '')}: {os.path.getsize(path)//1024}KB")

# ---------- ICO (PNG-in-ICO) ----------
def build_ico(images, path):
    """images: list of (PIL Image) — همه مربع"""
    blobs = []
    for im in images:
        w = im.width
        b = im.resize((w, w), Image.LANCZOS)
        import io
        buf = io.BytesIO()
        b.save(buf, "PNG", optimize=True)
        blobs.append((w, buf.getvalue()))
    n = len(blobs)
    header = struct.pack("<HHH", 0, 1, n)
    entries, offset = b"", 6 + 16 * n
    for w, data in blobs:
        entries += struct.pack("<BBBBHHII", w if w < 256 else 0, w if w < 256 else 0, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    with open(path, "wb") as f:
        f.write(header + entries + b"".join(d for _, d in blobs))
    print(f"  {path.replace(ROOT + '/', '')}: {os.path.getsize(path)//1024}KB")

print("== خروجی‌ها ==")

# ۱) لوگوی شفاف اصلی (اینترو + ماسک برق) — ۸۰۰ پیکسل
png_opt(master.resize((800, 800), Image.LANCZOS), f"{ROOT}/assets/brand/parsa-main-logo-transparent.png")

# ۲) نشان هدر/فوتر/درباره‌ما (JPG — محدودیت تست: <۱۵۰KB)
jpg_dark(emblem, 512, f"{ROOT}/assets/brand/parsa-main-mark.jpg")

# ۳) لوگوی کامل کارت هیرو + og:image (JPG)
jpg_dark(master, 900, f"{ROOT}/assets/brand/parsa-main-logo.jpg")

# ۴) فاوآیکون و آیکون‌های PWA
ico_imgs = [on_dark(s, 0.74, rounded=0.22) for s in (16, 32, 48, 64)]
build_ico(ico_imgs, f"{ROOT}/favicon.ico")
for s in (16, 32):
    on_dark(s, 0.74, rounded=0.22).save(f"{ROOT}/assets/icons/favicon-{s}.png", optimize=True)
    print(f"  assets/icons/favicon-{s}.png: {os.path.getsize(f'{ROOT}/assets/icons/favicon-{s}.png')//1024}KB")
on_dark(192, 0.70).save(f"{ROOT}/icons/icon-192.png", optimize=True)
print(f"  icons/icon-192.png: {os.path.getsize(f'{ROOT}/icons/icon-192.png')//1024}KB")
on_dark(512, 0.70).save(f"{ROOT}/icons/icon-512.png", optimize=True)
print(f"  icons/icon-512.png: {os.path.getsize(f'{ROOT}/icons/icon-512.png')//1024}KB")

# پیش‌نمایش آیکون‌ها
strip = Image.new("RGB", (64 + 32 + 192 + 40, 200), (240, 240, 244))
x = 8
for s in (16, 32, 48):
    ic = on_dark(s, 0.74, rounded=0.22)
    strip.paste(ic, (x, 8), ic); x += s + 8
big = on_dark(192, 0.70)
strip.paste(big, (x, 4), big)
strip.save(f"{PREVIEW}/icons-strip.png")
print("done")
