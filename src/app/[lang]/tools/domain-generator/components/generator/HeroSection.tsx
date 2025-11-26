import { ChevronDown, Megaphone, Sparkles, Wand2 } from "lucide-react";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const samplePrompts = [
    "A brand that rejuvenates and heals",
    "A skincare clinic with a modern aesthetic",
    "A skincare brand for radiant skin",
    "A natural brand of skincare solutions",
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Heading */}
        <h1 className={styles.title}>
          Genereer{" "}
          <span className={styles.highlight}>Skin Care-</span>
          En
          <br className={styles.titleBreak} /> Domeinnaam Met AI
        </h1>

        {/* Subheading */}
        <p className={styles.subtitle}>
          Jij Hebt Een Idee. Wij Zorgen Voor De Naam En Het Domein. Lanceer Je
          Website Vandaag Nog!
        </p>

        {/* Description area with filters + generate button */}
        <div className={styles.descriptionWrapper}>
          

          <div className={styles.descriptionBox}>
            <div className={styles.descriptionTop}>
              <textarea
                className={styles.textarea}
                placeholder="Beschrijf uw project of bedrijfsidee."
              />
            </div>

            <div className={styles.bottomRow}>
              <div className={styles.optionsRow}>
                <button type="button" className={styles.optionButton}>
                  <Megaphone className={styles.optionIcon} />
                  <span>Creative</span>
                  <ChevronDown className={styles.optionChevron} />
                </button>

                <button type="button" className={styles.optionButton}>
                  <Sparkles className={styles.optionIcon} />
                  <span>Extension</span>
                  <ChevronDown className={styles.optionChevron} />
                </button>

                <button type="button" className={styles.optionButton}>
                  <Wand2 className={styles.optionIcon} />
                  <span>Enhance prompt</span>
                </button>
              </div>

              <div className={styles.generateRow}>
                <button type="button" className={styles.generateButton}>
                  <Sparkles className={styles.generateIcon} />
                  <span>Genereer namen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Example prompts */}
        <div className={styles.samples}>
          {samplePrompts.map((prompt) => (
            <button key={prompt} type="button" className={styles.sampleChip}>
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}