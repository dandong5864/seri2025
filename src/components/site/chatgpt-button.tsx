import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export function ChatGPTButton({ href = "https://chatgpt.com/" }: { href?: string }) {
  return (
    <div className="my-10 mx-auto flex max-w-[800px] justify-center">
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full max-w-full items-center justify-center gap-3 rounded-[14px] bg-[linear-gradient(180deg,#f0445f,#6046d8)] px-9 py-4 text-center text-xl font-extrabold !text-white no-underline shadow-[0_10px_24px_rgba(96,70,216,0.3),0_5px_12px_rgba(240,68,95,0.22)] transition duration-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.42)] hover:scale-[1.02] hover:bg-[linear-gradient(180deg,#f2b705,#d98500)] hover:!text-white sm:px-11 sm:py-5 sm:text-2xl"
      >
        <Sparkles className="h-5 w-5" />
        ChatGPT로 바로가기
        <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  );
}
