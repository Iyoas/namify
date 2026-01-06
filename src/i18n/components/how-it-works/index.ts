import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import { howItWorksEn } from "./en";
import { howItWorksNl } from "./nl";

export type HowItWorksMessages = typeof howItWorksEn;

const howItWorksMessages: Record<Lang, HowItWorksMessages> = {
  en: howItWorksEn,
  nl: howItWorksNl,
};

export function getHowItWorksMessages(locale: Lang): HowItWorksMessages {
  return howItWorksMessages[locale] ?? howItWorksMessages[defaultLocale];
}
