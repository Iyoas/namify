import styles from "./DomainTipSection.module.css";

export default function DomainTipSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Titel */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            What makes a strong domain name
          </h2>
        </header>

        {/* Introductietekst */}
        <div className={styles.intro}>
          <p>
            To stand out you need a memorable name and an easy domain. One of the best ways
            to do that is by choosing a meaningful web address that people can recall,
            type, and trust at a glance.
          </p>

          <p>Here are a few hallmarks of a good domain and why they matter:</p>
        </div>

        {/* Bulletpoints met kenmerken */}
        <ul className={styles.featureList}>
          <li>
            Keep it short, meaningful, and memorable so it is easy to say and share.
          </li>
          <li>
            Make it unique, catchy, and relevant to what you do to set clear expectations.
          </li>
          <li>
            Avoid odd spellings and complicated wording to reduce typos and confusion.
          </li>
        </ul>

        {/* Tekst + domeinextensie badges */}
        <div className={styles.extensionsBlock}>
          <p>
            Finding a domain that meets all these needs can be a challenge.
            Consider newer extensions such as{" "}
            <span className={styles.extensionBadgesInline}>
              <span className={styles.extensionBadge}>.store</span>
              <span className={styles.extensionBadge}>.online</span>
              <span className={styles.extensionBadge}>.shop</span>
              <span className={styles.extensionBadge}>.tech</span>
              <span className={styles.extensionBadge}>.cloud</span>
            </span>{" "}
            etc. These domain extensions are short, recognizable, meaningful, and
            tick the boxes above.
          </p>
        </div>

        {/* Voorbeeldvormen van domeinnamen */}
        <div className={styles.examplesBlock}>
          <p className={styles.examplesIntro}>
            Here are a few ways you can use this name generator to come up with
            some great name ideas:
          </p>

          <div className={styles.examplesList}>
            <div className={styles.exampleBadge}>www.[brand name].online</div>
            <div className={styles.exampleBadge}>
              www.[brand name + industry].store
            </div>
            <div className={styles.exampleBadge}>
              www.[brand name + geo].site
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
