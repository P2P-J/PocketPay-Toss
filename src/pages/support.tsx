import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';

export const Route = createRoute('/support', { component: SupportPage });

const SUPPORT_EMAIL = 'pocketpay2026@gmail.com';

const FAQ = [
  { q: '거래는 어떻게 추가하나요?', a: '홈이나 거래 탭의 + 버튼을 눌러 금액·카테고리를 입력하면 돼요. 영수증을 촬영하면 거래처·금액·날짜가 자동으로 채워져요.' },
  { q: '모임 멤버는 어떻게 초대하나요?', a: '더보기 → 멤버 관리에서 초대할 수 있어요. (실연동 준비 중)' },
  { q: '정산은 어떻게 하나요?', a: '분석 탭의 멤버에서 1인당 부담과 멤버별 정산 금액을 확인하고 정산을 요청할 수 있어요.' },
];

function SupportPage() {
  const [open, setOpen] = useState<string | null>(null);

  const inquiry = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => Alert.alert('문의하기', `${SUPPORT_EMAIL} 로 메일을 보내주세요.`));
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="고객센터" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Txt typography="t7" fontWeight="medium" color={colors.textCaption}>자주 묻는 질문</Txt>
        <View style={styles.faq}>
          {FAQ.map((f) => {
            const expanded = open === f.q;
            return (
              <Pressable key={f.q} style={styles.qRow} onPress={() => setOpen(expanded ? null : f.q)}>
                <View style={styles.qHead}>
                  <Txt typography="t5" fontWeight="medium" color={colors.textPrimary}>{f.q}</Txt>
                  <Text style={styles.caret}>{expanded ? '▴' : '▾'}</Text>
                </View>
                {expanded && <Txt typography="t6" color={colors.textSecondary}>{f.a}</Txt>}
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.inquiry} onPress={inquiry}>
          <Txt typography="t5" fontWeight="bold" color={colors.white}>이메일로 문의하기</Txt>
        </Pressable>
        <Txt typography="t7" color={colors.textCaption} textAlign="center">{SUPPORT_EMAIL}</Txt>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.md },
  faq: { gap: spacing.sm },
  qRow: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.lg, gap: spacing.sm },
  qHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  caret: { fontSize: 14, color: colors.textTertiary },
  inquiry: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
});
