/**
 * WCAG 대비비 계산기 — 색을 고칠 때 눈이 아니라 숫자로 판정하기 위한 도구.
 *
 *   node scripts/contrast.mjs "#f97316" "#0f172a"        두 색의 대비비
 *   node scripts/contrast.mjs --alpha "#ffffff" 0.4 "#05070c"   반투명 글자의 실제 대비비
 *   node scripts/contrast.mjs --table                    사이트 팔레트 전수 표
 *
 * 기준: WCAG 2.1 1.4.3 — 본문 4.5:1, 굵은 18.66px+/일반 24px+ 큰 글자 3:1.
 */

const TOKENS = {
  white: '#ffffff',
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',
  'gslt-400': '#4cc3d2',
  'gslt-500': '#28b8c5',
  'gslt-600': '#1e93a0',
  'gslt-700': '#1c7682',
  'siot-400': '#fb923c',
  'siot-500': '#f97316',
  'siot-600': '#ea580c',
  'siot-700': '#c2410c',
  'bizmoa-400': '#60a5fa',
  'bizmoa-500': '#3b82f6',
  'bizmoa-600': '#2563eb',
  'bizmoa-700': '#1d4ed8',
  'morak-400': '#2bd4d4',
  'morak-500': '#00c2c2',
  'morak-600': '#00a3a3',
  'morak-700': '#008585',
  footer: '#050505',
  'hero-bg': '#05070c',
};

function parse(hex) {
  const h = String(hex).trim().replace(/^#/, '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`색 형식이 아님: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 반투명 전경을 배경과 합성한 실제 색 */
function composite(fg, bg, alpha) {
  return fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
}

export function ratio(fgHex, bgHex) {
  const a = luminance(parse(fgHex));
  const b = luminance(parse(bgHex));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const resolve = (name) => TOKENS[name] ?? name;
const fmt = (n) => n.toFixed(2);
const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large만' : '실패');

const argv = process.argv.slice(2);

if (argv[0] === '--alpha') {
  const [, fg, alphaRaw, bg] = argv;
  const alpha = Number(alphaRaw);
  const mixed = composite(parse(resolve(fg)), parse(resolve(bg)), alpha);
  const hex = '#' + mixed.map((c) => c.toString(16).padStart(2, '0')).join('');
  const r = ratio(hex, resolve(bg));
  console.log(`${fg} @ ${alpha} on ${bg} → 합성색 ${hex} → ${fmt(r)}:1 (${grade(r)})`);
} else if (argv[0] === '--table') {
  // 사이트에서 실제로 쓰는 바탕 4개에 대해 전 토큰의 대비비를 낸다
  const grounds = ['white', 'footer', 'hero-bg', 'slate-900'];
  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad('token', 14) + grounds.map((g) => pad(g, 16)).join(''));
  for (const [name, hex] of Object.entries(TOKENS)) {
    const row = grounds.map((g) => {
      const r = ratio(hex, TOKENS[g]);
      return pad(`${fmt(r)} ${grade(r)}`, 16);
    });
    console.log(pad(name, 14) + row.join(''));
  }
} else if (argv.length === 2) {
  const r = ratio(resolve(argv[0]), resolve(argv[1]));
  console.log(`${argv[0]} on ${argv[1]} → ${fmt(r)}:1 (${grade(r)})`);
} else {
  console.log(
    '사용법:\n' +
      '  node scripts/contrast.mjs <전경> <배경>\n' +
      '  node scripts/contrast.mjs --alpha <전경> <알파> <배경>\n' +
      '  node scripts/contrast.mjs --table\n' +
      '토큰 이름(slate-500, gslt-700, footer …) 또는 #rrggbb 를 쓴다.'
  );
}
