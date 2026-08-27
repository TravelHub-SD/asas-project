import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubjectPage from "@/components/pages/SubjectPage";
import DistrictPage, { districtMetadata } from "@/components/pages/DistrictPage";
import {
  CITIES,
  SUBJECTS,
  getCity,
  getDistrict,
  getSubject,
  publishedDistricts,
} from "@/data/catalog";
import {
  pageMetadata,
  subjectPageDescription,
  subjectPageTitle,
} from "@/lib/seo";

interface Params {
  params: { city: string; slug: string };
}

/**
 * المقطع الثاني في الرابط قد يكون مادة أو حيًا.
 * أسماء المواد والأحياء لا تتقاطع، فيُحسم النوع من الكتالوج.
 */
export function generateStaticParams() {
  return CITIES.flatMap((city) => [
    ...SUBJECTS.map((s) => ({ city: city.slug, slug: s.slug })),
    ...publishedDistricts(city).map((d) => ({ city: city.slug, slug: d.slug })),
  ]);
}

export const dynamicParams = false;

export function generateMetadata({ params }: Params): Metadata {
  const city = getCity(params.city);
  if (!city) return {};

  const subject = getSubject(params.slug);
  if (subject) {
    return pageMetadata({
      title: subjectPageTitle(subject, city.nameAr),
      description: subjectPageDescription(subject, city.nameAr),
      path: `/${city.slug}/${subject.slug}`,
    });
  }

  const district = getDistrict(city, params.slug);
  if (district?.published) return districtMetadata(city, district);

  return {};
}

export default function CitySlugPage({ params }: Params) {
  const city = getCity(params.city);
  if (!city) notFound();

  const subject = getSubject(params.slug);
  if (subject) return <SubjectPage city={city} subject={subject} />;

  const district = getDistrict(city, params.slug);
  if (district?.published) return <DistrictPage city={city} district={district} />;

  notFound();
}
