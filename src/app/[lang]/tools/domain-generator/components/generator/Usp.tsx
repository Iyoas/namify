"use client";

import Image from "next/image";
import styles from "./Usp.module.css";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

const uspItems = [
  {
    key: "ai",
    icon: "/icons/star.svg",
  },
  {
    key: "smartSearch",
    icon: "/icons/search.svg",
  },
  {
    key: "brandChecks",
    icon: "/icons/shuffle.svg",
  },
  {
    key: "logo",
    icon: "/icons/heart.svg",
  },
] as const;

type UspProps = {
  messages: GeneratorGeneralMessages;
};

export default function Usp({ messages }: UspProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={`title ${styles.title}`}>
            {messages.whyChoose.title}{" "}
          </h2>
        </header>

        <div className={styles.grid}>
          {uspItems.map((usp) => {
            const content = messages.whyChoose.cards[usp.key];

            return (
              <article key={usp.key} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Image
                    src={usp.icon}
                    alt="Icon"
                    width={32}
                    height={32}
                    className={styles.icon}
                  />
                </div>
                <h3 className={styles.cardTitle}>{content.title}</h3>
                <p className={styles.cardText}>{content.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
