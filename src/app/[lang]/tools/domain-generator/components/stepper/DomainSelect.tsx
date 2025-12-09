"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Plus, Star, ShoppingCart, Check } from "lucide-react";
import { IoMdHeartEmpty, IoIosHeart } from "react-icons/io";
import { FaRegCircle, FaCircle } from "react-icons/fa";
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

// Each category exposes exactly 6 TLDs
const CATEGORY_TLDS: Record<string, string[]> = {
  all: [ ".nl", ".com",".io", ".ai", ".co", ".shop"],

  popular: [".com", ".io", ".ai", ".co", ".net", ".nl"],

  business: [".com", ".nl", ".co", ".biz", ".pro", ".io"],

  education: [".edu", ".academy", ".school", ".nl", ".org", ".info"],

  international: [".com", ".io", ".global", ".world", ".co", ".net"],

  technology: [".io", ".ai", ".tech", ".cloud", ".dev", ".com"],

  social: [".social", ".me", ".nl", ".fun", ".chat", ".co"],

  professional: [".pro", ".consulting", ".com", ".nl", ".io", ".co"],

  entertainment: [".fun", ".show", ".media", ".nl", ".io", ".live"],
};

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
  const searchParams = useSearchParams();

  const baseNameFromUrl = searchParams.get("base");


  const [availabilityMap, setAvailabilityMap] =
    useState<typeof availability>(availability);

  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const [likedNames, setLikedNames] = useState<string[]>([]);

  useEffect(() => {
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

  function handleCategoryClick(categoryId: string) {
    setActiveCategoryId(categoryId);
  }

  function handleTldClick(name: string, ext: Extension) {
    // Alleen klikken als de extensie beschikbaar is
    if (ext.status !== "available") return;

    const domain = `${name}${ext.tld}`;
    // Voor nu standaard naar GoDaddy – later kun je dit makkelijk vervangen
    const registrarUrl = `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(
      domain
    )}`;

    // Open in een nieuw tabblad zodat de gebruiker je site niet verlaat
    window.open(registrarUrl, "_blank", "noopener,noreferrer");
  }

  const [extraNames, setExtraNames] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function handleLoadMore() {
    setIsLoadingMore(true);

    try {
      const promptFromUrl = searchParams.get("q") ?? "";
      const styleFromUrl = searchParams.get("style") ?? undefined;
      const langFromUrl = searchParams.get("lang") ?? undefined;

      const res = await fetch("/api/generate-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptFromUrl,
          lang: langFromUrl,
          style: styleFromUrl,
        }),
      });

      const data = await res.json();
      const newNames: string[] = data.names || [];
      const newAvailability =
        (data.availability as typeof availability | undefined) ?? {};

      setExtraNames((prev) => [...prev, ...newNames]);
      setAvailabilityMap((prev) => ({
        ...prev,
        ...newAvailability,
      }));
    } catch (err) {
      console.error("Error loading more names", err);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const mergedNames = [...names, ...extraNames];

  const suggestions: DomainSuggestion[] =
    mergedNames && mergedNames.length > 0
      ? mergedNames
          .map((name, index) => {
            const base = SUGGESTIONS[index % SUGGESTIONS.length];

            // Dezelfde normalisatie als in domainr.ts: lowercase + non-alfanumeriek verwijderen
            const cleanKey = name
              .toLowerCase()
              .replace(/[^a-z0-9]/gi, "");

            const nameAvailability = availabilityMap?.[cleanKey] ?? {};

            const allowedTlds =
              CATEGORY_TLDS[activeCategoryId] ?? CATEGORY_TLDS["all"];

            const extensions: Extension[] = allowedTlds.map((tld) => {
              // Normaliseer TLD met punt
              const tldKeyWithDot = tld.startsWith(".") ? tld : `.${tld}`;
              const tldKeyWithoutDot = tldKeyWithDot.slice(1);

              const statusFromApi =
                (nameAvailability?.[tldKeyWithDot] as
                  | DomainAvailabilityStatus
                  | undefined) ??
                (nameAvailability?.[tldKeyWithoutDot] as
                  | DomainAvailabilityStatus
                  | undefined) ??
                undefined;

              const mappedStatus: ExtensionStatus =
                statusFromApi === "available"
                  ? "available"
                  : statusFromApi === "unavailable"
                  ? "unavailable"
                  : "unknown";

              return {
                id: `${cleanKey}-${tldKeyWithDot}`,
                tld: tldKeyWithDot,
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
          .filter((suggestion) => {
            // Only filter in `all` category
            if (activeCategoryId !== "all") return true;

            return suggestion.extensions.some(
              (ext) => ext.status === "available"
            );
          })
      : SUGGESTIONS;

  return (
    <section className={styles.section}>
      {/* Stepper Header */}
      <div className={styles.stepper}>
        <div className={styles.step}>
          <div className={styles.stepCircleActive}>
            <FaCircle className={styles.stepIconActive} />
          </div>
          <span className={styles.stepLabel}>Naam ideeën</span>
        </div>

        <div className={styles.stepLine} />

        <div className={styles.step}>
          <div className={styles.stepCircle}>
            <FaRegCircle className={styles.stepIconCurrent} />
          </div>
          <span className={styles.stepLabel}>Domein selectie</span>
        </div>

        <div className={styles.stepLine} />

        <div className={styles.step}>
          <div className={styles.stepCircle}>○</div>
          <span className={styles.stepLabel}>Meer extensies</span>
        </div>

        <div className={styles.stepLine} />

        <div className={styles.step}>
          <div className={styles.stepCircle}>○</div>
          <span className={styles.stepLabel}>Registratie</span>
        </div>
      </div>
      <div className={styles.inner}>
        {/* Titel + subtitel */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {baseNameFromUrl
              ? `Variaties op ${baseNameFromUrl}`
              : "We hebben 8 naamideeën voor je gevonden"}
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
                <span className={styles.metaBadge}>{likedNames.length}</span>
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
                  onClick={() => handleCategoryClick(category.id)}
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
          {suggestions.map((suggestion, index) => (
            <article
              key={suggestion.id}
              className={styles.row}
              style={
                baseNameFromUrl && index === 0
                  ? { borderWidth: 1.5, borderStyle: "solid" }
                  : undefined
              }
            >
              {/* Linker kant: naam + prijs */}
              <div className={styles.rowLeft}>
                <button
                  type="button"
                  className={styles.favouriteIconButton}
                  aria-label="Zet in favourieten"
                  onClick={() => toggleLike(suggestion.name)}
                >
                  {likedNames.includes(suggestion.name) ? (
                    <IoIosHeart className={styles.favouriteIconSelected} />
                  ) : (
                    <IoMdHeartEmpty className={styles.favouriteIcon} />
                  )}
                </button>

                <div className={styles.rowText}>
                  <div className={styles.nameLine}>
                    <span
                      className={styles.domainName}
                      style={
                        baseNameFromUrl && index === 0
                          ? { fontWeight: 700 }
                          : undefined
                      }
                    >
                      {suggestion.name}
                    </span>
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
                    onClick={() => handleTldClick(suggestion.name, ext)}
                    role={ext.status === "available" ? "button" : undefined}
                    style={
                      ext.status === "available"
                        ? { cursor: "pointer" }
                        : undefined
                    }
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
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className={styles.secondaryCta}
          >
            <Plus className={styles.secondaryCtaIcon} />
            <span>
              {isLoadingMore ? "Even wachten..." : "Genereer 8 nieuwe namen"}
            </span>
          </button>

          <button type="button" className={styles.primaryCta}>
            Next
          </button>
        </footer>
      </div>
    </section>
  );
}