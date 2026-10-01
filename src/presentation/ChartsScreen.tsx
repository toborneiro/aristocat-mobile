import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccountChip } from '../components/AccountChip';
import { AppScreenLayout } from '../components/AppScreenLayout';
import { AnimatedChartDot, AnimatedChartSegment } from '../components/ChartMotion';
import { Icon } from '../components/Icon';
import { Card } from '../components/ui';
import { monthlyCashflow, weeklyCashflow } from '../mock/finance';
import { useChartReveal } from '../hooks/useChartReveal';
import {
  borderWidth,
  colors,
  componentSize,
  iconSize,
  radius,
  spacing,
  typography,
} from '../theme/tokens';

type Period = 'monthly' | 'weekly';
type Cashflow = (typeof monthlyCashflow)[number] | (typeof weeklyCashflow)[number];

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const periods: ReadonlyArray<{ key: Period; label: string }> = [
  { key: 'monthly', label: 'Mensal' },
  { key: 'weekly', label: 'Semanal' },
];

export function ChartsScreen() {
  const [period, setPeriod] = useState<Period>('monthly');
  const history = period === 'monthly' ? monthlyCashflow : weeklyCashflow;
  const totalCredits = history.reduce((total, item) => total + item.credits, 0);
  const totalDebits = history.reduce((total, item) => total + item.debits, 0);
  const balanceRatio = Math.min(100, (totalCredits / (totalCredits + totalDebits)) * 100);

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
          <Text style={styles.title}>Histórico</Text>
        </View>
        <AccountChip label="Pessoal — Nubank" />
      </View>

      <View style={styles.periodBar}>
        {periods.map((item) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: period === item.key }}
            key={item.key}
            onPress={() => setPeriod(item.key)}
            style={[styles.periodButton, period === item.key && styles.periodSelected]}
          >
            <Text style={[styles.periodText, period === item.key && styles.periodTextSelected]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.legend}>
        <LegendItem color={colors.primary} label="Créditos" />
        <LegendItem color={colors.destructive} label="Débitos" />
      </View>

      <Card style={styles.chartCard}>
        <HistoryChart history={history} />
      </Card>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          {period === 'monthly' ? 'Resumo dos últimos 7 meses' : 'Resumo da semana'}
        </Text>
        <View style={styles.summaryMetrics}>
          <SummaryMetric
            color={colors.destructive}
            label="Total créditos"
            style={styles.creditSummary}
            value={totalCredits}
          />
          <SummaryMetric
            color={colors.primary}
            label="Total débitos"
            style={styles.debitSummary}
            value={totalDebits}
          />
        </View>
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo do período</Text>
            <Text style={styles.balanceAmount}>{money(totalCredits - totalDebits)}</Text>
          </View>
          <View style={styles.balanceTrack}>
            <LinearGradient
              colors={[colors.destructive, colors.primary]}
              end={{ x: 1, y: 0.5 }}
              start={{ x: 0, y: 0.5 }}
              style={[styles.balanceFill, { width: `${balanceRatio}%` }]}
            />
          </View>
        </Card>
      </View>
    </AppScreenLayout>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function SummaryMetric({
  color,
  label,
  style,
  value,
}: {
  color: string;
  label: string;
  style: object;
  value: number;
}) {
  return (
    <View style={[styles.summaryMetric, style]}>
      <Text style={[styles.summaryMetricLabel, { color }]}>{label}</Text>
      <Text style={[styles.summaryMetricAmount, { color }]}>{money(value)}</Text>
    </View>
  );
}

function HistoryChart({ history }: { history: readonly Cashflow[] }) {
  const [chartWidth, setChartWidth] = useState(0);
  const progress = useChartReveal();
  const maximum = Math.max(...history.flatMap((item) => [item.credits, item.debits]));
  const safeMaximum = Math.max(maximum, borderWidth.thin);
  const credits = chartPoints(
    history.map((item) => item.credits),
    chartWidth,
    safeMaximum,
  );
  const debits = chartPoints(
    history.map((item) => item.debits),
    chartWidth,
    safeMaximum,
  );
  const axisValues = [safeMaximum, safeMaximum / 2, 0];

  return (
    <View style={styles.chart} onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}>
      {axisValues.map((value, index) => (
        <View key={value} style={[styles.chartGrid, { top: `${index * 50}%` }]}>
          <Text style={styles.chartAxis}>{Math.round(value / 1000)}k</Text>
        </View>
      ))}
      <ChartSeries color={colors.primary} points={credits} progress={progress} />
      <ChartSeries color={colors.destructive} points={debits} progress={progress} />
      <View style={styles.chartLabels}>
        {history.map((item) => (
          <Text key={item.label} style={styles.chartLabel}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ChartSeries({
  color,
  points,
  progress,
}: {
  color: string;
  points: readonly { x: number; y: number }[];
  progress: import('react-native').Animated.Value;
}) {
  return (
    <>
      {points.slice(1).map((point, index) => (
        <AnimatedChartSegment
          color={color}
          end={point}
          key={`${color}-${index}`}
          order={index}
          progress={progress}
          start={points[index]!}
          strokeWidth={componentSize.chartStroke}
          total={points.length - 1}
        />
      ))}
      {points.map((point, index) => (
        <AnimatedChartDot
          key={`${color}-dot-${index}`}
          color={color}
          order={index}
          point={point}
          progress={progress}
          size={componentSize.historyChartDot}
          total={points.length}
        />
      ))}
    </>
  );
}

function chartPoints(values: readonly number[], width: number, maximum: number) {
  return values.map((value, index) => ({
    x: (width * index) / (values.length - 1),
    y: componentSize.historyChartHeight - (value / maximum) * componentSize.historyChartHeight,
  }));
}

const styles = StyleSheet.create({
  content: { gap: 0, padding: 0 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
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
  periodBar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.screen,
    padding: spacing.xs,
  },
  periodButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  periodSelected: { backgroundColor: colors.primary },
  periodText: { ...typography.captionSemiBold, color: colors.mutedForeground },
  periodTextSelected: { color: colors.primaryForeground },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.screen,
  },
  legendItem: { alignItems: 'center', flexDirection: 'row', gap: spacing.compact },
  legendDot: {
    borderRadius: radius.pill,
    height: componentSize.legendDot,
    width: componentSize.legendDot,
  },
  legendText: { ...typography.caption, color: colors.mutedForeground },
  chartCard: { marginBottom: spacing.xl, marginHorizontal: spacing.lg, padding: spacing.lg },
  chart: { height: componentSize.historyChartHeight, overflow: 'hidden', position: 'relative' },
  chartGrid: {
    borderTopColor: colors.chartGridStrong,
    borderTopWidth: borderWidth.thin,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  chartAxis: { ...typography.micro, color: colors.mutedForeground, marginTop: -spacing.compact },
  chartLabels: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  chartLabel: { ...typography.small, color: colors.mutedForeground },
  summary: { marginBottom: spacing.xl, paddingHorizontal: spacing.screen },
  summaryTitle: { ...typography.bodySemiBold, color: colors.foreground, marginBottom: spacing.md },
  summaryMetrics: { flexDirection: 'row', gap: spacing.md },
  summaryMetric: { borderRadius: radius.lg, flex: 1, padding: spacing.lg },
  creditSummary: {
    backgroundColor: colors.destructiveSubtle,
    borderColor: colors.destructiveBorder,
    borderWidth: borderWidth.thin,
  },
  debitSummary: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: borderWidth.thin,
  },
  summaryMetricLabel: { ...typography.captionMedium, marginBottom: spacing.xs },
  summaryMetricAmount: { ...typography.amountAction },
  balanceCard: { marginTop: spacing.md, padding: spacing.lg },
  balanceHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  balanceLabel: { ...typography.body, color: colors.mutedForeground },
  balanceAmount: { ...typography.amountSmallBold, color: colors.destructive },
  balanceTrack: {
    backgroundColor: colors.muted,
    borderRadius: radius.pill,
    height: spacing.sm,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  balanceFill: { borderRadius: radius.pill, height: spacing.sm },
});
