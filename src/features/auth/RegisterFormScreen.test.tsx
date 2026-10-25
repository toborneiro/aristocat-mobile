import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import { AuthApi, AuthApiError } from './auth-api';
import { RegisterFormScreen } from './RegisterFormScreen';

const mockRegister = jest.spyOn(AuthApi.prototype, 'register');
const mockSignIn = jest.fn();

jest.mock('./auth-session', () => ({ useAuthSession: () => ({ signIn: mockSignIn }) }));

const session = {
  user: { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
  tokens: { accessToken: 'access-token', refreshToken: 'refresh-token', accessTokenExpiresIn: 900 },
};

function renderScreen() {
  return render(<RegisterFormScreen />);
}

function fillValidForm() {
  fireEvent.changeText(screen.getByLabelText('Nome'), 'Ana');
  fireEvent.changeText(screen.getByLabelText('E-mail'), 'ana@example.com');
  fireEvent.changeText(screen.getByLabelText('Senha'), 'a-strong-password');
  fireEvent.changeText(screen.getByLabelText('Confirmar senha'), 'a-strong-password');
}

describe('RegisterFormScreen', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockSignIn.mockReset();
    (router.replace as jest.Mock).mockReset();
  });

  it('validates required fields before submitting', async () => {
    renderScreen();

    fireEvent.press(screen.getByTestId('register-submit'));

    expect(await screen.findByText('Informe seu nome.')).toBeTruthy();
    expect(screen.getByText('Informe um e-mail válido.')).toBeTruthy();
    expect(screen.getByText('A senha deve ter entre 12 e 128 caracteres.')).toBeTruthy();
  });

  it('does not submit when the password confirmation differs', async () => {
    renderScreen();
    fillValidForm();
    fireEvent.changeText(screen.getByLabelText('Confirmar senha'), 'other-password');

    fireEvent.press(screen.getByTestId('register-submit'));

    expect(await screen.findByText('As senhas não coincidem.')).toBeTruthy();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('creates the session and enters the protected area after manual registration', async () => {
    mockRegister.mockResolvedValue(session);
    mockSignIn.mockResolvedValue(undefined);
    renderScreen();
    fillValidForm();

    fireEvent.press(screen.getByTestId('register-submit'));

    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Ana',
        email: 'ana@example.com',
        password: 'a-strong-password',
      }),
    );
    expect(mockSignIn).toHaveBeenCalledWith(session);
    expect(router.replace).toHaveBeenCalledWith('/home');
  });

  it('shows a friendly existing-email error', async () => {
    mockRegister.mockRejectedValue(new AuthApiError('ERR_AUTH_002'));
    renderScreen();
    fillValidForm();

    fireEvent.press(screen.getByTestId('register-submit'));

    expect(await screen.findByText('Já existe uma conta com este e-mail.')).toBeTruthy();
  });

  it('allows the user to show and hide the password fields', () => {
    renderScreen();

    fireEvent.press(screen.getAllByRole('button', { name: 'Mostrar senha' })[0]);

    expect(screen.getAllByRole('button', { name: 'Ocultar senha' })).toHaveLength(1);
  });
});
