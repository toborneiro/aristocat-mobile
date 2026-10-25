import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '../components/Icon';
import { SafeScreen } from '../components/ui';
import { colors, iconSize, spacing, typography } from '../theme/tokens';

export function SplashScreen() {
  return (
    <SafeScreen style={styles.page}>
      <View style={styles.center}>
        <Icon color={colors.primary} name="wallet" size={iconSize.notification} />
        <Text style={styles.brand}>Aristocat</Text>
        <Text style={styles.muted}>Sua vida financeira, sob controle</Text>
        <Pressable onPress={() => router.replace('/auth')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}

export function AuthScreen() {
  return (
    <SafeScreen style={styles.page}>
      <View style={styles.login}>
        <Icon color={colors.primary} name="wallet" size={iconSize.notification} />
        <Text style={styles.brand}>Aristocat</Text>
        <Text style={styles.welcome}>Bem-vindo{`\n`}de volta</Text>
        <Text style={styles.muted}>Acesse sua conta para continuar</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Entrar com e-mail"
          placeholderTextColor={colors.mutedForeground}
          style={styles.input}
        />
        <Pressable onPress={() => router.replace('/home')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </Pressable>
        <Text style={styles.terms}>Ao continuar, você aceita nossos Termos de Uso.</Text>
      </View>
    </SafeScreen>
  );
}

export function AccountSelectorScreen() {
  return (
    <SafeScreen style={styles.page}>
      <View style={styles.center}>
        <Text style={styles.title}>Nenhuma conta conectada</Text>
        <Text style={styles.muted}>Adicione uma conta para selecionar uma visão.</Text>
        <Pressable onPress={() => router.push('/banking')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Adicionar conta</Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}

export function AssetDetailScreen() {
  return (
    <SafeScreen style={styles.page}>
      <View style={styles.center}>
        <Text style={styles.title}>Investimento não encontrado</Text>
        <Text style={styles.muted}>Não há dados de investimento disponíveis.</Text>
      </View>
    </SafeScreen>
  );
}

export function HomeScreen() {
  return <AccountSelectorScreen />;
}

export function StatementScreen() {
  return <AccountSelectorScreen />;
}

export function ChartsScreen() {
  return <AccountSelectorScreen />;
}

export function InvestmentsScreen() {
  return <AccountSelectorScreen />;
}

export function SettingsScreen() {
  return <AccountSelectorScreen />;
}

export function ProfileScreen() {
  return <AccountSelectorScreen />;
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  center: { alignItems: 'center', flex: 1, gap: spacing.md, justifyContent: 'center', padding: spacing.screen },
  login: { flex: 1, gap: spacing.lg, justifyContent: 'center', padding: spacing.screen },
  brand: { ...typography.brand, color: colors.foreground },
  title: { ...typography.title, color: colors.foreground, textAlign: 'center' },
  welcome: { ...typography.welcome, color: colors.foreground },
  muted: { ...typography.body, color: colors.mutedForeground, textAlign: 'center' },
  input: {
    ...typography.action,
    borderColor: colors.border,
    borderRadius: spacing.md,
    borderWidth: 1,
    color: colors.foreground,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: { ...typography.action, color: colors.primaryForeground },
  terms: { ...typography.caption, color: colors.mutedForeground, textAlign: 'center' },
});
