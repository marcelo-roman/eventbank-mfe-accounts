import { Link, useParams } from 'react-router';
import { useUser } from '../shared/auth';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { useAccount } from './api';
import { EventStream } from './EventStream';
import { MoneyActions } from './MoneyActions';
import { Statement } from './Statement';

export function AccountPage() {
  const { accountId = '' } = useParams();
  const user = useUser();
  const { locale, t } = useLocale();
  const account = useAccount(accountId);

  if (account.isPending) {
    return <p className="page muted">{t.account.loading}</p>;
  }
  if (account.isError) {
    return (
      <div className="page">
        <ErrorMessage error={account.error} />
        <Link to="/accounts">{t.account.backToAccounts}</Link>
      </div>
    );
  }

  const { holder, balance, currency, status, version, branch, number, ownerId } = account.data;
  const isOwner = ownerId === user.id;
  return (
    <div className="page">
      <Link to="/accounts" className="back">
        {t.account.accounts}
      </Link>
      <header className="account-header">
        <div>
          <h1>{holder}</h1>
          <p className="muted">
            <span className={`status status-${status.toLowerCase()}`}>{t.statuses[status] ?? status}</span>{' '}
            {t.account.summary(currency, branch, number, version)}
          </p>
        </div>
        <p className="balance" aria-label={t.account.balance}>
          {formatMoney(balance, currency, locale)}
        </p>
      </header>
      {isOwner ? (
        <MoneyActions account={account.data} />
      ) : (
        <p className="muted actions-closed">{t.account.operatorView}</p>
      )}
      <div className="sides">
        <Statement accountId={accountId} currency={currency} />
        <EventStream accountId={accountId} currency={currency} />
      </div>
    </div>
  );
}
