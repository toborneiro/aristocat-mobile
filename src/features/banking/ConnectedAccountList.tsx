import { StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState } from '../../components/ui';
import { colors, spacing, typography } from '../../theme/tokens';
import type { BankAccount } from './banking-api';

type Props = Readonly<{ accounts: readonly BankAccount[] }>;

const money = (value: string | null, currency: string): string =>
  value === null
    ? 'Saldo indisponível'
    : new Intl.NumberFormat('pt-BR', { currency, style: 'currency' }).format(Number(value));

export function ConnectedAccountList({ accounts }: Props) {
  if (accounts.length === 0) return <EmptyState title="Nenhuma conta sincronizada ainda." />;
  return (
    <View style={styles.list}>
      {accounts.map((account) => (
        <Card key={account.id} style={styles.card}>
          <View style={styles.copy}>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.detail}>{account.numberMasked ?? account.type}</Text>
          </View>
          <Text style={styles.balance}>{money(account.balance, account.currency)}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  card: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  name: { ...typography.bodySemiBold, color: colors.foreground },
  detail: { ...typography.caption, color: colors.mutedForeground },
  balance: { ...typography.bodySemiBold, color: colors.foreground },
});
