import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import en from "./en.json";
import nl from "./nl.json";
import enResults from "./results/en.json";
import nlResults from "./results/nl.json";

export type GeneratorGeneralMessages = (typeof en)["generatorGeneral"];
export type GeneratorGeneralResultsMessages =
  (typeof enResults)["generatorGeneralResults"];

const generatorGeneralMessages: Record<Lang, GeneratorGeneralMessages> = {
  en: en.generatorGeneral,
  nl: nl.generatorGeneral,
};

const generatorGeneralResultsMessages: Record<
  Lang,
  GeneratorGeneralResultsMessages
> = {
  en: enResults.generatorGeneralResults,
  nl: nlResults.generatorGeneralResults,
};

export function getGeneratorGeneralMessages(
  locale: Lang
): GeneratorGeneralMessages {
  return generatorGeneralMessages[locale] ?? generatorGeneralMessages[defaultLocale];
}

export function getGeneratorGeneralResultsMessages(
  locale: Lang
): GeneratorGeneralResultsMessages {
  return (
    generatorGeneralResultsMessages[locale] ??
    generatorGeneralResultsMessages[defaultLocale]
  );
}
