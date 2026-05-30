import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { DisableContextMenu } from "@/components/site/disable-context-menu";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ThemeProvider } from "@/components/site/theme-provider";
import { absoluteUrl, siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | AI 영상 크리에이터`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | AI 영상 크리에이터`,
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | AI 영상 크리에이터`,
    description: siteConfig.description
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        {gaId ? (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <ThemeProvider>
          <DisableContextMenu />
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
