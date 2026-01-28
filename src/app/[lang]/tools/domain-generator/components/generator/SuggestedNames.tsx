"use client";

import styles from "./SuggestedNames.module.css";
import { ArrowRight } from "lucide-react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lang } from "@/config/i18n";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

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
  const [selectedName, setSelectedName] = React.useState<string | null>(null);

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
    const base = name.trim();
    router.push(
      `/${lang}/tools/domain-generator/generator?mode=single&domain=${encodeURIComponent(
        base
      )}`
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
              className={name === selectedName ? styles.cardActive : styles.card}
              onClick={() => setSelectedName(name)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedName(name);
                }
              }}
            >
              <button
                className={styles.favButton}
                onClick={() => toggleLike(name)}
                aria-label={`${messages.suggestedNames.ariaLike}: ${name}`}
              >
                {likedNames.includes(name) ? (
                  <IoIosHeart size={28} color="#FF4C4C" />
                ) : (
                  <IoIosHeartEmpty size={28} color="#000000" />
                )}
              </button>

              <span className={styles.name}>{name}</span>

              <button
                className={styles.arrowButton}
                onClick={() => handleArrowClick(name)}
                aria-label={`${messages.suggestedNames.ariaViewVariations}: ${name}`}
              >
                <ArrowRight size={24} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className={styles.loadMoreWrapper}>
          <Link
            href={`/${lang}/tools/domain-generator/generator`}
            className={styles.loadMore}
          >
            <span className={styles.loadMoreText}>{messages.suggestedNames.loadMore}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
