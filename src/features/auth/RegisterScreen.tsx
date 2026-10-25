import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '../../components/Icon';
import {
  colors,
  componentSize,
  iconSize,
  letterSpacing,
  radius,
  shadows,
  spacing,
  typography,
} from '../../theme/tokens';
import { AuthScreenLayout } from './AuthScreenLayout';
import { GoogleAuthButton } from './GoogleAuthButton';

export function RegisterScreen() {
  return (
    <AuthScreenLayout>
      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <View style={styles.brandIcon}>
            <Icon color={colors.primaryForeground} name="wallet" size={iconSize.brand} />
          </View>
          <Text style={styles.brand}>FinanceApp</Text>
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Escolha como deseja começar</Text>
        </View>

        <Pressable
          accessibilityLabel="Cadastrar com dados"
          accessibilityRole="button"
          onPress={() => router.push('/register/manual')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
        >
          <Text style={styles.primaryText}>Cadastrar com dados</Text>
          <Icon color={colors.primaryForeground} name="right" size={iconSize.chevron} />
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <GoogleAuthButton />

        <Pressable
          accessibilityLabel="Já tenho uma conta"
          accessibilityRole="button"
          onPress={() => router.replace('/auth')}
          style={({ pressed }) => [styles.loginLink, pressed && styles.loginLinkPressed]}
        >
          <Text style={styles.loginText}>Já tenho uma conta</Text>
        </Pressable>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.hero,
  },
  brandBlock: { alignItems: 'center', marginBottom: spacing.xxxl },
  brandIcon: {
    ...shadows.loginBrand,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    height: componentSize.loginBrandIcon,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: componentSize.loginBrandIcon,
  },
  brand: { ...typography.brand, color: colors.foreground, letterSpacing: letterSpacing.brandTight },
  headingBlock: { marginBottom: spacing.xxl },
  title: { ...typography.welcome, color: colors.foreground, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.mutedForeground },
  primaryButton: {
    ...shadows.loginPrimary,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  primaryPressed: { backgroundColor: colors.secondary },
  primaryText: {
    ...typography.action,
    color: colors.primaryForeground,
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: 1 },
  dividerText: { ...typography.caption, color: colors.mutedForeground },
  loginLink: { alignItems: 'center', marginTop: spacing.xl, paddingVertical: spacing.sm },
  loginLinkPressed: { opacity: 0.7 },
  loginText: { ...typography.bodyMedium, color: colors.primary },
});
