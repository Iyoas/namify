import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  checkAvailabilityForNames,
  type DomainAvailabilityStatus,
} from "@/lib/domainr";

// IMPORTANT:
// Zorg dat je in .env.local dit hebt staan:
// OPENAI_API_KEY="sk-...."
// En nooit de key hardcoden in dit bestand.

function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const DEFAULT_VARIATION_COUNT = 5;

// Zelfde TLD-set als voor de hoofd-generator (pas aan als je daar iets anders hebt).
const DEFAULT_TLDS = [
  ".com",
  ".nl",
  ".io",
  ".ai",
  ".co",
  ".shop",
  ".net",
  ".biz",
  ".pro",
  ".edu",
  ".academy",
  ".school",
  ".org",
  ".info",
  ".global",
  ".world",
  ".tech",
  ".cloud",
  ".dev",
  ".social",
  ".me",
  ".fun",
  ".chat",
  ".media",
  ".live",
  ".consulting",
  ".show",
];

/**
 * Helper om de taal-specifieke hint op te bouwen.
 */
function buildLanguageHint(lang: string | undefined): string {
  if (lang === "nl") {
    return "Richt je op internationale, brandable namen die goed uitspreekbaar zijn in het Nederlands én Engels.";
  }
  if (lang === "es") {
    return "Genera nombres de marca internacionales que se pronuncien bien en español e inglés.";
  }
  return "Generate international, brandable names for a mostly English-speaking market.";
}

/**
 * Genereer variaties op een bestaande merknaam met GPT.
 * Deze functie retourneert ALLEEN de variaties; de originele naam voegen we
 * in de API-respons zelf toe als eerste element.
 */
async function generateVariationsForBaseName(
  baseName: string,
  lang: string | undefined,
  style?: string,
  maxVariations: number = DEFAULT_VARIATION_COUNT,
  client?: OpenAI,
): Promise<string[]> {
  const openaiClient = client ?? createOpenAIClient();
  const languageHint = buildLanguageHint(lang);
  const styleHint = style
    ? `De namen moeten duidelijk de volgende toon/stijl hebben: "${style}".`
    : "";

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Je bent een professionele naamgevings-assistent. Je genereert variaties op bestaande merknamen. Je antwoordt ALTIJD met geldige JSON met een 'variations'-array en GEEN extra tekst.",
      },
      {
        role: "user",
        content: `
We hebben al een bestaande merknaam:

"${baseName}"

${languageHint}
${styleHint}

Genereer ${maxVariations} sterke, merkwaardige variaties op deze naam.

Regels voor de variaties:
- Hou de variaties duidelijk verwant aan "${baseName}" (klank, vorm of woorddeel).
- Korte, brandable namen (idealiter 1–2 woorden, geen zinnen).
- Geen exacte herhaling van de oorspronkelijke naam.
- Geen domein-extensies zoals .com of .nl in de naam.
- Geen bestaande bekende merknamen of geregistreerde merken.
- Geen cijfers, geen koppeltekens.

Geef ALLEEN geldige JSON in precies dit formaat terug:

{
  "variations": ["Naam 1", "Naam 2", "Naam 3", "..."]
}
`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  let parsed: any = {};

  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error("[name-variations] Kon GPT-response niet parsen:", raw, e);
    return [];
  }

  const rawVariations = Array.isArray(parsed.variations)
    ? parsed.variations
    : [];

  // Schoonmaken en baseName uitsluiten
  const cleaned = rawVariations
    .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
    .filter(Boolean);

  const baseLower = baseName.trim().toLowerCase();

  const unique = Array.from(
    new Set(
      cleaned.filter((v: string) => v.toLowerCase() !== baseLower),
    ),
  ).slice(0, maxVariations);

  return unique as string[];
}

type NameVariationsResponse = {
  names: string[];
  availability: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
  count: number;
};

export async function POST(req: NextRequest) {
  try {
    const openaiClient = createOpenAIClient();
    const body = await req.json();
    const { baseName, lang, style, maxVariations } = body as {
      baseName?: string;
      lang?: string;
      style?: string;
      maxVariations?: number;
    };

    if (!baseName || baseName.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty baseName." },
        { status: 400 },
      );
    }

    const maxCount =
      typeof maxVariations === "number" && maxVariations > 0
        ? maxVariations
        : DEFAULT_VARIATION_COUNT;

    // 1) GPT: variaties genereren
    const variations = await generateVariationsForBaseName(
      baseName,
      lang,
      style,
      maxCount,
      openaiClient
    );

    let finalVariations = [...variations];

    // Fallback: always generate until we have at least 5 variations
    while (finalVariations.length < 5) {
      const needed = 5 - finalVariations.length;
      const extra = await generateVariationsForBaseName(
        baseName,
        lang,
        style,
        needed,
        openaiClient
      );

      // Prevent duplicates
      for (const v of extra) {
        if (!finalVariations.includes(v) && v.toLowerCase() !== baseName.toLowerCase()) {
          finalVariations.push(v);
        }
      }

      // Safety stop (should never trigger unless GPT fails repeatedly)
      if (extra.length === 0) break;
    }

    // Ensure exactly 5 variations (no more, no less)
    finalVariations = finalVariations.slice(0, 5);

    // 2) Namenlijst opbouwen: eerst de originele naam, dan de variaties
    const names = [baseName.trim(), ...finalVariations];

    // 3) Availability ophalen voor alle namen + TLDs
    const tlds = DEFAULT_TLDS;
    const availability = await checkAvailabilityForNames(names, tlds);

    console.log(
      "[name-variations][DEBUG] availability:",
      JSON.stringify(availability, null, 2)
    );

    console.log(
      "[name-variations][DEBUG] TLD list used:",
      JSON.stringify(tlds, null, 2)
    );

    console.log(
      "[name-variations][DEBUG] Names used for TLD checking:",
      JSON.stringify(names, null, 2)
    );

    // Print a clean table-like output for readability
    console.log("────────── TLD CHECK RESULTS ──────────");
    for (const name of names) {
      const key = name.toLowerCase().replace(/\s+/g, "");
      const row = availability[key];
      console.log(`→ ${name}:`);
      if (!row) {
        console.log("   (no availability data returned)");
        continue;
      }
      for (const tld of tlds) {
        const status = row[tld] || "missing";
        console.log(`   ${tld.padEnd(10)} → ${status}`);
      }
      console.log("--------------------------------------");
    }

    const response: NameVariationsResponse = {
      names,
      availability,
      tlds,
      count: names.length,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[name-variations] API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
