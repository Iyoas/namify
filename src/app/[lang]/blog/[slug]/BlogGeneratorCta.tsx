import Link from "next/link";
import Image from "next/image";
import type { Lang } from "@/config/i18n";
import styles from "./BlogPost.module.css";

type BlogGeneratorCtaProps = {
  lang: Lang;
};

export default function BlogGeneratorCta({ lang }: BlogGeneratorCtaProps) {
  const copy =
    lang === "nl"
      ? {
          promoText: "Vind vandaag de perfecte bedrijfsnaam!",
          promoCta: "Nu genereren",
        }
      : {
          promoText: "Find the perfect business name today!",
          promoCta: "Generate now",
        };

  const generatorHref =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-generator`
      : `/${lang}/tools/domain-generator`;

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
      <p className={styles.promoText}>{copy.promoText}</p>
      <Link href={generatorHref} className={styles.promoButton}>
        {copy.promoCta}
      </Link>
    </section>
  );
}
