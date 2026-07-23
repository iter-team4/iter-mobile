import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckIcon, TrophyIcon } from '../../components/icons';
import { RouteThumbnail } from '../../components/RouteThumbnail';
import { useRunData } from '../../context/RunDataContext';
import type { AppStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { formatDuration, formatPace } from '../../utils/geo';
import { formatLongDate } from '../../utils/date';

type Props = NativeStackScreenProps<AppStackParamList, 'RunComplete'>;

export function RunCompleteScreen({ navigation, route }: Props) {
  const { stats } = route.params;
  const { runs, addRun } = useRunData();
  const hasSaved = useRef(false);

  // Snapshot prior runs on this path *before* we save the new one, so the
  // personal-best check below isn't comparing the run against itself.
  const [priorRunsOnPath] = useState(() => runs.filter((r) => r.pathId === stats.path.id));

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;
    addRun({
      pathId: stats.path.id,
      pathName: stats.path.name,
      distanceMiles: stats.distanceMiles,
      durationSeconds: stats.elapsedSeconds,
      trace: stats.route.length > 0 ? stats.route : stats.path.points,
      targetPaceSeconds: stats.targetPaceSeconds,
    });
    // Only want this to fire once, right when the screen mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFirstRunOnPath = priorRunsOnPath.length === 0;
  const bestPriorPace = priorRunsOnPath.length
    ? Math.min(...priorRunsOnPath.map((r) => r.durationSeconds / Math.max(r.distanceMiles, 0.01)))
    : null;
  const thisPace = stats.elapsedSeconds / Math.max(stats.distanceMiles, 0.01);
  const isPersonalBest = bestPriorPace !== null && thisPace < bestPriorPace;

  const today = new Date().toISOString();
  const previewRoute = stats.route.length > 1 ? stats.route : stats.path.points;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapCard}>
          <RouteThumbnail points={previewRoute} width={343} height={220} color={colors.gold} />
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>Run Complete</Text>
          <Text style={styles.title}>Great work! 🎉</Text>
          <Text style={styles.subtitle}>You crushed the {stats.path.name}.</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{stats.distanceMiles.toFixed(2)}</Text>
            <Text style={styles.statUnit}>mi</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatDuration(stats.elapsedSeconds)}</Text>
            <Text style={styles.statUnit}>min</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Pace</Text>
            <Text style={styles.statValue}>{formatPace(stats.elapsedSeconds, stats.distanceMiles)}</Text>
            <Text style={styles.statUnit}>/mi</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Target Pace</Text>
            <Text style={styles.statValue}>{stats.targetPaceSeconds}</Text>
            <Text style={styles.statUnit}>Seconds</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Date</Text>
            <Text style={[styles.statValue, styles.statValueSmall]}>{formatLongDate(today)}</Text>
          </View>
        </View>

        {(isPersonalBest || isFirstRunOnPath) && (
          <View style={styles.bestBadge}>
            <View style={styles.bestIconBadge}>
              <TrophyIcon />
            </View>
            <View>
              <Text style={styles.bestLabel}>{isFirstRunOnPath ? 'First Run' : 'Personal Best'}</Text>
              <Text style={styles.bestSub}>
                {isFirstRunOnPath
                  ? `First time running ${stats.path.name}!`
                  : `Fastest ${stats.path.name} yet!`}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.doneWrap}>
          <Pressable
            onPress={() => navigation.navigate('MainTabs')}
            style={({ pressed }) => [styles.doneButton, pressed && styles.donePressed]}
          >
            <CheckIcon size={16} color="#1A1714" />
            <Text style={styles.doneLabel}>Done — Save to Calendar</Text>
          </Pressable>
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
    paddingBottom: 24,
  },
  mapCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 22,
    overflow: 'hidden',
  },
  headingBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    color: colors.nearBlack,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 2,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.fieldBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.13)',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  statValue: {
    color: colors.nearBlack,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statValueSmall: {
    fontSize: 14,
  },
  statUnit: {
    color: colors.charcoal,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 16,
    marginTop: 16,
    backgroundColor: 'rgba(213,160,33,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(213,160,33,0.25)',
    borderRadius: 14,
    padding: 14,
  },
  bestIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(213,160,33,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 1,
  },
  bestSub: {
    color: colors.charcoal,
    fontSize: 12,
    fontWeight: '500',
  },
  doneWrap: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  doneButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  donePressed: {
    opacity: 0.9,
  },
  doneLabel: {
    color: '#1A1714',
    fontSize: 16,
    fontWeight: '700',
  },
});
