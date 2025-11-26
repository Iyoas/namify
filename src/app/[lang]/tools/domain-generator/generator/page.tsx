// src/app/[lang]/tools/domain-generator/generator/page.tsx
import type { Lang } from "@/config/i18n";
import Usp from "../components/generator/Usp";
import SuggestedNames from "../components/generator/SuggestedNames";
import AiExplainerSection from "../components/generator/AiExplainerSection";
import LongFormContent from "../components/generator/LongFormContent";
import DomainTipSection from "../components/generator/DomainTipSection";
import ExampleName from "../components/generator/ExampleName";
import { HeroSection } from "../components/generator/HeroSection";

export default function DomainGeneratorPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  return (
    <section>
      <HeroSection lang={lang} />
      <Usp />
      <SuggestedNames />
      <AiExplainerSection />
      <LongFormContent />
      <DomainTipSection />
      <ExampleName />
    </section>
  );
}
