import type { MetadataRoute } from "next";
import { SUPPORTED_LANGS } from "@/config/i18n";

const DEFAULT_SITE_URL = "https://www.domifai.com";

const STATIC_PATHS = [
  "",
  "/tools/domain-checker",
  "/tools/domain-generator",
  "/tools/domain-generator/generator",
  "/tools/domain-generator/liked-names",
  "/tools/domain-generator/niches",
  "/tools/domain-generator/register-domain",
  "/tools/domain-generator/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  const now = new Date();

  const entries = SUPPORTED_LANGS.flatMap((lang) =>
    STATIC_PATHS.map((path) => ({
      url: new URL(`/${lang}${path}`, baseUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }))
  );

  return entries;
}
