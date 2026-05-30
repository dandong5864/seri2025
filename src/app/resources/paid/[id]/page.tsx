import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PaidPrompt } from "@/components/site/paid-prompt";
import { buttonVariants } from "@/components/ui/button";
import { getPaidPrompt, getPaidPrompts } from "@/lib/paid-prompts";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getPaidPrompts().map((prompt) => ({ id: prompt.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const prompt = getPaidPrompt(id);

  if (!prompt) {
    return { title: "유료 코드" };
  }

  return {
    title: prompt.title,
    description: prompt.description,
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      images: prompt.cover ? [prompt.cover] : undefined
    }
  };
}

export default async function PaidPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = getPaidPrompt(id);

  if (!prompt) notFound();

  return (
    <main className="container-narrow py-10">
      <Link href="/resources" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mb-6")}>
        <ChevronLeft className="h-4 w-4" />
        자료실로 돌아가기
      </Link>

      <header className="grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <Image src={prompt.cover || "/blog/jpeg-1780059860142-1780065073500.webp"} alt="" fill className="object-cover" priority />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">Paid Prompt</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{prompt.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{prompt.description}</p>
          <p className="mt-5 text-2xl font-extrabold text-primary">{prompt.price}</p>
        </div>
      </header>

      <PaidPrompt id={prompt.id} />

      <section className="mx-auto mt-10 max-w-[800px] rounded-lg border bg-card p-5">
        <h2 className="text-xl font-bold">이 페이지는 이렇게 사용해요</h2>
        <p className="mt-3 leading-8 text-muted-foreground">
          방문자는 프롬프트 일부만 흐리게 확인하고, 구매 버튼을 눌러 신청하거나 결제 페이지로 이동합니다.
          전체 유료 프롬프트 원문은 결제 확인 후 따로 전달하는 방식이 안전합니다.
        </p>
      </section>
    </main>
  );
}
