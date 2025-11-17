// src/config/i18n.ts

// ---- Basis taal-config ----

// Lijst met ondersteunde talen
export const SUPPORTED_LANGS = ["nl", "en", "es"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

// Alias: Locale = Lang (handig als je ergens Locale gebruikt)
export type Locale = Lang;

export const defaultLocale: Lang = "nl";

// Handige helper om te checken of een string een geldige taal is
export function isLocale(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

// Labels voor de taal-switcher in je Nav
export const LANG_LABELS: Record<Lang, string> = {
  nl: "NL",
  en: "EN",
  es: "ES",
};

// ---- Vertalingen voor de domain-generator page ----

// Let op: zorg dat tsconfig.json "resolveJsonModule": true heeft
import nlDomainGenerator from "@/i18n/nl/domain-generator.json";
import enDomainGenerator from "@/i18n/en/domain-generator.json";
import esDomainGenerator from "@/i18n/es/domain-generator.json";

const domainGeneratorMessages = {
  nl: nlDomainGenerator,
  en: enDomainGenerator,
  es: esDomainGenerator,
} as const;

export function getDomainGeneratorMessages(locale: Lang) {
  return domainGeneratorMessages[locale] ?? domainGeneratorMessages[defaultLocale];
}
