import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type BankingSession = Readonly<{
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}>;

const BankingSessionContext = createContext<BankingSession | null>(null);

export function BankingSessionProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const value = useMemo(() => ({ accessToken, setAccessToken }), [accessToken]);
  return <BankingSessionContext.Provider value={value}>{children}</BankingSessionContext.Provider>;
}

export function useBankingSession(): BankingSession {
  const session = useContext(BankingSessionContext);
  if (!session) throw new Error('BankingSessionProvider is required');
  return session;
}
