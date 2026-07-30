import { i18n } from '../../i18n/i18n';

const fallbackKey = 'errors.ERR_SYS_UNKNOWN';

export function getErrorMessage(code: string): string {
  const key = `errors.${code}`;
  return i18n.exists(key) ? i18n.t(key) : i18n.t(fallbackKey);
}
