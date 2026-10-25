import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { useAuthSession } from '../auth/auth-session';

type BankingSession = Readonly<{
  accessToken: string | null;
}>;

const BankingSessionContext = createContext<BankingSession | null>(null);

export function BankingSessionProvider({ children }: PropsWithChildren) {
  const { accessToken } = useAuthSession();
  const value = useMemo(() => ({ accessToken }), [accessToken]);
  return <BankingSessionContext.Provider value={value}>{children}</BankingSessionContext.Provider>;
}

export function useBankingSession(): BankingSession {
  const session = useContext(BankingSessionContext);
  if (!session) throw new Error('BankingSessionProvider is required');
  return session;
}
