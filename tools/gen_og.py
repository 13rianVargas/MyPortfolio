#!/usr/bin/env python3
"""Build the Open Graph cover from the live site's own hero.

Same palette, same font, same identity card — someone who sees the card in a
Slack unfurl and then opens the site should recognise it.

Text is converted to outlines rather than set as <text>. Neither renderer
available here can do both halves of the job: qlmanage resolves an embedded
@font-face but crops the canvas instead of honouring width/height, and
rsvg-convert honours the size exactly but ignores the embedded font and falls
back to Helvetica. Outlines sidestep the question — the glyphs are already
shapes by the time either one sees them, and the file no longer carries a
360 KB base64 font.

Run it with:  python3 tools/gen_og.py
Needs `fonttools`, `brotli` and `pillow` on the interpreter, plus `rsvg-convert`
on PATH (brew install librsvg). Intermediates land in .og-build/, which is
gitignored — delete it to force a clean rebuild.
"""
import base64, os, subprocess
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, ".og-build")   # scratch, gitignored
IC = FONTS = BUILD

W, H = 1200, 630
BG, CARD, INK = "#171717", "#1f1f1f", "#f1f5f9"
AMBER, MUTED = "#fcd34d", "#a8b4c4"

def _prepare():
    """Cut the two static weights and the photo the card needs.

    Space Grotesk ships as a variable woff2 in node_modules; the outlines come
    from instances of it, so nothing has to be installed to run this.
    """
    from fontTools.varLib import instancer
    os.makedirs(BUILD, exist_ok=True)
    src = os.path.join(ROOT, "node_modules/@fontsource-variable/space-grotesk/"
                             "files/space-grotesk-latin-wght-normal.woff2")
    for w in (400, 700):
        out = f"{FONTS}/SG-{w}.ttf"
        if not os.path.exists(out):
            f = TTFont(src); f.flavor = None
            instancer.instantiateVariableFont(f, {"wght": w}, inplace=True)
            f.save(out)
    if not os.path.exists(f"{IC}/photo400.png"):
        from PIL import Image
        im = Image.open(os.path.join(ROOT, "src/assets/BrianPhoto.webp")).convert("RGBA")
        w, h = im.size; side = min(w, h)
        im.crop(((w-side)//2, 0, (w-side)//2+side, side)).resize(
            (400, 400), Image.LANCZOS).save(f"{IC}/photo400.png", optimize=True)
    if not os.path.exists(f"{IC}/deerhead.svg.png"):
        subprocess.run(["rsvg-convert", "-w", "96", "-h", "96",
                        os.path.join(ROOT, "public/icons/deerhead.svg"),
                        "-o", f"{IC}/deerhead.svg.png"], check=True)

_prepare()
_fonts = {w: TTFont(f"{FONTS}/SG-{w}.ttf") for w in (400, 700)}

def text_path(s, x, y, size, weight=700, fill="#fff", anchor="start",
              tracking=0.0, opacity=None):
    """One text run as a single <path>, positioned like SVG text would be."""
    font = _fonts[weight]
    upem = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    scale = size / upem

    advances, names = [], []
    for ch in s:
        name = cmap.get(ord(ch))
        if name is None:
            name = cmap.get(ord(" "))
        names.append(name)
        advances.append(font["hmtx"][name][0] * scale + tracking)

    total = sum(advances)
    ox = x - total if anchor == "end" else x - total / 2 if anchor == "middle" else x

    d, cursor = [], ox
    for name, adv in zip(names, advances):
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        cmds = pen.getCommands()
        if cmds:
            # glyph space is y-up; SVG is y-down, so flip while placing.
            d.append(f'<g transform="translate({cursor:.2f},{y:.2f}) '
                     f'scale({scale:.5f},{-scale:.5f})"><path d="{cmds}"/></g>')
        cursor += adv
    op = f' opacity="{opacity}"' if opacity else ""
    return f'<g fill="{fill}"{op}>{"".join(d)}</g>'

def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()

photo = b64(f"{IC}/photo400.png", "image/png")
deer = b64(f"{IC}/deerhead.svg.png", "image/png")

# The site paints a dot grid behind everything; it is most of why the background
# does not read as flat black.
dots = "".join(f'<circle cx="{x}" cy="{y}" r="1.6" fill="#3a3a3a"/>'
               for x in range(24, W, 40) for y in range(24, H, 40))

CX = 962
CARD_X, CARD_W, CARD_Y, CARD_H = 786, 352, 74, 482

body = [
    text_path("ON-SITE / REMOTE", 104, 144, 14, 700, INK, tracking=1.6),
    text_path("Brian Vargas", 64, 248, 72, 700, "#ffffff", tracking=-1.2),
    text_path("Java Backend Developer | Full Stack", 64, 298, 29, 700, AMBER),
    text_path("Spring Boot microservices, REST APIs and relational", 64, 360, 21, 400, MUTED),
    text_path("data — with CCST cybersecurity and Google Cloud", 64, 392, 21, 400, MUTED),
    text_path("alongside. Founder of K-Forge.", 64, 424, 21, 400, MUTED),
    text_path("View projects", 162, 500, 18, 700, "#1c1917", anchor="middle"),
    text_path("13rian-vargas.vercel.app", 286, 500, 19, 700, AMBER),
    text_path("ID CARD", CARD_X + CARD_W - 28, CARD_Y + 45, 15, 700, "#1c1917",
              anchor="end", tracking=1.4),
    text_path("Brian Vargas", CX, 452, 27, 700, "#ffffff", anchor="middle"),
    text_path("Java Backend Developer | Full Stack", CX, 482, 16, 700, AMBER, anchor="middle"),
    text_path("ID: 000-013", CX, 520, 14, 400, MUTED, anchor="middle", tracking=1.0),
]

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <clipPath id="photoClip"><circle cx="{CX}" cy="318" r="86"/></clipPath>
    <clipPath id="cardClip"><rect x="{CARD_X}" y="{CARD_Y}" width="{CARD_W}" height="{CARD_H}" rx="26"/></clipPath>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fcd34d" stop-opacity="0.10"/>
      <stop offset="60%" stop-color="#fcd34d" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="{W}" height="{H}" fill="{BG}"/>
  <g opacity="0.55">{dots}</g>
  <rect width="{W}" height="{H}" fill="url(#glow)"/>

  <rect x="64" y="118" width="228" height="40" rx="20" fill="#212121" stroke="#3f3f3f" stroke-width="1"/>
  <circle cx="88" cy="138" r="5" fill="#4ade80"/>

  <rect x="64" y="470" width="196" height="46" rx="23" fill="{AMBER}"/>

  <g clip-path="url(#cardClip)">
    <rect x="{CARD_X}" y="{CARD_Y}" width="{CARD_W}" height="{CARD_H}" fill="{CARD}"/>
    <rect x="{CARD_X}" y="{CARD_Y}" width="{CARD_W}" height="76" fill="{AMBER}"/>
  </g>
  <rect x="{CARD_X}" y="{CARD_Y}" width="{CARD_W}" height="{CARD_H}" rx="26" fill="none" stroke="#3f3f3f" stroke-width="1.5"/>

  <circle cx="{CARD_X+46}" cy="{CARD_Y+38}" r="22" fill="#fef3c7"/>
  <image href="{deer}" x="{CARD_X+28}" y="{CARD_Y+20}" width="36" height="36"/>

  <circle cx="{CX}" cy="318" r="90" fill="none" stroke="{AMBER}" stroke-width="3"/>
  <image href="{photo}" x="{CX-86}" y="232" width="172" height="172" clip-path="url(#photoClip)"/>

  <rect x="{CX-72}" y="500" width="144" height="30" rx="15" fill="#2a2a2a"/>

  {"".join(body)}
</svg>'''

out_svg = f"{BUILD}/og.svg"
open(out_svg, "w", encoding="utf-8").write(svg)
print(f"  svg: {len(svg)//1024} KB")

png = f"{BUILD}/og-render.png"
subprocess.run(["rsvg-convert", "-w", str(W), "-h", str(H), out_svg, "-o", png],
               check=True, capture_output=True)

from PIL import Image
im = Image.open(png).convert("RGB")
assert im.size == (W, H), f"render salio {im.size}"
im.save(os.path.join(ROOT, "public/og-cover.jpg"), "JPEG", quality=88, optimize=True, progressive=True)
print(f"  og-cover.jpg: {im.size}, {os.path.getsize(os.path.join(ROOT,'public/og-cover.jpg'))//1024} KB")
