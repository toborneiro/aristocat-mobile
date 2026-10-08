import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button, Card } from '../../components/ui';
import { colors, spacing, typography } from '../../theme/tokens';
import type { BankConnectionStatus as Status } from './banking-api';

type Props = Readonly<{
  status: Status;
  onRetry: () => void;
  onResume: () => void;
  pollingTimedOut?: boolean;
}>;

const messages: Readonly<Record<Status, Readonly<{ title: string; detail: string }>>> = {
  CREATED: { title: 'Preparando conexão', detail: 'Aguardando o início da conexão.' },
  CONNECTING: { title: 'Conectando sua conta...', detail: 'Estamos processando a autenticação.' },
  WAITING_USER_INPUT: {
    title: 'Informação necessária',
    detail: 'Retome a conexão para concluir o solicitado pelo banco.',
  },
  WAITING_USER_ACTION: {
    title: 'Ação necessária no banco',
    detail: 'Conclua a autorização no banco e depois retome aqui.',
  },
  SYNCING: { title: 'Sincronizando sua conta...', detail: 'Estamos buscando contas e transações.' },
  ACTIVE: { title: 'Conta conectada', detail: 'Seus dados já estão disponíveis.' },
  ERROR: {
    title: 'Não foi possível sincronizar',
    detail: 'Seus dados anteriores foram preservados.',
  },
  DISCONNECTED: { title: 'Conta desconectada', detail: 'A conexão foi removida ou revogada.' },
};

const pendingStatuses: readonly Status[] = ['CONNECTING', 'SYNCING'];
const resumableStatuses: readonly Status[] = ['WAITING_USER_INPUT', 'WAITING_USER_ACTION'];

export function BankConnectionStatus(props: Props) {
  const message = messages[props.status];
  return (
    <Card style={styles.card}>
      <PendingIndicator status={props.status} />
      <View style={styles.copy}>
        <Text style={styles.title}>{message.title}</Text>
        <StatusDetail detail={message.detail} pollingTimedOut={props.pollingTimedOut} />
      </View>
      <StatusActions {...props} />
    </Card>
  );
}

function PendingIndicator({ status }: Readonly<{ status: Status }>) {
  return pendingStatuses.includes(status) ? <ActivityIndicator color={colors.primary} /> : null;
}

function StatusDetail({
  detail,
  pollingTimedOut,
}: Readonly<{ detail: string; pollingTimedOut: boolean | undefined }>) {
  const text = pollingTimedOut
    ? 'A atualização está demorando. Tente novamente mais tarde.'
    : detail;
  return <Text style={styles.detail}>{text}</Text>;
}

function StatusActions({ status, onRetry, onResume, pollingTimedOut }: Props) {
  if (resumableStatuses.includes(status))
    return <Button label="Retomar conexão" onPress={onResume} />;
  if (status === 'ERROR' || pollingTimedOut)
    return <Button label="Tentar novamente" onPress={onRetry} />;
  return null;
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.md },
  copy: { alignItems: 'center', gap: spacing.xs },
  title: { ...typography.bodySemiBold, color: colors.foreground, textAlign: 'center' },
  detail: { ...typography.caption, color: colors.mutedForeground, textAlign: 'center' },
});
