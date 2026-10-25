import { type AuthSessionResult } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { env } from '../../config/env';
import { AuthApi } from './auth-api';
import { useAuthSession } from './auth-session';
import { authenticateWithGoogle, type GoogleAuthenticationResult } from './google-authentication';

const unavailableGoogleWebClientId = 'google-web-client-id-not-configured';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuthentication() {
  const { signIn } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const api = useMemo(() => new AuthApi(env.apiBaseUrl, env.developmentWebRefreshTokenStorage), []);
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: env.googleWebClientId ?? unavailableGoogleWebClientId,
  });

  const authenticate = useCallback(async (): Promise<GoogleAuthenticationResult> => {
    setLoading(true);
    try {
      return await authenticateWithGoogle({
        api,
        getIdToken: () => requestGoogleIdToken(request, promptAsync),
        googleConfigured: Boolean(env.googleWebClientId),
        navigateToAuthenticatedArea: () => router.replace('/home'),
        signIn,
      });
    } finally {
      setLoading(false);
    }
  }, [api, promptAsync, request, signIn]);

  return { authenticate, loading, ready: Boolean(request) } as const;
}

async function requestGoogleIdToken(
  request: object | null,
  promptAsync: () => Promise<AuthSessionResult>,
): Promise<string | null> {
  if (!request) throw new Error('GOOGLE_AUTH_REQUEST_NOT_READY');
  const response = await promptAsync();
  if (response.type === 'error') throw response.error;
  if (response.type !== 'success') return null;
  if (!response.params.id_token) throw new Error('GOOGLE_ID_TOKEN_MISSING');
  return response.params.id_token;
}
