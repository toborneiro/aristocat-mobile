import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { accountGroups, accounts } from '../mock/finance';
import {
  borderWidth,
  colors,
  componentSize,
  iconSize,
  radius,
  spacing,
  typography,
} from '../theme/tokens';
import { Icon } from './Icon';

export function AccountChip({ label }: { label: string }) {
  const accountIds = accountGroups[0]!.ids;
  const visibleAccounts = accounts.filter((account) => accountIds.includes(account.id));

  return (
    <Pressable
      accessibilityLabel="Selecionar visão"
      onPress={() => router.push('/account-selector')}
      style={styles.chip}
    >
      <View style={styles.initials}>
        {visibleAccounts.slice(0, 3).map((account, index) => (
          <View
            key={account.id}
            style={[
              styles.initial,
              {
                backgroundColor: account.color,
                marginLeft: index === 0 ? 0 : -spacing.compact,
                zIndex: visibleAccounts.length - index,
              },
            ]}
          >
            <Text style={styles.initialText}>{account.initials[0]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.label}>
        <Icon color={colors.primary} name="account" size={iconSize.chip} />
        <Text numberOfLines={1} style={styles.text}>
          {label}
        </Text>
      </View>
      <Icon name="down" size={iconSize.chip} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.compact,
  },
  initials: { alignItems: 'center', flexDirection: 'row' },
  initial: {
    alignItems: 'center',
    borderColor: colors.background,
    borderRadius: radius.pill,
    borderWidth: borderWidth.thin,
    height: componentSize.accountChipAvatar,
    justifyContent: 'center',
    width: componentSize.accountChipAvatar,
  },
  initialText: { ...typography.initial, color: colors.foreground },
  label: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, maxWidth: 110 },
  text: {
    ...typography.caption,
    color: colors.foreground,
    fontFamily: typography.bodySemiBold.fontFamily,
  },
});
