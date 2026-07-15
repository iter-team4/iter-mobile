// Keeps track of who's logged in against the real backend (see
// src/api/authApi.ts). Session persistence is via SecureStore-held Cognito
// tokens, not a locally-minted session id.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client';
import { authApi, type AuthUser } from '../api/authApi';
import { tokenStorage } from '../api/tokenStorage';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: { name: string; username: string; email: string; password: string }) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app launch, check if there's a stored Cognito session and, if so,
  // whether it's still valid (idToken can expire - there's no refresh flow
  // on the backend yet, same as the web app, so we just sign the user out
  // locally and send them back to the login screen).
  useEffect(() => {
    (async () => {
      const idToken = await tokenStorage.getIdToken();
      if (!idToken) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        setUser(me);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          await tokenStorage.clear();
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn: async (email, password) => {
        const loggedInUser = await authApi.login(email, password);
        setUser(loggedInUser);
      },
      // Intentionally does NOT log the user in yet - the sign-up screen
      // sends them to email verification next, and `signIn` gets called
      // once that's done - see VerifyEmailScreen.
      signUp: async (params) => {
        await authApi.register(params);
      },
      verifyEmail: async (email, code) => {
        await authApi.verifyEmail(email, code);
      },
      forgotPassword: async (email) => {
        await authApi.forgotPassword(email);
      },
      resetPassword: async (email, code, newPassword) => {
        await authApi.resetPassword(email, code, newPassword);
      },
      signOut: async () => {
        await authApi.signOut();
        setUser(null);
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}
