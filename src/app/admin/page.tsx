"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Save, Plus, RefreshCw, Rocket, ImagePlus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt?: string;
  category: string;
  tags: string[];
  cover: string;
  draft: boolean;
  popular: boolean;
};

type EditablePost = PostSummary & {
  content: string;
};

const emptyPost: EditablePost = {
  slug: "",
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  publishAt: "",
  category: "AI 도구 리뷰",
  tags: [],
  cover: "/blog/밥먹어.png",
  draft: true,
  popular: false,
  content: `본문을 여기에 작성하세요.\n\n## 소제목\n\n내용을 작성하세요.\n\n\`\`\`text\n무료 프롬프트를 여기에 작성하면 자료실에도 자동으로 올라갑니다.\n\`\`\``
};

const bodyTemplates = [
  {
    label: "굵게",
    value: "**강조할 글자**"
  },
  {
    label: "핑크 강조",
    value: '<span style={{ color: "#ff4fa3", fontWeight: 700 }}>강조할 글자</span>'
  },
  {
    label: "밑줄",
    value: "<u>밑줄 글자</u>"
  },
  {
    label: "강조 박스",
    value: "\n\n> 중요한 내용을 여기에 작성하세요.\n"
  },
  {
    label: "소제목",
    value: "\n\n## 소제목\n\n내용을 작성하세요.\n"
  },
  {
    label: "무료 코드",
    value: "\n\n{/* freeCodeImage: /blog/이미지파일.png */}\n{/* freeCodeOrder: 1 */}\n```text\n무료 프롬프트를 여기에 작성하세요.\n```\n"
  },
  {
    label: "ChatGPT 버튼",
    value: "\n\n<ChatGPTButton />\n"
  },
  {
    label: "Flow 버튼",
    value: "\n\n<FlowButton />\n"
  },
  {
    label: "유료 프롬프트",
    value: "\n\n<PaidPrompt id=\"character-model-sheet\" />\n"
  },
  {
    label: "이미지",
    value: "\n\n![이미지 설명](/blog/이미지파일.png)\n"
  }
];

export default function AdminPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [post, setPost] = useState<EditablePost>(emptyPost);
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const previewHref = useMemo(() => (post.slug ? `/blog/${post.slug}` : "/blog"), [post.slug]);
  const freeCodeBlocks = useMemo(() => getFreeCodeBlocks(post.content), [post.content]);

  function createSlug(title: string, date: string) {
    const englishPart = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const datePart = (date || new Date().toISOString().slice(0, 10)).replaceAll("-", "");
    return englishPart || `post-${datePart}`;
  }

  function getFreeCodeBlocks(content: string) {
    const matches = Array.from(content.matchAll(/^```(?:text|prompt)\r?\n([\s\S]*?)\r?\n```/gm));

    return matches.map((match, index) => {
      const markerArea = content.slice(0, match.index ?? 0);
      const previousCode = Array.from(markerArea.matchAll(/^```(?:text|prompt)\r?\n[\s\S]*?\r?\n```/gm)).at(-1);
      const searchStart = previousCode && previousCode.index !== undefined ? previousCode.index + previousCode[0].length : 0;
      const area = content.slice(searchStart, match.index ?? 0);
      const marker = Array.from(area.matchAll(/freeCodeImage:\s*([^*\n\r<]+?)(?:\s*\*\/\}|\s*-->|\s*$)/g)).at(-1);
      const orderMarker = Array.from(area.matchAll(/freeCodeOrder:\s*(\d+)/g)).at(-1);

      return {
        index,
        codeStart: match.index ?? 0,
        markerStart: marker?.index !== undefined ? searchStart + marker.index : null,
        markerEnd: marker?.index !== undefined ? searchStart + marker.index + marker[0].length : null,
        orderMarkerStart: orderMarker?.index !== undefined ? searchStart + orderMarker.index : null,
        orderMarkerEnd: orderMarker?.index !== undefined ? searchStart + orderMarker.index + orderMarker[0].length : null,
        image: marker?.[1]?.trim() ?? "",
        order: orderMarker?.[1] ?? "",
        preview: match[1].trim().split(/\r?\n/).slice(0, 2).join(" / ")
      };
    });
  }

  function setFreeCodeImage(blockIndex: number, imagePath: string) {
    const block = freeCodeBlocks[blockIndex];
    if (!block) return;

    const marker = `{/* freeCodeImage: ${imagePath} */}`;
    let nextContent = post.content;

    if (block.markerStart !== null && block.markerEnd !== null) {
      nextContent = `${nextContent.slice(0, block.markerStart)}${marker}${nextContent.slice(block.markerEnd)}`;
    } else {
      nextContent = `${nextContent.slice(0, block.codeStart)}${marker}\n${nextContent.slice(block.codeStart)}`;
    }

    setPost({ ...post, content: nextContent });
  }

  function setFreeCodeOrder(blockIndex: number, order: string) {
    const block = freeCodeBlocks[blockIndex];
    if (!block) return;

    const marker = `{/* freeCodeOrder: ${order || 9999} */}`;
    let nextContent = post.content;

    if (block.orderMarkerStart !== null && block.orderMarkerEnd !== null) {
      nextContent = `${nextContent.slice(0, block.orderMarkerStart)}${marker}${nextContent.slice(block.orderMarkerEnd)}`;
    } else {
      nextContent = `${nextContent.slice(0, block.codeStart)}${marker}\n${nextContent.slice(block.codeStart)}`;
    }

    setPost({ ...post, content: nextContent });
  }

  async function loadPosts() {
    const response = await fetch("/api/admin/posts");
    const data = await response.json();
    setPosts(data.posts ?? []);
  }

  async function loadPost(slug: string) {
    const response = await fetch(`/api/admin/posts/${slug}`);
    const data = await response.json();
    if (data.post) {
      setPost(data.post);
      setSlugTouched(true);
      setTagInput(data.post.tags.join(", "));
      setMessage(`${data.post.title} 글을 불러왔습니다.`);
    }
  }

  async function savePost() {
    setMessage("저장 중입니다...");
    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        tags: tagInput.split(",").map((tag) => tag.trim()).filter(Boolean)
      })
    });
    const data = await response.json();
    setMessage(data.ok ? "저장했습니다. 블로그 페이지를 새로고침해 확인하세요." : data.message);
    if (data.ok) {
      await loadPosts();
    }
  }

  async function deploySite() {
    setIsDeploying(true);
    setMessage("GitHub에 올리는 중입니다. 이 작업은 잠시 걸릴 수 있어요...");

    try {
      const response = await fetch("/api/admin/deploy", { method: "POST" });
      const data = await response.json();
      setMessage(data.ok ? data.message : `${data.message} ${data.detail ?? ""}`);
    } catch {
      setMessage("자동 배포 요청에 실패했습니다. GitHub Desktop으로 Commit/Push를 해주세요.");
    } finally {
      setIsDeploying(false);
    }
  }

  async function uploadCover(file: File) {
    setMessage("대표이미지를 업로드 중입니다...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: form
    });
    const data = await response.json();
    if (data.ok) {
      setPost((current) => ({ ...current, cover: data.path }));
      setMessage("대표이미지를 업로드했습니다. 글에 최종 반영하려면 아래 저장 버튼을 눌러주세요.");
    } else {
      setMessage(data.message ?? "업로드에 실패했습니다.");
    }
  }

  async function uploadFreeCodeImage(file: File, blockIndex: number) {
    setMessage("무료 코드 이미지를 업로드 중입니다...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: form
    });
    const data = await response.json();
    if (data.ok) {
      setFreeCodeImage(blockIndex, data.path);
      setMessage("무료 코드 이미지를 업로드했습니다. 최종 반영하려면 저장 버튼을 눌러주세요.");
    } else {
      setMessage(data.message ?? "업로드에 실패했습니다.");
    }
  }

  function insertTextAtCursor(value: string) {
    const textarea = contentTextareaRef.current ?? (document.getElementById("post-content") as HTMLTextAreaElement | null);
    const start = textarea?.selectionStart ?? post.content.length;
    const end = textarea?.selectionEnd ?? post.content.length;
    const nextContent = `${post.content.slice(0, start)}${value}${post.content.slice(end)}`;
    setPost({ ...post, content: nextContent });
    window.setTimeout(() => {
      textarea?.focus();
      const cursor = start + value.length;
      textarea?.setSelectionRange(cursor, cursor);
    }, 0);
  }

  function insertBodyTemplate(value: string) {
    insertTextAtCursor(value);
  }

  async function uploadInlineImage(file: File) {
    setMessage("본문 이미지를 업로드하는 중입니다...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: form
    });
    const data = await response.json();
    if (data.ok) {
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "이미지";
      insertTextAtCursor(`\n\n![${alt}](${data.path})\n\n`);
      setMessage("본문 이미지를 현재 커서 위치에 넣었습니다. 최종 반영하려면 저장을 눌러주세요.");
    } else {
      setMessage(data.message ?? "본문 이미지 업로드에 실패했습니다.");
    }
  }

  function openPreviewPage() {
    window.localStorage.setItem(
      "seri-post-preview",
      JSON.stringify({
        ...post,
        tags: tagInput.split(",").map((tag) => tag.trim()).filter(Boolean)
      })
    );
    window.open("/admin/preview", "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="container-narrow py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Local Editor</p>
          <h1 className="mt-1 text-3xl font-bold">블로그 글쓰기</h1>
          <p className="mt-2 text-sm text-muted-foreground">글을 저장하면 `src/content/posts` 안의 MDX 파일이 자동으로 만들어지거나 수정됩니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/paid-prompts" className={cn(buttonVariants({ variant: "outline" }))}>
            유료 프롬프트 관리
          </Link>
          <Button variant="outline" onClick={() => { setPost(emptyPost); setTagInput(""); setSlugTouched(false); setMessage("새 글을 작성합니다."); }}>
            <Plus className="h-4 w-4" /> 새 글
          </Button>
          <Button variant="outline" onClick={loadPosts}>
            <RefreshCw className="h-4 w-4" /> 목록 새로고침
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          {posts.map((item) => (
            <button
              key={item.slug}
              type="button"
              className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted"
              onClick={() => loadPost(item.slug)}
            >
              <p className="line-clamp-2 font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
            </button>
          ))}
        </aside>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">글 주소 slug</span>
                <Input
                  value={post.slug}
                  placeholder="제목을 입력하면 자동 생성됩니다"
                  onChange={(event) => {
                    setSlugTouched(true);
                    setPost({ ...post, slug: event.target.value });
                  }}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">날짜</span>
                <Input
                  type="date"
                  value={post.date}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    setPost({
                      ...post,
                      date: nextDate,
                      slug: slugTouched ? post.slug : createSlug(post.title, nextDate)
                    });
                  }}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-lg border bg-muted/30 p-4 text-sm font-semibold">
                <input type="checkbox" checked={post.draft} onChange={(event) => setPost({ ...post, draft: event.target.checked })} />
                임시저장으로 숨기기
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">예약발행 시간</span>
                <Input
                  type="datetime-local"
                  value={post.publishAt ?? ""}
                  onChange={(event) => setPost({ ...post, publishAt: event.target.value })}
                />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold">제목</span>
              <Input
                value={post.title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setPost({
                    ...post,
                    title: nextTitle,
                    slug: slugTouched ? post.slug : createSlug(nextTitle, post.date)
                  });
                }}
              />
            </label>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold">설명</span>
              <Input value={post.description} onChange={(event) => setPost({ ...post, description: event.target.value })} />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">카테고리</span>
                <Input value={post.category} onChange={(event) => setPost({ ...post, category: event.target.value })} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">태그</span>
                <Input value={tagInput} placeholder="챗GPT, 프롬프트, 인스타그램" onChange={(event) => setTagInput(event.target.value)} />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold">썸네일 이미지</span>
              <Input value={post.cover} placeholder="/blog/밥먹어.png" onChange={(event) => setPost({ ...post, cover: event.target.value })} />
            </label>

            <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-[160px_1fr] md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
                {post.cover ? <Image src={post.cover} alt="" fill className="object-cover" sizes="160px" /> : null}
              </div>
              <div>
                <p className="text-sm font-semibold">대표이미지 업로드</p>
                <p className="mt-1 text-sm text-muted-foreground">이미지를 선택하면 `public/blog`에 저장되고 썸네일 경로가 자동 입력됩니다. 마지막에 저장을 눌러야 글에 반영됩니다.</p>
                <Input
                  className="mt-3"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadCover(file);
                  }}
                />
                {post.cover ? (
                  <p className="mt-3 rounded-md bg-background p-3 text-xs text-muted-foreground">
                    현재 대표이미지: <span className="font-semibold text-foreground">{post.cover}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={post.popular} onChange={(event) => setPost({ ...post, popular: event.target.checked })} />
              인기글로 표시
            </label>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold">본문</span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">서식 버튼을 누르면 커서 위치에 자동으로 들어갑니다.</p>
                <Button type="button" variant="outline" size="sm" onClick={openPreviewPage}>
                  새 페이지 미리보기
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
                {bodyTemplates.map((template) => (
                  <Button key={template.label} type="button" variant="outline" size="sm" onClick={() => insertBodyTemplate(template.value)}>
                    {template.label}
                  </Button>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => inlineImageInputRef.current?.click()}>
                  <ImagePlus className="h-4 w-4" /> 이미지 넣기
                </Button>
                <input
                  ref={inlineImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) uploadInlineImage(file);
                  }}
                />
              </div>
              <Textarea
                ref={contentTextareaRef}
                id="post-content"
                className="min-h-[520px] font-mono text-sm"
                value={post.content}
                onChange={(event) => setPost({ ...post, content: event.target.value })}
              />
            </label>

            {freeCodeBlocks.length ? (
              <section className="rounded-lg border bg-muted/20 p-4">
                <div className="mb-4">
                  <h2 className="text-lg font-bold">무료 코드 이미지 관리</h2>
                  <p className="mt-1 text-sm text-muted-foreground">무료 코드가 여러 개일 때 자료실에 표시할 이미지를 각각 지정할 수 있습니다.</p>
                </div>
                <div className="space-y-4">
                  {freeCodeBlocks.map((block) => (
                    <div key={block.index} className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-[120px_1fr] md:items-center">
                      <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                        {block.image ? <Image src={block.image} alt="" fill className="object-cover" sizes="120px" /> : null}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-bold">무료 코드 {block.index + 1}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{block.preview || "프롬프트 내용 없음"}</p>
                        </div>
                        <Input
                          value={block.image}
                          placeholder="/blog/example.png"
                          onChange={(event) => setFreeCodeImage(block.index, event.target.value)}
                        />
                        <label className="block space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground">자료실 표시 순서</span>
                          <Input
                            type="number"
                            min="1"
                            value={block.order}
                            placeholder="1"
                            onChange={(event) => setFreeCodeOrder(block.index, event.target.value)}
                          />
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) uploadFreeCodeImage(file, block.index);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {message ? <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{message}</p> : null}

            <div className="flex flex-wrap gap-2">
              <Button onClick={savePost}>
                <Save className="h-4 w-4" /> 저장
              </Button>
              <Button type="button" variant="dark" onClick={deploySite} disabled={isDeploying}>
                <Rocket className="h-4 w-4" /> {isDeploying ? "배포 중..." : "배포하기"}
              </Button>
              <Button type="button" variant="outline" onClick={openPreviewPage}>새 페이지 미리보기</Button>
              <Link href={previewHref} target="_blank" className={cn(buttonVariants({ variant: "outline" }))}>글 보기</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
