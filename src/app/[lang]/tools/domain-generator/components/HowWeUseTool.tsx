

"use client";

import Image from "next/image";
import styles from "./HowWeUseTool.module.css";

export default function HowWeUseTool() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Over ons gereedschap <br /> en hoe we het gebruiken
          </h2>

          <p className={styles.description}>
            Onze AI‑technologie is ontworpen om complexe informatie op een eenvoudige en begrijpelijke manier te verwerken. 
            Door geavanceerde taalmodellen te combineren met slimme algoritmes, kunnen we patronen herkennen, ideeën uitbreiden 
            en waardevolle inzichten genereren. Dit stelt ons in staat om snel nauwkeurige suggesties te leveren die passen bij 
            jouw stijl, industrie en doelen. Met zorgvuldige training en voortdurend leren wordt ons systeem elke dag beter in het 
            begrijpen van wat gebruikers écht nodig hebben. Zo helpen we je om efficiënter te werken en betere resultaten te behalen.
          </p>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/ai.png"
            alt="AI gereedschap visual"
            width={800}
            height={800}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}