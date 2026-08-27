import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { CheckList, SectionTitle } from "@/components/Prose";
import type { City, Subject } from "@/data/catalog";
import {
  pageFaqs,
  relatedSubjectLinks,
  sameSubjectDistricts,
  sameSubjectOtherCities,
  siblingSubjectLinks,
  waMessage,
} from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  serviceSchema,
  subjectHeading,
  type Crumb,
} from "@/lib/seo";

/** صفحة مادة داخل مدينة: /jeddah/english — الصفحة التي تستهدف عبارة بحث واحدة. */
export default function SubjectPage({
  city,
  subject,
}: {
  city: City;
  subject: Subject;
}) {
  const path = `/${city.slug}/${subject.slug}`;
  const placeName = city.nameAr;
  const heading = subjectHeading(subject, placeName);
  const message = waMessage(subject.h1Noun, placeName);
  const faqs = pageFaqs(subject, city);

  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: city.nameAr, path: `/${city.slug}` },
    { name: subject.nameAr, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(subject, placeName, path),
          localBusinessSchema(city),
          faqSchema(faqs, path),
          breadcrumbSchema(crumbs),
        ]}
      />

      <div className="mx-auto max-w-content px-4 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <section className="mx-auto max-w-content px-4 py-10">
        <p className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
          {subject.stages}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
          {heading}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">{subject.intro}</p>
        <ContactButtons message={message} size="lg" className="mt-8" />
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        {/* الزاوية المحلية — تختلف بين مدينة وأخرى */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            {subject.nameAr} في {placeName}
          </h2>
          <p className="mt-4 leading-9 text-slate-600">{subject.cityAngle[city.slug]}</p>
          <ul className="mt-5 space-y-3">
            {subject.cityFocus[city.slug].map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                <span className="leading-8 text-slate-600">{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 leading-9 text-slate-600">{city.localNote}</p>
        </section>

        <section>
          <SectionTitle>ماذا تفعل المعلمة في الحصص</SectionTitle>
          <CheckList items={subject.teacherDoes} />
        </section>

        <section>
          <SectionTitle>ما الذي يتغيّر عند الطالب</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {subject.outcomes.map((o) => (
              <div key={o} className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
                <p className="leading-8 text-brand-900">{o}</p>
              </div>
            ))}
          </div>
        </section>

        <CtaBox
          title={`احجز حصة ${subject.nameAr} في ${placeName}`}
          body={`أرسل لنا الصف الدراسي والمنهج والحي والوقت المناسب، ونرشّح لك معلمة ${subject.h1Noun} مناسبة في ${placeName}.`}
          message={message}
        />

        <FaqSection faqs={faqs} title={`أسئلة شائعة عن ${subject.nameAr} في ${placeName}`} />

        {/* الربط الداخلي */}
        <LinkGrid
          title="مواد ذات صلة"
          description={`قد يحتاج الطالب إلى دعم في مواد مرتبطة بـ${subject.nameAr}.`}
          links={relatedSubjectLinks(subject, city)}
        />

        <LinkGrid
          title={`${subject.nameAr} في أحياء ${city.nameAr}`}
          links={sameSubjectDistricts(subject, city)}
          columns={3}
        />

        <LinkGrid
          title={`${subject.nameAr} في مدن أخرى`}
          links={sameSubjectOtherCities(subject, city.slug)}
          columns={2}
        />

        <LinkGrid
          title={`مواد أخرى في ${city.nameAr}`}
          links={siblingSubjectLinks(city, subject.slug)}
        />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}
