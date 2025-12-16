
import { Search } from "lucide-react";
import styles from "./LongFormContent.module.css";

export default function LongFormContent() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Linker kolom */}
        <div className={styles.leftColumn}>
          <header className={styles.leftHeader}>
            <h2 className={styles.leftTitle}>
              Discover the power of a name that defines your vision
            </h2>
          </header>

          <div className={styles.leftIntro}>
            <p>
              Finding the right name is more than combining nice words — it is about
              building an identity that connects with your audience.
              A good name reflects your purpose, your values, and the feeling you want
              people to have every time they interact with your product, service, or brand.
            </p>

          </div>

          <ol className={styles.benefitList}>
            <li className={styles.benefitListItemPrimary}>
              <span>
                1 ) Benefits of using this idea generator to find a new name
                for your next venture
              </span>
            </li>
            <li>2 ) Namitor offers catchy business name ideas</li>
            <li>3 ) Spark a brand identity that sticks in customers&apos; minds</li>
            <li>4 ) Blend creativity and clarity for instant credibility</li>
            <li>5 ) Capture the story behind your product or service</li>
            <li>6 ) Turn industry insights into a brand pulse</li>
            <li>7 ) Revive classic inspiration for modern builders</li>
          </ol>

          <aside className={styles.highlightCard}>
            <p className={styles.highlightIntro}>
              Great names do more than describe — they evoke emotion, build
              trust, and invite curiosity. Whether your brand is new or growing,
            </p>

            <ul className={styles.highlightList}>
              <li>Simplicity that feels intentional</li>
              <li>
                Words that feel tangible and memorable
              </li>
              <li>
                Authentic meaning that reflects your roots
              </li>
              <li>Easy recall across cultures and languages</li>
              <li>
                Emotional resonance that makes customers feel confident and curious
              </li>
            </ul>

            <p className={styles.highlightFooter}>
              Let this idea generator help you uncover words that fit your brand, signal trust,
              and inspire action.
            </p>
          </aside>
        </div>

        {/* Rechter kolom */}
        <div className={styles.rightColumn}>
          <section className={styles.rightBlock}>
            <h3 className={styles.rightTitle}>
              Benefits of using this idea generator to find a new name for your business
            </h3>

            <p>
              When it comes to choosing a name you need something catchy, unique, and
              memorable. This name generator is designed to offer options that attract
              your audience.
            </p>

            <p>
              Here&apos;s what makes this business name generator helpful:
            </p>

            <ul className={styles.bulletList}>
              <li>
                <strong>Availability:</strong> Names surface with domain extensions you can register.
              </li>
              <li>
                <strong>Relevance:</strong> Suggestions stay aligned with your audience, offer, and style.
              </li>
              <li>
                <strong>Memorable:</strong> Availability plus relevance help you land on a name that sticks.
              </li>
            </ul>
          </section>

          <section className={styles.rightBlock}>
            <h3 className={styles.rightTitle}>
              Namify offers catchy business name ideas
            </h3>

            <p>
              When it comes to choosing a name you need to pick one that is catchy and unique.
              This name generator is designed to offer names that will attract your audience.
            </p>

            <p>
              Here&apos;s what makes this business name generator useful:
            </p>

            <ul className={styles.bulletList}>
              <li>
                <strong>Availability:</strong> The names you find here can be registered on popular domain extensions.
              </li>
              <li>
                <strong>Relevance:</strong> The suggested name ideas will be relevant to your brand and what you do.
              </li>
              <li>
                <strong>Memorable:</strong> Availability and relevance together help you choose something catchy and unique.
              </li>
            </ul>
          </section>

          <section className={styles.ctaBlock}>
            <h3 className={styles.ctaTitle}>Get your perfect business name</h3>

            <form className={styles.ctaForm}>
              <input
                type="text"
                placeholder="describe your business"
                className={styles.ctaInput}
              />
              <button type="button" className={styles.ctaButton}>
                <Search className={styles.ctaIcon} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
