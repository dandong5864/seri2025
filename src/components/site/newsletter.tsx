import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="rounded-lg border bg-card p-5 sm:p-8">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="mt-3 text-2xl font-bold">AI 영상 제작 노트를 받아보세요</h2>
          <p className="mt-2 text-sm text-muted-foreground">새 글, 무료 자료, 강의 오픈 소식을 이메일로 전합니다.</p>
        </div>
        <form className="flex w-full gap-2 md:w-96">
          <Input type="email" placeholder="email@example.com" aria-label="이메일" />
          <Button type="submit">구독</Button>
        </form>
      </div>
    </section>
  );
}
