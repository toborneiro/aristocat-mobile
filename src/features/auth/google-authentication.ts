import { type AuthApi, type AuthSession } from './auth-api';
import { getAuthErrorMessage } from './auth-error-message';

export type GoogleAuthenticationResult =
  | Readonly<{ status: 'authenticated' }>
  | Readonly<{ status: 'cancelled'; message: string }>
  | Readonly<{ status: 'error'; message: string }>;

type GoogleAuthenticationDependencies = Readonly<{
  api: Pick<AuthApi, 'googleLogin'>;
  getIdToken: () => Promise<string | null>;
  googleConfigured: boolean;
  navigateToAuthenticatedArea: () => void;
  signIn: (session: AuthSession) => Promise<void>;
}>;

export async function authenticateWithGoogle(
  dependencies: GoogleAuthenticationDependencies,
): Promise<GoogleAuthenticationResult> {
  if (!dependencies.googleConfigured) {
    return { status: 'error', message: 'O login com Google ainda não está configurado.' };
  }
  try {
    const idToken = await dependencies.getIdToken();
    if (!idToken) return { status: 'cancelled', message: 'O login com Google foi cancelado.' };
    await dependencies.signIn(await dependencies.api.googleLogin(idToken));
    dependencies.navigateToAuthenticatedArea();
    return { status: 'authenticated' };
  } catch (cause) {
    return { status: 'error', message: getAuthErrorMessage(cause) };
  }
}
