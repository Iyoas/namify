"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ClickAwayListener, Skeleton, Tooltip, useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { IoMdHeartEmpty, IoIosHeart, IoMdInformationCircleOutline } from "react-icons/io";
import { IoPersonOutline, IoMusicalNotesOutline } from "react-icons/io5";
import { FaRegStar, FaPlus, FaSearch } from "react-icons/fa";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { LuExternalLink } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import { GrPersonalComputer } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";
import styles from "./DomainSelect.module.css";

import type { DomainAvailabilityStatus } from "@/lib/domainr";
import type { GeneratorGeneralResultsMessages } from "@/i18n/domain-generator-index/generator-general";
import type { Lang } from "@/config/i18n";
import { getRegistrarUrl } from "@/lib/registrar";
import { getTldsForCategory, ALL_TLDS_SUPERSET } from "@/lib/tlds";
import { trackEvent } from "@/lib/analytics";
import { openAffiliateLink } from "@/lib/affiliate/openAffiliateLink";

type DomainSelectProps = {
  lang: Lang;
  names: string[];
  availability: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
  loading?: boolean;
  messages: GeneratorGeneralResultsMessages;
  generatorSlug: string;
  tone: string;
  nameLanguage: string;
};

type CategoryId = keyof GeneratorGeneralResultsMessages["domainSelect"]["categories"];

type Category = {
  id: CategoryId;
  isActive?: boolean;
  icon?: React.ReactNode;
};

type ExtensionStatus = "available" | "unavailable" | "aftermarket" | "unknown";

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
  availabilityReady?: boolean;
  namePosition?: number;
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

const LOAD_MORE_COUNT = 9;

export default function DomainSelect({
  lang,
  names,
  availability,
  tlds,
  loading = false,
  messages,
  generatorSlug,
  tone,
  nameLanguage,
}: DomainSelectProps) {
  const isHoverDevice = useMediaQuery("(hover: hover)");
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
  const [isFetchingTlds, setIsFetchingTlds] = useState(false);
  const [openAftermarketName, setOpenAftermarketName] = useState<string | null>(null);
  const hasPrefetchedAllTldsRef = useRef(false);

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


  function toggleLike(name: string, namePosition?: number) {
    setLikedNames((prev) => {
      const isCurrentlyLiked = prev.includes(name);
      const next = isCurrentlyLiked
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

  function handleTldClick(name: string, ext: Extension, namePosition?: number) {
    // Alleen klikken als de extensie beschikbaar is
    if (ext.status !== "available" && ext.status !== "aftermarket") return;

    const domain = `${name}${ext.tld}`;
    const registrarUrl = getRegistrarUrl(domain, lang);
    console.log("[CJ] registrar_click handler fired", {
      domain,
      tld: ext.tld,
      lang,
      registrarUrl,
    });

    if (ext.status === "available") {
      trackEvent("normal_name_clicked", {
        tool: "generator",
        generator_slug: generatorSlug,
        lang,
        tone,
        name_language: nameLanguage,
        name_position: namePosition,
        tld: ext.tld,
      });
    } else if (ext.status === "aftermarket") {
      trackEvent("after_marked_name_clicked", {
        tool: "generator",
        generator_slug: generatorSlug,
        lang,
        tone,
        name_language: nameLanguage,
        name_position: namePosition,
        tld: ext.tld,
      });
    }

    trackEvent("registrar_click", {
      tool: "generator",
      generator_slug: generatorSlug,
      lang,
      tone,
      name_language: nameLanguage,
      source: "tld_pill",
      name_position: namePosition,
      tld: ext.tld,
    });

    // Open in een nieuw tabblad zodat de gebruiker je site niet verlaat
    openAffiliateLink(registrarUrl);
  }

  const [extraNames, setExtraNames] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(LOAD_MORE_COUNT);

  useEffect(() => {
    setExtraNames([]);
    setVisibleLimit(LOAD_MORE_COUNT);
    setActiveCategoryId("all");
  }, [names]);

  async function handleLoadMore() {
    setIsLoadingMore(true);

    try {
      const promptFromUrl = searchParams.get("q") ?? "";
      const styleFromUrl = searchParams.get("style") ?? "Creative";
      const nameLangFromUrl = searchParams.get("nameLang") ?? "international";

      const existingNames = new Set(
        [...names, ...extraNames].map((name) => name.toLowerCase())
      );
      const collectedNames: string[] = [];
      let collectedAvailability: typeof availability = {};

      for (
        let attempt = 0;
        attempt < 3 && collectedNames.length < LOAD_MORE_COUNT;
        attempt += 1
      ) {
        const res = await fetch("/api/generate-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptFromUrl,
            lang,
            style: styleFromUrl,
            nameLang: nameLangFromUrl,
          }),
        });

        if (!res.ok) {
          break;
        }

        const data = await res.json();
        const newNames: string[] = data.names || [];
        const newAvailability =
          (data.availability as typeof availability | undefined) ?? {};

        const uniqueNames = newNames.filter((name) => {
          const normalized = name.toLowerCase();
          if (existingNames.has(normalized)) return false;
          if (collectedNames.some((n) => n.toLowerCase() === normalized)) return false;
          return true;
        });

        uniqueNames.forEach((name) => {
          if (collectedNames.length < LOAD_MORE_COUNT) {
            collectedNames.push(name);
          }
        });

        collectedAvailability = {
          ...collectedAvailability,
          ...newAvailability,
        };
      }

      if (collectedNames.length > 0) {
        setExtraNames((prev) => [...prev, ...collectedNames]);
    setVisibleLimit((prev) => prev + collectedNames.length);
      }

      if (Object.keys(collectedAvailability).length > 0) {
        setAvailabilityMap((prev) => ({
          ...prev,
          ...collectedAvailability,
        }));
      }
    } catch (err) {
      console.error("Error loading more names", err);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const mergedNames = [...names, ...extraNames];
  const namesForChecks = mergedNames.slice(0, visibleLimit);

  function mergeAvailability(
    current: typeof availability,
    incoming: typeof availability
  ) {
    const merged = { ...current };
    Object.entries(incoming).forEach(([key, value]) => {
      merged[key] = {
        ...(merged[key] ?? {}),
        ...(value ?? {}),
      };
    });
    return merged;
  }

  useEffect(() => {
    if (loading) return;
    const allowedTlds = getTldsForCategory(activeCategoryId, lang);
    const missingTlds = new Set<string>();

    namesForChecks.forEach((name) => {
      const key = name.toLowerCase().replace(/[^a-z0-9]/gi, "");
      const availabilityForName = availabilityMap?.[key] ?? {};
      allowedTlds.forEach((tld) => {
        const tldKey = tld.startsWith(".") ? tld : `.${tld}`;
        if (availabilityForName?.[tldKey] === undefined) {
          missingTlds.add(tldKey);
        }
      });
    });

    if (!missingTlds.size || isFetchingTlds) {
      return;
    }

    const tldsToFetch = Array.from(missingTlds);
    setIsFetchingTlds(true);

    fetch("/api/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        names: namesForChecks,
        tlds: tldsToFetch,
      }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as {
          availability?: typeof availability;
        };
        if (data.availability) {
          setAvailabilityMap((prev) => mergeAvailability(prev, data.availability ?? {}));
        }
      })
      .catch((err) => {
        console.error("[DomainSelect] TLD availability fetch failed:", err);
      })
      .finally(() => {
        setIsFetchingTlds(false);
      });
  }, [activeCategoryId, lang, namesForChecks, availabilityMap, isFetchingTlds, loading]);

  useEffect(() => {
    if (loading) return;
    if (hasPrefetchedAllTldsRef.current) return;

    const missingTlds = new Set<string>();
    namesForChecks.forEach((name) => {
      const key = name.toLowerCase().replace(/[^a-z0-9]/gi, "");
      const availabilityForName = availabilityMap?.[key] ?? {};
      ALL_TLDS_SUPERSET.forEach((tld) => {
        const tldKey = tld.startsWith(".") ? tld : `.${tld}`;
        if (availabilityForName?.[tldKey] === undefined) {
          missingTlds.add(tldKey);
        }
      });
    });

    if (!missingTlds.size) {
      hasPrefetchedAllTldsRef.current = true;
      return;
    }

    hasPrefetchedAllTldsRef.current = true;
    const tldsToFetch = Array.from(missingTlds);
    setIsFetchingTlds(true);

    fetch("/api/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        names: namesForChecks,
        tlds: tldsToFetch,
      }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as {
          availability?: typeof availability;
        };
        if (data.availability) {
          setAvailabilityMap((prev) => mergeAvailability(prev, data.availability ?? {}));
        }
      })
      .catch((err) => {
        console.error("[DomainSelect] Prefetch TLD availability failed:", err);
      })
      .finally(() => {
        setIsFetchingTlds(false);
      });
  }, [loading, namesForChecks, availabilityMap]);


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

            const allowedTlds = getTldsForCategory(activeCategoryId, lang);

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
                  namePosition: index + 1,
                  availabilityReady: false,
                  extensions: allowedTlds.map((tld) => ({
                    id: `${cleanKey}-${tld}`,
                    tld: tld.startsWith(".") ? tld : `.${tld}`,
                    status: "unknown",
                  })),
                };
              }
            }

            const isAvailabilityReady = allowedTlds.every(
              (tld) => resolveStatus(tld) !== undefined
            );

            const extensions: Extension[] = allowedTlds.map((tld) => {
              // Normaliseer TLD met punt
              const tldKeyWithDot = tld.startsWith(".") ? tld : `.${tld}`;
              const statusFromApi = resolveStatus(tld);

              const mappedStatus: ExtensionStatus =
                statusFromApi === "available"
                  ? "available"
                  : statusFromApi === "aftermarket"
                  ? "aftermarket"
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
              availabilityReady: isAvailabilityReady,
              namePosition: index + 1,
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

            <div className={styles.filtersRight} />
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
                  onClick={() => toggleLike(suggestion.name, suggestion.namePosition)}
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
                      onClick={() =>
                        trackEvent("generator_name_clicked", {
                          tool: "generator",
                          generator_slug: generatorSlug,
                          lang,
                          tone,
                          name_language: nameLanguage,
                          name_position: suggestion.namePosition,
                        })
                      }
                    >
                      {loading ? (
                        <Skeleton variant="text" width={140} sx={{ fontSize: "1rem" }} />
                      ) : (
                        suggestion.name
                      )}
                    </span>
                    {!loading &&
                    suggestion.availabilityReady !== false &&
                    suggestion.extensions.some((ext) => ext.status === "aftermarket") ? (
                      isHoverDevice ? (
                        <Tooltip
                          title={messages.domainSelect.aftermarketTooltip}
                          disableFocusListener
                          disableTouchListener
                          componentsProps={{
                            tooltip: {
                              sx: { fontSize: 14, padding: "8px 10px" },
                            },
                          }}
                        >
                          <span className={styles.aftermarketTag}>
                            {messages.domainSelect.aftermarketTag}
                            <IoMdInformationCircleOutline
                              aria-hidden
                              className={styles.aftermarketIcon}
                            />
                          </span>
                        </Tooltip>
                      ) : (
                        <ClickAwayListener
                          onClickAway={() => setOpenAftermarketName(null)}
                        >
                          <Tooltip
                            title={messages.domainSelect.aftermarketTooltip}
                            open={openAftermarketName === suggestion.id}
                            disableHoverListener
                            disableFocusListener
                            disableTouchListener
                          >
                            <span
                              className={styles.aftermarketTag}
                              onClick={() =>
                                setOpenAftermarketName((prev) =>
                                  prev === suggestion.id ? null : suggestion.id
                                )
                              }
                            >
                              {messages.domainSelect.aftermarketTag}
                              <IoMdInformationCircleOutline
                                aria-hidden
                                className={styles.aftermarketIcon}
                              />
                            </span>
                          </Tooltip>
                        </ClickAwayListener>
                      )
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Rechter kant: extensies */}
              <div className={styles.rowRightScroll}>
                <div className={styles.rowRight}>
                  {loading || suggestion.availabilityReady === false ? (
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
                            : ext.status === "aftermarket"
                            ? styles.extensionTagAftermarket
                            : styles.extensionTagUnavailable,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() =>
                          handleTldClick(suggestion.name, ext, suggestion.namePosition)
                        }
                        role={
                          ext.status === "available" || ext.status === "aftermarket"
                            ? "button"
                            : undefined
                        }
                        style={
                          ext.status === "available" || ext.status === "aftermarket"
                            ? { cursor: "pointer" }
                            : undefined
                        }
                      >
                        <span className={styles.extensionStatusIcon}>
                          {ext.status === "available" || ext.status === "aftermarket" ? (
                            <LuExternalLink className={styles.extensionCheckIcon} />
                          ) : (
                            "×"
                          )}
                        </span>
                        <span className={styles.extensionTld}>{ext.tld}</span>
                      </div>
                    ))
                  )}
                </div>
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
            className={styles.primaryCta}
          >
            <span>
              {isLoadingMore
                ? messages.domainSelect.footer.loadingMore
                : messages.domainSelect.footer.generateMore}
            </span>
            <FaPlus className={styles.secondaryCtaIcon} />
          </button>

          <button
            type="button"
            className={styles.secondaryCta}
            onClick={() =>
              trackEvent("generator_check_availability_submitted", {
                tool: "generator",
                generator_slug: generatorSlug,
                lang,
              })
            }
          >
            {messages.domainSelect.footer.next}
            <FaSearch className={styles.secondaryCtaIcon} />
          </button>
        </footer>
      </div>
    </section>
  );
}
