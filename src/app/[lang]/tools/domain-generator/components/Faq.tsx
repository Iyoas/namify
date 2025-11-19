"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Faq.module.css";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "Hoe werkt de AI-bedrijfsnaam en domeinnaam generator precies?",
    answer:
      "Je vult een korte beschrijving van je idee in, kiest eventueel een niche en tone of voice, en onze AI genereert in een paar seconden een lijst met naam- en domeinvoorstellen. Je kunt resultaten verfijnen, opslaan als favoriet en nieuwe rondes genereren totdat je de perfecte match vindt.",
  },
  {
    id: 2,
    question: "Is Namify gratis te gebruiken?",
    answer:
      "Je kunt de generator gratis proberen voor een beperkt aantal queries per dag. Voor intensiever gebruik, extra filters, het opslaan van favorieten en exportmogelijkheden kun je upgraden naar een betaalde bundel. Zo betaal je alleen voor wat je echt nodig hebt.",
  },
  {
    id: 3,
    question: "Zoek jullie tool ook meteen beschikbare domeinnamen?",
    answer:
      "Ja. Bij elk voorstel controleren we automatisch of het bijbehorende domein nog beschikbaar is bij populaire extensies, zoals .nl, .com en .io. Zo zie je in één oogopslag welke combinaties je direct kunt registreren bij onze partners.",
  },
  {
    id: 4,
    question: "Kan ik de gegenereerde namen later opnieuw bekijken?",
    answer:
      "Absoluut. In je favorieten-overzicht kun je eerdere sessies terugvinden, namen vergelijken en notities toevoegen. Dit is handig als je met een team keuzes wilt maken of varianten wilt testen voordat je definitief een domein vastlegt.",
  },
  {
    id: 5,
    question: "Ondersteunen jullie ook andere talen dan Nederlands?",
    answer:
      "Ja, Namify is gebouwd met meertaligheid in gedachten. We starten met Nederlands en Engels, maar voegen stapsgewijs meer talen toe. Zo kun je straks eenvoudig namen genereren voor internationale merken of projecten.",
  },
  {
    id: 6,
    question: "Wat gebeurt er met de gegevens die ik invoer?",
    answer:
      "We gebruiken je input alleen om goede suggesties te doen binnen je sessie. Je tekst wordt niet gedeeld met derden en we slaan geen gevoelige data op zonder toestemming. In onze privacyverklaring lees je precies hoe we met gegevens omgaan.",
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState<number | null>(FAQ_ITEMS[1]?.id ?? null);

  const handleToggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        {/* Linkerkant: titel + illustratie */}
        <div className={styles.left}>
          <header className={styles.header}>
            <p className={styles.kicker}>Veelgestelde vragen</p>
            <h2 id="faq-heading" className={styles.title}>
              Alles wat je moet weten, helder uitgelegd.
            </h2>
          </header>

          <div className={styles.illustrationWrapper}>
            <Image
              src="/images/faq.png"
              alt="FAQ illustratie"
              width={520}
              height={420}
              className={styles.illustration}
              priority={false}
            />
          </div>
        </div>

        {/* Rechterkant: FAQ-lijst */}
        <div className={styles.right}>
          <ul className={styles.list}>
            {FAQ_ITEMS.map((item) => {
              const isOpen = item.id === openId;

              return (
                <li
                  key={item.id}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.questionRow}
                    aria-expanded={isOpen}
                    onClick={() => handleToggle(item.id)}
                  >
                    <span className={styles.questionText}>{item.question}</span>
                    <span className={styles.toggleIcon} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={styles.answer}>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}