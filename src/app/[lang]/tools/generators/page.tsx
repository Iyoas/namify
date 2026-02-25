import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import { getGeneratorsOverviewCategoryGroups } from "@/data/generators";
import { getGeneratorsOverviewMessages } from "@/i18n/generators-overview";
import GeneratorsOverviewClient from "./GeneratorsOverviewClient";
import styles from "./GeneratorsOverviewPage.module.css";

type Props = {
  params: Promise<{ lang: Lang }>;
};

const SITE_URL = "https://www.domifai.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const messages = getGeneratorsOverviewMessages(lang);

  const canonical = `${SITE_URL}/${lang}/tools/generators`;
  const enUrl = `${SITE_URL}/en/tools/generators`;
  const nlUrl = `${SITE_URL}/nl/tools/generators`;

  return {
    title: messages.metaTitle,
    description: messages.metaDescription,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        nl: nlUrl,
        "x-default": enUrl,
      },
    },
  };
}

export default async function GeneratorsOverviewPage({ params }: Props) {
  const { lang } = await params;
  const messages = getGeneratorsOverviewMessages(lang);
  const groups = await getGeneratorsOverviewCategoryGroups(lang);

  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <div className={styles.inner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{messages.heroTitle}</h1>
            <p className={styles.heroSubtitle}>{messages.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.inner}>
          <GeneratorsOverviewClient
            groups={groups}
            cardCta={messages.cardCta}
            allFilterLabel={messages.allFilterLabel}
            filterCategoryLabels={messages.filterCategories}
            categoryLabels={messages.categories}
          />
        </div>
      </section>
    </main>
  );
}
