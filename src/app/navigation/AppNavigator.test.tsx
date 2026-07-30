import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppProviders } from '../providers/AppProviders';
import { AppNavigator } from './AppNavigator';

describe('AppNavigator', () => {
  it('renders the bootstrap screen and navigates to the technical form', () => {
    render(<AppProviders><AppNavigator /></AppProviders>);
    expect(screen.getByText('Fundação mobile pronta.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Abrir exemplo técnico' }));
    expect(screen.getByText('Identificador de demonstração')).toBeTruthy();
  });
});
