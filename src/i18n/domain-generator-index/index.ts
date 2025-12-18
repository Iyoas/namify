import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import en from "./en";
import nl from "./nl";
import enLiked from "./liked-names/en.json";
import nlLiked from "./liked-names/nl.json";

export type DomainGeneratorIndexMessages = (typeof en)["domainGeneratorIndex"];
export type LikedNamesMessages = (typeof enLiked)["likedNames"];

const domainGeneratorIndexMessages: Record<Lang, DomainGeneratorIndexMessages> = {
  en: en.domainGeneratorIndex,
  nl: nl.domainGeneratorIndex,
};

const likedNamesMessages: Record<Lang, LikedNamesMessages> = {
  en: enLiked.likedNames,
  nl: nlLiked.likedNames,
};

export function getDomainGeneratorIndexMessages(
  locale: Lang
): DomainGeneratorIndexMessages {
  return (
    domainGeneratorIndexMessages[locale] ??
    domainGeneratorIndexMessages[defaultLocale]
  );
}

export function getLikedNamesMessages(locale: Lang): LikedNamesMessages {
  return likedNamesMessages[locale] ?? likedNamesMessages[defaultLocale];
}
