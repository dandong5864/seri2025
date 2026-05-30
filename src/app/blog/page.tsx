import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/site/post-card";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllPosts, getCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "블로그",
  description: "AI 영상 제작, 유튜브 쇼츠, 브루 활용법, 수익화 전략 블로그"
};

export const revalidate = 300;

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; tag?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.toLowerCase() ?? "";
  const category = resolvedSearchParams?.category ?? "";
  const tag = resolvedSearchParams?.tag ?? "";
  const posts = getAllPosts().filter((post) => {
    const matchQuery = q ? `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(q) : true;
    const matchCategory = category ? post.category === category : true;
    const matchTag = tag ? post.tags.includes(tag) : true;
    return matchQuery && matchCategory && matchTag;
  });

  return (
    <div className="container-narrow py-10">
      <section>
        <SectionHeading title="블로그" description="AI 영상 제작부터 콘텐츠 마케팅, 수익화 전략까지 실전에 바로 쓰는 글을 모았습니다." />
        <form className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="검색어를 입력하세요" className="pl-10" />
        </form>
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/blog"><Badge>전체</Badge></Link>
          {getCategories().map((item) => (
            <Link key={item} href={`/blog?category=${encodeURIComponent(item)}`}>
              <Badge className={item === category ? "bg-primary text-primary-foreground" : undefined}>{item}</Badge>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 min-[660px]:grid-cols-3">
          {posts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      </section>
    </div>
  );
}
