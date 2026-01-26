const DYNADOT_SEARCH_BASE_URL = "https://www.dynadot.com/domain/search";
const SOURCE_PARAM = "rscreg";
const DOMAIN_PARAM = "domain";
const DEFAULT_SOURCE_TAG = "i_g_2026113153239";

export function getDynadotSourceTag(): string | null {
  const tag = process.env.NEXT_PUBLIC_DYNADOT_SOURCE_TAG;
  if (tag && tag.trim()) return tag.trim();
  return DEFAULT_SOURCE_TAG;
}

export function buildDynadotSearchUrl(domain?: string): string {
  const url = new URL(DYNADOT_SEARCH_BASE_URL);
  const sourceTag = getDynadotSourceTag();
  if (sourceTag) {
    url.searchParams.set(SOURCE_PARAM, sourceTag);
  }
  if (domain) {
    url.searchParams.set(DOMAIN_PARAM, domain);
  }
  return url.toString();
}
