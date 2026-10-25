import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '../components/AppScreenLayout';
import { AccountChip } from '../components/AccountChip';
import { Icon } from '../components/Icon';
import { Avatar, Card } from '../components/ui';
import { type AuthSession } from '../features/auth/auth-api';
import { useAuthSession } from '../features/auth/auth-session';
import { colors, iconSize, radius, spacing, typography } from '../theme/tokens';

const shortcuts = [
  { icon: 'statement' as const, label: 'Extrato', route: '/statement' },
  { icon: 'charts' as const, label: 'Gráficos', route: '/charts' },
  { icon: 'investments' as const, label: 'Investimentos', route: '/investments' },
  { icon: 'link' as const, label: 'Open Finance', route: '/banking' },
];

export function HomeScreen() {
  const { session } = useAuthSession();
  const profile = profileInfo(session);

  return (
    <AppScreenLayout contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ProfileSummary {...profile} />
        <View>
          <Text style={styles.eyebrow}>VISUALIZANDO</Text>
          <AccountChip />
        </View>
      </View>

      <Card style={styles.emptyCard}>
        <Icon color={colors.primary} name="wallet" size={iconSize.notification} />
        <Text style={styles.emptyTitle}>Nenhuma conta conectada</Text>
        <Text style={styles.emptyText}>
          Conecte uma conta bancária para visualizar saldos e transações reais.
        </Text>
        <Pressable onPress={() => router.push('/banking')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Adicionar conta</Text>
        </Pressable>
      </Card>

      <View style={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
          <Pressable
            accessibilityLabel={shortcut.label}
            key={shortcut.label}
            onPress={() => router.push(shortcut.route as never)}
            style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
          >
            <Icon color={colors.primary} name={shortcut.icon} size={iconSize.chevron} />
            <Text style={styles.shortcutText}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contas conectadas</Text>
        <Card style={styles.emptyListCard}>
          <Text style={styles.emptyText}>As contas conectadas aparecerão aqui.</Text>
        </Card>
      </View>
    </AppScreenLayout>
  );
}

function ProfileSummary({ avatarUrl, email, name }: Readonly<ProfileInfo>) {
  return (
    <View style={styles.profile}>
      <Avatar imageUrl={avatarUrl} label={name} />
      <View style={styles.profileDetails}>
        <Text numberOfLines={1} style={styles.profileName}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.profileEmail}>
          {email}
        </Text>
      </View>
    </View>
  );
}

type ProfileInfo = Readonly<{ avatarUrl: string | null; email: string; name: string }>;

function profileInfo(session: AuthSession | null): ProfileInfo {
  if (!session) return { avatarUrl: null, email: '', name: 'Usuário' };
  return {
    avatarUrl: session.user.avatarUrl ?? null,
    email: session.user.email,
    name: session.user.name,
  };
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, padding: 0 },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
  },
  profile: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  profileDetails: { flex: 1, gap: spacing.xs },
  profileName: { ...typography.bodySemiBold, color: colors.foreground },
  profileEmail: { ...typography.caption, color: colors.mutedForeground },
  eyebrow: { ...typography.micro, color: colors.mutedForeground, letterSpacing: 1 },
  emptyCard: {
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.screen,
    padding: spacing.xl,
  },
  emptyTitle: { ...typography.title, color: colors.foreground, textAlign: 'center' },
  emptyText: { ...typography.body, color: colors.mutedForeground, textAlign: 'center' },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  primaryButtonText: { ...typography.action, color: colors.primaryForeground },
  shortcuts: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.screen },
  shortcut: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  shortcutPressed: { backgroundColor: colors.primarySoft },
  shortcutText: { ...typography.micro, color: colors.mutedForeground, textAlign: 'center' },
  section: { gap: spacing.sm, paddingHorizontal: spacing.screen },
  sectionTitle: { ...typography.bodySemiBold, color: colors.foreground },
  emptyListCard: { padding: spacing.lg },
});
