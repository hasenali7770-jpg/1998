"use client";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";

function looksLikeCode(code: string) { return /^ALN-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(code.trim()); }

export default function ActivatePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold">{tr.activation.title}</h1>
      <p className="mt-2 text-sm leading-7 text-muted dark:text-night-muted">{tr.activation.subtitle}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-stroke bg-white p-7 shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <label className="text-sm font-semibold">{tr.activation.label}</label>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ALN-1A2B-3C4D"
            className="mt-2 w-full rounded-2xl border border-stroke bg-sand-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-walnut-500 dark:border-night-stroke dark:bg-brand" />
          <button onClick={() => {
              if (!looksLikeCode(code)) { setMsg(locale==="ar" ? "الكود غير صحيح. مثال: ALN-1A2B-3C4D" : "Invalid code. Example: ALN-1A2B-3C4D"); return; }
              setMsg(tr.activation.success);
            }}
            className="mt-4 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-sand-50 dark:bg-bg dark:text-ink">
            {tr.activation.button}
          </button>
          {msg && <div className="mt-4 rounded-2xl bg-bg p-4 text-sm text-ink dark:bg-walnut-800 dark:text-sand-50">{msg}</div>}
          <div className="mt-4 text-xs leading-6 text-walnut-600 dark:text-sand-300">{tr.activation.hint}</div>
        </div>

        <div className="rounded-3xl border border-stroke bg-white p-7 text-sm leading-8 text-muted shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
          {locale==="ar" ? (
            <>
              <div className="font-semibold text-ink dark:text-night-text">طريقة الدفع</div>
              <div className="mt-3">1) اختر الكورس من صفحة الدورات</div>
              <div>2) حوّل المبلغ عبر Qi Card أو Zain Cash</div>
              <div>3) أرسل إثبات التحويل للإدارة</div>
              <div>4) تستلم كود تفعيل (مثال: ALN-1A2B-3C4D)</div>
              <div>5) أدخل الكود هنا لفتح الكورس</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-sand-100">How to pay</div>
              <div className="mt-3">1) Pick a course</div>
              <div>2) Pay via Qi Card or Zain Cash</div>
              <div>3) Send proof to admin</div>
              <div>4) Receive a code (e.g., ALN-1A2B-3C4D)</div>
              <div>5) Enter it here to unlock</div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
