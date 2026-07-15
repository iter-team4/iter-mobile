// stores the tokens we get back from /api/auth/login. using SecureStore
// instead of AsyncStorage since these are real credentials now

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  idToken: 'iter_idToken',
  accessToken: 'iter_accessToken',
  refreshToken: 'iter_refreshToken',
} as const;

export interface StoredTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export const tokenStorage = {
  async save(tokens: StoredTokens): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.idToken, tokens.idToken),
      SecureStore.setItemAsync(KEYS.accessToken, tokens.accessToken),
      SecureStore.setItemAsync(KEYS.refreshToken, tokens.refreshToken),
    ]);
  },

  async getIdToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.idToken);
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.idToken),
      SecureStore.deleteItemAsync(KEYS.accessToken),
      SecureStore.deleteItemAsync(KEYS.refreshToken),
    ]);
  },
};
