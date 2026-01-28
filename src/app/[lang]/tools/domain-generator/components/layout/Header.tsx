"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoHeartOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import styles from "./Header.module.css";
import Logo from "./Logo";
import { getHeaderMessages } from "@/i18n/components/header";
import type { Lang } from "@/config/i18n";

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
  const lang = params?.lang ?? "en";
  const homeHref = `/${lang}`;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const messages = getHeaderMessages((lang || "en") as Lang);
  const hideOnDesktop = pathname?.includes("/tools/domain-generator/results");

  const queryString = searchParams.toString();
  const buildLangHref = (targetLang: "en" | "nl") => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split("/").filter(Boolean);
    const currentLang = segments[0];
    const restPath = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";

    const nlToEn: Record<string, string> = {
      "/tools/domeinnaam-generator": "/tools/domain-generator/generator",
      "/tools/domeinnaam-checker": "/tools/domain-checker",
      "/privacybeleid": "/privacy-policy",
      "/gelikete-namen": "/liked-names",
      "/tools/domain-generator/privacy-policy": "/privacy-policy",
      "/tools/domain-generator/liked-names": "/liked-names",
    };

    const enToNl: Record<string, string> = {
      "/tools/domain-generator/generator": "/tools/domeinnaam-generator",
      "/tools/domain-checker": "/tools/domeinnaam-checker",
      "/privacy-policy": "/privacybeleid",
      "/liked-names": "/gelikete-namen",
      "/tools/domain-generator/privacy-policy": "/privacybeleid",
      "/tools/domain-generator/liked-names": "/gelikete-namen",
    };

    let mappedRest = restPath;
    if (currentLang === "nl" && targetLang === "en") {
      mappedRest = nlToEn[restPath] ?? restPath;
    } else if (currentLang === "en" && targetLang === "nl") {
      mappedRest = enToNl[restPath] ?? restPath;
    }

    const basePath = `/${targetLang}${mappedRest}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

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
    { href: homeHref, label: messages.navMobile.home },
    {
      href: `${homeHref}/tools/domain-generator/generator`,
      label: messages.navMobile.businessNameGenerator,
    },
    {
      href: `${homeHref}/tools/domain-generator/generator?mode=single`,
      label: messages.navMobile.domainChecker,
    },
    {
      href: `${homeHref}/tools/domain-generator/liked-names`,
      label: messages.navMobile.favorites,
    },
    { href: `${homeHref}#how-it-works`, label: messages.navMobile.howItWorks },
  ];

  return (
    <header
      className={[
        styles.header,
        hideOnDesktop ? styles.headerHideDesktop : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
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
          aria-label={messages.actions.openMenuAria}
          onClick={() => setIsMenuOpen(true)}
        >
          <RxHamburgerMenu className={styles.mobileMenuIcon} />
        </button>

        <Logo />

        <nav className={`${styles.nav} ${styles.desktopOnly}`} aria-label="Primary navigation">
          <Link
            href={`${homeHref}/tools/domain-generator/generator`}
            className={styles.navLink}
          >
            {messages.navDesktop.aiNameGenerator}
          </Link>

          <Link
            href={`${homeHref}/tools/domain-generator/generator?mode=single`}
            className={styles.navLink}
          >
            {messages.navDesktop.domainChecker}
          </Link>

          <Link
            href={`${homeHref}#how-it-works`}
            className={styles.navLink}
          >
            {messages.navDesktop.privacyPolicy}
          </Link>
        </nav>

        <div className={styles.actions} aria-label="Header actions">
          <div className={styles.langSwitcher}>
            <Link
              href={buildLangHref("en")}
              className={[
                styles.langButton,
                lang === "en" ? styles.langButtonActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={lang === "en" ? "true" : undefined}
            >
              EN
            </Link>
            <Link
              href={buildLangHref("nl")}
              className={[
                styles.langButton,
                lang === "nl" ? styles.langButtonActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={lang === "nl" ? "true" : undefined}
            >
              NL
            </Link>
          </div>
          <div>
            <Link
              href={`${homeHref}/tools/domain-generator/liked-names`}
              className={styles.iconButton}
              aria-label={messages.actions.favoritesAria}
            >
              {likedCount > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {likedCount}
                </span>
              )}
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
          <Logo />
          <button
            type="button"
            className={styles.mobileMenuClose}
            aria-label={messages.actions.closeMenuAria}
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
        <div className={styles.mobileLangSwitcher}>
          <Link
            href={buildLangHref("en")}
            className={[
              styles.langButton,
              lang === "en" ? styles.langButtonActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={lang === "en" ? "true" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            EN
          </Link>
          <Link
            href={buildLangHref("nl")}
            className={[
              styles.langButton,
              lang === "nl" ? styles.langButtonActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={lang === "nl" ? "true" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            NL
          </Link>
        </div>
      </aside>
    </header>
  );
}
