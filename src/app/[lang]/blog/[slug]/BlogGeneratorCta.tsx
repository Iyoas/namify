import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { Lang } from "@/config/i18n";
import styles from "./BlogPost.module.css";

type BlogGeneratorCtaProps = {
  lang: Lang;
};

export default function BlogGeneratorCta({ lang }: BlogGeneratorCtaProps) {
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

  return (
    <section className={styles.promoCard} aria-label="Domifai generator call to action">
      <div className={styles.promoBrand}>
        <Image
          src="/images/domifai-logo.png"
          alt="Domifai"
          width={36}
          height={36}
          className={styles.promoBrandLogo}
        />
        <span className={styles.promoBrandName}>Domifai</span>
      </div>
      <form action={generatorResultsHref} method="get" className={styles.promoForm}>
        <div className={styles.promoInputShell}>
          <input
            type="text"
            name="q"
            className={styles.promoInput}
            placeholder="Describe your business idea"
            aria-label="Describe your business idea"
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
