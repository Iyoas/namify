import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkAvailabilityForNames } from "@/lib/domainr";
import { ALL_TLDS_SUPERSET, getTldsForCategory } from "@/lib/tlds";
import type { Lang } from "@/config/i18n";

// IMPORTANT:
// Zorg dat je in .env.local dit hebt staan:
// OPENAI_API_KEY="sk-...."
// En nooit de key hardcoden in dit bestand.

function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const TARGET_COUNT = 9;

/**
 * Helper om de language hint op te bouwen (exacte logica uit de notebook).
 */
function buildNameLanguageHint(language?: string, style?: string): string {
  const lang = (language || "international").trim().toLowerCase();
  const styleNorm = (style || "Creative").trim().toLowerCase();

  if (lang === "en" || lang === "english") {
    return "Generate names that sound natural in English and are easy to pronounce.";
  }
  if (lang === "international" || lang === "default" || lang === "int") {
    // International should behave exactly like English
    return "Generate names that sound natural in English and are easy to pronounce.";
  }

  if (lang === "nl" || lang === "nederlands" || lang === "dutch") {
    const toneHint =
      styleNorm === "creative"
        ? "Voor Creative toon: gebruik duidelijk Nederlandse stammen/morfemen (Nederlands aanvoelend), maar vermijd te letterlijke beschrijvende samenstellingen en uitleggerige namen; geef voorkeur aan klankgedreven of licht geabstraheerde namen met Nederlandse wortels die als merk kunnen werken.\n- Gebruik bij voorkeur 1 herkenbare NL-stam per naam, eventueel met lichte klankvervorming.\n- Vermijd generieke sectorwoorden in de naam (zoals: sport, kleding, mode, fit, shop, winkel, punt, net, online)."
        : styleNorm === "tech"
        ? "Voor Tech toon: kies compacte, productachtige namen.\n- Je mag tech-suffixen SPARING gebruiken (maximaal 2 namen totaal).\n- Toegestane tech-suffixen: -ly / -y, -ify / -fy, -io, -hub, -able / -ible, -less.\n- Gebruik nooit meerdere suffixen in één naam.\n- Gebruik deze suffixen bij voorkeur in categorie B of C, niet in categorie A.\n- Vermijd lange beschrijvende samenstellingen."
        : styleNorm === "professional"
        ? "Voor Professional toon: kies heldere, betrouwbare namen; vermijd speelsheid.\n- Voor categorie A moet de naam klinken als een echte bedrijfsnaam.\n- De tweede root moet een bedrijfs- of entiteit-achtig woorddeel zijn (zoals Studio, Group, Partners, Systems, Works, Collective of Solutions)."
        : styleNorm === "casual"
        ? "Voor Casual toon: kies toegankelijke, warme en menselijke namen; vermijd formele of technische samenstellingen."
        : styleNorm === "unique"
        ? "Voor Unique toon: abstractie is belangrijker dan directe uitleg, zolang de naam Nederlands aanvoelt."
        : "";
    return `${toneHint}`.trim();
  }

  return "";
}

function buildToneHint(style?: string): string {
  const s = (style || "Creative").trim().toLowerCase();

  if (s === "casual") {
    return [
      "Friendly, warm, approachable names.",
      "Simpler words, human feel.",
      "Avoid corporate tone.",
    ].join("\n");
  }

  if (s === "professional") {
    return [
      "Serious, credible, business-ready names.",
      "Avoid humor or playful wording.",
      "Sound trustworthy and established.",
      "Avoid tech suffixes such as -ly/-y, -ify/-fy, -io, -hub, -able/-ible, -less.",
    ].join("\n");
  }

  if (s === "unique") {
    return [
      "Prioritize distinctiveness over clarity.",
      "Abstract or emotional names allowed.",
      "Memorability is more important than explanation.",
      "Avoid tech suffixes such as -ly/-y, -ify/-fy, -io, -hub, -able/-ible, -less.",
    ].join("\n");
  }

  if (s === "tech") {
    return [
      "Modern tech/startup vibe.",
      "Short, punchy, product-like names.",
      "Use tech suffixes sparingly (max 2 names total): -ly/-y, -ify/-fy, -io, -hub, -able/-ible, -less.",
      "Never stack multiple suffixes in one name.",
      "Prefer using these suffixes in category B or C, not in category A.",
      "Avoid marketing buzzwords.",
    ].join("\n");
  }

  return [
    "Creative, brand-first naming.",
    "Avoid literal descriptions.",
    "Favor sound, rhythm and memorability.",
    "Avoid tech suffixes such as -ly/-y, -ify/-fy, -io, -hub, -able/-ible, -less.",
  ].join("\n");
}


/**
 * Helper om GPT-namen te genereren (exacte promptstructuur uit de notebook).
 */
async function generateNamesWithGPT(
  prompt: string,
  style?: string,
  client?: OpenAI,
  nameLang?: string
): Promise<string[]> {
  const openaiClient = client ?? createOpenAIClient();
  const languageHint = buildNameLanguageHint(nameLang, style);
  const toneHint = buildToneHint(style);

  const nameLangNorm = (nameLang || "international").trim().toLowerCase();
  const isDutchNameLang = nameLangNorm === "nl" || nameLangNorm === "nederlands" || nameLangNorm === "dutch";
  const dutchSystemRules = isDutchNameLang
    ? `- Gebruik Nederlandse stammen/morfemen in de namen (Nederlands aanvoelend), maar vermijd letterlijke sectorwoorden zoals: sport, kleding, mode, fit.
- Vermijd domein-achtige toevoegingen/woorden zoals: punt, net, online, web, shop, store, winkel.`
    : "";

  function countNameParts(name: string): number {
    const trimmed = name.trim();
    if (!trimmed) return 0;
    if (/\s/.test(trimmed)) {
      return trimmed.split(/\s+/).filter(Boolean).length;
    }
    const tokens = trimmed.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g);
    return (tokens ?? [trimmed]).filter(Boolean).length;
  }

  function isTwoWordName(name: string): boolean {
    if (/\s/.test(name)) return false;
    return countNameParts(name) === 2;
  }

  function isOneWordName(name: string): boolean {
    return countNameParts(name) === 1;
  }

  function hasDotOrTld(name: string): boolean {
    const n = name.trim();
    if (!n) return false;
    if (n.includes(".")) return true;
    // Also block explicit TLD tokens even without a dot (defensive)
    if (/\b(nl|com|net|org|io|ai|shop|co|de|be|eu)\b/i.test(n)) return true;
    return false;
  }

  async function callOnce(): Promise<{
    strict: string[] | null;
    fallback: string[];
  }> {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Je bent een professionele merknaam- en domeinnaamgenerator voor startups en online bedrijven.

TOONREGELS:
${toneHint}

Je taak is om per aanvraag EXACT 9 naamvoorstellen te genereren, strikt verdeeld over de volgende categorieen:

CATEGORIE A — Brandable / Bedrijfsnaam (3 namen)
- Output als EXACT 2 woorddelen samengevoegd (geen spaties)
- CamelCase is toegestaan, maar het moeten exact 2 woorddelen zijn
- Moet eindigen op EXACT 1 entiteit-suffix uit.
- Het deel vóór het suffix is EXACT 1 merk-root (geen extra sector-woorden)
- Herkenbare wortel
- VERBODEN extra woorden/roots vóór het suffix: Home, Living, Shop, Store, Market, Space, Eco, Green, Sustain, Natura
- Geen werkwoorden of proces-termen (zoals Vinder, Scan, Schakel, Automaat)
- Geen extra 3e woorddeel
- Verboden suffixen in categorie A: Co, Inc, LLC, Ltd, Corp (en ook BV/NV tenzij expliciet gewenst)
- Forbidden: Shop, Store, Mart, Market, Winkel, Webshop

CATEGORIE B — Semi-brandable (3 namen)
- EXACT 1 woord
- Gebaseerd op een herkenbare wortel
- Niet letterlijk beschrijvend
- Lichte vervorming of klankaanpassing toegestaan
- Moet zelfstandig als merk kunnen werken

CATEGORIE C — Creatief / Abstract (3 namen)
- EXACT 1 woord
- Geen duidelijke betekenis
- Focus op klank en ritme
- Subtiele klankverwijzing naar 1 kernwoord toegestaan

ALGEMENE REGELS
- EXACT 9 namen totaal
${dutchSystemRules}
- Geen cijfers, geen koppeltekens
- Geen bestaande merken
- Output ALLEEN geldige JSON

OUTPUT FORMAT (verplicht):
{
  "A": ["...", "...", "..."],
  "B": ["...", "...", "..."],
  "C": ["...", "...", "..."]
}`,
        },
        {
          role: "user",
          content: `Gebruik de volgende beschrijving van het bedrijf of project om namen te genereren:

"${prompt}"

${languageHint}`,
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
      return { strict: null, fallback: [] };
    }

    const bucketA = Array.isArray(parsed.A) ? parsed.A : [];
    const bucketB = Array.isArray(parsed.B) ? parsed.B : [];
    const bucketC = Array.isArray(parsed.C) ? parsed.C : [];

    const fallback = [...bucketA, ...bucketB, ...bucketC]
      .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean)
      .filter((n) => !hasDotOrTld(n));

    const cleanedA = bucketA
      .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean)
      .filter((n) => !hasDotOrTld(n))
      .filter(isTwoWordName)
      .slice(0, 3);
    const cleanedB = bucketB
      .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean)
      .filter((n) => !hasDotOrTld(n))
      .filter(isOneWordName)
      .slice(0, 3);
    const cleanedC = bucketC
      .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean)
      .filter((n) => !hasDotOrTld(n))
      .filter(isOneWordName)
      .slice(0, 3);

    if (cleanedA.length === 3 && cleanedB.length === 3 && cleanedC.length === 3) {
      return { strict: [...cleanedA, ...cleanedB, ...cleanedC], fallback };
    }

    return { strict: null, fallback };
  }

  const maxAttempts = 3;
  let bestFallback: string[] = [];
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const result = await callOnce();
    if (result.fallback.length > bestFallback.length) {
      bestFallback = result.fallback;
    }
    if (result.strict && result.strict.length === TARGET_COUNT) {
      return result.strict;
    }
  }

  function topUpToTarget(existing: string[]): string[] {
    const out = [...existing];
    const syllA = ["Vlot", "Veer", "Kern", "Kracht", "Ritme", "Vonk", "Zwenk", "Wervel", "Loper", "Sprong", "Glans", "Drift", "Stroom", "Zuid", "Noord", "Vuur", "Lijn", "Baan", "Vaard", "Vleug"]; 
    const syllB = ["Nova", "Nivo", "Luna", "Puls", "Tide", "Moro", "Sola", "Fero", "Mira", "Viva", "Riva", "Senso", "Vero", "Kimo", "Reno", "Veda", "Zora", "Rumo", "Limo", "Relo"]; 

    let i = 0;
    while (out.length < TARGET_COUNT) {
      const a = syllA[i % syllA.length];
      const b = syllB[i % syllB.length];
      const candidate = `${a}${b}`;
      if (!hasDotOrTld(candidate) && !out.includes(candidate)) out.push(candidate);
      i += 1;
      if (i > 200) break;
    }
    return out.slice(0, TARGET_COUNT);
  }

  if (bestFallback.length >= TARGET_COUNT) {
    console.warn(
      "[generate-domain] Returning best-effort names after failed strict validation."
    );
    return topUpToTarget(bestFallback.slice(0, TARGET_COUNT));
  }

  console.warn("[generate-domain] Returning fallback names after failed validation.");
  return topUpToTarget(bestFallback);
}

/**
 * Zelfde normalisatie als in domainr.ts en DomainSelect:
 * lowercased en alleen a-z0-9.
 */
export async function POST(req: NextRequest) {
  try {
    const openaiClient = createOpenAIClient();
    const body = await req.json();
    const { prompt, lang, style, nameLang } = body as {
      prompt?: string;
      lang?: string;
      style?: string;
      nameLang?: string;
    };

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty prompt." },
        { status: 400 }
      );
    }

    const langForTlds = (lang ?? "en") as Lang;
    const tlds = getTldsForCategory("all", langForTlds);
    const backgroundTlds = ALL_TLDS_SUPERSET.filter((tld) => !tlds.includes(tld));

    const names = await generateNamesWithGPT(
      prompt,
      style,
      openaiClient,
      nameLang
    );

    const availability = await checkAvailabilityForNames(names, tlds);

    if (backgroundTlds.length > 0 && names.length > 0) {
      void checkAvailabilityForNames(names, backgroundTlds).catch((err) => {
        console.warn("[generate-domain] Background TLD check failed:", err);
      });
    }

    return NextResponse.json(
      {
        names,
        count: names.length,
        availability,
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
