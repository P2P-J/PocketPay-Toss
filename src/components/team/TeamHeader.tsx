import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { getTeamId } from '../../types/team';
import type { Team } from '../../types/team';
import { TeamSelectSheet } from './TeamSelectSheet';
import { MemberSheet } from './MemberSheet';

interface Props {
  teams: Team[];
  currentTeam: Team | null;
  onSelectTeam: (teamId: string) => void;
}

export function TeamHeader({ teams, currentTeam, onSelectTeam }: Props) {
  const [teamSheet, setTeamSheet] = useState(false);
  const [memberSheet, setMemberSheet] = useState(false);
  return (
    <View style={styles.header}>
      <Pressable style={styles.left} onPress={() => setTeamSheet(true)}>
        <Text style={styles.name}>{currentTeam?.name ?? '작은 모임'}</Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>
      <Pressable style={styles.members} onPress={() => setMemberSheet(true)}>
        <Icon name="icon-user-two-mono" size={20} color={colors.textSecondary} />
      </Pressable>
      <TeamSelectSheet
        visible={teamSheet}
        teams={teams}
        currentTeamId={currentTeam ? getTeamId(currentTeam) : null}
        onSelect={onSelectTeam}
        onClose={() => setTeamSheet(false)}
      />
      <MemberSheet
        visible={memberSheet}
        team={currentTeam}
        onClose={() => setMemberSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', height: 56 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  name: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  caret: { fontSize: 16, color: colors.textSecondary },
  members: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
