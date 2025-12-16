"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Megaphone, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./HeroSection.module.css";
import { Box, Skeleton } from "@mui/material";
import type { Lang } from "@/config/i18n";
import type { GeneratorGeneralMessages } from "@/i18n/generator-general";

type HeroSectionProps = {
  lang: Lang;
  messages: GeneratorGeneralMessages;
};

const EXTENSION_OPTIONS = [".com", ".nl", ".ai", ".io", ".co", ".be", ".eu"] as const;
type ExtensionOption = (typeof EXTENSION_OPTIONS)[number];

export function HeroSection({ lang, messages }: HeroSectionProps) {
  const styleOptions = messages.hero.styleOptions;
  const samplePrompts = messages.examples.prompts;

  const [selectedStyle, setSelectedStyle] = useState<string>(
    () => styleOptions[0] ?? ""
  );
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const styleSelectRef = useRef<HTMLDivElement | null>(null);

  const extensionSelectRef = useRef<HTMLDivElement | null>(null);
  const [selectedExtension, setSelectedExtension] = useState<ExtensionOption>(".com");
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);

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
          {messages.hero.titlePrefix}{" "}
          <span className={styles.highlight}>{messages.hero.titleHighlight}</span>{" "}
          {messages.hero.titleSuffix}
          <br className={styles.titleBreak} />
          {" "}
          {messages.hero.titleEnd}
        </h1>

        {/* Subheading */}
        <p className={styles.subtitle}>
          {messages.hero.subtitle}
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
                  placeholder={messages.hero.placeholder}
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
                  <span>{messages.hero.ctaEnhance}</span>
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
                  <span>{messages.hero.ctaGenerate}</span>
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
              {sample}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
