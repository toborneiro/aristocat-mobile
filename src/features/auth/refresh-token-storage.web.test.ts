jest.mock('../../config/env', () => ({
  env: {
    get developmentWebRefreshTokenStorage() {
      return process.env.EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE === 'true';
    },
  },
}));

import {
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
  shouldRefreshWithoutStoredToken,
} from './refresh-token-storage.web';

const values = new Map<string, string>();

Object.defineProperty(globalThis, 'sessionStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  },
});

describe('refresh-token-storage on web', () => {
  beforeEach(() => {
    values.clear();
    Reflect.set(process.env, 'EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE', 'true');
  });

  it('uses sessionStorage only for the explicitly enabled development fallback', async () => {
    await saveRefreshToken('refresh-token');

    await expect(getRefreshToken()).resolves.toBe('refresh-token');
    expect(shouldRefreshWithoutStoredToken()).toBe(false);

    await deleteRefreshToken();
    await expect(getRefreshToken()).resolves.toBeNull();
  });

  it('uses the HttpOnly cookie flow when the fallback is disabled', async () => {
    Reflect.set(process.env, 'EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE', 'false');

    await saveRefreshToken('refresh-token');

    await expect(getRefreshToken()).resolves.toBeNull();
    expect(shouldRefreshWithoutStoredToken()).toBe(true);
  });
});
