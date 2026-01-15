
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./LongFormContent.module.css";
import type { Lang } from "@/config/i18n";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

export default function LongFormContent({
  messages,
  lang,
}: {
  messages: GeneratorGeneralMessages;
  lang: Lang;
}) {
  const longForm = messages.sections.longForm;
  const left = longForm.left;
  const right = longForm.right;
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const searchParams = new URLSearchParams({ q: trimmed });
    router.push(
      `/${lang}/tools/domain-generator/results?` + searchParams.toString()
    );
  }

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

            <form className={styles.ctaForm} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={right.cta.placeholder}
                className={styles.ctaInput}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
              <button type="submit" className={styles.ctaButton}>
                <Search className={styles.ctaIcon} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
