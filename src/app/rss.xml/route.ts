import { getAllPosts } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/utils";

export const revalidate = 300;

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${post.description}]]></description>
          <link>${absoluteUrl(`/blog/${post.slug}`)}</link>
          <guid>${absoluteUrl(`/blog/${post.slug}`)}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${siteConfig.name}</title>
        <description>${siteConfig.description}</description>
        <link>${siteConfig.url}</link>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
