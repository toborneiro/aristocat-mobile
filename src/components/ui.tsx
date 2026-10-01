import type { PropsWithChildren, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActivityIndicator, Modal as NativeModal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, radius, shadows, spacing, typography } from '../theme/tokens';
import type { StatusTone } from '../types/ui';

type SurfaceProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;
type TextStyleProps = StyleProp<TextStyle>;

export function SafeScreen({ children, edges = ['top', 'left', 'right'], style }: SurfaceProps & { edges?: Edge[] }) {
  return <SafeAreaView edges={edges} style={[styles.screen, style]}>{children}</SafeAreaView>;
}

export function Container({ children, style }: SurfaceProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

export function Surface({ children, style }: SurfaceProps) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function Card({ children, style }: SurfaceProps) {
  return <Surface style={style}>{children}</Surface>;
}

export function Section({ title, children }: PropsWithChildren<{ title?: string }>) {
  return <View style={styles.section}>{title ? <Text style={styles.sectionTitle}>{title}</Text> : null}{children}</View>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Button({ label, onPress, disabled }: { label: string; onPress?: () => void; disabled?: boolean }) {
  return <Pressable accessibilityLabel={label} accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, pressed && !disabled && styles.buttonPressed, disabled && styles.disabled]}><Text style={styles.buttonText}>{label}</Text></Pressable>;
}

export function Input({ placeholder, focused, disabled }: { placeholder: string; focused?: boolean; disabled?: boolean }) {
  return <TextInput editable={!disabled} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} style={[styles.input, focused && styles.focused, disabled && styles.disabled]} />;
}

export const TextField = Input;

export function Avatar({ label = 'AM' }: { label?: string }) {
  return <View accessibilityLabel={`Avatar ${label}`} style={styles.avatar}><Text style={styles.avatarText}>{label}</Text></View>;
}

export function Badge({ label, tone = 'default' }: { label: string; tone?: StatusTone }) {
  return <View style={[styles.badge, tone === 'success' && styles.success, tone === 'error' && styles.error]}><Text style={styles.badgeText}>{label}</Text></View>;
}

export function Chip({ label, selected }: { label: string; selected?: boolean }) {
  return <View style={[styles.chip, selected && styles.selected]}><Text style={[styles.chipText, selected && styles.selectedText]}>{label}</Text></View>;
}

export function Header({ title, action }: { title: string; action?: ReactNode }) {
  return <View style={styles.header}><Text style={styles.heading}>{title}</Text>{action}</View>;
}

export function ListItem({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return <View style={styles.listItem}><View style={styles.grow}><Text style={styles.listTitle}>{title}</Text>{subtitle ? <Text style={styles.muted}>{subtitle}</Text> : null}</View>{right}</View>;
}

export function EmptyState({ title = 'Nada para mostrar' }: { title?: string }) {
  return <Card><Text style={styles.muted}>{title}</Text></Card>;
}

export function Loading() {
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.muted}>Carregando</Text></View>;
}

export function Toast({ message }: { message: string }) {
  return <View style={styles.toast}><Text style={styles.buttonText}>{message}</Text></View>;
}

export function Dialog({ visible, title, children }: PropsWithChildren<{ visible: boolean; title: string }>) {
  return <NativeModal transparent visible={visible}><View style={styles.overlay}><Card><Text style={styles.heading}>{title}</Text>{children}</Card></View></NativeModal>;
}

export function BottomSheet({ visible, children }: PropsWithChildren<{ visible: boolean }>) {
  return <NativeModal transparent visible={visible}><View style={styles.sheetOverlay}><SafeAreaView edges={['bottom', 'left', 'right']} style={styles.sheet}>{children}</SafeAreaView></View></NativeModal>;
}

export const Modal = Dialog;

export function ScreenScroll({ children }: PropsWithChildren) {
  return <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  container: { backgroundColor: colors.background, flex: 1, paddingHorizontal: spacing.screen },
  surface: { ...shadows.none, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.bodySemiBold, color: colors.foreground },
  divider: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.lg, minHeight: 48, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  buttonPressed: { backgroundColor: colors.secondary },
  buttonText: { ...typography.action, color: colors.primaryForeground },
  disabled: { opacity: 0.45 },
  input: { ...typography.body, backgroundColor: colors.muted, borderColor: colors.border, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, color: colors.foreground, minHeight: 48, paddingHorizontal: spacing.md },
  focused: { borderColor: colors.primary },
  avatar: { alignItems: 'center', backgroundColor: colors.avatarDefault, borderRadius: radius.md, height: 40, justifyContent: 'center', width: 40 },
  avatarText: { ...typography.bodySemiBold, color: colors.foreground },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.muted, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  success: { backgroundColor: colors.primarySoft },
  error: { backgroundColor: colors.destructiveSoft },
  badgeText: { ...typography.micro, color: colors.foreground },
  chip: { borderColor: colors.border, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.mutedForeground },
  selectedText: { color: colors.primaryForeground },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  heading: { ...typography.title, color: colors.foreground },
  listItem: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  grow: { flex: 1, gap: spacing.xs },
  listTitle: { ...typography.bodySemiBold, color: colors.foreground },
  muted: { ...typography.caption, color: colors.mutedForeground },
  loading: { alignItems: 'center', gap: spacing.sm, padding: spacing.xxl },
  toast: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md },
  overlay: { backgroundColor: colors.overlay, flex: 1, justifyContent: 'center', padding: spacing.screen },
  sheetOverlay: { backgroundColor: colors.overlay, flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, gap: spacing.md, padding: spacing.screen },
  scroll: { gap: spacing.lg, paddingBottom: spacing.screen, paddingHorizontal: spacing.screen },
});

export const textStyle = {
  muted: styles.muted,
  body: typography.body,
  bodyMedium: typography.bodyMedium,
  amount: typography.amount,
} satisfies Record<string, TextStyleProps>;
