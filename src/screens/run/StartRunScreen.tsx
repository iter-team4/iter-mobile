import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark } from '../../components/icons';
import { NavRow } from '../../components/NavRow';
import { RouteThumbnail } from '../../components/RouteThumbnail';
import { useRunData } from '../../context/RunDataContext';
import type { AppStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { setAudioModeAsync,useAudioPlayer } from 'expo-audio';
import { PaceInput } from '../../components/PaceInput';

type Props = NativeStackScreenProps<AppStackParamList, 'StartRun'>;

export function StartRunScreen({ navigation }: Props) {
  const { savedPaths } = useRunData();
  const startSound = useAudioPlayer(
    require ('../../../assets/sounds/Start.mp3')
  );
  const [targetPace, setTargetPace] = useState<number | null>(null);
  

   useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      }).catch((error) => {
        console.error('Failed to configure audio:', error);
      });
    }, []);

  async function handleStartRun(path: (typeof savedPaths)[number]) {
    if (targetPace === null) {
      return;
    }
    try {
      await startSound.seekTo(0);
      startSound.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }

    navigation.navigate('RunInProgress', {
      path,
      targetPaceSeconds: targetPace,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavRow onBack={() => navigation.goBack()} />

      <View style={styles.header}>
        <Text style={styles.title}>Choose a path to run</Text>
        <Text style={styles.subtitle}>Pick a saved route and hit Start.</Text>
      </View>

      <View style={styles.paceSection}>
        <Text style={styles.paceTitle}>Set your target pace</Text>

        <View style={styles.paceLabels}>
          <Text style={styles.paceLabel}>Minutes</Text>
          <Text style={styles.paceLabel}>Seconds</Text>
        </View>

        <PaceInput
          value={targetPace ?? undefined}
          onChange={setTargetPace}
        />

        <Text style={styles.paceUnit}>minutes per mile</Text>
      </View>

      {savedPaths.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved paths yet</Text>
          <Text style={styles.emptyBody}>
            Head over to "Create a Path" on the Home tab to draw your first route before starting a run.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedPaths}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.pathRow}>
              <RouteThumbnail points={item.points} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.pathName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.pathMetaRow}>
                  <Text style={styles.pathDistance}>{item.distanceMiles.toFixed(1)} mi</Text>
                  {/* <View style={styles.dot} />
                  <Text style={styles.pathPoints}>{item.points.length} pts</Text> */}
                </View>
              </View>
              <Pressable
                disabled={targetPace === null}
                onPress={() => handleStartRun(item)}
                style={({ pressed }) => [
                  styles.startButton,
                  targetPace === null && styles.startButtonDisabled,
                  pressed && targetPace !== null && styles.pressed,
                ]}
              >
                <LogoMark size={11} color="#1A1714" />
                <Text style={styles.startLabel}>Start</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    color: colors.nearBlack,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 16,
  },
  emptyState: {
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.nearBlack,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.fieldBg,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.14)',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  pathName: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  pathMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pathDistance: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '800',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.muted,
  },
  pathPoints: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: colors.gold,
  },
  pressed: {
    opacity: 0.85,
  },
  startLabel: {
    color: '#1A1714',
    fontSize: 13,
    fontWeight: '700',
  },
  paceSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.fieldBg,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.14)',
    alignItems: 'center',
  },
  paceTitle: {
    color: colors.nearBlack,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  paceLabels: {
    width: 218,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    marginBottom: 6,
  },
  paceLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  paceUnit: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 8,
  },
  startButtonDisabled: {
    opacity: 0.4,
  },
});
