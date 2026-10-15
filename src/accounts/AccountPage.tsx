import { Link, useParams } from 'react-router';
import { useUser } from '../shared/auth';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { useAccount } from './api';
import { EventStream } from './EventStream';
import { MoneyActions } from './MoneyActions';
import { Statement } from './Statement';

export function AccountPage() {
  const { accountId = '' } = useParams();
  const user = useUser();
  const account = useAccount(accountId);

  if (account.isPending) {
    return <p className="page muted">Loading account…</p>;
  }
  if (account.isError) {
    return (
      <div className="page">
        <ErrorMessage error={account.error} />
        <Link to="/accounts">Back to accounts</Link>
      </div>
    );
  }

  const { holder, balance, currency, status, version, branch, number, ownerId } = account.data;
  const isOwner = ownerId === user.id;
  return (
    <div className="page">
      <Link to="/accounts" className="back">
        Accounts
      </Link>
      <header className="account-header">
        <div>
          <h1>{holder}</h1>
          <p className="muted">
            <span className={`status status-${status.toLowerCase()}`}>{status}</span> {currency} account {branch}/
            {number}, version {version}
          </p>
        </div>
        <p className="balance" aria-label="Balance">
          {formatMoney(balance, currency)}
        </p>
      </header>
      {isOwner ? (
        <MoneyActions account={account.data} />
      ) : (
        <p className="muted actions-closed">
          You are viewing this account as an operator. Only its owner can move money.
        </p>
      )}
      <div className="sides">
        <Statement accountId={accountId} currency={currency} />
        <EventStream accountId={accountId} currency={currency} />
      </div>
    </div>
  );
}
