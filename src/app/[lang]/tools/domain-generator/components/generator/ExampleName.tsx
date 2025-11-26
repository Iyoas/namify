"use client";

import { CheckCircle2 } from "lucide-react";
import styles from "./ExampleName.module.css";

/**
 * Statische voorbeeldkaart voor een gegenereerde domeinnaam.
 * Later kun je deze eenvoudig dynamisch maken door props toe te voegen.
 */
export default function ExampleName() {
  const benefits = [
    ".ai-domeinen zijn perfect voor AI-tools en machine‑learningprojecten",
    "Dit domein is ideaal voor AI-gerelateerde projecten en startups",
  ];

  return (
    <section className={styles.section}>
      <article className={styles.card}>
        {/* Linkerkant: label, domeinnaam en benefits */}
        <div className={styles.left}>
          <div className={styles.matchRow}>
            <span className={styles.matchBadge}>Exact match</span>
          </div>

          <div className={styles.nameRow}>
            <h3 className={styles.domainName}>Domainain.ai</h3>
            <span className={styles.discountBadge}>SAVE 20%</span>
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
            <span className={styles.originalPrice}>US$79.99</span>
            <span className={styles.currentPrice}>
              US $79.99<span className={styles.billingCycle}>/1ST YR</span>
            </span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton}>
              Make it yours
            </button>
            <button type="button" className={styles.primaryButton}>
              Build your own
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}