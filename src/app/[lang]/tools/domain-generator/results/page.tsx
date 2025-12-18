// src/app/[lang]/tools/domain-generator/results/page.tsx
import type { Lang } from "@/config/i18n";
import { getGeneratorGeneralResultsMessages } from "@/i18n/domain-generator-index/generator-general";
import Stepper from "../components/stepper/Stepper";

type ResultsPageProps = {
  // In Next 16 zijn zowel params als searchParams Promises
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ResultsPage({
  params,
  searchParams,
}: ResultsPageProps) {
  // Beide Promises unwrappen (Next 16)
  const resolvedParams = await params;
  const sp = await searchParams;
  const messages = getGeneratorGeneralResultsMessages(resolvedParams.lang);

  const rawQ = sp?.q;
  const initialPrompt =
    typeof rawQ === "string"
      ? rawQ
      : Array.isArray(rawQ)
      ? rawQ[0] ?? ""
      : "";

  return (
    <main>
      <Stepper
        lang={resolvedParams.lang}
        initialPrompt={initialPrompt}
        messages={messages}
      />
    </main>
  );
}
