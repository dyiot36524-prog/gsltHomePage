/**
 * 첫 진입 스크럽 검사 — "들어오자마자 스크롤"할 때 영상이 따라오는지 본다.
 *
 * scrub-check.mjs는 페이지가 자리를 잡은 뒤를 재기 때문에 이 결함을 놓쳤다.
 * 실제로 사용자가 겪은 문제는 진입 직후 구간이었다: 스크럽은 매 프레임 currentTime을
 * 바꾸는데 그때마다 브라우저가 순차 다운로드를 버리고 그 지점 range를 새로 받는다.
 * 그래서 스크롤을 계속하면 버퍼가 0.35초에서 영원히 자라지 않고 영상이 멈춘 것처럼 보였다.
 * (가만히 두면 1초 만에 다 차는 것과 정반대라, 가만히 두고 재는 검사로는 안 잡힌다.)
 *
 * 그래서 이 검사는 반드시 (1) 콜드 캐시로 (2) 진입 직후부터 스크롤하며 (3) 느린 회선에서
 * 잰다. 판정값은 "스크롤 위치가 요구하는 시점 대비 영상이 몇 초 뒤처졌는가"다.
 *
 *   node scripts/scrub-cold-check.mjs https://<배포주소> [--fast]
 *
 * 로컬(localhost)로 돌리면 지연이 없어 늘 통과한다. 배포본으로 재야 한다.
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'https://gslt-next.vercel.app';
const FAST = process.argv.includes('--fast');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * 판정을 둘로 나눈다.
 *
 * 진입 첫 1초의 스파이크는 물리적 비용이다 — 느린 회선에서 아직 아무 데이터도 없는 파일에
 * 첫 range 요청을 보내고 응답을 받는 시간(4Mbps/40ms에서 0.7~2.4초)은 코드로 줄일 수 없다.
 * 그 구간은 숫자를 찍어 보여주되 실패로 세지 않는다.
 *
 * 우리가 통제하는 건 그 뒤다. 1초가 지나도 계속 뒤처지면 그건 버퍼링이 스크럽에 밀려
 * 영영 못 따라잡고 있다는 뜻이고(이번에 고친 결함이 정확히 그것이었다), 그건 실패다.
 */
const LIMIT = 0.6;
const COLD_MS = 1000;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});

let fail = 0;

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]) {
  const page = await browser.newPage();
  await page.setViewport(vp);

  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }); // 첫 진입 = 콜드 캐시
  if (!FAST) {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 40,
      downloadThroughput: (4 * 1024 * 1024) / 8, // 4Mbps
      uploadThroughput: (1024 * 1024) / 8,
    });
  }

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 45000 });

  const samples = await page.evaluate(async () => {
    const v = document.getElementById('hero-video');
    const track = document.getElementById('hero-track');
    const stage = document.querySelector('.hero-stage');
    if (!v || !track || !stage) return null;
    const out = [];
    const t0 = performance.now();
    await new Promise((r) => setTimeout(r, 300));
    for (let i = 0; i < 70; i++) {
      window.scrollBy(0, 20); // 사람이 굴리는 정도의 보폭
      await new Promise((r) => setTimeout(r, 80));
      if (!v.duration) continue;
      const span = track.offsetHeight - stage.offsetHeight;
      const prog = Math.max(0, Math.min(1, -track.getBoundingClientRect().top / span));
      // Hero의 SCRUB_END(0.6)와 같은 식으로 "이 스크롤 위치가 요구하는 시점"을 구한다
      const want = Math.min(v.duration - 0.03, Math.min(1, prog / 0.6) * v.duration);
      out.push({ t: Math.round(performance.now() - t0), lag: +(want - v.currentTime).toFixed(2) });
    }
    return out;
  });

  if (!samples || !samples.length) {
    fail++;
    console.log(`\n── ${vp.name} ──\n  ✗ 히어로를 찾지 못했거나 duration을 못 얻었다`);
    await page.close();
    continue;
  }

  const avg = (a, b) => {
    const s = samples.filter((x) => x.t >= a && x.t < b).map((x) => Math.abs(x.lag));
    return s.length ? +(s.reduce((p, c) => p + c, 0) / s.length).toFixed(2) : null;
  };
  const coldWorst = Math.max(...samples.filter((x) => x.t < COLD_MS).map((x) => Math.abs(x.lag)), 0);
  const after = samples.filter((x) => x.t >= COLD_MS).map((x) => Math.abs(x.lag));
  const worst = after.length ? Math.max(...after) : 0;

  // 한 샘플만 튀는 것과 계속 뒤처지는 것은 다른 문제다.
  // 파일을 Blob으로 갈아끼우는 순간 video 요소가 리셋돼 한 프레임 남짓 frame 0으로 돌아간다
  // (간헐적, 80ms 샘플 하나 분량). 사람 눈에는 깜빡임이고, 스크럽이 망가진 것은 아니다.
  // 우리가 실패로 세야 하는 건 연속으로 못 따라오는 상태다 — 이번에 고친 결함이 그것이었다.
  let run = 0;
  let sustained = 0;
  for (const lag of after) {
    run = lag > LIMIT ? run + 1 : 0;
    if (run > sustained) sustained = run;
  }
  const SUSTAIN = 3; // 샘플 간격 80ms → 약 0.24초 이상 연속
  const bands = [[0, 2000], [2000, 4000], [4000, 6000], [6000, 1e9]];
  const line = bands
    .map(([a, b]) => {
      const v = avg(a, b);
      return v === null ? null : `${a / 1000}~${b === 1e9 ? '' : b / 1000}초 ${v}s`;
    })
    .filter(Boolean)
    .join(' · ');

  console.log(`\n── ${vp.name}${FAST ? '' : ' · 4G(4Mbps/40ms)'} ──`);
  console.log(`  뒤처짐: ${line}`);
  console.log(`  진입 첫 ${COLD_MS / 1000}초 최악: ${coldWorst.toFixed(2)}s  (첫 range 요청 왕복 — 판정 제외)`);
  console.log(`  이후 최악: ${worst.toFixed(2)}s · 허용치(${LIMIT}s) 초과가 연속 ${sustained}회`);
  if (sustained >= SUSTAIN) {
    fail++;
    console.log(`  ✗ ${SUSTAIN}회 이상 연속으로 뒤처진다 — 버퍼링이 스크럽에 밀리고 있다`);
  } else if (worst > LIMIT) {
    console.log(`  ⓘ 순간 튐 ${sustained}회 — Blob 교체 시점의 리셋으로 보인다(지속되지 않음)`);
  }
  await page.close();
}

await browser.close();
console.log(`\n${fail === 0 ? '✓ 첫 진입 스크럽 정상' : `✗ 문제 ${fail}건`}`);
process.exit(fail === 0 ? 0 : 1);
