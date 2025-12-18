import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import { headerEn } from "./en";
import { headerNl } from "./nl";

export type HeaderMessages = typeof headerEn;

const headerMessages: Record<Lang, HeaderMessages> = {
  en: headerEn,
  nl: headerNl,
};

export function getHeaderMessages(locale: Lang): HeaderMessages {
  return headerMessages[locale] ?? headerMessages[defaultLocale];
}
