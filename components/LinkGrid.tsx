import Link from "next/link";
import type { LinkItem } from "@/lib/content";

/** روابط داخلية — العمود الفقري للربط بين الصفحات. */
export default function LinkGrid({
  title,
  description,
  links,
  columns = 3,
}: {
  title: string;
  description?: string;
  links: LinkItem[];
  columns?: 2 | 3;
}) {
  if (links.length === 0) return null;
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl leading-8 text-slate-600">{description}</p>}
      <div className={`mt-6 grid gap-3 ${cols}`}>
        {links.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:bg-brand-50"
          >
            <span
              className={`block group-hover:text-brand-800 ${
                l.emphasis ? "font-extrabold text-brand-800" : "font-bold text-slate-800"
              }`}
            >
              {l.label}
            </span>
            {l.note && <span className="mt-1 block text-sm text-slate-500">{l.note}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
