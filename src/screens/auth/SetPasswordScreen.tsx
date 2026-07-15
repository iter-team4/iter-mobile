// Reached from the "I have a code" link on CheckEmailScreen. Submits the
// reset code + new password to POST /api/auth/reset-password.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoldButton } from '../../components/GoldButton';
import { InputField } from '../../components/InputField';
import { NavRow } from '../../components/NavRow';
import { PasswordStrengthMeter } from '../../components/PasswordStrengthMeter';
import { EyeIcon, LockIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetPassword'>;

export function SetPasswordScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const { resetPassword } = useAuth();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const match = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit = code.length > 0 && match;

  const handleReset = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(email, code, newPassword);
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavRow onBack={() => navigation.popToTop()} />

      <View style={styles.form}>
        <View style={styles.heading}>
          <Text style={styles.title}>Set a new password</Text>
          <Text style={styles.subtitle}>
            Choose something strong — you won&apos;t need to remember the old one.
          </Text>
        </View>

        <View style={styles.fields}>
          <InputField
            label="Reset Code"
            placeholder="123456"
            value={code}
            onChangeText={setCode}
            icon={<LockIcon />}
            keyboardType="number-pad"
          />

          <View>
            <InputField
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChangeText={setNewPassword}
              icon={<LockIcon />}
              secureTextEntry={!showNew}
              trailing={
                <Pressable onPress={() => setShowNew((v) => !v)} hitSlop={8}>
                  <EyeIcon open={showNew} />
                </Pressable>
              }
            />
            <PasswordStrengthMeter password={newPassword} />
          </View>

          <View>
            <InputField
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={<LockIcon />}
              secureTextEntry={!showConfirm}
              trailing={
                <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
                  <EyeIcon open={showConfirm} />
                </Pressable>
              }
            />
            {mismatch && <Text style={styles.mismatch}>Passwords don&apos;t match</Text>}
            {match && <Text style={styles.match}>✓ Passwords match</Text>}
          </View>
        </View>

        {error && <Text style={styles.mismatch}>{error}</Text>}

        <View style={{ marginTop: 28 }}>
          <GoldButton onPress={handleReset} loading={submitting} disabled={!canSubmit}>
            Reset Password
          </GoldButton>
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
  form: {
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  heading: {
    marginBottom: 32,
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
  fields: {
    gap: 16,
  },
  mismatch: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
  },
  match: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
  },
});
