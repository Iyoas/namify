import "./globals.css";
import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Domifai",
  description: "AI powered domain generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} ${urbanist.variable} app-body`}>
        {children}
      </body>
    </html>
  );
}
