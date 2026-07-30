const fallbackApiBaseUrl = 'http://localhost:3000';

export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackApiBaseUrl
} as const;
