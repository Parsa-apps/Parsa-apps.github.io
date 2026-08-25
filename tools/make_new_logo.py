#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
پردازش لوگوی جدید پارسا اپس:
۱) حذف کامل پس‌زمینه (فیلد-فیل از لبه‌ها + تبدیل هاله به آلفا)
۲) خروجی‌ها:
   - assets/brand/parsa-main-logo-transparent.png  (لوگوی شفاف — اینترو/ماسک برق)
   - assets/brand/parsa-main-mark.jpg              (نشان هدر/فوتر/درباره ما — JPG روی زمینه‌ی تیره)
   - assets/brand/parsa-main-logo.jpg              (کارت هیرو + og:image — JPG روی زمینه‌ی تیره)
   - favicon.ico + icons/* + assets/icons/*        (آیکون‌ها روی کاشی تیره‌ی برند)
"""
from PIL import Image, ImageDraw
import numpy as np
from collections import deque
import os, struct

SRC = "/tmp/newlogo-raw.png"
ROOT = "/home/user/Parsa-apps.github.io"
PREVIEW = "/home/user/Parsa-apps.github.io/debug-shots/logo-preview"
os.makedirs(PREVIEW, exist_ok=True)

T0, T_FILL = 4.0, 115.0   # آستانه‌ی شفافیت کامل / سقف ناحیه‌ی فیلد-فیل (matte-freeze)

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.float32)
bright = a.max(axis=2)

# ---------- ۱) فیلد-فیل از لبه‌ها روی پیکسل‌های تیره ----------
H, W = bright.shape
mask = np.zeros((H, W), dtype=bool)          # True = ناحیه‌ی پس‌زمینه/هاله
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

print("background pixels:", mask.sum(), "/", H * W, f"({100*mask.sum()/(H*W):.1f}%)")

# ---------- ۲) آلفا (matte-freeze): در ناحیه‌ی متصل به لبه، آلفا از خودِ
# روشنایی ساخته می‌شود و رنگ تقسیم بر آلفا می‌شود؛ نتیجه: هاله و vignette
# به درخشش نیمه‌شفافِ واقعی تبدیل می‌شود و روی هر پس‌زمینه‌ای تمیز می‌نشیند.
alpha = np.where(mask, np.clip(bright / T_FILL, 0, 1), 1.0) * 255.0

# ---------- ۳) un-premultiply ناحیه‌ی نیمه‌شفاف ----------
soft = a.copy()
band = mask & (alpha > 8) & (alpha < 252)
scale = 255.0 / np.maximum(alpha, 8.0)
for c in range(3):
    soft[:, :, c] = np.where(band, np.minimum(255.0, a[:, :, c] * scale), a[:, :, c])
alpha[alpha < 12] = 0  # دود بسیار ضعیف حذف شود

# ---------- ۳) نرم‌سازی آلفا: فشرده‌ی گامایی هاله‌ی کم‌رمق + پرِ لبه‌ی بوم
# (تا لبه‌ی مربع برش، هیچ‌گاه به‌صورت خط/کادر دیده نشود)
alpha = (alpha / 255.0) ** 1.55 * 255.0
Hh, Ww = alpha.shape
F = 0.06  # ضخامت پرِ لبه
yy = np.arange(Hh)[:, None]
xx = np.arange(Ww)[None, :]
ramp = np.minimum(np.minimum(yy, Hh - 1 - yy), np.minimum(xx, Ww - 1 - xx)) / (F * Ww)
alpha *= np.clip(ramp, 0, 1)
alpha[alpha < 6] = 0

rgba = np.dstack([soft, alpha]).astype(np.uint8)
out = Image.fromarray(rgba, "RGBA")

# ---------- ۴) دو نوع برش ----------
def bbox_of(arr_alpha, thr):
    ys, xs = np.where(arr_alpha >= thr)
    return xs.min(), ys.min(), xs.max(), ys.max()

def crop_pad(img, box, pad_frac=0.03, square=True):
    x0, y0, x1, y1 = box
    w, h = x1 - x0 + 1, y1 - y0 + 1
    px, py = int(w * pad_frac), int(h * pad_frac)
    x0, y0 = max(0, x0 - px), max(0, y0 - py)
    x1, y1 = min(img.width - 1, x1 + px), min(img.height - 1, y1 + py)
    c = img.crop((x0, y0, x1 + 1, y1 + 1))
    if square:
        s = max(c.size)
        canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        canvas.paste(c, ((s - c.width) // 2, (s - c.height) // 2), c)
        c = canvas
    return c

soft_box = bbox_of(alpha, 10)    # با هاله
tight_box = bbox_of(alpha, 90)   # فقط بدنه‌ی توپر لوگو

master = crop_pad(out, soft_box, 0.015, square=False)
tight = crop_pad(out, tight_box, 0.02, square=True)
print("master:", master.size, "tight:", tight.size)

# ---------- پیش‌نمایش روی زمینه‌های روشن/تیره/شطرنجی ----------
def preview(img, name, size=560):
    tile = 28
    bg = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(bg)
    for yy in range(0, size, tile):
        for xx in range(0, size, tile):
            c = (70, 74, 84) if (xx // tile + yy // tile) % 2 else (52, 56, 66)
            d.rectangle([xx, yy, xx + tile - 1, yy + tile - 1], fill=c)
    k = img.copy(); k.thumbnail((size - 40, size - 40), Image.LANCZOS)
    bg.paste(k, ((size - k.width) // 2, (size - k.height) // 2), k)
    bg.save(f"{PREVIEW}/{name}")

preview(master, "master-on-checker.png")
preview(tight, "tight-on-checker.png")

dark = Image.new("RGB", (560, 560), (3, 4, 9))
k = master.copy(); k.thumbnail((500, 500), Image.LANCZOS)
dark.paste(k, ((560 - k.width) // 2, (560 - k.height) // 2), k)
dark.save(f"{PREVIEW}/master-on-dark.png")

light = Image.new("RGB", (560, 560), (244, 246, 250))
k = master.copy(); k.thumbnail((500, 500), Image.LANCZOS)
light.paste(k, ((560 - k.width) // 2, (560 - k.height) // 2), k)
light.save(f"{PREVIEW}/master-on-light.png")

master.save(f"{PREVIEW}/master-full.png")
print("previews written to", PREVIEW)
