import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { env } from '../../config/env';
import { AuthApi, type RegistrationInput } from './auth-api';
import { getAuthErrorMessage } from './auth-error-message';
import { useAuthSession } from './auth-session';

type RegistrationState = 'idle' | 'loading' | 'error' | 'success';

export function useManualRegistration() {
  const { signIn } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<RegistrationState>('idle');
  const api = useMemo(() => new AuthApi(env.apiBaseUrl, env.developmentWebRefreshTokenStorage), []);

  const submit = useCallback(
    async (input: RegistrationInput) => {
      setError(null);
      setState('loading');
      try {
        const session = await api.register(input);
        setState('success');
        await signIn(session);
        router.replace('/home');
      } catch (cause) {
        setError(getAuthErrorMessage(cause));
        setState('error');
      }
    },
    [api, signIn],
  );

  return { error, state, submit } as const;
}
