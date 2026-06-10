# 메인 PocketPay 데이터 모델 요약

> **출처**: `~/aen-project/PocketPay/backend/models/`
> MongoDB(Atlas) + Mongoose. DB명: `pocketpay`.
> 모든 모델 `timestamps: true` (createdAt + updatedAt 자동).
> 코드 디테일은 각 `.model.ts` 직접 Read.

## User (`User.model.ts`)
사용자 정보. 이메일 가입과 OAuth 가입 모두 지원.

| 필드 | 타입 | 비고 |
|------|------|------|
| email | String | indexed, OAuth는 provider별 익명 이메일일 수 있음 (Apple) |
| password | String | `select: false` — 명시 select해야 조회됨. local 가입자만 |
| name | String | required. 실명 |
| nickname | String | required, 1~20자. 모임에서 표시될 이름 |
| handle | String | 옵션. 4~16자, 영문/숫자/언더스코어. unique sparse. 디스코드 ID 스타일 |
| handleChangedAt | Date | 24시간 쿨다운 추적 |
| pushTokens | [String] | Expo push token 배열. 응답에서 자동 제외(account serializer) |
| notificationsLastViewedAt | Date | 알림 페이지 마지막 조회 — unread count 계산용 |
| provider | enum | `local` / `google` / `naver` / `kakao` / `apple` |
| providerId | String | OAuth provider의 사용자 ID |
| profileImage | String | 옵션 |

**복합 인덱스**: `(email, provider) unique sparse` — 같은 이메일이 provider별 분리 가능.

## Team (`Team.model.ts`)
모임. owner 1명 + members 다수.

| 필드 | 타입 | 비고 |
|------|------|------|
| name | String | required |
| description | String | 옵션 |
| owner | ObjectId(User) | indexed |
| members | [{ user, role, joinedAt }] | role: owner/member. members.user에 multi-key index |
| pendingInvites | [{ user, invitedBy, invitedAt }] | indexed for 내 초대 알림 빠른 조회 |
| inviteToken | String | indexed sparse. 24시간 만료 |
| inviteTokenExpiry | Date | |
| **category** | enum | `friend` / `club` (모임 성격) |
| **displayMode** | enum | `nickname` / `realName` ⭐ 모임에서 멤버 이름 표시 방식 |
| accountMode | enum | `personal` / `team` (회비 계좌 방식) |
| feeEnabled | Boolean | 회비 기능 on/off |
| account | { bank, number, holder } | 회비 받을 계좌 (옵션) |
| feeAmount | Number | 월 회비 금액 |
| feeDueDay | Number | 1~31, 매월 납부 마감일 |

⭐ `displayMode`: 모임 단위로 실명 vs 닉네임 선택. 멤버 표시 시 이 값 따라 user.name 또는 user.nickname 노출.

## Deal (`Deal.model.ts`)
거래(수입/지출 기록).

| 필드 | 타입 | 비고 |
|------|------|------|
| storeInfo | String | 상호명, indexed |
| division | enum | `수입` / `지출` (한글) |
| description | String | 사용자가 직접 메모 |
| category | String | 음식/교통/쇼핑 등 |
| price | Number | required, min 0 |
| businessNumber | String | OCR로 추출된 사업자등록번호 |
| date | Date | 거래 일자 |
| receiptUrl | String | Cloudinary 영수증 URL |
| teamId | ObjectId(Team) | required, indexed |
| createdBy | ObjectId(User) | 거래 등록자 |

**복합 인덱스**:
- `(teamId, date desc)` — 월별 조회
- `(teamId, category)` — 카테고리 통계
- `(teamId, division)` — 수입/지출 통계

## FeePayment (`FeePayment.model.ts`)
회비 납부 기록.

| 필드 | 타입 | 비고 |
|------|------|------|
| teamId | ObjectId(Team) | required indexed |
| userId | ObjectId(User) | 납부자 |
| year, month | Number | 어느 달 회비 |
| amount, paidAt, memo | | |

**unique 복합 인덱스**: `(teamId, userId, year, month)` — 같은 달 중복 납부 방지.

## DutchRequest (`DutchRequest.model.ts`)
더치페이 요청 (회식 후 정산).

| 필드 | 타입 | 비고 |
|------|------|------|
| requester | ObjectId(User) | indexed. 요청자 |
| team | ObjectId(Team) | indexed |
| recipient | ObjectId(User) | indexed. 받을 사람 |
| amount, totalAmount, participantCount, memo | | |
| accountSnapshot | { bank, number, holder } | |
| status | enum | `pending` / `dismissed` |
| expiresAt | Date | TTL 인덱스(7일 후 자동 삭제) |

## VerificationCode (`VerificationCode.model.ts`)
이메일 인증 코드 (회원가입 / 비번재설정).

| 필드 |
|------|
| email, code(6자리), purpose(회원가입/비밀번호재설정), createdAt, expiresAt(TTL), attempts |

## OAuthExchangeCode (`OAuthExchangeCode.model.ts`)
PKCE-style 일회용 교환 코드. OAuth 콜백 후 평문 토큰 노출 방지.

| 필드 |
|------|
| code, userId, codeChallenge(SHA-256), expiresAt(짧음, 30초~1분), used(boolean) |

## WithdrawnOauth (`withdrawnOauth.model.ts`)
OAuth 탈퇴 사용자 추적. 동일 provider+providerId 재가입 시 동의 재확인.

---

## 관계 요약

```
User (1) ─── (N) Team.owner / Team.members
User (1) ─── (N) Deal.createdBy
User (1) ─── (N) FeePayment.userId
User (1) ─── (N) DutchRequest.requester / recipient

Team (1) ─── (N) Deal.teamId
Team (1) ─── (N) FeePayment.teamId
Team (1) ─── (N) DutchRequest.team
```
