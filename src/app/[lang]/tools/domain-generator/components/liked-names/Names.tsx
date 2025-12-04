"use client";

import React from "react";
import { IoMdHeart } from "react-icons/io";
import styles from "./Names.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";

type FavoriteName = {
  id: number;
  label: string;
  note?: string;
};

export default function FavoriteNamesSection() {
  const params = useParams();
  const langParam = (params as { lang?: string | string[] })?.lang;
  const lang =
    typeof langParam === "string"
      ? langParam
      : Array.isArray(langParam)
      ? langParam[0]
      : "nl";

  const [favorites, setFavorites] = React.useState<FavoriteName[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem("likedNames");
    if (stored) {
      // stored is an array of strings, convert them to FavoriteName objects
      const arr = JSON.parse(stored) as string[];
      const mapped = arr.map((name, index) => ({
        id: index + 1,
        label: name,
      }));
      setFavorites(mapped);
    }
  }, []);

  function removeFavorite(label: string) {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.label !== label);

      try {
        localStorage.setItem("likedNames", JSON.stringify(next.map((f) => f.label)));
      } catch (err) {
        console.error("Error updating likedNames in localStorage:", err);
      }

      return next;
    });
  }

  return (
    <section className={styles.section}>
      {/* Heading */}
      <header className={styles.header}>
        <h2 className={styles.title}>
          je favoriete namen
        </h2>
        <p className={styles.subtitle}>
          Waarom mijn fav: Poëtisch en mysterieus; roept nachtelijke
          transformatie op. Perfect voor rituelen en een dreamy merkverhaal.
        </p>
      </header>

      {/* Grid met favoriete namen */}
      <div className={styles.grid}>
        {favorites.map((item) => (
          <article
            key={item.id}
            className={styles.card}
          >
            {/* Titel + hartje */}
            <div className={styles.cardTopRow}>
              <h3 className={styles.cardTitle}>
                {item.label}
              </h3>

              <IoMdHeart
                className={styles.favButton}
                role="button"
                aria-label="Verwijder uit favorieten"
                onClick={() => removeFavorite(item.label)}
              />
            </div>

            {/* CTA onderin */}
            <div className={styles.cardCtaWrapper}>
              <Link
                href={`/${lang}/tools/domain-generator/generator?base=${encodeURIComponent(
                  item.label
                )}`}
                className={styles.cardCtaButton}
              >
                <span className={styles.cardCtaLabel}>variaties bekijken</span>
                <span className={styles.cardCtaArrow} aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}