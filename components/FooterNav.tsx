import Link from "next/link";
import {
  CITIES,
  SUBJECTS,
  allDistricts,
  publishedRegions,
} from "@/data/catalog";
import { PHONE_DISPLAY, telLink, waLink } from "@/lib/config";
import { waMessage } from "@/lib/content";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

/**
 * شريط تنقّل فوق الفوتر — أعمدة واضحة تختصر الوصول لأي صفحة.
 * لا يوجد عمود أسعار عن قصد: قرار المشروع ألّا تُعرض أسعار على الموقع
 * وأن يوجَّه كل استفسار إلى واتساب.
 */
export default function FooterNav() {
  const jeddah = CITIES[0];
  const regions = publishedRegions(jeddah);
  const featured = allDistricts(jeddah)
    .filter((d) => d.district.featured)
    .slice(0, 8);

  return (
    <nav
      aria-label="روابط الموقع"
      className="border-t border-slate-200 bg-white"
    >
      <div className="mx-auto grid max-w-content gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">أحياء جدة</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {regions.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/${jeddah.slug}/${r.slug}`}
                  className="font-semibold text-slate-700 hover:text-brand-700 hover:underline"
                >
                  {r.nameAr}
                </Link>
              </li>
            ))}
            {featured.map(({ district }) => (
              <li key={district.slug}>
                <Link
                  href={`/${jeddah.slug}/${district.slug}`}
                  className="text-slate-600 hover:text-brand-700 hover:underline"
                >
                  {district.nameArFull}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">المواد</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {SUBJECTS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${jeddah.slug}/${s.slug}`}
                  className={
                    s.priority
                      ? "font-extrabold text-brand-800 hover:underline"
                      : "text-slate-600 hover:text-brand-700 hover:underline"
                  }
                >
                  {s.nameAr}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">المدن</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="font-semibold text-slate-700 hover:text-brand-700 hover:underline"
                >
                  معلمة خصوصية في {c.nameAr}
                </Link>
              </li>
            ))}
            {CITIES.map((c) => (
              <li key={`${c.slug}-int`}>
                <Link
                  href={`/${c.slug}/international`}
                  className="text-slate-600 hover:text-brand-700 hover:underline"
                >
                  تأسيس انترناشونال في {c.nameAr}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">تواصل معنا</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a
              href={waLink(waMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-bold text-white transition hover:brightness-95"
            >
              <WhatsAppIcon className="h-5 w-5" />
              واتساب
            </a>
            <a
              href={telLink()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-600 px-4 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
            >
              <PhoneIcon className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              className="text-slate-600 hover:text-brand-700 hover:underline"
            >
              طريقة الحجز وأوقات التواصل
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
