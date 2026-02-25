const CJ_CLICK_BASE = "https://www.kqzyfj.com/click-101626959-11774111?url=";
const GODADDY_SEARCH_BASE_URL =
  "https://www.godaddy.com/domainsearch/find?domainToCheck=";

export function buildGoDaddySearchUrl(domain?: string): string {
  const godaddyUrl = `${GODADDY_SEARCH_BASE_URL}${domain ?? ""}`;
  const encoded = encodeURIComponent(godaddyUrl);
  const affiliateUrl = `${CJ_CLICK_BASE}${encoded}`;
  console.log("[CJ] buildGoDaddySearchUrl()", {
    domain,
    godaddyUrl,
    encoded,
    affiliateUrl,
  });
  return affiliateUrl;
}
