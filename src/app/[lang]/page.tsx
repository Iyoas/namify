// src/app/[lang]/tools/domain-generator/page.tsx
import type { Lang } from "@/config/i18n";
import Hero from "@/app/[lang]/tools/domain-generator/components/Hero";
import HowItWorks from "@/app/[lang]/tools/domain-generator/components/HowItWorks";
import HowWeUseTool from "@/app/[lang]/tools/domain-generator/components/HowWeUseTool";
import IndustryGenerators from "@/app/[lang]/tools/domain-generator/components/IndustryGenerators";
import Faq from "@/app/[lang]/tools/domain-generator/components/Faq";
type Props = {
  params: { lang: Lang };
};

export default function DomainGeneratorLanding({ params }: Props) {
  return (
    <main>
      <Hero lang={params.lang} />
      <HowItWorks />
      <HowWeUseTool />
      <IndustryGenerators />
      <Faq />
    </main>
  );
}
