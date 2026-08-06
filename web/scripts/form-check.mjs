/**
 * 문의 폼 상태 검사 — 전송 중 / 실패 / 접수 완료가 사용자에게 실제로 어떻게 보이는가.
 *
 * 성공 경로를 진짜로 태우면 운영 수신함에 테스트 문의가 남고 관리자에게 메일이 나간다.
 * 그래서 네트워크 응답만 가로채 서버가 각각의 답을 돌려줬을 때 화면이 어떻게 되는지 본다.
 * 검증 대상은 서버가 아니라 클라이언트의 상태 처리다 — 서버 쪽은 route handler가 따로 검증된다.
 *
 *   node scripts/form-check.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:3100';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// tel은 안내에 전화번호가 몇 번 나와야 하는지다. 사용자가 스스로 고칠 수 있는 400에
// "전화하세요"를 붙이면 잘못된 안내고, 서버 메시지에 이미 번호가 있는데 또 붙이면 중복이다.
const CASES = [
  { name: '접수 완료(200)', status: 200, body: { ok: true },
    expect: /접수|완료|연락/, expectCleared: true, tel: 0 },
  { name: '입력 오류(400)', status: 400, body: { ok: false, message: '이메일 형식을 확인해 주세요.' },
    expect: /이메일 형식/, expectCleared: false, tel: 0 },
  { name: '전송 실패(502)', status: 502, body: { ok: false, message: '전송에 실패했습니다. 070-4659-4804 또는 gs7078103107@gmail.com 으로 직접 연락해 주세요.' },
    expect: /070-4659-4804|직접 연락/, expectCleared: false, tel: 1 },
  { name: '과다 요청(429)', status: 429, body: { ok: false, message: '잠시 후 다시 시도해 주세요. 급하시면 070-4659-4804로 연락 주세요.' },
    expect: /잠시 후|다시 시도/, expectCleared: false, tel: 1 },
  { name: '네트워크 끊김', status: 'abort', body: null,
    expect: /네트워크|연결/, expectCleared: false, tel: 1 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu'],
});
let fail = 0;

for (const c of CASES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.url().includes('/api/inquiry') && req.method() === 'POST') {
      // 응답을 늦춰 '전송 중' 상태를 관찰할 시간을 만든다
      setTimeout(() => {
        if (c.status === 'abort') return req.abort('failed');
        req.respond({
          status: c.status,
          contentType: 'application/json',
          body: JSON.stringify(c.body),
        });
      }, 700);
      return;
    }
    req.continue();
  });

  await page.goto(BASE + '/contact', { waitUntil: 'networkidle0' });

  const fill = async () => {
    const inputs = await page.$$('form input, form textarea');
    for (const el of inputs) {
      const info = await el.evaluate((n) => ({ type: n.type, tag: n.tagName }));
      if (info.type === 'checkbox') { await el.click(); continue; }
      if (info.type === 'email') { await el.type('test@example.com'); continue; }
      if (info.tag === 'TEXTAREA') { await el.type('상태 확인용 문의입니다.'); continue; }
      if (info.type === 'text') { await el.type('홍길동'); continue; }
      if (info.type === 'tel') { await el.type('010-0000-0000'); continue; }
    }
  };
  await fill();

  const before = await page.evaluate(() => document.querySelector('form textarea').value);
  await page.click('form button[type="submit"]');

  // 전송 중 상태
  await new Promise((r) => setTimeout(r, 300));
  const mid = await page.evaluate(() => {
    const b = document.querySelector('form button[type="submit"]');
    return { disabled: b.disabled, label: b.textContent.trim(),
      live: document.querySelector('[role="status"]')?.textContent.trim() || '' };
  });

  // 최종 상태
  await new Promise((r) => setTimeout(r, 1400));
  const after = await page.evaluate(() => {
    const b = document.querySelector('form button[type="submit"]');
    return { disabled: b.disabled, label: b.textContent.trim(),
      live: document.querySelector('[role="status"]')?.textContent.trim() || '',
      body: document.querySelector('form textarea').value };
  });

  console.log(`\n▸ ${c.name}`);
  console.log(`   전송 중 : 버튼 ${mid.disabled ? '비활성' : '활성(!)'} "${mid.label}"  안내="${mid.live}"`);
  console.log(`   결과    : 버튼 ${after.disabled ? '비활성' : '활성'} "${after.label}"  안내="${after.live}"`);

  const telCount = (after.live.match(/070-4659-4804/g) || []).length;
  if (telCount !== c.tel) {
    fail++;
    console.log(`   ✗ 안내 속 전화번호가 ${telCount}번 (기대 ${c.tel}번)` +
      (telCount > c.tel ? ' — 중복 안내' : ' — 대체 경로가 필요한데 없다'));
  }
  if (!mid.disabled) { fail++; console.log('   ✗ 전송 중에 버튼이 눌린 채로 남아 중복 제출이 가능하다'); }
  if (!c.expect.test(after.live)) { fail++; console.log(`   ✗ 결과 안내가 기대와 다르다 (기대: ${c.expect})`); }
  if (after.disabled && c.status !== 200) { fail++; console.log('   ✗ 실패했는데 버튼이 잠겨 다시 시도할 수 없다'); }
  if (c.expectCleared && after.body === before) { fail++; console.log('   ✗ 접수 완료인데 입력이 남아 있어 중복 제출을 유도한다'); }
  if (!c.expectCleared && after.body !== before) { fail++; console.log('   ✗ 실패인데 입력이 지워져 사용자가 다시 써야 한다'); }

  await page.close();
}

await browser.close();
console.log(fail === 0 ? '\n✓ 폼 상태 전부 정상' : `\n✗ 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
