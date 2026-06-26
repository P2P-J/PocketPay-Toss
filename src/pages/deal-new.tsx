import { createRoute, useNavigation } from '@granite-js/react-native';
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, type ImageResponse } from '@apps-in-toss/framework';
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { analyzeReceipt } from '../api/ocr';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { formatDateGroup, todayIso } from '../lib/date';
import { formatAmountInput, parseAmount } from '../lib/format';
import { getCategoryLabel } from '../constants/categories';
import { CategoryPicker } from '../components/deal/CategoryPicker';
import { DatePickerSheet } from '../components/deal/DatePickerSheet';
import { DetailHeader } from '../components/layout/DetailHeader';
import { useTeamStore } from '../store/teamStore';

export const Route = createRoute('/deal-new', { component: DealNewPage });

function DealNewPage() {
  const navigation = useNavigation();
  const addTransaction = useTeamStore((s) => s.addTransaction);
  const updateTransaction = useTeamStore((s) => s.updateTransaction);
  const deleteTransaction = useTeamStore((s) => s.deleteTransaction);

  // 진입 시점의 편집 대상 스냅샷(있으면 수정 모드) + 스토어 플래그 즉시 정리
  const [editing] = useState(() => useTeamStore.getState().editingTransaction);
  useEffect(() => { useTeamStore.getState().setEditingTransaction(null); }, []);

  const [type, setType] = useState<'income' | 'expense'>(editing?.type ?? 'expense');
  const [amount, setAmount] = useState(editing?.amount ?? 0);
  const [merchant, setMerchant] = useState(editing?.merchant ?? '');
  const [memo, setMemo] = useState(editing?.description ?? '');
  const [date, setDate] = useState(editing?.date ?? todayIso());
  const [category, setCategory] = useState<string | null>(editing?.category ?? null);
  const [datePicker, setDatePicker] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(editing?.receiptUrl ?? null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(editing?.receiptUrl ?? null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const canSave = amount > 0 && !!category;

  const onSave = () => {
    if (!canSave) return;
    const payload = { type, amount, category: category!, merchant: merchant.trim(), description: memo.trim(), date, receiptUrl: receiptUrl ?? undefined };
    if (editing) updateTransaction(editing.id, payload);
    else addTransaction(payload);
    navigation.goBack();
  };

  // OCR: 촬영/앨범 → 분석은 백그라운드(논블로킹) → 거래처·금액·날짜 자동 채움
  const runOcr = async (uri: string) => {
    setOcrLoading(true);
    try {
      const r = await analyzeReceipt({ uri });
      if (r.storeInfo && r.storeInfo !== 'N/A') setMerchant(r.storeInfo);
      if (r.price > 0) setAmount(r.price);
      if (r.date) setDate(r.date);
      if (r.receiptUrl) setReceiptUrl(r.receiptUrl);
    } catch (e) {
      Alert.alert('영수증 분석 실패', e instanceof Error ? e.message : '다시 시도해주세요.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleImage = (img: ImageResponse) => {
    setReceiptUri(img.dataUri);
    void runOcr(img.dataUri);
  };

  const capture = async () => {
    try {
      handleImage(await openCamera({ maxWidth: 1600 }));
    } catch (e) {
      if (e instanceof OpenCameraPermissionError) Alert.alert('권한 필요', '설정에서 카메라 권한을 허용해주세요.');
    }
  };

  const pickAlbum = async () => {
    try {
      const imgs = await fetchAlbumPhotos({ maxCount: 1, maxWidth: 1600 });
      if (imgs[0]) handleImage(imgs[0]);
    } catch {
      Alert.alert('앨범을 열 수 없어요', '설정에서 사진 접근 권한을 확인해주세요.');
    }
  };

  const onAttach = () => {
    Alert.alert('영수증 첨부', undefined, [
      { text: '촬영하기', onPress: capture },
      { text: '앨범에서 선택', onPress: pickAlbum },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const onDelete = () => {
    if (!editing) return;
    const name = editing.merchant || getCategoryLabel(editing.category);
    Alert.alert('거래 삭제', `'${name}' 거래를 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => { deleteTransaction(editing.id); navigation.goBack(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <DetailHeader title={editing ? '거래 수정' : '거래 등록'} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* 수입/지출 토글 */}
        <View style={styles.toggle}>
          {(['expense', 'income'] as const).map((t) => {
            const on = type === t;
            const onColor = t === 'income' ? colors.income : colors.expense;
            return (
              <Pressable key={t} style={[styles.toggleItem, on && styles.toggleItemOn]} onPress={() => { setType(t); setCategory(null); }}>
                <Txt typography="t5" fontWeight="bold" color={on ? onColor : colors.textCaption}>{t === 'income' ? '수입' : '지출'}</Txt>
              </Pressable>
            );
          })}
        </View>

        {/* 금액 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>금액</Txt>
          <View style={styles.amountRow}>
            <Text style={styles.won}>₩</Text>
            <TextInput
              style={styles.amountInput}
              value={formatAmountInput(amount)}
              onChangeText={(t) => setAmount(parseAmount(t))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* 거래처 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>거래처 (선택)</Txt>
          <TextInput style={styles.box} value={merchant} onChangeText={setMerchant} placeholder="예: 밥집" placeholderTextColor={colors.textTertiary} />
        </View>

        {/* 메모 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>메모 (선택)</Txt>
          <TextInput style={styles.box} value={memo} onChangeText={setMemo} placeholder="메모를 입력하세요" placeholderTextColor={colors.textTertiary} />
        </View>

        {/* 날짜 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>날짜</Txt>
          <Pressable style={styles.box} onPress={() => setDatePicker(true)}>
            <Txt typography="t5" color={colors.textPrimary}>{formatDateGroup(date)}</Txt>
          </Pressable>
        </View>

        {/* 카테고리 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>카테고리</Txt>
          <CategoryPicker type={type} value={category} onChange={setCategory} />
        </View>

        {/* 영수증 (촬영/앨범 → OCR 자동채움) */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>영수증</Txt>
          {receiptUri ? (
            <Pressable style={styles.receiptPreview} onPress={onAttach}>
              <Image source={{ uri: receiptUri }} style={styles.receiptImg} resizeMode="cover" />
              {ocrLoading && (
                <View style={styles.ocrOverlay}>
                  <ActivityIndicator color={colors.white} />
                  <Txt typography="t7" fontWeight="medium" color={colors.white}>영수증 분석 중…</Txt>
                </View>
              )}
            </Pressable>
          ) : (
            <Pressable style={styles.receiptBtn} onPress={onAttach}>
              <Text style={styles.receiptEmoji}>📷</Text>
              <Txt typography="t5" fontWeight="medium" color={colors.textSecondary}>영수증 첨부하기</Txt>
            </Pressable>
          )}
        </View>

        {/* 이 거래로 더치페이 (v2) */}
        <Pressable style={styles.dutch}>
          <Txt typography="t5" fontWeight="medium" color={colors.textSecondary}>이 거래로 더치페이</Txt>
        </Pressable>

        {/* 저장 */}
        <Pressable style={[styles.save, !canSave && styles.saveOff]} onPress={onSave} disabled={!canSave}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>저장</Txt>
        </Pressable>

        {/* 거래 삭제 (수정 모드) */}
        {editing && (
          <Pressable style={styles.delete} onPress={onDelete}>
            <Txt typography="t4" fontWeight="bold" color={colors.expense}>거래 삭제</Txt>
          </Pressable>
        )}
      </ScrollView>

      <DatePickerSheet visible={datePicker} value={date} onSelect={setDate} onClose={() => setDatePicker(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.xl },
  toggle: { flexDirection: 'row', backgroundColor: colors.grey100, borderRadius: radius.button, padding: 4 },
  toggleItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: radius.button - 2 },
  toggleItemOn: { backgroundColor: colors.white },
  field: { gap: spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderBottomWidth: 2, borderBottomColor: colors.divider, paddingBottom: spacing.sm },
  won: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: colors.textPrimary, padding: 0 },
  box: { backgroundColor: colors.grey100, borderRadius: radius.button, paddingHorizontal: spacing.lg, height: 52, justifyContent: 'center', fontSize: 16, color: colors.textPrimary },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 52, borderRadius: radius.button, borderWidth: 1, borderColor: colors.divider, borderStyle: 'dashed' },
  receiptEmoji: { fontSize: 18, lineHeight: 23 },
  receiptPreview: { borderRadius: radius.button, overflow: 'hidden', backgroundColor: colors.grey100 },
  receiptImg: { width: '100%', height: 220 },
  ocrOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: 'rgba(0,0,0,0.45)' },
  dutch: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, borderWidth: 1, borderColor: colors.divider },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand },
  saveOff: { backgroundColor: colors.grey300 },
  delete: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: '#FFEDED' },
});
