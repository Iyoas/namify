// src/app/[lang]/tools/domain-generator/generator/page.tsx
import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import { getGeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";
import Usp from "../components/generator/Usp";
import SuggestedNames from "../components/generator/SuggestedNames";
import AiExplainerSection from "../components/generator/AiExplainerSection";
import LongFormContent from "../components/generator/LongFormContent";
import DomainTipSection from "../components/generator/DomainTipSection";
import ExampleName from "../components/generator/ExampleName";
import { HeroSection } from "../components/generator/HeroSection";

const generatorSeo: Record<
  Lang,
  { title: string; description: string; keywords: string[] }
> = {
  nl: {
    title: "Bedrijfsnaam generator – AI bedrijfs- en domeinnaam ideeën | Domifai",
    description:
      "Genereer in seconden merkwaardige bedrijfsnamen en check direct de domeinbeschikbaarheid. AI-gedreven naamgenerator in het Nederlands.",
    keywords: [
      "bedrijfsnaam generator",
      "domeinnaam generator",
      "naam ideeën",
      "AI bedrijfsnaam",
      "merknaam generator",
      "domein check",
    ],
  },
  en: {
    title: "Business Name Generator – AI brand & domain ideas | Domifai",
    description:
      "Generate brandable business names in seconds and check domain availability instantly. AI-powered name generator.",
    keywords: [
      "business name generator",
      "domain name generator",
      "brand name ideas",
      "AI business names",
      "domain checker",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const seo = generatorSeo[lang] ?? generatorSeo.en;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function DomainGeneratorPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const messages = getGeneratorGeneralMessages(lang);

  return (
    <section>
      <HeroSection lang={lang} messages={messages} />
      <Usp messages={messages} />
      <SuggestedNames lang={lang} messages={messages} />
      <AiExplainerSection messages={messages} />
      <LongFormContent lang={lang} messages={messages} />
      <DomainTipSection messages={messages} />
      <ExampleName messages={messages} />
    </section>
  );
}
