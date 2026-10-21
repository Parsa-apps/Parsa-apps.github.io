#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""سازنده دارایی‌های رسمی برند پارسا اپس از روی لوگوی نهایی (نسخه ۲۰۲۶).

از تصویر اصلی لوگو (بدون هیچ بازطراحی) فقط نسخه‌های مقیاس‌شده،
برش آیکون، فاوآیکون و تصاویر پیش‌نمایش شبکه‌های اجتماعی ساخته می‌شود.

اجرا:
    python3 tools/generate_brand_assets.py [path/to/logo.png]
"""

import base64
import os
import sys

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "assets", "brand")
ICONS = os.path.join(ROOT, "assets", "icons")
CINEMA = os.path.join(ROOT, "assets", "images", "cinema")
ROOT_ICONS = os.path.join(ROOT, "icons")

# ناحیه نشان (تاج + سنجاب + حرف P + حلقه مداری) در تصویر ۱۲۵۴×۱۲۵۴
MARK_BOX = (160, 5, 1094, 855)

NAVY = (7, 19, 35, 255)
ABYSS = (5, 12, 23, 255)


def ensure_dirs():
    for d in (BRAND, ICONS, CINEMA, ROOT_ICONS):
        os.makedirs(d, exist_ok=True)


def save_png(img, path):
    img.save(path, format="PNG", optimize=True)
    print(f"  PNG  {os.path.relpath(path, ROOT)}  {os.path.getsize(path) // 1024} KB")


def save_webp(img, path, quality=90):
    img.save(path, format="WEBP", quality=quality, method=6)
    print(f"  WEBP {os.path.relpath(path, ROOT)}  {os.path.getsize(path) // 1024} KB")


def master_logo(path):
    img = Image.open(path).convert("RGBA")
    if img.size != (1254, 1254):
        print(f"  ! اندازه غیرمنتظره لوگو: {img.size} (انتظار 1254x1254)")
    return img


def build_display_sizes(logo):
    """نسخه‌های نمایشی لوگوی کامل برای هدر، هیرو، فوتر و افتتاحیه."""
    print("* نسخه‌های نمایشی لوگوی کامل")
    master = os.path.join(BRAND, "parsa-apps-official-logo.png")
    if not os.path.exists(master):
        logo.save(master, format="PNG", optimize=True)
        print(f"  PNG  {os.path.relpath(master, ROOT)}  {os.path.getsize(master) // 1024} KB")
    for size in (1024, 512, 320):
        resized = logo.resize((size, size), Image.LANCZOS)
        save_png(resized, os.path.join(BRAND, f"parsa-apps-logo-{size}.png"))
        save_webp(resized, os.path.join(BRAND, f"parsa-apps-logo-{size}.webp"))


def mark_image(logo):
    """برش مربعی نشان از همان تصویر اصلی (بدون تغییر جزئیات)."""
    crop = logo.crop(MARK_BOX)
    side = max(crop.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
    return canvas


def build_icons(logo):
    """آیکون‌های سایت و PWA از برش نشانِ همان لوگو."""
    print("* آیکون‌ها و فاوآیکون‌ها")
    mark = mark_image(logo)

    save_png(mark.resize((1024, 1024), Image.LANCZOS), os.path.join(BRAND, "parsa-apps-icon-1024.png"))
    for size in (512, 192, 180):
        save_png(mark.resize((size, size), Image.LANCZOS), os.path.join(BRAND, f"parsa-apps-icon-{size}.png"))

    for size in (192, 512):
        save_png(mark.resize((size, size), Image.LANCZOS), os.path.join(ICONS, f"icon-{size}.png"))
        save_png(mark.resize((size, size), Image.LANCZOS), os.path.join(ROOT_ICONS, f"icon-{size}.png"))
    save_png(mark.resize((180, 180), Image.LANCZOS), os.path.join(ICONS, "icon-180.png"))
    save_png(mark.resize((16, 16), Image.LANCZOS), os.path.join(ICONS, "favicon-16.png"))
    save_png(mark.resize((32, 32), Image.LANCZOS), os.path.join(ICONS, "favicon-32.png"))
    save_png(mark.resize((48, 48), Image.LANCZOS), os.path.join(ICONS, "favicon-48.png"))

    # نسخه maskable با حاشیه امن روی پس‌زمینه سرمه‌ای برند
    maskable = Image.new("RGBA", (512, 512), NAVY)
    inner = mark.resize((352, 352), Image.LANCZOS)
    maskable.paste(inner, (80, 80), inner)
    save_png(maskable, os.path.join(ICONS, "icon-512-maskable.png"))

    # favicon.ico چنداندازه
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [mark.resize(s, Image.LANCZOS) for s in ico_sizes]
    ico_path = os.path.join(ROOT, "favicon.ico")
    ico_imgs[0].save(ico_path, format="ICO", sizes=ico_sizes)
    print(f"  ICO  favicon.ico  {os.path.getsize(ico_path) // 1024} KB")

    # favicon.svg با نشان جاسازی‌شده (base64) — همان تصویر اصلی
    svg_mark = mark.resize((256, 256), Image.LANCZOS)
    buf = __import__("io").BytesIO()
    svg_mark.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" '
        'role="img" aria-label="پارسا اپس - Parsa Apps">\n'
        f'  <image href="data:image/png;base64,{b64}" x="32" y="32" width="448" height="448"/>\n'
        "</svg>\n"
    )
    svg_path = os.path.join(BRAND, "parsa-apps-favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg)
    with open(os.path.join(ROOT, "assets", "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"  SVG  assets/favicon.svg  {os.path.getsize(svg_path) // 1024} KB")


def radial_glow(size, center, radius, color, alpha):
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    steps = 42
    for i in range(steps, 0, -1):
        r = int(radius * i / steps)
        a = int(alpha * (1 - i / steps) ** 2)
        x, y = center
        draw.ellipse((x - r, y - r, x + r, y + r), fill=color + (a,))
    return glow.filter(ImageFilter.GaussianBlur(radius / 14))


def compose_social(logo, width, height, out_path, logo_height_ratio=0.82):
    """ترکیب لوگوی اصلی روی پس‌زمینه سینمایی سرمه‌ای با هاله طلایی/آبی."""
    canvas = Image.new("RGBA", (width, height), ABYSS)

    # گرادیان عمودی ظریف
    grad = Image.new("RGBA", (width, height))
    top, bottom = (3, 8, 17, 255), (9, 24, 44, 255)
    for y in range(height):
        t = y / max(1, height - 1)
        row = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(4))
        grad.paste(Image.new("RGBA", (width, 1), row), (0, y))
    canvas = Image.alpha_composite(canvas, grad)

    # هاله طلایی پایین مرکز و هاله آبی بالا
    canvas = Image.alpha_composite(canvas, radial_glow((width, height), (width // 2, int(height * 0.62)),
                                                       int(min(width, height) * 0.72), (240, 185, 65), 66))
    canvas = Image.alpha_composite(canvas, radial_glow((width, height), (width // 2, int(height * 0.1)),
                                                       int(min(width, height) * 0.6), (56, 189, 248), 40))

    # حلقه‌های مداری بسیار ظریف
    ring = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    cx, cy = width // 2, int(height * 0.52)
    for r, a in ((int(min(width, height) * 0.46), 18), (int(min(width, height) * 0.58), 12)):
        rd.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(248, 210, 106, a), width=3)
    canvas = Image.alpha_composite(canvas, ring)

    # لوگوی اصلی بدون هیچ تغییری در خود تصویر
    logo_h = int(height * logo_height_ratio)
    logo_resized = logo.resize((logo_h, logo_h), Image.LANCZOS)
    lx, ly = (width - logo_h) // 2, (height - logo_h) // 2
    canvas.alpha_composite(logo_resized, (lx, ly))

    # وینیت ملایم لبه‌ها
    vign = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vign)
    steps = 26
    for i in range(steps):
        a = int(64 * (i / steps) ** 2)
        inset = int(-min(width, height) * 0.12 + (min(width, height) * 0.22) * (i / steps))
        vd.rectangle((inset, inset, width - inset, height - inset), outline=(0, 0, 0, a), width=8)
    canvas = Image.alpha_composite(canvas, vign.filter(ImageFilter.GaussianBlur(18)))

    out = canvas.convert("RGB")
    out.save(out_path, format="JPEG", quality=88, optimize=True, progressive=True)
    print(f"  JPG  {os.path.relpath(out_path, ROOT)}  {os.path.getsize(out_path) // 1024} KB")


def build_social(logo):
    print("* تصاویر پیش‌نمایش شبکه‌های اجتماعی")
    compose_social(logo, 1200, 630, os.path.join(CINEMA, "og-parsa-apps.jpg"), logo_height_ratio=0.84)
    compose_social(logo, 1200, 630, os.path.join(BRAND, "social-og-1200x630.jpg"), logo_height_ratio=0.84)
    compose_social(logo, 1080, 1080, os.path.join(BRAND, "social-square-1080.jpg"), logo_height_ratio=0.82)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BRAND, "parsa-apps-official-logo.png")
    if not os.path.exists(src):
        src = os.path.join(BRAND, "parsa-apps-official-logo.png")
    print(f"لوگوی مرجع: {src}")
    ensure_dirs()
    logo = master_logo(src)
    build_display_sizes(logo)
    build_icons(logo)
    build_social(logo)
    print("انجام شد.")


if __name__ == "__main__":
    main()
