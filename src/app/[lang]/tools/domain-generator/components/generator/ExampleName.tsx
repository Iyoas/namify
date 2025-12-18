"use client";

import { CheckCircle2 } from "lucide-react";
import styles from "./ExampleName.module.css";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

/**
 * Statische voorbeeldkaart voor een gegenereerde domeinnaam.
 * Later kun je deze eenvoudig dynamisch maken door props toe te voegen.
 */
export default function ExampleName({
  messages,
}: {
  messages: GeneratorGeneralMessages;
}) {
  const example = messages.examples.exampleName;
  const benefits = example.benefits;

  return (
    <section className={styles.section}>
      <article className={styles.card}>
        {/* Linkerkant: label, domeinnaam en benefits */}
        <div className={styles.left}>
          <div className={styles.matchRow}>
            <span className={styles.matchBadge}>{example.matchBadge}</span>
          </div>

          <div className={styles.nameRow}>
            <h3 className={styles.domainName}>{example.name}</h3>
            <span className={styles.discountBadge}>{example.discountBadge}</span>
          </div>

          <div className={styles.benefits}>
            {benefits.map((benefit) => (
              <div key={benefit} className={styles.benefitBadge}>
                <CheckCircle2 className={styles.benefitIcon} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rechterkant: prijs en CTA's */}
        <div className={styles.right}>
          <div className={styles.priceBlock}>
            <span className={styles.originalPrice}>{example.originalPrice}</span>
            <span className={styles.currentPrice}>
              {example.currentPrice}
              <span className={styles.billingCycle}>{example.billingCycle}</span>
            </span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton}>
              {example.secondaryCta}
            </button>
            <button type="button" className={styles.primaryButton}>
              {example.primaryCta}
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
