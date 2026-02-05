import type { Lang } from "@/config/i18n";
import { buildGoDaddySearchUrl } from "@/lib/affiliate/godaddy";

export function getRegistrarUrl(domain: string, _lang: Lang): string {
  const registrarUrl = buildGoDaddySearchUrl(domain);
  console.log("[CJ] getRegistrarUrl()", { domain, out: registrarUrl });
  return registrarUrl;
}
