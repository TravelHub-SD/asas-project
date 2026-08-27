/**
 * إعدادات البراند ومعلومات التواصل.
 * اسم البراند مبدئي (placeholder) — يُغيَّر من هنا فقط وينعكس على كل الموقع.
 */
export const BRAND = {
  nameAr: "أساس",
  nameEn: "Asas",
  tagline: "معلمون ومعلمات خبرة — تأسيس ومتابعة لجميع المراحل",
  phone: "0557930608",
  whatsapp: "966557930608",
} as const;

/** الدومين النهائي معلّق على اعتماد العميلة — يُحدَّث من هنا أو عبر متغيّر البيئة. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://asas.sa"
).replace(/\/$/, "");

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
