'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@/components/Icon';
import { COMPANY } from '@/lib/site';

/**
 * 히어로 안에서 이어지는 상담 챗봇.
 *
 * 처음에는 히어로가 끝난 뒤 흰 지면에 따로 섰는데, 영상이 끝나고 나면 톤이 뚝 끊겨
 * 다른 사이트가 이어붙은 것처럼 보였다. 지금은 같은 무대(.hero-stage) 안에서
 * 헤드라인이 물러난 자리에 들어온다 — 영상은 그대로 바닥에 남는다.
 *
 * 그래서 이 컴포넌트는 어두운 바닥을 전제로 한다. 흰 지면에 두면 대비가 뒤집힌다.
 * 대비는 영상이 가장 밝은 프레임일 때를 기준으로 잡았다(hero-dim 0.72 위):
 * 흰 제목 7.1:1 · gslt-400 4.2:1 · white/80 7.1:1 · white/65 4.8:1. 어두운 컷에서는 훨씬 높다.
 *
 * 형태는 Gemini를 따른다 — 큰 인사말, 질문 카드, 알약 입력창, 답변은 말풍선 없이
 * 지면에 눕고 사용자 말만 흐린 말풍선. 색은 GSLT 것을 쓴다.
 *
 * 대화 목록은 자기 안에서 스크롤한다(overscroll-behavior: contain). 무대가 sticky라
 * 목록에서 굴린 휠이 페이지로 새면 대화 도중에 히어로가 걷혀 버린다.
 */

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  '3층 사무실인데 배선 공사 없이 될까요?',
  '비슷한 규모로 구축한 사례가 있나요?',
  '컨설팅만 먼저 받아볼 수 있나요?',
];

/** 실제 진행에 관한 이야기가 나왔는지. 이때부터 담당자 연결이 의미가 있다. */
const INTENT = /견적|비용|가격|얼마|일정|기간|방문|현장|실측|도입|계약|상담|미팅|연락/;

function wantsHandoff(messages: Msg[]): boolean {
  if (messages.filter((m) => m.role === 'user').length >= 3) return true;
  return messages.some((m) => m.role === 'user' && INTENT.test(m.content));
}

function transcript(messages: Msg[]): string {
  return messages
    .map((m) => `${m.role === 'user' ? '방문자' : 'AI 안내'}: ${m.content}`)
    .join('\n\n');
}

export default function Chat({
  onEngage,
  onStart,
  onClose,
}: {
  onEngage?: () => void;
  /** 첫 메시지가 나가는 순간 한 번. 히어로가 이걸 받아 헤드라인을 걷고 판을 넓힌다. */
  onStart?: () => void;
  /** 대화를 닫을 때. 히어로가 헤드라인을 다시 세운다. */
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const started = messages.length > 0;

  useEffect(() => {
    if (started) endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [messages, busy, started]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    // 히어로에게 "이제 대화 중"이라고 알린다. 그래야 스크롤이 조금 움직여도
    // 대화 도중에 이 판이 사라지지 않는다.
    onEngage?.();
    if (messages.length === 0) onStart?.();
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
      setNotice(data.grounded === false ? '아직 등록된 회사 자료가 없어 답변이 제한됩니다.' : '');
    } catch {
      setError(`연결이 원활하지 않습니다. ${COMPANY.tel}로 연락 주세요.`);
    } finally {
      setBusy(false);
    }
  }

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const withLog = fd.get('withLog') === 'on';
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') || ''),
          company: String(fd.get('company') || ''),
          email: String(fd.get('email') || ''),
          phone: String(fd.get('phone') || ''),
          message:
            String(fd.get('message') || '홈페이지 상담 챗봇을 통한 문의입니다.') +
            (withLog ? `\n\n──── 대화 기록 ────\n${transcript(messages)}` : ''),
        }),
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
    <div className="w-full max-w-2xl mx-auto text-center" aria-labelledby="chat-heading">
      {/* ── 머리. 대화가 시작되면 자리를 대화에 내준다 ── */}
      {!started ? (
        /* 히어로 헤드라인이 이미 이 회사가 무엇을 하는지 말했다. 여기서 큰 제목을
           또 세우면 한 화면에 h1급이 둘이 되고, 세로도 감당하지 못한다.
           작은 표식 한 줄만 두고 곧장 질문으로 넘어간다. */
        <h2
          id="chat-heading"
          className="flex items-center justify-center gap-2.5 mb-5 text-sm font-bold tracking-[0.14em] text-white/70"
        >
          <Sparkle className="w-5 h-5" />
          AI에게 바로 물어보기
        </h2>
      ) : (
        /* 대화 중에는 히어로로 돌아갈 길을 화면에 둔다. 이게 없으면 판이 걷히지 않아
           페이지가 멈춘 것처럼 느껴진다 — 실제로 그렇게 만들었다가 고쳤다. */
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 id="chat-heading" className="flex items-center gap-2.5 text-sm font-bold tracking-[0.14em] text-white/65">
            <Sparkle className="w-5 h-5" />
            AI 상담
          </h2>
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setInput('');
              setError('');
              setNotice('');
              setContactOpen(false);
              setSent(false);
              onClose?.();
            }}
            className="shrink-0 rounded-full border border-white/15 hover:border-white/30 px-4 py-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            대화 닫기
          </button>
        </div>
      )}

      {/* ── 첫 질문 ── */}
      {!started && (
        <ul className="grid gap-2.5 sm:grid-cols-3 mb-6">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => send(s)}
                disabled={busy}
                className="group h-full w-full rounded-2xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/10 hover:border-white/20 px-4 py-4 backdrop-blur-sm transition-colors disabled:opacity-60"
              >
                <span className="block text-[0.9375rem] md:text-base font-medium text-white/85 leading-snug break-keep">
                  {s}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── 대화 ── */}
      {started && (
        <div
          className="hero-chat-log mb-5 overflow-y-auto overscroll-contain space-y-5 text-left"
          aria-live="polite"
        >
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-white/10 px-4 py-3 text-[0.9375rem] md:text-base text-white/90 leading-relaxed break-keep [overflow-wrap:anywhere] whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <Sparkle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="min-w-0 text-[0.9375rem] md:text-base text-white/85 leading-[1.8] break-keep [overflow-wrap:anywhere] whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ),
          )}
          {busy && !contactOpen && (
            <div className="flex gap-3 items-center">
              <Sparkle className="w-5 h-5 shrink-0 animate-pulse" />
              <span className="text-sm text-white/65">고객님을 위한 솔루션 생각중..</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      {notice && (
        <p className="mb-4 rounded-2xl bg-amber-400/10 border border-amber-300/20 px-4 py-3 text-sm text-amber-200">
          {notice}
        </p>
      )}
      {error && (
        <p
          className="mb-4 rounded-2xl bg-rose-400/10 border border-rose-300/25 px-4 py-3 text-sm text-rose-200"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* ── 담당자 연결 ── */}
      {started && wantsHandoff(messages) && !sent && (
        <div className="mb-5 rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-sm p-5 text-left">
          {!contactOpen ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-white/80 break-keep">
                현장 조건은 담당자가 직접 보는 편이 정확합니다.
              </p>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-5 py-2.5 text-sm font-bold transition-colors"
              >
                담당자 연결
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={submitContact} className="grid gap-2.5 sm:grid-cols-2">
              <Field name="name" label="이름" required />
              <Field name="company" label="회사명" />
              <Field name="email" label="이메일" type="email" required />
              <Field name="phone" label="연락처" type="tel" />
              <label className="sm:col-span-2 flex items-center gap-2.5 text-sm text-white/80 py-1">
                <input
                  type="checkbox"
                  name="withLog"
                  defaultChecked
                  className="w-4 h-4 accent-gslt-500"
                />
                지금까지의 대화 내용을 함께 보냅니다
              </label>
              <button
                type="submit"
                disabled={busy}
                className="sm:col-span-2 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors disabled:opacity-60"
              >
                {busy ? '보내는 중…' : '문의 남기기'}
              </button>
            </form>
          )}
        </div>
      )}

      {sent && (
        <p className="mb-5 rounded-3xl bg-gslt-500/15 border border-gslt-400/30 px-5 py-4 text-sm font-bold text-gslt-200">
          접수되었습니다. 담당자가 곧 연락드리겠습니다.
        </p>
      )}

      {/* ── 입력창 ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="hero-chat-field relative rounded-[1.6rem]"
      >
        <label htmlFor="chat-input" className="sr-only">
          궁금한 점을 입력하세요
        </label>
        <textarea
          id="chat-input"
          rows={1}
          value={input}
          maxLength={2000}
          onFocus={() => onEngage?.()}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="배선 공사 없이 가능한지 물어보세요"
          className="block w-full resize-none rounded-[1.6rem] bg-white/[0.07] border border-white/10 focus:border-transparent focus:bg-white/[0.11] focus:outline-none focus:ring-4 focus:ring-gslt-400/20 backdrop-blur-sm py-4 pl-6 pr-16 text-base text-white placeholder:text-white/60 text-left leading-relaxed transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="보내기"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-12 h-12 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 transition-colors disabled:bg-white/10 disabled:text-white/35"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

    </div>
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
      <span className="block text-xs font-bold text-white/65 mb-1.5">
        {label}
        {required ? <span className="text-gslt-400"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl bg-white/[0.07] border border-white/15 focus:border-gslt-400 focus:outline-none focus:ring-4 focus:ring-gslt-400/20 px-3.5 py-2.5 text-sm text-white transition-colors"
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
          <stop offset="0%" stopColor="#4cc3d2" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5 13.9 9.1a3 3 0 0 0 2 2L22.5 13l-6.6 1.9a3 3 0 0 0-2 2L12 23.5l-1.9-6.6a3 3 0 0 0-2-2L1.5 13l6.6-1.9a3 3 0 0 0 2-2Z"
        fill="url(#gslt-spark)"
      />
    </svg>
  );
}
