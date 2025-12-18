
import { Search } from "lucide-react";
import styles from "./LongFormContent.module.css";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

export default function LongFormContent({
  messages,
}: {
  messages: GeneratorGeneralMessages;
}) {
  const longForm = messages.sections.longForm;
  const left = longForm.left;
  const right = longForm.right;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Linker kolom */}
        <div className={styles.leftColumn}>
          <header className={styles.leftHeader}>
            <h2 className={styles.leftTitle}>
              {left.title}
            </h2>
          </header>

          <div className={styles.leftIntro}>
            <p>{left.intro}</p>

          </div>

          <ol className={styles.benefitList}>
            {left.benefits.map((benefit, index) => (
              <li
                key={benefit}
                className={index === 0 ? styles.benefitListItemPrimary : undefined}
              >
                <span>
                  {index + 1} ) {benefit}
                </span>
              </li>
            ))}
          </ol>

          <aside className={styles.highlightCard}>
            <p className={styles.highlightIntro}>
              {left.highlightIntro}
            </p>

            <ul className={styles.highlightList}>
              {left.highlightList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className={styles.highlightFooter}>
              {left.highlightFooter}
            </p>
          </aside>
        </div>

        {/* Rechter kolom */}
        <div className={styles.rightColumn}>
          {right.blocks.map((block) => (
            <section key={block.title} className={styles.rightBlock}>
              <h3 className={styles.rightTitle}>{block.title}</h3>

              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <ul className={styles.bulletList}>
                {block.bullets.map((bullet) => (
                  <li key={bullet.label}>
                    <strong>{bullet.label}:</strong> {bullet.description}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className={styles.ctaBlock}>
            <h3 className={styles.ctaTitle}>{right.cta.title}</h3>

            <form className={styles.ctaForm}>
              <input
                type="text"
                placeholder={right.cta.placeholder}
                className={styles.ctaInput}
              />
              <button type="button" className={styles.ctaButton}>
                <Search className={styles.ctaIcon} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
