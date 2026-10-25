import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { Icon } from '../../components/Icon';
import { colors, iconSize, radius, shadows, spacing, typography } from '../../theme/tokens';
import { AuthErrorMessage } from './AuthErrorMessage';
import { AuthScreenLayout } from './AuthScreenLayout';
import { AuthTextInput, PasswordInput } from './AuthTextInput';
import { registrationFormSchema, type RegistrationFormValues } from './registration-form';
import { useManualRegistration } from './use-manual-registration';

export function RegisterFormScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: { name: '', email: '', password: '', passwordConfirmation: '' },
    resolver: zodResolver(registrationFormSchema),
  });
  const { error, state, submit } = useManualRegistration();
  const loading = state === 'loading';

  const submitForm = (values: RegistrationFormValues) =>
    submit({ name: values.name.trim(), email: values.email.trim(), password: values.password });

  return (
    <AuthScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityLabel="Voltar para criar conta"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon name="back" size={iconSize.navigation} />
            <Text style={styles.backText}>Criar conta</Text>
          </Pressable>

          <View style={styles.headingBlock}>
            <Text style={styles.title}>Cadastrar com dados</Text>
            <Text style={styles.subtitle}>Informe seus dados para criar sua conta.</Text>
          </View>

          <View style={styles.fields}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onBlur, onChange, value } }) => (
                <AuthTextInput
                  autoComplete="name"
                  error={errors.name?.message}
                  label="Nome"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <AuthTextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  error={errors.email?.message}
                  keyboardType="email-address"
                  label="E-mail"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <PasswordInput
                  error={errors.password?.message}
                  label="Senha"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="passwordConfirmation"
              render={({ field: { onBlur, onChange, value } }) => (
                <PasswordInput
                  error={errors.passwordConfirmation?.message}
                  label="Confirmar senha"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <AuthErrorMessage message={error} />
          {state === 'success' ? (
            <Text style={styles.success}>Conta criada. Entrando...</Text>
          ) : null}

          <Pressable
            accessibilityLabel="Criar conta"
            accessibilityRole="button"
            accessibilityState={{ busy: loading, disabled: loading }}
            disabled={loading}
            onPress={handleSubmit(submitForm)}
            testID="register-submit"
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !loading && styles.submitPressed,
              loading && styles.submitDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.submitText}>Criar conta</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityLabel="Já tenho uma conta"
            accessibilityRole="button"
            onPress={() => router.replace('/auth')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>Já tenho uma conta</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  backText: { ...typography.bodyMedium, color: colors.mutedForeground },
  headingBlock: { marginBottom: spacing.xxl, marginTop: spacing.xxl },
  title: { ...typography.welcome, color: colors.foreground, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.mutedForeground },
  fields: { gap: spacing.lg },
  submitButton: {
    ...shadows.loginPrimary,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  submitPressed: { backgroundColor: colors.secondary },
  submitDisabled: { opacity: 0.55 },
  submitText: { ...typography.action, color: colors.primaryForeground },
  success: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  loginLink: { alignItems: 'center', marginTop: spacing.xl, paddingVertical: spacing.sm },
  loginText: { ...typography.bodyMedium, color: colors.primary },
});
