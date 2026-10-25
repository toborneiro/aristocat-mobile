import { StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../../theme/tokens';

export function AuthErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" style={styles.message}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  message: {
    ...typography.caption,
    color: colors.destructive,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
