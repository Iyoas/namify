"use client";

import { useParams } from "next/navigation";
import styles from "./IndustryGenerators.module.css";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";
import GeneratorCardsGrid, { type GeneratorCardIconId } from "./GeneratorCardsGrid";

type IndustryGeneratorsProps = {
  messages: DomainGeneratorIndexMessages;
};

export default function IndustryGenerators({ messages }: IndustryGeneratorsProps) {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "nl";
  const generatorHref =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-generator`
      : `/${lang}/tools/domain-generator`;
  const cards =
    messages.industryGenerators.cards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      href: generatorHref,
      iconId: card.id as GeneratorCardIconId,
    })) ?? [];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h2 className={styles.title}>{messages.industryGenerators.title}</h2>
          </div>

          <p className={styles.intro}>{messages.industryGenerators.intro}</p>
        </header>

        <GeneratorCardsGrid items={cards} ctaLabel={messages.industryGenerators.cardCta} />
      </div>
    </section>
  );
}
