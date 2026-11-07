#!/usr/bin/env python3
"""Outline the Edge Trader Pro mark: italic e over a bar, T with pro, rising candles.

The mark is white. favicon.svg paints it on navy. logo.svg is transparent so it
sits on the site's navy field.
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONT = Path("/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf")
OUT = ROOT / "assets" / "img"

NAVY = "#07142e"
WHITE = "#ffffff"


def load_font():
    font = TTFont(str(FONT))
    return font, font.getGlyphSet(), font.getBestCmap(), font["head"].unitsPerEm


def glyph_cmd(font_set, cmap, upem, ch, size, x, baseline):
    glyph = font_set[cmap[ord(ch)]]
    scale = size / upem
    pen = SVGPathPen(font_set)
    # Font y grows up; SVG y grows down. Baseline is the SVG y of the font baseline.
    transform = (scale, 0, 0, -scale, x, baseline)
    glyph.draw(TransformPen(pen, transform))
    advance = glyph.width * scale
    return pen.getCommands(), advance


def text_cmd(font_set, cmap, upem, text, size, x, baseline):
    parts = []
    cursor = x
    for ch in text:
        cmd, adv = glyph_cmd(font_set, cmap, upem, ch, size, cursor, baseline)
        if cmd:
            parts.append(cmd)
        cursor += adv
    return " ".join(parts), cursor - x


def candle(cx, body_top, body_bot, wick_top, wick_bot, width):
    hw = width / 2
    wick = (
        f'<line x1="{cx:.2f}" y1="{wick_top:.2f}" x2="{cx:.2f}" y2="{wick_bot:.2f}" '
        f'stroke="{WHITE}" stroke-width="2.4" stroke-linecap="round"/>'
    )
    body = (
        f'<rect x="{cx - hw:.2f}" y="{body_top:.2f}" width="{width:.2f}" '
        f'height="{body_bot - body_top:.2f}" fill="{WHITE}"/>'
    )
    return wick + body


def build():
    font, font_set, cmap, upem = load_font()

    # Optical sizes chosen so the italic e sits over the bar and T reads larger,
    # matching the e / T-pro lockup.
    e_size = 168
    t_size = 188
    pro_size = 78

    e_cmd, e_adv = text_cmd(font_set, cmap, upem, "e", e_size, 0, 0)
    t_cmd, t_adv = text_cmd(font_set, cmap, upem, "T", t_size, 0, 0)
    pro_cmd, pro_adv = text_cmd(font_set, cmap, upem, "pro", pro_size, 0, 0)

    # Rebuild at final positions. Italic T leans right, so the bar is centered
    # on the visual mass of the e, and "pro" tucks under the right side of T.
    bar_w = max(e_adv, t_adv * 0.92) + 36
    bar_x = 8
    bar_y = 196

    e_x = bar_x + (bar_w - e_adv) / 2 - 6
    e_base = bar_y - 22
    e_cmd, e_adv = text_cmd(font_set, cmap, upem, "e", e_size, e_x, e_base)

    t_x = bar_x + (bar_w - t_adv) / 2 - 18
    t_base = bar_y + 168
    t_cmd, t_adv = text_cmd(font_set, cmap, upem, "T", t_size, t_x, t_base)

    pro_x = t_x + t_adv * 0.46
    pro_base = t_base + 34
    pro_cmd, pro_adv = text_cmd(font_set, cmap, upem, "pro", pro_size, pro_x, pro_base)

    bar_x2 = bar_x + bar_w

    # Rising candles and a stepped trend line to the right of the fraction.
    chart_x = bar_x2 + 48
    # Four candles, left to right, bodies climbing.
    candles = [
        # cx, body_top, body_bot, wick_top, wick_bot, width
        (chart_x + 36, 250, 292, 232, 308, 16),
        (chart_x + 92, 214, 268, 196, 286, 16),
        (chart_x + 148, 176, 236, 154, 254, 16),
        (chart_x + 206, 126, 198, 96, 216, 18),
    ]
    candle_svg = "".join(candle(*c) for c in candles)

    # Stepped rising line ending in an arrow, above the candles.
    x0 = chart_x + 4
    line_pts = [
        (x0, 228),
        (x0 + 58, 188),
        (x0 + 96, 184),
        (x0 + 150, 142),
        (x0 + 186, 138),
        (x0 + 236, 86),
    ]
    points = " ".join(f"{x:.1f},{y:.1f}" for x, y in line_pts)
    ax, ay = line_pts[-1]
    arrow = (
        f'<polygon points="{ax:.1f},{ay:.1f} {ax - 16:.1f},{ay + 7:.1f} {ax - 8:.1f},{ay + 16:.1f}" '
        f'fill="{WHITE}"/>'
    )

    min_x = 0
    min_y = 8
    max_x = line_pts[-1][0] + 18
    max_y = max(pro_base + 36, candles[0][4] + 8)
    width = max_x - min_x
    height = max_y - min_y
    # Shift content so the viewBox origin has even padding.
    pad = 12

    def shift(cmd):
        # Paths are absolute in font space already positioned. No extra shift.
        return cmd

    vb_w = width + pad * 2
    vb_h = height + pad
    # Our coordinates already start near 0. Add padding by translating the group.
    tx, ty = pad, pad - min_y

    fraction = f"""
    <g fill="{WHITE}">
      <path d="{e_cmd}"/>
      <path d="{t_cmd}"/>
      <path d="{pro_cmd}"/>
    </g>
    <line x1="{bar_x:.2f}" y1="{bar_y:.2f}" x2="{bar_x2:.2f}" y2="{bar_y:.2f}"
          stroke="{WHITE}" stroke-width="3.25" stroke-linecap="round"/>
    """

    inner = f'<g transform="translate({tx:.2f} {ty:.2f})">{fraction}{candle_svg}<polyline points="{points}" fill="none" stroke="{WHITE}" stroke-width="2.75" stroke-linejoin="round" stroke-linecap="round"/>{arrow}</g>'

    logo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb_w:.2f} {vb_h:.2f}" fill="none" role="img" aria-labelledby="logoTitle logoDesc">
  <title id="logoTitle">Edge Trader Pro</title>
  <desc id="logoDesc">Italic e over a bar, a capital T with a small pro, and rising candlesticks.</desc>
  {inner}
</svg>
'''

    # Fraction-only mark. Bounds come from the placed glyphs so the tile
    # does not clip the italic overhang or the p descender.
    from fontTools.pens.boundsPen import BoundsPen

    def placed_bounds(text, size, x, baseline):
        scale = size / upem
        cursor = x
        boxes = []
        for ch in text:
            glyph = font_set[cmap[ord(ch)]]
            pen = BoundsPen(font_set)
            glyph.draw(pen)
            if pen.bounds:
                x0, y0, x1, y1 = pen.bounds
                boxes.append(
                    (
                        cursor + x0 * scale,
                        baseline - y1 * scale,
                        cursor + x1 * scale,
                        baseline - y0 * scale,
                    )
                )
            cursor += glyph.width * scale
        return boxes

    boxes = []
    boxes += placed_bounds("e", e_size, e_x, e_base)
    boxes += placed_bounds("T", t_size, t_x, t_base)
    boxes += placed_bounds("pro", pro_size, pro_x, pro_base)
    boxes.append((bar_x, bar_y - 2, bar_x2, bar_y + 2))
    frac_min_x = min(b[0] for b in boxes) - 18
    frac_min_y = min(b[1] for b in boxes) - 18
    frac_max_x = max(b[2] for b in boxes) + 18
    frac_max_y = max(b[3] for b in boxes) + 18
    fw = frac_max_x - frac_min_x
    fh = frac_max_y - frac_min_y

    mark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{frac_min_x:.2f} {frac_min_y:.2f} {fw:.2f} {fh:.2f}" fill="none" role="img" aria-label="Edge Trader Pro mark">
  <g fill="{WHITE}">
    <path d="{e_cmd}"/>
    <path d="{t_cmd}"/>
    <path d="{pro_cmd}"/>
  </g>
  <line x1="{bar_x:.2f}" y1="{bar_y:.2f}" x2="{bar_x2:.2f}" y2="{bar_y:.2f}" stroke="{WHITE}" stroke-width="3.25" stroke-linecap="round"/>
</svg>
'''

    side = max(fw, fh)
    ox = (side - fw) / 2 - frac_min_x
    oy = (side - fh) / 2 - frac_min_y
    favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side:.2f} {side:.2f}" role="img" aria-label="Edge Trader Pro">
  <rect width="{side:.2f}" height="{side:.2f}" rx="{side * 0.18:.2f}" fill="{NAVY}"/>
  <g transform="translate({ox:.2f} {oy:.2f})">
    <g fill="{WHITE}">
      <path d="{e_cmd}"/>
      <path d="{t_cmd}"/>
      <path d="{pro_cmd}"/>
    </g>
    <line x1="{bar_x:.2f}" y1="{bar_y:.2f}" x2="{bar_x2:.2f}" y2="{bar_y:.2f}" stroke="{WHITE}" stroke-width="3.25" stroke-linecap="round"/>
  </g>
</svg>
'''

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "logo.svg").write_text(logo, encoding="utf-8")
    (OUT / "favicon.svg").write_text(favicon, encoding="utf-8")
    (OUT / "mark.svg").write_text(mark, encoding="utf-8")
    print(f"wrote logo.svg viewBox 0 0 {vb_w:.1f} {vb_h:.1f}")
    print(f"wrote favicon.svg side {side:.1f}")
    print(f"wrote mark.svg {fw:.1f} x {fh:.1f}")


if __name__ == "__main__":
    build()
