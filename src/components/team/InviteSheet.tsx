import React, { useEffect, useState } from 'react';
import { Modal, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { share } from '@apps-in-toss/framework';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { PREVIEW_MODE } from '../../constants/config';
import { QrCode } from '../common/QrCode';
import { teamApi } from '../../api/team';

const deeplink = (token: string) => `intoss://pocketpay/join?token=${token}`;

export function InviteSheet({ visible, onClose, teamId, teamName }: {
  visible: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}) {
  const [token, setToken] = useState('');
  const [expiry, setExpiry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = React.useCallback(() => {
    if (PREVIEW_MODE) {
      setToken('DEMO1234');
      setExpiry(new Date(Date.now() + 7 * 86400000).toISOString());
      return;
    }
    setLoading(true);
    teamApi.generateInviteToken(teamId)
      .then((r) => { setToken(r.data.token); setExpiry(r.data.expiry); })
      .catch(() => setToken(''))
      .finally(() => setLoading(false));
  }, [teamId]);

  useEffect(() => { if (visible) load(); }, [visible, load]);

  const days = expiry ? Math.max(1, Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000)) : null;

  const onShare = async () => {
    if (!token) return;
    try {
      await share({ message: `‘${teamName}’ 모임에 초대할게요!\n초대 코드: ${token}\n링크로 바로 참가: ${deeplink(token)}` });
    } catch {
      Alert.alert('공유 실패', '다시 시도해주세요.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>모임 초대</Txt>
        <Txt typography="t6" color={colors.textSecondary} style={styles.sub}>코드나 QR을 친구에게 보내 모임에 초대하세요</Txt>

        {loading || !token ? (
          <View style={styles.qrBox}><Txt typography="t6" color={colors.textCaption}>{loading ? '코드 생성 중…' : '코드를 불러오지 못했어요'}</Txt></View>
        ) : (
          <>
            <View style={styles.qrBox}><QrCode value={deeplink(token)} size={200} /></View>
            <View style={styles.codeBox}>
              <Txt typography="t7" color={colors.textCaption}>초대 코드</Txt>
              <Txt typography="t3" fontWeight="bold" color={colors.textPrimary} style={styles.code}>{token}</Txt>
            </View>
            {days != null && <Txt typography="t7" color={colors.textCaption}>{days}일 후 만료돼요</Txt>}
          </>
        )}

        <View style={styles.actions}>
          <Pressable style={[styles.btn, styles.refresh]} onPress={load} disabled={loading}>
            <Txt typography="t5" fontWeight="bold" color={colors.textSecondary}>새로고침</Txt>
          </Pressable>
          <Pressable style={[styles.btn, styles.share]} onPress={onShare} disabled={!token}>
            <Txt typography="t5" fontWeight="bold" color={colors.white}>공유하기</Txt>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: spacing.screenX, paddingTop: spacing.md, paddingBottom: spacing.section, alignItems: 'center', gap: spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey200, marginBottom: spacing.md },
  sub: { textAlign: 'center', marginBottom: spacing.md },
  qrBox: { width: 232, height: 232, borderRadius: radius.card, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.grey200, alignItems: 'center', justifyContent: 'center' },
  codeBox: { alignItems: 'center', gap: 2, marginTop: spacing.sm },
  code: { letterSpacing: 2 },
  actions: { flexDirection: 'row', gap: spacing.sm, alignSelf: 'stretch', marginTop: spacing.lg },
  btn: { flex: 1, height: 50, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  refresh: { backgroundColor: colors.grey100 },
  share: { backgroundColor: colors.brand },
});
