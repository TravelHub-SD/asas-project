import type { City, District, Faq, Subject } from "@/data/catalog";
import { CITIES, SUBJECTS, getSubject, publishedDistricts } from "@/data/catalog";

/** رسالة واتساب جاهزة تذكر المادة والمكان — تصل الرسالة معبّأة قبل أن يكتب الزائر شيئًا. */
export function waMessage(subjectName?: string, placeName?: string): string {
  if (subjectName && placeName) {
    return `السلام عليكم، أبحث عن معلمة ${subjectName} في ${placeName}`;
  }
  if (placeName) {
    return `السلام عليكم، أبحث عن معلمة خصوصية في ${placeName}`;
  }
  return "السلام عليكم، أرغب في الاستفسار عن الحصص";
}

/**
 * أسئلة شائعة خاصة بكل صفحة: سؤال محلي فريد + أسئلة المادة.
 * الهدف أن يختلف قسم الأسئلة بين /jeddah/english و /riyadh/english فعليًا.
 */
export function pageFaqs(
  subject: Subject,
  city: City,
  district?: District
): Faq[] {
  const place = district ? district.nameArFull : city.nameAr;
  const local: Faq = district
    ? {
        q: `هل لديكم معلمة ${subject.h1Noun} تسكن قريبًا من ${district.nameArFull}؟`,
        a: `نرشّح أولًا معلمة من داخل ${district.nameArFull} أو من الأحياء المجاورة مثل ${district.nearby
          .slice(0, 2)
          .join(" و")}، لأن قرب المسافة يعني مواعيد أثبت وحصصًا لا تتأخر. إن لم تتوفّر معلمة قريبة في وقتك المفضّل نعرض عليك خيار الحصص أونلاين بدل الانتظار.`,
      }
    : {
        q: `في أي أحياء ${city.nameAr} تتوفّر حصص ${subject.nameAr}؟`,
        a: `نغطّي ${publishedDistricts(city).length > 0 ? publishedDistricts(city).map((d) => d.nameAr).join(" و") + " " : ""}وأحياء أخرى في ${city.nameAr} بحصص منزلية حسب موقع المعلمة المتاحة، والحصص الأونلاين متاحة في كل الأحياء دون استثناء. أرسل لنا موقعك التقريبي والوقت المناسب لك لنرشّح المتاح.`,
      };

  const scheduling: Faq = {
    q: `كيف نبدأ الحصص في ${place}؟`,
    a: `تواصل معنا عبر واتساب وأخبرنا بالصف الدراسي والمنهج والوقت المناسب، فنرشّح لك معلمة مناسبة خلال وقت قصير. تُحدَّد الحصة الأولى للتعارف وتقييم المستوى، وبعدها يُتّفق على جدول ثابت.`,
  };

  // تدوير أسئلة المادة حسب المدينة حتى لا يتطابق قسم الأسئلة بين صفحتي نفس المادة
  const offset = CITIES.findIndex((c) => c.slug === city.slug);
  const rotated = subject.faqs
    .slice(offset * 2)
    .concat(subject.faqs.slice(0, offset * 2))
    .slice(0, 2);

  return [local, ...rotated, scheduling];
}

export interface LinkItem {
  href: string;
  label: string;
  note?: string;
}

/** المواد الشقيقة داخل نفس المدينة — وقود الربط الداخلي. */
export function siblingSubjectLinks(
  city: City,
  currentSlug: string
): LinkItem[] {
  return SUBJECTS.filter((s) => s.slug !== currentSlug).map((s) => ({
    href: `/${city.slug}/${s.slug}`,
    label: `${s.h1Prefix} ${city.nameAr}`,
    note: s.blurb,
  }));
}

/** نفس المادة في المدن الأخرى. */
export function sameSubjectOtherCities(
  subject: Subject,
  currentCity: string
): LinkItem[] {
  return CITIES.filter((c) => c.slug !== currentCity).map((c) => ({
    href: `/${c.slug}/${subject.slug}`,
    label: `${subject.h1Prefix} ${c.nameAr}`,
  }));
}

/** نفس المادة في أحياء المدينة المنشورة. */
export function sameSubjectDistricts(
  subject: Subject,
  city: City,
  excludeDistrict?: string
): LinkItem[] {
  return publishedDistricts(city)
    .filter((d) => d.slug !== excludeDistrict)
    .map((d) => ({
      href: `/${city.slug}/${d.slug}`,
      label: `${subject.nameAr} في ${d.nameArFull}`,
    }));
}

/** المواد ذات الصلة المعرّفة يدويًا في الكتالوج. */
export function relatedSubjectLinks(
  subject: Subject,
  city: City
): LinkItem[] {
  return subject.related
    .map((slug) => getSubject(slug))
    .filter((s): s is Subject => Boolean(s))
    .map((s) => ({
      href: `/${city.slug}/${s.slug}`,
      label: `${s.h1Prefix} ${city.nameAr}`,
      note: s.blurb,
    }));
}

/** أهم الصفحات للربط من الصفحة الرئيسية. */
export function popularPages(): LinkItem[] {
  const picks: Array<[string, string]> = [
    ["jeddah", "international"],
    ["jeddah", "english"],
    ["jeddah", "math"],
    ["jeddah", "special-needs"],
    ["riyadh", "international"],
    ["riyadh", "english"],
    ["riyadh", "qudrat"],
    ["riyadh", "tahsili"],
  ];
  return picks
    .map(([citySlug, subjectSlug]) => {
      const city = CITIES.find((c) => c.slug === citySlug);
      const subject = getSubject(subjectSlug);
      if (!city || !subject) return null;
      return {
        href: `/${city.slug}/${subject.slug}`,
        label: `${subject.h1Prefix} ${city.nameAr}`,
      };
    })
    .filter((l): l is LinkItem => Boolean(l));
}
