import Image from "next/image";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold text-ink dark:text-night-text">{tr.nav.about}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-stroke bg-white p-7 shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <p className="text-sm leading-8 text-muted dark:text-night-muted">
            {locale === "ar"
              ? "أكاديمية Esraa Al-Noor تقدم كورسات نفسية وتطوير ذات بأسلوب عملي ومنظم. الهدف هو تبسيط المفاهيم وتحويلها لخطوات يومية قابلة للتطبيق."
              : "Esraa Al-Noor Academy offers psychology-inspired self-growth courses in a structured, practical style—turning ideas into daily actions."}
          </p>

          <div className="mt-6 space-y-3">
            <div className="text-sm font-semibold text-ink dark:text-night-text">
              {locale === "ar" ? "لماذا هذه المنصة مختلفة؟" : "What makes it different?"}
            </div>
            <ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-muted dark:text-night-muted">
              <li>{locale === "ar" ? "كورسات طويلة مقسمة لحلقات" : "Long courses split into episodes"}</li>
              <li>{locale === "ar" ? "تصميم مريح + دارك مود" : "Comfortable design + Dark Mode"}</li>
              <li>{locale === "ar" ? "تفعيل يدوي آمن عبر كود" : "Secure manual activation via code"}</li>
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-stroke bg-white shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <div className="relative aspect-[4/5] w-full">
            <Image src="/photo4.png" alt="Esraa Al-Noor" fill className="object-cover" />
          </div>
        </div>
      </div>
    </Container>
  );
}
