import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import type { JSX } from "react";
import styles from "./IndustryGenerators.module.css";

export type GeneratorCardIconId =
  | "ecommerce"
  | "startup"
  | "marketing"
  | "creativeStudios"
  | "saasApps"
  | "restaurants";

export type GeneratorCardItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconId?: GeneratorCardIconId;
};

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

const ICON_BY_ID: Record<GeneratorCardIconId, JSX.Element> = {
  ecommerce: <EcommerceIcon />,
  startup: <StartupIcon />,
  marketing: <MarketingIcon />,
  creativeStudios: <StudioIcon />,
  saasApps: <AppsIcon />,
  restaurants: <RestaurantsIcon />,
};

export function getGeneratorCardIcon(iconId?: GeneratorCardIconId): JSX.Element {
  return ICON_BY_ID[iconId ?? "ecommerce"] ?? <EcommerceIcon />;
}

type GeneratorCardsGridProps = {
  items: GeneratorCardItem[];
  ctaLabel: string;
  showIcons?: boolean;
};

export default function GeneratorCardsGrid({
  items,
  ctaLabel,
  showIcons = true,
}: GeneratorCardsGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article
          key={item.id}
          className={showIcons ? styles.card : `${styles.card} ${styles.cardNoIcon}`}
        >
          <div
            className={
              showIcons ? styles.cardHeader : `${styles.cardHeader} ${styles.cardHeaderNoIcon}`
            }
          >
            {showIcons ? (
              <div className={styles.iconWrapper}>{getGeneratorCardIcon(item.iconId)}</div>
            ) : null}
            <h3 className={styles.cardTitle}>{item.title}</h3>
          </div>

          <p className={styles.cardDescription}>{item.description}</p>

          <div className={styles.cardFooter}>
            <Link href={item.href} className={styles.cardButton}>
              <span className={styles.cardButtonLabel}>{ctaLabel}</span>
              <ArrowRightIcon aria-hidden="true" className={styles.cardButtonIcon} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
