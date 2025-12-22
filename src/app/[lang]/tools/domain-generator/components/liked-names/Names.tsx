"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoMdHeart } from "react-icons/io";
import { Check } from "lucide-react";
import styles from "./Names.module.css";
import type { Lang } from "@/config/i18n";
import type { LikedNamesMessages } from "@/i18n/domain-generator-index";

type FavoriteName = {
  id: number;
  label: string;
  note?: string;
};

type FavoriteNamesSectionProps = {
  // Optioneel: als je de taal al weet in de parent, kun je die meegeven.
  // Als je niets meegeeft, halen we de taal uit de URL (/nl/..., /en/..., etc.).
  lang?: Lang;
  messages: LikedNamesMessages;
};

export default function FavoriteNamesSection({
  lang,
  messages,
}: FavoriteNamesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathLang = pathname.split("/")[1] || "nl";
  const activeLang = lang ?? pathLang;

  const [favorites, setFavorites] = React.useState<FavoriteName[]>([]);

  React.useEffect(() => {
    function syncFavorites() {
      try {
        const stored = localStorage.getItem("likedNames");
        if (!stored) {
          setFavorites([]);
          return;
        }
        const arr = JSON.parse(stored) as string[];
        const mapped = arr.map((name, index) => ({
          id: index + 1,
          label: name,
        }));
        setFavorites(mapped);
      } catch (err) {
        console.error("Error reading likedNames from localStorage:", err);
      }
    }

    syncFavorites();
    window.addEventListener("storage", syncFavorites);
    window.addEventListener("likedNamesUpdated", syncFavorites as EventListener);
    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("likedNamesUpdated", syncFavorites as EventListener);
    };
  }, []);

  function removeFavorite(label: string) {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.label !== label);

      try {
        localStorage.setItem("likedNames", JSON.stringify(next.map((f) => f.label)));
        setTimeout(() => {
          window.dispatchEvent(new Event("likedNamesUpdated"));
        }, 0);
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

  function goToSingleCheck(label: string) {
    router.push(
      `/${activeLang}/tools/domain-generator/generator?mode=single&domain=${encodeURIComponent(
        label
      )}`
    );
  }

  return (
    <section className={styles.section}>
      {/* Heading */}
      <header className={styles.header}>
        <h2 className={styles.title}>{messages.title}</h2>
        <p className={styles.subtitle}>{messages.subtitle}</p>
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
                aria-label={messages.actions.remove}
                onClick={() => removeFavorite(item.label)}
              />
            </div>

            {/* CTA onderin */}
            <div className={styles.cardCtaWrapper}>
              <button
                type="button"
                className={`${styles.cardCtaButton} ${styles.cardCtaPrimary}`}
                onClick={() => goToSingleCheck(item.label)}
              >
                <span className={styles.cardCtaLabel}>
                  {messages.actions.checkAvailability}
                </span>
                <Check className={styles.cardCtaIcon} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.cardCtaButton}
                onClick={() => goToVariations(item.label)}
              >
                <span className={styles.cardCtaLabel}>
                  {messages.actions.viewVariations}
                </span>
                <span className={styles.cardCtaArrow} aria-hidden>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
