import type { MetadataRoute } from "next";
const DEFAULT_SITE_URL = "https://www.domifai.com";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: sitemapUrl,
    host: baseUrl,
  };
}
