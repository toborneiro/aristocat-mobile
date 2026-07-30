import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import type { PropsWithChildren } from 'react';

import { i18n } from '../../i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 }
  }
});

export function AppProviders({ children }: PropsWithChildren) {
  return <I18nextProvider i18n={i18n}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></I18nextProvider>;
}
