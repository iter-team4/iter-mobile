import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoldButton } from '../../components/GoldButton';
import { InputField } from '../../components/InputField';
import { NavRow } from '../../components/NavRow';
import { EmailIcon, EyeIcon, LockIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      // No navigation call needed - RootNavigator swaps to the main app
      // stack automatically once AuthContext has a logged-in user.
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey.</Text>
        </View>

        <View style={styles.fields}>
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<EmailIcon />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            icon={<LockIcon />}
            secureTextEntry={!showPassword}
            trailing={
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <EyeIcon open={showPassword} />
              </Pressable>
            }
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotRow}
        >
          <Text style={styles.forgotLabel}>Forgot password?</Text>
        </Pressable>

        <GoldButton onPress={handleSignIn} loading={submitting} disabled={!email || !password}>
          Sign In
        </GoldButton>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
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
    paddingTop: 32,
  },
  heading: {
    marginBottom: 32,
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
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    marginBottom: 20,
    marginTop: 8,
  },
  forgotLabel: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
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
