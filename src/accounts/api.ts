import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { findOrNull, get, post } from '../shared/api';
import { waitForReadModel } from '../shared/consistency';
import {
  type AccountState,
  type AccountSummary,
  type AccountTransaction,
  type CommandResult,
  type StoredEvent,
} from '../shared/types';

export const accountKeys = {
  all: ['accounts'] as const,
  detail: (id: string) => ['accounts', id] as const,
  transactions: (id: string) => ['accounts', id, 'transactions'] as const,
  events: (id: string) => ['accounts', id, 'events'] as const,
  state: (id: string, version: number) => ['accounts', id, 'state', version] as const,
};

export function useAccounts() {
  return useQuery({ queryKey: accountKeys.all, queryFn: () => get<AccountSummary[]>('/accounts') });
}

export function useAccount(id: string) {
  return useQuery({ queryKey: accountKeys.detail(id), queryFn: () => get<AccountSummary>(`/accounts/${id}`) });
}

export function useTransactions(id: string) {
  return useQuery({
    queryKey: accountKeys.transactions(id),
    queryFn: () => get<AccountTransaction[]>(`/accounts/${id}/transactions`),
  });
}

export function useAccountEvents(id: string) {
  return useQuery({ queryKey: accountKeys.events(id), queryFn: () => get<StoredEvent[]>(`/accounts/${id}/events`) });
}

export function useAccountState(id: string, version: number) {
  return useQuery({
    queryKey: accountKeys.state(id, version),
    queryFn: () => get<AccountState>(`/accounts/${id}/state?version=${version}`),
    enabled: version > 0,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}

function readSummary(id: string) {
  return () => findOrNull<AccountSummary>(`/accounts/${id}`);
}

export function useOpenAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { holder: string; currency: string }) => {
      const result = await post<CommandResult>('/accounts', input);
      const catchUp = await waitForReadModel(readSummary(result.id), result.version);
      return { result, catchUp };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  });
}

export type AccountAction = 'deposits' | 'withdrawals' | 'close';

export function useAccountCommand(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ action, amount }: { action: AccountAction; amount?: number }) => {
      const body = action === 'close' ? undefined : { amount };
      const result = await post<CommandResult>(`/accounts/${id}/${action}`, body);
      return waitForReadModel(readSummary(id), result.version);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  });
}
