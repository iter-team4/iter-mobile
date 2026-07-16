// App entry point. Just wires up the providers (safe area insets, auth,
// run data) and hands off to the navigator - all the actual logic lives
// in src/.

import 'react-native-gesture-handler'; // must be the very first import - see react-navigation docs
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { RunDataProvider } from './src/context/RunDataContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import './src/navigation/locationTask';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RunDataProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </RunDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
