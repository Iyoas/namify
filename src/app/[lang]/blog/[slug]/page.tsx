import type { Metadata } from "next";
import Link from "next/link";
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

const getPostCached = cache(async (lang: Lang, slug: string) => {
  return getSanityBlogPostBySlug(lang, slug);
});

const primarySectionHeadings = new Set([
  "Mistakes to Avoid While Name Pizzeria Business",
  "Pizzeria Name Ideas for Inspiration",
  "Summary",
]);

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: ReactNode }) => {
      const text = Children.toArray(children).join("").trim();
      const className = primarySectionHeadings.has(text)
        ? styles.sectionHeading
        : styles.subHeading;

      return <h2 className={className}>{children}</h2>;
    },
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => {
      const itemCount = Children.count(children);
      const listClassName =
        itemCount > 8
          ? `${styles.list} ${styles.nameList}`
          : `${styles.list} ${styles.basicList}`;

      return <ul className={listClassName}>{children}</ul>;
    },
  },
};

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
          back: "Terug naar blog",
        }
      : {
          back: "Back to blog",
        };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Link href={`/${resolvedLang}/blog`} className={styles.backLink}>
          {copy.back}
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <p className={styles.date}>{formatDate(post.date, resolvedLang)}</p>
        </header>

        <img className={styles.image} src={image} alt={post.title} loading="eager" />

        {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
          <div className={styles.content}>
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
