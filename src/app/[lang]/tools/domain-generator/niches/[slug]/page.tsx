// src/app/[lang]/tools/domain-generator/niches/[slug]/page.tsx
import type { Lang } from "@/config/i18n";

export default function NicheDetailPage({
  params,
}: {
  params: { lang: Lang; slug: string };
}) {
  const { lang, slug } = params;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-2">
          Programmatic niche page – {slug}
        </h1>
        <p className="text-slate-300">
          Hier komt later jouw uitgebreide SEO-content + niche-specifieke
          generator voor deze categorie.
        </p>
      </header>

      <div className="border border-slate-800 rounded-2xl p-4">
        <p className="text-sm text-slate-400">
          Placeholder: niche slug is <code>{slug}</code> (lang:{" "}
          <code>{lang}</code>).
        </p>
      </div>
    </section>
  );
}
