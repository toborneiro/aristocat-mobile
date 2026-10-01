import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accounts, accountGroups, assets, transactions } from '../mock/finance';
import { AppBottomNavigation } from '../components/AppBottomNavigation';
import { Icon } from '../components/Icon';
import { Card, SafeScreen } from '../components/ui';
import { useChartReveal } from '../hooks/useChartReveal';
import { colors, iconSize, radius, spacing, typography } from '../theme/tokens';

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const trend = (value: number) => (value >= 0 ? s.positive : s.negative);
const signed = (value: number) => `${value > 0 ? '+' : ''}${value}%`;
const Page = ({ children }: { children: React.ReactNode }) => (
  <SafeScreen style={s.page}>
    <ScrollView contentContainerStyle={s.content}>{children}</ScrollView>
    <AppBottomNavigation />
  </SafeScreen>
);
const AccountTrigger = () => (
  <Pressable
    accessibilityLabel="Selecionar visão"
    onPress={() => router.push('/account-selector')}
    style={s.accountTrigger}
  >
    <Icon color={colors.foreground} name="account" size={iconSize.action} />
    <Text style={s.accountName}>Pessoal — Nubank</Text>
    <Icon name="down" size={iconSize.chevron} />
  </Pressable>
);
const Back = () => (
  <Pressable accessibilityLabel="Voltar" onPress={() => router.back()} style={s.back}>
    <Icon color={colors.foreground} name="back" size={iconSize.action} />
  </Pressable>
);
function Chart({ color = colors.primary }: { color?: string }) {
  const progress = useChartReveal();

  return (
    <View style={s.chart}>
      <Animated.View
        style={[
          s.chartLine,
          {
            borderColor: color,
            opacity: progress,
            transform: [{ skewY: '-8deg' }, { scaleX: progress }],
          },
        ]}
      />
      <Text style={s.muted}>Fev Mar Abr Mai Jun Jul</Text>
    </View>
  );
}

export function SplashScreen() {
  return (
    <SafeScreen style={s.page}>
      <View style={s.center}>
        <Icon color={colors.primary} name="wallet" size={30} />
        <Text style={s.brand}>FinanceApp</Text>
        <Text style={s.muted}>Seu dinheiro, sob controle</Text>
        <Pressable onPress={() => router.replace('/auth')} style={s.primary}>
          <Text style={s.primaryText}>Continuar</Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}

export function AuthScreen() {
  return (
    <SafeScreen style={s.page}>
      <View style={s.login}>
        <Icon color={colors.primary} name="wallet" size={30} />
        <Text style={s.brand}>FinanceApp</Text>
        <Text style={s.muted}>Seu dinheiro, sob controle</Text>
        <Text style={s.welcome}>Bem-vindo{`\n`}de volta</Text>
        <Text style={s.muted}>Acesse sua conta para continuar</Text>
        <Pressable onPress={() => router.replace('/home')} style={s.social}>
          <Icon color={colors.foreground} name="google" size={iconSize.notification} />
          <Text style={[s.socialText, s.grow]}>Continuar com Google</Text>
          <Icon name="right" size={iconSize.chevron} />
        </Pressable>
        <Pressable onPress={() => router.replace('/home')} style={s.social}>
          <Icon color={colors.foreground} name="facebook" size={iconSize.notification} />
          <Text style={[s.socialText, s.grow]}>Continuar com Facebook</Text>
          <Icon name="right" size={iconSize.chevron} />
        </Pressable>
        <View style={s.or}>
          <View style={s.rule} />
          <Text style={s.muted}>ou</Text>
          <View style={s.rule} />
        </View>
        <TextInput
          placeholder="Entrar com e-mail"
          placeholderTextColor={colors.primaryForeground}
          style={[s.primary, s.primaryInput]}
        />
        <Text style={s.terms}>
          Ao continuar, você aceita nossos <Text style={s.green}>Termos de Uso</Text> e{' '}
          <Text style={s.green}>Política de Privacidade</Text>
        </Text>
      </View>
    </SafeScreen>
  );
}
export function HomeScreen() {
  const [hidden, setHidden] = useState(false);
  return (
    <Page>
      <View style={s.top}>
        <View>
          <Text style={s.micro}>VISUALIZANDO</Text>
          <AccountTrigger />
        </View>
        <Icon name="bell" size={iconSize.notification} />
      </View>
      <Card>
        <Text style={s.muted}>Saldo consolidado</Text>
        <Pressable onPress={() => setHidden(!hidden)}>
          <View style={s.inline}>
            <Text style={s.balance}>{hidden ? '••••••' : money(3240)}</Text>
            <Icon name={hidden ? 'eye' : 'eyeOff'} />
          </View>
        </Pressable>
        <View style={s.row}>
          <View>
            <Text style={s.muted}>Entradas (Jul)</Text>
            <Text style={s.positive}>+ {money(3500)}</Text>
          </View>
          <View>
            <Text style={s.muted}>Saídas (Jul)</Text>
            <Text style={s.negative}>- {money(260)}</Text>
          </View>
        </View>
      </Card>
      <View style={s.shortcuts}>
        {[
          { icon: 'statement' as const, label: 'Extrato', href: '/statement' },
          { icon: 'charts' as const, label: 'Gráficos', href: '/charts' },
          { icon: 'investments' as const, label: 'Invest.', href: '/investments' },
          { icon: 'link' as const, label: 'Open Banking', href: '' },
        ].map(({ icon, label, href }) => (
          <Pressable
            key={label}
            onPress={() => href && router.push(href as never)}
            style={s.shortcut}
          >
            <Icon color={colors.primary} name={icon} size={iconSize.chevron} />
            <Text style={s.shortcutText}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.section}>
        Contas integradas <Text style={s.green}>+ Adicionar</Text>
      </Text>
      {accounts.slice(0, 2).map((account) => (
        <Card key={account.id}>
          <View style={s.list}>
            <View style={[s.avatar, { backgroundColor: `${account.color}33` }]}>
              <Text style={[s.avatarText, { color: account.color }]}>{account.initials}</Text>
            </View>
            <View style={s.grow}>
              <Text style={s.itemTitle}>{account.name}</Text>
              <Text style={s.muted}>{account.bank}</Text>
            </View>
            <View>
              <Text style={s.itemTitle}>{money(account.balance)}</Text>
              <View style={s.inline}>
                <Icon color={colors.primary} name="check" size={iconSize.trend} />
                <Text style={s.positive}>Ativo</Text>
              </View>
            </View>
          </View>
        </Card>
      ))}
      <Text style={s.section}>Configurações</Text>
      <Card>
        {[
          { icon: 'settings' as const, title: 'Preferências', sub: 'Notificações, idioma' },
          { icon: 'security' as const, title: 'Segurança', sub: 'Senha, biometria' },
          { icon: 'link' as const, title: 'Open Banking', sub: 'Gerenciar consentimentos' },
          { icon: 'support' as const, title: 'Suporte', sub: 'Central de ajuda' },
        ].map(({ icon, title, sub }) => (
          <View key={title} style={s.list}>
            <Icon name={icon} />
            <View style={s.grow}>
              <Text style={s.itemTitle}>{title}</Text>
              <Text style={s.muted}>{sub}</Text>
            </View>
            <Icon name="right" size={iconSize.chevron} />
          </View>
        ))}
      </Card>
      <View style={s.inline}>
        <Icon color={colors.destructive} name="logout" />
        <Text style={s.negative}>Sair da conta</Text>
      </View>
    </Page>
  );
}
export function StatementScreen() {
  const [filter, setFilter] = useState('Todos');
  const list = transactions.filter(
    (item) => filter === 'Todos' || (filter === 'Crédito' ? item.amount > 0 : item.amount < 0),
  );
  return (
    <Page>
      <View style={s.top}>
        <View style={s.row}>
          <Back />
          <Text style={s.heading}>Extrato</Text>
        </View>
        <AccountTrigger />
      </View>
      <View style={s.row}>
        <Card>
          <View style={s.inline}>
            <Icon color={colors.primary} name="credit" size={iconSize.action} />
            <Text style={s.positive}>Créditos</Text>
          </View>
          <Text style={s.value}>{money(9956.8)}</Text>
        </Card>
        <Card>
          <View style={s.inline}>
            <Icon color={colors.destructive} name="debit" size={iconSize.action} />
            <Text style={s.negative}>Débitos</Text>
          </View>
          <Text style={s.value}>{money(430.2)}</Text>
        </Card>
      </View>
      <View style={s.segment}>
        {['Todos', 'Crédito', 'Débito'].map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[s.segmentItem, filter === item && s.active]}
          >
            <Text style={filter === item ? s.activeText : s.muted}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {list.map((item) => (
        <Card key={item.id}>
          <View style={s.list}>
            <Icon
              color={item.amount > 0 ? colors.primary : colors.destructive}
              name={item.amount > 0 ? 'credit' : 'debit'}
            />
            <View style={s.grow}>
              <Text style={s.itemTitle}>{item.description}</Text>
              <Text style={s.muted}>
                {item.category} · {item.date}
              </Text>
            </View>
            <Text style={item.amount > 0 ? s.positive : s.negative}>
              {item.amount > 0 ? '+' : ''}
              {money(item.amount)}
            </Text>
          </View>
        </Card>
      ))}
    </Page>
  );
}
export function ChartsScreen() {
  const [period, setPeriod] = useState('Mensal');
  return (
    <Page>
      <View style={s.top}>
        <View style={s.row}>
          <Back />
          <Text style={s.heading}>Histórico</Text>
        </View>
        <AccountTrigger />
      </View>
      <View style={s.segment}>
        {['Mensal', 'Semanal'].map((item) => (
          <Pressable
            key={item}
            onPress={() => setPeriod(item)}
            style={[s.segmentItem, period === item && s.active]}
          >
            <Text style={period === item ? s.activeText : s.muted}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.row}>
        <View style={s.inline}>
          <Icon color={colors.primary} name="credit" size={iconSize.trend} />
          <Text style={s.positive}>Créditos</Text>
        </View>
        <View style={s.inline}>
          <Icon color={colors.destructive} name="debit" size={iconSize.trend} />
          <Text style={s.negative}>Débitos</Text>
        </View>
      </View>
      <Card>
        <Chart color={colors.primary} />
        <Chart color={colors.destructive} />
      </Card>
      <Text style={s.section}>
        {period === 'Mensal' ? 'Resumo dos últimos 7 meses' : 'Resumo da semana'}
      </Text>
      <View style={s.row}>
        <Card>
          <Text style={s.positive}>Total créditos</Text>
          <Text style={s.value}>{money(51200)}</Text>
        </Card>
        <Card>
          <Text style={s.negative}>Total débitos</Text>
          <Text style={s.value}>{money(33600)}</Text>
        </Card>
      </View>
      <Card>
        <Text style={s.muted}>Saldo do período</Text>
        <Text style={s.value}>{money(17600)}</Text>
        <View style={s.progress} />
      </Card>
    </Page>
  );
}
export function InvestmentsScreen() {
  const [category, setCategory] = useState('Todos');
  const list = assets.filter((asset) => category === 'Todos' || asset.category === category);
  return (
    <Page>
      <View style={s.top}>
        <View style={s.row}>
          <Back />
          <Text style={s.heading}>Investimentos</Text>
        </View>
        <AccountTrigger />
      </View>
      <Card>
        <Text style={s.muted}>Total investido</Text>
        <Text style={s.balance}>{money(87430)}</Text>
        <View style={s.row}>
          <Text style={s.muted}>
            Rendimento mês anterior{`\n`}
            <Text style={s.positive}>+ {money(4110)}</Text>
          </Text>
          <Text style={s.muted}>
            Rendimento mês atual{`\n`}
            <Text style={s.positive}>+ {money(3030)}</Text>
          </Text>
        </View>
      </Card>
      <Card>
        <Text style={s.muted}>Evolução da carteira</Text>
        <Chart />
      </Card>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={s.row}>
          {['Todos', 'Ações', 'Renda fixa', 'FIIs', 'Cripto'].map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[s.chip, category === item && s.active]}
            >
              <Text style={category === item ? s.activeText : s.muted}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {list.map((asset) => (
        <Pressable
          key={asset.id}
          onPress={() => router.push({ pathname: '/asset-detail', params: { id: asset.id } })}
        >
          <Card>
            <View style={s.list}>
              <View style={[s.avatar, { backgroundColor: asset.color + '33' }]}>
                <Text style={{ color: asset.color }}>{asset.ticker.slice(0, 3)}</Text>
              </View>
              <View style={s.grow}>
                <Text style={s.itemTitle}>{asset.ticker}</Text>
                <Text style={s.muted}>{asset.name}</Text>
              </View>
              <View>
                <Text style={s.itemTitle}>{money(asset.currentValue)}</Text>
                <Text style={asset.monthChange >= 0 ? s.positive : s.negative}>
                  {asset.monthChange > 0 ? '+' : ''}
                  {asset.monthChange.toFixed(2)}%
                </Text>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </Page>
  );
}
export function AccountSelectorScreen() {
  return (
    <View style={s.sheetPage}>
      <Pressable
        accessibilityLabel="Fechar seletor de visÃ£o"
        accessibilityRole="button"
        onPress={() => router.back()}
        style={s.sheetBackdrop}
      />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={s.sheet}>
        <View style={s.handle} />
        <View style={s.top}>
          <Text style={s.heading}>Selecionar visão</Text>
          <Pressable accessibilityLabel="Fechar" onPress={() => router.back()}>
            <Icon color={colors.foreground} name="close" />
          </Pressable>
        </View>
        {accountGroups.map((group, index) => (
          <Pressable
            onPress={() => router.back()}
            key={group.label}
            style={[s.card, index === 0 && s.selectedCard]}
          >
            <Text style={s.green}>{group.type}</Text>
            <View style={s.inline}>
              <Text style={s.itemTitle}>{group.label}</Text>
              {index === 0 ? (
                <Icon color={colors.primary} name="check" size={iconSize.action} />
              ) : null}
            </View>
            <Text style={s.muted}>
              {group.ids.length} contas ·{' '}
              {money(
                group.ids.reduce(
                  (sum, id) => sum + (accounts.find((account) => account.id === id)?.balance ?? 0),
                  0,
                ),
              )}
            </Text>
          </Pressable>
        ))}
        <View style={s.add}>
          <Text style={s.muted}>Adicionar membro</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
function AssetMetrics({ asset }: { asset: (typeof assets)[number] }) {
  const gain = asset.currentValue - asset.invested;
  return (
    <>
      <Card>
        <Text style={s.muted}>Valor atual</Text>
        <Text style={s.balance}>{money(asset.currentValue)}</Text>
        <View style={s.row}>
          <Text style={s.muted}>
            Investido{`\n`}
            <Text style={s.value}>{money(asset.invested)}</Text>
          </Text>
          <Text style={s.muted}>
            Rentabilidade{`\n`}
            <Text style={s.positive}>{((gain / asset.invested) * 100).toFixed(2)}%</Text>
          </Text>
          <Text style={s.muted}>
            Variação dia{`\n`}
            <Text style={trend(asset.dailyChange)}>{signed(asset.dailyChange)}</Text>
          </Text>
        </View>
      </Card>
      <Card>
        <Text style={s.muted}>Evolução (6 meses)</Text>
        <Chart color={asset.color} />
      </Card>
      <View style={s.row}>
        <Card>
          <Text style={s.muted}>Variação mês</Text>
          <Text style={trend(asset.monthChange)}>{signed(asset.monthChange)}</Text>
        </Card>
        <Card>
          <Text style={s.muted}>Lucro / Perda</Text>
          <Text style={trend(gain)}>{money(gain)}</Text>
        </Card>
      </View>
    </>
  );
}
export function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const asset = (assets.find((item) => item.id === id) || assets[0]) as (typeof assets)[number];
  return (
    <Page>
      <View style={s.top}>
        <View style={s.row}>
          <Back />
          <View>
            <Text style={s.heading}>{asset.ticker}</Text>
            <Text style={s.muted}>{asset.name}</Text>
          </View>
        </View>
        <Text style={trend(asset.monthChange)}>{signed(asset.monthChange)}</Text>
      </View>
      <AssetMetrics asset={asset} />
    </Page>
  );
}
export function SettingsScreen() {
  return <HomeScreen />;
}
export function ProfileScreen() {
  return <HomeScreen />;
}
const s = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  content: { gap: spacing.md, padding: spacing.screen },
  center: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.screen,
  },
  login: { flex: 1, gap: spacing.lg, justifyContent: 'center', padding: spacing.screen },
  logo: { color: colors.primary, textAlign: 'center' },
  brand: { ...typography.brand, color: colors.foreground, textAlign: 'center' },
  welcome: { ...typography.welcome, color: colors.foreground, marginTop: 28 },
  muted: { ...typography.caption, color: colors.mutedForeground },
  green: { ...typography.bodySemiBold, color: colors.primary },
  primary: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    minHeight: 48,
    padding: spacing.lg,
  },
  primaryInput: { ...typography.action, color: colors.primaryForeground, textAlign: 'center' },
  primaryText: { ...typography.action, color: colors.primaryForeground, textAlign: 'center' },
  social: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 68,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  socialText: { ...typography.bodyMedium, color: colors.foreground },
  or: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  rule: { backgroundColor: colors.border, flex: 1, height: StyleSheet.hairlineWidth },
  terms: { ...typography.caption, color: colors.mutedForeground, textAlign: 'center' },
  top: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  inline: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  grow: { flex: 1 },
  micro: { ...typography.micro, color: colors.mutedForeground, letterSpacing: 1 },
  accountTrigger: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  accountName: { ...typography.bodySemiBold, color: colors.foreground },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  balance: { ...typography.amount, color: colors.foreground },
  positive: { ...typography.bodySemiBold, color: colors.primary },
  negative: { ...typography.bodySemiBold, color: colors.destructive },
  section: { ...typography.bodySemiBold, color: colors.foreground, marginTop: spacing.sm },
  shortcuts: { flexDirection: 'row', gap: spacing.sm },
  shortcut: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 5,
    padding: spacing.md,
  },
  shortcutText: { ...typography.micro, color: colors.mutedForeground, textAlign: 'center' },
  list: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xxs,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarText: { ...typography.bodySemiBold },
  itemTitle: { ...typography.bodySemiBold, color: colors.foreground },
  back: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  heading: { ...typography.title, color: colors.foreground },
  value: { ...typography.amountSmall, color: colors.foreground },
  segment: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  segmentItem: { alignItems: 'center', borderRadius: radius.sm, flex: 1, padding: 9 },
  active: { backgroundColor: colors.primary },
  activeText: { ...typography.caption, color: colors.primaryForeground },
  chart: { height: 130, justifyContent: 'space-between', paddingVertical: spacing.lg },
  chartLine: {
    borderRadius: radius.md,
    borderRightWidth: 3,
    borderTopWidth: 3,
    height: 40,
    transform: [{ skewY: '-8deg' }],
  },
  progress: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: spacing.sm,
    marginTop: spacing.sm,
    width: '64%',
  },
  chip: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sheetPage: { backgroundColor: colors.overlay, flex: 1, justifyContent: 'flex-end' },
  sheetBackdrop: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    gap: spacing.md,
    padding: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: colors.mutedForeground,
    borderRadius: radius.pill,
    height: spacing.xs,
    width: 40,
  },
  selectedCard: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  add: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
});
