import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { CheckList, SectionTitle } from "@/components/Prose";
import {
  allDistricts,
  prioritySubjects,
  type City,
  type District,
  type PrioritySubjectSlug,
  type Region,
  type Subject,
} from "@/data/catalog";
import { waMessage } from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  pageMetadata,
  serviceSchema,
  type Crumb,
} from "@/lib/seo";

/** تدوير ثابت لعناصر مشتركة حسب اسم الحي — يمنع تطابق الصفحات القصيرة. */
function rotate<T>(items: T[], seed: string, count: number): T[] {
  const offset =
    [...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % items.length;
  return Array.from({ length: Math.min(count, items.length) }, (_, i) => items[(offset + i) % items.length]);
}

/**
 * أعمق صفحة هبوط: /jeddah/murwah/qudrat
 * تُبنى فقط للأحياء المميّزة × المواد الأولوية الثلاث.
 * الزاوية الخاصة بالحي (subjectNotes) هي ما يميّزها عن نفس المادة في حي آخر.
 */
export default function DistrictSubjectPage({
  city,
  region,
  district,
  subject,
}: {
  city: City;
  region: Region;
  district: District;
  subject: Subject;
}) {
  const path = `/${city.slug}/${district.slug}/${subject.slug}`;
  const placeName = district.nameArFull;
  const heading = `${subject.h1Prefix} ${placeName}`;
  const message = waMessage(subject.h1Noun, placeName);
  const note = district.subjectNotes?.[subject.slug as PrioritySubjectSlug];

  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: city.nameAr, path: `/${city.slug}` },
    { name: region.nameAr, path: `/${city.slug}/${region.slug}` },
    { name: district.nameAr, path: `/${city.slug}/${district.slug}` },
    { name: subject.nameAr, path },
  ];

  /**
   * الأسئلة مشتقّة من الحي نفسه (الملاحظة الخاصة به وطبيعة الطلب فيه)
   * لا من نصوص المادة، وإلا تطابق قسم الأسئلة بين كل الأحياء.
   */
  const faqs = [
    {
      q: `هل لديكم معلمة ${subject.h1Noun} في ${placeName}؟`,
      a: `${note ?? subject.blurb} نرشّح أولًا معلمة قريبة من ${district.nameAr} أو من أحياء ${region.nameAr} المجاورة، ومع خيار الحصص أونلاين لا يتوقّف البدء على توفّر معلمة داخل الحي نفسه.`,
    },
    {
      q: `ما طبيعة الطلب على ${subject.nameAr} في ${district.nameAr}؟`,
      a: `${rotate(district.demand, subject.slug + "q", 1)[0]}. ولهذا نرشّح لكل أسرة معلمة تناسب هذا النمط تحديدًا بدل ترشيح عام يتجاهل طبيعة الحي.`,
    },
    {
      q: `متى نبدأ البرنامج في ${district.nameAr}؟`,
      a: `${
        rotate(district.demand, subject.slug + "t", 1)[0]
      }. والبدء المبكر يعطي مساحة لبرنامج متدرّج، أما من اقترب موعد اختباره فنضع له خطة مركّزة على الأهم في الوقت المتبقّي.`,
    },
    {
      q: `كيف نبدأ في ${district.nameAr}؟`,
      a: `راسلنا على واتساب وأخبرنا بالصف الدراسي والوقت المناسب، ونرشّح معلمة متميّزة في ${subject.nameAr} تخدم ${placeName}، ونتّفق معك على الجدول وخطة البرنامج قبل البدء.`,
    },
  ];

  const otherDistricts = allDistricts(city)
    .filter((d) => d.district.featured && d.district.slug !== district.slug)
    .slice(0, 9)
    .map(({ district: d }) => ({
      href: `/${city.slug}/${d.slug}/${subject.slug}`,
      label: `${subject.h1Prefix} ${d.nameArFull}`,
    }));

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(subject, placeName, path),
          localBusinessSchema(city, district),
          faqSchema(faqs, path),
          breadcrumbSchema(crumbs),
        ]}
      />

      <div className="mx-auto max-w-content px-4 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <section className="mx-auto max-w-content px-4 py-10">
        <p className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
          {region.nameAr} · {subject.stages}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
          {heading}
        </h1>
        {note && <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">{note}</p>}
        <ContactButtons message={message} size="lg" className="mt-8" />
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            لماذا {subject.nameAr} تحديدًا في {district.nameAr}
          </h2>
          <ul className="mt-5 space-y-3">
            {district.demand.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                <span className="leading-8 text-slate-600">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>ماذا تفعل المعلمة في الحصص</SectionTitle>
          <CheckList items={rotate(subject.teacherDoes, district.slug, 3)} />
          <p className="mt-4 text-sm text-slate-500">
            <a
              href={`/${city.slug}/${subject.slug}`}
              className="font-semibold text-brand-700 hover:underline"
            >
              اطّلع على تفاصيل برنامج {subject.nameAr} كاملًا في {city.nameAr} ←
            </a>
          </p>
        </section>

        <CtaBox
          title={`احجز ${subject.nameAr} في ${placeName}`}
          body={`أرسل لنا الصف الدراسي والوقت المناسب، ونرشّح لك معلمة متميّزة تخدم ${district.nameAr}.`}
          message={message}
        />

        <FaqSection faqs={faqs} title={`أسئلة شائعة — ${subject.nameAr} في ${district.nameAr}`} />

        <LinkGrid
          title={`برامج أخرى في ${district.nameAr}`}
          links={prioritySubjects()
            .filter((s) => s.slug !== subject.slug)
            .map((s) => ({
              href: `/${city.slug}/${district.slug}/${s.slug}`,
              label: `${s.h1Prefix} ${district.nameArFull}`,
              note: district.subjectNotes?.[s.slug as PrioritySubjectSlug]?.slice(0, 90),
            }))
            .concat([
              {
                href: `/${city.slug}/${district.slug}`,
                label: `كل الخدمات في ${district.nameArFull}`,
                note: undefined,
              },
            ])}
          columns={2}
        />

        <LinkGrid
          title={`${subject.nameAr} في أحياء أخرى`}
          links={otherDistricts}
        />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}

export function districtSubjectMetadata(
  city: City,
  region: Region,
  district: District,
  subject: Subject
) {
  return pageMetadata({
    title: `${subject.h1Prefix} ${district.nameArFull}`,
    description: `${subject.nameAr} في ${district.nameArFull} ضمن ${region.nameAr} — معلمون ومعلمات متميّزون، ${subject.stages}. حصص حضورية أو أونلاين. تواصل عبر واتساب لترشيح المعلمة المناسبة.`,
    path: `/${city.slug}/${district.slug}/${subject.slug}`,
  });
}
