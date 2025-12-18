"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedCount, setLikedCount] = useState(0);

  useEffect(() => {
    if (!isMenuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    function syncLikedCount() {
      try {
        const stored = localStorage.getItem("likedNames");
        if (!stored) {
          setLikedCount(0);
          return;
        }
        const parsed = JSON.parse(stored);
        setLikedCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setLikedCount(0);
      }
    }

    syncLikedCount();
    window.addEventListener("storage", syncLikedCount);
    window.addEventListener("likedNamesUpdated", syncLikedCount as EventListener);
    return () => {
      window.removeEventListener("storage", syncLikedCount);
      window.removeEventListener("likedNamesUpdated", syncLikedCount as EventListener);
    };
  }, []);

  const navItems = [
    { href: homeHref, label: "Home" },
    { href: `${homeHref}/tools/domain-generator/generator`, label: "Business name generator" },
    { href: `${homeHref}#how-it-works`, label: "Hoe werkt het?" },
    { href: `${homeHref}#about`, label: "Over ons" },
    { href: `${homeHref}#contact`, label: "Contact" },
  ];

  return (
    <header className={styles.header}>
      {isMenuOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.mobileMenuButton}
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
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
                {likedCount}
              </span>
              <span className={styles.icon}>
                <IoHeartOutline className={styles.iconSvg} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <aside
        className={[
          styles.mobileMenuSheet,
          isMenuOpen ? styles.mobileMenuSheetOpen : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuLabel}>Namify</span>
          <button
            type="button"
            className={styles.mobileMenuClose}
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className={styles.mobileMenuNav} aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                styles.mobileNavLink,
                pathname === item.href ? styles.mobileNavLinkActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  );
}
