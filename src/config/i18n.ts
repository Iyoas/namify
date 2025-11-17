// src/config/i18n.ts

// Alle ondersteunde talen in je project
export const SUPPORTED_LANGS = ["nl", "en", "es"] as const;

// Type die automatisch "nl" | "en" | "es" wordt
export type Lang = (typeof SUPPORTED_LANGS)[number];

// Welke taal geladen wordt wanneer iemand naar "/" gaat
export const DEFAULT_LANG: Lang = "nl";

// Labels die je kunt gebruiken in je UI (taalswitcher)
export const LANG_LABELS: Record<Lang, string> = {
  nl: "NL",
  en: "EN",
  es: "ES",
};

// Eventueel later voor echte tekst-i18n
export const LANGUAGE_NAMES: Record<Lang, string> = {
  nl: "Nederlands",
  en: "English",
  es: "Español",
};
