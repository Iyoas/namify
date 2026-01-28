import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import DomainGeneratorPage from "../domain-generator/generator/page";

const checkerSeo: Record<Lang, { title: string; description: string; keywords: string[] }> =
  {
    nl: {
      title: "Domeinnaam checker – controleer beschikbaarheid | Domifai",
      description:
        "Check direct of een domeinnaam vrij is en ontdek alternatieven met AI-suggesties.",
      keywords: [
        "domeinnaam checker",
        "domein beschikbaarheid",
        "domein check",
        "domeinnaam controleren",
        "AI domeinnaam",
      ],
    },
    en: {
      title: "Domain Checker – check domain availability | Domifai",
      description:
        "Check domain availability instantly and explore AI name alternatives.",
      keywords: [
        "domain checker",
        "domain availability",
        "check domain",
        "domain name lookup",
        "AI domain ideas",
      ],
    },
  };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const seo = checkerSeo[lang] ?? checkerSeo.en;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default DomainGeneratorPage;
