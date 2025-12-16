// src/app/[lang]/tools/domain-generator/niches/page.tsx
import Link from "next/link";
import type { Lang } from "@/config/i18n";

const EXAMPLE_NICHES = ["skin-care", "makelaar", "coach", "webshop"];

export default async function NichesPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-3">Niches – lang: {lang}</h1>
      <p className="text-slate-300 mb-4">
        Kies een niche om programmatic SEO pagina&apos;s te bekijken.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EXAMPLE_NICHES.map((slug) => (
          <Link
            key={slug}
            href={`/${lang}/tools/domain-generator/niches/${slug}`}
            className="border border-slate-800 rounded-xl px-3 py-2 text-sm hover:border-slate-500 transition"
          >
            {slug}
          </Link>
        ))}
      </div>
    </section>
  );
}
