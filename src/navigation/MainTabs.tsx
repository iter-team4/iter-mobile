// The four-tab shell you land in after logging in. Custom-colored to match
// the gold/cream theme instead of the default react-navigation look.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { CalendarTabIcon, HomeTabIcon, PathsTabIcon, ProfileTabIcon } from '../components/icons';
import { CalendarScreen } from '../screens/main/CalendarScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SavedPathsScreen } from '../screens/main/SavedPathsScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.charcoal,
        tabBarStyle: {
          backgroundColor: colors.fieldBg,
          borderTopColor: 'rgba(110,100,88,0.14)',
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <HomeTabIcon active={focused} /> }}
      />
      <Tab.Screen
        name="Paths"
        component={SavedPathsScreen}
        options={{ tabBarLabel: 'Paths', tabBarIcon: ({ focused }) => <PathsTabIcon active={focused} /> }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarIcon: ({ focused }) => <CalendarTabIcon active={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <ProfileTabIcon active={focused} /> }}
      />
    </Tab.Navigator>
  );
}
