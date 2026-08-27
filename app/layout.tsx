import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { BRAND, SITE_URL, OG_IMAGE } from "@/lib/config";
import { organizationSchema } from "@/lib/seo";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.nameAr} — ${BRAND.tagline}`,
    template: `%s`,
  },
  description:
    "شبكة معلمين ومعلمات خبرة في جدة والرياض — تأسيس ومتابعة لجميع المراحل، للمناهج السعودية والبريطانية والأمريكية، مع برامج القدرات والتحصيلي والتخاطب وصعوبات التعلم.",
  applicationName: BRAND.nameAr,
  authors: [{ name: BRAND.nameAr }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: BRAND.nameAr,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: BRAND.nameAr }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans">
        <JsonLd data={[organizationSchema()]} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
