import type { Lang } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import en from "./en.json";
import nl from "./nl.json";

export type GeneratorGeneralMessages = (typeof en)["generatorGeneral"];

const generatorGeneralMessages: Record<Lang, GeneratorGeneralMessages> = {
  en: en.generatorGeneral,
  nl: nl.generatorGeneral,
};

export function getGeneratorGeneralMessages(
  locale: Lang
): GeneratorGeneralMessages {
  return generatorGeneralMessages[locale] ?? generatorGeneralMessages[defaultLocale];
}
