const GODADDY_AFFILIATE_BASE_URL =
  "https://click.godaddy.com/affiliate?isc=cjcfos3&url=https://www.godaddy.com/domainsearch/find?domainToCheck=";
const GODADDY_ELB_DAYS_PARAM = "&cjelbDays=45";

export function buildGoDaddySearchUrl(domain?: string): string {
  return `${GODADDY_AFFILIATE_BASE_URL}${domain ?? ""}${GODADDY_ELB_DAYS_PARAM}`;
}
