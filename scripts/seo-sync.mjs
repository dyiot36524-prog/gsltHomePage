/**
 * SEO Sync — Firestore의 발행 글을 읽어 검색·AI 크롤러용 정적 사본을 생성한다.
 *
 * 생성물:
 *   p/<글ID>.html   게시글 정적 스냅샷 (JS 없이 본문이 보이는 정본)
 *   sitemap.xml     정적 페이지 + 모든 글 URL
 *   rss.xml         뉴스 RSS 피드 (네이버 서치어드바이저 제출용)
 *   llms.txt        AI 크롤러용 회사·콘텐츠 색인
 *
 * 실행: node scripts/seo-sync.mjs   (사전: npm install marked --no-save)
 * 커스텀 도메인 연결 시 BASE_URL만 변경하면 된다.
 */
import { marked } from 'marked';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';

const BASE_URL = 'https://home.gslt.kr';
const PROJECT_ID = 'gslthomepage';
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok'; // 공개용 웹 API 키 (권한은 Firestore 규칙이 통제)

const CATEGORY_LABEL = { news: '뉴스', portfolio: '포트폴리오', downloads: '자료실' };
const LIST_PAGE = { news: 'news.html', portfolio: 'portfolio.html', downloads: 'downloads.html' };

/* ── Firestore REST ── */
function decode(v) {
  if (v == null) return null;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.timestampValue !== undefined) return new Date(v.timestampValue);
  if (v.nullValue !== undefined) return null;
  if (v.arrayValue) return (v.arrayValue.values || []).map(decode);
  if (v.mapValue) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, decode(x)]));
  return null;
}

async function fetchPublishedPosts() {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'posts' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'published' },
              op: 'EQUAL',
              value: { booleanValue: true }
            }
          }
        }
      })
    }
  );
  if (!res.ok) throw new Error(`Firestore query failed: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  return rows
    .filter(r => r.document)
    .map(r => {
      const fields = Object.fromEntries(
        Object.entries(r.document.fields || {}).map(([k, v]) => [k, decode(v)])
      );
      return { id: r.document.name.split('/').pop(), ...fields };
    })
    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
}

/* ── 유틸 ── */
const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escXml = escHtml;
const dateISO = d => (d instanceof Date && !isNaN(d)) ? d.toISOString().slice(0, 10) : '';
const dateKR = d => (d instanceof Date && !isNaN(d)) ? `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}` : '';
const dateRFC = d => (d instanceof Date && !isNaN(d)) ? d.toUTCString() : '';
const absolute = u => !u ? '' : /^https?:/i.test(u) ? u : `${BASE_URL}/${u.replace(/^\.?\//, '')}`;

/* 관대한 마크다운 + 렌더 + 새니타이즈 */
function renderBody(md) {
  const forgiving = String(md || '').replace(/^(#{1,6})([^#\s])/gm, '$1 $2');
  let html = marked.parse(forgiving);
  // 관리자만 작성 가능하지만 방어적으로 위험 요소 제거
  html = html
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*\/?\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, ' $1="#"');
  return html;
}

/* ── 게시글 스냅샷 페이지 ── */
function snapshotPage(p) {
  const url = `${BASE_URL}/p/${p.id}.html`;
  const desc = p.excerpt || p.title;
  const bodyHtml = renderBody(p.body);
  const files = (Array.isArray(p.attachments) ? p.attachments : [])
    .filter(f => f && f.url && (/^https?:\/\//i.test(f.url) || !/^[a-z][a-z0-9+.-]*:/i.test(f.url)));

  const ld = {
    '@context': 'https://schema.org',
    '@type': p.category === 'news' ? 'NewsArticle' : 'Article',
    headline: p.title,
    description: desc,
    image: p.thumbnail ? [absolute(p.thumbnail)] : undefined,
    datePublished: p.createdAt?.toISOString?.(),
    dateModified: (p.updatedAt || p.createdAt)?.toISOString?.(),
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: '지에스엘티(GSLT)' },
    publisher: { '@type': 'Organization', name: '지에스엘티(GSLT)' }
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(p.title)} - GSLT</title>
<meta name="description" content="${escHtml(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="../img/gslt-symbol.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="GSLT">
<meta property="og:title" content="${escHtml(p.title)}">
<meta property="og:description" content="${escHtml(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${escHtml(p.thumbnail ? absolute(p.thumbnail) : `${BASE_URL}/img/og-image.png`)}">
<meta property="og:locale" content="ko_KR">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Pretendard',system-ui,sans-serif;color:#0f172a;background:#f8fafc;line-height:1.75;word-break:keep-all}
.nav{background:#fff;border-bottom:1px solid #e2e8f0;padding:14px 20px}
.nav-inner{max-width:760px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px}
.nav img{height:26px;width:auto;display:block}
.nav-links{display:flex;gap:18px;font-size:14px;font-weight:700}
.nav a{color:#475569;text-decoration:none}
.nav a:hover{color:#1e93a0}
main{max-width:760px;margin:0 auto;padding:48px 20px 40px}
.cat{font-size:11px;font-weight:800;letter-spacing:.25em;text-transform:uppercase;color:#1e93a0;display:flex;align-items:center;gap:12px}
.cat::before{content:'';display:block;width:36px;height:1px;background:#4cc3d2}
h1{font-size:clamp(26px,5vw,40px);font-weight:900;letter-spacing:-.02em;line-height:1.3;margin:16px 0 10px}
.date{font-size:14px;font-weight:600;color:#64748b;padding-bottom:24px;margin-bottom:32px;border-bottom:1px solid #e2e8f0}
.thumb{width:100%;height:auto;border-radius:16px;border:1px solid #e2e8f0;margin-bottom:32px}
.body{font-size:17px;color:#334155}
.body h1,.body h2,.body h3{color:#0f172a;font-weight:800;margin:1.8em 0 .6em;line-height:1.35}
.body h1{font-size:1.5em}.body h2{font-size:1.3em}.body h3{font-size:1.12em}
.body p{margin:1em 0}
.body a{color:#1e93a0}
.body img{max-width:100%;height:auto;border-radius:12px;margin:1.5em 0}
.body ul,.body ol{margin:1em 0;padding-left:1.5em}
.body blockquote{border-left:3px solid #28b8c5;padding-left:1.1em;color:#64748b;margin:1.4em 0}
.files{margin-top:28px}
.files a{display:flex;justify-content:space-between;gap:12px;padding:12px 16px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#334155;text-decoration:none;font-size:14px;font-weight:600;margin-top:10px}
.back{display:inline-block;margin-top:40px;padding:12px 26px;border:2px solid #e2e8f0;border-radius:999px;color:#475569;font-size:14px;font-weight:700;text-decoration:none}
.back:hover{border-color:#4cc3d2;color:#1e93a0}
footer{border-top:1px solid #e2e8f0;background:#fff;margin-top:56px;padding:28px 20px;font-size:12px;color:#94a3b8;line-height:1.8}
footer .inner{max-width:760px;margin:0 auto}
footer a{color:#64748b;text-decoration:none}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner">
<a href="../index.html"><img src="../img/gslt-logo-color.png" alt="GSLT"></a>
<div class="nav-links"><a href="../news.html">뉴스</a><a href="../downloads.html">자료실</a><a href="../portfolio.html">포트폴리오</a></div>
</div></nav>
<main>
<p class="cat">${escHtml(CATEGORY_LABEL[p.category] || '')}</p>
<h1>${escHtml(p.title)}</h1>
<p class="date">${dateKR(p.createdAt)}</p>
${p.thumbnail ? `<img class="thumb" src="${escHtml(absolute(p.thumbnail))}" alt="${escHtml(p.title)}">` : ''}
<article class="body">${bodyHtml}</article>
${files.length ? `<div class="files">${files.map(f => `<a href="${escHtml(absolute(f.url))}" download>${escHtml(f.name || '첨부파일')}<span>다운로드</span></a>`).join('')}</div>` : ''}
<a class="back" href="../${LIST_PAGE[p.category] || 'news.html'}">목록으로</a>
</main>
<footer><div class="inner">
지에스엘티(GSLT) · 대표자 최광수 · 사업자등록번호 707-81-03107<br>
경기도 성남시 중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호 · Tel 070-4659-4804 · <a href="mailto:gs7078103107@gmail.com">gs7078103107@gmail.com</a><br>
&copy; GSLT. All rights reserved. · <a href="../index.html">홈</a>
</div></footer>
</body>
</html>
`;
}

/* ── sitemap.xml ── */
function buildSitemap(posts) {
  const staticPages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${BASE_URL}/about.html`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/siot.html`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${BASE_URL}/bizmoa.html`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${BASE_URL}/dailo.html`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${BASE_URL}/morak.html`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${BASE_URL}/news.html`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/portfolio.html`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/downloads.html`, priority: '0.6', changefreq: 'monthly' }
  ];
  const urls = [
    ...staticPages.map(p => `  <url>\n    <loc>${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`),
    ...posts.map(p => {
      const lastmod = dateISO(p.updatedAt || p.createdAt);
      return `  <url>\n    <loc>${BASE_URL}/p/${p.id}.html</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n    <priority>0.7</priority>\n  </url>`;
    })
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/* ── rss.xml (뉴스) ── */
function buildRss(posts) {
  const items = posts.filter(p => p.category === 'news').slice(0, 20).map(p => `    <item>
      <title>${escXml(p.title)}</title>
      <link>${BASE_URL}/p/${p.id}.html</link>
      <guid isPermaLink="true">${BASE_URL}/p/${p.id}.html</guid>
      <description>${escXml(p.excerpt || p.title)}</description>
      <pubDate>${dateRFC(p.createdAt)}</pubDate>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>GSLT 뉴스</title>
    <link>${BASE_URL}/news.html</link>
    <description>지에스엘티(GSLT)의 새로운 소식과 보도자료</description>
    <language>ko</language>
${items}
  </channel>
</rss>
`;
}

/* ── llms.txt (AI 크롤러용 색인) ── */
function buildLlms(posts) {
  const section = (cat, title) => {
    const list = posts.filter(p => p.category === cat).slice(0, 30)
      .map(p => `- [${p.title}](${BASE_URL}/p/${p.id}.html)${p.excerpt ? `: ${p.excerpt}` : ''}`).join('\n');
    return list ? `\n## ${title}\n\n${list}\n` : '';
  };
  return `# GSLT (지에스엘티)

> 무선 IoT 구축 전문기업. 배선 공사 없이 오피스·주거(스마트홈)·빌딩을 스마트 공간으로
> 완성한다. IoT 통합 제어 솔루션 '시옷(Siot)', IoT 시공업체용 견적 자동화 SaaS
> '비즈모아(BizMoa)', AI 워크스페이스 '다일로(Dailo)', 모임 커뮤니티 플랫폼 '모락(Morak)'을 개발·공급하며,
> 포브스 코리아 '무선 IoT 기반 스마트 공간' 부문 대상을 수상했다.

- 업종: IoT 구축 / 스마트오피스·스마트홈·빌딩 자동화 시공 및 솔루션 개발
- 회사명: 지에스엘티(GSLT) / 대표자: 최광수
- 주소: 경기도 성남시 중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호
- 연락처: 070-4659-4804 / gs7078103107@gmail.com
- 웹사이트: ${BASE_URL}/

## 솔루션

- [시옷 (Siot)](${BASE_URL}/siot.html): 배선 공사 없는 무선 IoT로 조명·블라인드·공조를 통합 제어하는 스마트 공간 솔루션. 1초 단위 실시간 모니터링, 99.9% 제어 안정성, 상황별 장면 모드 프리셋.
- [비즈모아 (BizMoa)](${BASE_URL}/bizmoa.html): 건축 도면 위에 장비를 배치하면 견적서·계약서·납품확인서가 자동 생성되는 시공·설치업체용 올인원 B2B SaaS. 인건비 자동 산출, 프로젝트·권한 관리 포함.
- [다일로 (Dailo)](${BASE_URL}/dailo.html): 문서와 채팅을 결합해 대화를 지식으로 바꾸는 AI 워크스페이스. 토픽 기반 업무 프로세스와 AI 어시스턴트 제공.\n- [모락 (Morak)](https://morac.gslt.kr): 기수제 모임(원우회·동문회)을 위한 모바일 커뮤니티 플랫폼. 디지털 명함 QR 교환, 기수·직책 관리, 일정·참석 관리, 원우수첩 제공. 소개: ${BASE_URL}/morak.html
${section('news', '최근 소식')}${section('portfolio', '시공사례 (포트폴리오)')}${section('downloads', '자료실')}
## 페이지

- [홈](${BASE_URL}/)
- [뉴스](${BASE_URL}/news.html)
- [포트폴리오](${BASE_URL}/portfolio.html)
- [자료실](${BASE_URL}/downloads.html)
`;
}

/* ── 실행 ── */
const posts = await fetchPublishedPosts();
console.log(`발행 글 ${posts.length}건 조회됨`);

// p/ 디렉터리는 매번 재생성 → 비공개/삭제 글 스냅샷 자동 제거
if (existsSync('p')) rmSync('p', { recursive: true });
mkdirSync('p');
for (const p of posts) {
  writeFileSync(`p/${p.id}.html`, snapshotPage(p));
}
writeFileSync('sitemap.xml', buildSitemap(posts));
writeFileSync('rss.xml', buildRss(posts));
writeFileSync('llms.txt', buildLlms(posts));

console.log(`생성 완료: p/*.html ${posts.length}건, sitemap.xml, rss.xml, llms.txt`);
