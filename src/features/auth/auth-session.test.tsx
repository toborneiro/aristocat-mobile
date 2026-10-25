import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Button, Text } from 'react-native';

jest.mock('./auth-api', () => ({
  AuthApi: jest.fn(),
}));
jest.mock('./refresh-token-storage', () => ({
  deleteRefreshToken: jest.fn(),
  discardInvalidRefreshToken: jest.fn(),
  getRefreshToken: jest.fn(),
  saveRefreshToken: jest.fn(),
  shouldRefreshWithoutStoredToken: jest.fn(() => false),
}));

import { AuthApi, type AuthSession } from './auth-api';
import { AuthSessionProvider, useAuthSession } from './auth-session';
import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from './refresh-token-storage';

const mockAuthApi = jest.mocked(AuthApi);
const mockDeleteRefreshToken = jest.mocked(deleteRefreshToken);
const mockGetRefreshToken = jest.mocked(getRefreshToken);
const mockSaveRefreshToken = jest.mocked(saveRefreshToken);
const mockRefresh = jest.fn();
const mockLogout = jest.fn();

const session: AuthSession = {
  user: { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
  tokens: { accessToken: 'access-token', refreshToken: 'refresh-token', accessTokenExpiresIn: 900 },
};

function AuthConsumer() {
  const { accessToken, signIn, signOut, status } = useAuthSession();

  return (
    <>
      <Text testID="auth-status">{status}</Text>
      <Text testID="access-token">{accessToken ?? 'none'}</Text>
      <Button title="sign-in" onPress={() => void signIn(session)} />
      <Button title="sign-out" onPress={() => void signOut()} />
    </>
  );
}

describe('AuthSessionProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthApi.mockImplementation(() => ({ logout: mockLogout, refresh: mockRefresh }) as never);
    mockGetRefreshToken.mockResolvedValue(null);
    mockLogout.mockResolvedValue(undefined);
  });

  it('stores the Aristocat refresh token and exposes AUTHENTICATED after Google session success', async () => {
    render(
      <AuthSessionProvider>
        <AuthConsumer />
      </AuthSessionProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('auth-status')).toHaveTextContent('UNAUTHENTICATED'),
    );
    fireEvent.press(screen.getByRole('button', { name: 'sign-in' }));

    await waitFor(() =>
      expect(screen.getByTestId('auth-status')).toHaveTextContent('AUTHENTICATED'),
    );
    expect(screen.getByTestId('access-token')).toHaveTextContent('access-token');
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-token');
  });

  it('restores and logs out the same session independently of the login provider', async () => {
    mockGetRefreshToken.mockResolvedValue('previous-refresh-token');
    mockRefresh.mockResolvedValue(session);
    render(
      <AuthSessionProvider>
        <AuthConsumer />
      </AuthSessionProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('auth-status')).toHaveTextContent('AUTHENTICATED'),
    );
    expect(mockRefresh).toHaveBeenCalledWith('previous-refresh-token');

    fireEvent.press(screen.getByRole('button', { name: 'sign-out' }));

    await waitFor(() =>
      expect(screen.getByTestId('auth-status')).toHaveTextContent('UNAUTHENTICATED'),
    );
    expect(mockDeleteRefreshToken).toHaveBeenCalledTimes(1);
  });
});
