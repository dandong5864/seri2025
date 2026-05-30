import type { Metadata } from "next";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/site/section-heading";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "문의하기",
  description: "강의, 협업, 광고, 프로젝트 문의"
};

export default function ContactPage() {
  return (
    <section className="container-narrow py-10">
      <SectionHeading title="문의하기" description="강의 신청, AI 영상 제작 협업, 브랜드 프로젝트 제안을 남겨주세요." />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form action="/api/contact" method="post" className="space-y-4 rounded-lg border p-5">
          <Input name="name" placeholder="이름" required />
          <Input name="email" type="email" placeholder="이메일" required />
          <Input name="subject" placeholder="문의 제목" required />
          <Textarea name="message" placeholder="문의 내용을 입력하세요" required />
          <Button type="submit"><Send className="h-4 w-4" /> 보내기</Button>
        </form>
        <aside className="rounded-lg border bg-card p-5">
          <h2 className="font-bold">이메일</h2>
          <a className="mt-2 block text-sm text-primary" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">실제 이메일 발송은 Vercel 환경 변수에 맞춰 Resend, SendGrid, Gmail SMTP 등을 연결하면 됩니다.</p>
        </aside>
      </div>
    </section>
  );
}
