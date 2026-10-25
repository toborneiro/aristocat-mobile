import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { env } from '../../config/env';
import { AuthApi } from './auth-api';
import { useAuthSession } from './auth-session';
import { authenticateWithGoogle, type GoogleAuthenticationResult } from './google-authentication';

export function useGoogleAuthentication() {
  const { signIn } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const api = useMemo(() => new AuthApi(env.apiBaseUrl, env.developmentWebRefreshTokenStorage), []);

  const authenticate = useCallback(async (): Promise<GoogleAuthenticationResult> => {
    setLoading(true);
    try {
      return await authenticateWithGoogle({
        api,
        getIdToken: requestGoogleIdToken,
        googleConfigured: Boolean(env.googleWebClientId),
        navigateToAuthenticatedArea: () => router.replace('/home'),
        signIn,
      });
    } finally {
      setLoading(false);
    }
  }, [api, signIn]);

  return { authenticate, loading, ready: true } as const;
}

async function requestGoogleIdToken(): Promise<string | null> {
  try {
    GoogleSignin.configure({
      webClientId: env.googleWebClientId!,
      iosClientId: env.googleIosClientId,
    });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') return null;
    if (!response.data.idToken) throw new Error('GOOGLE_ID_TOKEN_MISSING');
    return response.data.idToken;
  } catch (cause) {
    if (isGoogleCancellation(cause)) return null;
    throw cause;
  }
}

function isGoogleCancellation(cause: unknown): boolean {
  return Boolean(
    cause &&
      typeof cause === 'object' &&
      'code' in cause &&
      cause.code === statusCodes.SIGN_IN_CANCELLED,
  );
}
