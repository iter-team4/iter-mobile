import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AboutIcon, BellIcon, LogoMark, LogoutIcon, ChevronRightIcon, UserIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import { useRunData } from '../../context/RunDataContext';
import { colors } from '../../theme/colors';
import { formatLongDate } from '../../utils/date';

const SETTINGS_ROWS = (email: string) => [
  { icon: <UserIcon size={18} color={colors.charcoal} />, label: 'Account', sub: email },
  { icon: <BellIcon />, label: 'Notifications', sub: 'Push & email alerts' },
  { icon: <AboutIcon />, label: 'Help & Support', sub: 'FAQs, contact us' },
  { icon: <AboutIcon />, label: 'About Iter', sub: 'Version 1.0.0' },
];

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { runs } = useRunData();

  const allTimeStats = useMemo(() => {
    const totalMiles = runs.reduce((sum, r) => sum + r.distanceMiles, 0);
    const longest = runs.reduce((max, r) => Math.max(max, r.distanceMiles), 0);
    return {
      totalMiles: totalMiles.toFixed(1),
      totalRuns: runs.length,
      longest: longest.toFixed(1),
    };
  }, [runs]);

  const firstInitial = (user?.username?.[0] ?? '?').toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarLetter}>{firstInitial}</Text>
            </View>
          </View>

          <Text style={styles.name}>{user?.username ?? 'Runner'}</Text>
          <Text style={styles.memberSince}>
            Member since {user ? formatLongDate(user.createdAt) : '—'}
          </Text>

          <View style={styles.badge}>
            <LogoMark size={9} />
            <Text style={styles.badgeText}>Iter Runner</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>All-time stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>Total Miles</Text>
              <Text style={styles.statValue}>{allTimeStats.totalMiles}</Text>
              <Text style={styles.statUnit}>mi</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>Total Runs</Text>
              <Text style={styles.statValue}>{allTimeStats.totalRuns}</Text>
              <Text style={styles.statUnit}>runs</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>Longest</Text>
              <Text style={styles.statValue}>{allTimeStats.longest}</Text>
              <Text style={styles.statUnit}>mi</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Settings</Text>
          <View style={styles.settingsList}>
            {SETTINGS_ROWS(user?.email ?? '').map(({ icon, label, sub }, index, arr) => (
              <View
                key={label}
                style={[styles.settingsRow, index < arr.length - 1 && styles.settingsRowBorder]}
              >
                <View style={styles.settingsIconTile}>{icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>{label}</Text>
                  <Text style={styles.settingsSub}>{sub}</Text>
                </View>
                <ChevronRightIcon />
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => signOut()}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          >
            <LogoutIcon />
            <Text style={styles.logoutLabel}>Log Out</Text>
          </Pressable>

          <Text style={styles.footerText}>Iter · Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBg,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  hero: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110,100,88,0.1)',
  },
  avatarWrap: {
    marginBottom: 14,
  },
  avatarRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(213,160,33,0.14)',
    borderWidth: 2.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: colors.gold,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
  },
  name: {
    color: colors.nearBlack,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  memberSince: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(213,160,33,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(213,160,33,0.22)',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  statTile: {
    flex: 1,
    backgroundColor: colors.fieldBg,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.13)',
    alignItems: 'center',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    color: colors.nearBlack,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  statUnit: {
    color: colors.charcoal,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
  },
  settingsList: {
    backgroundColor: colors.fieldBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.13)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110,100,88,0.1)',
  },
  settingsIconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.creamBg,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLabel: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 1,
  },
  settingsSub: {
    color: colors.muted,
    fontSize: 12,
  },
  logoutButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(192,57,43,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  logoutLabel: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 11,
    paddingBottom: 12,
  },
});
