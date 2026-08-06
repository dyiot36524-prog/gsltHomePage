/**
 * 이 사이트에서 쓰는 아이콘 전부. 하나의 stroke 굵기(1.75)와 24 그리드로 통일한다.
 * 유니코드 글리프(↗ 등)를 아이콘 대신 쓰지 않는다.
 */

type Props = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function ArrowUpRight({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M20 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function Download({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function ChevronDown({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
