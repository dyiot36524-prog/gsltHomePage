/**
 * 히어로 스크럽 회귀 검사.
 *
 * 영상 preload를 auto → metadata로 내려 초기 로드에서 뺐다. 그 대가로 버퍼가 얇아지므로
 * "스크롤에 따라 프레임이 실제로 바뀌는가"가 깨지지 않았는지 확인해야 한다.
 * currentTime 대입 후 seeked까지의 지연과, 실제로 그려진 화면이 달라지는지를 함께 본다.
 *
 * **배포본 URL로 돌려야 한다.** localhost는 지연이 없어 버퍼가 비어 있어도 탐색이 빨라,
 * 실제로는 끊기는 상태가 로컬에서는 멀쩡하게 나온다. 실제로 그렇게 한 번 놓쳤다.
 *
 *   node scripts/scrub-check.mjs https://<배포주소>
 */
import puppeteer from 'puppeteer-core';
import { createHash } from 'node:crypto';

const BASE = process.argv[2] || 'http://localhost:3100';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'],
});
let fail = 0;

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]) {
  console.log(`\n── ${vp.name} ──`);
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(BASE + '/', { waitUntil: 'load' });

  // 파일 전체가 메모리(Blob)로 올라올 때까지 기다린다. 고정 시간만 두면 회선 사정에 따라
  // 아직 스트리밍 중인 순간에 재게 되고, 그때는 첫 탐색만 1초씩 걸려 통과·실패가 뒤집힌다.
  // 이 검사가 보려는 건 "자리 잡은 뒤의 스크럽"이고, 진입 직후는 scrub-cold-check가 맡는다.
  await page
    .waitForFunction(
      () => {
        const v = document.getElementById('hero-video');
        return !!v && v.currentSrc.startsWith('blob:') && v.readyState >= 2;
      },
      { timeout: 30000, polling: 250 },
    )
    .catch(() => {}); // 못 기다려도 계속 진행한다 — 그 자체가 결함이면 아래 수치가 잡는다
  await new Promise((r) => setTimeout(r, 400));

  // 탐색 지연 실측
  const seek = await page.evaluate(async () => {
    const v = document.getElementById('hero-video');
    if (!v || !Number.isFinite(v.duration)) return { err: 'duration 없음' };
    const times = [];
    for (let i = 1; i <= 8; i++) {
      const t = (v.duration * i) / 9;
      const t0 = performance.now();
      v.currentTime = t;
      await new Promise((res) => {
        const done = () => { v.removeEventListener('seeked', done); res(); };
        v.addEventListener('seeked', done);
        setTimeout(done, 3000);
      });
      times.push(+(performance.now() - t0).toFixed(1));
    }
    v.currentTime = 0;
    return { times, duration: +v.duration.toFixed(2) };
  });
  if (seek.err) { fail++; console.log(`  ✗ ${seek.err}`); await page.close(); continue; }
  const worst = Math.max(...seek.times);
  const avg = (seek.times.reduce((a, b) => a + b, 0) / seek.times.length).toFixed(1);
  console.log(`  탐색 8회: 평균 ${avg}ms · 최악 ${worst}ms  [${seek.times.join(', ')}]`);
  // 버퍼가 차 있으면 탐색은 10~25ms다. 100ms를 넘는다는 건 버퍼가 비어 매 탐색이 네트워크로
  // 나간다는 뜻이고, 그 상태로는 스크롤에 그림이 붙지 않는다. 400ms처럼 느슨하게 잡으면
  // 실제로 끊기는 상태가 통과로 나온다(415ms 회귀를 한 번 놓쳤다).
  if (worst > 100) { fail++; console.log(`  ✗ 최악 탐색이 ${worst}ms — 버퍼가 비어 스크럽이 끊긴다`); }

  // 스크롤에 따라 실제로 다른 프레임이 그려지는가 (화면 해시 비교)
  const track = await page.evaluate(() => document.getElementById('hero-track')?.offsetHeight || 0);
  // 스크럽 구간 안에서만 표본을 잡는다. 진행도 0.6에서 영상이 끝나므로 그보다 뒤는
  // 어디를 찍어도 같은 마지막 화면이 나오는 게 정상이고, 그걸 '멈췄다'로 읽으면 오판이다.
  // 트랙 높이 대비 진행도는 p = frac * H / (H - stage) 라 여유를 두고 앞쪽을 쓴다.
  const shots = [];
  for (const frac of [0, 0.08, 0.16, 0.26]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(track * frac));
    await new Promise((r) => setTimeout(r, 700));
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 700) } });
    shots.push({ frac, hash: createHash('sha1').update(buf).digest('hex').slice(0, 10),
      t: await page.evaluate(() => +document.getElementById('hero-video').currentTime.toFixed(2)) });
  }
  console.log('  스크롤 → currentTime: ' + shots.map((s) => `${s.frac}→${s.t}s`).join('  '));
  const distinct = new Set(shots.map((s) => s.hash)).size;
  console.log(`  화면 스냅샷 ${shots.length}개 중 서로 다른 것 ${distinct}개`);
  if (distinct < shots.length) { fail++; console.log('  ✗ 스크롤해도 같은 화면 — 스크럽이 멈춰 있다'); }
  const advancing = shots.every((s, i) => i === 0 || s.t >= shots[i - 1].t);
  if (!advancing) { fail++; console.log('  ✗ currentTime이 스크롤 방향대로 진행하지 않는다'); }
  if (shots[shots.length - 1].t <= shots[0].t) { fail++; console.log('  ✗ 스크롤 끝에서도 영상이 진행하지 않았다'); }

  await page.close();
}

await browser.close();
console.log(fail === 0 ? '\n✓ 스크럽 정상' : `\n✗ 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
