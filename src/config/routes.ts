// src/config/routes.ts
import type { Lang } from "./i18n";

export const ROUTE_SEGMENTS = {
  tools: {
    nl: "tools",
    en: "tools",
    es: "herramientas",
  },
  domainGenerator: {
    nl: "bedrijfsnaam-generator",
    en: "domain-generator",
    es: "generador-de-dominios",
  },
  generatorSub: {
    nl: "generator",
    en: "generator",
    es: "generador",
  },
  niches: {
    nl: "niches",
    en: "niches",
    es: "nichos",
  },
  nameIdeas: {
    nl: "naam-ideeen",
    en: "name-ideas",
    es: "ideas-de-nombres",
  },
  registerDomain: {
    nl: "domein-registreren",
    en: "register-domain",
    es: "registrar-dominio",
  },
} as const;

export function domainGeneratorBase(lang: Lang) {
  const tools = ROUTE_SEGMENTS.tools[lang];
  const tool = ROUTE_SEGMENTS.domainGenerator[lang];
  return `/${lang}/${tools}/${tool}`;
}

export function domainGeneratorGenerator(lang: Lang) {
  const base = domainGeneratorBase(lang);
  const sub = ROUTE_SEGMENTS.generatorSub[lang];
  return `${base}/${sub}`;
}

export function domainGeneratorNiches(lang: Lang) {
  const base = domainGeneratorBase(lang);
  const niches = ROUTE_SEGMENTS.niches[lang];
  return `${base}/${niches}`;
}

export function domainGeneratorNicheDetail(lang: Lang, slug: string) {
  return `${domainGeneratorNiches(lang)}/${slug}`;
}

export function domainGeneratorNameIdeas(lang: Lang) {
  const base = domainGeneratorBase(lang);
  const nameIdeas = ROUTE_SEGMENTS.nameIdeas[lang];
  return `${base}/${nameIdeas}`;
}

export function domainGeneratorRegisterDomain(lang: Lang) {
  const base = domainGeneratorBase(lang);
  const rd = ROUTE_SEGMENTS.registerDomain[lang];
  return `${base}/${rd}`;
}
