import { Suspense } from "react";
import { notFound } from "next/navigation";
import path from "node:path";
import { readFile } from "node:fs/promises";
import type { Lang } from "@/config/i18n";
import {
  getGeneratorGeneralMessages,
  type GeneratorGeneralMessages,
} from "@/i18n/domain-generator-index/generator-general";
import Usp from "../../domain-generator/components/generator/Usp";
import SuggestedNames from "../../domain-generator/components/generator/SuggestedNames";
import AiExplainerSection from "../../domain-generator/components/generator/AiExplainerSection";
import LongFormContent from "../../domain-generator/components/generator/LongFormContent";
import DomainTipSection from "../../domain-generator/components/generator/DomainTipSection";
import ExampleName from "../../domain-generator/components/generator/ExampleName";
import { HeroSection } from "../../domain-generator/components/generator/HeroSection";

export const runtime = "nodejs";

type NicheEntry = {
  niche: string;
  messages: Partial<GeneratorGeneralMessages>;
};

type PageParams = {
  params: Promise<{ lang: Lang; niche: string }>;
};

const NICHES_NL_PATH = path.join(process.cwd(), "src/data/niches-nl");

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function loadNlNiches(): Promise<NicheEntry[]> {
  const raw = await readFile(NICHES_NL_PATH, "utf8");
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
      ...overrides.examples,
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
        left: overrideLongForm.left ?? base.sections.longForm.left,
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
  const niches = await loadNlNiches();
  return niches.map((entry) => ({
    lang: "nl",
    niche: slugify(entry.niche),
  }));
}

export default async function NicheGeneratorPage({ params }: PageParams) {
  const { lang, niche } = await params;

  if (lang !== "nl") {
    notFound();
  }

  const niches = await loadNlNiches();
  const entry = niches.find((item) => slugify(item.niche) === niche);
  if (!entry) {
    notFound();
  }

  const baseMessages = getGeneratorGeneralMessages(lang);
  const messages = normalizeNicheMessages(baseMessages, entry.messages);

  return (
    <section>
      <Suspense fallback={null}>
        <HeroSection lang={lang} messages={messages} />
      </Suspense>
      <Usp messages={messages} />
      <SuggestedNames lang={lang} messages={messages} />
      <AiExplainerSection messages={messages} />
      <LongFormContent lang={lang} messages={messages} />
      <DomainTipSection messages={messages} />
      <ExampleName messages={messages} />
    </section>
  );
}
