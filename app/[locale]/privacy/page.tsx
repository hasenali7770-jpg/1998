import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold text-ink dark:text-night-text">{tr.nav.privacy}</h1>
      <div className="mt-6 rounded-3xl border border-stroke bg-white p-7 text-sm leading-8 text-ink/80 shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
        {locale === "ar" ? (
          <>
            <p>نحن نحترم خصوصيتك. هذه السياسة توضح بشكل مبسط ما الذي نجمعه ولماذا.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">1) البيانات التي قد نجمعها</h2>
            <p>عند التواصل معنا قد تجمع المنصة بيانات مثل الاسم ورقم الهاتف والبريد الإلكتروني ومحتوى الرسالة.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">2) لماذا نستخدمها</h2>
            <p>نستخدم البيانات للرد على الرسائل، تنفيذ التفعيل، وتحسين تجربة المستخدم.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">3) مشاركة البيانات</h2>
            <p>لا نبيع بياناتك. قد نشارك الحد الأدنى المطلوب فقط لأغراض تشغيل الخدمة عند الحاجة.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">4) الكوكيز</h2>
            <p>قد نستخدم كوكيز تقنية ضرورية لتشغيل الموقع بشكل صحيح (مثل حفظ المظهر/اللغة).</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">5) التواصل</h2>
            <p>لأي استفسار بخصوص الخصوصية تواصل معنا عبر صفحة التواصل.</p>
          </>
        ) : (
          <>
            <p>We respect your privacy. This policy explains what we may collect and why.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">1) Data we may collect</h2>
            <p>When you contact us, we may receive your name, phone, email, and the message content.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">2) Why we use it</h2>
            <p>To respond, process activation, and improve user experience.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">3) Sharing</h2>
            <p>We don’t sell your data. Minimal sharing may occur for service operation if needed.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">4) Cookies</h2>
            <p>We may use essential cookies to keep the site working properly (saving theme/language).</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">5) Contact</h2>
            <p>Questions? Contact us via the Contact page.</p>
          </>
        )}
      </div>
    </Container>
  );
}
