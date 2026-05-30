import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const projectRoot = process.cwd();

function getGitCommand() {
  const windowsGit = "C:\\Program Files\\Git\\cmd\\git.exe";
  return fs.existsSync(windowsGit) ? windowsGit : "git";
}

async function runGit(args: string[]) {
  const { stdout, stderr } = await execFileAsync(getGitCommand(), args, {
    cwd: projectRoot,
    windowsHide: true,
    timeout: 120_000
  });

  return `${stdout}${stderr}`.trim();
}

function isLocalRequest(request: Request) {
  const host = request.headers.get("host") ?? "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

export async function POST(request: Request) {
  if (process.env.VERCEL || !isLocalRequest(request)) {
    return NextResponse.json(
      { ok: false, message: "배포하기 버튼은 내 컴퓨터의 localhost 관리자 화면에서만 사용할 수 있습니다." },
      { status: 403 }
    );
  }

  try {
    await runGit(["add", "."]);
    const status = await runGit(["status", "--porcelain"]);

    if (status) {
      const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
      await runGit(["commit", "-m", `Update site content ${timestamp}`]);
    }

    const pushResult = await runGit(["push", "origin", "main"]);

    return NextResponse.json({
      ok: true,
      message: status
        ? "GitHub에 올렸습니다. Vercel이 곧 자동 배포합니다."
        : "새로 저장할 변경사항은 없지만 GitHub 연결을 확인했습니다.",
      detail: pushResult
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json(
      {
        ok: false,
        message: "자동 배포에 실패했습니다. GitHub Desktop으로 Commit/Push를 해주세요.",
        detail: message
      },
      { status: 500 }
    );
  }
}
