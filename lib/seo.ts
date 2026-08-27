import type { Metadata } from "next";
import { BRAND, SITE_URL, OG_IMAGE } from "./config";
import type { City, District, Faq, Subject } from "@/data/catalog";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
}

/** ميتاداتا موحّدة: canonical + Open Graph + Twitter لكل صفحة. */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${BRAND.nameAr}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND.nameAr,
      locale: "ar_SA",
      type: "website",
      images: [{ url: absoluteUrl(OG_IMAGE), width: 1200, height: 630, alt: BRAND.nameAr }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(OG_IMAGE)],
    },
  };
}

/* ---------------- عناوين الصفحات ---------------- */

/** H1 صفحة المادة داخل مدينة أو حي: "معلمة لغة إنجليزية خصوصية في جدة" */
export function subjectHeading(subject: Subject, placeName: string): string {
  return `${subject.h1Prefix} ${placeName}`;
}

export function subjectPageTitle(
  subject: Subject,
  placeName: string
): string {
  return `${subject.h1Prefix} ${placeName}`;
}

export function subjectPageDescription(
  subject: Subject,
  placeName: string
): string {
  const kind = subject.kind === "program" ? "برنامج" : "دروس";
  return `${kind} ${subject.nameAr} في ${placeName} مع معلمين ومعلمات خبرة — ${subject.stages}. حصص منزلية أو أونلاين، ومتابعة دورية. تواصل عبر واتساب لترشيح المعلمة المناسبة.`;
}

/* ---------------- JSON-LD ---------------- */

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.nameAr,
    alternateName: BRAND.nameEn,
    description: BRAND.tagline,
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE),
    telephone: `+${BRAND.whatsapp}`,
    areaServed: [
      { "@type": "City", name: "جدة" },
      { "@type": "City", name: "الرياض" },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${BRAND.whatsapp}`,
      contactType: "customer service",
      availableLanguage: ["ar", "en"],
    },
  };
}

/** LocalBusiness موجّه لمدينة محدّدة — يقوّي الظهور في البحث المحلي. */
export function localBusinessSchema(city: City, district?: District): Json {
  const placeName = district ? `${district.nameArFull} — ${city.nameAr}` : city.nameAr;
  const path = district ? `/${city.slug}/${district.slug}` : `/${city.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}${path}#business`,
    name: `${BRAND.nameAr} — ${placeName}`,
    description: BRAND.tagline,
    url: absoluteUrl(path),
    image: absoluteUrl(OG_IMAGE),
    telephone: `+${BRAND.whatsapp}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.nameAr,
      addressRegion: city.region,
      addressCountry: "SA",
    },
    areaServed: {
      "@type": "Place",
      name: placeName,
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function serviceSchema(
  subject: Subject,
  placeName: string,
  path: string
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${path}#service`,
    serviceType: subject.nameAr,
    name: `${subject.h1Prefix} ${placeName}`,
    description: subject.intro,
    url: absoluteUrl(path),
    areaServed: { "@type": "Place", name: placeName },
    provider: { "@id": `${SITE_URL}/#organization` },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
  };
}

export function faqSchema(faqs: Faq[], path: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
