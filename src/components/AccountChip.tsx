import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  borderWidth,
  colors,
  iconSize,
  radius,
  spacing,
  typography,
} from '../theme/tokens';
import { Icon } from './Icon';

export function AccountChip({ label = 'Contas' }: { label?: string }) {
  return (
    <Pressable
      accessibilityLabel="Gerenciar contas"
      onPress={() => router.push('/banking')}
      style={styles.chip}
    >
      <Icon color={colors.primary} name="account" size={iconSize.chip} />
      <Text numberOfLines={1} style={styles.text}>
        {label}
      </Text>
      <Icon name="right" size={iconSize.chip} />
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
  text: {
    ...typography.caption,
    color: colors.foreground,
    fontFamily: typography.bodySemiBold.fontFamily,
    maxWidth: 140,
  },
});
