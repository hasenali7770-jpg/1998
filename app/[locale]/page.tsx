// app/[locale]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";
import { CourseCard } from "@/components/CourseCard";
import { Metadata } from "next";

// 1. إعداد واجهة التليجرام والـ SEO (الخطوة السادسة)
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ar";
  return {
    title: locale === "ar" ? "أكاديمية إسراء النور" : "Esraa Al-Noor Academy",
    description: locale === "ar" ? "كورسات نفسية وتطوير ذات… بهدوء وعمق." : "Psychology-inspired growth courses—calm and deep.",
    openGraph: {
      title: locale === "ar" ? "أكاديمية إسراء النور" : "Esraa Al-Noor Academy",
      images: [
        {
          url: "/telegram-preview.jpeg", // تأكد من وضع صورتك في مجلد public بهذا الاسم
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);

  // 2. جلب البيانات بطريقة آمنة (تحضيراً للوحة التحكم)
  let liveCourses = [];
  try {
    // سنستخدم الرابط المحلي حالياً وسنقوم بتحديثه لـ Supabase في الخطوة القادمة
    const res = await fetch('http://127.0.0.1:4000/api/courses', { next: { revalidate: 0 } });
    const rawData = await res.json();
    liveCourses = Array.isArray(rawData) ? rawData.map((c: any) => ({
      ...c,
      title: typeof c.title === 'string' ? { ar: c.title, en: c.title } : c.title,
      description: typeof c.description === 'string' ? { ar: c.description, en: c.description } : c.description
    })) : [];
  } catch (e) {
    liveCourses = []; // في حال الفشل لا ينهار التصميم
  }

  return (
    <>
      <section className="relative overflow-hidden">
        {/* الحفاظ على الخلفية الجمالية الأصلية */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_20%_10%,rgba(31,91,106,0.18),transparent_60%),radial-gradient(70%_60%_at_90%_20%,rgba(212,176,116,0.20),transparent_55%)] dark:bg-[radial-gradient(80%_70%_at_20%_10%,rgba(58,166,185,0.22),transparent_60%),radial-gradient(70%_60%_at_90%_20%,rgba(212,176,116,0.14),transparent_55%)]" />
        
        <Container className="grid gap-10 py-14 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm dark:bg-night-surface dark:text-night-text">
              {locale === "ar" ? "أكاديمية إسراء النور" : "Esraa Academy"}
              <span className="h-1 w-1 rounded-full bg-accent" />
              {locale === "ar" ? "تطوير ووعي" : "Growth & Awareness"}
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-ink md:text-5xl dark:text-night-text">
              {tr.hero.title}
            </h1>
            <p className="text-base leading-8 text-muted dark:text-night-muted">{tr.hero.subtitle}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/courses`}
                className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
              >
                {tr.hero.ctaPrimary}
              </Link>
              <Link
                href={`/${locale}/activate`}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink shadow-soft transition hover:bg-bg dark:bg-night-surface dark:text-night-text"
              >
                {tr.hero.ctaSecondary}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-stroke bg-white p-5 text-sm leading-7 text-ink/80 shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
                <div className="font-semibold text-ink dark:text-night-text">{locale === "ar" ? "الدفع" : "Payments"}</div>
                <div className="mt-1">Qi Card + Zain Cash</div>
              </div>
              <div className="rounded-3xl border border-stroke bg-white p-5 text-sm leading-7 text-ink/80 shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
                <div className="font-semibold text-ink dark:text-night-text">{locale === "ar" ? "التفعيل" : "Activation"}</div>
                <div className="mt-1">{locale === "ar" ? "يدوي عبر كود" : "Manual via code"}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-white/60 blur-2xl dark:bg-night-surface/40" />
            <div className="overflow-hidden rounded-[2.5rem] border border-stroke bg-white shadow-soft dark:border-night-stroke dark:bg-night-surface">
              <div className="relative aspect-[4/5] w-full">
                {/* تم استخدام صورتك الجديدة هنا كصورة Hero */}
                <Image src="/telegram-preview.jpeg" alt="Esraa Al-Noor" fill className="object-cover" priority />
              </div>
              <div className="p-5">
                <div className="text-sm font-semibold text-ink dark:text-night-text">إسراء النور</div>
                <div className="mt-1 text-sm text-muted dark:text-night-muted">
                  {locale === "ar" ? "نحو وعي أعمق وسلام داخلي." : "Towards deeper awareness."}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* قسم الكورسات الديناميكي */}
      <section>
        <Container className="py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink dark:text-night-text">{tr.featured}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {liveCourses.length > 0 ? (
              liveCourses.map((c: any) => (
                <CourseCard key={c.id} course={c} locale={locale} />
              ))
            ) : (
              <p className="text-center col-span-full py-10 opacity-50">لا يوجد دورات متاحة حالياً.</p>
            )}
          </div>
        </Container>
      </section>

      {/* قسم الآراء */}
      <section>
        <Container className="pb-14">
          <div className="rounded-[2rem] border border-stroke bg-white p-8 shadow-soft dark:border-night-stroke dark:bg-night-surface">
            <h3 className="text-lg font-semibold text-ink dark:text-night-text">{tr.testimonials.title}</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {tr.testimonials.items.map((it: any) => (
                <div key={it.name} className="rounded-3xl bg-bg p-6 text-sm leading-7 text-ink/80 dark:bg-night-bg dark:text-night-muted">
                  <div className="font-semibold text-ink dark:text-night-text">{it.name}</div>
                  <div className="mt-2">{it.text}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
