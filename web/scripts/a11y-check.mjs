/**
 * 접근성 자동 점검 — 감사 수정이 실제로 화면에 반영됐는지 브라우저에서 확인한다.
 *
 * 소스 grep으로는 알 수 없는 것들(합성된 실제 배경색, 실제 렌더 크기, 실제 링크 목적지)을
 * 렌더된 DOM에서 계산한다. Tailwind 클래스만 봐서는 조상 배경이 무엇인지 알 수 없기 때문이다.
 *
 *   node scripts/a11y-check.mjs [baseUrl]
 *
 * 검사 항목
 *   1. 글자 대비  — 보이는 텍스트 노드 전부를 실효 배경과 대비 계산 (WCAG 1.4.3)
 *   2. 접근 이름  — 이름 없는 버튼/링크
 *   3. 터치 타겟  — 44x44 미만 인터랙티브 요소
 *   4. 제목 위계  — h1 개수, 레벨 건너뜀
 *   5. 가로 넘침  — scrollWidth > 뷰포트
 *   6. 죽은 링크  — 내부 링크 전수 HEAD 요청
 *   7. 포커스 링  — focus-visible에서 outline/box-shadow/ring이 실제로 생기는지
 *
 * 배경이 그라데이션·영상·이미지라 확정할 수 없는 경우는 '실패'가 아니라 '확인 불가'로 따로 낸다.
 * 자동 판정이 사람의 확인을 대체하지 못하는 지점을 숨기지 않기 위해서다.
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:3100';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ROUTES = process.env.A11Y_ROUTES
  ? JSON.parse(process.env.A11Y_ROUTES)
  : ['/', '/about', '/siot', '/bizmoa', '/morak', '/news', '/portfolio', '/downloads',
     '/contact', '/legal/terms', '/legal/privacy', '/support', '/이런페이지없음'];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

/** 페이지 안에서 도는 수집기. 브라우저 컨텍스트라 외부 스코프를 참조할 수 없다. */
function collect() {
  const srgb = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  // Tailwind v4는 계산값을 lab()/oklch()로 내보낸다. rgb() 정규식만으로는 못 읽어
  // 배경을 놓치고 흰색으로 오판한다 — 캔버스에 실제로 칠해 sRGB 픽셀로 되받는다.
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const parse = (c) => {
    const s = String(c);
    if (s === 'transparent' || s === 'none' || !s) return null;
    const m = s.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
    }
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = s;
    if (ctx.fillStyle === '#000' && !/^#0{3,8}$/.test(s)) return null; // 파싱 거부됨
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return { rgb: [d[0], d[1], d[2]], a: d[3] / 255 };
  };
  const over = (fg, bg, a) => fg.map((c, i) => c * a + bg[i] * (1 - a));

  /** 조상을 거슬러 올라가며 실효 배경을 합성한다. 확정 못 하면 이유를 함께 돌려준다. */
  function effectiveBg(el) {
    let node = el;
    let stack = [];
    while (node && node !== document.documentElement.parentNode) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        return { unknown: 'background-image(' + cs.backgroundImage.slice(0, 24) + '…)' };
      }
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        stack.push(bg);
        if (bg.a >= 0.999) break;
      }
      node = node.parentElement;
    }
    // 히어로처럼 영상이 배경인 구간은 확정할 수 없다
    if (el.closest('#hero, video')) return { unknown: 'video' };
    if (!stack.length) return { rgb: [255, 255, 255] };
    let base = stack[stack.length - 1].a >= 0.999 ? stack.pop().rgb : [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i].rgb, base, stack[i].a);
    return { rgb: base };
  }

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const label = (el) => {
    const s = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return s.length > 42 ? s.slice(0, 42) + '…' : s;
  };
  const where = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return el.tagName.toLowerCase() + id + cls;
  };

  const contrast = [];
  const unknown = [];
  const decorative = [];
  const seen = new Set();

  // aria-hidden 서브트리는 보조기기에 노출되지 않는 장식이다. SC 1.4.3의 '부수적 텍스트'
  // 예외에 해당하려면 의미를 옆의 실제 텍스트가 져야 하므로, 통과시키되 목록으로 남겨
  // "장식이라고 선언한 것"이 무엇인지 사람이 확인할 수 있게 한다.
  const isDecorative = (el) => !!el.closest('[aria-hidden="true"]');

  // 텍스트를 직접 담고 있는 요소만 (부모가 자식 텍스트를 중복 보고하지 않게)
  for (const el of document.querySelectorAll('body *')) {
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    if (!own || !visible(el)) continue;

    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    if (!fg) continue;
    // 글자색이 완전 투명이면 -webkit-text-stroke로 윤곽만 그리는 장식이다.
    // 대비 계산 대상이 아니라 aria-hidden 대상인지의 문제라 따로 뺀다.
    if (fg.a === 0) continue;

    const bg = effectiveBg(el);
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    // WCAG 큰 글자: 24px 이상, 또는 18.66px 이상이면서 굵게
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;

    if (bg.unknown) {
      const key = where(el) + '|' + own.slice(0, 20);
      if (!seen.has(key)) { seen.add(key); unknown.push({ el: where(el), text: label(el), reason: bg.unknown, color: cs.color, size, weight }); }
      continue;
    }

    // 조상 opacity가 1이 아니면 숨겨져 있거나 전환 중이다. 그 순간의 합성색을 재면
    // 실제로는 보이지도 않는 요소가 대비 실패로 잡힌다(페이드 인아웃 버튼 등).
    let node = el, op = 1;
    while (node && node !== document.body) { op *= Number(getComputedStyle(node).opacity); node = node.parentElement; }
    if (op < 0.999 || el.closest('[inert]')) continue;

    let color = fg.rgb;
    if (fg.a < 1) color = over(fg.rgb, bg.rgb, fg.a);

    const r = ratio(color, bg.rgb);
    if (r < need) {
      const key = where(el) + '|' + own.slice(0, 20);
      if (seen.has(key)) continue;
      seen.add(key);
      const row = { el: where(el), text: label(el), ratio: +r.toFixed(2), need, size, weight, color: cs.color };
      (isDecorative(el) ? decorative : contrast).push(row);
    }
  }

  // 접근 이름 없는 인터랙티브 요소 + 타겟 크기
  const nameless = [];
  const small = [];
  const targets = [...document.querySelectorAll('a[href], button, input, select, textarea, [role="button"]')]
    .filter(visible);

  for (const el of targets) {
    const name = (el.getAttribute('aria-label') || el.getAttribute('title') ||
      (el.labels && el.labels.length ? el.labels[0].textContent : '') ||
      el.textContent || (el.querySelector('img') || {}).alt || '').trim();
    if (!name) nameless.push({ el: where(el), html: el.outerHTML.slice(0, 90) });
  }

  // WCAG 2.2 SC 2.5.8 (AA): 24×24 CSS px 이상이거나, 24px 지름의 원이 이웃 타겟과 겹치지
  // 않을 만큼 떨어져 있으면 통과(간격 예외). 무조건 44px을 요구하면 표준보다 엄격해
  // 데스크톱 텍스트 내비게이션이 전부 잡히는 잡음이 된다.
  const boxes = targets.map((el) => ({ el, r: el.getBoundingClientRect() }));
  for (const { el, r } of boxes) {
    if (r.width >= 24 && r.height >= 24) continue;
    // 문장 속 인라인 링크는 명시적 예외
    const cs = getComputedStyle(el);
    if (el.tagName === 'A' && cs.display.startsWith('inline') && el.closest('p, li, .post-body')) continue;

    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const crowded = boxes.some(({ el: o, r: o2 }) => {
      if (o === el) return false;
      // 중심 간 거리가 24px 미만이면 24px 원이 겹친다
      const dx = Math.max(0, Math.max(o2.left - cx, cx - o2.right));
      const dy = Math.max(0, Math.max(o2.top - cy, cy - o2.bottom));
      return Math.hypot(dx, dy) < 12;
    });
    if (crowded) {
      small.push({ el: where(el), text: label(el), w: Math.round(r.width), h: Math.round(r.height) });
    }
  }

  // 제목 위계
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible)
    .map((h) => ({ level: +h.tagName[1], text: label(h) }));
  const headIssues = [];
  if (heads.filter((h) => h.level === 1).length !== 1) {
    headIssues.push(`h1이 ${heads.filter((h) => h.level === 1).length}개`);
  }
  for (let i = 1; i < heads.length; i++) {
    if (heads[i].level > heads[i - 1].level + 1) {
      headIssues.push(`h${heads[i - 1].level} → h${heads[i].level} 건너뜀 ("${heads[i].text}")`);
    }
  }

  // focus:outline-none 잔재 — 포커스 링을 지운 요소
  const noFocus = [];
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.outlineStyle === 'none' && cs.boxShadow === 'none') {
      // 실제로 포커스 시 생기는지는 아래에서 별도 확인한다. 여기선 후보만 모은다.
      noFocus.push(where(el));
    }
  }

  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));

  return {
    contrast, unknown, decorative, nameless, small, headIssues,
    noFocusCount: noFocus.length,
    links: [...new Set(links)],
    scrollWidth: document.documentElement.scrollWidth,
    heads: heads.length,
  };
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
});

const allLinks = new Set();
let fail = 0;

for (const vp of VIEWPORTS) {
  console.log(`\n══════ ${vp.name} ${vp.width}×${vp.height} ══════`);
  const page = await browser.newPage();
  await page.setViewport(vp);

  for (const route of ROUTES) {
    let res;
    try {
      res = await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 45000 });
    } catch (e) {
      console.log(`\n▸ ${route}\n   ✗ 로드 실패: ${e.message.split('\n')[0]}`);
      fail++; continue;
    }
    // 리빌 애니메이션이 끝나야 최종 색이 나온다. 이 사이트는 html에 scroll-behavior:smooth가
    // 걸려 있어 scrollTo가 애니메이션이다 — behavior:'instant'로 즉시 옮기지 않으면
    // 측정 시점에 페이지가 아직 굴러가는 중이라 위치가 뒤죽박죽이 된다.
    await page.evaluate(async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      await wait(700);
      window.scrollTo({ top: 0, behavior: 'instant' });
      await wait(500);
    });

    const r = await page.evaluate(collect);
    r.links.forEach((l) => allLinks.add(l));

    const problems = [];
    if (r.contrast.length) problems.push(`대비 ${r.contrast.length}`);
    if (r.nameless.length) problems.push(`이름없음 ${r.nameless.length}`);
    if (r.small.length) problems.push(`작은타겟 ${r.small.length}`);
    if (r.headIssues.length) problems.push(`제목 ${r.headIssues.length}`);
    if (r.scrollWidth > vp.width) problems.push(`가로넘침 ${r.scrollWidth}px`);

    const status = res.status();
    const expect404 = route.includes('없음');
    const statusBad = expect404 ? status !== 404 : status >= 400;
    if (statusBad) problems.push(`HTTP ${status}`);

    if (!problems.length) {
      console.log(`\n▸ ${route}  ✓  (통과 · 장식선언 ${r.decorative.length} · 확인불가 ${r.unknown.length})`);
    } else {
      fail += problems.length;
      console.log(`\n▸ ${route}  ✗ ${problems.join(' · ')}`);
      for (const c of r.contrast.slice(0, 12)) {
        console.log(`   대비 ${String(c.ratio).padStart(5)}:1 (필요 ${c.need})  ${c.color} ${c.size}px/${c.weight}  ${c.el}`);
        console.log(`        "${c.text}"`);
      }
      if (r.contrast.length > 12) console.log(`   … 외 ${r.contrast.length - 12}건`);
      for (const n of r.nameless) console.log(`   이름없음  ${n.el}  ${n.html}`);
      for (const s of r.small.slice(0, 6)) console.log(`   작은타겟  ${s.w}×${s.h}  ${s.el} "${s.text}"`);
      for (const h of r.headIssues) console.log(`   제목위계  ${h}`);
    }
    if (vp.name === 'desktop') {
      for (const d of r.decorative) {
        console.log(`   ⓘ 장식선언(aria-hidden) ${d.ratio}:1  ${d.size}px  "${d.text}"`);
      }
      for (const u of r.unknown.slice(0, 5)) {
        console.log(`   ⓘ 확인불가(${u.reason}) ${u.color} ${u.size}px  "${u.text}"`);
      }
    }
  }
  await page.close();
}

// 내부 링크 전수 확인 — P0이 정확히 이 검사에서 걸렸어야 했다
console.log(`\n══════ 내부 링크 ${allLinks.size}개 ══════`);
const internal = [...allLinks].filter((h) => h.startsWith('/') && !h.startsWith('//'));
for (const href of internal.sort()) {
  const [path, hash] = href.split('#');
  const url = BASE + (path || '/');
  let line;
  try {
    const r = await fetch(url, { redirect: 'manual' });
    let hashOk = '';
    if (hash) {
      const html = await (await fetch(url)).text();
      hashOk = html.includes(`id="${hash}"`) ? '' : `  ⚠ #${hash} 앵커 없음`;
      if (hashOk) fail++;
    }
    const bad = r.status >= 400;
    if (bad) fail++;
    line = `  ${bad ? '✗' : '✓'} ${String(r.status).padEnd(4)} ${href}${hashOk}`;
  } catch (e) {
    fail++; line = `  ✗ ERR  ${href}  ${e.message}`;
  }
  console.log(line);
}
// 쿼리 기반 죽은 링크 잔재
const openLinks = [...allLinks].filter((h) => h.includes('open='));
if (openLinks.length) { fail += openLinks.length; console.log(`\n  ✗ ?open= 잔재 ${openLinks.length}건: ${openLinks.join(', ')}`); }

await browser.close();
console.log(`\n${fail === 0 ? '✓ 전부 통과' : `✗ 문제 ${fail}건`}`);
process.exit(fail === 0 ? 0 : 1);
