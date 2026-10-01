import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccountChip } from '../components/AccountChip';
import { AppScreenLayout } from '../components/AppScreenLayout';
import { Icon } from '../components/Icon';
import { Card } from '../components/ui';
import { accountGroups, transactions } from '../mock/finance';
import {
  borderWidth,
  colors,
  componentSize,
  iconSize,
  radius,
  spacing,
  typography,
} from '../theme/tokens';

type Filter = 'all' | 'credit' | 'debit';

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const filters: ReadonlyArray<{ key: Filter; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'credit', label: 'Crédito' },
  { key: 'debit', label: 'Débito' },
];

export function StatementScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const accountIds = accountGroups[0]!.ids;
  const statementTransactions = transactions.filter((transaction) =>
    accountIds.includes(transaction.accountId),
  );
  const filteredTransactions = statementTransactions.filter(
    (transaction) =>
      filter === 'all' || (filter === 'credit' ? transaction.amount > 0 : transaction.amount < 0),
  );
  const totalCredit = statementTransactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const totalDebit = statementTransactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

  return (
    <AppScreenLayout contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="Voltar para início"
            onPress={() => router.replace('/home')}
            style={styles.backButton}
          >
            <Icon color={colors.foreground} name="back" size={iconSize.action} />
          </Pressable>
          <Text style={styles.title}>Extrato</Text>
        </View>
        <AccountChip label="Pessoal — Nubank" />
      </View>

      <View style={styles.metrics}>
        <Card style={[styles.metricCard, styles.creditMetric]}>
          <View style={styles.metricLabel}>
            <Icon color={colors.primary} name="credit" size={iconSize.metric} />
            <Text style={styles.creditText}>Créditos</Text>
          </View>
          <Text style={styles.creditAmount}>{money(totalCredit)}</Text>
        </Card>
        <Card style={[styles.metricCard, styles.debitMetric]}>
          <View style={styles.metricLabel}>
            <Icon color={colors.destructive} name="debit" size={iconSize.metric} />
            <Text style={styles.debitText}>Débitos</Text>
          </View>
          <Text style={styles.debitAmount}>{money(totalDebit)}</Text>
        </Card>
      </View>

      <View style={styles.filterBar}>
        {filters.map((item) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === item.key }}
            key={item.key}
            onPress={() => setFilter(item.key)}
            style={[styles.filterButton, filter === item.key && styles.filterButtonSelected]}
          >
            <Text style={[styles.filterText, filter === item.key && styles.filterTextSelected]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.transactionList}>
        {filteredTransactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </View>
    </AppScreenLayout>
  );
}

function TransactionRow({ transaction }: { transaction: (typeof transactions)[number] }) {
  const visual = transactionVisual(transaction.amount);

  return (
    <Card style={styles.transactionCard}>
      <View style={[styles.transactionIcon, visual.iconBackground]}>
        <Icon color={visual.color} name={visual.icon} size={iconSize.chevron} />
      </View>
      <View style={styles.grow}>
        <Text numberOfLines={1} style={styles.transactionDescription}>
          {transaction.description}
        </Text>
        <View style={styles.transactionMetadata}>
          <Text style={styles.transactionCategory}>
            {transaction.category} · {transaction.date}
          </Text>
        </View>
      </View>
      <Text style={[styles.transactionAmount, visual.amountTone]}>
        {visual.prefix}
        {money(transaction.amount)}
      </Text>
    </Card>
  );
}

function transactionVisual(amount: number) {
  if (amount > 0)
    return {
      amountTone: styles.transactionCredit,
      color: colors.primary,
      icon: 'credit' as const,
      iconBackground: styles.creditIcon,
      prefix: '+',
    };

  return {
    amountTone: styles.transactionDebit,
    color: colors.destructive,
    icon: 'debit' as const,
    iconBackground: styles.debitIcon,
    prefix: '',
  };
}

const styles = StyleSheet.create({
  content: { gap: 0, padding: 0 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
  },
  headerRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    height: componentSize.backButton,
    justifyContent: 'center',
    width: componentSize.backButton,
  },
  title: { ...typography.title, color: colors.foreground },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.screen,
  },
  metricCard: { flex: 1, gap: spacing.xs, padding: spacing.lg },
  creditMetric: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: borderWidth.thin,
  },
  debitMetric: {
    backgroundColor: colors.destructiveSubtle,
    borderColor: colors.destructiveBorder,
    borderWidth: borderWidth.thin,
  },
  metricLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.compact,
    marginBottom: spacing.xs,
  },
  creditText: { ...typography.captionMedium, color: colors.primary },
  debitText: { ...typography.captionMedium, color: colors.destructive },
  creditAmount: { ...typography.amountMedium, color: colors.primary },
  debitAmount: { ...typography.amountMedium, color: colors.destructive },
  filterBar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.screen,
    padding: spacing.xs,
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  filterButtonSelected: { backgroundColor: colors.primary },
  filterText: { ...typography.captionSemiBold, color: colors.mutedForeground },
  filterTextSelected: { color: colors.primaryForeground },
  transactionList: {
    gap: spacing.sm,
    paddingBottom: spacing.screen,
    paddingHorizontal: spacing.screen,
  },
  transactionCard: {
    alignItems: 'center',
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  transactionIcon: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: componentSize.transactionIcon,
    justifyContent: 'center',
    width: componentSize.transactionIcon,
  },
  creditIcon: { backgroundColor: colors.primarySubtle },
  debitIcon: { backgroundColor: colors.destructiveSoft },
  grow: { flex: 1, minWidth: 0 },
  transactionDescription: { ...typography.bodyMedium, color: colors.foreground },
  transactionMetadata: { flexDirection: 'row', gap: spacing.compact, marginTop: spacing.xxs },
  transactionCategory: { ...typography.caption, color: colors.mutedForeground },
  transactionAmount: { ...typography.amountSmallBold, flexShrink: 0 },
  transactionCredit: { color: colors.primary },
  transactionDebit: { color: colors.destructive },
});
