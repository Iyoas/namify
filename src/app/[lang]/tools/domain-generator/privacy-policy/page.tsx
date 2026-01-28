import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import { getPrivacyPolicyMessages } from "@/i18n/components/privacy-policy";
import styles from "./PrivacyPolicy.module.css";

type PrivacyPolicyPageProps = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "nl" ? "Privacybeleid | Domifai" : "Privacy Policy | Domifai";

  return {
    title,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { lang } = await params;
  const messages = getPrivacyPolicyMessages(lang);

  const sections = [
    messages.sections.dataCollection,
    messages.sections.howWeUse,
    messages.sections.dataSharing,
    messages.sections.retention,
    messages.sections.rights,
    messages.sections.contact,
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>{messages.title}</h1>
          <div className={styles.intro}>
            {messages.intro.map((paragraph, index) => (
              <p key={`intro-${index}`} className={styles.introParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <div className={styles.sectionList}>
          {sections.map((section) => (
            <section key={section.title} className={styles.block}>
              <h2 className={styles.blockTitle}>{section.title}</h2>
              <div className={styles.blockBody}>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
