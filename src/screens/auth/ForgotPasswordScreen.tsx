import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoldButton } from '../../components/GoldButton';
import { InputField } from '../../components/InputField';
import { NavRow } from '../../components/NavRow';
import { EmailIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSendResetCode = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      navigation.navigate('CheckEmail', { email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavRow onBack={() => navigation.goBack()} />

      <View style={styles.form}>
        <View style={styles.heading}>
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.subtitle}>
            Enter the email address linked to your account and we&apos;ll send a reset code.
          </Text>
        </View>

        <View style={{ marginBottom: 28 }}>
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<EmailIcon />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <GoldButton onPress={handleSendResetCode} loading={submitting} disabled={!email}>
          Send Reset Code
        </GoldButton>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember your password?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.goBack()}>
            Sign In
          </Text>
        </Text>
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
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 48,
    paddingTop: 24,
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
  },
  footerLink: {
    color: colors.gold,
    fontWeight: '600',
  },
});
