"use client";

import { useEffect, useMemo, useState } from "react";

type UseTypewriterPlaceholderOptions = {
  phrases: string[];
  enabled?: boolean;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  nextPhraseDelay?: number;
};

export function useTypewriterPlaceholder({
  phrases,
  enabled = true,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 1400,
  nextPhraseDelay = 220,
}: UseTypewriterPlaceholderOptions) {
  const safePhrases = useMemo(
    () => phrases.filter((phrase) => phrase.trim().length > 0),
    [phrases]
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || safePhrases.length === 0) {
      return;
    }

    const currentPhrase = safePhrases[phraseIndex % safePhrases.length] ?? "";
    const atEnd = displayText === currentPhrase;
    const atStart = displayText.length === 0;

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          if (atEnd) {
            setIsDeleting(true);
            return;
          }

          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
          return;
        }

        if (!atStart) {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
          return;
        }

        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % safePhrases.length);
      },
      !isDeleting && atEnd
        ? pauseDuration
        : isDeleting && atStart
          ? nextPhraseDelay
          : isDeleting
            ? deletingSpeed
            : typingSpeed
    );

    return () => window.clearTimeout(timeout);
  }, [
    deletingSpeed,
    displayText,
    enabled,
    isDeleting,
    nextPhraseDelay,
    pauseDuration,
    phraseIndex,
    safePhrases,
    typingSpeed,
  ]);

  return displayText;
}
