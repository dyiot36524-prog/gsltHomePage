/**
 * 디자인 검토용 스크린샷 캡처.
 *
 * chrome --headless --screenshot 은 --window-size 를 레이아웃 폭으로 반영하지 않아
 * 모바일 캡처가 실제보다 넓게 그려진 뒤 잘린 이미지가 나온다(리뷰에서 잘못된 증거로 이어졌다).
 * CDP로 뷰포트를 명시적으로 지정해 실제 폭 그대로 찍는다.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3100';
const OUT = path.resolve(process.argv[3] || '../.impeccable/shots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1100, deviceScaleFactor: 2 },
  { name: 'mobile', width: 390, height: 1300, deviceScaleFactor: 2, isMobile: true },
];

const ROUTES = process.env.SHOT_ROUTES
  ? JSON.parse(process.env.SHOT_ROUTES)
  : [
      ['news', '/news'],
      ['portfolio', '/portfolio'],
      ['downloads', '/downloads'],
      ['news-empty', '/news?type=press'],
    ];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  for (const [name, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
    // 지연 로드 이미지가 뷰포트 밖에 있으면 비어 보이므로 한 번 훑고 되돌린다
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    });
    const file = path.join(OUT, `${vp.name}-${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    const flag = w > vp.width ? `  ⚠ 가로 넘침 ${w}px` : '';
    console.log(`  ${vp.name.padEnd(8)} ${route.padEnd(22)} → ${path.basename(file)}${flag}`);
  }
  await page.close();
}

await browser.close();
