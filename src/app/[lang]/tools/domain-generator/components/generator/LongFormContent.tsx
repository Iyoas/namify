
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
              Discover the Power of a Name That Defines Your Skincare Vision
            </h2>
          </header>

          <div className={styles.leftIntro}>
            <p>
              Finding The Right Name For Your Skincare Brand Is More Than Just
              Combining Beautiful Words — It&apos;s About Creating An Identity
              That Connects With Your Audience.
              A Good Name Reflects Your Brand&apos;s Purpose, Your Values, And The
              Feeling You Want Customers To Experience Every Time They See Your
              Products.
            </p>

          </div>

          <ol className={styles.benefitList}>
            <li className={styles.benefitListItemPrimary}>
              <span>
                1 ) Benefits Of Using This Idea Generator To Find A New Name
                For Your Skin Care Business
              </span>
            </li>
            <li>2 ) Namitor Offers Catchy Skin Care Business Name Idea</li>
            <li>3 ) Spark A Brand Identity That Sticks In Customers&apos; Minds</li>
            <li>4 ) Blend Science + Poetry For Instant Credibility</li>
            <li>5 ) Capture The Magic Of Night-To-Morning Rituals</li>
            <li>6 ) Turn Floral Ingredients Into A Brand Pulse</li>
            <li>7 ) Revive Apothecary Charm For Modern Artisans</li>
          </ol>

          <aside className={styles.highlightCard}>
            <p className={styles.highlightIntro}>
              Great Names Don&apos;t Just Describe They Evoke Emotion, Build
              Trust, And Invite Curiosity. Whether Your Brand
            </p>

            <ul className={styles.highlightList}>
              <li>Simplicity That Feels Elegant</li>
              <li>
                A Sensory Touch Words That *Feel Soft, Fresh, Or Radiant*
              </li>
              <li>
                Authentic Meaning That Reflects Your Brand&apos;s Roots
              </li>
              <li>Easy Recall Across Cultures And Languages</li>
              <li>
                Emotional Resonance That Makes Customers Feel *Beautiful,
                Calm, Or Confident*
              </li>
            </ul>

            <p className={styles.highlightFooter}>
              Let This Idea Generator Help You Uncover Words That Speak Beauty,
              Balance, And Transformation.
            </p>
          </aside>
        </div>

        {/* Rechter kolom */}
        <div className={styles.rightColumn}>
          <section className={styles.rightBlock}>
            <h3 className={styles.rightTitle}>
              Benefits of using this idea generator to find a new name for your
              skin care business
            </h3>

            <p>
              When It Comes To Choosing A Name For Your Skin Care Brand You Need
              To Pick One That Is Catchy And Unique. This Name Generator Is
              Designed To Offer Names That Will Attract Your Audience.
            </p>

            <p>
              Here&apos;s What Makes This Skin Care Business Name Generator
              Amazing:
            </p>

            <ul className={styles.bulletList}>
              <li>
                <strong>Availability:</strong> The Names You Find Here Will All
                Be Available To Register On New Domain Extensions.
              </li>
              <li>
                <strong>Relevance:</strong> The Suggested Name Ideas Will Be
                Relevant To Your Brand And Will Define What You Do.
              </li>
              <li>
                <strong>Memorable:</strong> The Availability And Relevance
                Factors Together Guarantee That The Name You Choose Will Be
                Catchy, Unique, And Memorable.
              </li>
            </ul>
          </section>

          <section className={styles.rightBlock}>
            <h3 className={styles.rightTitle}>
              Namify offers catchy skin care business name ideas
            </h3>

            <p>
              When It Comes To Choosing A Name For Your Skin Care Brand You Need
              To Pick One That Is Catchy And Unique. This Name Generator Is
              Designed To Offer Names That Will Attract Your Audience.
            </p>

            <p>
              Here&apos;s What Makes This Skin Care Business Name Generator
              Amazing:
            </p>

            <ul className={styles.bulletList}>
              <li>
                <strong>Availability:</strong> The Names You Find Here Will All
                Be Available To Register On New Domain Extensions.
              </li>
              <li>
                <strong>Relevance:</strong> The Suggested Name Ideas Will Be
                Relevant To Your Brand And Will Define What You Do.
              </li>
              <li>
                <strong>Memorable:</strong> The Availability And Relevance
                Factors Together Guarantee That The Name You Choose Will Be
                Catchy, Unique, And Memorable.
              </li>
            </ul>
          </section>

          <section className={styles.ctaBlock}>
            <h3 className={styles.ctaTitle}>Get your perfect business name</h3>

            <form className={styles.ctaForm}>
              <input
                type="text"
                placeholder="beschrijf uw bedrijf"
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