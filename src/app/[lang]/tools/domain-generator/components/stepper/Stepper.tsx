"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DomainAvailabilityStatus } from "@/lib/domainr";
import DomainSelect from "./DomainSelect";

type GenerateDomainResponse = {
  names: string[];
  availability: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
  count: number;
};

type StepperProps = {
  lang: string;
  initialPrompt?: string;
};

export default function Stepper({ lang, initialPrompt }: StepperProps) {
  const searchParams = useSearchParams();
  const baseFromQuery = searchParams.get("base");
  const baseNameFromUrl = baseFromQuery ? baseFromQuery.trim() : undefined;
  const prompt = initialPrompt ?? "";

  const [data, setData] = useState<GenerateDomainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [prompt, baseNameFromUrl, lang]);

  return (
    <section className="w-full">
      {isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          Bezig met genereren...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-4">
          {error}
        </p>
      )}

      {data && data.names.length > 0 && (
        <DomainSelect
          names={data.names}
          availability={data.availability}
          tlds={data.tlds}
        />
      )}
    </section>
  );
}