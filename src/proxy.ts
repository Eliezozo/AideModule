// src/proxy.ts — remplace middleware (déprécié Next.js 16)
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get(DEMO_SESSION_COOKIE)?.value;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isProtected =
    pathname.startsWith("/student") ||
    pathname.startsWith("/tutor") ||
    pathname.startsWith("/admin");

  if (!session && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/student/dashboard";
    return NextResponse.redirect(url);
  }

  if (session && pathname.startsWith("/admin")) {
    try {
      const payload = JSON.parse(session) as { role?: string };
      if (payload.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/student/dashboard";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
