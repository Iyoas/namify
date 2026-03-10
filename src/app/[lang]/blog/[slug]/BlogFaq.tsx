"use client";

import { useId, useState } from "react";
import styles from "./BlogPost.module.css";

type BlogFaqItem = {
  question: string;
  answer: string;
};

type BlogFaqProps = {
  items: BlogFaqItem[];
  title: string;
  subtitle: string;
};

export default function BlogFaq({ items, title, subtitle }: BlogFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionId = useId();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.faqSection} aria-labelledby={`${sectionId}-heading`}>
      <div className={styles.faqHeader}>
        <h2 id={`${sectionId}-heading`} className={styles.faqTitle}>
          {title}
        </h2>
        <p className={styles.faqSubtitle}>{subtitle}</p>
      </div>

      <div className={styles.faqCard}>
        <ul className={styles.faqList}>
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `${sectionId}-answer-${index}`;

            return (
              <li
                key={`${item.question}-${index}`}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
              >
                <div className={styles.faqItemSurface}>
                  <button
                    type="button"
                    className={styles.faqQuestionButton}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  >
                    <span className={styles.faqQuestionText}>{item.question}</span>
                    <span className={styles.faqToggle} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={answerId}
                    className={styles.faqAnswerWrap}
                    hidden={!isOpen}
                  >
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
