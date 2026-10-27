import { ErrorMessage } from '../shared/ErrorMessage';
import { describeReason, formatMoney, formatSigned, formatTime } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type Messages } from '../shared/i18n/messages';
import { type AccountTransaction } from '../shared/types';
import { useTransactions } from './api';

function describe(transaction: AccountTransaction, t: Messages): string {
  const label = t.statement.kinds[transaction.kind] ?? transaction.kind;
  const withDescription = transaction.description ? `${label}, ${transaction.description}` : label;
  return transaction.detail ? `${withDescription}: ${describeReason(transaction.detail, t.reasons)}` : withDescription;
}

export function Statement({ accountId, currency }: { accountId: string; currency: string }) {
  const { locale, t } = useLocale();
  const transactions = useTransactions(accountId);

  return (
    <section className="panel side side-read" aria-labelledby="statement-title">
      <header className="side-header">
        <h2 id="statement-title">{t.statement.title}</h2>
        <span className="side-tag">{t.statement.tag}</span>
      </header>
      <p className="side-note">{t.statement.note}</p>
      <ErrorMessage error={transactions.error} />
      {transactions.data?.length === 0 && <p className="empty">{t.statement.empty}</p>}
      {transactions.data && transactions.data.length > 0 && (
        <div className="table-scroll">
          <table className="statement">
            <thead>
              <tr>
                <th scope="col">{t.statement.when}</th>
                <th scope="col">{t.statement.what}</th>
                <th scope="col" className="numeric">
                  {t.statement.amount}
                </th>
                <th scope="col" className="numeric">
                  {t.statement.balance}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.data.map((transaction) => (
                <tr key={transaction.eventId} className={transaction.detail ? 'declined' : undefined}>
                  <td className="muted when">{formatTime(transaction.occurredAt, locale)}</td>
                  <td>{describe(transaction, t)}</td>
                  <td className="numeric amount">{formatSigned(transaction.amount, currency, locale)}</td>
                  <td className="numeric">{formatMoney(transaction.balanceAfter, currency, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
