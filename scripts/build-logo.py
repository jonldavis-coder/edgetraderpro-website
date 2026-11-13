#!/usr/bin/env python3
"""Draw the EdgeDashPro eDP monogram.

A smaller lowercase e sits beside larger uppercase D and P. A blue slash
cuts the D/P junction from bottom-left to top-right. logo.svg and mark.svg
are white on transparent. favicon.svg and the PNG marks sit on dark navy.
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "assets" / "fonts" / "Inter-SemiBold.ttf"
ITALIC_PATH = ROOT / "assets" / "fonts" / "LiberationSerif-Italic.ttf"
OUT = ROOT / "assets" / "img"

NAVY = (7, 20, 46, 255)
INK = (5, 9, 20, 255)
WHITE = (255, 255, 255, 255)
CORE = (244, 251, 255, 255)
CYAN = (56, 189, 248, 255)
BLUE = (37, 99, 235, 255)


def load_font():
    font = TTFont(str(FONT_PATH))
    return font.getGlyphSet(), font.getBestCmap(), font["head"].unitsPerEm


def glyph_path(font_set, cmap, upem, ch, size, x, baseline):
    glyph = font_set[cmap[ord(ch)]]
    scale = size / upem
    pen = SVGPathPen(font_set)
    glyph.draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
    return pen.getCommands(), glyph.width * scale


def layout(font_set, cmap, upem):
    e_size = 148
    dp_size = 210
    _, e_adv = glyph_path(font_set, cmap, upem, "e", e_size, 0, 0)
    _, d_adv = glyph_path(font_set, cmap, upem, "D", dp_size, 0, 0)
    _, p_adv = glyph_path(font_set, cmap, upem, "P", dp_size, 0, 0)
    gap_e = 6
    gap_dp = 8
    pad_x = 28
    pad_y = 36
    baseline = pad_y + dp_size * 0.80
    e_x = pad_x
    d_x = e_x + e_adv + gap_e
    p_x = d_x + d_adv + gap_dp
    width = p_x + p_adv + pad_x
    height = baseline + dp_size * 0.22 + pad_y
    e_cmd, _ = glyph_path(font_set, cmap, upem, "e", e_size, e_x, baseline)
    d_cmd, _ = glyph_path(font_set, cmap, upem, "D", dp_size, d_x, baseline)
    p_cmd, _ = glyph_path(font_set, cmap, upem, "P", dp_size, p_x, baseline)
    junction = d_x + d_adv + gap_dp / 2
    cap_top = baseline - dp_size * 0.72
    x1, y1 = junction - 22, baseline - 8
    x2, y2 = junction + 22, cap_top + 6
    return {
        "e": e_cmd,
        "d": d_cmd,
        "p": p_cmd,
        "width": width,
        "height": height,
        "slash": (x1, y1, x2, y2),
        "e_size": e_size,
        "dp_size": dp_size,
        "baseline": baseline,
        "e_x": e_x,
        "d_x": d_x,
        "p_x": p_x,
    }


def slash_markup(x1, y1, x2, y2, filter_id="glow", mask_id="cut"):
    return f'''<defs>
    <filter id="{filter_id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="4.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <mask id="{mask_id}">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#000000" stroke-width="18" stroke-linecap="square"/>
    </mask>
  </defs>
  <g mask="url(#{mask_id})">
    <path fill="#ffffff" d="{{letters}}"/>
  </g>
  <g filter="url(#{filter_id})" stroke-linecap="square">
    <line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#2563eb" stroke-width="16" opacity="0.95"/>
    <line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#38bdf8" stroke-width="7"/>
    <line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#f4fbff" stroke-width="2.4"/>
  </g>'''


def monogram_svg(box):
    x1, y1, x2, y2 = box["slash"]
    letters = f'{box["e"]} {box["d"]} {box["p"]}'
    body = slash_markup(x1, y1, x2, y2).replace("{letters}", letters)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box["width"]:.1f} {box["height"]:.1f}" '
        f'role="img" aria-label="EdgeDashPro eDP monogram">\n{body}\n</svg>\n'
    )


def favicon_svg(box):
    x1, y1, x2, y2 = box["slash"]
    letters = f'{box["e"]} {box["d"]} {box["p"]}'
    inner = slash_markup(x1, y1, x2, y2, "glow-f", "cut-f").replace("{letters}", letters)
    scale = 52 / box["width"]
    tx = (64 - box["width"] * scale) / 2
    ty = (64 - box["height"] * scale) / 2
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="EdgeDashPro">
  <rect width="64" height="64" rx="14" fill="#050914"/>
  <g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.4f})">
{inner}
  </g>
</svg>
'''


def raster_monogram(scale=4):
    font_set, cmap, upem = load_font()
    box = layout(font_set, cmap, upem)
    w = int(box["width"] * scale)
    h = int(box["height"] * scale)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font_e = ImageFont.truetype(str(FONT_PATH), int(box["e_size"] * scale))
    font_dp = ImageFont.truetype(str(FONT_PATH), int(box["dp_size"] * scale))
    # Pillow's text y is the top of the em box, not the baseline. Offset by ascent.
    ascent_e = font_e.getmetrics()[0]
    ascent_dp = font_dp.getmetrics()[0]
    base = box["baseline"] * scale
    draw.text((box["e_x"] * scale, base - ascent_e), "e", font=font_e, fill=WHITE)
    draw.text((box["d_x"] * scale, base - ascent_dp), "D", font=font_dp, fill=WHITE)
    draw.text((box["p_x"] * scale, base - ascent_dp), "P", font=font_dp, fill=WHITE)
    x1, y1, x2, y2 = [v * scale for v in box["slash"]]
    gap = Image.new("L", img.size, 0)
    ImageDraw.Draw(gap).line((x1, y1, x2, y2), fill=255, width=int(18 * scale))
    alpha = img.getchannel("A")
    alpha.paste(0, mask=gap)
    img.putalpha(alpha)
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.line((x1, y1, x2, y2), fill=BLUE, width=int(18 * scale))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=8 * scale / 2))
    img = Image.alpha_composite(img, glow)
    core = Image.new("RGBA", img.size, (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(core)
    cdraw.line((x1, y1, x2, y2), fill=BLUE, width=int(14 * scale))
    cdraw.line((x1, y1, x2, y2), fill=CYAN, width=int(6 * scale))
    cdraw.line((x1, y1, x2, y2), fill=CORE, width=max(2, int(2.2 * scale)))
    img = Image.alpha_composite(img, core)
    return img, box


def rounded(im, radius):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.size[0], im.size[1]), radius=radius, fill=255)
    out = im.copy()
    out.putalpha(mask)
    return out


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    font_set, cmap, upem = load_font()
    box = layout(font_set, cmap, upem)
    mark = monogram_svg(box)
    (OUT / "logo.svg").write_text(mark)
    (OUT / "mark.svg").write_text(mark)
    (OUT / "favicon.svg").write_text(favicon_svg(box))

    mono, _ = raster_monogram(scale=3)
    icon = Image.new("RGBA", (180, 180), INK)
    fitted = mono.copy()
    fitted.thumbnail((132, 132), Image.Resampling.LANCZOS)
    icon.alpha_composite(fitted, ((180 - fitted.width) // 2, (180 - fitted.height) // 2))
    rounded(icon, 36).save(OUT / "apple-touch-icon.png")

    og = Image.new("RGBA", (1200, 630), NAVY)
    hero = mono.copy()
    hero.thumbnail((760, 280), Image.Resampling.LANCZOS)
    og.alpha_composite(hero, ((1200 - hero.width) // 2, 78))
    draw = ImageDraw.Draw(og)
    name_font = ImageFont.truetype(str(FONT_PATH), 72)
    tag_font = ImageFont.truetype(str(ITALIC_PATH), 36)
    name = "EdgeDashPro"
    tag = "Your rules. Your data. Your desk."
    name_w = draw.textlength(name, font=name_font)
    tag_w = draw.textlength(tag, font=tag_font)
    draw.text(((1200 - name_w) / 2, 400), name, font=name_font, fill=WHITE)
    draw.text(((1200 - tag_w) / 2, 492), tag, font=tag_font, fill=(215, 233, 255, 255))
    og.convert("RGB").save(OUT / "og.png", quality=95)
    print(f"eDP monogram {box['width']:.0f}x{box['height']:.0f}")


if __name__ == "__main__":
    build()
