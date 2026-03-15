import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isAppSubdomain = host.startsWith("app.");

  if (isAppSubdomain) {
    const pathname = request.nextUrl.pathname;
    const newPath = pathname === "/" ? "/app/dashboard" : `/app${pathname}`;
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|public/).*)",
  ],
};
