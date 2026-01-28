// src/lib/domainr.ts
//
// Domain availability helpers for the Fastly / Domainr "Status" API.
//
// We keep everything on the server-side (Flow A) so that your API token
// never leaks to the client. This module is used by the /api/generate-domain
// route to enrich GPT-generated names with real TLD availability info.



function getDomainrConfig() {
  const token = process.env.DOMAINR_API_TOKEN;
  const baseUrl =
    process.env.DOMAINR_BASE_URL ||
    "https://api.fastly.com/domain-management/v1/tools/status";

  if (!token) {
    // In development it's handig om dit te zien; in productie kun je dit weghalen.
    console.warn(
      "[domainr] DOMAINR_API_TOKEN is not set. Availability checks will fail."
    );
  }

  return { token, baseUrl };
}

// Simple in-memory cache to speed up repeated checks (best-effort; resets on server restart).
// TTL is configurable via env; defaults to 10 minutes.
const AVAILABILITY_CACHE_TTL_MS =
  (Number.parseInt(process.env.AVAILABILITY_CACHE_TTL_MS || "600000", 10) || 600000);

type AftermarketOffer = {
  vendor: string;
  price?: number | string;
  currency?: string;
  raw: unknown;
};

type CacheEntry = {
  status: DomainAvailabilityStatus;
  raw?: unknown;
  aftermarketOffer?: AftermarketOffer;
  expiresAt: number;
};
const availabilityCache = new Map<string, CacheEntry>();

function getCached(domain: string): CacheEntry | null {
  const entry = availabilityCache.get(domain);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    availabilityCache.delete(domain);
    return null;
  }
  return entry;
}

function setCached(
  domain: string,
  status: DomainAvailabilityStatus,
  raw?: unknown,
  aftermarketOffer?: AftermarketOffer
) {
  availabilityCache.set(domain, {
    status,
    raw,
    aftermarketOffer,
    expiresAt: Date.now() + AVAILABILITY_CACHE_TTL_MS,
  });
}

function makeAbortSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

/**
 * Interne status die de rest van de app begrijpt.
 */
export type DomainAvailabilityStatus =
  | "available"
  | "unavailable"
  | "aftermarket"
  | "unknown";

/**
 * Resultaat voor één volledig domein (bijv. "festivo.nl").
 */
export type DomainCheckResult = {
  domain: string;
  status: DomainAvailabilityStatus;
  raw?: unknown;
  aftermarketOffer?: AftermarketOffer;
};

/**
 * Normaliseer de ruwe `status` string van de Domainr Status API
 * naar onze eigen enum.
 *
 * Beschikbaarheid wordt bepaald op basis van de statusflags in vaste volgorde:
 * - "inactive" => beschikbaar (ook als "premium" aanwezig is).
 * - "active" + GoDaddy offer => aftermarket.
 * - "active" of andere unavailable-markers => niet beschikbaar.
 * - "unknown" of onherkend => onbekend.
 */
function getGoDaddyAftermarketOffer(raw: any): AftermarketOffer | null {
  const offers = Array.isArray(raw?.offers) ? raw.offers : [];
  const offer = offers.find(
    (entry: any) => typeof entry?.vendor === "string" && entry.vendor === "am.godaddy.com"
  );

  if (!offer) return null;

  const price =
    typeof offer?.price === "number" || typeof offer?.price === "string"
      ? offer.price
      : undefined;
  const currency = typeof offer?.currency === "string" ? offer.currency : undefined;

  return {
    vendor: offer.vendor,
    price,
    currency,
    raw: offer,
  };
}

function normalizeStatusFromStatusString(
  rawStatus: string | undefined,
  rawResponse?: unknown
): { status: DomainAvailabilityStatus; aftermarketOffer?: AftermarketOffer } {
  if (!rawStatus) return { status: "unknown" };

  const statusWords = rawStatus.toLowerCase().split(/\s+/).filter(Boolean);

  // 1) AVAILABLE: only when "inactive" is present (even if "premium").
  if (statusWords.includes("inactive")) {
    return { status: "available" };
  }

  // 2) AFTERMARKET: active + GoDaddy aftermarket offer.
  const hasActive = statusWords.includes("active");
  if (hasActive) {
    const offer = getGoDaddyAftermarketOffer(rawResponse);
    if (offer) {
      return { status: "aftermarket", aftermarketOffer: offer };
    }
  }

  // 3) UNAVAILABLE: active or other unavailability markers.
  const unavailableMarkers = [
    "active",
    "parked",
    "reserved",
    "claimed",
    "marketed",
    "priced",
    "dpml",
    "disallowed",
    "deleting",
    "expiring",
    "invalid",
  ];

  if (statusWords.some((word) => unavailableMarkers.includes(word))) {
    return { status: "unavailable" };
  }

  // 4) UNKNOWN: explicitly unknown or unrecognized status.
  if (statusWords.includes("unknown")) {
    return { status: "unknown" };
  }

  return { status: "unknown" };
}

/**
 * Bouw volledig gekwalificeerde domeinen op basis van namen en TLD's.
 *
 * Voorbeeld:
 *  names = ["Festivo", "Jubilo"]
 *  tlds  = [".com", ".nl"]
 *  => ["festivo.com", "festivo.nl", "jubilo.com", "jubilo.nl"]
 */
export function buildDomainsFromNames(names: string[], tlds: string[]): string[] {
  const cleanedNames = names
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) =>
      name
        .toLowerCase()
        // zelfde normalisatie als in de UI: alleen a-z0-9
        .replace(/[^a-z0-9]/gi, "")
    )
    .filter(Boolean);

  const domains: string[] = [];

  for (const name of cleanedNames) {
    for (const tld of tlds) {
      const suffix = tld.startsWith(".") ? tld : `.${tld}`;
      domains.push(`${name}${suffix}`);
    }
  }

  return domains;
}

/**
 * Roept de Fastly / Domainr Status API aan voor een lijst domeinen.
 *
 * Volgens de documentatie:
 * - Methode: GET
 * - Endpoint: /domain-management/v1/tools/status
 * - Query params:
 *     - domain: de volledige domeinnaam
 *     - scope: "precise" voor gedetailleerde beschikbaarheid
 * - Headers:
 *     - Fastly-Key: jouw API token
 *     - Accept: application/json
 */
async function checkDomainAvailabilityWithDomainr(
  domains: string[]
): Promise<DomainCheckResult[]> {
  const { token, baseUrl } = getDomainrConfig();

  if (!token) {
    throw new Error("DOMAINR_API_TOKEN is not configured.");
  }

  if (!domains.length) {
    return [];
  }

  // PARALLEL EXECUTION (worker pool)
  // Higher concurrency makes checks noticeably faster, especially for many domains.
  // You can tune via env without code changes.
  const requestedConcurrency =
    Number.parseInt(process.env.DOMAINR_CONCURRENCY || "40", 10) || 40;

  // Safety cap to avoid accidental overload / throttling
  const CONCURRENCY = Math.min(50, Math.max(1, requestedConcurrency));

  const allResults: DomainCheckResult[] = new Array(domains.length);

  const checkOne = async (domain: string): Promise<DomainCheckResult> => {
    try {
      const requestTimeoutMs =
        Number.parseInt(process.env.DOMAINR_FETCH_TIMEOUT_MS || "3000", 10) || 3000;

      // Cache hit: return instantly.
      const cached = getCached(domain);
      if (cached) {
      return {
        domain,
        status: cached.status,
        raw: cached.raw,
        aftermarketOffer: cached.aftermarketOffer,
      };
    }

      const url = new URL(baseUrl);
      url.searchParams.set("domain", domain);
      url.searchParams.set("scope", "precise");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Fastly-Key": token,
          Accept: "application/json",
        },
        signal: makeAbortSignal(requestTimeoutMs),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error(
          "[domainr] Request failed for",
          domain,
          "status:",
          response.status,
          text
        );
        setCached(domain, "unknown");
        return { domain, status: "unknown" as DomainAvailabilityStatus };
      }

      const json = (await response.json()) as any;
      const rawStatus = typeof json?.status === "string" ? json.status : undefined;
      const normalized = normalizeStatusFromStatusString(rawStatus, json);

      setCached(domain, normalized.status, json, normalized.aftermarketOffer);
      return {
        domain,
        status: normalized.status,
        raw: json,
        aftermarketOffer: normalized.aftermarketOffer,
      };
    } catch (err) {
      console.error("[domainr] Error checking", domain, err);
      setCached(domain, "unknown");
      return { domain, status: "unknown" as DomainAvailabilityStatus };
    }
  };

  let cursor = 0;
  const workers = new Array(Math.min(CONCURRENCY, domains.length)).fill(0).map(async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= domains.length) return;
      allResults[idx] = await checkOne(domains[idx]);
    }
  });

  await Promise.all(workers);
  return allResults;
}

export async function checkDomainAvailability(
  domains: string[]
): Promise<DomainCheckResult[]> {
  // Domainr/Fastly only
  return await checkDomainAvailabilityWithDomainr(domains);
}

/**
 * Convenience helper voor je API-route:
 *
 * - Neemt GPT-gegenereerde namen en een lijst TLD's
 * - Bouwt domeinnamen (festivo.com, festivo.nl, ...)
 * - Roept de Status API aan
 * - Returned een map:
 *
 * {
 *   festivo: { ".com": "available", ".nl": "unavailable" },
 *   jubilo:  { ".com": "unknown",   ".nl": "available"   }
 * }
 */
export async function checkAvailabilityForNames(
  names: string[],
  tlds: string[]
): Promise<Record<string, Record<string, DomainAvailabilityStatus>>> {
  const domains = buildDomainsFromNames(names, tlds);
  const checks = await checkDomainAvailability(domains);

  const map: Record<string, Record<string, DomainAvailabilityStatus>> = {};

  for (const { domain, status } of checks) {
    const parts = domain.split(".");
    if (parts.length < 2) continue;

    const namePart = parts[0];
    const tldPart = `.${parts.slice(1).join(".")}`;

    // Zelfde normalisatie als bij buildDomainsFromNames en de UI
    const nameKey = namePart
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "");

    if (!nameKey) continue;

    if (!map[nameKey]) {
      map[nameKey] = {};
    }

    map[nameKey][tldPart] = status;
  }

  return map;
}
