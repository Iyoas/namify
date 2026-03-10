import { Search } from "lucide-react";
import type { Lang } from "@/config/i18n";
import styles from "./InArticleDomainChecker.module.css";

type InArticleDomainCheckerProps = {
  lang: Lang;
};

export default function InArticleDomainChecker({
  lang,
}: InArticleDomainCheckerProps) {
  const checkerPath =
    lang === "nl"
      ? `/${lang}/tools/domeinnaam-checker`
      : `/${lang}/tools/domain-checker`;

  return (
    <section className={styles.wrapper} aria-label="Domain checker">
      <div className={styles.card}>
        <h2 className={styles.title}>Check your domain availability</h2>

        <form
          action={checkerPath}
          method="GET"
          target="_blank"
          className={styles.form}
        >
          <div className={styles.fieldInner}>
            <input
              type="text"
              name="domain"
              className={styles.input}
              placeholder="Enter your app name (e.g. Nexora.tech)"
              autoComplete="off"
              aria-label="Enter your app name (e.g. Nexora.tech)"
            />
            <button
              type="submit"
              className={styles.submitButton}
              aria-label="Search domain availability"
            >
              <Search className={styles.submitIcon} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
