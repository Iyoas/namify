import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedPlaceholderInput from "@/components/ui/AnimatedPlaceholderInput";
import type { Lang } from "@/config/i18n";
import styles from "./InArticleDomainChecker.module.css";

type InArticleDomainCheckerProps = {
  lang: Lang;
};

export default function InArticleDomainChecker({
  lang,
}: InArticleDomainCheckerProps) {
  const copy =
    lang === "nl"
      ? {
          cta: "Controleer domein",
        }
      : {
          cta: "Check domain",
        };
  const domainExamples = [
    "nexora.ai",
    "agentra.ai",
    "vectra.ai",
    "flowmind.ai",
    "syntra.ai",
  ];
  const checkerPath =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-checker`
      : `/${lang}/tools/domain-checker`;
  const generatorPageHref =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-generator`
      : `/${lang}/tools/domain-generator`;

  return (
    <section className={styles.wrapper} aria-label="Domain checker">
      <div className={styles.card}>
        <Link href={generatorPageHref} className={styles.brand}>
          <Image
            src="/images/domifai-logo.png"
            alt="Domifai"
            width={36}
            height={36}
            className={styles.brandLogo}
          />
          <span className={styles.brandName}>Domifai</span>
        </Link>
        <h2 className={styles.title}>Check your domain availability</h2>

        <form
          action={checkerPath}
          method="GET"
          target="_blank"
          className={styles.form}
        >
          <div className={styles.fieldInner}>
            <AnimatedPlaceholderInput
              type="text"
              name="domain"
              className={styles.input}
              wrapperClassName={styles.inputWrap}
              overlayClassName={styles.inputOverlay}
              phrases={domainExamples}
              autoComplete="off"
              aria-label="Enter your app name (e.g. Nexora.tech)"
            />
            <button
              type="submit"
              className={styles.submitButton}
              aria-label={copy.cta}
            >
              <Search className={styles.submitIcon} aria-hidden="true" />
              <span>{copy.cta}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
