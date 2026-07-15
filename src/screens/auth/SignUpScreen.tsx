import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoldButton } from '../../components/GoldButton';
import { InputField } from '../../components/InputField';
import { NavRow } from '../../components/NavRow';
import { PasswordStrengthMeter } from '../../components/PasswordStrengthMeter';
import { EmailIcon, EyeIcon, LockIcon, UserIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = name && username && email && password && passwordsMatch;

  const handleCreateAccount = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await signUp({ name, username, email, password });
      // Account exists now, but we don't log them in until they get through
      // the verification step - see VerifyEmailScreen.
      navigation.navigate('VerifyEmail', { email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavRow onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started with your journey.</Text>
        </View>

        <View style={styles.fields}>
          <InputField
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            icon={<UserIcon />}
          />

          <InputField
            label="Username"
            placeholder="johndoe123"
            value={username}
            onChangeText={setUsername}
            icon={<UserIcon />}
            autoCapitalize="none"
          />

          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<EmailIcon />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View>
            <InputField
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon={<LockIcon />}
              secureTextEntry={!showPw}
              trailing={
                <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={8}>
                  <EyeIcon open={showPw} />
                </Pressable>
              }
            />
            <PasswordStrengthMeter password={password} />
          </View>

          <View>
            <InputField
              label="Confirm Password"
              placeholder="••••••••"
              value={confirm}
              onChangeText={setConfirm}
              icon={<LockIcon />}
              secureTextEntry={!showConfirm}
              trailing={
                <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
                  <EyeIcon open={showConfirm} />
                </Pressable>
              }
            />
            {passwordsMismatch && <Text style={styles.mismatch}>Passwords don&apos;t match</Text>}
            {passwordsMatch && <Text style={styles.match}>✓ Passwords match</Text>}
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.terms}>
          By creating an account you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>

        <GoldButton onPress={handleCreateAccount} loading={submitting} disabled={!canSubmit}>
          Create Account
        </GoldButton>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.footerLink} onPress={() => navigation.navigate('SignIn')}>
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: 28,
    paddingBottom: 32,
  },
  heading: {
    marginBottom: 28,
  },
  title: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  fields: {
    gap: 16,
    marginBottom: 8,
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
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
  },
  terms: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 16,
    marginBottom: 24,
  },
  termsLink: {
    color: colors.gold,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
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
