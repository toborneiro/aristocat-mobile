import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccountChip } from '../components/AccountChip';
import { AppScreenLayout } from '../components/AppScreenLayout';
import { Icon } from '../components/Icon';
import { Card } from '../components/ui';
import { colors, iconSize, spacing, typography } from '../theme/tokens';

export function StatementScreen() {
  return (
    <AppScreenLayout contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable accessibilityLabel="Voltar para início" onPress={() => router.replace('/home')}>
            <Icon color={colors.foreground} name="back" size={iconSize.action} />
          </Pressable>
          <Text style={styles.title}>Extrato</Text>
        </View>
        <AccountChip />
      </View>
      <Card style={styles.emptyCard}>
        <Icon color={colors.mutedForeground} name="statement" size={iconSize.notification} />
        <Text style={styles.emptyTitle}>Nenhuma transação disponível</Text>
        <Text style={styles.emptyText}>
          O extrato será preenchido após a sincronização de uma conta conectada.
        </Text>
      </Card>
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl, padding: 0 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
  },
  headerRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  title: { ...typography.title, color: colors.foreground },
  emptyCard: { alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.screen, padding: spacing.xl },
  emptyTitle: { ...typography.bodySemiBold, color: colors.foreground, textAlign: 'center' },
  emptyText: { ...typography.body, color: colors.mutedForeground, textAlign: 'center' },
});
