import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';

import { spacing } from '../theme/tokens';
import { AppBottomNavigation } from './AppBottomNavigation';
import { SafeScreen } from './ui';

export function AppScreenLayout({
  children,
  contentContainerStyle,
}: PropsWithChildren<{ contentContainerStyle?: StyleProp<ViewStyle> }>) {
  return (
    <SafeScreen style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]}>
        {children}
      </ScrollView>
      <AppBottomNavigation />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: spacing.md, padding: spacing.screen },
});
