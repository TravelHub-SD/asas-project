import type { Faq } from "@/data/catalog";

/** قسم الأسئلة الشائعة — مرئي للزائر ومطابق لما في JSON-LD. */
export default function FaqSection({
  faqs,
  title = "أسئلة شائعة",
}: {
  faqs: Faq[];
  title?: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-right font-bold text-slate-800">
              <span>{f.q}</span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-brand-600 transition group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 leading-8 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
