import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type AppIconName } from './Icon';
import { colors, iconSize, spacing, typography } from '../theme/tokens';

const items: ReadonlyArray<{ href: '/home' | '/statement' | '/investments' | '/charts'; icon: AppIconName; label: string }> = [
  { href: '/home', icon: 'home', label: 'Início' },
  { href: '/statement', icon: 'statement', label: 'Extrato' },
  { href: '/investments', icon: 'investments', label: 'Invest.' },
  { href: '/charts', icon: 'charts', label: 'Gráficos' },
];

export function AppBottomNavigation() {
  const pathname = usePathname();

  return <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}><View accessibilityRole="tablist" style={styles.navigation}>{items.map((item) => {
    const isActive = pathname === item.href;
    const color = isActive ? colors.primary : colors.mutedForeground;

    return <Pressable accessibilityRole="tab" accessibilityState={{ selected: isActive }} accessibilityLabel={item.label} key={item.href} onPress={() => router.replace(item.href)} style={styles.item}>
      <Icon color={color} name={item.icon} size={iconSize.navigation} />
      <Text style={[styles.label, { color }]}>{item.label}</Text>
    </Pressable>;
  })}</View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface },
  navigation: { alignItems: 'center', backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', paddingHorizontal: spacing.xs, paddingVertical: spacing.sm },
  item: { alignItems: 'center', flex: 1, gap: spacing.xxs, paddingVertical: spacing.xs },
  label: typography.navigation,
});
