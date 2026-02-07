import { NextRequest, NextResponse } from "next/server";
import { checkAvailabilityForNames } from "@/lib/domainr";
import { detectPrimaryTldFromHeaders } from "@/lib/geo";

type CheckDomainBody = {
  name?: string;
  tlds?: string[];
};

const FIXED_TLDS = [".net", ".shop", ".ai", ".io"];

function normalizeNameKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/gi, "");
}

function normalizeTld(value: string): string {
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith(".") ? trimmed : `.${trimmed}`;
}

function parseSingleInput(raw: string): { base: string; inputTld: string | null } {
  const trimmed = raw.trim();
  if (!trimmed) return { base: "", inputTld: null };

  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot > 0 && lastDot < trimmed.length - 1) {
    const tldCandidate = trimmed.slice(lastDot + 1).trim();
    if (/^[a-z]{2,15}$/i.test(tldCandidate)) {
      const base = normalizeNameKey(trimmed.slice(0, lastDot));
      const inputTld = normalizeTld(tldCandidate);
      return { base, inputTld };
    }
  }

  return { base: normalizeNameKey(trimmed), inputTld: null };
}

function dedupeTlds(tlds: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tld of tlds) {
    const normalized = normalizeTld(tld);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckDomainBody;
    const rawName = body.name?.trim() ?? "";
    const { base, inputTld } = parseSingleInput(rawName);

    if (!base) {
      return NextResponse.json({ error: "Missing name." }, { status: 400 });
    }

    const primaryTld = detectPrimaryTldFromHeaders(req.headers);
    const orderedTlds = dedupeTlds([
      ...(inputTld ? [inputTld] : []),
      ...(primaryTld === ".com" ? [".com"] : [primaryTld, ".com"]),
      ...FIXED_TLDS,
    ]);

    const availability = await checkAvailabilityForNames([base], orderedTlds);
    const nameKey = normalizeNameKey(base);
    const map = availability[nameKey] ?? {};

    const results = orderedTlds.map((tld) => {
      const tldWithDot = normalizeTld(tld);
      const domain = `${base}${tldWithDot}`;
      const status = map[tldWithDot] ?? "unknown";
      return { domain, tld: tldWithDot, status };
    });

    return NextResponse.json({ results, tlds: orderedTlds }, { status: 200 });
  } catch (error) {
    console.error("[check-domain] API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
