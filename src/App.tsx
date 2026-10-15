import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { AccountPage } from './accounts/AccountPage';
import { AccountsPage } from './accounts/AccountsPage';
import { configureApi } from './shared/api';
import { type RemoteProps, UserContext } from './shared/auth';
import styles from './styles.css?inline';

export default function App({ auth }: RemoteProps) {
  const [queryClient] = useState(() => {
    configureApi(auth.getAccessToken);
    return new QueryClient({ defaultOptions: { queries: { retry: 1 } } });
  });

  return (
    <UserContext value={auth.user}>
      <QueryClientProvider client={queryClient}>
        <style>{styles}</style>
        <Routes>
          <Route index element={<AccountsPage />} />
          <Route path=":accountId" element={<AccountPage />} />
        </Routes>
      </QueryClientProvider>
    </UserContext>
  );
}
