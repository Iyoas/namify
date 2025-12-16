// src/config/i18n.ts

// ---- Basis taal-config ----

// Lijst met ondersteunde talen
export const SUPPORTED_LANGS = ["nl", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const defaultLocale: Lang = "en";
// Alias: Locale = Lang (handig als je ergens Locale gebruikt)
export type Locale = Lang;



// Handige helper om te checken of een string een geldige taal is
export function isLocale(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

// Labels voor de taal-switcher in je Nav
export const LANG_LABELS: Record<Lang, string> = {
  nl: "NL",
  en: "EN",
};

// ---- Vertalingen voor de domain-generator page ----

// Let op: zorg dat tsconfig.json "resolveJsonModule": true heeft
import nlDomainGenerator from "@/i18n/generator-general/nl.json";
import enDomainGenerator from "@/i18n/generator-general/en.json";

const domainGeneratorMessages: Record<Lang, typeof enDomainGenerator> = {
  nl: nlDomainGenerator,
  en: enDomainGenerator,
};

export function getDomainGeneratorMessages(locale: Lang) {
  return domainGeneratorMessages[locale] ?? domainGeneratorMessages[defaultLocale];
}
