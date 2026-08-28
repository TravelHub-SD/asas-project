import type { City, District, Faq, Subject } from "@/data/catalog";
import { isPrioritySlug } from "@/data/catalog";
import {
  CITIES,
  SUBJECTS,
  allDistricts,
  getSubject,
  publishedRegions,
} from "@/data/catalog";

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
        a: `نرشّح أولًا معلمة من داخل ${district.nameArFull} أو من الأحياء المجاورة له، لأن قرب المسافة يعني مواعيد أثبت وحصصًا لا تتأخر. إن لم تتوفّر معلمة قريبة في وقتك المفضّل نعرض عليك خيار الحصص أونلاين بدل الانتظار.`,
      }
    : {
        q: `في أي أحياء ${city.nameAr} تتوفّر حصص ${subject.nameAr}؟`,
        a: `نغطّي ${publishedRegions(city).map((r) => r.nameAr).join(" و")} بحصص حضورية حسب موقع المعلمة المتاحة، والحصص الأونلاين متاحة في كل الأحياء دون استثناء. أرسل لنا موقعك التقريبي والوقت المناسب لك لنرشّح المتاح.`,
      };

  const scheduling: Faq = {
    q: `كيف نبدأ الحصص في ${place}؟`,
    a: `تواصل معنا عبر واتساب وأخبرنا بالصف الدراسي والمنهج والوقت المناسب، فنرشّح لك معلمة مناسبة خلال وقت قصير، ويُتّفق على جدول ثابت وعدد الحصص الأسبوعية قبل البدء.`,
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
  /** يُبرز المواد الأولوية بصريًا عن باقي الروابط */
  emphasis?: boolean;
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
    emphasis: Boolean(s.priority),
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

/**
 * نفس المادة في أحياء المدينة.
 * المواد الأولوية لها صفحات (حيّ × مادة) في الأحياء المميّزة، وغيرها يربط بصفحة الحي.
 */
export function sameSubjectDistricts(
  subject: Subject,
  city: City,
  excludeDistrict?: string
): LinkItem[] {
  const priority = isPrioritySlug(subject.slug);
  return allDistricts(city)
    .filter(({ district }) => district.slug !== excludeDistrict)
    .filter(({ district }) => (priority ? district.featured : true))
    .slice(0, priority ? 12 : 8)
    .map(({ district }) => ({
      href: priority
        ? `/${city.slug}/${district.slug}/${subject.slug}`
        : `/${city.slug}/${district.slug}`,
      label: priority
        ? `${subject.h1Prefix} ${district.nameArFull}`
        : `${subject.nameAr} في ${district.nameArFull}`,
    }));
}

/** المناطق داخل المدينة. */
export function regionLinks(city: City): LinkItem[] {
  return publishedRegions(city).map((r) => ({
    href: `/${city.slug}/${r.slug}`,
    label: `معلمون ومعلمات في ${r.nameAr}`,
  }));
}

/** أحياء منطقة، مع ملاحظة الطلب الأولى لكل حي. */
export function districtLinks(citySlug: string, districts: District[]): LinkItem[] {
  return districts.map((d) => ({
    href: `/${citySlug}/${d.slug}`,
    label: `معلمة خصوصية في ${d.nameArFull}`,
    note: d.demand[0],
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
      emphasis: Boolean(s.priority),
    }));
}

/** أهم الصفحات للربط من الصفحة الرئيسية. */
export function popularPages(): LinkItem[] {
  const picks: Array<[string, string]> = [
    ["jeddah", "international"],
    ["jeddah", "qudrat"],
    ["jeddah", "tahsili"],
    ["jeddah", "english"],
    ["riyadh", "international"],
    ["riyadh", "qudrat"],
    ["riyadh", "tahsili"],
    ["riyadh", "math"],
  ];
  return picks
    .map(([citySlug, subjectSlug]): LinkItem | null => {
      const city = CITIES.find((c) => c.slug === citySlug);
      const subject = getSubject(subjectSlug);
      if (!city || !subject) return null;
      return {
        href: `/${city.slug}/${subject.slug}`,
        label: `${subject.h1Prefix} ${city.nameAr}`,
        emphasis: Boolean(subject.priority),
      };
    })
    .filter((l): l is LinkItem => l !== null);
}
