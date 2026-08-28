import { PHONE_DISPLAY, telLink, waLink } from "@/lib/config";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

/** شريط ثابت أسفل الشاشة على الجوال — أغلب زوار السعودية على الجوال. */
export default function StickyContactBar({ message }: { message?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-2 backdrop-blur md:hidden">
      <div className="flex gap-2">
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-bold text-white"
        >
          <WhatsAppIcon />
          واتساب
        </a>
        <a
          href={telLink()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 py-3 font-bold text-white"
        >
          <PhoneIcon />
          اتصال
        </a>
      </div>
      <span className="sr-only">رقم التواصل {PHONE_DISPLAY}</span>
    </div>
  );
}
