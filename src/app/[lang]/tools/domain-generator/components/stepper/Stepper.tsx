"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { DomainAvailabilityStatus } from "@/lib/domainr";
import type { Lang } from "@/config/i18n";
import type { GeneratorGeneralResultsMessages } from "@/i18n/domain-generator-index/generator-general";
import DomainSelect from "./DomainSelect";
import { createRequestId, trackEvent } from "@/lib/analytics";

const FALLBACK_TLDS = [".com", ".nl", ".io", ".ai", ".co", ".shop"];

type GenerateDomainResponse = {
  names: string[];
  availability?: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
  count: number;
};

type StepperProps = {
  lang: Lang;
  initialPrompt?: string;
  messages: GeneratorGeneralResultsMessages;
};

export default function Stepper({
  lang,
  initialPrompt,
  messages,
}: StepperProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const baseFromQuery = searchParams.get("base");
  const baseNameFromUrl = baseFromQuery ? baseFromQuery.trim() : undefined;
  const styleFromQuery = searchParams.get("style") ?? "Creative";
  const nameLangFromQuery = searchParams.get("nameLang") ?? "international";
  const prompt = initialPrompt ?? "";
  const requestIdFromQuery = searchParams.get("rid");

  const [data, setData] = useState<GenerateDomainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef<string | null>(null);
  const requestStartRef = useRef<number | null>(null);
  const reportedResultsRef = useRef<Set<string>>(new Set());

  const generatorSlug = useMemo(() => {
    if (!pathname) return "generic";
    const segments = pathname.split("/").filter(Boolean);
    const generatorSegment =
      lang === "nl" ? "domeinnaam-generator" : "domain-generator";
    if (segments[1] !== "tools" || segments[2] !== generatorSegment) {
      return "generic";
    }
    const slug = segments[3];
    if (!slug || slug === "results" || slug === "generator") {
      return "generic";
    }
    return slug;
  }, [lang, pathname]);

  const normalizeTone = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (["creative", "creatief"].includes(normalized)) return "creative";
    if (["professional", "professioneel"].includes(normalized)) return "professional";
    if (["unique", "uniek"].includes(normalized)) return "unique";
    if (normalized.includes("tech")) return "tech";
    if (normalized.includes("casual")) return "casual";
    return "creative";
  };

  const normalizeNameLanguage = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "en" || normalized === "english") return "en";
    if (normalized === "nl" || normalized === "dutch") return "nl";
    return "international";
  };

  useEffect(() => {
    // Bepaal modus:
    // - Hero prompt → generate-domain
    // - base=... in URL → name-variations
    const isVariationMode = !!baseNameFromUrl;

    if (!prompt.trim() && !isVariationMode) {
      // Niets te doen: geen prompt en geen baseName
      return;
    }

    let cancelled = false;
    async function fetchNames() {
      try {
        setIsLoading(true);
        setError(null);
        setData(null);

        const requestId = requestIdFromQuery ?? createRequestId();
        requestIdRef.current = requestId;
        const storedStart = requestIdFromQuery
          ? window.sessionStorage.getItem(`ga_request_start_${requestIdFromQuery}`)
          : null;
        requestStartRef.current = storedStart
          ? Number.parseFloat(storedStart)
          : performance.now();

        let json: GenerateDomainResponse;

        if (isVariationMode && baseNameFromUrl) {
          // Variatie-modus: /api/name-variations
          const res = await fetch("/api/name-variations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              baseName: baseNameFromUrl,
              lang,
            }),
          });

          if (!res.ok) {
            const payload = await res.json().catch(() => ({}));
            throw new Error(
              payload.error ||
                "Er ging iets mis bij het genereren van variaties."
            );
          }

          json = (await res.json()) as GenerateDomainResponse;
        } else {
          // Standaard modus: /api/generate-domain
          const res = await fetch("/api/generate-domain", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
              lang,
              style: styleFromQuery,
              nameLang: nameLangFromQuery,
            }),
          });

          if (!res.ok) {
            const payload = await res.json().catch(() => ({}));
            throw new Error(
              payload.error ||
                "Er ging iets mis bij het genereren van domeinnamen."
            );
          }

          json = (await res.json()) as GenerateDomainResponse;
        }

        if (!cancelled) {
          setData(json);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("[Stepper] Fout bij laden van namen:", err);
          setError(
            err?.message || "Er ging iets mis bij het laden van de namen."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchNames();

    return () => {
      cancelled = true;
    };
  }, [prompt, baseNameFromUrl, lang, styleFromQuery, nameLangFromQuery, requestIdFromQuery]);

  useEffect(() => {
    if (!data?.names?.length) return;
    const requestId = requestIdRef.current;
    if (!requestId || reportedResultsRef.current.has(requestId)) return;

    const responseTime =
      requestStartRef.current !== null
        ? Math.round(performance.now() - requestStartRef.current)
        : undefined;

    trackEvent("name_results_viewed", {
      tool: "generator",
      generator_slug: generatorSlug,
      lang,
      tone: normalizeTone(styleFromQuery),
      name_language: normalizeNameLanguage(nameLangFromQuery),
      names_count: data.names.length,
      response_time_ms: responseTime,
      request_id: requestId,
    });

    reportedResultsRef.current.add(requestId);
  }, [data, generatorSlug, lang, nameLangFromQuery, styleFromQuery]);

  return (
    <section className="w-full">
      {error && (
        <p className="text-sm text-red-500 mb-4">
          {error}
        </p>
      )}

      {(isLoading || (data && data.names.length > 0)) && (
        <DomainSelect
          lang={lang}
          loading={!data && isLoading}
          names={
            data?.names ??
            Array.from({ length: 9 }).map((_, i) => `__loading_${i}`)
          }
          availability={data?.availability ?? {}}
          tlds={data?.tlds?.length ? data.tlds : FALLBACK_TLDS}
          messages={messages}
          generatorSlug={generatorSlug}
          tone={normalizeTone(styleFromQuery)}
          nameLanguage={normalizeNameLanguage(nameLangFromQuery)}
        />
      )}
    </section>
  );
}
