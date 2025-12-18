"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import styles from "./IndustryGenerators.module.css";
import { JSX } from "react";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

function EcommerceIcon() {
  return (
    <img
      src="/icons/ecommerce.svg"
      alt=""
      aria-hidden="true"
      className={styles.icon}
    />
  );
}

function StartupIcon() {
  return <img src="/icons/startup.svg" alt="" aria-hidden="true" className={styles.icon} />;
}

function MarketingIcon() {
  return <img src="/icons/marketing.svg" alt="" aria-hidden="true" className={styles.icon} />;
}

function RestaurantsIcon() {
  return <img src="/icons/restaunt.svg" alt="" aria-hidden="true" className={styles.icon} />;
}

function AppsIcon() {
  return <img src="/icons/apps.svg" alt="" aria-hidden="true" className={styles.icon} />;
}

function StudioIcon() {
  return <img src="/icons/studio.svg" alt="" aria-hidden="true" className={styles.icon} />;
}

type IndustryCard = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

const ICON_BY_ID: Record<string, JSX.Element> = {
  ecommerce: <EcommerceIcon />,
  startup: <StartupIcon />,
  marketing: <MarketingIcon />,
  creativeStudios: <StudioIcon />,
  saasApps: <AppsIcon />,
  restaurants: <RestaurantsIcon />,
};

type IndustryGeneratorsProps = {
  messages: DomainGeneratorIndexMessages;
};

export default function IndustryGenerators({ messages }: IndustryGeneratorsProps) {
  const cards: IndustryCard[] =
    messages.industryGenerators.cards.map((card) => ({
      ...card,
      icon: ICON_BY_ID[card.id] ?? <EcommerceIcon />,
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

        <div className={styles.grid}>
          {cards.map((industry) => (
            <article key={industry.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>{industry.icon}</div>
                <h3 className={styles.cardTitle}>{industry.title}</h3>
              </div>

              <p className={styles.cardDescription}>{industry.description}</p>

              <div className={styles.cardFooter}>
                <Link href="#" className={styles.cardButton}>
                  <span>{messages.industryGenerators.cardCta}</span>
                  <ArrowRightIcon aria-hidden="true" className={styles.cardButtonIcon} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
