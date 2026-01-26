// src/app/[lang]/tools/domain-generator/page.tsx
import type { Lang } from "@/config/i18n";
import { getDomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";
import Hero from "@/app/[lang]/tools/domain-generator/components/Hero";
import HowItWorks from "@/app/[lang]/tools/domain-generator/components/HowItWorks";
import HowWeUseTool from "@/app/[lang]/tools/domain-generator/components/HowWeUseTool";
import IndustryGenerators from "@/app/[lang]/tools/domain-generator/components/IndustryGenerators";
import Faq from "@/app/[lang]/tools/domain-generator/components/Faq";
import Contact from "@/app/[lang]/tools/domain-generator/components/Contact";
type Props = {
  params: Promise<{ lang: Lang }>;
};

export default async function DomainGeneratorLanding({ params }: Props) {
  const { lang } = await params;
  const messages = getDomainGeneratorIndexMessages(lang);

  return (
    <main>
      <Hero lang={lang} messages={messages} />
      <HowItWorks messages={messages} />
      <HowWeUseTool messages={messages} />
      {/* <IndustryGenerators messages={messages} /> */}
      <Faq messages={messages} />
      <Contact messages={messages} />
    </main>
  );
}
