import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export const registrationFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Informe seu nome.')
      .max(120, 'Informe um nome com até 120 caracteres.'),
    email: z
      .string()
      .trim()
      .email('Informe um e-mail válido.')
      .max(320, 'Informe um e-mail válido.'),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'A senha deve ter entre 12 e 128 caracteres.')
      .max(PASSWORD_MAX_LENGTH, 'A senha deve ter entre 12 e 128 caracteres.'),
    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirmation'],
  });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
