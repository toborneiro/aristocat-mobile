import { render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() },
  usePathname: () => '/home',
}));
jest.mock('../features/auth/auth-session', () => ({ useAuthSession: jest.fn() }));

import { useAuthSession } from '../features/auth/auth-session';
import { HomeScreen } from './HomeScreen';

const mockUseAuthSession = jest.mocked(useAuthSession);

describe('HomeScreen', () => {
  it('shows the authenticated Google profile name, e-mail and picture', () => {
    mockUseAuthSession.mockReturnValue({
      accessToken: 'access-token',
      loading: false,
      session: {
        user: {
          id: 'user-1',
          name: 'Ana Google',
          email: 'ana@example.com',
          avatarUrl: 'https://lh3.googleusercontent.com/a/example',
        },
        tokens: { accessToken: 'access-token', accessTokenExpiresIn: 900 },
      },
      signIn: jest.fn(),
      signOut: jest.fn(),
      status: 'AUTHENTICATED',
    });

    render(<HomeScreen />);

    expect(screen.getByText('Ana Google')).toBeTruthy();
    expect(screen.getByText('ana@example.com')).toBeTruthy();
    expect(screen.getByLabelText('Foto de perfil de Ana Google')).toBeTruthy();
  });
});
