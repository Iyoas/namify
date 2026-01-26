import Image from "next/image";
import styles from "./Contact.module.css";
import type { DomainGeneratorIndexMessages } from "@/i18n/domain-generator-index";

type ContactProps = {
  messages: DomainGeneratorIndexMessages;
};

export default function Contact({ messages }: ContactProps) {
  const contact = messages.contact;

  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        {/* Linkerzijde: foto */}
        <div className={styles.imagePanel}>
          <div className={styles.imageCard}>
            <Image
              src="/images/contact2.png"
              alt={contact.imageAlt}
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
              {contact.title}
            </h2>
            <p className={styles.subtitle}>{contact.subtitle}</p>
          </header>

          <form className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  {contact.form.fullNameLabel}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder={contact.form.fullNamePlaceholder}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  {contact.form.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={contact.form.emailPlaceholder}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                {contact.form.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder={contact.form.messagePlaceholder}
                className={styles.textarea}
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitButton}>
                {contact.form.submit}
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
                <p className={styles.detailLabel}>{contact.details.emailLabel}</p>
                <a
                  href={`mailto:${contact.details.emailValue}`}
                  className={styles.detailValue}
                >
                  {contact.details.emailValue}
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
                <p className={styles.detailLabel}>{contact.details.locationLabel}</p>
                <p className={styles.detailValue}>{contact.details.locationValue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
