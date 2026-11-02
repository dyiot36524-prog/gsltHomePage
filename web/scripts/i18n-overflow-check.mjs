/**
 * 외국어 판 넘침 검사 — 영어·중국어·일본어 페이지를 휴대폰 폭(320·375)과 PC 폭(1280)에서 열어,
 * 가로로 화면 밖으로 넘치는 요소가 있는지 본다. 영어는 한국어보다 길고, 중국어·일본어는 줄바꿈 규칙이 달라
 * 한국어에 맞춰 짠 칸에서 넘치기 쉽다. 넘치는 요소는 선택자와 글자 앞부분을 적는다.
 *
 *   node scripts/i18n-overflow-check.mjs [baseUrl] [shotDir]
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3101').replace(/\/$/, '');
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ROUTES = [
  '', '/about', '/siot', '/siot/meeting-room', '/siot/lounge', '/siot/restroom', '/bizmoa', '/morak',
  '/solutions/smart-office', '/solutions/smart-home', '/solutions/smart-building',
  '/solutions/unmanned-automation', '/solutions/ai-building-bms', '/solutions/ai-office',
  '/news', '/downloads', '/faq', '/contact', '/contact/done', '/support', '/legal/privacy', '/legal/terms',
];
// 한국어도 본다 — 헤더의 언어 고르기 단추는 한국어 페이지에도 붙는다.
const LANGS = ['ko', 'en', 'zh', 'ja'];
const WIDTHS = [320, 375, 1280];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--disable-gpu'] });
const page = await browser.newPage();
let fail = 0;

for (const w of WIDTHS) {
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1, isMobile: w < 768 });
  for (const l of LANGS) {
    for (const r of ROUTES) {
      const url = l === 'ko' ? `${BASE}${r || '/'}` : `${BASE}/${l}${r}`;
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await new Promise((ok) => setTimeout(ok, 700));
      const out = await page.evaluate((vw) => {
        const doc = document.documentElement;
        const over = [];
        if (doc.scrollWidth > vw + 1) over.push({ sel: 'html', w: doc.scrollWidth, text: '' });
        // 화면 밖으로 넘친 글자 요소 — 가로 스크롤 상자(overflow-x auto) 안의 것은 뺀다.
        const scrollers = [...document.querySelectorAll('*')].filter((el) => {
          const s = getComputedStyle(el);
          return /(auto|scroll|hidden|clip)/.test(s.overflowX) && el !== doc && el !== document.body;
        });
        for (const el of document.querySelectorAll('body *')) {
          if (!el.childNodes.length || el.closest('svg,video,canvas,[aria-hidden="true"],[hidden],[inert]')) continue;
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!hasText) continue;
          const rc = el.getBoundingClientRect();
          if (rc.width === 0 || rc.height === 0) continue;
          if (rc.right > vw + 1 || rc.left < -1) {
            if (scrollers.some((s) => s.contains(el))) continue;
            const cs = getComputedStyle(el);
            if (cs.visibility === 'hidden' || cs.opacity === '0' || cs.position === 'fixed') continue;
            over.push({ sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''), w: Math.round(rc.right), text: el.textContent.trim().slice(0, 40) });
          }
        }
        return over.slice(0, 5);
      }, w);
      if (![200, 304].includes(res?.status())) { fail++; console.log(`✗ ${w} ${url} HTTP ${res?.status()}`); continue; }
      if (out.length) {
        fail++;
        console.log(`✗ ${w} /${l}${r}: ${out.map((o) => `${o.sel} →${o.w}px '${o.text}'`).join(' | ')}`);
        if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${w}-${l}${r.replace(/\//g, '_') || '_home'}.png`) });
      }
    }
  }
}
await browser.close();
console.log(fail ? `✗ 넘침 ${fail}건` : '✓ 넘침 없음');
process.exit(fail ? 1 : 0);
