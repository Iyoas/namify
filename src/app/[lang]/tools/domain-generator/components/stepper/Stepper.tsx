"use client";

import { useEffect, useState } from "react";
import DomainSelect from "./DomainSelect";
import type { DomainAvailabilityStatus } from "@/lib/domainr";

type StepperProps = {
  lang: string;
  initialPrompt: string;
};

type GenerateDomainResponse = {
  names: string[];
  count: number;
  availability: Record<string, Record<string, DomainAvailabilityStatus>>;
  tlds: string[];
};

export function Stepper({ lang, initialPrompt }: StepperProps) {
  const prompt = initialPrompt ?? "";
  const [data, setData] = useState<GenerateDomainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Geen API-call doen als er geen prompt is
    if (!prompt.trim()) return;

    let cancelled = false;

    async function fetchNames() {
      setIsLoading(true);
      setError(null);

      try {
        const cacheKey = `namify:results:${lang}:${prompt}`;

        // Probeer eerst resultaten uit sessionStorage te lezen (bijv. na een refresh)
        if (typeof window !== "undefined") {
          const cached = window.sessionStorage.getItem(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as GenerateDomainResponse;
              if (!cancelled) {
                setData(parsed);
                setIsLoading(false);
                return;
              }
            } catch (e) {
              console.warn("[Stepper] Kon cache niet parsen:", e);
            }
          }
        }

        const res = await fetch("/api/generate-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, lang }),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(
            payload.error || "Er ging iets mis bij het genereren van namen."
          );
        }

        const json = (await res.json()) as GenerateDomainResponse;

        if (!cancelled) {
          setData(json);

          // Sla resultaten op in sessionStorage voor deze prompt + taal
          if (typeof window !== "undefined") {
            try {
              window.sessionStorage.setItem(cacheKey, JSON.stringify(json));
            } catch (e) {
              console.warn("[Stepper] Kon resultaten niet cachen:", e);
            }
          }
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Onbekende fout.");
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
  }, [lang, prompt]);

  return (
    <section>
      {isLoading && <p>Bezig met genereren...</p>}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {!isLoading &&
        !error &&
        data &&
        data.names.length > 0 && (
          <DomainSelect
            names={data.names}
            availability={data.availability}
            tlds={data.tlds}
          />
        )}

      {!isLoading &&
        !error &&
        data &&
        data.names.length === 0 && (
          <p>Geen namen gevonden, probeer een andere beschrijving.</p>
        )}
    </section>
  );
}