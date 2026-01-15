"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineMail } from "react-icons/hi";
import Logo from "./Logo";
import styles from "./Footer.module.css";
import { getFooterMessages } from "@/i18n/components/footer";
import type { Lang } from "@/config/i18n";
import { getDomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

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
  const queryString = searchParams.toString();

  const buildLangHref = (targetLang: "en" | "nl") => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = targetLang;
    }
    const basePath = segments.join("/") || `/${targetLang}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const columns = [
    {
      key: "product",
      title: messages.columns.product.title,
      links: [
        {
          label: messages.columns.product.aiNameGenerator,
          href: `${homeHref}/tools/domain-generator/generator`,
        },
        {
          label: messages.columns.product.domainChecker,
          href: `${homeHref}/tools/domain-generator/generator?mode=single`,
        },
        {
          label: messages.columns.product.favorites,
          href: `${homeHref}/tools/domain-generator/liked-names`,
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
          href: `${homeHref}/tools/domain-generator/privacy-policy`,
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
          </div>
        </div>

        <div className={styles.columns}>
          {columns.map((column) => (
            <div key={column.key} className={styles.column}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className={styles.link}>
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
