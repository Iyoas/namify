// src/config/i18n.ts
export const SUPPORTED_LANGS = ["nl", "en", "es"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = "nl";

export const LANG_LABELS: Record<Lang, string> = {
  nl: "NL",
  en: "EN",
  es: "ES",
};
