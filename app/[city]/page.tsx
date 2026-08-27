import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { SectionTitle } from "@/components/Prose";
import {
  CITIES,
  CURRICULA,
  MODES,
  PRIORITY_SUBJECTS,
  REGULAR_SUBJECTS,
  SUBJECTS,
  getCity,
  publishedRegions,
  regionDistricts,
} from "@/data/catalog";
import { waMessage } from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  pageMetadata,
  type Crumb,
} from "@/lib/seo";

interface Params {
  params: { city: string };
}

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Params): Metadata {
  const city = getCity(params.city);
  if (!city) return {};
  return pageMetadata({
    title: `معلمة خصوصية في ${city.nameAr}`,
    description: `معلمون ومعلمات متميّزون في ${city.nameAr} لجميع المواد والمراحل — تأسيس ومتابعة للمناهج السعودية والبريطانية والأمريكية، وبرامج القدرات والتحصيلي والتخاطب وصعوبات التعلم. حصص منزلية أو أونلاين.`,
    path: `/${city.slug}`,
  });
}

export default function CityPage({ params }: Params) {
  const city = getCity(params.city);
  if (!city) notFound();

  const regions = publishedRegions(city);
  const message = waMessage(undefined, city.nameAr);
  const otherCities = CITIES.filter((c) => c.slug !== city.slug);

  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: city.nameAr, path: `/${city.slug}` },
  ];

  const faqs = [
    {
      q: `كيف أختار المعلمة المناسبة في ${city.nameAr}؟`,
      a: `أخبرنا عبر واتساب بالصف الدراسي والمادة والمنهج والحي والوقت المفضّل، فنرشّح لك معلمة متميّزة تطابق هذه التفاصيل. الحصة الأولى تعارف وتقييم مستوى، وإن لم تكن مناسبة نرشّح غيرها.`,
    },
    {
      q: `هل الحصص في ${city.nameAr} منزلية أم أونلاين؟`,
      a: `الاثنان متاحان. الحصص المنزلية تعتمد على قرب المعلمة من حيّكم، والحصص الأونلاين متاحة في كل أحياء ${city.nameAr} وتناسب المواد الحسابية وبرامج القدرات و STEP.`,
    },
    {
      q: `هل لديكم معلمات للمناهج العالمية في ${city.nameAr}؟`,
      a: city.slug === "jeddah"
        ? "نعم، وهو أقوى تخصّصاتنا في جدة نظرًا لتركّز المدارس العالمية شمال المدينة. المعلمة تعمل من كتاب مدرسة الطالب ومنصّتها مباشرة."
        : "نعم، لدينا في الرياض معلمات للمنهجين البريطاني والأمريكي، ونستقبل كثيرًا من الأسر العائدة من الخارج التي يحتاج أبناؤها فترة تأسيس بعد تغيير النظام التعليمي.",
    },
    {
      q: `متى تبدأ الحصص بعد التواصل؟`,
      a: `في الغالب خلال أيام قليلة، وأحيانًا في نفس الأسبوع إن كان الوقت المطلوب متاحًا لدى إحدى المعلمات. الأوقات المسائية هي الأكثر طلبًا، لذلك يفضّل الحجز مبكرًا في بداية الفصل الدراسي.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(city),
          faqSchema(faqs, `/${city.slug}`),
          breadcrumbSchema(crumbs),
        ]}
      />

      <div className="mx-auto max-w-content px-4 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <section className="mx-auto max-w-content px-4 py-10">
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
          معلمة خصوصية متميّزة في {city.nameAr}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">{city.intro}</p>
        <p className="mt-4 max-w-3xl leading-9 text-slate-600">{city.localNote}</p>
        <ContactButtons message={message} size="lg" className="mt-8" />
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        {/* البرامج المميّزة */}
        <section>
          <SectionTitle>برامج مميّزة في {city.nameAr}</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PRIORITY_SUBJECTS.map((s) => (
              <Link
                key={s.slug}
                href={`/${city.slug}/${s.slug}`}
                className="group rounded-2xl border border-accent-500/40 bg-accent-500/5 p-6 transition hover:border-accent-500"
              >
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800">
                  {s.h1Prefix} {city.nameAr}
                </h3>
                <p className="mt-3 leading-8 text-slate-600">{s.cityAngle[city.slug]}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* المواد */}
        <LinkGrid
          title={`المواد الدراسية في ${city.nameAr}`}
          description={`لكل مادة صفحة مستقلة توضّح طريقة العمل والمراحل التي تُغطّى في ${city.nameAr}.`}
          links={REGULAR_SUBJECTS.map((s) => ({
            href: `/${city.slug}/${s.slug}`,
            label: `${s.h1Prefix} ${city.nameAr}`,
            note: s.blurb,
          }))}
        />

        {/* المناطق والأحياء */}
        {regions.length > 0 && (
          <section>
            <SectionTitle>المناطق التي نغطّيها في {city.nameAr}</SectionTitle>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {regions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${city.slug}/${r.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300"
                >
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800">
                    {r.nameAr}
                  </h3>
                  <p className="mt-3 leading-8 text-slate-600">{r.intro}</p>
                  <p className="mt-4 text-sm text-brand-700">
                    {regionDistricts(r)
                      .filter((d) => d.featured)
                      .slice(0, 4)
                      .map((d) => d.nameAr)
                      .join(" · ")}
                    {r.districts.length > 4 ? ` وأكثر (${r.districts.length} حيًا)` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* كيف تتم الحصص */}
        <section>
          <SectionTitle>كيف تتم الحصص في {city.nameAr}</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {MODES.map((m) => (
              <div key={m.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900">{m.nameAr}</h3>
                <p className="mt-3 leading-8 text-slate-600">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* المناهج */}
        <section>
          <SectionTitle>المناهج</SectionTitle>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {CURRICULA.map((c) => (
              <div key={c.slug} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">{c.nameAr}</h3>
                <p className="mt-2 leading-8 text-slate-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* المدن الأخرى */}
        <LinkGrid
          title="مدن أخرى"
          links={otherCities.flatMap((c) => [
            { href: `/${c.slug}`, label: `معلمون ومعلمات في ${c.nameAr}` },
            ...SUBJECTS.filter((s) => s.priority).map((s) => ({
              href: `/${c.slug}/${s.slug}`,
              label: `${s.h1Prefix} ${c.nameAr}`,
            })),
          ])}
          columns={3}
        />

        <CtaBox
          title={`ابحث عن معلمة في ${city.nameAr}`}
          body={`أرسل لنا الصف الدراسي والمادة والحي والوقت المناسب، ونرشّح لك معلمة مناسبة في ${city.nameAr} في أسرع وقت.`}
          message={message}
        />

        <FaqSection faqs={faqs} title={`أسئلة شائعة عن الحصص في ${city.nameAr}`} />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}
