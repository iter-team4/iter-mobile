// Everything a logged-out user can see. Headers are turned off across the
// board because each screen draws its own back button (NavRow) to match
// the Figma design instead of the native header bar.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CheckEmailScreen } from '../screens/auth/CheckEmailScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { SetPasswordScreen } from '../screens/auth/SetPasswordScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { VerifyEmailScreen } from '../screens/auth/VerifyEmailScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
    </Stack.Navigator>
  );
}
