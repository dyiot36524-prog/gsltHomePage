/**
 * 회사소개 영상 (서버 전용).
 *
 * 관리자 '회사소개 영상' 탭이 Firestore `settings/aboutVideos` 문서 하나에 목록을 쓴다.
 * 컬렉션이 아니라 settings 문서인 이유는 셋이다 — settings는 이미 "누구나 읽고 관리자만
 * 쓰는" 규칙이 있어 규칙을 다시 게시할 필요가 없고, 배열 순서가 곧 노출 순서라 순서를
 * 한 번에 저장할 수 있고, 한 번의 GET으로 끝난다.
 *
 * 관리자 화면이 이미 검증하지만 **여기서 한 번 더 거른다.** 문서는 관리자 계정이면 어떤
 * 도구로든 쓸 수 있고, 여기서 나간 주소는 그대로 방문자 브라우저의 iframe·video가 된다.
 * 영상 ID는 형식으로, 파일·표지는 우리 Cloudinary 경로로만 받는다.
 */

import 'server-only';
import { API_KEY, PROJECT_ID, decode, type FsValue } from './posts';

export type VideoCategory = 'intro' | 'site' | 'demo' | 'press';

const CATEGORY_LABEL: Record<VideoCategory, string> = {
  intro: '회사 소개',
  site: '시공 현장',
  demo: '제품 시연',
  press: '언론·행사',
};

/** 화면이 바로 쓰는 모양. 주소는 전부 서버에서 완성해 넘긴다. */
export type AboutVideo = {
  id: string;
  kind: 'youtube' | 'file';
  title: string;
  description: string;
  categoryLabel: string;
  /** 'YYYY. MM. DD' 또는 '' */
  dateLabel: string;
  /** 세로 영상(Shorts·세로 촬영). 16:9 판 가운데에 9:16으로 앉힌다. */
  vertical: boolean;
  /** 표지. 없으면 '' — 화면이 어두운 판과 재생 단추만 그린다. */
  poster: string;
  /* youtube */
  youtubeId: string;
  start: number;
  /** 외부 채널 영상일 때 출처 표기 */
  channel: string;
  /** 'YouTube에서 보기' 링크 */
  watchUrl: string;
  /* file */
  src: string;
  /** 초. 모르면 0 */
  duration: number;
};

const MAX_ITEMS = 12;
const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const CLOUD = 'https://res.cloudinary.com/r9pnckwj';
const VIDEO_PREFIX = `${CLOUD}/video/upload/`;
const IMAGE_PREFIX = `${CLOUD}/image/upload/`;
// 경로에 쓸 수 있는 글자만. 쿼리·따옴표·공백이 끼면 버린다.
const SAFE_PATH = /^[A-Za-z0-9_\-./,]+$/;
/** Cloudinary 무료 요금제는 40MB를 넘는 영상을 즉석 변환하지 못한다. 넘으면 원본을 그대로 쓴다. */
const TRANSFORM_MAX = 40 * 1024 * 1024;

const THUMBS = new Set(['maxresdefault', 'sddefault', 'hqdefault']);

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0;
}

function cloudPath(u: unknown, prefix: string): string {
  const s = typeof u === 'string' ? u.trim() : '';
  if (!s.startsWith(prefix)) return '';
  return SAFE_PATH.test(s.slice(prefix.length)) ? s : '';
}

/** Cloudinary 주소의 upload/ 뒤에 변환을 끼운다. */
function withTransform(url: string, prefix: string, t: string): string {
  return prefix + t + '/' + url.slice(prefix.length);
}

function dateLabel(v: unknown): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof v === 'string' ? v : '');
  return m ? `${m[1]}. ${m[2]}. ${m[3]}` : '';
}

function toVideo(raw: unknown): AboutVideo | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  // 비공개는 페이지에서 뺀다. 값이 없으면 공개로 본다(관리자 화면의 기본값과 같다).
  if (r.published === false) return null;

  const title = str(r.title, 80);
  if (!title) return null;
  const category = (
    Object.prototype.hasOwnProperty.call(CATEGORY_LABEL, String(r.category)) ? r.category : 'intro'
  ) as VideoCategory;

  const base = {
    id: str(r.id, 40) || title,
    title,
    description: str(r.description, 200),
    categoryLabel: CATEGORY_LABEL[category],
    dateLabel: dateLabel(r.date),
    vertical: r.vertical === true,
    youtubeId: '',
    start: 0,
    channel: '',
    watchUrl: '',
    src: '',
    duration: 0,
  };
  const customPoster = cloudPath(r.poster, IMAGE_PREFIX);
  const poster = customPoster ? withTransform(customPoster, IMAGE_PREFIX, 'f_auto,q_auto,w_1600,c_limit') : '';

  if (r.kind === 'youtube') {
    const id = typeof r.youtubeId === 'string' ? r.youtubeId : '';
    if (!YT_ID.test(id)) return null;
    const start = Math.min(Math.floor(num(r.start)), 86400);
    const thumb = THUMBS.has(String(r.thumb)) ? String(r.thumb) : 'hqdefault';
    return {
      ...base,
      kind: 'youtube',
      youtubeId: id,
      start,
      channel: str(r.channel, 60),
      poster: poster || `https://i.ytimg.com/vi/${id}/${thumb}.jpg`,
      watchUrl: base.vertical
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ''}`,
    };
  }

  if (r.kind === 'file') {
    const url = cloudPath(r.fileUrl, VIDEO_PREFIX);
    if (!url) return null;
    const bytes = num(r.bytes);
    // 작은 파일은 기기에 맞는 화질로 줄여 보낸다. 큰 파일은 변환이 안 되므로 원본 그대로.
    const small = bytes > 0 && bytes <= TRANSFORM_MAX;
    const src = small ? withTransform(url, VIDEO_PREFIX, 'q_auto').replace(/\.(mov|webm|mkv)$/i, '.mp4') : url;
    // 표지를 따로 올리지 않았으면 영상의 1초 장면을 쓴다. 큰 파일은 그것도 만들 수 없다.
    const frame = small
      ? withTransform(url, VIDEO_PREFIX, 'so_1,f_jpg,q_auto,w_1280,c_limit').replace(/\.[A-Za-z0-9]+$/, '.jpg')
      : '';
    return {
      ...base,
      kind: 'file',
      src,
      duration: Math.round(num(r.duration)),
      poster: poster || frame,
    };
  }

  return null;
}

/**
 * 공개 영상 목록. 구역이 꺼져 있거나, 문서가 없거나, 읽기에 실패하면 빈 배열 —
 * 회사소개는 영상 구역 없이 지금처럼 그려진다. 영상 때문에 페이지가 깨지면 안 된다.
 */
export async function getAboutVideos(): Promise<AboutVideo[]> {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
        `/databases/(default)/documents/settings/aboutVideos?key=${API_KEY}`,
      // 게시글·메뉴와 같은 60초. 관리자 화면도 "1분 안에 반영"이라고 안내한다.
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const doc = (await res.json()) as { fields?: Record<string, FsValue> };
    if (decode(doc.fields?.enabled) === false) return [];
    const items = decode(doc.fields?.items);
    if (!Array.isArray(items)) return [];
    return items.map(toVideo).filter((v): v is AboutVideo => v !== null).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}
