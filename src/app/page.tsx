import Image from "next/image";
import Link from "next/link";
import { AdUnit } from "@/components/ads/ad-unit";
import { Newsletter } from "@/components/site/newsletter";
import { PostCard } from "@/components/site/post-card";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllPosts } from "@/lib/content";
import { portfolioItems } from "@/lib/portfolio";

export const revalidate = 300;

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="motion-soft">
      <section className="border-b bg-[radial-gradient(circle_at_18%_20%,hsl(var(--accent)/0.32),transparent_34%),radial-gradient(circle_at_78%_8%,hsl(var(--secondary)/0.38),transparent_30%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--background)))]">
        <div className="container-narrow py-10 sm:py-16">
        <div>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border bg-muted shadow-soft ring-4 ring-background">
              <Image src="/logo.png" alt="쎄리는 로딩중 로고" fill className="object-cover" priority />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Seri is Loading</p>
              <h1 className="mt-1 text-4xl font-bold tracking-normal sm:text-6xl">쎄리는 로딩중</h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            AI 영상 제작, 유튜브 쇼츠, 브루 활용법, 콘텐츠 수익화를 실험하고 기록하는 크리에이터 브랜드입니다.
          </p>
        </div>
        </div>
      </section>

      <section className="container-narrow py-8">
        <SectionHeading eyebrow="Latest" title="최신 블로그 글" description="MDX 파일을 추가하면 이 목록과 RSS, 사이트맵이 함께 갱신됩니다." />
        <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 min-[660px]:grid-cols-3">
          {posts.slice(0, 9).map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      </section>

      <div className="container-narrow"><AdUnit slot="1234567890" /></div>

      <section className="container-narrow py-8">
        <SectionHeading eyebrow="YouTube" title="대표 영상" description="AI 영상 제작 워크플로우와 쇼츠 운영 노하우를 영상으로 확인하세요." />
        <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
          <iframe className="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="쎄리는 로딩중 대표 영상" allowFullScreen />
        </div>
      </section>

      <section className="container-narrow py-8">
        <SectionHeading eyebrow="Portfolio" title="포트폴리오" />
        <div className="grid gap-4 md:grid-cols-3">
          {portfolioItems.map((item) => (
            <Link key={item.slug} href={`/portfolio/${item.slug}`} className="group block overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image src={item.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-primary">{item.category}</p>
                <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-narrow py-10"><Newsletter /></section>
    </div>
  );
}
