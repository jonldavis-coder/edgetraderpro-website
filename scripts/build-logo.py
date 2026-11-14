#!/usr/bin/env python3
"""EdgeDashPro marks.

logo.svg is the EdgeDashPro wordmark, white on transparent.
favicon.svg, mark.svg, and apple-touch-icon.png are a square EDP
icon: bold uppercase letters cut by a rising blue trend line.
og.png is the wordmark and tagline on navy, with no icon.
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "assets" / "fonts" / "Inter-SemiBold.ttf"
ITALIC_PATH = ROOT / "assets" / "fonts" / "LiberationSerif-Italic.ttf"
OUT = ROOT / "assets" / "img"


def load_font():
    font = TTFont(str(FONT_PATH))
    return font.getGlyphSet(), font.getBestCmap(), font["head"].unitsPerEm


def glyph_path(font_set, cmap, upem, ch, size, x, baseline):
    glyph = font_set[cmap[ord(ch)]]
    scale = size / upem
    pen = SVGPathPen(font_set)
    glyph.draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
    return pen.getCommands(), glyph.width * scale


def text_run(font_set, cmap, upem, text, size, x, baseline, tracking=0):
    parts = []
    cursor = x
    for ch in text:
        cmd, adv = glyph_path(font_set, cmap, upem, ch, size, cursor, baseline)
        if cmd:
            parts.append(cmd)
        cursor += adv + tracking
    return " ".join(parts), cursor - x


def wordmark_svg():
    font_set, cmap, upem = load_font()
    size = 86
    path, width = text_run(font_set, cmap, upem, "EdgeDashPro", size, 0, size * 0.8, tracking=-1.5)
    height = size * 1.05
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {height:.1f}" '
        f'role="img" aria-label="EdgeDashPro">\n'
        f'  <path fill="#ffffff" d="{path}"/>\n'
        f"</svg>\n"
    )


def icon_layout():
    font_set, cmap, upem = load_font()
    size = 210
    path, width = text_run(font_set, cmap, upem, "EDP", size, 0, 0, tracking=-8)
    pad_x = 36
    pad_y = 48
    baseline = pad_y + size * 0.78
    path, width = text_run(font_set, cmap, upem, "EDP", size, pad_x, baseline, tracking=-8)
    box_w = width + pad_x
    box_h = baseline + size * 0.24
    # Rising zig-zag from the lower left of E to the upper right of P.
    x0 = pad_x + width * 0.06
    x1 = pad_x + width * 0.34
    x2 = pad_x + width * 0.46
    x3 = pad_x + width * 0.68
    x4 = pad_x + width * 0.80
    x5 = pad_x + width * 0.98
    y_base = baseline - size * 0.08
    points = [
        (x0, y_base),
        (x1, y_base - size * 0.22),
        (x2, y_base - size * 0.12),
        (x3, y_base - size * 0.40),
        (x4, y_base - size * 0.28),
        (x5, y_base - size * 0.58),
    ]
    return path, box_w, box_h, points


def points_attr(points):
    return " ".join(f"{x:.2f},{y:.2f}" for x, y in points)


def icon_svg(rounded=True):
    path, width, height, points = icon_layout()
    poly = points_attr(points)
    tip_x, tip_y = points[-1]
    prev_x, prev_y = points[-2]
    # Small arrow head continuing the last rising segment.
    arrow = (
        f'<polygon points="{tip_x:.2f},{tip_y:.2f} '
        f'{tip_x - 16:.2f},{tip_y + 4:.2f} {tip_x - 6:.2f},{tip_y + 16:.2f}" fill="#f4fbff"/>'
    )
    plate = (
        f'<rect width="100%" height="100%" rx="18" fill="#050914"/>'
        if rounded
        else ""
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {height:.1f}" role="img" aria-label="EDP">
  <defs>
    <filter id="trend-glow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="3.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <mask id="trend-cut">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <polyline points="{poly}" fill="none" stroke="#000000" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>
    </mask>
  </defs>
  {plate}
  <g mask="url(#trend-cut)">
    <path fill="#ffffff" d="{path}"/>
  </g>
  <g filter="url(#trend-glow)" fill="none" stroke-linejoin="round" stroke-linecap="round">
    <polyline points="{poly}" stroke="#2563eb" stroke-width="14" opacity="0.95"/>
    <polyline points="{poly}" stroke="#38bdf8" stroke-width="6"/>
    <polyline points="{poly}" stroke="#f4fbff" stroke-width="2.2"/>
  </g>
  {arrow}
</svg>
'''


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    word = wordmark_svg()
    (OUT / "logo.svg").write_text(word)
    icon = icon_svg(rounded=True)
    (OUT / "favicon.svg").write_text(icon)
    (OUT / "mark.svg").write_text(icon_svg(rounded=False))

    # Raster icons and the social card from the same type, not the old monogram.
    font = ImageFont.truetype(str(FONT_PATH), 420)
    italic = ImageFont.truetype(str(ITALIC_PATH), 36)
    name_font = ImageFont.truetype(str(FONT_PATH), 78)

    def draw_edp(size):
        canvas = Image.new("RGBA", (size, size), (5, 9, 20, 255))
        draw = ImageDraw.Draw(canvas)
        text = "EDP"
        text_size = int(size * 0.34)
        face = ImageFont.truetype(str(FONT_PATH), text_size)
        bbox = draw.textbbox((0, 0), text, font=face)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        tx = (size - tw) / 2 - bbox[0]
        ty = (size - th) / 2 - bbox[1]
        draw.text((tx, ty), text, font=face, fill=(255, 255, 255, 255))
        left = tx + bbox[0]
        right = tx + bbox[2]
        top = ty + bbox[1]
        bottom = ty + bbox[3]
        span = right - left
        y0 = bottom - (bottom - top) * 0.18
        pts = [
            (left + span * 0.04, y0),
            (left + span * 0.30, y0 - (bottom - top) * 0.28),
            (left + span * 0.42, y0 - (bottom - top) * 0.14),
            (left + span * 0.64, y0 - (bottom - top) * 0.48),
            (left + span * 0.76, y0 - (bottom - top) * 0.32),
            (left + span * 0.98, y0 - (bottom - top) * 0.70),
        ]
        gap = Image.new("L", canvas.size, 0)
        ImageDraw.Draw(gap).line(pts, fill=255, width=max(4, size // 28), joint="curve")
        alpha = canvas.getchannel("A")
        # Keep the navy plate opaque; only punch the white letters.
        letters = Image.new("L", canvas.size, 0)
        ImageDraw.Draw(letters).text((tx, ty), text, font=face, fill=255)
        cut = Image.new("L", canvas.size, 0)
        Image.composite(gap, Image.new("L", canvas.size, 0), letters).save  # noqa: keep composite available
        punched = Image.new("L", canvas.size, 255)
        # Subtract the trend from the letter coverage, then restore the plate.
        letter_alpha = letters.copy()
        letter_alpha.paste(0, mask=gap)
        alpha.paste(letter_alpha, mask=letters)
        canvas.putalpha(alpha)
        glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        g = ImageDraw.Draw(glow)
        g.line(pts, fill=(37, 99, 235, 230), width=max(6, size // 22), joint="curve")
        glow = glow.filter(ImageFilter.GaussianBlur(radius=max(2, size / 40)))
        canvas = Image.alpha_composite(canvas, glow)
        core = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        c = ImageDraw.Draw(core)
        c.line(pts, fill=(37, 99, 235, 255), width=max(5, size // 26), joint="curve")
        c.line(pts, fill=(56, 189, 248, 255), width=max(3, size // 48), joint="curve")
        c.line(pts, fill=(244, 251, 255, 255), width=max(1, size // 90), joint="curve")
        tip = pts[-1]
        c.polygon(
            [(tip[0], tip[1]), (tip[0] - size * 0.06, tip[1] + size * 0.015), (tip[0] - size * 0.02, tip[1] + size * 0.055)],
            fill=(244, 251, 255, 255),
        )
        canvas = Image.alpha_composite(canvas, core)
        rounded = Image.new("L", canvas.size, 0)
        ImageDraw.Draw(rounded).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.22), fill=255)
        alpha = canvas.getchannel("A")
        canvas.putalpha(ImageChops.multiply(alpha, rounded))
        return canvas

    draw_edp(180).save(OUT / "apple-touch-icon.png")

    og = Image.new("RGB", (1200, 630), (7, 20, 46))
    draw = ImageDraw.Draw(og)
    name = "EdgeDashPro"
    tag = "Your rules. Your data. Your desk."
    name_w = draw.textlength(name, font=name_font)
    tag_w = draw.textlength(tag, font=italic)
    draw.text(((1200 - name_w) / 2, 250), name, font=name_font, fill=(255, 255, 255))
    draw.text(((1200 - tag_w) / 2, 360), tag, font=italic, fill=(215, 233, 255))
    og.save(OUT / "og.png", quality=95)
    # font is loaded to fail fast if the face is missing.
    _ = font
    print("wrote EdgeDashPro wordmark and EDP icon")


if __name__ == "__main__":
    build()
