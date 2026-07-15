// Little bar + label under a password field. Used on both the sign-up form
// and the "set a new password" screen, so it got pulled out instead of
// copy-pasted twice.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

// Quick and dirty strength check - just looks at length. Good enough for a
// prototype; a real app would probably check for number/symbol variety too.
export function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0;
  if (password.length < 6) return 1;
  if (password.length < 10) return 2;
  return 3;
}

const LABELS = ['', 'Weak', 'Good', 'Strong'];
const BAR_COLORS = ['', colors.danger, colors.gold, colors.success];
const WIDTHS: `${number}%`[] = ['0%', '33%', '66%', '100%'];

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (password.length === 0) return null;

  const strength = getPasswordStrength(password);

  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: WIDTHS[strength], backgroundColor: BAR_COLORS[strength] }]} />
      </View>
      <Text style={[styles.label, { color: BAR_COLORS[strength] }]}>{LABELS[strength]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(110,100,88,0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
});
