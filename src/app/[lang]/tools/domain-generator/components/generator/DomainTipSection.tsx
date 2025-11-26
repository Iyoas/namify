import styles from "./DomainTipSection.module.css";

export default function DomainTipSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Titel */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            Kwaliteiten van een goede domeinnaam voor uw huidverzorgingsbedrijf
          </h2>
        </header>

        {/* Introductietekst */}
        <div className={styles.intro}>
          <p>
            Voor je huidverzorgingsbedrijf heb je een pakkende naam nodig om je
            concurrenten te overtreffen. Een van de beste manieren om dit te
            doen, is door een betekenisvolle domeinnaam te kiezen.
          </p>

          <p>Hier zijn enkele kenmerken van een goede domeinnaam:</p>
        </div>

        {/* Bulletpoints met kenmerken */}
        <ul className={styles.featureList}>
          <li>
            Een goede domeinnaam is kort, betekenisvol en memorabel.
          </li>
          <li>
            Een goede domeinnaam is uniek, pakkend en relevant voor uw branche.
          </li>
          <li>
            Een goede domeinnaam bevat geen vreemde spellingen of grammaticale
            fouten.
          </li>
        </ul>

        {/* Tekst + domeinextensie badges */}
        <div className={styles.extensionsBlock}>
          <p>
            Het vinden van een domeinnaam die aan al deze eisen voldoet, kan een
            uitdaging zijn. Daarom is het verstandig om te kiezen voor een van
            de nieuwe domeinextensies, zoals{" "}
            <span className={styles.extensionBadgesInline}>
              <span className={styles.extensionBadge}>.store</span>
              <span className={styles.extensionBadge}>.online</span>
              <span className={styles.extensionBadge}>.shop</span>
              <span className={styles.extensionBadge}>.skin</span>
              <span className={styles.extensionBadge}>.beauty</span>
            </span>{" "}
            etc. Deze domeinextensies zijn kort, herkenbaar, betekenisvol en
            voldoen aan alle bovengenoemde voorwaarden.
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
