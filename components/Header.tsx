import Link from "next/link";
import { PHONE_DISPLAY, telLink } from "@/lib/config";
import { CITIES } from "@/data/catalog";
import { PhoneIcon } from "./Icons";
import BrandMark from "./BrandMark";
import BrandWordmark from "./BrandWordmark";

/**
 * الهيدر — أزرار المدن ظاهرة مباشرة لا داخل قائمة منسدلة.
 * القائمة المنسدلة كانت تُفوَّت لأن ولي الأمر لا ينتبه للسهم الصغير،
 * فصار الخياران أمامه من أول نظرة.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <BrandMark className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="flex flex-col leading-tight">
            <BrandWordmark className="h-[17px] text-brand-800 sm:h-[22px]" />
            <span className="hidden text-xs text-slate-500 sm:block">
              معلمون ومعلمات متميّزون
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 text-sm sm:gap-2">
          <span className="hidden text-xs font-semibold text-slate-400 lg:inline">
            اختر مدينتك:
          </span>

          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="rounded-lg border-2 border-brand-600 px-2.5 py-1.5 font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white sm:px-4 sm:py-2"
            >
              {city.nameAr}
            </Link>
          ))}

          <Link
            href="/contact"
            className="hidden rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 md:block"
          >
            تواصل معنا
          </Link>

          <a
            href={telLink()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-700 px-2.5 py-1.5 font-bold text-white transition hover:bg-brand-800 sm:gap-2 sm:px-3 sm:py-2"
          >
            <PhoneIcon className="h-4 w-4" />
            <span className="hidden lg:inline">{PHONE_DISPLAY}</span>
            <span className="lg:hidden">اتصل</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
