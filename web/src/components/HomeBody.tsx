import Link from 'next/link';
import { ArrowUpRight } from '@/components/Icon';
import { SOLUTIONS } from '@/lib/site';

/**
 * 홈의 본문. 히어로(영상 + 챗봇) 아래로 이어진다.
 *
 * 홈 본문이 720자뿐이었다 — 하위 페이지는 1,600~1,900자다. 히어로와 챗봇만 있어
 * 인용할 문장이 없었고, 그래서 검색엔진은 홈을 어떤 질의에 매길지 판단할 근거가
 * 없었으며 AI 답변은 홈을 아예 참조하지 않았다.
 *
 * "크롤러에게만 보이게 숨길 수 없느냐"는 물음이 있었다. 그건 클로킹이라 색인 제외까지
 * 간다. 대신 이 방식을 택했다 — **첫 화면은 한 픽셀도 바뀌지 않는다.** 스크롤해야
 * 나오는 본문은 은닉이 아니라 그냥 페이지의 나머지이고, 구글도 첫 화면 밖 콘텐츠를
 * 정상으로 취급한다.
 *
 * 문단은 **인용 가능한 형태**로 쓴다. AI 답변은 문단을 통째로 가져가므로, 마케팅
 * 문장이 아니라 사실이 남는 문장이어야 인용된 뒤에도 뜻이 선다. 지어낸 수치는 넣지
 * 않는다 — 여기 있는 것은 전부 PRODUCT.md와 실제 보도로 확인된 사실이다.
 *
 * 히어로에서 뺐던 솔루션 내부 링크도 여기서 되살아난다.
 */

const STEPS = [
  { n: '상담·요구분석', d: '공간 용도와 원하는 제어 범위를 정리한다.' },
  { n: '현장 실측', d: '기존 설비, 통신 환경, 전기 상태를 직접 확인한다. 견적은 이 단계 이후에 확정된다.' },
  { n: '설계·견적', d: '실측 결과로 장비 구성과 비용을 산출한다.' },
  { n: '시공·설치', d: '직접 시공한다. 발주처가 여러 업체를 조율할 필요가 없다.' },
  { n: '검수·유지보수', d: '인수인계 후 운영을 지원한다.' },
] as const;

const PROOF = [
  '포브스코리아·중앙일보 «2026 소비자 선정 최고의 브랜드 대상» — 무선 IoT 기반 스마트 공간 부문',
  '중소벤처기업부 디딤돌 R&D 국책과제 선정',
  '중소벤처기업부 초기창업패키지 딥테크 분야 선발·졸업',
  '이기종 설비 AI 예지보전 핵심기술 특허 2건 출원 (2026)',
  '기업부설연구소 보유',
] as const;

export default function HomeBody() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-[68ch]">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
          배선을 뜯지 않고 기존 공간을 바꿉니다
        </h2>
        <p className="mt-5 text-slate-600 leading-[1.85] break-keep">
          스마트 빌딩은 대개 신축 단계에서 설계에 넣어야 한다고 여겨집니다. 그런데 실제
          시장에 있는 건물의 대다수는 이미 지어진 건물입니다. 지에스엘티는{' '}
          <strong className="font-bold text-slate-900">
            배선 공사 없이 기존 공간을 스마트 공간으로 전환하는 것
          </strong>
          을 사업의 출발점으로 삼았습니다.
        </p>
        <p className="mt-4 text-slate-600 leading-[1.85] break-keep">
          이를 가능하게 하는 것이 여러 통신 프로토콜을 동시에 지원하는 개방형 구조입니다.
          Wi-Fi, 블루투스, ZigBee, Z-Wave 등 서로 다른 규격의 장비를 하나의 대시보드로
          묶습니다. 특정 제조사나 시스템에 종속되지 않기 때문에, 이미 설치된 조명·공조·출입
          설비를 그대로 두고 위에 얹는 방식이 성립합니다.
        </p>
      </div>

      <h2 className="mt-16 text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
        배선 공사 없이 되는 조건
      </h2>
      <div className="mt-5 max-w-[68ch]">
        <p className="text-slate-600 leading-[1.85] break-keep">
          적용 가능 여부는 현장 조건이 정합니다. 확인이 필요한 것은 공간 면적과 층 구조,
          기존 설비의 종류와 연식, 전원 위치, 무선 신호가 닿는 범위, 기존 제어 시스템의
          개방 여부입니다.
        </p>
        <p className="mt-4 text-slate-600 leading-[1.85] break-keep">
          무선이라도 전원이 필요한 장비는 전원 확보가 필요하고, 폐쇄형 프로토콜만 지원하는
          노후 설비는 게이트웨이 추가나 부분 교체가 필요할 수 있습니다. 이 판단은 현장
          실측에서 확정됩니다. 그래서 확정 금액을 미리 제시하지 않습니다 — 같은 면적이라도
          제어 대상 설비의 수와 종류에 따라 크게 달라지기 때문입니다.
        </p>
        <Link
          href="/faq"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-gslt-700 hover:text-gslt-600 transition-colors"
        >
          자주 묻는 질문 더 보기
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <h2 className="mt-16 text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
        세 가지 솔루션
      </h2>
      <ul className="mt-6 border-t-2 border-slate-900">
        {SOLUTIONS.map((s) => (
          <li key={s.href} className="border-b border-slate-200">
            <Link
              href={s.href}
              className="group grid grid-cols-[1fr_auto] md:grid-cols-[11rem_1fr_auto] gap-x-6 gap-y-2 items-start py-6 transition-colors hover:bg-slate-50/80 -mx-4 px-4"
            >
              <span className="text-lg font-bold text-slate-900 group-hover:text-gslt-700 transition-colors">
                {s.name}
                <span className="ml-2 text-sm font-medium text-slate-500">{s.en}</span>
              </span>
              <span className="col-span-2 md:col-span-1 md:col-start-2 text-slate-600 leading-relaxed break-keep">
                {s.desc}
              </span>
              <ArrowUpRight className="col-start-2 md:col-start-3 row-start-1 w-5 h-5 shrink-0 text-slate-400 group-hover:text-gslt-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-16 text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
        시공 5단계
      </h2>
      <p className="mt-5 max-w-[68ch] text-slate-600 leading-[1.85] break-keep">
        솔루션을 공급하고 끝내지 않습니다. 다섯 단계 전 과정을 직접 수행합니다. 도입 장벽을
        낮추는 지점이 여기에 있습니다 — 발주처가 여러 업체를 조율할 필요가 없습니다.
      </p>
      <ol className="mt-6 border-t-2 border-slate-900">
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_11rem_1fr] gap-x-5 gap-y-1 py-5 border-b border-slate-200"
          >
            {/* slate-400은 흰 바탕에서 2.63:1로 장식 전용이다. 이 번호는 시공 '순서'라
                뜻을 혼자 지므로 장식으로 선언할 수 없다 — 정보 등급인 slate-500(4.76:1)으로 올린다. */}
            <span className="text-sm font-black text-slate-500 tabular-nums pt-0.5">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-bold text-slate-900 break-keep">{s.n}</span>
            <span className="col-start-2 md:col-start-3 text-sm text-slate-600 leading-relaxed break-keep">
              {s.d}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
        검증된 성과
      </h2>
      <ul className="mt-6 max-w-[68ch] space-y-3">
        {PROOF.map((p) => (
          <li key={p} className="flex gap-3 text-slate-600 leading-relaxed break-keep">
            <span aria-hidden="true" className="shrink-0 text-gslt-600 font-bold">
              ·
            </span>
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[68ch] text-sm text-slate-500 leading-relaxed break-keep">
        2023년 설립 이후의 기록입니다. 이상 예측 정확도나 장애 감소율 같은 성능 수치는
        공개하지 않습니다 — 현장마다 설비 구성과 운영 조건이 달라, 한두 현장의 수치를
        일반적인 성능으로 제시하는 것이 정확하지 않다고 보기 때문입니다.
      </p>
    </section>
  );
}
