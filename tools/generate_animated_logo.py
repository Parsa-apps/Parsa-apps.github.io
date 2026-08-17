#!/usr/bin/env python3
"""Build the official animated Parsa-Apps GIF from the supplied artwork.

The ornate PA monogram remains visible while each glyph of ``Parsa-Apps``
flies in independently from the right.  Pillow is only a build-time tool;
the generated GIF/PNG files have no runtime dependency.
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "icons" / "Screenshot_20260814_055820_com.vivaldi.browser_edit_234120441805219.jpg"
OUT_DIR = ROOT / "assets" / "brand"
GIF_PATH = OUT_DIR / "parsa-apps-animated-logo.gif"
POSTER_PATH = OUT_DIR / "parsa-apps-animated-logo-poster.png"
POSTER_512_PATH = OUT_DIR / "parsa-apps-animated-logo-poster-512.png"
POSTER_192_PATH = OUT_DIR / "parsa-apps-animated-logo-poster-192.png"
WORD = "Parsa-Apps"

# Letter bounds in the original 909 x 886 supplied artwork.  The boxes are
# deliberately padded to preserve the soft gold glow and serif details.
GLYPHS = [
    ("P", (194, 706, 257, 780), 200, 712),
    ("a", (260, 726, 312, 781), 266, 732),
    ("r", (314, 726, 360, 780), 320, 732),
    ("s", (364, 726, 406, 781), 370, 732),
    ("a", (411, 726, 463, 781), 417, 732),
    ("-", None, 469, 751),
    ("A", (492, 705, 569, 780), 498, 711),
    ("p", (567, 726, 625, 797), 573, 732),
    ("p", (625, 726, 683, 797), 631, 732),
    ("s", (686, 726, 727, 781), 692, 732),
]


def alpha_from_black(image: Image.Image, threshold: int = 7) -> Image.Image:
    """Turn the almost-black JPEG background into smooth transparency."""
    rgba = image.convert("RGBA")
    pixels = []
    for red, green, blue, _ in rgba.get_flattened_data():
        light = max(red, green, blue)
        # Retain the faint outer glow while removing JPEG noise in the black.
        alpha = max(0, min(255, int((light - threshold) * 3.1)))
        pixels.append((red, green, blue, alpha))
    rgba.putdata(pixels)
    return rgba


def opacity(image: Image.Image, amount: float) -> Image.Image:
    result = image.copy()
    result.putalpha(result.getchannel("A").point(lambda value: round(value * amount)))
    return result


def make_dash() -> Image.Image:
    """Create a small bevelled gold hyphen matching the source artwork."""
    dash = Image.new("RGBA", (23, 14), (0, 0, 0, 0))
    glow = Image.new("RGBA", dash.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.rounded_rectangle((2, 5, 20, 9), radius=2, fill=(239, 176, 63, 170))
    glow = glow.filter(ImageFilter.GaussianBlur(3))
    dash.alpha_composite(glow)

    draw = ImageDraw.Draw(dash)
    draw.rounded_rectangle((2, 5, 20, 9), radius=2, fill=(109, 55, 10, 255))
    draw.line((3, 5, 19, 5), fill=(255, 232, 147, 255), width=2)
    draw.line((4, 8, 18, 8), fill=(190, 112, 27, 255), width=1)
    return dash


def add_ornaments(frame: Image.Image, source: Image.Image, amount: float) -> None:
    """Fade the original side ornaments and a clean lower flourish into view."""
    left = alpha_from_black(source.crop((100, 725, 192, 758)))
    right = alpha_from_black(source.crop((726, 725, 806, 758)))
    flourish = alpha_from_black(source.crop((395, 778, 508, 842)))
    frame.alpha_composite(opacity(left, amount), (100, 725))
    frame.alpha_composite(opacity(right, amount), (726, 725))
    frame.alpha_composite(opacity(flourish, amount), (395, 778))

    # Rebuild the very fine lines so the p descenders can pass cleanly over them.
    line_layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(line_layer)
    line_color = (210, 143, 44, round(205 * amount))
    highlight = (255, 221, 128, round(125 * amount))
    line_draw.line((240, 791, 405, 791), fill=line_color, width=2)
    line_draw.line((501, 791, 666, 791), fill=line_color, width=2)
    line_draw.line((250, 790, 398, 790), fill=highlight, width=1)
    line_draw.line((508, 790, 656, 790), fill=highlight, width=1)
    frame.alpha_composite(line_layer)


def fit_glyph(source: Image.Image, crop_box: tuple[int, int, int, int] | None) -> Image.Image:
    if crop_box is None:
        return make_dash()
    return alpha_from_black(source.crop(crop_box))


def render_frames() -> tuple[list[Image.Image], list[int]]:
    if "".join(glyph for glyph, *_ in GLYPHS) != WORD:
        raise RuntimeError(f"Glyph sequence must spell {WORD}")

    source = Image.open(SOURCE).convert("RGBA")
    width, height = source.size
    if (width, height) != (909, 886):
        raise RuntimeError(f"Unexpected source size: {width}x{height}; expected 909x886")

    # Keep the supplied PA artwork intact and remove only its original bottom title.
    base = source.copy()
    ImageDraw.Draw(base).rectangle((0, 703, width, height), fill=(0, 0, 0, 255))

    glyph_images = [fit_glyph(source, box) for _, box, _, _ in GLYPHS]
    fixed: list[tuple[Image.Image, int, int]] = []
    frames: list[Image.Image] = []
    durations: list[int] = []

    def new_frame(ornament_amount: float = 0.0) -> Image.Image:
        frame = base.copy()
        if ornament_amount:
            add_ornaments(frame, source, ornament_amount)
        for glyph, x, y in fixed:
            frame.alpha_composite(glyph, (x, y))
        return frame

    # Short pause on the monogram before the title starts building.
    frames.append(new_frame())
    durations.append(620)

    # Every glyph starts beyond the right edge and travels toward its final place.
    # Five eased positions make the direction unmistakably right-to-left.
    progress_values = (0.12, 0.34, 0.59, 0.82, 1.0)
    for index, ((_, _, final_x, final_y), glyph) in enumerate(zip(GLYPHS, glyph_images)):
        start_x = width + 26
        ornament_amount = max(0.0, (index - 6) / 3)
        for progress in progress_values:
            eased = 1 - (1 - progress) ** 2.35
            x = round(start_x + (final_x - start_x) * eased)
            frame = new_frame(ornament_amount)

            # A dim echo behind the moving character gives a subtle cinematic trail.
            if progress < 0.82:
                frame.alpha_composite(opacity(glyph, 0.16 * progress), (x + 24, final_y))
            frame.alpha_composite(opacity(glyph, min(1.0, progress * 1.45)), (x, final_y))
            frames.append(frame)
            durations.append(72)
        fixed.append((glyph, final_x, final_y))

    # Reveal the original decorative details once Parsa-Apps is complete.
    for amount in (0.25, 0.55, 0.8, 1.0):
        frames.append(new_frame(amount))
        durations.append(90)

    # Let viewers read the finished brand before the seamless loop restarts.
    frames.append(new_frame(1.0))
    durations.append(2100)
    return frames, durations


def resize_all(frames: Iterable[Image.Image], width: int) -> list[Image.Image]:
    frames = list(frames)
    height = round(frames[0].height * width / frames[0].width)
    return [frame.resize((width, height), Image.Resampling.LANCZOS).convert("RGB") for frame in frames]


def square_icon(image: Image.Image, size: int) -> Image.Image:
    """Fit the near-square artwork into an exact black icon canvas."""
    inner_height = round(size * image.height / image.width)
    resized = image.resize((size, inner_height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), "black")
    canvas.paste(resized, (0, (size - inner_height) // 2))
    return canvas


def save_outputs(frames: list[Image.Image], durations: list[int]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Keep a lossless, high-resolution final frame for PWA icons, metadata and
    # reduced-motion fallbacks where animated GIFs are not supported.
    final = frames[-1].convert("RGB")
    final.save(POSTER_PATH, optimize=True)
    square_icon(final, 512).save(POSTER_512_PATH, optimize=True)
    square_icon(final, 192).save(POSTER_192_PATH, optimize=True)

    # Keep browser/PWA icon aliases in sync with the official artwork.
    square_icon(final, 512).save(ROOT / "icons" / "icon-512.png", optimize=True)
    square_icon(final, 192).save(ROOT / "icons" / "icon-192.png", optimize=True)
    square_icon(final, 512).save(ROOT / "assets" / "icons" / "icon-512.png", optimize=True)
    square_icon(final, 192).save(ROOT / "assets" / "icons" / "icon-192.png", optimize=True)
    square_icon(final, 32).save(ROOT / "assets" / "icons" / "favicon-32.png", optimize=True)
    square_icon(final, 16).save(ROOT / "assets" / "icons" / "favicon-16.png", optimize=True)
    square_icon(final, 64).save(
        ROOT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )

    # A shared palette prevents color flicker and keeps the GIF reasonably small.
    web_frames = resize_all(frames, 640)
    palette = web_frames[-1].quantize(colors=192, method=Image.Quantize.MEDIANCUT)
    quantized = [
        frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG)
        for frame in web_frames
    ]
    quantized[0].save(
        GIF_PATH,
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=1,
    )


if __name__ == "__main__":
    rendered_frames, frame_durations = render_frames()
    save_outputs(rendered_frames, frame_durations)
    print(f"created {GIF_PATH.relative_to(ROOT)} ({len(rendered_frames)} frames)")
    print(f"created {POSTER_PATH.relative_to(ROOT)}")
