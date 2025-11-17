// src/app/[lang]/layout.tsx

import Link from "next/link";
import React from "react";

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = params;           // HIER haal je lang uit de URL

  return (
    <html lang={lang}>
      <body>
        <nav>
          <Link href={`/${lang}`}>Namify</Link>
          <Link href={`/${lang}/tools/domain-generator`}>Tool uitleg</Link>
          <Link href={`/${lang}/tools/domain-generator/generator`}>Generator</Link>
          <Link href={`/${lang}/tools/domain-generator/niches`}>Niches</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
