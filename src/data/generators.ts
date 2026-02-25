import path from "node:path";
import { readFile } from "node:fs/promises";
import type { Lang } from "@/config/i18n";
import type { GeneratorCardIconId } from "@/app/[lang]/tools/domain-generator/components/GeneratorCardsGrid";

type NicheEntry = {
  id: string;
  slug?: string;
  niche: string;
};

export type GeneratorsOverviewItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconId: GeneratorCardIconId;
  category: GeneratorCategoryKey;
};

export type GeneratorCategoryKey =
  | "tech"
  | "ecommerce"
  | "marketing"
  | "services"
  | "creative"
  | "hospitality"
  | "events";

const NICHES_EN_PATH = path.join(process.cwd(), "src/data/niches-en");
const NICHES_NL_PATH = path.join(process.cwd(), "src/data/niches-nl");
const MAX_ITEMS = 24;

const ICON_ROTATION: GeneratorCardIconId[] = [
  "ecommerce",
  "startup",
  "marketing",
  "creativeStudios",
  "saasApps",
  "restaurants",
];

async function readNiches(filePath: string): Promise<NicheEntry[]> {
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as NicheEntry[];
  return Array.isArray(parsed) ? parsed : [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getIconId(id: string, niche: string, index: number): GeneratorCardIconId {
  const key = `${id} ${niche}`.toLowerCase();

  if (/(shop|commerce|store|ecom|dropshipping|retail)/.test(key)) return "ecommerce";
  if (/(startup|b2b|agency|consult|marketing|brand)/.test(key)) return "marketing";
  if (/(saas|software|app|ai|tech|cyber|platform)/.test(key)) return "saasApps";
  if (/(studio|design|creative|photo|video)/.test(key)) return "creativeStudios";
  if (/(restaurant|cafe|food|bakery|bar|kitchen)/.test(key)) return "restaurants";
  if (/(startup|venture|founder)/.test(key)) return "startup";

  return ICON_ROTATION[index % ICON_ROTATION.length];
}

function getGeneratorBasePath(lang: Lang): string {
  return lang === "nl" ? `/${lang}/tools/domeinnaam-generator` : `/${lang}/tools/domain-generator`;
}

function getEnglishDescriptionNicheLabel(niche: string): string {
  const lower = niche.toLowerCase();

  if (lower === "app") return "apps";

  return lower;
}

function getCategory(id: string, niche: string): GeneratorCategoryKey {
  const key = `${id} ${niche}`.toLowerCase();

  if (/(saas|software|app|ai|cyber|tech|startup)/.test(key)) return "tech";
  if (/(shop|store|webshop|dropshipping|amazon|etsy|fba)/.test(key)) return "ecommerce";
  if (/(marketing|agency|b2b|consult|real estate|cleaning|construction|education)/.test(key)) {
    if (/marketing/.test(key)) return "marketing";
    return "services";
  }
  if (/(design|media|photography|blog)/.test(key)) return "marketing";
  if (/(restaurant|fitness)/.test(key)) return "hospitality";
  if (/(festival|nightclub|event)/.test(key)) return "events";

  return "services";
}

export async function getGeneratorsOverviewItems(
  lang: Lang
): Promise<GeneratorsOverviewItem[]> {
  const [enNiches, nlNiches] = await Promise.all([
    readNiches(NICHES_EN_PATH),
    readNiches(NICHES_NL_PATH),
  ]);

  const nlById = new Map(nlNiches.map((item) => [item.id, item]));
  const basePath = getGeneratorBasePath(lang);

  return enNiches.slice(0, MAX_ITEMS).map((enItem, index) => {
    const nlItem = nlById.get(enItem.id);
    const nlNiche = nlItem?.niche ?? enItem.niche;
    const enSlug = enItem.slug ?? slugify(enItem.niche);
    const nlSlug = slugify(nlNiche);
    const href = `${basePath}/${lang === "nl" ? nlSlug : enSlug}`;

    return {
      id: enItem.id,
      title: lang === "nl" ? nlNiche : enItem.niche,
      description:
        lang === "nl"
          ? `Genereer originele namen voor ${nlNiche.toLowerCase()}.`
          : `Generate original names for ${getEnglishDescriptionNicheLabel(enItem.niche)}.`,
      href,
      iconId: getIconId(enItem.id, lang === "nl" ? nlNiche : enItem.niche, index),
      category: getCategory(enItem.id, lang === "nl" ? nlNiche : enItem.niche),
    };
  });
}

export type GeneratorsOverviewCategoryGroup = {
  category: GeneratorCategoryKey;
  items: GeneratorsOverviewItem[];
};

export async function getGeneratorsOverviewCategoryGroups(
  lang: Lang
): Promise<GeneratorsOverviewCategoryGroup[]> {
  const items = await getGeneratorsOverviewItems(lang);
  const order: GeneratorCategoryKey[] = [
    "tech",
    "ecommerce",
    "marketing",
    "services",
    "creative",
    "hospitality",
    "events",
  ];

  return order
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);
}
