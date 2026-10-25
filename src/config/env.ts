import { z } from 'zod';

const fallbackApiBaseUrl = 'http://localhost:3000';

const emptyStringToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optionalNonEmptyString = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1).optional(),
);

const environmentSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z
    .string()
    .trim()
    .url()
    .refine((value) => value.startsWith('http://') || value.startsWith('https://'))
    .default(fallbackApiBaseUrl),
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: optionalNonEmptyString,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: optionalNonEmptyString,
  EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME: optionalNonEmptyString,
  EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE: z.enum(['true', 'false']).default('false'),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error('Invalid mobile environment configuration.');
}

export const env = {
  apiBaseUrl: parsedEnvironment.data.EXPO_PUBLIC_API_BASE_URL,
  googleWebClientId: parsedEnvironment.data.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  googleIosClientId: parsedEnvironment.data.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  googleIosUrlScheme: parsedEnvironment.data.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
  developmentWebRefreshTokenStorage:
    process.env.NODE_ENV === 'development' &&
    parsedEnvironment.data.EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE === 'true',
} as const;
