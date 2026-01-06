import { NextRequest, NextResponse } from "next/server";

const VALID_LANGS = ["nl", "en"] as const;
const FILE_EXT_REGEX = /\.[a-z0-9]+$/i;

function getCountry(req: NextRequest) {
  return (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    ""
  ).toUpperCase();
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    FILE_EXT_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && VALID_LANGS.includes(firstSegment as (typeof VALID_LANGS)[number])) {
    return NextResponse.next();
  }

  const country = getCountry(req);
  const lang = country === "NL" ? "nl" : "en";
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  redirectUrl.search = search;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: "/:path*",
};
