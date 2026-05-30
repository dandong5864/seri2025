import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { PaidPrompt } from "@/lib/paid-prompts";

const paidPromptsPath = path.join(process.cwd(), "src/content/paid-prompts.json");

type PaidPromptInput = Partial<PaidPrompt> & {
  previewLines?: unknown;
};

function isSafeId(id: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
}

function readPaidPrompts(): PaidPrompt[] {
  if (!fs.existsSync(paidPromptsPath)) return [];
  return JSON.parse(fs.readFileSync(paidPromptsPath, "utf8")) as PaidPrompt[];
}

export async function GET() {
  return NextResponse.json({ prompts: readPaidPrompts() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const prompts = Array.isArray(body.prompts) ? body.prompts : [];

  const nextPrompts = (prompts as PaidPromptInput[]).map((prompt) => ({
    id: String(prompt.id ?? "").trim(),
    title: String(prompt.title ?? "").trim(),
    description: String(prompt.description ?? "").trim(),
    price: String(prompt.price ?? "").trim(),
    cover: String(prompt.cover ?? "").trim(),
    ctaLabel: String(prompt.ctaLabel ?? "").trim(),
    href: String(prompt.href ?? "").trim(),
    previewLines: Array.isArray(prompt.previewLines)
      ? prompt.previewLines.map((line: unknown) => String(line).trim()).filter(Boolean)
      : [],
    updatedAt: new Date().toISOString().slice(0, 10)
  }));

  const invalid = nextPrompts.find((prompt: PaidPrompt) => !isSafeId(prompt.id) || !prompt.title || !prompt.href);
  if (invalid) {
    return NextResponse.json(
      { ok: false, message: "id는 영어 소문자, 숫자, 하이픈만 가능하고 제목과 링크는 꼭 필요합니다." },
      { status: 400 }
    );
  }

  fs.mkdirSync(path.dirname(paidPromptsPath), { recursive: true });
  fs.writeFileSync(paidPromptsPath, `${JSON.stringify(nextPrompts, null, 2)}\n`, "utf8");

  return NextResponse.json({ ok: true, prompts: nextPrompts });
}
