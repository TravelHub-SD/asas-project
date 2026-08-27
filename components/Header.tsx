import Link from "next/link";
import { BRAND, PHONE_DISPLAY, telLink } from "@/lib/config";
import { CITIES, PRIORITY_SUBJECTS } from "@/data/catalog";
import { PhoneIcon } from "./Icons";
import BrandMark from "./BrandMark";
import BrandWordmark from "./BrandWordmark";

/** الهيدر مع مبدّل المدينة — بدون جافاسكربت (عنصر details). */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark className="h-9 w-9" />
          <span className="flex flex-col leading-tight">
            <BrandWordmark className="h-[22px] text-brand-800" />
            <span className="hidden text-xs text-slate-500 sm:block">
              معلمون ومعلمات متميّزون
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100">
              اختر مدينتك
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="absolute end-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="block rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                >
                  {city.nameAr}
                </Link>
              ))}
              <div className="my-1 border-t border-slate-100" />
              {PRIORITY_SUBJECTS.map((s) => (
                <Link
                  key={s.slug}
                  href={`/jeddah/${s.slug}`}
                  className="block rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50"
                >
                  {s.nameAr}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="/contact"
            className="hidden rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
          >
            تواصل معنا
          </Link>

          <a
            href={telLink()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-3 py-2 font-bold text-white transition hover:bg-brand-800"
          >
            <PhoneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            <span className="sm:hidden">اتصل</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
