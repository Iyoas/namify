"use client";

import Link from "next/link";
import { SUPPORTED_LANGS, LANG_LABELS, type Lang } from "../config/i18n";
import {
  domainGeneratorBase,
  domainGeneratorGenerator,
  domainGeneratorNiches,
} from "../config/routes";

type Props = {
  lang: Lang;
};

export function Nav({ lang }: Props) {
  return (
    <header className="flex items-center justify-between gap-4">
      {/* Logo → naar tools-overzicht van deze taal */}
      <Link href={`/${lang}`} className="font-semibold tracking-tight">
        Namify
      </Link>

      {/* Links voor deze taal, met gelokaliseerde slugs */}
      <nav className="flex items-center gap-4 text-sm">
        <Link href={domainGeneratorBase(lang)} className="hover:underline">
          Tool uitleg
        </Link>
        <Link href={domainGeneratorGenerator(lang)} className="hover:underline">
          Generator
        </Link>
        <Link href={domainGeneratorNiches(lang)} className="hover:underline">
          Niches
        </Link>
      </nav>

      {/* Taal-switcher: linkt naar de gelokaliseerde tool-landing per taal */}
      <div className="flex items-center gap-2 text-xs">
        {SUPPORTED_LANGS.map((l) => (
          <Link
            key={l}
            href={domainGeneratorBase(l)}
            className={`px-2 py-1 rounded-full border ${
              l === lang ? "border-slate-200" : "border-slate-700 text-slate-400"
            }`}
          >
            {LANG_LABELS[l]}
          </Link>
        ))}
      </div>
    </header>
  );
}
