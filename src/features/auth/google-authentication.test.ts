import { AuthApiError, type AuthSession } from './auth-api';
import { authenticateWithGoogle } from './google-authentication';

const session: AuthSession = {
  user: { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
  tokens: { accessToken: 'access-token', refreshToken: 'refresh-token', accessTokenExpiresIn: 900 },
};

describe('authenticateWithGoogle', () => {
  it('does not request a token when Google Sign-In is not configured', async () => {
    const getIdToken = jest.fn();
    const googleLogin = jest.fn();
    const signIn = jest.fn();
    const navigateToAuthenticatedArea = jest.fn();

    await expect(
      authenticateWithGoogle({
        api: { googleLogin },
        getIdToken,
        googleConfigured: false,
        navigateToAuthenticatedArea,
        signIn,
      }),
    ).resolves.toEqual({
      status: 'error',
      message: 'O login com Google ainda não está configurado.',
    });

    expect(getIdToken).not.toHaveBeenCalled();
    expect(googleLogin).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
    expect(navigateToAuthenticatedArea).not.toHaveBeenCalled();
  });

  it('uses the existing Google endpoint and shared authenticated session', async () => {
    const googleLogin = jest.fn().mockResolvedValue(session);
    const signIn = jest.fn().mockResolvedValue(undefined);
    const navigateToAuthenticatedArea = jest.fn();

    await expect(
      authenticateWithGoogle({
        api: { googleLogin },
        getIdToken: jest.fn().mockResolvedValue('google-id-token'),
        googleConfigured: true,
        navigateToAuthenticatedArea,
        signIn,
      }),
    ).resolves.toEqual({ status: 'authenticated' });

    expect(googleLogin).toHaveBeenCalledWith('google-id-token');
    expect(signIn).toHaveBeenCalledWith(session);
    expect(navigateToAuthenticatedArea).toHaveBeenCalledTimes(1);
  });

  it('keeps the user on the registration flow when Google Sign-In is cancelled', async () => {
    const googleLogin = jest.fn();
    const signIn = jest.fn();
    const navigateToAuthenticatedArea = jest.fn();

    await expect(
      authenticateWithGoogle({
        api: { googleLogin },
        getIdToken: jest.fn().mockResolvedValue(null),
        googleConfigured: true,
        navigateToAuthenticatedArea,
        signIn,
      }),
    ).resolves.toEqual({
      status: 'cancelled',
      message: 'O login com Google foi cancelado.',
    });

    expect(googleLogin).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
    expect(navigateToAuthenticatedArea).not.toHaveBeenCalled();
  });

  it('returns a friendly error without creating a session when Google Sign-In fails', async () => {
    const googleLogin = jest.fn();
    const signIn = jest.fn();
    const navigateToAuthenticatedArea = jest.fn();

    await expect(
      authenticateWithGoogle({
        api: { googleLogin },
        getIdToken: jest.fn().mockRejectedValue(new Error('GOOGLE_NATIVE_FAILURE')),
        googleConfigured: true,
        navigateToAuthenticatedArea,
        signIn,
      }),
    ).resolves.toEqual({
      status: 'error',
      message: 'Não foi possível conectar. Verifique sua internet e tente novamente.',
    });

    expect(googleLogin).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
    expect(navigateToAuthenticatedArea).not.toHaveBeenCalled();
  });

  it('translates a backend error without persisting a session or navigating', async () => {
    const googleLogin = jest.fn().mockRejectedValue(new AuthApiError('ERR_AUTH_006'));
    const signIn = jest.fn();
    const navigateToAuthenticatedArea = jest.fn();

    await expect(
      authenticateWithGoogle({
        api: { googleLogin },
        getIdToken: jest.fn().mockResolvedValue('google-id-token'),
        googleConfigured: true,
        navigateToAuthenticatedArea,
        signIn,
      }),
    ).resolves.toEqual({
      status: 'error',
      message: 'Não foi possível validar sua conta do Google. Tente novamente.',
    });

    expect(signIn).not.toHaveBeenCalled();
    expect(navigateToAuthenticatedArea).not.toHaveBeenCalled();
  });
});
