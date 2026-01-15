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
  style?: string,
  client?: OpenAI,
  preferredTld?: string
): Promise<string[]> {
  const openaiClient = client ?? createOpenAIClient();
  const languageHint = buildLanguageHint(lang);
  const styleHint = style
    ? `\nToon en stijl van de namen: zorg dat de namen duidelijk de volgende toon hebben: "${style}". Pas creativiteit, woordkeuze en vibe hierop aan.`
    : "";
  const normalizedPreferredTld = preferredTld?.startsWith(".")
    ? preferredTld
    : preferredTld
    ? `.${preferredTld}`
    : undefined;
  const isComPreferred = normalizedPreferredTld === ".com";
  const namesPerPrompt = isComPreferred ? 8 : NAMES_PER_ROUND;

  const excludeBlock =
    excludeNames.length > 0
      ? `
Vermijd deze namen (of varianten hierop), ze zijn al voorgesteld of gebruikt:
${excludeNames.join(", ")}
`
      : "";
  const comStrategy = isComPreferred
    ? `

Wanneer .com geselecteerd is, optimaliseer de namen expliciet voor .com beschikbaarheid:
- Leid eerst het business type af uit de beschrijving (bijv. SaaS, AI tool, ecommerce brand, agency, consumer product) en pas de stijl daarop aan.
- Genereer precies 8 namen met deze verdeling:
  - 2 korte inventieve of semi-inventieve namen (6–10 tekens, goed uitspreekbaar)
  - 2 namen met subtiele suffixen alleen als dat past (zoals: ly, ify)
  - 2 hoogwaardige twee-woord combinaties (bijv. concept + studio/labs/works/hub, alleen als het natuurlijk klinkt)
  - 2 creatieve blends of fonetische variaties die brandable aanvoelen
- Geef voorkeur aan unieke lettercombinaties en niet-woordenboekachtige constructies.
- Vermijd generieke prefixes (my, the, best) en namen die op bestaande merken lijken.
- Focus op namen die realistisch als .com beschikbaar zouden kunnen zijn.
`
    : "";

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Je bent een professionele merknaam- en domeinnaamgenerator voor startups en online bedrijven.\n\nJe taak is om per aanvraag EXACT 8 naamvoorstellen te genereren, strikt verdeeld over de volgende categorieen:\n\nCATEGORIE A — Functioneel / Beschrijvend (4 namen)\n- Bestaan uit EXACT 2 woorden\n- Combineren functie, actie, doelgroep of context\n- De naam moet zonder uitleg duidelijk maken wat het product of de dienst doet\n- Voorbeelden van structuren:\n  - [Doelgroep] + [Actie] (ArtisanLink, DogWalker)\n  - [Object] + [Flow/Hub/Path/Connect/Sync]\n  - [Context] + [Werkwoord]\n- Geen streepjes, cijfers of speciale tekens\n- CamelCase toegestaan\n\nCATEGORIE B — Semi-brandable (2 namen)\n- EXACT 1 woord\n- Nog steeds betekenisvol of actiegericht\n- Mag een bestaand woord combineren of licht aanpassen\n- Moet professioneel en geloofwaardig klinken voor een bedrijf\n\nCATEGORIE C — Creatief / Abstract (2 namen)\n- EXACT 1 woord\n- Uniek, modern, internationaal bruikbaar\n- Focus op klank, ritme en merkgevoel\n- Geen duidelijke beschrijving vereist, maar wel uitspreekbaar\n\nALGEMENE REGELS (ZEER BELANGRIJK)\n- Geen herhaling van naamstructuren\n- Geen generieke AI-suffixen in alle namen (zoals alleen -io, -ify, -ly)\n- Namen moeten geschikt zijn als merk- en domeinnaam\n- Vermijd cliches en buzzwoorden\n- Houd rekening met internationale uitspraak\n- Output ALLEEN geldige JSON, exact in dit formaat:\n\n{\n  \"names\": [\n    \"Naam 1\",\n    \"Naam 2\",\n    \"Naam 3\",\n    \"Naam 4\",\n    \"Naam 5\",\n    \"Naam 6\",\n    \"Naam 7\",\n    \"Naam 8\"\n  ]\n}\n",
      },
      {
        role: "user",
        content: `
        Gebruik de volgende beschrijving van het bedrijf of project om namen te genereren:

"${prompt}"

${languageHint}
${styleHint}

Regels voor de namen:
- Genereer precies ${namesPerPrompt} unieke merk- en domeinnaamsuggesties
- Korte, brandable namen (idealiter 1–2, max 3 lettergrepen)
- Modern, premium en internationaal klinkend
- Geen letterlijke beschrijvende zinnen
- Geen generieke woorden zoals: planner, tracker, solutions, services, online, bedrijf, consulting
- Geen bestaande merknamen of merken van anderen
- Geen cijfers, geen koppeltekens
- Vermijd simpele Nederlandse samenstellingen als "FeestKalender" of "PartyPlannerPro"
- Maak nieuwe, creatieve combinaties of licht gemodificeerde woorden (zoals: Nexora, Lumiva, Zyntra, Avalyo)
${excludeBlock}
${comStrategy}

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
    const openaiClient = createOpenAIClient();
    const body = await req.json();
    const { prompt, lang, style, preferredTld } = body as {
      prompt?: string;
      lang?: string;
      style?: string;
      preferredTld?: string;
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
        style,
        openaiClient,
        preferredTld
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
