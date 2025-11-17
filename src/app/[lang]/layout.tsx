// src/app/[lang]/layout.tsx
import type { ReactNode } from "react";
import "../globals.css";
import { Nav } from "@/components/Nav";
import { SUPPORTED_LANGS, type Lang, DEFAULT_LANG } from "@/config/i18n";

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  // gebruik 'any' zodat we niet botsen met Next z'n eigen LayoutProps-typing
  params: any;
}) {
  const langParam = params?.lang as string | undefined;
  const lang = (langParam ?? DEFAULT_LANG) as Lang;

  if (!SUPPORTED_LANGS.includes(lang)) {
    return (
      <html>
        <body className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
          <p>Language “{langParam}” is not supported.</p>
        </body>
      </html>
    );
  }

  return (
    <html lang={lang}>
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Nav lang={lang} />
          <main className="mt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
