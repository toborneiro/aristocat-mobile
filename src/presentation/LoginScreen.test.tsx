import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { LoginScreen } from './LoginScreen';

jest.mock('../features/auth/GoogleAuthButton', () => ({ GoogleAuthButton: () => null }));

describe('LoginScreen', () => {
  it('navigates to registration from the secondary CTA', () => {
    const mockPush = router.push as jest.Mock;
    mockPush.mockReset();
    render(<LoginScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Criar nova conta' }));

    expect(mockPush).toHaveBeenCalledWith('/register');
  });
});
