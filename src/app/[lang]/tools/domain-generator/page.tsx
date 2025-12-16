// src/app/[lang]/tools/domain-generator/page.tsx

import Link from "next/link";

type DomainGeneratorPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function DomainGeneratorPage({
  params,
}: DomainGeneratorPageProps) {
  const { lang } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          Namify
        </p>
        <h1 className="text-3xl font-semibold">
          AI bedrijfsnaam- & domeinnaamgenerator
        </h1>
        <p className="text-gray-600">
          Gebruik de tools hieronder om een sterke merknaam, domeinnaam en
          ideeën per niche te genereren.
        </p>
      </header>

      {/* Navigatie naar de subtools */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/${lang}/tools/domain-generator/generator`}
          className="block rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <h2 className="font-medium">Generator</h2>
          <p className="text-sm text-gray-600 mt-1">
            Vul je niche, stijl en voorkeuren in en genereer direct bedrijfs- en
            domeinnamen.
          </p>
        </Link>

        <Link
          href={`/${lang}/tools/domain-generator/name-ideas`}
          className="block rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <h2 className="font-medium">Name ideas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ontvang een lijst met creatieve naamideeën gebaseerd op jouw input.
          </p>
        </Link>

        <Link
          href={`/${lang}/tools/domain-generator/niches`}
          className="block rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <h2 className="font-medium">Niches</h2>
          <p className="text-sm text-gray-600 mt-1">
            Programmatic niche-pagina&apos;s met niche-specifieke voorbeelden en
            content.
          </p>
        </Link>

        <Link
          href={`/${lang}/tools/domain-generator/register-domain`}
          className="block rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <h2 className="font-medium">Register domain</h2>
          <p className="text-sm text-gray-600 mt-1">
            Check of je favoriete domein nog vrij is en registreer &apos;m.
          </p>
        </Link>
      </section>

      <section className="text-sm text-gray-500">
        <p>
          Je bekijkt de tool in taal: <code>{lang}</code>
        </p>
      </section>
    </main>
  );
}
