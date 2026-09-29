/**
 * 검색 노출 회귀 검사.
 *
 * 규칙을 문서에 적어 두면 다음 페이지에서 또 어긋난다. 실제로 그렇게 됐다 —
 * 제목이 77자, 설명이 224자까지 늘어나 검색 결과에서 잘리고 있었고,
 * llms.txt는 구 사이트 주소를 안내해 **링크 다섯 개가 전부 404**였다.
 * 둘 다 화면만 봐서는 알 수 없는 종류라, 사람이 눈으로 볼 것을 기대하면 안 된다.
 *
 * **배포본 URL로 돌린다.** 빌드 산출물이 아니라 실제로 나가는 HTML을 본다.
 *
 *   node scripts/seo-check.mjs https://www.gslt.kr
 */

import LIMITS from '../src/lib/seo-limits.json' with { type: 'json' };

const BASE = (process.argv[2] || 'https://www.gslt.kr').replace(/\/$/, '');

// 상한은 src/lib/seo.ts와 같은 파일에서 읽는다. 두 곳에 숫자를 따로 적으면 한쪽만 고쳐진다.
const { TITLE_MAX, DESC_MIN, DESC_MAX } = LIMITS; // 제목 30자 = 한글 기준 구글 표시 폭

// 네이버에서 이 회사를 찾는 말. 홈 제목에 이 말이 없어서, 제목이 이 말 그대로인 같은 회사
// 가구 쇼핑몰(gslf.kr)이 상호 검색 1위를 가져갔다(2026-09). 누가 제목을 다듬다 빠뜨리면
// 조용히 같은 일이 되풀이되므로 실패로 막는다.
const BRAND_QUERY = '지에스엘티';

const ROUTES = [
  '/', '/about', '/siot', '/bizmoa', '/morak',
  '/news', '/downloads', '/faq', '/contact', '/support',
  '/solutions/smart-office', '/solutions/smart-home', '/solutions/smart-building',
  '/solutions/unmanned-automation', '/solutions/ai-building-bms', '/solutions/ai-office',
];

let fail = 0;
const bad = (msg) => { fail++; console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

async function text(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { status: res.status, type: res.headers.get('content-type') || '', body: await res.text() };
}

function pick(html, re) {
  const m = re.exec(html);
  return m ? m[1] : '';
}

/* ── 1. 페이지별 핵심 태그 ── */
console.log('\n══ 핵심 태그 ══');
const seenDesc = new Map();
for (const route of ROUTES) {
  const { status, body } = await text(BASE + route);
  if (status !== 200) { bad(`${route} HTTP ${status}`); continue; }

  const title = pick(body, /<title>([^<]*)<\/title>/);
  const desc = pick(body, /<meta name="description" content="([^"]*)"/);
  const canonical = pick(body, /<link rel="canonical" href="([^"]*)"/);

  const notes = [];
  if (!title) notes.push('제목 없음');
  else if (title.length > TITLE_MAX) notes.push(`제목 ${title.length}자(>${TITLE_MAX})`);
  if (!desc) notes.push('설명 없음');
  else if (desc.length > DESC_MAX) notes.push(`설명 ${desc.length}자(>${DESC_MAX})`);
  else if (desc.length < DESC_MIN) notes.push(`설명 ${desc.length}자(<${DESC_MIN})`);
  if (!canonical) notes.push('canonical 없음');
  if (title && !title.includes(BRAND_QUERY)) notes.push(`제목에 '${BRAND_QUERY}' 없음`);
  if (route === '/' && title && !title.startsWith(BRAND_QUERY)) notes.push(`홈 제목이 '${BRAND_QUERY}'로 시작하지 않음`);

  // 설명이 페이지마다 같으면 검색엔진이 어느 쪽을 보여줄지 정하지 못한다.
  if (desc) {
    const prev = seenDesc.get(desc);
    if (prev) notes.push(`설명이 ${prev}와 동일`);
    else seenDesc.set(desc, route);
  }

  if (notes.length) bad(`${route} — ${notes.join(' · ')}`);
  else ok(`${route}  제목 ${title.length}자 · 설명 ${desc.length}자`);
}

/* ── 2. canonical이 sitemap과 같은 주소를 가리키는가 ── */
console.log('\n══ canonical ↔ sitemap ══');
{
  const { body } = await text(`${BASE}/sitemap.xml`);
  const locs = new Set([...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  for (const route of ROUTES) {
    const { body: html } = await text(BASE + route);
    const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
    if (!canonical) continue;
    if (!locs.has(canonical)) bad(`${route} canonical(${canonical})이 sitemap에 없다`);
  }
  if (!fail) ok(`sitemap ${locs.size}건과 canonical이 일치`);
}

/* ── 3. llms.txt의 링크가 살아 있는가 ──
   이번 사고가 정확히 이 검사가 없어서 생겼다. 파일이 200이라고 내용이 맞는 것은 아니다. */
console.log('\n══ llms.txt ══');
{
  const { status, body } = await text(`${BASE}/llms.txt`);
  if (status !== 200) bad(`llms.txt HTTP ${status}`);
  else {
    const urls = [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    const own = urls.filter((u) => u.startsWith(BASE));
    let dead = 0;
    for (const u of own) {
      const res = await fetch(u, { method: 'GET', redirect: 'follow' });
      if (res.status !== 200) { bad(`llms.txt 링크 ${res.status} — ${u}`); dead++; }
    }
    if (!dead) ok(`자사 링크 ${own.length}건 전부 200 (외부 ${urls.length - own.length}건은 검사 제외)`);

    for (const word of ['테스트', '안녕하세요']) {
      if (body.includes(word)) bad(`llms.txt에 '${word}'가 남아 있다`);
    }
    // .html은 **자사 주소에서만** 문제다. 구 사이트 흔적을 잡으려는 검사인데,
    // 언론사 원문 주소에도 흔히 들어 있어(forbeskorea.co.kr/…/articleView.html)
    // 구분하지 않으면 정상을 결함으로 잡는다.
    const ownHtml = own.filter((u) => u.includes('.html'));
    if (ownHtml.length) bad(`llms.txt의 자사 링크에 .html이 남아 있다 — ${ownHtml.join(', ')}`);
    if (!body.includes('2026 소비자 선정 최고의 브랜드 대상')) {
      bad('llms.txt의 수상명이 실제와 다르다');
    }
  }
}

/* ── 4. 구조화 데이터 ── */
console.log('\n══ 구조화 데이터 ══');
{
  const need = {
    '/': ['Organization', 'WebSite', 'Service', 'LocalBusiness'],
    '/about': ['BreadcrumbList'],
    '/siot': ['SoftwareApplication', 'BreadcrumbList'],
    '/faq': ['FAQPage', 'BreadcrumbList'],
    '/news': ['BreadcrumbList'],
    '/contact': ['BreadcrumbList'],
    '/solutions/smart-office': ['Service', 'FAQPage', 'BreadcrumbList'],
    '/solutions/ai-building-bms': ['Service', 'FAQPage', 'BreadcrumbList'],
  };
  for (const [route, types] of Object.entries(need)) {
    const { body } = await text(BASE + route);
    const blocks = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    let parsed = 0;
    const found = new Set();
    for (const b of blocks) {
      try {
        const d = JSON.parse(b[1]);
        parsed++;
        JSON.stringify(d).replace(/"@type":"([^"]+)"/g, (_, t) => found.add(t));
      } catch (e) {
        bad(`${route} JSON-LD 파싱 실패: ${e.message}`);
      }
    }
    const missing = types.filter((t) => !found.has(t));
    if (missing.length) bad(`${route} — ${missing.join(', ')} 없음`);
    else ok(`${route}  블록 ${parsed}개 · ${types.join(', ')}`);
  }
}

/* ── 5. 부속 파일 ── */
console.log('\n══ 부속 파일 ══');
for (const [path, wantType] of [
  ['/robots.txt', 'text/plain'],
  ['/sitemap.xml', 'xml'],
  ['/rss.xml', 'rss'],
  ['/manifest.webmanifest', 'json'],
  ['/img/og-image.png', 'image/png'],
]) {
  const res = await fetch(BASE + path, { redirect: 'follow' });
  if (res.status !== 200) bad(`${path} HTTP ${res.status}`);
  else if (!(res.headers.get('content-type') || '').includes(wantType)) {
    bad(`${path} content-type이 ${res.headers.get('content-type')}`);
  } else ok(`${path}`);
}

console.log(fail === 0 ? '\n✓ 전부 통과' : `\n✗ 문제 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
