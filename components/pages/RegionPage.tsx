import Breadcrumbs from "@/components/Breadcrumbs";
import { ContactButtons, CtaBox } from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import LinkGrid from "@/components/LinkGrid";
import StickyContactBar from "@/components/StickyContactBar";
import { SectionTitle } from "@/components/Prose";
import {
  prioritySubjects,
  publishedRegions,
  regionDistricts,
  type City,
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

/** صيغة العدد العربية: ٣–١٠ جمع، وما فوقها مفرد منصوب. */
function countLabel(n: number): string {
  if (n === 1) return "حي واحد";
  if (n === 2) return "حيّان";
  if (n <= 10) return `${n} أحياء`;
  return `${n} حيًا`;
}

/** صفحة منطقة: /jeddah/north — تسرد أحياءها وتوجّه إليها. */
export default function RegionPage({
  city,
  region,
}: {
  city: City;
  region: Region;
}) {
  const path = `/${city.slug}/${region.slug}`;
  const message = waMessage(undefined, region.nameAr);
  const districts = regionDistricts(region);
  // منطقة بلا أحياء مميّزة (مثل شرق جدة) تُعرض أحياؤها كلها تحت عنوان واحد
  // بدل قائمة أساسية فارغة يتبعها عنوان «أحياء أخرى».
  const hasFeatured = districts.some((d) => d.featured);
  const featured = hasFeatured ? districts.filter((d) => d.featured) : districts;
  const others = hasFeatured ? districts.filter((d) => !d.featured) : [];
  const otherRegions = publishedRegions(city).filter((r) => r.slug !== region.slug);

  const crumbs: Crumb[] = [
    { name: "الرئيسية", path: "/" },
    { name: city.nameAr, path: `/${city.slug}` },
    { name: region.nameAr, path },
  ];

  const faqs = [
    {
      q: `ما الأحياء التي تغطّونها في ${region.nameAr}؟`,
      a: `نغطّي ${countLabel(districts.length)} في ${region.nameAr}: ${featured
        .slice(0, 4)
        .map((d) => d.nameAr)
        .join(" و")}${
        districts.length > 4 ? " وغيرها" : ""
      }. لكل حي صفحة توضّح طبيعة الطلب فيه، والحصص الأونلاين متاحة في جميع الأحياء دون استثناء.`,
    },
    {
      q: `هل تصل المعلمة إلى أي حي في ${region.nameAr}؟`,
      a: `نرشّح دائمًا معلمة قريبة من حيّكم لأن قرب المسافة هو ما يجعل الجدول ثابتًا. إن لم تتوفّر معلمة قريبة في الوقت الذي تريده، نعرض عليك البدء أونلاين بدل الانتظار حتى تتوفّر.`,
    },
    {
      q: `ما المواد الأكثر طلبًا في ${region.nameAr}؟`,
      a: `${region.intro.split("،")[0]}. إضافة إلى ذلك نغطّي المواد الأساسية كلها لجميع المراحل، وبرامج القدرات والتحصيلي و STEP.`,
    },
    {
      q: `كيف نبدأ؟`,
      a: `راسلنا على واتساب وأخبرنا بالحي والصف الدراسي والمادة والوقت المناسب، فنرشّح معلمة متميّزة تناسب هذه التفاصيل، ونتّفق معك على الجدول وخطة البرنامج.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[localBusinessSchema(city), faqSchema(faqs, path), breadcrumbSchema(crumbs)]}
      />

      <div className="mx-auto max-w-content px-4 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <section className="mx-auto max-w-content px-4 py-10">
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
          معلمة خصوصية متميّزة في {region.nameAr}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">{region.intro}</p>
        <ContactButtons message={message} size="lg" className="mt-8" />
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 pb-16">
        <LinkGrid
          title={hasFeatured ? `أحياء ${region.nameAr} الأكثر طلبًا` : `الأحياء التي نغطّيها في ${region.nameAr}`}
          description={
            hasFeatured
              ? "الأحياء التي نغطّيها بأكبر عدد من المعلمين والمعلمات المتميّزين."
              : `لكل حي صفحة توضّح طبيعة الطلب فيه وأقرب المعلمات إليه.`
          }
          links={districtLinks(city.slug, featured)}
        />

        <section>
          <SectionTitle>البرامج الأكثر طلبًا في {region.nameAr}</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {prioritySubjects().map((s) => (
              <a
                key={s.slug}
                href={`/${city.slug}/${s.slug}`}
                className="group rounded-2xl border border-accent-500/40 bg-accent-500/5 p-6 transition hover:border-accent-500"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800">
                  {s.nameAr}
                </h3>
                <p className="mt-3 leading-8 text-slate-600">{s.blurb}</p>
              </a>
            ))}
          </div>
        </section>

        {others.length > 0 && (
          <LinkGrid
            title={`أحياء أخرى نغطّيها في ${region.nameAr}`}
            links={districtLinks(city.slug, others)}
          />
        )}

        <CtaBox
          title={`ابحث عن معلمة خصوصية في ${region.nameAr}`}
          body={`أرسل لنا الحي والصف الدراسي والمادة والوقت المناسب، ونرشّح لك معلمة متميّزة قريبة منك.`}
          message={message}
        />

        <FaqSection faqs={faqs} title={`أسئلة شائعة عن ${region.nameAr}`} />

        <LinkGrid
          title={`مناطق أخرى في ${city.nameAr}`}
          links={[
            ...otherRegions.map((r) => ({
              href: `/${city.slug}/${r.slug}`,
              label: `معلمة خصوصية في ${r.nameAr}`,
            })),
            { href: `/${city.slug}`, label: `كل خدماتنا في ${city.nameAr}` },
          ]}
          columns={2}
        />
      </div>

      <StickyContactBar message={message} />
    </>
  );
}

export function regionMetadata(city: City, region: Region) {
  const names = regionDistricts(region)
    .filter((d) => d.featured)
    .slice(0, 4)
    .map((d) => d.nameAr)
    .join(" · ");
  return pageMetadata({
    title: `معلمة خصوصية في ${region.nameAr}`,
    description: `معلمون ومعلمات متميّزون في ${region.nameAr} لجميع المواد والمراحل — ${names} وغيرها. تأسيس للمناهج الانترناشونال وبرامج القدرات والتحصيلي، حصص حضورية أو أونلاين. تواصل عبر واتساب.`,
    path: `/${city.slug}/${region.slug}`,
  });
}
