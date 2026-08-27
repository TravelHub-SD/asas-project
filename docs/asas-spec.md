# أساس (Asas) — Private Tutoring Network — Build Spec

> ملاحظة لبابلو: احفظ الملف ده باسم `spec.md` جوه فولدر فاضي، افتح Claude Code فيه،
> وقول له: **"اقرأ spec.md ونفّذ Phase 1 بالكامل."**
> اسم البراند ورقم الواتساب متحطوطين كـ config → نغيّرهم في مكان واحد بس.

---

## 1. Goal

SEO-first marketing site for a private tutoring network in Saudi Arabia (Jeddah + Riyadh).
Model closely on **mydoroosi.com**: many programmatic landing pages (city × subject × district),
each targeting **one** Arabic search phrase, each funneling the visitor to **WhatsApp / phone**.

- No online booking. No prices. No login.
- Flow: visitor lands → clicks WhatsApp or Call. That's it.

## 2. Brand & contact (make these config constants — one place to edit)

```ts
export const BRAND = {
  nameAr: "أساس",
  nameEn: "Asas",
  tagline: "معلمون ومعلمات خبرة — تأسيس ومتابعة لجميع المراحل",
  phone: "0557930608",
  whatsapp: "966557930608", // wa.me/966557930608
};
```

- Tone: trustworthy, warm, professional, Saudi-friendly register.
- On-site phrasing is **neutral**: "معلمون ومعلمات خبرة". Do NOT put "مدرسة سودانية" on the site
  (that angle is for social media / community groups only).
- Positioning angle: **strong foundation (تأسيس قوي)**, especially international-curriculum students.

## 3. Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- RTL, `<html lang="ar" dir="rtl">`, Arabic-first
- **Static generation** (`generateStaticParams`) for every landing page
- Deploy target: **Vercel**
- `next/image`, minimal client JS, mobile-first (most KSA traffic is mobile)

## 4. Data model — single source of truth (`/data/catalog.ts`)

Everything generates from this file.

**Cities**
- `jeddah` — جدة (region: مكة المكرمة) — districts: `hamdaniyah` الحمدانية, `murwah` المروة, `north` شمال جدة (add more later)
- `riyadh` — الرياض (region: الرياض) — districts: `north` شمال الرياض, `east` شرق الرياض, `west` غرب الرياض, `south` جنوب الرياض

**Subjects** (slug — Arabic name)
- `english` — الإنجليزية
- `math` — الرياضيات
- `arabic` — لغتي (لغة عربية)
- `science` — العلوم
- `physics` — الفيزياء
- `chemistry` — الكيمياء
- `qudrat` — القدرات
- `tahsili` — التحصيلي
- `step` — STEP

**Special programs** (priority — these are her differentiators)
- `international` — التأسيس للمناهج البريطانية والأمريكية
- `special-needs` — التخاطب وصعوبات التعلم

**Curricula:** american, british, saudi, foundation-year (سنة تحضيرية)
**Modes:** home (منزلي), online (أونلاين), teacher-place (بيت المعلمة)

Each subject entry MUST include:
- `slug`, `nameAr`
- a **unique intro paragraph** (different wording per subject)
- a list of **"what the teacher does"** bullets, **varied per subject** (NOT copy-pasted)

> ⚠️ Content variety is critical. Near-duplicate pages get penalized by Google.
> Every page's body text must genuinely read differently.

## 5. URL / page structure

- `/` — home
- `/[city]` — city hub (جدة / الرياض): lists subjects + districts, links out
- `/[city]/[district]` — district hub
- `/[city]/[subject]` — e.g. `/jeddah/english` → H1: "معلمة لغة إنجليزية خصوصية في جدة"
- `/[city]/[district]/[subject]` — deepest long-tail (Phase 2)
- `/jeddah/international`, `/riyadh/international` — international foundation (PRIORITY pages)
- `/jeddah/special-needs`, `/riyadh/special-needs` — speech & learning difficulties
- `/contact`

## 6. Per-page SEO requirements (EVERY landing page)

- Unique `<h1>` containing the exact target phrase: **"معلمة [subject] خصوصية في [city/district]"**
- Unique `<title>` + meta description (templated, filled with the specific city + subject)
- Canonical URL
- Open Graph + Twitter tags, one branded OG image
- **JSON-LD schema**: `EducationalOrganization` (or `LocalBusiness`) + `FAQPage`
- Visible **FAQ** section (3–4 Q&A, varied per page)
- Prominent **WhatsApp button** — `wa.me` deep link with a **prefilled message** naming the city+subject,
  e.g. `https://wa.me/966557930608?text=السلام عليكم، أبحث عن معلمة إنجليزي في جدة`
- `tel:` call link
- **Internal links**: each page links to sibling subjects in the same city + the same subject in other cities/districts (this link mesh is ranking fuel)
- Breadcrumbs

## 7. Site-wide

- `/sitemap.xml` auto-generated from the catalog
- `/robots.txt` (allow all, point to sitemap)
- Sticky WhatsApp + Call bar at bottom on mobile (like the reference sites)
- Header with a city switcher
- Fast static pages, minimal JS

## 8. Homepage sections (mirror mydoroosi + her flyers)

1. **Hero** — headline + WhatsApp/Call CTA
2. **لماذا نحن** — from her flyers: تأسيس بخطوات واضحة · شرح مبسط · متابعة دورية وتقارير · تطوير المهارات والثقة
3. **اختر مدينتك** — جدة / الرياض
4. **اختر المادة** — grid of all subjects
5. **كيف تتم الحصص** — منزلي / أونلاين / بيت المعلمة
6. **المناهج** — أمريكي / بريطاني / سعودي / سنة تحضيرية (highlight international)
7. **التخاطب وصعوبات التعلم** — dedicated highlight (differentiator)
8. **صفحات شائعة** — internal links to top city×subject pages
9. CTA + FAQ + footer

## 9. Content rules

- All copy in Arabic, clean professional register.
- **Do NOT keyword-stuff** and do NOT repeat the phone number dozens of times
  (that's the old content-farm style — Google penalizes it now).
- Vary body text per page.

## 10. Phase 1 (ship this first)

- Jeddah **fully**: city hub + its districts + all subjects + international + special-needs
- Riyadh: city hub + all subjects (districts can come in Phase 2)
- Deploy to Vercel
- Then (manual, see below) submit sitemap to Google Search Console

## 11. After launch — Pablo's manual checklist (not code)

1. Buy a domain, deploy to Vercel, connect the domain.
2. **Google Search Console**: verify the site + submit `sitemap.xml`. (Ranking won't start till Google crawls it.)
3. **Google Business Profile** (خرائط قوقل) — huge for local "قريب مني" searches — do this once there's an address to list.
4. Later: a simple blog for extra long-tail keywords.
