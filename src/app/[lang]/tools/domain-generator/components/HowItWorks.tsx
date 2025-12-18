"use client";

import { Share2, Sparkles, Lightbulb, Lock } from "lucide-react";
import styles from "./HowItWorks.module.css";
import { JSX } from "react";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const STEP_ICONS: JSX.Element[] = [
  <Share2
    aria-hidden="true"
    stroke="none"
    fill="currentColor"
    className="filledIcon"
    key="share"
  />,
  <Sparkles
    aria-hidden="true"
    stroke="none"
    fill="currentColor"
    className="filledIcon"
    key="sparkles"
  />,
  <Lightbulb
    aria-hidden="true"
    stroke="none"
    fill="currentColor"
    className="filledIcon"
    key="lightbulb"
  />,
  <Lock
    aria-hidden="true"
    stroke="none"
    fill="currentColor"
    className="filledIcon"
    key="lock"
  />,
];

type HowItWorksProps = {
  messages: DomainGeneratorIndexMessages;
};

export default function HowItWorks({ messages }: HowItWorksProps) {
  const steps: Step[] =
    messages.howItWorks.steps.map((step, index) => ({
      ...step,
      icon: STEP_ICONS[index] ?? STEP_ICONS[STEP_ICONS.length - 1],
    })) ?? [];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>{messages.howItWorks.title}</h2>
          <p className={styles.subtitle}>{messages.howItWorks.subtitle}</p>
        </header>

        <div className={styles.grid}>
          {steps.map((step) => (
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
