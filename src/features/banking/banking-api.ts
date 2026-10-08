export type BankConnectionStatus =
  | 'CREATED'
  | 'CONNECTING'
  | 'WAITING_USER_INPUT'
  | 'WAITING_USER_ACTION'
  | 'SYNCING'
  | 'ACTIVE'
  | 'ERROR'
  | 'DISCONNECTED';

export type BankConnection = Readonly<{
  id: string;
  externalConnectionId: string;
  ownershipType: 'PERSONAL' | 'BUSINESS';
  institutionName: string | null;
  connectorId: number | null;
  status: BankConnectionStatus;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type BankInstitution = Readonly<{
  id: number;
  name: string;
  imageUrl: string;
  type: 'PERSONAL_BANK';
  isOpenFinance: boolean;
  isSandbox: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'UNSTABLE';
}>;

export type BankAccount = Readonly<{
  id: string;
  connectionId: string;
  name: string;
  type: string;
  subtype: string;
  currency: string;
  numberMasked: string | null;
  branch: string | null;
  balance: string | null;
  balanceUpdatedAt: string | null;
}>;

type ApiErrorPayload = Readonly<{ code?: string; status?: number }>;

export class BankingApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
  ) {
    super(code);
  }
}

export type AccessTokenProvider = () => Promise<string | null> | string | null;

export class BankingApi {
  constructor(
    private readonly baseUrl: string,
    private readonly getAccessToken: AccessTokenProvider,
  ) {}

  createConnectToken(): Promise<Readonly<{ accessToken: string }>> {
    return this.request('/banking/connect-token', { method: 'POST' });
  }

  listInstitutions(): Promise<BankInstitution[]> {
    return this.request('/banking/institutions');
  }

  listConnections(): Promise<BankConnection[]> {
    return this.request('/banking/connections');
  }

  getConnection(connectionId: string): Promise<BankConnection> {
    return this.request(`/banking/connections/${encodeURIComponent(connectionId)}`);
  }

  createConnection(itemId: string): Promise<BankConnection> {
    return this.request('/banking/connections', {
      body: JSON.stringify({ itemId }),
      method: 'POST',
    });
  }

  requestSync(connectionId: string): Promise<BankConnection> {
    return this.request(`/banking/connections/${encodeURIComponent(connectionId)}/sync`, {
      method: 'POST',
    });
  }

  listAccounts(): Promise<BankAccount[]> {
    return this.request('/banking/accounts');
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(this.url(path), {
      ...init,
      headers: await this.headers(init),
    });
    return this.readResponse<T>(response);
  }

  private async headers(init: RequestInit) {
    const accessToken = await this.getAccessToken();
    if (!accessToken) throw new BankingApiError('ERR_AUTH_005', 401);
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    };
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }

  private async readResponse<T>(response: Response): Promise<T> {
    if (response.ok) return (await response.json()) as T;

    const payload = (await this.tryJson(response)) as ApiErrorPayload | null;
    throw new BankingApiError(payload?.code ?? 'ERR_SYS_001', response.status);
  }

  private async tryJson(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
}

export const isPollingStatus = (status: BankConnectionStatus): boolean =>
  status === 'CONNECTING' ||
  status === 'SYNCING' ||
  status === 'WAITING_USER_INPUT' ||
  status === 'WAITING_USER_ACTION';
