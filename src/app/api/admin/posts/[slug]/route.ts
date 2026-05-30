import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

function isSafeSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isSafeSlug(slug)) {
    return NextResponse.json({ ok: false, message: "잘못된 글 주소입니다." }, { status: 400 });
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ ok: false, message: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  return NextResponse.json({
    ok: true,
    post: {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      publishAt: data.publishAt ?? "",
      category: data.category ?? "",
      tags: data.tags ?? [],
      cover: data.cover ?? "",
      draft: Boolean(data.draft),
      popular: Boolean(data.popular),
      content: content.trim()
    }
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isSafeSlug(slug)) {
    return NextResponse.json({ ok: false, message: "올바르지 않은 글 주소입니다." }, { status: 400 });
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ ok: false, message: "삭제할 글을 찾을 수 없습니다." }, { status: 404 });
  }

  fs.unlinkSync(filePath);

  return NextResponse.json({ ok: true, slug });
}
