import type { MetadataRoute } from "next";
import {
  CITIES,
  PRIORITY_SUBJECT_SLUGS,
  SUBJECTS,
  allDistricts,
  publishedRegions,
} from "@/data/catalog";
import { SITE_URL } from "@/lib/config";

/** يتولّد كاملًا من الكتالوج — أي مادة أو حي جديد يظهر هنا تلقائيًا. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  const entries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  for (const city of CITIES) {
    entries.push({
      url: url(`/${city.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    for (const region of publishedRegions(city)) {
      entries.push({
        url: url(`/${city.slug}/${region.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const { district } of allDistricts(city)) {
      entries.push({
        url: url(`/${city.slug}/${district.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        // الأحياء المميّزة أولوية أعلى
        priority: district.featured ? 0.7 : 0.6,
      });

      if (!district.featured) continue;
      for (const subject of PRIORITY_SUBJECT_SLUGS) {
        entries.push({
          url: url(`/${city.slug}/${district.slug}/${subject}`),
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    for (const subject of SUBJECTS) {
      entries.push({
        url: url(`/${city.slug}/${subject.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        // صفحات البرامج المميّزة أولوية أعلى
        priority: subject.priority ? 0.9 : 0.8,
      });
    }
  }

  return entries;
}
