import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@granite-js/react-native';
import { Icon, Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { getTeamId } from '../../types/team';
import type { Team } from '../../types/team';
import { useAlertsStore, selectUnreadCount } from '../../store/alertsStore';
import { TeamSelectSheet } from './TeamSelectSheet';
import { MemberSheet } from './MemberSheet';

interface Props {
  teams: Team[];
  currentTeam: Team | null;
  onSelectTeam: (teamId: string) => void;
}

export function TeamHeader({ teams, currentTeam, onSelectTeam }: Props) {
  const navigation = useNavigation();
  const [teamSheet, setTeamSheet] = useState(false);
  const [memberSheet, setMemberSheet] = useState(false);
  const unread = useAlertsStore(selectUnreadCount);
  return (
    <View style={styles.header}>
      <Pressable style={styles.left} onPress={() => currentTeam && setTeamSheet(true)} disabled={!currentTeam}>
        <Txt typography="t3" fontWeight="bold" color={currentTeam ? colors.textPrimary : colors.brand} numberOfLines={1} style={styles.teamName}>{currentTeam?.name ?? '작은 모임'}</Txt>
        {currentTeam && <Icon name="icon-arrow-down-mono" size={20} color={colors.textSecondary} />}
      </Pressable>
      <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('/alerts' as '/')}>
        <Icon name="icon-alarm-mono" size={22} color={colors.textSecondary} />
        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
          </View>
        )}
      </Pressable>
      {currentTeam && (
        <Pressable style={styles.members} onPress={() => setMemberSheet(true)}>
          <Icon name="icon-user-two-mono" size={20} color={colors.textSecondary} />
        </Pressable>
      )}
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
  header: { flexDirection: 'row', alignItems: 'center', height: 56, gap: 4 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  teamName: { flexShrink: 1 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.expense,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  members: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
