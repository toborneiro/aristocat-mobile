import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { SafeScreen } from '../../components/ui';
import { blur, colors, componentSize, layoutOffset } from '../../theme/tokens';

const glowStart = { x: 0.5, y: 0.5 };
const glowEnd = { x: 1, y: 1 };

export function AuthScreenLayout({ children }: PropsWithChildren) {
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
      {children}
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
});
