export type PortfolioItem = {
  slug: string;
  title: string;
  category: "AI 영상 작품" | "쇼츠 사례" | "프로젝트 사례";
  description: string;
  image: string;
  metrics: string;
  tools: string[];
};

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "ai-brand-film",
    title: "브랜드 런칭 AI 필름",
    category: "AI 영상 작품",
    description: "텍스트 콘셉트에서 스토리보드, 이미지 생성, 영상 합성까지 이어지는 브랜드 필름.",
    image: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80",
    metrics: "제작 기간 5일, 12컷 시퀀스",
    tools: ["Runway", "Midjourney", "Premiere Pro"]
  },
  {
    slug: "shorts-growth-system",
    title: "유튜브 쇼츠 성장 시스템",
    category: "쇼츠 사례",
    description: "AI 리서치와 반복 가능한 후킹 템플릿으로 쇼츠 업로드 효율을 높인 운영 사례.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
    metrics: "30일 42개 숏폼 제작",
    tools: ["Vrew", "ChatGPT", "CapCut"]
  },
  {
    slug: "lecture-funnel",
    title: "강의 판매 퍼널 영상 패키지",
    category: "프로젝트 사례",
    description: "무료 자료, 랜딩 페이지, 강의 신청으로 이어지는 영상 기반 판매 퍼널.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    metrics: "신청 전환율 18.4%",
    tools: ["Notion", "Canva", "YouTube"]
  }
];

export const portfolioCategories = ["전체", "AI 영상 작품", "쇼츠 사례", "프로젝트 사례"] as const;

export function getPortfolioItem(slug: string) {
  return portfolioItems.find((item) => item.slug === slug);
}
