import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cache, Children, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { Lang } from "@/config/i18n";
import { getSanityBlogPostBySlug } from "@/lib/sanity/blog";
import styles from "./BlogPost.module.css";

const SITE_URL = "https://www.domifai.com";
const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

type BlogPostPageProps = {
  params: Promise<{ lang: Lang; slug: string }>;
};

type ChecklistTextParts = {
  label: string;
  description: string;
};

function safeDecodeSlug(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function formatDate(date: string, lang: "en" | "nl") {
  const locale = lang === "nl" ? "nl-NL" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getChecklistTextParts(children?: ReactNode): ChecklistTextParts | null {
  const text = Children.toArray(children).join("").trim();
  const colonIndex = text.indexOf(":");

  if (colonIndex <= 0 || colonIndex === text.length - 1) {
    return null;
  }

  return {
    label: text.slice(0, colonIndex).trim(),
    description: text.slice(colonIndex + 1).trim(),
  };
}

function ChecklistListItem({ children }: { children?: ReactNode }) {
  const parts = getChecklistTextParts(children);

  if (!parts) {
    return <>{children}</>;
  }

  return (
    <>
      <span className={styles.checklistLabel}>{parts.label}:</span>{" "}
      <span>{parts.description}</span>
    </>
  );
}

const getPostCached = cache(async (lang: Lang, slug: string) => {
  return getSanityBlogPostBySlug(lang, slug);
});

const primarySectionHeadings = new Set([
  "Mistakes to Avoid While Name Pizzeria Business",
  "Pizzeria Name Ideas for Inspiration",
  "Summary",
]);

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const resolvedLang: "en" | "nl" = lang === "nl" ? "nl" : "en";
  const decodedSlug = safeDecodeSlug(slug);
  const post = await getPostCached(resolvedLang, decodedSlug);

  if (!post) {
    return {
      title: "Domifai Blog",
      description:
        resolvedLang === "nl"
          ? "Korte en praktische inzichten over merknamen, domeinen en branding."
          : "Short and practical insights on naming, domains, and brand building.",
    };
  }

  const image = post.image || DEFAULT_BLOG_IMAGE;
  const canonical = `${SITE_URL}/${resolvedLang}/blog/${post.slug || decodedSlug}`;

  return {
    title: `${post.title} | Domifai Blog`,
    description: post.excerpt || "Domifai Blog post",
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${post.title} | Domifai Blog`,
      description: post.excerpt || "Domifai Blog post",
      url: canonical,
      images: [{ url: image }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const resolvedLang: "en" | "nl" = lang === "nl" ? "nl" : "en";
  const decodedSlug = safeDecodeSlug(slug);
  const post = await getPostCached(resolvedLang, decodedSlug);

  if (!post) {
    notFound();
  }

  const image = post.image || DEFAULT_BLOG_IMAGE;
  const copy =
    resolvedLang === "nl"
      ? {
          promoText: "Vind vandaag de perfecte bedrijfsnaam!",
          promoCta: "Nu genereren",
        }
      : {
          promoText: "Find the perfect business name today!",
          promoCta: "Generate now",
        };
  const generatorHref =
    resolvedLang === "nl"
      ? `/${resolvedLang}/tools/domeinnaam-generator`
      : `/${resolvedLang}/tools/domain-generator`;
  const portableTextComponents = {
    block: {
      h2: ({ children }: { children?: ReactNode }) => {
        const text = Children.toArray(children).join("").trim();
        const className = primarySectionHeadings.has(text)
          ? styles.sectionHeading
          : styles.subHeading;
        const shouldRenderPromo =
          text === "Mistakes to Avoid While Name Pizzeria Business";

        if (shouldRenderPromo) {
          return (
            <>
              <section className={styles.promoCard} aria-label="Domifai generator call to action">
                <div className={styles.promoBrand}>
                  <Image
                    src="/images/domifai-logo.png"
                    alt="Domifai"
                    width={36}
                    height={36}
                    className={styles.promoBrandLogo}
                  />
                  <span className={styles.promoBrandName}>Domifai</span>
                </div>
                <p className={styles.promoText}>{copy.promoText}</p>
                <Link href={generatorHref} className={styles.promoButton}>
                  {copy.promoCta}
                </Link>
              </section>
              <h2 className={className}>{children}</h2>
            </>
          );
        }

        return <h2 className={className}>{children}</h2>;
      },
      h3: ({ children }: { children?: ReactNode }) => {
        return <h3 className={styles.h3}>{children}</h3>;
      },
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => {
        const itemCount = Children.count(children);
        const listClassName =
          itemCount > 8
            ? `${styles.list} ${styles.twoColumnList}`
            : `${styles.list} ${styles.basicList}`;

        return <ul className={listClassName}>{children}</ul>;
      },
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => {
        return (
          <li>
            <ChecklistListItem>{children}</ChecklistListItem>
          </li>
        );
      },
    },
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <img className={styles.coverImage} src={image} alt={post.title} loading="eager" />

          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            {post.excerpt ? <p className={styles.excerpt}>{post.excerpt}</p> : null}
            <p className={styles.date}>{formatDate(post.date, resolvedLang)}</p>
          </header>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.inner}>
          {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
            <div className={styles.articleContent}>
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
