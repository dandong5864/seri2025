import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { portfolioCategories, portfolioItems } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "AI 영상 작품, 쇼츠 사례, 프로젝트 사례 포트폴리오"
};

export default async function PortfolioPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category ?? "전체";
  const items = category === "전체" ? portfolioItems : portfolioItems.filter((item) => item.category === category);

  return (
    <section className="container-narrow py-10">
      <SectionHeading title="포트폴리오" description="AI 영상 제작 워크플로우와 쇼츠 운영 사례를 프로젝트별로 정리했습니다." />
      <div className="mb-6 flex flex-wrap gap-2">
        {portfolioCategories.map((item) => (
          <Link key={item} href={item === "전체" ? "/portfolio" : `/portfolio?category=${encodeURIComponent(item)}`}>
            <Badge className={item === category ? "bg-primary text-primary-foreground" : undefined}>{item}</Badge>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link key={item.slug} href={`/portfolio/${item.slug}`} className="group overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image src={item.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <Badge>{item.category}</Badge>
              <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
