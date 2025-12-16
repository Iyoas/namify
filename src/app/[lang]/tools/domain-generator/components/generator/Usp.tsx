"use client";

import Image from "next/image";
import styles from "./Usp.module.css";

const uspItems = [
  {
    title: "AI-generated names",
    description:
      "Generate strong brand and domain name ideas fast with advanced language models.",
    icon: "/icons/ai-search.svg",
  },
  {
    title: "Smart domain search",
    description:
      "Let the generator suggest variants and combinations that fit your niche, audience, and extensions.",
    icon: "/icons/star.svg",
  },
  {
    title: "Brand and handle checks",
    description:
      "Avoid duplicates. Quickly check if your ideas are free as brand names or social handles.",
    icon: "/icons/tm.svg",
  },
  {
    title: "Free logo with your domain",
    description:
      "Get a simple starter logo that matches your name so you have an instant visual identity.",
    icon: "/icons/price-card.svg",
  },
] as const;

export default function Usp() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={`title ${styles.title}`}>
            Why choose Namitor{" "}
          </h2>
        </header>

        <div className={styles.grid}>
          {uspItems.map((usp) => (
            <article key={usp.title} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Image
                  src={usp.icon}
                  alt="Icon"
                  width={32}
                  height={32}
                  className={styles.icon}
                />
              </div>
              <h3 className={styles.cardTitle}>{usp.title}</h3>
              <p className={styles.cardText}>{usp.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
