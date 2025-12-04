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

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TARGET_COUNT = 8;
const MAX_ROUNDS = 3;
const NAMES_PER_ROUND = 16;
// Superset van alle TLD's die in de UI-filters (All, Popular, Technology, etc.) worden gebruikt.
// Zo hebben we in één keer availability voor alle categorieën, en hoeven we bij filteren geen extra API-calls meer te doen.
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
    return "Richt je op internationale, brandable namen die goed uitspreekbaar zijn in het Nederlands én Engels. Vermijd letterlijke Nederlandse samenstellingen zoals 'FeestFabriek' of 'PartyPlannerPro'.";
  }
  if (lang === "es") {
    return "Genera nombres de marca internacionales que se pronuncien bien en español e inglés.";
  }
  return "Generate international, brandable names for a mostly English-speaking market.";
}

/**
 * Helper om GPT-namen te genereren. We vragen per ronde om NAMES_PER_ROUND suggesties
 * en kunnen optioneel bestaande namen doorgeven die vermeden moeten worden.
 */
async function generateNamesWithGPT(
  prompt: string,
  lang: string | undefined,
  excludeNames: string[] = [],
  style?: string
): Promise<string[]> {
  const languageHint = buildLanguageHint(lang);
  const styleHint = style
    ? `\nToon en stijl van de namen: zorg dat de namen duidelijk de volgende toon hebben: "${style}". Pas creativiteit, woordkeuze en vibe hierop aan.`
    : "";

  const excludeBlock =
    excludeNames.length > 0
      ? `
Vermijd deze namen (of varianten hierop), ze zijn al voorgesteld of gebruikt:
${excludeNames.join(", ")}
`
      : "";

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Je bent een professionele merknaam- en domeinnaamgenerator voor startups en online bedrijven. Je geeft ALLEEN geldige JSON terug met een 'names'-array. De namen zijn kort, brandable, modern en internationaal inzetbaar.",
      },
      {
        role: "user",
        content: `
Gebruik de volgende beschrijving van het bedrijf of project:

"${prompt}"

${languageHint}
${styleHint}

Regels voor de namen:
- Genereer precies ${NAMES_PER_ROUND} unieke merk- en domeinnaamsuggesties
- Korte, brandable namen (idealiter 1–2, max 3 lettergrepen)
- Modern, premium en internationaal klinkend
- Geen letterlijke beschrijvende zinnen
- Geen generieke woorden zoals: planner, tracker, solutions, services, online, bedrijf, consulting
- Geen bestaande merknamen of merken van anderen
- Geen cijfers, geen koppeltekens
- Vermijd simpele Nederlandse samenstellingen als "FeestKalender" of "PartyPlannerPro"
- Maak nieuwe, creatieve combinaties of licht gemodificeerde woorden (zoals: Nexora, Lumiva, Zyntra, Avalyo)
${excludeBlock}

Geef ALLEEN geldige JSON terug in precies dit formaat:

{
  "names": ["Naam1", "Naam2", "Naam3", "..."]
}
`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error("[generate-domain] Kon GPT-response niet parsen:", raw, e);
    return [];
  }

  const names = Array.isArray(parsed.names) ? parsed.names : [];
  // Unieke, opgeschoonde namen
  return names
    .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
    .filter(Boolean);
}

/**
 * Zelfde normalisatie als in domainr.ts en DomainSelect:
 * lowercased en alleen a-z0-9.
 */
function normalizeNameKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, lang, style } = body as {
      prompt?: string;
      lang?: string;
      style?: string;
    };

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty prompt." },
        { status: 400 }
      );
    }

    const tlds = DEFAULT_TLDS;

    // Hier bewaren we alle 'goedgekeurde' namen + availability.
    const acceptedNames: string[] = [];
    const acceptedAvailability: Record<
      string,
      Record<string, DomainAvailabilityStatus>
    > = {};

    let round = 0;

    while (acceptedNames.length < TARGET_COUNT && round < MAX_ROUNDS) {
      round += 1;

      console.log(
        `[generate-domain] Ronde ${round} – huidige count: ${acceptedNames.length}/${TARGET_COUNT}`
      );

      // 1) Genereer nieuwe namen, met uitsluiting van al geaccepteerde namen
      const newNames = await generateNamesWithGPT(
        prompt,
        lang,
        acceptedNames,
        style
      );

      // Haal namen weg die we al hebben geaccepteerd
      const roundNames = newNames.filter(
        (name) => !acceptedNames.includes(name)
      );

      if (roundNames.length === 0) {
        console.warn(
          "[generate-domain] Geen nieuwe namen ontvangen in deze ronde."
        );
        continue;
      }

      // 2) Check availability voor deze ronde
      const availabilityMap = await checkAvailabilityForNames(
        roundNames,
        tlds
      );

      // 3) Per naam checken of er minstens 1 TLD 'available' is
      for (const name of roundNames) {
        if (acceptedNames.length >= TARGET_COUNT) break;

        const key = normalizeNameKey(name);
        const availabilityForName = availabilityMap[key];

        if (!availabilityForName) {
          continue;
        }

        const hasAvailableTld = Object.values(availabilityForName).some(
          (status) => status === "available"
        );

        if (!hasAvailableTld) {
          // Zoals Festivo: alles rood → overslaan
          continue;
        }

        // Alleen toevoegen als we 'm nog niet hebben
        if (!acceptedNames.includes(name)) {
          acceptedNames.push(name);
          acceptedAvailability[key] = availabilityForName;
        }
      }
    }

    console.log("[generate-domain][DEBUG] acceptedNames:", acceptedNames);
    console.log(
      "[generate-domain][DEBUG] acceptedAvailability:",
      JSON.stringify(acceptedAvailability, null, 2)
    );

    return NextResponse.json(
      {
        names: acceptedNames,
        count: acceptedNames.length,
        availability: acceptedAvailability,
        tlds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Generate-domain API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}