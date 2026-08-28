import Link from "next/link";
import { ContactButtons } from "@/components/Cta";
import { CITIES } from "@/data/catalog";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-24">
      <p className="text-sm font-semibold text-brand-700">٤٠٤</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-600">
        الرابط الذي وصلت منه لم يعد متاحًا. يمكنك البدء من صفحة مدينتك، أو مراسلتنا مباشرة
        على واتساب وسنساعدك في الوصول إلى ما تبحث عنه.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="rounded-xl border border-brand-600 px-5 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
          >
            معلمون ومعلمات في {c.nameAr}
          </Link>
        ))}
      </div>
      <ContactButtons className="mt-6" />
    </div>
  );
}
