import { ErrorMessage } from '../shared/ErrorMessage';
import { describeReason, formatMoney, formatSigned, formatTime } from '../shared/format';
import { type AccountTransaction } from '../shared/types';
import { useTransactions } from './api';

const descriptions: Record<string, string> = {
  Deposit: 'Deposit',
  Withdrawal: 'Withdrawal',
  TransferOut: 'Transfer sent',
  TransferIn: 'Transfer received',
  TransferRefund: 'Transfer refunded',
  TransferOutDeclined: 'Transfer declined',
  TransferInDeclined: 'Incoming transfer declined',
  CardPurchase: 'Card purchase',
  CardPurchaseDeclined: 'Card purchase declined',
};

function describe(transaction: AccountTransaction): string {
  const label = descriptions[transaction.kind] ?? transaction.kind;
  const withDescription = transaction.description ? `${label}, ${transaction.description}` : label;
  return transaction.detail ? `${withDescription}: ${describeReason(transaction.detail)}` : withDescription;
}

export function Statement({ accountId, currency }: { accountId: string; currency: string }) {
  const transactions = useTransactions(accountId);

  return (
    <section className="panel side side-read" aria-labelledby="statement-title">
      <header className="side-header">
        <h2 id="statement-title">Statement</h2>
        <span className="side-tag">Read model</span>
      </header>
      <p className="side-note">A table projected from the events, shaped for reading. Disposable and rebuildable.</p>
      <ErrorMessage error={transactions.error} />
      {transactions.data?.length === 0 && <p className="empty">No money has moved yet.</p>}
      {transactions.data && transactions.data.length > 0 && (
        <div className="table-scroll">
          <table className="statement">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">What</th>
                <th scope="col" className="numeric">
                  Amount
                </th>
                <th scope="col" className="numeric">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.data.map((transaction) => (
                <tr key={transaction.eventId} className={transaction.detail ? 'declined' : undefined}>
                  <td className="muted when">{formatTime(transaction.occurredAt)}</td>
                  <td>{describe(transaction)}</td>
                  <td className="numeric amount">{formatSigned(transaction.amount, currency)}</td>
                  <td className="numeric">{formatMoney(transaction.balanceAfter, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
