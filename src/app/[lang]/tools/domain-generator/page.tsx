// src/app/[lang]/tools/domain-generator/page.tsx
import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import DomainGeneratorPage from "./generator/page";

type DomainGeneratorPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export async function generateMetadata({
  params,
}: DomainGeneratorPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (lang === "nl") {
    return {
      title: "Bedrijfsnaam generator met AI | Bedrijfs- en domeinnaam ideeën",
      description:
        "Genereer in seconden merkbare bedrijfsnamen en controleer direct domeinbeschikbaarheid met AI.",
      alternates: {
        canonical: "https://www.domifai.com/nl/tools/domeinnaam-generator",
        languages: {
          nl: "https://www.domifai.com/nl/tools/domeinnaam-generator",
          en: "https://www.domifai.com/en/tools/domain-generator",
          "x-default": "https://www.domifai.com/en/tools/domain-generator",
        },
      },
    };
  }

  return {
    title: "Business Name Generator – AI brand & domain ideas | Domifai",
    description:
      "Generate brandable business names in seconds and check domain availability instantly. AI-powered name generator.",
    alternates: {
      canonical: "https://www.domifai.com/en/tools/domain-generator",
      languages: {
        en: "https://www.domifai.com/en/tools/domain-generator",
        nl: "https://www.domifai.com/nl/tools/domeinnaam-generator",
        "x-default": "https://www.domifai.com/en/tools/domain-generator",
      },
    },
  };
}

export default DomainGeneratorPage;
