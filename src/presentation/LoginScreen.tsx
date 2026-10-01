import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '../components/Icon';
import { SafeScreen } from '../components/ui';
import {
  borderWidth,
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

type Provider = 'Google' | 'Facebook';

const providers: ReadonlyArray<{
  icon: 'google' | 'facebook';
  iconBackground: string;
  label: Provider;
}> = [
  { icon: 'google', iconBackground: colors.destructiveForeground, label: 'Google' },
  { icon: 'facebook', iconBackground: colors.socialFacebook, label: 'Facebook' },
];
const glowStart = { x: 0.5, y: 0.5 };
const glowEnd = { x: 1, y: 1 };

export function LoginScreen() {
  const enterApplication = () => router.replace('/home');

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
          {providers.map((provider) => (
            <Pressable
              accessibilityLabel={`Continuar com ${provider.label}`}
              accessibilityRole="button"
              key={provider.label}
              onPress={enterApplication}
              style={({ pressed }) => [styles.providerButton, pressed && styles.providerPressed]}
            >
              <View style={[styles.providerIcon, { backgroundColor: provider.iconBackground }]}>
                {provider.icon === 'google' ? (
                  <GoogleMark />
                ) : (
                  <Icon color={colors.destructiveForeground} name="facebook" size={iconSize.social} />
                )}
              </View>
              <Text style={styles.providerText}>Continuar com {provider.label}</Text>
              <Icon name="right" size={iconSize.chevron} />
            </Pressable>
          ))}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          accessibilityLabel="Entrar com e-mail"
          accessibilityRole="button"
          onPress={enterApplication}
          style={({ pressed }) => [styles.emailButton, pressed && styles.emailPressed]}
        >
          <Text style={styles.emailText}>Entrar com e-mail</Text>
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
  providerButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  providerPressed: { backgroundColor: colors.secondary },
  providerIcon: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: componentSize.loginProviderIcon,
    justifyContent: 'center',
    width: componentSize.loginProviderIcon,
  },
  providerText: { ...typography.bodyMedium, color: colors.foreground, flex: 1 },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: borderWidth.thin },
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
  terms: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  termsLink: { color: colors.primary },
});

function GoogleMark() {
  return (
    <Svg height={iconSize.social} viewBox="0 0 48 48" width={iconSize.social}>
      <Path
        d="M44.5 20H24v8.5h11.7C34.4 33.7 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.2 0 6.1 1.2 8.4 3.1l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z"
        fill={colors.googleYellow}
      />
      <Path
        d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.2 0 6.1 1.2 8.4 3.1l6-6C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 11.7z"
        fill={colors.googleRed}
      />
      <Path
        d="M24 45c5.5 0 10.5-2.1 14.2-5.4l-6.5-5.5C29.7 35.6 27 36.8 24 36.8c-5.6 0-10.4-3.7-12.2-8.8l-6.6 5.1C8.9 41 15.9 45 24 45z"
        fill={colors.googleGreen}
      />
      <Path
        d="M44.5 20H24v8.5h11.7c-.9 3-3.1 5.5-6 7l6.5 5.5C40.6 37.5 44.5 31.3 44.5 24c0-1.4-.2-2.7-.5-4z"
        fill={colors.googleBlue}
      />
    </Svg>
  );
}
