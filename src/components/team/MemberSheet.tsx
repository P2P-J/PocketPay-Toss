import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import type { Team, Member } from '../../types/team';

function memberName(m: Member, displayMode?: string): string {
  if (typeof m.user === 'string') return '멤버';
  if (displayMode === 'realName') return m.user.name || m.user.nickname || '멤버';
  return m.user.nickname || m.user.name || '멤버';
}

export function MemberSheet({
  visible,
  team,
  onClose,
}: {
  visible: boolean;
  team: Team | null;
  onClose: () => void;
}) {
  const members = team?.members ?? [];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>멤버 {members.length}명</Text>
        {members.map((m, i) => (
          <View key={m._id ?? i} style={styles.row}>
            <Text style={styles.name}>{memberName(m, team?.displayMode)}</Text>
            {m.role === 'owner' && <Text style={styles.owner}>모임장</Text>}
          </View>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', height: 48 },
  name: { fontSize: 16, color: colors.textPrimary, flex: 1 },
  owner: { fontSize: 12, color: colors.brand, fontWeight: '600' },
});
