// src/app/[lang]/layout.tsx
import type { ReactNode } from "react";
import { SUPPORTED_LANGS, type Lang } from "../../config/i18n";
import "../globals.css";
import { Nav } from "../../components/Nav";

type Props = {
  children: ReactNode;
  params: { lang: string };
};

export default function LangLayout({ children, params }: Props) {
  const lang = params.lang as Lang;

  if (!SUPPORTED_LANGS.includes(lang)) {
    // later kun je hier notFound() doen
    return (
      <html>
        <body>Language not supported</body>
      </html>
    );
  }

  return (
    <html lang={lang}>
      <body className="bg-slate-950 text-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Nav lang={lang} />
          <main className="mt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
