/**
 * إعدادات البراند ومعلومات التواصل.
 * اسم البراند مبدئي (placeholder) — يُغيَّر من هنا فقط وينعكس على كل الموقع.
 */
export const BRAND = {
  nameAr: "مدرسة خصوصية",
  nameEn: "Private Tutor",
  tagline: "نخبة من المعلمين والمعلمات المتميّزين — تأسيس ومتابعة لجميع المراحل",
  phone: "0557930608",
  whatsapp: "966557930608",
} as const;

/**
 * الاسم يُطبع كما هو حرفيًا في كل مكان.
 *
 * ⚠️ لا تشتقّ حرفًا من الاسم لتضعه بجانبه (مثل badge بأول حرف):
 * ذلك ينتج «م مدرسة خصوصية» فيقرأها الزائر «ممدرسة» — وهو الخطأ الذي ظهر
 * سابقًا بصيغة «أأساس». علامة اللوجو رمز مستقل لا حرف من الاسم.
 */
export const BRAND_NAME = BRAND.nameAr;

/**
 * الدومين المستخدَم في canonical و og:url و sitemap.xml و robots.txt.
 *
 * ترتيب الأولوية:
 *   1. NEXT_PUBLIC_SITE_URL — الدومين النهائي بعد شرائه (يتجاوز كل ما بعده)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — دومين المشروع الإنتاجي على Vercel،
 *      ثابت عبر النشرات ولذلك يصلح لـ canonical
 *   3. VERCEL_URL — رابط النشرة الواحدة (احتياطي أخير)
 *   4. الاحتياطي المحلي للتطوير
 *
 * السبب في وجود 2 و3: النشر على Vercel قبل شراء الدومين كان سيجعل كل canonical
 * يشير إلى دومين غير موجود، وهو ما يمنع الفهرسة بدل أن يساعدها.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return "https://asas.sa";
}

export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");

export const OG_IMAGE = "/og.png";

/** رابط واتساب مع رسالة جاهزة تذكر المدينة والمادة. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${BRAND.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(): string {
  return `tel:+${BRAND.whatsapp}`;
}

/** الرقم بصيغة عرض مريحة للقراءة. */
export const PHONE_DISPLAY = "0557930608";
