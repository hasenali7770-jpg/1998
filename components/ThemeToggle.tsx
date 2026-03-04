"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ label, light, dark }: { label: string; light: string; dark: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === "dark";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-walnut-700 dark:text-sand-200">{label}</span>
      <button onClick={() => setTheme(isDark ? "light" : "dark")}
        className="rounded-full bg-sand-100 px-3 py-1 text-xs text-walnut-800 shadow-sm transition hover:bg-sand-200 dark:bg-walnut-800 dark:text-sand-100 dark:hover:bg-walnut-700"
        aria-label="Toggle theme">
        {isDark ? dark : light}
      </button>
    </div>
  );
}
