import { type SyntheticEvent, useState } from 'react';
import { CatchUpNote } from '../shared/CatchUpNote';
import { ErrorMessage } from '../shared/ErrorMessage';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type AccountSummary } from '../shared/types';
import { type AccountAction, useAccountCommand } from './api';

export function MoneyActions({ account }: { account: AccountSummary }) {
  const { t } = useLocale();
  const [amount, setAmount] = useState('');
  const command = useAccountCommand(account.id);
  const closed = account.status === 'Closed';

  const run = (action: AccountAction) => (event?: SyntheticEvent) => {
    event?.preventDefault();
    command.mutate(action === 'close' ? { action } : { action, amount: Number(amount) }, {
      onSuccess: () => {
        setAmount('');
      },
    });
  };

  if (closed) {
    return <p className="muted actions-closed">{t.actions.closed}</p>;
  }

  return (
    <form className="actions" onSubmit={run('deposits')}>
      <label className="field field-inline">
        <span>{t.actions.amountIn(account.currency)}</span>
        <input
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          required
        />
      </label>
      <button type="submit" className="button primary" disabled={command.isPending}>
        {t.actions.deposit}
      </button>
      <button type="button" className="button" disabled={command.isPending || !amount} onClick={run('withdrawals')}>
        {t.actions.withdraw}
      </button>
      <button
        type="button"
        className="button quiet"
        disabled={command.isPending || account.balance !== 0}
        title={account.balance === 0 ? undefined : t.actions.closeNeedsZero}
        onClick={run('close')}
      >
        {t.actions.close}
      </button>
      <div className="actions-feedback">
        <ErrorMessage error={command.error} />
        {command.isSuccess && <CatchUpNote catchUp={command.data} />}
      </div>
    </form>
  );
}
