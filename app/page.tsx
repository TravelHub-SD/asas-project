import Link from "next/link";
import type { Metadata } from "next";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { CheckList, SectionTitle } from "@/components/Prose";
import {
  CITIES,
  CURRICULA,
  MODES,
  PRIORITY_SUBJECTS,
  SUBJECTS,
  publishedDistricts,
} from "@/data/catalog";
import { BRAND } from "@/lib/config";
import { popularPages, waMessage } from "@/lib/content";
import { faqSchema, pageMetadata } from "@/lib/seo";

const HOME_FAQS = [
  {
    q: "كيف أحصل على معلمة مناسبة لابني؟",
    a: "راسلنا على واتساب وأخبرنا بالصف الدراسي والمادة والمنهج (سعودي أو بريطاني أو أمريكي) والحي والوقت المناسب. نرشّح لك معلمة من الشبكة تناسب هذه التفاصيل، وتكون الحصة الأولى للتعارف وتقييم مستوى الطالب.",
  },
  {
    q: "هل الحصص منزلية أم أونلاين؟",
    a: "الاثنان متاحان. الحصص المنزلية متوفّرة ضمن نطاق موقع المعلمة، والأونلاين متاحة في كل الأحياء وتناسب المواد الحسابية وبرامج القدرات و STEP. بعض الأسر تفضّل الحضور إلى مقر المعلمة، وهذا خيار متاح أيضًا.",
  },
  {
    q: "هل تغطّون المناهج العالمية؟",
    a: "نعم، وهي أحد أقوى تخصّصاتنا. لدينا فريق مخصّص لتأسيس ومتابعة طلبة المنهجين البريطاني والأمريكي، يعمل من كتاب المدرسة ومنصّتها مباشرة لا من ملازم خارجية.",
  },
  {
    q: "ما المدن التي تخدمونها؟",
    a: "جدة والرياض حاليًا. في جدة نغطّي الحمدانية والمروة وشمال جدة وأحياء أخرى بحصص منزلية، وفي الرياض نغطّي الشمال والشرق والغرب والجنوب. الحصص الأونلاين متاحة في جميع مناطق المملكة.",
  },
];

const WHY_US = [
  "تأسيس بخطوات واضحة يبدأ من مستوى الطالب الحقيقي لا من صفحة الكتاب الأولى",
  "شرح مبسّط يربط المعلومة بمثال يفهمه الطالب قبل الانتقال إلى التعريف",
  "متابعة دورية وتقارير تُطلع ولي الأمر على ما تحسّن فعلًا وما يحتاج وقتًا",
  "تطوير المهارات والثقة حتى يشارك الطالب في الفصل بدل الخوف من الخطأ",
];

export const metadata: Metadata = pageMetadata({
  title: `معلمون ومعلمات خصوصيون في جدة والرياض`,
  description:
    "شبكة معلمين ومعلمات خبرة في جدة والرياض — تأسيس ومتابعة لجميع المراحل، للمناهج السعودية والبريطانية والأمريكية، مع برامج القدرات والتحصيلي والتخاطب وصعوبات التعلم. تواصل عبر واتساب.",
  path: "/",
});

export default function HomePage() {
  const message = waMessage();

  return (
    <>
      <JsonLd data={[faqSchema(HOME_FAQS, "/")]} />

      {/* 1) Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-sand-50">
        <div className="mx-auto max-w-content px-4 py-16 sm:py-24">
          <p className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm">
            جدة · الرياض — حصص منزلية وأونلاين
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl sm:leading-tight">
            معلمون ومعلمات خبرة — تأسيس قوي ومتابعة لجميع المراحل
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-600">
            {BRAND.nameAr} شبكة معلمين ومعلمات في جدة والرياض، متخصّصة في التأسيس ومتابعة
            الطالب خطوة بخطوة — للمنهج السعودي وللمناهج البريطانية والأمريكية، إضافة إلى
            برامج القدرات والتحصيلي وجلسات التخاطب وصعوبات التعلم.
          </p>
          <ContactButtons message={message} size="lg" className="mt-8" />
          <p className="mt-4 text-sm text-slate-500">
            أخبرنا بالصف والمادة والحي، ونرشّح لك المعلمة المناسبة.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 py-16 sm:space-y-20">
        {/* 2) لماذا نحن */}
        <section>
          <SectionTitle>لماذا {BRAND.nameAr}</SectionTitle>
          <p className="mt-4 max-w-3xl leading-9 text-slate-600">
            الفرق بين درس خصوصي عادي وتأسيس حقيقي هو الترتيب: أن نعرف أين توقّف الطالب فعلًا،
            ثم نبني من تلك النقطة بدل القفز مع المنهج وترك الفجوة تتّسع.
          </p>
          <CheckList items={WHY_US} />
        </section>

        {/* 3) اختر مدينتك */}
        <section>
          <SectionTitle>اختر مدينتك</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800">
                  معلمون ومعلمات في {city.nameAr}
                </h3>
                <p className="mt-2 text-sm text-slate-500">منطقة {city.region}</p>
                <p className="mt-3 leading-8 text-slate-600">{city.intro}</p>
                {publishedDistricts(city).length > 0 && (
                  <p className="mt-4 text-sm text-brand-700">
                    الأحياء: {publishedDistricts(city).map((d) => d.nameAr).join(" · ")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* 4) اختر المادة */}
        <section>
          <SectionTitle>اختر المادة</SectionTitle>
          <p className="mt-4 max-w-3xl leading-9 text-slate-600">
            لكل مادة معلمة متخصّصة فيها وفي المرحلة الدراسية المطلوبة — معلمة تأسيس المرحلة
            الابتدائية ليست هي معلمة الفيزياء للثانوي.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((s) => (
              <Link
                key={s.slug}
                href={`/jeddah/${s.slug}`}
                className={`group rounded-xl border p-4 transition ${
                  s.priority
                    ? "border-accent-500/40 bg-accent-500/5 hover:border-accent-500"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <span className="block font-bold text-slate-800 group-hover:text-brand-800">
                  {s.nameAr}
                </span>
                <span className="mt-1 block text-sm text-slate-500">{s.blurb}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5) كيف تتم الحصص */}
        <section>
          <SectionTitle>كيف تتم الحصص</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {MODES.map((m) => (
              <div key={m.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900">{m.nameAr}</h3>
                <p className="mt-3 leading-8 text-slate-600">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6) المناهج */}
        <section>
          <SectionTitle>المناهج التي نغطّيها</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CURRICULA.map((c) => (
              <div
                key={c.slug}
                className={`rounded-2xl border p-6 ${
                  c.slug === "british" || c.slug === "american"
                    ? "border-brand-200 bg-brand-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <h3 className="text-lg font-bold text-slate-900">{c.nameAr}</h3>
                <p className="mt-3 leading-8 text-slate-600">{c.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/international`}
                className="inline-flex rounded-xl bg-brand-700 px-5 py-3 font-bold text-white transition hover:bg-brand-800"
              >
                تأسيس انترناشونال في {city.nameAr}
              </Link>
            ))}
          </div>
        </section>

        {/* 7) التخاطب وصعوبات التعلم */}
        {PRIORITY_SUBJECTS.filter((s) => s.slug === "special-needs").map((s) => (
          <section key={s.slug} className="rounded-2xl border border-accent-500/30 bg-white p-6 sm:p-10">
            <p className="text-sm font-semibold text-accent-600">تخصّص إضافي</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{s.nameAr}</h2>
            <p className="mt-4 max-w-3xl leading-9 text-slate-600">{s.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}/special-needs`}
                  className="inline-flex rounded-xl border border-brand-600 px-5 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  {s.h1Prefix} {city.nameAr}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* 8) صفحات شائعة */}
        <LinkGrid
          title="صفحات شائعة"
          description="أكثر الصفحات التي يصل إليها أولياء الأمور من البحث."
          links={popularPages()}
        />

        {/* 9) CTA + FAQ */}
        <CtaBox
          title="ابدأ اليوم"
          body="راسلنا على واتساب وأخبرنا بالصف والمادة والحي، ونرشّح لك معلمة مناسبة في أسرع وقت."
          message={message}
        />

        <FaqSection faqs={HOME_FAQS} />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}
