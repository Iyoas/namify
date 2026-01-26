import { NextRequest, NextResponse } from "next/server";
import { checkAvailabilityForNames } from "@/lib/domainr";

type CheckAvailabilityBody = {
  names?: string[];
  tlds?: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckAvailabilityBody;
    const names = Array.isArray(body?.names)
      ? body.names.filter((name) => typeof name === "string" && name.trim())
      : [];
    const tlds = Array.isArray(body?.tlds)
      ? body.tlds.filter((tld) => typeof tld === "string" && tld.trim())
      : [];

    if (!names.length || !tlds.length) {
      return NextResponse.json(
        { error: "Missing names or tlds." },
        { status: 400 }
      );
    }

    const availability = await checkAvailabilityForNames(names, tlds);

    return NextResponse.json(
      {
        availability,
        count: names.length,
        tlds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[check-availability] API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
