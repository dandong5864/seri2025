import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";
import { portfolioItems } from "@/lib/portfolio";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 300;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/blog", "/portfolio", "/course", "/resources", "/contact", "/privacy"].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date()
  }));
  const postRoutes = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updated ?? post.date)
  }));
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: absoluteUrl(`/portfolio/${item.slug}`),
    lastModified: new Date()
  }));

  return [...staticRoutes, ...postRoutes, ...portfolioRoutes];
}
