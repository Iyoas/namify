import type { Metadata } from "next";
import { cache, Children, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { FaRegLightbulb } from "react-icons/fa";
import type { Lang } from "@/config/i18n";
import { countWords, estimateReadingTimeMinutes, extractPlainTextFromPortableText } from "@/lib/blogMeta";
import { getSanityBlogPostBySlug } from "@/lib/sanity/blog";
import BlogFaq from "./BlogFaq";
import BlogGeneratorCta from "./BlogGeneratorCta";
import BlogMetaRow from "./BlogMetaRow";
import InArticleDomainChecker from "./InArticleDomainChecker";
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

type PortableTextChild = {
  _type?: string;
  text?: string;
};

type PortableTextLinkMark = {
  _type?: string;
  href?: string;
};

type PortableTextBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: string;
  children?: PortableTextChild[];
  isClickableName?: boolean;
};

type DomainCheckerInsertId =
  | "after-intro"
  | "after-modern-names";

type DomainCheckerBlock = {
  _type: "domainChecker";
  _key: string;
  insertId: DomainCheckerInsertId;
};

type GeneratorCtaBlock = {
  _type: "generatorCta";
  _key: string;
  insertId: "after-domain-section";
};

type ListTipBlock = {
  _type: "listTip";
  _key: string;
  text: string;
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

function getPortableTextBlockText(block: unknown): string {
  if (!block || typeof block !== "object") return "";

  const value = block as PortableTextBlock;
  if (!Array.isArray(value.children)) return "";

  return value.children
    .map((child) => (child?._type === "span" ? child.text ?? "" : ""))
    .join("")
    .trim();
}

function createDomainCheckerBlock(
  insertId: DomainCheckerInsertId,
  keySuffix: string
): DomainCheckerBlock {
  return {
    _type: "domainChecker",
    _key: `domain-checker-${insertId}-${keySuffix}`,
    insertId,
  };
}

function createGeneratorCtaBlock(keySuffix: string): GeneratorCtaBlock {
  return {
    _type: "generatorCta",
    _key: `generator-cta-after-domain-section-${keySuffix}`,
    insertId: "after-domain-section",
  };
}

function createListTipBlock(keySuffix: string): ListTipBlock {
  return {
    _type: "listTip",
    _key: `list-tip-click-domain-check-${keySuffix}`,
    text: "Tip: Click any name below to check domain availability instantly.",
  };
}

function normalizeNameForDomainCheck(value: string): string {
  return value.trim();
}

function injectAiAppDomainCheckers(
  body: unknown[] | undefined,
  slug: string
): Array<unknown | DomainCheckerBlock | GeneratorCtaBlock | ListTipBlock> {
  if (!Array.isArray(body) || slug !== "100-ai-app-name-ideas") {
    return body ?? [];
  }

  const result: Array<
    unknown | DomainCheckerBlock | GeneratorCtaBlock | ListTipBlock
  > = [];
  let insertedAfterIntro = false;
  let insideModernNamesSection = false;
  let insertedAfterModernNames = false;
  let insideDomainSection = false;
  let insertedAfterDomainSection = false;
  let insideClickableNameSection = false;
  let insideUniqueIdeasSection = false;
  let uniqueIdeasParagraphCount = 0;

  const clickableNameSectionHeadings = new Set([
    "Modern AI App Name Ideas",
    "AI Agent App Name Ideas",
    "AI Writing App Name Ideas",
    "AI Productivity App Name Ideas",
    "AI Chatbot App Name Ideas",
    "AI Automation Tool Name Ideas",
    "One Word AI App Name Ideas",
  ]);

  for (const [index, block] of body.entries()) {
    const text = getPortableTextBlockText(block);
    const value = block as PortableTextBlock;
    const isH2 = value?._type === "block" && value.style === "h2";
    const isH3 = value?._type === "block" && value.style === "h3";
    const isBullet = value?._type === "block" && value.listItem === "bullet";
    const keySuffix = value?._key ?? String(index);

    if (isH2 || isH3) {
      if (isH2 && text === "Unique AI App Name Ideas") {
        insideUniqueIdeasSection = true;
        uniqueIdeasParagraphCount = 0;
      } else if (isH2 || isH3) {
        insideUniqueIdeasSection = false;
      }

      if (isH3 && clickableNameSectionHeadings.has(text)) {
        insideClickableNameSection = true;
      } else {
        insideClickableNameSection = false;
      }
    }

    if (!insertedAfterIntro && text === "Why Naming Matters for AI Apps") {
      result.push(createDomainCheckerBlock("after-intro", keySuffix));
      insertedAfterIntro = true;
    }

    if (
      text ===
      "Check whether one of these AI app names is available before someone else registers it."
    ) {
      if (!insertedAfterModernNames) {
        result.push(createDomainCheckerBlock("after-modern-names", keySuffix));
        insertedAfterModernNames = true;
      }
      continue;
    }

    if (
      insideModernNamesSection &&
      !insertedAfterModernNames &&
      isH3 &&
      text === "AI Agent App Name Ideas"
    ) {
      result.push(createDomainCheckerBlock("after-modern-names", keySuffix));
      insertedAfterModernNames = true;
      insideModernNamesSection = false;
    }

    if (
      insideDomainSection &&
      !insertedAfterDomainSection &&
      isH2 &&
      text !== "Choosing the Right Domain for Your AI App"
    ) {
        result.push(createGeneratorCtaBlock(keySuffix));
        insertedAfterDomainSection = true;
        insideDomainSection = false;
    }

    if (
      insideUniqueIdeasSection &&
      value?._type === "block" &&
      value.style === "normal" &&
      !value.listItem
    ) {
      uniqueIdeasParagraphCount += 1;

      if (uniqueIdeasParagraphCount === 2) {
        result.push(createListTipBlock(keySuffix));
        continue;
      }
    }

    if (insideClickableNameSection && isBullet) {
      result.push({
        ...value,
        isClickableName: true,
      });
      continue;
    }

    result.push(block);

    if (isH3 && text === "Modern AI App Name Ideas") {
      insideModernNamesSection = true;
    }

    if (isH2 && text === "Choosing the Right Domain for Your AI App") {
      insideDomainSection = true;
    }
  }

  if (insideDomainSection && !insertedAfterDomainSection) {
    result.push(createGeneratorCtaBlock("end"));
  }

  return result;
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

function NameListItem({
  children,
  href,
}: {
  children?: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.nameListLink}
    >
      {children}
    </a>
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
  const articleBody = injectAiAppDomainCheckers(post.body, post.slug || decodedSlug);
  const plainTextBody = extractPlainTextFromPortableText(post.body);
  const wordCount = countWords(plainTextBody);
  const readingTimeMinutes = estimateReadingTimeMinutes(wordCount);
  const shareUrl = `${SITE_URL}/${resolvedLang}/blog/${post.slug || decodedSlug}`;
  const metaCopy =
    resolvedLang === "nl"
      ? {
          readingTime: `${readingTimeMinutes} min leestijd`,
          wordCount: `${wordCount.toLocaleString("nl-NL")} woorden`,
          share: "Delen",
          copied: "Gekopieerd",
        }
      : {
          readingTime: `${readingTimeMinutes} min read`,
          wordCount: `${wordCount.toLocaleString("en-US")} words`,
          share: "Share",
          copied: "Copied",
        };
  const checkerPath =
    resolvedLang === "nl"
      ? `/${resolvedLang}/tools/domeinnaam-checker`
      : `/${resolvedLang}/tools/domain-checker`;
  const faqCopy =
    resolvedLang === "nl"
      ? {
          title: "Veelgestelde vragen",
          subtitle: "Alles wat je moet weten, helder uitgelegd.",
        }
      : {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know, clearly explained.",
        };
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
              <BlogGeneratorCta lang={resolvedLang} />
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
      bullet: ({
        children,
        value,
      }: {
        children?: ReactNode;
        value?: PortableTextBlock;
      }) => {
        if (value?.isClickableName) {
          const name = getPortableTextBlockText(value);
          const href =
            `${checkerPath}?domain=` +
            encodeURIComponent(normalizeNameForDomainCheck(name));

          return (
            <li>
              <NameListItem href={href}>{children}</NameListItem>
            </li>
          );
        }

        return (
          <li>
            <ChecklistListItem>{children}</ChecklistListItem>
          </li>
        );
      },
    },
    marks: {
      link: ({
        children,
        value,
      }: {
        children?: ReactNode;
        value?: PortableTextLinkMark;
      }) => (
        <a
          href={value?.href}
          className={styles.inlineGradientLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
    types: {
      domainChecker: () => <InArticleDomainChecker lang={resolvedLang} />,
      generatorCta: () => <BlogGeneratorCta lang={resolvedLang} />,
      listTip: ({ value }: { value?: ListTipBlock }) => (
        <p className={styles.listTip}>
          <span className={styles.listTipIcon} aria-hidden="true">
            <FaRegLightbulb />
          </span>
          <span>{value?.text}</span>
        </p>
      ),
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
            <div className={styles.metaDivider} aria-hidden="true" />
            <BlogMetaRow
              dateLabel={formatDate(post.date, resolvedLang)}
              readingTimeLabel={metaCopy.readingTime}
              wordCountLabel={metaCopy.wordCount}
              shareLabel={metaCopy.share}
              shareUrl={shareUrl}
              copiedLabel={metaCopy.copied}
            />
          </header>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.inner}>
          {articleBody.length > 0 ? (
            <div className={styles.articleContent}>
              <PortableText value={articleBody} components={portableTextComponents} />
            </div>
          ) : null}
          {Array.isArray(post.faq) && post.faq.length > 0 ? (
            <BlogFaq
              items={post.faq}
              title={faqCopy.title}
              subtitle={faqCopy.subtitle}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}
