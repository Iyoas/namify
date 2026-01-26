import type { Lang } from "@/config/i18n";

export type TldCategoryId =
  | "all"
  | "popular"
  | "business"
  | "education"
  | "international"
  | "technology"
  | "social"
  | "professional"
  | "entertainment";

const COUNTRY_TLD_BY_LANG: Partial<Record<Lang, string>> = {
  nl: ".nl",
  en: ".com",
};

export function getCountryTld(lang: Lang): string {
  return COUNTRY_TLD_BY_LANG[lang] ?? ".com";
}

const TLD_SETS: Record<TldCategoryId, string[]> = {
  all: [".com", ".ai", ".net", ".shop", ".io"],
  popular: [".com", ".net", ".org", ".shop", ".info", ".agency"],
  business: [".shop", ".store", ".ceo", ".supply", ".agency", ".auction"],
  education: [".school", ".training", ".academy", ".courses", ".college", ".study"],
  international: [".global", ".world", ".eu", ".international", ".de", ".uk", ".fr"],
  technology: [".ai", ".io", ".tech", ".app", ".cloud", ".dev"],
  social: [".blog", ".social", ".me", ".tv", ".tube", ".live"],
  professional: [".pro", ".services", ".studio", ".design", ".ceo", ".consulting"],
  entertainment: [".art", ".music", ".photo", ".show", ".design", ".theatre"],
};

function dedupeTlds(tlds: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tld of tlds) {
    const normalized = tld.startsWith(".") ? tld : `.${tld}`;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

export function getTldsForCategory(category: TldCategoryId, lang: Lang): string[] {
  if (category === "all") {
    const countryTld = getCountryTld(lang);
    const rest = TLD_SETS.all.filter((tld) => tld !== countryTld);
    const base = dedupeTlds([countryTld, ...rest]);
    const fallbacks = [".eu", ".co"];
    for (const fallback of fallbacks) {
      if (base.length >= 6) break;
      if (!base.includes(fallback)) base.push(fallback);
    }
    return base.slice(0, 6);
  }
  return dedupeTlds(TLD_SETS[category]);
}

export const ALL_TLDS_SUPERSET = dedupeTlds(
  [
    ...TLD_SETS.all,
    ...TLD_SETS.popular,
    ...TLD_SETS.business,
    ...TLD_SETS.education,
    ...TLD_SETS.international,
    ...TLD_SETS.technology,
    ...TLD_SETS.social,
    ...TLD_SETS.professional,
    ...TLD_SETS.entertainment,
    ".nl",
    ".com",
    ".es",
    ".eu",
    ".co",
  ].flat()
);
