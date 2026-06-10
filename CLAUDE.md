# PocketPay-Toss (작은 모임 · 앱인토스 미니앱)

기존 PocketPay(Expo React Native, iOS 정식 출시됨)를 앱인토스(Granite) 미니앱으로
포팅하는 프로젝트. 백엔드는 기존과 **동일한 Railway 서버를 공유**한다.

## 작업 규칙 (사용자 선호)

- **한국어로 응답**한다.
- **단계별로 진행**한다. 한 task가 끝나면 짧게 보고하고, 사용자가 "계속 / 넘어가"
  신호를 줄 때 다음으로 넘어간다. 큰 작업은 계획을 먼저 세운다.
- **큰 그림 위주로 소통**한다. 기술 디테일은 옵션 A/B/C + 트레이드오프 + 추천으로
  제시하고 사용자는 선택만 한다. 어려운 용어는 즉시 풀어 설명한다.
- **디자인 품질을 중시**한다. 디자인 결정은 목업/표 등 시각적으로 구체적으로 다룬다.
- **task별 commit** (1 task = 1 commit). fix/refactor는 별도 commit.
- 커밋 메시지에 **`Co-Authored-By` 라인을 절대 포함하지 않는다.**
- env/키/시크릿 등 **보안 민감 정보는 README/커밋에 절대 포함하지 않는다.**
- 자동 수락(bypassPermissions) 사용 후에는 반드시 원래 설정으로 복원한다.
- superpowers skills를 적극 활용한다.

## 핵심 사실

- 브랜드 컬러: 메인 `#3DD598`(그린) / 수입 `#3182F6`(블루) / 지출 `#F04452`(레드)
- 공유 백엔드: `https://pocketpay-backend-production.up.railway.app`
- **메인 repo 경로**: `~/aen-project/PocketPay` (Expo RN, App Store 1.1 정식 출시본)
- 디자인 분석 문서: `~/aen-project/PocketPay/analysis/` (APP-UX-ANALYSIS.md 등)
- GitHub: `https://github.com/P2P-J/PocketPay-Toss.git`
- 앱인토스 appName: `pocketpay` / displayName: `작은 모임`

## 메인 PocketPay 코드 참조 (중요)

- `~/aen-project/PocketPay` 폴더에 **Read 권한 부여됨** (.claude/settings.local.json).
- 백엔드 API/모델/인증 흐름/비즈니스 로직을 그대로 공유하므로 자주 참조 필요.
- **요약 문서 먼저**: `docs/main-repo-reference/` (5개 .md — README, api-endpoints, data-models, auth-flow, business-logic)
- **디테일**: 메인 repo 절대경로로 직접 Read (예: `~/aen-project/PocketPay/backend/services/auth/auth.local.service.ts`)

## 깊은 컨텍스트 위치

- **Sprint 계획**: `docs/plans/sprint-*.md` (이 repo)
- **메모리** (path 기반 자동 로드): `~/.claude/projects/-Users-jobogeun-aen-project-pocketpay-toss/memory/`
  - `project_status_toss.md` — 현재 진행 상태
  - `main_repo_relationship.md` — 메인 repo와의 관계, 백엔드 공유 구조
  - `toss_miniapp_research.md` — 시장 조사 + 정책 요약
  - `tech_decisions.md` — RN(Granite) 선택 이유 + 결정 이력
  - `user_preferences.md`, `feedback_commit.md`, `app_ux_research.md` — 메인 repo에서 그대로 복사됨
