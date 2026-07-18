// Tap-to-draw route builder. Uses the device's real GPS (via expo-location)
// to center the map on you, and a Leaflet map (rendered in a WebView - see
// components/LeafletMap) to actually render something you can tap on. Each
// tap drops a point; the gold line connects them in order.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackArrowIcon,
  LocateIcon,
  LogoMark,
  SaveIcon,
  TrashIcon,
  UndoIcon,
} from '../../components/icons';
import { LeafletMap, type LeafletMapHandle, type LeafletMarker, type LeafletPolyline } from '../../components/LeafletMap';
import { useRunData } from '../../context/RunDataContext';
import type { AppStackParamList } from '../../navigation/types';
import { getWalkingRoute, type WalkingRoute } from '../../services/routing';
import { colors } from '../../theme/colors';
import { totalDistanceMiles, type LatLng } from '../../utils/geo';

type Props = NativeStackScreenProps<AppStackParamList, 'PathBuilder'>;

// Falls back to Central Park if location permission is denied or takes too
// long - better than showing a blank map while we wait.
const FALLBACK_CENTER: LatLng = { latitude: 40.7851, longitude: -73.9683 };

export function PathBuilderScreen({ navigation }: Props) {
  const { addPath } = useRunData();
  const mapRef = useRef<LeafletMapHandle>(null);

  const [initialCenter, setInitialCenter] = useState<LatLng | null>(null);
  const [points, setPoints] = useState<LatLng[]>([]);
  const [locating, setLocating] = useState(false);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [pathName, setPathName] = useState('');
  const [saving, setSaving] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const [snappedRoute, setSnappedRoute] = useState<WalkingRoute | null>(null);
  const [snapping, setSnapping] = useState(false);
  const snapRequestId = useRef(0);

  // Center the map on the user's actual location as soon as we're allowed to.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setInitialCenter(FALLBACK_CENTER);
        return;
      }
      try {
        const position = await Location.getCurrentPositionAsync({});

        const coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

      setInitialCenter(coordinate);
      setUserLocation(coordinate);
      } catch {
        setInitialCenter(FALLBACK_CENTER);
      }
    })();
  }, []);

  // Re-route through OSRM every time the tapped points change, so the line
  // bends to follow real footpaths instead of just connecting the dots. This
  // is debounced so a burst of taps only fires one request once things settle,
  // and the request id guards against an older response landing after a newer
  // one - both matter more here than they would on a single click on the web,
  // since a phone tap sequence is a lot less deliberate.
  useEffect(() => {
    if (points.length < 2) {
      setSnappedRoute(null);
      return;
    }

    const requestId = ++snapRequestId.current;
    const timer = setTimeout(() => {
      setSnapping(true);
      getWalkingRoute(points)
        .then((route) => {
          if (snapRequestId.current === requestId) setSnappedRoute(route);
        })
        .catch(() => {
          // Public OSRM demo server hiccup, no signal, or no walkable route
          // between these points - just keep the straight line rather than
          // interrupting someone drawing a path with an error.
          if (snapRequestId.current === requestId) setSnappedRoute(null);
        })
        .finally(() => {
          if (snapRequestId.current === requestId) setSnapping(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [points]);

  const totalMiles = snappedRoute?.distanceMiles ?? totalDistanceMiles(points);
  const canSave = points.length >= 2;

  const handleMapPress = (coordinate: LatLng) => {
    setPoints((prev) => [...prev, coordinate]);
  };

  const handleLocateMe = async () => {
  setLocating(true);

  try {
    const position = await Location.getCurrentPositionAsync({});

    const coordinate = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    setUserLocation(coordinate);

    mapRef.current?.animateTo(
      coordinate.latitude,
      coordinate.longitude
    );
  } catch {
    // No GPS fix available.
  } finally {
    setLocating(false);
  }
};

  // Draw the snapped route once we have one; otherwise fall back to a
  // straight line between taps so there's always something on the map while
  // OSRM is still thinking (or unreachable). Markers stay on the raw taps
  // either way - bigger dots for the start/end, and the end marker gets an
  // inverted fill so it reads as "different" from the rest at a glance.
  const polylines: LeafletPolyline[] = snappedRoute
    ? [{ coordinates: snappedRoute.geometry, color: colors.gold, weight: 4 }]
    : points.length > 1
      ? [{ coordinates: points, color: colors.gold, weight: 4 }]
      : [];

      const routeMarkers: LeafletMarker[] = points.map((point, index) => {
      const isStart = index === 0;
      const isEnd = index === points.length - 1 && points.length > 1;

      return {
        coordinate: point,
        radius: isStart || isEnd ? 8 : 5,
        color: isEnd ? '#fff' : colors.gold,
        strokeColor: isEnd ? colors.gold : '#fff',
      };
    });

    const userMarker: LeafletMarker[] = userLocation
      ? [
          {
            coordinate: userLocation,
            radius: 9,
            color: '#2196F3',
            strokeColor: '#ffffff',
          },
        ]
      : [];

    const markers: LeafletMarker[] = [
      ...routeMarkers,
      ...userMarker,
    ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await addPath(pathName, snappedRoute?.geometry ?? points);
      setSaveSheetOpen(false);
      setPathName('');
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  if (!initialCenter) {
    // Waiting on the location permission prompt / first GPS fix.
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Finding your location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeafletMap
        ref={mapRef}
        center={initialCenter}
        zoom={16}
        polylines={polylines}
        markers={markers}
        onMapPress={handleMapPress}
      />

      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.roundButton}>
            <BackArrowIcon />
          </Pressable>
          <View style={styles.titlePill}>
            <Text style={styles.titleEyebrow}>ROUTE BUILDER</Text>
            <Text style={styles.titleText}>Create Path</Text>
          </View>
        </View>

        <View style={styles.statsPill} pointerEvents="none">
          <Text style={styles.statsDistance}>{totalMiles.toFixed(2)} mi</Text>
          <View style={styles.dot} />
          <Text style={styles.statsPoints}>
            {points.length} {points.length === 1 ? 'point' : 'points'}
          </Text>
          {points.length === 0 && (
            <>
              <View style={styles.dot} />
              <Text style={styles.statsHint}>Tap map to begin</Text>
            </>
          )}
          {snapping && (
            <>
              <View style={styles.dot} />
              <Text style={styles.statsHint}>Snapping…</Text>
            </>
          )}
        </View>
      </SafeAreaView>

      <View style={styles.sideButtons}>
        <Pressable onPress={handleLocateMe} disabled={locating} style={styles.roundButton}>
          <LocateIcon />
        </Pressable>
        <Pressable
          onPress={() => setPoints((prev) => prev.slice(0, -1))}
          disabled={points.length === 0}
          style={[styles.roundButton, points.length === 0 && styles.roundButtonDisabled]}
        >
          <UndoIcon />
        </Pressable>
        <Pressable
          onPress={() => setPoints([])}
          disabled={points.length === 0}
          style={[styles.roundButton, points.length === 0 && styles.roundButtonDisabled]}
        >
          <TrashIcon />
        </Pressable>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          disabled={!canSave}
          onPress={() => setSaveSheetOpen(true)}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        >
          {canSave ? (
            <>
              <SaveIcon />
              <Text style={styles.saveButtonLabel}>Save Path</Text>
            </>
          ) : (
            <Text style={styles.saveButtonLabelDisabled}>
              Add {Math.max(0, 2 - points.length)} more {2 - points.length === 1 ? 'point' : 'points'} to save
            </Text>
          )}
        </Pressable>
      </View>

      <Modal visible={saveSheetOpen} transparent animationType="fade" onRequestClose={() => setSaveSheetOpen(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSaveSheetOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>Name your path</Text>
              <View style={styles.sheetWordmark}>
                <LogoMark size={10} color={colors.charcoal} />
                <Text style={styles.sheetWordmarkText}>iter</Text>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Path name</Text>
            <TextInput
              value={pathName}
              onChangeText={setPathName}
              placeholder="Morning Run"
              placeholderTextColor={colors.muted}
              autoFocus
              style={styles.nameInput}
            />

            <View style={styles.previewStrip}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewName}>{pathName.trim() || 'Morning Run'}</Text>
                <Text style={styles.previewMeta}>
                  {totalMiles.toFixed(2)} mi · {points.length} points
                </Text>
              </View>
            </View>

            <View style={styles.sheetActions}>
              <Pressable onPress={() => setSaveSheetOpen(false)} style={styles.sheetCancelButton}>
                <Text style={styles.sheetCancelLabel}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSave} disabled={saving} style={styles.sheetSaveButton}>
                <Text style={styles.sheetSaveLabel}>{saving ? 'Saving…' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
  },
  titlePill: {
    flex: 1,
    backgroundColor: 'rgba(245,240,232,0.94)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.18)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  titleEyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleText: {
    color: colors.nearBlack,
    fontSize: 15,
    fontWeight: '700',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245,240,232,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonDisabled: {
    opacity: 0.4,
  },
  statsPill: {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245,240,232,0.94)',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.18)',
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  statsDistance: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '800',
  },
  statsPoints: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  statsHint: {
    color: colors.muted,
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.muted,
  },
  sideButtons: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -70 }],
    gap: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
  },
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(110,100,88,0.18)',
  },
  saveButtonLabel: {
    color: '#1A1714',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButtonLabelDisabled: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
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
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sheetTitle: {
    color: colors.nearBlack,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  sheetWordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    opacity: 0.4,
  },
  sheetWordmarkText: {
    color: colors.charcoal,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldLabel: {
    color: colors.label,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
  },
  nameInput: {
    backgroundColor: colors.creamBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.2)',
    paddingHorizontal: 14,
    height: 50,
    color: colors.nearBlack,
    fontSize: 16,
    marginBottom: 20,
  },
  previewStrip: {
    backgroundColor: colors.creamBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.14)',
    padding: 14,
    marginBottom: 28,
  },
  previewName: {
    color: colors.nearBlack,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  previewMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
  },
  sheetCancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelLabel: {
    color: colors.nearBlack,
    fontSize: 15,
    fontWeight: '600',
  },
  sheetSaveButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSaveLabel: {
    color: '#1A1714',
    fontSize: 15,
    fontWeight: '700',
  },
});
