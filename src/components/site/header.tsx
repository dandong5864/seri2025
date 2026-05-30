import Link from "next/link";
import { Youtube } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/utils";

const nav = [
  ["홈", "/"],
  ["블로그", "/blog"],
  ["포트폴리오", "/portfolio"],
  ["강의", "/course"],
  ["자료실", "/resources"],
  ["문의", "/contact"]
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/88 backdrop-blur">
      <div className="container-narrow flex h-20 items-center justify-between gap-2">
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:justify-center sm:gap-2">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="shrink-0 rounded-md px-2.5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground sm:px-4 sm:text-base">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href={siteConfig.youtube} target="_blank" aria-label="유튜브" className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}>
            <Youtube className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
