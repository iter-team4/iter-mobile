// Top of the navigation tree. Whether you see the auth flow or the actual
// app comes down to one thing: is there a logged-in user in AuthContext?

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Checking AsyncStorage for a saved session - usually instant, but
    // worth a spinner instead of a flash of the wrong screen.
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamBg,
  },
});
