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

# نشكّل النص بالشدّة وحدها ثم نضع الكسرة يدويًا تحت الراء.
# السبب: التشكيل التلقائي يدمج الشدّة والكسرة في الليجاتورة uniFC62 التي
# تكدّس الكسرة *فوق* الراء تحت الشدّة، فتُقرأ فتحة ويُقلب المعنى إلى
# اسم مفعول. الكسرة تحت الحرف هي الصيغة التي لا تلتبس.
TEXT_SHAPED = "مُدَرّسة خصوصية"   # بلا كسرة — تُضاف يدويًا
RAA_INDEX = 4                     # موضع الراء في TEXT_SHAPED
KASRA_CP = 0x0650
KASRA_SCALE = 1.25                # تكبير للوضوح في الأحجام الصغيرة
KASRA_GAP = 0.055                 # الفجوة تحت ذيل الراء، كسر من upem


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
buf.add_str(TEXT_SHAPED)
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
raa_box = None
cursor_x = 0
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    name = glyph_order[info.codepoint]
    dx, dy = cursor_x + pos.x_offset, pos.y_offset
    placements.append((name, dx, dy))
    if info.cluster == RAA_INDEX and pos.x_advance > 0:
        bp = BoundsPen(glyph_set)
        glyph_set[name].draw(TransformPen(bp, Transform(1, 0, 0, 1, dx, dy)))
        raa_box = bp.bounds
    cursor_x += pos.x_advance
total_advance = cursor_x

if raa_box is None:
    sys.exit("لم يُعثر على الراء في المخرَج — تحقّق من RAA_INDEX.")

# لو تسرّبت ليجاتورة الشدّة+الكسرة رغم إزالة الكسرة من الدخل، نتوقّف
# بدل إخراج لوجو تُقرأ حركته فتحة.
if any(n == "uniFC62" for n, _, _ in placements):
    sys.exit("ظهرت ليجاتورة uniFC62 (شدّة فوق كسرة) — الكسرة ستُقرأ فتحة.")

# الكسرة: تحت ذيل الراء، مركزة أفقيًا عليها، ومكبّرة قليلًا للوضوح
kasra_name = tt.getBestCmap().get(KASRA_CP)
if kasra_name is None:
    sys.exit("الخط لا يحوي جليف الكسرة U+0650.")

kb = BoundsPen(glyph_set)
glyph_set[kasra_name].draw(kb)
if kb.bounds is None:
    sys.exit("جليف الكسرة فارغ.")
k_x0, k_y0, k_x1, k_y1 = kb.bounds
k_cx, k_cy = (k_x0 + k_x1) / 2, (k_y0 + k_y1) / 2

raa_cx = (raa_box[0] + raa_box[2]) / 2
kasra_top = raa_box[1] - upem * KASRA_GAP          # أسفل ذيل الراء
kasra_transform = (
    Transform()
    .translate(raa_cx, kasra_top - (k_y1 - k_cy) * KASRA_SCALE)
    .scale(KASRA_SCALE)
    .translate(-k_cx, -k_cy)
)
placements.append((kasra_name, kasra_transform, None))

# حدود فعلية تشمل التشكيل فوق الحروف
def placement_transform(dx, dy):
    """الإزاحة العادية أو تحويل كامل (للكسرة الموضوعة يدويًا)."""
    return dx if isinstance(dx, Transform) else Transform(1, 0, 0, 1, dx, dy)


bounds = None
for name, dx, dy in placements:
    bp = BoundsPen(glyph_set)
    glyph_set[name].draw(TransformPen(bp, placement_transform(dx, dy)))
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
flip = Transform(1, 0, 0, -1, -x0, y1)
for name, dx, dy in placements:
    pen = SVGPathPen(glyph_set)
    glyph_set[name].draw(TransformPen(pen, flip.transform(placement_transform(dx, dy))))
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
