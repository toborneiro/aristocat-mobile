import { env } from '../../config/env';

const REFRESH_TOKEN_KEY = 'aristocat.refresh-token';

type SessionStorageLike = Readonly<{
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}>;

export async function getRefreshToken(): Promise<string | null> {
  return usesDevelopmentStorage() ? storage().getItem(REFRESH_TOKEN_KEY) : null;
}

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!usesDevelopmentStorage() || !refreshToken) return;
  storage().setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function deleteRefreshToken(): Promise<void> {
  if (!usesDevelopmentStorage()) return;
  storage().removeItem(REFRESH_TOKEN_KEY);
}

export async function discardInvalidRefreshToken(): Promise<boolean> {
  try {
    await deleteRefreshToken();
    return true;
  } catch {
    return false;
  }
}

export function shouldRefreshWithoutStoredToken(): boolean {
  return !usesDevelopmentStorage();
}

function usesDevelopmentStorage(): boolean {
  return env.developmentWebRefreshTokenStorage;
}

function storage(): SessionStorageLike {
  const browser = globalThis as typeof globalThis & { sessionStorage?: SessionStorageLike };
  if (!browser.sessionStorage) throw new Error('WEB_SESSION_STORAGE_UNAVAILABLE');
  return browser.sessionStorage;
}
