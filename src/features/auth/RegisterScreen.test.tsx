import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { RegisterScreen } from './RegisterScreen';

jest.mock('./GoogleAuthButton', () => ({ GoogleAuthButton: () => null }));

describe('RegisterScreen', () => {
  beforeEach(() => {
    (router.push as jest.Mock).mockReset();
    (router.replace as jest.Mock).mockReset();
  });

  it('renders the registration options and navigates to the manual form', () => {
    render(<RegisterScreen />);

    expect(screen.getByText('Criar conta')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cadastrar com dados' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Já tenho uma conta' })).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Cadastrar com dados' }));

    expect(router.push).toHaveBeenCalledWith('/register/manual');
  });

  it('returns to login without stacking another login screen', () => {
    render(<RegisterScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Já tenho uma conta' }));

    expect(router.replace).toHaveBeenCalledWith('/auth');
  });
});
