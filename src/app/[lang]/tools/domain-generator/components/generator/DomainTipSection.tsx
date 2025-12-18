import styles from "./DomainTipSection.module.css";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

type DomainTipSectionProps = {
  messages: GeneratorGeneralMessages;
};

export default function DomainTipSection({ messages }: DomainTipSectionProps) {
  const domainTips = messages.sections.domainTips;
  const extensions = messages.examples.extensions;
  const domainPatterns = messages.examples.domainPatterns;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Titel */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            {domainTips.title}
          </h2>
        </header>

        {/* Introductietekst */}
        <div className={styles.intro}>
          {domainTips.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {/* Bulletpoints met kenmerken */}
        <ul className={styles.featureList}>
          {domainTips.featureList.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        {/* Tekst + domeinextensie badges */}
        <div className={styles.extensionsBlock}>
          <p>
            {domainTips.extensionsIntro}{" "}
            <span className={styles.extensionBadgesInline}>
              {extensions.map((extension) => (
                <span key={extension} className={styles.extensionBadge}>
                  {extension}
                </span>
              ))}
            </span>{" "}
            {domainTips.extensionsOutro}
          </p>
        </div>

        {/* Voorbeeldvormen van domeinnamen */}
        <div className={styles.examplesBlock}>
          <p className={styles.examplesIntro}>
            {domainTips.examplesIntro}
          </p>

          <div className={styles.examplesList}>
            {domainPatterns.map((pattern) => (
              <div key={pattern} className={styles.exampleBadge}>
                {pattern}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
