// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Namify – AI bedrijfs- & domeinnaam generator",
  description: "Genereer sterke bedrijfs- en domeinnamen met AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}
