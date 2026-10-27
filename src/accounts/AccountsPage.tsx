import { Link } from 'react-router';
import { isOperator, useUser } from '../shared/auth';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { useAccounts } from './api';
import { OpenAccountForm } from './OpenAccountForm';

export function AccountsPage() {
  const user = useUser();
  const operator = isOperator(user);
  const { t } = useLocale();

  return (
    <div className="page">
      <header className="page-header">
        <h1>{operator ? t.accounts.allTitle : t.accounts.yourTitle}</h1>
        <p className="lede">{t.accounts.lede}</p>
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
  const { locale, t } = useLocale();

  if (accounts.isPending) {
    return <p className="muted">{t.accounts.loading}</p>;
  }
  if (accounts.isError) {
    return <ErrorMessage error={accounts.error} />;
  }
  if (accounts.data.length === 0) {
    return <p className="empty">{t.accounts.empty}</p>;
  }

  return (
    <ul className="account-list" aria-label={t.accounts.listLabel}>
      {accounts.data.map((account) => (
        <li key={account.id}>
          <Link to={`/accounts/${account.id}`} className="account-row">
            <span className="account-holder">
              {t.accounts.currencyAccount(account.currency)}
              <span className="account-number">
                {account.branch}/{account.number}, {account.holder}
              </span>
            </span>
            <span className={`status status-${account.status.toLowerCase()}`}>
              {t.statuses[account.status] ?? account.status}
            </span>
            <span className="account-version">{t.accounts.eventCount(account.version)}</span>
            <span className="amount">{formatMoney(account.balance, account.currency, locale)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
