import { CheckIcon } from "./Icons";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{children}</h2>;
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-600">{children}</p>;
}

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand-600" />
          <span className="leading-7 text-slate-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * يعرض نصًا قد يحوي فقرات مفصولة بسطر فارغ.
 * نصوص المواد الطويلة (مثل القدرات) تُكتب بفقرات في الكتالوج،
 * ووضعها في وسم <p> واحد يبتلع الفواصل ويجعلها كتلة واحدة.
 */
export function Paragraphs({
  text,
  className = "mt-5 max-w-3xl text-lg leading-9 text-slate-600",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/\n\s*\n/).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => (
        <p key={i} className={i === 0 ? className : `${className} mt-4`}>
          {part}
        </p>
      ))}
    </>
  );
}
