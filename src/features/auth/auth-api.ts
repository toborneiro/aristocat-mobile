export type AuthUser = Readonly<{
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}>;
export type AuthSession = Readonly<{
  user: AuthUser;
  tokens: Readonly<{
    accessToken: string;
    refreshToken?: string;
    accessTokenExpiresIn: number;
  }>;
}>;

export type RegistrationInput = Readonly<{ name: string; email: string; password: string }>;

export class AuthApiError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = 'AuthApiError';
  }
}

export class AuthApi {
  constructor(
    private readonly baseUrl: string,
    private readonly developmentWebRefreshTokenStorage = false,
  ) {}

  async googleLogin(idToken: string): Promise<AuthSession> {
    return this.post('/auth/google', { idToken });
  }

  async register(input: RegistrationInput): Promise<AuthSession> {
    return this.post('/auth/register', input);
  }

  async refresh(refreshToken?: string): Promise<AuthSession> {
    return this.post('/auth/refresh', refreshToken ? { refreshToken } : {});
  }

  async logout(accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    });
    if (!response.ok) throw new AuthApiError(await this.errorCode(response));
  }

  private async post(path: string, body: object): Promise<AuthSession> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers(),
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new AuthApiError(await this.errorCode(response));
    return (await response.json()) as AuthSession;
  }

  private async errorCode(response: Response): Promise<string> {
    try {
      const payload: unknown = await response.json();
      return this.codeFrom(payload);
    } catch {
      return 'ERR_SYS_UNKNOWN';
    }
  }

  private codeFrom(payload: unknown): string {
    if (!payload || typeof payload !== 'object' || !('code' in payload)) return 'ERR_SYS_UNKNOWN';
    return typeof payload.code === 'string' ? payload.code : 'ERR_SYS_UNKNOWN';
  }

  private headers(): Record<string, string> {
    return this.developmentWebRefreshTokenStorage
      ? { 'content-type': 'application/json', 'x-aristocat-refresh-storage': 'session' }
      : { 'content-type': 'application/json' };
  }
}
