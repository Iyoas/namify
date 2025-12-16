import Image from "next/image";
import styles from "./AiExplainerSection.module.css";

const featureList = [
  {
    title: "AI Powered Name Generation",
    description:
      "Get fresh, relevant name ideas tailored to your description and intent. Explore a wide range of naming styles, from bold and modern to clean and minimal, and quickly uncover options that feel distinctive, easy to pronounce, and ready to grow with your brand.",
  },
  {
    title: "Instant Domain Extensions Preview",
    description:
      "Evaluate domain possibilities directly alongside each name suggestion. Instantly compare popular extensions such as .com, .io, .ai, and more, so you can make faster decisions without switching tools or repeating searches.",
  },
  {
    title: "Shortlist Your Favorites",
    description:
      "Save the name ideas that stand out and build a focused shortlist as you explore. Revisit and compare your favorites, open them to view variations, and refine your options until you find a name that truly fits your project or business.",
  },
] as const;

export default function AiExplainerSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.imageCard}>
          <Image
            src="/images/ai2.png"
            alt="Illustration highlighting Namitor AI"
            width={560}
            height={720}
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>AI Explained</p>
          <h2 className={styles.title}>
            Namitor’s AI helps craft unique business name ideas
          </h2>
          <p className={styles.description}>
            Namitor helps you generate thoughtful, relevant business name ideas based on your input. Instead of random suggestions, the AI focuses on clarity, memorability, and brand fit, helping you explore names that actually work in the real world and are suitable for online use.
          </p>

          <div className={styles.featureList}>
            {featureList.map((feature) => (
              <article key={feature.title} className={styles.feature}>
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
