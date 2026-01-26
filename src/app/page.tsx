// src/app/[lang]/page.tsx
import { redirect } from "next/navigation";
import { type Locale } from "@/config/i18n";

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  // Redirect meteen naar de huidige hoofdpage (domain generator index)
  redirect(`/${lang}`);
}
