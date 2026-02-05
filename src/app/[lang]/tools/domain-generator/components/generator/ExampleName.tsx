"use client";

import { CheckCircle2 } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import type { Lang } from "@/config/i18n";
import { getRegistrarUrl } from "@/lib/registrar";
import styles from "./ExampleName.module.css";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";
import { trackEvent } from "@/lib/analytics";
import { openAffiliateLink } from "@/lib/affiliate/openAffiliateLink";

/**
 * Statische voorbeeldkaart voor een gegenereerde domeinnaam.
 * Later kun je deze eenvoudig dynamisch maken door props toe te voegen.
 */
export default function ExampleName({
  messages,
}: {
  messages: GeneratorGeneralMessages;
}) {
  const example = messages.examples.exampleName;
  const benefits = example.benefits;
  const params = useParams<{ lang?: string }>();
  const lang = (params?.lang ?? "en") as Lang;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const generatorSlug = (() => {
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
  })();
  const nameLanguage = (() => {
    const value = searchParams.get("nameLang") ?? "international";
    const normalized = value.trim().toLowerCase();
    if (normalized === "en" || normalized === "english") return "en";
    if (normalized === "nl" || normalized === "dutch") return "nl";
    return "international";
  })();
  const tone = (() => {
    const value = searchParams.get("style") ?? "creative";
    const normalized = value.trim().toLowerCase();
    if (["creative", "creatief"].includes(normalized)) return "creative";
    if (["professional", "professioneel"].includes(normalized)) return "professional";
    if (["unique", "uniek"].includes(normalized)) return "unique";
    if (normalized.includes("tech")) return "tech";
    if (normalized.includes("casual")) return "casual";
    return "creative";
  })();

  return (
    <section className={styles.section}>
      <article className={styles.card}>
        {/* Linkerkant: label, domeinnaam en benefits */}
        <div className={styles.left}>
          <div className={styles.matchRow}>
            <span className={styles.matchBadge}>{example.matchBadge}</span>
          </div>

          <div className={styles.nameRow}>
            <h3 className={styles.domainName}>{example.name}</h3>
            <span className={styles.discountBadge}>{example.discountBadge}</span>
          </div>

          <div className={styles.benefits}>
            {benefits.map((benefit) => (
              <div key={benefit} className={styles.benefitBadge}>
                <CheckCircle2 className={styles.benefitIcon} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rechterkant: prijs en CTA's */}
        <div className={styles.right}>
          <div className={styles.priceBlock}>
            <span className={styles.originalPrice}>{example.originalPrice}</span>
            <span className={styles.currentPrice}>
              {example.currentPrice}
              <span className={styles.billingCycle}>{example.billingCycle}</span>
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                const registrarUrl = getRegistrarUrl(example.name, lang);
                trackEvent("registrar_click", {
                  tool: "generator",
                  generator_slug: generatorSlug,
                  lang,
                  tone,
                  name_language: nameLanguage,
                  source: "claim_button",
                  tld: example.tld,
                });
                openAffiliateLink(registrarUrl);
              }}
            >
              {example.secondaryCta}
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                const promptField = document.getElementById("generator-prompt");
                if (promptField instanceof HTMLTextAreaElement) {
                  promptField.scrollIntoView({ behavior: "smooth", block: "center" });
                  promptField.focus();
                }
              }}
            >
              {example.primaryCta}
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
