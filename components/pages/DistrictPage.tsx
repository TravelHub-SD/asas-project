import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { SectionTitle } from "@/components/Prose";
import {
  REGULAR_SUBJECTS,
  prioritySubjects,
  regionDistricts,
  type City,
  type District,
  type Region,
} from "@/data/catalog";
import { districtLinks, waMessage } from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  pageMetadata,
  type Crumb,
} from "@/lib/seo";

/** صفحة حي: /jeddah/murwah */
export default function DistrictPage({
  city,
  region,
  district,
}: {
  city: City;
  region: Region;
  district: District;
}) {
  const path = `/${city.slug}/${district.slug}`;
  const placeName = district.nameArFull;
  const message = waMessage(undefined, placeName);
  const siblings = regionDistricts(region)
    .filter((d) => d.slug !== district.slug)
    .slice(0, 6);

  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: city.nameAr, path: `/${city.slug}` },
    { name: region.nameAr, path: `/${city.slug}/${region.slug}` },
    { name: district.nameAr, path },
  ];

  /**
   * الأسئلة مبنية على طبيعة الطلب في الحي نفسه.
   * القوالب العامة التي يتغيّر فيها اسم الحي فقط تجعل صفحات الأحياء شبه مكرّرة.
   */
  const faqs = [
    {
      q: `هل تصل المعلمة إلى ${placeName}؟`,
      a: `نعم. ${district.demand[0]}، ولذلك نرشّح أولًا معلمة من داخل ${district.nameAr} أو من أحياء ${region.nameAr} الملاصقة له. قرب المسافة يعني حصصًا في موعدها والتزامًا أطول بالجدول، وإن لم تتوفّر معلمة قريبة في وقتك المفضّل نعرض عليك الحصص أونلاين.`,
    },
    {
      q: `ما الذي يطلبه سكان ${district.nameAr} أكثر من غيره؟`,
      a: `${district.demand[1] ?? district.demand[0]}. نغطّي إلى جانب ذلك المواد الأساسية كلها والتأسيس للمناهج الدولية وبرامج القدرات والتحصيلي، لكن ترشيحنا يبدأ دائمًا من النمط الغالب في الحي.`,
    },
    {
      q: `ما الأوقات المتاحة للحصص في ${district.nameAr}؟`,
      a: `${
        district.demand[2] ?? "أغلب الحصص بعد الدوام المدرسي وحتى المساء"
      }. أوقات نهاية الأسبوع متاحة أيضًا، والمواعيد المسائية هي الأسرع نفادًا فيفضّل تثبيتها مع بداية الفصل الدراسي.`,
    },
    {
      q: `كيف تبدأ أول حصة في ${district.nameAr}؟`,
      a: `بعد التواصل عبر واتساب وتحديد المادة والصف، نرشّح معلمة متميّزة مناسبة وتُحدَّد حصة أولى للتعارف وتقييم مستوى الطالب، ثم يُتّفق على جدول ثابت بناءً على نتيجة التقييم.`,
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
          مدرسة خصوصية في {placeName}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
          {district.demand[0]}. {district.demand[1] ?? ""} نغطّي {district.nameArFull} ضمن{" "}
          {region.nameAr} بمعلمين ومعلمات متميّزين، بحصص منزلية داخل الحي أو أونلاين.
        </p>
        <ContactButtons message={message} size="lg" className="mt-8" />
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        <section>
          <SectionTitle>طبيعة الطلب في {district.nameAr}</SectionTitle>
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

        {district.featured && (
          <section>
            <SectionTitle>البرامج الأكثر طلبًا في {district.nameAr}</SectionTitle>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {prioritySubjects().map((s) => (
                <a
                  key={s.slug}
                  href={`/${city.slug}/${district.slug}/${s.slug}`}
                  className="group rounded-2xl border border-accent-500/40 bg-accent-500/5 p-6 transition hover:border-accent-500"
                >
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800">
                    {s.h1Prefix} {district.nameArFull}
                  </h3>
                  <p className="mt-3 leading-8 text-slate-600">
                    {district.subjectNotes?.[s.slug as "international"] ?? s.blurb}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        <LinkGrid
          title={`المواد المتاحة لسكان ${placeName}`}
          description={`صفحات المواد أدناه تغطّي ${city.nameAr} كاملة، وتشمل الحصص المنزلية في ${district.nameAr}.`}
          links={REGULAR_SUBJECTS.map((s) => ({
            href: `/${city.slug}/${s.slug}`,
            label: `${s.h1Prefix} ${city.nameAr}`,
            note: s.blurb,
          }))}
        />

        <CtaBox
          title={`ابحث عن مدرسة خصوصية في ${placeName}`}
          body={`أرسل لنا الصف الدراسي والمادة والوقت المناسب، ونرشّح لك معلمة متميّزة قريبة من ${district.nameAr}.`}
          message={message}
        />

        <FaqSection faqs={faqs} title={`أسئلة شائعة عن الحصص في ${district.nameAr}`} />

        <LinkGrid
          title={`أحياء أخرى في ${region.nameAr}`}
          links={[
            ...districtLinks(city.slug, siblings),
            { href: `/${city.slug}/${region.slug}`, label: `كل أحياء ${region.nameAr}` },
          ]}
        />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}

export function districtMetadata(city: City, region: Region, district: District) {
  return pageMetadata({
    title: `مدرسة خصوصية في ${district.nameArFull} — ${city.nameAr}`,
    description: `معلمون ومعلمات متميّزون في ${district.nameArFull} ضمن ${region.nameAr} لجميع المواد والمراحل — حصص منزلية أو أونلاين، تأسيس للمناهج الدولية وبرامج القدرات والتحصيلي. تواصل عبر واتساب.`,
    path: `/${city.slug}/${district.slug}`,
  });
}
