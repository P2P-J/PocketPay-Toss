import { colors } from './colors';

// 멤버 아바타 파스텔 팔레트 (인덱스 % 길이로 배정) — 멤버 목록/분담 공유
export const AVATAR_PALETTE: { bg: string; fg: string }[] = [
  { bg: '#E8F3FF', fg: colors.income },
  { bg: colors.brandTint, fg: colors.brandStrong },
  { bg: colors.expenseTint, fg: colors.expense },
  { bg: '#FFF4E6', fg: colors.warn },
  { bg: '#F3F0FF', fg: '#845EF7' },
];

export const avatarColor = (index: number) => AVATAR_PALETTE[index % AVATAR_PALETTE.length]!;
