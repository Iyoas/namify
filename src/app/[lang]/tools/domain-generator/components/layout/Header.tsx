"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoHeartOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import styles from "./Header.module.css";

type LangParams = { lang?: string };

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l1.1 4.2a4 4 0 0 0 2.8 2.8L20 10l-4.1 1a4 4 0 0 0-2.8 2.8L12 18l-1.1-4.2A4 4 0 0 0 8.1 11L4 10l4.1-1a4 4 0 0 0 2.8-2.8L12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const params = useParams<LangParams>();
  const lang = params?.lang ?? "";
  const homeHref = lang ? `/${lang}` : "/";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.mobileMenuButton}
          aria-label="Open menu"
        >
          <RxHamburgerMenu className={styles.mobileMenuIcon} />
        </button>

        <Link href={homeHref} className={styles.logoLink} aria-label="Go to home">
          <Image
            src="/images/logo2.png"
            alt="Namitor"
            width={140}
            height={40}
            priority
            className={styles.logo}
          />
        </Link>

        <nav className={`${styles.nav} ${styles.desktopOnly}`} aria-label="Primary navigation">
          <Link
            href={`${homeHref}/tools/domain-generator/generator`}
            className={styles.navLink}
          >
            Generator
          </Link>

          <Link href={`${homeHref}#how-it-works`} className={styles.navLink}>
            Hoe werkt het?
          </Link>

          <Link href={`${homeHref}#about`} className={styles.navLink}>
            Over ons
          </Link>

          <Link href={`${homeHref}#faq`} className={styles.navLink}>
            Veelgestelde vragen
          </Link>
        </nav>

        <div className={styles.actions} aria-label="Header actions">
          <div>
            <Link
              href={`${homeHref}/tools/domain-generator/liked-names`}
              className={styles.iconButton}
              aria-label="Favorites"
            >
              <span className={styles.badge} aria-hidden="true">
                5
              </span>
              <span className={styles.icon}>
                <IoHeartOutline className={styles.iconSvg} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
