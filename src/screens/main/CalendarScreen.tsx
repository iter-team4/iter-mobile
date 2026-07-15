import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackArrowIcon, ChevronRightIcon, InfoIcon } from '../../components/icons';
import { RouteThumbnail } from '../../components/RouteThumbnail';
import { useRunData } from '../../context/RunDataContext';
import { colors } from '../../theme/colors';
import { formatPace } from '../../utils/geo';
import type { RunRecord } from '../../api/mockApi';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// yyyy-mm-dd, using local time (not UTC) so "today" lines up with the device clock
function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function CalendarScreen() {
  const { runs } = useRunData();
  const today = new Date();

  const [viewedYear, setViewedYear] = useState(today.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const isViewingCurrentMonth = viewedYear === today.getFullYear() && viewedMonth === today.getMonth();

  // Index this month's runs by day-of-month for quick lookup while rendering the grid.
  const runsByDay = useMemo(() => {
    const map = new Map<string, RunRecord>();
    for (const run of runs) {
      const runDate = new Date(run.date);
      if (runDate.getFullYear() === viewedYear && runDate.getMonth() === viewedMonth) {
        map.set(dateKey(runDate), run);
      }
    }
    return map;
  }, [runs, viewedYear, viewedMonth]);

  const cells = useMemo(() => {
    const firstWeekday = new Date(viewedYear, viewedMonth, 1).getDay();
    const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate();
    const list: (number | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [viewedYear, viewedMonth]);

  const monthTotals = useMemo(() => {
    let miles = 0;
    for (const run of runsByDay.values()) miles += run.distanceMiles;
    return { count: runsByDay.size, miles: miles.toFixed(1) };
  }, [runsByDay]);

  const selectedRun = runsByDay.get(`${viewedYear}-${viewedMonth}-${selectedDay}`) ?? null;

  const goToPrevMonth = () => {
    if (viewedMonth === 0) {
      setViewedMonth(11);
      setViewedYear((y) => y - 1);
    } else {
      setViewedMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    if (viewedMonth === 11) {
      setViewedMonth(0);
      setViewedYear((y) => y + 1);
    } else {
      setViewedMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.monthHeaderRow}>
          <Pressable onPress={goToPrevMonth} style={styles.navButton}>
            <BackArrowIcon />
          </Pressable>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[viewedMonth]} {viewedYear}
            </Text>
            <Text style={styles.monthSubtitle}>
              {monthTotals.count} runs · {monthTotals.miles} mi this month
            </Text>
          </View>

          <Pressable onPress={goToNextMonth} style={styles.navButton}>
            <ChevronRightIcon color={colors.nearBlack} />
          </Pressable>
        </View>

        <View style={styles.grid}>
          <View style={styles.weekdayRow}>
            {WEEKDAY_LETTERS.map((letter, i) => (
              // eslint-disable-next-line react/no-array-index-key -- letters repeat (two "S"s, two "T"s)
              <Text key={i} style={styles.weekdayLabel}>
                {letter}
              </Text>
            ))}
          </View>

          <View style={styles.dayGrid}>
            {cells.map((day, index) => {
              if (day === null) return <View key={index} style={styles.dayCell} />;

              const hasRun = runsByDay.has(`${viewedYear}-${viewedMonth}-${day}`);
              const isToday = isViewingCurrentMonth && day === today.getDate();
              const isSelected = day === selectedDay;

              return (
                <Pressable key={index} onPress={() => setSelectedDay(day)} style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayCircle,
                      isSelected && styles.dayCircleSelected,
                      isToday && !isSelected && styles.dayCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        (isToday || isSelected) && styles.dayNumberBold,
                        isSelected && styles.dayNumberSelected,
                        isToday && !isSelected && styles.dayNumberToday,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                  <View style={[styles.runDot, hasRun && { backgroundColor: isSelected ? '#1A1714' : colors.gold }]} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.dayDetail}>
          {selectedRun ? (
            <View>
              <View style={styles.dayDetailHeaderRow}>
                <Text style={styles.dayDetailHeading}>
                  {MONTH_NAMES[viewedMonth]} {selectedDay}
                </Text>
                <View style={styles.loggedBadge}>
                  <Text style={styles.loggedBadgeText}>Run logged</Text>
                </View>
              </View>

              <View style={styles.runCard}>
                <RouteThumbnail points={selectedRun.route} width={311} height={110} />
                <View style={styles.runCardBody}>
                  <Text style={styles.runCardTitle}>{selectedRun.pathName}</Text>
                  <View style={styles.runCardStatsRow}>
                    <View style={styles.runCardStat}>
                      <Text style={styles.runCardStatLabel}>Distance</Text>
                      <Text style={styles.runCardStatValue}>{selectedRun.distanceMiles.toFixed(1)} mi</Text>
                    </View>
                    <View style={styles.runCardStat}>
                      <Text style={styles.runCardStatLabel}>Avg Pace</Text>
                      <Text style={styles.runCardStatValue}>
                        {formatPace(selectedRun.durationSeconds, selectedRun.distanceMiles)}
                      </Text>
                    </View>
                    <View style={styles.runCardStat}>
                      <Text style={styles.runCardStatLabel}>Date</Text>
                      <Text style={styles.runCardStatValue}>
                        {MONTH_NAMES[viewedMonth].slice(0, 3)} {selectedDay}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.dayDetailHeading}>
                {MONTH_NAMES[viewedMonth]} {selectedDay}
              </Text>
              <View style={styles.noRunCard}>
                <View style={styles.noRunIconBadge}>
                  <InfoIcon />
                </View>
                <Text style={styles.noRunTitle}>No run logged</Text>
                <Text style={styles.noRunBody}>Rest day. Tap a run day to see your stats.</Text>
              </View>
            </View>
          )}
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
    paddingBottom: 28,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    marginBottom: 20,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.fieldBg,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    color: colors.nearBlack,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  monthSubtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  grid: {
    marginHorizontal: 20,
    backgroundColor: colors.fieldBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.13)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110,100,88,0.1)',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayCircleSelected: {
    backgroundColor: colors.gold,
  },
  dayCircleToday: {
    borderColor: colors.gold,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.nearBlack,
  },
  dayNumberBold: {
    fontWeight: '800',
  },
  dayNumberSelected: {
    color: '#1A1714',
  },
  dayNumberToday: {
    color: colors.gold,
  },
  runDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  dayDetail: {
    paddingHorizontal: 16,
  },
  dayDetailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayDetailHeading: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  loggedBadge: {
    backgroundColor: 'rgba(213,160,33,0.12)',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(213,160,33,0.25)',
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  loggedBadgeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  runCard: {
    backgroundColor: colors.fieldBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.14)',
    overflow: 'hidden',
  },
  runCardBody: {
    padding: 16,
  },
  runCardTitle: {
    color: colors.nearBlack,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  runCardStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  runCardStat: {
    flex: 1,
    backgroundColor: colors.creamBg,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.1)',
  },
  runCardStatLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  runCardStatValue: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  noRunCard: {
    backgroundColor: colors.fieldBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.12)',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noRunIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.creamBg,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  noRunTitle: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  noRunBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 200,
  },
});
