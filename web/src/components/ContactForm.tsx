'use client';

import Link from 'next/link';
import { useState } from 'react';
import { COMPANY } from '@/lib/site';
import { ArrowRight } from '@/components/Icon';

/**
 * 상담 신청 폼. 원본 index.html의 문의 모달을 페이지로 옮긴 것이라
 * 필드 구성·문구·관용 정책(하나라도 성공하면 접수 완료)을 그대로 유지한다.
 *
 * 제출만 클라이언트에서 돈다. JS가 없거나 전송이 실패한 방문자를 위해
 * 전화·이메일은 이 폼 밖(서버 렌더된 좌측 열)에 항상 서 있다.
 */

type State = 'idle' | 'sending' | 'sent' | 'error';

/* 기록 면 규칙: 직각·그림자 없음. 테두리는 헤어라인보다 한 단계 진한 slate-300.
   포커스 표시는 사이트 공통 방식(outline-2 + offset)을 따르고, 색만 흰 바탕에서
   5.30:1인 gslt-700로 둔다. 브라우저 기본 포커스 표시를 지우는 유틸리티는 쓰지 않는다. */
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700';

const FIELD =
  'w-full border border-slate-300 bg-white px-4 py-3 text-[0.9375rem] text-slate-900 ' +
  'placeholder-slate-500 transition-colors hover:border-slate-400 ' +
  `focus-visible:border-gslt-700 ${FOCUS}`;

const LABEL = 'block text-[11px] font-bold tracking-[0.14em] text-slate-600 mb-2';

function Required() {
  // 필수 표시는 시각 신호일 뿐이고, 실제 전달은 input의 aria-required가 맡는다.
  return <span className="text-gslt-700" aria-hidden="true"> *</span>;
}

export default function ContactForm() {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // await 이후에는 currentTarget이 비므로 폼 참조를 먼저 붙든다.
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (k: string) => String(data.get(k) ?? '').trim();

    setState('sending');
    setError('');

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: value('name'),
          company: value('company'),
          email: value('email'),
          phone: value('phone'),
          message: value('message'),
        }),
      });
      const body: { message?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 400은 사용자가 고칠 수 있는 입력 문제, 그 외(429·5xx)는 우리 쪽 문제다.
        // 서버 메시지에 이미 연락처가 들어 있으면 아래에서 또 붙이지 않는다.
        const ours = res.status !== 400;
        const message = body.message || '전송에 실패했습니다.';
        setError(message);
        setOfferFallback(ours && !message.includes(COMPANY.tel));
        setState('error');
        return;
      }
      form.reset();
      setState('sent');
    } catch {
      setError('네트워크 연결이 끊겨 전송하지 못했습니다.');
      setOfferFallback(true);
      setState('error');
    }
  }

  const sending = state === 'sending';

  return (
    <form onSubmit={onSubmit} className="pt-8">
      <p className="text-sm text-slate-500 mb-8">
        <span className="text-gslt-700" aria-hidden="true">*</span> 표시는 필수 항목입니다.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={LABEL}>
            이름<Required />
          </label>
          <input
            id="cf-name" name="name" type="text" autoComplete="name"
            required aria-required="true" maxLength={100}
            placeholder="홍길동" className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="cf-company" className={LABEL}>회사명</label>
          <input
            id="cf-company" name="company" type="text" autoComplete="organization"
            maxLength={200} placeholder="(주)예시회사" className={FIELD}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className={LABEL}>
            이메일<Required />
          </label>
          <input
            id="cf-email" name="email" type="email" autoComplete="email"
            required aria-required="true" maxLength={200}
            placeholder="example@company.com" className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={LABEL}>연락처</label>
          <input
            id="cf-phone" name="phone" type="tel" autoComplete="tel"
            maxLength={50} placeholder="010-0000-0000" className={FIELD}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="cf-message" className={LABEL}>
          문의 내용<Required />
        </label>
        <textarea
          id="cf-message" name="message" rows={6}
          required aria-required="true" maxLength={5000}
          placeholder="도입을 검토 중인 솔루션이나 궁금하신 점을 자유롭게 적어주세요."
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
            개인정보 수집·이용에 동의합니다.<Required />
          </label>{' '}
          <Link
            href="/legal/privacy"
            className={`font-medium text-gslt-700 underline underline-offset-4 decoration-gslt-200 hover:decoration-gslt-500 transition-colors ${FOCUS}`}
          >
            처리방침 보기
          </Link>
        </p>
      </div>

      {/* 살아 있는 영역은 항상 DOM에 있어야 상태 변화가 낭독된다.
          상태 막대는 정보를 나르므로 3:1을 넘겨야 한다 — 필터 밑줄(gslt-500)과 달리
          gslt-700(slate-50 위 5.06:1)을 쓴다. */}
      <div role="status" aria-live="polite" className="empty:hidden mt-8">
        {sending ? (
          <p className="border-l-2 border-slate-900 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900">
            전송 중…
          </p>
        ) : null}
        {state === 'sent' ? (
          <div className="border-l-2 border-gslt-700 bg-slate-50 px-5 py-4">
            <p className="text-sm font-bold text-slate-900">상담 신청이 접수되었습니다.</p>
            <p className="mt-1 text-sm text-slate-600">전문가가 24시간 내에 연락드리겠습니다.</p>
          </div>
        ) : null}
        {state === 'error' ? (
          <div className="border-l-2 border-slate-900 bg-slate-50 px-5 py-4">
            <p className="text-sm font-bold text-slate-900 break-keep">{error}</p>
            {/* 숨기지 않고 아예 렌더하지 않는다. display:none으로 남기면 화면에서만 사라지고
                aria-live가 읽어 가는 문자열에는 그대로 남는다. */}
            {offerFallback ? (
              <p className="mt-1 text-sm text-slate-600 break-keep">
                전화{' '}
                <a href={`tel:${COMPANY.tel.replace(/-/g, '')}`} className="font-medium text-gslt-700 underline underline-offset-4">
                  {COMPANY.tel}
                </a>{' '}
                또는 이메일{' '}
                <a href={`mailto:${COMPANY.email}`} className="font-medium text-gslt-700 underline underline-offset-4 break-all">
                  {COMPANY.email}
                </a>
                {' '}로 직접 연락해 주세요.
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
        {sending ? '전송 중…' : '상담 신청 보내기'}
        {sending ? null : (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </button>

      <p className="mt-4 text-sm text-slate-500 break-keep">
        입력하신 정보는 상담 목적으로만 사용됩니다.
      </p>
    </form>
  );
}
