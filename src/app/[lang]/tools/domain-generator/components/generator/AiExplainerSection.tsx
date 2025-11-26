import Image from "next/image";
import styles from "./AiExplainerSection.module.css";

const featureList = [
  {
    title: "AI-Powered Name Generation",
    description:
      "Namitor takes brand naming to new heights, offering contextual and meaningful skin care business name ideas. Say goodbye to generic names and embrace a brand identity that reflects the essence of your skincare business.",
  },
  {
    title: "Social Media Username Check",
    description:
      "Namitor goes beyond just generating brand names; it evaluates social media username availability for your chosen brand effortlessly. It streamlines your online branding with consistent and accessible handles for your skincare business.",
  },
  {
    title: "Free Logo",
    description:
      "Namitor gives you a free logo with every domain name purchase. Now, you can enhance the visual identity of your skin care business and make a lasting impression in the competitive skincare world.",
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
            Namitor&apos;s AI prowess helps craft unique skin care business name
            ideas
          </h2>
          <p className={styles.description}>
            Namitor helps you generate ingenious skin care business name ideas
            that resonate. With this, you can elevate your brand with its
            cutting-edge AI features, designed to make your skincare business
            stand out in the digital landscape.
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
