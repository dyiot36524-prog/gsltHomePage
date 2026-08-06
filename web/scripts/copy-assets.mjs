/**
 * 저장소 루트의 img/ 중 **git이 추적하는 파일만** web/public/img/ 로 복사한다.
 *
 * 왜 심볼릭 링크가 아닌가: Vercel 빌드에서 public/ 밖을 가리키는 링크는
 * 정적 자산 수집에서 누락될 수 있다.
 *
 * 왜 전체 복사가 아닌가: 로컬 img/ 에는 .gitignore 처리된 원본 gif·webp가 550MB 넘게 있다.
 * 배포 클론에는 없지만 로컬에서 통째로 복사하면 685MB가 되고 빌드가 느려진다.
 * git 목록을 쓰면 로컬·배포 양쪽에서 "실제 서빙되는 파일"이라는 같은 집합이 된다.
 */
import { cpSync, existsSync, mkdirSync, rmSync, renameSync, lstatSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const src = path.join(repo, 'img');
const dest = path.resolve(here, '../public/img');
// 임시 폴더에 다 채운 뒤 한 번에 바꿔치기한다. dest를 먼저 지우면 dev 서버가 떠 있는 동안
// 그 사이에 들어온 이미지 요청이 404가 난다 (predev로 매번 실행되므로 실제로 발생한다).
const staging = `${dest}.staging`;

if (!existsSync(src)) {
  // web/ 만 업로드하는 배포(CLI 프리뷰)에서는 상위 img/ 가 없다.
  // 그 경우 이미 복사돼 함께 올라온 public/img 를 그대로 쓴다.
  if (existsSync(dest)) {
    console.log(`copy-assets: 상위 img/ 가 없어 기존 ${dest} 를 그대로 사용합니다.`);
    process.exit(0);
  }
  console.error(`copy-assets: 원본을 찾을 수 없습니다 — ${src}`);
  process.exit(1);
}

if (lstatSafe(staging)) rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

const files = trackedFiles();

if (files) {
  for (const rel of files) {
    const from = path.join(repo, rel);
    if (!existsSync(from)) continue;
    const to = path.join(staging, path.relative(src, from));
    mkdirSync(path.dirname(to), { recursive: true });
    cpSync(from, to, { dereference: true });
  }
} else {
  // git 정보가 없는 환경(예: 아카이브 배포) — 있는 그대로 복사한다.
  cpSync(src, staging, { recursive: true, dereference: true });
}

const old = `${dest}.old`;
if (lstatSafe(old)) rmSync(old, { recursive: true, force: true });
if (lstatSafe(dest)) renameSync(dest, old);
renameSync(staging, dest);
if (lstatSafe(old)) rmSync(old, { recursive: true, force: true });

console.log(
  files
    ? `copy-assets: 추적 파일 ${files.length}개 복사 → ${dest}`
    : `copy-assets: git 목록을 쓸 수 없어 전체 복사 → ${dest}`,
);

function trackedFiles() {
  try {
    const out = execFileSync('git', ['ls-files', 'img'], { cwd: repo, encoding: 'utf8' });
    const list = out.split('\n').map((s) => s.trim()).filter(Boolean);
    return list.length ? list : null;
  } catch {
    return null;
  }
}

function lstatSafe(p) {
  try { return lstatSync(p); } catch { return null; }
}
