"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Plus, Save, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PaidPrompt } from "@/lib/paid-prompts";

const emptyPrompt: PaidPrompt = {
  id: "new-paid-prompt",
  title: "",
  description: "",
  price: "",
  cover: "/blog/jpeg-1780059860142-1780065073500.webp",
  ctaLabel: "구매하러 가기",
  href: "/contact",
  previewLines: ["프롬프트 일부 미리보기", "구매 후 전체 내용을 제공합니다."],
  updatedAt: ""
};

export default function PaidPromptsAdminPage() {
  const [prompts, setPrompts] = useState<PaidPrompt[]>([]);
  const [message, setMessage] = useState("");

  async function loadPrompts() {
    const response = await fetch("/api/admin/paid-prompts");
    const data = await response.json();
    setPrompts(data.prompts ?? []);
  }

  async function savePrompts() {
    setMessage("저장 중입니다...");
    const response = await fetch("/api/admin/paid-prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompts })
    });
    const data = await response.json();
    setMessage(data.ok ? "유료 프롬프트를 저장했습니다." : data.message);
    if (data.ok) setPrompts(data.prompts);
  }

  function updatePrompt(index: number, nextPrompt: PaidPrompt) {
    setPrompts((current) => current.map((prompt, promptIndex) => (promptIndex === index ? nextPrompt : prompt)));
  }

  function copyMdx(id: string) {
    navigator.clipboard.writeText(`<PaidPrompt id="${id}" />`);
    setMessage("블로그 본문에 붙여넣을 코드를 복사했습니다.");
  }

  useEffect(() => {
    loadPrompts();
  }, []);

  return (
    <main className="container-narrow py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Paid Prompt Manager</p>
          <h1 className="mt-1 text-3xl font-bold">유료 프롬프트 관리</h1>
          <p className="mt-2 text-sm text-muted-foreground">여기에서 만든 id를 블로그 본문에 넣으면 잠긴 프롬프트 카드가 표시됩니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
            글쓰기
          </Link>
          <Button
            variant="outline"
            onClick={() => setPrompts((current) => [...current, { ...emptyPrompt, id: `paid-prompt-${current.length + 1}` }])}
          >
            <Plus className="h-4 w-4" /> 추가
          </Button>
          <Button onClick={savePrompts}>
            <Save className="h-4 w-4" /> 저장
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {prompts.map((prompt, index) => (
          <Card key={`${prompt.id}-${index}`}>
            <CardContent className="space-y-4 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">id</span>
                  <Input value={prompt.id} onChange={(event) => updatePrompt(index, { ...prompt, id: event.target.value })} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">가격</span>
                  <Input value={prompt.price} placeholder="9,900원" onChange={(event) => updatePrompt(index, { ...prompt, price: event.target.value })} />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold">제목</span>
                <Input value={prompt.title} onChange={(event) => updatePrompt(index, { ...prompt, title: event.target.value })} />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold">설명</span>
                <Input value={prompt.description} onChange={(event) => updatePrompt(index, { ...prompt, description: event.target.value })} />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold">자료실 대표 이미지</span>
                <Input value={prompt.cover ?? ""} placeholder="/blog/example.png" onChange={(event) => updatePrompt(index, { ...prompt, cover: event.target.value })} />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">버튼 글씨</span>
                  <Input value={prompt.ctaLabel} onChange={(event) => updatePrompt(index, { ...prompt, ctaLabel: event.target.value })} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">구매 링크</span>
                  <Input value={prompt.href} onChange={(event) => updatePrompt(index, { ...prompt, href: event.target.value })} />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold">흐리게 보여줄 미리보기 문장</span>
                <Textarea
                  className="min-h-32 font-mono text-sm"
                  value={prompt.previewLines.join("\n")}
                  onChange={(event) =>
                    updatePrompt(index, {
                      ...prompt,
                      previewLines: event.target.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
                    })
                  }
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => copyMdx(prompt.id)}>
                  <Copy className="h-4 w-4" /> 블로그 삽입 코드 복사
                </Button>
                <Button type="button" variant="outline" onClick={() => setPrompts((current) => current.filter((_, promptIndex) => promptIndex !== index))}>
                  <Trash2 className="h-4 w-4" /> 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {message ? <p className="mt-6 rounded-md bg-muted p-3 text-sm text-muted-foreground">{message}</p> : null}
    </main>
  );
}
