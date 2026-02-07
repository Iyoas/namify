import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "nl"];
const DEFAULT_LANG = "en";
const NL_COUNTRY_CODE = "NL";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const country = request.geo?.country;
  const preferredLang =
    country && country.toUpperCase() === NL_COUNTRY_CODE ? "nl" : DEFAULT_LANG;

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLang}`;
    return NextResponse.redirect(url);
  }

  const firstSegment = pathname.split("/")[1];
  if (SUPPORTED_LANGS.includes(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLang}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|images|icons).*)",
  ],
};
