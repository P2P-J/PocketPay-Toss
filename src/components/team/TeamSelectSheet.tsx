import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@granite-js/react-native';
import { colors } from '../../constants/colors';
import { getTeamId } from '../../types/team';
import type { Team } from '../../types/team';

interface Props {
  visible: boolean;
  teams: Team[];
  currentTeamId: string | null;
  onSelect: (teamId: string) => void;
  onClose: () => void;
}

export function TeamSelectSheet({ visible, teams, currentTeamId, onSelect, onClose }: Props) {
  const navigation = useNavigation();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>모임 선택</Text>
        {teams.map((team) => {
          const id = getTeamId(team);
          const active = id === currentTeamId;
          return (
            <Pressable
              key={id}
              style={styles.row}
              onPress={() => {
                onSelect(id);
                onClose();
              }}
            >
              <Text style={[styles.name, active && styles.active]}>{team.name}</Text>
              {active && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        })}
        <View style={styles.divider} />
        <Pressable
          style={styles.row}
          onPress={() => {
            onClose();
            navigation.navigate('/team-new' as '/');
          }}
        >
          <Text style={styles.create}>+ 새 모임 만들기</Text>
        </Pressable>
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
    gap: 4,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', height: 52 },
  name: { fontSize: 16, color: colors.textPrimary, flex: 1 },
  active: { color: colors.brand, fontWeight: '600' },
  check: { color: colors.brand, fontSize: 16 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 4 },
  create: { fontSize: 16, color: colors.brand, fontWeight: '600' },
});
