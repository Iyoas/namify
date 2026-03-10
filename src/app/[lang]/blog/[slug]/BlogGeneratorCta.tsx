import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import AnimatedPlaceholderInput from "@/components/ui/AnimatedPlaceholderInput";
import type { Lang } from "@/config/i18n";
import styles from "./BlogPost.module.css";

type BlogGeneratorCtaProps = {
  lang: Lang;
};

export default function BlogGeneratorCta({ lang }: BlogGeneratorCtaProps) {
  const businessIdeaExamples = [
    "AI marketing tool",
    "AI meeting assistant",
    "AI productivity app",
    "AI research agent",
    "AI writing tool",
  ];
  const copy =
    lang === "nl"
      ? {
          promoCta: "Nu genereren",
        }
      : {
          promoCta: "Generate now",
        };

  const generatorResultsHref =
    lang === "nl"
      ? `/${lang}/tools/domain-generator/results`
      : `/${lang}/tools/domain-generator/results`;
  const generatorPageHref =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-generator`
      : `/${lang}/tools/domain-generator`;

  return (
    <section className={styles.promoCard} aria-label="Domifai generator call to action">
      <Link href={generatorPageHref} className={styles.promoBrand}>
        <Image
          src="/images/domifai-logo.png"
          alt="Domifai"
          width={36}
          height={36}
          className={styles.promoBrandLogo}
        />
        <span className={styles.promoBrandName}>Domifai</span>
      </Link>
      <h2 className={styles.promoTitle}>Generate business name ideas</h2>
      <form
        action={generatorResultsHref}
        method="get"
        target="_blank"
        className={styles.promoForm}
      >
        <div className={styles.promoInputShell}>
          <AnimatedPlaceholderInput
            type="text"
            name="q"
            className={styles.promoInput}
            wrapperClassName={styles.promoInputWrap}
            overlayClassName={styles.promoInputOverlay}
            phrases={businessIdeaExamples}
            aria-label="Describe your business idea"
            autoComplete="off"
            required
          />
          <button type="submit" className={styles.promoInlineButton}>
            <Sparkles className={styles.promoInlineButtonIcon} aria-hidden="true" />
            <span>{copy.promoCta}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
