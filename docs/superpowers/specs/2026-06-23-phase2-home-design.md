# Phase 2 — 홈 화면 (지갑형, 기존 PocketPay 패리티) 설계

작성일: 2026-06-23
상태: 설계 승인됨 → 스펙 리뷰 대기

## 1. 목표 / 성공 기준

로그인 후 첫 화면을 **기존 PocketPay 앱 홈과 동일한 정보 구조**로, **TDS(또는 동등한 룩)**로 구현한다. 모두 **읽기 전용**(데이터 표시 + 팀 전환만, 생성/수정 없음).

**성공 기준**: 샌드박스에서 토스 로그인 → 홈 진입 시
1. 현재 팀의 **전체 잔액 / 이번 달 수입·지출(전월 대비) / 이번 달 최다 지출 / 날짜별 거래 내역**이 실데이터로 표시된다.
2. **팀 전환**(여러 모임)이 동작한다.
3. **멤버 목록**을 볼 수 있다.
4. 하단 **플로팅 탭바**가 보이고 홈 탭이 활성, 나머지 탭은 플레이스홀더로 이동한다.
5. 로딩/빈/에러 상태가 자연스럽다.

이로써 "로그인 → 홈" 수직 슬라이스가 완성되어, 이후 거래추가·OCR·통계가 같은 구조에 붙는다.

## 2. 범위

**포함**: 홈 화면(잔액·수입지출·최다지출·날짜별 거래), 팀 선택기(바텀시트), 멤버 목록(바텀시트, 읽기전용), 하단 플로팅 탭바(홈 활성 + 나머지 플레이스홀더), 로딩/빈/에러 상태.

**제외(다음 Phase)**: 거래 추가/OCR, 거래 상세, 통계 전용 화면, 회비, 멤버 초대, 모임 생성, 다른 탭의 실제 화면, 거래 행 탭 동작.

## 3. 화면 레이아웃

```
┌────────────────────────────────┐
│ 청바지 ▾                    👥   │  ① 상단: 팀선택(좌) · 멤버(우)
│ ┌────────────────────────────┐ │
│ │ 전체 잔액                    │ │  ② 잔액 카드 (그린·크게)
│ │ ₩312,000                   │ │
│ └────────────────────────────┘ │
│ ┌─────────────┐┌─────────────┐ │  ③ 수입/지출 2카드 + 전월대비%
│ │이번 달 수입   ││이번 달 지출   │ │
│ │+620,000     ││-308,000     │ │
│ │↗ 전월 대비100%││↗ 전월 대비100%│ │
│ └─────────────┘└─────────────┘ │
│ ┌────────────────────────────┐ │  ④ 이번 달 최다 지출
│ │ 이번 달 최다 지출            │ │
│ │ ⚽ 활동비          -285,000 │ │
│ └────────────────────────────┘ │
│ 거래 내역                       │  ⑤ 거래 (날짜별 그룹)
│ 4월 26일 일요일 ─────────────── │
│ ⚽ 디즈니랜드 1일권     -285,000│
│ 4월 2일 목요일 ──────────────── │
│ ❤️ 학교 지원금        +500,000 │
├────────────────────────────────┤
│ [홈] 거래   (+)   내역   더보기  │  ⑥ 하단 플로팅 탭바
└────────────────────────────────┘
```

## 4. 데이터 소스 (모두 읽기 전용)

기존 백엔드(공유 Railway). api client는 이미 이식됨(JWT/401 자동).

| UI 영역 | 엔드포인트 | 응답 핵심 |
|---|---|---|
| 팀 목록/현재팀/멤버 | `GET /teams`, `GET /teams/:teamId` | `{data: Team[]}`, `{data: Team}` (members 포함) |
| ② 전체 잔액 | `GET /deals/summary/:teamId` | `{data:{income,expense,balance}}` |
| ③④ 이번달 수입/지출·전월대비·최다지출 | `GET /deals/stats/:teamId?year&month` | `{data:{current:{income,expense}, previous:{income,expense}, incomeChange, expenseChange, categoryBreakdown:[{category,total}], topCategory:{category,total}|null}}` |
| ⑤ 거래 | `GET /deals?teamId&year&month` | `{data: Deal[]}` → 클라이언트가 `date` 기준 일자별 그룹 |

색: 수입 `#3182F6`(파랑) / 지출 `#F04452`(빨강) / 잔액 `#3DD598`(그린). 카테고리 이모지·라벨은 메인 repo `mobile/src/constants/categories.ts` 이식.

엣지: 신규/테스트 계정은 전월 데이터가 없어 `previous`가 0일 수 있음 → 전월대비는 0/누락 시 안전 표기(예: 표시 생략 또는 "—"). `topCategory`가 null이면 ④ 카드 생략.

## 5. 컴포넌트 / 파일 구조 (격리·단일책임)

```
src/
  pages/index.tsx            # 홈: 인증가드 + 데이터 로딩 + 섹션 조합
  pages/_tab-placeholder.tsx # 거래/내역/더보기 공용 플레이스홀더 화면
  components/
    home/
      BalanceCard.tsx        # ② 전체 잔액
      SummaryCards.tsx       # ③ 수입/지출 2카드(전월대비)
      TopCategoryCard.tsx    # ④ 최다 지출
      TransactionList.tsx    # ⑤ 날짜별 그룹 + 빈 상태
      TransactionRow.tsx     # ⑤ 거래 1행 (아이콘·이름·금액)
    team/
      TeamSelector.tsx       # ① 팀명 ▾ + 팀 선택 바텀시트
      MemberSheet.tsx        # ① 멤버 목록 바텀시트(읽기전용)
    layout/
      TabBar.tsx             # ⑥ 하단 플로팅 탭바
  store/
    teamStore.ts             # teams/currentTeam/summary/stats/transactions + 액션
  api/
    team.ts                  # getMyTeams, getTeam
    deal.ts                  # getMonthly, getSummary, getMonthlyStats
  constants/
    categories.ts            # 카테고리 이모지/라벨 (이식)
  lib/
    date.ts                  # 날짜 그룹·"M월 D일 요일" 포맷
    format.ts                # ₩ 통화 포맷
```

각 컴포넌트는 **데이터를 props로 받아 표시만** 한다(상태/로딩은 teamStore + 홈 페이지가 담당). → 독립적으로 작성·테스트 가능 → **서브에이전트 병렬 작업에 적합**.

## 6. 상태 관리 (teamStore, zustand)

메인 repo teamStore에서 **읽기 흐름만** 이식·트리밍:
- 상태: `teams`, `currentTeam`, `summary`, `stats`, `transactionsByMonth`(월별 캐시), `loading`
- 액션: `fetchTeams()` → 첫 팀 자동 선택, `setCurrentTeam(teamId)` → 해당 팀의 summary+stats+이번달 거래 병렬 로드, `fetchSummary`, `fetchStats`, `fetchTransactions`
- 쓰기 액션(create/update/delete/invite/dutch)은 제외.

## 7. 인터랙션 (실동작 vs 플레이스홀더)

- ✅ 팀 선택 `▾` → 팀 목록 바텀시트 → 선택 시 `setCurrentTeam` (실동작)
- ✅ 멤버 `👥` → 현재 팀 멤버 목록 바텀시트 (읽기전용; `team.displayMode`에 따라 닉네임/실명)
- 🔲 하단 탭 거래/내역/더보기 → 공용 플레이스홀더("곧 추가돼요")
- 🔲 (+) 버튼 → 플레이스홀더 (거래추가 Phase 3)
- 🔲 거래 행 탭 → 동작 없음 (상세 Phase 3)

## 8. 상태 처리

- 로딩: 잔액/거래 영역 스켈레톤 또는 스피너
- 모임 없음: "아직 모임이 없어요" + 안내(모임 만들기는 Phase 3)
- 거래 없음: "이번 달 거래가 없어요"
- 에러: 재시도 버튼 (401은 api client 자동 처리)

## 9. 비주얼 / TDS 적용 + 리스크

- 컴포넌트 매핑: **Top**(헤더) · **List/ListRow**(거래·멤버) · **ListHeader**(섹션/날짜) · **Badge**(카테고리) · **BottomSheet**(팀/멤버). 잔액·요약·최다지출 카드는 View+Txt 조합.
- 패키지: `@toss/tds-react-native@2.0.3` (peer react `*` → React 19 허용). `TDSProvider`로 `src/_app.tsx` 래핑 필요.
- **리스크: TDS + React 19 실제 렌더링.** 공식 문서엔 "react 18까지" 경고(구버전 기준)가 있음.
  - **완화: 구현 0단계에서 TDSProvider + 컴포넌트 1개를 샌드박스로 스모크 테스트.** 정상이면 TDS로 진행. 깨지면 **StyleSheet로 TDS 룩 복제**(브랜드 토큰)로 폴백 — **레이아웃/정보 구조/색은 동일**, 구현 수단만 교체. 어느 쪽이든 본 설계는 유효.
- 하단 탭바: 앱인토스 정책=플로팅 2~5개, 커스텀 하단 UI 충돌 금지. 기존의 중앙 (+) FAB 대신 **탭 4개(홈/거래/내역/더보기) + 별도 + 액션**으로 정책 충돌 없이 구성.

## 10. 검증

각 단계: typecheck/lint/build 통과 + (순수 로직은) jest. 최종: 샌드박스에서 로그인→홈 실데이터 표시 + 팀 전환 + 멤버 확인.

## 11. 실행 방식 (사용자 요청 반영)

- 단계별로 하나씩, 각 단계 끝에 짧은 보고 + 검토.
- 독립적인 컴포넌트(BalanceCard/SummaryCards/TopCategoryCard/TransactionRow 등)는 **서브에이전트 병렬** 작성.
- 토큰 아끼지 말고 꼼꼼히.
