/**
 * 감사 P1 중 자동 판정이 가능한 나머지 둘을 실측한다.
 *
 * 1. 히어로 영상이 초기 로드의 임계 경로에서 빠졌는가
 *    — 6~15MB짜리 장식 배경이 load 이벤트 전에 받아지면 첫 화면이 그만큼 늦어진다.
 *      preload="metadata"로 내리고 load 이후 auto로 올리는 게 이번 수정의 내용이므로,
 *      "영상 바이트가 load 이후에 온다"를 요청 시각으로 확인한다.
 * 2. 헤더 메뉴가 아이패드 세로(768~827px)에서 어절 중간에 깨지지 않는가
 *    — 라벨의 렌더 높이가 한 줄 높이를 넘으면 줄바꿈이 일어난 것이다.
 *
 *   node scripts/perf-check.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:3100';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu'],
});
let fail = 0;

// ── 1. 히어로 영상 선다운로드 ──
console.log('── 히어로 영상 로드 시점 ──');
for (const vp of [
  { name: 'mobile', width: 390, height: 844, isMobile: true },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  const page = await browser.newPage();
  await page.setViewport(vp);

  // 요청 건수가 아니라 '바이트'를 센다. preload="metadata"도 duration을 얻으려면
  // moov 헤더를 Range로 조금 받아야 하므로 요청 자체는 반드시 하나 뜬다.
  // 임계 경로에서 빠졌다는 주장의 근거는 "load 전에 받은 양이 작다"여야 한다.
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  const videoIds = new Set();
  let bytesBeforeLoad = 0, bytesTotal = 0, loaded = false;
  cdp.on('Network.requestWillBeSent', (e) => {
    if (/\.mp4(\?|$)/.test(e.request.url)) videoIds.add(e.requestId);
  });
  cdp.on('Network.dataReceived', (e) => {
    if (!videoIds.has(e.requestId)) return;
    bytesTotal += e.encodedDataLength || e.dataLength;
    if (!loaded) bytesBeforeLoad += e.encodedDataLength || e.dataLength;
  });

  const t0 = Date.now();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  loaded = true;
  const loadAt = Date.now() - t0;
  const mb = (b) => (b / 1048576).toFixed(2) + 'MB';
  // load 이후 파일 전체가 실제로 메모리에 올라오는지 본다.
  // preload 승격은 더 이상 쓰지 않는다 — 속성만 바꿔서는 크롬이 다시 받지 않았고,
  // 스크럽 중에는 seek이 순차 다운로드를 계속 끊어 버퍼가 0.35초에서 자라지 않았다.
  // 지금은 fetch로 파일 전체를 따로 받아 Blob URL로 갈아끼운다. 그래서 확인할 것은
  // "preload가 auto가 됐는가"가 아니라 "전 구간이 버퍼에 들어왔는가"다.
  await new Promise((r) => setTimeout(r, 4000));
  const state = await page.evaluate(() => {
    const v = document.getElementById('hero-video');
    if (!v) return { err: 'hero-video 없음' };
    let total = 0;
    for (let i = 0; i < v.buffered.length; i++) total += v.buffered.end(i) - v.buffered.start(i);
    return {
      memoryBacked: v.currentSrc.startsWith('blob:'),
      buffered: +total.toFixed(2),
      duration: Number.isFinite(v.duration) ? +v.duration.toFixed(2) : null,
      seekable: v.seekable.length ? +v.seekable.end(0).toFixed(2) : 0,
    };
  });
  console.log(`  ${vp.name.padEnd(8)} load=${loadAt}ms · load 전 영상 ${mb(bytesBeforeLoad)} / 이후 누적 ${mb(bytesTotal)}`);
  console.log(`           duration=${state.duration}s · 버퍼 ${state.buffered}s · ${state.memoryBacked ? '메모리(Blob)' : '네트워크 스트리밍'}`);
  // Chrome은 preload="metadata"에서도 moov를 찾느라 대략 1MB 청크를 한 번 받는다.
  // 잡아야 하는 실패는 "통째로 받는 것"(모바일 6.22MB / 데스크톱 14.88MB)이므로
  // 청크 경계에서 시비 걸지 않도록 2MB에 선을 긋는다.
  if (bytesBeforeLoad > 2 * 1048576) {
    fail++;
    console.log(`   ✗ load 전에 ${mb(bytesBeforeLoad)}를 받았다 — 여전히 임계 경로에 있다`);
  }
  if (!state.duration) { fail++; console.log('   ✗ duration을 못 얻었다 — 스크럽이 동작하지 않는다'); }
  // 전 구간이 버퍼에 들어와야 스크럽이 네트워크에서 자유로워진다. duration의 95%를 기준으로 본다.
  if (state.duration && state.buffered < state.duration * 0.95) {
    fail++;
    console.log(`   ✗ 4초가 지나도 버퍼가 ${state.buffered}s/${state.duration}s — 스크럽이 네트워크에 매달린다`);
  }
  if (state.seekable <= 0) { fail++; console.log('   ✗ seekable 구간이 없다 — currentTime 탐색이 불가능하다'); }
  await page.close();
}

// ── 2. 헤더 메뉴 줄바꿈 ──
console.log('\n── 헤더 메뉴 줄바꿈 (아이패드 세로 구간) ──');
for (const width of [768, 800, 827, 1024, 1100]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 1024 });
  await page.goto(BASE + '/about', { waitUntil: 'domcontentloaded' });
  const r = await page.evaluate(() => {
    const links = [...document.querySelectorAll('header a, header button')].filter((el) => {
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && b.width > 0 && el.textContent.trim();
    });
    const wrapped = links.filter((el) => {
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      // 실제 렌더 높이가 한 줄 높이 + 여백을 넘으면 줄이 나뉜 것이다
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      return el.getBoundingClientRect().height > lh + pad + 2;
    }).map((el) => ({ t: el.textContent.trim().slice(0, 10), h: Math.round(el.getBoundingClientRect().height) }));
    return { total: links.length, wrapped, scrollWidth: document.documentElement.scrollWidth };
  });
  const over = r.scrollWidth > width ? `  ⚠ 가로넘침 ${r.scrollWidth}` : '';
  if (r.wrapped.length) {
    fail++;
    console.log(`  ${String(width).padStart(4)}px  ✗ 줄바꿈 ${r.wrapped.length}건: ${r.wrapped.map((w) => `${w.t}(${w.h}px)`).join(', ')}${over}`);
  } else {
    console.log(`  ${String(width).padStart(4)}px  ✓ 항목 ${r.total}개 모두 한 줄${over}`);
  }
  if (over) fail++;
  await page.close();
}

await browser.close();
console.log(fail === 0 ? '\n✓ 전부 통과' : `\n✗ 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
