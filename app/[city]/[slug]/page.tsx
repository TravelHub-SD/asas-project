import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubjectPage from "@/components/pages/SubjectPage";
import RegionPage, { regionMetadata } from "@/components/pages/RegionPage";
import DistrictPage, { districtMetadata } from "@/components/pages/DistrictPage";
import {
  CITIES,
  SUBJECTS,
  findDistrict,
  getCity,
  getRegion,
  getSubject,
  publishedRegions,
} from "@/data/catalog";
import { pageMetadata, subjectPageDescription, subjectPageTitle } from "@/lib/seo";

interface Params {
  params: { city: string; slug: string };
}

/**
 * المقطع الثاني قد يكون: مادة أو منطقة أو حيًا.
 * الأسماء الثلاثة لا تتقاطع، ويُحسم النوع من الكتالوج بهذا الترتيب.
 */
export function generateStaticParams() {
  return CITIES.flatMap((city) => [
    ...SUBJECTS.map((s) => ({ city: city.slug, slug: s.slug })),
    ...publishedRegions(city).flatMap((r) => [
      { city: city.slug, slug: r.slug },
      ...r.districts.map((d) => ({ city: city.slug, slug: d.slug })),
    ]),
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

  const region = getRegion(city, params.slug);
  if (region?.published) return regionMetadata(city, region);

  const found = findDistrict(city, params.slug);
  if (found) return districtMetadata(city, found.region, found.district);

  return {};
}

export default function CitySlugPage({ params }: Params) {
  const city = getCity(params.city);
  if (!city) notFound();

  const subject = getSubject(params.slug);
  if (subject) return <SubjectPage city={city} subject={subject} />;

  const region = getRegion(city, params.slug);
  if (region?.published) return <RegionPage city={city} region={region} />;

  const found = findDistrict(city, params.slug);
  if (found) {
    return <DistrictPage city={city} region={found.region} district={found.district} />;
  }

  notFound();
}
