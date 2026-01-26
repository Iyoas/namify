// src/app/[lang]/tools/domain-generator/components/Hero.tsx
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Zap, Cpu } from "lucide-react";
import styles from "./Hero.module.css";
import type { Lang } from "@/config/i18n";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

type HeroProps = {
  lang: Lang;
  messages: DomainGeneratorIndexMessages;
};

export default function Hero({ lang, messages }: HeroProps) {
  const hero = messages.hero;

  return (
    <section className={styles.hero}>
      {/* Linkerkant: copy + CTA's */}
      <div className={styles.heroInner}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            {hero.titleLine1}
            <br />
            {hero.titleLine2}{" "}
            <span className={styles.titleAccent}>{hero.titleAccent}</span>
          </h1>

          <p className={styles.subtitle}>{hero.subtitle}</p>

          <div className={styles.ctaRow}>
            <Link
              href={`/${lang}/tools/domain-generator/generator`}
              className={styles.primaryButton}
            >
              <Sparkles className={styles.primaryIcon} />
              <span>{hero.primaryCta}</span>
            </Link>

            <a href="#hoe-werkt-het" className={styles.secondaryButton}>
              <span className={styles.secondaryButtonInner}>
                {hero.secondaryCta}
              </span>
            </a>
          </div>

          <div className={styles.partners}>
            <p className={styles.partnersLabel}>{hero.partnersLabel}</p>
            <div className={styles.partnerLogos}>
              <Image
                src="/images/namecheap-logo.png"
                alt="Namecheap"
                width={60}
                height={34}
              />
              <Image
                src="/images/partner-logo-2.png"
                alt="Partner logo"
                width={60}
                height={34}
              />
              <Image
                src="/images/ionos-logo.png"
                alt="IONOS"
                width={60}
                height={34}
              />
              <Image
                src="/images/hostinger-logo.png"
                alt="Hostinger"
                width={60}
                height={34}
              />
              <Image
                src="/images/bluehost-logo.png"
                alt="Bluehost"
                width={60}
                height={34}
              />
            </div>
          </div>

          {/* Badges verplaatst voor mobiel display */}
          <div className={styles.badges}>
          <div className={`${styles.badge} ${styles.badgeTop}`}>
            <div className={styles.badgeInner}>
              <span className={styles.badgeIconWrapper}>
                <Zap className={styles.badgeIcon} />
              </span>
              <span>{hero.badgeTop}</span>
            </div>
          </div>

          <div className={`${styles.badge} ${styles.badgeBottom}`}>
            <div className={styles.badgeInner}>
              <span className={styles.badgeIconWrapper}>
                <Cpu className={styles.badgeIcon} />
              </span>
              <span>{hero.badgeBottom}</span>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Rechterkant: grote foto + badges */}
      <div className={styles.heroVisual}>
        <div className={styles.imageCardWrapper}>
          <div className={styles.imageCard}>
            <Image
              src="/images/hero.png"
              alt={hero.imageAlt}
              width={720}
              height={880}
              className={styles.heroImage}
            />
          </div>

          {/* Soft glow onder kaart */}
          <div className={styles.cardGlow} />
        </div>
      </div>
    </section>
  );
}
