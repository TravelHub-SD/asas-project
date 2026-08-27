import Link from "next/link";
import { PHONE_DISPLAY, telLink, waLink } from "@/lib/config";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

interface Props {
  message?: string;
  /** حجم الأزرار */
  size?: "md" | "lg";
  className?: string;
}

/** زرّا واتساب والاتصال — الرسالة معبّأة مسبقًا بالمادة والمدينة. */
export function ContactButtons({ message, size = "md", className = "" }: Props) {
  const pad = size === "lg" ? "px-7 py-4 text-lg" : "px-5 py-3 text-base";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-xl bg-[#25D366] font-bold text-white shadow-sm transition hover:brightness-95 ${pad}`}
      >
        <WhatsAppIcon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
        تواصل عبر واتساب
      </a>
      <a
        href={telLink()}
        className={`inline-flex items-center gap-2 rounded-xl border border-brand-600 bg-white font-bold text-brand-700 transition hover:bg-brand-50 ${pad}`}
      >
        <PhoneIcon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
        اتصال {PHONE_DISPLAY}
      </a>
    </div>
  );
}

/** صندوق دعوة للتواصل يُستخدم في نهاية كل صفحة هبوط. */
export function CtaBox({
  title,
  body,
  message,
}: {
  title: string;
  body: string;
  message?: string;
}) {
  return (
    <section className="rounded-2xl bg-brand-700 px-6 py-10 text-white sm:px-10">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl leading-8 text-brand-50">{body}</p>
      <div className="mt-6">
        <div className="flex flex-wrap gap-3">
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-7 py-4 text-lg font-bold text-white transition hover:brightness-95"
          >
            <WhatsAppIcon className="h-6 w-6" />
            راسلنا على واتساب
          </a>
          <a
            href={telLink()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-4 text-lg font-bold text-white transition hover:bg-white/10"
          >
            <PhoneIcon className="h-6 w-6" />
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <p className="mt-5 text-sm text-brand-100">
        أو{" "}
        <Link href="/contact" className="underline underline-offset-4">
          اطّلع على طريقة الحجز وأوقات التواصل
        </Link>
      </p>
    </section>
  );
}
