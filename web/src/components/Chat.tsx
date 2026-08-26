'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@/components/Icon';
import { COMPANY } from '@/lib/site';

/**
 * 홈 히어로 다음에 서는 상담 챗봇.
 *
 * 형태는 Gemini를 따른다 — 큰 인사말, 질문 카드 세 장, 알약 입력창, 답변은 말풍선 없이
 * 지면에 눕고 사용자 말만 회색 말풍선. 색은 GSLT 것을 쓴다. 구글 팔레트를 그대로 쓰면
 * 우리 회사 도구가 아니라 구글 제품처럼 보인다.
 *
 * 우하단 말풍선 버튼으로 만들지 않았다. 그 형태는 광고로 인식돼 잘 안 눌리고, 모바일에서
 * 본문을 가린다. 홈 본문 안 섹션으로 세우고 첫 질문 3개를 미리 보여 준다.
 *
 * 연락처는 먼저 묻지 않는다. 답을 주고 신뢰를 얻은 뒤, 실제 진행 이야기가 나오면 그때
 * 문의 양식을 대화 흐름 안에 낸다. 제출은 기존 /api/inquiry로 가서 관리자 문의함과
 * 메일 알림에 그대로 도착한다 — 수신함이 둘로 갈라지지 않게 하기 위해서다.
 */

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  '3층 사무실인데 배선 공사 없이 IoT 구축이 될까요?',
  '비슷한 규모로 구축한 사례가 있나요?',
  '컨설팅만 먼저 받아볼 수 있나요?',
];

/** 실제 진행에 관한 이야기가 나왔는지. 이때부터 담당자 연결이 의미가 있다. */
const INTENT = /견적|비용|가격|얼마|일정|기간|방문|현장|실측|도입|계약|상담|미팅|연락/;

function wantsHandoff(messages: Msg[]): boolean {
  if (messages.filter((m) => m.role === 'user').length >= 3) return true;
  return messages.some((m) => m.role === 'user' && INTENT.test(m.content));
}

/** 문의 본문에 붙일 대화 기록. 담당자가 맥락을 알고 연락할 수 있어야 한다. */
function transcript(messages: Msg[]): string {
  return messages
    .map((m) => `${m.role === 'user' ? '방문자' : 'AI 안내'}: ${m.content}`)
    .join('\n\n');
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const started = messages.length > 0;

  useEffect(() => {
    if (started) endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [messages, busy, started]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: clean }];
    setMessages(next);
    setInput('');
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        message?: string;
        grounded?: boolean;
      };
      if (!res.ok || !data.ok || !data.reply) {
        setError(data.message || `연결이 원활하지 않습니다. ${COMPANY.tel}로 연락 주세요.`);
        return;
      }
      setMessages([...next, { role: 'assistant', content: data.reply }]);
      // 지식베이스가 비어 있으면 챗봇은 아무것도 모른 채 돈다. 겉보기로는 정상이라
      // 조용히 방치되기 쉬우므로 화면에 드러낸다.
      setNotice(data.grounded === false ? '아직 등록된 회사 자료가 없어 답변이 제한됩니다.' : '');
    } catch {
      setError(`연결이 원활하지 않습니다. ${COMPANY.tel}로 연락 주세요.`);
    } finally {
      setBusy(false);
    }
  }

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const withLog = fd.get('withLog') === 'on';
    const body = {
      name: String(fd.get('name') || ''),
      company: String(fd.get('company') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message:
        String(fd.get('message') || '홈페이지 상담 챗봇을 통한 문의입니다.') +
        (withLog ? `\n\n──── 대화 기록 ────\n${transcript(messages)}` : ''),
    };
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message || `접수에 실패했습니다. ${COMPANY.tel}로 연락 주세요.`);
        return;
      }
      setSent(true);
    } catch {
      setError(`접수에 실패했습니다. ${COMPANY.tel}로 연락 주세요.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"
      aria-labelledby="chat-heading"
    >
      {/* ── 머리 ── */}
      <div className={started ? 'mb-8' : 'mb-10 md:mb-12'}>
        <Sparkle className="w-9 h-9 md:w-11 md:h-11 mb-5" />
        <h2
          id="chat-heading"
          className="text-[2rem] md:text-[2.75rem] font-black tracking-tight leading-[1.15] break-keep bg-gradient-to-r from-gslt-600 to-bizmoa-600 bg-clip-text text-transparent"
        >
          무엇을 도와드릴까요?
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-500 leading-relaxed break-keep max-w-[52ch]">
          공간 조건만 알려주시면 배선 공사 없이 가능한 범위를 안내해 드립니다.
          시공 사례와 컨설팅 절차도 물어보실 수 있습니다.
        </p>
      </div>

      {/* ── 첫 질문 카드 ── */}
      {!started && (
        <ul className="grid gap-3 sm:grid-cols-3 mb-8">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => send(s)}
                disabled={busy}
                className="group h-full w-full text-left rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 p-5 transition-colors disabled:opacity-60"
              >
                <span className="block text-[0.9375rem] font-medium text-slate-700 leading-snug break-keep">
                  {s}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-gslt-700 transition-colors">
                  물어보기
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── 대화 ── */}
      {started && (
        <div className="mb-8 space-y-7" aria-live="polite" aria-atomic="false">
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-slate-100 px-5 py-3.5 text-[0.9375rem] text-slate-800 leading-relaxed break-keep whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="flex gap-4">
                <Sparkle className="w-6 h-6 shrink-0 mt-0.5" />
                <p className="min-w-0 text-[0.9375rem] md:text-base text-slate-700 leading-[1.8] break-keep whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ),
          )}

          {busy && !contactOpen && (
            <div className="flex gap-4 items-center">
              <Sparkle className="w-6 h-6 shrink-0 animate-pulse" />
              <span className="text-[0.9375rem] text-slate-500">회사 자료를 찾는 중…</span>
            </div>
          )}

          <div ref={endRef} />
        </div>
      )}

      {notice && (
        <p className="mb-5 rounded-2xl bg-amber-50 px-5 py-3.5 text-sm text-amber-800">{notice}</p>
      )}
      {error && (
        <p className="mb-5 rounded-2xl bg-rose-50 px-5 py-3.5 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      {/* ── 담당자 연결 ── */}
      {started && wantsHandoff(messages) && !sent && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
          {!contactOpen ? (
            <>
              <p className="text-base font-bold text-slate-900 break-keep">
                현장 조건은 담당자가 직접 보는 편이 정확합니다
              </p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed break-keep">
                연락처를 남겨주시면 지금까지 나눈 이야기를 바탕으로 담당자가 연락드립니다.
              </p>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
              >
                담당자 연결 요청
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </>
          ) : (
            <form onSubmit={submitContact} className="grid gap-3 sm:grid-cols-2">
              <Field name="name" label="이름" required />
              <Field name="company" label="회사명" />
              <Field name="email" label="이메일" type="email" required />
              <Field name="phone" label="연락처" type="tel" />
              <label className="sm:col-span-2 flex items-center gap-2.5 text-sm text-slate-600 py-1">
                <input
                  type="checkbox"
                  name="withLog"
                  defaultChecked
                  className="w-4 h-4 accent-gslt-600"
                />
                지금까지의 대화 내용을 함께 보냅니다
              </label>
              <button
                type="submit"
                disabled={busy}
                className="sm:col-span-2 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3.5 text-sm font-bold transition-colors disabled:opacity-60"
              >
                {busy ? '보내는 중…' : '문의 남기기'}
              </button>
            </form>
          )}
        </div>
      )}

      {sent && (
        <p className="mb-6 rounded-3xl bg-gslt-100 px-6 py-5 text-sm font-bold text-gslt-700">
          접수되었습니다. 담당자가 곧 연락드리겠습니다.
        </p>
      )}

      {/* ── 입력창 ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="relative"
      >
        <label htmlFor="chat-input" className="sr-only">
          궁금한 점을 입력하세요
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          rows={1}
          value={input}
          maxLength={2000}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="배선 공사 없이 가능한지, 사례가 있는지 물어보세요"
          className="w-full resize-none rounded-[1.75rem] bg-slate-50 border border-slate-200 focus:border-gslt-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gslt-100 py-4 pl-6 pr-16 text-[0.9375rem] text-slate-900 placeholder:text-slate-400 leading-relaxed transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="보내기"
          className="absolute right-2.5 bottom-2.5 grid place-items-center w-11 h-11 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 transition-colors disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <p className="mt-3.5 text-xs text-slate-500 break-keep">
        AI가 회사 자료를 근거로 답합니다. 비용과 일정은 현장 조건에 따라 달라져 실측 후
        확정됩니다. 급하시면 {COMPANY.tel}로 연락 주세요.
      </p>
    </section>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-500 mb-1.5">
        {label}
        {required ? <span className="text-gslt-700"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl bg-slate-50 border border-slate-200 focus:border-gslt-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gslt-100 px-4 py-3 text-sm text-slate-900 transition-colors"
      />
    </label>
  );
}

/** 이 사이트의 아이콘은 직접 그린다. 24 그리드에 맞춘 반짝임 표식. */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="gslt-spark" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#1e93a0" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5 13.9 9.1a3 3 0 0 0 2 2L22.5 13l-6.6 1.9a3 3 0 0 0-2 2L12 23.5l-1.9-6.6a3 3 0 0 0-2-2L1.5 13l6.6-1.9a3 3 0 0 0 2-2Z"
        fill="url(#gslt-spark)"
      />
    </svg>
  );
}
