import * as SecureStore from 'expo-secure-store';

import {
  discardInvalidRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from './refresh-token-storage';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const deleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);
const getItemAsync = jest.mocked(SecureStore.getItemAsync);
const setItemAsync = jest.mocked(SecureStore.setItemAsync);

describe('refresh-token-storage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('stores the refresh token using the fixed secure-store key', async () => {
    await saveRefreshToken('refresh-token');

    expect(setItemAsync).toHaveBeenCalledWith('aristocat.refresh-token', 'refresh-token');
  });

  it('reads the refresh token using the fixed secure-store key', async () => {
    getItemAsync.mockResolvedValueOnce('refresh-token');

    await expect(getRefreshToken()).resolves.toBe('refresh-token');
    expect(getItemAsync).toHaveBeenCalledWith('aristocat.refresh-token');
  });

  it('contains a native SecureStore deletion mismatch during session recovery', async () => {
    deleteItemAsync.mockRejectedValueOnce(
      new TypeError('ExpoSecureStore.default.deleteValueWithKeyAsync is not a function'),
    );

    await expect(discardInvalidRefreshToken()).resolves.toBe(false);
  });
});
