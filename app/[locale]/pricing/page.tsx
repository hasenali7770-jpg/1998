import Link from "next/link";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";
import { formatIQD } from "@/lib/courses";

export default function PricingPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);

  const plans = [
    { key: "one", price: 500000, duration: locale === "ar" ? "وصول للكورس" : "Course access", highlight: true },
    { key: "monthly", price: 200000, duration: locale === "ar" ? "شهر (كورس واحد)" : "1 month (one course)", highlight: false },
    { key: "semi", price: 0, duration: locale === "ar" ? "6 أشهر (كورس واحد)" : "6 months (one course)", highlight: false },
    { key: "yearly", price: 0, duration: locale === "ar" ? "12 شهر (كورس واحد)" : "12 months (one course)", highlight: false },
  ] as const;

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink dark:text-night-text">{tr.nav.pricing}</h1>
        <p className="mt-2 text-sm leading-7 text-muted dark:text-night-muted">
          {tr.pricingTitle} — {tr.pricingNote}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => {
          const label = tr.plans[p.key];
          const priceText = p.price ? formatIQD(p.price, locale) : (locale === "ar" ? "قابل للتعديل" : "Editable");
          return (
            <div
              key={p.key}
              className={`rounded-3xl border p-6 shadow-soft transition dark:bg-night-surface ${
                p.highlight ? "border-brand bg-white" : "border-stroke bg-white dark:border-night-stroke"
              }`}
            >
              <div className="text-sm font-semibold text-ink dark:text-night-text">{label}</div>
              <div className="mt-3 text-2xl font-semibold text-ink dark:text-night-text">{priceText}</div>
              <div className="mt-2 text-sm text-muted dark:text-night-muted">{p.duration}</div>

              <Link
                href={`/${locale}/activate`}
                className="mt-6 block rounded-2xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
              >
                {locale === "ar" ? "ابدأ الآن" : "Start now"}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-3xl border border-stroke bg-white p-6 text-sm leading-7 text-muted shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
        {locale === "ar" ? (
          <>
            <div className="font-semibold text-ink dark:text-night-text">ملاحظة</div>
            <div className="mt-2">
              الاشتراك يفتح <b>كورس واحد</b> فقط لمدة الاشتراك. بعد الدفع يتم التفعيل <b>يدوياً</b> عبر كود.
            </div>
          </>
        ) : (
          <>
            <div className="font-semibold text-ink dark:text-night-text">Note</div>
            <div className="mt-2">
              Subscription unlocks <b>one course</b> for the duration. After payment, activation is <b>manual</b> via a code.
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
