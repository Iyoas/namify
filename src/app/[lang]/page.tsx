// src/app/[lang]/tools/domain-generator/page.tsx
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { lang } = await params;

  if (lang === "nl") {
    return {
      title: "Domifai | AI tools voor bedrijfs- en domeinnamen",
      description:
        "Ontdek AI-tools om bedrijfsnamen te bedenken, domeinen te checken en merken op te bouwen. Snel, gratis en eenvoudig te gebruiken.",
      alternates: {
        canonical: "https://www.domifai.com/nl",
        languages: {
          nl: "https://www.domifai.com/nl",
          en: "https://www.domifai.com/en",
          "x-default": "https://www.domifai.com/en",
        },
      },
    };
  }

  return {
    title: "Domifai | AI Tools for Business & Domain Names",
    description:
      "Discover AI tools to generate business names, check domains, and build your brand. Fast, free, and easy to use.",
    alternates: {
      canonical: "https://www.domifai.com/en",
      languages: {
        en: "https://www.domifai.com/en",
        nl: "https://www.domifai.com/nl",
        "x-default": "https://www.domifai.com/en",
      },
    },
  };
}

export default async function DomainGeneratorLanding({ params }: Props) {
  const { lang } = await params;
  const messages = getDomainGeneratorIndexMessages(lang);

  return (
    <main>
      <Hero lang={lang} messages={messages} />
      <HowItWorks messages={messages} />
      <HowWeUseTool messages={messages} />
      <IndustryGenerators messages={messages} />
      <Faq messages={messages} />
      <Contact messages={messages} />
    </main>
  );
}
