import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "쎄리는 로딩중",
  englishName: "Seri is Loading",
  description: "AI 영상 제작, 유튜브 쇼츠, 콘텐츠 수익화를 실험하고 기록하는 크리에이터 브랜드",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seriisloading.com",
  author: "쎄리",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@seriisloading.com",
  youtube: "https://www.youtube.com/@%EC%8E%84%EB%A6%AC%EB%8A%94%EB%A1%9C%EB%94%A9%EC%A4%91",
  instagram: "https://www.instagram.com/seriisloading/",
  channels: {
    ai: "https://www.youtube.com/@HappyDanDongTV",
    sewing: "https://www.youtube.com/@sewingtip"
  }
};

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
