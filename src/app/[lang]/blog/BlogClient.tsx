"use client";

import { FaArrowRight } from "react-icons/fa";
import { BorderBeam } from "@stianlarsen/border-beam";
import "@stianlarsen/border-beam/css";
import styles from "./Blog.module.css";

type BlogPost = {
  id: string;
  lang: "en" | "nl";
  title: string;
  excerpt: string;
  date: string;
  formattedDate: string;
  image: string;
};

type BlogCopy = {
  title: string;
  intro: string;
  cta: string;
};

type BlogClientProps = {
  copy: BlogCopy;
  lang: "en" | "nl";
  posts: BlogPost[];
};

export default function BlogClient({
  copy,
  posts,
}: BlogClientProps) {
  return (
    <section className={styles.section}>
      <svg className={styles.gradientDefs} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient
            id="domifai-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0013E0" />
            <stop offset="100%" stopColor="#B55AFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
        </header>

        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <img
                className={styles.image}
                src={post.image}
                alt={post.title}
                loading="lazy"
              />
              <BorderBeam
                className={styles.beam}
                colorFrom="#0013E0"
                colorTo="#B55AFF"
                delay={1}
                duration={10}
              />
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <div className={styles.footer}>
                <p className={styles.date}>{post.formattedDate}</p>
                <button type="button" className={styles.cta}>
                  <span className={styles.ctaText}>{copy.cta}</span>
                  <FaArrowRight aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
