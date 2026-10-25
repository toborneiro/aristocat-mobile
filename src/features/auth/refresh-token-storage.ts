import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'aristocat.refresh-token';

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export function shouldRefreshWithoutStoredToken(): boolean {
  return false;
}

export async function deleteRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function discardInvalidRefreshToken(): Promise<boolean> {
  try {
    await deleteRefreshToken();
    return true;
  } catch {
    // The failed refresh has already invalidated the in-memory session. Avoid an
    // unhandled rejection while the incompatible native client is rebuilt.
    return false;
  }
}
