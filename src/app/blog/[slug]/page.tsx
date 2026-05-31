import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { AdUnit } from "@/components/ads/ad-unit";
import { Badge } from "@/components/ui/badge";
import { mdxComponents } from "@/components/site/mdx-components";
import { PostCard } from "@/components/site/post-card";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { TableOfContents } from "@/components/site/table-of-contents";
import { getAllPosts, getPostBySlug, getPostSlugs, getRelatedPosts, isPostPublished } from "@/lib/content";
import { getTableOfContents } from "@/lib/toc";
import { absoluteUrl, siteConfig } from "@/lib/utils";

export const revalidate = 300;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!isPostPublished(post)) {
    return {
      title: "비공개 글"
    };
  }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      images: [post.cover],
      publishedTime: post.date,
      modifiedTime: post.updated
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.cover]
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!isPostPublished(post)) notFound();
  const related = getRelatedPosts(post);
  const toc = getTableOfContents(post.content);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`)
  };

  return (
    <article className="container-narrow py-10">
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/">홈</Link> / <Link href="/blog">블로그</Link> / {post.title}
      </nav>
      <header>
        <Badge>{post.category}</Badge>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.25] tracking-normal sm:text-5xl sm:leading-[1.22]">{post.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{post.description}</p>
        <p className="mt-4 text-sm text-muted-foreground">{post.category}</p>
      </header>
      <div className="mt-8 overflow-hidden rounded-lg border bg-muted">
        <Image src={post.cover} alt="" width={1400} height={1400} className="h-auto w-full object-contain" priority />
      </div>
      <AdUnit slot="3333333333" />
      <TableOfContents items={toc} />
      <div className="prose-brand mt-8">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
      <AdUnit slot="4444444444" />
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">관련글 추천</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(related.length ? related : getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 3)).map((item) => (
            <PostCard key={item.slug} post={item} />
          ))}
        </div>
      </section>
      <AdUnit slot="5555555555" />
    </article>
  );
}
