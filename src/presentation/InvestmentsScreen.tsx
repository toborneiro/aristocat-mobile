import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { AccountChip } from '../components/AccountChip';
import { AppScreenLayout } from '../components/AppScreenLayout';
import { AnimatedChartDot, AnimatedChartSegment } from '../components/ChartMotion';
import { Icon } from '../components/Icon';
import { Card } from '../components/ui';
import { assets, portfolioHistory } from '../mock/finance';
import { useChartReveal } from '../hooks/useChartReveal';
import {
  borderWidth,
  blur,
  colors,
  componentSize,
  iconSize,
  opacity,
  radius,
  spacing,
  typography,
  withOpacity,
} from '../theme/tokens';

type Category = 'Todos' | (typeof assets)[number]['category'];

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const percent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

const categoryTabs: ReadonlyArray<{ key: Category; label: string }> = [
  { key: 'Todos', label: 'Todos' },
  { key: 'Ações', label: 'Ações' },
  { key: 'Renda fixa', label: 'Renda Fixa' },
  { key: 'FIIs', label: 'FIIs' },
  { key: 'Cripto', label: 'Cripto' },
];

const portfolioMonths = ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];

export function InvestmentsScreen() {
  const [category, setCategory] = useState<Category>('Todos');
  const currentValue = assets.reduce((total, asset) => total + asset.currentValue, 0);
  const previousYield = portfolioHistory[4]! - portfolioHistory[3]!;
  const currentYield = portfolioHistory[5]! - portfolioHistory[4]!;
  const filteredAssets = assets.filter((asset) => matchesCategory(asset, category));

  return (
    <AppScreenLayout contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="Voltar para início"
            onPress={() => router.replace('/home')}
            style={styles.backButton}
          >
            <Icon color={colors.foreground} name="back" size={iconSize.action} />
          </Pressable>
          <Text style={styles.title}>Investimentos</Text>
        </View>
        <AccountChip label="Pessoal — Nubank" />
      </View>

      <Card style={styles.totalCard}>
        <LinearGradient
          colors={[colors.primaryHalo, withOpacity(colors.primary, opacity.transparent)]}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.totalGlow}
        />
        <LinearGradient
          colors={[colors.surface, colors.primaryHalo, colors.surface]}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.totalGradient}
        />
        <LinearGradient
          colors={[colors.primaryHalo, withOpacity(colors.primary, opacity.transparent)]}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.totalHalo}
        />
        <Text style={styles.totalLabel}>Total investido</Text>
        <Text style={styles.totalAmount}>{money(currentValue)}</Text>
        <View style={styles.yields}>
          <YieldCard
            label="Rendimento mês anterior"
            percentage={(previousYield / portfolioHistory[3]!) * 100}
            style={styles.previousYield}
            value={previousYield}
          />
          <YieldCard
            label="Rendimento mês atual"
            percentage={(currentYield / portfolioHistory[4]!) * 100}
            style={styles.currentYield}
            value={currentYield}
          />
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <Text style={styles.chartLabel}>Evolução da carteira</Text>
        <PortfolioChart history={portfolioHistory} />
      </Card>

      <View style={styles.categories}>
        {categoryTabs.map((item) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: category === item.key }}
            key={item.key}
            onPress={() => setCategory(item.key)}
            style={[styles.category, category === item.key && styles.categorySelected]}
          >
            <Text
              style={[styles.categoryText, category === item.key && styles.categoryTextSelected]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.assetList}>
        {filteredAssets.map((asset) => (
          <AssetRow asset={asset} key={asset.id} />
        ))}
      </View>
    </AppScreenLayout>
  );
}

function YieldCard({
  label,
  percentage,
  style,
  value,
}: {
  label: string;
  percentage: number;
  style: object;
  value: number;
}) {
  const tone = valueTone(value);

  return (
    <View style={[styles.yield, style]}>
      <Text style={styles.yieldLabel}>{label}</Text>
      <Text style={[styles.yieldAmount, tone]}>
        {value >= 0 ? '+' : ''}
        {money(value)}
      </Text>
      <Text style={[styles.yieldPercent, tone]}>{percent(percentage)}</Text>
    </View>
  );
}

function AssetRow({ asset }: { asset: (typeof assets)[number] }) {
  const gain = asset.currentValue - asset.invested;
  const gainPercentage = (gain / asset.invested) * 100;
  const dailyVisual = dailyTone(asset.dailyChange);

  return (
    <Pressable
      accessibilityLabel={`Ver ${asset.ticker}`}
      onPress={() => router.push({ pathname: '/asset-detail', params: { id: asset.id } })}
      style={({ pressed }) => [styles.assetCard, pressed && styles.assetPressed]}
    >
      <View
        style={[
          styles.assetIcon,
          { backgroundColor: withOpacity(asset.color, opacity.accountFill) },
        ]}
      >
        <Text style={[styles.assetIconText, { color: asset.color }]}>
          {asset.ticker.slice(0, 3)}
        </Text>
      </View>
      <View style={styles.assetInfo}>
        <View style={styles.assetTop}>
          <Text style={styles.assetTicker}>{asset.ticker}</Text>
          <Text style={styles.assetValue}>{money(asset.currentValue)}</Text>
        </View>
        <View style={styles.assetBottom}>
          <Text numberOfLines={1} style={styles.assetName}>
            {asset.name}
          </Text>
          <View style={styles.assetTrend}>
            <Icon color={dailyVisual.color} name={dailyVisual.icon} size={iconSize.trend} />
            <Text style={[styles.assetPercentage, valueTone(gain)]}>{percent(gainPercentage)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function PortfolioChart({ history }: { history: readonly number[] }) {
  const [chartWidth, setChartWidth] = useState(0);
  const progress = useChartReveal();
  const maximum = Math.max(...history);
  const minimum = Math.min(...history);
  const range = maximum - minimum;
  const safeRange = Math.max(range, borderWidth.thin);
  const points = history.map((value, index) => ({
    x: (chartWidth * index) / (history.length - 1),
    y: componentSize.chartHeight - ((value - minimum) / safeRange) * componentSize.chartHeight,
  }));
  const axisValues = [maximum, (maximum + minimum) / 2, minimum];

  return (
    <View style={styles.chart} onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}>
      <Animated.View style={[styles.chartFill, { opacity: progress }]}>
        <LinearGradient
          colors={[
            withOpacity(colors.primary, opacity.chartGradientStart),
            withOpacity(colors.primary, opacity.transparent),
          ]}
          style={styles.chartGradient}
        />
      </Animated.View>
      {axisValues.map((value, index) => (
        <View key={value} style={[styles.chartGrid, { top: `${index * 50}%` }]}>
          <Text style={styles.chartAxis}>{Math.round(value / 1000)}k</Text>
        </View>
      ))}
      {points.slice(1).map((point, index) => (
        <AnimatedChartSegment
          color={colors.primary}
          end={point}
          key={portfolioMonths[index]}
          order={index}
          progress={progress}
          start={points[index]!}
          strokeWidth={componentSize.chartStroke}
          total={points.length - 1}
        />
      ))}
      {points.map((point, index) => (
        <AnimatedChartDot
          color={colors.primary}
          key={portfolioMonths[index]}
          order={index}
          point={point}
          progress={progress}
          size={componentSize.chartDot}
          total={points.length}
        />
      ))}
      <View style={styles.chartMonths}>
        {portfolioMonths.map((month) => (
          <Text key={month} style={styles.chartMonth}>
            {month}
          </Text>
        ))}
      </View>
    </View>
  );
}

function matchesCategory(asset: (typeof assets)[number], category: Category) {
  if (category === 'Todos') return true;

  return asset.category === category;
}

function dailyTone(value: number) {
  if (value >= 0) return { color: colors.primary, icon: 'charts' as const };

  return { color: colors.destructive, icon: 'trendingDown' as const };
}

function valueTone(value: number) {
  if (value >= 0) return styles.positive;

  return styles.negative;
}

const styles = StyleSheet.create({
  content: { gap: 0, padding: 0 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
  },
  headerRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    height: componentSize.backButton,
    justifyContent: 'center',
    width: componentSize.backButton,
  },
  title: { ...typography.title, color: colors.foreground },
  totalCard: {
    marginBottom: spacing.md,
    marginHorizontal: spacing.screen,
    overflow: 'hidden',
    padding: spacing.xl,
  },
  totalHalo: {
    borderRadius: radius.pill,
    height: componentSize.investmentHalo,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    width: componentSize.investmentHalo,
  },
  totalGlow: {
    borderRadius: radius.pill,
    height: componentSize.investmentGlow,
    pointerEvents: 'none',
    position: 'absolute',
    right: -blur.threeXl,
    top: -blur.threeXl,
    width: componentSize.investmentGlow,
  },
  totalGradient: {
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  totalLabel: { ...typography.caption, color: colors.mutedForeground, marginBottom: spacing.xs },
  totalAmount: { ...typography.amount, color: colors.foreground, marginBottom: spacing.md },
  yields: { flexDirection: 'row', gap: spacing.md },
  yield: { borderRadius: radius.md, flex: 1, padding: spacing.md },
  previousYield: { backgroundColor: colors.mutedSoft },
  currentYield: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: borderWidth.thin,
  },
  yieldLabel: { ...typography.micro, color: colors.mutedForeground, marginBottom: spacing.xs },
  yieldAmount: { ...typography.amountSmallBold },
  yieldPercent: { ...typography.micro, marginTop: spacing.xxs },
  positive: { color: colors.primary },
  negative: { color: colors.destructive },
  chartCard: { marginBottom: spacing.md, marginHorizontal: spacing.screen, padding: spacing.lg },
  chartLabel: { ...typography.caption, color: colors.mutedForeground, marginBottom: spacing.sm },
  chart: { height: componentSize.chartHeight, overflow: 'hidden', position: 'relative' },
  chartFill: { bottom: 0, left: 0, pointerEvents: 'none', position: 'absolute', right: 0, top: 0 },
  chartGradient: { flex: 1 },
  chartGrid: {
    borderTopColor: colors.chartGrid,
    borderTopWidth: borderWidth.thin,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  chartAxis: {
    ...typography.navigation,
    color: colors.mutedForeground,
    marginTop: -spacing.compact,
  },
  chartMonths: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  chartMonth: { ...typography.micro, color: colors.mutedForeground },
  categories: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.screen,
  },
  category: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    flexShrink: 1,
    paddingHorizontal: spacing.compact,
    paddingVertical: spacing.compact,
  },
  categorySelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { ...typography.smallBold, color: colors.mutedForeground },
  categoryTextSelected: { color: colors.primaryForeground },
  assetList: { gap: spacing.sm, paddingBottom: spacing.screen, paddingHorizontal: spacing.screen },
  assetCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  assetPressed: { borderColor: colors.primaryHoverBorder },
  assetIcon: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: componentSize.assetIcon,
    justifyContent: 'center',
    width: componentSize.assetIcon,
  },
  assetIconText: { ...typography.captionSemiBold },
  assetInfo: { flex: 1, minWidth: 0 },
  assetTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxs,
  },
  assetTicker: { ...typography.bodySemiBold, color: colors.foreground },
  assetValue: { ...typography.amountSmallBold, color: colors.foreground },
  assetBottom: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  assetName: { ...typography.caption, color: colors.mutedForeground, paddingRight: spacing.xs },
  assetTrend: { alignItems: 'center', flexDirection: 'row', flexShrink: 0, gap: spacing.xs },
  assetPercentage: { ...typography.smallBold },
});
