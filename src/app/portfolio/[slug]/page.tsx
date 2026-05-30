import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPortfolioItem, portfolioItems } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  return {
    title: item?.title ?? "포트폴리오",
    description: item?.description
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) notFound();

  return (
    <article className="container-narrow py-10">
      <Link href="/portfolio" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6")}>
        <ArrowLeft className="h-4 w-4" /> 목록
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Badge>{item.category}</Badge>
          <h1 className="mt-4 text-4xl font-bold">{item.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{item.description}</p>
          <div className="relative mt-8 aspect-video overflow-hidden rounded-lg border">
            <Image src={item.image} alt="" fill className="object-cover" priority />
          </div>
        </div>
        <aside className="rounded-lg border p-5">
          <h2 className="font-bold">프로젝트 요약</h2>
          <p className="mt-3 text-sm text-muted-foreground">{item.metrics}</p>
          <h3 className="mt-6 font-bold">사용 도구</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)}
          </div>
        </aside>
      </div>
    </article>
  );
}
