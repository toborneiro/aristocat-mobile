import type { TextStyle, ViewStyle } from 'react-native';

// Valores extraídos de src/styles/theme.css e src/app/App.tsx do Figma Make.
export const colors = {
  transparent: 'rgba(0,0,0,0)',
  canvas: '#040810',
  background: '#080E1D',
  foreground: '#F0F4FF',
  surface: '#0F1729',
  secondary: '#1A2540',
  secondaryForeground: '#B8C4E0',
  muted: '#162035',
  mutedSoft: 'rgba(22,32,53,0.60)',
  mutedForeground: '#6B7FA8',
  accent: '#1E3A5F',
  accentForeground: '#F0F4FF',
  primary: '#22D68A',
  primaryForeground: '#040A14',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  border: 'rgba(255,255,255,0.08)',
  overlay: 'rgba(0,0,0,0.60)',
  primarySoft: 'rgba(34,214,138,0.10)',
  primarySubtle: 'rgba(34,214,138,0.15)',
  primaryHalo: 'rgba(34,214,138,0.05)',
  primaryBorder: 'rgba(34,214,138,0.20)',
  primaryHoverBorder: 'rgba(34,214,138,0.40)',
  destructiveSubtle: 'rgba(239,68,68,0.10)',
  destructiveBorder: 'rgba(239,68,68,0.20)',
  chartGrid: 'rgba(255,255,255,0.04)',
  chartGridStrong: 'rgba(255,255,255,0.05)',
  destructiveSoft: 'rgba(239,68,68,0.15)',
  indigo: '#6366F1',
  indigoSoft: 'rgba(99,102,241,0.08)',
  socialFacebook: '#1877F2',
  googleYellow: '#FFC107',
  googleRed: '#FF3D00',
  googleGreen: '#4CAF50',
  googleBlue: '#1976D2',
  warning: '#F59E0B',
  avatarDefault: '#A78BFA',
  // Aliases de compatibilidade para os componentes existentes.
  text: '#F0F4FF',
  surfaceMuted: '#162035',
  danger: '#EF4444',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  compact: 6,
  sm: 8,
  md: 12,
  row: 14,
  lg: 16,
  xl: 20,
  screen: 24,
  xxl: 32,
  xxxl: 40,
  hero: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const borderWidth = {
  thin: 1,
  thick: 2,
} as const;

export const blur = {
  twoXl: 40,
  threeXl: 64,
} as const;

export const componentSize = {
  accountChipAvatar: 20,
  accountAvatar: 36,
  shortcutIcon: 36,
  settingsIcon: 32,
  backButton: 36,
  transactionIcon: 40,
  balanceHalo: 128,
  balanceGlow: 128 + blur.twoXl * 2,
  investmentHalo: 160,
  investmentGlow: 160 + blur.threeXl * 2,
  assetIcon: 40,
  chartHeight: 120,
  chartDot: 6,
  chartStroke: 2.5,
  historyChartHeight: 210,
  historyChartDot: 8,
  legendDot: 12,
  loginTopOrb: 288,
  loginTopGlow: 288 + blur.threeXl * 2,
  loginBottomOrb: 208,
  loginBottomGlow: 208 + blur.threeXl * 2,
  loginBrandIcon: 64,
  loginProviderIcon: 36,
} as const;

export const layoutOffset = {
  loginTopOrb: -80,
  loginBottomOrb: 80,
  loginRightOrb: -40,
} as const;

export const opacity = {
  transparent: 0,
  accountFill: 0.125,
  accountBorder: 0.25,
  chartGradientStart: 0.3,
} as const;

export const letterSpacing = {
  widest: 1,
  amountTight: -0.75,
  brandTight: -0.6,
} as const;

export const motion = {
  chartRevealDuration: 520,
} as const;

export function withOpacity(hex: string, value: number) {
  const normalized = hex.replace('#', '');

  if (!/^[\dA-Fa-f]{6}$/.test(normalized)) return hex;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${value})`;
}

export const fontFamily = {
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
  jakartaSemiBold: 'PlusJakartaSans_600SemiBold',
  jakartaBold: 'PlusJakartaSans_700Bold',
  jakartaExtraBold: 'PlusJakartaSans_800ExtraBold',
  monoRegular: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemiBold: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const fontSize = {
  initial: 8,
  navigation: 9,
  micro: 10,
  small: 11,
  caption: 12,
  body: 14,
  action: 16,
  title: 18,
  brand: 24,
  display: 30,
} as const;

export const typography = {
  initial: { fontFamily: fontFamily.interBold, fontSize: fontSize.initial },
  navigation: { fontFamily: fontFamily.interMedium, fontSize: fontSize.navigation },
  micro: { fontFamily: fontFamily.interSemiBold, fontSize: fontSize.micro },
  smallBold: { fontFamily: fontFamily.interBold, fontSize: fontSize.small },
  small: { fontFamily: fontFamily.interRegular, fontSize: fontSize.small },
  caption: { fontFamily: fontFamily.interRegular, fontSize: fontSize.caption },
  captionMedium: { fontFamily: fontFamily.interMedium, fontSize: fontSize.caption },
  captionSemiBold: { fontFamily: fontFamily.interSemiBold, fontSize: fontSize.caption },
  body: { fontFamily: fontFamily.interRegular, fontSize: fontSize.body },
  bodyMedium: { fontFamily: fontFamily.interMedium, fontSize: fontSize.body },
  bodySemiBold: { fontFamily: fontFamily.interSemiBold, fontSize: fontSize.body },
  action: { fontFamily: fontFamily.interSemiBold, fontSize: fontSize.action },
  title: { fontFamily: fontFamily.jakartaBold, fontSize: fontSize.title },
  brand: { fontFamily: fontFamily.jakartaBold, fontSize: fontSize.brand },
  welcome: {
    fontFamily: fontFamily.jakartaExtraBold,
    fontSize: fontSize.display,
    lineHeight: 37.5,
  },
  amount: { fontFamily: fontFamily.monoBold, fontSize: fontSize.display },
  amountMedium: { fontFamily: fontFamily.monoBold, fontSize: fontSize.title },
  amountAction: { fontFamily: fontFamily.monoBold, fontSize: fontSize.action },
  amountSmall: { fontFamily: fontFamily.monoSemiBold, fontSize: fontSize.body },
  amountSmallBold: { fontFamily: fontFamily.monoBold, fontSize: fontSize.body },
} as const satisfies Record<string, TextStyle>;

export const iconSize = {
  trend: 11,
  chip: 12,
  metric: 14,
  settings: 15,
  chevron: 16,
  navigation: 18,
  action: 18,
  notification: 20,
  brand: 30,
  social: 20,
} as const;

// Cards internos do Figma Make não declaram sombra. Não convertemos shadow-lg/xl
// do CSS para elevação nativa sem uma medição de frame estruturada.
export const shadows = {
  none: { elevation: 0, shadowOpacity: 0 } as ViewStyle,
  loginBrand: {
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  } as ViewStyle,
  loginPrimary: {
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  } as ViewStyle,
} as const;

export const tokens = {
  colors,
  spacing,
  radius,
  borderWidth,
  blur,
  componentSize,
  layoutOffset,
  opacity,
  letterSpacing,
  motion,
  fontFamily,
  fontSize,
  typography,
  iconSize,
  shadows,
} as const;
