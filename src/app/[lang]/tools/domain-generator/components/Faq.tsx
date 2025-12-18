"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Faq.module.css";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

type FaqProps = {
  messages: DomainGeneratorIndexMessages;
};

export default function Faq({ messages }: FaqProps) {
  const faqItems: FaqItem[] = messages.faq.items ?? [];
  const [openId, setOpenId] = useState<number | null>(faqItems[1]?.id ?? null);

  const handleToggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        {/* Linkerkant: titel + illustratie */}
        <div className={styles.left}>
          <header className={styles.header}>
            <p className={styles.kicker}>{messages.faq.kicker}</p>
            <h2 id="faq-heading" className={styles.title}>
              {messages.faq.title}
            </h2>
          </header>

          <div className={styles.illustrationWrapper}>
            <Image
              src="/images/faq.png"
              alt={messages.faq.illustrationAlt ?? "FAQ"}
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
            {faqItems.map((item) => {
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
