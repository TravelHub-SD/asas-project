import Link from "next/link";
import { BRAND, PHONE_DISPLAY, telLink, waLink } from "@/lib/config";
import BrandMark from "./BrandMark";
import BrandWordmark from "./BrandWordmark";
import FooterNav from "./FooterNav";

/**
 * الفوتر — أعمدة الروابط انتقلت إلى FooterNav فوقه،
 * فبقي هنا التعريف بالبراند وحقوق النشر دون تكرار نفس القوائم مرّتين.
 */
export default function Footer() {
  return (
    <footer className="mt-16">
      <FooterNav />

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-content px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <BrandMark className="h-9 w-9" />
                <BrandWordmark className="h-[22px] text-brand-800" />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {BRAND.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-700 hover:underline"
              >
                واتساب: {PHONE_DISPLAY}
              </a>
              <a href={telLink()} className="text-slate-600 hover:underline">
                اتصال مباشر
              </a>
              <Link href="/contact" className="text-slate-600 hover:underline">
                تواصل معنا
              </Link>
            </div>
          </div>

          <p className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <BrandWordmark className="inline-block h-[13px] translate-y-[2px]" /> —{" "}
            {BRAND.nameEn}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      {/* مساحة تعويض الشريط الثابت على الجوال */}
      <div className="h-16 md:hidden" />
    </footer>
  );
}
