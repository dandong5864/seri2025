import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const payload = {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    subject: String(form.get("subject") ?? ""),
    message: String(form.get("message") ?? "")
  };

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    return NextResponse.json({ ok: false, message: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  console.info("[contact]", payload);
  return NextResponse.redirect(new URL("/contact?sent=true", request.url), { status: 303 });
}
