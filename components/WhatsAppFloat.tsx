import Link from "next/link";
import { social } from "@/lib/social";

export function WhatsAppFloat() {
  return (
    <Link
      href={social.whatsappWaMe}
      target="_blank"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-accent/50 dark:bg-brand-500"
      aria-label="WhatsApp"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 11.9a8 8 0 0 1-11.6 7.2L4 20l1-4.2A8 8 0 1 1 20 11.9Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M8.8 9.6c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.3l.7 1.7c.1.3.1.5 0 .7l-.3.4c-.1.2-.2.3 0 .5.2.4.8 1.3 1.7 2 .9.7 1.6 1 2 1.1.2.1.3 0 .4-.1l.6-.7c.1-.2.3-.2.6-.1l1.8.8c.3.1.4.3.4.5 0 .2-.2 1-.8 1.5-.6.5-1.2.5-1.5.5-.3 0-1.9-.3-3.6-1.8-1.9-1.6-3.1-3.6-3.2-3.9-.1-.3-.7-1.7-.7-2.6 0-.9.5-1.4.7-1.7Z" fill="white"/>
        </svg>
      </span>
      {social.whatsappNumberLocal}
    </Link>
  );
}
