import { getErrorMessage } from '../../services/api/get-error-message';
import { AuthApiError } from './auth-api';

export function getAuthErrorMessage(cause: unknown): string {
  if (cause instanceof AuthApiError) return getErrorMessage(cause.code);
  return getErrorMessage('ERR_NETWORK_001');
}
