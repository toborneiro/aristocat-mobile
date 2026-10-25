import { AuthApi } from './auth-api';

const session = {
  user: { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
  tokens: { accessToken: 'access-token', refreshToken: 'refresh-token', accessTokenExpiresIn: 900 },
};

describe('AuthApi', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('registers with the contract payload and returns the authenticated session', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(session) });
    const api = new AuthApi('https://api.example.com');

    await expect(
      api.register({ name: 'Ana', email: 'ana@example.com', password: 'a-strong-password' }),
    ).resolves.toEqual(session);

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: 'Ana',
        email: 'ana@example.com',
        password: 'a-strong-password',
      }),
    });
  });

  it('exposes only the static backend error code', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ code: 'ERR_AUTH_002', status: 409 }),
    });
    const api = new AuthApi('https://api.example.com');

    await expect(
      api.register({ name: 'Ana', email: 'ana@example.com', password: 'a-strong-password' }),
    ).rejects.toEqual(expect.objectContaining({ code: 'ERR_AUTH_002' }));
  });

  it('sends the Google ID Token to the shared Google endpoint', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(session) });
    const api = new AuthApi('https://api.example.com');

    await expect(api.googleLogin('google-id-token')).resolves.toEqual(session);

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/auth/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idToken: 'google-id-token' }),
    });
  });

  it('uses the HttpOnly cookie flow for a browser refresh without a stored token', async () => {
    const browserSession = {
      user: { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
      tokens: { accessToken: 'access-token', accessTokenExpiresIn: 900 },
    };
    fetchMock.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(browserSession) });
    const api = new AuthApi('https://api.example.com');

    await expect(api.refresh()).resolves.toEqual(browserSession);

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/auth/refresh', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: '{}',
    });
  });

  it('sends the development-only storage header only when explicitly enabled', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(session) });
    const api = new AuthApi('https://api.example.com', true);

    await api.googleLogin('google-id-token');

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/auth/google', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-aristocat-refresh-storage': 'session',
      },
      credentials: 'include',
      body: JSON.stringify({ idToken: 'google-id-token' }),
    });
  });

  it('sends an authenticated logout request that includes browser cookies', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const api = new AuthApi('https://api.example.com');

    await expect(api.logout('access-token')).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/auth/logout', {
      method: 'POST',
      headers: { authorization: 'Bearer access-token' },
      credentials: 'include',
    });
  });
});
