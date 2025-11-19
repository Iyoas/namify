"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import styles from "./IndustryGenerators.module.css";
import { JSX } from "react";

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
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const INDUSTRY_CARDS: IndustryCard[] = [
  {
    id: 1,
    title: "E-commerce",
    description: "Ontdek originele webshopnamen.",
    icon: <EcommerceIcon />,
  },
  {
    id: 2,
    title: "Start-up",
    description: "Ontdek originele namen voor startups.",
    icon: <StartupIcon />,
  },
  {
    id: 3,
    title: "Marketing",
    description: "Ontdek namen die je merk laten opvallen.",
    icon: <MarketingIcon />,
  },
  {
    id: 4,
    title: "Creatieve studio’s",
    description: "Ontdek originele namen voor creatieve studio’s.",
    icon: <StudioIcon />,
  },
  {
    id: 5,
    title: "SaaS & apps",
    description: "Ontdek namen voor innovatieve software en apps.",
    icon: <AppsIcon />,
  },
  {
    id: 6,
    title: "Restaurants",
    description: "Ontdek smaakvolle namen voor horecaconcepten.",
    icon: <RestaurantsIcon />,
  },
];

export default function IndustryGenerators() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h2 className={styles.title}>ideeën voor branche specifieke namen</h2>
          </div>

          <p className={styles.intro}>
            Ontdek unieke naamideeën die perfect aansluiten bij de identiteit, waarden en doelgroep
            van jouw branche – van frisse startups tot gevestigde merken.
          </p>
        </header>

        <div className={styles.grid}>
          {INDUSTRY_CARDS.map((industry) => (
            <article key={industry.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>{industry.icon}</div>
                <h3 className={styles.cardTitle}>{industry.title}</h3>
              </div>

              <p className={styles.cardDescription}>{industry.description}</p>

              <div className={styles.cardFooter}>
                <Link href="#" className={styles.cardButton}>
                  <span>Genereer namen</span>
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