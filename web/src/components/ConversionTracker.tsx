'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

/**
 * 전환 지점 계측.
 *
 * 페이지뷰만 세면 "며칠에 몇 명이 왔다"까지만 안다. 이 사이트의 일은 문의를 만드는 것이고,
 * 그러려면 **문의로 이어지는 행동**이 어디서 얼마나 일어나는지를 알아야 한다 —
 * 전화 탭, 메일 클릭, 자료 다운로드. 이게 없으면 시공 사례 페이지를 만들어도
 * 그게 효과가 있었는지 알 길이 없다.
 *
 * 페이지마다 onClick을 심지 않고 문서 하나에 리스너 하나를 둔다. tel:·mailto: 링크는
 * 여섯 페이지에 흩어져 있고, 앞으로 생길 페이지에도 자동으로 붙어야 한다.
 * `data-track` 속성이 있는 링크는 그 값으로 센다(자료실 다운로드가 쓴다).
 *
 * 폼 제출과 챗봇 시작은 클릭이 아니라 결과라 여기서 잡을 수 없다 — 각 컴포넌트가
 * lib/analytics의 이름 있는 함수로 직접 보고한다.
 */
export default function ConversionTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const page = location.pathname;

      const custom = a.getAttribute('data-track');
      if (custom) {
        track(custom, { page, label: a.getAttribute('data-track-label') ?? '' });
        return;
      }
      if (href.startsWith('tel:')) track('phone_click', { page });
      else if (href.startsWith('mailto:')) track('mail_click', { page });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
