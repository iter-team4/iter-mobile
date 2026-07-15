import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark, PathsTabIcon } from '../../components/icons';
import { StatTile } from '../../components/StatTile';
import { useAuth } from '../../context/AuthContext';
import { useRunData } from '../../context/RunDataContext';
import type { AppStackParamList, MainTabParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { formatDuration, formatPace } from '../../utils/geo';
import { formatRelativeDate, formatWeekdayHeading } from '../../utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { runs } = useRunData();

  const weekStats = useMemo(() => {
    const cutoff = Date.now() - ONE_WEEK_MS;
    const thisWeek = runs.filter((r) => new Date(r.date).getTime() >= cutoff);
    const totalMiles = thisWeek.reduce((sum, r) => sum + r.distanceMiles, 0);
    const totalSeconds = thisWeek.reduce((sum, r) => sum + r.durationSeconds, 0);
    return {
      miles: totalMiles.toFixed(1),
      count: thisWeek.length,
      avgPace: formatPace(totalSeconds, totalMiles),
    };
  }, [runs]);

  const recentRuns = runs.slice(0, 3);
  const firstInitial = (user?.username?.[0] ?? '?').toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.dateLabel}>{formatWeekdayHeading(new Date())}</Text>
              <Text style={styles.greeting}>
                Welcome back, <Text style={{ color: colors.gold }}>{user?.username ?? 'Runner'}</Text> 👋
              </Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{firstInitial}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatTile label="This Week" value={weekStats.miles} unit="mi" />
            <StatTile label="Runs" value={String(weekStats.count)} unit="runs" />
            <StatTile label="Avg Pace" value={weekStats.avgPace} unit="/mi" />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.actionCards}>
            <Pressable
              onPress={() => navigation.navigate('StartRun')}
              style={({ pressed }) => [styles.startRunCard, pressed && styles.pressed]}
            >
              <View>
                <Text style={styles.startRunEyebrow}>READY TO GO?</Text>
                <Text style={styles.startRunTitle}>Start a Run</Text>
              </View>
              <View style={styles.startRunIconBadge}>
                <LogoMark size={22} color="#1A1714" />
              </View>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('PathBuilder')}
              style={({ pressed }) => [styles.createPathCard, pressed && styles.pressed]}
            >
              <View>
                <Text style={styles.createPathEyebrow}>PLAN AHEAD</Text>
                <Text style={styles.createPathTitle}>Create a Path</Text>
              </View>
              <View style={styles.createPathIconBadge}>
                <PathsTabIcon active size={24} />
              </View>
            </Pressable>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Runs</Text>

            {recentRuns.length === 0 ? (
              <View style={styles.emptyRecent}>
                <Text style={styles.emptyRecentText}>
                  No runs yet — hit "Start a Run" above to log your first one.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {recentRuns.map((run) => (
                  <View key={run.id} style={styles.runCard}>
                    <View style={styles.runIconBadge}>
                      <LogoMark size={16} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.runName} numberOfLines={1}>
                        {run.pathName}
                      </Text>
                      <Text style={styles.runMeta}>
                        {formatRelativeDate(run.date)} · {formatDuration(run.durationSeconds)}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.runDistance}>{run.distanceMiles.toFixed(1)} mi</Text>
                      <Text style={styles.runPace}>
                        {formatPace(run.durationSeconds, run.distanceMiles)} /mi
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
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
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 3,
  },
  greeting: {
    color: colors.nearBlack,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(213,160,33,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(213,160,33,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  actionCards: {
    gap: 12,
    marginBottom: 28,
  },
  pressed: {
    opacity: 0.9,
  },
  startRunCard: {
    borderRadius: 20,
    backgroundColor: colors.gold,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 5,
  },
  startRunEyebrow: {
    color: 'rgba(42,31,20,0.65)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  startRunTitle: {
    color: '#1A1714',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  startRunIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPathCard: {
    borderRadius: 20,
    backgroundColor: colors.fieldBg,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.22)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createPathEyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  createPathTitle: {
    color: colors.nearBlack,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  createPathIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(110,100,88,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentSection: {},
  sectionTitle: {
    color: colors.nearBlack,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  emptyRecent: {
    backgroundColor: colors.fieldBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.14)',
    padding: 20,
  },
  emptyRecentText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  runCard: {
    backgroundColor: colors.fieldBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.14)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  runIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(213,160,33,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(213,160,33,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runName: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  runMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  runDistance: {
    color: colors.nearBlack,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  runPace: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
