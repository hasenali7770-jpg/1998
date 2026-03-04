import Link from "next/link";
import Image from "next/image";
import { Locale, t } from "@/lib/i18n";
import { Container } from "@/components/Container";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar({ locale }: { locale: Locale }) {
  const tr = t(locale);
  const nav = tr.nav;

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/courses`, label: nav.courses },
    { href: `/${locale}/pricing`, label: nav.pricing },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contact`, label: nav.contact },
    { href: `/${locale}/activate`, label: nav.activate },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stroke bg-bg/80 backdrop-blur dark:border-night-stroke dark:bg-night-bg/75">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-soft dark:bg-night-surface">
              <Image src="/logo.png" alt="Esraa Al-Noor logo" fill className="object-contain p-1" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-ink dark:text-night-text">{tr.brand}</div>
              <div className="text-xs text-muted dark:text-night-muted">{locale === "ar" ? "أكاديمية كورسات" : "Course Academy"}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-white hover:text-ink dark:text-night-text/90 dark:hover:bg-night-surface"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LocaleSwitch current={locale} label={tr.language} />
          </div>
          <ThemeToggle label={tr.theme} light={tr.light} dark={tr.dark} />
        </div>
      </Container>

      <Container className="md:hidden pb-3">
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full bg-white px-3 py-1 text-xs text-ink shadow-sm dark:bg-night-surface dark:text-night-text"
            >
              {l.label}
            </Link>
          ))}
          <LocaleSwitch current={locale} label={tr.language} />
        </div>
      </Container>
    </header>
  );
}
