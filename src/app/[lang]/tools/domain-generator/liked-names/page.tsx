import type { Lang } from "@/config/i18n";
import { getLikedNamesMessages } from "@/i18n/domain-generator-index";
import FavoriteNamesSection from "@/app/[lang]/tools/domain-generator/components/liked-names/Names";

type LikedNamesPageProps = {
  params: Promise<{ lang: Lang }>;
};

export default async function LikedNamesPage({ params }: LikedNamesPageProps) {
  const { lang } = await params;
  const messages = getLikedNamesMessages(lang);

  return (
    <main>
      <FavoriteNamesSection lang={lang} messages={messages} />
    </main>
  );
}
