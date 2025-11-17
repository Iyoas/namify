// src/app/[lang]/tools/domain-generator/name-ideas/page.tsx
import type { Lang } from "@/config/i18n";

export default function NameIdeasPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-3">Name ideas – lang: {lang}</h1>
      <p className="text-slate-300">
        Hier kun je later een variant van de generator maken die puur focust op
        naamideeën zonder domeincheck.
      </p>
    </section>
  );
}
