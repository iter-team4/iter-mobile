// 6-digit email verification code, sent by Cognito via POST /api/auth/verify.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoldButton } from '../../components/GoldButton';
import { NavRow } from '../../components/NavRow';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>;

export function VerifyEmailScreen({ navigation, route }: Props) {
  const { email, password } = route.params;
  const { verifyEmail, signIn } = useAuth();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState('Invalid code — please try again.');
  const [resent, setResent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChangeDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setHasError(false);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setResent(true);
    setDigits(['', '', '', '', '', '']);
    setHasError(false);
    inputRefs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      setErrorText('Enter all 6 digits.');
      setHasError(true);
      return;
    }

    setVerifying(true);
    try {
      await verifyEmail(email, code);
      // The account already exists (created back on the sign-up screen) -
      // this just actually logs them in now that they're verified.
      await signIn(email, password);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Invalid code — please try again.');
      setHasError(true);
    } finally {
      setVerifying(false);
    }
  };

  const filledCount = digits.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavRow onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to <Text style={styles.emailText}>{email}</Text>. Enter it below
            to confirm your account.
          </Text>
        </View>

        <View style={styles.codeRow}>
          {digits.map((digit, index) => {
            const isFilled = digit !== '';
            return (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChangeText={(value) => handleChangeDigit(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
                keyboardType="number-pad"
                maxLength={1}
                style={[
                  styles.codeBox,
                  hasError && styles.codeBoxError,
                  !hasError && isFilled && styles.codeBoxFilled,
                ]}
              />
            );
          })}
        </View>

        {hasError ? (
          <Text style={styles.errorText}>{errorText}</Text>
        ) : (
          <Text style={styles.hintText}>{filledCount}/6 digits entered</Text>
        )}

        <View style={{ marginTop: 20 }}>
          <GoldButton onPress={handleVerify} loading={verifying}>
            Verify
          </GoldButton>
        </View>

        <View style={styles.resendRow}>
          {resent ? (
            <Text style={styles.resentText}>✓ Code resent to your inbox</Text>
          ) : (
            <Text style={styles.footerText}>
              Didn&apos;t receive it?{' '}
              <Text style={styles.resendLink} onPress={handleResend}>
                Resend code
              </Text>
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBg,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  heading: {
    marginBottom: 36,
  },
  title: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  emailText: {
    color: colors.nearBlack,
    fontWeight: '600',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  codeBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(110,100,88,0.22)',
    backgroundColor: colors.fieldBg,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.nearBlack,
  },
  codeBoxFilled: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(213,160,33,0.07)',
  },
  codeBoxError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(192,57,43,0.06)',
    color: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  hintText: {
    color: colors.muted,
    fontSize: 13,
  },
  devHint: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  resentText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '500',
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
  },
  resendLink: {
    color: colors.charcoal,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
