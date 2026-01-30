"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Megaphone, Sparkles, Wand2 } from "lucide-react";
import { BsStars } from "react-icons/bs";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./HeroSection.module.css";
import { Box, Skeleton } from "@mui/material";
import type { Lang } from "@/config/i18n";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";
import { getRegistrarUrl } from "@/lib/registrar";

type HeroSectionProps = {
  lang: Lang;
  messages: GeneratorGeneralMessages;
};

const SINGLE_TLDS = [".com", ".io", ".ai", ".net", ".co"] as const;
const NAME_LANGUAGE_VALUES = ["international", "en", "nl"] as const;
type NameLanguageValue = (typeof NAME_LANGUAGE_VALUES)[number];

type SingleResult = {
  domain: string;
  tld: string;
  status: "available" | "unavailable" | "aftermarket" | "unknown";
};

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/gi, "");
}

function buildSingleTlds(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const parts = trimmed.split(".").filter(Boolean);
  const hasDot = parts.length > 1;
  const tldCandidate = hasDot ? parts[parts.length - 1] : "";
  const isPlausibleTld = /^[a-z]{2,15}$/.test(tldCandidate);

  if (hasDot && isPlausibleTld) {
    const base = normalizeName(parts.slice(0, -1).join(""));
    if (!base) return null;
    const primaryTld = `.${tldCandidate}`;
    const extraTlds = SINGLE_TLDS.filter((tld) => tld !== primaryTld);
    return {
      base,
      tlds: [primaryTld, ...extraTlds].slice(0, 5),
    };
  }

  const base = normalizeName(trimmed);
  if (!base) return null;
  return {
    base,
    tlds: [...SINGLE_TLDS],
  };
}

export function HeroSection({ lang, messages }: HeroSectionProps) {
  const styleOptions = messages.hero.styleOptions;
  const samplePrompts = messages.examples.prompts;

  const [selectedStyle, setSelectedStyle] = useState<string>(() => {
    const preferred = ["Creative", "Creatief"];
    return (
      styleOptions.find((option) => preferred.includes(option)) ??
      styleOptions[0] ??
      "Creative"
    );
  });
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const styleSelectRef = useRef<HTMLDivElement | null>(null);

  const nameLanguageSelectRef = useRef<HTMLDivElement | null>(null);
  const [selectedNameLanguage, setSelectedNameLanguage] =
    useState<NameLanguageValue>("international");
  const [isNameLanguageOpen, setIsNameLanguageOpen] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const hasPrompt = prompt.trim().length > 0;
  const promptLength = prompt.length;
  const promptLimit = 300;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"ai" | "single">("ai");
  const [singleResults, setSingleResults] = useState<SingleResult[]>([]);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [likedNames, setLikedNames] = useState<string[]>([]);
  const [likedDomains, setLikedDomains] = useState<Set<string>>(new Set());
  const pendingSingleCheckRef = useRef<string | null>(null);

  const generatorPath =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-generator`
      : `/${lang}/tools/domain-generator`;
  const checkerPath =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-checker`
      : `/${lang}/tools/domain-checker`;
  const isCheckerPath =
    pathname?.endsWith("/tools/domain-checker") ||
    pathname?.endsWith("/tools/domeinnaam-checker");
  const isGeneratorPath =
    pathname?.endsWith("/tools/domain-generator") ||
    pathname?.endsWith("/tools/domain-generator/generator") ||
    pathname?.endsWith("/tools/domeinnaam-generator");

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const domainParam = searchParams.get("domain");

    if (isCheckerPath) {
      setMode("single");
    } else if (isGeneratorPath) {
      setMode("ai");
    } else if (modeParam === "single") {
      setMode("single");
    } else {
      setMode("ai");
    }

    if (domainParam && domainParam.trim()) {
      const cleaned = domainParam.trim();
      setPrompt(cleaned);
      pendingSingleCheckRef.current = cleaned;
    }
  }, [searchParams, isCheckerPath, isGeneratorPath]);

  useEffect(() => {
    if (mode !== "single") return;
    if (!prompt.trim()) return;
    if (!pendingSingleCheckRef.current) return;
    if (pendingSingleCheckRef.current !== prompt.trim()) return;
    pendingSingleCheckRef.current = null;
    handleGenerateClick();
  }, [mode, prompt]);

  useEffect(() => {
    if (!isStyleOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        styleSelectRef.current &&
        !styleSelectRef.current.contains(event.target as Node)
      ) {
        setIsStyleOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStyleOpen]);

  useEffect(() => {
    function handleClickOutsideLang(event: MouseEvent) {
      if (
        nameLanguageSelectRef.current &&
        !nameLanguageSelectRef.current.contains(event.target as Node)
      ) {
        setIsNameLanguageOpen(false);
      }
    }

    if (isNameLanguageOpen) {
      document.addEventListener("mousedown", handleClickOutsideLang);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLang);
    };
  }, [isNameLanguageOpen]);

  const nameLanguageOptions = useMemo<
    { value: NameLanguageValue; label: string }[]
  >(
    () => [
      {
        value: "international",
        label: messages.hero.nameLanguageOptions.international,
      },
      {
        value: "en",
        label: messages.hero.nameLanguageOptions.english,
      },
      {
        value: "nl",
        label: messages.hero.nameLanguageOptions.dutch,
      },
    ],
    [messages]
  );

  const selectedNameLanguageLabel =
    nameLanguageOptions.find((option) => option.value === selectedNameLanguage)
      ?.label ?? messages.hero.nameLanguageOptions.international;

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

  function toggleDomainLike(domain: string, baseName: string) {
    setLikedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.add(domain);
      }

      setLikedNames((current) => {
        const hasAnyForBase = Array.from(next).some(
          (d) => d.split(".")[0] === baseName
        );
        const updated = hasAnyForBase
          ? current.includes(baseName)
            ? current
            : [...current, baseName]
          : current.filter((n) => n !== baseName);

        try {
          localStorage.setItem("likedNames", JSON.stringify(updated));
          setTimeout(() => {
            window.dispatchEvent(new Event("likedNamesUpdated"));
          }, 0);
        } catch (err) {
          console.error("Error saving likedNames to localStorage:", err);
        }

        return updated;
      });

      return next;
    });
  }

  async function handleEnhancePrompt() {
    if (!prompt.trim() || isEnhancing) return;

    try {
      setIsEnhancing(true);

      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          lang,
          style: selectedStyle,
          nameLang: selectedNameLanguage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.prompt) {
        setPrompt(data.prompt);
      } else {
        console.error(data.error || "Kon prompt niet verbeteren.");
      }
    } catch (error) {
      console.error("[Enhance Prompt Error]", error);
    } finally {
      setIsEnhancing(false);
    }
  }

  async function handleGenerateClick() {
    if (!prompt.trim()) return;

    if (mode === "single") {
      const parsed = buildSingleTlds(prompt);
      if (!parsed) {
        setSingleError(messages.hero.singleError);
        setSingleResults([]);
        return;
      }

      setSingleLoading(true);
      setSingleError(null);

      try {
        const res = await fetch("/api/check-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: parsed.base,
            tlds: parsed.tlds,
          }),
        });

        if (!res.ok) {
          throw new Error("check-domain failed");
        }

        const data = (await res.json()) as { results?: SingleResult[] };
        setSingleResults(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error("[check-domain] Error:", error);
        setSingleError(messages.hero.singleError);
      } finally {
        setSingleLoading(false);
      }

      return;
    }

    const searchParams = new URLSearchParams({
      q: prompt,
      style: selectedStyle,
      nameLang: selectedNameLanguage,
    });

    router.push(
      `/${lang}/tools/domain-generator/results?` + searchParams.toString()
    );
  }

  function handleArrowClick(name: string) {
    const base = name.split(".")[0]?.trim() ?? "";
    if (!base) return;
    router.push(
      `/${lang}/tools/domain-generator/results?base=${encodeURIComponent(base)}`
    );
  }

  function handleRegistrarClick(domain: string) {
    const registrarUrl = getRegistrarUrl(domain, lang);
    window.open(registrarUrl, "_blank", "noopener,noreferrer");
  }

  function handleModeSwitch(nextMode: "ai" | "single") {
    setMode(nextMode);
    const target = nextMode === "single" ? checkerPath : generatorPath;
    router.push(target);
  }

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.headingStack}>
          <div className={styles.modeSwitch} role="tablist" aria-label="Mode">
            <button
              type="button"
              className={[
                styles.modeOption,
                mode === "ai" ? styles.modeOptionActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleModeSwitch("ai")}
              aria-pressed={mode === "ai"}
            >
              <BsStars className={styles.modeIcon} aria-hidden="true" />
              {messages.hero.modeAiNameGenerator}
            </button>
            <button
              type="button"
              className={[
                styles.modeOption,
                mode === "single" ? styles.modeOptionActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleModeSwitch("single")}
              aria-pressed={mode === "single"}
            >
              {messages.hero.modeDomainChecker}
            </button>
          </div>

          {/* Heading */}
          <h1 className={styles.title}>
            {mode === "single" ? (
              messages.hero.singleTitle
            ) : (
              <>
                {messages.hero.titlePrefix ? (
                  <>
                    {messages.hero.titlePrefix}{" "}
                  </>
                ) : null}
                <span className={styles.highlight}>
                  {messages.hero.titleHighlight}
                </span>{" "}
                {messages.hero.titleSuffix ? (
                  <>
                    {messages.hero.titleSuffix}
                  </>
                ) : null}
                {messages.hero.titleEnd ? (
                  <>
                    <br className={styles.titleBreak} /> {messages.hero.titleEnd}
                  </>
                ) : null}
              </>
            )}
          </h1>

          {/* Subheading */}
          <p className={styles.subtitle}>
            {mode === "single"
              ? messages.hero.singleSubtitle
              : messages.hero.subtitle}
          </p>
        </div>

        {/* Description area with filters + generate button */}
        <div
          className={[
            styles.descriptionWrapper,
            mode === "single" ? styles.descriptionWrapperSingle : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          

          <div
            className={[
              styles.descriptionBox,
              mode === "single" ? styles.descriptionBoxSingle : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.descriptionTop}>
              {isEnhancing ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 1.2,
                    px: "24px",
                  }}
                >
                  <Skeleton variant="rounded" height={12} animation="wave" />
                  <Skeleton variant="rounded" height={12} animation="wave" />
                  <Skeleton
                    variant="rounded"
                    height={12}
                    animation="wave"
                    sx={{ width: "70%" }}
                  />
                </Box>
              ) : (
                <textarea
                  className={styles.textarea}
                  id="generator-prompt"
                  placeholder={
                    mode === "single"
                      ? messages.hero.singlePlaceholder
                      : messages.hero.placeholder
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={promptLimit}
                />
              )}
            </div>

            <div className={styles.bottomRow}>
              {mode === "ai" && (
                <div className={styles.optionsRow}>
                  <div className={styles.styleSelect} ref={styleSelectRef}>
                    <button
                      type="button"
                      className={styles.optionButton}
                      onClick={() => setIsStyleOpen((open) => !open)}
                      aria-haspopup="listbox"
                      aria-expanded={isStyleOpen}
                    >
                      <Megaphone className={styles.optionIcon} />
                      <span>{selectedStyle}</span>
                      <ChevronDown className={styles.optionChevron} />
                    </button>

                    {isStyleOpen && (
                      <ul className={styles.dropdown} role="listbox">
                        {styleOptions.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              className={
                                option === selectedStyle
                                  ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                                  : styles.dropdownItem
                              }
                              onClick={() => {
                                setSelectedStyle(option);
                                setIsStyleOpen(false);
                              }}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={styles.styleSelect} ref={nameLanguageSelectRef}>
                    <button
                      type="button"
                      className={styles.optionButton}
                      onClick={() => setIsNameLanguageOpen((open) => !open)}
                      aria-haspopup="listbox"
                      aria-expanded={isNameLanguageOpen}
                    >
                      <span>{selectedNameLanguageLabel}</span>
                      <ChevronDown className={styles.optionChevron} />
                    </button>

                    {isNameLanguageOpen && (
                      <ul className={styles.dropdown} role="listbox">
                        {nameLanguageOptions.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              className={
                                option.value === selectedNameLanguage
                                  ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                                  : styles.dropdownItem
                              }
                              onClick={() => {
                                setSelectedNameLanguage(option.value);
                                setIsNameLanguageOpen(false);
                              }}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.optionButton}
                    onClick={handleEnhancePrompt}
                    disabled={!hasPrompt || isEnhancing}
                    style={{
                      opacity: hasPrompt ? 1 : 0.5,
                      boxShadow: hasPrompt ? undefined : "none",
                    }}
                  >
                    <Wand2 className={styles.optionIcon} />
                    <span>{messages.hero.ctaEnhance}</span>
                  </button>
                </div>
              )}

              <div className={styles.generateRow}>
                {mode === "ai" && (
                  <span className={styles.charCount}>
                    {promptLength}/{promptLimit}
                  </span>
                )}
                <button
                  type="button"
                  className={styles.generateButton}
                  onClick={handleGenerateClick}
                  disabled={!prompt.trim()}
                >
                  {mode === "single" ? (
                    <IoSearch className={styles.generateIcon} />
                  ) : (
                    <Sparkles className={styles.generateIcon} />
                  )}
                  <span>
                    {mode === "single"
                      ? messages.hero.ctaSingle
                      : messages.hero.ctaGenerate}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {mode === "single" && (
          <div className={styles.singleResults}>
            {singleLoading && (
              <div className={styles.singleLoading}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`loading-${index}`} className={styles.singleCard}>
                    <div className={styles.singleLeft}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={120} height={24} />
                    </div>
                    <div className={styles.singleRight}>
                      <Skeleton variant="text" width={64} height={22} />
                      <Skeleton variant="rounded" width={110} height={42} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!singleLoading && singleError && (
              <p className={styles.singleError}>{singleError}</p>
            )}

            {!singleLoading && !singleError && singleResults.length > 0 && (
              <div className={styles.singleList}>
                {singleResults.map((result) => {
                  const isAvailable = result.status === "available";
                  const isAftermarket = result.status === "aftermarket";
                  const isClickable = isAvailable || isAftermarket;
                  const nameKey = result.domain.split(".")[0] ?? result.domain;
                  const isLiked = likedDomains.has(result.domain);
                  return (
                    <div key={result.domain} className={styles.singleCard}>
                      <div className={styles.singleLeft}>
                        <button
                          type="button"
                          className={styles.singleHeartButton}
                          aria-label={`${messages.suggestedNames.ariaLike}: ${result.domain}`}
                          onClick={() => toggleDomainLike(result.domain, nameKey)}
                        >
                          {isLiked ? (
                            <IoIosHeart size={24} color="#FF4C4C" />
                          ) : (
                            <IoIosHeartEmpty size={24} color="#000000" />
                          )}
                        </button>
                        <span className={styles.singleDomain}>{result.domain}</span>
                      </div>
                      <div className={styles.singleRight}>
                        <button
                          type="button"
                          className={[
                            styles.singleCta,
                            isAftermarket ? styles.singleCtaAftermarket : "",
                            !isClickable ? styles.singleCtaDisabled : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          disabled={!isClickable}
                          onClick={() =>
                            isClickable ? handleRegistrarClick(result.domain) : null
                          }
                        >
                          {isClickable
                            ? messages.hero.singleClaim
                            : messages.hero.singleUnavailable}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.singleVariations}>
                  <button
                    type="button"
                    className={styles.singleVariationsButton}
                    onClick={() => handleArrowClick(singleResults[0]?.domain ?? "")}
                  >
                    <span className={styles.singleVariationsInner}>
                      <span className={styles.singleVariationsLabel}>
                        {messages.hero.singleVariations}
                      </span>
                      <span className={styles.singleVariationsArrow} aria-hidden>
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example prompts */}
        {mode === "ai" && (
          <div className={styles.samples}>
            {samplePrompts.map((sample) => (
              <button
                key={sample}
                type="button"
                className={styles.sampleChip}
                onClick={() => setPrompt(sample)}
              >
                {sample}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
