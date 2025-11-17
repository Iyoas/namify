// src/app/[lang]/layout.tsx
import type { ReactNode } from "react";
import LayoutProps from "next";

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  // In Next 16 typed routes is params hier een Promise
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
