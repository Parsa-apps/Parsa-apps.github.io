#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
پردازش لوگوی جدید پارسا اپس (2026_20260821_002324_0001.png) و تولید تمام بسته‌های برند:
۱) لوگوی شفاف کامل (full transparent)
۲) تاج جداگانه با پس‌زمینه شفاف (crown)
۳) بدنه‌ی لوگو با پس‌زمینه شفاف (body)
۴) نشان/آیکون (emblem)
۵) JPGهای با کیفیت روی پس‌زمینه تیره برای هیرو، درباره ما، OG
۶) آیکون‌های favicon.ico و PWA
"""

import os, struct
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from collections import deque

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "assets/brand/2026_20260821_002324_0001.png")

print(f"Reading source image: {RAW}")
src = Image.open(RAW).convert("RGB")
a = np.asarray(src).astype(np.float32)
H, W, _ = a.shape

# Ambient background level
bg_level = 16.0
bright = np.maximum(0.0, a.max(axis=2) - bg_level)

T_FILL = 95.0
mask = np.zeros((H, W), dtype=bool)
q = deque()
def seed(y, x):
    if not mask[y, x] and bright[y, x] < T_FILL:
        mask[y, x] = True
        q.append((y, x))
for x in range(W):
    seed(0, x); seed(H - 1, x)
for y in range(H):
    seed(y, 0); seed(y, W - 1)
while q:
    y, x = q.popleft()
    if y > 0: seed(y - 1, x)
    if y < H - 1: seed(y + 1, x)
    if x > 0: seed(y, x - 1)
    if x < W - 1: seed(y, x + 1)

alpha = np.where(mask, np.clip(bright / T_FILL, 0, 1), 1.0) * 255.0
soft = np.maximum(0.0, a - bg_level)
band = mask & (alpha > 5) & (alpha < 250)
scale = 255.0 / np.maximum(alpha, 5.0)
for c in range(3):
    soft[:, :, c] = np.where(band, np.minimum(255.0, soft[:, :, c] * scale), soft[:, :, c])

alpha[alpha < 8] = 0
alpha = (alpha / 255.0) ** 1.35 * 255.0

rgba = np.dstack([soft, alpha]).astype(np.uint8)
master_full = Image.fromarray(rgba, "RGBA")

ys, xs = np.where(alpha > 18)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
pad = 12
x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
x1, y1 = min(W, x1 + pad), min(H, y1 + pad)

full_cropped = master_full.crop((x0, y0, x1, y1))
print(f"Full cropped logo size: {full_cropped.size}")

# Crown split
crown_split_y = 638 - y0
crown_img = full_cropped.crop((0, 0, full_cropped.width, crown_split_y))
c_alpha = np.asarray(crown_img)[:, :, 3]
c_ys, c_xs = np.where(c_alpha > 15)
crown_tight = crown_img.crop((c_xs.min(), c_ys.min(), c_xs.max() + 1, c_ys.max() + 1))

# Body split (everything below crown)
body_img = full_cropped.crop((0, crown_split_y, full_cropped.width, full_cropped.height))
b_alpha = np.asarray(body_img)[:, :, 3]
b_ys, b_xs = np.where(b_alpha > 15)
body_tight = body_img.crop((b_xs.min(), b_ys.min(), b_xs.max() + 1, b_ys.max() + 1))

# Emblem split (crown + monogram without bottom wordmark)
wordmark_split_y = 1250 - y0
emblem_img = full_cropped.crop((0, 0, full_cropped.width, wordmark_split_y))
e_alpha = np.asarray(emblem_img)[:, :, 3]
e_ys, e_xs = np.where(e_alpha > 15)
emblem_tight = emblem_img.crop((e_xs.min(), e_ys.min(), e_xs.max() + 1, e_ys.max() + 1))

# Square emblem for marks/avatars
s = max(emblem_tight.size)
sq_emblem = Image.new("RGBA", (s, s), (0, 0, 0, 0))
sq_emblem.paste(emblem_tight, ((s - emblem_tight.width) // 2, (s - emblem_tight.height) // 2), emblem_tight)

# Square full logo
sf = max(full_cropped.size)
sq_full = Image.new("RGBA", (sf, sf), (0, 0, 0, 0))
sq_full.paste(full_cropped, ((sf - full_cropped.width) // 2, (sf - full_cropped.height) // 2), full_cropped)

DARK = (5, 8, 22)  # #050816

def png_opt(img, path, quantize_if_large=True):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)
    sz = os.path.getsize(path)
    if quantize_if_large and sz > 450 * 1024 and img.mode == "RGBA":
        q = img.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
        q.save(path, optimize=True)
        sz2 = os.path.getsize(path)
        print(f"  quantized {sz//1024}KB -> {sz2//1024}KB: {path}")
    else:
        print(f"  saved ({sz//1024}KB): {path}")

def jpg_dark(img, size, path, quality=88):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bg = Image.new("RGB", (size, size), (3, 4, 9))
    d = ImageDraw.Draw(bg)
    # subtle radial background lighting
    d.ellipse([size * 0.08, size * 0.08, size * 0.92, size * 0.92], fill=(8, 14, 30))
    d.ellipse([size * 0.2, size * 0.2, size * 0.8, size * 0.8], fill=(12, 20, 42))
    k = img.resize((int(size * 0.90), int(size * 0.90)), Image.LANCZOS)
    bg.paste(k, ((size - k.width) // 2, (size - k.height) // 2), k)
    bg.save(path, quality=quality, optimize=True, progressive=True)
    print(f"  saved ({os.path.getsize(path)//1024}KB): {path}")

def on_dark_tile(inner_img, size, inner_frac=0.74, bg=DARK, rounded=0.22):
    tile = Image.new("RGBA", (size, size), bg + (255,))
    if rounded is not None:
        mask_tile = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask_tile).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * rounded), fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(tile, (0, 0), mask_tile)
        tile = out
    target_s = int(size * inner_frac)
    inner = inner_img.resize((target_s, target_s), Image.LANCZOS)
    tile.alpha_composite(inner, ((size - inner.width) // 2, (size - inner.height) // 2))
    return tile

def build_ico(images, path):
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
    print(f"  saved ICO ({os.path.getsize(path)//1024}KB): {path}")

print("\n--- Generating Brand Assets ---")

# 1) Transparent Full Logo (800w)
tw = 800
th = round(full_cropped.height * tw / full_cropped.width)
full_800 = full_cropped.resize((tw, th), Image.LANCZOS)
png_opt(full_800, f"{ROOT}/assets/brand/parsa-main-logo-transparent.png")
png_opt(full_800, f"{ROOT}/assets/brand/parsa-apps-gold-1024.png")
png_opt(full_800.resize((512, round(th * 512 / tw)), Image.LANCZOS), f"{ROOT}/assets/brand/parsa-apps-gold-512.png")
png_opt(full_800.resize((360, round(th * 360 / tw)), Image.LANCZOS), f"{ROOT}/assets/brand/parsa-apps-gold-360.png")
png_opt(full_800.resize((192, round(th * 192 / tw)), Image.LANCZOS), f"{ROOT}/assets/brand/parsa-apps-gold-192.png")
png_opt(full_800.resize((96, round(th * 96 / tw)), Image.LANCZOS), f"{ROOT}/assets/brand/parsa-apps-gold-96.png")

# 2) Crown isolated transparent
crown_w = 600
crown_h = round(crown_tight.height * crown_w / crown_tight.width)
crown_600 = crown_tight.resize((crown_w, crown_h), Image.LANCZOS)
png_opt(crown_600, f"{ROOT}/assets/brand/parsa-main-crown.png")

# 3) Body isolated transparent
body_w = 800
body_h = round(body_tight.height * body_w / body_tight.width)
body_800 = body_tight.resize((body_w, body_h), Image.LANCZOS)
png_opt(body_800, f"{ROOT}/assets/brand/parsa-main-body-transparent.png")

# 4) Square Emblem for mark & avatars
emblem_512 = sq_emblem.resize((512, 512), Image.LANCZOS)
png_opt(emblem_512, f"{ROOT}/assets/brand/parsa-main-mark.png")
jpg_dark(sq_emblem, 512, f"{ROOT}/assets/brand/parsa-main-mark.jpg", quality=88)

# 5) Square Full Logo JPG
jpg_dark(sq_full, 900, f"{ROOT}/assets/brand/parsa-main-logo.jpg", quality=88)
png_opt(sq_full.resize((512, 512), Image.LANCZOS), f"{ROOT}/assets/logo.png")
jpg_dark(sq_full, 256, f"{ROOT}/assets/logo-sm.jpg", quality=88)
png_opt(sq_full.resize((256, 256), Image.LANCZOS), f"{ROOT}/assets/logo-sm.png")

# 6) PWA & Favicon
ico_imgs = [on_dark_tile(sq_emblem, s, 0.74, rounded=0.22) for s in (16, 32, 48, 64)]
build_ico(ico_imgs, f"{ROOT}/favicon.ico")

for s in (16, 32):
    on_dark_tile(sq_emblem, s, 0.74, rounded=0.22).save(f"{ROOT}/assets/icons/favicon-{s}.png", optimize=True)
    print(f"  saved assets/icons/favicon-{s}.png")

for s in (192, 512):
    on_dark_tile(sq_emblem, s, 0.72, rounded=0.22).save(f"{ROOT}/icons/icon-{s}.png", optimize=True)
    on_dark_tile(sq_emblem, s, 0.72, rounded=0.22).save(f"{ROOT}/assets/icons/icon-{s}.png", optimize=True)
    on_dark_tile(sq_emblem, s, 0.72, rounded=0.22).save(f"{ROOT}/assets/brand/parsa-apps-icon-{s}.png", optimize=True)
    on_dark_tile(sq_emblem, s, 0.72, rounded=0.22).save(f"{ROOT}/assets/brand/parsa-apps-animated-logo-poster-{s}.png", optimize=True)

on_dark_tile(sq_emblem, 180, 0.72, rounded=0.22).save(f"{ROOT}/assets/brand/parsa-apps-icon-180.png", optimize=True)
on_dark_tile(sq_emblem, 1024, 0.72, rounded=0.22).save(f"{ROOT}/assets/brand/parsa-apps-icon-1024.png", optimize=True)
png_opt(on_dark_tile(sq_full, 909, 0.88, rounded=0.18), f"{ROOT}/assets/brand/parsa-apps-animated-logo-poster.png")

# 7) OG Cover (1200x630)
og_bg = Image.new("RGB", (1200, 630), (4, 6, 14))
og_draw = ImageDraw.Draw(og_bg)
og_draw.ellipse([300, 20, 900, 610], fill=(12, 18, 42))
og_draw.ellipse([450, 100, 750, 530], fill=(24, 32, 70))
og_logo = sq_full.resize((480, 480), Image.LANCZOS)
og_bg.paste(og_logo, ((1200 - og_logo.width) // 2, (630 - og_logo.height) // 2), og_logo)
og_bg.save(f"{ROOT}/assets/brand/social-og-1200x630.jpg", quality=88, optimize=True)
og_bg.save(f"{ROOT}/assets/images/og-cover.jpg", quality=88, optimize=True)
print("  saved OG covers")

# 8) Square Social (1080x1080)
sq_soc = Image.new("RGB", (1080, 1080), (4, 6, 14))
sq_draw = ImageDraw.Draw(sq_soc)
sq_draw.ellipse([140, 140, 940, 940], fill=(12, 18, 42))
sq_draw.ellipse([260, 260, 820, 820], fill=(22, 30, 68))
sq_logo_lg = sq_full.resize((780, 780), Image.LANCZOS)
sq_soc.paste(sq_logo_lg, ((1080 - sq_logo_lg.width) // 2, (1080 - sq_logo_lg.height) // 2), sq_logo_lg)
sq_soc.save(f"{ROOT}/assets/brand/social-square-1080.jpg", quality=88, optimize=True)
print("  saved social square 1080")

print("\nAll brand assets successfully updated from 2026_20260821_002324_0001.png!")
