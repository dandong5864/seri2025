"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXPreview } from "@/components/site/mdx-preview";
import { TableOfContents } from "@/components/site/table-of-contents";
import { getTableOfContents } from "@/lib/toc";

type PreviewPost = {
  title: string;
  description: string;
  category: string;
  cover: string;
  content: string;
};

export default function AdminPreviewPage() {
  const [post, setPost] = useState<PreviewPost | null>(null);
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null);
  const toc = post ? getTableOfContents(post.content) : [];

  useEffect(() => {
    const raw = window.localStorage.getItem("seri-post-preview");
    if (!raw) return;

    const parsed = JSON.parse(raw) as PreviewPost;
    setPost(parsed);

    fetch("/api/admin/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: parsed.content })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) setSource(data.source);
      });
  }, []);

  if (!post) {
    return (
      <main className="container-narrow py-10">
        <h1 className="text-2xl font-bold">미리볼 글이 없습니다</h1>
        <p className="mt-3 text-muted-foreground">글쓰기 화면에서 새 페이지 미리보기를 눌러주세요.</p>
      </main>
    );
  }

  return (
    <article className="container-narrow py-10">
      <header>
        <p className="text-sm font-semibold text-primary">미리보기</p>
        <p className="mt-4 text-sm text-muted-foreground">{post.category}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.25] tracking-normal sm:text-5xl sm:leading-[1.22]">
          {post.title || "글 제목"}
        </h1>
        {post.description ? <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{post.description}</p> : null}
      </header>

      {post.cover ? (
        <div className="mt-8 overflow-hidden rounded-lg border bg-muted">
          <Image src={post.cover} alt="" width={1400} height={1400} className="h-auto w-full object-contain" priority />
        </div>
      ) : null}

      <div className="prose-brand mt-8">
        <TableOfContents items={toc} />
        {source ? <MDXPreview source={source} /> : <p className="text-muted-foreground">미리보기를 불러오는 중입니다.</p>}
      </div>
    </article>
  );
}
