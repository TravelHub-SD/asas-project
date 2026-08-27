import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { SectionTitle } from "@/components/Prose";
import {
  PRIORITY_SUBJECTS,
  REGULAR_SUBJECTS,
  publishedDistricts,
  type City,
  type District,
} from "@/data/catalog";
import { waMessage } from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  pageMetadata,
  type Crumb,
} from "@/lib/seo";

/** صفحة حي: /jeddah/hamdaniyah */
export default function DistrictPage({
  city,
  district,
}: {
  city: City;
  district: District;
}) {
  const path = `/${city.slug}/${district.slug}`;
  const placeName = district.nameArFull;
  const message = waMessage(undefined, placeName);
  const otherDistricts = publishedDistricts(city).filter((d) => d.slug !== district.slug);

  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: city.nameAr, path: `/${city.slug}` },
    { name: district.nameAr, path },
  ];

  const faqs = [
    {
      q: `هل تصل المعلمة إلى ${placeName}؟`,
      a: `نعم، لدينا معلمات يسكنّ داخل ${district.nameAr} أو قريبًا منه في ${district.nearby
        .slice(0, 2)
        .join(" و")}. قرب المسافة مهم لأنه يعني حصصًا في موعدها والتزامًا أطول بالجدول. وإن لم تتوفّر معلمة قريبة في الوقت الذي تريده، نعرض عليك الحصص أونلاين.`,
    },
    {
      q: `ما المواد المتاحة في ${placeName}؟`,
      a: `نغطّي المواد الأساسية كلها — الإنجليزية والرياضيات ولغتي والعلوم والفيزياء والكيمياء — إضافة إلى برامج القدرات والتحصيلي و STEP، وبرنامجي التأسيس الدولي والتخاطب وصعوبات التعلم.`,
    },
    {
      q: `ما الأوقات المتاحة للحصص في ${district.nameAr}؟`,
      a: `أغلب الحصص تكون بعد الدوام المدرسي وحتى المساء، وأوقات نهاية الأسبوع متاحة أيضًا. الأوقات المسائية هي الأكثر طلبًا، لذلك يفضّل الحجز مبكرًا في بداية الفصل الدراسي.`,
    },
    {
      q: `كيف تبدأ أول حصة؟`,
      a: `بعد التواصل عبر واتساب وتحديد المادة والصف، نرشّح معلمة مناسبة وتُحدَّد حصة أولى للتعارف وتقييم مستوى الطالب، ثم يُتّفق على جدول ثابت بناءً على نتيجة التقييم.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(city, district),
          faqSchema(faqs, path),
          breadcrumbSchema(crumbs),
        ]}
      />

      <div className="mx-auto max-w-content px-4 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <section className="mx-auto max-w-content px-4 py-10">
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
          معلمون ومعلمات خصوصيون في {placeName}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">{district.intro}</p>
        <p className="mt-4 text-sm text-slate-500">
          ونغطّي أيضًا الأحياء المجاورة: {district.nearby.join(" · ")}
        </p>
        <ContactButtons message={message} size="lg" className="mt-8" />
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        <section>
          <SectionTitle>برامج مميّزة</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PRIORITY_SUBJECTS.map((s) => (
              <div
                key={s.slug}
                className="rounded-2xl border border-accent-500/40 bg-accent-500/5 p-6"
              >
                <h3 className="text-xl font-bold text-slate-900">{s.nameAr}</h3>
                <p className="mt-3 leading-8 text-slate-600">{s.blurb}</p>
                <a
                  href={`/${city.slug}/${s.slug}`}
                  className="mt-4 inline-block font-bold text-brand-700 hover:underline"
                >
                  {s.h1Prefix} {city.nameAr} ←
                </a>
              </div>
            ))}
          </div>
        </section>

        <LinkGrid
          title={`المواد المتاحة لسكان ${placeName}`}
          description={`صفحات المواد أدناه تغطّي ${city.nameAr} كاملة، وتشمل الحصص المنزلية في ${district.nameAr}.`}
          links={REGULAR_SUBJECTS.map((s) => ({
            href: `/${city.slug}/${s.slug}`,
            label: `${s.h1Prefix} ${city.nameAr}`,
            note: s.blurb,
          }))}
        />

        <section>
          <SectionTitle>طبيعة الطلب في {district.nameAr}</SectionTitle>
          <p className="mt-4 max-w-3xl leading-9 text-slate-600">
            لكل حي إيقاعه: نوع المدارس فيه، وأوقات الحصص التي تناسب أهله، والمواد التي يكثر
            السؤال عنها. هذا ما نلاحظه في {district.nameArFull} تحديدًا.
          </p>
          <ul className="mt-6 space-y-3">
            {district.demand.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                <span className="leading-8 text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <CtaBox
          title={`ابحث عن معلمة في ${placeName}`}
          body={`أرسل لنا الصف الدراسي والمادة والوقت المناسب، ونرشّح لك معلمة قريبة من ${district.nameAr}.`}
          message={message}
        />

        <FaqSection faqs={faqs} title={`أسئلة شائعة عن الحصص في ${district.nameAr}`} />

        <LinkGrid
          title={`أحياء أخرى في ${city.nameAr}`}
          links={[
            ...otherDistricts.map((d) => ({
              href: `/${city.slug}/${d.slug}`,
              label: `معلمون ومعلمات في ${d.nameArFull}`,
            })),
            { href: `/${city.slug}`, label: `كل خدماتنا في ${city.nameAr}` },
          ]}
          columns={3}
        />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}

export function districtMetadata(city: City, district: District) {
  return pageMetadata({
    title: `معلمون ومعلمات خصوصيون في ${district.nameArFull} — ${city.nameAr}`,
    description: `معلمون ومعلمات خبرة في ${district.nameArFull} بـ${city.nameAr} لجميع المواد والمراحل — حصص منزلية أو أونلاين، تأسيس ومتابعة، وبرامج التأسيس الدولي والتخاطب وصعوبات التعلم. تواصل عبر واتساب.`,
    path: `/${city.slug}/${district.slug}`,
  });
}
