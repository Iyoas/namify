import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import { privacyPolicyEn } from "./privacyPolicy.en";
import { privacyPolicyNl } from "./privacyPolicy.nl";

export type PrivacyPolicyMessages = typeof privacyPolicyEn;

const privacyPolicyMessages: Record<Lang, PrivacyPolicyMessages> = {
  en: privacyPolicyEn,
  nl: privacyPolicyNl,
};

export function getPrivacyPolicyMessages(locale: Lang): PrivacyPolicyMessages {
  return privacyPolicyMessages[locale] ?? privacyPolicyMessages[defaultLocale];
}
