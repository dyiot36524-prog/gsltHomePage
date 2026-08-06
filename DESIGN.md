---
name: GSLT — 지에스엘티
description: 무선 IoT 구축 전문기업의 사이트. 회사가 남긴 기록을 현장 기록부의 문법으로 읽힌다.
colors:
  gslt-500: "#28b8c5"
  gslt-700: "#1c7682"
  gslt-600: "#1e93a0"
  gslt-400: "#4cc3d2"
  gslt-200: "#b0e8ee"
  gslt-100: "#d7f4f7"
  siot-500: "#f97316"
  bizmoa-500: "#3b82f6"
  morak-500: "#00c2c2"
  ink: "#0f172a"
  ink-body: "#334155"
  slate-500: "#64748b"
  slate-400: "#94a3b8"
  rule-hairline: "#e2e8f0"
  surface-fill: "#f1f5f9"
  surface-hover: "#f8fafc"
  paper: "#ffffff"
  footer-black: "#050505"
typography:
  display:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.6rem)"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  date-numeral:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.75rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "tabular-nums"
  title:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "-0.011em"
  secondary:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  code: "2px"
  panel: "1rem"
  panel-lg: "1.5rem"
  pill: "9999px"
spacing:
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "2.5rem"
  3xl: "3.5rem"
  4xl: "5rem"
  5xl: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.gslt-500}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
    typography: "{typography.secondary}"
  button-primary-hover:
    backgroundColor: "{colors.gslt-400}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
    typography: "{typography.secondary}"
  button-outline-hover:
    textColor: "{colors.gslt-700}"
  button-pill:
    backgroundColor: "{colors.gslt-500}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.25rem"
  tag-default:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "3px 0.5rem"
    typography: "{typography.label}"
  tag-press:
    backgroundColor: "{colors.gslt-700}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "3px 0.5rem"
  tag-file:
    backgroundColor: "{colors.surface-fill}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.none}"
    padding: "3px 0.5rem"
  record-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.75rem 1rem"
  record-row-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.gslt-700}"
  filter-item:
    backgroundColor: "transparent"
    textColor: "{colors.slate-500}"
    rounded: "{rounded.none}"
    padding: "0 0 0.25rem 0"
    typography: "{typography.secondary}"
  filter-item-active:
    textColor: "{colors.ink}"
  cta-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "2rem"
---

# Design System: GSLT — 지에스엘티

## Overview

**Creative North Star: "현장 기록부(The As-Built Ledger)"**

이 회사는 현장에 들어가 시공하고 인수인계 서류를 남긴다. 사이트의 콘텐츠 면(뉴스·시공사례·자료실)은
그 서류의 문법을 그대로 쓴다. 글은 카드에 담기지 않는다. 흰 지면 위에 괘선으로 나뉜 행으로 눕고,
왼쪽에 일자가 등번호처럼 큰 tabular 숫자로 선다. 이 선택의 실질적 이유는 두 가지다. 하나는 이 회사가
파는 것이 소프트웨어가 아니라 시공이라는 사실을 형식이 먼저 말한다는 것이고, 다른 하나는 발행 글이
몇 건 없을 때도 3열 카드 그리드처럼 빈칸이 드러나지 않고 문서로 읽힌다는 것이다.

밀도는 낮지 않다. 여백은 넉넉하지만 장식은 없다. 그림자도, 둥근 모서리도, 그라디언트도 기록 면에는
없다. 깊이는 오직 괘선의 굵기 차이로 표현된다 — 표머리 아래 2px 먹선, 행 사이 1px 헤어라인. 색은
거의 흑백이고, 청록(gslt) 하나만이 상태와 강조를 맡는다. 서체는 Pretendard 단 하나이며 위계는
굵기(400/700/900)와 크기로만 만든다. 아이콘은 직접 그린 SVG 다섯 개뿐이고 stroke 굵기는 1.75로 고정이다.

이 사이트는 두 개의 체제가 공존한다. **기록 면**(`/news`, `/portfolio`, `/downloads`, `/news/[id]`)은
위에 쓴 기록부 세계다. **제품 면**(`/about`, `/siot`, `/bizmoa`, `/morak`)은 1단계에서 이관한
마케팅 세계로 둥근 패널(1rem·1.5rem)과 부양 그림자, 제품별 강조색, 스크롤 진입 모션을 쓴다.
헤더와 푸터는 두 체제를 가로지르는 공통 크롬이다. 새 화면을 만들 때는 **어느 체제에 속하는지 먼저
정하고, 그 체제의 규칙을 끝까지 따른다.** 둘을 한 화면에서 섞지 않는다.

명시적으로 거부한 것: 카테고리 목록의 기본값인 3열 카드 그리드(사용자가 직접 "AI 티 난다"고 지목한
지점), 제목 위 작은 라벨(아이브로/키커), 알약 필터 칩, 유니코드 화살표 글리프, 아이콘 CDN.

**Key Characteristics:**
- 흰 지면 + 괘선. 구획을 배경색 블록이 아니라 선으로 나눈다.
- 좌측 일자 기둥. 연도 11px, 월·일 1.75rem font-black, 전부 tabular-nums.
- 기록 면 radius 0, 그림자 0.
- 강조색 하나(gslt 청록). 제품색은 제품 면 밖으로 나오지 않는다.
- Pretendard 단일 서체, 굵기·크기만으로 위계.
- 데스크톱은 썸네일이 붙은 4트랙, 모바일은 순수 텍스트 기록부.

## Colors

거의 무채색인 지면에 청록 하나가 상태를 맡는다. 색이 정보를 나르는 경우는 태그의 종류 구분과 hover 뿐이다.

### Primary

- **GSLT 청록** (`gslt-500` #28b8c5): 회사 브랜드색이자 이 시스템의 유일한 강조색. **면으로 쓴다** —
  주 버튼 배경, 필터의 활성 밑줄. 이 색 위의 글자는 항상 먹색(#0f172a, 7.1:1)이다.
- **깊은 청록** (`gslt-700` #1c7682): **글자로 쓰는 청록.** 흰 바탕에서 5.30:1로 유일하게 본문 등급을
  통과한다. 행 hover 시 제목과 일자가 이 색으로 바뀌고, 본문 링크와 언론보도 태그 배경이 이 값이다.
- **중간 청록** (`gslt-600` #1e93a0): 흰 바탕 3.66:1. **아이콘과 굵은 큰 글자 전용.** 작은 본문 글자에
  쓰지 않는다.
- **밝은 청록** (`gslt-400` #4cc3d2): 주 버튼 hover 배경. 청록을 어둡게가 아니라 밝게 보내는 것이 이
  시스템의 hover 방향이다 — 글자가 먹색이므로 배경이 밝아져야 대비가 유지된다.
- **연청록** (`gslt-200` #b0e8ee / `gslt-100` #d7f4f7): 본문 링크의 기본 밑줄색, 텍스트 선택 배경.

### Secondary (제품 식별색)

제품 페이지와 헤더 드롭다운의 점(dot)에서만 쓴다. 기록 면에는 한 번도 등장하지 않는다.

- **시옷 오렌지** (`siot-500` #f97316)
- **비즈모아 블루** (`bizmoa-500` #3b82f6)
- **모락 민트** (`morak-500` #00c2c2)

### Neutral

- **먹색** (`ink` #0f172a): 모든 제목, 일자 숫자, 태그 기본 배경, CTA 패널 배경, 표머리 2px 괘선.
  본문 기본 글자색이기도 하다.
- **본문 먹** (`ink-body` #334155): 게시글 본문(`.post-body`) 전용. 순먹보다 한 단계 눕혀 긴 글의
  피로를 줄인다.
- **부속 회색** (`slate-500` #64748b): 요약문, 리드문, 메타 정보, 총 건수. **흰 바탕에서 정보를 담는
  글자의 하한선(4.76:1).**
- **장식 회색** (`slate-400` #94a3b8): 일자의 구분점, 목록 화살표, 리스트 불릿 마커. 흰 바탕에서
  2.56:1이므로 **정보를 혼자 지는 요소에 쓰지 않는다.** 단 검정 푸터 위에서는 7.85:1이 되어 정보 등급이 된다.
- **헤어라인** (`rule-hairline` #e2e8f0): 행 사이 1px 괘선, 표 테두리, 구분선.
- **면 채움** (`surface-fill` #f1f5f9): 파일 태그 배경, 썸네일 로딩 자리, 인라인 코드 배경.
- **hover 지면** (`surface-hover` #f8fafc): 기록 행 hover 배경(80% 투명도로 얹는다), 표 헤더 셀.
- **푸터 검정** (`footer-black` #050505): 순검정이 아니라 한 톤 든 검정. 사이트 전체의 유일한 어두운 면.

### Named Rules

**대비 사다리는 바탕을 따른다 (The Ladder Follows the Ground Rule).** 정보를 담는 글자는 그 글자가
놓인 바탕에서 4.5:1 이상이어야 한다. 흰 지면에서 하한은 `slate-500`(4.76:1)이고 `slate-400`(2.56:1)은
장식 전용이다. 검정 푸터(#050505)에서는 사다리가 뒤집혀 `slate-400`(7.85:1)이 하한이 되고
`slate-500`(4.27:1)부터는 이미 부족하다. 색 이름이 아니라 비율을 따라간다.

**청록 위의 흰 글자 금지 (The Never-White-On-Teal Rule).** `gslt-500` 위 흰 글자는 2.4:1로 금지다.
청록 면 위의 글자는 먹색(#0f172a, 7.1:1)이고, 흰 글자가 필요하면 배경을 `gslt-700`(5.30:1)까지 내린다.

**한 목소리 (The One Accent Rule).** 기록 면의 강조색은 gslt 청록 하나다. 제품 식별색
(오렌지·블루·민트)은 해당 제품 페이지와 내비게이션 점 밖으로 나오지 않는다. 태그를 색으로 무지개처럼
분류하지 않는다 — 종류 구분은 먹/청록/회색 세 톤으로 충분하다.

**채우기 전에 괘선 (The Rule Before Fill).** 구획은 배경색 블록이 아니라 선으로 나눈다. 회색 면을
깔고 싶어질 때, 대신 괘선의 굵기를 바꾼다.

## Typography

**Display / Body / Label Font:** Pretendard (한글 동적 서브셋, CDN), fallback `system-ui, -apple-system, sans-serif`
**Mono:** 없음. 숫자 정렬은 별도 서체가 아니라 `tabular-nums` 기능으로 해결한다.

**Character:** 서체는 하나뿐이다. Pretendard의 넓은 굵기 폭(400→700→900)이 위계를 전부 감당하고,
한글 제목에는 `letter-spacing: -0.025em`와 `word-break: keep-all`을 걸어 어절이 중간에서 끊기지 않게 한다.
장식적 세리프나 디스플레이 페이스는 등장하지 않는다. 중립적이고 실무적이며, 서류처럼 읽힌다.

### Hierarchy

- **Display** (900, 2.25rem → 3rem, tracking -0.025em): 목록 페이지 제목(`PageHead`). 페이지당 하나.
- **Headline** (900, 1.875rem → 2.6rem, line-height 1.2): 게시글 제목.
- **Date Numeral** (900, 1.5rem → 1.75rem, tabular-nums, line-height 1): 기록 행 좌측의 월·일.
  위에 연도가 11px/500 `slate-500`으로 얹힌다. 이 시스템의 서명 요소다.
- **Title** (700, 1.125rem → 1.25rem, leading-snug): 기록 행의 제목. **본문에 가까운 크기로 둔다** —
  행이 카드 헤드라인이 아니라 목록 항목으로 읽히게 하는 장치다.
- **Body** (400, 1.0625rem / 1.85, letter-spacing -0.011em): 게시글 본문(`.post-body`). 폭은 68ch로 묶는다.
- **Secondary** (400, 0.875rem, `slate-500`): 요약문, 메타, 총 건수. 요약문은 60ch에서 끊고 2줄 말줄임한다.
- **Label** (700, 0.6875rem, tracking 0.14em): 표의 열 이름, 이전/다음 기록 라벨, 태그.

### Named Rules

**단일 서체 (The Single Face Rule).** 서체는 Pretendard 하나다. 새 역할이 생기면 서체를 더하지 말고
굵기·크기·자간으로 해결한다. 900은 제목과 일자에만, 700은 소제목·라벨·강조에, 400은 본문에 쓴다.

**등번호 (The Jersey Number Rule).** 일자는 왼쪽 기둥에 등번호처럼 선다. 연도는 작게 위에, 월·일은
크게 아래에, 전부 `tabular-nums`로. 숫자가 세로로 정확히 정렬되는 것이 기록부의 신뢰를 만든다.
이어지는 행(같은 글의 두 번째 첨부 등)은 일자를 **비운다** — `-`나 `〃` 같은 자리표시 글리프를 넣지 않는다.

**아이브로 금지 (The No-Kicker Rule).** 어떤 제목 위에도 작은 라벨을 두지 않는다. 제목이 스스로
버틴다. 11px/0.14em 라벨 스타일은 **열 이름과 내비게이션 라벨에만** 허용된다 — 그 자리에서는 장식이
아니라 표의 머리이기 때문이다.

## Layout

**컨테이너.** 콘텐츠 면은 `max-w-6xl`(72rem) 중앙 정렬, 좌우 여백 1rem → 1.5rem(sm) → 2rem(lg).
헤더와 푸터만 `max-w-7xl`(80rem)로 한 단계 넓다. 게시글 본문과 그에 딸린 내비게이션·CTA는 `68ch`로
묶여 컨테이너 왼쪽에 붙는다 — 가운데 정렬하지 않는다.

**기록 행의 그리드.** 이 시스템의 핵심 구조이며 `md`(768px)에서 체제가 바뀐다.

- 데스크톱(구분 열 있음): `7.5rem 9rem 1fr auto` — 일자 / 구분 / 제목 / (썸네일+화살표)
- 데스크톱(구분 열 없음): `7.5rem 1fr auto`
- 모바일: `4.5rem 1fr` 2열. 일자가 좌측 레일로 2행을 관통하고, 오른쪽 열에 태그 줄과 제목 블록이 쌓인다.

열 간격은 데스크톱 1.5rem, 모바일 1.25rem. 행 높이는 상하 여백 1.75rem(모바일) / 2rem(데스크톱)으로
잡히고, hover 시 배경이 좌우 여백 바깥까지(-1rem / -1.5rem) 번져 행 전체가 하나의 타깃임을 보인다.

**수직 리듬.** 페이지 머리 상단 4rem → 6rem, 하단 2.5rem → 3.5rem. 제목과 리드문 사이 1.5rem,
필터는 리드문에서 2.5rem 아래. 게시글에서는 머리 → 대표 이미지 → 본문이 각 2.5rem, 첨부·다음글·CTA
같은 후속 블록은 3.5rem / 5rem / 4rem으로 벌어진다. 푸터는 본문에서 6rem 떨어진다.

**고정 헤더.** 상단 고정이며 데스크톱 4rem, 모바일 6.5rem(솔루션 가로 스크롤 줄이 2단으로 붙는다).
같은 높이의 빈 블록이 본문을 밀어준다.

### Named Rules

**표는 닫힌다 (The Ledger Closes Rule).** 기록 목록은 위아래가 모두 막혀 있어야 문서로 읽힌다.
데스크톱에서는 표머리가 2px 먹선으로 위를 닫고, 표머리가 감춰지는 모바일에서는 목록(`RecordList`)이
직접 2px 위 괘선을 갖는다. 아래는 어느 화면에서든 1px 헤어라인으로 닫는다. 빈 목록(`RecordEmpty`)도
같은 괘선을 유지한다 — 페이지가 가장 얇은 순간에 오히려 틀을 놓지 않는다.

**열은 자격으로 얻는다 (The Column Earns Its Track Rule).** '구분' 열은 그 값이 **행마다 실제로
달라질 때만** 존재한다. 값이 모든 행에서 같으면 정보량이 0이므로 트랙을 통째로 뺀다. 시공사례에
태그 열이 없고 `일자 / 현장` 2트랙으로 도는 이유가 이것이다.

**두 갈래가 있을 때만 컨트롤 (The Two Real Options Rule).** 필터 바는 '전체'를 제외한 갈래 중
항목이 있는 것이 **2개 이상일 때만** 렌더된다. 하나뿐이면 그 필터와 '전체'가 같은 결과를 내므로
컨트롤 두 개가 모두 무의미해진다.

**모바일은 순수 기록부 (The Text-Only Mobile Rule).** 썸네일은 데스크톱 전용이다. 좁은 화면에서는
이미지가 행의 리듬을 깨고 스캔을 방해하므로, 모바일은 일자·태그·제목·요약만 남은 텍스트 기록부가 된다.

## Elevation & Depth

**기록 면에는 그림자가 없다.** 깊이는 전부 괘선의 굵기 차이와 배경의 미세한 이동으로 표현한다.
2px 먹선(#0f172a)이 구조의 최상위 경계, 1px 헤어라인(#e2e8f0)이 항목 사이의 경계, hover 시
`#f8fafc`를 80% 투명도로 얹는 것이 유일한 표면 변화다. 게시글 안에서 유일하게 면으로 뜨는 것은
먹색 CTA 패널인데, 그것도 그림자 없이 색 대비만으로 부양한다.

그림자는 **떠 있는 크롬**에만 존재한다 — 지면 위에 실제로 겹쳐 있는 요소뿐이다.

### Shadow Vocabulary

- **크롬 접지** (`box-shadow: 0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1)`):
  고정 헤더가 본문 위에 있음을 알리는 최소 그림자. 배경 흐림(`backdrop-blur-xl`)과 함께 쓴다.
- **부양 패널** (`box-shadow: 0 20px 25px -5px rgb(0 0 0/0.1), 0 8px 10px -6px rgb(0 0 0/0.1)`):
  헤더 솔루션 드롭다운처럼 지면에서 완전히 떠오른 임시 표면 전용.

### Named Rules

**평평한 지면 (The Flat Ledger Rule).** 기록 서피스의 어떤 요소도 그림자를 갖지 않는다. 카드, 행,
태그, 버튼, 빈 상태 모두 평평하다. 무언가를 구분해야 한다면 그림자가 아니라 괘선의 굵기를 바꾼다.
그림자는 실제로 다른 요소 위에 겹쳐 떠 있는 크롬에만 허용된다.

## Shapes

**기록 면의 모든 모서리는 직각이다(0px).** 태그, 버튼, 썸네일, 이미지 프레임, CTA 패널, 필터 —
예외 없다. 이것이 기록부와 마케팅 페이지를 가르는 가장 빠른 신호다.

경계는 세 굵기만 쓴다. **2px 먹선**(구조 경계), **1px 헤어라인 `#e2e8f0`**(항목 경계·표 테두리),
그리고 필터 활성 표시의 **2px 청록 밑줄**. 테두리 있는 버튼은 `slate-300` 1px이며 hover 시 청록으로 바뀐다.
본문 인용문은 배경 없이 왼쪽 1px 청록 선만 세운다.

썸네일은 데스크톱에서 `7rem × 4.5rem`(약 3:2)의 직사각형, 게시글 대표 이미지는 16:9다. 둘 다
모서리를 두지 않고 `object-cover`로 채운다.

인라인 코드만 2px의 최소 라운드를 갖는다 — 글자 사이에 끼는 요소라 완전 직각이면 붙어 보이기 때문이다.

제품 면(1단계 이관분)은 다른 형태 언어를 쓴다: 1rem·1.5rem 라운드 패널과 알약(9999px) 버튼.
헤더의 '도입 문의' 알약 버튼이 두 체제를 가로지르는 유일한 예외이며, 이것은 사이트 공통 크롬이기 때문이다.

### Named Rules

**직각 원칙 (The Square Corner Rule).** 기록 면에 `border-radius`를 쓰지 않는다. 둥근 모서리가
필요하다고 느껴지면 그 요소는 기록 면에 속하지 않는 것이다.

## Components

### Buttons

- **Shape:** 직각(0px). 좌우 1.5rem / 상하 0.75rem, 0.875rem 볼드.
- **Primary:** 청록 면(#28b8c5)에 먹색 글자(7.1:1). hover에 배경이 밝은 청록(#4cc3d2)으로 **올라간다**.
  화살표 아이콘이 따라붙는 경우 hover 시 0.125rem 오른쪽으로 밀린다(300ms).
- **Outline:** 흰 바탕에 `slate-300` 1px 테두리, `slate-700` 글자. hover 시 테두리가 `gslt-500`,
  글자가 `gslt-700`으로 바뀐다. 빈 상태의 '전체 보기'처럼 되돌리는 동작에 쓴다.
- **Pill (공통 크롬 전용):** 헤더의 '도입 문의'. 알약 형태에 hover 1.02배 / active 0.98배 스케일.
  이 변형은 헤더 밖에서 쓰지 않는다.

### Tags (구분 태그)

- **Style:** 채운 사각형, radius 0, 0.5rem × 3px 여백, 0.6875rem 볼드. 테두리 없음.
- **default** — 먹색 배경 + 흰 글자. 자사 소식, 게시글 카테고리.
- **press** — `gslt-700` 배경 + 흰 글자(5.30:1). 언론보도. 청록이 '외부로 나간다'를 뜻한다.
- **file** — `slate-100` 배경 + `slate-700` 글자. 파일 확장자(PNG, PDF). 유일하게 조용한 톤이며,
  자료실에서는 확장자가 강조 대상이 아니라 분류값이기 때문이다.

게시글 상세의 태그 목록은 이와 다른 형태다 — 채우지 않고 `slate-200` 1px 테두리에 `slate-500`
글자로 둔다. 그 자리에서는 태그가 분류가 아니라 부속 정보이기 때문이다.

### Record Row (서명 컴포넌트)

이 시스템의 중심. 카드가 아니라 괘선으로 나뉜 행이다.

- **구조:** 좌측 일자 기둥 → 구분 태그 → 제목 + 요약(2줄 말줄임, 60ch) + 메타 → 썸네일 + 동작 아이콘.
- **동작 아이콘 3종:** `ArrowRight`(사이트 내부 읽기), `ArrowUpRight`(외부 원문), `Download`(파일).
  아이콘이 행의 성격을 말한다.
- **아이콘 대비:** 목록 화살표는 `slate-400`이다 — 행 전체가 링크이고 제목이 어포던스를 지므로
  장식이기 때문이다. 반면 내려받기 글리프는 '이 행은 읽는 게 아니라 받는다'를 혼자 말하므로
  `slate-500`(4.76:1)으로 올린다.
- **Hover:** 배경 `#f8fafc`/80%, 제목과 일자가 `gslt-700`으로, 아이콘이 `gslt-700` + 0.125rem 이동
  (모두 300ms). 썸네일은 1.04배로 700ms에 걸쳐 천천히 확대된다.

### Filter Bar

- **Style:** 알약 칩이 아니라 **밑줄 텍스트 버튼.** 라벨 옆에 건수가 `tabular-nums` 0.75rem으로 붙는다.
- **Active:** `gslt-500` 2px 밑줄 + 먹색 볼드 글자, 건수는 `gslt-600`.
- **Default / Hover:** 투명 밑줄 + `slate-500` 글자 → hover 시 `slate-300` 밑줄 + 먹색 글자.
- **동작:** URL 쿼리(`?type=`, `?tag=`)로 서버에서 걸러진다. 링크를 공유하면 그 상태가 그대로 열린다.
  `aria-current`로 활성 상태를 노출한다.

### Empty State

목록이 비어도 표머리와 2px 괘선을 그대로 유지하고, 메시지를 일자 열 폭(7.5rem)만큼 들여써 첫
기록 행이 앉을 자리에 놓는다. 굵은 제목 한 줄(1.125rem/700) + 설명(0.875rem `slate-500`, 52ch) +
행동 버튼. 상하 여백 5rem → 6rem.

### Page Head

제목(Display) 왼쪽, 총 건수 오른쪽 아래 기준선 정렬. 건수는 `총 N건` 형태로 숫자만 먹색 볼드다.
아래 리드문(62ch, `slate-500`), 그 아래 2.5rem 띄고 필터. **제목 위에는 아무것도 없다.**

### Navigation

- **헤더:** 흰색 90% + `backdrop-blur-xl`, 하단 헤어라인. 로고 좌측, 메뉴 중앙 절대 배치(0.875rem/700
  `slate-600`), CTA 알약 우측. 활성 메뉴는 `gslt-600`. 모바일은 두 번째 줄에 솔루션 3종 + 구분 막대 +
  주요 메뉴를 가로 스크롤로 편다.
- **게시글 하단 이전/다음:** 2px 먹선으로 열고 헤어라인으로 나눈다. 이전은 좌측 정렬 + 왼쪽 화살표,
  다음은 우측 정렬 + 오른쪽 화살표로 **방향이 레이아웃에 반영된다.** 라벨은 Label 스타일, 제목은 1줄 말줄임.
- **푸터:** `#050505` 바탕, 기본 글자 `slate-400`. 3열 링크 그룹 + 사업자 정보. 사이트에서 유일하게
  어두운 면이며 로고는 흰색 버전으로 교체된다.

### Icons

- 이 사이트의 아이콘은 5개다: `ArrowRight`, `ArrowLeft`, `ArrowUpRight`, `Download`, `ChevronDown`.
- 전부 `24×24` 그리드에 `stroke-width: 1.75`, `fill: none`, `currentColor`, 둥근 끝단.
- 목록·본문에서는 `1.25rem`(w-5), 메타·보조 위치에서는 `1rem`(w-4).

### Named Rules

**아이콘은 그린다 (The Authored Icon Rule).** 아이콘은 `Icon.tsx`에 직접 그린 SVG로만 추가한다.
유니코드 글리프(↗, →, ↓)를 아이콘 자리에 쓰지 않고, 아이콘 폰트나 CDN 패키지를 들이지 않는다.
새 아이콘은 반드시 24 그리드 · stroke 1.75로 맞춰 같은 파일에 넣는다.

## Do's and Don'ts

### Do:

- **Do** 새 콘텐츠 목록은 `RecordHead` + `RecordList` + `RecordRow`로 조립한다. 새 목록 레이아웃을
  발명하지 않는다.
- **Do** 정보를 담는 글자를 흰 바탕에서 `slate-500`(#64748b, 4.76:1) 이상으로 유지한다.
  검정 푸터 위에서는 `slate-400`(#94a3b8, 7.85:1)이 하한이다.
- **Do** 청록 면 위의 글자를 먹색(#0f172a)으로 둔다. 흰 글자가 필요하면 배경을 `gslt-700`으로 내린다.
- **Do** 열의 값이 행마다 실제로 달라질 때만 그 열을 만든다. 아니면 트랙을 뺀다.
- **Do** 목록의 위아래를 괘선으로 닫는다. 빈 상태에서도 닫는다.
- **Do** 숫자(일자, 건수, 파일 크기, 조회수)에 `tabular-nums`를 건다.
- **Do** 한글 제목·본문에 `word-break: keep-all`을 걸어 어절을 지킨다.
- **Do** 새 아이콘을 `Icon.tsx`에 24 그리드 · stroke 1.75로 직접 그려 넣는다.
- **Do** 화면을 만들기 전에 그것이 기록 체제인지 제품 체제인지 정하고, 한 체제의 규칙만 따른다.

### Don't:

- **Don't** 기록 면에 3열 카드 그리드를 쓰지 않는다. 이 사이트가 명시적으로 거부한 형식이다.
- **Don't** 기록 면에 `border-radius`나 `box-shadow`를 두지 않는다. 그림자는 실제로 겹쳐 떠 있는
  크롬(고정 헤더, 드롭다운)에만 허용된다.
- **Don't** `gslt-500` 위에 흰 글자를 쓰지 않는다(2.4:1).
- **Don't** `slate-400`으로 정보를 지는 글자를 쓰지 않는다(흰 바탕 2.56:1). 반대로 검정 푸터 위에
  `slate-500`·`slate-600`·`slate-700`을 쓰지 않는다 — 각각 4.27:1, 2.69:1, 1.9:1로 읽히지 않는다.
- **Don't** `gslt-600`을 작은 본문 글자색으로 쓰지 않는다(3.66:1). 아이콘과 굵은 큰 글자에만 둔다.
- **Don't** 어떤 제목 위에도 작은 라벨(아이브로/키커)을 얹지 않는다.
- **Don't** 필터를 알약 칩으로 만들지 않는다. 밑줄 텍스트 버튼이다.
- **Don't** 갈래가 하나뿐인 필터 바를 렌더하지 않는다.
- **Don't** 비어 있는 일자 칸에 `-`나 `〃` 같은 자리표시 글리프를 넣지 않는다. 비워 둔다.
- **Don't** 유니코드 화살표 글리프나 아이콘 CDN을 쓰지 않는다.
- **Don't** 제품 식별색(오렌지·블루·민트)을 기록 면으로 가져오지 않는다.
- **Don't** 모바일 목록에 썸네일을 넣지 않는다.
- **Don't** 서체를 추가하지 않는다. Pretendard의 굵기와 크기로 해결한다.
