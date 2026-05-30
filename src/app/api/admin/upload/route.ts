import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { NextResponse } from "next/server";

const uploadDirectory = path.join(process.cwd(), "public/blog");

function safeFileName(name: string) {
  const extension = ".webp";
  const baseName = path.basename(name, extension).toLowerCase();
  const safeBase = baseName
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${safeBase || "image"}-${Date.now()}${extension}`;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "이미지 파일을 선택해 주세요." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, message: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
  }

  fs.mkdirSync(uploadDirectory, { recursive: true });

  const fileName = safeFileName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(bytes)
    .resize(860, 860, {
      fit: "cover",
      position: "center",
      withoutEnlargement: false
    })
    .webp({ quality: 88 })
    .toBuffer();

  fs.writeFileSync(path.join(uploadDirectory, fileName), resized);

  return NextResponse.json({
    ok: true,
    path: `/blog/${fileName}`
  });
}
