import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Zorg dat je OPENAI_API_KEY in .env.local staat
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Verwacht { prompt: string }." },
        { status: 400 }
      );
    }

    const rawPrompt = body.prompt.trim();

    if (!rawPrompt) {
      return NextResponse.json(
        { error: "Lege prompt kan niet verbeterd worden." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You rewrite short project or business descriptions so they work better for an AI domain name generator. You must ALWAYS keep the exact same language as the original text (never translate). Expand it into 1–3 natural, clear sentences that explain what it is, who it's for, and the value it provides. Do not use bullet points and do not wrap the output in quotation marks.",
        },
        {
          role: "user",
          content:
            "Rewrite the following description. Detect and keep the same language as the original (do not translate). Make it a clear, compelling, slightly expanded description (1–3 full sentences) that explains what it is, who it's for, and the value it provides.\n\nOriginal description:\n" +
            rawPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const enhancedPrompt =
      completion.choices[0]?.message?.content?.trim() || rawPrompt;

    return NextResponse.json(
      {
        prompt: enhancedPrompt,
        originalPrompt: rawPrompt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[enhance-prompt] ERROR:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het verbeteren van de prompt." },
      { status: 500 }
    );
  }
}
