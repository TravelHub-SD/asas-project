import Link from "next/link";
import type { Crumb } from "@/lib/seo";

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="مسار التنقل" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-slate-700">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-brand-700 hover:underline">
                  {c.name}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
