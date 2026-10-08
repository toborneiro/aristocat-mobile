import { StyleSheet, Text, View } from 'react-native';
import { PluggyConnect } from 'react-native-pluggy-connect';
import type { ProductType } from 'pluggy-js';

import { Button } from '../../components/ui';
import { colors, spacing, typography } from '../../theme/tokens';
import { BankConnectionStatus } from './BankConnectionStatus';
import { BankInstitutionList } from './BankInstitutionList';
import type { BankConnection, BankingApi, BankInstitution } from './banking-api';
import { useBankConnectionFlow } from './use-bank-connection-flow';

type Props = Readonly<{
  api: BankingApi;
  institutions: readonly BankInstitution[];
  initialConnection: BankConnection | null;
  onActive: () => void;
}>;

const products: ProductType[] = ['ACCOUNTS', 'TRANSACTIONS'];

export function BankConnectionFlow(props: Props) {
  const flow = useBankConnectionFlow(props);
  return <BankConnectionFlowContent flow={flow} institutions={props.institutions} />;
}

type Flow = ReturnType<typeof useBankConnectionFlow>;

function BankConnectionFlowContent({
  flow,
  institutions,
}: Readonly<{ flow: Flow; institutions: readonly BankInstitution[] }>) {
  if (flow.connectToken)
    return (
      <ConnectWidget connectToken={flow.connectToken} flow={flow} institutions={institutions} />
    );
  if (flow.connection) return <ConnectionProgress flow={flow} />;
  return <InstitutionPicker flow={flow} institutions={institutions} />;
}

function ConnectWidget({
  connectToken,
  flow,
  institutions,
}: Readonly<{ connectToken: string; flow: Flow; institutions: readonly BankInstitution[] }>) {
  const error = (event: Readonly<{ data?: Readonly<{ item?: Readonly<{ id: string }> }> }>) => {
    void flow.handleWidgetError(event.data?.item?.id);
  };

  return (
    <PluggyConnect
      connectToken={connectToken}
      connectorTypes={['PERSONAL_BANK']}
      countries={['BR']}
      includeSandbox={institutions.some((institution) => institution.isSandbox)}
      language="pt"
      onClose={flow.closeWidget}
      onError={error}
      onSuccess={({ item }) => void flow.registerItem(item.id)}
      products={products}
      {...(flow.selectedConnectorId ? { selectedConnectorId: flow.selectedConnectorId } : {})}
      {...(flow.resumeExternalId ? { updateItem: flow.resumeExternalId } : {})}
    />
  );
}

function ConnectionProgress({ flow }: Readonly<{ flow: Flow }>) {
  const connection = flow.connection;
  if (!connection) return null;
  return (
    <View style={styles.content}>
      <BankConnectionStatus
        onResume={() => void flow.startConnect(connection.externalConnectionId)}
        onRetry={() => void flow.retrySync()}
        pollingTimedOut={flow.pollingTimedOut}
        status={connection.status}
      />
      <FlowError message={flow.error} />
    </View>
  );
}

function InstitutionPicker({
  flow,
  institutions,
}: Readonly<{ flow: Flow; institutions: readonly BankInstitution[] }>) {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Adicionar conta</Text>
      <BankInstitutionList
        disabled={flow.isCreatingToken}
        institutions={institutions}
        onConnect={(institution) => void flow.startConnect(undefined, institution.id)}
      />
      <Button
        disabled={flow.isCreatingToken}
        label={flow.isCreatingToken ? 'Preparando conexão...' : 'Ver todas as instituições'}
        onPress={() => void flow.startConnect()}
      />
      <FlowError message={flow.error} />
    </View>
  );
}

function FlowError({ message }: Readonly<{ message: string | null }>) {
  return message ? <Text style={styles.error}>{message}</Text> : null;
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  title: { ...typography.bodySemiBold, color: colors.foreground },
  error: { ...typography.caption, color: colors.destructive, textAlign: 'center' },
});
