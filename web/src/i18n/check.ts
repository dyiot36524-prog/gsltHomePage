import type { Locale } from './config';

/**
 * 사전 묶음을 만든다 — en · zh · ja가 ko와 모양이 같은지 모듈을 읽을 때 검사한다.
 *
 * 타입(typeof ko)은 키와 글자 여부는 막아도 배열 길이는 모른다. 카드 네 장 중 한 장이 번역에서 빠지면
 * 화면이 소리 없이 한 장 덜 그린다. 그래서 정적 생성 중에 여기서 던져 빌드를 멈춘다(시옷 홈페이지 check.ts와 같은 규칙).
 *   - 키가 같아야 하고, 배열 길이가 같아야 한다.
 *   - 글자의 자리표시({n} 따위)가 같아야 한다.
 *   - id · key · slug · href 값은 코드가 찾는 값이라 번역하지 않는다 — 같아야 한다.
 */
const KEEP = new Set(['id', 'key', 'slug', 'href']);
const holes = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');

function walk(base: unknown, other: unknown, path: string, out: string[]) {
  if (typeof base === 'string') {
    if (typeof other !== 'string') out.push(`${path}: 글자가 아님`);
    else if (holes(base) !== holes(other)) out.push(`${path}: 자리표시 ${holes(base)} ≠ ${holes(other)}`);
    return;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(other) || other.length !== base.length) {
      out.push(`${path}: 배열 길이 ${base.length} ≠ ${Array.isArray(other) ? other.length : '배열 아님'}`);
      return;
    }
    base.forEach((v, i) => walk(v, other[i], `${path}[${i}]`, out));
    return;
  }
  if (base && typeof base === 'object') {
    if (!other || typeof other !== 'object') {
      out.push(`${path}: 객체가 아님`);
      return;
    }
    const b = base as Record<string, unknown>;
    const o = other as Record<string, unknown>;
    for (const k of new Set([...Object.keys(b), ...Object.keys(o)])) {
      if (!(k in o)) out.push(`${path}.${k}: 없음`);
      else if (!(k in b)) out.push(`${path}.${k}: ko에 없는 키`);
      else if (KEEP.has(k) && b[k] !== o[k]) out.push(`${path}.${k}: ${String(b[k])} ≠ ${String(o[k])}`);
      else walk(b[k], o[k], `${path}.${k}`, out);
    }
    return;
  }
  if (typeof base !== typeof other) out.push(`${path}: ${typeof base} ≠ ${typeof other}`);
}

/** 이름(오류 메시지용)과 네 언어 사전 → 검사를 통과한 그대로. */
export function messages<T>(name: string, dicts: Record<Locale, T>): Record<Locale, T> {
  const out: string[] = [];
  for (const l of ['en', 'zh', 'ja'] as const) walk(dicts.ko, dicts[l], `${name}.${l}`, out);
  if (out.length) throw new Error(`[i18n] 사전 모양이 ko와 다릅니다:\n- ${out.join('\n- ')}`);
  return dicts;
}
