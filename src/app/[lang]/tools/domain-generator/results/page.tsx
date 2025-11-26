// src/app/[lang]/tools/domain-generator/results/page.tsx
import type { Lang } from "@/config/i18n";
import { Stepper } from "../components/stepper/Stepper";

type ResultsPageProps = {
  params: { lang: Lang };
  // searchParams is nu een Promise in Next 16
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ResultsPage({
  params,
  searchParams,
}: ResultsPageProps) {
  // Promise unwrappen
  const sp = await searchParams;

  const rawQ = sp?.q;
  const initialPrompt =
    typeof rawQ === "string"
      ? rawQ
      : Array.isArray(rawQ)
      ? rawQ[0] ?? ""
      : "";

  return (
    <main>
      <Stepper lang={params.lang} initialPrompt={initialPrompt} />
    </main>
  );
}