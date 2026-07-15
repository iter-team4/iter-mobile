// Everything a logged-in user can reach: the tab bar itself, plus the
// full-screen flows that get pushed on top of it (map screens, the run
// itself, etc). Kept as a stack wrapping the tab navigator rather than
// putting these screens inside a single tab, so they can cover the tab bar.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MainTabs } from './MainTabs';
import { PathBuilderScreen } from '../screens/run/PathBuilderScreen';
import { RunCompleteScreen } from '../screens/run/RunCompleteScreen';
import { RunInProgressScreen } from '../screens/run/RunInProgressScreen';
import { StartRunScreen } from '../screens/run/StartRunScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="PathBuilder" component={PathBuilderScreen} />
      <Stack.Screen name="StartRun" component={StartRunScreen} />
      <Stack.Screen
        name="RunInProgress"
        component={RunInProgressScreen}
        // Don't let a swipe-back gesture accidentally kill GPS tracking
        // mid-run - the Stop button is the only way out of this screen.
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="RunComplete" component={RunCompleteScreen} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
