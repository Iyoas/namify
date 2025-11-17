// src/components/forms/DomainGeneratorForm.tsx
"use client";

import { useState } from "react";
import type { Lang } from "@/config/i18n";

type Props = {
  lang: Lang;
};

export function DomainGeneratorForm({ lang }: Props) {
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Placeholder: later vervang je dit met een echte API-call
    const dummy = [
      `${niche || "Brand"}ly`,
      `${niche || "Brand"}io`,
      `${(niche || "brand").toLowerCase()}hub`,
    ];

    setResults(dummy);
  };

  return (
    <div className="border border-slate-800 rounded-2xl p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-slate-200">Niche / branche</label>
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500"
            placeholder="Bijv. skincare, makelaar, agency..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-200">Keywords</label>
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500"
            placeholder="Bijv. premium, modern, duurzaam..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="inline-flex px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium"
        >
          Genereer ideeën
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Voorstellen ({results.length})
          </h2>
          <ul className="space-y-1 text-sm">
            {results.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between border border-slate-800 rounded-xl px-3 py-2"
              >
                <span>{name}</span>
                <span className="text-xs text-slate-400">.com / .nl check</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        Actieve taal: <code>{lang}</code> (later kun je hier taal-specifieke
        copy tonen).
      </p>
    </div>
  );
}
