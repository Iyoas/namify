// src/app/[lang]/page.tsx
import Link from "next/link";
import { SUPPORTED_LANGS, DEFAULT_LANG, LANG_LABELS, type Lang } from "@/config/i18n";


export default function LangHomePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Namify tools</h1>
      <p className="text-slate-300 mb-6">
        Kies een tool om slimme naam- en domeinideeën te genereren met AI.
      </p>

      <div className="grid gap-4">
        <Link
          href={`/${lang}/tools/domain-generator`}
          className="border border-slate-800 rounded-2xl p-4 hover:border-slate-500 transition"
        >
          <h2 className="text-xl font-semibold mb-1">
            Bedrijfsnaam &amp; domeinnaam generator
          </h2>
          <p className="text-slate-300 text-sm">
            Genereer sterke merk- en domeinnamen voor jouw bedrijf, in elke niche.
          </p>
        </Link>
      </div>
    </section>
  );
}
