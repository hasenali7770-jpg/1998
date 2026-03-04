"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, locales } from "@/lib/i18n";

function getSwitchedPath(pathname: string, to: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${to}`;
  if (locales.includes(parts[0] as Locale)) parts[0] = to;
  return "/" + parts.join("/");
}

export function LocaleSwitch({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-walnut-700 dark:text-sand-200">{label}</span>
      {locales.map((l) => (
        <Link key={l} href={getSwitchedPath(pathname || `/${current}`, l)}
          className={`rounded-full px-3 py-1 text-xs transition ${l===current
            ? "bg-walnut-800 text-sand-50 dark:bg-sand-200 dark:text-walnut-900"
            : "bg-sand-100 text-walnut-800 hover:bg-sand-200 dark:bg-walnut-800 dark:text-sand-100 dark:hover:bg-walnut-700"}`}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
