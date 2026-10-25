import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '../../components/Icon';
import {
  borderWidth,
  colors,
  componentSize,
  iconSize,
  radius,
  spacing,
  typography,
} from '../../theme/tokens';
import { AuthErrorMessage } from './AuthErrorMessage';
import { useGoogleAuthentication } from './use-google-authentication';

export function GoogleAuthButton() {
  const { authenticate, loading, ready = true } = useGoogleAuthentication();
  const [feedback, setFeedback] = useState<string | null>(null);
  const authenticationInFlight = useRef(false);
  const disabled = isAuthenticationDisabled(loading, ready);

  const handlePress = async () => {
    if (authenticationInFlight.current) return;
    authenticationInFlight.current = true;
    setFeedback(null);
    try {
      const result = await authenticate();
      if (result.status !== 'authenticated') setFeedback(result.message);
    } finally {
      authenticationInFlight.current = false;
    }
  };

  return (
    <View>
      <Pressable
        accessibilityLabel="Continuar com Google"
        accessibilityRole="button"
        accessibilityState={{ busy: loading, disabled }}
        disabled={disabled}
        onPress={() => void handlePress()}
        style={({ pressed }) => getButtonStyle(pressed, disabled)}
      >
        <View style={styles.icon}>
          <GoogleMark />
        </View>
        <Text style={styles.label}>
          {loading ? 'Conectando com Google...' : 'Continuar com Google'}
        </Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Icon name="right" size={iconSize.chevron} />
        )}
      </Pressable>
      <AuthErrorMessage message={feedback} />
    </View>
  );
}

function isAuthenticationDisabled(loading: boolean, ready: boolean): boolean {
  return loading || !ready;
}

function getButtonStyle(pressed: boolean, disabled: boolean) {
  return [styles.button, pressed && !disabled && styles.pressed, disabled && styles.disabled];
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  pressed: { backgroundColor: colors.secondary },
  disabled: { opacity: 0.55 },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.destructiveForeground,
    borderRadius: radius.pill,
    height: componentSize.loginProviderIcon,
    justifyContent: 'center',
    width: componentSize.loginProviderIcon,
  },
  label: { ...typography.bodyMedium, color: colors.foreground, flex: 1 },
});

function GoogleMark() {
  return (
    <Svg height={iconSize.social} viewBox="0 0 48 48" width={iconSize.social}>
      <Path
        d="M44.5 20H24v8.5h11.7C34.4 33.7 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.2 0 6.1 1.2 8.4 3.1l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z"
        fill={colors.googleYellow}
      />
      <Path
        d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.2 0 6.1 1.2 8.4 3.1l6-6C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 11.7z"
        fill={colors.googleRed}
      />
      <Path
        d="M24 45c5.5 0 10.5-2.1 14.2-5.4l-6.5-5.5C29.7 35.6 27 36.8 24 36.8c-5.6 0-10.4-3.7-12.2-8.8l-6.6 5.1C8.9 41 15.9 45 24 45z"
        fill={colors.googleGreen}
      />
      <Path
        d="M44.5 20H24v8.5h11.7c-.9 3-3.1 5.5-6 7l6.5 5.5C40.6 37.5 44.5 31.3 44.5 24c0-1.4-.2-2.7-.5-4z"
        fill={colors.googleBlue}
      />
    </Svg>
  );
}
