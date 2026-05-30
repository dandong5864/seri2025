import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

function isSafeSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET() {
  return NextResponse.json({
    posts: getAllPosts({ includeDrafts: true, includeFuture: true }).map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      category: post.category,
      tags: post.tags,
      cover: post.cover,
      popular: Boolean(post.popular),
      draft: Boolean(post.draft),
      publishAt: post.publishAt ?? ""
    }))
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slug = String(body.slug ?? "").trim();

  if (!isSafeSlug(slug)) {
    return NextResponse.json({ ok: false, message: "slug는 영어 소문자, 숫자, 하이픈만 사용할 수 있습니다." }, { status: 400 });
  }

  const frontmatter = {
    title: String(body.title ?? "").trim(),
    description: String(body.description ?? "").trim(),
    date: String(body.date ?? "").trim(),
    publishAt: String(body.publishAt ?? "").trim(),
    category: String(body.category ?? "").trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    cover: String(body.cover ?? "").trim(),
    draft: Boolean(body.draft),
    popular: Boolean(body.popular)
  };

  if (!frontmatter.title || !frontmatter.description || !frontmatter.date || !frontmatter.category || !frontmatter.cover) {
    return NextResponse.json({ ok: false, message: "제목, 설명, 날짜, 카테고리, 커버 이미지는 필수입니다." }, { status: 400 });
  }

  const content = String(body.content ?? "").trim();
  const file = matter.stringify(`${content}\n`, frontmatter);
  fs.writeFileSync(path.join(postsDirectory, `${slug}.mdx`), file, "utf8");

  return NextResponse.json({ ok: true, slug });
}
