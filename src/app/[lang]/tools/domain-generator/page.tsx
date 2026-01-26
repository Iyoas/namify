// src/app/[lang]/tools/domain-generator/page.tsx
import { redirect } from "next/navigation";

type DomainGeneratorPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function DomainGeneratorPage({
  params,
}: DomainGeneratorPageProps) {
  const { lang } = await params;

  // Redirect direct naar de generator (huidige hoofdpage)
  redirect(`/${lang}`);
}
