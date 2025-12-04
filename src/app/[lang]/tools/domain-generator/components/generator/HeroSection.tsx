"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Megaphone, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./HeroSection.module.css";
import { Box, Skeleton } from "@mui/material";

type HeroSectionProps = {
  lang: string;
};

const STYLE_OPTIONS = ["Unique", "Creative", "Professional", "Tech"] as const;
type StyleOption = (typeof STYLE_OPTIONS)[number];

const EXTENSION_OPTIONS = [".com", ".nl", ".ai", ".io", ".co", ".be", ".eu"] as const;
type ExtensionOption = (typeof EXTENSION_OPTIONS)[number];

export function HeroSection({ lang }: HeroSectionProps) {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>("Unique");
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const styleSelectRef = useRef<HTMLDivElement | null>(null);

  const extensionSelectRef = useRef<HTMLDivElement | null>(null);
  const [selectedExtension, setSelectedExtension] = useState<ExtensionOption>(".com");
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);

  const samplePrompts = [
    "A brand that rejuvenates and heals",
    "A skincare clinic with a modern aesthetic",
    "A skincare brand for radiant skin",
    "A natural brand of skincare solutions",
  ];

  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const hasPrompt = prompt.trim().length > 0;
  const router = useRouter();

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
    function handleClickOutsideExt(event: MouseEvent) {
      if (
        extensionSelectRef.current &&
        !extensionSelectRef.current.contains(event.target as Node)
      ) {
        setIsExtensionOpen(false);
      }
    }

    if (isExtensionOpen) {
      document.addEventListener("mousedown", handleClickOutsideExt);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideExt);
    };
  }, [isExtensionOpen]);

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
          extension: selectedExtension,
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

  function handleGenerateClick() {
    if (!prompt.trim()) return;
    const searchParams = new URLSearchParams({
      q: prompt,
      style: selectedStyle,
      extension: selectedExtension,
    });

    router.push(
      `/${lang}/tools/domain-generator/results?` + searchParams.toString()
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Heading */}
        <h1 className={styles.title}>
          Genereer{" "}
          <span className={styles.highlight}>Skin Care-</span>
          En
          <br className={styles.titleBreak} /> Domeinnaam Met AI
        </h1>

        {/* Subheading */}
        <p className={styles.subtitle}>
          Jij Hebt Een Idee. Wij Zorgen Voor De Naam En Het Domein. Lanceer Je
          Website Vandaag Nog!
        </p>

        {/* Description area with filters + generate button */}
        <div className={styles.descriptionWrapper}>
          

          <div className={styles.descriptionBox}>
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
                  placeholder="Beschrijf uw project of bedrijfsidee."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              )}
            </div>

            <div className={styles.bottomRow}>
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
                      {STYLE_OPTIONS.map((option) => (
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

                <div className={styles.styleSelect} ref={extensionSelectRef}>
                  <button
                    type="button"
                    className={styles.optionButton}
                    onClick={() => setIsExtensionOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={isExtensionOpen}
                  >
                    <span>{selectedExtension}</span>
                    <ChevronDown className={styles.optionChevron} />
                  </button>

                  {isExtensionOpen && (
                    <ul className={styles.dropdown} role="listbox">
                      {EXTENSION_OPTIONS.map((ext) => (
                        <li key={ext}>
                          <button
                            type="button"
                            className={
                              ext === selectedExtension
                                ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                                : styles.dropdownItem
                            }
                            onClick={() => {
                              setSelectedExtension(ext);
                              setIsExtensionOpen(false);
                            }}
                          >
                            {ext}
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
                  <span>Enhance prompt</span>
                </button>
              </div>

              <div className={styles.generateRow}>
                <button
                  type="button"
                  className={styles.generateButton}
                  onClick={handleGenerateClick}
                  disabled={!prompt.trim()}
                >
                  <Sparkles className={styles.generateIcon} />
                  <span>Genereer namen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Example prompts */}
        <div className={styles.samples}>
          {samplePrompts.map((sample) => (
            <button
              key={sample}
              type="button"
              className={styles.sampleChip}
              onClick={() => setPrompt(sample)}
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}