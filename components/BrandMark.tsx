/**
 * علامة البراند — رمز مستقل، وليس حرفًا مشتقًّا من الاسم.
 * وضع أول حرف بجانب الاسم كان يُقرأ «ممدرسة» / «أأساس»، فالعلامة هنا رسم لا حرف.
 */
export default function BrandMark({
  className = "h-9 w-9",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-lg bg-brand-700 text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
        <path d="M6 10.8v4.4c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9v-4.4" />
        <path d="M21.5 8.5v5" />
      </svg>
    </span>
  );
}
