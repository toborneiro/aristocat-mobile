import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';

import type { BankConnection, BankingApi } from './banking-api';
import { useBankConnectionPolling } from './use-bank-connection-polling';

type Props = Readonly<{
  api: BankingApi;
  initialConnection: BankConnection | null;
  onActive: () => void;
}>;

export function useBankConnectionFlow({ api, initialConnection, onActive }: Props) {
  const [connection, setConnection] = useState<BankConnection | null>(null);
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [resumeExternalId, setResumeExternalId] = useState<string | undefined>();
  const [selectedConnectorId, setSelectedConnectorId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const submittedRef = useRef(false);
  const tokenSetters = useMemo(
    () => ({
      setConnectToken,
      setError,
      setPollingTimedOut,
      setResumeExternalId,
      setSelectedConnectorId,
    }),
    [],
  );
  const registrationSetters = useMemo(
    () => ({ setConnectToken, setConnection, setError, setResumeExternalId }),
    [],
  );
  const token = useConnectToken(api, submittedRef, tokenSetters);
  const registerItem = useRegisterItem(api, submittedRef, registrationSetters);
  const retrySync = useRetrySync({
    api,
    connection,
    setConnection,
    setError,
    setPollingTimedOut,
    startConnect: token.start,
  });
  const closeWidget = useCallback(() => {
    if (!submittedRef.current) setConnectToken(null);
  }, []);
  const handleWidgetError = useCallback(
    (itemId: string | undefined) => {
      if (itemId) return registerItem(itemId);
      setConnectToken(null);
      setError('A conexão não foi concluída. Você pode tentar novamente.');
    },
    [registerItem],
  );
  const markPollingTimedOut = useCallback(() => setPollingTimedOut(true), []);

  useRestoredConnection(connection, initialConnection, setConnection, setResumeExternalId);
  useBankConnectionPolling({
    api,
    connectionId: connection?.id,
    status: connection?.status,
    onActive,
    onConnection: setConnection,
    onTimeout: markPollingTimedOut,
  });

  return {
    connectToken,
    closeWidget,
    connection,
    error,
    pollingTimedOut,
    registerItem,
    resumeExternalId,
    selectedConnectorId,
    startConnect: token.start,
    isCreatingToken: token.isCreating,
    handleWidgetError,
    retrySync,
  };
}

type TokenSetters = Readonly<{
  setConnectToken: (token: string | null) => void;
  setError: (message: string | null) => void;
  setPollingTimedOut: (value: boolean) => void;
  setResumeExternalId: (value: string | undefined) => void;
  setSelectedConnectorId: (value: number | undefined) => void;
}>;

function useConnectToken(
  api: BankingApi,
  submittedRef: MutableRefObject<boolean>,
  setters: TokenSetters,
) {
  const [isCreating, setIsCreating] = useState(false);
  const start = useCallback(
    async (externalConnectionId?: string, connectorId?: number) => {
      if (isCreating) return;
      setIsCreating(true);
      setters.setError(null);
      setters.setPollingTimedOut(false);
      submittedRef.current = false;
      try {
        const token = await api.createConnectToken();
        setters.setResumeExternalId(externalConnectionId);
        setters.setSelectedConnectorId(connectorId);
        setters.setConnectToken(token.accessToken);
      } catch {
        setters.setError('Não foi possível preparar a conexão. Tente novamente.');
      } finally {
        setIsCreating(false);
      }
    },
    [api, isCreating, setters, submittedRef],
  );
  return { isCreating, start };
}

type RegistrationSetters = Readonly<{
  setConnectToken: (token: string | null) => void;
  setConnection: (connection: BankConnection) => void;
  setError: (message: string) => void;
  setResumeExternalId: (value: string) => void;
}>;

function useRegisterItem(
  api: BankingApi,
  submittedRef: MutableRefObject<boolean>,
  setters: RegistrationSetters,
) {
  return useCallback(
    async (itemId: string) => {
      submittedRef.current = true;
      setters.setConnectToken(null);
      try {
        const connection = await api.createConnection(itemId);
        setters.setConnection(connection);
        setters.setResumeExternalId(connection.externalConnectionId);
      } catch {
        setters.setError('Não foi possível confirmar a conexão. Tente novamente.');
      }
    },
    [api, setters, submittedRef],
  );
}

function useRestoredConnection(
  connection: BankConnection | null,
  initialConnection: BankConnection | null,
  setConnection: (connection: BankConnection) => void,
  setResumeExternalId: (value: string) => void,
) {
  useEffect(() => {
    if (!connection && initialConnection) {
      setConnection(initialConnection);
      setResumeExternalId(initialConnection.externalConnectionId);
    }
  }, [connection, initialConnection, setConnection, setResumeExternalId]);
}

function useRetrySync({
  api,
  connection,
  setConnection,
  setError,
  setPollingTimedOut,
  startConnect,
}: Readonly<{
  api: BankingApi;
  connection: BankConnection | null;
  setConnection: (connection: BankConnection) => void;
  setError: (message: string) => void;
  setPollingTimedOut: (value: boolean) => void;
  startConnect: () => Promise<void>;
}>) {
  return useCallback(async () => {
    if (!connection) return startConnect();
    try {
      setPollingTimedOut(false);
      setConnection(await api.requestSync(connection.id));
    } catch {
      setError('Não foi possível solicitar uma nova sincronização.');
    }
  }, [api, connection, setConnection, setError, setPollingTimedOut, startConnect]);
}
