// src/app/[lang]/tools/domain-generator/page.tsx
import type { Lang } from "@/config/i18n";
import Hero from "@/app/[lang]/tools/domain-generator/components/Hero";

type Props = {
  params: { lang: Lang };
};

export default function DomainGeneratorLanding({ params }: Props) {
  return (
    <main>
      <Hero lang={params.lang} />
      {/* Straks: <Steps /> <Features /> <Niches /> <FAQ /> <Contact /> */}
    </main>
  );
}
