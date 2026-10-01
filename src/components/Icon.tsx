import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { colors, iconSize } from '../theme/tokens';

const materialIcon = {
  home: 'home-variant-outline',
  statement: 'file-document-outline',
  investments: 'chart-pie-outline',
  charts: 'trending-up',
  trendingDown: 'trending-down',
  settings: 'cog-outline',
  profile: 'account-circle-outline',
  account: 'account-circle-outline',
  back: 'chevron-left',
  down: 'chevron-down',
  right: 'chevron-right',
  close: 'close',
  bell: 'bell-outline',
  wallet: 'wallet-outline',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  link: 'link-variant',
  bank: 'bank-outline',
  credit: 'arrow-down-left',
  debit: 'arrow-up-right',
  support: 'help-circle-outline',
  security: 'shield-outline',
  logout: 'logout',
  check: 'check-circle-outline',
  google: 'google',
  facebook: 'facebook',
} as const;

export type AppIconName = keyof typeof materialIcon;

type IconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function Icon({
  name,
  size = iconSize.action,
  color = colors.mutedForeground,
  accessibilityLabel,
}: IconProps) {
  return (
    <MaterialCommunityIcons
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
      color={color}
      name={materialIcon[name]}
      size={size}
    />
  );
}
