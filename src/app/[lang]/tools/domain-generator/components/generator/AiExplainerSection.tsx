import Image from "next/image";
import styles from "./AiExplainerSection.module.css";
import type { GeneratorGeneralMessages } from "@/i18n/domain-generator-index/generator-general";

type AiExplainerSectionProps = {
  messages: GeneratorGeneralMessages;
};

export default function AiExplainerSection({ messages }: AiExplainerSectionProps) {
  const aiExplainer = messages.sections.aiExplainer;
  const featureList = aiExplainer.features;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.imageCard}>
          <Image
            src="/images/ai2.png"
            alt={aiExplainer.imageAlt}
            width={560}
            height={720}
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{aiExplainer.eyebrow}</p>
          <h2 className={styles.title}>
            {aiExplainer.title}
          </h2>
          <p className={styles.description}>
            {aiExplainer.description}
          </p>

          <div className={styles.featureList}>
            {featureList.map((feature) => (
              <article key={feature.id} className={styles.feature}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
