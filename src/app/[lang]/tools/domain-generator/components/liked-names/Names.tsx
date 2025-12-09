"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoMdHeart } from "react-icons/io";
import styles from "./Names.module.css";

type FavoriteName = {
  id: number;
  label: string;
  note?: string;
};

type FavoriteNamesSectionProps = {
  // Optioneel: als je de taal al weet in de parent, kun je die meegeven.
  // Als je niets meegeeft, halen we de taal uit de URL (/nl/..., /en/..., etc.).
  lang?: string;
};

export default function FavoriteNamesSection({ lang }: FavoriteNamesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathLang = pathname.split("/")[1] || "nl";
  const activeLang = lang ?? pathLang;

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

  function goToVariations(label: string) {
    router.push(
      `/${activeLang}/tools/domain-generator/results?base=${encodeURIComponent(
        label
      )}`
    );
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
              <button
                type="button"
                className={styles.cardCtaButton}
                onClick={() => goToVariations(item.label)}
              >
                <span className={styles.cardCtaLabel}>Variaties</span>
                <span className={styles.cardCtaArrow} aria-hidden>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}