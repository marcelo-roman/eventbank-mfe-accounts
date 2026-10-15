export interface CommandResult {
  id: string;
  version: number;
}

export type AccountStatus = 'Open' | 'Closed';

export interface AccountSummary {
  id: string;
  ownerId: string;
  holder: string;
  branch: string;
  number: string;
  currency: string;
  balance: number;
  status: AccountStatus;
  version: number;
  openedAt: string;
  updatedAt: string;
}

export interface AccountTransaction {
  eventId: string;
  version: number;
  kind: string;
  amount: number;
  balanceAfter: number;
  transferId: string | null;
  description: string | null;
  detail: string | null;
  occurredAt: string;
}

export interface AccountState {
  id: string;
  holder: string;
  currency: string;
  balance: number;
  status: AccountStatus;
  version: number;
}

export interface StoredEvent {
  eventId: string;
  version: number;
  globalPosition: number;
  type: string;
  data: Record<string, unknown>;
  recordedAt: string;
}
