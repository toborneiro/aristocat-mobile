import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppProviders } from '../../app/providers/AppProviders';
import { TechnicalFormScreen } from './TechnicalFormScreen';

describe('TechnicalFormScreen', () => {
  it('shows the validation feedback for an invalid technical input', async () => {
    render(<AppProviders><TechnicalFormScreen /></AppProviders>);
    fireEvent.press(screen.getByRole('button', { name: 'Validar' }));
    expect(await screen.findByText('Informe ao menos 3 caracteres.')).toBeTruthy();
  });
});
