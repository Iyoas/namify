"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineMail } from "react-icons/hi";
import Logo from "./Logo";
import styles from "./Footer.module.css";
import { getFooterMessages } from "@/i18n/components/footer";
import type { Lang } from "@/config/i18n";
import { getDomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";
import { trackEvent } from "@/lib/analytics";

type LangParams = { lang?: string };

export default function Footer() {
  const params = useParams<LangParams>();
  const lang = (params?.lang ?? "en") as Lang;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const messages = getFooterMessages(lang);
  const domainMessages = getDomainGeneratorIndexMessages(lang);
  const email = domainMessages.contact.details.emailValue;
  const homeHref = `/${lang}`;
  const generatorHref =
    lang === "nl"
      ? `${homeHref}/tools/domeinnaam-generator`
      : `${homeHref}/tools/domain-generator`;
  const checkerHref =
    lang === "nl"
      ? `${homeHref}/tools/domeinnaam-checker`
      : `${homeHref}/tools/domain-checker`;
  const privacyHref =
    lang === "nl"
      ? `${homeHref}/privacybeleid`
      : `${homeHref}/privacy-policy`;
  const likedHref =
    lang === "nl"
      ? `${homeHref}/gelikete-namen`
      : `${homeHref}/liked-names`;
  const queryString = searchParams.toString();
  const sourcePage = pathname ?? "/";

  const trackLanguageSwitch = (toLang: "en" | "nl") => {
    if (toLang === lang) return;
    trackEvent("language_switch", {
      from_lang: lang,
      to_lang: toLang,
      source_page: sourcePage,
    });
  };

  const trackToolNav = (href: string) => {
    let destination: string | null = null;
    if (href === homeHref) destination = "home";
    else if (href === generatorHref) destination = "generator";
    else if (href === checkerHref) destination = "domain_checker";
    else if (href === likedHref) destination = "favorites";
    else if (href.includes("#how-it-works")) destination = "how_it_works";
    if (destination) {
      trackEvent("tool_nav_click", { lang, destination });
    }
  };

  if (pathname?.includes("/tools/domain-generator/results")) {
    return null;
  }

  const buildLangHref = (targetLang: "en" | "nl") => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split("/").filter(Boolean);
    const currentLang = segments[0];
    const restPath = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";

    const nlToEn: Record<string, string> = {
      "/tools/domeinnaam-generator": "/tools/domain-generator",
      "/tools/domeinnaam-checker": "/tools/domain-checker",
      "/privacybeleid": "/privacy-policy",
      "/gelikete-namen": "/liked-names",
      "/tools/domain-generator": "/tools/domain-generator",
      "/tools/domain-generator/generator": "/tools/domain-generator",
      "/tools/domain-generator/privacy-policy": "/privacy-policy",
      "/tools/domain-generator/liked-names": "/liked-names",
    };

    const enToNl: Record<string, string> = {
      "/tools/domain-generator": "/tools/domeinnaam-generator",
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

  const columns = [
    {
      key: "product",
      title: messages.columns.product.title,
      links: [
        {
          label: messages.columns.product.aiNameGenerator,
          href: generatorHref,
        },
        {
          label: messages.columns.product.domainChecker,
          href: checkerHref,
        },
        {
          label: messages.columns.product.favorites,
          href: likedHref,
        },
      ],
    },
    {
      key: "company",
      title: messages.columns.company.title,
      links: [
        {
          label: messages.columns.company.howItWorks,
          href: `${homeHref}#how-it-works`,
        },
        {
          label: messages.columns.company.about,
          href: `${homeHref}#about-our-tool`,
        },
        {
          label: messages.columns.company.contact,
          href: `${homeHref}#contact-heading`,
        },
      ],
    },
    {
      key: "resources",
      title: messages.columns.resources.title,
      links: [
        {
          label: messages.columns.resources.faq,
          href: `${homeHref}#faq-heading`,
        },
        {
          label: messages.columns.resources.privacyPolicy,
          href: privacyHref,
        },
      ],
    },
  ];

  const socials = [
    {
      key: "email",
      href: `mailto:${email}`,
      label: messages.social.email,
      icon: <HiOutlineMail className={styles.socialIcon} />,
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <Logo />
          </div>
          <div className={styles.topActions}>
            <div className={styles.socials}>
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  className={styles.socialButton}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
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
                onClick={() => trackLanguageSwitch("en")}
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
                onClick={() => trackLanguageSwitch("nl")}
              >
                NL
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.columns}>
          {columns.map((column) => (
            <div key={column.key} className={styles.column}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className={styles.link}
                      onClick={() => trackToolNav(link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className={styles.bottom}>{messages.copyright}</p>
      </div>
    </footer>
  );
}
