#!/usr/bin/env python3
"""
يحوّل اسم البراند إلى مسارات SVG (outlines) بدل نص حي.

السبب: التشكيل العربي (شدة + كسرة على الراء) يتداخل أو يُزاح في بعض خطوط
الأنظمة، خصوصًا على أندرويد. تحويل الاسم إلى مسارات يجعله يظهر متطابقًا
على كل جهاز ومتصفح دون الاعتماد على خط مثبّت.

التشغيل:  npm run build && npm run wordmark
المخرجات: components/BrandWordmark.tsx
"""
import os
import re
import sys
import tempfile

import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

ROOT = os.getcwd()
MEDIA = os.path.join(ROOT, ".next", "static", "media")
CSS_DIR = os.path.join(ROOT, ".next", "static", "css")
OUT = os.path.join(ROOT, "components", "BrandWordmark.tsx")

TEXT = "مُدَرِّسة خصوصية"
WEIGHT = 800


def arabic_font_path(weight: int) -> str:
    """يستخرج ملف Tajawal العربي بالوزن المطلوب من مخرجات next/font."""
    if not os.path.isdir(CSS_DIR):
        sys.exit("لم يُعثر على مخرجات البناء. شغّل `npm run build` أولًا.")
    css = "\n".join(
        open(os.path.join(CSS_DIR, f), encoding="utf-8").read()
        for f in os.listdir(CSS_DIR)
        if f.endswith(".css")
    )
    for block in css.split("@font-face"):
        if "Tajawal" not in block or "u+06??" not in block:
            continue
        w = re.search(r"font-weight:\s*(\d+)", block)
        f = re.search(r"media/([^)\"']+\.woff2)", block)
        if w and f and int(w.group(1)) == weight:
            return os.path.join(MEDIA, f.group(1))
    sys.exit(f"لم يُعثر على خط Tajawal العربي بوزن {weight}.")


woff2_path = arabic_font_path(WEIGHT)

# HarfBuzz لا يقرأ WOFF2، فنفكّ الضغط إلى TTF مؤقّت قبل التشكيل.
# بدون هذه الخطوة يُرجع كل حرف .notdef فتخرج مربّعات فارغة.
tmp_dir = tempfile.mkdtemp(prefix="wordmark-")
path = os.path.join(tmp_dir, "font.ttf")
_f = TTFont(woff2_path)
_f.flavor = None
_f.save(path)
_f.close()

blob = hb.Blob.from_file_path(path)
face = hb.Face(blob)
font = hb.Font(face)
upem = face.upem

buf = hb.Buffer()
buf.add_str(TEXT)
buf.direction = "rtl"
buf.script = "arab"
buf.language = "ar"
hb.shape(font, buf)

tt = TTFont(path)
glyph_set = tt.getGlyphSet()
glyph_order = tt.getGlyphOrder()

# ترتيب hb يعطي أول عنصر في اتجاه القراءة؛ نضع المؤشّر ونتقدّم بالـ advance
if all(info.codepoint == 0 for info in buf.glyph_infos):
    sys.exit("كل الأحرف رجعت .notdef — الخط لم يُقرأ بشكل صحيح.")

placements = []
cursor_x = 0
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    name = glyph_order[info.codepoint]
    placements.append((name, cursor_x + pos.x_offset, pos.y_offset))
    cursor_x += pos.x_advance
total_advance = cursor_x

# حدود فعلية تشمل التشكيل فوق الحروف
bounds = None
for name, dx, dy in placements:
    bp = BoundsPen(glyph_set)
    glyph_set[name].draw(TransformPen(bp, Transform(1, 0, 0, 1, dx, dy)))
    if bp.bounds is None:
        continue
    bounds = bp.bounds if bounds is None else (
        min(bounds[0], bp.bounds[0]), min(bounds[1], bp.bounds[1]),
        max(bounds[2], bp.bounds[2]), max(bounds[3], bp.bounds[3]),
    )
if bounds is None:
    sys.exit("لم تُرسم أي مسارات — تحقّق من الخط.")

pad = upem * 0.04
x0, y0, x1, y1 = bounds[0] - pad, bounds[1] - pad, bounds[2] + pad, bounds[3] + pad
w, h = x1 - x0, y1 - y0

# y في SVG لأسفل، وفي الخط لأعلى → نقلب المحور
paths = []
for name, dx, dy in placements:
    pen = SVGPathPen(glyph_set)
    glyph_set[name].draw(TransformPen(pen, Transform(1, 0, 0, -1, dx - x0, y1 - dy)))
    d = pen.getCommands()
    if d:
        paths.append(d)

merged = " ".join(paths)
ratio = round(w / h, 4)

tsx = f'''/**
 * اسم البراند كمسارات SVG لا كنص.
 *
 * ⚠️ مُولَّد آليًا — لا يُحرَّر يدويًا.
 *    المصدر: scripts/generate-wordmark.py  ·  إعادة التوليد: npm run wordmark
 *
 * السبب: «مُدَرِّسة» تحمل شدّة وكسرة على الراء، والتشكيل العربي يتداخل أو
 * يُزاح في بعض خطوط الأنظمة (خصوصًا أندرويد). المسارات تظهر متطابقة على كل
 * جهاز ولا تعتمد على خط مثبّت. النص المقروء يبقى متاحًا لقارئات الشاشة
 * ولمحرّكات البحث عبر role="img" و aria-label.
 *
 * النسبة: العرض ÷ الارتفاع = {ratio}
 */
const NAME = "{TEXT}";

export default function BrandWordmark({{
  className = "h-5",
}}: {{
  className?: string;
}}) {{
  return (
    <svg
      viewBox="0 0 {w:.0f} {h:.0f}"
      role="img"
      aria-label={{NAME}}
      className={{className}}
      style={{{{ width: "auto" }}}}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{{NAME}}</title>
      <path d="{merged}" />
    </svg>
  );
}}
'''

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(tsx)
names = ", ".join(n for n, _, _ in placements)
print(f"✓ components/BrandWordmark.tsx — {len(placements)} glyph، النسبة {ratio}")
print(f"  الجليفات: {names}")
