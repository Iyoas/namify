"use client";

import styles from "./SuggestedNames.module.css";
import { Heart as HeartOutline, ArrowRight } from "lucide-react";
import { FaHeart as HeartFilled } from "react-icons/fa";

// Dit component toont de sectie met gegenereerde/suggested names
export default function SuggestedNames() {
  // Temporary demo data – deze kun je later vervangen door echte AI output
  const names = Array.from({ length: 15 }, () => "Butter Tint");

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Titel */}
        <header className={styles.header}>
          <h2 className={`section-title ${styles.title}`}>
            Meer dan 100 coole ideeën
          </h2>
          <h3 className={styles.subtitle}>voor huidverzorgingsmerken in 2025</h3>
          <p className={styles.sectionSubtitle}>
            From Minimal To Luxurious Creative Skincare Brand Names That Stand Out In 2025.
          </p>
        </header>

        {/* Grid met namen */}
        <div className={styles.grid}>
          {names.map((name, i) => (
            <div
              key={i}
              className={i === 0 ? styles.cardActive : styles.card}
            >
              <button className={styles.favButton}>
                {i === 0 ? (
                  <HeartFilled size={18} />
                ) : (
                  <HeartOutline size={18} strokeWidth={1.5} />
                )}
              </button>

              <span className={styles.name}>{name}</span>

              <button className={styles.arrowButton}>
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMore}>
            <span className={styles.loadMoreText}>meer namen weergeven</span>
          </button>
        </div>
      </div>
    </section>
  );
}
