export type CountryCode = string; // normalized to "NL", "US", etc.
export type Tld = `.${string}`;

type HeaderInput = Headers | Record<string, string | string[] | undefined>;

type CountryTldMap = Record<CountryCode, Tld>;

const COUNTRY_TLD_MAP: CountryTldMap = {
  NL: ".nl",
  BE: ".be",
  DE: ".de",
  FR: ".fr",
  GB: ".uk",
  UK: ".uk",
  ES: ".es",
  IT: ".it",
  PT: ".pt",
  SE: ".se",
  NO: ".no",
  DK: ".dk",
  FI: ".fi",
  IE: ".ie",
  AT: ".at",
  CH: ".ch",
  PL: ".pl",
  CZ: ".cz",
  RO: ".ro",
  GR: ".gr",
  TR: ".tr",
  CA: ".ca",
  AU: ".com.au",
  NZ: ".nz",
  IN: ".in",
  BR: ".com.br",
  MX: ".com.mx",
  ZA: ".co.za",
};

const COUNTRY_HEADER_KEYS = [
  "x-vercel-ip-country",
  "x-vercel-country",
  "cf-ipcountry",
  "x-country-code",
];

function readHeader(headers: HeaderInput, key: string): string | null {
  if (headers instanceof Headers) {
    return headers.get(key);
  }

  const value = headers[key.toLowerCase()] ?? headers[key];

  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === "string" && entry.trim() !== "");
    return first ?? null;
  }

  return typeof value === "string" ? value : null;
}

function normalizeCountry(raw: string | null | undefined): CountryCode | null {
  if (!raw) {
    return null;
  }

  const value = raw.trim().toUpperCase();

  if (!value || value === "XX" || value === "UNKNOWN" || value === "-") {
    return null;
  }

  if (!/^[A-Z]{2}$/.test(value)) {
    return null;
  }

  return value;
}

export function getCountryFromHeaders(headers: HeaderInput): CountryCode | null {
  for (const key of COUNTRY_HEADER_KEYS) {
    const value = readHeader(headers, key);
    const normalized = normalizeCountry(value);

    if (normalized) {
      return normalized;
    }
  }

  return null;
}

export function getPrimaryTldForCountry(country: CountryCode | null | undefined): Tld {
  const normalized = normalizeCountry(country ?? null);

  if (normalized && COUNTRY_TLD_MAP[normalized]) {
    return COUNTRY_TLD_MAP[normalized];
  }

  return ".com";
}

export function movePrimaryTldFirst(tlds: string[], primaryTld: string): string[] {
  const index = tlds.indexOf(primaryTld);

  if (index === -1) {
    return tlds;
  }

  const next = tlds.filter((tld, idx) => tld !== primaryTld || idx === index);
  next.splice(index, 1);
  return [primaryTld, ...next];
}

export function detectPrimaryTldFromHeaders(headers: HeaderInput): Tld {
  const country = getCountryFromHeaders(headers);
  return getPrimaryTldForCountry(country);
}
