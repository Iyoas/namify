import { Suspense } from "react";
import { notFound } from "next/navigation";
import path from "node:path";
import { readFile } from "node:fs/promises";
import type { Lang } from "@/config/i18n";
import {
  getGeneratorGeneralMessages,
  type GeneratorGeneralMessages,
} from "@/i18n/domain-generator-index/generator-general";
import Usp from "../components/generator/Usp";
import SuggestedNames from "../components/generator/SuggestedNames";
import AiExplainerSection from "../components/generator/AiExplainerSection";
import LongFormContent from "../components/generator/LongFormContent";
import DomainTipSection from "../components/generator/DomainTipSection";
import ExampleName from "../components/generator/ExampleName";
import { HeroSection } from "../components/generator/HeroSection";

export const runtime = "nodejs";

type NicheEntry = {
  niche: string;
  slug?: string;
  messages: Partial<GeneratorGeneralMessages>;
};

type PageParams = {
  params: Promise<{ lang: Lang; niche: string }>;
};

const NICHES_EN_PATH = path.join(process.cwd(), "src/data/niches-en");

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function loadEnNiches(): Promise<NicheEntry[]> {
  const raw = await readFile(NICHES_EN_PATH, "utf8");
  const parsed = JSON.parse(raw) as NicheEntry[];
  return Array.isArray(parsed) ? parsed : [];
}

function mergeMessages<T>(base: T, overrides: Partial<T>): T {
  if (!overrides) return base;
  if (Array.isArray(base) || Array.isArray(overrides)) {
    return (overrides ?? base) as T;
  }
  if (typeof base !== "object" || base === null) return base;

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  Object.entries(overrides as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined) return;
    const current = result[key];
    if (
      typeof current === "object" &&
      current !== null &&
      !Array.isArray(current) &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      result[key] = mergeMessages(current, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  });

  return result as T;
}

function normalizeNicheMessages(
  base: GeneratorGeneralMessages,
  overrides: Partial<GeneratorGeneralMessages>
): GeneratorGeneralMessages {
  const overrideSections =
    overrides.sections ?? ({} as GeneratorGeneralMessages["sections"]);
  const overrideExamples = overrides.examples ?? ({} as GeneratorGeneralMessages["examples"]);
  const overrideExampleName =
    overrideExamples.exampleName ?? ({} as GeneratorGeneralMessages["examples"]["exampleName"]);
  const overrideLongForm =
    overrideSections.longForm ?? ({} as GeneratorGeneralMessages["sections"]["longForm"]);
  const overrideRight =
    overrideLongForm.right ?? ({} as GeneratorGeneralMessages["sections"]["longForm"]["right"]);
  const overrideBlocks = overrideRight.blocks ?? [];

  const normalizedBlocks = Array.isArray(overrideBlocks)
    ? overrideBlocks.map((block) => {
        const paragraphsSource =
          Array.isArray((block as { paragraphs?: string[] }).paragraphs) &&
          (block as { paragraphs?: string[] }).paragraphs?.length
            ? (block as { paragraphs?: string[] }).paragraphs
            : (block as { body?: string }).body
            ? [(block as { body?: string }).body as string]
            : [];
        const paragraphs = paragraphsSource ?? [];

        const bullets =
          Array.isArray(
            (block as { bullets?: Array<{ label: string; description?: string; text?: string }> })
              .bullets
          )
            ? (block as { bullets?: Array<{ label: string; description?: string; text?: string }> }).bullets!.map(
                (bullet) => ({
                  label: bullet.label,
                  description: bullet.description ?? bullet.text ?? "",
                })
              )
            : [];

        return {
          ...block,
          paragraphs,
          bullets,
        };
      })
    : [];

  const merged: GeneratorGeneralMessages = {
    ...base,
    ...overrides,
    hero: {
      ...base.hero,
      ...overrides.hero,
    },
    examples: {
      ...base.examples,
      ...overrideExamples,
      exampleName: {
        ...base.examples.exampleName,
        ...overrideExampleName,
      },
    },
    suggestedNames: {
      ...base.suggestedNames,
      ...overrides.suggestedNames,
    },
    sections: {
      ...base.sections,
      ...overrideSections,
      aiExplainer: overrideSections.aiExplainer ?? base.sections.aiExplainer,
      domainTips: overrideSections.domainTips ?? base.sections.domainTips,
      longForm: {
        ...base.sections.longForm,
        ...overrideLongForm,
        left: {
          ...base.sections.longForm.left,
          ...overrideLongForm.left,
        },
        right: {
          ...base.sections.longForm.right,
          ...overrideRight,
          blocks: normalizedBlocks.length
            ? normalizedBlocks
            : base.sections.longForm.right.blocks,
          cta: overrideRight.cta ?? base.sections.longForm.right.cta,
        },
      },
    },
  };

  return merged;
}

export async function generateStaticParams() {
  const niches = await loadEnNiches();
  return niches.map((entry) => ({
    lang: "en",
    niche: entry.slug ? entry.slug : slugify(entry.niche),
  }));
}

export default async function NicheGeneratorPage({ params }: PageParams) {
  const { lang, niche } = await params;

  if (lang !== "en") {
    notFound();
  }

  const niches = await loadEnNiches();
  const entry = niches.find((item) => (item.slug ?? slugify(item.niche)) === niche);
  if (!entry) {
    notFound();
  }

  const baseMessages = getGeneratorGeneralMessages(lang);
  const messages = normalizeNicheMessages(baseMessages, entry.messages);
  const pageMessages: GeneratorGeneralMessages = {
    ...messages,
    hero: {
      ...messages.hero,
      titlePrefix: "",
      titleHighlight: entry.niche,
      titleSuffix: "Name Generator",
      titleEnd: "",
    },
  };

  return (
    <section>
      <Suspense fallback={null}>
        <HeroSection lang={lang} messages={pageMessages} />
      </Suspense>
      <Usp messages={pageMessages} />
      <SuggestedNames lang={lang} messages={pageMessages} />
      <AiExplainerSection messages={pageMessages} />
      <LongFormContent lang={lang} messages={pageMessages} />
      <DomainTipSection messages={pageMessages} />
      <ExampleName messages={pageMessages} />
    </section>
  );
}
