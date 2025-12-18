// src/app/[lang]/tools/domain-generator/generator/page.tsx
import type { Lang } from "@/config/i18n";
import { getGeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";
import Usp from "../components/generator/Usp";
import SuggestedNames from "../components/generator/SuggestedNames";
import AiExplainerSection from "../components/generator/AiExplainerSection";
import LongFormContent from "../components/generator/LongFormContent";
import DomainTipSection from "../components/generator/DomainTipSection";
import ExampleName from "../components/generator/ExampleName";
import { HeroSection } from "../components/generator/HeroSection";

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
      <LongFormContent messages={messages} />
      <DomainTipSection messages={messages} />
      <ExampleName messages={messages} />
    </section>
  );
}
