import Link from "next/link";
import { Locale, t } from "@/lib/i18n";
import { Container } from "@/components/Container";
import { social } from "@/lib/social";

export function Footer({ locale }: { locale: Locale }) {
  const tr = t(locale);
  const nav = tr.nav;

  const links = [
    { href: `/${locale}/courses`, label: nav.courses },
    { href: `/${locale}/pricing`, label: nav.pricing },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contact`, label: nav.contact },
    { href: `/${locale}/terms`, label: nav.terms },
    { href: `/${locale}/privacy`, label: nav.privacy },
  ];

  return (
    <footer className="mt-16 border-t border-stroke bg-white dark:border-night-stroke dark:bg-night-bg">
      <Container className="grid gap-10 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-lg font-semibold text-ink dark:text-night-text">{tr.brand}</div>
          <p className="text-sm leading-7 text-muted dark:text-night-muted">
            {locale === "ar"
              ? "منصة كورسات عربية/إنكليزية بتجربة هادئة ومحتوى عملي مُنظم."
              : "A bilingual course platform with a calm, premium learning experience."}
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-ink dark:text-night-text">{tr.footer.links}</div>
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href as any} className="text-sm text-muted hover:underline dark:text-night-muted">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-ink dark:text-night-text">{tr.footer.follow}</div>
          <div className="flex flex-col gap-2 text-sm text-muted dark:text-night-muted">
            <Link href={social.instagram as any} target="_blank" className="hover:underline">Instagram</Link>
            <Link href={social.facebook as any} target="_blank" className="hover:underline">Facebook</Link>
            <Link href={`mailto:${social.email}` as any} className="hover:underline">{social.email}</Link>
            <Link href={social.whatsappWaMe as any} target="_blank" className="hover:underline">{social.whatsappNumberLocal}</Link>
          </div>
        </div>
      </Container>

      <div className="border-t border-stroke py-4 text-center text-xs text-muted dark:border-night-stroke dark:text-night-muted">
        {tr.footer.rights} {new Date().getFullYear()} {tr.brand}
      </div>
    </footer>
  );
}
