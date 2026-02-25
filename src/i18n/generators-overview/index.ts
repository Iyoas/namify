import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import type { GeneratorCategoryKey } from "@/data/generators";

export type GeneratorsOverviewMessages = {
  heroTitle: string;
  heroSubtitle: string;
  cardCta: string;
  filtersLabel: string;
  allFilterLabel: string;
  metaTitle: string;
  metaDescription: string;
  filterCategories: Record<GeneratorCategoryKey, string>;
  categories: Record<GeneratorCategoryKey, string>;
};

const messages: Record<Lang, GeneratorsOverviewMessages> = {
  en: {
    heroTitle: "Explore all AI Name Generators",
    heroSubtitle: "Industry-specific business name generators powered by AI.",
    cardCta: "Generate names",
    filtersLabel: "Categories",
    allFilterLabel: "All",
    metaTitle: "All AI Name Generators | Domifai",
    metaDescription:
      "Explore all industry-specific AI business name generators and find the right generator for your niche.",
    filterCategories: {
      tech: "Tech",
      ecommerce: "E-commerce",
      marketing: "Marketing",
      services: "Services",
      creative: "Creative",
      hospitality: "Hospitality",
      events: "Events",
    },
    categories: {
      tech: "Tech & Software Name Generators",
      ecommerce: "E-commerce Name Generators",
      marketing: "Marketing & Growth Name Generators",
      services: "Business & Service Name Generators",
      creative: "Creative & Media Name Generators",
      hospitality: "Hospitality & Lifestyle Name Generators",
      events: "Events & Entertainment Name Generators",
    },
  },
  nl: {
    heroTitle: "Ontdek alle AI naam generators",
    heroSubtitle: "Branchespecifieke bedrijfsnaam generators op basis van AI.",
    cardCta: "Genereer namen",
    filtersLabel: "Categorieen",
    allFilterLabel: "Alle",
    metaTitle: "Alle AI naam generators | Domifai",
    metaDescription:
      "Bekijk alle branchespecifieke AI bedrijfsnaam generators en kies de juiste generator voor jouw niche.",
    filterCategories: {
      tech: "Tech",
      ecommerce: "E-commerce",
      marketing: "Marketing",
      services: "Services",
      creative: "Creatief",
      hospitality: "Horeca",
      events: "Events",
    },
    categories: {
      tech: "Tech & software naam generators",
      ecommerce: "E-commerce naam generators",
      marketing: "Marketing & groei naam generators",
      services: "Bedrijfs- en service naam generators",
      creative: "Creatieve & media naam generators",
      hospitality: "Horeca & lifestyle naam generators",
      events: "Event & entertainment naam generators",
    },
  },
};

export function getGeneratorsOverviewMessages(lang: Lang): GeneratorsOverviewMessages {
  return messages[lang] ?? messages[defaultLocale];
}
