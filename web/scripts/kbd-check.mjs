/**
 * 키보드 조작 검증 — 헤더 솔루션 드롭다운을 마우스 없이 열고 닫고 이동할 수 있는지.
 *
 * 감사 P1이 "드롭다운을 키보드로 열 수 없다"였으므로, 고쳤다는 주장은 실제 키 입력으로
 * 증명해야 한다. CDP를 직접 쓰는 도구들은 Enter를 눌러도 버튼의 기본 활성화(click 합성)가
 * 일어나지 않는 경우가 있어 판정에 쓸 수 없다. puppeteer의 keyboard는 이 합성을 제대로 한다.
 *
 *   node scripts/kbd-check.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:3100';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE + '/about', { waitUntil: 'networkidle0' });

const state = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim().startsWith('솔루션'));
  if (!b) return { err: '솔루션 버튼 없음' };
  const panel = document.getElementById(b.getAttribute('aria-controls'));
  const a = document.activeElement;
  return {
    expanded: b.getAttribute('aria-expanded'),
    visibility: getComputedStyle(panel).visibility,
    inert: panel.hasAttribute('inert'),
    focus: a === b ? '솔루션버튼' : (a.getAttribute?.('href') || a.tagName),
    focusInPanel: panel.contains(a),
  };
});

const step = async (label, fn) => {
  if (fn) await fn();
  // 패널이 200ms transition을 타므로 전환이 끝난 뒤를 본다.
  // 전환 중간값을 재면 실제로는 정상인 동작이 실패로 보인다.
  await new Promise((r) => setTimeout(r, 320));
  const s = await state();
  console.log(`${label.padEnd(28)} expanded=${String(s.expanded).padEnd(5)} vis=${String(s.visibility).padEnd(7)} inert=${String(s.inert).padEnd(5)} focus=${s.focus}`);
  return s;
};

let fail = 0;
const expect = (cond, msg) => { if (!cond) { fail++; console.log(`   ✗ ${msg}`); } };

console.log('── 마우스를 전혀 쓰지 않고 키보드만으로 ──');

// 커서를 헤더 밖에 두어 hover 경로를 배제한다 (hover로 열리면 키보드 검증이 무의미해진다)
await page.mouse.move(700, 700);

const s0 = await step('초기');
expect(s0.expanded === 'false', '초기 상태가 닫힘이어야 한다');
expect(s0.inert === true, '닫힌 패널은 inert여야 탭 순서에서 빠진다');

// Tab으로 버튼까지 도달
let reached = false;
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab');
  if ((await state()).focus === '솔루션버튼') { reached = true; break; }
}
const s1 = await step(`Tab ×n → 버튼 도달`);
expect(reached, 'Tab만으로 솔루션 버튼에 도달할 수 있어야 한다');
expect(s1.expanded === 'false', '도달만으로 열리면 안 된다');

const s2 = await step('Enter (열기)', () => page.keyboard.press('Enter'));
expect(s2.expanded === 'true', 'Enter로 열려야 한다');
expect(s2.visibility === 'visible', '열린 패널이 보여야 한다');
expect(s2.inert === false, '열린 패널은 inert가 아니어야 한다');

const s3 = await step('Tab (메뉴 안으로)', () => page.keyboard.press('Tab'));
expect(s3.focusInPanel, '열린 뒤 Tab하면 메뉴 안 링크로 들어가야 한다');
expect(s3.expanded === 'true', '메뉴 안으로 들어갔는데 닫히면 안 된다');

const s4 = await step('Escape (닫기)', () => page.keyboard.press('Escape'));
expect(s4.expanded === 'false', 'Escape로 닫혀야 한다');
expect(s4.focus === '솔루션버튼', 'Escape 후 포커스가 버튼으로 돌아와야 한다');
expect(s4.inert === true, '닫힌 뒤 다시 inert여야 한다');

const s5 = await step('Space (다시 열기)', () => page.keyboard.press('Space'));
expect(s5.expanded === 'true', 'Space로도 열려야 한다');

// 메뉴 링크로 실제 이동이 되는지 (키보드만으로 제품 페이지 도달)
await page.keyboard.press('Tab');
await Promise.all([
  page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  page.keyboard.press('Enter'),
]);
const url = page.url();
console.log(`${'Enter (링크 이동)'.padEnd(28)} → ${url}`);
expect(/\/(siot|bizmoa|morak)$/.test(url), '메뉴 링크를 키보드로 실행해 제품 페이지로 가야 한다');

await browser.close();
console.log(fail === 0 ? '\n✓ 키보드 조작 전 항목 통과' : `\n✗ 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
