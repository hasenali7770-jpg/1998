"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";
import { social } from "@/lib/social";

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);
  const [sent, setSent] = useState(false);

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold text-ink dark:text-night-text">{tr.contactTitle}</h1>
      <p className="mt-2 text-sm leading-7 text-muted dark:text-night-muted">{tr.contactNote}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-stroke bg-white p-7 shadow-soft dark:border-night-stroke dark:bg-night-surface">
          <div className="text-sm font-semibold text-ink dark:text-night-text">{locale === "ar" ? "روابط مباشرة" : "Direct links"}</div>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href={social.whatsappWaMe} target="_blank" className="rounded-2xl bg-bg px-4 py-3 font-semibold text-ink hover:opacity-90 dark:bg-night-bg dark:text-night-text">
              WhatsApp: {social.whatsappNumberLocal}
            </Link>
            <Link href={social.instagram} target="_blank" className="rounded-2xl bg-bg px-4 py-3 font-semibold text-ink hover:opacity-90 dark:bg-night-bg dark:text-night-text">
              Instagram
            </Link>
            <Link href={social.facebook} target="_blank" className="rounded-2xl bg-bg px-4 py-3 font-semibold text-ink hover:opacity-90 dark:bg-night-bg dark:text-night-text">
              Facebook
            </Link>
            <Link href={`mailto:${social.email}`} className="rounded-2xl bg-bg px-4 py-3 font-semibold text-ink hover:opacity-90 dark:bg-night-bg dark:text-night-text">
              Email: {social.email}
            </Link>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-3xl border border-stroke bg-white p-7 shadow-soft dark:border-night-stroke dark:bg-night-surface"
        >
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-ink dark:text-night-text">{locale === "ar" ? "الاسم" : "Name"}</label>
            <input className="rounded-2xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 dark:border-night-stroke dark:bg-night-bg dark:text-night-text" />
            <label className="text-sm font-semibold text-ink dark:text-night-text">{locale === "ar" ? "رقم الهاتف (اختياري)" : "Phone (optional)"}</label>
            <input className="rounded-2xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 dark:border-night-stroke dark:bg-night-bg dark:text-night-text" />
            <label className="text-sm font-semibold text-ink dark:text-night-text">{locale === "ar" ? "الرسالة" : "Message"}</label>
            <textarea className="min-h-[140px] rounded-2xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 dark:border-night-stroke dark:bg-night-bg dark:text-night-text" />
            <button className="mt-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95">
              {locale === "ar" ? "إرسال" : "Send"}
            </button>
          </div>
          {sent && (
            <div className="mt-4 rounded-2xl bg-bg p-4 text-sm text-ink dark:bg-night-bg dark:text-night-text">
              {locale === "ar" ? "تم الإرسال (نموذج تجريبي). نربطه لاحقاً مع بريد/واتساب." : "Sent (demo). Connect to email/WhatsApp later."}
            </div>
          )}
        </form>
      </div>
    </Container>
  );
}
