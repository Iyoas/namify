// src/app/[lang]/tools/domain-generator/generator/page.tsx
import type { Lang } from "@/config/i18n";
import Usp from "../components/generator/Usp";
import SuggestedNames from "../components/generator/SuggestedNames";

export default function DomainGeneratorPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  return (
    <section>
      <Usp />
      <SuggestedNames />
    </section>
  );
}
