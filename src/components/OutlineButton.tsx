// Secondary button - just an outline, no fill. Used where the GoldButton
// would be too loud (e.g. "Back to Login").

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  children: string;
  onPress?: () => void;
}

export function OutlineButton({ children, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(110,100,88,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  label: {
    color: colors.nearBlack,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
