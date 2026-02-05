const GODADDY_AFFILIATE_BASE_URL = "https://click.godaddy.com/affiliate?isc=cjcfos3&url=";
const GODADDY_SEARCH_BASE_URL =
  "https://www.godaddy.com/domainsearch/find?domainToCheck=";
const GODADDY_ELB_DAYS_PARAM = "&cjelbDays=45";

export function buildGoDaddySearchUrl(domain?: string): string {
  const godaddyUrl = `${GODADDY_SEARCH_BASE_URL}${domain ?? ""}`;
  const encoded = encodeURIComponent(godaddyUrl);
  const affiliateUrl = `${GODADDY_AFFILIATE_BASE_URL}${encoded}${GODADDY_ELB_DAYS_PARAM}`;
  console.log("[CJ] buildGoDaddySearchUrl()", {
    domain,
    godaddyUrl,
    encoded,
    affiliateUrl,
  });
  return affiliateUrl;
}
