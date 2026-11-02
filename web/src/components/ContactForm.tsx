'use client';

import Link from 'next/link';
import { DEMO_MARK, SCENE_NAMES, type SceneSlug } from '@/lib/scene-names';
import { DEFAULT_LOCALE, fmt, localePath, type Locale } from '@/i18n/config';
import type { ContactFormMessages } from '@/i18n/messages/contact';
import { readFirstTouch } from '@/lib/traffic-source';
import { Suspense, useEffect, useRef, useState, type RefObject } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { COMPANY } from '@/lib/site';
import { conversions } from '@/lib/analytics';
import { ArrowRight } from '@/components/Icon';

/**
 * 상담 신청 폼. 원본 index.html의 문의 모달을 페이지로 옮긴 것이라
 * 필드 구성·문구·관용 정책(하나라도 성공하면 접수 완료)을 그대로 유지한다.
 * 접수가 되면 /contact/done 으로 옮긴다 — 이 화면에 완료 문구를 띄우지 않는다.
 *
 * 제출만 클라이언트에서 돈다. JS가 없거나 전송이 실패한 방문자를 위해
 * 전화·이메일은 이 폼 밖(서버 렌더된 좌측 열)에 항상 서 있다.
 *
 * 글자는 서버 부모(contact/page.tsx)가 그 언어의 조각(t)으로 넘긴다. 문의함에 저장되는 칸은 언어와
 * 상관없이 같다 — 언어는 접수 API 주소(?lang=)로만 알리고, API는 안내 문구를 그 언어로 돌려준다.
 */

type State = 'idle' | 'sending' | 'error';

/* 기록 면 규칙: 직각·그림자 없음. 테두리는 헤어라인보다 한 단계 진한 slate-300.
   포커스 표시는 사이트 공통 방식(outline-2 + offset)을 따르고, 색만 흰 바탕에서
   5.30:1인 gslt-700로 둔다. 브라우저 기본 포커스 표시를 지우는 유틸리티는 쓰지 않는다. */
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700';

/* 입력란 글자는 휴대폰에서 16px(text-base)이다. iPhone Safari는 16px보다 작은 입력란에 포커스가
   가면 화면을 확대하고, 다 쓴 뒤에도 원래 배율로 돌아오지 않는다. viewport에 maximum-scale을 넣어
   막는 방법은 확대 자체를 빼앗아 접근성 위반이라 쓰지 않는다. md 이상은 원래 크기(15px) 그대로다.
   break-keep은 textarea 안내 문구 때문이다. 없으면 휴대폰 폭에서 '자유롭/게'처럼 어절 중간이 꺾였다. */
const FIELD =
  'w-full border border-slate-300 bg-white px-4 py-3 text-base md:text-[0.9375rem] text-slate-900 break-keep ' +
  'placeholder-slate-500 transition-colors hover:border-slate-400 ' +
  `focus-visible:border-gslt-700 ${FOCUS}`;

const LABEL = 'block text-[11px] font-bold tracking-[0.14em] text-slate-600 mb-2';

/* 이메일 주소는 @ 뒤에서만 줄을 바꾼다(<wbr/>). break-all은 주소를 아무 글자에서나 잘랐다.
   보이는 글자만 나누고 mailto 주소는 그대로 둔다. */
const [EMAIL_USER, EMAIL_DOMAIN] = COMPANY.email.split('@');

function Required() {
  // 필수 표시는 시각 신호일 뿐이고, 실제 전달은 input의 aria-required가 맡는다.
  return <span className="text-gslt-700" aria-hidden="true"> *</span>;
}

type SceneNames = Record<SceneSlug, string>;

/**
 * 시연 신청 미리 채움. 표식과 한국어 장면 이름은 어느 언어에서나 그대로 둔다 — 알림 메일이 표식으로
 * 시연 신청을 알아보고, 직원이 장면 이름을 읽는다. 외국어 판은 방문자가 알아보게 그 언어 이름을 괄호로 붙인다.
 */
function demoMessage(template: string, slug: SceneSlug, local: SceneNames, korean: boolean) {
  const scene = korean ? SCENE_NAMES[slug] : `${SCENE_NAMES[slug]} (${local[slug]})`;
  return fmt(template, { mark: DEMO_MARK, scene });
}

/**
 * 장면 페이지(/siot/*)의 '쇼룸 시연 신청'으로 들어왔을 때의 안내와 미리 채움.
 *
 * 시연 신청을 따로 저장하지 않는다 — 문의함은 정해진 칸만 받는다(firestore.rules). 대신 문의 내용
 * 맨 앞에 표식을 넣어 미리 채운다. 알림 메일이 이 표식으로 시연 신청을 알아보고 제목에 표시한다.
 * 모르는 값이 오면 무시하고 일반 문의로 둔다.
 *
 * 주소를 useSearchParams로 읽는다. /contact?demo=… 에서 헤더의 '도입 문의'(/contact)를 누르면
 * 페이지는 그대로 두고 주소만 바뀌는데, 그때도 안내를 걷고 미리 채운 글을 비워야 일반 문의가
 * 시연 신청으로 잘못 집계되지 않는다. 방문자가 손댄 글은 건드리지 않는다.
 */
function DemoNotice({
  messageRef,
  t,
  sceneNames,
  korean,
}: {
  messageRef: RefObject<HTMLTextAreaElement | null>;
  t: ContactFormMessages['demo'];
  sceneNames: SceneNames;
  korean: boolean;
}) {
  const param = useSearchParams().get('demo') ?? '';
  const slug = Object.prototype.hasOwnProperty.call(SCENE_NAMES, param) ? (param as SceneSlug) : null;

  useEffect(() => {
    const box = messageRef.current;
    if (!box) return;
    const prefills = new Set(
      (Object.keys(SCENE_NAMES) as SceneSlug[]).map((s) => demoMessage(t.message, s, sceneNames, korean)),
    );
    if (!box.value || prefills.has(box.value)) box.value = slug ? demoMessage(t.message, slug, sceneNames, korean) : '';
  }, [slug, messageRef, t.message, sceneNames, korean]);

  if (!slug) return null;
  return (
    <p role="status" className="mb-6 border-l-4 border-gslt-600 bg-slate-50 px-4 py-3 text-sm text-slate-700 break-keep leading-relaxed">
      <strong className="text-slate-900">{t.title}</strong>
      {fmt(t.notice, { scene: sceneNames[slug] })}
    </p>
  );
}

export default function ContactForm({
  locale,
  t,
  tel,
  sceneNames,
}: {
  locale: Locale;
  /** contact[locale].form */
  t: ContactFormMessages;
  /** 화면에 보이는 대표 번호(그 언어의 표기). tel: 링크도 이 값으로 건다 — 외국어 판은 국제 형식이라 해외에서도 걸린다. */
  tel: string;
  /** common[locale].scenes — 시연 안내에 보이는 장면 이름. */
  sceneNames: SceneNames;
}) {
  const korean = locale === DEFAULT_LOCALE;
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');
  /**
   * 대체 연락처를 함께 안내할지.
   *
   * 입력값이 틀려서 돌아온 400에까지 "전화로 연락해 주세요"를 붙이면 잘못된 안내다 —
   * 사용자가 할 일은 이메일 형식을 고치는 것이지 전화를 거는 게 아니다. 서버·네트워크가
   * 죽어 사용자가 스스로 할 수 있는 게 없을 때만 다른 길을 제시한다.
   */
  const [offerFallback, setOfferFallback] = useState(false);
  /**
   * 이 폼이 그려진 시각.
   *
   * 봇은 폼을 읽자마자 제출한다. 사람은 최소 몇 초는 타이핑한다. 서버가 이 간격을 보고
   * 판단한다. useState가 아니라 ref인 이유는 값이 바뀌어도 다시 그릴 필요가 없기 때문이다.
   */
  const startedAt = useRef(Date.now());
  const router = useRouter();
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // await 이후에는 currentTarget이 비므로 폼 참조를 먼저 붙든다.
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (k: string) => String(data.get(k) ?? '').trim();

    setState('sending');
    setError('');

    try {
      // 한국어는 예전 주소 그대로 — API는 lang이 없으면 한국어로 답한다.
      const res = await fetch(korean ? '/api/inquiry' : `/api/inquiry?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: value('name'),
          company: value('company'),
          email: value('email'),
          phone: value('phone'),
          message: value('message'),
          website: value('website'),
          startedAt: startedAt.current,
          source: readFirstTouch(),
        }),
      });
      const body: { message?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 400은 사용자가 고칠 수 있는 입력 문제, 그 외(429·5xx)는 우리 쪽 문제다.
        // 서버 메시지에 이미 연락처가 들어 있으면 아래에서 또 붙이지 않는다.
        const ours = res.status !== 400;
        const message = body.message || t.failed;
        setError(message);
        setOfferFallback(ours && !message.includes(tel));
        setState('error');
        return;
      }
      // 성공하면 이 화면에 남지 않는다. 방금 채운 폼이 텅 빈 채 그대로 있고 아래에
      // 작은 글씨만 바뀌는 화면은 "보내졌나?"를 남긴다. 완료 페이지가 접수 사실과
      // 다음 순서, 갈 곳을 한 번에 말한다. 'sending' 상태는 이동이 끝날 때까지 유지한다.
      conversions.inquirySubmitted('form');
      router.push(localePath(locale, '/contact/done'));
    } catch {
      setError(t.network);
      setOfferFallback(true);
      setState('error');
    }
  }

  const sending = state === 'sending';

  return (
    <form onSubmit={onSubmit} className="pt-8">
      {/* 허니팟. 사람에게는 존재하지 않는 칸이고, 채워져 오면 봇이다.
          `hidden` 속성이나 display:none 대신 화면 밖으로 밀어내는 이유는, 일부 봇이
          숨겨진 필드를 건너뛰기 때문이다. 스크린리더에게는 aria-hidden과 tabIndex로
          없는 것으로 만들고, 브라우저 자동완성도 꺼 둔다. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">{t.honeypot}</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 주소에서 읽는 부분만 따로 감싼다 — 폼 자체는 서버에서 그려진 채 나간다. */}
      <Suspense fallback={null}>
        <DemoNotice messageRef={messageRef} t={t.demo} sceneNames={sceneNames} korean={korean} />
      </Suspense>
      <p className="text-sm text-slate-500 mb-8">
        <span className="text-gslt-700" aria-hidden="true">*</span>
        {t.required}
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={LABEL}>
            {t.name}<Required />
          </label>
          <input
            id="cf-name" name="name" type="text" autoComplete="name"
            required aria-required="true" maxLength={100}
            placeholder={t.namePlaceholder} className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="cf-company" className={LABEL}>{t.company}</label>
          <input
            id="cf-company" name="company" type="text" autoComplete="organization"
            maxLength={200} placeholder={t.companyPlaceholder} className={FIELD}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className={LABEL}>
            {t.email}<Required />
          </label>
          <input
            id="cf-email" name="email" type="email" autoComplete="email"
            required aria-required="true" maxLength={200}
            placeholder={t.emailPlaceholder} className={FIELD}
          />
        </div>
        <div>
          {/* 형식을 강제하지 않는다 — 국제 번호(+1 …, +81 …, +86 …)도 그대로 받는다. 길이만 API가 본다. */}
          <label htmlFor="cf-phone" className={LABEL}>{t.phone}</label>
          <input
            id="cf-phone" name="phone" type="tel" autoComplete="tel"
            maxLength={50} placeholder={t.phonePlaceholder} className={FIELD}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="cf-message" className={LABEL}>
          {t.message}<Required />
        </label>
        <textarea
          id="cf-message" name="message" rows={6} ref={messageRef}
          required aria-required="true" maxLength={5000}
          placeholder={t.messagePlaceholder}
          className={`${FIELD} resize-y leading-relaxed`}
        />
      </div>

      {/* 체크 표시는 accent 색 위에 흰 글리프로 그려진다. gslt-500 위 흰색은 2.40:1이라
          gslt-700(5.30:1)까지 내린다. 링크는 라벨 밖에 둬야 눌렀을 때 체크가 함께 토글되지 않는다. */}
      <div className="mt-6 flex items-start gap-3">
        <input
          id="cf-privacy" name="privacy" type="checkbox"
          required aria-required="true"
          className={`mt-0.5 h-4 w-4 shrink-0 accent-gslt-700 ${FOCUS}`}
        />
        <p className="text-sm text-slate-600 break-keep">
          <label htmlFor="cf-privacy" className="cursor-pointer">
            {t.consent}<Required />
          </label>{' '}
          {/* 링크 문구는 한 덩어리로 줄을 넘긴다 — '처리방침 / 보기'로 갈라지지 않게. */}
          <Link
            href={localePath(locale, '/legal/privacy')}
            className={`whitespace-nowrap font-medium text-gslt-700 underline underline-offset-4 decoration-gslt-200 hover:decoration-gslt-500 transition-colors ${FOCUS}`}
          >
            {t.privacy}
          </Link>
        </p>
      </div>

      {/* 살아 있는 영역은 항상 DOM에 있어야 상태 변화가 낭독된다.
          상태 막대는 정보를 나르므로 3:1을 넘겨야 한다 — 필터 밑줄(gslt-500)과 달리
          gslt-700(slate-50 위 5.06:1)을 쓴다. */}
      <div role="status" aria-live="polite" className="empty:hidden mt-8">
        {sending ? (
          <p className="border-l-2 border-slate-900 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900">
            {t.sending}
          </p>
        ) : null}
        {state === 'error' ? (
          <div className="border-l-2 border-slate-900 bg-slate-50 px-5 py-4">
            <p className="text-sm font-bold text-slate-900 break-keep">{error}</p>
            {/* 숨기지 않고 아예 렌더하지 않는다. display:none으로 남기면 화면에서만 사라지고
                aria-live가 읽어 가는 문자열에는 그대로 남는다. */}
            {offerFallback ? (
              <p className="mt-1 text-sm text-slate-600 break-keep">
                {t.fallback.before}
                <a href={`tel:${tel.replace(/-/g, '')}`} className="whitespace-nowrap font-medium text-gslt-700 underline underline-offset-4">
                  {tel}
                </a>
                {t.fallback.between}
                <a href={`mailto:${COMPANY.email}`} className="font-medium text-gslt-700 underline underline-offset-4">
                  {EMAIL_USER}@<wbr />{EMAIL_DOMAIN}
                </a>
                {t.fallback.after}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className={`group mt-8 inline-flex w-full items-center justify-center gap-2 bg-gslt-500 px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:bg-gslt-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-700 disabled:hover:bg-slate-200 ${FOCUS}`}
      >
        {sending ? t.sending : t.submit}
        {sending ? null : (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </button>

      <p className="mt-4 text-sm text-slate-500 break-keep">{t.note}</p>
    </form>
  );
}
