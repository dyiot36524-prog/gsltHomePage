import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * robots.txt — 구 사이트에 있던 것을 새 주소로 되살린 것이다.
 *
 * 일반 크롤러 외에 AI 검색·어시스턴트 크롤러를 이름으로 하나씩 허용한다.
 * 기본 규칙(User-agent: *)만 있어도 대부분 통과하지만, 일부는 명시적으로
 * 허용된 경우에만 수집하거나 학습 여부를 따로 본다. 이 회사는 언론보도와
 * 기술 설명이 검색·AI 답변에 나오는 게 이득이라 전부 열어 둔다.
 *
 * /admin.html은 색인에서 뺀다. 페이지 자체에도 noindex 메타가 있지만,
 * 크롤러가 아예 들르지 않게 여기서도 막는다.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: '/', disallow: ['/admin.html', '/api/'] };

  return {
    rules: [
      { userAgent: '*', ...allowAll },
      // AI 검색·어시스턴트
      { userAgent: 'GPTBot', ...allowAll },
      { userAgent: 'OAI-SearchBot', ...allowAll },
      { userAgent: 'ChatGPT-User', ...allowAll },
      { userAgent: 'ClaudeBot', ...allowAll },
      { userAgent: 'Claude-Web', ...allowAll },
      { userAgent: 'PerplexityBot', ...allowAll },
      { userAgent: 'Google-Extended', ...allowAll },
      { userAgent: 'CCBot', ...allowAll },
      // 네이버
      { userAgent: 'Yeti', ...allowAll },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
