import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OutlineButton } from '../../components/OutlineButton';
import { NavRow } from '../../components/NavRow';
import { EmailIcon } from '../../components/icons';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'CheckEmail'>;

export function CheckEmailScreen({ navigation, route }: Props) {
  const { email } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavRow onBack={() => navigation.popToTop()} />

      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <EmailIcon size={40} color={colors.gold} />
        </View>

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We&apos;ve sent a password reset code to your inbox. It may take a minute to arrive.
        </Text>

        <View style={styles.hintPill}>
          <Text style={styles.hintText}>
            Didn&apos;t receive it?{' '}
            <Text style={styles.hintLink} onPress={() => navigation.navigate('SetPassword', { email })}>
              I have a code
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <OutlineButton onPress={() => navigation.popToTop()}>Back to Login</OutlineButton>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(213,160,33,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(213,160,33,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    color: colors.nearBlack,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 270,
  },
  hintPill: {
    marginTop: 28,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'rgba(110,100,88,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(110,100,88,0.15)',
  },
  hintText: {
    color: colors.charcoal,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  hintLink: {
    color: colors.gold,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 52,
  },
});
