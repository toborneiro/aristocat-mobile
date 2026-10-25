import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { env } from '../../config/env';
import { AuthApi, type AuthSession } from './auth-api';
import {
  deleteRefreshToken,
  discardInvalidRefreshToken,
  getRefreshToken,
  saveRefreshToken,
  shouldRefreshWithoutStoredToken,
} from './refresh-token-storage';

export type AuthStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

type AuthContextValue = Readonly<{
  accessToken: string | null;
  session: AuthSession | null;
  loading: boolean;
  status: AuthStatus;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
}>;
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useMemo(() => new AuthApi(env.apiBaseUrl, env.developmentWebRefreshTokenStorage), []);

  useEffect(() => {
    let active = true;
    void getRefreshToken()
      .then(async (refreshToken) => {
        if (!refreshToken && !shouldRefreshWithoutStoredToken()) return;
        const refreshed = await api.refresh(refreshToken ?? undefined);
        if (active) {
          setSession(refreshed);
          await saveRefreshToken(refreshed.tokens.refreshToken);
        }
      })
      .catch(async () => {
        await discardInvalidRefreshToken();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.tokens.accessToken ?? null,
      session,
      loading,
      status: loading ? 'LOADING' : session ? 'AUTHENTICATED' : 'UNAUTHENTICATED',
      signIn: async (nextSession) => {
        await saveRefreshToken(nextSession.tokens.refreshToken);
        setSession(nextSession);
      },
      signOut: async () => {
        try {
          if (session) await api.logout(session.tokens.accessToken);
        } finally {
          await deleteRefreshToken();
          setSession(null);
        }
      },
    }),
    [api, loading, session],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthSessionProvider is required');
  return context;
}
