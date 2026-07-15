// The little "LABEL / big number / unit" cards used all over - weekly
// stats on Home, all-time stats on Profile, the day detail on Calendar, etc.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function StatTile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: colors.fieldBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.14)',
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  value: {
    color: colors.nearBlack,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unit: {
    color: colors.charcoal,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
  },
});
