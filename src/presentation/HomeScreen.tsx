import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '../components/AppScreenLayout';
import { AccountChip } from '../components/AccountChip';
import { Icon, type AppIconName } from '../components/Icon';
import { Card } from '../components/ui';
import { accountGroups, accountPeriod, accounts } from '../mock/finance';
import {
  borderWidth,
  blur,
  colors,
  componentSize,
  iconSize,
  letterSpacing,
  opacity,
  radius,
  spacing,
  typography,
  withOpacity,
} from '../theme/tokens';

type Language = 'pt' | 'en' | 'es';

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const translations = {
  pt: {
    viewing: 'VISUALIZANDO',
    group: 'Pessoal — Nubank',
    balance: 'Saldo consolidado',
    inflows: 'Entradas (Jul)',
    outflows: 'Saídas (Jul)',
    statement: 'Extrato',
    charts: 'Gráficos',
    investments: 'Invest.',
    connectedAccounts: 'Contas integradas',
    addAccount: '+ Adicionar',
    settings: 'Configurações',
    openBanking: 'Open Banking',
    preferences: 'Preferências',
    preferencesSub: 'Notificações, idioma',
    security: 'Segurança',
    securitySub: 'Senha, biometria',
    openBankingSub: 'Gerenciar consentimentos',
    support: 'Suporte',
    supportSub: 'Central de ajuda',
    active: 'Ativo',
    logout: 'Sair da conta',
  },
  en: {
    viewing: 'VIEWING',
    group: 'Personal — Nubank',
    balance: 'Consolidated balance',
    inflows: 'Inflows (Jul)',
    outflows: 'Outflows (Jul)',
    statement: 'Statement',
    charts: 'Charts',
    investments: 'Invest.',
    connectedAccounts: 'Connected accounts',
    addAccount: '+ Add',
    settings: 'Settings',
    openBanking: 'Open Banking',
    preferences: 'Preferences',
    preferencesSub: 'Notifications, language',
    security: 'Security',
    securitySub: 'Password, biometrics',
    openBankingSub: 'Manage consents',
    support: 'Support',
    supportSub: 'Help center',
    active: 'Active',
    logout: 'Sign out',
  },
  es: {
    viewing: 'VIENDO',
    group: 'Personal — Nubank',
    balance: 'Saldo consolidado',
    inflows: 'Entradas (Jul)',
    outflows: 'Salidas (Jul)',
    statement: 'Extracto',
    charts: 'Gráficos',
    investments: 'Invest.',
    connectedAccounts: 'Cuentas integradas',
    addAccount: '+ Agregar',
    settings: 'Configuración',
    openBanking: 'Open Banking',
    preferences: 'Preferencias',
    preferencesSub: 'Notificaciones, idioma',
    security: 'Seguridad',
    securitySub: 'Contraseña, biometría',
    openBankingSub: 'Gestionar consentimientos',
    support: 'Soporte',
    supportSub: 'Centro de ayuda',
    active: 'Activo',
    logout: 'Cerrar sesión',
  },
} as const;

const languages: ReadonlyArray<{ code: Language; flag: string; label: string }> = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
];

const settings: ReadonlyArray<{
  icon: AppIconName;
  label: keyof (typeof translations)['pt'];
  sub: keyof (typeof translations)['pt'];
}> = [
  { icon: 'settings', label: 'preferences', sub: 'preferencesSub' },
  { icon: 'security', label: 'security', sub: 'securitySub' },
  { icon: 'bank', label: 'openBanking', sub: 'openBankingSub' },
  { icon: 'support', label: 'support', sub: 'supportSub' },
];

export function HomeScreen() {
  const [hideBalance, setHideBalance] = useState(false);
  const [language, setLanguage] = useState<Language>('pt');
  const labels = translations[language];
  const accountIds = accountGroups[0]!.ids;
  const visibleAccounts = accounts.filter((account) => accountIds.includes(account.id));
  const totalBalance = visibleAccounts.reduce((total, account) => total + account.balance, 0);
  const totalInflows = visibleAccounts.reduce(
    (total, account) => total + accountPeriod[account.id as keyof typeof accountPeriod]!.inflows,
    0,
  );
  const totalOutflows = visibleAccounts.reduce(
    (total, account) => total + accountPeriod[account.id as keyof typeof accountPeriod]!.outflows,
    0,
  );

  return (
    <AppScreenLayout contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.viewing}>{labels.viewing}</Text>
          <View style={styles.headerControls}>
            <AccountChip label={labels.group} />
            <View style={styles.languageSwitcher}>
              {languages.map((item) => (
                <Pressable
                  accessibilityLabel={`Idioma ${item.label}`}
                  key={item.code}
                  onPress={() => setLanguage(item.code)}
                  style={[styles.languageButton, language === item.code && styles.languageSelected]}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      language === item.code && styles.languageTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>

      <Card style={styles.balanceCard}>
        <LinearGradient
          colors={[colors.primaryHalo, withOpacity(colors.primary, opacity.transparent)]}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.balanceGlow}
        />
        <LinearGradient
          colors={[colors.surface, colors.primaryHalo, colors.surface]}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.balanceGradient}
        />
        <LinearGradient
          colors={[colors.primaryHalo, withOpacity(colors.primary, opacity.transparent)]}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.balanceHalo}
        />
        <Text style={styles.balanceLabel}>{labels.balance}</Text>
        <View style={styles.balanceAmountRow}>
          <Text style={styles.balanceAmount}>{hideBalance ? '•••••' : money(totalBalance)}</Text>
          <Pressable
            accessibilityLabel={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
            onPress={() => setHideBalance((current) => !current)}
            style={styles.eyeButton}
          >
            <Icon name={hideBalance ? 'eye' : 'eyeOff'} size={iconSize.action} />
          </Pressable>
        </View>
        <View style={styles.balanceTotals}>
          <View>
            <Text style={styles.balanceLabel}>{labels.inflows}</Text>
            <Text style={styles.inflow}>+ {money(totalInflows)}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View>
            <Text style={styles.balanceLabel}>{labels.outflows}</Text>
            <Text style={styles.outflow}>- {money(totalOutflows)}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.shortcuts}>
        {[
          {
            icon: 'statement' as const,
            label: labels.statement,
            onPress: () => router.push('/statement'),
          },
          { icon: 'charts' as const, label: labels.charts, onPress: () => router.push('/charts') },
          {
            icon: 'investments' as const,
            label: labels.investments,
            onPress: () => router.push('/investments'),
          },
          { icon: 'link' as const, label: 'Open Banking', onPress: () => router.replace('/home') },
        ].map((shortcut) => (
          <Pressable
            accessibilityLabel={shortcut.label}
            key={shortcut.label}
            onPress={shortcut.onPress}
            style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
          >
            <View style={styles.shortcutIcon}>
              <Icon color={colors.primary} name={shortcut.icon} size={iconSize.chevron} />
            </View>
            <Text style={styles.shortcutText}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{labels.connectedAccounts}</Text>
          <Text style={styles.addAccount}>{labels.addAccount}</Text>
        </View>
        <View style={styles.accountList}>
          {visibleAccounts.map((account) => (
            <Card key={account.id} style={styles.accountCard}>
              <View
                style={[
                  styles.accountAvatar,
                  {
                    backgroundColor: withOpacity(account.color, opacity.accountFill),
                    borderColor: withOpacity(account.color, opacity.accountBorder),
                  },
                ]}
              >
                <Text style={[styles.accountAvatarText, { color: account.color }]}>
                  {account.initials}
                </Text>
              </View>
              <View style={styles.grow}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBank}>{account.bank}</Text>
              </View>
              <View style={styles.accountValue}>
                <Text style={styles.accountBalance}>
                  {hideBalance ? '•••' : money(account.balance)}
                </Text>
                <View style={styles.accountStatus}>
                  <Icon color={colors.primary} name="check" size={iconSize.trend} />
                  <Text style={styles.active}>{labels.active}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{labels.settings}</Text>
        <Card style={styles.settingsCard}>
          {settings.map((item, index) => (
            <View
              key={item.label}
              style={[styles.settingRow, index < settings.length - 1 && styles.settingDivider]}
            >
              <View style={styles.settingIcon}>
                <Icon name={item.icon} size={iconSize.settings} />
              </View>
              <View style={styles.grow}>
                <Text style={styles.settingLabel}>{labels[item.label]}</Text>
                <Text style={styles.settingSub}>{labels[item.sub]}</Text>
              </View>
              <Icon name="right" size={iconSize.settings} />
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.logout}>
        <Icon color={colors.destructive} name="logout" size={iconSize.chevron} />
        <Text style={styles.logoutText}>{labels.logout}</Text>
      </View>
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { gap: 0, padding: 0 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
  },
  headerLeft: { gap: spacing.xs },
  headerControls: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  viewing: {
    ...typography.micro,
    color: colors.mutedForeground,
    letterSpacing: letterSpacing.widest,
  },
  languageSwitcher: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.xxs,
    padding: spacing.xxs,
  },
  languageButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.compact,
    paddingVertical: spacing.xxs,
  },
  languageSelected: { backgroundColor: colors.primary },
  flag: { fontSize: typography.body.fontSize, lineHeight: typography.body.fontSize },
  languageText: { ...typography.micro, color: colors.mutedForeground },
  languageTextSelected: { color: colors.primaryForeground },
  balanceCard: {
    marginBottom: spacing.xl,
    marginHorizontal: spacing.screen,
    overflow: 'hidden',
    padding: spacing.xl,
  },
  balanceHalo: {
    borderRadius: radius.pill,
    height: componentSize.balanceHalo,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    width: componentSize.balanceHalo,
  },
  balanceGlow: {
    borderRadius: radius.pill,
    height: componentSize.balanceGlow,
    pointerEvents: 'none',
    position: 'absolute',
    right: -blur.twoXl,
    top: -blur.twoXl,
    width: componentSize.balanceGlow,
  },
  balanceGradient: {
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  balanceLabel: { ...typography.caption, color: colors.mutedForeground },
  balanceAmountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  balanceAmount: {
    ...typography.amount,
    color: colors.foreground,
    letterSpacing: letterSpacing.amountTight,
  },
  eyeButton: { marginLeft: spacing.xs },
  balanceTotals: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  balanceDivider: { alignSelf: 'stretch', backgroundColor: colors.border, width: borderWidth.thin },
  inflow: { ...typography.bodySemiBold, color: colors.primary },
  outflow: { ...typography.bodySemiBold, color: colors.destructive },
  shortcuts: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
  },
  shortcut: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  shortcutPressed: { backgroundColor: colors.muted, borderColor: colors.primaryHoverBorder },
  shortcutIcon: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    height: componentSize.shortcutIcon,
    justifyContent: 'center',
    width: componentSize.shortcutIcon,
  },
  shortcutText: {
    ...typography.micro,
    color: colors.mutedForeground,
    lineHeight: typography.micro.fontSize * 1.25,
    textAlign: 'center',
  },
  section: { gap: spacing.md, marginBottom: spacing.xl, paddingHorizontal: spacing.screen },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { ...typography.bodySemiBold, color: colors.foreground },
  addAccount: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  accountList: { gap: spacing.sm },
  accountCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  accountAvatar: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: borderWidth.thick,
    height: componentSize.accountAvatar,
    justifyContent: 'center',
    width: componentSize.accountAvatar,
  },
  accountAvatarText: { ...typography.caption, fontFamily: typography.bodySemiBold.fontFamily },
  grow: { flex: 1 },
  accountName: { ...typography.bodyMedium, color: colors.foreground },
  accountBank: { ...typography.caption, color: colors.mutedForeground },
  accountValue: { alignItems: 'flex-end' },
  accountBalance: { ...typography.amountSmall, color: colors.foreground },
  accountStatus: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  active: { ...typography.micro, color: colors.primary, fontFamily: typography.caption.fontFamily },
  settingsCard: { overflow: 'hidden', padding: 0 },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.row,
  },
  settingDivider: { borderBottomColor: colors.border, borderBottomWidth: borderWidth.thin },
  settingIcon: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.sm,
    height: componentSize.settingsIcon,
    justifyContent: 'center',
    width: componentSize.settingsIcon,
  },
  settingLabel: { ...typography.bodyMedium, color: colors.foreground },
  settingSub: { ...typography.caption, color: colors.mutedForeground },
  logout: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screen,
  },
  logoutText: { ...typography.bodyMedium, color: colors.destructive },
});
