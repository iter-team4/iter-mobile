import React, { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type PaceInputProps = {
  value?: number;
  onChange: (paceSeconds: number | null) => void;
  disabled?: boolean;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const EMPTY_PACE = ['', '', '', ''];

function secondsToDigits(totalSeconds?: number): string[] {
  if (totalSeconds === undefined || totalSeconds < 0) {
    return EMPTY_PACE;
  }

  const minutes = Math.min(Math.floor(totalSeconds / 60), 99);
  const seconds = Math.min(totalSeconds % 60, 59);

  return [
    Math.floor(minutes / 10).toString(),
    (minutes % 10).toString(),
    Math.floor(seconds / 10).toString(),
    (seconds % 10).toString(),
  ];
}

export function PaceInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
  containerStyle,
  inputStyle,
}: PaceInputProps) {
  const [digits, setDigits] = useState<string[]>(() =>
    secondsToDigits(value),
  );

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (value !== undefined) {
      setDigits(secondsToDigits(value));
    }
  }, [value]);

  const updatePace = (nextDigits: string[]) => {
    setDigits(nextDigits);

    if (nextDigits.some((digit) => digit === '')) {
      onChange(null);
      return;
    }

    const minutes = Number(`${nextDigits[0]}${nextDigits[1]}`);
    const seconds = Number(`${nextDigits[2]}${nextDigits[3]}`);

    if (seconds > 59) {
      onChange(null);
      return;
    }

    onChange(minutes * 60 + seconds);
  };

  const handleChangeDigit = (index: number, value: string) => {
    const cleanedValue = value.replace(/\D/g, '');

    if (!cleanedValue) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      updatePace(nextDigits);
      return;
    }

    const enteredDigits = cleanedValue.slice(-4).split('');
    const nextDigits = [...digits];

    let currentIndex = index;

    for (const digit of enteredDigits) {
      if (currentIndex > 3) {
        break;
      }

      // The first seconds digit can only be 0 through 5.
      if (currentIndex === 2 && Number(digit) > 5) {
        continue;
      }

      nextDigits[currentIndex] = digit;
      currentIndex += 1;
    }

    updatePace(nextDigits);

    if (currentIndex <= 3) {
      inputRefs.current[currentIndex]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key !== 'Backspace') {
      return;
    }

    if (!digits[index] && index > 0) {
      const nextDigits = [...digits];
      nextDigits[index - 1] = '';
      updatePace(nextDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputGroup}>
        {digits.map((digit, index) => (
          <React.Fragment key={index}>
            {index === 2 && <Text style={styles.colon}>:</Text>}

            <TextInput
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={digit}
              onChangeText={(text) => handleChangeDigit(index, text)}
              onKeyPress={(event) => handleKeyPress(index, event)}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={1}
              editable={!disabled}
              selectTextOnFocus
              accessibilityLabel={
                index < 2
                  ? `Pace minutes digit ${index + 1}`
                  : `Pace seconds digit ${index - 1}`
              }
              style={[
                styles.input,
                digit !== '' && styles.inputFilled,
                hasError && styles.inputError,
                disabled && styles.inputDisabled,
                inputStyle,
              ]}
            />
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.label}>minutes per mile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 50,
    height: 58,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'rgba(110, 100, 88, 0.22)',
    borderRadius: 12,
    backgroundColor: '#F5F1E9',
    color: '#1E1E1E',
    fontSize: 23,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputFilled: {
    borderColor: '#D5A021',
    backgroundColor: 'rgba(213, 160, 33, 0.07)',
  },
  inputError: {
    borderColor: '#C0392B',
    backgroundColor: 'rgba(192, 57, 43, 0.06)',
    color: '#C0392B',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  colon: {
    marginHorizontal: 3,
    color: '#1E1E1E',
    fontSize: 28,
    fontWeight: '700',
  },
  label: {
    marginTop: 8,
    color: '#6E6458',
    fontSize: 13,
  },
});