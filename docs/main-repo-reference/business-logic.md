# 메인 PocketPay 비즈니스 로직 요약

> **출처**: `backend/services/`, `backend/utils/`, `mobile/src/constants/categories.ts` 등
> 코드 디테일은 해당 파일 직접 Read.

## 1. 카테고리 (`mobile/src/constants/categories.ts`)

거래(Deal)의 `category` 필드에 들어가는 값. 한글 + 이모지 + 영문 key 매핑.

지출 카테고리 (8개 + etc):
- 음식 🍔 / 카페 ☕ / 교통 🚇 / 쇼핑 🛍️ / 문화 🎭 / 의료 💊 / 생활 🏠 / 기타 💰

수입 카테고리:
- 회비 💵 / 환급 ↩️ / 기타 💰

`getCategoryLabel(key)`, `getCategoryEmoji(key)` 헬퍼로 표시.

## 2. 잔액/통계 계산 (`backend/services/deal/deal.service.ts`)

### getTeamSummary
```
income  = Σ Deal.price where division="수입"
expense = Σ Deal.price where division="지출"
balance = income - expense
```

### getMonthlyStats (홈 통계용, aggregate $group)
```
- 이번 달 income/expense (date 기준 month)
- 지난 달 income/expense (전월 비교)
- incomeChange % / expenseChange %
- topCategory (지출 카테고리 중 최대 합산)
- categoryBreakdown [{ category, total, percent }] (전체 지출 대비 비율)
```

성능 — 단일 aggregate `$group` 으로 한 번에 (이전엔 in-memory 루프, 5/12 라운드에서 개선).

## 3. 회비 분담 (`backend/services/fee/fee.service.ts`)

```
모임 단위 정책 (Team.feeEnabled, feeAmount, feeDueDay):
- 매월 feeDueDay까지 모든 멤버가 feeAmount 납부 의무
- FeePayment 모델로 납부 기록 (teamId + userId + year + month 유니크)
- getFeeStatus(teamId, year, month):
  → 멤버 목록 + 각자 납부 여부 (paid/unpaid) + 납부 일시
```

## 4. 더치페이 (`backend/services/dutch/`, `mobile/app/dutch.tsx`)

### 계산 (클라이언트)
```
totalAmount / participantCount = 인당 금액 (소수점 반올림)
요청자가 멤버 선택 → 각자에게 amount + accountSnapshot 으로 DutchRequest 생성
```

### 알림
- DutchRequest 생성 시 → 받는 사람들에게 푸시 알림 (`push.service`)
- 7일 후 TTL 자동 삭제

## 5. OCR 영수증 처리 (`backend/services/ocr/ocr.service.ts`)

### 흐름
```
모바일이 image (jpg/png/webp, 5MB 이내, 이미 1600폭 리사이즈됨) 업로드
   ↓
백엔드 magic byte 검증 + multer 메모리 저장
   ↓
NCP Clova Document(영수증 전용) + General 병렬 호출
   ↓
응답에서 추출:
- storeInfo (상호명)
- price (총액)
- date (거래 일시)
- businessNumber (사업자등록번호)
   ↓
응답으로 반환 (모바일이 거래 등록 화면에 자동 입력)
```

### 비용 방어
- ocrLimiter: 사용자당 분당 10회
- magic byte 검증으로 비이미지 차단

## 6. handle (고유 ID) 시스템

### 규칙
- 4~16자, 영문 소문자/숫자/언더스코어만 (`/^[a-z0-9_]+$/`)
- unique sparse (handle 없는 사용자 허용)
- **24시간 쿨다운** — `handleChangedAt` 기록 후 그 안에는 다시 변경 불가

### 사용처
- 모임 초대: 이메일 대신 handle로 멤버 검색 + 초대
- (계획) 디스코드/카톡 ID 스타일 사용자 검색

### 체크
`GET /account/check-handle?value=alice` → `{ available: true/false, reason }`

## 7. 알림 시스템 (`backend/services/push.service.ts`)

### Expo Push API 사용
```
User.pushTokens [] 에 Expo push token 저장
   ↓
이벤트 발생 (새 거래, 회비 요청, 더치페이 요청, 초대 등)
   ↓
이벤트 종류에 따라 대상 사용자들의 pushTokens 모두에게 발송
   ↓
응답이 "DeviceNotRegistered" 같은 invalid면 그 토큰 DB에서 제거
```

### 안 읽은 개수
- `User.notificationsLastViewedAt` < 알림 createdAt 인 것만 unread.
- 알림 페이지 진입 시 notificationsLastViewedAt 갱신.

## 8. 멤버 표시 정책 (Team.displayMode)

```
Team.displayMode === "nickname" → user.nickname 표시
Team.displayMode === "realName" → user.name 표시
```

회사 동호회 = realName, 게임 길드 = nickname 같이 모임 단위 선택.

## 9. 분단 보안/정책 요약

- 비밀번호: 8~20자, 영문/숫자/특수문자 중 **2가지 이상**
- 모든 ObjectId param은 Zod regex로 검증 (NoSQL injection 방어)
- 모임 owner만 가능: 모임 수정/삭제, 멤버 추방
- 거래 owner/member 구분 없음 — 모임원 누구나 거래 추가/수정/삭제 (정책 결정)
- 회원 탈퇴: 트랜잭션으로 User + 그 사람이 owner인 모임 + OAuth provider revoke 모두 처리

## 토스 미니앱 이식 우선순위 가이드

가장 핵심 도메인 흐름 (Sprint 2에 들어갈 것):
1. **로그인 + 본인 정보** (토스 appLogin → 백엔드 매핑 → /account/me)
2. **모임 목록 + 진입** (/teams + /teams/:teamId)
3. **거래 추가 + 목록** (/deals POST/GET)
4. **OCR** (/ocr/analyze + 토스 카메라 API로 사진 캡처)
5. **월별 통계** (/deals/stats/:teamId)

회비/더치페이/handle/알림은 Sprint 3에서.
