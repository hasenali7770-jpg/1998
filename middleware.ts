import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // استثناء المسار الحقيقي للوحة التحكم dashboard-israa
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/dashboard-israa") || 
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((l) => 
    pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/ar${pathname === "/" ? "" : pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = { 
  matcher: ["/((?!_next|api|dashboard-israa|.*\\..*).*)"] 
};
