import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";

export default function TermsPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold text-ink dark:text-night-text">{tr.nav.terms}</h1>
      <div className="mt-6 rounded-3xl border border-stroke bg-white p-7 text-sm leading-8 text-ink/80 shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
        {locale === "ar" ? (
          <>
            <p>
              باستخدامك لمنصة <b>{tr.brand}</b> فأنت توافق على الشروط التالية. تم كتابة هذه البنود لحماية الطرفين وتنظيم تجربة التعلم.
            </p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">1) الحساب والوصول</h2>
            <p>الوصول للمحتوى يتم بعد الدفع واستلام كود التفعيل. الاشتراك يفتح كورس واحد فقط لمدة الاشتراك حسب الخطة المختارة.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">2) الدفع والتفعيل</h2>
            <p>الدفع حالياً عبر Qi Card و Zain Cash. التفعيل يدوي لتحسين الأمان وتقليل إساءة الاستخدام، وقد يتطلب وقت مراجعة.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">3) الاستخدام العادل</h2>
            <p>يمنع مشاركة الأكواد أو إعادة نشر المحتوى. المحتوى مخصص للاستخدام الشخصي فقط.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">4) إخلاء مسؤولية</h2>
            <p>المحتوى تعليمي/تطويري ولا يُعتبر بديلاً للاستشارة المتخصصة عند الحاجة.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">5) التعديلات</h2>
            <p>قد نقوم بتحديث الشروط أو الأسعار أو طريقة التفعيل عند الحاجة، وسيتم نشر النسخة المحدثة داخل الموقع.</p>
          </>
        ) : (
          <>
            <p>
              By using <b>{tr.brand}</b>, you agree to the following terms. These rules help protect both sides and keep the learning experience smooth.
            </p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">1) Account & access</h2>
            <p>Access is granted after payment and receiving an activation code. Subscriptions unlock one course only for the chosen duration.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">2) Payments & activation</h2>
            <p>Payments are currently via Qi Card and Zain Cash. Activation is manual to reduce fraud and misuse, and may require review time.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">3) Fair use</h2>
            <p>Do not share codes or redistribute content. Content is for personal use only.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">4) Disclaimer</h2>
            <p>This is educational content and not a substitute for professional advice when needed.</p>
            <h2 className="mt-6 text-sm font-semibold text-ink dark:text-night-text">5) Updates</h2>
            <p>We may update terms, pricing, or activation methods as needed, and the latest version will be posted on the site.</p>
          </>
        )}
      </div>
    </Container>
  );
}
