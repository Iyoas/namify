import type { Lang } from "@/config/i18n";

const GODADDY_BASE_URL =
  "https://www.godaddy.com/domainsearch/find?domainToCheck=";
const HOSTNET_BASE_URL =
  "https://www.hostnet.nl/domeinnaam-registreren?domain=";
const HOSTNET_ANCHOR = "#/domeinnaam";

export function getRegistrarUrl(domain: string, lang: Lang): string {
  const encodedDomain = encodeURIComponent(domain);
  if (lang === "nl") {
    return `${HOSTNET_BASE_URL}${encodedDomain}${HOSTNET_ANCHOR}`;
  }

  return `${GODADDY_BASE_URL}${encodedDomain}`;
}
