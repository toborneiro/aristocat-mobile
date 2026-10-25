import { act, renderHook } from '@testing-library/react-native';

const mockGoogleLogin = jest.fn();
const mockPromptAsync = jest.fn();
const mockSignIn = jest.fn();
const mockUseIdTokenAuthRequest = jest.fn();

jest.mock('expo-auth-session/providers/google', () => ({
  useIdTokenAuthRequest: (...arguments_: unknown[]) => mockUseIdTokenAuthRequest(...arguments_),
}));
jest.mock('expo-web-browser', () => ({ maybeCompleteAuthSession: jest.fn() }));
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('../../config/env', () => ({
  env: { apiBaseUrl: 'http://localhost:3000', googleWebClientId: 'google-web-client-id' },
}));
jest.mock('./auth-api', () => ({
  AuthApi: jest.fn().mockImplementation(() => ({ googleLogin: mockGoogleLogin })),
}));
jest.mock('./auth-session', () => ({ useAuthSession: () => ({ signIn: mockSignIn }) }));

import { useGoogleAuthentication } from './use-google-authentication.web';

describe('useGoogleAuthentication on web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIdTokenAuthRequest.mockReturnValue([{}, null, mockPromptAsync]);
  });

  it('sends the Google ID token returned by the browser flow to the existing session endpoint', async () => {
    const session = {
      user: { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresIn: 900,
      },
    };
    mockPromptAsync.mockResolvedValue({ type: 'success', params: { id_token: 'google-id-token' } });
    mockGoogleLogin.mockResolvedValue(session);

    const { result } = renderHook(() => useGoogleAuthentication());

    await act(async () => {
      await expect(result.current.authenticate()).resolves.toEqual({ status: 'authenticated' });
    });

    expect(mockGoogleLogin).toHaveBeenCalledWith('google-id-token');
    expect(mockSignIn).toHaveBeenCalledWith(session);
  });
});
