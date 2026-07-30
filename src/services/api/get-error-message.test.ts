import { i18n } from '../../i18n/i18n';
import { getErrorMessage } from './get-error-message';

describe('getErrorMessage', () => {
  afterEach(async () => { await i18n.changeLanguage('pt-BR'); });

  it('translates a known static code in the selected language', async () => {
    await i18n.changeLanguage('en');
    expect(getErrorMessage('ERR_SYS_001')).toBe('An unexpected failure occurred. Please try again.');
  });

  it('uses the generic fallback for an unknown code', () => {
    expect(getErrorMessage('ERR_ANY_999')).toBe('Não foi possível concluir a operação. Tente novamente.');
  });
});
