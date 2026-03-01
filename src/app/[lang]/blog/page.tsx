import type { Metadata } from "next";
import type { Lang } from "@/config/i18n";
import BlogClient from "./BlogClient";
import { getSanityBlogPosts } from "@/lib/sanity/blog";

type BlogPost = {
  id: string;
  lang: "en" | "nl";
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug?: string;
};

type BlogPostView = BlogPost & {
  formattedDate: string;
};

type BlogPageProps = {
  params: Promise<{ lang: Lang }>;
};

const MOCK_POSTS: BlogPost[] = [
  {
    id: "en-01",
    lang: "en",
    title: "Naming a SaaS that sounds instantly trustworthy",
    excerpt:
      "A practical checklist for short, clear names that still feel premium and memorable.",
    date: "2024-08-14",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "en-02",
    lang: "en",
    title: "Picking the right TLD for your audience",
    excerpt:
      "How to balance global trust with local relevance when you choose a domain.",
    date: "2024-08-02",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "en-03",
    lang: "en",
    title: "Short domains that convert better",
    excerpt:
      "Why short domains feel confident and how to find one without losing your brand.",
    date: "2024-07-21",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "en-04",
    lang: "en",
    title: "AI prompts for brandable names",
    excerpt:
      "Prompt patterns that steer AI away from generic results and toward real options.",
    date: "2024-07-05",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nl-01",
    lang: "nl",
    title: "Een SaaS-naam die meteen vertrouwen geeft",
    excerpt:
      "Een korte checklist voor namen die duidelijk zijn, maar toch premium aanvoelen.",
    date: "2024-08-12",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nl-02",
    lang: "nl",
    title: "De juiste domeinextensie kiezen",
    excerpt:
      "Zo weeg je internationaal vertrouwen af tegen lokale relevantie voor je merk.",
    date: "2024-08-01",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nl-03",
    lang: "nl",
    title: "Waarom korte domeinen beter werken",
    excerpt:
      "Korte domeinen voelen krachtig en zijn makkelijker te onthouden. Dit is waarom.",
    date: "2024-07-19",
    image:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nl-04",
    lang: "nl",
    title: "AI-prompts voor merkwaardige namen",
    excerpt:
      "Prompt-structuren die AI naar bruikbare, unieke naamopties sturen.",
    date: "2024-07-03",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
];

function formatDate(date: string, lang: "en" | "nl") {
  const locale = lang === "nl" ? "nl-NL" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (lang === "nl") {
    return {
      title: "Domifai Blog",
      description:
        "Korte en praktische inzichten over merknamen, domeinen en branding.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Domifai Blog",
    description:
      "Short and practical insights on naming, domains, and brand building.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const resolvedLang: "en" | "nl" = lang === "nl" ? "nl" : "en";

  let posts: BlogPostView[] = [];
  try {
    const sanityPosts = await getSanityBlogPosts(resolvedLang);
    posts = sanityPosts.map((post) => ({
      id: post.id,
      lang: resolvedLang,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      image:
        post.image ||
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      slug: post.slug,
      formattedDate: formatDate(post.date, resolvedLang),
    }));
  } catch (error) {
    console.error("[blog] failed to load posts from Sanity", error);
  }

  if (posts.length === 0) {
    posts = MOCK_POSTS.filter((post) => post.lang === resolvedLang).map((post) => ({
      ...post,
      formattedDate: formatDate(post.date, resolvedLang),
    }));
  }

  const copy =
    resolvedLang === "nl"
      ? {
          title: "Blog",
          intro:
            "Korte en praktische artikelen over merknamen, domeinen en branding.",
          cta: "Lees meer",
        }
      : {
          title: "Blog",
          intro:
            "Short, practical reads on naming, domains, and building a memorable brand.",
          cta: "Read more",
        };

  return (
    <BlogClient copy={copy} lang={resolvedLang} posts={posts} />
  );
}
