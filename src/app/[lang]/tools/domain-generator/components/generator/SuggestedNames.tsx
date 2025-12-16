"use client";

import styles from "./SuggestedNames.module.css";
import { ArrowRight } from "lucide-react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import React from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/config/i18n";
import type { GeneratorGeneralMessages } from "@/i18n/generator-general";

type SuggestedNamesProps = {
  lang: Lang;
  messages: GeneratorGeneralMessages;
};

// Dit component toont de sectie met gegenereerde/suggested names
export default function SuggestedNames({ lang, messages }: SuggestedNamesProps) {
  const router = useRouter();

  // Temporary demo data – deze kun je later vervangen door echte AI output
  const names = messages.examples.suggestions;

  const [likedNames, setLikedNames] = React.useState<string[]>([]);

  // Load liked names from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("likedNames");
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setLikedNames(parsed);
      }
    } catch (err) {
      console.error("Error reading likedNames from localStorage:", err);
    }
  }, []);

  function toggleLike(name: string) {
    setLikedNames((prev) => {
      const next = prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];

      try {
        localStorage.setItem("likedNames", JSON.stringify(next));
      } catch (err) {
        console.error("Error saving likedNames to localStorage:", err);
      }

      return next;
    });
  }

  function handleArrowClick(name: string) {
    // We sturen de gekozen naam als base naar de results page,
    // zodat DomainSelect / Stepper de /api/name-variations route kan gebruiken.
    const base = name.trim();

    router.push(
      `/${lang}/tools/domain-generator/results?base=${encodeURIComponent(base)}`
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Titel */}
        <header className={styles.header}>
          <h2 className={`section-title ${styles.title}`}>
            {messages.suggestedNames.title}
          </h2>
          <h3 className={styles.subtitle}>{messages.suggestedNames.subtitle}</h3>
          <p className={styles.sectionSubtitle}>
            {messages.suggestedNames.description}
          </p>
        </header>

        {/* Grid met namen */}
        <div className={styles.grid}>
          {names.map((name, i) => (
            <div
              key={i}
              className={i === 0 ? styles.cardActive : styles.card}
            >
              <button
                className={styles.favButton}
                onClick={() => toggleLike(name)}
                aria-label={`${messages.suggestedNames.ariaLike}: ${name}`}
              >
                {likedNames.includes(name) ? (
                  <IoIosHeart size={24} color="#FF4C4C" />
                ) : (
                  <IoIosHeartEmpty size={24} color="#000000" />
                )}
              </button>

              <span className={styles.name}>{name}</span>

              <button
                className={styles.arrowButton}
                onClick={() => handleArrowClick(name)}
                aria-label={`${messages.suggestedNames.ariaViewVariations}: ${name}`}
              >
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMore}>
            <span className={styles.loadMoreText}>{messages.suggestedNames.loadMore}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
