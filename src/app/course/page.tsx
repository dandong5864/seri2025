import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "강의",
  description: "AI 영상 제작과 유튜브 쇼츠 수익화 실전 강의"
};

const curriculum = ["AI 영상 기획과 레퍼런스 설계", "브루와 생성형 AI를 활용한 제작 루틴", "쇼츠 후킹 대본과 업로드 시스템", "강의와 디지털 상품 판매 퍼널"];

export default function CoursePage() {
  return (
    <section className="container-narrow py-10">
      <SectionHeading title="AI 영상 크리에이터 실전 강의" description="아이디어를 영상으로 만들고, 채널과 상품으로 연결하는 전체 흐름을 배웁니다." />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {curriculum.map((item) => (
            <Card key={item}><CardContent className="flex items-center gap-3 p-5"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="font-bold">{item}</span></CardContent></Card>
          ))}
          <Card>
            <CardContent className="p-5">
              <div className="flex gap-1 text-amber-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-4 text-muted-foreground">“막연했던 AI 영상 제작을 업로드 가능한 시스템으로 정리할 수 있었습니다.”</p>
            </CardContent>
          </Card>
        </div>
        <aside className="rounded-lg border bg-card p-5">
          <p className="text-sm font-bold text-primary">온라인 클래스</p>
          <h2 className="mt-2 text-2xl font-bold">₩299,000</h2>
          <p className="mt-3 text-sm text-muted-foreground">녹화 강의, 템플릿, 프롬프트, 실습 과제가 포함됩니다.</p>
          <Link href="/contact?type=course" className={cn(buttonVariants({ variant: "default" }), "mt-6 w-full")}>신청 문의</Link>
        </aside>
      </div>
    </section>
  );
}
