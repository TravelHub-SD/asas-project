import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { SectionTitle } from "@/components/Prose";
import { CITIES, MODES, SUBJECTS } from "@/data/catalog";
import { BRAND, PHONE_DISPLAY } from "@/lib/config";
import { waMessage } from "@/lib/content";
import {
  breadcrumbSchema,
  faqSchema,
  organizationSchema,
  pageMetadata,
  type Crumb,
} from "@/lib/seo";

const FAQS = [
  {
    q: "ما المعلومات التي أرسلها في أول رسالة؟",
    a: "أربعة أشياء تكفي: الصف الدراسي، المادة، المنهج (سعودي أو بريطاني أو أمريكي)، والحي أو رغبتك في حصص أونلاين. كلما كانت الرسالة أوضح كان الترشيح أسرع وأدق.",
  },
  {
    q: "كم تستغرق مدة الرد؟",
    a: "نرد عادة خلال ساعات العمل في نفس اليوم. الرسائل التي تصل ليلًا يُرد عليها صباح اليوم التالي.",
  },
  {
    q: "هل يمكن تغيير المعلمة إن لم تكن مناسبة؟",
    a: "نعم. إن شعرت الأسرة أن أسلوب المعلمة لا يناسب الطالب نرشّح معلمة أخرى دون تعقيد.",
  },
  {
    q: "هل تخدمون مدنًا أخرى غير جدة والرياض؟",
    a: "حضوريًا نعمل حاليًا في جدة والرياض فقط، ونغطّي في جدة أكثر من ثلاثين حيًا. أما الحصص الأونلاين فمتاحة لأي مدينة في المملكة، وهي خيار عملي للمواد الحسابية وبرامج القدرات و STEP.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "تواصل معنا",
  description: `تواصل مع ${BRAND.nameAr} عبر واتساب أو الاتصال المباشر لترشيح معلمة مناسبة في جدة أو الرياض — حصص حضورية أو أونلاين لجميع المواد والمراحل.`,
  path: "/contact",
});

export default function ContactPage() {
  const message = waMessage();
  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  return (
    <>
      <JsonLd
        data={[organizationSchema(), faqSchema(FAQS, "/contact"), breadcrumbSchema(crumbs)]}
      />

      <div className="mx-auto max-w-content px-4 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <section className="mx-auto max-w-content px-4 py-10">
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          تواصل معنا
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
          الطريقة الأسرع للوصول إلينا هي واتساب. أرسل لنا الصف الدراسي والمادة والمنهج والحي،
          ونرشّح لك معلمة متميّزة مناسبة. لا يوجد تسجيل ولا نماذج طويلة — رسالة واحدة تكفي.
        </p>
        <ContactButtons message={message} size="lg" className="mt-8" />
        <p className="mt-4 text-sm text-slate-500">الرقم: {PHONE_DISPLAY}</p>
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        <section>
          <SectionTitle>كيف تسير الأمور بعد رسالتك</SectionTitle>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "١. نفهم احتياج الطالب",
                d: "نسألك عن الصف والمنهج ونقاط الضعف الحالية والوقت المتاح، حتى لا يكون الترشيح عشوائيًا.",
              },
              {
                t: "٢. نرشّح المعلمة المناسبة",
                d: "نختار معلمة متميّزة متخصّصة في المادة والمرحلة، وقريبة من موقعكم إن كانت الحصص حضورية.",
              },
              {
                t: "٣. نتّفق على الجدول والخطة",
                d: "نحدّد معك عدد الحصص الأسبوعية ومواعيدها وهدف البرنامج، وتبدأ المعلمة من مستوى الطالب الحالي.",
              },
            ].map((s) => (
              <li key={s.t} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900">{s.t}</h3>
                <p className="mt-3 leading-8 text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionTitle>خيارات الحصص</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {MODES.map((m) => (
              <div key={m.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900">{m.nameAr}</h3>
                <p className="mt-3 leading-8 text-slate-600">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        <FaqSection faqs={FAQS} />

        <LinkGrid
          title="ابدأ من صفحة مدينتك"
          links={CITIES.flatMap((c) => [
            { href: `/${c.slug}`, label: `معلمون ومعلمات في ${c.nameAr}` },
            ...SUBJECTS.filter((s) => s.priority).map((s) => ({
              href: `/${c.slug}/${s.slug}`,
              label: `${s.h1Prefix} ${c.nameAr}`,
            })),
          ])}
        />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}
