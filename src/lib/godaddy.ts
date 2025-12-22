// src/lib/godaddy.ts
//
// GoDaddy OTE Availability API helper (server-side only).

import type { DomainCheckResult, DomainAvailabilityStatus } from "./domainr";

function getGoDaddyConfig() {
  const key = process.env.GODADDY_API_KEY;
  const secret = process.env.GODADDY_API_SECRET;
  const baseUrl = process.env.GODADDY_BASE_URL || "https://api.ote-godaddy.com";

  if (!key || !secret) {
    throw new Error("Missing GoDaddy credentials.");
  }

  return { key, secret, baseUrl };
}

function normalizeGoDaddyStatus(
  available: boolean | undefined
): DomainAvailabilityStatus {
  if (available === true) return "available";
  if (available === false) return "unavailable";
  return "unknown";
}

export async function checkDomainAvailabilityWithGoDaddy(
  domains: string[]
): Promise<DomainCheckResult[]> {
  if (!domains.length) return [];

  const { key, secret, baseUrl } = getGoDaddyConfig();
  const MAX_BATCH_CONCURRENCY = 3;

  const batches: string[][] = [];
  for (const domain of domains) {
    batches.push([domain]);
  }

  const runBatch = async (batch: string[]) => {
    const domain = batch[0];
    const url = new URL("/v1/domains/available", baseUrl);
    url.searchParams.set("domain", domain);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `sso-key ${key}:${secret}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `[godaddy] Request failed (${response.status}) ${text}`.trim()
      );
    }

    const json = (await response.json()) as { available?: boolean } | null;

    return [
      {
        domain,
        status: normalizeGoDaddyStatus(json?.available),
        raw: json,
      },
    ];
  };

  const allResults: DomainCheckResult[] = [];

  for (let i = 0; i < batches.length; i += MAX_BATCH_CONCURRENCY) {
    const slice = batches.slice(i, i + MAX_BATCH_CONCURRENCY);
    const results = await Promise.all(slice.map(runBatch));
    results.forEach((batchResults) => allResults.push(...batchResults));
  }

  console.info("[availability] GoDaddy API used");

  return allResults;
}
