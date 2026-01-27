import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  checkAvailabilityForNames,
  type DomainAvailabilityStatus,
} from "@/lib/domainr";
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

const TARGET_COUNT = 8;
const GENERATION_COUNT = 12;
const MAX_ROUNDS = 2;
const NAMES_PER_ROUND = 8;
const TIME_BUDGET_MS = 4500;
// Superset van alle TLD's die in de filters voorkomen.
const DEFAULT_TLDS = ALL_TLDS_SUPERSET;
const TONE_OPTIONS = [
  "Creative",
  "Professional",
  "Unique",
  "Tech",
] as const;
type ToneOption = (typeof TONE_OPTIONS)[number];

type NameLanguageOption = "international" | "en" | "nl";

function normalizeNameLanguage(value?: string, uiLang?: string): NameLanguageOption {
  const trimmed = value?.trim().toLowerCase();
  if (trimmed === "en" || trimmed === "nl" || trimmed === "international") {
    return trimmed;
  }
  return uiLang === "nl" ? "nl" : "international";
}

/**
 * Helper om de naamtaal-hint op te bouwen.
 */
function buildNameLanguageHint(
  nameLang?: string,
  uiLang?: string,
  style?: string
): string {
  const normalized = normalizeNameLanguage(nameLang, uiLang);
  if (normalized === "nl") {
    const tone = normalizeTone(style);
    const toneHint =
      tone === "Creative"
        ? "Voor Creative toon: vermijd te letterlijke beschrijvende samenstellingen en uitleggerige namen; geef voorkeur aan klankgedreven of licht geabstraheerde namen met Nederlandse wortels die als merk kunnen werken."
        : tone === "Professional"
        ? "Voor Professional toon: kies heldere, betrouwbare namen met Nederlandse betekenis; vermijd speelse woordvervorming en overdreven creativiteit."
        : tone === "Unique"
        ? "Voor Unique toon: durf af te wijken van duidelijke betekenis; abstractie en onderscheid zijn belangrijker dan directe uitleg, zolang de naam Nederlands aanvoelt."
        : tone === "Tech"
        ? "Voor Tech toon: behoud een moderne, productachtige uitstraling; vermijd lange beschrijvende samenstellingen en kies liever compacte namen met een technische of functionele klank."
        : "";
    return `
Genereer uitsluitend Nederlandse namen.
Gebruik Nederlandse woorden, Nederlandse samenstellingen en Nederlandse betekenis.
Vermijd Engelstalige kernwoorden zoals remote, platform, hub, sync, connect, cloud en community.
Namen mogen maximaal 2 woorden bevatten; maximaal 1 naam mag 3 woorden bevatten.
Focus op duidelijke Nederlandse semantiek zoals samenwerken, werken, delen, verbinden, netwerk en gemeenschap.
Namen mogen modern klinken, maar moeten herkenbaar Nederlands zijn.
Vermijd Engelse suffixen zoals ify, ly, hub, lab en labs.
${toneHint ? `${toneHint}\n` : ""}
`;
  }
  if (normalized === "en") {
    return "Generate names that sound natural in English and are easy to pronounce.";
  }
  return "Generate international, brandable names that work across markets and are easy to pronounce.";
}

function normalizeTone(style?: string): ToneOption {
  const trimmed = style?.trim();
  if (!trimmed) return "Creative";
  const lower = trimmed.toLowerCase();
  const aliasMap: Record<string, ToneOption> = {
    creatief: "Creative",
    creative: "Creative",
    professioneel: "Professional",
    professional: "Professional",
    uniek: "Unique",
    unique: "Unique",
    tech: "Tech",
  };
  return aliasMap[lower] ?? "Creative";
}

function buildToneHint(style?: string): string {
  const tone = normalizeTone(style);
  switch (tone) {
    case "Professional":
      return [
        "Serious, credible, business-ready names.",
        "Avoid humor, slang, playful tone.",
        "Sound trustworthy and established.",
      ].join("\n");
    case "Unique":
      return [
        "Prioritize distinctiveness and rarity.",
        "More abstract/emotional is allowed.",
        "Clarity is secondary to memorability.",
      ].join("\n");
    case "Tech":
      return [
        "Modern tech/startup vibe.",
        "Prefer short, punchy, product-like names.",
        'Allow technical roots (cloud, dev, data, stack, byte, node, labs, systems) but avoid cliches like "AI", "GPT", "bot" as suffixes.',
        "Optional: use short, product-like endings sparingly such as ify, ly, hub, node, lab or labs. Prefer variety and avoid repeating the same ending across names.",
      ].join("\n");
    case "Creative":
    default:
      return [
        "Inventive blends, playful word forms.",
        "Slight distortion allowed, modern brand feel.",
        "Balance clarity + originality.",
      ].join("\n");
  }
}

/**
 * Count "words" in a name.
 * - If the name contains spaces, we split on whitespace.
 * - Otherwise we approximate word boundaries via CamelCase tokens.
 *   Examples: "ArtisanLink" -> 2, "PetCareHub" -> 3, "Nexora" -> 1
 */
function countNameWords(name: string): number {
  const trimmed = name.trim();
  if (!trimmed) return 0;
  if (/\s/.test(trimmed)) {
    return trimmed.split(/\s+/).filter(Boolean).length;
  }
  // CamelCase / token heuristic
  const tokens = trimmed.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g);
  return (tokens ?? [trimmed]).filter(Boolean).length;
}

function isTooLiteralFunctionalName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;

  const tokens = /\s/.test(trimmed)
    ? trimmed.split(/\s+/).filter(Boolean)
    : (trimmed.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) ?? [trimmed]);

  const lower = tokens.map((t) => t.toLowerCase());

  // Avoid overly generic/too-literal words for Category A
  const banned = new Set(["online", "shop", "platform", "service", "services"]);
  if (lower.some((t) => banned.has(t))) return true;

  // Explicit examples from product direction: avoid Bio/Organic + Market combos
  const hasMarket = lower.includes("market") || lower.includes("marketplace");
  const hasBio = lower.includes("bio") || lower.includes("organic");
  if (hasMarket && hasBio) return true;

  return false;
}

type NameValidationResult = {
  ok: boolean;
  reason?: string;
  invalidNames: string[];
};

function validateGeneratedNames(names: string[]): NameValidationResult {
  const cleaned = names.map((n) => (typeof n === "string" ? n.trim() : "")).filter(Boolean);

  if (cleaned.length !== GENERATION_COUNT) {
    return {
      ok: false,
      reason: `Expected exactly ${GENERATION_COUNT} names, got ${cleaned.length}.`,
      invalidNames: [],
    };
  }

  const threeWord = cleaned.filter((n) => countNameWords(n) === 3);
  if (threeWord.length > 1) {
    return {
      ok: false,
      reason: "More than one 3-word name was returned.",
      invalidNames: threeWord,
    };
  }

  // Soft validation for Category A literalness: flag names that look too literal.
  // We don't hard-fail on a single one, but if 2+ are too literal, we fail.
  const tooLiteral = cleaned.filter((n) => isTooLiteralFunctionalName(n));
  if (tooLiteral.length >= 2) {
    return {
      ok: false,
      reason: "Too many overly literal/generic functional names.",
      invalidNames: tooLiteral,
    };
  }

  return { ok: true, invalidNames: [] };
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
  preferredTld?: string,
  nameLang?: string
): Promise<string[]> {
  const openaiClient = client ?? createOpenAIClient();
  const languageHint = buildNameLanguageHint(nameLang, lang, style);
  const toneHint = buildToneHint(style);
  const namesPerPrompt = GENERATION_COUNT;

  const excludeBlock =
    excludeNames.length > 0
      ? `
Vermijd deze namen (of varianten hierop), ze zijn al voorgesteld of gebruikt:
${excludeNames.join(", ")}
`
      : "";
  async function callOnce(extraExclude: string[] = []): Promise<string[]> {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Je bent een professionele merknaam- en domeinnaamgenerator voor startups en online bedrijven.\n\nTOONREGELS: Volg deze toon strikt in woordkeuze, vibe en naamstructuur.\n" +
            toneHint +
            "\n\nJe taak is om per aanvraag EXACT 12 naamvoorstellen te genereren, strikt verdeeld over de volgende categorieen:\n\nCATEGORIE A — Functioneel / Beschrijvend (6 namen)\n- Meestal EXACT 2 woorden (CamelCase toegestaan)\n- Maximaal 1 naam in de volledige output mag 3 woorden bevatten\n- Combineert functie, actie, doelgroep of context\n- Moet zonder uitleg duidelijk maken wat het product of de dienst doet\n- Geef voorkeur aan subtiele functionele combinaties (bijv. HarvestLink, PawSync, FreshSource)\n- Vermijd te letterlijke of generieke combinaties zoals OnlineShop, BioMarket, OrganicMarket\n- Gebruik maximaal 1 letterlijk kernwoord uit de input per Category A naam\n- Vermijd combinaties die twee input-keywords direct naast elkaar plakken (bijv. SustainableFashion, GroceryDelivery, MealPrep)\n- Gebruik liever een functioneel/merkwaardig tweede woord zoals Link, Hub, Flow, Sync, Source, Path, Wave, Port, Nest, Bridge, Forge\n- Vermijd generieke marketing-suffixen zoals Fit, Pro, Plus, Best, Easy, Smart in Category A\n\nCATEGORIE B — Semi-brandable (3 namen)\n- EXACT 1 woord\n- Bevat een herkenbare wortel (bijv. pet, paw, eco, nutri, food, walk)\n- Is geen letterlijke beschrijving van het product\n- Moet professioneel en geloofwaardig klinken als bedrijfsnaam\n\nCATEGORIE C — Creatief / Abstract (3 namen)\n- EXACT 1 woord\n- Vermijd herkenbare woorden of directe betekenissen\n- Focus op klank, ritme en merkgevoel\n- Modern, internationaal en goed uitspreekbaar\n\nALGEMENE REGELS (ZEER BELANGRIJK)\n- EXACT 12 namen genereren\n- Maximaal 1 naam mag 3 woorden bevatten; alle andere namen max 2 woorden\n- Geen herhaling van naamstructuren\n- Vermijd het letterlijk herhalen van de volledige prompt of twee kernwoorden uit de prompt in één naam\n- Geen cijfers, koppeltekens of speciale tekens\n- Vermijd cliches, buzzwoorden en generieke AI-suffixen\n- Namen moeten geschikt zijn als merk- en domeinnaam\n- Output ALLEEN geldige JSON, exact in dit formaat:\n\n{\n  \"names\": [\n    \"Naam 1\",\n    \"Naam 2\",\n    \"Naam 3\",\n    \"Naam 4\",\n    \"Naam 5\",\n    \"Naam 6\",\n    \"Naam 7\",\n    \"Naam 8\",\n    \"Naam 9\",\n    \"Naam 10\",\n    \"Naam 11\",\n    \"Naam 12\"\n  ]\n}\n",
        },
        {
          role: "user",
          content: `
        Gebruik de volgende beschrijving van het bedrijf of project om namen te genereren:

"${prompt}"

${languageHint}

Regels voor de namen:
- Genereer precies ${namesPerPrompt} unieke naamvoorstellen
- Houd je strikt aan de categorie-indeling, aantallen per categorie en woordlimieten zoals beschreven in de system-instructie
- Voor Category A: gebruik maximaal 1 letterlijk kernwoord uit de input per naam en vermijd twee input-keywords direct naast elkaar
- Maak Category A namen merkwaardig en subtiel functioneel (dus niet "keyword+keyword" zoals GroceryDash of SustainableFit)
- Maximaal 1 naam mag 3 woorden bevatten; alle andere namen max 2 woorden
- Geen bestaande merknamen of merken van anderen
- Geen cijfers, geen koppeltekens
${excludeNames.length > 0 ? `\nVermijd deze namen (of varianten hierop), ze zijn al voorgesteld of gebruikt:\n${excludeNames.join(", ")}\n` : ""}
${extraExclude.length > 0 ? `\nVermijd ook deze namen (of varianten hierop), ze waren ongeldig in een eerdere poging:\n${extraExclude.join(", ")}\n` : ""}

Geef ALLEEN geldige JSON terug in precies dit formaat:

{
  "names": [
    "Naam 1",
    "Naam 2",
    "Naam 3",
    "Naam 4",
    "Naam 5",
    "Naam 6",
    "Naam 7",
    "Naam 8",
    "Naam 9",
    "Naam 10",
    "Naam 11",
    "Naam 12"
  ]
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
    return names
      .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean);
  }

  // First attempt
  const first = await callOnce();
  const firstValidation = validateGeneratedNames(first);
  if (firstValidation.ok) {
    return first;
  }

  // One retry: exclude invalid names that broke constraints
  const retry = await callOnce(firstValidation.invalidNames);
  const retryValidation = validateGeneratedNames(retry);
  if (retryValidation.ok) {
    return retry;
  }

  // If still invalid, return best-effort (will be handled by outer loop)
  return retry.length > 0 ? retry : first;
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
    const { prompt, lang, style, preferredTld, nameLang } = body as {
      prompt?: string;
      lang?: string;
      style?: string;
      preferredTld?: string;
      nameLang?: string;
    };
    const normalizedStyle = normalizeTone(style);

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty prompt." },
        { status: 400 }
      );
    }

    const langForTlds = (lang ?? "en") as Lang;
    const tlds = getTldsForCategory("all", langForTlds);
    const backgroundTlds = ALL_TLDS_SUPERSET.filter((tld) => !tlds.includes(tld));

    // Hier bewaren we alle 'goedgekeurde' namen + availability.
    const acceptedNames: string[] = [];
    const acceptedAvailability: Record<
      string,
      Record<string, DomainAvailabilityStatus>
    > = {};

    let round = 0;
    const startTime = Date.now();

    while (
      acceptedNames.length < TARGET_COUNT &&
      round < MAX_ROUNDS &&
      Date.now() - startTime < TIME_BUDGET_MS
    ) {
      round += 1;

      console.log(
        `[generate-domain] Ronde ${round} – huidige count: ${acceptedNames.length}/${TARGET_COUNT}`
      );

      // 1) Genereer nieuwe namen, met uitsluiting van al geaccepteerde namen
      const newNames = await generateNamesWithGPT(
        prompt,
        lang,
        acceptedNames,
        normalizedStyle,
        openaiClient,
        preferredTld,
        nameLang
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

      if (Date.now() - startTime >= TIME_BUDGET_MS) {
        break;
      }

      // 2) Check availability voor deze ronde
      const availabilityMap = await checkAvailabilityForNames(
        roundNames,
        tlds
      );

      // 3) Per naam checken; accepteer alleen als er minstens 1 beschikbare TLD is
      for (const name of roundNames) {
        if (acceptedNames.length >= TARGET_COUNT) break;

        const key = normalizeNameKey(name);

        // Enforce global constraint: at most one 3-word name in the final accepted list
        const isThreeWord = countNameWords(name) === 3;
        if (isThreeWord) {
          const alreadyHasThreeWord = acceptedNames.some((n) => countNameWords(n) === 3);
          if (alreadyHasThreeWord) {
            continue;
          }
        }
        const wordCount = countNameWords(name);
        if (wordCount >= 2 && isTooLiteralFunctionalName(name)) {
          continue;
        }

        const availabilityForName = availabilityMap[key] ?? {};

        const hasAvailableTld = Object.values(availabilityForName).some(
          (status) => status === "available"
        );

        if (!hasAvailableTld) {
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

    if (backgroundTlds.length > 0 && acceptedNames.length > 0) {
      void checkAvailabilityForNames(acceptedNames, backgroundTlds).catch((err) => {
        console.warn("[generate-domain] Background TLD check failed:", err);
      });
    }

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
