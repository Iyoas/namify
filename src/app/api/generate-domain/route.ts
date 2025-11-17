// src/app/api/generate-domain/route.ts
import { NextResponse } from "next/server";

// Simpele placeholder API route.
// Later kun je hier je echte OpenAI-call in bouwen.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const niche = body.niche ?? "brand";
    const keywords = body.keywords ?? "";

    const ideas = [
      `${niche}ly`,
      `${niche}io`,
      `${(niche as string).toLowerCase()}hub`,
    ];

    return NextResponse.json(
      {
        ok: true,
        ideas,
        niche,
        keywords,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("generate-domain error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Optioneel kun je ook een GET handler doen (handig om te testen in de browser)
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: "generate-domain API is working",
    },
    { status: 200 }
  );
}
