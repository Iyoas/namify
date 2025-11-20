import Image from "next/image";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        {/* Linkerzijde: foto */}
        <div className={styles.imagePanel}>
          <div className={styles.imageCard}>
            <Image
              src="/images/contact.png"
              alt="Supportmedewerker die een klant helpt via de chat"
              width={480}
              height={600}
              className={styles.image}
            />
          </div>
        </div>

        {/* Rechterzijde: titel, tekst, formulier en contactgegevens */}
        <div className={styles.content}>
          <header className={styles.header}>
            <h2 id="contact-heading" className={styles.title}>
              Neem contact op
            </h2>
            <p className={styles.subtitle}>
              Heb je vragen of wil je samenwerken? Ons team reageert meestal
              binnen 24 uur.
            </p>
          </header>

          <form className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  Volledige naam
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jan Janssen"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  E-mailadres
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jan@email.com"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                Bericht
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Vertel kort waar we je mee kunnen helpen..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitButton}>
                Bericht verzenden
              </button>
            </div>
          </form>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <Image
                  src="/icons/email.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles.detailSvg}
                />
              </div>
              <div className={styles.detailText}>
                <p className={styles.detailLabel}>Email</p>
                <a
                  href="mailto:info-namitor@gmail.com"
                  className={styles.detailValue}
                >
                  info-namitor@gmail.com
                </a>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <Image
                  src="/icons/location.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles.detailSvg}
                />
              </div>
              <div className={styles.detailText}>
                <p className={styles.detailLabel}>Location</p>
                <p className={styles.detailValue}>
                  Based in Rotterdam, The Netherlands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}