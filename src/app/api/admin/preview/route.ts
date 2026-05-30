import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";

export async function POST(request: Request) {
  const body = await request.json();
  const content = String(body.content ?? "");
  const mdxSource = await serialize(content);

  return NextResponse.json({
    ok: true,
    source: mdxSource
  });
}
