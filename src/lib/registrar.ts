import type { Lang } from "@/config/i18n";
import { buildGoDaddySearchUrl } from "@/lib/affiliate/godaddy";

export function getRegistrarUrl(domain: string, _lang: Lang): string {
  return buildGoDaddySearchUrl(domain);
}
