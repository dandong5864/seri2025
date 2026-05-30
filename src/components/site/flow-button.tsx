import Link from "next/link";
import { ExternalLink, Film } from "lucide-react";

export function FlowButton({ href = "https://labs.google/flow/about" }: { href?: string }) {
  return (
    <div className="my-10 mx-auto flex max-w-[800px] justify-center">
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full max-w-full items-center justify-center gap-3 rounded-[14px] bg-[linear-gradient(180deg,#ffe66d,#f5a400)] px-9 py-4 text-center text-xl font-extrabold !text-white no-underline shadow-[0_10px_24px_rgba(245,164,0,0.24),0_5px_12px_rgba(255,230,109,0.22)] transition duration-300 [text-shadow:0_2px_7px_rgba(80,50,0,0.38)] hover:scale-[1.02] hover:bg-[linear-gradient(180deg,#fff08a,#e39400)] hover:!text-white sm:px-11 sm:py-5 sm:text-2xl"
      >
        <Film className="h-5 w-5" />
        Google Flow로 바로가기
        <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  );
}
