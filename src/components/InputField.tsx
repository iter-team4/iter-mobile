// Labeled text input with a leading icon and optional trailing element
// (mainly used for the show/hide password toggle). Every auth screen uses
// this so the fields all look and behave the same.

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props extends Pick<TextInputProps, 'secureTextEntry' | 'keyboardType' | 'autoCapitalize'> {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
}

export function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  trailing,
  ...inputProps
}: Props) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldRow}>
        <View style={styles.icon}>{icon}</View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCorrect={false}
          {...inputProps}
        />
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.label,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fieldBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.nearBlack,
    fontSize: 15,
    padding: 0,
  },
});
