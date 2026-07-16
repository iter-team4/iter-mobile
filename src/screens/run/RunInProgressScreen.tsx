// Live run tracking screen. Watches the device's real GPS position while
// you run and draws the traveled route in gold over the planned route
// (shown in gray) so you can see how you're tracking against it.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {AppState,Pressable,StyleSheet,Text,View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LeafletMap, type LeafletMarker, type LeafletPolyline } from '../../components/LeafletMap';
import type { AppStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { formatDuration, formatPace, totalDistanceMiles, type LatLng } from '../../utils/geo';
import {useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCATION_TASK_NAME,RUN_LOCATIONS_KEY,} from '../../navigation/locationTask';

type Props = NativeStackScreenProps<AppStackParamList, 'RunInProgress'>;

export function RunInProgressScreen({ navigation, route }: Props) {
  const { path } = route.params;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [traveledRoute, setTraveledRoute] = useState<LatLng[]>([]);
  const [initialCenter, setInitialCenter] = useState<LatLng | null>(null);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  const loadBackgroundRoute = async () => {
  try {
    const storedJson =
      await AsyncStorage.getItem(RUN_LOCATIONS_KEY);

    if (!storedJson) return;

    const storedPoints: Array<{
      latitude: number;
      longitude: number;
      timestamp?: number;
    }> = JSON.parse(storedJson);

    const routePoints: LatLng[] = storedPoints.map(
      ({ latitude, longitude }) => ({
        latitude,
        longitude,
      }),
    );

    if (routePoints.length === 0) return;

    setTraveledRoute(routePoints);

    setInitialCenter((previousCenter) => {
      return previousCenter ?? routePoints[0];
    });
  } catch (error) {
    console.error(
      'Could not load background route:',
      error,
    );
  }
};

  // Simple 1hz timer for the elapsed-time display.
  useEffect(() => {
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Start watching GPS position as soon as the screen mounts, stop as soon
  // as it unmounts (either via Stop button or navigating away some other way).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();

      if (foreground.status !== 'granted') return;

      const background = await Location.requestBackgroundPermissionsAsync();

      if (background.status !== 'granted') return;

      const startingPoint = path.points[0];
      if (startingPoint) {
        setInitialCenter(startingPoint);
      }

      const alreadyTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME,);

      if (!alreadyTracking) {
        await AsyncStorage.removeItem(RUN_LOCATIONS_KEY);

        await Location.startLocationUpdatesAsync(
          LOCATION_TASK_NAME,
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 3,
            pausesUpdatesAutomatically: false,
            foregroundService: {
              notificationTitle: 'Run in Progress',
              notificationBody: 'Tracking your run',
            },
          },
        );
      }

      watchSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 3 },
        (position) => {
          if (cancelled) return;
          const point = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setTraveledRoute((prev) => [...prev, point]);
          setInitialCenter((prev) => prev ?? point);
        },
      );
    })();

    return () => {
      cancelled = true;

      watchSubscription.current?.remove();
      watchSubscription.current = null;

      void (async () => {
        const started =
          await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TASK_NAME,
          );

        if (started) {
          await Location.stopLocationUpdatesAsync(
            LOCATION_TASK_NAME,
          );
        }
      })();
    };
    // path only changes if this screen gets a totally new route param, which
    // doesn't happen mid-run - fine to only depend on identity here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distanceMiles = totalDistanceMiles(traveledRoute);
  const plannedMiles = Math.max(path.distanceMiles, 0.01);
  const progress = Math.min(distanceMiles / plannedMiles, 1);
  const currentPosition = traveledRoute[traveledRoute.length - 1] ?? path.points[0];
  const stopSound = useAudioPlayer(
    require ('../../../assets/sounds/finish-run.mp3')
  );

  const handleStop = async () => {
    watchSubscription.current?.remove();
    watchSubscription.current = null;

    const started =
      await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME,
      );

    if (started) {
      await Location.stopLocationUpdatesAsync(
        LOCATION_TASK_NAME,
      );
    }

    const storedJson =
      await AsyncStorage.getItem(RUN_LOCATIONS_KEY);

    const storedPoints: Array<{
      latitude: number;
      longitude: number;
    }> = storedJson
      ? JSON.parse(storedJson)
      : [];

    const finalRoute: LatLng[] =
      storedPoints.length > 0
        ? storedPoints.map(({ latitude, longitude }) => ({
            latitude,
            longitude,
          }))
        : traveledRoute;

    const finalDistanceMiles =
      totalDistanceMiles(finalRoute);

    stopSound.volume = 0.5;
    await stopSound.seekTo(0);
    stopSound.play();

    setTimeout(() => {
      navigation.replace('RunComplete', {
        stats: {
          elapsedSeconds,
          distanceMiles: finalDistanceMiles,
          route: finalRoute,
          path,
        },
      });
    }, 7000);
  };

  if (!initialCenter) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Getting a GPS fix…</Text>
      </View>
    );
  }

  // Gray line for the planned route, gold for what you've actually covered
  // so far, plus a start marker and a glowing "you are here" dot.
  const polylines: LeafletPolyline[] = [
    ...(path.points.length > 1 ? [{ coordinates: path.points, color: '#C0B8AE', weight: 4 }] : []),
    ...(traveledRoute.length > 1 ? [{ coordinates: traveledRoute, color: colors.gold, weight: 5 }] : []),
  ];

  const markers: LeafletMarker[] = [
    ...(path.points[0] ? [{ coordinate: path.points[0], color: colors.gold, strokeColor: '#fff', radius: 7 }] : []),
    ...(currentPosition ? [{ coordinate: currentPosition, glow: true }] : []),
  ];

  return (
    <View style={styles.container}>
      <LeafletMap center={initialCenter} zoom={16} polylines={polylines} markers={markers} />

      <SafeAreaView edges={['top']} style={styles.overlayTop} pointerEvents="box-none">
        <View style={styles.routeNamePill}>
          <View style={styles.recordingDot} />
          <Text style={styles.routeName}>{path.name}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatDuration(elapsedSeconds)}</Text>
          </View>
          <View style={[styles.statColumn, styles.statColumnBordered]}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{distanceMiles.toFixed(2)}</Text>
            <Text style={styles.statUnit}>mi</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>Pace</Text>
            <Text style={styles.statValue}>{formatPace(elapsedSeconds, distanceMiles)}</Text>
            <Text style={styles.statUnit}>/mi</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </SafeAreaView>

      <View style={styles.stopWrap}>
        <Pressable onPress={handleStop} style={({ pressed }) => [styles.stopButton, pressed && styles.stopButtonPressed]}>
          <View style={styles.stopSquare} />
        </Pressable>
        <Text style={styles.stopLabel}>Stop</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4d0ca',
  },
  loadingText: {
    color: colors.charcoal,
    fontSize: 14,
    fontWeight: '500',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
  },
  routeNamePill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(245,240,232,0.94)',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.18)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
  },
  routeName: {
    color: colors.nearBlack,
    fontSize: 13,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245,240,232,0.96)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.15)',
    paddingVertical: 16,
    marginBottom: 8,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statColumnBordered: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(110,100,88,0.12)',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  statValue: {
    color: colors.nearBlack,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statUnit: {
    color: colors.charcoal,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(245,240,232,0.5)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  stopWrap: {
    position: 'absolute',
    bottom: 44,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 10,
  },
  stopButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  stopButtonPressed: {
    opacity: 0.85,
  },
  stopSquare: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  stopLabel: {
    color: 'rgba(245,240,232,0.9)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
