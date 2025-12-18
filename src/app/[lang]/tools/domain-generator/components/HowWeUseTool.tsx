

"use client";

import Image from "next/image";
import styles from "./HowWeUseTool.module.css";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

type HowWeUseToolProps = {
  messages: DomainGeneratorIndexMessages;
};

export default function HowWeUseTool({ messages }: HowWeUseToolProps) {
  const howWeUseTool = messages.howWeUseTool;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            {howWeUseTool.titleLine1} <br /> {howWeUseTool.titleLine2}
          </h2>

          <p className={styles.description}>
            {howWeUseTool.description}
          </p>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/ai.png"
            alt={howWeUseTool.imageAlt}
            width={800}
            height={800}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
