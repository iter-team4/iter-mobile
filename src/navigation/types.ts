// Central place for navigator param lists so screens get typed
// `navigation.navigate(...)` / `route.params` instead of `any`.

import type { SavedPath } from '../api/pathsApi';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  // Carrying the just-entered credentials forward so we can actually log
  // the user in once they "verify" (see VerifyEmailScreen for why).
  VerifyEmail: { email: string; password: string };
  ForgotPassword: undefined;
  CheckEmail: { email: string };
  SetPassword: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Paths: undefined;
  Calendar: undefined;
  Profile: undefined;
};

export type RunStats = {
  elapsedSeconds: number;
  distanceMiles: number;
  route: SavedPath['points'];
  path: SavedPath;
  targetPaceSeconds: number;
};

export type AppStackParamList = {
  MainTabs: undefined;
  PathBuilder: undefined;
  StartRun: undefined;

  RunInProgress: {
    path: SavedPath;
    targetPaceSeconds: number;
  };

  RunComplete: {
    stats: RunStats;
  };
};
