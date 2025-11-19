// src/app/[lang]/tools/domain-generator/components/Hero.tsx
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Zap, Cpu } from "lucide-react";
import styles from "./Hero.module.css";

type HeroProps = {
  lang: string;
};

export default function Hero({ lang }: HeroProps) {
  return (
    <section className={styles.hero}>
      {/* Linkerkant: copy + CTA's */}
      <div className={styles.heroInner}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Genereer Jouw Bedrijfs-
            <br />
            En Domeinnaam <span className={styles.titleAccent}>Met AI</span>
          </h1>

          <p className={styles.subtitle}>
            Jij hebt een idee. Wij zorgen voor de naam en het domein. Lanceer je
            website vandaag nog!
          </p>

          <div className={styles.ctaRow}>
            <Link
              href={`/${lang}/tools/domain-generator/generator`}
              className={styles.primaryButton}
            >
              <span className={styles.primaryIconWrapper}>
                <Sparkles className={styles.primaryIcon} />
              </span>
              <span>Genereer namen</span>
            </Link>

            <a href="#hoe-werkt-het" className={styles.secondaryButton}>
              <span className={styles.secondaryButtonInner}>Hoe werkt het?</span>
            </a>
          </div>

          <div className={styles.partners}>
            <p className={styles.partnersLabel}>Onze partners</p>
            <div className={styles.partnerLogos}>
              <Image
                src="/images/namecheap-logo.png"
                alt="Namecheap"
                width={60}
                height={34}
              />
              <Image
                src="/images/godaddy-logo.png"
                alt="GoDaddy"
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
              <span>Nieuw in 2025</span>
            </div>
          </div>

          <div className={`${styles.badge} ${styles.badgeBottom}`}>
            <div className={styles.badgeInner}>
              <span className={styles.badgeIconWrapper}>
                <Cpu className={styles.badgeIcon} />
              </span>
              <span>Powered by GPT-5 Turbo</span>
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
              alt="Ondernemer die werkt aan zijn merknaam"
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
