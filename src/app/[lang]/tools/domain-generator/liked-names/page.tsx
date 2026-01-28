import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import { getLikedNamesMessages } from "@/i18n/domain-generator-index";
import FavoriteNamesSection from "@/app/[lang]/tools/domain-generator/components/liked-names/Names";

type LikedNamesPageProps = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({
  params,
}: LikedNamesPageProps): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "nl" ? "Opgeslagen namen | Domifai" : "Saved Names | Domifai";

  return {
    title,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function LikedNamesPage({ params }: LikedNamesPageProps) {
  const { lang } = await params;
  const messages = getLikedNamesMessages(lang);

  return (
    <main>
      <FavoriteNamesSection lang={lang} messages={messages} />
    </main>
  );
}
