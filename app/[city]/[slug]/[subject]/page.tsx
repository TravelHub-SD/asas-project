import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DistrictSubjectPage, {
  districtSubjectMetadata,
} from "@/components/pages/DistrictSubjectPage";
import {
  CITIES,
  PRIORITY_SUBJECT_SLUGS,
  allDistricts,
  findDistrict,
  getCity,
  getSubject,
  isPrioritySlug,
} from "@/data/catalog";

interface Params {
  params: { city: string; slug: string; subject: string };
}

/**
 * (حيّ مميّز × مادة أولوية) فقط — لا نولّد صفحة لكل حي مع كل مادة،
 * لأن ذلك ينتج صفحات رقيقة متشابهة يعاقبها قوقل.
 */
export function generateStaticParams() {
  return CITIES.flatMap((city) =>
    allDistricts(city)
      .filter(({ district }) => district.featured)
      .flatMap(({ district }) =>
        PRIORITY_SUBJECT_SLUGS.map((subject) => ({
          city: city.slug,
          slug: district.slug,
          subject,
        }))
      )
  );
}

export const dynamicParams = false;

function resolve(params: Params["params"]) {
  const city = getCity(params.city);
  if (!city) return null;
  const found = findDistrict(city, params.slug);
  if (!found?.district.featured) return null;
  if (!isPrioritySlug(params.subject)) return null;
  const subject = getSubject(params.subject);
  if (!subject) return null;
  return { city, ...found, subject };
}

export function generateMetadata({ params }: Params): Metadata {
  const r = resolve(params);
  if (!r) return {};
  return districtSubjectMetadata(r.city, r.region, r.district, r.subject);
}

export default function DistrictSubjectRoute({ params }: Params) {
  const r = resolve(params);
  if (!r) notFound();
  return (
    <DistrictSubjectPage
      city={r.city}
      region={r.region}
      district={r.district}
      subject={r.subject}
    />
  );
}
