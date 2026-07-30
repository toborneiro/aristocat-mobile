export const resources = {
  'pt-BR': {
    translation: {
      bootstrap: { loading: 'Preparando o aplicativo…', ready: 'Fundação mobile pronta.', error: 'Não foi possível iniciar o aplicativo.', retry: 'Tentar novamente', continue: 'Abrir exemplo técnico' },
      form: { label: 'Identificador de demonstração', submit: 'Validar', success: 'Entrada válida.', required: 'Informe ao menos 3 caracteres.' },
      errors: { ERR_SYS_001: 'Ocorreu uma falha inesperada. Tente novamente.', ERR_VALIDATION_001: 'Verifique os dados informados.', ERR_SYS_UNKNOWN: 'Não foi possível concluir a operação. Tente novamente.' }
    }
  },
  en: {
    translation: {
      bootstrap: { loading: 'Preparing the app…', ready: 'Mobile foundation is ready.', error: 'The app could not start.', retry: 'Try again', continue: 'Open technical example' },
      form: { label: 'Demonstration identifier', submit: 'Validate', success: 'Valid input.', required: 'Enter at least 3 characters.' },
      errors: { ERR_SYS_001: 'An unexpected failure occurred. Please try again.', ERR_VALIDATION_001: 'Check the provided information.', ERR_SYS_UNKNOWN: 'The operation could not be completed. Please try again.' }
    }
  }
} as const;
