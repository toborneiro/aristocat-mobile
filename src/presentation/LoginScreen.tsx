import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '../components/Icon';
import { SafeScreen } from '../components/ui';
import { GoogleAuthButton } from '../features/auth/GoogleAuthButton';
import {
  blur,
  colors,
  componentSize,
  iconSize,
  layoutOffset,
  letterSpacing,
  radius,
  shadows,
  spacing,
  typography,
} from '../theme/tokens';

const glowStart = { x: 0.5, y: 0.5 };
const glowEnd = { x: 1, y: 1 };

export function LoginScreen() {
  return (
    <SafeScreen style={styles.screen}>
      <LinearGradient
        colors={[colors.primarySoft, colors.transparent]}
        end={glowEnd}
        start={glowStart}
        style={styles.topGlow}
      />
      <LinearGradient
        colors={[colors.indigoSoft, colors.transparent]}
        end={glowEnd}
        start={glowStart}
        style={styles.bottomGlow}
      />

      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <View style={styles.brandIcon}>
            <Icon color={colors.primaryForeground} name="wallet" size={iconSize.brand} />
          </View>
          <Text style={styles.brand}>FinanceApp</Text>
          <Text style={styles.tagline}>Seu dinheiro, sob controle</Text>
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={styles.welcome}>Bem-vindo{`\n`}de volta</Text>
          <Text style={styles.welcomeSubtitle}>Acesse sua conta para continuar</Text>
        </View>

        <View style={styles.providers}>
          <GoogleAuthButton />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          accessibilityLabel="Entrar com e-mail"
          accessibilityRole="button"
          onPress={() => router.replace('/home')}
          style={({ pressed }) => [styles.emailButton, pressed && styles.emailPressed]}
        >
          <Text style={styles.emailText}>Entrar com e-mail</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Criar nova conta"
          accessibilityRole="button"
          onPress={() => router.push('/register')}
          style={({ pressed }) => [styles.registerButton, pressed && styles.registerPressed]}
        >
          <Text style={styles.registerText}>Criar nova conta</Text>
        </Pressable>

        <Text style={styles.terms}>
          Ao continuar, você aceita nossos <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
          <Text style={styles.termsLink}>Política de Privacidade</Text>
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, overflow: 'hidden' },
  topGlow: {
    alignSelf: 'center',
    height: componentSize.loginTopGlow,
    pointerEvents: 'none',
    position: 'absolute',
    top: layoutOffset.loginTopOrb - blur.threeXl,
    width: componentSize.loginTopGlow,
  },
  bottomGlow: {
    bottom: layoutOffset.loginBottomOrb - blur.threeXl,
    height: componentSize.loginBottomGlow,
    pointerEvents: 'none',
    position: 'absolute',
    right: layoutOffset.loginRightOrb - blur.threeXl,
    width: componentSize.loginBottomGlow,
  },
  content: {
    flex: 1,
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
  tagline: { ...typography.body, color: colors.mutedForeground, marginTop: spacing.xs },
  welcomeBlock: { marginBottom: spacing.xxl },
  welcome: { ...typography.welcome, color: colors.foreground, marginBottom: spacing.sm },
  welcomeSubtitle: { ...typography.body, color: colors.mutedForeground },
  providers: { gap: spacing.md },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: 1 },
  dividerText: { ...typography.caption, color: colors.mutedForeground },
  emailButton: {
    ...shadows.loginPrimary,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  emailPressed: { backgroundColor: colors.secondary },
  emailText: { ...typography.action, color: colors.primaryForeground },
  registerButton: { alignItems: 'center', marginTop: spacing.lg, paddingVertical: spacing.sm },
  registerPressed: { opacity: 0.7 },
  registerText: { ...typography.bodyMedium, color: colors.primary },
  terms: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  termsLink: { color: colors.primary },
});
