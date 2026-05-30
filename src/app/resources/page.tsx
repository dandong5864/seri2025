import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyCode } from "@/components/site/copy-code";
import { SectionHeading } from "@/components/site/section-heading";
import { getFreeCodeResources } from "@/lib/content";
import { getPaidPrompts } from "@/lib/paid-prompts";
import { resources } from "@/lib/resources";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "자료실",
  description: "AI 영상 제작 프롬프트, 무료 코드, 유료 코드, 템플릿 자료실"
};

export default function ResourcesPage() {
  const freeCodes = getFreeCodeResources();
  const paidPrompts = getPaidPrompts();

  return (
    <div className="container-narrow py-10">
      <SectionHeading title="자료실" description="무료 코드와 유료 프롬프트, 다운로드 자료를 한곳에 모았습니다." />

      <section>
        <h2 className="mb-4 text-2xl font-bold">다운로드 자료</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {resources.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-2 sm:p-5">
                <Badge>{item.type}</Badge>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold sm:mt-3 sm:text-xl">{item.title}</h3>
                <p className="mt-2 hidden text-sm text-muted-foreground sm:block">{item.description}</p>
                <a href={item.href} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3 w-full px-2 text-xs sm:mt-5 sm:h-11 sm:text-sm")}>
                  <Download className="h-4 w-4" /> 다운로드
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">유료 코드</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          프리미엄 프롬프트는 잠긴 상태로 미리보기만 제공되고, 상세 페이지에서 구매 버튼을 확인할 수 있습니다.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-5">
          {paidPrompts.map((item) => (
            <Link key={item.id} href={`/resources/paid/${item.id}`} className="group overflow-hidden rounded-lg border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative aspect-square bg-muted">
                <Image src={item.cover || "/blog/jpeg-1780059860142-1780065073500.webp"} alt="" fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-95">
                  <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#201827] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                    <LockKeyhole className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                    잠긴 유료 코드
                  </div>
                </div>
              </div>
              <div className="p-2 sm:p-5">
                <Badge>유료 코드</Badge>
                <h3 className="mt-2 line-clamp-2 text-sm font-extrabold sm:mt-3 sm:text-xl">{item.title}</h3>
                <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-muted-foreground sm:block">{item.description}</p>
                <p className="mt-2 text-sm font-extrabold text-primary sm:mt-4 sm:text-lg">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">블로그 무료 코드</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          블로그 글에 <code>```text</code>로 작성한 무료 프롬프트가 자동으로 추가됩니다.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-5">
          {freeCodes.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-square bg-muted">
                <Image src={item.cover} alt="" fill className="object-cover" sizes="33vw" />
              </div>
              <CopyCode flush>{item.code}</CopyCode>
              <div className="mx-5 mb-5 mt-4 border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  출처: <Link href={item.href} className="font-semibold text-primary">{item.postTitle}</Link>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
