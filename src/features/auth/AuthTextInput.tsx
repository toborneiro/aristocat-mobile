import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import { Icon } from '../../components/Icon';
import { borderWidth, colors, iconSize, radius, spacing, typography } from '../../theme/tokens';

type AuthTextInputProps = Readonly<{
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'name' | 'new-password';
  error?: string | undefined;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  trailing?: ReactNode;
  value: string;
}>;

export function AuthTextInput({
  autoCapitalize = 'sentences',
  autoComplete,
  error,
  keyboardType,
  label,
  onBlur,
  onChangeText,
  secureTextEntry,
  trailing,
  value,
}: AuthTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.focused, Boolean(error) && styles.invalid]}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={label}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
        {trailing}
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

type PasswordInputProps = Omit<AuthTextInputProps, 'secureTextEntry' | 'trailing'>;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const actionLabel = visible ? 'Ocultar senha' : 'Mostrar senha';

  return (
    <AuthTextInput
      {...props}
      autoCapitalize="none"
      autoComplete="new-password"
      secureTextEntry={!visible}
      trailing={
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={() => setVisible((current) => !current)}
          style={styles.visibilityButton}
        >
          <Icon
            color={colors.mutedForeground}
            name={visible ? 'eyeOff' : 'eye'}
            size={iconSize.action}
          />
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  label: { ...typography.bodyMedium, color: colors.foreground, marginBottom: spacing.xs },
  field: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    minHeight: 48,
    paddingLeft: spacing.md,
  },
  focused: { borderColor: colors.primary },
  invalid: { borderColor: colors.destructive },
  input: { ...typography.body, color: colors.foreground, flex: 1, minHeight: 48 },
  visibilityButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  error: { ...typography.caption, color: colors.destructive, marginTop: spacing.xs },
});
