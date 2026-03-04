import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Locale, isLocale } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اسراء النور | Israa Alnoor",
  description: "موقع اسراء النور للكورسات (عربي + إنكليزي)",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-ink dark:bg-night-bg dark:text-night-text">
        <ThemeProvider>
          <Navbar locale={locale} />
          <main className="min-h-[70vh]">{children}</main>
          <Footer locale={locale} />

          {/* Floating WhatsApp button */}
          <div className="pointer-events-none">
            <div className="pointer-events-auto">
              <WhatsAppFloat />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
