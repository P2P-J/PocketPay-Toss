import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';

export const Route = createRoute('/notices', { component: NoticesPage });

// ⚠️ 더미 — 백엔드 공지 모델 없음. 실연동 시 교체.
const NOTICES = [
  { id: 'n2', title: '영수증 OCR 기능이 추가됐어요', date: '2026-06-25', body: '영수증을 촬영하면 거래처·금액·날짜가 자동으로 입력돼요. 거래 등록이 훨씬 빨라졌어요.' },
  { id: 'n1', title: '작은 모임 오픈 안내', date: '2026-06-20', body: '작은 모임이 토스에서 새롭게 열렸어요. 소모임 회계를 더 간편하게 관리해보세요.' },
];

function NoticesPage() {
  return (
    <View style={styles.container}>
      <DetailHeader title="공지사항" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {NOTICES.map((n) => (
          <View key={n.id} style={styles.card}>
            <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{n.title}</Txt>
            <Txt typography="t7" color={colors.textCaption}>{n.date}</Txt>
            <Txt typography="t6" color={colors.textSecondary}>{n.body}</Txt>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.md },
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.xs },
});
