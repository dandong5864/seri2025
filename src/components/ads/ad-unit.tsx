import Script from "next/script";
import { cn } from "@/lib/utils";

type AdUnitProps = {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
  label?: string;
};

const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdUnit({ slot, format = "auto", className, label = "Advertisement" }: AdUnitProps) {
  if (!adsEnabled || !publisherId) {
    return null;
  }

  return (
    <aside className={cn("my-6 rounded-lg border bg-muted/40 p-3", className)} aria-label={label}>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle block"
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <Script id={`adsense-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}
