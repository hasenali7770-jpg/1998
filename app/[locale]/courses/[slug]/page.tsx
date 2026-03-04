import Link from "next/link";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";
import { courses, formatIQD } from "@/lib/courses";

export default function CourseDetailsPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) {
    return <Container className="py-10"><div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft dark:border-walnut-800 dark:bg-walnut-950">{locale==="ar"?"الكورس غير موجود.":"Course not found."}</div></Container>;
  }
  return (
    <Container className="py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-sand-200 bg-white p-7 shadow-soft dark:border-walnut-800 dark:bg-walnut-950">
            <h1 className="text-2xl font-semibold text-walnut-900 dark:text-sand-100">{course.title[locale]}</h1>
            <p className="mt-3 text-sm leading-7 text-walnut-700 dark:text-sand-200">{course.short[locale]}</p>
            <div className="mt-6 space-y-3">
              <div className="text-sm font-semibold text-walnut-900 dark:text-sand-100">{locale==="ar"?"ماذا ستتعلم؟":"What you'll learn"}</div>
              <ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-walnut-700 dark:text-sand-200">
                <li>{locale==="ar"?"نظام عملي خطوة بخطوة":"A practical step-by-step system"}</li>
                <li>{locale==="ar"?"تمارين وتطبيقات واقعية":"Real-life exercises and applications"}</li>
                <li>{locale==="ar"?"متابعة حلقات منظمة":"Structured episode-based learning"}</li>
              </ul>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {course.tags[locale].map((tag) => (
                <span key={tag} className="rounded-full bg-sand-100 px-3 py-1 text-xs text-walnut-700 dark:bg-walnut-800 dark:text-sand-200">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft dark:border-walnut-800 dark:bg-walnut-950">
            <div className="text-sm text-walnut-700 dark:text-sand-200">{tr.duration}</div>
            <div className="mt-1 text-lg font-semibold">{course.hoursMin}+ {tr.hours}</div>
            <div className="mt-4 text-sm text-walnut-700 dark:text-sand-200">{locale==="ar"?"السعر":"Price"}</div>
            <div className="mt-1 text-2xl font-semibold">{formatIQD(course.priceIQD, locale)}</div>
            <div className="mt-6 flex flex-col gap-2">
              <Link href={`/${locale}/activate`} className="rounded-2xl bg-walnut-900 px-4 py-3 text-center text-sm font-semibold text-sand-50 dark:bg-sand-100 dark:text-walnut-900">{tr.buy}</Link>
              <Link href={`/${locale}/courses`} className="rounded-2xl bg-sand-100 px-4 py-3 text-center text-sm font-semibold text-walnut-900 dark:bg-walnut-800 dark:text-sand-50">{locale==="ar"?"الرجوع للدورات":"Back to courses"}</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-sand-200 bg-white p-6 text-sm leading-7 text-walnut-700 shadow-soft dark:border-walnut-800 dark:bg-walnut-950 dark:text-sand-200">
            {locale==="ar" ? "الدفع عبر Qi Card / Zain Cash، وبعدها تستلم كود تفعيل من الإدارة." : "Pay via Qi Card / Zain Cash, then receive an activation code from admin."}
          </div>
        </aside>
      </div>
    </Container>
  );
}
