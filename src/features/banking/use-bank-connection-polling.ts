import { useEffect } from 'react';

import type { BankConnection, BankConnectionStatus, BankingApi } from './banking-api';

const timeoutMilliseconds = 60_000;
const terminalStatuses: readonly BankConnectionStatus[] = ['ACTIVE', 'ERROR', 'DISCONNECTED'];

type Props = Readonly<{
  api: BankingApi;
  connectionId: string | undefined;
  status: BankConnectionStatus | undefined;
  onActive: () => void;
  onConnection: (connection: BankConnection) => void;
  onTimeout: () => void;
}>;

const shouldPoll = (connectionId: string | undefined, status: BankConnectionStatus | undefined) =>
  Boolean(connectionId) && !terminalStatuses.includes(status ?? 'DISCONNECTED');

export function useBankConnectionPolling({
  api,
  connectionId,
  status,
  onActive,
  onConnection,
  onTimeout,
}: Props): void {
  useEffect(() => {
    if (!connectionId || !shouldPoll(connectionId, status)) return;
    const polling = createPolling({ api, connectionId, onActive, onConnection, onTimeout });
    polling.start();
    return polling.stop;
  }, [api, connectionId, onActive, onConnection, onTimeout, status]);
}

function createPolling({
  api,
  connectionId,
  onActive,
  onConnection,
  onTimeout,
}: Readonly<{
  api: BankingApi;
  connectionId: string;
  onActive: () => void;
  onConnection: (connection: BankConnection) => void;
  onTimeout: () => void;
}>) {
  let cancelled = false;
  let attempts = 0;
  const startedAt = Date.now();

  const isTimedOut = (): boolean => Date.now() - startedAt >= timeoutMilliseconds;
  const stop = () => {
    cancelled = true;
  };
  const schedule = (poll: () => void) => {
    if (isTimedOut()) return onTimeout();
    attempts += 1;
    setTimeout(poll, Math.min(2_000 + attempts * 1_000, 8_000));
  };
  const handleConnection = (connection: BankConnection, poll: () => void) => {
    if (cancelled) return;
    onConnection(connection);
    if (connection.status === 'ACTIVE') return onActive();
    schedule(poll);
  };
  const handleFailure = () => {
    if (!cancelled) onTimeout();
  };
  const poll = () => {
    void api
      .getConnection(connectionId)
      .then((connection) => handleConnection(connection, poll))
      .catch(handleFailure);
  };

  return { start: poll, stop };
}
