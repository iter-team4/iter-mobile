import React, { useMemo, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AboutIcon, BellIcon, LogoMark, LogoutIcon, ChevronRightIcon, UserIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import { useRunData } from '../../context/RunDataContext';
import { colors } from '../../theme/colors';
import { formatLongDate } from '../../utils/date';

type SettingsSheet = 'account' | 'notifications' | 'about';

const SETTINGS_ROWS = (
  email: string,
  onOpenAccount: () => void,
  onOpenNotifications: () => void,
  onContactSupport: () => void,
  onOpenAbout: () => void,
) => [
  { icon: <UserIcon size={18} color={colors.charcoal} />, label: 'Account', sub: email, onPress: onOpenAccount },
  { icon: <BellIcon />, label: 'Notifications', sub: 'Push & email alerts', onPress: onOpenNotifications },
  { icon: <AboutIcon />, label: 'Help & Support', sub: 'FAQs, contact us', onPress: onContactSupport },
  { icon: <AboutIcon />, label: 'About Iter', sub: 'Version 1.0.0', onPress: onOpenAbout },
];

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { runs } = useRunData();
  const [openSheet, setOpenSheet] = useState<SettingsSheet | null>(null);

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

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@iterapp.com?subject=Iter%20Support');
  };

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
            {SETTINGS_ROWS(
              user?.email ?? '',
              () => setOpenSheet('account'),
              () => setOpenSheet('notifications'),
              handleContactSupport,
              () => setOpenSheet('about'),
            ).map(({ icon, label, sub, onPress }, index, arr) => (
              <Pressable
                key={label}
                onPress={onPress}
                style={({ pressed }) => [
                  styles.settingsRow,
                  index < arr.length - 1 && styles.settingsRowBorder,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.settingsIconTile}>{icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>{label}</Text>
                  <Text style={styles.settingsSub}>{sub}</Text>
                </View>
                <ChevronRightIcon />
              </Pressable>
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

      <Modal
        visible={openSheet !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenSheet(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpenSheet(null)} />
          <View style={styles.sheet}>
            {openSheet === 'account' && (
              <>
                <Text style={styles.sheetTitle}>Account</Text>
                <View style={styles.sheetInfoRow}>
                  <Text style={styles.sheetInfoLabel}>Username</Text>
                  <Text style={styles.sheetInfoValue}>{user?.username ?? '—'}</Text>
                </View>
                <View style={styles.sheetInfoRow}>
                  <Text style={styles.sheetInfoLabel}>Email</Text>
                  <Text style={styles.sheetInfoValue}>{user?.email ?? '—'}</Text>
                </View>
                <View style={[styles.sheetInfoRow, styles.sheetInfoRowLast]}>
                  <Text style={styles.sheetInfoLabel}>Member since</Text>
                  <Text style={styles.sheetInfoValue}>{user ? formatLongDate(user.createdAt) : '—'}</Text>
                </View>
              </>
            )}
            {openSheet === 'notifications' && (
              <>
                <Text style={styles.sheetTitle}>Notifications</Text>
                <Text style={styles.sheetBody}>Off — not supported yet.</Text>
              </>
            )}
            {openSheet === 'about' && (
              <>
                <View style={styles.sheetLogoRow}>
                  <LogoMark size={14} />
                  <Text style={styles.sheetTitle}>Iter</Text>
                </View>
                <Text style={styles.sheetBody}>
                  Plan a route, watch it snap to real footpaths, then go run it. Built for people who'd rather be
                  running than fighting with a map.
                </Text>
                <Text style={styles.sheetVersion}>Version 1.0.0</Text>
              </>
            )}
            <Pressable
              onPress={() => setOpenSheet(null)}
              style={({ pressed }) => [styles.sheetCloseButton, pressed && styles.pressed]}
            >
              <Text style={styles.sheetCloseLabel}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,23,20,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.fieldBg,
    borderRadius: 24,
    padding: 24,
  },
  sheetTitle: {
    color: colors.nearBlack,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  sheetLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sheetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110,100,88,0.12)',
  },
  sheetInfoRowLast: {
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  sheetInfoLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  sheetInfoValue: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '600',
  },
  sheetBody: {
    color: colors.charcoal,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sheetVersion: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  sheetCloseButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  sheetCloseLabel: {
    color: '#1A1714',
    fontSize: 15,
    fontWeight: '700',
  },
});
