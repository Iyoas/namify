// src/app/[lang]/layout.tsx
import { SUPPORTED_LANGS, defaultLocale, type Lang } from "@/config/i18n";
import { Nav } from "@/components/Nav";

export default function LangLayout({ children, params }: any) {
  // In sommige Next 16-typings is params een Promise, dus:
  const rawLang = (params && "then" in params)
    ? (params as Promise<{ lang: string }>).then((p) => p.lang)
    : params?.lang;

  // Voor nu: ga er vanuit dat rawLang sync is (praktijkcase)
  const lang: Lang = SUPPORTED_LANGS.includes(rawLang as Lang)
    ? (rawLang as Lang)
    : defaultLocale;

  return (
    <html lang={lang}>
      <body className="min-h-screen">
        <Nav lang={lang} />
        {children}
      </body>
    </html>
  );
}
