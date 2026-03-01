import type { Lang } from "@/config/i18n";

export type SanityBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
  body?: any;
};

const SANITY_API_VERSION = "2024-10-01";

function getSanityConfig() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  return { projectId, dataset };
}

function toParamValue(value: string) {
  return JSON.stringify(value);
}

export async function getSanityBlogPosts(lang: Lang): Promise<SanityBlogPost[]> {
  const config = getSanityConfig();
  if (!config) return [];

  const query = `*[
    _type == "post" &&
    (
      language == $lang ||
      __i18n_lang == $lang
    )
  ] | order(coalesce(publishedAt, _createdAt) desc) {
    "id": coalesce(_id, slug.current),
    "title": coalesce(title, ""),
    "excerpt": coalesce(excerpt, seo.description, ""),
    "date": coalesce(string(publishedAt), string(_createdAt)),
    "image": coalesce(coverImage.asset->url, mainImage.asset->url, image.asset->url, imageUrl, ""),
    "slug": coalesce(slug.current, ""),
    "body": coalesce(body, [])
  }`;

  const searchParams = new URLSearchParams({
    query,
    $lang: toParamValue(lang),
  });
  const url = `https://${config.projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${config.dataset}?${searchParams.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    result?: Array<Partial<SanityBlogPost>>;
  };

  const posts = Array.isArray(payload.result) ? payload.result : [];

  return posts
    .map((post) => ({
      id: post.id ?? "",
      title: post.title ?? "",
      excerpt: post.excerpt ?? "",
      date: post.date ?? "",
      image: post.image ?? "",
      slug: post.slug ?? "",
      body: post.body ?? [],
    }))
    .filter((post) => post.id && post.title && post.date);
}

export async function getSanityBlogPostBySlug(
  lang: Lang,
  slug: string
): Promise<SanityBlogPost | null> {
  const config = getSanityConfig();
  if (!config) return null;

  const query = `*[
    _type == "post" &&
    (
      language == $lang ||
      __i18n_lang == $lang
    ) &&
    slug.current == $slug
  ][0]{
    "id": coalesce(_id, slug.current),
    "title": coalesce(title, ""),
    "excerpt": coalesce(excerpt, seo.description, ""),
    "date": coalesce(string(publishedAt), string(_createdAt)),
    "image": coalesce(coverImage.asset->url, mainImage.asset->url, image.asset->url, imageUrl, ""),
    "slug": coalesce(slug.current, ""),
    "body": coalesce(body, [])
  }`;

  const searchParams = new URLSearchParams({
    query,
    $lang: toParamValue(lang),
    $slug: toParamValue(slug),
  });
  const url = `https://${config.projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${config.dataset}?${searchParams.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    result?: Partial<SanityBlogPost> | null;
  };
  const post = payload.result;
  if (!post) return null;

  const mapped: SanityBlogPost = {
    id: post.id ?? "",
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    date: post.date ?? "",
    image: post.image ?? "",
    slug: post.slug ?? "",
    body: post.body ?? [],
  };

  if (!mapped.id || !mapped.title || !mapped.date) {
    return null;
  }

  return mapped;
}
