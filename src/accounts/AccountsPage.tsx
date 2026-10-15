import { Link } from 'react-router';
import { isOperator, useUser } from '../shared/auth';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { useAccounts } from './api';
import { OpenAccountForm } from './OpenAccountForm';

export function AccountsPage() {
  const user = useUser();
  const operator = isOperator(user);

  return (
    <div className="page">
      <header className="page-header">
        <h1>{operator ? 'All accounts' : 'Your accounts'}</h1>
        <p className="lede">
          No balance is stored anywhere. Each one is folded from the account’s events and kept in a read model built for
          this list.
        </p>
      </header>
      <div className={operator ? undefined : 'split'}>
        <AccountList />
        {!operator && (
          <aside className="panel">
            <OpenAccountForm />
          </aside>
        )}
      </div>
    </div>
  );
}

function AccountList() {
  const accounts = useAccounts();

  if (accounts.isPending) {
    return <p className="muted">Loading accounts…</p>;
  }
  if (accounts.isError) {
    return <ErrorMessage error={accounts.error} />;
  }
  if (accounts.data.length === 0) {
    return <p className="empty">Your checking account is being opened. It shows up here in a moment.</p>;
  }

  return (
    <ul className="account-list" aria-label="Accounts">
      {accounts.data.map((account) => (
        <li key={account.id}>
          <Link to={`/accounts/${account.id}`} className="account-row">
            <span className="account-holder">
              {account.currency} account
              <span className="account-number">
                {account.branch}/{account.number}, {account.holder}
              </span>
            </span>
            <span className={`status status-${account.status.toLowerCase()}`}>{account.status}</span>
            <span className="account-version">
              {account.version} {account.version === 1 ? 'event' : 'events'}
            </span>
            <span className="amount">{formatMoney(account.balance, account.currency)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
