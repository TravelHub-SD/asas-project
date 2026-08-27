import Link from "next/link";
import { BRAND, PHONE_DISPLAY, telLink, waLink } from "@/lib/config";
import { CITIES, SUBJECTS, publishedDistricts } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-content px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-lg font-bold text-white">
                أ
              </span>
              <span className="text-lg font-bold text-brand-800">{BRAND.nameAr}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{BRAND.tagline}</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
                واتساب: {PHONE_DISPLAY}
              </a>
              <a href={telLink()} className="text-slate-600 hover:underline">
                اتصال مباشر
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">المدن</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {CITIES.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}`} className="text-slate-600 hover:text-brand-700 hover:underline">
                    معلمون ومعلمات في {city.nameAr}
                  </Link>
                </li>
              ))}
              {CITIES.flatMap((city) =>
                publishedDistricts(city).map((d) => (
                  <li key={`${city.slug}-${d.slug}`}>
                    <Link href={`/${city.slug}/${d.slug}`} className="text-slate-600 hover:text-brand-700 hover:underline">
                      {d.nameArFull}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900">المواد والبرامج</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {SUBJECTS.map((s) => (
                <li key={s.slug}>
                  <Link href={`/jeddah/${s.slug}`} className="text-slate-600 hover:text-brand-700 hover:underline">
                    {s.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.nameAr} — {BRAND.nameEn}. جميع الحقوق محفوظة.
          </p>
          <Link href="/contact" className="hover:text-brand-700 hover:underline">
            تواصل معنا
          </Link>
        </div>
      </div>
      {/* مساحة تعويض الشريط الثابت على الجوال */}
      <div className="h-16 md:hidden" />
    </footer>
  );
}
