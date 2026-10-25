import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '../../features/auth/auth-session';

export default function ProtectedLayout() {
  const { status } = useAuthSession();
  if (status === 'LOADING') return null;
  if (status !== 'AUTHENTICATED') return <Redirect href="/auth" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
