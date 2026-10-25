import { fireEvent, render, screen } from '@testing-library/react-native';

import { GoogleAuthButton } from './GoogleAuthButton';

const mockAuthenticate = jest.fn();

jest.mock('./use-google-authentication', () => ({
  useGoogleAuthentication: () => ({ authenticate: mockAuthenticate, loading: false }),
}));
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Path: 'Path',
}));

describe('GoogleAuthButton', () => {
  beforeEach(() => {
    mockAuthenticate.mockReset();
  });

  it('shows a friendly cancellation message without navigating away', async () => {
    mockAuthenticate.mockResolvedValue({
      status: 'cancelled',
      message: 'O login com Google foi cancelado.',
    });
    render(<GoogleAuthButton />);

    fireEvent.press(screen.getByRole('button', { name: 'Continuar com Google' }));

    expect(await screen.findByText('O login com Google foi cancelado.')).toBeTruthy();
  });

  it('ignores a second press while authentication is in flight', () => {
    let resolveAuthentication: (value: { status: 'authenticated' }) => void;
    mockAuthenticate.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAuthentication = resolve;
        }),
    );
    render(<GoogleAuthButton />);

    const button = screen.getByRole('button', { name: 'Continuar com Google' });
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockAuthenticate).toHaveBeenCalledTimes(1);
    resolveAuthentication!({ status: 'authenticated' });
  });
});
