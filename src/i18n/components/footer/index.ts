import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import { footerEn } from "./en";
import { footerNl } from "./nl";

export type FooterMessages = typeof footerEn;

const footerMessages: Record<Lang, FooterMessages> = {
  en: footerEn,
  nl: footerNl,
};

export function getFooterMessages(locale: Lang): FooterMessages {
  return footerMessages[locale] ?? footerMessages[defaultLocale];
}
