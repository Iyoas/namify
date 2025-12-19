import { NextRequest, NextResponse } from "next/server";
import { checkAvailabilityForNames } from "@/lib/domainr";

type CheckDomainBody = {
  name?: string;
  tlds?: string[];
};

function normalizeNameKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/gi, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckDomainBody;
    const name = body.name?.trim() ?? "";
    const tlds = Array.isArray(body.tlds)
      ? body.tlds.filter((tld) => typeof tld === "string" && tld.trim().length > 0)
      : [];

    if (!name || tlds.length === 0) {
      return NextResponse.json(
        { error: "Missing name or tlds." },
        { status: 400 }
      );
    }

    const availability = await checkAvailabilityForNames([name], tlds);
    const nameKey = normalizeNameKey(name);
    const map = availability[nameKey] ?? {};

    const results = tlds.map((tld) => {
      const tldWithDot = tld.startsWith(".") ? tld : `.${tld}`;
      const domain = `${name.toLowerCase()}${tldWithDot}`;
      const status = map[tldWithDot] ?? "unknown";
      return { domain, tld: tldWithDot, status };
    });

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("[check-domain] API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
