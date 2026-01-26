import type { Lang } from "@/config/i18n";
import { buildDynadotSearchUrl } from "@/lib/affiliate/dynadot";

export function getRegistrarUrl(domain: string, _lang: Lang): string {
  return buildDynadotSearchUrl(domain);
}
