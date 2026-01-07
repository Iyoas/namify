"use client";

import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Plus, ShoppingCart, Check } from "lucide-react";
import { IoMdHeartEmpty, IoIosHeart } from "react-icons/io";
import { IoPersonOutline, IoMusicalNotesOutline } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import { GrPersonalComputer } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";
import styles from "./DomainSelect.module.css";

import type { DomainAvailabilityStatus } from "@/lib/domainr";
import type { GeneratorGeneralResultsMessages } from "@/i18n/domain-generator-index/generator-general";
import type { Lang } from "@/config/i18n";
import { getRegistrarUrl } from "@/lib/registrar";

type DomainSelectProps = {
  lang: Lang;
  names: string[];
  availability: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
  loading?: boolean;
  messages: GeneratorGeneralResultsMessages;
};

type CategoryId = keyof GeneratorGeneralResultsMessages["domainSelect"]["categories"];

type Category = {
  id: CategoryId;
  isActive?: boolean;
  icon?: React.ReactNode;
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

const CATEGORY_CONFIG: Category[] = [
  { id: "all", isActive: true },
  { id: "popular", icon: <FaRegStar /> },
  { id: "business", isActive: true, icon: <LuBriefcaseBusiness /> }, // actieve pill in design
  { id: "education", icon: <RiGraduationCapLine /> },
  { id: "international", icon: <TbWorld /> },
  { id: "technology", icon: <GrPersonalComputer /> },
  { id: "social", icon: <IoPersonOutline /> },
  { id: "professional", icon: <CiSettings /> },
  { id: "entertainment", icon: <IoMusicalNotesOutline /> },
];

// Each category exposes exactly 6 TLDs
const CATEGORY_TLDS: Record<CategoryId, string[]> = {
  all: [".nl", ".com", ".io", ".ai", ".co", ".shop"],

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
  lang,
  names,
  availability,
  tlds,
  loading = false,
  messages,
}: DomainSelectProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const baseNameFromUrl = searchParams.get("base");

  const categories = useMemo(
    () =>
      CATEGORY_CONFIG.map((category) => ({
        ...category,
        label: messages.domainSelect.categories[category.id],
      })),
    [messages]
  );

  const [availabilityMap, setAvailabilityMap] =
    useState<typeof availability>(availability);

  useEffect(() => {
    setAvailabilityMap(availability);
  }, [availability]);

  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("all");

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
        setTimeout(() => {
          window.dispatchEvent(new Event("likedNamesUpdated"));
        }, 0);
      } catch (err) {
        console.error("Error saving likedNames to localStorage:", err);
      }

      return next;
    });
  }

  function handleCategoryClick(categoryId: CategoryId) {
    setActiveCategoryId(categoryId);
  }

  function handleTldClick(name: string, ext: Extension) {
    // Alleen klikken als de extensie beschikbaar is
    if (ext.status !== "available") return;

    const domain = `${name}${ext.tld}`;
    const registrarUrl = getRegistrarUrl(domain, lang);

    // Open in een nieuw tabblad zodat de gebruiker je site niet verlaat
    window.open(registrarUrl, "_blank", "noopener,noreferrer");
  }

  const [extraNames, setExtraNames] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(8);

  useEffect(() => {
    setVisibleLimit(8);
  }, [activeCategoryId, names.length]);

  async function handleLoadMore() {
    setIsLoadingMore(true);

    try {
      const promptFromUrl = searchParams.get("q") ?? "";
      const styleFromUrl = searchParams.get("style") ?? undefined;

      const res = await fetch("/api/generate-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptFromUrl,
          lang,
          style: styleFromUrl,
        }),
      });

      const data = await res.json();
      const newNames: string[] = data.names || [];
      const newAvailability =
        (data.availability as typeof availability | undefined) ?? {};

      setExtraNames((prev) => [...prev, ...newNames]);
      setVisibleLimit((prev) => prev + 8);
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

            const resolveStatus = (tld: string) => {
              const tldKeyWithDot = tld.startsWith(".") ? tld : `.${tld}`;
              const tldKeyWithoutDot = tldKeyWithDot.slice(1);
              return (
                (nameAvailability?.[tldKeyWithDot] as
                  | DomainAvailabilityStatus
                  | undefined) ??
                (nameAvailability?.[tldKeyWithoutDot] as
                  | DomainAvailabilityStatus
                  | undefined) ??
                undefined
              );
            };

            if (activeCategoryId === "all") {
              if (loading) {
                // Keep skeletons visible while loading
                return {
                  ...base,
                  id: String(index + 1),
                  name,
                  extensions: allowedTlds.map((tld) => ({
                    id: `${cleanKey}-${tld}`,
                    tld: tld.startsWith(".") ? tld : `.${tld}`,
                    status: "unknown",
                  })),
                };
              }

              const hasVisibleAvailable = allowedTlds.some(
                (tld) => resolveStatus(tld) === "available"
              );
              if (!hasVisibleAvailable) {
                return null;
              }
            }

            const extensions: Extension[] = allowedTlds.map((tld) => {
              // Normaliseer TLD met punt
              const tldKeyWithDot = tld.startsWith(".") ? tld : `.${tld}`;
              const statusFromApi = resolveStatus(tld);

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
          .filter(Boolean) as DomainSuggestion[]
      : SUGGESTIONS;

  const displaySuggestions = suggestions.slice(0, visibleLimit);
  const visibleCount = loading ? null : displaySuggestions.length;

  return (
    <section className={styles.section}>
      {/* Stepper Header */}
     {/* Stepper Header */}
      <div className={styles.stepper}>
        {/* Stap 1 – afgerond */}
        <div className={styles.step}>
          <div className={styles.stepCircleDone}>
            <Check className={styles.stepCheckIcon} />
          </div>
          <span className={styles.stepLabel}>
            {messages.domainSelect.stepper.nameIdeas}
          </span>
        </div>

        <div className={styles.stepLine} />

        {/* Stap 2 – huidige stap */}
        <div className={styles.step}>
          <div className={styles.stepCircleCurrent}>
            <span className={styles.stepDot} />
          </div>
          <span className={styles.stepLabel}>
            {messages.domainSelect.stepper.domainSelection}
          </span>
        </div>

        <div className={styles.stepLine} />

        {/* Stap 3 – aankomend */}
        <div className={styles.step}>
          <div className={styles.stepCircleUpcoming} />
          <span className={styles.stepLabel}>
            {messages.domainSelect.stepper.registration}
          </span>
        </div>
      </div>
      <div className={styles.inner}>
        {/* Titel + subtitel */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {baseNameFromUrl ? (
              `${messages.domainSelect.header.variationsPrefix} ${baseNameFromUrl}`
            ) : (
              <>
                {messages.domainSelect.header.foundPrefix}{" "}
                {loading ? (
                  <Skeleton
                    variant="text"
                    width={36}
                    sx={{ display: "inline-block", verticalAlign: "baseline" }}
                  />
                ) : (
                  String(visibleCount ?? 0)
                )}{" "}
                {messages.domainSelect.header.foundSuffix}
              </>
            )}
          </h1>
          <p className={styles.subtitle}>
            {messages.domainSelect.subtitle}
          </p>
        </header>

        {/* Filterbalk */}
        <div className={styles.filtersSection}>
          {/* Bovenste rij: label + meta-pills */}
          <div className={styles.filtersRow}>
            <span className={styles.filtersLabel}>
              {messages.domainSelect.filters.moreOptions}
            </span>

            <div className={styles.filtersRight}>
              <button
                type="button"
                className={styles.metaButton}
                aria-label={messages.domainSelect.filters.favouritesAria}
                onClick={() =>
                  router.push(`/${lang}/tools/domain-generator/liked-names`)
                }
              >
                <Heart className={styles.metaIcon} />
                <span>{messages.domainSelect.filters.favourites}</span>
                <span className={styles.metaBadge}>{likedNames.length}</span>
              </button>
            </div>
          </div>

          {/* Tweede rij: categorie-pills */}
          <div className={styles.categoriesRow}>
            <div className={styles.categories}>
              {categories.map((category) => (
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
                  {category.icon && (
                    <span className={styles.categoryIcon}>{category.icon}</span>
                  )}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lijst met domeinsuggesties */}
        <div className={styles.list}>
          {displaySuggestions.map((suggestion, index) => (
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
                  aria-label={messages.domainSelect.aria.addToFavourites}
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
                      {loading ? (
                        <Skeleton variant="text" width={140} sx={{ fontSize: "1rem" }} />
                      ) : (
                        suggestion.name
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rechter kant: extensies */}
              <div className={styles.rowRight}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`skeleton-${suggestion.name}-${i}`}
                      className={styles.extensionTag}
                      aria-hidden="true"
                    >
                      <Skeleton variant="rounded" width={64} height={28} />
                    </div>
                  ))
                ) : (
                  suggestion.extensions.map((ext) => (
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
                  ))
                )}
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
              {isLoadingMore
                ? messages.domainSelect.footer.loadingMore
                : messages.domainSelect.footer.generateMore}
            </span>
          </button>

          <button type="button" className={styles.primaryCta}>
            {messages.domainSelect.footer.next}
          </button>
        </footer>
      </div>
    </section>
  );
}
