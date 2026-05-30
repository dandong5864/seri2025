import Link from "next/link";
import { Instagram, Mail, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container-narrow grid gap-6 py-10 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-bold">{siteConfig.name}</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{siteConfig.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/contact">문의하기</Link>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Link aria-label="YouTube" href={siteConfig.youtube} target="_blank"><Youtube className="h-5 w-5" /></Link>
          <Link aria-label="Instagram" href={siteConfig.instagram} target="_blank"><Instagram className="h-5 w-5" /></Link>
          <Link aria-label="Email" href={`mailto:${siteConfig.email}`}><Mail className="h-5 w-5" /></Link>
        </div>
      </div>
    </footer>
  );
}
