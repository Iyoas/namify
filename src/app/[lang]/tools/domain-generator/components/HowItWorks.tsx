"use client";

import { Share2, Sparkles, Lightbulb, Lock } from "lucide-react";
import styles from "./HowItWorks.module.css";
import { JSX } from "react";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Deel je idee",
    description:
      "Kies hoe je jouw idee wilt delen: met een korte beschrijving, een businessplan of een link. De AI haalt zelf de juiste info eruit.",
    icon: (
      <Share2
        aria-hidden="true"
        stroke="none"
        fill="currentColor"
        className="filledIcon"
      />
    ),
  },
  {
    id: 2,
    title: "Kies de toon van je naam",
    description:
      "Kies de stijl die bij je past: kort en krachtig, creatief en uniek, zakelijk of speels. Jij bepaalt de richting, de AI denkt mee.",
    icon: (
      <Sparkles
        aria-hidden="true"
        stroke="none"
        fill="currentColor"
        className="filledIcon"
      />
    ),
  },
  {
    id: 3,
    title: "Ontvang slimme AI-voorstellen",
    description:
      "Op basis van je input krijg je direct creatieve naamideeën met beschikbare domeinen (.nl, .com). Je kunt filteren, sorteren en zoveel nieuwe ideeën genereren als je wilt.",
    icon: (
      <Lightbulb
        aria-hidden="true"
        stroke="none"
        fill="currentColor"
        className="filledIcon"
      />
    ),
  },
  {
    id: 4,
    title: "Registreer met één klik",
    description:
      "Heb je de juiste naam gevonden? Klik op ‘registreer’. Alles wordt geregeld en binnen enkele minuten staat de domeinnaam op jouw naam. Daarna kun je direct verder bouwen.",
    icon: (
      <Lock
        aria-hidden="true"
        stroke="none"
        fill="currentColor"
        className="filledIcon"
      />
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Hoe werkt het stap voor stap?</h2>
          <p className={styles.subtitle}>
            Ontdek hoe je in 3 eenvoudige stappen met AI de perfecte domeinnaam
            vindt die bij jouw idee past.
          </p>
        </header>

        <div className={styles.grid}>
          {STEPS.map((step) => (
            <article key={step.id} className={styles.card}>
              <div className={styles.iconWrapper}>{step.icon}</div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardText}>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
