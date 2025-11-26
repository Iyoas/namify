"use client";

import { useState } from "react";
import { Heart, Plus, Star, ShoppingCart, Check } from "lucide-react";
import styles from "./DomainSelect.module.css";

import type { DomainAvailabilityStatus } from "@/lib/domainr";

type DomainSelectProps = {
  names: string[];
  availability: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
};

type Category = {
  id: string;
  label: string;
  isActive?: boolean;
};

type ExtensionStatus = "available" | "unavailable" | "unknown";

type Extension = {
  id: string;
  tld: string;
  status: ExtensionStatus;
};

type DomainSuggestion = {
  id: string;
  name: string;
  estimatedPrice: string;
  extensions: Extension[];
};

const CATEGORIES: Category[] = [
  { id: "all", label: "All", isActive: true },
  { id: "popular", label: "Popular" },
  { id: "business", label: "Business", isActive: true }, // actieve pill in design
  { id: "education", label: "Education" },
  { id: "international", label: "International" },
  { id: "technology", label: "Technology" },
  { id: "social", label: "Social" },
  { id: "professional", label: "Professional" },
  { id: "entertainment", label: "Entertainment" },
];

const SUGGESTIONS: DomainSuggestion[] = [
  {
    id: "1",
    name: "Figma",
    estimatedPrice: "€7,99",
    extensions: [
      { id: "1-shop", tld: ".shop", status: "available" },
      { id: "1-ai", tld: ".ai", status: "available" },
      { id: "1-nl", tld: ".nl", status: "available" },
      { id: "1-net", tld: ".net", status: "available" },
      { id: "1-io", tld: ".io", status: "available" },
      { id: "1-co", tld: ".co", status: "unavailable" },
    ],
  },
  {
    id: "2",
    name: "Figma",
    estimatedPrice: "€7,99",
    extensions: [
      { id: "2-shop", tld: ".shop", status: "available" },
      { id: "2-ai", tld: ".ai", status: "available" },
      { id: "2-nl", tld: ".nl", status: "available" },
      { id: "2-net", tld: ".net", status: "available" },
      { id: "2-io", tld: ".io", status: "available" },
      { id: "2-co", tld: ".co", status: "unavailable" },
    ],
  },
  {
    id: "3",
    name: "Figma",
    estimatedPrice: "€7,99",
    extensions: [
      { id: "3-shop", tld: ".shop", status: "available" },
      { id: "3-ai", tld: ".ai", status: "available" },
      { id: "3-nl", tld: ".nl", status: "available" },
      { id: "3-net", tld: ".net", status: "available" },
      { id: "3-io", tld: ".io", status: "available" },
      { id: "3-co", tld: ".co", status: "unavailable" },
    ],
  },
  {
    id: "4",
    name: "Figma",
    estimatedPrice: "€7,99",
    extensions: [
      { id: "4-shop", tld: ".shop", status: "available" },
      { id: "4-ai", tld: ".ai", status: "available" },
      { id: "4-nl", tld: ".nl", status: "available" },
      { id: "4-net", tld: ".net", status: "available" },
      { id: "4-io", tld: ".io", status: "available" },
      { id: "4-co", tld: ".co", status: "unavailable" },
    ],
  },
];

export default function DomainSelect({
  names,
  availability,
  tlds,
}: DomainSelectProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("business");

  const suggestions: DomainSuggestion[] =
    names && names.length > 0
      ? names.map((name, index) => {
          const base = SUGGESTIONS[index % SUGGESTIONS.length];

          // Dezelfde normalisatie als in domainr.ts: lowercase + non-alfanumeriek verwijderen
          const cleanKey = name
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, "");

          const nameAvailability = availability?.[cleanKey] ?? {};

          const extensions: Extension[] = base.extensions.map((ext) => {
            // Zorg dat we zowel ".nl" als "nl" kunnen matchen, afhankelijk van hoe het in availability staat
            const tldKeyWithDot = ext.tld.startsWith(".") ? ext.tld : `.${ext.tld}`;
            const tldKeyWithoutDot = ext.tld.startsWith(".")
              ? ext.tld.slice(1)
              : ext.tld;

            const statusFromApi =
              (nameAvailability?.[tldKeyWithDot] as DomainAvailabilityStatus | undefined) ??
              (nameAvailability?.[tldKeyWithoutDot] as DomainAvailabilityStatus | undefined) ??
              undefined;

            const mappedStatus: ExtensionStatus =
              statusFromApi === "available"
                ? "available"
                : statusFromApi === "unavailable"
                ? "unavailable"
                : "unknown";

            return {
              ...ext,
              status: mappedStatus,
            };
          });

          return {
            ...base,
            id: String(index + 1),
            name,
            extensions,
          };
        })
      : SUGGESTIONS;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Titel + subtitel */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            We hebben 8 naamideeën voor je gevonden
          </h1>
          <p className={styles.subtitle}>
            Gebaseerd op je input hebben we creatieve suggesties gemaakt 🎉
          </p>
        </header>

        {/* Filterbalk */}
        <div className={styles.filtersSection}>
          {/* Bovenste rij: label + meta-pills */}
          <div className={styles.filtersRow}>
            <span className={styles.filtersLabel}>More options</span>

            <div className={styles.filtersRight}>
              <button type="button" className={styles.metaButton}>
                <Heart className={styles.metaIcon} />
                <span>your Favourites</span>
                <span className={styles.metaBadge}>10</span>
              </button>

              <button type="button" className={styles.metaButton}>
                <ShoppingCart className={styles.metaIcon} />
                <span>your basket</span>
                <span className={styles.metaBadge}>10</span>
              </button>
            </div>
          </div>

          {/* Tweede rij: categorie-pills */}
          <div className={styles.categoriesRow}>
            <div className={styles.categories}>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={[
                    styles.categoryPill,
                    category.id === activeCategoryId ? styles.categoryPillActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {category.label === "Popular" && (
                    <Star className={styles.categoryIcon} />
                  )}
                  {category.label === "Business" && (
                    <span className={styles.categoryDot} />
                  )}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lijst met domeinsuggesties */}
        <div className={styles.list}>
          {suggestions.map((suggestion) => (
            <article key={suggestion.id} className={styles.row}>
              {/* Linker kant: naam + prijs */}
              <div className={styles.rowLeft}>
                <button
                  type="button"
                  className={styles.favouriteIconButton}
                  aria-label="Zet in favourieten"
                >
                  <Heart className={styles.favouriteIcon} />
                </button>

                <div className={styles.rowText}>
                  <div className={styles.nameLine}>
                    <span className={styles.domainName}>{suggestion.name}</span>
                    <span className={styles.estimatedLabel}>
                      Geschatte prijs{" "}
                      <span className={styles.estimatedPrice}>
                        {suggestion.estimatedPrice}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Rechter kant: extensies */}
              <div className={styles.rowRight}>
                {suggestion.extensions.map((ext) => (
                  <div
                    key={ext.id}
                    className={[
                      styles.extensionTag,
                      ext.status === "available"
                        ? styles.extensionTagAvailable
                        : styles.extensionTagUnavailable,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className={styles.extensionStatusIcon}>
                      {ext.status === "available" ? (
                        <Check className={styles.extensionCheckIcon} />
                      ) : (
                        "×"
                      )}
                    </span>
                    <span className={styles.extensionTld}>{ext.tld}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA’s */}
        <footer className={styles.footer}>
          <button type="button" className={styles.secondaryCta}>
            <Plus className={styles.secondaryCtaIcon} />
            <span>Genereer meer namen</span>
          </button>

          <button type="button" className={styles.primaryCta}>
            Next
          </button>
        </footer>
      </div>
    </section>
  );
}