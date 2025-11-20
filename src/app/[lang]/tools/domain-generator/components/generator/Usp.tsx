"use client";

import Image from "next/image";
import styles from "./Usp.module.css";

const uspItems = [
  {
    title: "AI-gegenereerde namen",
    description:
      "Genereer razendsnel sterke merk- en domeinnaam ideeën met behulp van geavanceerde taalmodellen (LLM).",
  },
  {
    title: "Slim zoeken naar domeinnamen",
    description:
      "Laat de generator automatisch varianten en combinaties zoeken die passen bij jouw niche, doelgroep en extensies.",
  },
  {
    title: "Merk- en gebruikersnaamchecks",
    description:
      "Voorkom dubbele namen. Controleer direct of jouw ideeën nog vrij zijn als merk- of gebruikersnaam.",
  },
  {
    title: "Gratis logo bij je domein",
    description:
      "Ontvang een eenvoudig startlogo dat aansluit bij je naam, zodat je direct een eerste merkuitstraling hebt.",
  },
] as const;

export default function Usp() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={`title ${styles.title}`}>
            Waarom Kiezen Voor Namitor{" "}
           
          </h2>
        </header>

        <div className={styles.grid}>
          {uspItems.map((usp) => (
            <article key={usp.title} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/star.svg"
                  alt="Ster icoon"
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
