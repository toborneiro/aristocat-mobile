import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '../../components/AppScreenLayout';
import { Card, Loading } from '../../components/ui';
import { env } from '../../config/env';
import { colors, spacing, typography } from '../../theme/tokens';
import { BankConnectionFlow } from './BankConnectionFlow';
import { ConnectedAccountList } from './ConnectedAccountList';
import { BankingApi, type BankConnection } from './banking-api';
import { useBankingSession } from './banking-session';

export function BankingScreen() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <BankingScreenContent />
    </QueryClientProvider>
  );
}

function BankingScreenContent() {
  const { accessToken } = useBankingSession();
  const api = useMemo(() => new BankingApi(env.apiBaseUrl, () => accessToken), [accessToken]);
  return accessToken ? <AuthenticatedBankingScreen api={api} /> : <SessionRequired />;
}

function AuthenticatedBankingScreen({ api }: Readonly<{ api: BankingApi }>) {
  const queryClient = useQueryClient();
  const institutions = useQuery({
    queryKey: ['banking', 'institutions'],
    queryFn: () => api.listInstitutions(),
  });
  const connections = useQuery({
    queryKey: ['banking', 'connections'],
    queryFn: () => api.listConnections(),
  });
  const accounts = useQuery({
    queryKey: ['banking', 'accounts'],
    queryFn: () => api.listAccounts(),
  });

  if (hasLoadingQuery([institutions.isLoading, connections.isLoading, accounts.isLoading]))
    return <LoadingScreen />;

  return (
    <AppScreenLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Contas conectadas</Text>
        <Text style={styles.detail}>Conecte bancos PF pelo provider autorizado.</Text>
      </View>
      <BankConnectionFlow
        api={api}
        initialConnection={findPendingConnection(connections.data)}
        institutions={institutions.data ?? []}
        onActive={() => refreshBankingData(queryClient)}
      />
      <ConnectedAccountList accounts={accounts.data ?? []} />
    </AppScreenLayout>
  );
}

function SessionRequired() {
  return (
    <AppScreenLayout>
      <Card>
        <Text style={styles.title}>Sessão necessária</Text>
        <Text style={styles.detail}>
          Entre em uma sessão Aristocat para conectar uma conta bancária.
        </Text>
      </Card>
    </AppScreenLayout>
  );
}

function LoadingScreen() {
  return (
    <AppScreenLayout>
      <Loading />
    </AppScreenLayout>
  );
}

function hasLoadingQuery(loadingStates: readonly boolean[]): boolean {
  return loadingStates.some(Boolean);
}

function findPendingConnection(
  connections: readonly BankConnection[] | undefined,
): BankConnection | null {
  return (
    connections?.find((connection) => !['ACTIVE', 'DISCONNECTED'].includes(connection.status)) ??
    null
  );
}

function refreshBankingData(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['banking', 'accounts'] });
  void queryClient.invalidateQueries({ queryKey: ['banking', 'connections'] });
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
  title: { ...typography.title, color: colors.foreground },
  detail: { ...typography.caption, color: colors.mutedForeground },
});
