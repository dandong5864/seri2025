import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt?: string;
  updated?: string;
  category: string;
  tags: string[];
  cover: string;
  author: string;
  draft?: boolean;
  popular?: boolean;
  featured?: boolean;
  content: string;
  readingTime: string;
};

type PostQueryOptions = {
  includeDrafts?: boolean;
  includeFuture?: boolean;
};

export type FreeCodeResource = {
  id: string;
  order: number;
  title: string;
  postTitle: string;
  postSlug: string;
  category: string;
  tags: string[];
  date: string;
  cover: string;
  code: string;
  href: string;
};

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    publishAt: data.publishAt,
    updated: data.updated,
    category: data.category,
    tags: data.tags ?? [],
    cover: data.cover ?? "/og-image.png",
    author: data.author ?? "쎄리",
    draft: Boolean(data.draft),
    popular: Boolean(data.popular),
    featured: Boolean(data.featured),
    content,
    readingTime: readingTime(content).text
  };
}

export function isPostPublished(post: Post, now = new Date()) {
  if (post.draft) return false;
  if (!post.publishAt) return true;

  const publishDate = new Date(post.publishAt);
  return Number(publishDate) <= Number(now);
}

export function getAllPosts(options: PostQueryOptions = {}) {
  return getPostSlugs()
    .map(getPostBySlug)
    .filter((post) => {
      if (!options.includeDrafts && post.draft) return false;
      if (!options.includeFuture && !isPostPublished(post)) return false;
      return true;
    })
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
}

export function getPopularPosts(limit = 6) {
  return getAllPosts()
    .filter((post) => post.popular)
    .slice(0, limit);
}

export function getRelatedPosts(post: Post, limit = 3) {
  return getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      post: item,
      score:
        (item.category === post.category ? 3 : 0) +
        item.tags.filter((tag) => post.tags.includes(tag)).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export function getCategories() {
  return Array.from(new Set(getAllPosts().map((post) => post.category))).sort();
}

export function getTags() {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags))).sort();
}

function getNearestHeading(content: string, index: number) {
  const beforeCode = content.slice(0, index);
  const headings = Array.from(beforeCode.matchAll(/^##\s+(.+)$/gm));
  return headings.at(-1)?.[1]?.trim();
}

export function getFreeCodeResources(): FreeCodeResource[] {
  return getAllPosts().flatMap((post) => {
    const codeBlocks = Array.from(post.content.matchAll(/^```(?:text|prompt)\r?\n([\s\S]*?)\r?\n```/gm));
    let previousCodeEnd = 0;

    return codeBlocks.map((match, index) => {
      const title = getNearestHeading(post.content, match.index ?? 0) ?? `${post.title} 무료 코드 ${index + 1}`;
      const markerArea = post.content.slice(previousCodeEnd, match.index ?? 0);
      const imageMarker = Array.from(markerArea.matchAll(/freeCodeImage:\s*([^*\n\r<]+?)(?:\s*\*\/\}|\s*-->|\s*$)/g)).at(-1)?.[1]?.trim();
      const orderMarker = Array.from(markerArea.matchAll(/freeCodeOrder:\s*(\d+)/g)).at(-1)?.[1];
      previousCodeEnd = (match.index ?? 0) + match[0].length;

      return {
        id: `${post.slug}-${index + 1}`,
        order: orderMarker ? Number(orderMarker) : 9999,
        title,
        postTitle: post.title,
        postSlug: post.slug,
        category: post.category,
        tags: post.tags,
        date: post.date,
        cover: imageMarker || post.cover,
        code: match[1].trim(),
        href: `/blog/${post.slug}`
      };
    });
  }).sort((a, b) => a.order - b.order || Number(new Date(b.date)) - Number(new Date(a.date)) || a.id.localeCompare(b.id));
}
