# 쎄리는 로딩중

AI 영상 크리에이터 개인 브랜드 사이트입니다. `Seri is Loading` 브랜드를 기준으로 Next.js App Router, TypeScript, Tailwind CSS, Shadcn 스타일 UI 컴포넌트, MDX 블로그, SEO 자동화, AdSense 배치를 포함합니다.

## 시작하기

```bash
npm install
npm run dev
```

PowerShell 실행 정책으로 `npm`이 막히면 Windows에서는 `npm.cmd install`, `npm.cmd run dev`를 사용하세요.

## 콘텐츠 운영

블로그 글은 `src/content/posts`에 `.mdx` 파일만 추가하면 됩니다. frontmatter의 `category`, `tags`, `date`, `popular` 값으로 목록, 태그, 카테고리, 인기글, RSS, 사이트맵이 자동 갱신됩니다.

```mdx
---
title: "글 제목"
description: "검색 결과와 카드에 표시될 설명"
date: "2026-05-29"
category: "AI 영상 제작"
tags: ["AI영상", "쇼츠"]
cover: "https://images.unsplash.com/..."
popular: true
---
```

## 주요 경로

- `/` 홈
- `/blog` 블로그, 검색, 카테고리, 태그
- `/blog/[slug]` MDX 상세 글, 관련글, 광고 위치
- `/portfolio` 포트폴리오 필터 갤러리
- `/course` 강의 소개와 신청 CTA
- `/resources` 무료 자료실
- `/contact` 문의 폼
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`

## Google 연동

`.env.local`에 값을 설정합니다.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ENABLED=true
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

Search Console은 도메인 인증을 권장합니다. HTML 태그 인증을 사용할 경우 `src/app/layout.tsx`의 metadata에 verification 값을 추가하면 됩니다.

## AdSense

광고 컴포넌트는 `src/components/ads/ad-unit.tsx`입니다. 현재 배치:

- 홈 콘텐츠 사이
- 블로그 목록 상단
- 블로그 사이드바
- 블로그 본문 상단
- 블로그 본문 하단
- 관련글 이후

`NEXT_PUBLIC_ADSENSE_ENABLED=false`이면 광고가 렌더링되지 않습니다.

## Vercel 배포

1. GitHub 저장소에 프로젝트를 push합니다.
2. Vercel에서 New Project로 저장소를 연결합니다.
3. Framework Preset은 Next.js로 자동 인식됩니다.
4. Environment Variables에 `.env.example` 값을 실제 값으로 등록합니다.
5. Deploy를 실행합니다.

빌드 명령은 `npm run build`, 출력은 Next.js 기본값을 사용합니다.
