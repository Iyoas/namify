// src/app/[lang]/tools/domain-generator/generator/page.tsx
import type { Lang } from "@/config/i18n";

type DomainGeneratorFormProps = {
  lang: Lang;
};

export function DomainGeneratorForm({ lang }: DomainGeneratorFormProps) {
  return <div>Domain Generator Form for language: {lang}</div>;
}

export default function DomainGeneratorPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-3">
          AI bedrijfsnaam &amp; domeinnaam generator
        </h1>
        <p className="text-slate-300 max-w-2xl">
          Vul je niche, keywords en voorkeuren in en laat AI je helpen met het
          vinden van sterke merk- en domeinnamen.
        </p>
      </header>

      <DomainGeneratorForm lang={lang} />
    </section>
  );
}
