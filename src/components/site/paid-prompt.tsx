"use client";

import Link from "next/link";
import { ExternalLink, LockKeyhole, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getPaidPrompt } from "@/lib/paid-prompts";
import { cn } from "@/lib/utils";

type PaidPromptProps = {
  id?: string;
  title?: string;
  description?: string;
  price?: string;
  ctaLabel?: string;
  href?: string;
  previewLines?: string[];
};

export function PaidPrompt({ id, title, description, price, ctaLabel, href, previewLines }: PaidPromptProps) {
  const savedPrompt = id ? getPaidPrompt(id) : undefined;
  const prompt = {
    title: title ?? savedPrompt?.title ?? "유료 프롬프트",
    description: description ?? savedPrompt?.description ?? "구매 후 전체 프롬프트를 확인할 수 있습니다.",
    price: price ?? savedPrompt?.price ?? "가격 준비중",
    ctaLabel: ctaLabel ?? savedPrompt?.ctaLabel ?? "구매 문의하기",
    href: href ?? savedPrompt?.href ?? "/contact",
    previewLines: previewLines ?? savedPrompt?.previewLines ?? [
      "프롬프트 일부 미리보기",
      "이 영역은 잠겨 있습니다.",
      "구매 후 전체 내용을 제공합니다."
    ]
  };

  return (
    <section className="my-10 mx-auto max-w-[800px] overflow-hidden rounded-[14px] border border-[#ead7df] bg-white shadow-[0_12px_35px_rgba(232,75,129,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#ff4fa3,#7c5cff)] px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-5 w-5" />
          <span className="text-sm font-bold">유료 프롬프트</span>
        </div>
        <span className="rounded-full bg-white/18 px-3 py-1 text-sm font-bold">{prompt.price}</span>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <h3 className="text-2xl font-extrabold leading-snug text-[#201827]">{prompt.title}</h3>
          <p className="mt-2 text-base leading-7 text-[#665f72]">{prompt.description}</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border bg-[#1e1e1e] p-5 text-[#dcdcdc]">
          <div className="select-none space-y-3 blur-[3px]">
            {prompt.previewLines.map((line, index) => (
              <p key={`${line}-${index}`} className={cn("m-0 font-mono text-sm leading-7", index === 0 && "font-bold text-white")}>
                {line}
              </p>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]/35">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#201827] shadow-lg">
              <Sparkles className="h-4 w-4 text-[#ff4fa3]" />
              구매 후 전체 공개
            </div>
          </div>
        </div>
        <Link
          href={prompt.href}
          target={prompt.href.startsWith("http") ? "_blank" : undefined}
          className={cn(
            buttonVariants(),
            "h-14 w-full rounded-[14px] bg-[linear-gradient(135deg,#ff4fa3,#7c5cff)] text-lg font-extrabold text-white shadow-[0_12px_24px_rgba(124,92,255,0.24)] hover:text-white"
          )}
        >
          {prompt.ctaLabel}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
